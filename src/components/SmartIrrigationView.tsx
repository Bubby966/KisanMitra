import React, { useState, useEffect } from 'react';
import {
  Droplets,
  Thermometer,
  CloudRain,
  Cpu,
  RefreshCw,
  AlertTriangle,
  CheckCircle2,
  Sliders,
  Code,
  Copy,
  Check,
  Radio,
  ArrowDownRight,
  TrendingDown,
  Clock
} from 'lucide-react';
import { SoilTelemetry } from '../types';
import { INITIAL_SOIL_TELEMETRY, HOURLY_SOIL_HISTORY } from '../data/mockData';

export const SmartIrrigationView: React.FC = () => {
  const [telemetry, setTelemetry] = useState<SoilTelemetry>(INITIAL_SOIL_TELEMETRY);
  const [history, setHistory] = useState(HOURLY_SOIL_HISTORY);
  const [arduinoCode, setArduinoCode] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);
  const [copied, setCopied] = useState(false);
  const [simValue, setSimValue] = useState(31);
  const [showCodeModal, setShowCodeModal] = useState(false);

  // Fetch telemetry
  const fetchTelemetry = async () => {
    try {
      const res = await fetch('/api/iot/soil-moisture');
      const data = await res.json();
      if (data.success && data.telemetry) {
        setTelemetry(data.telemetry);
        if (data.history?.length) {
          setHistory(data.history);
        }
        if (data.arduinoCodeSnippet) {
          setArduinoCode(data.arduinoCodeSnippet);
        }
      }
    } catch (err) {
      console.error('Failed to fetch soil IoT telemetry', err);
    }
  };

  useEffect(() => {
    fetchTelemetry();
  }, []);

  // Simulate updating sensor value
  const handleSimulatePush = async (val: number) => {
    setIsUpdating(true);
    try {
      const res = await fetch('/api/iot/soil-moisture', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          moisturePercent: val,
          soilTempC: 28.5 + (Math.random() * 2 - 1),
          airTempC: 32 + (Math.random() * 2 - 1),
          humidityPercent: 65 - Math.round(val * 0.1),
        }),
      });
      const data = await res.json();
      if (data.success && data.current) {
        setTelemetry(data.current);
        setSimValue(val);
        fetchTelemetry();
      }
    } catch (err) {
      console.error('Simulation error:', err);
    } finally {
      setIsUpdating(false);
    }
  };

  const copyArduinoCode = () => {
    if (arduinoCode) {
      navigator.clipboard.writeText(arduinoCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  // Status color helpers
  const getStatusBadge = (status: string) => {
    if (status.includes('Critical')) {
      return { bg: 'bg-red-100 text-red-900 border-red-300', dot: 'bg-red-600' };
    }
    if (status.includes('dry')) {
      return { bg: 'bg-amber-100 text-amber-900 border-amber-300', dot: 'bg-amber-600' };
    }
    if (status.includes('Waterlogged')) {
      return { bg: 'bg-blue-100 text-blue-900 border-blue-300', dot: 'bg-blue-600' };
    }
    return { bg: 'bg-emerald-100 text-emerald-900 border-emerald-300', dot: 'bg-emerald-600' };
  };

  const badge = getStatusBadge(telemetry.status);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <div className="flex items-center gap-2 text-cyan-800 font-bold text-xs uppercase tracking-wider mb-1">
            <Radio className="w-4 h-4 text-cyan-600 animate-pulse" />
            <span>ESP32 / Arduino Microcontroller Telemetry</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-stone-950 font-serif">
            Smart Irrigation & IoT Soil Moisture Monitor
          </h1>
          <p className="text-xs sm:text-sm text-stone-600 mt-1">
            Real-time capacitive soil moisture, temperature, and automated precision watering advisory for your paddy field.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            id="open-arduino-code-btn"
            onClick={() => setShowCodeModal(true)}
            className="px-3 py-2 rounded-xl bg-stone-100 hover:bg-stone-200 border border-stone-300 text-stone-800 text-xs font-bold flex items-center gap-1.5 transition cursor-pointer"
          >
            <Code className="w-4 h-4 text-cyan-700" />
            <span>ESP32 Hardware Code</span>
          </button>

          <button
            id="refresh-soil-btn"
            onClick={fetchTelemetry}
            className="p-2 rounded-xl bg-white hover:bg-stone-100 border border-stone-300 text-stone-700 transition cursor-pointer"
            title="Refresh Readings"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Main Gauges & Status Card */}
      <div className="grid lg:grid-cols-12 gap-8 mb-8">
        {/* Main Moisture Gauge */}
        <div className="lg:col-span-5 bg-white rounded-2xl p-6 border border-stone-200 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-bold uppercase tracking-wider text-stone-500">Live Soil Sensor Node #01</span>
              <span className={`px-2.5 py-1 rounded-full text-xs font-bold border flex items-center gap-1.5 ${badge.bg}`}>
                <span className={`w-2 h-2 rounded-full ${badge.dot} animate-ping`} />
                <span>{telemetry.status}</span>
              </span>
            </div>

            {/* Circular / Large Metric */}
            <div className="text-center py-6">
              <div className="inline-flex items-baseline justify-center gap-1 text-6xl font-black text-stone-950 tracking-tight font-serif">
                <span>{telemetry.moisturePercent}</span>
                <span className="text-3xl font-bold text-cyan-600">%</span>
              </div>
              <div className="text-xs font-semibold text-stone-500 mt-1">Volumetric Water Content (VWC)</div>

              {/* Progress bar visual */}
              <div className="w-full bg-stone-100 rounded-full h-3.5 mt-6 overflow-hidden border border-stone-200 relative">
                <div
                  className={`h-full transition-all duration-500 ${
                    telemetry.moisturePercent < 20
                      ? 'bg-red-500'
                      : telemetry.moisturePercent < 35
                      ? 'bg-amber-500'
                      : telemetry.moisturePercent > 80
                      ? 'bg-blue-600'
                      : 'bg-emerald-500'
                  }`}
                  style={{ width: `${Math.min(100, Math.max(0, telemetry.moisturePercent))}%` }}
                />
              </div>

              <div className="flex justify-between text-[10px] text-stone-600 font-mono mt-1.5 px-0.5">
                <span>0% (Wilting)</span>
                <span>35% (Target)</span>
                <span>65% (Optimal)</span>
                <span>100% (Flooded)</span>
              </div>
            </div>
          </div>

          {/* Quick Metrics Bar */}
          <div className="grid grid-cols-3 gap-2 pt-4 border-t border-stone-100 text-center">
            <div className="bg-stone-50 p-2.5 rounded-xl border border-stone-200/60">
              <div className="text-[10px] text-stone-500 uppercase font-semibold">Soil Temp</div>
              <div className="text-sm font-extrabold text-stone-900 mt-0.5">{telemetry.soilTempC}°C</div>
            </div>
            <div className="bg-stone-50 p-2.5 rounded-xl border border-stone-200/60">
              <div className="text-[10px] text-stone-500 uppercase font-semibold">Air Temp</div>
              <div className="text-sm font-extrabold text-stone-900 mt-0.5">{telemetry.airTempC}°C</div>
            </div>
            <div className="bg-stone-50 p-2.5 rounded-xl border border-stone-200/60">
              <div className="text-[10px] text-stone-500 uppercase font-semibold">Air Humidity</div>
              <div className="text-sm font-extrabold text-stone-900 mt-0.5">{telemetry.humidityPercent}%</div>
            </div>
          </div>
        </div>

        {/* Irrigation Advisory & Soil Health Card */}
        <div className="lg:col-span-7 space-y-6">
          {/* Recommendation Banner */}
          <div className="bg-white rounded-2xl p-6 border border-stone-200 shadow-xs">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-emerald-800 mb-2">
              <Droplets className="w-4 h-4 text-cyan-600" />
              <span>Automated Irrigation Advisory</span>
            </div>

            <h3 className="text-lg font-bold text-stone-950 mb-2">
              {telemetry.recommendation}
            </h3>

            <p className="text-xs text-stone-600 leading-relaxed mb-4">
              Our recommendation engine integrates real-time soil moisture (<strong>{telemetry.moisturePercent}%</strong>) with local convective rain forecasts (25% today, 65% tomorrow) to prevent unnecessary pump operation and electrical costs.
            </p>

            <div className="grid sm:grid-cols-2 gap-3 pt-2">
              <div className="bg-emerald-50 rounded-xl p-3 border border-emerald-200 text-xs">
                <div className="font-bold text-emerald-900">Recommended Duration</div>
                <div className="text-stone-700 mt-0.5">
                  {telemetry.moisturePercent < 20
                    ? '60-75 Mins (Immediate)'
                    : telemetry.moisturePercent < 35
                    ? '40 Mins at 5:30 PM'
                    : '0 Mins (Wait for tomorrow)'}
                </div>
              </div>

              <div className="bg-cyan-50 rounded-xl p-3 border border-cyan-200 text-xs">
                <div className="font-bold text-cyan-900">Application Method</div>
                <div className="text-stone-700 mt-0.5">Drip emitter lines (1.2 LPH)</div>
              </div>
            </div>
          </div>

          {/* Soil Chemical Properties (NPK & EC) */}
          <div className="bg-white rounded-2xl p-6 border border-stone-200 shadow-xs">
            <h4 className="text-xs font-bold uppercase tracking-wider text-stone-500 mb-4">
              Soil Multi-Sensor Nutrients & Electrical Conductivity (EC)
            </h4>

            <div className="grid grid-cols-4 gap-3 text-center">
              <div className="bg-stone-50 rounded-xl p-3 border border-stone-200">
                <div className="text-xs font-bold text-stone-500">Nitrogen (N)</div>
                <div className="text-base font-extrabold text-stone-900 mt-1">{telemetry.nitrogenPpm}</div>
                <div className="text-[10px] text-stone-400">ppm (Medium)</div>
              </div>

              <div className="bg-stone-50 rounded-xl p-3 border border-stone-200">
                <div className="text-xs font-bold text-stone-500">Phosphorus (P)</div>
                <div className="text-base font-extrabold text-stone-900 mt-1">{telemetry.phosphorusPpm}</div>
                <div className="text-[10px] text-stone-400">ppm (Low)</div>
              </div>

              <div className="bg-stone-50 rounded-xl p-3 border border-stone-200">
                <div className="text-xs font-bold text-stone-500">Potassium (K)</div>
                <div className="text-base font-extrabold text-stone-900 mt-1">{telemetry.potassiumPpm}</div>
                <div className="text-[10px] text-stone-400">ppm (Good)</div>
              </div>

              <div className="bg-stone-50 rounded-xl p-3 border border-stone-200">
                <div className="text-xs font-bold text-stone-500">Salinity (EC)</div>
                <div className="text-base font-extrabold text-stone-900 mt-1">{telemetry.ecValue}</div>
                <div className="text-[10px] text-stone-400">mS/cm (Safe)</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Historical Moisture Timeline Chart */}
      <div className="bg-white rounded-2xl p-6 border border-stone-200 shadow-xs mb-8">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-sm font-bold text-stone-900">Historical Soil Moisture Graph (Hourly)</h3>
            <p className="text-xs text-stone-500">Continuous telemetry reported by ESP32 via HTTP API</p>
          </div>
          <span className="text-xs text-stone-500 font-mono flex items-center gap-1">
            <Clock className="w-3.5 h-3.5" />
            Last 12 Hours
          </span>
        </div>

        {/* Visual Bar Chart */}
        <div className="h-44 flex items-end justify-between gap-2 pt-6 pb-2 border-b border-stone-200">
          {history.map((h, i) => (
            <div key={i} className="flex-1 flex flex-col items-center gap-2 group">
              <span className="text-[11px] font-bold text-stone-700 opacity-0 group-hover:opacity-100 transition">
                {h.moisture}%
              </span>
              <div className="w-full bg-stone-100 rounded-t-lg h-32 flex items-end overflow-hidden">
                <div
                  className={`w-full transition-all duration-300 ${
                    h.moisture < 20
                      ? 'bg-red-400 group-hover:bg-red-500'
                      : h.moisture < 35
                      ? 'bg-amber-400 group-hover:bg-amber-500'
                      : 'bg-emerald-500 group-hover:bg-emerald-600'
                  }`}
                  style={{ height: `${Math.min(100, Math.max(10, h.moisture))}%` }}
                />
              </div>
              <span className="text-[10px] text-stone-500 truncate w-full text-center">{h.time}</span>
            </div>
          ))}
        </div>
      </div>

      {/* IoT Simulation & Hardware Testing Sandbox */}
      <div className="bg-stone-900 text-white rounded-2xl p-6 border border-stone-800">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
          <div className="flex items-center gap-2">
            <Cpu className="w-5 h-5 text-cyan-400" />
            <h3 className="text-sm font-bold">IoT Sensor Event Simulator (Demo / Testing Mode)</h3>
          </div>
          <span className="text-xs text-stone-400">Endpoint: POST /api/iot/soil-moisture</span>
        </div>

        <p className="text-xs text-stone-300 mb-6 max-w-2xl">
          Test how the application responds in real time to varying field conditions. Clicking these presets pushes live JSON payloads to the backend server.
        </p>

        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={() => handleSimulatePush(16)}
            disabled={isUpdating}
            className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-white text-xs font-bold transition flex items-center gap-1.5 cursor-pointer"
          >
            <span>Simulate Wilting (16% Dry)</span>
          </button>

          <button
            onClick={() => handleSimulatePush(31)}
            disabled={isUpdating}
            className="px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-500 text-white text-xs font-bold transition flex items-center gap-1.5 cursor-pointer"
          >
            <span>Simulate Deficit (31% Moisture)</span>
          </button>

          <button
            onClick={() => handleSimulatePush(58)}
            disabled={isUpdating}
            className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition flex items-center gap-1.5 cursor-pointer"
          >
            <span>Simulate Optimal (58% Moisture)</span>
          </button>

          <button
            onClick={() => handleSimulatePush(88)}
            disabled={isUpdating}
            className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition flex items-center gap-1.5 cursor-pointer"
          >
            <span>Simulate Rain Saturated (88%)</span>
          </button>
        </div>
      </div>

      {/* Arduino Code Modal */}
      {showCodeModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-stone-900 text-white rounded-2xl max-w-2xl w-full p-6 border border-stone-700 shadow-2xl">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Code className="w-5 h-5 text-cyan-400" />
                <h3 className="font-bold text-sm">ESP32 / Arduino C++ Firmware Code</h3>
              </div>
              <button
                onClick={() => setShowCodeModal(false)}
                className="text-stone-400 hover:text-white text-sm font-bold cursor-pointer"
              >
                ✕
              </button>
            </div>

            <p className="text-xs text-stone-400 mb-3">
              Flash this code to an ESP32 microcontroller with a capacitive soil moisture sensor on GPIO 34.
            </p>

            <div className="relative bg-stone-950 rounded-xl p-4 font-mono text-xs text-stone-300 max-h-96 overflow-y-auto border border-stone-800">
              <pre>{arduinoCode || 'Loading Arduino source...'}</pre>
              <button
                onClick={copyArduinoCode}
                className="absolute top-3 right-3 px-3 py-1.5 rounded-lg bg-stone-800 hover:bg-stone-700 text-white text-xs font-bold flex items-center gap-1 cursor-pointer transition"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Copied!' : 'Copy Code'}</span>
              </button>
            </div>

            <div className="mt-4 flex justify-end">
              <button
                onClick={() => setShowCodeModal(false)}
                className="px-5 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-600 text-white font-bold text-xs cursor-pointer"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
