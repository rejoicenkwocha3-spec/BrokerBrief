import { cn } from '@/lib/utils';

type BadgeVariant = 'default' | 'success' | 'warning' | 'danger' | 'info' | 'purple';

const variantClasses: Record<BadgeVariant, string> = {
  default: 'bg-gray-100 text-gray-700',
  success: 'bg-green-100 text-green-700',
  warning: 'bg-yellow-100 text-yellow-700',
  danger: 'bg-red-100 text-red-600',
  info: 'bg-blue-100 text-blue-700',
  purple: 'bg-purple-100 text-ai-purple',
};

export function Badge({
  children,
  variant = 'default',
  className,
}: {
  children: React.ReactNode;
  variant?: BadgeVariant;
  className?: string;
}) {
  return (
    <span
      className={cn(
        'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold',
        variantClasses[variant],
        className
      )}
    >
      {children}
    </span>
  );
}

export function statusBadge(status: string) {
  const map: Record<string, BadgeVariant> = {
    active: 'success',
    inactive: 'default',
    prospect: 'info',
    archived: 'default',
    new: 'info',
    contacted: 'warning',
    qualified: 'success',
    converted: 'success',
    lost: 'danger',
    todo: 'default',
    in_progress: 'info',
    completed: 'success',
    overdue: 'danger',
    scheduled: 'info',
    cancelled: 'danger',
    no_show: 'warning',
    won: 'success',
    new_lead: 'default',
    proposal_sent: 'warning',
    negotiation: 'info',
  };
  return map[status] ?? 'default';
}

export function priorityBadge(priority: string) {
  const map: Record<string, BadgeVariant> = {
    low: 'default',
    medium: 'info',
    high: 'warning',
    urgent: 'danger',
  };
  return map[priority] ?? 'default';
}
