import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { TopBar } from '@/components/dashboard/TopBar';
import { MetricCard } from '@/components/dashboard/MetricCard';
import { EmptyState } from '@/components/ui/EmptyState';
import { BarChart2, TrendingUp, Users, Target } from 'lucide-react';
import { InsightsCharts } from './InsightsCharts';
import { formatCurrency } from '@/lib/utils';

export default async function InsightsPage() {
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
  const startOfYear = new Date(now.getFullYear(), 0, 1).toISOString();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();

  const [
    { data: allDeals },
    { data: wonDeals },
    { data: clients },
    { data: leads },
  ] = await Promise.all([
    supabase.from('deals').select('id, stage, value, created_at, closed_at').eq('organisation_id', orgId),
    supabase.from('deals').select('value, closed_at').eq('organisation_id', orgId).eq('stage', 'won').gte('closed_at', startOfYear),
    supabase.from('clients').select('id, created_at, status').eq('organisation_id', orgId),
    supabase.from('leads').select('id, created_at, status').eq('organisation_id', orgId),
  ]);

  const totalRevenue = wonDeals?.reduce((sum, d) => sum + (d.value ?? 0), 0) ?? 0;
  const thisMonthRevenue = wonDeals?.filter((d) => d.closed_at && d.closed_at >= startOfMonth).reduce((sum, d) => sum + (d.value ?? 0), 0) ?? 0;
  const totalDeals = allDeals?.length ?? 0;
  const wonCount = allDeals?.filter((d) => d.stage === 'won').length ?? 0;
  const conversionRate = totalDeals > 0 ? Math.round((wonCount / totalDeals) * 100) : 0;
  const activeClients = clients?.filter((c) => c.status === 'active').length ?? 0;

  // Build monthly revenue data for chart (last 6 months)
  const monthlyData = Array.from({ length: 6 }, (_, i) => {
    const d = new Date(now.getFullYear(), now.getMonth() - 5 + i, 1);
    const monthStr = d.toLocaleString('default', { month: 'short', year: '2-digit' });
    const monthStart = new Date(d.getFullYear(), d.getMonth(), 1).toISOString();
    const monthEnd = new Date(d.getFullYear(), d.getMonth() + 1, 0).toISOString();
    const revenue = wonDeals?.filter((w) => w.closed_at && w.closed_at >= monthStart && w.closed_at <= monthEnd)
      .reduce((sum, w) => sum + (w.value ?? 0), 0) ?? 0;
    return { month: monthStr, revenue };
  });

  // Pipeline stage breakdown
  const stageOrder = ['new', 'contacted', 'qualified', 'proposal_sent', 'negotiation', 'won', 'lost'];
  const stageLabels: Record<string, string> = {
    new: 'New', contacted: 'Contacted', qualified: 'Qualified',
    proposal_sent: 'Proposal', negotiation: 'Negotiation', won: 'Won', lost: 'Lost',
  };
  const pipelineData = stageOrder.map((stage) => ({
    stage: stageLabels[stage],
    count: allDeals?.filter((d) => d.stage === stage).length ?? 0,
    value: allDeals?.filter((d) => d.stage === stage).reduce((sum, d) => sum + (d.value ?? 0), 0) ?? 0,
  }));

  return (
    <div>
      <TopBar title="Insights" subtitle="Your brokerage performance at a glance" />
      <div className="p-6 space-y-6">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <MetricCard label="YTD Revenue" value={formatCurrency(totalRevenue)} icon={TrendingUp} delta={thisMonthRevenue > 0 ? `+${formatCurrency(thisMonthRevenue)} this month` : undefined} />
          <MetricCard label="Active Clients" value={String(activeClients)} icon={Users} />
          <MetricCard label="Total Deals" value={String(totalDeals)} icon={Target} />
          <MetricCard label="Win Rate" value={`${conversionRate}%`} icon={BarChart2} delta={`${wonCount} won of ${totalDeals}`} />
        </div>

        {totalDeals === 0 ? (
          <EmptyState icon={BarChart2} title="No data yet" description="Once you start adding deals and clients, your insights will appear here." />
        ) : (
          <InsightsCharts monthlyData={monthlyData} pipelineData={pipelineData} />
        )}
      </div>
    </div>
  );
}
