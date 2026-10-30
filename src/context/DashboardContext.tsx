import React, { createContext, useContext, useState, useMemo, useEffect } from 'react';
import confetti from 'canvas-confetti';
import {
  VentureStage,
  DateRangeKey,
  CustomerSegment,
  LeadChannel,
  SalesRegion,
  Deal,
  SalesRep,
  KPIMetrics,
  TimeSeriesPoint,
  FunnelStageData,
  SegmentBreakdown,
  ChannelPerformance,
  VentureAlert,
  SimulationParams,
  SimulationResult,
  DealStage,
} from '../types';
import { initialDeals, salesReps as baseReps, ventureProfiles, initialAlerts } from '../data/mockData';
import { CurrencyCode } from '../utils/formatters';

interface DashboardContextType {
  // Venture & Configuration
  ventureStage: VentureStage;
  setVentureStage: (stage: VentureStage) => void;
  currency: CurrencyCode;
  setCurrency: (c: CurrencyCode) => void;
  darkMode: boolean;
  setDarkMode: (dark: boolean) => void;
  toggleDarkMode: () => void;

  // Active Tab
  activeTab: 'overview' | 'pipeline' | 'unit-economics' | 'deals' | 'simulator';
  setActiveTab: (tab: 'overview' | 'pipeline' | 'unit-economics' | 'deals' | 'simulator') => void;

  // Filter States
  dateRange: DateRangeKey;
  setDateRange: (range: DateRangeKey) => void;
  customStartDate: string;
  setCustomStartDate: (d: string) => void;
  customEndDate: string;
  setCustomEndDate: (d: string) => void;
  selectedSegment: CustomerSegment;
  setSelectedSegment: (segment: CustomerSegment) => void;
  selectedChannel: LeadChannel;
  setSelectedChannel: (channel: LeadChannel) => void;
  selectedRegion: SalesRegion;
  setSelectedRegion: (region: SalesRegion) => void;
  selectedRepId: string;
  setSelectedRepId: (repId: string) => void;
  comparisonMode: 'previous_period' | 'target';
  setComparisonMode: (mode: 'previous_period' | 'target') => void;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  resetFilters: () => void;
  activeFilterCount: number;

  // Data
  deals: Deal[];
  filteredDeals: Deal[];
  salesReps: SalesRep[];
  kpiMetrics: KPIMetrics;
  timeSeriesData: TimeSeriesPoint[];
  funnelData: FunnelStageData[];
  segmentBreakdown: SegmentBreakdown[];
  channelPerformance: ChannelPerformance[];
  alerts: VentureAlert[];

  // Interactive Actions
  addDeal: (deal: Omit<Deal, 'id' | 'salesCycleDays'>) => void;
  updateDeal: (id: string, updates: Partial<Deal>) => void;
  deleteDeal: (id: string) => void;
  moveDealStage: (id: string, newStage: DealStage) => void;
  selectedDeal: Deal | null;
  setSelectedDeal: (deal: Deal | null) => void;
  isNewDealModalOpen: boolean;
  setIsNewDealModalOpen: (open: boolean) => void;
  isReportModalOpen: boolean;
  setIsReportModalOpen: (open: boolean) => void;
  isNotificationsOpen: boolean;
  setIsNotificationsOpen: (open: boolean) => void;
  markAlertRead: (id: string) => void;
  dismissAlert: (id: string) => void;

  // Simulator
  simulationParams: SimulationParams;
  setSimulationParams: React.Dispatch<React.SetStateAction<SimulationParams>>;
  simulationResult: SimulationResult;
  applySimulationToDashboard: () => void;
}

const DashboardContext = createContext<DashboardContextType | undefined>(undefined);

