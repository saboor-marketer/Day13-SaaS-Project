import React, { useState, useEffect } from 'react';
import {
  X,
  Building,
  User,
  Mail,
  Calendar,
  DollarSign,
  TrendingUp,
  Tag,
  MessageSquare,
  CheckCircle2,
  Trash2,
  Share2,
} from 'lucide-react';
import { useDashboard } from '../../context/DashboardContext';
import { Deal, DealHealth, DealStage } from '../../types';
import { formatCurrency, formatDate, stageColorMap } from '../../utils/formatters';

export const DealDetailDrawer: React.FC = () => {
  const { selectedDeal, setSelectedDeal, updateDeal, deleteDeal, currency, moveDealStage } = useDashboard();
  const [dealState, setDealState] = useState<Deal | null>(selectedDeal);
  const [newNote, setNewNote] = useState('');
  const [notes, setNotes] = useState<string[]>([
    'Initial executive discovery call went very well. High interest in enterprise security SLA.',
    'Technical architecture review scheduled with platform engineering lead.',
    'Procurement questionnaire sent to Legal team for contract review.',
  ]);

  useEffect(() => {
    setDealState(selectedDeal);
  }, [selectedDeal]);

  if (!selectedDeal || !dealState) return null;

  const handleStageChange = (stage: DealStage) => {
    moveDealStage(selectedDeal.id, stage);
    setDealState((prev) => (prev ? { ...prev, stage } : null));
  };

  const handleHealthChange = (health: DealHealth) => {
    updateDeal(selectedDeal.id, { health });
    setDealState((prev) => (prev ? { ...prev, health } : null));
  };

  const handleAddNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNote.trim()) return;
    setNotes([newNote.trim(), ...notes]);
    setNewNote('');
    updateDeal(selectedDeal.id, { notesCount: (selectedDeal.notesCount || 0) + 1 });
  };

  const stages: DealStage[] = ['lead', 'qualified', 'demo', 'proposal', 'negotiation', 'won'];
  const stageStyle = stageColorMap[dealState.stage] || stageColorMap.lead;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-xs transition-opacity"
        onClick={() => setSelectedDeal(null)}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-xl bg-white dark:bg-[#0f172a] shadow-2xl border-l border-slate-200 dark:border-slate-800 flex flex-col justify-between overflow-y-auto">
          
          {/* Top Bar */}
          <div>
            <div className="p-5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold border uppercase tracking-wider ${stageStyle.bg} ${stageStyle.text} ${stageStyle.border}`}>
                  {dealState.stage}
                </span>
                <span className="text-xs text-slate-400 font-mono">ID: {dealState.id}</span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    navigator.clipboard?.writeText(window.location.href);
                    alert('Deal link copied to clipboard!');
                  }}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
                  title="Share Deal"
                >
                  <Share2 className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => {
                    if (confirm('Delete this deal permanently?')) {
                      deleteDeal(dealState.id);
                    }
                  }}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40"
                  title="Delete Deal"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedDeal(null)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Deal Main Info */}
            <div className="p-6 space-y-6">
              
              {/* Title & Company */}
              <div>
                <h2 className="text-xl font-black text-slate-900 dark:text-white">
                  {dealState.name}
                </h2>
                <div className="flex items-center gap-2 mt-1 text-sm text-slate-500 dark:text-slate-400">
                  <Building className="w-4 h-4 text-indigo-500" />
                  <span className="font-semibold text-slate-700 dark:text-slate-200">{dealState.company}</span>
                  <span>•</span>
                  <span>{dealState.segment}</span>
                  <span>•</span>
                  <span>{dealState.region}</span>
                </div>
              </div>

              {/* Stage Progress Stepper */}
              <div>
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-2">
                  Pipeline Stage Progression
                </label>
                <div className="grid grid-cols-6 gap-1 bg-slate-100 dark:bg-slate-800/80 p-1.5 rounded-xl border border-slate-200 dark:border-slate-700/80">
                  {stages.map((st) => {
                    const isCurrent = dealState.stage === st;
                    const isWon = dealState.stage === 'won';
                    return (
                      <button
                        key={st}
                        type="button"
                        onClick={() => handleStageChange(st)}
                        className={`py-1.5 px-1 rounded-lg text-[10px] font-bold text-center capitalize transition-all ${
                          isCurrent
                            ? isWon
                              ? 'bg-emerald-600 text-white shadow-xs'
                              : 'bg-indigo-600 text-white shadow-xs'
                            : 'text-slate-600 dark:text-slate-300 hover:bg-white dark:hover:bg-slate-700'
                        }`}
                      >
                        {st}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Financial & Health Metrics Grid */}
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-700/60">
                  <div className="flex items-center gap-1.5 text-xs text-slate-400 mb-1">
                    <DollarSign className="w-3.5 h-3.5 text-emerald-500" />
                    <span>Annual Contract Value (ACV)</span>
                  </div>
                  <div className="text-lg font-black text-slate-900 dark:text-white font-mono">
                    {formatCurrency(dealState.value, currency, false)}
                  </div>
                  <div className="text-[11px] text-slate-400 font-mono mt-0.5">
                    {formatCurrency(dealState.mrr, currency, false)}/month
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-700/60">
                  <div className="flex items-center gap-1.5 text-xs text-slate-400 mb-1">
                    <TrendingUp className="w-3.5 h-3.5 text-indigo-500" />
                    <span>Win Probability</span>
                  </div>
                  <div className="text-lg font-black text-slate-900 dark:text-white font-mono">
                    {dealState.probability}%
                  </div>
                  <div className="text-[11px] text-slate-400 mt-0.5">
                    Weighted: {formatCurrency((dealState.value * dealState.probability) / 100, currency, true)}
                  </div>
                </div>
              </div>

              {/* Health Status & Target Close */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-slate-400 block mb-1">Opportunity Health</label>
                  <select
                    value={dealState.health}
                    onChange={(e) => handleHealthChange(e.target.value as DealHealth)}
                    className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-800 dark:text-slate-200 font-medium"
                  >
                    <option value="healthy">🟢 Healthy / Moving Forward</option>
                    <option value="at-risk">🟡 At-Risk / Slow Response</option>
                    <option value="stalled">🔴 Stalled / Blocked</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-400 block mb-1">Target Close Date</label>
                  <div className="flex items-center gap-2 px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-800 dark:text-slate-200 font-medium">
                    <Calendar className="w-3.5 h-3.5 text-slate-400" />
                    <span>{formatDate(dealState.expectedCloseDate)}</span>
                  </div>
                </div>
              </div>

              {/* Primary Contact & Rep Owner */}
              <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 space-y-3">
                <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                  Stakeholders & Ownership
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-full bg-indigo-100 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-bold text-xs">
                      <User className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="font-bold text-xs text-slate-900 dark:text-white">{dealState.contactName}</div>
                      <div className="text-[11px] text-slate-400">{dealState.contactRole}</div>
                    </div>
                  </div>
                  <a
                    href={`mailto:${dealState.contactEmail}`}
                    className="flex items-center gap-1 text-xs text-indigo-600 dark:text-indigo-400 hover:underline"
                  >
                    <Mail className="w-3 h-3" />
                    <span>Email</span>
                  </a>
                </div>

                <div className="pt-2 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-xs">
                  <span className="text-slate-400">Account Executive:</span>
                  <div className="flex items-center gap-1.5 font-semibold text-slate-800 dark:text-slate-200">
                    <img src={dealState.owner.avatar} alt={dealState.owner.name} className="w-4 h-4 rounded-full object-cover" />
                    <span>{dealState.owner.name} ({dealState.owner.role})</span>
                  </div>
                </div>
              </div>

              {/* Deal Tags */}
              <div>
                <div className="flex items-center gap-1 text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                  <Tag className="w-3 h-3" />
                  <span>Tags & Deal Criteria</span>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {dealState.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-2 py-0.5 text-xs font-medium rounded-md bg-indigo-50 dark:bg-indigo-950/50 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800"
                    >
                      #{tag}
                    </span>
                  ))}
                  <span className="px-2 py-0.5 text-xs font-medium rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                    {dealState.channel}
                  </span>
                </div>
              </div>

              {/* Notes & Activity Stream */}
              <div className="space-y-3 pt-2 border-t border-slate-200 dark:border-slate-800">
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-1.5 text-xs font-bold text-slate-400 uppercase tracking-wider">
                    <MessageSquare className="w-3.5 h-3.5" />
                    <span>Deal Activity Log & Notes ({notes.length})</span>
                  </span>
                </div>

                <form onSubmit={handleAddNote} className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Log executive call notes, updates, or next steps..."
                    value={newNote}
                    onChange={(e) => setNewNote(e.target.value)}
                    className="flex-1 px-3 py-1.5 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:border-indigo-500"
                  />
                  <button
                    type="submit"
                    className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs rounded-lg transition-colors shrink-0"
                  >
                    Add Note
                  </button>
                </form>

                <div className="space-y-2">
                  {notes.map((note, index) => (
                    <div
                      key={index}
                      className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800 text-xs text-slate-700 dark:text-slate-300 flex items-start gap-2"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
                      <span>{note}</span>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          </div>

          {/* Drawer Footer CTA */}
          <div className="p-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/80 flex items-center justify-between">
            <button
              type="button"
              onClick={() => setSelectedDeal(null)}
              className="px-4 py-2 text-xs font-semibold rounded-lg border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              Close
            </button>
            <button
              type="button"
              onClick={() => {
                handleStageChange('won');
                setSelectedDeal(null);
              }}
              className="px-4 py-2 text-xs font-bold rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white shadow-xs transition-colors"
            >
              🎉 Mark as Closed Won
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};
