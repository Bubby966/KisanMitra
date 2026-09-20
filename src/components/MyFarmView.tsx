import React, { useState } from 'react';
import {
  Tractor,
  Save,
  Check,
  Calendar,
  Layers,
  MapPin,
  Phone,
  User,
  ShieldCheck,
  Sprout,
  Activity,
  Droplets
} from 'lucide-react';
import { FarmerProfile, SoilType } from '../types';

interface MyFarmViewProps {
  farmerProfile: FarmerProfile;
  onUpdateProfile: (profile: FarmerProfile) => void;
}

export const MyFarmView: React.FC<MyFarmViewProps> = ({
  farmerProfile,
  onUpdateProfile,
}) => {
  const [profile, setProfile] = useState<FarmerProfile>(farmerProfile);
  const [isSaved, setIsSaved] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateProfile(profile);
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2500);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-2 text-emerald-800 font-bold text-xs uppercase tracking-wider mb-1">
          <Tractor className="w-4 h-4 text-emerald-600" />
          <span>Farm Operations & Agronomic Identity</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-stone-950 font-serif">
          My Farm Profile & Crop Lifecycle
        </h1>
        <p className="text-xs sm:text-sm text-stone-600 mt-1">
          Keep your landholding details and active crop cycles current to receive tailored fertilizer schedules, scheme alerts, and disease warnings.
        </p>
      </div>

      <div className="grid lg:grid-cols-12 gap-8">
        {/* Left: Active Crop Lifecycle Overview */}
        <div className="lg:col-span-5 space-y-6">
          {/* Active Crop Card */}
          <div className="bg-white rounded-2xl p-6 border border-stone-200 shadow-xs">
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-700">
                Active Crop Season (Kharif 2024-25)
              </span>
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-900 text-xs font-bold">
                Healthy (94%)
              </span>
            </div>

            <div className="flex items-baseline gap-2 mb-1">
              <h3 className="text-xl font-extrabold text-stone-950">{profile.primaryCrop}</h3>
              <span className="text-xs text-stone-500 font-mono">({profile.landSizeAcres} Acres)</span>
            </div>

            <p className="text-xs text-stone-600 mb-6">
              Sown on <strong>12 July 2024</strong>. Currently in the <strong>Vegetative / Tillering</strong> phase.
            </p>

            {/* Growth Progress */}
            <div className="space-y-2 mb-6">
              <div className="flex justify-between text-xs font-semibold">
                <span className="text-stone-700">Growth Stage: Tillering</span>
                <span className="text-emerald-800 font-bold">42 of 125 Days (34%)</span>
              </div>
              <div className="w-full bg-stone-100 rounded-full h-3 overflow-hidden border border-stone-200">
                <div className="bg-emerald-600 h-full rounded-full" style={{ width: '34%' }} />
              </div>
              <div className="flex justify-between text-[10px] text-stone-400 font-mono">
                <span>Sowing</span>
                <span>Tillering</span>
                <span>Panicle</span>
                <span>Harvest</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-4 border-t border-stone-100 text-center">
              <div className="bg-stone-50 p-3 rounded-xl border border-stone-200">
                <div className="text-[10px] text-stone-500 uppercase font-semibold">Expected Harvest</div>
                <div className="text-xs font-bold text-stone-900 mt-1">15 November 2024</div>
              </div>

              <div className="bg-stone-50 p-3 rounded-xl border border-stone-200">
                <div className="text-[10px] text-stone-500 uppercase font-semibold">Est. Yield Potential</div>
                <div className="text-xs font-bold text-emerald-800 mt-1">62 Quintals</div>
              </div>
            </div>
          </div>

          {/* Verification & Govt Badges */}
          <div className="bg-stone-50 rounded-2xl p-5 border border-stone-200">
            <h4 className="text-xs font-bold text-stone-900 uppercase tracking-wider mb-3 flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-700" />
              <span>Verified Farmer Credentials</span>
            </h4>

            <div className="space-y-2.5 text-xs text-stone-700">
              <div className="flex items-center justify-between p-2.5 bg-white rounded-xl border border-stone-200">
                <span className="text-stone-500">PM-KISAN ID:</span>
                <span className="font-mono font-bold text-stone-900">{profile.pmKisanId}</span>
              </div>

              <div className="flex items-center justify-between p-2.5 bg-white rounded-xl border border-stone-200">
                <span className="text-stone-500">Kisan Credit Card (KCC):</span>
                <span className="font-mono font-bold text-stone-900">{profile.kccNumber}</span>
              </div>

              <div className="flex items-center justify-between p-2.5 bg-white rounded-xl border border-stone-200">
                <span className="text-stone-500">Farmer Category:</span>
                <span className="font-bold text-purple-900 bg-purple-50 px-2 py-0.5 rounded">
                  {profile.farmerCategory}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Editable Profile Form */}
        <div className="lg:col-span-7 bg-white rounded-2xl p-6 sm:p-8 border border-stone-200 shadow-xs">
          <div className="flex items-center justify-between mb-6 border-b border-stone-100 pb-3">
            <h3 className="font-bold text-stone-900 text-base">Edit Farm & Agronomic Profile</h3>
            {isSaved && (
              <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full flex items-center gap-1 border border-emerald-200 animate-in fade-in">
                <Check className="w-3.5 h-3.5" />
                Saved Successfully!
              </span>
            )}
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">Farmer Full Name</label>
                <input
                  type="text"
                  required
                  value={profile.name}
                  onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                  className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3.5 py-2 text-xs text-stone-900 focus:ring-2 focus:ring-emerald-600"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">Mobile / WhatsApp Number</label>
                <input
                  type="tel"
                  required
                  value={profile.phone}
                  onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                  className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3.5 py-2 text-xs text-stone-900 focus:ring-2 focus:ring-emerald-600"
                />
              </div>
            </div>

            <div className="grid sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">State</label>
                <input
                  type="text"
                  value={profile.state}
                  onChange={(e) => setProfile({ ...profile, state: e.target.value })}
                  className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 text-xs text-stone-900 focus:ring-2 focus:ring-emerald-600"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">District</label>
                <input
                  type="text"
                  value={profile.district}
                  onChange={(e) => setProfile({ ...profile, district: e.target.value })}
                  className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 text-xs text-stone-900 focus:ring-2 focus:ring-emerald-600"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">Village / Mandal</label>
                <input
                  type="text"
                  value={profile.village}
                  onChange={(e) => setProfile({ ...profile, village: e.target.value })}
                  className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 text-xs text-stone-900 focus:ring-2 focus:ring-emerald-600"
                />
              </div>
            </div>

            <div className="grid sm:grid-cols-2 gap-4 pt-2">
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">Total Cultivated Land (Acres)</label>
                <input
                  type="number"
                  step="0.1"
                  value={profile.landSizeAcres}
                  onChange={(e) => setProfile({ ...profile, landSizeAcres: parseFloat(e.target.value) })}
                  className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3.5 py-2 text-xs text-stone-900 focus:ring-2 focus:ring-emerald-600"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">Predominant Soil Type</label>
                <select
                  value={profile.soilType}
                  onChange={(e) => setProfile({ ...profile, soilType: e.target.value as SoilType })}
                  className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3.5 py-2 text-xs text-stone-900 focus:ring-2 focus:ring-emerald-600"
                >
                  <option value="Black Cotton Soil">Black Cotton Soil</option>
                  <option value="Alluvial Soil">Alluvial Soil</option>
                  <option value="Red Sandy Loam">Red Sandy Loam</option>
                  <option value="Clayey Soil">Clayey Soil</option>
                  <option value="Laterite Soil">Laterite Soil</option>
                </select>
              </div>
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">Primary Crop</label>
                <input
                  type="text"
                  value={profile.primaryCrop}
                  onChange={(e) => setProfile({ ...profile, primaryCrop: e.target.value })}
                  className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3.5 py-2 text-xs text-stone-900 focus:ring-2 focus:ring-emerald-600"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">Secondary / Intercrop</label>
                <input
                  type="text"
                  value={profile.secondaryCrop}
                  onChange={(e) => setProfile({ ...profile, secondaryCrop: e.target.value })}
                  className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3.5 py-2 text-xs text-stone-900 focus:ring-2 focus:ring-emerald-600"
                />
              </div>
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">Irrigation System</label>
                <select
                  value={profile.irrigationSource}
                  onChange={(e) => setProfile({ ...profile, irrigationSource: e.target.value })}
                  className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3.5 py-2 text-xs text-stone-900 focus:ring-2 focus:ring-emerald-600"
                >
                  <option value="Borewell + Drip Irrigation">Borewell + Drip Irrigation</option>
                  <option value="Canal Flood Irrigation">Canal Flood Irrigation</option>
                  <option value="Open Well + Sprinklers">Open Well + Sprinklers</option>
                  <option value="Rainfed (Monsoon Dependent)">Rainfed (Monsoon Dependent)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">Farmer Category</label>
                <select
                  value={profile.farmerCategory}
                  onChange={(e) => setProfile({ ...profile, farmerCategory: e.target.value as any })}
                  className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3.5 py-2 text-xs text-stone-900 focus:ring-2 focus:ring-emerald-600"
                >
                  <option value="Small & Marginal">Small & Marginal (&lt;5 Acres)</option>
                  <option value="Medium">Medium (5-10 Acres)</option>
                  <option value="Large">Large (&gt;10 Acres)</option>
                </select>
              </div>
            </div>

            <div className="pt-4">
              <button
                type="submit"
                className="w-full py-3 bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs rounded-xl shadow-md flex items-center justify-center gap-2 cursor-pointer transition"
              >
                <Save className="w-4 h-4" />
                <span>Save & Update Farm Profile</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
