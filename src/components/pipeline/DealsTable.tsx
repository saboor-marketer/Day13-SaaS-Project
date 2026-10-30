import React, { useState, useMemo } from 'react';
import {
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  Eye,
  Trash2,
  ChevronLeft,
  ChevronRight,
  Download,
  AlertCircle,
  CheckCircle2,
  Clock,
  Sparkles,
} from 'lucide-react';
import { useDashboard } from '../../context/DashboardContext';
import { Deal, DealStage } from '../../types';
import { formatCurrency, formatDate, stageColorMap } from '../../utils/formatters';

type SortField = 'name' | 'company' | 'value' | 'stage' | 'probability' | 'expectedCloseDate' | 'owner';
type SortOrder = 'asc' | 'desc';

export const DealsTable: React.FC = () => {
  const {
    filteredDeals,
    currency,
    setSelectedDeal,
    deleteDeal,
    moveDealStage,
    setIsNewDealModalOpen,
  } = useDashboard();

  const [sortField, setSortField] = useState<SortField>('value');
  const [sortOrder, setSortOrder] = useState<SortOrder>('desc');
  const [stageFilter, setStageFilter] = useState<string>('all');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const pageSize = 8;

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('desc');
    }
  };

  const stageOptions: Array<{ key: string; label: string }> = [
    { key: 'all', label: 'All Stages' },
    { key: 'lead', label: 'Lead' },
    { key: 'qualified', label: 'Qualified' },
    { key: 'demo', label: 'Demo' },
    { key: 'proposal', label: 'Proposal' },
    { key: 'negotiation', label: 'Negotiation' },
    { key: 'won', label: 'Won' },
    { key: 'lost', label: 'Lost' },
  ];

  // Stage filter & sort
  const processedDeals = useMemo(() => {
    let result = [...filteredDeals];

    if (stageFilter !== 'all') {
      result = result.filter((d) => d.stage === stageFilter);
    }

    result.sort((a, b) => {
      let comparison = 0;
      if (sortField === 'value') {
        comparison = a.value - b.value;
      } else if (sortField === 'probability') {
        comparison = a.probability - b.probability;
      } else if (sortField === 'expectedCloseDate') {
        comparison = new Date(a.expectedCloseDate).getTime() - new Date(b.expectedCloseDate).getTime();
      } else if (sortField === 'name') {
        comparison = a.name.localeCompare(b.name);
      } else if (sortField === 'company') {
        comparison = a.company.localeCompare(b.company);
      } else if (sortField === 'owner') {
        comparison = a.owner.name.localeCompare(b.owner.name);
      } else if (sortField === 'stage') {
        comparison = a.stage.localeCompare(b.stage);
      }
      return sortOrder === 'asc' ? comparison : -comparison;
    });

    return result;
  }, [filteredDeals, stageFilter, sortField, sortOrder]);

  // Pagination
  const totalPages = Math.ceil(processedDeals.length / pageSize) || 1;
  const paginatedDeals = processedDeals.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const exportCSV = () => {
    const headers = ['Deal ID', 'Deal Name', 'Company', 'Stage', 'Value ($)', 'MRR ($)', 'Owner', 'Segment', 'Region', 'Probability (%)', 'Expected Close', 'Health'];
    const rows = processedDeals.map((d) => [
      d.id,
      `"${d.name.replace(/"/g, '""')}"`,
      `"${d.company.replace(/"/g, '""')}"`,
      d.stage,
      d.value,
      d.mrr,
      `"${d.owner.name}"`,
      d.segment,
      d.region,
      d.probability,
      d.expectedCloseDate,
      d.health,
    ]);

    const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `venturepulse_deals_${new Date().toISOString().split('T')[0]}.csv`);
    link.click();
  };

  const getSortIcon = (field: SortField) => {
    if (sortField !== field) return <ArrowUpDown className="w-3 h-3 text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity" />;
    return sortOrder === 'asc' ? <ArrowUp className="w-3 h-3 text-indigo-500" /> : <ArrowDown className="w-3 h-3 text-indigo-500" />;
  };

  const getHealthBadge = (health: Deal['health']) => {
    if (health === 'healthy') {
      return (
        <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-1.5 py-0.5 rounded-full border border-emerald-500/20">
          <CheckCircle2 className="w-2.5 h-2.5" />
          Healthy
        </span>
      );
    }
    if (health === 'at-risk') {
      return (
        <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/40 px-1.5 py-0.5 rounded-full border border-amber-500/20">
          <AlertCircle className="w-2.5 h-2.5" />
          At Risk
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/40 px-1.5 py-0.5 rounded-full border border-rose-500/20">
        <Clock className="w-2.5 h-2.5" />
        Stalled
      </span>
    );
  };

  return (
    <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs overflow-hidden transition-colors">
      
      {/* Table Header Controls */}
      <div className="p-4 sm:p-5 border-b border-slate-200 dark:border-slate-800 flex flex-col lg:flex-row lg:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="font-bold text-base text-slate-900 dark:text-white">
              Venture Sales CRM Pipeline
            </h3>
            <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20">
              {processedDeals.length} Opportunities
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Sort, filter, and advance deals across your venture sales pipeline.
          </p>
        </div>

        {/* Filter Pills & Actions */}
        <div className="flex flex-wrap items-center gap-2">
          
          {/* Stage pills */}
          <div className="inline-flex items-center p-0.5 rounded-lg bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700/80 text-xs overflow-x-auto max-w-full">
            {stageOptions.map((st) => (
              <button
                key={st.key}
                type="button"
                onClick={() => {
                  setStageFilter(st.key);
                  setCurrentPage(1);
                }}
                className={`px-2 py-1 rounded-md font-semibold whitespace-nowrap transition-all ${
                  stageFilter === st.key
                    ? 'bg-white dark:bg-indigo-600 text-indigo-700 dark:text-white shadow-xs'
                    : 'text-slate-600 dark:text-slate-300 hover:text-slate-900'
                }`}
              >
                {st.label}
              </button>
            ))}
          </div>

          {/* Export to CSV */}
          <button
            type="button"
            onClick={exportCSV}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
            title="Download CSV Spreadsheet"
          >
            <Download className="w-3.5 h-3.5 text-emerald-500" />
            <span className="hidden sm:inline">Export CSV</span>
          </button>

          {/* New Deal */}
          <button
            type="button"
            onClick={() => setIsNewDealModalOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-lg bg-indigo-600 text-white hover:bg-indigo-500 transition-colors shadow-xs"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>+ New Deal</span>
          </button>

        </div>
      </div>

      {/* Table Content */}
      <div className="overflow-x-auto">
        <table className="w-full text-xs text-left">
          <thead>
            <tr className="bg-slate-50/70 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 select-none">
              <th className="py-3 px-4 font-semibold group cursor-pointer" onClick={() => handleSort('company')}>
                <div className="flex items-center gap-1">
                  <span>Company & Deal</span>
                  {getSortIcon('company')}
                </div>
              </th>
              <th className="py-3 px-3 font-semibold group cursor-pointer" onClick={() => handleSort('value')}>
                <div className="flex items-center gap-1">
                  <span>Annual Value (ACV)</span>
                  {getSortIcon('value')}
                </div>
              </th>
              <th className="py-3 px-3 font-semibold group cursor-pointer" onClick={() => handleSort('stage')}>
                <div className="flex items-center gap-1">
                  <span>Stage</span>
                  {getSortIcon('stage')}
                </div>
              </th>
              <th className="py-3 px-3 font-semibold group cursor-pointer" onClick={() => handleSort('probability')}>
                <div className="flex items-center gap-1">
                  <span>Win Prob</span>
                  {getSortIcon('probability')}
                </div>
              </th>
              <th className="py-3 px-3 font-semibold group cursor-pointer" onClick={() => handleSort('owner')}>
                <div className="flex items-center gap-1">
                  <span>Rep Owner</span>
                  {getSortIcon('owner')}
                </div>
              </th>
              <th className="py-3 px-3 font-semibold">Segment & Region</th>
              <th className="py-3 px-3 font-semibold group cursor-pointer" onClick={() => handleSort('expectedCloseDate')}>
                <div className="flex items-center gap-1">
                  <span>Target Close</span>
                  {getSortIcon('expectedCloseDate')}
                </div>
              </th>
              <th className="py-3 px-3 font-semibold">Health</th>
              <th className="py-3 px-4 font-semibold text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80">
            {paginatedDeals.length === 0 ? (
              <tr>
                <td colSpan={9} className="py-12 text-center text-slate-400">
                  <div className="max-w-xs mx-auto space-y-2">
                    <p className="font-semibold text-slate-600 dark:text-slate-300">No deals match the active filters</p>
                    <p className="text-xs text-slate-400">Try adjusting your search query, segment, or date range.</p>
                  </div>
                </td>
              </tr>
            ) : (
              paginatedDeals.map((deal) => {
                const stageStyle = stageColorMap[deal.stage] || stageColorMap.lead;
                return (
                  <tr
                    key={deal.id}
                    className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors group"
                  >
                    {/* Deal Name & Company */}
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2.5">
                        <div className={`w-8 h-8 rounded-lg bg-gradient-to-tr ${deal.logoColor || 'from-indigo-500 to-purple-600'} text-white font-bold flex items-center justify-center text-xs shrink-0 shadow-2xs`}>
                          {deal.company.slice(0, 2).toUpperCase()}
                        </div>
                        <div className="min-w-0">
                          <button
                            type="button"
                            onClick={() => setSelectedDeal(deal)}
                            className="font-bold text-slate-900 dark:text-white hover:text-indigo-600 dark:hover:text-indigo-400 text-left block truncate max-w-[200px]"
                          >
                            {deal.name}
                          </button>
                          <div className="flex items-center gap-1.5 text-[11px] text-slate-400">
                            <span>{deal.company}</span>
                            <span>•</span>
                            <span className="text-[10px] text-slate-400">{deal.contactName}</span>
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Value & MRR */}
                    <td className="py-3 px-3 whitespace-nowrap">
                      <div className="font-bold text-slate-900 dark:text-white font-mono text-xs">
                        {formatCurrency(deal.value, currency, false)}
                      </div>
                      <div className="text-[10px] text-slate-400 font-mono">
                        {formatCurrency(deal.mrr, currency, true)}/mo
                      </div>
                    </td>

                    {/* Stage Badge with Quick Advancer */}
                    <td className="py-3 px-3 whitespace-nowrap">
                      <div className="flex items-center gap-1.5">
                        <span className={`px-2 py-0.5 rounded-md text-[11px] font-bold border uppercase tracking-wider ${stageStyle.bg} ${stageStyle.text} ${stageStyle.border}`}>
                          {deal.stage}
                        </span>
                        
                        {/* Quick stage advance dropdown */}
                        <select
                          value={deal.stage}
                          onChange={(e) => moveDealStage(deal.id, e.target.value as DealStage)}
                          className="opacity-0 group-hover:opacity-100 transition-opacity text-[10px] bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded px-1 py-0.5 cursor-pointer text-slate-600 dark:text-slate-300"
                          title="Advance or Change Stage"
                        >
                          <option value="lead">Lead</option>
                          <option value="qualified">Qualified</option>
                          <option value="demo">Demo</option>
                          <option value="proposal">Proposal</option>
                          <option value="negotiation">Negotiation</option>
                          <option value="won">Won 🎉</option>
                          <option value="lost">Lost</option>
                        </select>
                      </div>
                    </td>

                    {/* Probability */}
                    <td className="py-3 px-3 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <div className="w-12 bg-slate-100 dark:bg-slate-800 rounded-full h-1.5 overflow-hidden">
                          <div
                            className={`h-full rounded-full ${
                              deal.probability >= 80
                                ? 'bg-emerald-500'
                                : deal.probability >= 50
                                ? 'bg-indigo-500'
                                : 'bg-amber-500'
                            }`}
                            style={{ width: `${deal.probability}%` }}
                          />
                        </div>
                        <span className="font-bold text-slate-700 dark:text-slate-300 font-mono text-[11px]">
                          {deal.probability}%
                        </span>
                      </div>
                    </td>

                    {/* Rep Owner */}
                    <td className="py-3 px-3 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <img
                          src={deal.owner.avatar}
                          alt={deal.owner.name}
                          className="w-5 h-5 rounded-full object-cover"
                        />
                        <span className="text-slate-700 dark:text-slate-300 font-medium">
                          {deal.owner.name.split(' ')[0]}
                        </span>
                      </div>
                    </td>

                    {/* Segment & Region */}
                    <td className="py-3 px-3 whitespace-nowrap">
                      <div className="flex flex-col">
                        <span className="font-semibold text-slate-700 dark:text-slate-300 text-[11px]">
                          {deal.segment}
                        </span>
                        <span className="text-[10px] text-slate-400">
                          {deal.region}
                        </span>
                      </div>
                    </td>

                    {/* Target Close */}
                    <td className="py-3 px-3 whitespace-nowrap">
                      <span className="text-slate-600 dark:text-slate-300 font-medium">
                        {formatDate(deal.expectedCloseDate)}
                      </span>
                    </td>

                    {/* Health */}
                    <td className="py-3 px-3 whitespace-nowrap">
                      {getHealthBadge(deal.health)}
                    </td>

                    {/* Actions */}
                    <td className="py-3 px-4 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          type="button"
                          onClick={() => setSelectedDeal(deal)}
                          className="p-1.5 rounded-md text-slate-500 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-950/40 transition-colors"
                          title="Inspect Details"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            if (confirm(`Are you sure you want to delete ${deal.name}?`)) {
                              deleteDeal(deal.id);
                            }
                          }}
                          className="p-1.5 rounded-md text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
                          title="Delete Deal"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Footer */}
      <div className="p-3.5 border-t border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-slate-500">
        <div>
          Showing <span className="font-bold text-slate-900 dark:text-white">{Math.min(processedDeals.length, (currentPage - 1) * pageSize + 1)}</span> to{' '}
          <span className="font-bold text-slate-900 dark:text-white">{Math.min(processedDeals.length, currentPage * pageSize)}</span> of{' '}
          <span className="font-bold text-slate-900 dark:text-white">{processedDeals.length}</span> deals
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            className="p-1.5 rounded-md border border-slate-200 dark:border-slate-700 disabled:opacity-40 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <span className="font-bold text-slate-800 dark:text-slate-200 px-2">
            Page {currentPage} of {totalPages}
          </span>
          <button
            type="button"
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            className="p-1.5 rounded-md border border-slate-200 dark:border-slate-700 disabled:opacity-40 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

    </div>
  );
};
