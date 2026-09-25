import React, { useState, useEffect } from 'react';
import {
  Sprout,
  Stethoscope,
  Droplets,
  FlaskConical,
  Bot,
  ShoppingBag,
  Building2,
  CloudSun,
  Tractor,
  Sparkles,
  ArrowRight,
  TrendingUp,
  AlertTriangle,
  CheckCircle2,
  ChevronRight,
  RefreshCw,
  Camera,
  Layers,
  FolderLock
} from 'lucide-react';
import { Language, FarmerProfile, SoilTelemetry, CropScanResult } from '../types';
import { MANDI_PRICES } from '../data/mockData';
import { t } from '../utils/translations';

interface FarmerDashboardProps {
  onNavigate: (view: string) => void;
  language: Language;
  farmerProfile: FarmerProfile;
  soilTelemetry: SoilTelemetry;
  recentScan: CropScanResult | null;
}

export const FarmerDashboard: React.FC<FarmerDashboardProps> = ({
  onNavigate,
  language,
  farmerProfile,
  soilTelemetry,
  recentScan,
}) => {
  const defaultAdvisory = {
    summary: `Optimal soil moisture (${soilTelemetry.moisturePercent}%) — Favorable vegetative tillering conditions for ${farmerProfile.primaryCrop}`,
    reasoning: `IoT soil moisture sensor indicates balanced field capacity. Moderate humidity and sunny breaks provide ideal conditions for nutrient uptake.`,
    irrigationAction: soilTelemetry.moisturePercent < 30
      ? 'Schedule 45-minute evening drip cycle to restore root-zone capacity.'
      : 'Hold deep irrigation today; moisture levels are sufficient for current growth stage.',
    cropDoctorAction: recentScan && recentScan.disease !== 'None detected'
      ? `Active monitoring: Follow treatment for ${recentScan.disease}; avoid nitrogenous foliar spray.`
      : 'No active fungal blight detected. Continue morning field rounds along field bunds.',
    fertilizerAction: 'Schedule split dose of neem-coated urea and potash at active tillering stage.',
  };

  const [unifiedAdvisory, setUnifiedAdvisory] = useState<any>(defaultAdvisory);
  const [isLoadingAdvisory, setIsLoadingAdvisory] = useState(false);

  // Fetch unified recommendation
  const fetchAdvisory = async () => {
    setIsLoadingAdvisory(true);
    try {
      const res = await fetch('/api/ai/unified-recommendations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          soilMoisture: soilTelemetry.moisturePercent,
          crop: farmerProfile.primaryCrop,
          growthStage: 'Vegetative / Tillering Stage',
          weatherCondition: 'Partly Cloudy, 25% rain in 48h',
          diseaseDetected: recentScan ? recentScan.disease : 'None detected',
          language,
        }),
      });

      if (res.ok) {
        const text = await res.text();
        if (text && text.trim()) {
          const data = JSON.parse(text);
          if (data.success && data.advisory) {
            setUnifiedAdvisory(data.advisory);
          }
        }
      }
    } catch (err) {
      console.warn('Unified advisory notice: using contextual field synthesis', err);
    } finally {
      setIsLoadingAdvisory(false);
    }
  };

  useEffect(() => {
    fetchAdvisory();
  }, [language, soilTelemetry.moisturePercent]);

  const featureCards = [
    {
      id: 'crop-doctor',
      title: t('cropDoctor', language),
      subtitle: recentScan ? `Last: ${recentScan.disease}` : 'Early leaf disease vision scanner',
      icon: Stethoscope,
      color: 'bg-red-50 text-red-700 border-red-200',
      badge: recentScan ? `${recentScan.confidence}% Conf.` : 'Vision AI',
      cta: 'Scan Leaf Now',
    },
    {
      id: 'soil',
      title: t('soilMoisture', language),
      subtitle: `Current: ${soilTelemetry.moisturePercent}% (${soilTelemetry.status})`,
      icon: Droplets,
      color: 'bg-cyan-50 text-cyan-700 border-cyan-200',
      badge: 'ESP32 Live',
      cta: 'View Telemetry',
    },
    {
      id: 'fertilizer',
      title: t('fertilizerAdvisor', language),
      subtitle: 'Nutrient N-P-K calculation & split stages',
      icon: FlaskConical,
      color: 'bg-amber-50 text-amber-700 border-amber-200',
      badge: 'ICAR Norms',
      cta: 'Calculate Doses',
    },
    {
      id: 'assistant',
      title: t('kisanAI', language),
      subtitle: 'Voice & text agricultural assistance',
      icon: Bot,
      color: 'bg-blue-50 text-blue-700 border-blue-200',
      badge: 'Multilingual',
      cta: 'Talk to Assistant',
    },
    {
      id: 'marketplace',
      title: t('marketplace', language),
      subtitle: 'Sell harvest directly with 0% middleman fees',
      icon: ShoppingBag,
      color: 'bg-emerald-50 text-emerald-800 border-emerald-200',
      badge: 'Fair Trade',
      cta: 'Open Market',
    },
    {
      id: 'schemes',
      title: t('govSchemes', language),
      subtitle: 'PM-KISAN, PMFBY, and Drip subsidies',
      icon: Building2,
      color: 'bg-purple-50 text-purple-700 border-purple-200',
      badge: 'Direct DBT',
      cta: 'Discover Schemes',
    },
    {
      id: 'weather',
      title: t('weather', language),
      subtitle: '34°C • Rain chance 25% • 7-day radar',
      icon: CloudSun,
      color: 'bg-sky-50 text-sky-700 border-sky-200',
      badge: 'IMD Agromet',
      cta: 'Check Forecast',
    },
    {
      id: 'my-farm',
      title: t('myCrops', language),
      subtitle: `${farmerProfile.primaryCrop} (${farmerProfile.landSizeAcres} Ac)`,
      icon: Tractor,
      color: 'bg-lime-50 text-lime-800 border-lime-200',
      badge: 'Kharif 2024',
      cta: 'Manage Farm',
    },
    {
      id: 'google-drive',
      title: t('googleDrive', language) || 'Google Drive',
      subtitle: 'Patta Passbook, Soil Card & Diagnostic Vault',
      icon: FolderLock,
      color: 'bg-emerald-50 text-emerald-800 border-emerald-300',
      badge: 'Cloud Vault',
      cta: 'Open Drive Vault',
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      {/* Welcome & Farmer Greeting Banner */}
      <div className="bg-gradient-to-r from-emerald-800 via-emerald-700 to-emerald-900 text-white rounded-3xl p-6 sm:p-8 shadow-sm mb-8 relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-900/60 border border-emerald-500/40 text-emerald-200 text-xs font-semibold mb-3">
              <Sprout className="w-3.5 h-3.5 text-emerald-400" />
              <span>
                {farmerProfile.village}, {farmerProfile.district} ({farmerProfile.state})
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black font-serif tracking-tight">
              {t('welcome', language)} — {farmerProfile.name}
            </h1>

            <p className="text-xs sm:text-sm text-emerald-100/90 mt-2 max-w-2xl leading-relaxed">
              {t('welcomeSub', language)}. Your <strong>{farmerProfile.primaryCrop}</strong> is at the tillering stage with optimal growth indicators.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => onNavigate('crop-doctor')}
              className="px-4 py-2.5 bg-amber-400 hover:bg-amber-300 text-stone-950 text-xs font-black rounded-xl shadow-xs transition flex items-center gap-1.5 cursor-pointer"
            >
              <Camera className="w-4 h-4" />
              <span>{t('scanCrop', language)}</span>
            </button>

            <button
              onClick={() => onNavigate('assistant')}
              className="px-4 py-2.5 bg-emerald-900/80 hover:bg-emerald-900 border border-emerald-400/40 text-white text-xs font-bold rounded-xl transition flex items-center gap-1.5 cursor-pointer"
            >
              <Bot className="w-4 h-4 text-emerald-300" />
              <span>{t('askAI', language)}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Quick Actions Bar */}
      <div className="mb-8">
        <div className="text-xs font-bold uppercase tracking-wider text-stone-700 mb-3">
          {t('quickActions', language)}
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
          <button
            onClick={() => onNavigate('crop-doctor')}
            className="p-3 bg-white hover:bg-emerald-50 border border-stone-200 hover:border-emerald-500 rounded-2xl flex items-center gap-2.5 transition shadow-2xs group cursor-pointer"
          >
            <div className="w-8 h-8 rounded-xl bg-red-100 text-red-700 flex items-center justify-center shrink-0 group-hover:scale-105 transition">
              <Stethoscope className="w-4 h-4" />
            </div>
            <span className="text-xs font-bold text-stone-800">{t('scanCrop', language)}</span>
          </button>

          <button
            onClick={() => onNavigate('assistant')}
            className="p-3 bg-white hover:bg-emerald-50 border border-stone-200 hover:border-emerald-500 rounded-2xl flex items-center gap-2.5 transition shadow-2xs group cursor-pointer"
          >
            <div className="w-8 h-8 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center shrink-0 group-hover:scale-105 transition">
              <Bot className="w-4 h-4" />
            </div>
            <span className="text-xs font-bold text-stone-800">{t('askAI', language)}</span>
          </button>

          <button
            onClick={() => onNavigate('soil')}
            className="p-3 bg-white hover:bg-emerald-50 border border-stone-200 hover:border-emerald-500 rounded-2xl flex items-center gap-2.5 transition shadow-2xs group cursor-pointer"
          >
            <div className="w-8 h-8 rounded-xl bg-cyan-100 text-cyan-700 flex items-center justify-center shrink-0 group-hover:scale-105 transition">
              <Droplets className="w-4 h-4" />
            </div>
            <span className="text-xs font-bold text-stone-800">{t('checkSoil', language)}</span>
          </button>

          <button
            onClick={() => onNavigate('schemes')}
            className="p-3 bg-white hover:bg-emerald-50 border border-stone-200 hover:border-emerald-500 rounded-2xl flex items-center gap-2.5 transition shadow-2xs group cursor-pointer"
          >
            <div className="w-8 h-8 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center shrink-0 group-hover:scale-105 transition">
              <Building2 className="w-4 h-4" />
            </div>
            <span className="text-xs font-bold text-stone-800">{t('findSchemes', language)}</span>
          </button>

          <button
            onClick={() => onNavigate('marketplace')}
            className="p-3 bg-white hover:bg-emerald-50 border border-stone-200 hover:border-emerald-500 rounded-2xl flex items-center gap-2.5 transition shadow-2xs group cursor-pointer col-span-2 sm:col-span-1"
          >
            <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0 group-hover:scale-105 transition">
              <ShoppingBag className="w-4 h-4" />
            </div>
            <span className="text-xs font-bold text-stone-800">{t('sellProduct', language)}</span>
          </button>
        </div>
      </div>

      {/* UNIFIED CROSS-FEATURE RECOMMENDATION BANNER */}
      <div className="bg-white rounded-2xl border border-stone-200 p-6 shadow-xs mb-8">
        <div className="flex items-center justify-between gap-4 mb-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs font-bold uppercase tracking-wider text-emerald-800">
                AI Cross-Ecosystem Advisory (సమన్వయ సలహా)
              </div>
              <h3 className="font-extrabold text-stone-950 text-base">
                Synchronized Farm Status & Daily Action Plan
              </h3>
            </div>
          </div>

          <button
            onClick={fetchAdvisory}
            disabled={isLoadingAdvisory}
            className="p-2 rounded-xl text-stone-500 hover:text-emerald-700 hover:bg-stone-100 transition cursor-pointer"
            title="Refresh Advisory"
          >
            <RefreshCw className={`w-4 h-4 ${isLoadingAdvisory ? 'animate-spin text-emerald-600' : ''}`} />
          </button>
        </div>

        {unifiedAdvisory ? (
          <div className="space-y-4">
            <div className="p-4 rounded-xl bg-emerald-50/70 border border-emerald-200">
              <div className="text-xs font-bold text-emerald-950 mb-1">
                Field Summary: {unifiedAdvisory.summary}
              </div>
              <p className="text-xs text-stone-700 leading-relaxed">
                {unifiedAdvisory.reasoning}
              </p>
            </div>

            {/* 3 Unified Action Pillars */}
            <div className="grid sm:grid-cols-3 gap-3">
              <div className="p-3 bg-stone-50 rounded-xl border border-stone-200">
                <div className="flex items-center gap-1.5 text-xs font-bold text-cyan-900 mb-1">
                  <Droplets className="w-3.5 h-3.5 text-cyan-600" />
                  <span>Irrigation Step</span>
                </div>
                <p className="text-xs text-stone-600">{unifiedAdvisory.irrigationAction}</p>
              </div>

              <div className="p-3 bg-stone-50 rounded-xl border border-stone-200">
                <div className="flex items-center gap-1.5 text-xs font-bold text-red-900 mb-1">
                  <Stethoscope className="w-3.5 h-3.5 text-red-600" />
                  <span>Crop Protection</span>
                </div>
                <p className="text-xs text-stone-600">{unifiedAdvisory.cropDoctorAction}</p>
              </div>

              <div className="p-3 bg-stone-50 rounded-xl border border-stone-200">
                <div className="flex items-center gap-1.5 text-xs font-bold text-amber-900 mb-1">
                  <FlaskConical className="w-3.5 h-3.5 text-amber-600" />
                  <span>Fertilizer Step</span>
                </div>
                <p className="text-xs text-stone-600">{unifiedAdvisory.fertilizerAction}</p>
              </div>
            </div>
          </div>
        ) : (
          <div className="p-6 text-center text-stone-500 text-xs">
            Synthesizing soil sensor metrics, crop stage, and weather forecasts...
          </div>
        )}
      </div>

      {/* 8 CORE INTERACTIVE CARDS */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-bold uppercase tracking-wider text-stone-700">
            Farm Management Modules
          </h2>
          <span className="text-xs text-stone-600 font-medium">8 interconnected agricultural tools</span>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {featureCards.map((card) => {
            const Icon = card.icon;
            return (
              <div
                key={card.id}
                className="bg-white rounded-2xl border border-stone-200 p-5 shadow-xs hover:shadow-md transition flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${card.color}`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-stone-100 text-stone-700 border border-stone-200">
                      {card.badge}
                    </span>
                  </div>

                  <h3 className="text-sm font-black text-stone-900 mb-1">{card.title}</h3>
                  <p className="text-xs text-stone-500 line-clamp-2 leading-relaxed mb-4">{card.subtitle}</p>
                </div>

                <button
                  onClick={() => onNavigate(card.id)}
                  className="w-full py-2 px-3 rounded-xl bg-stone-50 hover:bg-emerald-50 text-emerald-800 text-xs font-bold border border-stone-200 hover:border-emerald-300 transition flex items-center justify-between cursor-pointer"
                >
                  <span>{card.cta}</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* LIVE APMC MANDI PRICE TICKER */}
      <div className="bg-white rounded-2xl border border-stone-200 p-5 shadow-xs mb-8">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-emerald-700" />
            <h3 className="font-bold text-stone-900 text-xs uppercase tracking-wider">
              {t('mandiPrices', language)}
            </h3>
          </div>
          <span className="text-[11px] text-stone-500 font-mono">Agmarknet / e-NAM Live Feeds</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {MANDI_PRICES.map((mandi, idx) => (
            <div key={idx} className="bg-stone-50 rounded-xl p-3 border border-stone-200/80">
              <div className="flex items-center justify-between text-[11px] text-stone-500 mb-1">
                <span className="font-semibold text-stone-700">{mandi.commodity}</span>
                <span className={mandi.trend === 'up' ? 'text-emerald-700 font-bold' : 'text-red-700 font-bold'}>
                  {mandi.change}
                </span>
              </div>
              <div className="text-base font-extrabold text-stone-900 font-mono">₹{mandi.modalPrice}</div>
              <div className="text-[10px] text-stone-500 truncate mt-0.5">{mandi.market}</div>
            </div>
          ))}
        </div>
      </div>

      {/* CONNECTED ECOSYSTEM FLOW VISUALIZER */}
      <div className="bg-emerald-950 text-white rounded-2xl p-6 border border-emerald-900">
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-emerald-400 mb-3">
          <Layers className="w-4 h-4" />
          <span>Interactive Connected Architecture</span>
        </div>

        <div className="grid grid-cols-3 sm:grid-cols-9 gap-2 text-center text-xs">
          {[
            { label: 'Farmer', view: 'my-farm' },
            { label: 'Farm Profile', view: 'my-farm' },
            { label: 'Crop', view: 'my-farm' },
            { label: 'Monitor (IoT)', view: 'soil' },
            { label: 'Detect (Doctor)', view: 'crop-doctor' },
            { label: 'Understand', view: 'assistant' },
            { label: 'Recommend', view: 'fertilizer' },
            { label: 'Act (Schemes)', view: 'schemes' },
            { label: 'Sell (Market)', view: 'marketplace' },
          ].map((node, i) => (
            <button
              key={i}
              onClick={() => onNavigate(node.view)}
              className="p-2 rounded-xl bg-emerald-900/60 hover:bg-emerald-800 border border-emerald-700/50 hover:border-emerald-400 transition cursor-pointer flex flex-col items-center justify-center gap-1 group"
            >
              <span className="text-[10px] font-mono text-emerald-400 group-hover:text-amber-300">0{i + 1}</span>
              <span className="text-[11px] font-bold text-white group-hover:underline">{node.label}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
