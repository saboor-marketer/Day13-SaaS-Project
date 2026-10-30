export type VentureStage = 'Seed PLG' | 'Series A SaaS' | 'Enterprise AI' | 'Fintech Scaleup';

export type DateRangeKey = '7d' | '30d' | '90d' | 'ytd' | '12m' | 'custom';

export type CustomerSegment = 'All' | 'Enterprise' | 'Mid-Market' | 'SMB' | 'Startup';

export type LeadChannel = 'All' | 'Inbound Organic' | 'Outbound SDR' | 'Product-Led (PLG)' | 'Partner / Reseller' | 'Paid Growth';

export type SalesRegion = 'All' | 'North America' | 'EMEA' | 'APAC' | 'LATAM';

export type DealStage = 'lead' | 'qualified' | 'demo' | 'proposal' | 'negotiation' | 'won' | 'lost';

export type DealHealth = 'healthy' | 'at-risk' | 'stalled';

export interface Deal {
  id: string;
  name: string;
  company: string;
  companyDomain?: string;
  logoColor?: string;
  stage: DealStage;
  value: number; // Annual Contract Value (ACV)
  mrr: number;
  owner: {
    id: string;
    name: string;
    avatar: string;
    role: string;
  };
  segment: 'Enterprise' | 'Mid-Market' | 'SMB' | 'Startup';
  channel: 'Inbound Organic' | 'Outbound SDR' | 'Product-Led (PLG)' | 'Partner / Reseller' | 'Paid Growth';
  region: 'North America' | 'EMEA' | 'APAC' | 'LATAM';
  probability: number; // 0 to 100
  createdDate: string; // ISO date YYYY-MM-DD
  expectedCloseDate: string; // ISO date YYYY-MM-DD
  actualCloseDate?: string;
  salesCycleDays: number;
  health: DealHealth;
  tags: string[];
  contactName: string;
  contactEmail: string;
  contactRole: string;
  notesCount: number;
  lastActivity: string;
  competitor?: string;
  nextStep?: string;
}

export interface SalesRep {
  id: string;
  name: string;
  avatar: string;
  role: string;
  quota: number;
  achieved: number;
  dealsClosed: number;
  activeDeals: number;
  winRate: number;
  avgDealSize: number;
  pipelineValue: number;
  status: 'Top Performer' | 'On Track' | 'Needs Attention';
}

export interface KPIMetrics {
  arr: number;
  arrTarget: number;
  arrGrowthMoM: number;
  arrGrowthYoY: number;
  mrr: number;
  mrrGrowth: number;
  pipelineValue: number;
  weightedPipeline: number;
  pipelineCoverage: number; // e.g. 3.4x
  totalDealsCount: number;
  activeDealsCount: number;
  winRate: number;
  winRateDelta: number;
  avgSalesCycleDays: number;
  avgSalesCycleDelta: number;
  avgDealSize: number;
  avgDealSizeDelta: number;
  cac: number;
  cacDelta: number;
  ltv: number;
  ltvCacRatio: number;
  paybackMonths: number;
  nrr: number; // Net Revenue Retention %
  grr: number; // Gross Revenue Retention %
  churnRate: number; // %
  burnMultiple: number;
  runwayMonths: number;
}

export interface TimeSeriesPoint {
  date: string;
  label: string;
  revenue: number;
  target: number;
  mrr: number;
  newArr: number;
  dealsWon: number;
  pipelineAdded: number;
  cac: number;
  burnRate: number;
}

export interface FunnelStageData {
  stage: DealStage;
  label: string;
  count: number;
  value: number;
  conversionRate: number; // conversion to next stage
  avgDaysInStage: number;
  dropOffRate: number;
}

export interface SegmentBreakdown {
  name: string;
  value: number;
  dealsCount: number;
  percentage: number;
  color: string;
  avgDealSize: number;
  growth: number;
}

export interface ChannelPerformance {
  channel: string;
  dealsWon: number;
  revenue: number;
  cac: number;
  ltv: number;
  roi: number; // percentage
  conversionRate: number;
  color: string;
}

export interface CohortData {
  cohortMonth: string;
  initialCount: number;
  initialMRR: number;
  retentionMonths: number[]; // % retention for M0, M1, M2, M3, M4, M5, M6
}

export interface VentureAlert {
  id: string;
  type: 'opportunity' | 'warning' | 'achievement' | 'intel';
  title: string;
  description: string;
  timeAgo: string;
  actionLabel?: string;
  dealId?: string;
  isRead?: boolean;
}

export interface SimulationParams {
  monthlyLeadCount: number;
  leadToWinRate: number; // %
  avgDealSize: number; // $
  churnRate: number; // %
  monthlyBurn: number; // $
  cashInBank: number; // $
  salesRepCount: number;
}

export interface SimulationResult {
  projectedARR12m: number;
  projectedMRR12m: number;
  runwayMonths: number;
  breakevenMonth: number | 'Profitable' | '> 24m';
  netRevenueGrowth: number;
  cacPaybackMonths: number;
}
