import React from 'react';
import { Award, Trophy, ArrowUpRight, Filter } from 'lucide-react';
import { useDashboard } from '../../context/DashboardContext';
import { formatCurrency } from '../../utils/formatters';

export const RepLeaderboard: React.FC = () => {
  const { salesReps, currency, selectedRepId, setSelectedRepId } = useDashboard();

  // Sort by percentage achieved
  const sortedReps = [...salesReps].sort((a, b) => b.achieved / b.quota - a.achieved / a.quota);

  return (
    <div className="bg-white dark:bg-slate-900 rounded-xl p-5 border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col justify-between transition-colors">
      
      {/* Header */}
      <div className="flex items-center justify-between gap-3 mb-4">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="font-bold text-base text-slate-900 dark:text-white">
              Sales Quota Leaderboard
            </h3>
            <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
              Q1 Attainment
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Individual quota tracking, win rate, and active pipeline ownership.
          </p>
        </div>

        {selectedRepId !== 'All' && (
          <button
            type="button"
            onClick={() => setSelectedRepId('All')}
            className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1"
          >
            <Filter className="w-3 h-3" />
            Show All Reps
          </button>
        )}
      </div>

      {/* Reps List */}
      <div className="space-y-3.5 my-auto">
        {sortedReps.map((rep, idx) => {
          const attainmentPct = Math.round((rep.achieved / Math.max(1, rep.quota)) * 100);
          const isSelected = selectedRepId === rep.id;
          const isTop = idx === 0;

          return (
            <div
              key={rep.id}
              onClick={() => setSelectedRepId(isSelected ? 'All' : rep.id)}
              className={`p-3 rounded-xl border transition-all cursor-pointer ${
                isSelected
                  ? 'border-indigo-500 bg-indigo-50/50 dark:bg-indigo-950/40 shadow-sm ring-1 ring-indigo-500'
                  : 'border-slate-100 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 bg-slate-50/50 dark:bg-slate-800/30'
              }`}
            >
              {/* Rep Top Row */}
              <div className="flex items-center justify-between gap-3 mb-2">
                <div className="flex items-center gap-2.5">
                  <div className="relative">
                    <img
                      src={rep.avatar}
                      alt={rep.name}
                      className="w-8 h-8 rounded-full object-cover border border-slate-200 dark:border-slate-700"
                    />
                    {isTop && (
                      <div className="absolute -top-1.5 -right-1.5 w-4 h-4 rounded-full bg-amber-500 text-white flex items-center justify-center text-[9px] shadow-xs">
                        <Trophy className="w-2.5 h-2.5" />
                      </div>
                    )}
                  </div>

                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="font-bold text-xs text-slate-900 dark:text-white">
                        {rep.name}
                      </span>
                      <span className={`text-[10px] font-semibold px-1.5 py-0.2 rounded ${
                        rep.status === 'Top Performer'
                          ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-400'
                          : rep.status === 'On Track'
                          ? 'bg-blue-100 text-blue-700 dark:bg-blue-950/60 dark:text-blue-400'
                          : 'bg-amber-100 text-amber-700 dark:bg-amber-950/60 dark:text-amber-400'
                      }`}>
                        {rep.status}
                      </span>
                    </div>
                    <span className="text-[11px] text-slate-400">{rep.role}</span>
                  </div>
                </div>

                <div className="text-right">
                  <div className="flex items-baseline justify-end gap-1">
                    <span className="text-sm font-black text-slate-900 dark:text-white">
                      {formatCurrency(rep.achieved, currency, true)}
                    </span>
                    <span className="text-[11px] text-slate-400 font-medium">
                      / {formatCurrency(rep.quota, currency, true)}
                    </span>
                  </div>
                  <span className="text-[11px] font-bold text-indigo-600 dark:text-indigo-400 font-mono">
                    {attainmentPct}% Quota
                  </span>
                </div>
              </div>

              {/* Attainment Progress Bar */}
              <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-1.5 overflow-hidden mb-2">
                <div
                  className={`h-full rounded-full transition-all duration-700 ${
                    attainmentPct >= 100
                      ? 'bg-gradient-to-r from-emerald-500 to-teal-400'
                      : attainmentPct >= 80
                      ? 'bg-gradient-to-r from-indigo-500 to-blue-400'
                      : 'bg-gradient-to-r from-amber-500 to-yellow-400'
                  }`}
                  style={{ width: `${Math.min(100, attainmentPct)}%` }}
                />
              </div>

              {/* Sub metrics */}
              <div className="flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400">
                <span>Wins: <strong className="text-slate-700 dark:text-slate-200">{rep.dealsClosed} deals</strong></span>
                <span>Win Rate: <strong className="text-slate-700 dark:text-slate-200">{rep.winRate}%</strong></span>
                <span>Pipeline: <strong className="text-slate-700 dark:text-slate-200">{formatCurrency(rep.pipelineValue, currency, true)}</strong></span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Footer */}
      <div className="pt-3 mt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
        <span className="text-slate-400 flex items-center gap-1">
          <Award className="w-3.5 h-3.5 text-indigo-500" />
          Team Average Attainment:
        </span>
        <span className="font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1">
          98.2%
          <ArrowUpRight className="w-3 h-3 text-emerald-500" />
        </span>
      </div>

    </div>
  );
};
