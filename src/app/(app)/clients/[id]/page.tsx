import { createClient } from '@/lib/supabase/server';
import { notFound, redirect } from 'next/navigation';
import { TopBar } from '@/components/dashboard/TopBar';
import { Badge, statusBadge } from '@/components/ui/Badge';
import { formatDate, formatDateTime } from '@/lib/utils';
import type { Database } from '@/types/database';
import Link from 'next/link';
import { ArrowLeft, Mail, Phone, Building2 } from 'lucide-react';

type ClientRow = Database['public']['Tables']['clients']['Row'];

interface Props { params: Promise<{ id: string }> }

export default async function ClientDetailPage({ params }: Props) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/signin');

  const { data: membershipRaw } = await supabase.from('organisation_members').select('organisation_id').eq('user_id', user.id).limit(1).single();
  if (!membershipRaw) return redirect('/onboarding');
  const membership = membershipRaw as { organisation_id: string };
  const orgId = membership.organisation_id;

  const { data: clientRaw } = await supabase
    .from('clients')
    .select('*')
    .eq('id', id)
    .eq('organisation_id', orgId)
    .single();

  if (!clientRaw) notFound();
  const client = clientRaw as ClientRow;

  type Activity = { id: string; title: string; created_at: string };
  type MeetingRow = { id: string; title: string; status: string; scheduled_at: string | null; meeting_type: string };
  type DealRow = { id: string; title: string; stage: string; value: number | null; expected_close_date: string | null };
  type TaskRow = { id: string; title: string; status: string; priority: string; due_date: string | null };
  type NoteRow = { id: string; content: string; created_at: string; author_id: string | null };
  type DocRow = { id: string; name: string; mime_type: string | null; size_bytes: number | null; created_at: string };

  const [
    { data: activitiesRaw },
    { data: meetingsRaw },
    { data: dealsRaw },
    { data: tasksRaw },
    { data: notesRaw },
    { data: docsRaw },
  ] = await Promise.all([
    supabase.from('client_activities').select('id, title, created_at').eq('client_id', id).order('created_at', { ascending: false }).limit(20),
    supabase.from('meetings').select('id, title, status, scheduled_at, meeting_type').eq('client_id', id).eq('organisation_id', orgId).order('scheduled_at', { ascending: false }).limit(10),
    supabase.from('deals').select('id, title, stage, value, expected_close_date').eq('client_id', id).eq('organisation_id', orgId).order('created_at', { ascending: false }).limit(10),
    supabase.from('tasks').select('id, title, status, priority, due_date').eq('client_id', id).eq('organisation_id', orgId).order('created_at', { ascending: false }).limit(10),
    supabase.from('client_notes').select('id, content, created_at, author_id').eq('client_id', id).order('created_at', { ascending: false }).limit(20),
    supabase.from('documents').select('id, name, mime_type, size_bytes, created_at').eq('client_id', id).eq('organisation_id', orgId).order('created_at', { ascending: false }).limit(10),
  ]);

  const activities = activitiesRaw as Activity[] | null;
  const meetings = meetingsRaw as MeetingRow[] | null;
  const deals = dealsRaw as DealRow[] | null;
  const tasks = tasksRaw as TaskRow[] | null;
  const notes = notesRaw as NoteRow[] | null;
  const docs = docsRaw as DocRow[] | null;

  return (
    <div>
      <TopBar
        title={`${client.first_name} ${client.last_name}`}
        subtitle={client.company || client.email || undefined}
        actions={
          <Link href="/clients" className="text-sm text-gray-500 hover:text-charcoal flex items-center gap-1">
            <ArrowLeft className="w-3.5 h-3.5" /> All Clients
          </Link>
        }
      />
      <div className="p-6">
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Client Info */}
          <div className="card p-5 space-y-4">
            <div className="flex items-start justify-between">
              <div>
                <h2 className="font-semibold text-charcoal text-lg">{client.first_name} {client.last_name}</h2>
                {client.company && <p className="text-sm text-gray-500">{client.company}</p>}
              </div>
              <Badge variant={statusBadge(client.status)} className="capitalize">{client.status}</Badge>
            </div>
            <div className="space-y-2.5 text-sm">
              {client.email && <div className="flex items-center gap-2 text-gray-600"><Mail className="w-4 h-4 text-gray-400" />{client.email}</div>}
              {client.phone && <div className="flex items-center gap-2 text-gray-600"><Phone className="w-4 h-4 text-gray-400" />{client.phone}</div>}
              {client.company && <div className="flex items-center gap-2 text-gray-600"><Building2 className="w-4 h-4 text-gray-400" />{client.company}</div>}
            </div>
            <div className="pt-2 border-t border-gray-100 text-xs text-gray-400">
              Added {formatDate(client.created_at)}
            </div>
          </div>

          {/* Right column */}
          <div className="lg:col-span-2 space-y-6">
            {/* Notes */}
            <div className="card p-5">
              <h3 className="font-semibold text-charcoal mb-3">Notes ({notes?.length ?? 0})</h3>
              {notes && notes.length > 0 ? (
                <ul className="space-y-3">
                  {notes.map((n) => (
                    <li key={n.id} className="bg-soft-white rounded-lg p-3 text-sm">
                      <p className="text-charcoal">{n.content}</p>
                      <p className="text-xs text-gray-400 mt-1">{formatDateTime(n.created_at)}</p>
                    </li>
                  ))}
                </ul>
              ) : <p className="text-sm text-gray-400">No notes yet.</p>}
            </div>

            {/* Deals */}
            <div className="card p-5">
              <h3 className="font-semibold text-charcoal mb-3">Deals ({deals?.length ?? 0})</h3>
              {deals && deals.length > 0 ? (
                <ul className="space-y-2">
                  {deals.map((d) => (
                    <li key={d.id} className="flex items-center justify-between text-sm py-1">
                      <span className="text-charcoal font-medium">{d.title}</span>
                      <div className="flex items-center gap-2">
                        {d.value && <span className="text-gray-500">${d.value.toLocaleString()}</span>}
                        <Badge variant={statusBadge(d.stage)} className="capitalize">{d.stage.replace('_', ' ')}</Badge>
                      </div>
                    </li>
                  ))}
                </ul>
              ) : <p className="text-sm text-gray-400">No deals linked.</p>}
            </div>

            {/* Meetings */}
            <div className="card p-5">
              <h3 className="font-semibold text-charcoal mb-3">Meetings ({meetings?.length ?? 0})</h3>
              {meetings && meetings.length > 0 ? (
                <ul className="space-y-2">
                  {meetings.map((m) => (
                    <li key={m.id} className="flex items-center justify-between text-sm py-1">
                      <span className="text-charcoal font-medium">{m.title}</span>
                      <div className="flex items-center gap-2">
                        {m.scheduled_at && <span className="text-gray-400 text-xs">{formatDate(m.scheduled_at)}</span>}
                        <Badge variant={statusBadge(m.status)} className="capitalize">{m.status}</Badge>
                      </div>
                    </li>
                  ))}
                </ul>
              ) : <p className="text-sm text-gray-400">No meetings logged.</p>}
            </div>

            {/* Tasks */}
            <div className="card p-5">
              <h3 className="font-semibold text-charcoal mb-3">Tasks ({tasks?.length ?? 0})</h3>
              {tasks && tasks.length > 0 ? (
                <ul className="space-y-2">
                  {tasks.map((t) => (
                    <li key={t.id} className="flex items-center justify-between text-sm py-1">
                      <span className={`font-medium ${t.status === 'completed' ? 'line-through text-gray-400' : 'text-charcoal'}`}>{t.title}</span>
                      <div className="flex items-center gap-2">
                        {t.due_date && <span className="text-gray-400 text-xs">{formatDate(t.due_date)}</span>}
                        <Badge variant={statusBadge(t.priority)} className="capitalize">{t.priority}</Badge>
                      </div>
                    </li>
                  ))}
                </ul>
              ) : <p className="text-sm text-gray-400">No tasks linked.</p>}
            </div>

            {/* Documents */}
            <div className="card p-5">
              <h3 className="font-semibold text-charcoal mb-3">Documents ({docs?.length ?? 0})</h3>
              {docs && docs.length > 0 ? (
                <ul className="space-y-2">
                  {docs.map((d) => (
                    <li key={d.id} className="flex items-center justify-between text-sm py-1">
                      <span className="text-charcoal">{d.name}</span>
                      <span className="text-xs text-gray-400">{formatDate(d.created_at)}</span>
                    </li>
                  ))}
                </ul>
              ) : <p className="text-sm text-gray-400">No documents uploaded.</p>}
            </div>

            {/* Activity */}
            <div className="card p-5">
              <h3 className="font-semibold text-charcoal mb-3">Activity</h3>
              {activities && activities.length > 0 ? (
                <ul className="space-y-3">
                  {activities.map((a) => (
                    <li key={a.id} className="flex items-start gap-3 text-sm">
                      <div className="w-2 h-2 rounded-full bg-emerald-brand mt-2 flex-shrink-0" />
                      <div className="flex-1">
                        <p className="text-charcoal">{a.title}</p>
                        <p className="text-xs text-gray-400">{formatDateTime(a.created_at)}</p>
                      </div>
                    </li>
                  ))}
                </ul>
              ) : <p className="text-sm text-gray-400">No activity recorded.</p>}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
