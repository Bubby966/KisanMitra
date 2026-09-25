import { getAccessToken } from './googleAuth';

export interface DriveFile {
  id: string;
  name: string;
  mimeType: string;
  size?: string;
  createdTime?: string;
  modifiedTime?: string;
  webViewLink?: string;
  webContentLink?: string;
  thumbnailLink?: string;
  iconLink?: string;
  parents?: string[];
  description?: string;
}

export interface DriveStorageQuota {
  limit?: string;
  usage?: string;
  usageInDrive?: string;
  usageInDriveTrash?: string;
}

export interface DriveUserInfo {
  displayName?: string;
  emailAddress?: string;
  photoLink?: string;
  storageQuota?: DriveStorageQuota;
}

const DRIVE_API_BASE = 'https://www.googleapis.com/drive/v3';
const UPLOAD_API_BASE = 'https://www.googleapis.com/upload/drive/v3';
export const AGROVISION_FOLDER_NAME = 'Agrovision Farm Records (అగ్రోవిజన్)';
export const KISAN_FOLDER_NAME = AGROVISION_FOLDER_NAME;

/**
 * Fetch authenticated Google Drive user details and storage quota
 */
export async function fetchDriveUser(): Promise<DriveUserInfo | null> {
  const token = await getAccessToken();
  if (!token) return null;

  const res = await fetch(`${DRIVE_API_BASE}/about?fields=user(displayName,emailAddress,photoLink),storageQuota`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!res.ok) {
    throw new Error(`Failed to fetch Drive user info: ${res.statusText}`);
  }

  const data = await res.json();
  return {
    displayName: data.user?.displayName,
    emailAddress: data.user?.emailAddress,
    photoLink: data.user?.photoLink,
    storageQuota: data.storageQuota,
  };
}

/**
 * Get or create the dedicated Agrovision Farm Records folder in Google Drive
 */
export async function getOrCreateFarmFolder(): Promise<string> {
  const token = await getAccessToken();
  if (!token) throw new Error('Not signed in to Google Drive');

  // Check if folder already exists (Agrovision or legacy KisanMitra)
  const query = encodeURIComponent(`(name = '${AGROVISION_FOLDER_NAME}' or name = 'KisanMitra Farm Records (కిసాన్ మిత్ర)') and mimeType = 'application/vnd.google-apps.folder' and trashed = false`);
  const searchRes = await fetch(`${DRIVE_API_BASE}/files?q=${query}&fields=files(id,name)`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  if (searchRes.ok) {
    const data = await searchRes.json();
    if (data.files && data.files.length > 0) {
      return data.files[0].id;
    }
  }

  // Create folder
  const createRes = await fetch(`${DRIVE_API_BASE}/files`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      name: AGROVISION_FOLDER_NAME,
      mimeType: 'application/vnd.google-apps.folder',
      description: 'Dedicated digital vault for Indian farm records, soil tests, crop diagnostics, and receipts.',
    }),
  });

  if (!createRes.ok) {
    throw new Error(`Failed to create Agrovision folder on Drive: ${createRes.statusText}`);
  }

  const newFolder = await createRes.json();
  return newFolder.id;
}

/**
 * List files from Google Drive, optionally inside the Agrovision folder or matching a query
 */
export async function listDriveFiles(params?: {
  folderId?: string;
  searchQuery?: string;
  onlyKisanFolder?: boolean;
}): Promise<DriveFile[]> {
  const token = await getAccessToken();
  if (!token) throw new Error('Not signed in to Google Drive');

  const conditions: string[] = ['trashed = false'];

  if (params?.onlyKisanFolder && params.folderId) {
    conditions.push(`'${params.folderId}' in parents`);
  }

  if (params?.searchQuery && params.searchQuery.trim()) {
    const qEscaped = params.searchQuery.replace(/'/g, "\\'");
    conditions.push(`(name contains '${qEscaped}' or description contains '${qEscaped}')`);
  }

  const q = encodeURIComponent(conditions.join(' and '));
  const fields = encodeURIComponent('files(id, name, mimeType, size, createdTime, modifiedTime, webViewLink, webContentLink, thumbnailLink, iconLink, parents, description)');
  const url = `${DRIVE_API_BASE}/files?q=${q}&fields=${fields}&orderBy=modifiedTime desc&pageSize=50`;

  const res = await fetch(url, {
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!res.ok) {
    if (res.status === 401) {
      throw new Error('AUTH_EXPIRED');
    }
    throw new Error(`Failed to list Drive files: ${res.statusText}`);
  }

  const data = await res.json();
  return data.files || [];
}

/**
 * Upload a document or image file directly to Google Drive
 */
export async function uploadFileToDrive(
  file: File,
  folderId?: string,
  description?: string
): Promise<DriveFile> {
  const token = await getAccessToken();
  if (!token) throw new Error('Not signed in to Google Drive');

  const metadata: any = {
    name: file.name,
    mimeType: file.type || 'application/octet-stream',
  };

  if (folderId) {
    metadata.parents = [folderId];
  }
  if (description) {
    metadata.description = description;
  }

  const boundary = '-------314159265358979323846';
  const delimiter = `\r\n--${boundary}\r\n`;
  const closeDelimiter = `\r\n--${boundary}--`;

  const fileReader = new FileReader();
  const fileArrayBuffer = await new Promise<ArrayBuffer>((resolve, reject) => {
    fileReader.onload = () => resolve(fileReader.result as ArrayBuffer);
    fileReader.onerror = reject;
    fileReader.readAsArrayBuffer(file);
  });

  const metadataPart = `${delimiter}Content-Type: application/json; charset=UTF-8\r\n\r\n${JSON.stringify(metadata)}\r\n`;
  const mediaHeader = `--${boundary}\r\nContent-Type: ${file.type || 'application/octet-stream'}\r\nContent-Transfer-Encoding: base64\r\n\r\n`;

  // Base64 encode file buffer
  const base64Content = btoa(
    new Uint8Array(fileArrayBuffer).reduce((data, byte) => data + String.fromCharCode(byte), '')
  );

  const multipartBody = `${metadataPart}${mediaHeader}${base64Content}${closeDelimiter}`;

  const res = await fetch(`${UPLOAD_API_BASE}/files?uploadType=multipart&fields=id,name,mimeType,size,webViewLink,webContentLink,createdTime,modifiedTime`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': `multipart/related; boundary=${boundary}`,
    },
    body: multipartBody,
  });

  if (!res.ok) {
    throw new Error(`Upload to Drive failed: ${res.statusText}`);
  }

  return await res.json();
}

/**
 * Export a textual / diagnostic / farm report directly as a file to Google Drive
 */
export async function exportReportToDrive(
  fileName: string,
  content: string,
  folderId?: string,
  categoryDescription?: string
): Promise<DriveFile> {
  const blob = new Blob([content], { type: 'text/markdown;charset=utf-8' });
  const file = new File([blob], fileName, { type: 'text/markdown' });
  return await uploadFileToDrive(file, folderId, categoryDescription);
}

/**
 * Delete a file from Google Drive (Requires explicit confirmation prior to invoking)
 */
export async function deleteDriveFile(fileId: string): Promise<void> {
  const token = await getAccessToken();
  if (!token) throw new Error('Not signed in to Google Drive');

  const res = await fetch(`${DRIVE_API_BASE}/files/${fileId}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!res.ok && res.status !== 204) {
    throw new Error(`Failed to delete file from Drive: ${res.statusText}`);
  }
}
