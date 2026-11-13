import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { TopBar } from '@/components/dashboard/TopBar';
import Link from 'next/link';
import { formatDate } from '@/lib/utils';
import { Badge, statusBadge } from '@/components/ui/Badge';
import { Users } from 'lucide-react';
import { EmptyState } from '@/components/ui/EmptyState';
import { AddClientButton } from './AddClientButton';

export default async function ClientsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/signin');

  const { data: membershipRaw } = await supabase.from('organisation_members').select('organisation_id').eq('user_id', user.id).limit(1).single();
  if (!membershipRaw) return redirect('/onboarding');
  const membership = membershipRaw as { organisation_id: string };
  const orgId = membership.organisation_id;

  type ClientRow = { id: string; first_name: string; last_name: string; email: string | null; company: string | null; status: string; client_type: string; created_at: string };
  const { data: clientsRaw } = await supabase
    .from('clients')
    .select('id, first_name, last_name, email, company, status, client_type, created_at')
    .eq('organisation_id', orgId)
    .order('created_at', { ascending: false });
  const clients = clientsRaw as ClientRow[] | null;

  return (
    <div>
      <TopBar title="Clients" subtitle={`${clients?.length ?? 0} total`} actions={<AddClientButton />} />
      <div className="p-6">
        {!clients || clients.length === 0 ? (
          <EmptyState icon={Users} title="No clients yet" description="Add your first client to get started managing your relationships." />
        ) : (
          <div className="card overflow-hidden">
            <table className="w-full">
              <thead className="bg-soft-white border-b border-gray-100">
                <tr>
                  {['Name', 'Company', 'Email', 'Type', 'Status', 'Added'].map((h) => (
                    <th key={h} className="text-left text-xs font-semibold text-gray-400 uppercase tracking-wide px-5 py-3.5">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {clients.map((c) => (
                  <tr key={c.id} className="border-b border-gray-50 hover:bg-soft-white transition-colors">
                    <td className="px-5 py-3.5">
                      <Link href={`/clients/${c.id}`} className="font-medium text-charcoal hover:text-forest transition-colors text-sm">
                        {c.first_name} {c.last_name}
                      </Link>
                    </td>
                    <td className="px-5 py-3.5 text-sm text-gray-500">{c.company || '—'}</td>
                    <td className="px-5 py-3.5 text-sm text-gray-500">{c.email || '—'}</td>
                    <td className="px-5 py-3.5 text-sm text-gray-500 capitalize">{c.client_type}</td>
                    <td className="px-5 py-3.5">
                      <Badge variant={statusBadge(c.status)} className="capitalize">{c.status}</Badge>
                    </td>
                    <td className="px-5 py-3.5 text-sm text-gray-400">{formatDate(c.created_at)}</td>
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
