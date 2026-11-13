import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { Sidebar } from '@/components/dashboard/Sidebar';

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect('/signin');

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single();

  if (profile && !profile.onboarding_completed) {
    redirect('/onboarding');
  }

  const { data: membership } = await supabase
    .from('organisation_members')
    .select('organisation_id, organisations(name)')
    .eq('user_id', user.id)
    .limit(1)
    .single();

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const orgRaw = membership?.organisations as any;
  const orgName: string | undefined = Array.isArray(orgRaw) ? orgRaw[0]?.name : orgRaw?.name;

  return (
    <div className="flex h-screen overflow-hidden bg-soft-white">
      <Sidebar
        orgName={orgName}
        userFirstName={profile?.first_name}
        userLastName={profile?.last_name}
      />
      <main className="flex-1 overflow-y-auto">
        {children}
      </main>
    </div>
  );
}
