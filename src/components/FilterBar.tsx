import React, { useState } from 'react';
import {
  Calendar,
  Layers,
  Globe2,
  Users,
  Target,
  RotateCcw,
  ChevronDown,
  Activity,
  Zap,
} from 'lucide-react';
import { useDashboard } from '../context/DashboardContext';
import { CustomerSegment, DateRangeKey, LeadChannel, SalesRegion } from '../types';

export const FilterBar: React.FC = () => {
  const {
    dateRange,
    setDateRange,
    customStartDate,
    setCustomStartDate,
    customEndDate,
    setCustomEndDate,
    selectedSegment,
    setSelectedSegment,
    selectedChannel,
    setSelectedChannel,
    selectedRegion,
    setSelectedRegion,
    selectedRepId,
    setSelectedRepId,
    comparisonMode,
    setComparisonMode,
    salesReps,
    resetFilters,
    activeFilterCount,
    kpiMetrics,
  } = useDashboard();

  const [isCustomDateOpen, setIsCustomDateOpen] = useState(false);
  const [isChannelOpen, setIsChannelOpen] = useState(false);
  const [isRegionOpen, setIsRegionOpen] = useState(false);
  const [isRepOpen, setIsRepOpen] = useState(false);

  const dateRangeOptions: Array<{ key: DateRangeKey; label: string }> = [
    { key: '7d', label: '7D' },
    { key: '30d', label: '30D' },
    { key: '90d', label: '90D (Q1)' },
    { key: 'ytd', label: 'YTD' },
    { key: '12m', label: '12M' },
    { key: 'custom', label: 'Custom' },
  ];

  const segments: CustomerSegment[] = ['All', 'Enterprise', 'Mid-Market', 'SMB', 'Startup'];
  const channels: LeadChannel[] = ['All', 'Inbound Organic', 'Outbound SDR', 'Product-Led (PLG)', 'Partner / Reseller', 'Paid Growth'];
  const regions: SalesRegion[] = ['All', 'North America', 'EMEA', 'APAC', 'LATAM'];

  return (
    <div className="bg-white dark:bg-[#0f172a] border-b border-slate-200 dark:border-slate-800 transition-colors">
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-3">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
          
          {/* Left: Filter Controls */}
          <div className="flex flex-wrap items-center gap-2">
            
            {/* Date Range Selector Pills */}
            <div className="inline-flex items-center p-0.5 rounded-lg bg-slate-100 dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700/80">
              <span className="pl-2 pr-1 text-slate-400">
                <Calendar className="w-3.5 h-3.5" />
              </span>
              {dateRangeOptions.map((opt) => (
                <button
                  key={opt.key}
                  type="button"
                  onClick={() => {
                    setDateRange(opt.key);
                    if (opt.key === 'custom') {
                      setIsCustomDateOpen(true);
                    }
                  }}
                  className={`px-2.5 py-1 text-xs font-semibold rounded-md transition-all ${
                    dateRange === opt.key
                      ? 'bg-white dark:bg-indigo-600 text-indigo-700 dark:text-white shadow-xs'
                      : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>

            {/* Custom Date Popover */}
            {dateRange === 'custom' && (
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setIsCustomDateOpen(!isCustomDateOpen)}
                  className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium rounded-lg border border-indigo-200 dark:border-indigo-800 bg-indigo-50/50 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-300"
                >
                  <span>{customStartDate} to {customEndDate}</span>
                  <ChevronDown className="w-3 h-3" />
                </button>

                {isCustomDateOpen && (
                  <>
                    <div className="fixed inset-0 z-40" onClick={() => setIsCustomDateOpen(false)} />
                    <div className="absolute left-0 mt-2 p-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-xl z-50 flex flex-col gap-2 w-64">
                      <div className="text-xs font-semibold text-slate-500">Custom Date Range</div>
                      <div className="flex flex-col gap-1">
                        <label className="text-[11px] text-slate-400">Start Date</label>
                        <input
                          type="date"
                          value={customStartDate}
                          onChange={(e) => setCustomStartDate(e.target.value)}
                          className="px-2 py-1 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded text-slate-800 dark:text-slate-200"
                        />
                      </div>
                      <div className="flex flex-col gap-1">
                        <label className="text-[11px] text-slate-400">End Date</label>
                        <input
                          type="date"
                          value={customEndDate}
                          onChange={(e) => setCustomEndDate(e.target.value)}
                          className="px-2 py-1 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded text-slate-800 dark:text-slate-200"
                        />
                      </div>
                      <button
                        type="button"
                        onClick={() => setIsCustomDateOpen(false)}
                        className="mt-1 px-3 py-1 bg-indigo-600 text-white text-xs font-semibold rounded hover:bg-indigo-500"
                      >
                        Apply Filter
                      </button>
                    </div>
                  </>
                )}
              </div>
            )}

            <div className="h-4 w-px bg-slate-200 dark:bg-slate-800 mx-0.5 hidden sm:block" />

            {/* Segment Selector Pills */}
            <div className="hidden sm:inline-flex items-center p-0.5 rounded-lg bg-slate-100 dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700/80">
              <span className="pl-2 pr-1 text-slate-400">
                <Layers className="w-3.5 h-3.5" />
              </span>
              {segments.map((seg) => (
                <button
                  key={seg}
                  type="button"
                  onClick={() => setSelectedSegment(seg)}
                  className={`px-2.5 py-1 text-xs font-semibold rounded-md transition-all ${
                    selectedSegment === seg
                      ? 'bg-white dark:bg-indigo-600 text-indigo-700 dark:text-white shadow-xs'
                      : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  {seg}
                </button>
              ))}
            </div>

            {/* Channel Filter Dropdown */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setIsChannelOpen(!isChannelOpen)}
                className={`flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium rounded-lg border transition-colors ${
                  selectedChannel !== 'All'
                    ? 'border-indigo-400 dark:border-indigo-600 bg-indigo-50 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-300 font-semibold'
                    : 'border-slate-200 dark:border-slate-700/80 bg-white dark:bg-slate-800/80 text-slate-700 dark:text-slate-300 hover:bg-slate-50'
                }`}
              >
                <Zap className="w-3.5 h-3.5 text-amber-500" />
                <span>{selectedChannel === 'All' ? 'All Channels' : selectedChannel}</span>
                <ChevronDown className="w-3 h-3 text-slate-400" />
              </button>

              {isChannelOpen && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setIsChannelOpen(false)} />
                  <div className="absolute left-0 mt-1.5 w-52 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-xl py-1.5 z-50">
                    <div className="px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-400">Acquisition Channel</div>
                    {channels.map((chan) => (
                      <button
                        key={chan}
                        type="button"
                        onClick={() => {
                          setSelectedChannel(chan);
                          setIsChannelOpen(false);
                        }}
                        className={`w-full text-left px-3 py-1.5 text-xs ${
                          selectedChannel === chan
                            ? 'bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400 font-bold'
                            : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                        }`}
                      >
                        {chan}
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>

            {/* Region Dropdown */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setIsRegionOpen(!isRegionOpen)}
                className={`flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium rounded-lg border transition-colors ${
                  selectedRegion !== 'All'
                    ? 'border-indigo-400 dark:border-indigo-600 bg-indigo-50 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-300 font-semibold'
                    : 'border-slate-200 dark:border-slate-700/80 bg-white dark:bg-slate-800/80 text-slate-700 dark:text-slate-300 hover:bg-slate-50'
                }`}
              >
                <Globe2 className="w-3.5 h-3.5 text-blue-500" />
                <span>{selectedRegion === 'All' ? 'All Regions' : selectedRegion}</span>
                <ChevronDown className="w-3 h-3 text-slate-400" />
              </button>

              {isRegionOpen && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setIsRegionOpen(false)} />
                  <div className="absolute left-0 mt-1.5 w-44 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-xl py-1.5 z-50">
                    <div className="px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-400">Territory / Region</div>
                    {regions.map((reg) => (
                      <button
                        key={reg}
                        type="button"
                        onClick={() => {
                          setSelectedRegion(reg);
                          setIsRegionOpen(false);
                        }}
                        className={`w-full text-left px-3 py-1.5 text-xs ${
                          selectedRegion === reg
                            ? 'bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400 font-bold'
                            : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                        }`}
                      >
                        {reg}
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>

            {/* Rep Filter Dropdown */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setIsRepOpen(!isRepOpen)}
                className={`flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium rounded-lg border transition-colors ${
                  selectedRepId !== 'All'
                    ? 'border-indigo-400 dark:border-indigo-600 bg-indigo-50 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-300 font-semibold'
                    : 'border-slate-200 dark:border-slate-700/80 bg-white dark:bg-slate-800/80 text-slate-700 dark:text-slate-300 hover:bg-slate-50'
                }`}
              >
                <Users className="w-3.5 h-3.5 text-emerald-500" />
                <span>
                  {selectedRepId === 'All' ? 'All Reps' : salesReps.find((r) => r.id === selectedRepId)?.name || 'Rep'}
                </span>
                <ChevronDown className="w-3 h-3 text-slate-400" />
              </button>

              {isRepOpen && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setIsRepOpen(false)} />
                  <div className="absolute left-0 mt-1.5 w-56 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-xl py-1.5 z-50">
                    <div className="px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-400">Sales Quota Owner</div>
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedRepId('All');
                        setIsRepOpen(false);
                      }}
                      className={`w-full text-left px-3 py-1.5 text-xs ${
                        selectedRepId === 'All'
                          ? 'bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400 font-bold'
                          : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                      }`}
                    >
                      All Sales Representatives ({salesReps.length})
                    </button>
                    {salesReps.map((rep) => (
                      <button
                        key={rep.id}
                        type="button"
                        onClick={() => {
                          setSelectedRepId(rep.id);
                          setIsRepOpen(false);
                        }}
                        className={`w-full text-left px-3 py-1.5 text-xs flex items-center gap-2 ${
                          selectedRepId === rep.id
                            ? 'bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400 font-bold'
                            : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                        }`}
                      >
                        <img src={rep.avatar} alt={rep.name} className="w-4 h-4 rounded-full object-cover" />
                        <span>{rep.name}</span>
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>

            {/* Reset Filters CTA if active */}
            {activeFilterCount > 0 && (
              <button
                type="button"
                onClick={resetFilters}
                className="flex items-center gap-1 px-2.5 py-1.5 text-xs text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-lg transition-colors font-semibold"
                title="Reset all filters to default"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Reset ({activeFilterCount})</span>
              </button>
            )}

          </div>

          {/* Right: Venture Vitals Ribbon & Benchmark Switcher */}
          <div className="flex items-center gap-3">
            
            {/* Comparison Switcher */}
            <div className="inline-flex items-center p-0.5 rounded-lg bg-slate-100 dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700/80 text-[11px]">
              <button
                type="button"
                onClick={() => setComparisonMode('previous_period')}
                className={`px-2 py-1 rounded-md font-medium transition-all ${
                  comparisonMode === 'previous_period'
                    ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 font-bold shadow-xs'
                    : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
                }`}
              >
                vs Prev Period
              </button>
              <button
                type="button"
                onClick={() => setComparisonMode('target')}
                className={`px-2 py-1 rounded-md font-medium transition-all ${
                  comparisonMode === 'target'
                    ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 font-bold shadow-xs'
                    : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
                }`}
              >
                vs Board Target
              </button>
            </div>

            {/* Quick Metrics Badges */}
            <div className="hidden xl:flex items-center gap-2">
              <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-indigo-500/10 dark:bg-indigo-400/10 border border-indigo-500/20 text-indigo-600 dark:text-indigo-300 text-xs">
                <Target className="w-3.5 h-3.5 text-indigo-500" />
                <span className="font-semibold">{kpiMetrics.pipelineCoverage}x</span>
                <span className="text-[10px] text-slate-500 dark:text-slate-400">Quota Coverage</span>
              </div>

              <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-emerald-500/10 dark:bg-emerald-400/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-300 text-xs">
                <Activity className="w-3.5 h-3.5 text-emerald-500" />
                <span className="font-semibold">{kpiMetrics.runwayMonths} mo</span>
                <span className="text-[10px] text-slate-500 dark:text-slate-400">Runway</span>
              </div>
            </div>

          </div>

        </div>
      </div>
    </div>
  );
};
