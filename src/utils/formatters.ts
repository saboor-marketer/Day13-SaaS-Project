export type CurrencyCode = 'USD' | 'EUR' | 'GBP';

export const currencySymbols: Record<CurrencyCode, string> = {
  USD: '$',
  EUR: '€',
  GBP: '£',
};

export function formatCurrency(
  amount: number,
  currency: CurrencyCode = 'USD',
  compact: boolean = false
): string {
  const symbol = currencySymbols[currency] || '$';
  
  if (compact) {
    if (Math.abs(amount) >= 1_000_000) {
      return `${symbol}${(amount / 1_000_000).toFixed(2)}M`;
    }
    if (Math.abs(amount) >= 1_000) {
      return `${symbol}${(amount / 1_000).toFixed(1)}k`;
    }
    return `${symbol}${amount.toLocaleString('en-US', { maximumFractionDigits: 0 })}`;
  }

  return `${symbol}${amount.toLocaleString('en-US', {
    maximumFractionDigits: 0,
  })}`;
}

export function formatNumber(num: number, compact: boolean = false): string {
  if (compact) {
    if (Math.abs(num) >= 1_000_000) {
      return `${(num / 1_000_000).toFixed(1)}M`;
    }
    if (Math.abs(num) >= 1_000) {
      return `${(num / 1_000).toFixed(1)}k`;
    }
  }
  return num.toLocaleString('en-US');
}

export function formatPercent(num: number, includeSign: boolean = false): string {
  const formatted = `${num >= 0 && includeSign ? '+' : ''}${num.toFixed(1)}%`;
  return formatted;
}

export function formatDate(dateStr: string): string {
  if (!dateStr) return '';
  const date = new Date(dateStr);
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

export function formatRelativeDate(dateStr: string): string {
  if (!dateStr) return '';
  const now = new Date();
  const date = new Date(dateStr);
  const diffInDays = Math.round((now.getTime() - date.getTime()) / (1000 * 3600 * 24));
  
  if (diffInDays === 0) return 'Today';
  if (diffInDays === 1) return 'Yesterday';
  if (diffInDays > 1 && diffInDays < 7) return `${diffInDays} days ago`;
  if (diffInDays < 0 && Math.abs(diffInDays) === 1) return 'Tomorrow';
  if (diffInDays < 0) return `In ${Math.abs(diffInDays)} days`;
  
  return formatDate(dateStr);
}

export const stageColorMap: Record<string, { bg: string; text: string; border: string; bar: string }> = {
  lead: {
    bg: 'bg-slate-100 dark:bg-slate-800/80',
    text: 'text-slate-700 dark:text-slate-300',
    border: 'border-slate-300 dark:border-slate-700',
    bar: '#94a3b8',
  },
  qualified: {
    bg: 'bg-blue-50 dark:bg-blue-950/40',
    text: 'text-blue-700 dark:text-blue-400',
    border: 'border-blue-200 dark:border-blue-800',
    bar: '#3b82f6',
  },
  demo: {
    bg: 'bg-indigo-50 dark:bg-indigo-950/40',
    text: 'text-indigo-700 dark:text-indigo-400',
    border: 'border-indigo-200 dark:border-indigo-800',
    bar: '#6366f1',
  },
  proposal: {
    bg: 'bg-amber-50 dark:bg-amber-950/40',
    text: 'text-amber-700 dark:text-amber-400',
    border: 'border-amber-200 dark:border-amber-800',
    bar: '#f59e0b',
  },
  negotiation: {
    bg: 'bg-purple-50 dark:bg-purple-950/40',
    text: 'text-purple-700 dark:text-purple-400',
    border: 'border-purple-200 dark:border-purple-800',
    bar: '#a855f7',
  },
  won: {
    bg: 'bg-emerald-50 dark:bg-emerald-950/40',
    text: 'text-emerald-700 dark:text-emerald-400',
    border: 'border-emerald-200 dark:border-emerald-800',
    bar: '#10b981',
  },
  lost: {
    bg: 'bg-rose-50 dark:bg-rose-950/40',
    text: 'text-rose-700 dark:text-rose-400',
    border: 'border-rose-200 dark:border-rose-800',
    bar: '#f43f5e',
  },
};

export const segmentColors: Record<string, string> = {
  Enterprise: '#6366f1', // Indigo
  'Mid-Market': '#3b82f6', // Blue
  SMB: '#06b6d4', // Cyan
  Startup: '#10b981', // Emerald
};

export const channelColors: Record<string, string> = {
  'Inbound Organic': '#10b981',
  'Outbound SDR': '#6366f1',
  'Product-Led (PLG)': '#ec4899',
  'Partner / Reseller': '#f59e0b',
  'Paid Growth': '#06b6d4',
};
