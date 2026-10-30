import React from 'react';
import { Filter, Clock, ArrowDown, HelpCircle } from 'lucide-react';
import { useDashboard } from '../../context/DashboardContext';
import { formatCurrency, stageColorMap } from '../../utils/formatters';

export const FunnelChart: React.FC = () => {
  const { funnelData, currency, setActiveTab } = useDashboard();

  const maxCount = Math.max(...funnelData.map((d) => d.count), 1);

  return (
    <div className="bg-white dark:bg-slate-900 rounded-xl p-5 border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col justify-between transition-colors">
      
      {/* Header */}
      <div className="flex items-center justify-between gap-3 mb-4">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="font-bold text-base text-slate-900 dark:text-white">
              Venture Conversion Funnel
            </h3>
            <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20">
              End-to-End
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Stage velocity, volume drop-off, and weighted value conversion.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setActiveTab('deals')}
          className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:text-indigo-500 flex items-center gap-1"
        >
          <span>View Deals</span>
          <Filter className="w-3 h-3" />
        </button>
      </div>

      {/* Funnel Steps */}
      <div className="space-y-3.5 my-auto">
        {funnelData.map((item, idx) => {
          const widthPercent = Math.max(22, (item.count / maxCount) * 100);
          const stageColors = stageColorMap[item.stage] || stageColorMap.lead;
          const nextStage = funnelData[idx + 1];

          return (
            <div
              key={item.stage}
              className="relative group transition-all"
            >
              {/* Stage Info Row */}
              <div className="flex items-center justify-between text-xs mb-1">
                <div className="flex items-center gap-2">
                  <span className={`w-2.5 h-2.5 rounded-full ${stageColors.bg} border ${stageColors.border}`} />
                  <span className="font-bold text-slate-800 dark:text-slate-200">
                    {item.label}
                  </span>
                  {item.avgDaysInStage > 0 && (
                    <span className="flex items-center gap-0.5 text-[10px] text-slate-400 bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded">
                      <Clock className="w-2.5 h-2.5" />
                      {item.avgDaysInStage}d
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-3">
                  <span className="font-bold text-slate-900 dark:text-white">
                    {item.count} <span className="text-[10px] text-slate-400 font-normal">deals</span>
                  </span>
                  <span className="text-slate-500 dark:text-slate-400 font-semibold font-mono">
                    {formatCurrency(item.value, currency, true)}
                  </span>
                </div>
              </div>

              {/* Funnel Bar */}
              <div className="relative w-full h-7 bg-slate-100 dark:bg-slate-800/80 rounded-lg overflow-hidden flex items-center px-3 border border-slate-200/60 dark:border-slate-700/60">
                <div
                  className={`absolute left-0 top-0 bottom-0 rounded-lg transition-all duration-500 ${
                    item.stage === 'won'
                      ? 'bg-gradient-to-r from-emerald-500 to-teal-400 opacity-90'
                      : item.stage === 'proposal'
                      ? 'bg-gradient-to-r from-amber-500 to-amber-400 opacity-80'
                      : item.stage === 'demo'
                      ? 'bg-gradient-to-r from-indigo-500 to-blue-500 opacity-80'
                      : item.stage === 'qualified'
                      ? 'bg-gradient-to-r from-blue-500 to-sky-400 opacity-75'
                      : 'bg-gradient-to-r from-slate-400 to-slate-500 opacity-60'
                  }`}
                  style={{ width: `${widthPercent}%` }}
                />

                <div className="relative z-10 flex items-center justify-between w-full text-[11px] font-bold text-slate-900 dark:text-white">
                  <span className="drop-shadow-xs">
                    {Math.round(widthPercent)}% Capacity
                  </span>
                  {idx > 0 && (
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-black/30 text-white backdrop-blur-xs font-mono">
                      {item.conversionRate}% from prev
                    </span>
                  )}
                </div>
              </div>

              {/* Conversion Drop-off Connector */}
              {nextStage && (
                <div className="flex items-center justify-center my-0.5 text-[10px] text-slate-400 font-medium">
                  <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60">
                    <ArrowDown className="w-2.5 h-2.5 text-rose-500" />
                    <span>Drop-off: <strong className="text-rose-600 dark:text-rose-400">{item.dropOffRate}%</strong></span>
                    <span className="text-slate-300 dark:text-slate-600">|</span>
                    <span>Conv: <strong className="text-emerald-600 dark:text-emerald-400">{item.conversionRate}%</strong></span>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Funnel Summary Footer */}
      <div className="pt-3 mt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
        <span className="text-slate-500 flex items-center gap-1">
          <HelpCircle className="w-3 h-3" />
          Overall Lead-to-Won:
        </span>
        <span className="font-bold text-emerald-600 dark:text-emerald-400 text-sm">
          {funnelData.length > 0
            ? `${((funnelData[funnelData.length - 1].count / Math.max(1, funnelData[0].count)) * 100).toFixed(1)}% Velocity`
            : '11.6%'}
        </span>
      </div>

    </div>
  );
};
