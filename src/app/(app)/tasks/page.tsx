import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { TopBar } from '@/components/dashboard/TopBar';
import { Badge, statusBadge, priorityBadge } from '@/components/ui/Badge';
import { formatDate } from '@/lib/utils';
import { EmptyState } from '@/components/ui/EmptyState';
import { CheckSquare } from 'lucide-react';
import { AddTaskButton } from './AddTaskButton';
import { CompleteTaskButton } from './CompleteTaskButton';

export default async function TasksPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/signin');

  const { data: membershipRaw } = await supabase.from('organisation_members').select('organisation_id').eq('user_id', user.id).limit(1).single();
  if (!membershipRaw) return redirect('/onboarding');
  const membership = membershipRaw as { organisation_id: string };
  const orgId = membership.organisation_id;

  const { data: tasks } = await supabase
    .from('tasks')
    .select('*, clients(first_name, last_name)')
    .eq('organisation_id', orgId)
    .order('due_date', { ascending: true, nullsFirst: false });

  const { data: clients } = await supabase.from('clients').select('id, first_name, last_name').eq('organisation_id', orgId);

  const now = new Date();

  return (
    <div>
      <TopBar title="Tasks" actions={<AddTaskButton clients={clients ?? []} />} />
      <div className="p-6">
        {!tasks || tasks.length === 0 ? (
          <EmptyState icon={CheckSquare} title="No tasks yet" description="Create tasks to track your follow-ups and to-dos." />
        ) : (
          <div className="card overflow-hidden">
            <table className="w-full">
              <thead className="bg-soft-white border-b border-gray-100">
                <tr>
                  {['Task', 'Client', 'Priority', 'Due', 'Status', ''].map((h) => (
                    <th key={h} className="text-left text-xs font-semibold text-gray-400 uppercase tracking-wide px-5 py-3.5">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {tasks.map((t) => {
                  const client = t.clients as { first_name: string; last_name: string } | null;
                  const overdue = t.due_date && new Date(t.due_date) < now && t.status !== 'completed';
                  return (
                    <tr key={t.id} className="border-b border-gray-50 hover:bg-soft-white transition-colors">
                      <td className="px-5 py-3.5 text-sm font-medium text-charcoal">{t.title}</td>
                      <td className="px-5 py-3.5 text-sm text-gray-500">{client ? `${client.first_name} ${client.last_name}` : '—'}</td>
                      <td className="px-5 py-3.5"><Badge variant={priorityBadge(t.priority)} className="capitalize">{t.priority}</Badge></td>
                      <td className={`px-5 py-3.5 text-sm ${overdue ? 'text-red-500 font-medium' : 'text-gray-500'}`}>
                        {t.due_date ? formatDate(t.due_date) : '—'}{overdue ? ' ⚠' : ''}
                      </td>
                      <td className="px-5 py-3.5"><Badge variant={statusBadge(t.status)} className="capitalize">{t.status.replace('_', ' ')}</Badge></td>
                      <td className="px-5 py-3.5">
                        {t.status !== 'completed' && <CompleteTaskButton taskId={t.id} />}
                      </td>
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
