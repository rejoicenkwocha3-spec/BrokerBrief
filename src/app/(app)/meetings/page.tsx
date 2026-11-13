import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { TopBar } from '@/components/dashboard/TopBar';
import { Badge, statusBadge } from '@/components/ui/Badge';
import { formatDateTime } from '@/lib/utils';
import { EmptyState } from '@/components/ui/EmptyState';
import { Calendar } from 'lucide-react';
import { AddMeetingButton } from './AddMeetingButton';

export default async function MeetingsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/signin');

  const { data: membershipRaw } = await supabase.from('organisation_members').select('organisation_id').eq('user_id', user.id).limit(1).single();
  if (!membershipRaw) return redirect('/onboarding');
  const membership = membershipRaw as { organisation_id: string };
  const orgId = membership.organisation_id;

  const { data: meetings } = await supabase
    .from('meetings')
    .select('*, clients(first_name, last_name)')
    .eq('organisation_id', orgId)
    .order('scheduled_at', { ascending: false });

  const { data: clients } = await supabase.from('clients').select('id, first_name, last_name').eq('organisation_id', orgId);

  return (
    <div>
      <TopBar title="Meetings" actions={<AddMeetingButton clients={clients ?? []} />} />
      <div className="p-6">
        {!meetings || meetings.length === 0 ? (
          <EmptyState icon={Calendar} title="No meetings yet" description="Log your first meeting to start tracking client interactions." />
        ) : (
          <div className="card overflow-hidden">
            <table className="w-full">
              <thead className="bg-soft-white border-b border-gray-100">
                <tr>
                  {['Title', 'Client', 'Type', 'Scheduled', 'Status'].map((h) => (
                    <th key={h} className="text-left text-xs font-semibold text-gray-400 uppercase tracking-wide px-5 py-3.5">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {meetings.map((m) => {
                  const client = m.clients as { first_name: string; last_name: string } | null;
                  return (
                    <tr key={m.id} className="border-b border-gray-50 hover:bg-soft-white transition-colors">
                      <td className="px-5 py-3.5 font-medium text-sm text-charcoal">{m.title}</td>
                      <td className="px-5 py-3.5 text-sm text-gray-500">{client ? `${client.first_name} ${client.last_name}` : '—'}</td>
                      <td className="px-5 py-3.5 text-sm text-gray-500 capitalize">{m.meeting_type.replace('_', ' ')}</td>
                      <td className="px-5 py-3.5 text-sm text-gray-500">{m.scheduled_at ? formatDateTime(m.scheduled_at) : '—'}</td>
                      <td className="px-5 py-3.5"><Badge variant={statusBadge(m.status)} className="capitalize">{m.status}</Badge></td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
