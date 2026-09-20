import React, { useState } from 'react';
import {
  FlaskConical,
  Sparkles,
  AlertTriangle,
  Leaf,
  CheckCircle2,
  Calendar,
  Layers,
  HelpCircle,
  RefreshCw,
  Info
} from 'lucide-react';
import { FertilizerRecommendation, SoilType, GrowthStage, CropType } from '../types';

const CROPS: CropType[] = [
  'Paddy (Rice)',
  'Wheat',
  'Tomato',
  'Cotton',
  'Chilli',
  'Maize',
  'Potato',
  'Sugarcane',
  'Soybean',
  'Onion'
];

const SOIL_TYPES: SoilType[] = [
  'Black Cotton Soil',
  'Alluvial Soil',
  'Red Sandy Loam',
  'Clayey Soil',
  'Laterite Soil'
];

const STAGES: GrowthStage[] = [
  'Seedling / Nursery',
  'Vegetative Stage',
  'Tillering / Branching',
  'Flowering & Pollination',
  'Grain / Fruit Formation',
  'Maturity / Ready to Harvest'
];

export const FertilizerAdvisorView: React.FC = () => {
  const [crop, setCrop] = useState<CropType>('Paddy (Rice)');
  const [soilType, setSoilType] = useState<SoilType>('Black Cotton Soil');
  const [fieldSize, setFieldSize] = useState<number>(2.5);
  const [growthStage, setGrowthStage] = useState<GrowthStage>('Vegetative Stage');
  const [hasSoilTest, setHasSoilTest] = useState<boolean>(true);
  const [nLevel, setNLevel] = useState<'Low' | 'Medium' | 'High'>('Medium');
  const [pLevel, setPLevel] = useState<'Low' | 'Medium' | 'High'>('Low');
  const [kLevel, setKLevel] = useState<'Low' | 'Medium' | 'High'>('Medium');

  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<FertilizerRecommendation | null>(null);

  const calculatePlan = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/ai/fertilizer-recommend', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          crop,
          soilType,
          fieldSizeAcres: fieldSize,
          growthStage,
          soilTestAvailable: hasSoilTest,
          availableNitrogen: nLevel,
          availablePhosphorus: pLevel,
          availablePotassium: kLevel,
        }),
      });

      const data = await res.json();
      if (data.success && data.recommendation) {
        setResult(data.recommendation);
      }
    } catch (err) {
      console.error('Fertilizer calculation error', err);
    } finally {
      setIsLoading(false);
    }
  };

  // Run calculation on initial render if null
  React.useEffect(() => {
    calculatePlan();
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-2 text-amber-800 font-bold text-xs uppercase tracking-wider mb-1">
          <FlaskConical className="w-4 h-4 text-amber-600" />
          <span>ICAR-Calibrated Nutrient Optimization</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-stone-950 font-serif">
          Smart Fertilizer Advisor & Soil Health Planner
        </h1>
        <p className="text-xs sm:text-sm text-stone-600 mt-1 max-w-2xl">
          Enter your crop, soil type, and field dimensions to calculate balanced N-P-K nutrient schedules, timing stages, and soil regeneration tips.
        </p>
      </div>

      <div className="grid lg:grid-cols-12 gap-8">
        {/* Left: Input Form */}
        <div className="lg:col-span-4 bg-white rounded-2xl p-6 border border-stone-200 shadow-xs space-y-5">
          <h2 className="text-sm font-bold text-stone-900 border-b border-stone-100 pb-3">
            Field & Soil Parameters
          </h2>

          {/* Crop */}
          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1">Crop</label>
            <select
              value={crop}
              onChange={(e) => setCrop(e.target.value as CropType)}
              className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 text-xs font-semibold text-stone-800 focus:ring-2 focus:ring-emerald-600"
            >
              {CROPS.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>

          {/* Soil Type */}
          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1">Soil Type</label>
            <select
              value={soilType}
              onChange={(e) => setSoilType(e.target.value as SoilType)}
              className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 text-xs font-semibold text-stone-800 focus:ring-2 focus:ring-emerald-600"
            >
              {SOIL_TYPES.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>

          {/* Field Size */}
          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="text-xs font-semibold text-stone-700">Field Size (Acres)</label>
              <span className="text-xs font-bold text-emerald-800">{fieldSize} Acres</span>
            </div>
            <input
              type="range"
              min="0.5"
              max="20"
              step="0.5"
              value={fieldSize}
              onChange={(e) => setFieldSize(parseFloat(e.target.value))}
              className="w-full accent-emerald-700 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-stone-600 font-mono mt-0.5">
              <span>0.5 Ac</span>
              <span>10 Ac</span>
              <span>20 Ac</span>
            </div>
          </div>

          {/* Growth Stage */}
          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1">Current Growth Stage</label>
            <select
              value={growthStage}
              onChange={(e) => setGrowthStage(e.target.value as GrowthStage)}
              className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 text-xs font-semibold text-stone-800 focus:ring-2 focus:ring-emerald-600"
            >
              {STAGES.map((st) => (
                <option key={st} value={st}>
                  {st}
                </option>
              ))}
            </select>
          </div>

          {/* Soil Health Card Toggle */}
          <div className="pt-2 border-t border-stone-100">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-semibold text-stone-800">Do you have a Soil Health Card?</span>
              <button
                type="button"
                onClick={() => setHasSoilTest(!hasSoilTest)}
                className={`w-11 h-6 flex items-center rounded-full p-1 cursor-pointer transition ${
                  hasSoilTest ? 'bg-emerald-700' : 'bg-stone-300'
                }`}
              >
                <div
                  className={`bg-white w-4 h-4 rounded-full shadow-md transform transition ${
                    hasSoilTest ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>

            {hasSoilTest && (
              <div className="bg-stone-50 p-3 rounded-xl space-y-2 text-xs border border-stone-200">
                <div className="flex items-center justify-between">
                  <span className="text-stone-600">Available Nitrogen (N)</span>
                  <select
                    value={nLevel}
                    onChange={(e) => setNLevel(e.target.value as any)}
                    className="bg-white border rounded px-2 py-0.5 text-xs font-bold"
                  >
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                  </select>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-stone-600">Available Phosphorus (P)</span>
                  <select
                    value={pLevel}
                    onChange={(e) => setPLevel(e.target.value as any)}
                    className="bg-white border rounded px-2 py-0.5 text-xs font-bold"
                  >
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                  </select>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-stone-600">Available Potassium (K)</span>
                  <select
                    value={kLevel}
                    onChange={(e) => setKLevel(e.target.value as any)}
                    className="bg-white border rounded px-2 py-0.5 text-xs font-bold"
                  >
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                  </select>
                </div>
              </div>
            )}
          </div>

          <button
            id="calculate-fertilizer-btn"
            onClick={calculatePlan}
            disabled={isLoading}
            className="w-full py-3 px-4 rounded-xl bg-emerald-700 hover:bg-emerald-800 disabled:bg-emerald-400 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-md shadow-emerald-700/20 transition cursor-pointer"
          >
            {isLoading ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>Computing Dosage Plan...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 text-emerald-200" />
                <span>Calculate Tailored Fertilizer Plan</span>
              </>
            )}
          </button>
        </div>

        {/* Right: Results Display */}
        <div className="lg:col-span-8 space-y-6">
          {result ? (
            <>
              {/* Nutrient Target Banner */}
              <div className="bg-white rounded-2xl p-6 border border-stone-200 shadow-xs">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <span className="text-xs font-bold text-emerald-700 uppercase tracking-wider">
                      {result.crop} • {result.fieldSizeAcres} Acres
                    </span>
                    <h3 className="text-lg font-black text-stone-950 mt-0.5">
                      Net Nutrient Requirement for {result.growthStage}
                    </h3>
                  </div>
                  <span className="px-3 py-1 bg-stone-100 text-stone-800 text-xs font-bold rounded-lg border border-stone-200">
                    {result.soilType}
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-3 text-center mb-2">
                  <div className="bg-emerald-50 rounded-xl p-3 border border-emerald-200">
                    <div className="text-xs font-bold text-emerald-800">Nitrogen (N)</div>
                    <div className="text-2xl font-black text-stone-950 mt-1">
                      {result.nutrientRequirement?.nitrogenKg} <span className="text-xs font-normal">kg</span>
                    </div>
                    <div className="text-[10px] text-stone-500">Vegetative green growth</div>
                  </div>

                  <div className="bg-amber-50 rounded-xl p-3 border border-amber-200">
                    <div className="text-xs font-bold text-amber-800">Phosphorus (P₂O₅)</div>
                    <div className="text-2xl font-black text-stone-950 mt-1">
                      {result.nutrientRequirement?.phosphorusKg} <span className="text-xs font-normal">kg</span>
                    </div>
                    <div className="text-[10px] text-stone-500">Root & panicle initiation</div>
                  </div>

                  <div className="bg-purple-50 rounded-xl p-3 border border-purple-200">
                    <div className="text-xs font-bold text-purple-800">Potassium (K₂O)</div>
                    <div className="text-2xl font-black text-stone-950 mt-1">
                      {result.nutrientRequirement?.potassiumKg} <span className="text-xs font-normal">kg</span>
                    </div>
                    <div className="text-[10px] text-stone-500">Grain weight & disease resistance</div>
                  </div>
                </div>
              </div>

              {/* Commercial Fertilizer Dosage */}
              <div className="bg-white rounded-2xl p-6 border border-stone-200 shadow-xs">
                <h4 className="text-xs font-bold uppercase tracking-wider text-stone-500 mb-4 flex items-center gap-1.5">
                  <FlaskConical className="w-4 h-4 text-emerald-700" />
                  <span>Recommended Commercial Fertilizers</span>
                </h4>

                <div className="space-y-3">
                  {result.recommendedFertilizers?.map((f, idx) => (
                    <div
                      key={idx}
                      className="p-4 rounded-xl border border-stone-200 bg-stone-50/50 hover:bg-stone-50 transition"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 mb-1">
                        <span className="font-bold text-sm text-stone-900">{f.name}</span>
                        <span className="text-xs font-black text-emerald-800 bg-emerald-100 px-2.5 py-0.5 rounded-full self-start sm:self-auto">
                          {f.dosage}
                        </span>
                      </div>
                      <div className="text-xs font-semibold text-stone-600 mb-1">{f.stage}</div>
                      <p className="text-xs text-stone-500 leading-relaxed">{f.notes}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Timing Schedule */}
              <div className="bg-white rounded-2xl p-6 border border-stone-200 shadow-xs">
                <h4 className="text-xs font-bold uppercase tracking-wider text-stone-500 mb-4 flex items-center gap-1.5">
                  <Calendar className="w-4 h-4 text-emerald-700" />
                  <span>Split-Application Timing Timeline</span>
                </h4>

                <div className="space-y-2">
                  {result.applicationTiming?.map((time, idx) => (
                    <div key={idx} className="flex items-start gap-2.5 text-xs text-stone-700">
                      <span className="w-5 h-5 rounded-full bg-emerald-700 text-white flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">
                        {idx + 1}
                      </span>
                      <span className="leading-relaxed">{time}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Warnings & Organic Health */}
              <div className="grid sm:grid-cols-2 gap-4">
                {/* Over-Application Warnings */}
                <div className="bg-red-50/70 rounded-2xl p-5 border border-red-200">
                  <div className="flex items-center gap-2 text-xs font-bold text-red-800 mb-3">
                    <AlertTriangle className="w-4 h-4 text-red-600" />
                    <span>Over-Application Warnings</span>
                  </div>
                  <ul className="space-y-2 text-xs text-stone-700">
                    {result.overApplicationWarnings?.map((w, idx) => (
                      <li key={idx} className="leading-relaxed">
                        {w}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Organic Soil Suggestions */}
                <div className="bg-emerald-50/70 rounded-2xl p-5 border border-emerald-200">
                  <div className="flex items-center gap-2 text-xs font-bold text-emerald-900 mb-3">
                    <Leaf className="w-4 h-4 text-emerald-700" />
                    <span>Organic & Soil Regeneration Tips</span>
                  </div>
                  <ul className="space-y-2 text-xs text-stone-700">
                    {result.organicSoilHealthSuggestions?.map((s, idx) => (
                      <li key={idx} className="leading-relaxed flex items-start gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                        <span>{s}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Disclaimer */}
              <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-xs flex items-start gap-2.5">
                <HelpCircle className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
                <div className="leading-relaxed">
                  <strong>Important Agronomic Disclaimer: </strong>
                  {result.disclaimer}
                </div>
              </div>
            </>
          ) : (
            <div className="bg-white rounded-2xl p-12 text-center text-stone-500 border border-stone-200">
              <FlaskConical className="w-12 h-12 text-stone-300 mx-auto mb-3" />
              <p className="font-bold text-stone-700">No fertilizer plan computed</p>
              <p className="text-xs text-stone-500 mt-1">Adjust the parameters on the left and tap Calculate.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