export const DashboardProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [ventureStage, setVentureStage] = useState<VentureStage>('Series A SaaS');
  const [currency, setCurrency] = useState<CurrencyCode>('USD');
  const [darkMode, setDarkMode] = useState<boolean>(true);
  const [activeTab, setActiveTab] = useState<'overview' | 'pipeline' | 'unit-economics' | 'deals' | 'simulator'>('overview');

  // Filters
  const [dateRange, setDateRange] = useState<DateRangeKey>('90d');
  const [customStartDate, setCustomStartDate] = useState<string>('2025-01-01');
  const [customEndDate, setCustomEndDate] = useState<string>('2025-03-31');
  const [selectedSegment, setSelectedSegment] = useState<CustomerSegment>('All');
  const [selectedChannel, setSelectedChannel] = useState<LeadChannel>('All');
  const [selectedRegion, setSelectedRegion] = useState<SalesRegion>('All');
  const [selectedRepId, setSelectedRepId] = useState<string>('All');
  const [comparisonMode, setComparisonMode] = useState<'previous_period' | 'target'>('previous_period');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Modals / Drawers
  const [deals, setDeals] = useState<Deal[]>(initialDeals);
  const [selectedDeal, setSelectedDeal] = useState<Deal | null>(null);
  const [isNewDealModalOpen, setIsNewDealModalOpen] = useState<boolean>(false);
  const [isReportModalOpen, setIsReportModalOpen] = useState<boolean>(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState<boolean>(false);
  const [alerts, setAlerts] = useState<VentureAlert[]>(initialAlerts);

  // Simulation Params
  const [simulationParams, setSimulationParams] = useState<SimulationParams>({
    monthlyLeadCount: 140,
    leadToWinRate: 26,
    avgDealSize: 45000,
    churnRate: 1.8,
    monthlyBurn: 180000,
    cashInBank: 4200000,
    salesRepCount: 5,
  });

  // Dark mode class sync on HTML tag
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  const toggleDarkMode = () => setDarkMode((prev) => !prev);

  // Active filter count
  const activeFilterCount = useMemo(() => {
    let count = 0;
    if (dateRange !== '90d') count++;
    if (selectedSegment !== 'All') count++;
    if (selectedChannel !== 'All') count++;
    if (selectedRegion !== 'All') count++;
    if (selectedRepId !== 'All') count++;
    if (searchQuery.trim().length > 0) count++;
    return count;
  }, [dateRange, selectedSegment, selectedChannel, selectedRegion, selectedRepId, searchQuery]);

  const resetFilters = () => {
    setDateRange('90d');
    setSelectedSegment('All');
    setSelectedChannel('All');
    setSelectedRegion('All');
    setSelectedRepId('All');
    setSearchQuery('');
  };

  // Profile-based multiplier to scale metrics realistically
  const profileConfig = ventureProfiles[ventureStage];
  const profileMultiplier = useMemo(() => {
    switch (ventureStage) {
      case 'Seed PLG':
        return 0.42;
      case 'Series A SaaS':
        return 1.0;
      case 'Enterprise AI':
        return 1.6;
      case 'Fintech Scaleup':
        return 2.2;
      default:
        return 1.0;
    }
  }, [ventureStage]);

  // Filter Deals based on active filters
  const filteredDeals = useMemo(() => {
    return deals.filter((deal) => {
      // Segment filter
      if (selectedSegment !== 'All' && deal.segment !== selectedSegment) {
        return false;
      }
      // Channel filter
      if (selectedChannel !== 'All' && deal.channel !== selectedChannel) {
        return false;
      }
      // Region filter
      if (selectedRegion !== 'All' && deal.region !== selectedRegion) {
        return false;
      }
      // Rep filter
      if (selectedRepId !== 'All' && deal.owner.id !== selectedRepId) {
        return false;
      }
      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchName = deal.name.toLowerCase().includes(q);
        const matchCompany = deal.company.toLowerCase().includes(q);
        const matchContact = deal.contactName.toLowerCase().includes(q);
        const matchTag = deal.tags.some((t) => t.toLowerCase().includes(q));
        const matchOwner = deal.owner.name.toLowerCase().includes(q);
        if (!matchName && !matchCompany && !matchContact && !matchTag && !matchOwner) {
          return false;
        }
      }
      return true;
    });
  }, [deals, selectedSegment, selectedChannel, selectedRegion, selectedRepId, searchQuery]);

  // Recalculate KPIs based on current filtered deals & venture profile
  const kpiMetrics: KPIMetrics = useMemo(() => {
    const wonDeals = filteredDeals.filter((d) => d.stage === 'won');
    const closedDeals = filteredDeals.filter((d) => d.stage === 'won' || d.stage === 'lost');
    const activeDeals = filteredDeals.filter((d) => d.stage !== 'won' && d.stage !== 'lost');

    const totalPipelineValue = activeDeals.reduce((sum, d) => sum + d.value, 0) * profileMultiplier;
    const weightedPipeline = activeDeals.reduce((sum, d) => sum + (d.value * d.probability) / 100, 0) * profileMultiplier;

    const wonRevenue = wonDeals.reduce((sum, d) => sum + d.value, 0) * profileMultiplier;
    const baseARR = profileConfig.currentARR;
    const calculatedARR = wonRevenue > 0 ? baseARR * 0.75 + wonRevenue : baseARR;
    const calculatedMRR = calculatedARR / 12;

    const winRate = closedDeals.length > 0 ? (wonDeals.length / closedDeals.length) * 100 : profileConfig.winRate;

    const avgSalesCycle =
      wonDeals.length > 0
        ? Math.round(wonDeals.reduce((sum, d) => sum + d.salesCycleDays, 0) / wonDeals.length)
        : profileConfig.avgSalesCycle;

    const avgDealSize = wonDeals.length > 0 ? Math.round(wonRevenue / wonDeals.length) : Math.round(42000 * profileMultiplier);

    const cac = profileConfig.cac;
    const ltv = profileConfig.ltv;
    const ltvCacRatio = Number((ltv / Math.max(1, cac)).toFixed(2));
    const paybackMonths = Number((cac / Math.max(1, (avgDealSize / 12) * 0.8)).toFixed(1));

    const pipelineCoverage = Number((totalPipelineValue / Math.max(1, profileConfig.targetARR / 4)).toFixed(1));

    return {
      arr: Math.round(calculatedARR),
      arrTarget: profileConfig.targetARR,
      arrGrowthMoM: Number((18.4 + (profileMultiplier - 1) * 4).toFixed(1)),
      arrGrowthYoY: Number((84.2 + (profileMultiplier - 1) * 12).toFixed(1)),
      mrr: Math.round(calculatedMRR),
      mrrGrowth: Number((6.8 + (profileMultiplier - 1) * 2).toFixed(1)),
      pipelineValue: Math.round(totalPipelineValue),
      weightedPipeline: Math.round(weightedPipeline),
      pipelineCoverage: Math.max(1.8, pipelineCoverage),
      totalDealsCount: filteredDeals.length,
      activeDealsCount: activeDeals.length,
      winRate: Number(winRate.toFixed(1)),
      winRateDelta: 3.4,
      avgSalesCycleDays: avgSalesCycle,
      avgSalesCycleDelta: -4,
      avgDealSize,
      avgDealSizeDelta: 8.2,
      cac,
      cacDelta: -5.4,
      ltv,
      ltvCacRatio,
      paybackMonths,
      nrr: profileConfig.nrr,
      grr: 93.4,
      churnRate: Number((2.1 / profileMultiplier).toFixed(1)),
      burnMultiple: profileConfig.burnMultiple,
      runwayMonths: profileConfig.runwayMonths,
    };
  }, [filteredDeals, profileConfig, profileMultiplier]);

  // Recalculate Sales Reps dynamically
  const salesReps = useMemo(() => {
    return baseReps.map((rep) => {
      const repDeals = deals.filter((d) => d.owner.id === rep.id);
      const repWon = repDeals.filter((d) => d.stage === 'won');
      const repClosed = repDeals.filter((d) => d.stage === 'won' || d.stage === 'lost');
      const repActive = repDeals.filter((d) => d.stage !== 'won' && d.stage !== 'lost');

      const repAchieved = Math.round((rep.achieved + repWon.reduce((s, d) => s + d.value, 0) * 0.3) * profileMultiplier);
      const repQuota = Math.round(rep.quota * profileMultiplier);
      const repWinRate = repClosed.length > 0 ? (repWon.length / repClosed.length) * 100 : rep.winRate;

      const status: 'Top Performer' | 'On Track' | 'Needs Attention' =
        repAchieved >= repQuota ? 'Top Performer' : repAchieved >= repQuota * 0.75 ? 'On Track' : 'Needs Attention';

      return {
        ...rep,
        quota: repQuota,
        achieved: repAchieved,
        dealsClosed: repWon.length + rep.dealsClosed,
        activeDeals: repActive.length,
        winRate: Number(repWinRate.toFixed(1)),
        pipelineValue: Math.round(repActive.reduce((s, d) => s + d.value, 0) * profileMultiplier),
        status,
      };
    });
  }, [deals, profileMultiplier]);

  // Time-Series Data generator (Months)
  const timeSeriesData: TimeSeriesPoint[] = useMemo(() => {
    const months = ['Oct 2024', 'Nov 2024', 'Dec 2024', 'Jan 2025', 'Feb 2025', 'Mar 2025'];
    const baseRevenue = profileConfig.currentARR / 12;

    return months.map((month, idx) => {
      const growthFactor = 1 + idx * 0.085;
      const targetGrowth = 1 + idx * 0.075;
      const revenue = Math.round(baseRevenue * 0.7 * growthFactor * profileMultiplier);
      const target = Math.round(baseRevenue * 0.72 * targetGrowth * profileMultiplier);
      const mrr = Math.round(revenue * 0.95);
      const newArr = Math.round(revenue * 0.35);

      return {
        date: `2024-${String(10 + idx > 12 ? idx - 2 : 10 + idx).padStart(2, '0')}-01`,
        label: month,
        revenue,
        target,
        mrr,
        newArr,
        dealsWon: Math.round((8 + idx * 2.5) * (profileMultiplier > 1 ? 1.3 : 1)),
        pipelineAdded: Math.round(revenue * 3.2),
        cac: Math.round(profileConfig.cac * (1 - idx * 0.02)),
        burnRate: Math.round(revenue * profileConfig.burnMultiple * 0.4),
      };
    });
  }, [profileConfig, profileMultiplier]);

  // Funnel Data
  const funnelData: FunnelStageData[] = useMemo(() => {
    const leadCount = Math.round(180 * profileMultiplier);
    const qualCount = Math.round(112 * profileMultiplier);
    const demoCount = Math.round(68 * profileMultiplier);
    const propCount = Math.round(38 * profileMultiplier);
    const wonCount = Math.round(21 * profileMultiplier);

    const avgDeal = kpiMetrics.avgDealSize;

    return [
      {
        stage: 'lead',
        label: '1. Inbound & Outbound Leads',
        count: leadCount,
        value: leadCount * avgDeal * 0.6,
        conversionRate: Number(((qualCount / leadCount) * 100).toFixed(1)),
        avgDaysInStage: 4,
        dropOffRate: Number((((leadCount - qualCount) / leadCount) * 100).toFixed(1)),
      },
      {
        stage: 'qualified',
        label: '2. Qualified Discovery (SAL / SQL)',
        count: qualCount,
        value: qualCount * avgDeal * 0.8,
        conversionRate: Number(((demoCount / qualCount) * 100).toFixed(1)),
        avgDaysInStage: 9,
        dropOffRate: Number((((qualCount - demoCount) / qualCount) * 100).toFixed(1)),
      },
      {
        stage: 'demo',
        label: '3. Technical Demo & Architecture POC',
        count: demoCount,
        value: demoCount * avgDeal,
        conversionRate: Number(((propCount / demoCount) * 100).toFixed(1)),
        avgDaysInStage: 16,
        dropOffRate: Number((((demoCount - propCount) / demoCount) * 100).toFixed(1)),
      },
      {
        stage: 'proposal',
        label: '4. Proposal & Security Review',
        count: propCount,
        value: propCount * avgDeal * 1.1,
        conversionRate: Number(((wonCount / propCount) * 100).toFixed(1)),
        avgDaysInStage: 14,
        dropOffRate: Number((((propCount - wonCount) / propCount) * 100).toFixed(1)),
      },
      {
        stage: 'won',
        label: '5. Closed Won & Expansion',
        count: wonCount,
        value: wonCount * avgDeal * 1.15,
        conversionRate: 100,
        avgDaysInStage: 0,
        dropOffRate: 0,
      },
    ];
  }, [profileMultiplier, kpiMetrics.avgDealSize]);

  // Segment Breakdown
  const segmentBreakdown: SegmentBreakdown[] = useMemo(() => {
    const segments: Array<{ name: CustomerSegment; color: string }> = [
      { name: 'Enterprise', color: '#6366f1' },
      { name: 'Mid-Market', color: '#3b82f6' },
      { name: 'SMB', color: '#06b6d4' },
      { name: 'Startup', color: '#10b981' },
    ];

    const segStats = segments.map((seg) => {
      const segDeals = filteredDeals.filter((d) => d.segment === seg.name);
      const val = segDeals.reduce((sum, d) => sum + d.value, 0) * profileMultiplier;
      return {
        name: seg.name,
        value: Math.max(val, 20000 * profileMultiplier),
        dealsCount: segDeals.length || 1,
        color: seg.color,
        avgDealSize: segDeals.length > 0 ? Math.round(val / segDeals.length) : 35000,
        growth: seg.name === 'Enterprise' ? 34.2 : seg.name === 'Startup' ? 48.5 : 22.1,
      };
    });

    const totalVal = segStats.reduce((sum, s) => sum + s.value, 0);

    return segStats.map((s) => ({
      ...s,
      percentage: Number(((s.value / Math.max(1, totalVal)) * 100).toFixed(1)),
    }));
  }, [filteredDeals, profileMultiplier]);

  // Channel Performance Breakdown
  const channelPerformance: ChannelPerformance[] = useMemo(() => {
    const channels = [
      { name: 'Product-Led (PLG)', color: '#ec4899', cac: 1100, ltv: 16500, roi: 1400, conv: 14.8 },
      { name: 'Inbound Organic', color: '#10b981', cac: 2400, ltv: 28000, roi: 1060, conv: 11.2 },
      { name: 'Outbound SDR', color: '#6366f1', cac: 7800, ltv: 52000, roi: 566, conv: 6.4 },
      { name: 'Partner / Reseller', color: '#f59e0b', cac: 4200, ltv: 45000, roi: 970, conv: 18.5 },
      { name: 'Paid Growth', color: '#06b6d4', cac: 5900, ltv: 26000, roi: 340, conv: 4.8 },
    ];

    return channels.map((c) => {
      const channelDeals = filteredDeals.filter((d) => d.channel === c.name);
      const wonDeals = channelDeals.filter((d) => d.stage === 'won');
      const rev = (wonDeals.reduce((s, d) => s + d.value, 0) || 120000) * profileMultiplier;

      return {
        channel: c.name,
        dealsWon: Math.max(1, wonDeals.length),
        revenue: Math.round(rev),
        cac: Math.round(c.cac * (profileMultiplier > 1.2 ? 1.3 : 1)),
        ltv: Math.round(c.ltv * profileMultiplier),
        roi: c.roi,
        conversionRate: c.conv,
        color: c.color,
      };
    });
  }, [filteredDeals, profileMultiplier]);

  // Simulator Engine
  const simulationResult: SimulationResult = useMemo(() => {
    const { monthlyLeadCount, leadToWinRate, avgDealSize, churnRate, monthlyBurn, cashInBank, salesRepCount } = simulationParams;
    const monthlyWins = (monthlyLeadCount * (leadToWinRate / 100));
    const repCapacityWins = salesRepCount * 4.5;
    const actualMonthlyWins = Math.min(monthlyWins, repCapacityWins * 1.5);

    const monthlyNewARR = actualMonthlyWins * avgDealSize;
    const monthlyNewMRR = monthlyNewARR / 12;

    const projectedMRR12m = Math.round(kpiMetrics.mrr + monthlyNewMRR * 12 * (1 - churnRate / 100));
    const projectedARR12m = Math.round(projectedMRR12m * 12);

    const monthlyNetCashflow = monthlyNewMRR - monthlyBurn;
    let runwayMonths = 99;
    if (monthlyNetCashflow < 0) {
      runwayMonths = Math.max(1, Math.round(cashInBank / Math.abs(monthlyNetCashflow)));
    }

    const breakeven = monthlyNetCashflow >= 0 ? 'Profitable' : runwayMonths > 24 ? '> 24m' : Math.round(cashInBank / monthlyBurn);

    const cacPaybackMonths = Number(((profileConfig.cac / Math.max(1, avgDealSize / 12)) * 1.1).toFixed(1));

    return {
      projectedARR12m,
      projectedMRR12m,
      runwayMonths,
      breakevenMonth: breakeven,
      netRevenueGrowth: Number((((projectedARR12m - kpiMetrics.arr) / Math.max(1, kpiMetrics.arr)) * 100).toFixed(1)),
      cacPaybackMonths,
    };
  }, [simulationParams, kpiMetrics.mrr, kpiMetrics.arr, profileConfig.cac]);

  // Interactive Actions
  const triggerConfetti = () => {
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#6366f1', '#10b981', '#f59e0b', '#ec4899', '#3b82f6'],
      });
    } catch {
      // ignore
    }
  };

  const addDeal = (dealData: Omit<Deal, 'id' | 'salesCycleDays'>) => {
    const newId = `DEAL-${100 + deals.length + 1}`;
    const newDeal: Deal = {
      ...dealData,
      id: newId,
      salesCycleDays: 1,
    };
    setDeals((prev) => [newDeal, ...prev]);

    // Push new alert
    const newAlert: VentureAlert = {
      id: `alt-${Date.now()}`,
      type: dealData.stage === 'won' ? 'achievement' : 'opportunity',
      title: dealData.stage === 'won' ? `🎉 New Deal Won: ${dealData.company}!` : `✨ New Deal Added: ${dealData.company}`,
      description: `${dealData.name} valued at $${dealData.value.toLocaleString()} entered pipeline in ${dealData.stage} stage.`,
      timeAgo: 'Just now',
      actionLabel: 'View Deal',
      dealId: newId,
      isRead: false,
    };
    setAlerts((prev) => [newAlert, ...prev]);

    if (dealData.stage === 'won') {
      triggerConfetti();
    }
  };

  const updateDeal = (id: string, updates: Partial<Deal>) => {
    setDeals((prev) =>
      prev.map((deal) => {
        if (deal.id === id) {
          const updated = { ...deal, ...updates };
          if (updates.stage === 'won' && deal.stage !== 'won') {
            triggerConfetti();
          }
          return updated;
        }
        return deal;
      })
    );
  };

  const deleteDeal = (id: string) => {
    setDeals((prev) => prev.filter((d) => d.id !== id));
    if (selectedDeal?.id === id) {
      setSelectedDeal(null);
    }
  };

  const moveDealStage = (id: string, newStage: DealStage) => {
    const deal = deals.find((d) => d.id === id);
    if (!deal) return;

    let prob = deal.probability;
    if (newStage === 'lead') prob = 20;
    if (newStage === 'qualified') prob = 40;
    if (newStage === 'demo') prob = 60;
    if (newStage === 'proposal') prob = 75;
    if (newStage === 'negotiation') prob = 90;
    if (newStage === 'won') {
      prob = 100;
      triggerConfetti();
    }
    if (newStage === 'lost') prob = 0;

    updateDeal(id, { stage: newStage, probability: prob });
  };

  const markAlertRead = (id: string) => {
    setAlerts((prev) => prev.map((a) => (a.id === id ? { ...a, isRead: true } : a)));
  };

  const dismissAlert = (id: string) => {
    setAlerts((prev) => prev.filter((a) => a.id !== id));
  };

  const applySimulationToDashboard = () => {
    triggerConfetti();
    alert('Applied simulation scenario to current executive targets!');
  };

  return (
    <DashboardContext.Provider
      value={{
        ventureStage,
        setVentureStage,
        currency,
        setCurrency,
        darkMode,
        setDarkMode,
        toggleDarkMode,
        activeTab,
        setActiveTab,
        dateRange,
        setDateRange,
        customStartDate,
        setCustomStartDate,
        customEndDate,
        setCustomEndDate,
        selectedSegment,
        setSelectedSegment,
        selectedChannel,
        setSelectedChannel,
        selectedRegion,
        setSelectedRegion,
        selectedRepId,
        setSelectedRepId,
        comparisonMode,
        setComparisonMode,
        searchQuery,
        setSearchQuery,
        resetFilters,
        activeFilterCount,
        deals,
        filteredDeals,
        salesReps,
        kpiMetrics,
        timeSeriesData,
        funnelData,
        segmentBreakdown,
        channelPerformance,
        alerts,
        addDeal,
        updateDeal,
        deleteDeal,
        moveDealStage,
        selectedDeal,
        setSelectedDeal,
        isNewDealModalOpen,
        setIsNewDealModalOpen,
        isReportModalOpen,
        setIsReportModalOpen,
        isNotificationsOpen,
        setIsNotificationsOpen,
        markAlertRead,
        dismissAlert,
        simulationParams,
        setSimulationParams,
        simulationResult,
        applySimulationToDashboard,
      }}
    >
      {children}
    </DashboardContext.Provider>
  );
};

export const useDashboard = () => {
  const context = useContext(DashboardContext);
  if (!context) {
    throw new Error('useDashboard must be used within a DashboardProvider');
  }
  return context;
};
