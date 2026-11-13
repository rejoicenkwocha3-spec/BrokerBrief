import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { TopBar } from '@/components/dashboard/TopBar';
import { PipelineBoard } from './PipelineBoard';

export default async function PipelinePage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/signin');

  const { data: membershipRaw } = await supabase.from('organisation_members').select('organisation_id').eq('user_id', user.id).limit(1).single();
  if (!membershipRaw) return redirect('/onboarding');
  const membership = membershipRaw as { organisation_id: string };
  const orgId = membership.organisation_id;

  type DealRow = { id: string; title: string; value: number | null; currency: string; stage: string; probability: number | null; expected_close_date: string | null; clients: { first_name: string; last_name: string } | null };
  type ClientRow = { id: string; first_name: string; last_name: string };

  const { data: dealsRaw } = await supabase
    .from('deals')
    .select('id, title, value, currency, stage, probability, expected_close_date, clients(first_name, last_name)')
    .eq('organisation_id', orgId)
    .order('updated_at', { ascending: false });

  // Supabase returns joined relations as arrays; normalize to single object
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const deals = (dealsRaw as any[] | null)?.map((d) => ({
    ...d,
    clients: Array.isArray(d.clients) ? (d.clients[0] ?? null) : d.clients,
  })) as DealRow[] | null;

  const { data: clientsRaw } = await supabase.from('clients').select('id, first_name, last_name').eq('organisation_id', orgId).eq('status', 'active');
  const clients = clientsRaw as ClientRow[] | null;

  return (
    <div>
      <TopBar title="Pipeline" subtitle="Manage your deals" />
      <PipelineBoard initialDeals={deals ?? []} clients={clients ?? []} />
    </div>
  );
}
