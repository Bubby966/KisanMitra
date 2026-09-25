import {
  FarmerProfile,
  GovScheme,
  MarketplaceProduct,
  Order,
  SoilTelemetry,
  WeatherData,
  CropScanResult,
  UnifiedRecommendation
} from '../types';

export const INITIAL_FARMER_PROFILE: FarmerProfile = {
  name: 'Rama Rao Patel',
  phone: '+91 98480 23456',
  village: 'Duggirala',
  district: 'Guntur',
  state: 'Andhra Pradesh',
  landSizeAcres: 2.5,
  primaryCrop: 'Paddy (Rice)',
  secondaryCrop: 'Tomato',
  sowingDate: '2026-07-15',
  expectedHarvest: '2026-11-20',
  soilType: 'Black Cotton Soil',
  irrigationMethod: 'Drip Irrigation',
  kccNumber: 'KCC-AP-2024-88412'
};

export const SAMPLE_LEAF_IMAGES = [
  {
    id: 'sample-paddy-blast',
    name: 'Paddy Blast (Magnaporthe oryzae)',
    crop: 'Paddy (Rice)',
    url: 'https://images.unsplash.com/photo-1536657464919-892534f60d6e?auto=format&fit=crop&w=800&q=80',
    description: 'Spindle-shaped lesions with gray-white centers and dark brown margins on paddy leaf.'
  },
  {
    id: 'sample-tomato-blight',
    name: 'Tomato Early Blight (Alternaria solani)',
    crop: 'Tomato',
    url: 'https://images.unsplash.com/photo-1592417817098-8f3d6910985c?auto=format&fit=crop&w=800&q=80',
    description: 'Concentric dark target-board rings with surrounding yellow chlorotic halo.'
  },
  {
    id: 'sample-cotton-curl',
    name: 'Cotton Leaf Curl Virus (CLCuV)',
    crop: 'Cotton',
    url: 'https://images.unsplash.com/photo-1605000797499-95a51c5269ae?auto=format&fit=crop&w=800&q=80',
    description: 'Upward curling of leaves and thickened leaf veins transmitted by whiteflies.'
  },
  {
    id: 'sample-chilli-anthracnose',
    name: 'Chilli Anthracnose / Fruit Rot',
    crop: 'Chilli',
    url: 'https://images.unsplash.com/photo-1588252303782-cb80119abd6d?auto=format&fit=crop&w=800&q=80',
    description: 'Sunken circular lesions with concentric rings of dark acervuli spots on green chilli.'
  },
  {
    id: 'sample-wheat-rust',
    name: 'Wheat Yellow/Stripe Rust',
    crop: 'Wheat',
    url: 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?auto=format&fit=crop&w=800&q=80',
    description: 'Linear yellow-orange pustules arranged parallel along leaf blades.'
  }
];

export const INITIAL_CROP_SCANS: CropScanResult[] = [
  {
    id: 'scan-1',
    crop: 'Paddy (Rice)',
    imageUrl: 'https://images.unsplash.com/photo-1536657464919-892534f60d6e?auto=format&fit=crop&w=800&q=80',
    timestamp: '2026-09-19 08:30 AM',
    disease: 'Paddy Leaf Blast (Possible Early Stage)',
    confidence: 91,
    severity: 'Medium',
    symptoms: [
      'Elliptical spindle-shaped spots on leaves',
      'Grayish ash-colored centers with brown borders',
      'Lower leaves showing premature drying'
    ],
    organicTreatment:
      'Spray Pseudomonas fluorescens @ 10g/Litre of water at early appearance. Apply diluted cow urine (10%) and neem oil (5ml/L) as bio-fungicide.',
    chemicalTreatment:
      'If threshold crosses 5% leaf area, apply Tricyclazole 75% WP @ 0.6g/L or Isoprothiolane 40% EC @ 1.5ml/L under guidance of local agricultural officer.',
    prevention:
      'Avoid excess nitrogenous fertilizer (split urea into 3 doses). Maintain intermittent drainage rather than stagnant flooding.',
    simpleExplanation:
      'మీ వరి ఆకులకు బూజు తెగులు (బ్లాస్ట్) ఆరంభ లక్షణాలు కనిపిస్తున్నాయి. నత్రజని ఎరువును తగ్గించి బయో ఫంగిసైడ్ పిచికారీ చేయండి. / Your paddy crop shows early leaf blast fungus. Reduce excess urea application and spray bio-fungicide promptly.',
    disclaimer:
      'This is an AI-assisted diagnostic screening based on computer vision. Please confirm with your local Mandal Agriculture Officer or Krishi Vigyan Kendra (KVK) before applying hazardous chemicals.'
  },
  {
    id: 'scan-2',
    crop: 'Tomato',
    imageUrl: 'https://images.unsplash.com/photo-1592417817098-8f3d6910985c?auto=format&fit=crop&w=800&q=80',
    timestamp: '2026-09-14 11:15 AM',
    disease: 'Tomato Early Blight',
    confidence: 88,
    severity: 'Low',
    symptoms: ['Brown concentric rings on older leaves', 'Yellowing around infected leaf edges'],
    organicTreatment: 'Copper oxychloride 50% WP or Trichoderma harzianum soil and foliar drench.',
    chemicalTreatment: 'Mancozeb 75% WP @ 2g/Litre water spray at 10-day intervals.',
    prevention: 'Ensure drip irrigation instead of overhead watering to prevent leaf wetness. Prune infected bottom leaves.',
    simpleExplanation:
      'టమోటా మొక్క క్రింది ఆకులలో మచ్చల తెగులు ఉంది. క్రింది ఆకులను తుంచివేసి మట్టిని శుభ్రంగా ఉంచండి. / Target spots visible on bottom leaves. Prune lower diseased foliage and keep soil mulched.',
    disclaimer:
      'Always consult certified agricultural extension personnel for exact dosage based on field area.'
  }
];

