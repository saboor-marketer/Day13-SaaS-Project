import React, { useState } from 'react';
import {
  Sparkles,
  ChevronRight,
  X,
  AlertTriangle,
  TrendingUp,
  CheckCircle2,
  Lightbulb,
  ArrowRight,
} from 'lucide-react';
import { useDashboard } from '../context/DashboardContext';

export const InsightsBanner: React.FC = () => {
  const { alerts, markAlertRead, setSelectedDeal, deals, setActiveTab } = useDashboard();
  const [isDismissed, setIsDismissed] = useState(false);
  const [activeAlertIndex, setActiveAlertIndex] = useState(0);

  const activeAlerts = alerts.filter((a) => !a.isRead);

  if (isDismissed || activeAlerts.length === 0) {
    return null;
  }

  const currentAlert = activeAlerts[activeAlertIndex % activeAlerts.length];

  const handleAction = () => {
    if (currentAlert.dealId) {
      const deal = deals.find((d) => d.id === currentAlert.dealId);
      if (deal) {
        setSelectedDeal(deal);
      }
    } else if (currentAlert.actionLabel?.includes('Leaderboard')) {
      setActiveTab('overview');
    } else if (currentAlert.actionLabel?.includes('Funnel')) {
      setActiveTab('pipeline');
    }
    markAlertRead(currentAlert.id);
  };

  const getAlertIcon = () => {
    switch (currentAlert.type) {
      case 'opportunity':
        return <Lightbulb className="w-4 h-4 text-amber-500 animate-pulse" />;
      case 'warning':
        return <AlertTriangle className="w-4 h-4 text-rose-500" />;
      case 'achievement':
        return <CheckCircle2 className="w-4 h-4 text-emerald-500" />;
      default:
        return <TrendingUp className="w-4 h-4 text-indigo-500" />;
    }
  };

  const getBadgeStyle = () => {
    switch (currentAlert.type) {
      case 'opportunity':
        return 'bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-500/30';
      case 'warning':
        return 'bg-rose-500/10 text-rose-700 dark:text-rose-400 border-rose-500/30';
      case 'achievement':
        return 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-500/30';
      default:
        return 'bg-indigo-500/10 text-indigo-700 dark:text-indigo-400 border-indigo-500/30';
    }
  };

  return (
    <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 pt-4">
      <div className="relative overflow-hidden rounded-xl border border-indigo-200/80 dark:border-indigo-900/40 bg-gradient-to-r from-indigo-50/90 via-purple-50/50 to-white dark:from-indigo-950/30 dark:via-purple-950/20 dark:to-slate-900/50 p-3.5 sm:p-4 shadow-sm transition-all">
        
        {/* Glow backdrop decorative */}
        <div className="absolute top-0 right-0 -mt-4 -mr-4 w-32 h-32 bg-indigo-500/10 dark:bg-indigo-500/20 rounded-full blur-2xl pointer-events-none" />

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 relative z-10">
          
          {/* Alert Content */}
          <div className="flex items-start sm:items-center gap-3">
            <div className="p-2 rounded-lg bg-white dark:bg-slate-800 shadow-xs border border-slate-200/80 dark:border-slate-700/60">
              {getAlertIcon()}
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center gap-1.5 sm:gap-3">
              <div className="flex items-center gap-2">
                <span className="flex items-center gap-1 text-[11px] font-bold tracking-wider uppercase px-2 py-0.5 rounded-full border bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 shadow-2xs">
                  <Sparkles className="w-3 h-3 text-indigo-500" />
                  Venture AI Intel
                </span>
                <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${getBadgeStyle()}`}>
                  {currentAlert.type.toUpperCase()}
                </span>
              </div>

              <div className="text-xs">
                <span className="font-semibold text-slate-900 dark:text-white mr-1.5">
                  {currentAlert.title}:
                </span>
                <span className="text-slate-600 dark:text-slate-300">
                  {currentAlert.description}
                </span>
              </div>
            </div>
          </div>

          {/* Action CTA & Navigation */}
          <div className="flex items-center gap-2 self-end sm:self-auto shrink-0">
            {activeAlerts.length > 1 && (
              <button
                type="button"
                onClick={() => setActiveAlertIndex((prev) => (prev + 1) % activeAlerts.length)}
                className="text-[11px] font-medium text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 px-2 py-1 rounded bg-white/60 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60 flex items-center gap-1"
                title="Next insight"
              >
                <span>{activeAlertIndex + 1}/{activeAlerts.length}</span>
                <ChevronRight className="w-3 h-3" />
              </button>
            )}

            {currentAlert.actionLabel && (
              <button
                type="button"
                onClick={handleAction}
                className="flex items-center gap-1 px-3 py-1 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-500 rounded-lg shadow-xs shadow-indigo-600/30 transition-transform active:scale-95"
              >
                <span>{currentAlert.actionLabel}</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            )}

            <button
              type="button"
              onClick={() => setIsDismissed(true)}
              className="p-1 rounded-md text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-200/50 dark:hover:bg-slate-800"
              title="Dismiss banner"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};
