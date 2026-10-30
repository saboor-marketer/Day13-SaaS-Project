import React from 'react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Cell,
} from 'recharts';
import { Zap, ShieldCheck } from 'lucide-react';
import { useDashboard } from '../../context/DashboardContext';
import { formatCurrency } from '../../utils/formatters';
import { LeadChannel } from '../../types';

export const ChannelEfficiencyChart: React.FC = () => {
  const { channelPerformance, currency, darkMode, selectedChannel, setSelectedChannel } = useDashboard();

  const gridColor = darkMode ? '#1e293b' : '#f1f5f9';
  const textColor = darkMode ? '#94a3b8' : '#64748b';

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-slate-900/95 dark:bg-slate-950/95 backdrop-blur-md p-3 rounded-xl border border-slate-700/80 shadow-2xl text-xs text-white min-w-[210px]">
          <div className="flex items-center gap-1.5 font-bold mb-2 pb-1.5 border-b border-slate-800">
            <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: data.color }} />
            <span>{data.channel}</span>
          </div>
          <div className="space-y-1 text-slate-300">
            <div className="flex justify-between">
              <span>Won Revenue:</span>
              <strong className="text-white font-mono">{formatCurrency(data.revenue, currency, true)}</strong>
            </div>
            <div className="flex justify-between">
              <span>Customer ACQ (CAC):</span>
              <strong className="text-amber-400 font-mono">{formatCurrency(data.cac, currency, true)}</strong>
            </div>
            <div className="flex justify-between">
              <span>Customer LTV:</span>
              <strong className="text-emerald-400 font-mono">{formatCurrency(data.ltv, currency, true)}</strong>
            </div>
            <div className="flex justify-between">
              <span>Channel ROI:</span>
              <strong className="text-indigo-400">{data.roi}%</strong>
            </div>
            <div className="flex justify-between">
              <span>Conv Rate:</span>
              <strong className="text-teal-400">{data.conversionRate}%</strong>
            </div>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-white dark:bg-slate-900 rounded-xl p-5 border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col justify-between transition-colors">
      
      {/* Header */}
      <div className="flex items-center justify-between gap-3 mb-3">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="font-bold text-base text-slate-900 dark:text-white">
              Channel Attribution & Unit ROI
            </h3>
            <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/20">
              CAC vs LTV
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Revenue velocity indexed against acquisition cost and ROI efficiency.
          </p>
        </div>

        {selectedChannel !== 'All' && (
          <button
            type="button"
            onClick={() => setSelectedChannel('All')}
            className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline"
          >
            Reset
          </button>
        )}
      </div>

      {/* Bar Chart */}
      <div className="h-[210px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={channelPerformance}
            margin={{ top: 10, right: 10, left: -20, bottom: 20 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke={gridColor} vertical={false} />
            <XAxis
              dataKey="channel"
              stroke={textColor}
              fontSize={10}
              tickLine={false}
              axisLine={{ stroke: gridColor }}
              interval={0}
              tickFormatter={(v) => v.split(' ')[0]}
            />
            <YAxis
              stroke={textColor}
              fontSize={10}
              tickLine={false}
              axisLine={false}
              tickFormatter={(v) => formatCurrency(v, currency, true)}
            />
            <Tooltip content={<CustomTooltip />} />
            <Bar
              dataKey="revenue"
              radius={[6, 6, 0, 0]}
              onClick={(entry: any) => entry?.channel && setSelectedChannel(entry.channel as LeadChannel)}
              cursor="pointer"
            >
              {channelPerformance.map((entry, index) => (
                <Cell
                  key={`bar-${index}`}
                  fill={entry.color}
                  opacity={
                    selectedChannel === 'All'
                      ? 0.9
                      : selectedChannel === entry.channel
                      ? 1
                      : 0.35
                  }
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Channel Efficiency Summary Table/List */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 pt-3 border-t border-slate-100 dark:border-slate-800 text-xs">
        <div className="flex items-center gap-2 p-1.5 rounded-lg bg-slate-50 dark:bg-slate-800/50">
          <Zap className="w-3.5 h-3.5 text-pink-500 shrink-0" />
          <div className="min-w-0">
            <span className="text-[10px] text-slate-400 block truncate">Top Engine</span>
            <span className="font-bold text-slate-800 dark:text-slate-200">PLG (14.8% Conv)</span>
          </div>
        </div>

        <div className="flex items-center gap-2 p-1.5 rounded-lg bg-slate-50 dark:bg-slate-800/50">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
          <div className="min-w-0">
            <span className="text-[10px] text-slate-400 block truncate">Lowest CAC</span>
            <span className="font-bold text-slate-800 dark:text-slate-200">{formatCurrency(1100, currency, true)}</span>
          </div>
        </div>

        <div className="flex items-center gap-2 p-1.5 rounded-lg bg-slate-50 dark:bg-slate-800/50 col-span-2 sm:col-span-1">
          <div className="w-3.5 h-3.5 rounded-full bg-indigo-500 flex items-center justify-center text-[9px] text-white font-bold shrink-0">
            ★
          </div>
          <div className="min-w-0">
            <span className="text-[10px] text-slate-400 block truncate">Highest ACV</span>
            <span className="font-bold text-slate-800 dark:text-slate-200">Outbound SDR</span>
          </div>
        </div>
      </div>

    </div>
  );
};
