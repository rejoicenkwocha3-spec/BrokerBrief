'use client';
import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Dialog, DialogTrigger, DialogContent } from '@/components/ui/Dialog';
import { Input } from '@/components/ui/Input';
import { Label } from '@/components/ui/Label';
import { UserPlus } from 'lucide-react';
import { createClient } from '@/lib/supabase/browser';
import { useRouter } from 'next/navigation';

export function InviteMemberButton({ orgId }: { orgId: string }) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    const form = new FormData(e.currentTarget);
    const email = form.get('email') as string;
    const role = form.get('role') as string;

    const supabase = createClient();
    const expires = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString();
    const token = crypto.randomUUID();

    const { error: err } = await supabase.from('organisation_invitations').insert({
      organisation_id: orgId,
      email,
      role,
      token,
      expires_at: expires,
    });

    if (err) { setError(err.message); setLoading(false); return; }
    setOpen(false);
    router.refresh();
    setLoading(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm"><UserPlus className="w-4 h-4" /> Invite Member</Button>
      </DialogTrigger>
      <DialogContent title="Invite Team Member">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="email">Email address *</Label>
            <Input id="email" name="email" type="email" required placeholder="colleague@example.com" />
          </div>
          <div>
            <Label htmlFor="role">Role</Label>
            <select name="role" className="input">
              <option value="broker">Broker</option>
              <option value="staff">Staff</option>
              <option value="manager">Manager</option>
              <option value="admin">Admin</option>
            </select>
          </div>
          {error && <p className="text-sm text-red-500">{error}</p>}
          <div className="flex gap-3 pt-2">
            <Button variant="ghost" type="button" onClick={() => setOpen(false)} className="flex-1 justify-center">Cancel</Button>
            <Button type="submit" disabled={loading} className="flex-1 justify-center">{loading ? 'Sending...' : 'Send Invite'}</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