export const INITIAL_SOIL_TELEMETRY: SoilTelemetry = {
  timestamp: 'Just now (Real-time IoT Node #01)',
  moisturePercent: 31,
  soilTempC: 28.4,
  airTempC: 32.1,
  humidityPercent: 68,
  status: 'Soil is becoming dry',
  recommendation: 'Soil moisture is dipping below 35% threshold. Recommend 40 minutes drip irrigation this evening around 5:30 PM.',
  nitrogenPpm: 185,
  phosphorusPpm: 24,
  potassiumPpm: 195,
  ecValue: 1.2
};

export const HOURLY_SOIL_HISTORY = [
  { time: '06:00 AM', moisture: 42, temp: 24, humidity: 82 },
  { time: '08:00 AM', moisture: 39, temp: 26, humidity: 76 },
  { time: '10:00 AM', moisture: 36, temp: 29, humidity: 71 },
  { time: '12:00 PM', moisture: 33, temp: 33, humidity: 62 },
  { time: '02:00 PM', moisture: 31, temp: 34, humidity: 58 },
  { time: '04:00 PM', moisture: 31, temp: 31, humidity: 64 },
  { time: '06:00 PM (Now)', moisture: 31, temp: 28, humidity: 68 }
];

export const INITIAL_PRODUCTS: MarketplaceProduct[] = [
  {
    id: 'prod-1',
    farmerId: 'farmer-1',
    farmerName: 'Rama Rao Patel',
    farmerPhone: '+91 98480 23456',
    village: 'Duggirala',
    district: 'Guntur',
    state: 'Andhra Pradesh',
    title: 'Sona Masoori Raw Aged Rice (Single Polish)',
    category: 'Paddy',
    pricePerUnit: 58,
    unit: 'kg',
    mandiBenchmarkPrice: 52,
    availableQty: 1200,
    harvestDate: '2026-05-10',
    isOrganic: true,
    imageUrl: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=600&q=80',
    rating: 4.9,
    description: 'Naturally aged 12-month aromatic Sona Masoori paddy milled fresh from our delta field. Zero chemical bleaching.'
  },
  {
    id: 'prod-2',
    farmerId: 'farmer-1',
    farmerName: 'Rama Rao Patel',
    farmerPhone: '+91 98480 23456',
    village: 'Duggirala',
    district: 'Guntur',
    state: 'Andhra Pradesh',
    title: 'Fresh Farm Vine-Ripened Hybrid Tomatoes',
    category: 'Vegetables',
    pricePerUnit: 28,
    unit: 'kg',
    mandiBenchmarkPrice: 22,
    availableQty: 350,
    harvestDate: '2026-09-19',
    isOrganic: false,
    imageUrl: 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?auto=format&fit=crop&w=600&q=80',
    rating: 4.8,
    description: 'Juicy, firm red salad tomatoes harvested early morning. Ideal for restaurants, households and retail.'
  },
  {
    id: 'prod-3',
    farmerId: 'farmer-2',
    farmerName: 'Suresh Reddy',
    farmerPhone: '+91 94401 56789',
    village: 'Miryalaguda',
    district: 'Nalgonda',
    state: 'Telangana',
    title: 'Guntur Sannam Hot Red Chillies (Sun-Dried)',
    category: 'Spices',
    pricePerUnit: 220,
    unit: 'kg',
    mandiBenchmarkPrice: 195,
    availableQty: 500,
    harvestDate: '2026-08-25',
    isOrganic: true,
    imageUrl: 'https://images.unsplash.com/photo-1588252303782-cb80119abd6d?auto=format&fit=crop&w=600&q=80',
    rating: 5.0,
    description: 'Deep crimson pungency, hand-plucked and sun-dried on clean tarpaulins. High capsaicin grade.'
  },
  {
    id: 'prod-4',
    farmerId: 'farmer-3',
    farmerName: 'Baldev Singh',
    farmerPhone: '+91 98140 11223',
    village: 'Khanna',
    district: 'Ludhiana',
    state: 'Punjab',
    title: 'Premium Sharbati Golden Wheat Atta Grade',
    category: 'Grains',
    pricePerUnit: 42,
    unit: 'kg',
    mandiBenchmarkPrice: 38,
    availableQty: 2500,
    harvestDate: '2026-04-18',
    isOrganic: true,
    imageUrl: 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?auto=format&fit=crop&w=600&q=80',
    rating: 4.9,
    description: 'Heavy grain, sweet roti aroma, naturally irrigated with sweet canal water. Cleaned and destoned.'
  },
  {
    id: 'prod-5',
    farmerId: 'farmer-4',
    farmerName: 'Ganesh Shinde',
    farmerPhone: '+91 97654 33211',
    village: 'Lasalgaon',
    district: 'Nashik',
    state: 'Maharashtra',
    title: 'Nashik Medium Red Storage Onions',
    category: 'Vegetables',
    pricePerUnit: 32,
    unit: 'kg',
    mandiBenchmarkPrice: 28,
    availableQty: 1800,
    harvestDate: '2026-09-05',
    isOrganic: false,
    imageUrl: 'https://images.unsplash.com/photo-1618512496248-a07fe83aa8cb?auto=format&fit=crop&w=600&q=80',
    rating: 4.7,
    description: 'Crisp, pungent Nashik onions with dry outer skins, cured for 25 days storage life.'
  },
  {
    id: 'prod-6',
    farmerId: 'farmer-5',
    farmerName: 'Lakshmi Narayana',
    farmerPhone: '+91 99801 88776',
    village: 'Sirsi',
    district: 'Uttara Kannada',
    state: 'Karnataka',
    title: 'Pure Salem Organic Turmeric Fingers (Curcumin 4.8%)',
    category: 'Spices',
    pricePerUnit: 180,
    unit: 'kg',
    mandiBenchmarkPrice: 155,
    availableQty: 400,
    harvestDate: '2026-06-12',
    isOrganic: true,
    imageUrl: 'https://images.unsplash.com/photo-1615485290382-441e4d049cb5?auto=format&fit=crop&w=600&q=80',
    rating: 5.0,
    description: 'Vibrant golden yellow whole fingers grown without any synthetic chemical fertilizers.'
  }
];

