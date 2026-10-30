import React from 'react';
import { Repeat, Info } from 'lucide-react';
import { cohortData } from '../../data/mockData';
import { useDashboard } from '../../context/DashboardContext';
import { formatCurrency } from '../../utils/formatters';

export const CohortHeatmap: React.FC = () => {
  const { currency, kpiMetrics } = useDashboard();

  const getHeatmapColor = (pct: number) => {
    if (pct === 0) return 'bg-slate-100/50 dark:bg-slate-800/30 text-slate-400';
    if (pct >= 120) return 'bg-emerald-600 dark:bg-emerald-500 text-white font-bold';
    if (pct >= 110) return 'bg-emerald-500/80 dark:bg-emerald-600/80 text-white font-bold';
    if (pct >= 100) return 'bg-emerald-500/40 dark:bg-emerald-700/50 text-emerald-950 dark:text-emerald-100 font-semibold';
    if (pct >= 95) return 'bg-blue-500/30 dark:bg-blue-800/40 text-blue-950 dark:text-blue-100';
    if (pct >= 90) return 'bg-amber-500/30 dark:bg-amber-800/40 text-amber-950 dark:text-amber-100';
    return 'bg-rose-500/30 dark:bg-rose-800/40 text-rose-950 dark:text-rose-100';
  };

  return (
    <div className="bg-white dark:bg-slate-900 rounded-xl p-5 border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col justify-between transition-colors">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="font-bold text-base text-slate-900 dark:text-white">
              Net Revenue Retention Cohort Matrix
            </h3>
            <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
              NRR {kpiMetrics.nrr}%
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Dollar retention % per acquisition cohort over 6 months showing organic expansion.
          </p>
        </div>

        <div className="flex items-center gap-1.5 text-xs text-slate-500 bg-slate-50 dark:bg-slate-800 px-2.5 py-1 rounded-lg">
          <Info className="w-3.5 h-3.5 text-indigo-500" />
          <span>&gt;100% indicates Net Negative Churn</span>
        </div>
      </div>

      {/* Cohort Heatmap Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-xs text-left">
          <thead>
            <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-400">
              <th className="pb-2 font-semibold">Cohort</th>
              <th className="pb-2 font-semibold text-right">Accounts</th>
              <th className="pb-2 font-semibold text-right">Initial MRR</th>
              <th className="pb-2 font-semibold text-center">M0</th>
              <th className="pb-2 font-semibold text-center">M1</th>
              <th className="pb-2 font-semibold text-center">M2</th>
              <th className="pb-2 font-semibold text-center">M3</th>
              <th className="pb-2 font-semibold text-center">M4</th>
              <th className="pb-2 font-semibold text-center">M5</th>
              <th className="pb-2 font-semibold text-center">M6</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
            {cohortData.map((row) => (
              <tr key={row.cohortMonth} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40 transition-colors">
                <td className="py-2.5 font-bold text-slate-800 dark:text-slate-200 whitespace-nowrap">
                  {row.cohortMonth}
                </td>
                <td className="py-2.5 text-right text-slate-600 dark:text-slate-400 font-medium">
                  {row.initialCount}
                </td>
                <td className="py-2.5 text-right font-mono text-slate-700 dark:text-slate-300">
                  {formatCurrency(row.initialMRR, currency, true)}
                </td>
                {row.retentionMonths.map((ret, mIdx) => (
                  <td key={mIdx} className="py-2.5 px-1 text-center">
                    <span
                      className={`inline-block w-12 py-1 rounded text-[11px] transition-all font-mono ${getHeatmapColor(
                        ret
                      )}`}
                    >
                      {ret > 0 ? `${ret}%` : '-'}
                    </span>
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Heatmap Legend */}
      <div className="flex flex-wrap items-center justify-between gap-2 pt-3 mt-3 border-t border-slate-100 dark:border-slate-800 text-xs">
        <div className="flex items-center gap-2">
          <Repeat className="w-3.5 h-3.5 text-emerald-500" />
          <span className="text-slate-500 text-[11px]">Legend:</span>
          <div className="flex items-center gap-1.5 text-[10px]">
            <span className="px-1.5 py-0.5 rounded bg-rose-500/30 text-rose-900 dark:text-rose-200">&lt;90%</span>
            <span className="px-1.5 py-0.5 rounded bg-amber-500/30 text-amber-900 dark:text-amber-200">90-95%</span>
            <span className="px-1.5 py-0.5 rounded bg-blue-500/30 text-blue-900 dark:text-blue-200">95-100%</span>
            <span className="px-1.5 py-0.5 rounded bg-emerald-500/50 text-emerald-950 dark:text-emerald-100 font-bold">100-110%</span>
            <span className="px-1.5 py-0.5 rounded bg-emerald-600 text-white font-bold">&gt;110%</span>
          </div>
        </div>

        <span className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400">
          Average 6-Month NRR: 122.4%
        </span>
      </div>

    </div>
  );
};
