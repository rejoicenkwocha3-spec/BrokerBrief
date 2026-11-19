import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { TopBar } from '@/components/dashboard/TopBar';
import { ProfileSettings } from './ProfileSettings';

export default async function SettingsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/signin');

  const { data: profile } = await supabase
    .from('profiles')
    .select('first_name, last_name, phone, job_title, avatar_url')
    .eq('id', user.id)
    .single();

  return (
    <div>
      <TopBar title="Account Settings" subtitle="Manage your profile and preferences" />
      <div className="p-6 max-w-2xl">
        <ProfileSettings profile={profile} email={user.email ?? ''} />
      </div>
    </div>
  );
}