export const INITIAL_ORDERS: Order[] = [
  {
    id: 'ORD-9841',
    customerName: 'Ananya Sharma',
    customerPhone: '+91 98711 54321',
    deliveryAddress: 'Flat 402, Green Meadows Apt, Vijayawada, AP - 520008',
    items: [
      {
        productId: 'prod-1',
        productTitle: 'Sona Masoori Raw Aged Rice (Single Polish)',
        pricePerUnit: 58,
        unit: 'kg',
        quantity: 25,
        farmerName: 'Rama Rao Patel',
        imageUrl: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=600&q=80'
      },
      {
        productId: 'prod-2',
        productTitle: 'Fresh Farm Vine-Ripened Hybrid Tomatoes',
        pricePerUnit: 28,
        unit: 'kg',
        quantity: 5,
        farmerName: 'Rama Rao Patel',
        imageUrl: 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?auto=format&fit=crop&w=600&q=80'
      }
    ],
    totalAmount: 1590,
    status: 'In Transit',
    orderDate: '2026-09-19 02:40 PM',
    paymentMethod: 'UPI / NetBanking',
    trackingNumber: 'KM-IND-882941'
  }
];

export const GOV_SCHEMES: GovScheme[] = [
  {
    id: 'scheme-pmkisan',
    name: 'PM-KISAN (Pradhan Mantri Kisan Samman Nidhi)',
    nativeName: 'పిఎం-కిసాన్ సమ్మాన్ నిధి / पीएम-किसान सम्मान निधि',
    category: 'Direct Income Support',
    state: 'All India',
    purpose: 'To supplement financial needs of land-holding farmers procuring farm inputs and domestic necessities.',
    benefits: '₹6,000 per year transferred directly to bank account in 3 equal four-monthly installments of ₹2,000 each via DBT.',
    eligibility: [
      'All landholder farmer families with cultivable land in their names',
      'Excludes institutional landholders and constitutional post holders',
      'Excludes income tax payees and government servants'
    ],
    requiredDocuments: [
      'Aadhaar Card (Mandatory)',
      'Land Ownership Record (Patta / RoR / 1-B Namuna)',
      'Aadhaar-seeded Bank Account passbook with IFSC',
      'Active Mobile Number linked with Aadhaar'
    ],
    applicationProcess: [
      'Visit official portal pmkisan.gov.in or nearest CSC / Rythu Bharosa Kendra (RBK)',
      'Click "New Farmer Registration" and enter Aadhaar + State',
      'Fill land survey number, khata number, and bank account details',
      'Village Agriculture Officer verifies land documents and forwards for approval'
    ],
    officialUrl: 'https://pmkisan.gov.in',
    farmerTypes: ['Small & Marginal', 'All'],
    tags: ['Direct Cash', 'Income Support', 'Central Scheme']
  },
  {
    id: 'scheme-pmfby',
    name: 'PMFBY (Pradhan Mantri Fasal Bima Yojana)',
    nativeName: 'ఫసల్ బీమా యోజన / फसल बीमा योजना',
    category: 'Crop Insurance',
    state: 'All India',
    purpose: 'Comprehensive financial support against non-preventable natural risks like drought, flood, pests, and unseasonal rainfall.',
    benefits: 'Lowest premium share for farmers: 2% for Kharif food/oilseeds, 1.5% for Rabi, 5% for annual commercial/horticulture. Government subsidizes remainder.',
    eligibility: [
      'All farmers growing notified crops in notified areas (both loanee and non-loanee)',
      'Sharecroppers and tenant farmers with valid cultivation declarations'
    ],
    requiredDocuments: [
      'Land Sowing Certificate issued by Patwari / Village Agriculture Assistant',
      'Aadhaar Card',
      'Bank passbook copy',
      'Khasra / Khatauni land record'
    ],
    applicationProcess: [
      'Enroll within notified cutoff date (usually 31 July for Kharif, 31 Dec for Rabi)',
      'Apply online via pmfby.gov.in or through bank branch where crop loan was taken',
      'In case of localized disaster, report within 72 hours via Crop Insurance App or toll-free 14447'
    ],
    officialUrl: 'https://pmfby.gov.in',
    farmerTypes: ['All', 'Small & Marginal'],
    tags: ['Insurance', 'Risk Protection', 'Central Scheme']
  },
  {
    id: 'scheme-pmksy',
    name: 'PMKSY - Per Drop More Crop (Micro Irrigation)',
    nativeName: 'సూక్ష్మ సేద్య పథకం (డ్రిప్ & స్ప్రింక్లర్) / सूक्ष्म सिंचाई योजना',
    category: 'Irrigation & Water Conservation',
    state: 'All India',
    purpose: 'Water efficiency enhancement at farm level through precision drip and sprinkler systems.',
    benefits: 'Subsidy up to 55% for Small & Marginal farmers and 45% for other farmers on drip/sprinkler installation (state top-up adds another 15-35%).',
    eligibility: [
      'Farmers possessing cultivable land with assured irrigation water source (borewell/well/canal)',
      'Priority to water-stressed blocks and dryland horticulture'
    ],
    requiredDocuments: [
      'Land document (Pattadar Passbook)',
      'Water source availability certificate / EB connection proof',
      'Soil & Water testing report',
      'Aadhaar card and bank details'
    ],
    applicationProcess: [
      'Apply via State Horticulture / Micro Irrigation portal (e.g., APMIP in Andhra Pradesh, TSMIP in Telangana, MahaDBT in MH)',
      'Horticulture officer inspects field dimensions and prepares GPS map',
      'Selected empanelled agency installs equipment, followed by joint physical verification'
    ],
    officialUrl: 'https://pmksy.gov.in',
    farmerTypes: ['Small & Marginal', 'All', 'Women Farmers'],
    tags: ['Water', 'Drip', 'Irrigation Subsidy']
  },
  {
    id: 'scheme-soil-card',
    name: 'National Soil Health Card Scheme',
    nativeName: 'భూసార ఆరోగ్య కార్డు / मृदा स्वास्थ्य कार्ड योजना',
    category: 'Soil Testing & Advisory',
    state: 'All India',
    purpose: 'Provide farmers customized soil nutrient status and crop-wise fertilizer dosage recommendations every 2 years.',
    benefits: 'Free testing of 12 critical parameters (N, P, K, S, Zn, Fe, Cu, Mn, Bo, pH, EC, OC) with precise crop fertilizer prescription.',
    eligibility: ['All farmers cultivating any crop across all states and union territories.'],
    requiredDocuments: ['Aadhaar Card', 'Khata / Survey Number of field'],
    applicationProcess: [
      'Agriculture extension officer or mobile soil lab collects GPS-tagged grid soil sample',
      'Testing completed in state soil testing laboratory (STL)',
      'Soil Health Card printed and delivered to farmer or downloaded from soilhealth.dac.gov.in'
    ],
    officialUrl: 'https://soilhealth.dac.gov.in',
    farmerTypes: ['All'],
    tags: ['Soil Health', 'Free Test', 'Fertilizer Optimization']
  },
  {
    id: 'scheme-smam',
    name: 'SMAM (Sub-Mission on Agricultural Mechanization)',
    nativeName: 'వ్యవసాయ యంత్రీకరణ పథకం / कृषि यंत्रीकरण उप-मिशन',
    category: 'Farm Machinery Subsidy',
    state: 'All India',
    purpose: 'Increasing farm power reach to small farmers with financial assistance on tractors, rotavators, power tillers, drone sprayers.',
    benefits: '40% to 50% capital subsidy on purchase of approved agricultural machinery (up to ₹1.25 Lakh on tractors, up to ₹10 Lakh for Custom Hiring Centres).',
    eligibility: [
      'Individual farmers, self-help groups (SHGs), and Farmer Producer Organizations (FPOs)',
      'Special 10% extra concession for SC/ST and Women farmers'
    ],
    requiredDocuments: ['Aadhaar Card', 'Caste Certificate (if applicable)', 'Land Passbook', 'Quotation from authorized dealer'],
    applicationProcess: [
      'Register on agrimachinery.nic.in DBT portal',
      'Select machine, dealer quotation, and upload verified land records',
      'District Agriculture Committee sanctions administrative approval, subsidy disbursed post field GPS verification'
    ],
    officialUrl: 'https://agrimachinery.nic.in',
    farmerTypes: ['Small & Marginal', 'Women Farmers', 'All'],
    tags: ['Machinery', 'Tractor', 'Drone Subsidy']
  },
  {
    id: 'scheme-kcc',
    name: 'Kisan Credit Card (KCC) Scheme',
    nativeName: 'కిసాన్ క్రెడిట్ కార్డు / किसान क्रेडिट कार्ड',
    category: 'Concessional Credit',
    state: 'All India',
    purpose: 'Timely and adequate credit support for cultivation expenses, post-harvest costs, and maintenance of farm assets.',
    benefits: 'Flexible credit limit up to ₹3 Lakh at effectively 4% interest per annum (7% nominal minus 3% prompt repayment incentive) without collateral for up to ₹1.60 Lakh.',
    eligibility: ['All farmers - individual/joint borrowers, tenant farmers, oral lessees, and sharecroppers.'],
    requiredDocuments: ['Application form', 'Two passport photos', 'Aadhaar + PAN Card', 'Land record verified by revenue officer'],
    applicationProcess: [
      'Submit one-page simplified KCC form at local nationalized/rural bank or PACS',
      'Banks mandated to process application within 14 days',
      'RuPay KCC debit card issued for ATM cash withdrawals and PoS fertilizer purchases'
    ],
    officialUrl: 'https://myscheme.gov.in/schemes/kcc',
    farmerTypes: ['All', 'Small & Marginal'],
    tags: ['Low Interest Loan', 'Credit Card', 'Working Capital']
  },
  {
    id: 'scheme-pkvy',
    name: 'Paramparagat Krishi Vikas Yojana (PKVY)',
    nativeName: 'సేంద్రీయ వ్యవసాయ ప్రోత్సాహం / परंपरागत कृषि विकास योजना',
    category: 'Organic Farming',
    state: 'All India',
    purpose: 'Promoting organic farming through cluster approach and PGS (Participatory Guarantee System) certification.',
    benefits: '₹50,000 per hectare financial assistance over 3 years, of which ₹31,000/ha is given directly to farmers for organic inputs (bio-fertilizers, vermicompost, botanical extracts).',
    eligibility: ['Farmers willing to form clusters of 50 or more acres and commit to zero synthetic chemical farming.'],
    requiredDocuments: ['Cluster membership deed', 'Aadhaar Card', 'Land ownership documents'],
    applicationProcess: [
      'Form or join a local organic cluster through District Agriculture Office or Regional Organic Agency',
      'Follow PGS-India peer inspection process and input logs',
      'Funds credited directly to bank account in 3 stages'
    ],
    officialUrl: 'https://pgsindia-ncof.gov.in',
    farmerTypes: ['Small & Marginal', 'All'],
    tags: ['Organic', 'Certification', 'Bio Inputs']
  }
];

