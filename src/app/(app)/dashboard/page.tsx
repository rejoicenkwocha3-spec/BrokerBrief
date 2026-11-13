import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { MetricCard } from '@/components/dashboard/MetricCard';
import { TopBar } from '@/components/dashboard/TopBar';
import { Users, TrendingUp, DollarSign, Percent, Clock, Calendar, AlertCircle } from 'lucide-react';
import { formatCurrency, formatDate, formatDateTime } from '@/lib/utils';
import { Badge, statusBadge } from '@/components/ui/Badge';

export default async function DashboardPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/signin');

  const { data: membership } = await supabase
    .from('organisation_members')
    .select('organisation_id')
    .eq('user_id', user.id)
    .limit(1)
    .single();

  if (!membership) return redirect('/onboarding');
  const membership2 = membership as { organisation_id: string; role?: string };
  const orgId = membership2.organisation_id;

  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();
  const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();
  const threeDaysFromNow = new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString();

  type WonDeal = { value: number | null };
  type Activity = { id: string; title: string; created_at: string; clients: unknown };
  type Meeting = { id: string; title: string; scheduled_at: string | null; status: string; clients: unknown };
  type StalledDeal = { id: string; title: string; stage: string; updated_at: string; clients: unknown };
  type UrgentTask = { id: string; title: string; priority: string; due_date: string | null; clients: unknown };

  const [
    { count: clientCount },
    { count: activeDeals },
    { data: wonDealsRaw },
    { count: totalDeals },
    { data: recentActivityRaw },
    { data: upcomingMeetingsRaw },
    { data: stalledDealsRaw },
    { data: urgentTasksRaw },
  ] = await Promise.all([
    supabase.from('clients').select('*', { count: 'exact', head: true }).eq('organisation_id', orgId).neq('status', 'archived'),
    supabase.from('deals').select('*', { count: 'exact', head: true }).eq('organisation_id', orgId).not('stage', 'in', '("won","lost")'),
    supabase.from('deals').select('value').eq('organisation_id', orgId).eq('stage', 'won').gte('updated_at', startOfMonth),
    supabase.from('deals').select('*', { count: 'exact', head: true }).eq('organisation_id', orgId),
    supabase.from('client_activities').select('id, title, created_at, clients(first_name, last_name)').eq('organisation_id', orgId).order('created_at', { ascending: false }).limit(8),
    supabase.from('meetings').select('id, title, scheduled_at, status, clients(first_name, last_name)').eq('organisation_id', orgId).eq('status', 'scheduled').gte('scheduled_at', now.toISOString()).order('scheduled_at').limit(5),
    supabase.from('deals').select('id, title, stage, updated_at, clients(first_name, last_name)').eq('organisation_id', orgId).in('stage', ['proposal_sent', 'negotiation']).lte('updated_at', sevenDaysAgo).limit(5),
    supabase.from('tasks').select('id, title, priority, due_date, clients(first_name, last_name)').eq('organisation_id', orgId).in('status', ['todo', 'in_progress']).lte('due_date', threeDaysFromNow).order('due_date').limit(5),
  ]);

  const wonDeals = wonDealsRaw as WonDeal[] | null;
  const recentActivity = recentActivityRaw as Activity[] | null;
  const upcomingMeetings = upcomingMeetingsRaw as Meeting[] | null;
  const stalledDeals = stalledDealsRaw as StalledDeal[] | null;
  const urgentTasks = urgentTasksRaw as UrgentTask[] | null;

  const monthRevenue = wonDeals?.reduce((s, d) => s + (d.value ?? 0), 0) ?? 0;
  const conversionRate = totalDeals && totalDeals > 0
    ? Math.round(((wonDeals?.length ?? 0) / totalDeals) * 100)
    : 0;

  return (
    <div>
      <TopBar title="Overview" subtitle="Your brokerage at a glance" />
      <div className="p-6 space-y-6">
        {/* Metrics */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <MetricCard label="Total Clients" value={clientCount ?? 0} icon={Users} />
          <MetricCard label="Active Deals" value={activeDeals ?? 0} icon={TrendingUp} />
          <MetricCard label="Revenue This Month" value={formatCurrency(monthRevenue)} icon={DollarSign} />
          <MetricCard label="Conversion Rate" value={`${conversionRate}%`} icon={Percent} />
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          {/* Recent Activity */}
          <div className="card p-5">
            <h2 className="font-semibold text-charcoal mb-4">Recent Activity</h2>
            {recentActivity && recentActivity.length > 0 ? (
              <ul className="space-y-3">
                {recentActivity.map((a) => {
                  const client = a.clients as { first_name: string; last_name: string } | null;
                  return (
                    <li key={a.id} className="flex items-start gap-3 text-sm">
                      <div className="w-2 h-2 rounded-full bg-emerald-brand mt-1.5 flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="text-charcoal">{a.title}</p>
                        {client && <p className="text-gray-400 text-xs">{client.first_name} {client.last_name}</p>}
                      </div>
                      <span className="text-gray-400 text-xs flex-shrink-0">{formatDate(a.created_at)}</span>
                    </li>
                  );
                })}
              </ul>
            ) : (
              <p className="text-sm text-gray-400">No recent activity. Start adding clients and logging interactions.</p>
            )}
          </div>

          {/* Upcoming Meetings */}
          <div className="card p-5">
            <h2 className="font-semibold text-charcoal mb-4 flex items-center gap-2"><Calendar className="w-4 h-4 text-forest" /> Upcoming Meetings</h2>
            {upcomingMeetings && upcomingMeetings.length > 0 ? (
              <ul className="space-y-3">
                {upcomingMeetings.map((m) => {
                  const client = m.clients as { first_name: string; last_name: string } | null;
                  return (
                    <li key={m.id} className="flex items-start gap-3 text-sm">
                      <div className="w-9 h-9 rounded-lg bg-mint flex items-center justify-center flex-shrink-0">
                        <Calendar className="w-4 h-4 text-forest" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-charcoal truncate">{m.title}</p>
                        {client && <p className="text-gray-400 text-xs">{client.first_name} {client.last_name}</p>}
                        {m.scheduled_at && <p className="text-emerald-brand text-xs">{formatDateTime(m.scheduled_at)}</p>}
                      </div>
                    </li>
                  );
                })}
              </ul>
            ) : (
              <p className="text-sm text-gray-400">No upcoming meetings. Schedule one from the Meetings page.</p>
            )}
          </div>

          {/* Stalled Deals */}
          <div className="card p-5">
            <h2 className="font-semibold text-charcoal mb-4 flex items-center gap-2"><AlertCircle className="w-4 h-4 text-yellow-500" /> Deals Needing Attention</h2>
            {stalledDeals && stalledDeals.length > 0 ? (
              <ul className="space-y-3">
                {stalledDeals.map((d) => {
                  const client = d.clients as { first_name: string; last_name: string } | null;
                  return (
                    <li key={d.id} className="flex items-start gap-3 text-sm">
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-charcoal truncate">{d.title}</p>
                        {client && <p className="text-gray-400 text-xs">{client.first_name} {client.last_name}</p>}
                      </div>
                      <Badge variant={statusBadge(d.stage)}>{d.stage.replace('_', ' ')}</Badge>
                    </li>
                  );
                })}
              </ul>
            ) : (
              <p className="text-sm text-gray-400">No stalled deals. Pipeline is moving well.</p>
            )}
          </div>

          {/* Urgent Tasks */}
          <div className="card p-5">
            <h2 className="font-semibold text-charcoal mb-4 flex items-center gap-2"><Clock className="w-4 h-4 text-red-500" /> Urgent Tasks</h2>
            {urgentTasks && urgentTasks.length > 0 ? (
              <ul className="space-y-3">
                {urgentTasks.map((t) => {
                  const overdue = t.due_date && new Date(t.due_date) < now;
                  return (
                    <li key={t.id} className="flex items-start gap-3 text-sm">
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-charcoal truncate">{t.title}</p>
                        {t.due_date && (
                          <p className={`text-xs ${overdue ? 'text-red-500' : 'text-gray-400'}`}>
                            Due {formatDate(t.due_date)}{overdue ? ' — OVERDUE' : ''}
                          </p>
                        )}
                      </div>
                      <Badge variant={overdue ? 'danger' : 'warning'}>{t.priority}</Badge>
                    </li>
                  );
                })}
              </ul>
            ) : (
              <p className="text-sm text-gray-400">No urgent tasks. You&apos;re on top of things!</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
