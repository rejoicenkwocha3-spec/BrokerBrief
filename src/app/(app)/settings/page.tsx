import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { TopBar } from '@/components/dashboard/TopBar';
import { ProfileSettings } from './ProfileSettings';
import { OrganisationSettings } from './OrganisationSettings';

export default async function SettingsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/signin');

  const [
    { data: profile },
    { data: membership },
  ] = await Promise.all([
    supabase.from('profiles').select('*').eq('id', user.id).single(),
    supabase.from('organisation_members').select('organisation_id, role').eq('user_id', user.id).limit(1).single(),
  ]);

  if (!membership) return redirect('/onboarding');
  const mem = membership as { organisation_id: string; role: string };

  const { data: org } = await supabase
    .from('organisations')
    .select('*')
    .eq('id', mem.organisation_id)
    .single();

  const isAdmin = mem.role === 'owner' || mem.role === 'admin';

  return (
    <div>
      <TopBar title="Settings" subtitle="Manage your account and organisation" />
      <div className="p-6 max-w-2xl space-y-8">
        <ProfileSettings profile={profile} email={user.email ?? ''} />
        {isAdmin && org && <OrganisationSettings org={org} />}
      </div>
    </div>
  );
}