export const MANDI_RATES_TICKER = [
  { commodity: 'Paddy (Common)', price: '₹2,300/Qtl', change: '+₹45', trend: 'up' },
  { commodity: 'Sona Masoori Rice', price: '₹3,950/Qtl', change: '+₹80', trend: 'up' },
  { commodity: 'Tomato Hybrid', price: '₹2,200/Qtl', change: '-₹150', trend: 'down' },
  { commodity: 'Guntur Red Chilli', price: '₹19,800/Qtl', change: '+₹400', trend: 'up' },
  { commodity: 'Cotton (Medium Staple)', price: '₹7,120/Qtl', change: '+₹110', trend: 'up' },
  { commodity: 'Wheat (Sharbati)', price: '₹2,850/Qtl', change: '+₹20', trend: 'up' },
  { commodity: 'Nashik Onion', price: '₹2,400/Qtl', change: '-₹80', trend: 'down' },
  { commodity: 'Soybean Yellow', price: '₹4,620/Qtl', change: '+₹60', trend: 'up' }
];

export const INITIAL_WEATHER: WeatherData = {
  location: 'Guntur Rural',
  state: 'Andhra Pradesh',
  tempC: 31,
  condition: 'Partly Cloudy with Light Breeze',
  humidityPercent: 68,
  rainProbabilityPercent: 25,
  windSpeedKmH: 14,
  uvIndex: 7,
  forecast: [
    { day: 'Today', tempHigh: 33, tempLow: 24, condition: 'Partly Cloudy', rainProb: 25 },
    { day: 'Tomorrow', tempHigh: 32, tempLow: 23, condition: 'Scattered Showers', rainProb: 65 },
    { day: 'Wednesday', tempHigh: 30, tempLow: 23, condition: 'Thunderstorms', rainProb: 75 },
    { day: 'Thursday', tempHigh: 31, tempLow: 24, condition: 'Passing Clouds', rainProb: 35 },
    { day: 'Friday', tempHigh: 34, tempLow: 25, condition: 'Clear & Sunny', rainProb: 15 },
    { day: 'Saturday', tempHigh: 35, tempLow: 25, condition: 'Sunny Dry', rainProb: 10 },
    { day: 'Sunday', tempHigh: 33, tempLow: 24, condition: 'Partly Cloudy', rainProb: 20 }
  ],
  farmingAlert:
    '⚠️ Advisory: 65-75% probability of convective showers forecast for tomorrow and Wednesday. Postpone foliar pesticide sprays and chemical top-dressing until Thursday to prevent wash-off.'
};

