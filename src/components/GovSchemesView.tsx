import React, { useState } from 'react';
import {
  Building2,
  Search,
  ExternalLink,
  CheckCircle2,
  FileText,
  UserCheck,
  ChevronRight,
  Filter,
  Sparkles,
  MapPin,
  Check,
  X
} from 'lucide-react';
import { GovernmentScheme, FarmerProfile } from '../types';
import { GOVERNMENT_SCHEMES } from '../data/mockData';

interface GovSchemesViewProps {
  farmerProfile: FarmerProfile;
}

export const GovSchemesView: React.FC<GovSchemesViewProps> = ({ farmerProfile }) => {
  const [schemes, setSchemes] = useState<GovernmentScheme[]>(GOVERNMENT_SCHEMES);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedState, setSelectedState] = useState<string>('All');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedScheme, setSelectedScheme] = useState<GovernmentScheme | null>(null);
  const [showEligibilityMatcher, setShowEligibilityMatcher] = useState(false);

  // Matcher state
  const [testState, setTestState] = useState(farmerProfile.state);
  const [testLandSize, setTestLandSize] = useState(farmerProfile.landSizeAcres);
  const [testCategory, setTestCategory] = useState(farmerProfile.farmerCategory);

  const states = [
    'All',
    'All India / Central',
    'Andhra Pradesh',
    'Telangana',
    'Maharashtra',
    'Punjab',
    'Tamil Nadu',
    'Uttar Pradesh'
  ];

  const categories = [
    'All',
    'Small & Marginal Farmers',
    'All Farmers',
    'Drip / Micro-irrigation users',
    'Custom Hiring / Mechanization'
  ];

  const filteredSchemes = schemes.filter((s) => {
    const titleStr = s.title || s.name || '';
    const minStr = s.ministry || 'Ministry of Agriculture & Farmers Welfare';
    const matchesSearch =
      titleStr.toLowerCase().includes(searchQuery.toLowerCase()) ||
      minStr.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.benefits.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesState =
      selectedState === 'All' ||
      s.state === 'All India' ||
      s.state.toLowerCase() === selectedState.toLowerCase();

    const matchesCat =
      selectedCategory === 'All' ||
      s.category.toLowerCase().includes(selectedCategory.toLowerCase());

    return matchesSearch && matchesState && matchesCat;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <div className="flex items-center gap-2 text-purple-800 font-bold text-xs uppercase tracking-wider mb-1">
            <Building2 className="w-4 h-4 text-purple-600" />
            <span>Direct Benefit Transfer & Subsidies Portal</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-stone-950 font-serif">
            Government Schemes & Subsidies Finder
          </h1>
          <p className="text-xs sm:text-sm text-stone-600 mt-1">
            Discover verified Central and State welfare schemes, crop insurance, and solar pump subsidies without middlemen.
          </p>
        </div>

        <button
          id="check-eligibility-btn"
          onClick={() => setShowEligibilityMatcher(true)}
          className="px-4 py-2.5 rounded-xl bg-purple-700 hover:bg-purple-800 text-white text-xs font-bold flex items-center gap-2 shadow-xs transition cursor-pointer self-start md:self-auto"
        >
          <Sparkles className="w-4 h-4 text-purple-200" />
          <span>Check My Scheme Eligibility</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-2xl p-4 border border-stone-200 shadow-xs mb-8 flex flex-col md:flex-row items-center gap-3">
        <div className="relative w-full md:flex-1">
          <Search className="w-4 h-4 text-stone-400 absolute left-3 top-3" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search PM-KISAN, Drip subsidy, KCC loan..."
            className="w-full bg-stone-50 border border-stone-300 rounded-xl pl-9 pr-3 py-2 text-xs text-stone-900 focus:outline-none focus:ring-2 focus:ring-purple-600"
          />
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto">
          <select
            value={selectedState}
            onChange={(e) => setSelectedState(e.target.value)}
            className="flex-1 md:flex-initial bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 text-xs font-semibold text-stone-800 focus:ring-2 focus:ring-purple-600 cursor-pointer"
          >
            {states.map((st) => (
              <option key={st} value={st}>
                State: {st}
              </option>
            ))}
          </select>

          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="flex-1 md:flex-initial bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 text-xs font-semibold text-stone-800 focus:ring-2 focus:ring-purple-600 cursor-pointer"
          >
            {categories.map((c) => (
              <option key={c} value={c}>
                Category: {c}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Scheme Cards Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredSchemes.map((sch) => (
          <div
            key={sch.id}
            className="bg-white rounded-2xl border border-stone-200 p-6 shadow-xs hover:shadow-md transition flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between gap-2 mb-3">
                <span className="text-[10px] font-bold uppercase tracking-wider text-purple-700 bg-purple-50 px-2 py-0.5 rounded-md border border-purple-200">
                  {sch.state}
                </span>
                <span className="text-[10px] text-stone-400 font-medium truncate max-w-[150px]">
                  {sch.ministry || 'MoA&FW Govt of India'}
                </span>
              </div>

              <h3 className="font-extrabold text-base text-stone-950 mb-2 leading-snug">
                {sch.title || sch.name}
              </h3>

              <div className="p-3 bg-stone-50 rounded-xl border border-stone-200/70 mb-4">
                <div className="text-[10px] font-bold text-stone-500 uppercase">Key Benefit</div>
                <div className="text-xs font-bold text-emerald-800 mt-0.5">{sch.benefits}</div>
              </div>

              <div className="space-y-2 text-xs text-stone-600 mb-6">
                <div className="flex items-start gap-1.5">
                  <UserCheck className="w-3.5 h-3.5 text-purple-600 shrink-0 mt-0.5" />
                  <span className="line-clamp-2">
                    <strong>Eligibility: </strong>
                    {sch.eligibility.join(', ')}
                  </span>
                </div>
                <div className="flex items-start gap-1.5">
                  <FileText className="w-3.5 h-3.5 text-stone-400 shrink-0 mt-0.5" />
                  <span className="line-clamp-1">
                    <strong>Docs: </strong>
                    {(sch.documentsRequired || sch.requiredDocuments || []).join(', ')}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 pt-2 border-t border-stone-100">
              <button
                onClick={() => setSelectedScheme(sch)}
                className="flex-1 py-2 px-3 rounded-xl bg-purple-50 hover:bg-purple-100 text-purple-800 font-bold text-xs transition flex items-center justify-center gap-1 cursor-pointer"
              >
                <span>Full Details & How to Apply</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>

              <a
                href={sch.officialLink || sch.officialUrl}
                target="_blank"
                rel="noreferrer"
                className="p-2 rounded-xl border border-stone-200 hover:bg-stone-100 text-stone-600 transition"
                title="Visit Official Govt Portal"
              >
                <ExternalLink className="w-4 h-4" />
              </a>
            </div>
          </div>
        ))}
      </div>

      {/* SCHEME DETAIL MODAL */}
      {selectedScheme && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-6 sm:p-8 border border-stone-200 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-start justify-between gap-4 mb-4 border-b border-stone-100 pb-3">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-purple-700 bg-purple-50 px-2 py-0.5 rounded-md">
                  {selectedScheme.state} • {selectedScheme.category}
                </span>
                <h3 className="font-extrabold text-xl text-stone-950 mt-2">{selectedScheme.title || selectedScheme.name}</h3>
                <p className="text-xs text-stone-500">{selectedScheme.ministry || 'Ministry of Agriculture & Farmers Welfare'}</p>
              </div>
              <button
                onClick={() => setSelectedScheme(null)}
                className="text-stone-400 hover:text-stone-700 text-base font-bold cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="space-y-5 text-xs text-stone-700">
              <div className="bg-emerald-50 rounded-xl p-4 border border-emerald-200">
                <div className="font-bold text-emerald-900 text-sm mb-1">Direct Assistance / Benefits:</div>
                <p className="text-stone-800 leading-relaxed">{selectedScheme.benefits}</p>
              </div>

              <div>
                <h4 className="font-bold text-stone-900 text-xs uppercase tracking-wider mb-2">
                  Who is Eligible:
                </h4>
                <ul className="space-y-1.5">
                  {selectedScheme.eligibility.map((el, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-purple-600 shrink-0 mt-0.5" />
                      <span>{el}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h4 className="font-bold text-stone-900 text-xs uppercase tracking-wider mb-2">
                  Mandatory Documents:
                </h4>
                <div className="flex flex-wrap gap-2">
                  {(selectedScheme.documentsRequired || selectedScheme.requiredDocuments || []).map((doc: string, i: number) => (
                    <span
                      key={i}
                      className="px-2.5 py-1 bg-stone-100 rounded-lg text-stone-700 font-medium border border-stone-200"
                    >
                      {doc}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="font-bold text-stone-900 text-xs uppercase tracking-wider mb-1">
                  How to Apply:
                </h4>
                <p className="leading-relaxed bg-stone-50 p-3 rounded-xl border border-stone-200">
                  {Array.isArray(selectedScheme.applicationProcess)
                    ? selectedScheme.applicationProcess.join(' → ')
                    : selectedScheme.applicationProcess}
                </p>
              </div>

              <div className="pt-2 flex items-center justify-between">
                <a
                  href={selectedScheme.officialLink || selectedScheme.officialUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="px-5 py-2.5 rounded-xl bg-purple-700 hover:bg-purple-800 text-white font-bold text-xs flex items-center gap-1.5 transition"
                >
                  <span>Open Official Govt Portal</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>

                <button
                  onClick={() => setSelectedScheme(null)}
                  className="px-4 py-2 text-stone-600 hover:text-stone-900 font-bold text-xs cursor-pointer"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ELIGIBILITY MATCHER MODAL */}
      {showEligibilityMatcher && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 border border-stone-200 shadow-2xl">
            <div className="flex items-center justify-between mb-4 border-b border-stone-100 pb-3">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-purple-600" />
                <h3 className="font-bold text-base text-stone-900">Personalized Scheme Matcher</h3>
              </div>
              <button
                onClick={() => setShowEligibilityMatcher(false)}
                className="text-stone-400 hover:text-stone-700 text-sm font-bold cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4 mb-6">
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">State</label>
                <select
                  value={testState}
                  onChange={(e) => setTestState(e.target.value)}
                  className="w-full bg-stone-50 border rounded-xl p-2 text-xs font-semibold"
                >
                  <option value="Andhra Pradesh">Andhra Pradesh</option>
                  <option value="Telangana">Telangana</option>
                  <option value="Maharashtra">Maharashtra</option>
                  <option value="Punjab">Punjab</option>
                  <option value="Uttar Pradesh">Uttar Pradesh</option>
                </select>
              </div>

              <div>
                <div className="flex justify-between text-xs font-semibold mb-1">
                  <span>Land Holding Size</span>
                  <span className="font-bold text-purple-800">{testLandSize} Acres</span>
                </div>
                <input
                  type="range"
                  min="0.5"
                  max="15"
                  step="0.5"
                  value={testLandSize}
                  onChange={(e) => setTestLandSize(parseFloat(e.target.value))}
                  className="w-full accent-purple-700"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">Farmer Category</label>
                <select
                  value={testCategory}
                  onChange={(e) => setTestCategory(e.target.value as any)}
                  className="w-full bg-stone-50 border rounded-xl p-2 text-xs font-semibold"
                >
                  <option value="Small & Marginal">Small & Marginal (Under 5 acres)</option>
                  <option value="Medium">Medium Farmer (5-10 acres)</option>
                  <option value="Large">Large Farmer (Above 10 acres)</option>
                </select>
              </div>
            </div>

            {/* Matched Schemes summary */}
            <div className="p-4 bg-purple-50 rounded-xl border border-purple-200 mb-6">
              <div className="font-bold text-xs text-purple-900 mb-2">
                Eligible Schemes for Your Profile (Estimated 4 Schemes):
              </div>
              <ul className="space-y-1.5 text-xs text-stone-700">
                <li className="flex items-center gap-1.5">
                  <Check className="w-3.5 h-3.5 text-emerald-600 font-bold" />
                  <span><strong>PM-KISAN:</strong> ₹6,000 / year direct cash transfer</span>
                </li>
                <li className="flex items-center gap-1.5">
                  <Check className="w-3.5 h-3.5 text-emerald-600 font-bold" />
                  <span><strong>PMKSY Drip Subsidy:</strong> 90% subsidy for {testLandSize} acres</span>
                </li>
                <li className="flex items-center gap-1.5">
                  <Check className="w-3.5 h-3.5 text-emerald-600 font-bold" />
                  <span><strong>PMFBY:</strong> 1.5% - 2% premium crop loss insurance</span>
                </li>
                <li className="flex items-center gap-1.5">
                  <Check className="w-3.5 h-3.5 text-emerald-600 font-bold" />
                  <span><strong>Kisan Credit Card (KCC):</strong> Collateral-free loan up to ₹1.6 Lakhs</span>
                </li>
              </ul>
            </div>

            <button
              onClick={() => {
                setShowEligibilityMatcher(false);
                setSelectedState(testState);
              }}
              className="w-full py-2.5 rounded-xl bg-purple-700 hover:bg-purple-800 text-white font-bold text-xs cursor-pointer"
            >
              Filter Matching Schemes
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
