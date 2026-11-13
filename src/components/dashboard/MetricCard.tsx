import { type LucideIcon, TrendingUp, TrendingDown } from 'lucide-react';
import { cn } from '@/lib/utils';

interface MetricCardProps {
  label: string;
  value: string | number;
  delta?: { value: string; positive: boolean } | string;
  icon: LucideIcon;
  iconColor?: string;
}

export function MetricCard({ label, value, delta, icon: Icon, iconColor = 'text-forest' }: MetricCardProps) {
  return (
    <div className="bg-white border border-gray-100 rounded-xl p-5 shadow-sm">
      <div className="flex items-start justify-between mb-3">
        <p className="text-sm text-gray-500 font-medium">{label}</p>
        <div className={cn('w-9 h-9 rounded-lg bg-mint flex items-center justify-center', iconColor)}>
          <Icon className="w-4.5 h-4.5" />
        </div>
      </div>
      <p className="text-2xl font-bold text-charcoal">{value}</p>
      {delta && (
        typeof delta === 'string'
          ? <p className="text-xs text-gray-400 mt-1">{delta}</p>
          : (
            <div className={cn('flex items-center gap-1 mt-1 text-xs font-medium', delta.positive ? 'text-bright-green' : 'text-red-500')}>
              {delta.positive ? <TrendingUp className="w-3.5 h-3.5" /> : <TrendingDown className="w-3.5 h-3.5" />}
              <span>{delta.value}</span>
            </div>
          )
      )}
    </div>
  );
}
