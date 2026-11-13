'use client';
import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Dialog, DialogTrigger, DialogContent } from '@/components/ui/Dialog';
import { Input } from '@/components/ui/Input';
import { Label } from '@/components/ui/Label';
import { UserPlus } from 'lucide-react';
import { createLead_action } from '@/app/actions/leads';
import { useRouter } from 'next/navigation';

export function AddLeadButton() {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    const result = await createLead_action(new FormData(e.currentTarget));
    if (result.error) { setError(result.error); setLoading(false); return; }
    setOpen(false);
    setLoading(false);
    router.refresh();
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm"><UserPlus className="w-4 h-4" /> Add Lead</Button>
      </DialogTrigger>
      <DialogContent title="Add New Lead">
        {error && <div className="bg-red-50 border border-red-200 text-red-600 text-sm rounded-lg px-4 py-3 mb-4">{error}</div>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div><Label htmlFor="first_name">First name *</Label><Input id="first_name" name="first_name" required /></div>
            <div><Label htmlFor="last_name">Last name *</Label><Input id="last_name" name="last_name" required /></div>
          </div>
          <div><Label htmlFor="email">Email</Label><Input id="email" name="email" type="email" /></div>
          <div><Label htmlFor="phone">Phone</Label><Input id="phone" name="phone" /></div>
          <div><Label htmlFor="company">Company</Label><Input id="company" name="company" /></div>
          <div>
            <Label htmlFor="source">Source</Label>
            <select name="source" className="input">
              <option value="">Select source...</option>
              <option>Referral</option><option>Website</option><option>Cold outreach</option>
              <option>LinkedIn</option><option>Event</option><option>Other</option>
            </select>
          </div>
          <div className="flex gap-3 pt-2">
            <Button variant="ghost" type="button" onClick={() => setOpen(false)} className="flex-1 justify-center">Cancel</Button>
            <Button type="submit" disabled={loading} className="flex-1 justify-center">{loading ? 'Adding...' : 'Add Lead'}</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
