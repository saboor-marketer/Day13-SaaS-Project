import React, { useState } from 'react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
} from 'recharts';
import { TrendingUp, BarChart2 } from 'lucide-react';
import { useDashboard } from '../../context/DashboardContext';
import { formatCurrency } from '../../utils/formatters';

export const RevenueGrowthChart: React.FC = () => {
  const { timeSeriesData, currency, darkMode } = useDashboard();
  const [metricView, setMetricView] = useState<'revenue_target' | 'mrr' | 'pipeline_burn'>('revenue_target');
  const [chartType, setChartType] = useState<'area' | 'line'>('area');

  const gridColor = darkMode ? '#1e293b' : '#f1f5f9';
  const textColor = darkMode ? '#94a3b8' : '#64748b';

  // Custom rich tooltip
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-slate-900/95 dark:bg-slate-950/95 backdrop-blur-md p-3 rounded-xl border border-slate-700/80 shadow-2xl text-xs text-white min-w-[200px]">
          <div className="font-bold text-slate-200 border-b border-slate-800 pb-1.5 mb-2 flex items-center justify-between">
            <span>{label}</span>
            <span className="text-[10px] text-indigo-400 font-semibold uppercase">Performance</span>
          </div>
          <div className="space-y-1.5">
            {payload.map((item: any, idx: number) => (
              <div key={idx} className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                  <span className="text-slate-300 font-medium">{item.name}:</span>
                </div>
                <span className="font-bold text-slate-100 font-mono">
                  {typeof item.value === 'number' && item.value > 1000
                    ? formatCurrency(item.value, currency, true)
                    : item.value}
                </span>
              </div>
            ))}
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-white dark:bg-slate-900 rounded-xl p-5 border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col justify-between transition-colors">
      
      {/* Chart Header & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="font-bold text-base text-slate-900 dark:text-white">
              Revenue Growth & Forecasting
            </h3>
            <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
              Live Trajectory
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Tracking actual monthly performance vs venture board targets and expansion.
          </p>
        </div>

        {/* View Switchers */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Metric Selector */}
          <div className="inline-flex items-center p-0.5 rounded-lg bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700/80 text-xs">
            <button
              type="button"
              onClick={() => setMetricView('revenue_target')}
              className={`px-2.5 py-1 rounded-md font-semibold transition-all ${
                metricView === 'revenue_target'
                  ? 'bg-white dark:bg-indigo-600 text-indigo-700 dark:text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900'
              }`}
            >
              Revenue vs Target
            </button>
            <button
              type="button"
              onClick={() => setMetricView('mrr')}
              className={`px-2.5 py-1 rounded-md font-semibold transition-all ${
                metricView === 'mrr'
                  ? 'bg-white dark:bg-indigo-600 text-indigo-700 dark:text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900'
              }`}
            >
              MRR & New ARR
            </button>
            <button
              type="button"
              onClick={() => setMetricView('pipeline_burn')}
              className={`px-2.5 py-1 rounded-md font-semibold transition-all ${
                metricView === 'pipeline_burn'
                  ? 'bg-white dark:bg-indigo-600 text-indigo-700 dark:text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900'
              }`}
            >
              Pipeline & Burn
            </button>
          </div>

          {/* Line vs Area Toggle */}
          <div className="inline-flex items-center p-0.5 rounded-lg bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700/80 text-xs">
            <button
              type="button"
              onClick={() => setChartType('area')}
              className={`p-1 rounded-md transition-all ${
                chartType === 'area'
                  ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-xs'
                  : 'text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'
              }`}
              title="Area Chart"
            >
              <TrendingUp className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={() => setChartType('line')}
              className={`p-1 rounded-md transition-all ${
                chartType === 'line'
                  ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-xs'
                  : 'text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'
              }`}
              title="Line Chart"
            >
              <BarChart2 className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Main Chart Canvas */}
      <div className="h-[310px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={timeSeriesData} margin={{ top: 10, right: 10, left: -15, bottom: 0 }}>
            <defs>
              <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#6366f1" stopOpacity={0.4} />
                <stop offset="95%" stopColor="#6366f1" stopOpacity={0.0} />
              </linearGradient>
              <linearGradient id="colorTarget" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#10b981" stopOpacity={0.0} />
              </linearGradient>
              <linearGradient id="colorMrr" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.4} />
                <stop offset="95%" stopColor="#06b6d4" stopOpacity={0.0} />
              </linearGradient>
              <linearGradient id="colorBurn" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#f43f5e" stopOpacity={0.0} />
              </linearGradient>
            </defs>

            <CartesianGrid strokeDasharray="3 3" stroke={gridColor} vertical={false} />
            
            <XAxis
              dataKey="label"
              stroke={textColor}
              fontSize={11}
              tickLine={false}
              axisLine={{ stroke: gridColor }}
            />
            
            <YAxis
              stroke={textColor}
              fontSize={11}
              tickLine={false}
              axisLine={false}
              tickFormatter={(v) => formatCurrency(v, currency, true)}
            />

            <Tooltip content={<CustomTooltip />} />
            <Legend
              wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }}
              iconType="circle"
            />

            {metricView === 'revenue_target' && (
              <>
                <Area
                  type="monotone"
                  dataKey="revenue"
                  name="Recognized Revenue"
                  stroke="#6366f1"
                  strokeWidth={2.5}
                  fillOpacity={1}
                  fill={chartType === 'area' ? 'url(#colorRev)' : 'none'}
                />
                <Line
                  type="monotone"
                  dataKey="target"
                  name="Target ARR Plan"
                  stroke="#10b981"
                  strokeWidth={2}
                  strokeDasharray="4 4"
                  dot={{ r: 3, fill: '#10b981' }}
                />
              </>
            )}

            {metricView === 'mrr' && (
              <>
                <Area
                  type="monotone"
                  dataKey="mrr"
                  name="Monthly Recurring (MRR)"
                  stroke="#06b6d4"
                  strokeWidth={2.5}
                  fillOpacity={1}
                  fill={chartType === 'area' ? 'url(#colorMrr)' : 'none'}
                />
                <Area
                  type="monotone"
                  dataKey="newArr"
                  name="New Net ARR Added"
                  stroke="#8b5cf6"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="none"
                />
              </>
            )}

            {metricView === 'pipeline_burn' && (
              <>
                <Area
                  type="monotone"
                  dataKey="pipelineAdded"
                  name="Pipeline Inflow"
                  stroke="#3b82f6"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill={chartType === 'area' ? 'url(#colorRev)' : 'none'}
                />
                <Line
                  type="monotone"
                  dataKey="burnRate"
                  name="Monthly Net Burn"
                  stroke="#f43f5e"
                  strokeWidth={2}
                  strokeDasharray="3 3"
                />
              </>
            )}
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Chart Footer Highlights */}
      <div className="grid grid-cols-3 gap-2 pt-3 mt-2 border-t border-slate-100 dark:border-slate-800 text-center">
        <div>
          <span className="text-[10px] text-slate-400 block uppercase font-medium">Q1 Projected ARR</span>
          <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
            {formatCurrency(timeSeriesData[timeSeriesData.length - 1]?.revenue * 12 || 0, currency, true)}
          </span>
        </div>
        <div>
          <span className="text-[10px] text-slate-400 block uppercase font-medium">Target Attainment</span>
          <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">106.4% Pace</span>
        </div>
        <div>
          <span className="text-[10px] text-slate-400 block uppercase font-medium">Pipeline Inflow</span>
          <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400">+28% MoM</span>
        </div>
      </div>

    </div>
  );
};
