import React from 'react';
import {
  X,
  Printer,
  Download,
  Building2,
  CheckCircle2,
} from 'lucide-react';
import { useDashboard } from '../../context/DashboardContext';
import { formatCurrency, formatPercent } from '../../utils/formatters';

export const ExecutiveReportModal: React.FC = () => {
  const {
    isReportModalOpen,
    setIsReportModalOpen,
    ventureStage,
    kpiMetrics,
    currency,
    segmentBreakdown,
    salesReps,
    filteredDeals,
  } = useDashboard();

  if (!isReportModalOpen) return null;

  const handlePrint = () => {
    window.print();
  };

  const exportJSON = () => {
    const data = {
      ventureStage,
      generatedAt: new Date().toISOString(),
      kpiMetrics,
      segmentBreakdown,
      salesReps,
      deals: filteredDeals,
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `venturepulse_report_${ventureStage.replace(/\s+/g, '_')}.json`;
    link.click();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-slate-900/70 backdrop-blur-xs"
        onClick={() => setIsReportModalOpen(false)}
      />

      <div className="relative w-full max-w-4xl bg-white dark:bg-[#0f172a] rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden z-10 max-h-[90vh] flex flex-col justify-between">
        
        {/* Header Actions */}
        <div className="p-4 sm:p-5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-slate-900/50">
          <div className="flex items-center gap-2">
            <Building2 className="w-5 h-5 text-indigo-600" />
            <span className="font-bold text-sm text-slate-900 dark:text-white">
              Executive Sales Report & Board Summary
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={exportJSON}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-50 transition-colors"
            >
              <Download className="w-3.5 h-3.5 text-indigo-500" />
              <span>Export JSON</span>
            </button>
            <button
              type="button"
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white transition-colors shadow-xs"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print / PDF</span>
            </button>
            <button
              type="button"
              onClick={() => setIsReportModalOpen(false)}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Document Body */}
        <div className="p-6 sm:p-8 space-y-6 overflow-y-auto print:p-0">
          
          {/* Header Title & Date */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
            <div>
              <div className="text-xs uppercase font-bold text-indigo-600 dark:text-indigo-400 tracking-wider">
                VenturePulse Executive Intelligence
              </div>
              <h1 className="text-2xl font-black text-slate-900 dark:text-white mt-0.5">
                Q1 Sales Performance & Runway Report
              </h1>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Persona Profile: <strong className="text-slate-800 dark:text-slate-200">{ventureStage}</strong> • Generated on {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
              </p>
            </div>

            <div className="text-right">
              <span className="text-[10px] text-slate-400 uppercase font-semibold block">Overall ARR Attainment</span>
              <span className="text-2xl font-black text-emerald-600 dark:text-emerald-400 font-mono">
                {Math.round((kpiMetrics.arr / Math.max(1, kpiMetrics.arrTarget)) * 100)}%
              </span>
            </div>
          </div>

          {/* Key Executive Highlights */}
          <div className="bg-slate-50 dark:bg-slate-800/40 p-4 rounded-xl border border-slate-200/80 dark:border-slate-700/60 space-y-2">
            <h3 className="font-bold text-xs uppercase tracking-wider text-slate-400">
              Executive Highlights & Board Takeaways
            </h3>
            <ul className="space-y-1.5 text-xs text-slate-700 dark:text-slate-300">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                <span>Current ARR reached <strong>{formatCurrency(kpiMetrics.arr, currency, false)}</strong>, up <strong>{formatPercent(kpiMetrics.arrGrowthMoM, true)} MoM</strong>.</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                <span>Sales pipeline stands at <strong>{formatCurrency(kpiMetrics.pipelineValue, currency, false)}</strong> with healthy <strong>{kpiMetrics.pipelineCoverage}x Quota Coverage</strong>.</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                <span>Unit economics remain world-class at <strong>{kpiMetrics.ltvCacRatio}x LTV:CAC</strong> with <strong>{kpiMetrics.nrr}% NRR</strong> expansion.</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                <span>Capital runway extended to <strong>{kpiMetrics.runwayMonths} months</strong> with a controlled <strong>{kpiMetrics.burnMultiple}x Burn Multiple</strong>.</span>
              </li>
            </ul>
          </div>

          {/* 6 Key KPIs Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            <div className="p-3 rounded-lg border border-slate-200 dark:border-slate-800">
              <span className="text-[10px] text-slate-400 uppercase font-semibold">ARR</span>
              <div className="text-base font-bold text-slate-900 dark:text-white font-mono">{formatCurrency(kpiMetrics.arr, currency, true)}</div>
            </div>
            <div className="p-3 rounded-lg border border-slate-200 dark:border-slate-800">
              <span className="text-[10px] text-slate-400 uppercase font-semibold">MRR</span>
              <div className="text-base font-bold text-slate-900 dark:text-white font-mono">{formatCurrency(kpiMetrics.mrr, currency, true)}</div>
            </div>
            <div className="p-3 rounded-lg border border-slate-200 dark:border-slate-800">
              <span className="text-[10px] text-slate-400 uppercase font-semibold">Win Rate</span>
              <div className="text-base font-bold text-slate-900 dark:text-white font-mono">{kpiMetrics.winRate}%</div>
            </div>
            <div className="p-3 rounded-lg border border-slate-200 dark:border-slate-800">
              <span className="text-[10px] text-slate-400 uppercase font-semibold">LTV : CAC</span>
              <div className="text-base font-bold text-emerald-600 dark:text-emerald-400 font-mono">{kpiMetrics.ltvCacRatio}x</div>
            </div>
            <div className="p-3 rounded-lg border border-slate-200 dark:border-slate-800">
              <span className="text-[10px] text-slate-400 uppercase font-semibold">Net Retention (NRR)</span>
              <div className="text-base font-bold text-indigo-600 dark:text-indigo-400 font-mono">{kpiMetrics.nrr}%</div>
            </div>
            <div className="p-3 rounded-lg border border-slate-200 dark:border-slate-800">
              <span className="text-[10px] text-slate-400 uppercase font-semibold">Runway</span>
              <div className="text-base font-bold text-slate-900 dark:text-white font-mono">{kpiMetrics.runwayMonths} Mo</div>
            </div>
          </div>

          {/* Segment & Rep Attainment Tables */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Segment Breakdown */}
            <div className="border border-slate-200 dark:border-slate-800 rounded-xl p-4">
              <h4 className="font-bold text-xs text-slate-900 dark:text-white mb-2">Segment Contribution</h4>
              <div className="space-y-1.5 text-xs">
                {segmentBreakdown.map((s) => (
                  <div key={s.name} className="flex justify-between py-1 border-b border-slate-100 dark:border-slate-800/60">
                    <span className="text-slate-600 dark:text-slate-300">{s.name}</span>
                    <span className="font-bold text-slate-900 dark:text-white font-mono">{formatCurrency(s.value, currency, true)} ({s.percentage}%)</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Reps Summary */}
            <div className="border border-slate-200 dark:border-slate-800 rounded-xl p-4">
              <h4 className="font-bold text-xs text-slate-900 dark:text-white mb-2">Sales Quota Performance</h4>
              <div className="space-y-1.5 text-xs">
                {salesReps.slice(0, 4).map((r) => (
                  <div key={r.id} className="flex justify-between py-1 border-b border-slate-100 dark:border-slate-800/60">
                    <span className="text-slate-600 dark:text-slate-300">{r.name}</span>
                    <span className="font-bold text-slate-900 dark:text-white font-mono">
                      {Math.round((r.achieved / Math.max(1, r.quota)) * 100)}% Quota
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
