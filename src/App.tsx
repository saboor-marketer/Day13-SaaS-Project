import React, { useState } from 'react';
import { DashboardProvider, useDashboard } from './context/DashboardContext';
import { Header } from './components/Header';
import { FilterBar } from './components/FilterBar';
import { InsightsBanner } from './components/InsightsBanner';
import { KPICards } from './components/KPICards';
import { RevenueGrowthChart } from './components/charts/RevenueGrowthChart';
import { FunnelChart } from './components/charts/FunnelChart';
import { SegmentDonutChart } from './components/charts/SegmentDonutChart';
import { ChannelEfficiencyChart } from './components/charts/ChannelEfficiencyChart';
import { RepLeaderboard } from './components/charts/RepLeaderboard';
import { CohortHeatmap } from './components/charts/CohortHeatmap';
import { PipelineVelocityChart } from './components/charts/PipelineVelocityChart';
import { DealsTable } from './components/pipeline/DealsTable';
import { DealsKanban } from './components/pipeline/DealsKanban';
import { DealDetailDrawer } from './components/pipeline/DealDetailDrawer';
import { NewDealModal } from './components/pipeline/NewDealModal';
import { ScenarioSimulator } from './components/simulator/ScenarioSimulator';
import { ExecutiveReportModal } from './components/modals/ExecutiveReportModal';
import { NotificationsDrawer } from './components/modals/NotificationsDrawer';
import {
  LayoutDashboard,
  GitPullRequest,
  Layers,
  Sparkles,
  Table as TableIcon,
  Kanban as KanbanIcon,
} from 'lucide-react';

const DashboardContent: React.FC = () => {
  const { activeTab, setActiveTab } = useDashboard();
  const [pipelineViewMode, setPipelineViewMode] = useState<'table' | 'kanban'>('table');

  const navTabs = [
    { id: 'overview' as const, label: 'Executive Overview', icon: LayoutDashboard },
    { id: 'pipeline' as const, label: 'Pipeline & Velocity', icon: GitPullRequest },
    { id: 'unit-economics' as const, label: 'Unit Economics & NRR', icon: Layers },
    { id: 'deals' as const, label: 'Sales Deals CRM', icon: TableIcon },
    { id: 'simulator' as const, label: 'Growth Simulator', icon: Sparkles, badge: 'New' },
  ];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#090d16] text-slate-900 dark:text-slate-100 flex flex-col transition-colors duration-200">
      
      {/* 1. Top Navigation Bar */}
      <Header />

      {/* 2. Global Live Filters Bar */}
      <FilterBar />

      {/* 3. AI Insights Bar */}
      <InsightsBanner />

      {/* 4. Top Venture KPI Metric Cards */}
      <KPICards />

      {/* Main Content Area */}
      <main className="flex-1 max-w-[1600px] w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        
        {/* Navigation Tabs Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 dark:border-slate-800 pb-3">
          
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
            {navTabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                    isActive
                      ? 'bg-indigo-600 text-white shadow-sm shadow-indigo-600/30'
                      : 'text-slate-600 dark:text-slate-400 hover:bg-slate-200/60 dark:hover:bg-slate-800/80 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{tab.label}</span>
                  {tab.badge && (
                    <span className="px-1.5 py-0.2 rounded-full text-[9px] bg-purple-500 text-white font-black uppercase">
                      {tab.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* CRM / Pipeline Sub-toggle if on Deals tab or Pipeline tab */}
          {(activeTab === 'deals' || activeTab === 'pipeline') && (
            <div className="inline-flex items-center p-0.5 rounded-lg bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700/80 self-end sm:self-auto text-xs">
              <button
                type="button"
                onClick={() => setPipelineViewMode('table')}
                className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md font-semibold transition-all ${
                  pipelineViewMode === 'table'
                    ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-xs'
                    : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <TableIcon className="w-3.5 h-3.5" />
                <span>Table View</span>
              </button>
              <button
                type="button"
                onClick={() => setPipelineViewMode('kanban')}
                className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md font-semibold transition-all ${
                  pipelineViewMode === 'kanban'
                    ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-xs'
                    : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <KanbanIcon className="w-3.5 h-3.5" />
                <span>Kanban Board</span>
              </button>
            </div>
          )}

        </div>

        {/* Dynamic Tab Views */}

        {/* TAB 1: EXECUTIVE OVERVIEW */}
        {activeTab === 'overview' && (
          <div className="space-y-6 animate-in fade-in duration-200">
            {/* Top Row: Revenue Growth Chart (8 cols) + Funnel (4 cols) */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              <div className="lg:col-span-8">
                <RevenueGrowthChart />
              </div>
              <div className="lg:col-span-4">
                <FunnelChart />
              </div>
            </div>

            {/* Middle Row: Segment Donut + Channel Attribution + Rep Leaderboard */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <SegmentDonutChart />
              <ChannelEfficiencyChart />
              <RepLeaderboard />
            </div>

            {/* Bottom Row: CRM Table Snapshot */}
            <DealsTable />
          </div>
        )}

        {/* TAB 2: PIPELINE & VELOCITY */}
        {activeTab === 'pipeline' && (
          <div className="space-y-6 animate-in fade-in duration-200">
            {/* Top Row: Pipeline Velocity Chart & Funnel */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              <div className="lg:col-span-7">
                <PipelineVelocityChart />
              </div>
              <div className="lg:col-span-5">
                <FunnelChart />
              </div>
            </div>

            {/* Kanban or Table View */}
            {pipelineViewMode === 'kanban' ? <DealsKanban /> : <DealsTable />}
          </div>
        )}

        {/* TAB 3: UNIT ECONOMICS & NRR */}
        {activeTab === 'unit-economics' && (
          <div className="space-y-6 animate-in fade-in duration-200">
            {/* Cohort Heatmap */}
            <CohortHeatmap />

            {/* Channel Efficiency & Segment Breakdown */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <ChannelEfficiencyChart />
              <SegmentDonutChart />
            </div>
          </div>
        )}

        {/* TAB 4: SALES DEALS CRM */}
        {activeTab === 'deals' && (
          <div className="space-y-6 animate-in fade-in duration-200">
            {pipelineViewMode === 'table' ? <DealsTable /> : <DealsKanban />}
          </div>
        )}

        {/* TAB 5: GROWTH & RUNWAY SIMULATOR */}
        {activeTab === 'simulator' && (
          <div className="animate-in fade-in duration-200">
            <ScenarioSimulator />
          </div>
        )}

      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 dark:border-slate-800/80 bg-white dark:bg-[#0c1222] py-4 text-xs text-slate-500 transition-colors">
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-800 dark:text-slate-200">VenturePulse</span>
            <span>•</span>
            <span>Sales Analytics & Velocity Engine for High-Growth Scale-ups</span>
          </div>
          <div className="flex items-center gap-4 text-slate-400">
            <span>SOC2 Type II Compliant</span>
            <span>•</span>
            <span>Live Data Sync</span>
          </div>
        </div>
      </footer>

      {/* Drawers & Modals */}
      <DealDetailDrawer />
      <NewDealModal />
      <ExecutiveReportModal />
      <NotificationsDrawer />

    </div>
  );
};

export function App() {
  return (
    <DashboardProvider>
      <DashboardContent />
    </DashboardProvider>
  );
}

export default App;
