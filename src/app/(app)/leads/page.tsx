import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { TopBar } from '@/components/dashboard/TopBar';
import { Badge, statusBadge } from '@/components/ui/Badge';
import { formatDate } from '@/lib/utils';
import { EmptyState } from '@/components/ui/EmptyState';
import { UserPlus } from 'lucide-react';
import { AddLeadButton } from './AddLeadButton';

export default async function LeadsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/signin');

  const { data: membershipRaw } = await supabase.from('organisation_members').select('organisation_id').eq('user_id', user.id).limit(1).single();
  if (!membershipRaw) return redirect('/onboarding');
  const membership = membershipRaw as { organisation_id: string };
  const orgId = membership.organisation_id;

  const { data: leads } = await supabase
    .from('leads')
    .select('*')
    .eq('organisation_id', orgId)
    .order('created_at', { ascending: false });

  return (
    <div>
      <TopBar title="Leads" subtitle={`${leads?.length ?? 0} total`} actions={<AddLeadButton />} />
      <div className="p-6">
        {!leads || leads.length === 0 ? (
          <EmptyState icon={UserPlus} title="No leads yet" description="Add leads to track potential clients before converting them." />
        ) : (
          <div className="card overflow-hidden">
            <table className="w-full">
              <thead className="bg-soft-white border-b border-gray-100">
                <tr>
                  {['Name', 'Company', 'Email', 'Source', 'Status', 'Added'].map((h) => (
                    <th key={h} className="text-left text-xs font-semibold text-gray-400 uppercase tracking-wide px-5 py-3.5">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {leads.map((l) => (
                  <tr key={l.id} className="border-b border-gray-50 hover:bg-soft-white transition-colors">
                    <td className="px-5 py-3.5 font-medium text-sm text-charcoal">{l.first_name} {l.last_name}</td>
                    <td className="px-5 py-3.5 text-sm text-gray-500">{l.company || '—'}</td>
                    <td className="px-5 py-3.5 text-sm text-gray-500">{l.email || '—'}</td>
                    <td className="px-5 py-3.5 text-sm text-gray-500">{l.source || '—'}</td>
                    <td className="px-5 py-3.5">
                      <Badge variant={statusBadge(l.status)} className="capitalize">{l.status}</Badge>
                    </td>
                    <td className="px-5 py-3.5 text-sm text-gray-400">{formatDate(l.created_at)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
