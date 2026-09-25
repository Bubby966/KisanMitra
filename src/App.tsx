import React, { useState } from 'react';
import { Navbar } from './components/Navbar';
import { LandingPage } from './components/LandingPage';
import { FarmerDashboard } from './components/FarmerDashboard';
import { CropDoctorView } from './components/CropDoctorView';
import { SmartIrrigationView } from './components/SmartIrrigationView';
import { FertilizerAdvisorView } from './components/FertilizerAdvisorView';
import { AssistantView } from './components/AssistantView';
import { MarketplaceView } from './components/MarketplaceView';
import { GovSchemesView } from './components/GovSchemesView';
import { WeatherView } from './components/WeatherView';
import { MyFarmView } from './components/MyFarmView';
import { AdminView } from './components/AdminView';
import { GoogleDriveView } from './components/GoogleDriveView';
import { Language, UserRole, FarmerProfile, SoilTelemetry, CropScanResult } from './types';
import { MOCK_FARMER_PROFILE, INITIAL_SOIL_TELEMETRY, INITIAL_CROP_SCANS } from './data/mockData';
import { PhoneCall, Heart, Sprout } from 'lucide-react';

export default function App() {
  const [currentView, setCurrentView] = useState<string>('dashboard');
  const [language, setLanguage] = useState<Language>('te');
  const [role, setRole] = useState<UserRole>('farmer');
  const [farmerProfile, setFarmerProfile] = useState<FarmerProfile>(MOCK_FARMER_PROFILE);
  const [soilTelemetry, setSoilTelemetry] = useState<SoilTelemetry>(INITIAL_SOIL_TELEMETRY);
  const [recentScan, setRecentScan] = useState<CropScanResult | null>(INITIAL_CROP_SCANS[0]);
  const [cartCount, setCartCount] = useState<number>(0);

  const handleNavigate = (view: string) => {
    setCurrentView(view);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-stone-50 flex flex-col font-sans text-stone-900 selection:bg-emerald-200 selection:text-emerald-900">
      {/* Top Navigation */}
      <Navbar
        currentView={currentView}
        onNavigate={handleNavigate}
        language={language}
        onLanguageChange={setLanguage}
        role={role}
        onRoleChange={setRole}
        cartCount={cartCount}
      />

      {/* Main View Area */}
      <main className="flex-1">
        {currentView === 'landing' && (
          <LandingPage
            onGetStarted={() => handleNavigate('dashboard')}
            onExploreFeature={(feat) => handleNavigate(feat)}
            language={language}
          />
        )}

        {currentView === 'dashboard' && (
          <FarmerDashboard
            onNavigate={handleNavigate}
            language={language}
            farmerProfile={farmerProfile}
            soilTelemetry={soilTelemetry}
            recentScan={recentScan}
          />
        )}

        {currentView === 'crop-doctor' && (
          <CropDoctorView
            onScanComplete={(scan) => setRecentScan(scan)}
          />
        )}

        {currentView === 'soil' && <SmartIrrigationView />}

        {currentView === 'fertilizer' && <FertilizerAdvisorView />}

        {currentView === 'assistant' && (
          <AssistantView
            language={language}
            onLanguageChange={setLanguage}
            farmerProfile={farmerProfile}
          />
        )}

        {currentView === 'marketplace' && (
          <MarketplaceView
            role={role}
            onRoleChange={setRole}
            cartCount={cartCount}
            setCartCount={setCartCount}
          />
        )}

        {currentView === 'schemes' && (
          <GovSchemesView farmerProfile={farmerProfile} />
        )}

        {currentView === 'weather' && <WeatherView />}

        {currentView === 'my-farm' && (
          <MyFarmView
            farmerProfile={farmerProfile}
            onUpdateProfile={setFarmerProfile}
          />
        )}

        {currentView === 'admin' && <AdminView />}

        {currentView === 'google-drive' && (
          <GoogleDriveView
            farmerProfile={farmerProfile}
            soilTelemetry={soilTelemetry}
            recentScan={recentScan}
            language={language}
          />
        )}
      </main>

      {/* Global Quick Action Floating Bar on Mobile */}
      <div className="sm:hidden fixed bottom-3 right-3 z-30 flex items-center gap-2">
        <button
          onClick={() => handleNavigate('crop-doctor')}
          className="p-3.5 rounded-full bg-emerald-700 text-white shadow-xl flex items-center justify-center cursor-pointer"
          title="Quick Crop Scan"
        >
          <Sprout className="w-5 h-5" />
        </button>
      </div>

      {/* Footer */}
      <footer className="bg-stone-900 text-stone-400 text-xs py-8 border-t border-stone-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 pb-6 border-b border-stone-800">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-emerald-800 text-emerald-200 flex items-center justify-center font-bold">
                AV
              </div>
              <div>
                <div className="text-white font-bold text-sm">Agrovision AI (అగ్రోవిజన్ / एग्रोविज़न)</div>
                <div className="text-[11px] text-stone-400">
                  Smart Farming & Farmer Empowerment Platform for Indian Agriculture
                </div>
              </div>
            </div>

            <div className="flex items-center gap-4 text-[11px]">
              <span className="flex items-center gap-1 text-emerald-400 font-medium">
                <PhoneCall className="w-3.5 h-3.5" />
                Kisan Helpline: 1800-180-1551 (Toll-Free)
              </span>
              <button
                onClick={() => handleNavigate('admin')}
                className="text-stone-400 hover:text-white transition cursor-pointer"
              >
                Admin Console
              </button>
            </div>
          </div>

          <div className="pt-4 flex flex-col sm:flex-row items-center justify-between gap-2 text-[11px] text-stone-500">
            <p>© 2024-2025 Agrovision AI. Built for Bharat's farmers with Gemini AI & ESP32 IoT.</p>
            <p className="flex items-center gap-1">
              Developed with agronomic precision for sustainable farming.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