export const INITIAL_RECOMMENDATIONS: UnifiedRecommendation[] = [
  {
    id: 'rec-1',
    timestamp: '15 mins ago',
    title: 'Irrigation Advisory for Paddy (Vegetative Stage)',
    message:
      'Your soil moisture is at 31% in Field A. Rain probability is 65% tomorrow afternoon. We suggest delaying deep irrigation until tomorrow night to conserve borewell electricity and capture natural rainwater.',
    priority: 'high',
    icon: 'Droplets',
    category: 'irrigation',
    actionPrompt: 'Check Soil Sensor Data',
    actionRoute: 'soil'
  },
  {
    id: 'rec-2',
    timestamp: '2 hours ago',
    title: 'Foliar Fungicide Warning',
    message:
      'Recent scan indicated potential early Leaf Blast on Paddy. Relative humidity will exceed 80% with overcast skies on Wednesday. Apply preventive Pseudomonas fluorescens before the rain spell.',
    priority: 'urgent',
    icon: 'Stethoscope',
    category: 'disease',
    actionPrompt: 'Open Crop Doctor',
    actionRoute: 'crop-doctor'
  },
  {
    id: 'rec-3',
    timestamp: 'Yesterday',
    title: 'Market Opportunity: Chilli Mandi Rate Surge',
    message:
      'Guntur APMC benchmark price climbed +₹400/Qtl today due to export demand. Your dry chilli stock has high buyer inquiries on the Agrovision Marketplace.',
    priority: 'medium',
    icon: 'TrendingUp',
    category: 'market',
    actionPrompt: 'View Marketplace',
    actionRoute: 'marketplace'
  },
  {
    id: 'rec-4',
    timestamp: '3 days ago',
    title: 'PMKSY Micro-Irrigation Subsidy Window Open',
    message:
      'Andhra Pradesh Horticulture Department announced an additional 15% state top-up subsidy on Drip Systems for small farmers in Guntur district. Check your pre-qualified status.',
    priority: 'low',
    icon: 'Building2',
    category: 'fertilizer',
    actionPrompt: 'Explore Schemes',
    actionRoute: 'schemes'
  }
];

