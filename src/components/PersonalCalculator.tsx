import React from 'react';
import { Home, Car, Utensils, Info, ShieldAlert, CheckCircle } from 'lucide-react';
import { PersonalFootprint } from '../types';

interface PersonalCalculatorProps {
  data: PersonalFootprint;
  onChange: (updates: Partial<PersonalFootprint>) => void;
  calculatedEmissions: {
    householdEmissions: number;
    transportEmissions: number;
    dietEmissions: number;
    totalPersonalKg: number;
  };
}

export default function PersonalCalculator({ data, onChange, calculatedEmissions }: PersonalCalculatorProps) {
  return (
    <div id="personal-calculator-panel" className="grid grid-cols-1 md:grid-cols-3 gap-8">
      {/* 🏠 HOUSEHOLD SECTION */}
      <div className="bg-[#181922] rounded-2xl border border-gray-800 p-5 shadow-lg flex flex-col justify-between">
        <div>
          <div className="flex items-center gap-2.5 mb-4 text-emerald-400">
            <Home className="w-5 h-5 shrink-0" />
            <h3 className="font-semibold text-white tracking-tight">1. Household Electricity & Fuel</h3>
          </div>
          <p className="text-xs text-gray-400 mb-5 leading-normal">
            Your home energy source determines your electrical intensity coefficient (solar = 0.05, hybrid = 0.20, coal-grid = 0.38 kg CO2/kWh).
          </p>

          <div className="space-y-4">
            <div>
              <label htmlFor="energy-source-select" className="block text-xs font-mono text-gray-400 mb-1.5 uppercase tracking-wider">
                Home Power Energy Source
              </label>
              <select
                id="energy-source-select"
                value={data.energySource}
                onChange={(e) => onChange({ energySource: e.target.value as any })}
                className="w-full bg-black/40 border border-gray-800 rounded-lg p-2.5 text-xs text-white focus:outline-none focus:border-emerald-500/70 transition-colors cursor-pointer"
              >
                <option value="grid">Standard Coal/Grid Mix (0.38 kg/kWh)</option>
                <option value="hybrid">Eco Hybrid Grid (0.20 kg/kWh)</option>
                <option value="solar">100% Rooftop Solar PV (0.05 kg/kWh)</option>
              </select>
            </div>

            <div>
              <div className="flex justify-between items-center text-xs mb-1">
                <label htmlFor="electricity-input" className="font-mono text-gray-400 uppercase tracking-wide">Electric Load</label>
                <span className="text-emerald-400 font-mono font-bold">{data.electricityKwh} kWh / mo</span>
              </div>
              <input
                id="electricity-input"
                type="range"
                min="0"
                max="1500"
                step="50"
                value={data.electricityKwh}
                onChange={(e) => onChange({ electricityKwh: parseInt(e.target.value) || 0 })}
                className="w-full h-1.5 bg-gray-900 rounded-lg appearance-none cursor-pointer accent-emerald-500"
              />
            </div>

            <div>
              <div className="flex justify-between items-center text-xs mb-1">
                <label htmlFor="gas-input" className="font-mono text-gray-400 uppercase tracking-wide">Heating Natural Gas</label>
                <span className="text-emerald-400 font-mono font-bold">{data.naturalGasKwh} kWh / mo</span>
              </div>
              <input
                id="gas-input"
                type="range"
                min="0"
                max="1000"
                step="50"
                value={data.naturalGasKwh}
                onChange={(e) => onChange({ naturalGasKwh: parseInt(e.target.value) || 0 })}
                className="w-full h-1.5 bg-gray-900 rounded-lg appearance-none cursor-pointer accent-emerald-500"
              />
            </div>

            <div>
              <div className="flex justify-between items-center text-xs mb-1">
                <label htmlFor="lpg-input" className="font-mono text-gray-400 uppercase tracking-wide">LPG Cooking Fuel</label>
                <span className="text-emerald-400 font-mono font-bold">{data.lpgKg} kg / mo</span>
              </div>
              <input
                id="lpg-input"
                type="range"
                min="0"
                max="50"
                step="2"
                value={data.lpgKg}
                onChange={(e) => onChange({ lpgKg: parseInt(e.target.value) || 0 })}
                className="w-full h-1.5 bg-gray-900 rounded-lg appearance-none cursor-pointer accent-emerald-500"
              />
            </div>
          </div>
        </div>

        <div className="mt-6 border-t border-gray-800/80 pt-4 flex justify-between items-center">
          <span className="text-xs text-gray-400 font-mono">Household Total</span>
          <div className="text-right">
            <span className="text-base text-white font-mono font-bold">
              {calculatedEmissions.householdEmissions.toFixed(0)}
            </span>
            <span className="text-[10px] text-gray-500 font-mono ml-1">kg CO2/yr</span>
          </div>
        </div>
      </div>

      {/* 🚗 TRAVEL / VEHICLES SECTION */}
      <div className="bg-[#181922] rounded-2xl border border-gray-800 p-5 shadow-lg flex flex-col justify-between">
        <div>
          <div className="flex items-center gap-2.5 mb-4 text-emerald-400">
            <Car className="w-5 h-5 shrink-0" />
            <h3 className="font-semibold text-white tracking-tight">2. Travel & Transport</h3>
          </div>
          <p className="text-xs text-gray-400 mb-5 leading-normal">
            Transitioning transit methods is the single biggest lifesaver. Gasoline cars emit 0.18 kg CO2/km; EVs cut this to 0.04.
          </p>

          <div className="space-y-4">
            <div>
              <label htmlFor="fuel-type-select" className="block text-xs font-mono text-gray-400 mb-1.5 uppercase tracking-wider">
                Primary vehicle fuel standard
              </label>
              <select
                id="fuel-type-select"
                value={data.carFuelType}
                onChange={(e) => onChange({ carFuelType: e.target.value as any })}
                className="w-full bg-black/40 border border-gray-800 rounded-lg p-2.5 text-xs text-white focus:outline-none focus:border-emerald-500/70 transition-colors cursor-pointer"
              >
                <option value="gasoline">Gasoline Combustion (0.18 kg/km)</option>
                <option value="diesel">Diesel Direct Combustion (0.16 kg/km)</option>
                <option value="hybrid">Petrol-Electric Hybrid (0.09 kg/km)</option>
                <option value="ev">Fully Battery-EV Charger (0.04 kg/km)</option>
                <option value="none">No Private vehicle (Walk/Bike only)</option>
              </select>
            </div>

            {data.carFuelType !== 'none' && (
              <div>
                <div className="flex justify-between items-center text-xs mb-1">
                  <label htmlFor="car-mileage-input" className="font-mono text-gray-400 uppercase tracking-wide">Vehicle Mileage</label>
                  <span className="text-emerald-400 font-mono font-bold">{data.carKmPerYear.toLocaleString()} km / yr</span>
                </div>
                <input
                  id="car-mileage-input"
                  type="range"
                  min="0"
                  max="40000"
                  step="1000"
                  value={data.carKmPerYear}
                  onChange={(e) => onChange({ carKmPerYear: parseInt(e.target.value) || 0 })}
                  className="w-full h-1.5 bg-gray-900 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                />
              </div>
            )}

            <div>
              <div className="flex justify-between items-center text-xs mb-1">
                <label htmlFor="transit-mileage-input" className="font-mono text-gray-400 uppercase tracking-wide">Public Transit</label>
                <span className="text-emerald-400 font-mono font-bold">{data.publicTransportKmPerYear.toLocaleString()} km / yr</span>
              </div>
              <input
                id="transit-mileage-input"
                type="range"
                min="0"
                max="25000"
                step="500"
                value={data.publicTransportKmPerYear}
                onChange={(e) => onChange({ publicTransportKmPerYear: parseInt(e.target.value) || 0 })}
                className="w-full h-1.5 bg-gray-900 rounded-lg appearance-none cursor-pointer accent-emerald-500"
              />
            </div>

            <div>
              <div className="flex justify-between items-center text-xs mb-1">
                <label htmlFor="flights-input" className="font-mono text-gray-400 uppercase tracking-wide">Flights & Aviation</label>
                <span className="text-emerald-400 font-mono font-bold">{data.flightsHoursPerYear} hours / yr</span>
              </div>
              <input
                id="flights-input"
                type="range"
                min="0"
                max="120"
                step="5"
                value={data.flightsHoursPerYear}
                onChange={(e) => onChange({ flightsHoursPerYear: parseInt(e.target.value) || 0 })}
                className="w-full h-1.5 bg-gray-900 rounded-lg appearance-none cursor-pointer accent-emerald-500"
              />
            </div>
          </div>
        </div>

        <div className="mt-6 border-t border-gray-800/80 pt-4 flex justify-between items-center">
          <span className="text-xs text-gray-400 font-mono">Transit Total</span>
          <div className="text-right">
            <span className="text-base text-white font-mono font-bold">
              {calculatedEmissions.transportEmissions.toFixed(0)}
            </span>
            <span className="text-[10px] text-gray-500 font-mono ml-1">kg CO2/yr</span>
          </div>
        </div>
      </div>

      {/* 🍲 NUTRITION / DIET SECTION */}
      <div className="bg-[#181922] rounded-2xl border border-gray-800 p-5 shadow-lg flex flex-col justify-between">
        <div>
          <div className="flex items-center gap-2.5 mb-4 text-emerald-400">
            <Utensils className="w-5 h-5 shrink-0" />
            <h3 className="font-semibold text-white tracking-tight">3. Diet & Consumables</h3>
          </div>
          <p className="text-xs text-gray-400 mb-5 leading-normal">
            Low-impact vegan eating shaves off up to 2 ton carbon blocks standard with high gas emissions of red-meat consumption.
          </p>

          <div className="space-y-4">
            <div>
              <label htmlFor="diet-select" className="block text-xs font-mono text-gray-400 mb-1.5 uppercase tracking-wider">
                Dietary Pattern Standard
              </label>
              <select
                id="diet-select"
                value={data.dietType}
                onChange={(e) => onChange({ dietType: e.target.value as any })}
                className="w-full bg-black/40 border border-gray-800 rounded-lg p-2.5 text-xs text-white focus:outline-none focus:border-emerald-500/70 transition-colors cursor-pointer"
              >
                <option value="vegan">Vegan / Plant-Based (~1000 kg/yr)</option>
                <option value="vegetarian">Vegetarian (~1350 kg/yr)</option>
                <option value="low-meat">Low Meat / Flexitarian (~1900 kg/yr)</option>
                <option value="high-meat">High Meat / Standard (~3100 kg/yr)</option>
              </select>
            </div>

            <div>
              <div className="flex justify-between items-center text-xs mb-1">
                <label htmlFor="local-produce-input" className="font-mono text-gray-400 uppercase tracking-wide">Locally-Sourced Food</label>
                <span className="text-emerald-400 font-mono font-bold">{data.locallySourcedPct}% of meals</span>
              </div>
              <input
                id="local-produce-input"
                type="range"
                min="0"
                max="100"
                step="5"
                value={data.locallySourcedPct}
                onChange={(e) => onChange({ locallySourcedPct: parseInt(e.target.value) || 0 })}
                className="w-full h-1.5 bg-gray-900 rounded-lg appearance-none cursor-pointer accent-emerald-500"
              />
            </div>

            <div>
              <div className="flex justify-between items-center text-xs mb-1">
                <label htmlFor="food-waste-input" className="font-mono text-gray-400 uppercase tracking-wide">Discarded Food Waste</label>
                <span className="text-emerald-400 font-mono font-bold">{data.foodWastePct}% wasted</span>
              </div>
              <input
                id="food-waste-input"
                type="range"
                min="0"
                max="60"
                step="5"
                value={data.foodWastePct}
                onChange={(e) => onChange({ foodWastePct: parseInt(e.target.value) || 0 })}
                className="w-full h-1.5 bg-gray-900 rounded-lg appearance-none cursor-pointer accent-emerald-500"
              />
            </div>
            
            {/* Context feedback banner on energy profiles */}
            <div className={`rounded-xl p-3 border text-xs leading-normal flex items-start gap-2.5 ${
              data.dietType === 'vegan' && data.energySource === 'solar'
                ? 'bg-emerald-950/20 border-emerald-500/30 text-emerald-300' 
                : 'bg-black/20 border-gray-800 text-gray-400'
            }`}>
              {data.dietType === 'vegan' && data.energySource === 'solar' ? (
                <>
                  <CheckCircle className="w-4 h-4 shrink-0 text-emerald-400 mt-0.5" />
                  <span>Excellent setup! Combining clean solar grid energy with vegan nutrition is the ultimate personal carbon-slasher footprint.</span>
                </>
              ) : (
                <>
                  <Info className="w-4 h-4 shrink-0 text-gray-500 mt-0.2" />
                  <span>Strategy: Set energy to Solar, transport fuel vehicles to EV, and swap menus to Vegetarian/Vegan to lower personal emissions.</span>
                </>
              )}
            </div>
          </div>
        </div>

        <div className="mt-6 border-t border-gray-800/80 pt-4 flex justify-between items-center">
          <span className="text-xs text-gray-400 font-mono">Nutrition Total</span>
          <div className="text-right">
            <span className="text-base text-white font-mono font-bold">
              {calculatedEmissions.dietEmissions.toFixed(0)}
            </span>
            <span className="text-[10px] text-gray-500 font-mono ml-1">kg CO2/yr</span>
          </div>
        </div>
      </div>
    </div>
  );
}
