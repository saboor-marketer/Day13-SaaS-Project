import React, { useState } from 'react';
import {
  TrendingUp,
  Search,
  Plus,
  FileSpreadsheet,
  Bell,
  Sun,
  Moon,
  ChevronDown,
  Building2,
  Sparkles,
} from 'lucide-react';
import { useDashboard } from '../context/DashboardContext';
import { VentureStage } from '../types';
import { CurrencyCode } from '../utils/formatters';

export const Header: React.FC = () => {
  const {
    ventureStage,
    setVentureStage,
    currency,
    setCurrency,
    darkMode,
    toggleDarkMode,
    searchQuery,
    setSearchQuery,
    setIsNewDealModalOpen,
    setIsReportModalOpen,
    setIsNotificationsOpen,
    alerts,
    activeTab,
    setActiveTab,
  } = useDashboard();

  const [isPersonaOpen, setIsPersonaOpen] = useState(false);
  const [isCurrencyOpen, setIsCurrencyOpen] = useState(false);

  const personas: Array<{ stage: VentureStage; badge: string; desc: string }> = [
    { stage: 'Series A SaaS', badge: '$12M Raised', desc: 'B2B Quota-Carrying Model' },
    { stage: 'Seed PLG', badge: '$3.5M Seed', desc: 'Product-Led PQL Motion' },
    { stage: 'Enterprise AI', badge: '$18M Series A', desc: 'High ACV ($100k+) AI Infrastructure' },
    { stage: 'Fintech Scaleup', badge: '$35M Series B', desc: 'High Transaction Scale' },
  ];

  const unreadAlertsCount = alerts.filter((a) => !a.isRead).length;

  return (
    <header className="sticky top-0 z-30 bg-white/90 dark:bg-[#0c1222]/90 backdrop-blur-md border-b border-slate-200 dark:border-slate-800/80 transition-colors">
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          
          {/* Logo & Persona Selector */}
          <div className="flex items-center gap-4 min-w-0">
            <div className="flex items-center gap-3">
              <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-cyan-400 text-white shadow-md shadow-indigo-500/20">
                <TrendingUp className="w-5 h-5" />
                <span className="absolute -top-1 -right-1 flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
                </span>
              </div>
              <div className="hidden sm:block">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-lg tracking-tight bg-gradient-to-r from-slate-900 to-slate-700 dark:from-white dark:to-slate-300 bg-clip-text text-transparent">
                    VenturePulse
                  </span>
                  <span className="px-1.5 py-0.5 text-[10px] font-semibold bg-indigo-500/10 dark:bg-indigo-400/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20 rounded-md">
                    PRO
                  </span>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400">Sales Intelligence & Velocity</p>
              </div>
            </div>

            <div className="hidden md:block h-6 w-px bg-slate-200 dark:bg-slate-800 mx-1" />

            {/* Venture Persona Switcher Dropdown */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setIsPersonaOpen(!isPersonaOpen)}
                className="flex items-center gap-2 px-3 py-1.5 text-xs font-medium rounded-lg border border-slate-200 dark:border-slate-700/80 bg-slate-50/80 dark:bg-slate-800/60 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 transition-colors shadow-xs"
              >
                <Building2 className="w-3.5 h-3.5 text-indigo-500" />
                <span className="font-semibold text-slate-900 dark:text-white">{ventureStage}</span>
                <span className="hidden lg:inline text-slate-400">|</span>
                <span className="hidden lg:inline text-[11px] text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/60 px-1.5 py-0.5 rounded">
                  {personas.find((p) => p.stage === ventureStage)?.badge}
                </span>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
              </button>

              {isPersonaOpen && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setIsPersonaOpen(false)} />
                  <div className="absolute left-0 mt-2 w-72 rounded-xl bg-white dark:bg-slate-900 shadow-xl border border-slate-200 dark:border-slate-800 py-2 z-50 animate-in fade-in zoom-in-95 duration-100">
                    <div className="px-3 py-1.5 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                      Select Venture Stage Persona
                    </div>
                    {personas.map((item) => (
                      <button
                        key={item.stage}
                        type="button"
                        onClick={() => {
                          setVentureStage(item.stage);
                          setIsPersonaOpen(false);
                        }}
                        className={`w-full text-left px-3 py-2 text-xs flex flex-col gap-0.5 hover:bg-slate-100 dark:hover:bg-slate-800/80 transition-colors ${
                          ventureStage === item.stage
                            ? 'bg-indigo-50/70 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 font-semibold'
                            : 'text-slate-700 dark:text-slate-300'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span>{item.stage}</span>
                          <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                            {item.badge}
                          </span>
                        </div>
                        <span className="text-[11px] text-slate-400 font-normal">{item.desc}</span>
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Search Bar */}
          <div className="flex-1 max-w-md hidden md:block">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search deals, companies, reps, tags..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-1.5 text-xs bg-slate-100/80 dark:bg-slate-800/70 border border-transparent dark:border-slate-700/60 rounded-lg text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:border-indigo-500 focus:bg-white dark:focus:bg-slate-900 transition-all"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[10px] text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                >
                  ✕
                </button>
              )}
            </div>
          </div>

          {/* Right Action Tools */}
          <div className="flex items-center gap-2">
            
            {/* Currency selector */}
            <div className="relative hidden sm:block">
              <button
                type="button"
                onClick={() => setIsCurrencyOpen(!isCurrencyOpen)}
                className="px-2 py-1.5 text-xs font-semibold rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/60 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                {currency}
              </button>
              {isCurrencyOpen && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setIsCurrencyOpen(false)} />
                  <div className="absolute right-0 mt-1 w-24 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg shadow-lg py-1 z-50">
                    {(['USD', 'EUR', 'GBP'] as CurrencyCode[]).map((c) => (
                      <button
                        key={c}
                        onClick={() => {
                          setCurrency(c);
                          setIsCurrencyOpen(false);
                        }}
                        className={`w-full text-left px-3 py-1.5 text-xs ${
                          currency === c
                            ? 'bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 font-bold'
                            : 'hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300'
                        }`}
                      >
                        {c}
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>

            {/* Simulator CTA */}
            <button
              type="button"
              onClick={() => setActiveTab('simulator')}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg border transition-all ${
                activeTab === 'simulator'
                  ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white border-transparent shadow-sm shadow-purple-500/20'
                  : 'border-purple-200 dark:border-purple-800/60 bg-purple-50/50 dark:bg-purple-950/30 text-purple-700 dark:text-purple-300 hover:bg-purple-100 dark:hover:bg-purple-900/50'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 text-purple-500 dark:text-purple-400" />
              <span className="hidden sm:inline">What-If</span> Simulator
            </button>

            {/* Report Export */}
            <button
              type="button"
              onClick={() => setIsReportModalOpen(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800/80 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors shadow-xs"
              title="Export Executive Report & Summary"
            >
              <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-500" />
              <span className="hidden lg:inline">Report / Export</span>
            </button>

            {/* Notifications Alert Bell */}
            <button
              type="button"
              onClick={() => setIsNotificationsOpen(true)}
              className="relative p-2 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800/80 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
              title="Venture Alerts & Activity"
            >
              <Bell className="w-4 h-4" />
              {unreadAlertsCount > 0 && (
                <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-rose-500 text-[9px] font-bold text-white shadow-xs">
                  {unreadAlertsCount}
                </span>
              )}
            </button>

            {/* Dark / Light Toggle */}
            <button
              type="button"
              onClick={toggleDarkMode}
              className="p-2 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800/80 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
              title={darkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            >
              {darkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-indigo-600" />}
            </button>

            {/* Add Deal Primary Button */}
            <button
              type="button"
              onClick={() => setIsNewDealModalOpen(true)}
              className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-bold rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white shadow-sm shadow-indigo-600/30 transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              <Plus className="w-4 h-4" />
              <span>Add Deal</span>
            </button>
          </div>

        </div>
      </div>
    </header>
  );
};
