import React, { useState, useEffect, useRef } from 'react';
import {
  FolderLock,
  UploadCloud,
  FileText,
  Trash2,
  ExternalLink,
  Download,
  Search,
  RefreshCw,
  CheckCircle2,
  AlertTriangle,
  FileSpreadsheet,
  FileImage,
  Folder,
  LogOut,
  Sparkles,
  ShieldCheck,
  Sprout,
  Droplets,
  FlaskConical,
  HardDrive
} from 'lucide-react';
import { GoogleSignInButton } from './GoogleSignInButton';
import {
  initAuth,
  googleSignIn,
  logout,
  getCurrentUser,
  getAccessToken,
  subscribeAuth,
} from '../services/googleAuth';
import {
  DriveFile,
  DriveUserInfo,
  fetchDriveUser,
  getOrCreateFarmFolder,
  listDriveFiles,
  uploadFileToDrive,
  exportReportToDrive,
  deleteDriveFile,
  KISAN_FOLDER_NAME,
} from '../services/googleDrive';
import { FarmerProfile, SoilTelemetry, CropScanResult, Language } from '../types';

interface GoogleDriveViewProps {
  farmerProfile: FarmerProfile;
  soilTelemetry: SoilTelemetry;
  recentScan: CropScanResult | null;
  language: Language;
}