export const LANGUAGE_OPTIONS: { code: string; label: string; native: string; greeting: string }[] = [
  { code: 'te', label: 'Telugu', native: 'తెలుగు', greeting: 'నమస్కారం రైతు మిత్రమా 👨🌾' },
  { code: 'hi', label: 'Hindi', native: 'हिन्दी', greeting: 'नमस्ते किसान भाई 👨🌾' },
  { code: 'en', label: 'English', native: 'English', greeting: 'Welcome, Farmer 👨🌾' },
  { code: 'ta', label: 'Tamil', native: 'தமிழ்', greeting: 'வணக்கம் உழவரே 👨🌾' },
  { code: 'kn', label: 'Kannada', native: 'ಕನ್ನಡ', greeting: 'ನಮಸ್ಕಾರ ರೈತ ಬಾಂಧವರೇ 👨🌾' },
  { code: 'mr', label: 'Marathi', native: 'मराठी', greeting: 'नमस्कार शेतकरी बंधूंनो 👨🌾' },
  { code: 'bn', label: 'Bengali', native: 'বাংলা', greeting: 'নমস্কার কৃষক ভাই 👨🌾' },
  { code: 'pa', label: 'Punjabi', native: 'ਪੰਜਾਬੀ', greeting: 'ਸਤਿ ਸ੍ਰੀ ਅਕਾਲ ਕਿਸਾਨ ਵੀਰੋ 👨🌾' },
  { code: 'gu', label: 'Gujarati', native: 'ગુજરાતી', greeting: 'નમસ્તે ખેડૂત મિત્ર 👨🌾' }
];

