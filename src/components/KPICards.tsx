import React from 'react';
import {
  DollarSign,
  PieChart,
  Zap,
  Repeat,
  ShieldCheck,
  Flame,
  ArrowUpRight,
  ArrowDownRight,
  HelpCircle,
} from 'lucide-react';
import { useDashboard } from '../context/DashboardContext';
import { formatCurrency, formatPercent } from '../utils/formatters';

export const KPICards: React.FC = () => {
  const { kpiMetrics, currency, comparisonMode, setActiveTab } = useDashboard();

  const cards = [
    {
      id: 'arr',
      title: 'Annual Recurring Revenue (ARR)',
      tooltip: 'Contracted recurring revenue normalized over a 12-month period.',
      value: formatCurrency(kpiMetrics.arr, currency, true),
      subValue: `${formatCurrency(kpiMetrics.mrr, currency, true)} MRR`,
      delta: kpiMetrics.arrGrowthMoM,
      deltaLabel: comparisonMode === 'previous_period' ? 'vs last period' : 'vs target pace',
      isPositive: kpiMetrics.arrGrowthMoM >= 0,
      icon: DollarSign,
      iconColor: 'from-emerald-500 to-teal-600',
      progress: Math.min(100, Math.round((kpiMetrics.arr / Math.max(1, kpiMetrics.arrTarget)) * 100)),
      progressLabel: `${Math.round((kpiMetrics.arr / Math.max(1, kpiMetrics.arrTarget)) * 100)}% of ${formatCurrency(kpiMetrics.arrTarget, currency, true)} Target`,
      actionTab: 'overview' as const,
    },
    {
      id: 'pipeline',
      title: 'Active Sales Pipeline',
      tooltip: 'Sum of all active, non-closed deals in current negotiation stages.',
      value: formatCurrency(kpiMetrics.pipelineValue, currency, true),
      subValue: `${formatCurrency(kpiMetrics.weightedPipeline, currency, true)} Weighted`,
      delta: 14.2,
      deltaLabel: `${kpiMetrics.pipelineCoverage}x Quota Coverage`,
      isPositive: true,
      icon: Zap,
      iconColor: 'from-indigo-500 to-purple-600',
      badge: `${kpiMetrics.activeDealsCount} Active Deals`,
      progress: Math.min(100, Math.round(kpiMetrics.pipelineCoverage * 25)),
      progressLabel: `${kpiMetrics.pipelineCoverage}x Coverage (Target: 3.0x)`,
      actionTab: 'pipeline' as const,
    },
    {
      id: 'winrate',
      title: 'Win Rate & Deal Velocity',
      tooltip: 'Closed Won opportunities divided by total closed deals + average days to close.',
      value: `${kpiMetrics.winRate}%`,
      subValue: `${kpiMetrics.avgSalesCycleDays}d Avg Sales Cycle`,
      delta: kpiMetrics.winRateDelta,
      deltaLabel: 'vs prior quarter',
      isPositive: kpiMetrics.winRateDelta >= 0,
      icon: PieChart,
      iconColor: 'from-blue-500 to-cyan-600',
      badge: `ACV: ${formatCurrency(kpiMetrics.avgDealSize, currency, true)}`,
      progress: Math.min(100, Math.round(kpiMetrics.winRate * 2)),
      progressLabel: 'Top Quartile: > 35%',
      actionTab: 'pipeline' as const,
    },
    {
      id: 'cac_ltv',
      title: 'LTV : CAC Efficiency',
      tooltip: 'Customer Lifetime Value compared against Customer Acquisition Cost.',
      value: `${kpiMetrics.ltvCacRatio}x`,
      subValue: `${formatCurrency(kpiMetrics.cac, currency, true)} Blended CAC`,
      delta: -kpiMetrics.cacDelta, // Negative CAC is positive efficiency
      deltaLabel: `${kpiMetrics.paybackMonths} Mo Payback`,
      isPositive: true,
      icon: ShieldCheck,
      iconColor: 'from-teal-500 to-emerald-600',
      badge: `LTV: ${formatCurrency(kpiMetrics.ltv, currency, true)}`,
      progress: Math.min(100, Math.round(kpiMetrics.ltvCacRatio * 20)),
      progressLabel: 'Healthy Venture Benchmark: > 3.0x',
      actionTab: 'unit-economics' as const,
    },
    {
      id: 'nrr',
      title: 'Net Revenue Retention (NRR)',
      tooltip: 'Percentage of recurring revenue retained from existing customers including expansions.',
      value: `${kpiMetrics.nrr}%`,
      subValue: `${kpiMetrics.grr}% Gross Retention`,
      delta: 4.8,
      deltaLabel: `${kpiMetrics.churnRate}% Churn Rate`,
      isPositive: true,
      icon: Repeat,
      iconColor: 'from-pink-500 to-rose-600',
      badge: 'Best-in-Class',
      progress: Math.min(100, Math.round(kpiMetrics.nrr * 0.7)),
      progressLabel: 'Expansion > Churn rate',
      actionTab: 'unit-economics' as const,
    },
    {
      id: 'runway',
      title: 'Venture Runway & Burn',
      tooltip: 'Estimated cash runway months based on current sales velocity and net burn rate.',
      value: `${kpiMetrics.runwayMonths} Mo`,
      subValue: `${kpiMetrics.burnMultiple}x Burn Multiple`,
      delta: 1.8,
      deltaLabel: '+2.4 Mo extended',
      isPositive: true,
      icon: Flame,
      iconColor: 'from-amber-500 to-orange-600',
      badge: kpiMetrics.burnMultiple < 1.3 ? 'Capital Efficient' : 'Growth Mode',
      progress: Math.min(100, Math.round((kpiMetrics.runwayMonths / 30) * 100)),
      progressLabel: 'Target Runway: > 18 Mo',
      actionTab: 'simulator' as const,
    },
  ];

  return (
    <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 pt-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-3.5">
        {cards.map((card) => {
          const IconComponent = card.icon;
          return (
            <div
              key={card.id}
              onClick={() => setActiveTab(card.actionTab)}
              className="group relative bg-white dark:bg-slate-900/90 rounded-xl p-4 border border-slate-200/90 dark:border-slate-800 hover:border-indigo-400 dark:hover:border-indigo-500/60 shadow-xs hover:shadow-md hover:-translate-y-0.5 transition-all cursor-pointer flex flex-col justify-between overflow-hidden"
            >
              {/* Subtle top gradient accent */}
              <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${card.iconColor} opacity-70 group-hover:opacity-100 transition-opacity`} />

              <div>
                {/* Header: Title, Tooltip & Icon */}
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div className="flex items-center gap-1">
                    <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 line-clamp-1">
                      {card.title}
                    </span>
                    <span className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200" title={card.tooltip}>
                      <HelpCircle className="w-3 h-3" />
                    </span>
                  </div>

                  <div className={`flex items-center justify-center w-7 h-7 rounded-lg bg-gradient-to-tr ${card.iconColor} text-white shadow-2xs shrink-0 group-hover:scale-110 transition-transform`}>
                    <IconComponent className="w-3.5 h-3.5" />
                  </div>
                </div>

                {/* Primary Metric Value */}
                <div className="flex items-baseline gap-2 mb-1">
                  <span className="text-2xl font-black tracking-tight text-slate-900 dark:text-white">
                    {card.value}
                  </span>
                </div>

                {/* Secondary metric subtitle */}
                <div className="text-xs text-slate-500 dark:text-slate-400 font-medium mb-3 flex items-center justify-between">
                  <span>{card.subValue}</span>
                  {card.badge && (
                    <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                      {card.badge}
                    </span>
                  )}
                </div>
              </div>

              {/* Trend Delta Indicator & Progress Bar */}
              <div className="pt-2 border-t border-slate-100 dark:border-slate-800/80">
                <div className="flex items-center justify-between text-[11px] mb-1.5">
                  <span
                    className={`inline-flex items-center gap-0.5 font-bold ${
                      card.isPositive
                        ? 'text-emerald-600 dark:text-emerald-400'
                        : 'text-rose-600 dark:text-rose-400'
                    }`}
                  >
                    {card.isPositive ? (
                      <ArrowUpRight className="w-3 h-3 stroke-[2.5]" />
                    ) : (
                      <ArrowDownRight className="w-3 h-3 stroke-[2.5]" />
                    )}
                    {formatPercent(card.delta, true)}
                  </span>
                  <span className="text-[10px] text-slate-400 dark:text-slate-500 truncate max-w-[110px]" title={card.deltaLabel}>
                    {card.deltaLabel}
                  </span>
                </div>

                {/* Mini Progress meter */}
                <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-1 overflow-hidden">
                  <div
                    className={`h-full rounded-full bg-gradient-to-r ${card.iconColor} transition-all duration-700`}
                    style={{ width: `${card.progress}%` }}
                  />
                </div>
                <div className="text-[9px] text-slate-400 dark:text-slate-500 mt-1 truncate">
                  {card.progressLabel}
                </div>
              </div>

            </div>
          );
        })}
      </div>
    </div>
  );
};
