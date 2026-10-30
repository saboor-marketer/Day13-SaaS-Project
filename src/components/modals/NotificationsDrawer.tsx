import React, { useState } from 'react';
import {
  X,
  Bell,
  CheckCircle2,
  AlertTriangle,
  Lightbulb,
  Trash2,
  Check,
  TrendingUp,
} from 'lucide-react';
import { useDashboard } from '../../context/DashboardContext';

export const NotificationsDrawer: React.FC = () => {
  const {
    isNotificationsOpen,
    setIsNotificationsOpen,
    alerts,
    markAlertRead,
    dismissAlert,
    setSelectedDeal,
    deals,
  } = useDashboard();

  const [filter, setFilter] = useState<'all' | 'unread'>('all');

  if (!isNotificationsOpen) return null;

  const filteredAlerts = alerts.filter((a) => (filter === 'unread' ? !a.isRead : true));

  const handleActionClick = (alert: (typeof alerts)[0]) => {
    if (alert.dealId) {
      const deal = deals.find((d) => d.id === alert.dealId);
      if (deal) {
        setSelectedDeal(deal);
      }
    }
    markAlertRead(alert.id);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-xs"
        onClick={() => setIsNotificationsOpen(false)}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white dark:bg-[#0f172a] shadow-2xl border-l border-slate-200 dark:border-slate-800 flex flex-col justify-between">
          
          {/* Header */}
          <div>
            <div className="p-5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-lg bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400">
                  <Bell className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                    Venture Activity & Intelligence
                  </h3>
                  <p className="text-[11px] text-slate-400">
                    Live deal updates, pipeline bottlenecks, and quota alerts
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setIsNotificationsOpen(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Filter Sub-nav */}
            <div className="px-5 py-2.5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => setFilter('all')}
                  className={`px-2.5 py-1 rounded-md font-semibold ${
                    filter === 'all'
                      ? 'bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400'
                      : 'text-slate-500 hover:text-slate-900'
                  }`}
                >
                  All ({alerts.length})
                </button>
                <button
                  type="button"
                  onClick={() => setFilter('unread')}
                  className={`px-2.5 py-1 rounded-md font-semibold ${
                    filter === 'unread'
                      ? 'bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400'
                      : 'text-slate-500 hover:text-slate-900'
                  }`}
                >
                  Unread ({alerts.filter((a) => !a.isRead).length})
                </button>
              </div>

              <button
                type="button"
                onClick={() => alerts.forEach((a) => markAlertRead(a.id))}
                className="text-[11px] text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 flex items-center gap-1 font-medium"
              >
                <Check className="w-3 h-3" />
                Mark all read
              </button>
            </div>

            {/* Alerts List */}
            <div className="p-4 space-y-3 overflow-y-auto max-h-[70vh]">
              {filteredAlerts.length === 0 ? (
                <div className="py-12 text-center text-slate-400 text-xs">
                  No notifications in this view.
                </div>
              ) : (
                filteredAlerts.map((item) => (
                  <div
                    key={item.id}
                    className={`p-3.5 rounded-xl border transition-all ${
                      item.isRead
                        ? 'border-slate-100 dark:border-slate-800/80 bg-slate-50/50 dark:bg-slate-900/40 opacity-80'
                        : 'border-indigo-200 dark:border-indigo-900/50 bg-indigo-50/30 dark:bg-indigo-950/20 shadow-xs'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2 mb-1.5">
                      <div className="flex items-center gap-2">
                        {item.type === 'opportunity' && <Lightbulb className="w-4 h-4 text-amber-500 shrink-0" />}
                        {item.type === 'achievement' && <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />}
                        {item.type === 'warning' && <AlertTriangle className="w-4 h-4 text-rose-500 shrink-0" />}
                        {item.type === 'intel' && <TrendingUp className="w-4 h-4 text-indigo-500 shrink-0" />}
                        <span className="font-bold text-xs text-slate-900 dark:text-white">
                          {item.title}
                        </span>
                      </div>

                      <div className="flex items-center gap-1 shrink-0">
                        <span className="text-[10px] text-slate-400">{item.timeAgo}</span>
                        <button
                          type="button"
                          onClick={() => dismissAlert(item.id)}
                          className="p-1 text-slate-400 hover:text-rose-500 rounded"
                          title="Dismiss"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>
                    </div>

                    <p className="text-xs text-slate-600 dark:text-slate-300 mb-2">
                      {item.description}
                    </p>

                    <div className="flex items-center justify-between pt-1 text-xs">
                      {item.actionLabel ? (
                        <button
                          type="button"
                          onClick={() => handleActionClick(item)}
                          className="text-[11px] font-bold text-indigo-600 dark:text-indigo-400 hover:underline"
                        >
                          {item.actionLabel} →
                        </button>
                      ) : <span />}

                      {!item.isRead && (
                        <button
                          type="button"
                          onClick={() => markAlertRead(item.id)}
                          className="text-[10px] text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 font-medium"
                        >
                          Mark as read
                        </button>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Footer */}
          <div className="p-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-center text-xs text-slate-400">
            Realtime Sales Stream Active
          </div>

        </div>
      </div>
    </div>
  );
};
