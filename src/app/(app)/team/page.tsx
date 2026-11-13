import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { TopBar } from '@/components/dashboard/TopBar';
import { Avatar } from '@/components/ui/Avatar';
import { Badge } from '@/components/ui/Badge';
import { EmptyState } from '@/components/ui/EmptyState';
import { Users } from 'lucide-react';
import { InviteMemberButton } from './InviteMemberButton';
import { formatDate } from '@/lib/utils';

const ROLE_LABELS: Record<string, string> = {
  owner: 'Owner', admin: 'Admin', manager: 'Manager', broker: 'Broker', staff: 'Staff',
};
const ROLE_VARIANTS: Record<string, string> = {
  owner: 'success', admin: 'info', manager: 'info', broker: 'default', staff: 'default',
};

export default async function TeamPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/signin');

  const { data: membershipRaw } = await supabase
    .from('organisation_members')
    .select('organisation_id, role')
    .eq('user_id', user.id)
    .limit(1)
    .single();
  if (!membershipRaw) return redirect('/onboarding');
  const membership = membershipRaw as { organisation_id: string; role: string };
  const orgId = membership.organisation_id;

  const { data: members } = await supabase
    .from('organisation_members')
    .select('user_id, role, created_at, profiles(full_name, email, avatar_url)')
    .eq('organisation_id', orgId)
    .order('created_at', { ascending: true });

  const { data: invitations } = await supabase
    .from('organisation_invitations')
    .select('id, email, role, expires_at, accepted_at')
    .eq('organisation_id', orgId)
    .is('accepted_at', null)
    .order('created_at', { ascending: false });

  const isAdmin = membership.role === 'owner' || membership.role === 'admin';

  return (
    <div>
      <TopBar title="Team" subtitle="Manage your brokerage team" actions={isAdmin ? <InviteMemberButton orgId={orgId} /> : undefined} />
      <div className="p-6 space-y-6">
        <div className="card overflow-hidden">
          <div className="px-5 py-4 border-b border-gray-100">
            <h2 className="text-sm font-semibold text-charcoal">Members ({members?.length ?? 0})</h2>
          </div>
          {!members || members.length === 0 ? (
            <EmptyState icon={Users} title="No members" description="Invite your team to get started." />
          ) : (
            <table className="w-full">
              <thead className="bg-soft-white border-b border-gray-100">
                <tr>
                  {['Member', 'Email', 'Role', 'Joined', ''].map((h) => (
                    <th key={h} className="text-left text-xs font-semibold text-gray-400 uppercase tracking-wide px-5 py-3.5">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {members.map((m) => {
                  // eslint-disable-next-line @typescript-eslint/no-explicit-any
                  const profilesRaw = m.profiles as any;
                  const profile: { full_name: string | null; email: string | null; avatar_url: string | null } | null = Array.isArray(profilesRaw) ? (profilesRaw[0] ?? null) : (profilesRaw ?? null);
                  return (
                    <tr key={m.user_id} className="border-b border-gray-50 hover:bg-soft-white transition-colors">
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-3">
                          <Avatar firstName={profile?.full_name ?? profile?.email ?? 'U'} imageUrl={profile?.avatar_url ?? undefined} size="sm" />
                          <span className="text-sm font-medium text-charcoal">{profile?.full_name ?? 'Unknown'}</span>
                          {m.user_id === user.id && <span className="text-xs text-gray-400">(you)</span>}
                        </div>
                      </td>
                      <td className="px-5 py-3.5 text-sm text-gray-500">{profile?.email ?? '—'}</td>
                      <td className="px-5 py-3.5">
                        <Badge variant={(ROLE_VARIANTS[m.role] ?? 'default') as 'default' | 'success' | 'warning' | 'danger' | 'info' | 'purple'} className="capitalize">{ROLE_LABELS[m.role] ?? m.role}</Badge>
                      </td>
                      <td className="px-5 py-3.5 text-sm text-gray-400">{formatDate(m.created_at)}</td>
                      <td className="px-5 py-3.5" />
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>

        {invitations && invitations.length > 0 && (
          <div className="card overflow-hidden">
            <div className="px-5 py-4 border-b border-gray-100">
              <h2 className="text-sm font-semibold text-charcoal">Pending Invitations ({invitations.length})</h2>
            </div>
            <table className="w-full">
              <thead className="bg-soft-white border-b border-gray-100">
                <tr>
                  {['Email', 'Role', 'Expires'].map((h) => (
                    <th key={h} className="text-left text-xs font-semibold text-gray-400 uppercase tracking-wide px-5 py-3.5">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {invitations.map((inv) => (
                  <tr key={inv.id} className="border-b border-gray-50">
                    <td className="px-5 py-3.5 text-sm text-charcoal">{inv.email}</td>
                    <td className="px-5 py-3.5"><Badge variant="default" className="capitalize">{ROLE_LABELS[inv.role] ?? inv.role}</Badge></td>
                    <td className="px-5 py-3.5 text-sm text-gray-400">{inv.expires_at ? formatDate(inv.expires_at) : '—'}</td>
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
