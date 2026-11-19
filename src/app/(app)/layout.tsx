import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { Sidebar } from '@/components/dashboard/Sidebar';

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect('/signin');

  const { data: profile } = await supabase
    .from('profiles')
    .select('first_name, last_name, onboarding_completed')
    .eq('id', user.id)
    .single();

  if (profile && !profile.onboarding_completed) {
    redirect('/onboarding');
  }

  return (
    <div className="flex h-screen overflow-hidden bg-surface">
      <Sidebar
        userEmail={user.email}
        userFirstName={profile?.first_name}
        userLastName={profile?.last_name}
      />
      {/* Mobile sidebar overlay handled via CSS */}
      <main className="flex-1 overflow-y-auto min-w-0">
        {children}
      </main>
    </div>
  );
}
