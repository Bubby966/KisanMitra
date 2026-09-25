import React, { useState } from 'react';
import {
  ShieldCheck,
  Users,
  ShoppingBag,
  Cpu,
  Stethoscope,
  TrendingUp,
  CheckCircle2,
  AlertCircle,
  Building2,
  Search,
  Check,
  X
} from 'lucide-react';
import { INITIAL_PRODUCTS } from '../data/mockData';

export const AdminView: React.FC = () => {
  const [products, setProducts] = useState(INITIAL_PRODUCTS);

  const stats = [
    { label: 'Registered Farmers', val: '48,290', icon: Users, change: '+12% this month', color: 'text-emerald-700 bg-emerald-50' },
    { label: 'Marketplace Volume', val: '₹1.84 Cr', icon: ShoppingBag, change: '0% commission saved', color: 'text-blue-700 bg-blue-50' },
    { label: 'IoT Sensor Nodes', val: '1,420', icon: Cpu, change: '99.4% uptime', color: 'text-cyan-700 bg-cyan-50' },
    { label: 'Crop Scans Run', val: '124,800', icon: Stethoscope, change: '94% accuracy', color: 'text-purple-700 bg-purple-50' },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-2 text-purple-800 font-bold text-xs uppercase tracking-wider mb-1">
          <ShieldCheck className="w-4 h-4 text-purple-600" />
          <span>Platform Administration & Agronomic Analytics</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-stone-950 font-serif">
          Agrovision AI — Central Admin Command Center
        </h1>
        <p className="text-xs sm:text-sm text-stone-600 mt-1">
          Monitor national sensor network health, marketplace crop transactions, AI vision model diagnostics, and verified government scheme feeds.
        </p>
      </div>

      {/* KPI Stats Grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map((st, i) => {
          const Icon = st.icon;
          return (
            <div key={i} className="bg-white rounded-2xl p-5 border border-stone-200 shadow-xs">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-semibold text-stone-500">{st.label}</span>
                <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${st.color}`}>
                  <Icon className="w-4 h-4" />
                </div>
              </div>
              <div className="text-2xl font-black text-stone-950">{st.val}</div>
              <div className="text-[11px] text-emerald-700 font-medium mt-1">{st.change}</div>
            </div>
          );
        })}
      </div>

      {/* Sensor Node Health & Moderation Grid */}
      <div className="grid lg:grid-cols-12 gap-8">
        {/* Marketplace Moderation Queue */}
        <div className="lg:col-span-7 bg-white rounded-2xl border border-stone-200 shadow-xs p-6">
          <div className="flex items-center justify-between mb-4 border-b border-stone-100 pb-3">
            <div>
              <h3 className="font-bold text-stone-900 text-sm">Marketplace Quality & Price Verification</h3>
              <p className="text-xs text-stone-500">Benchmark comparison against official APMC yard rates</p>
            </div>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-900">
              Verified Fair Trade
            </span>
          </div>

          <div className="space-y-3">
            {products.map((p) => (
              <div
                key={p.id}
                className="p-3 rounded-xl border border-stone-200 bg-stone-50 flex items-center justify-between gap-3 text-xs"
              >
                <div className="flex items-center gap-3">
                  <img
                    src={p.imageUrl}
                    alt={p.cropName}
                    className="w-12 h-12 rounded-lg object-cover border border-stone-300"
                    crossOrigin="anonymous"
                  />
                  <div>
                    <div className="font-bold text-stone-900">{p.cropName}</div>
                    <div className="text-stone-500 text-[11px]">
                      {p.farmerName} • {p.location}
                    </div>
                    <div className="text-emerald-800 font-bold text-[11px] mt-0.5">
                      ₹{p.pricePerUnit}/{p.unit} (Mandi rate: ₹{p.mandiBenchmarkPrice}/{p.unit})
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-1.5">
                  <span className="px-2 py-1 bg-emerald-100 text-emerald-800 font-bold rounded-lg text-[10px] flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" />
                    Approved
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* IoT Telemetric Health & AI Vision Engine */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white rounded-2xl border border-stone-200 shadow-xs p-6">
            <h3 className="font-bold text-stone-900 text-sm mb-4">IoT Hardware Node Status</h3>
            <div className="space-y-3 text-xs">
              <div className="flex items-center justify-between p-3 bg-emerald-50 rounded-xl border border-emerald-200">
                <div>
                  <div className="font-bold text-emerald-900">Node GNT-01 (Duggirala Paddy)</div>
                  <div className="text-stone-500 text-[10px]">ESP32 WiFi • Last ping: 42s ago</div>
                </div>
                <span className="font-mono font-bold text-emerald-800">Online 100%</span>
              </div>

              <div className="flex items-center justify-between p-3 bg-emerald-50 rounded-xl border border-emerald-200">
                <div>
                  <div className="font-bold text-emerald-900">Node WRG-04 (Cotton Red Loam)</div>
                  <div className="text-stone-500 text-[10px]">ESP32 4G Gateway • Last ping: 2m ago</div>
                </div>
                <span className="font-mono font-bold text-emerald-800">Online 98%</span>
              </div>

              <div className="flex items-center justify-between p-3 bg-amber-50 rounded-xl border border-amber-200">
                <div>
                  <div className="font-bold text-amber-900">Node NSK-09 (Nashik Vineyard)</div>
                  <div className="text-stone-500 text-[10px]">Solar Battery 3.4V (Low)</div>
                </div>
                <span className="font-mono font-bold text-amber-800">Battery Warning</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-stone-200 shadow-xs p-6">
            <h3 className="font-bold text-stone-900 text-sm mb-2">Gemini AI Model Diagnostics</h3>
            <p className="text-xs text-stone-500 mb-4">
              Vision pathology model latency: <strong>680ms</strong> • Text assistant throughput: <strong>85 tokens/sec</strong>.
            </p>
            <div className="p-3 bg-stone-900 text-white rounded-xl font-mono text-[11px] space-y-1">
              <div className="text-emerald-400">● Gemini 3.8 Flash Vision: Healthy</div>
              <div className="text-emerald-400">● Web Speech API Bridge: Active</div>
              <div className="text-emerald-400">● Agmarknet Mandi API: Synchronized</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
