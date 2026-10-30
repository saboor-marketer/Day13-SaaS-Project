import React from 'react';
import {
  Sparkles,
  Sliders,
  DollarSign,
  TrendingUp,
  Flame,
  Users,
  Percent,
  CheckCircle2,
  ArrowRight,
  Shield,
  Zap,
} from 'lucide-react';
import { useDashboard } from '../../context/DashboardContext';
import { formatCurrency, formatPercent } from '../../utils/formatters';

export const ScenarioSimulator: React.FC = () => {
  const {
    simulationParams,
    setSimulationParams,
    simulationResult,
    kpiMetrics,
    currency,
    applySimulationToDashboard,
  } = useDashboard();

  const handleSliderChange = (key: keyof typeof simulationParams, value: number) => {
    setSimulationParams((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const applyPreset = (preset: 'aggressive' | 'plg' | 'enterprise' | 'default_alive') => {
    if (preset === 'aggressive') {
      setSimulationParams({
        monthlyLeadCount: 220,
        leadToWinRate: 28,
        avgDealSize: 55000,
        churnRate: 1.5,
        monthlyBurn: 240000,
        cashInBank: 4200000,
        salesRepCount: 8,
      });
    } else if (preset === 'plg') {
      setSimulationParams({
        monthlyLeadCount: 380,
        leadToWinRate: 35,
        avgDealSize: 22000,
        churnRate: 1.2,
        monthlyBurn: 140000,
        cashInBank: 4200000,
        salesRepCount: 4,
      });
    } else if (preset === 'enterprise') {
      setSimulationParams({
        monthlyLeadCount: 90,
        leadToWinRate: 32,
        avgDealSize: 110000,
        churnRate: 1.0,
        monthlyBurn: 210000,
        cashInBank: 4200000,
        salesRepCount: 6,
      });
    } else if (preset === 'default_alive') {
      setSimulationParams({
        monthlyLeadCount: 160,
        leadToWinRate: 30,
        avgDealSize: 48000,
        churnRate: 1.1,
        monthlyBurn: 120000,
        cashInBank: 4200000,
        salesRepCount: 5,
      });
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-purple-900/30 via-indigo-900/20 to-slate-900 p-6 rounded-2xl border border-purple-500/20 backdrop-blur-md">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="p-1.5 rounded-lg bg-purple-500/20 text-purple-400">
                <Sparkles className="w-5 h-5" />
              </span>
              <h2 className="text-xl font-bold text-white">
                Venture Growth & Runway Scenario Simulator
              </h2>
            </div>
            <p className="text-xs text-slate-300 max-w-2xl">
              Model how pipeline velocity, win rate tweaks, rep capacity, and deal size expansions impact your 12-month forward ARR and runway extension.
            </p>
          </div>

          {/* Quick Scenario Preset Buttons */}
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="text-[11px] text-slate-400 mr-1 font-semibold uppercase">Presets:</span>
            <button
              type="button"
              onClick={() => applyPreset('aggressive')}
              className="px-2.5 py-1 text-xs font-semibold rounded-lg bg-purple-500/20 hover:bg-purple-500/30 text-purple-200 border border-purple-500/30 transition-colors"
            >
              🚀 Aggressive Scale
            </button>
            <button
              type="button"
              onClick={() => applyPreset('plg')}
              className="px-2.5 py-1 text-xs font-semibold rounded-lg bg-pink-500/20 hover:bg-pink-500/30 text-pink-200 border border-pink-500/30 transition-colors"
            >
              🌱 PLG High Volume
            </button>
            <button
              type="button"
              onClick={() => applyPreset('enterprise')}
              className="px-2.5 py-1 text-xs font-semibold rounded-lg bg-blue-500/20 hover:bg-blue-500/30 text-blue-200 border border-blue-500/30 transition-colors"
            >
              💎 Enterprise $100k+
            </button>
            <button
              type="button"
              onClick={() => applyPreset('default_alive')}
              className="px-2.5 py-1 text-xs font-semibold rounded-lg bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-200 border border-emerald-500/30 transition-colors"
            >
              🛡️ Default Alive
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Interactive Levers / Sliders (7 Cols) */}
        <div className="lg:col-span-7 bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-xs space-y-6">
          <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
            <div className="flex items-center gap-2">
              <Sliders className="w-4 h-4 text-indigo-500" />
              <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                Growth Levers & Sales Model Inputs
              </h3>
            </div>
            <span className="text-xs text-slate-400">Live Dynamic Modeling</span>
          </div>

          <div className="space-y-5">
            {/* Slider 1: Monthly Leads */}
            <div>
              <div className="flex items-center justify-between text-xs mb-1.5">
                <span className="font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                  <Zap className="w-3.5 h-3.5 text-amber-500" />
                  Monthly Lead / MQL Volume
                </span>
                <span className="font-black text-indigo-600 dark:text-indigo-400 font-mono text-sm">
                  {simulationParams.monthlyLeadCount} leads / mo
                </span>
              </div>
              <input
                type="range"
                min={30}
                max={600}
                step={10}
                value={simulationParams.monthlyLeadCount}
                onChange={(e) => handleSliderChange('monthlyLeadCount', Number(e.target.value))}
                className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-indigo-600"
              />
              <div className="flex justify-between text-[10px] text-slate-400 mt-1">
                <span>30 leads</span>
                <span>300 leads</span>
                <span>600 leads</span>
              </div>
            </div>

            {/* Slider 2: Conversion / Win Rate */}
            <div>
              <div className="flex items-center justify-between text-xs mb-1.5">
                <span className="font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                  <Percent className="w-3.5 h-3.5 text-emerald-500" />
                  Lead-to-Won Conversion Rate
                </span>
                <span className="font-black text-indigo-600 dark:text-indigo-400 font-mono text-sm">
                  {simulationParams.leadToWinRate}%
                </span>
              </div>
              <input
                type="range"
                min={10}
                max={50}
                step={1}
                value={simulationParams.leadToWinRate}
                onChange={(e) => handleSliderChange('leadToWinRate', Number(e.target.value))}
                className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-emerald-500"
              />
              <div className="flex justify-between text-[10px] text-slate-400 mt-1">
                <span>10% (Low)</span>
                <span>25% (Benchmark)</span>
                <span>50% (High Velocity)</span>
              </div>
            </div>

            {/* Slider 3: Average Deal Size (ACV) */}
            <div>
              <div className="flex items-center justify-between text-xs mb-1.5">
                <span className="font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                  <DollarSign className="w-3.5 h-3.5 text-blue-500" />
                  Target Average ACV
                </span>
                <span className="font-black text-indigo-600 dark:text-indigo-400 font-mono text-sm">
                  {formatCurrency(simulationParams.avgDealSize, currency, false)} ACV
                </span>
              </div>
              <input
                type="range"
                min={10000}
                max={150000}
                step={5000}
                value={simulationParams.avgDealSize}
                onChange={(e) => handleSliderChange('avgDealSize', Number(e.target.value))}
                className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-blue-600"
              />
              <div className="flex justify-between text-[10px] text-slate-400 mt-1">
                <span>$10k SMB</span>
                <span>$50k Mid-Market</span>
                <span>$150k Enterprise</span>
              </div>
            </div>

            {/* Slider 4: Rep Headcount */}
            <div>
              <div className="flex items-center justify-between text-xs mb-1.5">
                <span className="font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                  <Users className="w-3.5 h-3.5 text-purple-500" />
                  Quota-Carrying Account Executives
                </span>
                <span className="font-black text-indigo-600 dark:text-indigo-400 font-mono text-sm">
                  {simulationParams.salesRepCount} AEs
                </span>
              </div>
              <input
                type="range"
                min={2}
                max={20}
                step={1}
                value={simulationParams.salesRepCount}
                onChange={(e) => handleSliderChange('salesRepCount', Number(e.target.value))}
                className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-purple-600"
              />
              <div className="flex justify-between text-[10px] text-slate-400 mt-1">
                <span>2 Reps</span>
                <span>10 Reps</span>
                <span>20 Reps</span>
              </div>
            </div>

            {/* Slider 5: Monthly Net Burn */}
            <div>
              <div className="flex items-center justify-between text-xs mb-1.5">
                <span className="font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                  <Flame className="w-3.5 h-3.5 text-rose-500" />
                  Monthly Net Burn Rate
                </span>
                <span className="font-black text-rose-600 dark:text-rose-400 font-mono text-sm">
                  {formatCurrency(simulationParams.monthlyBurn, currency, false)} / mo
                </span>
              </div>
              <input
                type="range"
                min={50000}
                max={500000}
                step={10000}
                value={simulationParams.monthlyBurn}
                onChange={(e) => handleSliderChange('monthlyBurn', Number(e.target.value))}
                className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-rose-500"
              />
              <div className="flex justify-between text-[10px] text-slate-400 mt-1">
                <span>$50k/mo</span>
                <span>$250k/mo</span>
                <span>$500k/mo</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Projected Outcomes & Impact (5 Cols) */}
        <div className="lg:col-span-5 space-y-4">
          
          {/* Main 12m Projection Card */}
          <div className="bg-gradient-to-br from-indigo-900 to-slate-900 rounded-2xl p-6 text-white border border-indigo-700/50 shadow-xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/20 rounded-full blur-2xl pointer-events-none" />

            <div className="text-xs uppercase font-bold tracking-wider text-indigo-300 mb-1">
              Projected 12-Month Run-Rate (ARR)
            </div>
            
            <div className="text-4xl font-black tracking-tight text-white font-mono my-2">
              {formatCurrency(simulationResult.projectedARR12m, currency, false)}
            </div>

            <div className="flex items-center gap-2 text-xs font-semibold text-emerald-400 mb-4">
              <TrendingUp className="w-4 h-4" />
              <span>{formatPercent(simulationResult.netRevenueGrowth, true)} Growth vs Current ARR</span>
            </div>

            {/* Comparison Grid */}
            <div className="grid grid-cols-2 gap-3 pt-4 border-t border-indigo-800/80 text-xs">
              <div>
                <span className="text-indigo-300 block text-[11px]">Forward MRR</span>
                <span className="font-bold text-white text-base font-mono">
                  {formatCurrency(simulationResult.projectedMRR12m, currency, true)}
                </span>
              </div>

              <div>
                <span className="text-indigo-300 block text-[11px]">Runway Status</span>
                <span className="font-bold text-white text-base font-mono flex items-center gap-1">
                  <Shield className="w-3.5 h-3.5 text-emerald-400" />
                  {simulationResult.runwayMonths > 36 ? '36+ Months' : `${simulationResult.runwayMonths} Months`}
                </span>
              </div>

              <div>
                <span className="text-indigo-300 block text-[11px]">Breakeven Horizon</span>
                <span className="font-bold text-emerald-300 text-sm">
                  {typeof simulationResult.breakevenMonth === 'number'
                    ? `${simulationResult.breakevenMonth} Months`
                    : simulationResult.breakevenMonth}
                </span>
              </div>

              <div>
                <span className="text-indigo-300 block text-[11px]">Est. Payback</span>
                <span className="font-bold text-white text-sm">
                  {simulationResult.cacPaybackMonths} Months
                </span>
              </div>
            </div>

            <button
              type="button"
              onClick={applySimulationToDashboard}
              className="mt-6 w-full py-2.5 px-4 bg-indigo-500 hover:bg-indigo-400 text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center justify-center gap-2"
            >
              <span>Apply Scenario to Executive Targets</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {/* Venture Impact Checklist */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 space-y-3">
            <h4 className="font-bold text-xs text-slate-400 uppercase tracking-wider">
              Venture Feasibility Analysis
            </h4>

            <div className="space-y-2 text-xs">
              <div className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                <span className="text-slate-700 dark:text-slate-300">
                  Rep capacity allows handling up to{' '}
                  <strong className="text-slate-900 dark:text-white font-mono">
                    {simulationParams.salesRepCount * 35} active opps
                  </strong>.
                </span>
              </div>

              <div className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                <span className="text-slate-700 dark:text-slate-300">
                  Cash cushion of{' '}
                  <strong className="text-slate-900 dark:text-white font-mono">
                    {formatCurrency(simulationParams.cashInBank, currency, true)}
                  </strong>{' '}
                  provides solid runway safety.
                </span>
              </div>

              <div className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-indigo-500 shrink-0 mt-0.5" />
                <span className="text-slate-700 dark:text-slate-300">
                  Expected new ARR addition of{' '}
                  <strong className="text-indigo-600 dark:text-indigo-400 font-mono">
                    +{formatCurrency(simulationResult.projectedARR12m - kpiMetrics.arr, currency, true)}
                  </strong>.
                </span>
              </div>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
};