export const GoogleDriveView: React.FC<GoogleDriveViewProps> = ({
  farmerProfile,
  soilTelemetry,
  recentScan,
  language,
}) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isSigningIn, setIsSigningIn] = useState<boolean>(false);
  const [userInfo, setUserInfo] = useState<DriveUserInfo | null>(null);
  const [files, setFiles] = useState<DriveFile[]>([]);
  const [kisanFolderId, setKisanFolderId] = useState<string | null>(null);
  const [isLoadingFiles, setIsLoadingFiles] = useState<boolean>(false);
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'error' | 'info'; text: string } | null>(null);

  // Destructive Confirmation Modal state (MANDATORY per Workspace guidelines)
  const [deleteModalFile, setDeleteModalFile] = useState<DriveFile | null>(null);
  const [isDeleting, setIsDeleting] = useState<boolean>(false);

  // File Upload State
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploadCategory, setUploadCategory] = useState<string>('Soil Health Card');

  // Listen to auth changes
  useEffect(() => {
    const unsubscribe = subscribeAuth(async (user, token) => {
      if (user && token) {
        setIsAuthenticated(true);
        loadDriveData();
      } else {
        setIsAuthenticated(false);
        setUserInfo(null);
        setFiles([]);
      }
    });

    initAuth(
      () => {
        setIsAuthenticated(true);
        loadDriveData();
      },
      () => {
        setIsAuthenticated(false);
      }
    );

    return () => unsubscribe();
  }, []);

  const loadDriveData = async () => {
    setIsLoadingFiles(true);
    try {
      // 1. Fetch user info
      const user = await fetchDriveUser();
      setUserInfo(user);

      // 2. Get or create the dedicated Agrovision folder
      const folderId = await getOrCreateFarmFolder();
      setKisanFolderId(folderId);

      // 3. List files in Drive
      const driveFiles = await listDriveFiles({
        folderId,
        onlyKisanFolder: false,
        searchQuery: searchQuery.trim() ? searchQuery : undefined,
      });
      setFiles(driveFiles);
    } catch (err: any) {
      console.warn('Drive data load notice:', err.message);
      if (err.message === 'AUTH_EXPIRED') {
        setIsAuthenticated(false);
        setStatusMessage({
          type: 'info',
          text: 'Google Drive authorization refreshed. Please sign in to re-connect your drive.',
        });
      }
    } finally {
      setIsLoadingFiles(false);
    }
  };

  const handleSignIn = async () => {
    setIsSigningIn(true);
    setStatusMessage(null);
    try {
      const res = await googleSignIn();
      if (res) {
        setIsAuthenticated(true);
        setStatusMessage({
          type: 'success',
          text: `Successfully connected to Google Drive (${res.user.email})!`,
        });
        await loadDriveData();
      }
    } catch (err: any) {
      console.error('Sign-in error:', err);
      setStatusMessage({
        type: 'error',
        text: err.message || 'Google Drive connection failed. Please verify popup permissions.',
      });
    } finally {
      setIsSigningIn(false);
    }
  };

  const handleSignOut = async () => {
    try {
      await logout();
      setIsAuthenticated(false);
      setUserInfo(null);
      setFiles([]);
      setStatusMessage({
        type: 'info',
        text: 'Signed out of Google Drive.',
      });
    } catch (err: any) {
      console.error('Sign-out error:', err);
    }
  };

  // Upload a local file from disk
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;

    setIsUploading(true);
    setStatusMessage({
      type: 'info',
      text: `Uploading ${selectedFile.name} to Agrovision Google Drive Vault...`,
    });

    try {
      const folderId = kisanFolderId || (await getOrCreateFarmFolder());
      const description = `[Agrovision Tag: ${uploadCategory}] Indian farm record uploaded on ${new Date().toLocaleDateString()}`;
      const uploaded = await uploadFileToDrive(selectedFile, folderId, description);

      setStatusMessage({
        type: 'success',
        text: `Uploaded "${uploaded.name}" directly to your Google Drive!`,
      });
      await loadDriveData();
    } catch (err: any) {
      console.error('Upload error:', err);
      setStatusMessage({
        type: 'error',
        text: `Failed to upload file to Google Drive: ${err.message}`,
      });
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  // 1-Click Backups to Google Drive
  const handleExportSoilTelemetry = async () => {
    setIsUploading(true);
    setStatusMessage({ type: 'info', text: 'Generating and backing up Soil Telemetry report to Google Drive...' });
    try {
      const folderId = kisanFolderId || (await getOrCreateFarmFolder());
      const dateStr = new Date().toISOString().split('T')[0];
      const title = `Agrovision_Soil_Health_${farmerProfile.primaryCrop}_${dateStr}.md`;

      const content = `# Agrovision AI — Field Soil Health & IoT Telemetry Audit
**Farmer Name:** ${farmerProfile.name}
**Phone:** ${farmerProfile.phone}
**Village/District:** ${farmerProfile.village}, ${farmerProfile.district}, ${farmerProfile.state}
**Land Holding:** ${farmerProfile.landSizeAcres} Acres (${farmerProfile.primaryCrop})
**Audit Date:** ${new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })}

---

## 1. IoT Sensor Telemetry
- **Root Zone Soil Moisture:** ${soilTelemetry.moisturePercent}% (Optimal target: 35% - 50%)
- **Soil Temperature:** ${soilTelemetry.soilTempC} °C
- **Ambient Air Temperature:** ${soilTelemetry.airTempC} °C
- **Relative Air Humidity:** ${soilTelemetry.humidityPercent}%
- **Electrical Conductivity (EC):** ${soilTelemetry.ecValue} dS/m (Normal salinity)
- **Sensor Telemetry Timestamp:** ${soilTelemetry.timestamp}

## 2. Soil NPK Nutrient Matrix
- **Available Nitrogen (N):** ${soilTelemetry.nitrogenPpm} PPM
- **Available Phosphorus (P):** ${soilTelemetry.phosphorusPpm} PPM
- **Available Potassium (K):** ${soilTelemetry.potassiumPpm} PPM

## 3. Recommended Irrigation Strategy
${soilTelemetry.recommendation}

---
*Archived automatically into Google Drive via Agrovision AI Krishi Sahayak Platform.*
`;

      const uploaded = await exportReportToDrive(title, content, folderId, '[Agrovision Tag: Soil Health Card]');
      setStatusMessage({
        type: 'success',
        text: `Saved "${uploaded.name}" into your Agrovision Farm Records folder on Google Drive!`,
      });
      await loadDriveData();
    } catch (err: any) {
      console.error('Soil export error:', err);
      setStatusMessage({ type: 'error', text: `Failed to export soil report: ${err.message}` });
    } finally {
      setIsUploading(false);
    }
  };

  const handleExportCropDoctor = async () => {
    if (!recentScan) {
      setStatusMessage({ type: 'error', text: 'No recent Crop Doctor scan to export. Please perform a leaf diagnosis first.' });
      return;
    }

    setIsUploading(true);
    setStatusMessage({ type: 'info', text: 'Archiving Crop Doctor diagnosis into Google Drive...' });
    try {
      const folderId = kisanFolderId || (await getOrCreateFarmFolder());
      const dateStr = new Date().toISOString().split('T')[0];
      const title = `Agrovision_CropDoctor_${recentScan.crop}_${dateStr}.md`;

      const content = `# Agrovision AI — Crop Doctor Pathology & Treatment Prescription
**Patient Crop:** ${recentScan.crop}
**Diagnosis Date:** ${recentScan.timestamp}
**Detected Condition:** ${recentScan.disease}
**Diagnostic Confidence:** ${recentScan.confidence}%
**Severity Rating:** ${recentScan.severity}

---

## Visible Symptoms Observed
${recentScan.symptoms.map((s) => `- ${s}`).join('\n')}

## ICAR Recommended Organic Treatment (Bio-Control)
${recentScan.organicTreatment}

## Standard Chemical Treatment (KVK Agronomy Guidance)
${recentScan.chemicalTreatment}

## Preventive Best Practices
${recentScan.prevention}

## Farmer Local Advisory Summary
${recentScan.simpleExplanation}

---
**Official Disclaimer:**
${recentScan.disclaimer}
`;

      const uploaded = await exportReportToDrive(title, content, folderId, '[Agrovision Tag: Crop Doctor Scans]');
      setStatusMessage({
        type: 'success',
        text: `Saved "${uploaded.name}" into your Google Drive!`,
      });
      await loadDriveData();
    } catch (err: any) {
      console.error('Crop Doctor export error:', err);
      setStatusMessage({ type: 'error', text: `Failed to export diagnostic report: ${err.message}` });
    } finally {
      setIsUploading(false);
    }
  };

  const handleExportFertilizerPlan = async () => {
    setIsUploading(true);
    setStatusMessage({ type: 'info', text: 'Saving Seasonal Fertilizer Schedule to Google Drive...' });
    try {
      const folderId = kisanFolderId || (await getOrCreateFarmFolder());
      const dateStr = new Date().toISOString().split('T')[0];
      const title = `Agrovision_Fertilizer_Schedule_${farmerProfile.primaryCrop}_${dateStr}.md`;

      const content = `# Agrovision AI — Seasonal Fertilizer & Nutrition Schedule
**Farmer:** ${farmerProfile.name} (${farmerProfile.village}, ${farmerProfile.district})
**Crop:** ${farmerProfile.primaryCrop} | **Field Size:** ${farmerProfile.landSizeAcres} Acres
**Soil Classification:** Medium Black Soil | **Season:** Kharif / Rabi

---

## 1. Basal Application (At Final Plowing / Sowing)
- **DAP (Di-Ammonium Phosphate):** 50 kg per acre
- **MOP (Muriate of Potash):** 20 kg per acre
- **Zinc Sulphate (21%):** 10 kg per acre (Corrects Khaira / leaf whitening)

## 2. First Split Top-Dressing (20–25 Days / Active Tillering)
- **Neem-Coated Urea:** 25–30 kg per acre
- Ensure soil is damp (avoid standing flooded water during top dressing).

## 3. Second Split Top-Dressing (40–45 Days / Panicle Initiation)
- **Neem-Coated Urea:** 25 kg per acre
- **MOP (Potash):** 10 kg per acre for grain weight and disease resistance.

## 4. Micronutrient & Foliar Nutrition
- 19:19:19 (NPK Water Soluble) foliar spray @ 5g/Litre water during flowering.
`;

      const uploaded = await exportReportToDrive(title, content, folderId, '[Agrovision Tag: Bills & Subsidies]');
      setStatusMessage({
        type: 'success',
        text: `Saved "${uploaded.name}" into your Google Drive!`,
      });
      await loadDriveData();
    } catch (err: any) {
      console.error('Fertilizer export error:', err);
      setStatusMessage({ type: 'error', text: `Failed to export fertilizer schedule: ${err.message}` });
    } finally {
      setIsUploading(false);
    }
  };

  // Perform Confirmed Deletion (Mandatory explicit confirmation dialog)
  const confirmDeleteFile = async () => {
    if (!deleteModalFile) return;

    setIsDeleting(true);
    try {
      await deleteDriveFile(deleteModalFile.id);
      setStatusMessage({
        type: 'success',
        text: `Successfully deleted "${deleteModalFile.name}" from Google Drive.`,
      });
      setDeleteModalFile(null);
      await loadDriveData();
    } catch (err: any) {
      console.error('Delete error:', err);
      setStatusMessage({
        type: 'error',
        text: `Failed to delete file: ${err.message}`,
      });
    } finally {
      setIsDeleting(false);
    }
  };

  // Filtered files
  const filteredFiles = files.filter((file) => {
    if (filterCategory === 'all') return true;
    if (filterCategory === 'kisan' && kisanFolderId) {
      return file.parents?.includes(kisanFolderId) || file.name.includes('Agrovision') || file.name.includes('KisanMitra');
    }
    if (filterCategory === 'soil') {
      return file.name.toLowerCase().includes('soil') || file.description?.includes('Soil');
    }
    if (filterCategory === 'crop') {
      return file.name.toLowerCase().includes('crop') || file.description?.includes('Crop Doctor');
    }
    if (filterCategory === 'patta') {
      return (
        file.name.toLowerCase().includes('patta') ||
        file.name.toLowerCase().includes('passbook') ||
        file.name.toLowerCase().includes('land')
      );
    }
    return true;
  });

  const formatFileSize = (bytesStr?: string) => {
    if (!bytesStr) return '—';
    const bytes = parseInt(bytesStr, 10);
    if (isNaN(bytes)) return '—';
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const formatStorage = (bytesStr?: string) => {
    if (!bytesStr) return '0 GB';
    const bytes = parseInt(bytesStr, 10);
    if (isNaN(bytes)) return '0 GB';
    return `${(bytes / (1024 * 1024 * 1024)).toFixed(1)} GB`;
  };

  const getFileIcon = (mimeType: string, name: string) => {
    if (mimeType.includes('folder')) return <Folder className="w-5 h-5 text-amber-500" />;
    if (mimeType.includes('pdf')) return <FileText className="w-5 h-5 text-rose-500" />;
    if (mimeType.includes('image')) return <FileImage className="w-5 h-5 text-emerald-600" />;
    if (mimeType.includes('sheet') || mimeType.includes('csv')) return <FileSpreadsheet className="w-5 h-5 text-emerald-700" />;
    return <FileText className="w-5 h-5 text-blue-600" />;
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-emerald-900 via-emerald-800 to-stone-900 text-white rounded-2xl p-6 sm:p-8 shadow-sm relative overflow-hidden">
        <div className="absolute right-0 top-0 translate-x-8 -translate-y-8 w-64 h-64 bg-emerald-700/20 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 bg-emerald-800/80 border border-emerald-600/50 rounded-full px-3 py-1 text-xs font-medium text-emerald-200">
              <FolderLock className="w-3.5 h-3.5 text-emerald-400" />
              <span>Google Drive Cloud Storage for Indian Farmers (రైతు పత్రాల నిధి)</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold font-serif tracking-tight text-white">
              Google Drive Farm Vault & Document Backup
            </h1>
            <p className="text-sm text-emerald-100/80 max-w-2xl">
              Securely store, organize, and auto-backup your Patta Passbooks, Soil Health Cards, AI Crop Doctor diagnosis records, PM-Kisan documents, and fertilizer bills directly to your Google Drive account.
            </p>
          </div>

          {/* Auth Status & Google Sign In */}
          <div className="bg-white/10 backdrop-blur border border-white/20 rounded-xl p-4 min-w-[280px]">
            {isAuthenticated && userInfo ? (
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  {userInfo.photoLink ? (
                    <img
                      src={userInfo.photoLink}
                      alt={userInfo.displayName || 'Google User'}
                      className="w-10 h-10 rounded-full border-2 border-emerald-300 shadow-xs"
                      referrerPolicy="no-referrer"
                    />
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-emerald-600 flex items-center justify-center font-bold text-white">
                      {userInfo.displayName?.[0] || 'F'}
                    </div>
                  )}
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-bold text-white truncate">{userInfo.displayName || 'Connected Farmer'}</p>
                    <p className="text-[11px] text-emerald-200 truncate">{userInfo.emailAddress}</p>
                  </div>
                </div>

                {/* Storage Meter */}
                {userInfo.storageQuota && (
                  <div className="space-y-1 pt-1 border-t border-white/10">
                    <div className="flex justify-between text-[10px] text-emerald-200">
                      <span>Drive Storage</span>
                      <span>
                        {formatStorage(userInfo.storageQuota.usage)} / {formatStorage(userInfo.storageQuota.limit)}
                      </span>
                    </div>
                    <div className="w-full bg-white/20 rounded-full h-1.5 overflow-hidden">
                      <div
                        className="bg-emerald-400 h-full rounded-full transition-all"
                        style={{
                          width: `${Math.min(
                            100,
                            Math.round(
                              (parseInt(userInfo.storageQuota.usage || '0', 10) /
                                parseInt(userInfo.storageQuota.limit || '1', 10)) *
                                100
                            )
                          )}%`,
                        }}
                      />
                    </div>
                  </div>
                )}

                <div className="flex items-center justify-between pt-1">
                  <span className="inline-flex items-center gap-1 text-[11px] text-emerald-300 font-medium">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> Connected
                  </span>
                  <button
                    onClick={handleSignOut}
                    className="inline-flex items-center gap-1 text-[11px] text-stone-300 hover:text-white hover:underline transition cursor-pointer"
                  >
                    <LogOut className="w-3 h-3" /> Sign out
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-2.5 text-center sm:text-left">
                <p className="text-xs font-semibold text-white">Connect Google Drive</p>
                <p className="text-[11px] text-emerald-200/90 leading-relaxed">
                  Sign in with Google to enable automatic cloud backup of your farm health records and documents.
                </p>
                <div className="pt-1">
                  <GoogleSignInButton
                    onClick={handleSignIn}
                    isLoading={isSigningIn}
                    text="Connect Google Drive"
                    size="sm"
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Global Status Message Toast */}
      {statusMessage && (
        <div
          className={`p-4 rounded-xl text-xs flex items-center justify-between gap-3 border animate-in fade-in duration-200 ${
            statusMessage.type === 'success'
              ? 'bg-emerald-50 text-emerald-900 border-emerald-200'
              : statusMessage.type === 'error'
              ? 'bg-rose-50 text-rose-900 border-rose-200'
              : 'bg-blue-50 text-blue-900 border-blue-200'
          }`}
        >
          <div className="flex items-center gap-2">
            {statusMessage.type === 'success' && <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />}
            {statusMessage.type === 'error' && <AlertTriangle className="w-4 h-4 text-rose-600 flex-shrink-0" />}
            {statusMessage.type === 'info' && <RefreshCw className="w-4 h-4 text-blue-600 flex-shrink-0 animate-spin" />}
            <span className="font-medium">{statusMessage.text}</span>
          </div>
          <button
            onClick={() => setStatusMessage(null)}
            className="text-stone-500 hover:text-stone-800 text-sm font-bold px-1 cursor-pointer"
          >
            ✕
          </button>
        </div>
      )}

      {/* When NOT Authenticated: Informative Feature Showcase */}
      {!isAuthenticated && (
        <div className="bg-white border border-stone-200 rounded-2xl p-8 space-y-6 text-center max-w-4xl mx-auto shadow-xs">
          <div className="w-16 h-16 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center mx-auto shadow-xs">
            <HardDrive className="w-8 h-8 text-emerald-700" />
          </div>

          <div className="max-w-xl mx-auto space-y-2">
            <h2 className="text-xl font-bold text-stone-900 font-serif">
              Store Your Agricultural Documents Safely in Google Drive
            </h2>
            <p className="text-xs text-stone-600 leading-relaxed">
              Never lose critical farm documents again. With Google Drive integration, you can automatically backup your agricultural data with full security and zero hassle.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-left pt-2">
            <div className="p-4 rounded-xl bg-stone-50 border border-stone-200/80 space-y-2">
              <div className="w-8 h-8 rounded-lg bg-emerald-700 text-white flex items-center justify-center font-bold text-sm">
                1
              </div>
              <h3 className="text-xs font-bold text-stone-900">Land & Revenue Records</h3>
              <p className="text-[11px] text-stone-600 leading-relaxed">
                Safely store scanned Patta passbooks (పట్టాదారు పాస్ పుస్తకం), RoR 1-B records, and survey maps accessible from any phone.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-stone-50 border border-stone-200/80 space-y-2">
              <div className="w-8 h-8 rounded-lg bg-emerald-700 text-white flex items-center justify-center font-bold text-sm">
                2
              </div>
              <h3 className="text-xs font-bold text-stone-900">Soil Health & Crop Reports</h3>
              <p className="text-[11px] text-stone-600 leading-relaxed">
                Auto-generate and archive KVK laboratory soil test cards and AI Crop Doctor disease diagnoses for insurance claims.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-stone-50 border border-stone-200/80 space-y-2">
              <div className="w-8 h-8 rounded-lg bg-emerald-700 text-white flex items-center justify-center font-bold text-sm">
                3
              </div>
              <h3 className="text-xs font-bold text-stone-900">KCC Loans & Bills</h3>
              <p className="text-[11px] text-stone-600 leading-relaxed">
                Keep bank loan approval slips, PMFBY crop insurance policy receipts, and fertilizer subsidy bills organized in one folder.
              </p>
            </div>
          </div>

          <div className="pt-4 flex flex-col items-center gap-3">
            <GoogleSignInButton
              onClick={handleSignIn}
              isLoading={isSigningIn}
              text="Sign in with Google to Connect Drive"
              size="lg"
            />
            <p className="text-[11px] text-stone-500">
              Agrovision AI accesses only your permitted farm records folder with strict user authorization.
            </p>
          </div>
        </div>
      )}

      {/* When Authenticated: Active Drive Operations Suite */}
      {isAuthenticated && (
        <div className="space-y-6">
          {/* Quick 1-Click Farm Data Backup Actions */}
          <div className="bg-white border border-stone-200 rounded-2xl p-5 shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-stone-100 pb-3">
              <div>
                <h2 className="text-sm font-bold text-stone-900 flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-emerald-600" />
                  1-Click Farm Data Backup to Google Drive
                </h2>
                <p className="text-xs text-stone-500">
                  Instantly archive formatted reports into your dedicated "{KISAN_FOLDER_NAME}" Drive folder.
                </p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={loadDriveData}
                  disabled={isLoadingFiles}
                  className="inline-flex items-center gap-1 text-xs font-medium text-stone-600 hover:text-emerald-800 bg-stone-100 hover:bg-stone-200 px-3 py-1.5 rounded-lg transition cursor-pointer"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${isLoadingFiles ? 'animate-spin' : ''}`} />
                  Refresh
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {/* Soil Telemetry Backup */}
              <div className="p-4 rounded-xl bg-emerald-50/70 border border-emerald-200/80 flex flex-col justify-between gap-3">
                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-emerald-800 font-bold text-xs">
                    <Droplets className="w-4 h-4 text-emerald-600" />
                    Soil & IoT Telemetry
                  </div>
                  <p className="text-[11px] text-stone-600 leading-snug">
                    Current moisture: <strong>{soilTelemetry.moisturePercent}%</strong>. Export full NPK balance and smart irrigation schedule.
                  </p>
                </div>
                <button
                  onClick={handleExportSoilTelemetry}
                  disabled={isUploading}
                  className="w-full bg-emerald-700 hover:bg-emerald-800 active:bg-emerald-900 text-white rounded-lg px-3 py-2 text-xs font-semibold flex items-center justify-center gap-1.5 shadow-xs transition cursor-pointer disabled:opacity-60"
                >
                  <UploadCloud className="w-3.5 h-3.5" />
                  <span>Backup Soil Report</span>
                </button>
              </div>

              {/* Crop Doctor Backup */}
              <div className="p-4 rounded-xl bg-amber-50/70 border border-amber-200/80 flex flex-col justify-between gap-3">
                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-amber-900 font-bold text-xs">
                    <Sprout className="w-4 h-4 text-amber-700" />
                    Crop Doctor Diagnosis
                  </div>
                  <p className="text-[11px] text-stone-600 leading-snug">
                    Latest scan: <strong>{recentScan ? recentScan.crop : 'No scan'}</strong> ({recentScan ? recentScan.disease : 'N/A'}).
                  </p>
                </div>
                <button
                  onClick={handleExportCropDoctor}
                  disabled={isUploading || !recentScan}
                  className="w-full bg-amber-600 hover:bg-amber-700 active:bg-amber-800 text-stone-950 rounded-lg px-3 py-2 text-xs font-bold flex items-center justify-center gap-1.5 shadow-xs transition cursor-pointer disabled:opacity-60"
                >
                  <UploadCloud className="w-3.5 h-3.5" />
                  <span>Backup Diagnosis</span>
                </button>
              </div>

              {/* Fertilizer Advisory Backup */}
              <div className="p-4 rounded-xl bg-blue-50/70 border border-blue-200/80 flex flex-col justify-between gap-3">
                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-blue-900 font-bold text-xs">
                    <FlaskConical className="w-4 h-4 text-blue-700" />
                    Fertilizer Schedule
                  </div>
                  <p className="text-[11px] text-stone-600 leading-snug">
                    Seasonal split-dose advisory for {farmerProfile.primaryCrop} ({farmerProfile.landSizeAcres} Acres).
                  </p>
                </div>
                <button
                  onClick={handleExportFertilizerPlan}
                  disabled={isUploading}
                  className="w-full bg-blue-700 hover:bg-blue-800 active:bg-blue-900 text-white rounded-lg px-3 py-2 text-xs font-semibold flex items-center justify-center gap-1.5 shadow-xs transition cursor-pointer disabled:opacity-60"
                >
                  <UploadCloud className="w-3.5 h-3.5" />
                  <span>Backup Fertilizer Plan</span>
                </button>
              </div>
            </div>

            {/* Custom File Upload Section */}
            <div className="pt-2 border-t border-stone-100 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-xs font-medium text-stone-600">Category Tag:</span>
                <select
                  value={uploadCategory}
                  onChange={(e) => setUploadCategory(e.target.value)}
                  className="text-xs bg-stone-50 border border-stone-300 rounded-lg px-2.5 py-1.5 text-stone-800 focus:ring-1 focus:ring-emerald-500"
                >
                  <option value="Soil Health Card">Soil Health Card (భూసార పత్రం)</option>
                  <option value="Patta Passbook">Patta Passbook / Land Deed (పట్టాదారు పాస్ పుస్తకం)</option>
                  <option value="Crop Insurance Policy">PMFBY Crop Insurance (పంట బీమా)</option>
                  <option value="KCC Loan / Bank">Kisan Credit Card (KCC) Bank Slip</option>
                  <option value="Fertilizer / Seed Invoice">Fertilizer / Seed Bill (రసీదు)</option>
                  <option value="Farm Photo">Field Photo / Harvest Record</option>
                </select>
              </div>

              <div>
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileUpload}
                  className="hidden"
                  id="drive-upload-file-input"
                />
                <button
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isUploading}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-stone-900 hover:bg-stone-800 text-white text-xs font-semibold px-4 py-2 rounded-lg transition shadow-xs cursor-pointer disabled:opacity-60"
                >
                  <UploadCloud className="w-4 h-4 text-emerald-400" />
                  <span>Upload Local File to Google Drive</span>
                </button>
              </div>
            </div>
          </div>

          {/* Drive Records Explorer & Filtered Browser */}
          <div className="bg-white border border-stone-200 rounded-2xl shadow-xs overflow-hidden">
            {/* Filter Bar */}
            <div className="p-4 border-b border-stone-200 bg-stone-50/60 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
              <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0 no-scrollbar">
                {[
                  { id: 'all', label: 'All Files' },
                  { id: 'kisan', label: 'Kisan Vault' },
                  { id: 'soil', label: 'Soil Reports' },
                  { id: 'crop', label: 'Crop Doctor' },
                  { id: 'patta', label: 'Land & Patta' },
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setFilterCategory(tab.id)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer whitespace-nowrap ${
                      filterCategory === tab.id
                        ? 'bg-emerald-700 text-white shadow-xs'
                        : 'bg-white text-stone-700 border border-stone-200 hover:bg-stone-100'
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>

              {/* Live Search */}
              <div className="relative min-w-[240px]">
                <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && loadDriveData()}
                  placeholder="Search file name or tag..."
                  className="w-full text-xs bg-white border border-stone-300 rounded-lg pl-9 pr-3 py-1.5 text-stone-800 placeholder-stone-400 focus:ring-1 focus:ring-emerald-500"
                />
              </div>
            </div>

            {/* Files List Table */}
            {isLoadingFiles ? (
              <div className="p-12 text-center space-y-3">
                <div className="w-8 h-8 border-3 border-emerald-600 border-t-transparent rounded-full animate-spin mx-auto" />
                <p className="text-xs text-stone-500">Retrieving your Google Drive files...</p>
              </div>
            ) : filteredFiles.length === 0 ? (
              <div className="p-12 text-center space-y-3">
                <div className="w-12 h-12 rounded-xl bg-stone-100 text-stone-400 flex items-center justify-center mx-auto">
                  <FolderLock className="w-6 h-6" />
                </div>
                <div className="space-y-1">
                  <p className="text-xs font-bold text-stone-800">No matching files found in your Google Drive</p>
                  <p className="text-[11px] text-stone-500 max-w-sm mx-auto">
                    Click "Backup Soil Report" or "Upload Local File" above to save your first farm record to Google Drive.
                  </p>
                </div>
              </div>
            ) : (
              <div className="divide-y divide-stone-100">
                {filteredFiles.map((file) => (
                  <div
                    key={file.id}
                    className="p-3.5 sm:p-4 hover:bg-stone-50/80 transition flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                  >
                    <div className="flex items-start gap-3 min-w-0 flex-1">
                      <div className="p-2 rounded-lg bg-stone-100 flex-shrink-0 mt-0.5">
                        {getFileIcon(file.mimeType, file.name)}
                      </div>
                      <div className="min-w-0 flex-1 space-y-1">
                        <div className="flex flex-wrap items-center gap-1.5">
                          <h4 className="text-xs font-bold text-stone-900 truncate max-w-md">{file.name}</h4>
                          {(file.description?.includes('[Agrovision Tag:') || file.description?.includes('[KisanMitra Tag:')) && (
                            <span className="bg-emerald-100 text-emerald-800 text-[10px] font-semibold px-2 py-0.5 rounded-full">
                              {file.description.match(/\[(?:Agrovision|KisanMitra) Tag:\s*([^\]]+)\]/)?.[1] || 'Farm Record'}
                            </span>
                          )}
                        </div>
                        <div className="flex flex-wrap items-center gap-3 text-[11px] text-stone-500">
                          <span>Size: {formatFileSize(file.size)}</span>
                          <span>•</span>
                          <span>
                            Modified:{' '}
                            {file.modifiedTime
                              ? new Date(file.modifiedTime).toLocaleDateString('en-IN', {
                                  day: 'numeric',
                                  month: 'short',
                                  year: 'numeric',
                                })
                              : '—'}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* File Actions */}
                    <div className="flex items-center gap-2 self-end sm:self-center">
                      {file.webViewLink && (
                        <a
                          href={file.webViewLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-xs font-medium text-emerald-800 hover:text-emerald-950 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 px-2.5 py-1.5 rounded-lg transition"
                          title="Open directly in Google Drive"
                        >
                          <ExternalLink className="w-3.5 h-3.5 text-emerald-700" />
                          <span>Open in Drive</span>
                        </a>
                      )}

                      {file.webContentLink && (
                        <a
                          href={file.webContentLink}
                          download
                          className="inline-flex items-center gap-1 text-xs font-medium text-stone-700 hover:text-stone-900 bg-stone-100 hover:bg-stone-200 px-2.5 py-1.5 rounded-lg transition"
                          title="Download copy to device"
                        >
                          <Download className="w-3.5 h-3.5 text-stone-600" />
                          <span>Download</span>
                        </a>
                      )}

                      {/* Explicit confirmation trigger for deletion */}
                      <button
                        onClick={() => setDeleteModalFile(file)}
                        className="inline-flex items-center gap-1 text-xs font-medium text-rose-700 hover:text-rose-900 bg-rose-50 hover:bg-rose-100 border border-rose-200 px-2.5 py-1.5 rounded-lg transition cursor-pointer"
                        title="Delete from Google Drive"
                      >
                        <Trash2 className="w-3.5 h-3.5 text-rose-600" />
                        <span className="hidden sm:inline">Delete</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* ----------------------------------------------------
       * MANDATORY USER CONFIRMATION MODAL FOR DESTRUCTIVE OPERATIONS
       * Per Workspace skill instructions:
       * "NEVER execute a destructive or mutating API call without first
       * presenting the user with a clear confirmation dialog that describes
       * exactly what will be changed or deleted."
       * ---------------------------------------------------- */}
      {deleteModalFile && (
        <div className="fixed inset-0 z-50 bg-stone-950/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-stone-200 space-y-4 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-rose-100 text-rose-700 flex items-center justify-center flex-shrink-0">
                <AlertTriangle className="w-5 h-5 text-rose-600" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-stone-900">Delete File from Google Drive?</h3>
                <p className="text-[11px] text-stone-500">Destructive operation requires explicit confirmation</p>
              </div>
            </div>

            <div className="bg-stone-50 border border-stone-200 rounded-xl p-3 space-y-1.5">
              <div className="text-xs font-semibold text-stone-800 break-all">{deleteModalFile.name}</div>
              <div className="text-[11px] text-stone-500">
                Size: {formatFileSize(deleteModalFile.size)} • File ID: {deleteModalFile.id.slice(0, 14)}...
              </div>
            </div>

            <p className="text-xs text-stone-600 leading-relaxed">
              Are you sure you want to permanently delete this farm document from your Google Drive account? This action cannot be undone.
            </p>

            <div className="flex items-center justify-end gap-2.5 pt-2">
              <button
                type="button"
                onClick={() => setDeleteModalFile(null)}
                disabled={isDeleting}
                className="px-4 py-2 rounded-lg text-xs font-semibold text-stone-700 bg-stone-100 hover:bg-stone-200 transition cursor-pointer"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={confirmDeleteFile}
                disabled={isDeleting}
                className="px-4 py-2 rounded-lg text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 active:bg-rose-800 transition flex items-center gap-1.5 shadow-sm shadow-rose-600/30 cursor-pointer disabled:opacity-60"
              >
                {isDeleting ? (
                  <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <Trash2 className="w-3.5 h-3.5" />
                )}
                <span>{isDeleting ? 'Deleting...' : 'Yes, Delete from Drive'}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
