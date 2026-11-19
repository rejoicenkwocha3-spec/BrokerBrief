import { type LucideIcon, TrendingUp, TrendingDown } from 'lucide-react';
import { cn } from '@/lib/utils';

interface MetricCardProps {
  label: string;
  value: string | number;
  delta?: { value: string; positive: boolean } | string;
  icon: LucideIcon;
  iconColor?: string;
}

export function MetricCard({ label, value, delta, icon: Icon, iconColor = 'text-brand' }: MetricCardProps) {
  return (
    <div className="bg-white border border-line rounded-xl p-5">
      <div className="flex items-start justify-between mb-3">
        <p className="text-sm text-dim font-medium">{label}</p>
        <div className={cn('w-9 h-9 rounded-lg bg-haze flex items-center justify-center', iconColor)}>
          <Icon className="w-4 h-4" />
        </div>
      </div>
      <p className="text-2xl font-bold text-charcoal">{value}</p>
      {delta && (
        typeof delta === 'string'
          ? <p className="text-xs text-dim mt-1">{delta}</p>
          : (
            <div className={cn('flex items-center gap-1 mt-1 text-xs font-medium', delta.positive ? 'text-green-600' : 'text-red-500')}>
              {delta.positive ? <TrendingUp className="w-3.5 h-3.5" /> : <TrendingDown className="w-3.5 h-3.5" />}
              <span>{delta.value}</span>
            </div>
          )
      )}
    </div>
  );
}
