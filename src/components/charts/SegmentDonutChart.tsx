import React, { useState } from 'react';
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from 'recharts';
import { ArrowUpRight } from 'lucide-react';
import { useDashboard } from '../../context/DashboardContext';
import { formatCurrency, formatPercent } from '../../utils/formatters';
import { CustomerSegment } from '../../types';

export const SegmentDonutChart: React.FC = () => {
  const { segmentBreakdown, currency, selectedSegment, setSelectedSegment, kpiMetrics } = useDashboard();
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-slate-900/95 dark:bg-slate-950/95 backdrop-blur-md p-2.5 rounded-xl border border-slate-700/80 shadow-xl text-xs text-white">
          <div className="flex items-center gap-1.5 font-bold mb-1">
            <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: data.color }} />
            <span>{data.name} Segment</span>
          </div>
          <div className="text-slate-300 space-y-0.5">
            <div>Revenue: <strong className="text-white font-mono">{formatCurrency(data.value, currency, true)}</strong></div>
            <div>Deals: <strong className="text-white">{data.dealsCount}</strong> ({data.percentage}%)</div>
            <div>Avg Deal ACV: <strong className="text-white font-mono">{formatCurrency(data.avgDealSize, currency, true)}</strong></div>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-white dark:bg-slate-900 rounded-xl p-5 border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col justify-between transition-colors">
      
      {/* Header */}
      <div className="flex items-center justify-between gap-3 mb-2">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="font-bold text-base text-slate-900 dark:text-white">
              Revenue by Segment
            </h3>
            <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20">
              ACV Distribution
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Breakdown across Enterprise, Mid-Market, SMB, and Startup.
          </p>
        </div>

        {selectedSegment !== 'All' && (
          <button
            type="button"
            onClick={() => setSelectedSegment('All')}
            className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline"
          >
            Show All
          </button>
        )}
      </div>

      {/* Donut Chart & Center Info */}
      <div className="relative h-[220px] w-full flex items-center justify-center my-1">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Tooltip content={<CustomTooltip />} />
            <Pie
              data={segmentBreakdown}
              cx="50%"
              cy="50%"
              innerRadius={62}
              outerRadius={88}
              paddingAngle={4}
              dataKey="value"
              onMouseEnter={(_, index) => setActiveIndex(index)}
              onMouseLeave={() => setActiveIndex(null)}
              onClick={(entry) => setSelectedSegment(entry.name as CustomerSegment)}
              cursor="pointer"
            >
              {segmentBreakdown.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={entry.color}
                  stroke="transparent"
                  opacity={
                    selectedSegment === 'All'
                      ? activeIndex === null || activeIndex === index
                        ? 1
                        : 0.6
                      : selectedSegment === entry.name
                      ? 1
                      : 0.35
                  }
                  style={{
                    filter:
                      activeIndex === index || selectedSegment === entry.name
                        ? `drop-shadow(0 0 8px ${entry.color}80)`
                        : 'none',
                    transition: 'all 0.3s ease',
                  }}
                />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>

        {/* Center Text in Donut */}
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none text-center">
          <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
            Total ARR
          </span>
          <span className="text-lg font-black text-slate-900 dark:text-white tracking-tight">
            {formatCurrency(kpiMetrics.arr, currency, true)}
          </span>
          <span className="text-[10px] text-emerald-500 font-bold">
            +{kpiMetrics.arrGrowthMoM}% YoY
          </span>
        </div>
      </div>

      {/* Segment Legends with interactive click */}
      <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
        {segmentBreakdown.map((item) => {
          const isSelected = selectedSegment === item.name;
          return (
            <button
              key={item.name}
              type="button"
              onClick={() => setSelectedSegment(isSelected ? 'All' : (item.name as CustomerSegment))}
              className={`text-left p-2 rounded-lg border transition-all ${
                isSelected
                  ? 'border-indigo-500 bg-indigo-50/60 dark:bg-indigo-950/40 shadow-2xs'
                  : 'border-slate-100 dark:border-slate-800/80 hover:bg-slate-50 dark:hover:bg-slate-800/60'
              }`}
            >
              <div className="flex items-center justify-between text-xs mb-1">
                <div className="flex items-center gap-1.5 font-bold text-slate-800 dark:text-slate-200">
                  <span className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }} />
                  <span>{item.name}</span>
                </div>
                <span className="font-bold text-slate-900 dark:text-white font-mono text-[11px]">
                  {item.percentage}%
                </span>
              </div>

              <div className="flex items-center justify-between text-[10px] text-slate-400">
                <span>{formatCurrency(item.value, currency, true)}</span>
                <span className="text-emerald-600 dark:text-emerald-400 font-semibold flex items-center">
                  <ArrowUpRight className="w-2.5 h-2.5" />
                  {formatPercent(item.growth, false)}
                </span>
              </div>
            </button>
          );
        })}
      </div>

    </div>
  );
};
