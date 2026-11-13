'use client';
import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Label } from '@/components/ui/Label';
import { createClient } from '@/lib/supabase/browser';
import { useRouter } from 'next/navigation';

interface Org {
  id: string;
  name: string;
  website: string | null;
  phone: string | null;
  address: string | null;
}

export function OrganisationSettings({ org }: { org: Org }) {
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    const form = new FormData(e.currentTarget);
    const supabase = createClient();
    await supabase.from('organisations').update({
      name: form.get('name') as string,
      website: form.get('website') as string || null,
      phone: form.get('phone') as string || null,
      address: form.get('address') as string || null,
    }).eq('id', org.id);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
    router.refresh();
    setLoading(false);
  };

  return (
    <section className="card p-6">
      <h2 className="text-base font-semibold text-charcoal mb-5">Organisation</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Label htmlFor="org_name">Organisation name *</Label>
          <Input id="org_name" name="name" defaultValue={org.name} required />
        </div>
        <div>
          <Label htmlFor="website">Website</Label>
          <Input id="website" name="website" type="url" defaultValue={org.website ?? ''} placeholder="https://yourbrokeragesite.com" />
        </div>
        <div>
          <Label htmlFor="org_phone">Phone</Label>
          <Input id="org_phone" name="phone" type="tel" defaultValue={org.phone ?? ''} />
        </div>
        <div>
          <Label htmlFor="address">Address</Label>
          <Input id="address" name="address" defaultValue={org.address ?? ''} placeholder="123 Main St, Sydney NSW 2000" />
        </div>
        <div className="flex items-center gap-3 pt-2">
          <Button type="submit" size="sm" disabled={loading}>{loading ? 'Saving...' : 'Save Changes'}</Button>
          {saved && <p className="text-sm text-emerald-brand font-medium">Saved!</p>}
        </div>
      </form>
    </section>
  );
}
