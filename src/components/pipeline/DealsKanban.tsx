import React from 'react';
import {
  ChevronRight,
  ChevronLeft,
  Calendar,
  AlertCircle,
  CheckCircle2,
  Clock,
  Sparkles,
} from 'lucide-react';
import { useDashboard } from '../../context/DashboardContext';
import { Deal, DealStage } from '../../types';
import { formatCurrency, formatDate, stageColorMap } from '../../utils/formatters';

export const DealsKanban: React.FC = () => {
  const { filteredDeals, currency, setSelectedDeal, moveDealStage, setIsNewDealModalOpen } = useDashboard();

  const columns: Array<{ stage: DealStage; label: string }> = [
    { stage: 'lead', label: 'Lead Inflow' },
    { stage: 'qualified', label: 'Qualified Discovery' },
    { stage: 'demo', label: 'Technical Demo' },
    { stage: 'proposal', label: 'Proposal & Review' },
    { stage: 'negotiation', label: 'Negotiation' },
    { stage: 'won', label: 'Closed Won 🎉' },
  ];

  const getNextStage = (current: DealStage): DealStage | null => {
    const order: DealStage[] = ['lead', 'qualified', 'demo', 'proposal', 'negotiation', 'won'];
    const idx = order.indexOf(current);
    if (idx >= 0 && idx < order.length - 1) return order[idx + 1];
    return null;
  };

  const getPrevStage = (current: DealStage): DealStage | null => {
    const order: DealStage[] = ['lead', 'qualified', 'demo', 'proposal', 'negotiation', 'won'];
    const idx = order.indexOf(current);
    if (idx > 0) return order[idx - 1];
    return null;
  };

  const getHealthIcon = (health: Deal['health']) => {
    if (health === 'healthy') return <CheckCircle2 className="w-3 h-3 text-emerald-500" />;
    if (health === 'at-risk') return <AlertCircle className="w-3 h-3 text-amber-500" />;
    return <Clock className="w-3 h-3 text-rose-500" />;
  };

  return (
    <div className="space-y-4">
      {/* Kanban Header & Add CTA */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-bold text-base text-slate-900 dark:text-white">
            Venture Pipeline Board
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Quickly progress deals across qualification stages to accelerate deal velocity.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setIsNewDealModalOpen(true)}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-lg bg-indigo-600 text-white hover:bg-indigo-500 transition-colors shadow-xs"
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>+ Add Opportunity</span>
        </button>
      </div>

      {/* Kanban Horizontal Scroll Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-3.5 overflow-x-auto pb-4">
        {columns.map((col) => {
          const colDeals = filteredDeals.filter((d) => d.stage === col.stage);
          const colTotal = colDeals.reduce((sum, d) => sum + d.value, 0);
          const stageStyle = stageColorMap[col.stage] || stageColorMap.lead;

          return (
            <div
              key={col.stage}
              className="flex flex-col rounded-xl bg-slate-100/70 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800 p-3 min-w-[240px] max-w-full"
            >
              {/* Column Title */}
              <div className="flex items-center justify-between pb-2.5 mb-2.5 border-b border-slate-200 dark:border-slate-800">
                <div className="flex items-center gap-1.5">
                  <span className={`w-2.5 h-2.5 rounded-full ${stageStyle.bg} border ${stageStyle.border}`} />
                  <span className="font-bold text-xs text-slate-800 dark:text-slate-200">
                    {col.label}
                  </span>
                </div>
                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                  {colDeals.length}
                </span>
              </div>

              {/* Column Total Value */}
              <div className="text-[11px] font-bold text-slate-500 dark:text-slate-400 font-mono mb-2">
                {formatCurrency(colTotal, currency, true)}
              </div>

              {/* Deal Cards Container */}
              <div className="space-y-2.5 flex-1 min-h-[350px]">
                {colDeals.length === 0 ? (
                  <div className="h-32 flex items-center justify-center rounded-lg border border-dashed border-slate-200 dark:border-slate-800 text-[11px] text-slate-400">
                    No active deals
                  </div>
                ) : (
                  colDeals.map((deal) => {
                    const nextStage = getNextStage(deal.stage);
                    const prevStage = getPrevStage(deal.stage);

                    return (
                      <div
                        key={deal.id}
                        className="bg-white dark:bg-slate-800/90 rounded-lg p-3 border border-slate-200/80 dark:border-slate-700/60 shadow-2xs hover:shadow-md hover:border-indigo-400 dark:hover:border-indigo-500 transition-all flex flex-col justify-between gap-2.5 group"
                      >
                        {/* Card Header */}
                        <div>
                          <div className="flex items-start justify-between gap-1.5 mb-1.5">
                            <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
                              {deal.segment}
                            </span>
                            <div className="flex items-center gap-1">
                              {getHealthIcon(deal.health)}
                              <span className="text-[10px] font-mono text-slate-400">{deal.probability}%</span>
                            </div>
                          </div>

                          <button
                            type="button"
                            onClick={() => setSelectedDeal(deal)}
                            className="font-bold text-xs text-slate-900 dark:text-white hover:text-indigo-600 dark:hover:text-indigo-400 text-left line-clamp-2"
                          >
                            {deal.name}
                          </button>
                          
                          <div className="text-[11px] text-slate-500 dark:text-slate-400 truncate mt-0.5">
                            {deal.company}
                          </div>
                        </div>

                        {/* Value & Rep Owner */}
                        <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-700/50">
                          <span className="font-bold text-xs text-slate-900 dark:text-white font-mono">
                            {formatCurrency(deal.value, currency, true)}
                          </span>

                          <div className="flex items-center gap-1 text-[10px] text-slate-400">
                            <img
                              src={deal.owner.avatar}
                              alt={deal.owner.name}
                              className="w-4 h-4 rounded-full object-cover"
                              title={`Owner: ${deal.owner.name}`}
                            />
                            <span>{deal.owner.name.split(' ')[0]}</span>
                          </div>
                        </div>

                        {/* Close Date & Action Advance */}
                        <div className="flex items-center justify-between text-[10px] text-slate-400 pt-1">
                          <span className="flex items-center gap-1">
                            <Calendar className="w-2.5 h-2.5" />
                            {formatDate(deal.expectedCloseDate)}
                          </span>

                          {/* Quick stage navigation buttons */}
                          <div className="flex items-center gap-1 opacity-80 group-hover:opacity-100">
                            {prevStage && (
                              <button
                                type="button"
                                onClick={() => moveDealStage(deal.id, prevStage)}
                                className="p-1 rounded bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 text-slate-600 dark:text-slate-200 transition-colors"
                                title={`Move back to ${prevStage}`}
                              >
                                <ChevronLeft className="w-3 h-3" />
                              </button>
                            )}

                            {nextStage && (
                              <button
                                type="button"
                                onClick={() => moveDealStage(deal.id, nextStage)}
                                className="px-1.5 py-0.5 rounded bg-indigo-600 hover:bg-indigo-500 text-white font-bold flex items-center gap-0.5 transition-colors"
                                title={`Advance to ${nextStage}`}
                              >
                                <span>Advance</span>
                                <ChevronRight className="w-3 h-3" />
                              </button>
                            )}
                          </div>
                        </div>

                      </div>
                    );
                  })
                )}
              </div>

            </div>
          );
        })}
      </div>
    </div>
  );
};
