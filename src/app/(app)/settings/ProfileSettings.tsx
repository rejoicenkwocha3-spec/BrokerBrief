'use client';
import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Label } from '@/components/ui/Label';
import { Avatar } from '@/components/ui/Avatar';
import { createClient } from '@/lib/supabase/browser';
import { useRouter } from 'next/navigation';

interface Profile {
  id: string;
  full_name: string | null;
  job_title: string | null;
  phone: string | null;
  avatar_url: string | null;
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
    await supabase.from('profiles').update({
      full_name: form.get('full_name') as string,
      job_title: form.get('job_title') as string,
      phone: form.get('phone') as string,
    }).eq('id', profile?.id ?? '');
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
    router.refresh();
    setLoading(false);
  };

  return (
    <section className="card p-6">
      <h2 className="text-base font-semibold text-charcoal mb-5">Profile</h2>
      <div className="flex items-center gap-4 mb-6">
        <Avatar firstName={profile?.full_name ?? email} size="lg" />
        <div>
          <p className="text-sm font-medium text-charcoal">{profile?.full_name ?? 'No name set'}</p>
          <p className="text-sm text-gray-500">{email}</p>
        </div>
      </div>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Label htmlFor="full_name">Full name</Label>
          <Input id="full_name" name="full_name" defaultValue={profile?.full_name ?? ''} />
        </div>
        <div>
          <Label htmlFor="job_title">Job title</Label>
          <Input id="job_title" name="job_title" defaultValue={profile?.job_title ?? ''} placeholder="e.g. Senior Broker" />
        </div>
        <div>
          <Label htmlFor="phone">Phone</Label>
          <Input id="phone" name="phone" type="tel" defaultValue={profile?.phone ?? ''} />
        </div>
        <div>
          <Label>Email</Label>
          <Input value={email} disabled className="opacity-60 cursor-not-allowed" readOnly />
        </div>
        <div className="flex items-center gap-3 pt-2">
          <Button type="submit" size="sm" disabled={loading}>{loading ? 'Saving...' : 'Save Changes'}</Button>
          {saved && <p className="text-sm text-emerald-brand font-medium">Saved!</p>}
        </div>
      </form>
    </section>
  );
}
