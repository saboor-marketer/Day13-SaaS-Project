# 🚀 VenturePulse — Interactive Sales Analytics Dashboard for High-Growth Ventures

**VenturePulse** is a modern, interactive sales intelligence and revenue velocity dashboard purpose-built for founders, CROs, and revenue operations teams at high-growth startups and scale-ups (Seed to Series B).

It combines real-time KPI tracking, interactive multi-dimensional visualizations, a sortable and actionable CRM pipeline (Table + Kanban), cohort retention heatmaps, and a live **"What-If" Growth & Runway Scenario Simulator**.

---

## ✨ Key Features

### 1. 📊 Venture-Focused KPI Summary Cards
- **Annual Recurring Revenue (ARR) & MRR**: Tracks recognized recurring revenue against board targets with MoM/YoY trend indicators and attainment progress bars.
- **Active & Weighted Sales Pipeline**: Displays total pipeline value, probability-weighted forecast, and quota coverage ratio (e.g., `3.4x Coverage`).
- **Win Rate & Deal Velocity**: Monitors closed-won conversion rates, average sales cycle length (in days), and average contract value (ACV).
- **LTV : CAC Unit Economics**: Evaluates Customer Lifetime Value against Customer Acquisition Cost alongside CAC payback period in months.
- **Net Revenue Retention (NRR)**: Tracks expansion revenue vs. gross retention (GRR) and monthly churn rate.
- **Venture Runway & Burn Multiple**: Connects sales velocity directly to capital efficiency, burn multiple, and cash runway in months.

### 2. 📈 Interactive Charts with Hover Tooltips & Transitions
- **Revenue Growth & Forecasting Chart**: Switch between **Area** and **Line** views across three metric modes (*Revenue vs Target*, *MRR & New ARR*, and *Pipeline Inflow vs Net Burn*).
- **End-to-End Venture Conversion Funnel**: Visualizes stage-by-stage progression (*Leads → Qualified → Demo → Proposal → Closed Won*) with conversion rates, drop-off analysis, and average days spent per stage.
- **Revenue by Segment Donut Chart**: Interactive donut chart breaking down ACV across *Enterprise*, *Mid-Market*, *SMB*, and *Startup* segments. Click any slice or legend item to filter the entire dashboard.
- **Channel Attribution & Unit ROI Bar Chart**: Compares revenue, CAC, LTV, and ROI across *Product-Led (PLG)*, *Inbound Organic*, *Outbound SDR*, *Partner / Reseller*, and *Paid Growth*.
- **Sales Quota Leaderboard**: Tracks individual Account Executive (AE) quota attainment, win rates, deals closed, and active pipeline ownership. Click any rep to filter the dashboard by their book of business.
- **Stage Velocity & Pipeline Weight Chart**: Compares total contract value against probability-weighted forecast across each pipeline stage.
- **NRR Cohort Retention Matrix**: Color-coded heatmap tracking dollar retention from `M0` through `M6` to highlight net negative churn and expansion trends.

### 3. 🗂️ Sortable & Filterable Sales CRM (Table + Kanban Board)
- **Dual View Modes**: Seamlessly toggle between a high-density **Data Table** and an interactive **Kanban Board**.
- **Multi-Column Sorting**: Sort deals by Company, ACV Value, Pipeline Stage, Win Probability, Rep Owner, or Target Close Date.
- **Quick Stage Progression**: Advance or move deals across stages directly from the table dropdown or Kanban cards—celebrating Closed Won deals with confetti and live metric recalculation.
- **Slide-Over Deal Inspector Drawer**: Click any deal to inspect stakeholder contacts, deal health status (*Healthy*, *At-Risk*, *Stalled*), stage progression steppers, tags, and an interactive activity note log.
- **Create New Deal Modal**: Add new opportunities to the pipeline and watch all KPIs, charts, and leaderboards update instantaneously.
- **CSV Export**: Export the currently filtered deal list directly to a `.csv` spreadsheet.

### 4. 🎛️ Live Global Filters & Venture Persona Switcher
- **Venture Stage Persona Switcher**: Switch between realistic venture profiles (*Series A SaaS*, *Seed PLG*, *Enterprise AI*, and *Fintech Scaleup*) to dynamically scale metrics and benchmarks.
- **Date Range Presets & Custom Picker**: Filter by `7D`, `30D`, `90D (Q1)`, `YTD`, `12M`, or select a custom start and end date.
- **Dimension Filters**: Filter live by Customer Segment, Acquisition Channel, Territory/Region (*North America*, *EMEA*, *APAC*, *LATAM*), Sales Representative, and Global Search query.
- **Comparison Benchmark Toggle**: Switch trend indicators between *vs Previous Period* and *vs Board Target*.
- **Multi-Currency Support**: Format all financial figures in `USD ($)`, `EUR (€)`, or `GBP (£)`.

