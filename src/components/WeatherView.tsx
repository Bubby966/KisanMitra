import React, { useState } from 'react';
import {
  CloudSun,
  CloudRain,
  Wind,
  Droplets,
  Sun,
  AlertTriangle,
  MapPin,
  Calendar,
  CheckCircle2,
  Thermometer
} from 'lucide-react';
import { DISTRICT_WEATHER_DATA } from '../data/mockData';

export const WeatherView: React.FC = () => {
  const [selectedDistrict, setSelectedDistrict] = useState<string>('Guntur');

  const weather =
    DISTRICT_WEATHER_DATA.find((d) => d.district === selectedDistrict) ||
    DISTRICT_WEATHER_DATA[0];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <div className="flex items-center gap-2 text-cyan-800 font-bold text-xs uppercase tracking-wider mb-1">
            <CloudSun className="w-4 h-4 text-cyan-600" />
            <span>IMD Agromet Advisory Service</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-stone-950 font-serif">
            Agro-Meteorological Forecast & Weather Alerts
          </h1>
          <p className="text-xs sm:text-sm text-stone-600 mt-1">
            7-day micro-climatic forecasts tailored for field operations, spraying schedules, and harvest protection.
          </p>
        </div>

        {/* District Selector */}
        <div className="flex items-center gap-2 bg-white px-3 py-2 rounded-xl border border-stone-200 shadow-2xs">
          <MapPin className="w-4 h-4 text-cyan-700" />
          <span className="text-xs font-semibold text-stone-600">District:</span>
          <select
            value={selectedDistrict}
            onChange={(e) => setSelectedDistrict(e.target.value)}
            className="text-xs font-bold text-cyan-900 bg-transparent focus:outline-none cursor-pointer"
          >
            {DISTRICT_WEATHER_DATA.map((d) => (
              <option key={d.district} value={d.district}>
                {d.district} ({d.state})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Current Conditions Card */}
      <div className="grid lg:grid-cols-12 gap-6 mb-8">
        <div className="lg:col-span-5 bg-gradient-to-br from-cyan-800 to-cyan-950 text-white rounded-2xl p-6 sm:p-8 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-bold uppercase tracking-wider text-cyan-300">Current Field Conditions</span>
              <span className="text-xs text-cyan-200 font-mono">Live Doppler</span>
            </div>

            <div className="flex items-center gap-4 my-4">
              <div className="text-5xl sm:text-6xl font-black font-serif">{weather.tempC}°C</div>
              <div>
                <div className="text-sm font-bold text-cyan-100">{weather.condition}</div>
                <div className="text-xs text-cyan-300">Feels like {weather.tempC + 2}°C</div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3 pt-6 border-t border-cyan-700/60 text-center">
            <div className="bg-cyan-900/50 p-2.5 rounded-xl border border-cyan-700/40">
              <div className="flex items-center justify-center gap-1 text-[10px] text-cyan-300 mb-1">
                <Droplets className="w-3 h-3" />
                <span>Humidity</span>
              </div>
              <div className="text-sm font-bold">{weather.humidity}%</div>
            </div>

            <div className="bg-cyan-900/50 p-2.5 rounded-xl border border-cyan-700/40">
              <div className="flex items-center justify-center gap-1 text-[10px] text-cyan-300 mb-1">
                <CloudRain className="w-3 h-3" />
                <span>Rain Chance</span>
              </div>
              <div className="text-sm font-bold">{weather.rainChance}%</div>
            </div>

            <div className="bg-cyan-900/50 p-2.5 rounded-xl border border-cyan-700/40">
              <div className="flex items-center justify-center gap-1 text-[10px] text-cyan-300 mb-1">
                <Wind className="w-3 h-3" />
                <span>Wind</span>
              </div>
              <div className="text-sm font-bold">{weather.windSpeedKmH} km/h</div>
            </div>
          </div>
        </div>

        {/* Actionable Farming Advisory Banner */}
        <div className="lg:col-span-7 bg-white rounded-2xl p-6 sm:p-8 border border-stone-200 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-amber-800 mb-2">
              <AlertTriangle className="w-4 h-4 text-amber-600" />
              <span>Agronomic Weather Alert & Advice</span>
            </div>

            <h3 className="text-lg font-bold text-stone-900 mb-2">
              {weather.advisory}
            </h3>

            <p className="text-xs text-stone-600 leading-relaxed mb-6">
              Agricultural operations should be timed with wind speeds under 12 km/h for foliar sprays. Rain probability increases later this week; ensure primary field drainage channels are cleared of silt.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 gap-3 pt-4 border-t border-stone-100">
            <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-xs">
              <div className="font-bold text-emerald-900">Spraying Window</div>
              <div className="text-stone-700 mt-0.5">Suitable before 10:00 AM (Low wind)</div>
            </div>

            <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-xs">
              <div className="font-bold text-amber-900">Harvest Protection</div>
              <div className="text-stone-700 mt-0.5">Cover threshed grain with tarpaulins</div>
            </div>
          </div>
        </div>
      </div>

      {/* 7-Day Forecast Grid */}
      <div className="bg-white rounded-2xl p-6 border border-stone-200 shadow-xs">
        <h3 className="text-sm font-bold text-stone-900 mb-4 flex items-center gap-2">
          <Calendar className="w-4 h-4 text-cyan-700" />
          <span>7-Day Agricultural Forecast for {weather.district}</span>
        </h3>

        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
          {weather.forecast7Days.map((f, i) => (
            <div
              key={i}
              className={`p-3 rounded-xl border text-center transition ${
                i === 0
                  ? 'bg-cyan-50/70 border-cyan-300 ring-1 ring-cyan-300'
                  : 'bg-stone-50 border-stone-200 hover:border-cyan-400'
              }`}
            >
              <div className="text-xs font-bold text-stone-900">{f.day}</div>
              <div className="text-[10px] text-stone-500 mb-2">{f.condition}</div>

              <div className="text-lg font-extrabold text-stone-900 my-1">{f.high}°</div>
              <div className="text-xs text-stone-500">{f.low}°</div>

              <div className="mt-2 pt-2 border-t border-stone-200 flex items-center justify-center gap-1 text-[10px] font-bold text-cyan-800">
                <Droplets className="w-3 h-3 text-cyan-600" />
                <span>{f.rain}% rain</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