export const MOCK_FARMER_PROFILE = INITIAL_FARMER_PROFILE;

export const GOVERNMENT_SCHEMES = GOV_SCHEMES;

export const MANDI_PRICES = [
  { commodity: 'Paddy (Sona Masoori)', modalPrice: 3950, change: '+₹80', trend: 'up', market: 'Guntur APMC Yard' },
  { commodity: 'Chilli (Teja / Sannam)', modalPrice: 19800, change: '+₹400', trend: 'up', market: 'Guntur Mirchi Yard' },
  { commodity: 'Tomato Hybrid', modalPrice: 2200, change: '-₹150', trend: 'down', market: 'Madanapalle Yard' },
  { commodity: 'Cotton (Shankar-6)', modalPrice: 7120, change: '+₹110', trend: 'up', market: 'Warangal Enamamula' },
  { commodity: 'Wheat (Sharbati)', modalPrice: 2850, change: '+₹20', trend: 'up', market: 'Khanna Mandi' },
  { commodity: 'Red Onion Medium', modalPrice: 2400, change: '-₹80', trend: 'down', market: 'Lasalgaon Mandi' }
];

export const DISTRICT_WEATHER_DATA = [
  {
    district: 'Guntur',
    state: 'Andhra Pradesh',
    tempC: 31,
    condition: 'Partly Cloudy',
    humidity: 68,
    rainChance: 25,
    windSpeedKmH: 14,
    advisory: 'Optimal spraying window today before 10 AM. Rain expected in 48 hours; clear drainage channels.',
    forecast7Days: [
      { day: 'Mon', high: 33, low: 24, condition: 'Partly Cloudy', rain: 25 },
      { day: 'Tue', high: 32, low: 23, condition: 'Scattered Showers', rain: 65 },
      { day: 'Wed', high: 30, low: 23, condition: 'Thunderstorm', rain: 75 },
      { day: 'Thu', high: 31, low: 24, condition: 'Passing Clouds', rain: 35 },
      { day: 'Fri', high: 34, low: 25, condition: 'Sunny', rain: 15 },
      { day: 'Sat', high: 35, low: 25, condition: 'Clear Skies', rain: 10 },
      { day: 'Sun', high: 33, low: 24, condition: 'Mild Breeze', rain: 20 },
    ]
  },
  {
    district: 'Warangal',
    state: 'Telangana',
    tempC: 33,
    condition: 'Warm & Humid',
    humidity: 72,
    rainChance: 40,
    windSpeedKmH: 12,
    advisory: 'High humidity window for cotton boll rot surveillance. Avoid morning pesticide application if dew is heavy.',
    forecast7Days: [
      { day: 'Mon', high: 34, low: 24, condition: 'Warm Clouds', rain: 40 },
      { day: 'Tue', high: 33, low: 23, condition: 'Light Rain', rain: 55 },
      { day: 'Wed', high: 31, low: 22, condition: 'Moderate Showers', rain: 80 },
      { day: 'Thu', high: 32, low: 23, condition: 'Overcast', rain: 30 },
      { day: 'Fri', high: 33, low: 24, condition: 'Sunny Intervals', rain: 15 },
      { day: 'Sat', high: 34, low: 25, condition: 'Sunny', rain: 10 },
      { day: 'Sun', high: 34, low: 25, condition: 'Clear', rain: 15 },
    ]
  },
  {
    district: 'Nashik',
    state: 'Maharashtra',
    tempC: 28,
    condition: 'Overcast with Drizzle',
    humidity: 82,
    rainChance: 60,
    windSpeedKmH: 16,
    advisory: 'Continuous leaf wetness favors onion downy mildew. Maintain raised beds to avoid waterlogging.',
    forecast7Days: [
      { day: 'Mon', high: 28, low: 20, condition: 'Drizzle', rain: 60 },
      { day: 'Tue', high: 27, low: 19, condition: 'Showers', rain: 70 },
      { day: 'Wed', high: 26, low: 19, condition: 'Rainy', rain: 85 },
      { day: 'Thu', high: 28, low: 20, condition: 'Overcast', rain: 45 },
      { day: 'Fri', high: 29, low: 21, condition: 'Partly Sunny', rain: 20 },
      { day: 'Sat', high: 30, low: 21, condition: 'Sunny', rain: 10 },
      { day: 'Sun', high: 30, low: 21, condition: 'Clear', rain: 10 },
    ]
  },
  {
    district: 'Ludhiana',
    state: 'Punjab',
    tempC: 32,
    condition: 'Dry & Clear',
    humidity: 45,
    rainChance: 10,
    windSpeedKmH: 10,
    advisory: 'Ideal weather for field preparation and basmati tillering management. Irrigation required every 4-5 days.',
    forecast7Days: [
      { day: 'Mon', high: 33, low: 22, condition: 'Sunny', rain: 10 },
      { day: 'Tue', high: 34, low: 23, condition: 'Clear', rain: 10 },
      { day: 'Wed', high: 33, low: 22, condition: 'Clear', rain: 10 },
      { day: 'Thu', high: 32, low: 22, condition: 'Hazy Sun', rain: 15 },
      { day: 'Fri', high: 33, low: 23, condition: 'Sunny', rain: 5 },
      { day: 'Sat', high: 34, low: 23, condition: 'Sunny', rain: 5 },
      { day: 'Sun', high: 34, low: 24, condition: 'Clear', rain: 5 },
    ]
  }
];

