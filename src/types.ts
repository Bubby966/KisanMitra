export type Language = 'te' | 'hi' | 'en' | 'ta' | 'kn' | 'mr' | 'bn' | 'pa' | 'gu';

export type UserRole = 'farmer' | 'customer' | 'admin';

export type CropType =
  | 'Paddy (Rice)'
  | 'Wheat'
  | 'Tomato'
  | 'Cotton'
  | 'Chilli'
  | 'Maize'
  | 'Potato'
  | 'Sugarcane'
  | 'Soybean'
  | 'Onion';

export type SoilType =
  | 'Alluvial Soil'
  | 'Black Cotton Soil'
  | 'Red Sandy Loam'
  | 'Clayey Soil'
  | 'Laterite Soil';

export type GrowthStage =
  | 'Seedling / Nursery'
  | 'Vegetative Stage'
  | 'Tillering / Branching'
  | 'Flowering & Pollination'
  | 'Grain / Fruit Formation'
  | 'Maturity / Ready to Harvest';

export interface CropScanResult {
  id: string;
  crop: string;
  imageUrl?: string;
  timestamp: string;
  disease: string;
  confidence: number;
  severity: 'None' | 'Low' | 'Medium' | 'High';
  symptoms: string[];
  organicTreatment: string;
  chemicalTreatment: string;
  prevention: string;
  simpleExplanation: string;
  disclaimer: string;
}

export interface SoilTelemetry {
  timestamp: string;
  moisturePercent: number;
  soilTempC: number;
  airTempC: number;
  humidityPercent: number;
  status: 'Optimal' | 'Soil is becoming dry' | 'Critical - Irrigation Required' | 'Waterlogged';
  recommendation: string;
  nitrogenPpm: number;
  phosphorusPpm: number;
  potassiumPpm: number;
  ecValue: number; // mS/cm
}

export interface FertilizerRecommendation {
  id: string;
  crop: string;
  soilType: string;
  fieldSizeAcres: number;
  growthStage: string;
  nutrientRequirement: {
    nitrogenKg: number;
    phosphorusKg: number;
    potassiumKg: number;
  };
  recommendedFertilizers: {
    name: string;
    dosage: string;
    stage: string;
    notes: string;
  }[];
  applicationTiming: string[];
  overApplicationWarnings: string[];
  organicSoilHealthSuggestions: string[];
  disclaimer: string;
}

export interface MarketplaceProduct {
  id: string;
  farmerId: string;
  farmerName: string;
  farmerPhone: string;
  village: string;
  district: string;
  state: string;
  location?: string;
  title: string;
  cropName?: string;
  variety?: string;
  category: 'Vegetables' | 'Fruits' | 'Grains' | 'Paddy' | 'Pulses' | 'Spices' | 'Other';
  pricePerUnit: number;
  unit: 'kg' | 'quintal' | 'crate' | 'bag' | 'ton' | string;
  mandiBenchmarkPrice?: number;
  availableQty: number;
  quantityAvailable?: number;
  harvestDate: string;
  isOrganic: boolean;
  imageUrl: string;
  rating: number;
  description: string;
}

export interface OrderItem {
  productId: string;
  productTitle: string;
  pricePerUnit: number;
  unit: string;
  quantity: number;
  farmerName: string;
  imageUrl: string;
}

export interface Order {
  id: string;
  customerName?: string;
  customerPhone?: string;
  buyerName?: string;
  buyerPhone?: string;
  productId?: string;
  productName?: string;
  farmerName?: string;
  farmerPhone?: string;
  quantity?: number;
  unit?: string;
  deliveryAddress: string;
  items?: OrderItem[];
  totalAmount: number;
  status: 'Placed' | 'Packed by Farmer' | 'In Transit' | 'Delivered' | 'Confirmed' | 'Shipped' | 'Processing';
  orderDate: string;
  paymentMethod: 'Cash on Delivery' | 'UPI / NetBanking' | 'COD' | 'UPI' | string;
  trackingNumber?: string;
}

export interface GovScheme {
  id: string;
  name: string;
  title?: string;
  nativeName?: string;
  category: string;
  ministry?: string;
  state: string; // 'All India' or specific state
  purpose: string;
  eligibility: string[];
  benefits: string;
  requiredDocuments: string[];
  documentsRequired?: string[];
  applicationProcess: string[];
  officialUrl: string;
  officialLink?: string;
  farmerTypes: string[]; // 'Small & Marginal', 'All', 'Women Farmers'
  tags: string[];
}

export interface WeatherData {
  location: string;
  state: string;
  tempC: number;
  condition: string;
  humidityPercent: number;
  rainProbabilityPercent: number;
  windSpeedKmH: number;
  uvIndex: number;
  forecast: {
    day: string;
    tempHigh: number;
    tempLow: number;
    condition: string;
    rainProb: number;
  }[];
  farmingAlert: string;
}

export interface UnifiedRecommendation {
  id: string;
  timestamp: string;
  title: string;
  message: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  icon: string;
  category: 'irrigation' | 'disease' | 'fertilizer' | 'market' | 'weather';
  actionPrompt?: string;
  actionRoute?: string;
}

export interface FarmerProfile {
  name: string;
  phone: string;
  village: string;
  district: string;
  state: string;
  landSizeAcres: number;
  primaryCrop: CropType | string;
  secondaryCrop: CropType | string;
  sowingDate: string;
  expectedHarvest: string;
  soilType: SoilType;
  irrigationMethod?: 'Drip Irrigation' | 'Sprinkler' | 'Canal' | 'Tube Well / Borewell' | 'Rainfed' | string;
  irrigationSource?: string;
  kccNumber?: string;
  pmKisanId?: string;
  farmerCategory?: 'Small & Marginal' | 'Medium' | 'Large';
}

export type GovernmentScheme = GovScheme;