### 5. 🧪 "What-If" Growth & Runway Scenario Simulator
- Interactive sliders for **Monthly Lead Volume**, **Lead-to-Won Conversion Rate (%)**, **Target Average ACV ($)**, **Quota-Carrying Reps**, and **Monthly Net Burn ($)**.
- Live calculation of **Projected 12-Month ARR**, **Forward MRR**, **Runway Horizon**, **Breakeven Timeline**, and **CAC Payback**.
- One-click strategic presets: *🚀 Aggressive Scale*, *🌱 PLG High Volume*, *💎 Enterprise $100k+*, and *🛡️ Default Alive*.

### 6. 🌓 Modern UI, Dark Mode & Executive Reporting
- **Dark & Light Mode Toggle**: Crafted with a high-contrast dark theme by default and a crisp light mode.
- **Venture AI Intel Banner & Notifications Drawer**: Actionable intelligence alerts for high-value deals, quota milestones, and stalled opportunities.
- **Executive Board Report Modal**: Printable/PDF-ready executive summary and one-click `.json` data snapshot export.

---

## 🛠️ Tech Stack

- **Framework**: [React 19](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/)
- **Build Tool**: [Vite](https://vitejs.dev/)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
- **Data Visualization**: [Recharts](https://recharts.org/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Micro-Interactions**: [Canvas Confetti](https://www.npmjs.com/package/canvas-confetti)

---

## 📁 Project Structure

```text
src/
├── components/
│   ├── Header.tsx                     # Top navigation, Venture Persona switcher, search, theme & modals
│   ├── FilterBar.tsx                  # Live date range, segment, channel, region & rep filters
│   ├── InsightsBanner.tsx             # AI sales intelligence & actionable alert strip
│   ├── KPICards.tsx                   # 6 venture KPI summary cards with trend deltas & gauges
│   ├── charts/
│   │   ├── RevenueGrowthChart.tsx     # Area/Line revenue, MRR, target & burn trajectory chart
│   │   ├── FunnelChart.tsx            # Stage-by-stage conversion & velocity funnel
│   │   ├── SegmentDonutChart.tsx      # Interactive ACV breakdown donut chart by segment
│   │   ├── ChannelEfficiencyChart.tsx # Bar chart comparing CAC, LTV & ROI by channel
│   │   ├── RepLeaderboard.tsx         # Sales rep quota attainment leaderboard
│   │   ├── CohortHeatmap.tsx          # Net Revenue Retention (NRR) cohort heatmap matrix
│   │   └── PipelineVelocityChart.tsx  # Total vs weighted pipeline bar chart by stage
│   ├── pipeline/
│   │   ├── DealsTable.tsx             # Sortable, filterable, paginated CRM table + CSV export
│   │   ├── DealsKanban.tsx            # Interactive stage progression Kanban board
│   │   ├── DealDetailDrawer.tsx       # Slide-over deal inspector & activity note log
│   │   └── NewDealModal.tsx           # Modal form to add new deals to the live pipeline
│   ├── simulator/
│   │   └── ScenarioSimulator.tsx      # Interactive "What-If" ARR & runway forecasting sandbox
│   └── modals/
│       ├── ExecutiveReportModal.tsx   # Printable board summary & JSON export modal
│       └── NotificationsDrawer.tsx    # Real-time venture alerts slide-over drawer
├── context/
│   └── DashboardContext.tsx           # Global state, filtering engine & live KPI recalculation
├── data/
│   └── mockData.ts                    # Realistic venture profiles, deals, reps & cohort datasets
├── types/
│   └── index.ts                       # TypeScript interfaces for deals, KPIs, charts & filters
├── utils/
│   ├── cn.ts                          # Classname utility helper
│   └── formatters.ts                  # Currency, percentage, compact number & stage color helpers
├── App.tsx                            # Main dashboard layout & tab view controller
├── main.tsx                           # Application entry point
└── index.css                          # Tailwind CSS imports, custom scrollbars & theme variables
```

---

## 🚀 Getting Started

### Prerequisites
- **Node.js** (v18 or higher recommended)
- **npm** (v9 or higher)

### Installation

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Start the development server:**
   ```bash
   npm run dev
   ```

3. **Build for production:**
   ```bash
   npm run build
   ```

4. **Preview the production build:**
   ```bash
   npm run preview
   ```
