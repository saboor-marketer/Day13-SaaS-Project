import React from 'react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
} from 'recharts';
import { useDashboard } from '../../context/DashboardContext';
import { formatCurrency } from '../../utils/formatters';

export const PipelineVelocityChart: React.FC = () => {
  const { filteredDeals, currency, darkMode } = useDashboard();

  const stages = [
    { key: 'lead', label: 'Lead' },
    { key: 'qualified', label: 'Qualified' },
    { key: 'demo', label: 'Demo' },
    { key: 'proposal', label: 'Proposal' },
    { key: 'negotiation', label: 'Negotiation' },
    { key: 'won', label: 'Won' },
  ];

  const stageData = stages.map((st) => {
    const dealsInStage = filteredDeals.filter((d) => d.stage === st.key);
    const totalVal = dealsInStage.reduce((s, d) => s + d.value, 0);
    const weightedVal = dealsInStage.reduce((s, d) => s + (d.value * d.probability) / 100, 0);
    const avgDays = dealsInStage.length > 0
      ? Math.round(dealsInStage.reduce((s, d) => s + d.salesCycleDays, 0) / dealsInStage.length)
      : 0;

    return {
      stage: st.label,
      totalValue: totalVal,
      weightedValue: Math.round(weightedVal),
      dealsCount: dealsInStage.length,
      avgDays,
    };
  });

  const gridColor = darkMode ? '#1e293b' : '#f1f5f9';
  const textColor = darkMode ? '#94a3b8' : '#64748b';

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-slate-900/95 dark:bg-slate-950/95 backdrop-blur-md p-3 rounded-xl border border-slate-700/80 shadow-2xl text-xs text-white min-w-[200px]">
          <div className="font-bold text-slate-200 border-b border-slate-800 pb-1 mb-2">
            Stage: {label}
          </div>
          <div className="space-y-1 text-slate-300">
            <div className="flex justify-between">
              <span>Total Pipeline:</span>
              <strong className="text-white font-mono">{formatCurrency(data.totalValue, currency, true)}</strong>
            </div>
            <div className="flex justify-between">
              <span>Weighted Value:</span>
              <strong className="text-indigo-400 font-mono">{formatCurrency(data.weightedValue, currency, true)}</strong>
            </div>
            <div className="flex justify-between">
              <span>Deal Count:</span>
              <strong className="text-emerald-400">{data.dealsCount} deals</strong>
            </div>
            <div className="flex justify-between">
              <span>Avg Velocity:</span>
              <strong className="text-amber-400">{data.avgDays} days</strong>
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
      <div className="flex items-center justify-between gap-3 mb-4">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="font-bold text-base text-slate-900 dark:text-white">
              Stage Velocity & Pipeline Weight
            </h3>
            <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20">
              Deal Stages
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Total active contract value vs probability-weighted forecast by sales stage.
          </p>
        </div>
      </div>

      {/* Bar Chart */}
      <div className="h-[260px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={stageData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke={gridColor} vertical={false} />
            <XAxis dataKey="stage" stroke={textColor} fontSize={11} tickLine={false} axisLine={{ stroke: gridColor }} />
            <YAxis stroke={textColor} fontSize={11} tickLine={false} axisLine={false} tickFormatter={(v) => formatCurrency(v, currency, true)} />
            <Tooltip content={<CustomTooltip />} />
            <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '8px' }} />
            <Bar dataKey="totalValue" name="Total Pipeline ACV" fill="#6366f1" radius={[4, 4, 0, 0]} opacity={0.65} />
            <Bar dataKey="weightedValue" name="Weighted Forecast" fill="#10b981" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

    </div>
  );
};
