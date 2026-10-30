import React, { useState } from 'react';
import { X, Sparkles, Building2, User, DollarSign } from 'lucide-react';
import { useDashboard } from '../../context/DashboardContext';
import { CustomerSegment, DealHealth, DealStage, LeadChannel, SalesRegion } from '../../types';

export const NewDealModal: React.FC = () => {
  const { isNewDealModalOpen, setIsNewDealModalOpen, addDeal, salesReps } = useDashboard();

  const [company, setCompany] = useState('');
  const [dealName, setDealName] = useState('');
  const [value, setValue] = useState(65000);
  const [stage, setStage] = useState<DealStage>('qualified');
  const [segment, setSegment] = useState<CustomerSegment>('Mid-Market');
  const [channel, setChannel] = useState<LeadChannel>('Product-Led (PLG)');
  const [region, setRegion] = useState<SalesRegion>('North America');
  const [probability, setProbability] = useState(50);
  const [repId, setRepId] = useState(salesReps[0]?.id || 'rep-1');
  const [contactName, setContactName] = useState('Alex Rivers');
  const [contactEmail, setContactEmail] = useState('alex@company.io');
  const [contactRole, setContactRole] = useState('VP of Technology');
  const [health, setHealth] = useState<DealHealth>('healthy');
  const [tagInput, setTagInput] = useState('AI, SOC2, Growth');

  if (!isNewDealModalOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const selectedOwner = salesReps.find((r) => r.id === repId) || salesReps[0];
    const cleanTags = tagInput.split(',').map((t) => t.trim()).filter(Boolean);

    const colors = [
      'from-blue-600 to-indigo-600',
      'from-violet-500 to-purple-600',
      'from-emerald-500 to-teal-600',
      'from-amber-500 to-orange-600',
      'from-pink-500 to-rose-600',
    ];
    const randomColor = colors[Math.floor(Math.random() * colors.length)];

    const targetDate = new Date();
    targetDate.setDate(targetDate.getDate() + 45);
    const expectedCloseDate = targetDate.toISOString().split('T')[0];

    addDeal({
      name: dealName || `${company || 'Acme'} Enterprise License`,
      company: company || 'Acme Corp',
      logoColor: randomColor,
      stage,
      value: Number(value),
      mrr: Math.round(Number(value) / 12),
      owner: selectedOwner,
      segment: segment === 'All' ? 'Mid-Market' : segment,
      channel: channel === 'All' ? 'Inbound Organic' : channel,
      region: region === 'All' ? 'North America' : region,
      probability: Number(probability),
      createdDate: new Date().toISOString().split('T')[0],
      expectedCloseDate,
      health,
      tags: cleanTags.length > 0 ? cleanTags : ['Venture Deal'],
      contactName,
      contactEmail,
      contactRole,
      notesCount: 1,
      lastActivity: 'Initial discovery and scope confirmation',
    });

    setIsNewDealModalOpen(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-slate-900/70 backdrop-blur-xs"
        onClick={() => setIsNewDealModalOpen(false)}
      />

      <div className="relative w-full max-w-lg bg-white dark:bg-[#0f172a] rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden z-10 animate-in fade-in zoom-in-95 duration-150">
        
        {/* Header */}
        <div className="p-5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-indigo-600/10 text-indigo-600 flex items-center justify-center font-bold">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-base text-slate-900 dark:text-white">
                Create New Venture Deal
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Instantly feeds into revenue forecasts, pipeline quotas, and charts.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setIsNewDealModalOpen(false)}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-5 space-y-4 max-h-[75vh] overflow-y-auto">
          
          {/* Company & Deal Name */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                Company Name *
              </label>
              <div className="relative">
                <Building2 className="w-4 h-4 text-slate-400 absolute left-2.5 top-2.5" />
                <input
                  type="text"
                  required
                  placeholder="e.g. Apex Dynamics"
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                  className="w-full pl-8 pr-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-slate-100 focus:outline-none focus:border-indigo-500"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                Deal / Project Title
              </label>
              <input
                type="text"
                placeholder="e.g. Enterprise Cloud License"
                value={dealName}
                onChange={(e) => setDealName(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-slate-100 focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>

          {/* ACV Value & Probability */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                Annual Contract Value (ACV $) *
              </label>
              <div className="relative">
                <DollarSign className="w-4 h-4 text-emerald-500 absolute left-2.5 top-2.5" />
                <input
                  type="number"
                  required
                  min={1000}
                  step={1000}
                  value={value}
                  onChange={(e) => setValue(Number(e.target.value))}
                  className="w-full pl-8 pr-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-slate-100 font-mono font-bold focus:outline-none focus:border-indigo-500"
                />
              </div>
              <span className="text-[10px] text-slate-400 mt-0.5 block">
                MRR: ${(value / 12).toFixed(0)}/mo
              </span>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Win Probability: {probability}%
                </label>
              </div>
              <input
                type="range"
                min={10}
                max={100}
                step={5}
                value={probability}
                onChange={(e) => setProbability(Number(e.target.value))}
                className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-indigo-600 mt-2"
              />
            </div>
          </div>

          {/* Stage & Assigned Sales Rep */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                Sales Pipeline Stage
              </label>
              <select
                value={stage}
                onChange={(e) => setStage(e.target.value as DealStage)}
                className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-slate-100 font-medium"
              >
                <option value="lead">1. Lead Inflow</option>
                <option value="qualified">2. Qualified Discovery</option>
                <option value="demo">3. Technical Demo</option>
                <option value="proposal">4. Proposal & Review</option>
                <option value="negotiation">5. Final Negotiation</option>
                <option value="won">6. Closed Won 🎉</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                Assigned AE / Rep
              </label>
              <select
                value={repId}
                onChange={(e) => setRepId(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-slate-100 font-medium"
              >
                {salesReps.map((rep) => (
                  <option key={rep.id} value={rep.id}>
                    {rep.name} ({rep.role})
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Segment & Channel & Region */}
          <div className="grid grid-cols-3 gap-2">
            <div>
              <label className="text-[11px] font-semibold text-slate-400 block mb-1">Segment</label>
              <select
                value={segment}
                onChange={(e) => setSegment(e.target.value as CustomerSegment)}
                className="w-full px-2 py-1.5 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-slate-100"
              >
                <option value="Enterprise">Enterprise</option>
                <option value="Mid-Market">Mid-Market</option>
                <option value="SMB">SMB</option>
                <option value="Startup">Startup</option>
              </select>
            </div>

            <div>
              <label className="text-[11px] font-semibold text-slate-400 block mb-1">Channel</label>
              <select
                value={channel}
                onChange={(e) => setChannel(e.target.value as LeadChannel)}
                className="w-full px-2 py-1.5 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-slate-100"
              >
                <option value="Product-Led (PLG)">Product-Led (PLG)</option>
                <option value="Inbound Organic">Inbound Organic</option>
                <option value="Outbound SDR">Outbound SDR</option>
                <option value="Partner / Reseller">Partner / Reseller</option>
                <option value="Paid Growth">Paid Growth</option>
              </select>
            </div>

            <div>
              <label className="text-[11px] font-semibold text-slate-400 block mb-1">Region</label>
              <select
                value={region}
                onChange={(e) => setRegion(e.target.value as SalesRegion)}
                className="w-full px-2 py-1.5 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-slate-100"
              >
                <option value="North America">North America</option>
                <option value="EMEA">EMEA</option>
                <option value="APAC">APAC</option>
                <option value="LATAM">LATAM</option>
              </select>
            </div>
          </div>

          {/* Contact Details */}
          <div className="pt-2 border-t border-slate-100 dark:border-slate-800 grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                Executive Contact Name
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-400 absolute left-2.5 top-2.5" />
                <input
                  type="text"
                  value={contactName}
                  onChange={(e) => setContactName(e.target.value)}
                  className="w-full pl-8 pr-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-slate-100 focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                Contact Role
              </label>
              <input
                type="text"
                value={contactRole}
                onChange={(e) => setContactRole(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-slate-100 focus:outline-none"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                Contact Email
              </label>
              <input
                type="email"
                value={contactEmail}
                onChange={(e) => setContactEmail(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-slate-100 focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
              Initial Deal Health
            </label>
            <select
              value={health}
              onChange={(e) => setHealth(e.target.value as DealHealth)}
              className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-slate-100"
            >
              <option value="healthy">Healthy (High Momentum)</option>
              <option value="at-risk">At Risk (Slow Response)</option>
              <option value="stalled">Stalled (Needs Intervention)</option>
            </select>
          </div>

          {/* Tags */}
          <div>
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
              Tags (comma separated)
            </label>
            <input
              type="text"
              placeholder="e.g. AI Copilot, Series A, Security Review"
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-slate-100 focus:outline-none"
            />
          </div>

          {/* Modal Actions */}
          <div className="pt-4 border-t border-slate-200 dark:border-slate-800 flex items-center justify-end gap-2.5">
            <button
              type="button"
              onClick={() => setIsNewDealModalOpen(false)}
              className="px-4 py-2 text-xs font-semibold rounded-lg border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 text-xs font-bold rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white shadow-md shadow-indigo-600/30 transition-all"
            >
              Add to Pipeline
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
