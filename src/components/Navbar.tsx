import React from 'react';
import {
  Sprout,
  Stethoscope,
  Droplets,
  FlaskConical,
  Bot,
  ShoppingBag,
  Building2,
  CloudSun,
  LayoutDashboard,
  Globe,
  User,
  ShieldCheck,
  Tractor,
  Home,
  Check
} from 'lucide-react';
import { Language, UserRole } from '../types';
import { LANGUAGE_OPTIONS } from '../data/mockData';
import { t } from '../utils/translations';

interface NavbarProps {
  currentView: string;
  onNavigate: (view: string) => void;
  language: Language;
  onLanguageChange: (lang: Language) => void;
  role: UserRole;
  onRoleChange: (role: UserRole) => void;
  cartCount: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentView,
  onNavigate,
  language,
  onLanguageChange,
  role,
  onRoleChange,
  cartCount
}) => {
  const [langDropdownOpen, setLangDropdownOpen] = React.useState(false);
  const [roleDropdownOpen, setRoleDropdownOpen] = React.useState(false);

  const selectedLangObj = LANGUAGE_OPTIONS.find((l) => l.code === language) || LANGUAGE_OPTIONS[0];

  const navItems = [
    { id: 'dashboard', label: t('myCrops', language), icon: LayoutDashboard },
    { id: 'crop-doctor', label: t('cropDoctor', language), icon: Stethoscope },
    { id: 'soil', label: t('soilMoisture', language), icon: Droplets },
    { id: 'fertilizer', label: t('fertilizerAdvisor', language), icon: FlaskConical },
    { id: 'assistant', label: t('kisanAI', language), icon: Bot },
    { id: 'marketplace', label: t('marketplace', language), icon: ShoppingBag, badge: cartCount },
    { id: 'schemes', label: t('govSchemes', language), icon: Building2 },
    { id: 'weather', label: t('weather', language), icon: CloudSun },
    { id: 'my-farm', label: t('myFarm', language), icon: Tractor },
  ];

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur border-b border-emerald-100 shadow-xs">
      {/* Top Utility Bar for Language & Role */}
      <div className="bg-emerald-800 text-emerald-50 text-xs px-4 py-1.5 flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-3">
          <span className="inline-flex items-center gap-1 font-medium text-emerald-200">
            <Sprout className="w-3.5 h-3.5 text-emerald-400" />
            KisanMitra AI — Krishi Sahayak & Mandi Network
          </span>
          <span className="hidden sm:inline-block text-emerald-300/40">|</span>
          <span className="hidden md:inline-flex items-center gap-1 text-emerald-200/90">
            National Kisan Helpline: <strong className="text-white">1800-180-1551</strong>
          </span>
        </div>

        <div className="flex items-center gap-3 ml-auto">
          {/* Language Selector Dropdown */}
          <div className="relative">
            <button
              id="lang-selector-btn"
              onClick={() => setLangDropdownOpen(!langDropdownOpen)}
              className="flex items-center gap-1.5 bg-emerald-900/80 hover:bg-emerald-900 border border-emerald-600/50 text-white rounded-full px-2.5 py-1 text-xs font-medium transition cursor-pointer"
              title="Select Language"
            >
              <Globe className="w-3.5 h-3.5 text-emerald-300" />
              <span>{selectedLangObj.native} ({selectedLangObj.label})</span>
              <span className="text-[10px] opacity-70">▼</span>
            </button>

            {langDropdownOpen && (
              <div
                id="lang-dropdown-menu"
                className="absolute right-0 mt-1 w-52 bg-white rounded-xl shadow-xl border border-stone-200 py-1 z-50 text-stone-800 animate-in fade-in zoom-in-95 duration-100"
              >
                <div className="px-3 py-1.5 text-[11px] font-semibold text-stone-500 uppercase tracking-wider border-b border-stone-100">
                  Select Local Language
                </div>
                <div className="max-h-64 overflow-y-auto py-1">
                  {LANGUAGE_OPTIONS.map((opt) => (
                    <button
                      key={opt.code}
                      onClick={() => {
                        onLanguageChange(opt.code as Language);
                        setLangDropdownOpen(false);
                      }}
                      className={`w-full text-left px-3 py-2 text-xs flex items-center justify-between hover:bg-emerald-50 transition ${
                        language === opt.code ? 'bg-emerald-50/80 text-emerald-800 font-semibold' : 'text-stone-700'
                      }`}
                    >
                      <div>
                        <div className="text-stone-900">{opt.native}</div>
                        <div className="text-[10px] text-stone-500">{opt.label}</div>
                      </div>
                      {language === opt.code && <Check className="w-4 h-4 text-emerald-600" />}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* User Role Switcher */}
          <div className="relative">
            <button
              id="role-selector-btn"
              onClick={() => setRoleDropdownOpen(!roleDropdownOpen)}
              className="flex items-center gap-1.5 bg-amber-500 hover:bg-amber-600 text-stone-950 rounded-full px-2.5 py-1 text-xs font-semibold transition cursor-pointer"
              title="Switch Platform Role"
            >
              {role === 'farmer' && <Tractor className="w-3.5 h-3.5 text-stone-950" />}
              {role === 'customer' && <ShoppingBag className="w-3.5 h-3.5 text-stone-950" />}
              {role === 'admin' && <ShieldCheck className="w-3.5 h-3.5 text-stone-950" />}
              <span className="capitalize">
                Role: {role === 'farmer' ? 'Farmer 👨🌾' : role === 'customer' ? 'Buyer 🛒' : 'Admin 🛡️'}
              </span>
              <span className="text-[10px] opacity-70">▼</span>
            </button>

            {roleDropdownOpen && (
              <div
                id="role-dropdown-menu"
                className="absolute right-0 mt-1 w-48 bg-white rounded-xl shadow-xl border border-stone-200 py-1.5 z-50 text-stone-800"
              >
                <div className="px-3 py-1 text-[11px] font-semibold text-stone-500 uppercase tracking-wider border-b border-stone-100">
                  Select User View
                </div>
                <button
                  onClick={() => {
                    onRoleChange('farmer');
                    setRoleDropdownOpen(false);
                  }}
                  className={`w-full text-left px-3 py-2 text-xs flex items-center gap-2 hover:bg-emerald-50 ${
                    role === 'farmer' ? 'bg-emerald-50 text-emerald-800 font-semibold' : ''
                  }`}
                >
                  <Tractor className="w-4 h-4 text-emerald-600" />
                  <div>
                    <div>Farmer (Full Farm Suite)</div>
                    <div className="text-[10px] text-stone-500">Crop diagnostics, IoT, sale</div>
                  </div>
                </button>
                <button
                  onClick={() => {
                    onRoleChange('customer');
                    setRoleDropdownOpen(false);
                  }}
                  className={`w-full text-left px-3 py-2 text-xs flex items-center gap-2 hover:bg-amber-50 ${
                    role === 'customer' ? 'bg-amber-50 text-amber-900 font-semibold' : ''
                  }`}
                >
                  <ShoppingBag className="w-4 h-4 text-amber-600" />
                  <div>
                    <div>Buyer / Customer</div>
                    <div className="text-[10px] text-stone-500">Buy fresh farm harvest</div>
                  </div>
                </button>
                <button
                  onClick={() => {
                    onRoleChange('admin');
                    setRoleDropdownOpen(false);
                  }}
                  className={`w-full text-left px-3 py-2 text-xs flex items-center gap-2 hover:bg-purple-50 ${
                    role === 'admin' ? 'bg-purple-50 text-purple-900 font-semibold' : ''
                  }`}
                >
                  <ShieldCheck className="w-4 h-4 text-purple-600" />
                  <div>
                    <div>Admin Portal</div>
                    <div className="text-[10px] text-stone-500">Analytics, listings & schemes</div>
                  </div>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between h-16 gap-4">
        {/* Brand Logo */}
        <button
          id="nav-brand-btn"
          onClick={() => onNavigate('dashboard')}
          className="flex items-center gap-3 text-left group cursor-pointer"
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-700 to-emerald-500 text-white flex items-center justify-center shadow-md shadow-emerald-700/20 group-hover:scale-105 transition-transform">
            <Sprout className="w-6 h-6 text-emerald-100" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-xl font-extrabold tracking-tight text-emerald-950 font-serif">
                KisanMitra
              </span>
              <span className="bg-emerald-600 text-white text-[10px] font-bold px-1.5 py-0.5 rounded tracking-wide">
                AI
              </span>
            </div>
            <p className="text-[11px] text-stone-600 hidden sm:block font-medium">
              Smart Farming & Farmer Empowerment
            </p>
          </div>
        </button>

        {/* Navigation Tabs (Desktop) */}
        <nav className="hidden lg:flex items-center gap-1 overflow-x-auto py-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentView === item.id;
            return (
              <button
                key={item.id}
                id={`nav-${item.id}-btn`}
                onClick={() => onNavigate(item.id)}
                className={`relative px-3 py-2 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition whitespace-nowrap cursor-pointer ${
                  isActive
                    ? 'bg-emerald-700 text-white shadow-xs'
                    : 'text-stone-700 hover:text-emerald-800 hover:bg-emerald-50'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-emerald-700'}`} />
                <span>{item.label}</span>
                {typeof item.badge === 'number' && item.badge > 0 && (
                  <span className="ml-0.5 bg-amber-500 text-stone-950 text-[10px] font-bold px-1.5 py-0.2 rounded-full">
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Right CTA Actions */}
        <div className="flex items-center gap-2">
          <button
            id="nav-landing-toggle-btn"
            onClick={() => onNavigate(currentView === 'landing' ? 'dashboard' : 'landing')}
            className="hidden sm:flex items-center gap-1.5 text-xs font-semibold text-stone-700 hover:text-emerald-800 bg-stone-100 hover:bg-stone-200 border border-stone-200 rounded-lg px-3 py-2 transition cursor-pointer"
          >
            <Home className="w-3.5 h-3.5" />
            <span>{currentView === 'landing' ? 'Open Dashboard' : 'Product Story'}</span>
          </button>

          <button
            id="nav-quick-scan-cta"
            onClick={() => onNavigate('crop-doctor')}
            className="flex items-center gap-1.5 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold px-3.5 py-2 rounded-lg shadow-sm shadow-emerald-700/30 transition cursor-pointer"
          >
            <Stethoscope className="w-4 h-4 text-emerald-200" />
            <span className="hidden sm:inline">Crop Doctor</span>
            <span className="sm:hidden">Doctor</span>
          </button>
        </div>
      </div>

      {/* Mobile Sub-Navigation Bar */}
      <div className="lg:hidden border-t border-stone-100 bg-stone-50 px-2 py-1.5 overflow-x-auto flex items-center gap-1 text-xs no-scrollbar">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentView === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={`px-2.5 py-1.5 rounded-md font-medium flex items-center gap-1.5 whitespace-nowrap transition cursor-pointer ${
                isActive ? 'bg-emerald-700 text-white font-bold' : 'text-stone-700 hover:bg-stone-200'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{item.label}</span>
              {typeof item.badge === 'number' && item.badge > 0 && (
                <span className="bg-amber-500 text-stone-950 text-[9px] font-bold px-1 rounded-full">
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </header>
  );
};
