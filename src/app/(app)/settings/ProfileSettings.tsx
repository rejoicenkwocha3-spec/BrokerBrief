'use client';
import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Label } from '@/components/ui/Label';
import { createClient } from '@/lib/supabase/browser';
import { useRouter } from 'next/navigation';

interface Profile {
  first_name?: string | null;
  last_name?: string | null;
  job_title?: string | null;
  phone?: string | null;
  avatar_url?: string | null;
}

export function ProfileSettings({ profile, email }: { profile: Profile | null; email: string }) {
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    const form = new FormData(e.currentTarget);
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;
    await supabase.from('profiles').update({
      first_name: form.get('first_name') as string,
      last_name: form.get('last_name') as string,
      job_title: form.get('job_title') as string,
      phone: form.get('phone') as string,
    }).eq('id', user.id);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
    router.refresh();
    setLoading(false);
  };

  const initials = profile?.first_name
    ? `${profile.first_name.charAt(0)}${profile.last_name?.charAt(0) || ''}`.toUpperCase()
    : email.charAt(0).toUpperCase();

  return (
    <section className="bg-white border border-line rounded-xl p-7">
      <h2 className="text-base font-semibold text-charcoal mb-6">Profile Information</h2>
      <div className="flex items-center gap-4 mb-6">
        <div className="w-14 h-14 rounded-full bg-haze flex items-center justify-center">
          <span className="text-lg font-bold text-brand">{initials}</span>
        </div>
        <div>
          <p className="text-sm font-semibold text-charcoal">
            {profile?.first_name ? `${profile.first_name} ${profile.last_name || ''}`.trim() : 'No name set'}
          </p>
          <p className="text-sm text-dim">{email}</p>
        </div>
      </div>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="first_name">First name</Label>
            <Input id="first_name" name="first_name" defaultValue={profile?.first_name ?? ''} placeholder="First name" />
          </div>
          <div>
            <Label htmlFor="last_name">Last name</Label>
            <Input id="last_name" name="last_name" defaultValue={profile?.last_name ?? ''} placeholder="Last name" />
          </div>
        </div>
        <div>
          <Label htmlFor="job_title">Job title</Label>
          <Input id="job_title" name="job_title" defaultValue={profile?.job_title ?? ''} placeholder="e.g. Business Owner" />
        </div>
        <div>
          <Label htmlFor="phone">Phone</Label>
          <Input id="phone" name="phone" type="tel" defaultValue={profile?.phone ?? ''} placeholder="+1 555 000 0000" />
        </div>
        <div>
          <Label>Email address</Label>
          <Input value={email} disabled className="opacity-60 cursor-not-allowed bg-surface" readOnly />
        </div>
        <div className="flex items-center gap-3 pt-2">
          <Button type="submit" size="sm" disabled={loading}>{loading ? 'Saving...' : 'Save Changes'}</Button>
          {saved && <p className="text-sm text-brand font-medium">Saved successfully.</p>}
        </div>
      </form>
    </section>
  );
}
