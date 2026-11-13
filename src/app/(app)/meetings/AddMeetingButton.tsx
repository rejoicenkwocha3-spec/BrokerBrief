'use client';
import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Dialog, DialogTrigger, DialogContent } from '@/components/ui/Dialog';
import { Input } from '@/components/ui/Input';
import { Label } from '@/components/ui/Label';
import { Calendar } from 'lucide-react';
import { createMeeting_action } from '@/app/actions/meetings';
import { useRouter } from 'next/navigation';

interface Client { id: string; first_name: string; last_name: string }

export function AddMeetingButton({ clients }: { clients: Client[] }) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    const result = await createMeeting_action(new FormData(e.currentTarget));
    if (!result.error) { setOpen(false); router.refresh(); }
    setLoading(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm"><Calendar className="w-4 h-4" /> Log Meeting</Button>
      </DialogTrigger>
      <DialogContent title="Log Meeting">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div><Label htmlFor="title">Meeting title *</Label><Input id="title" name="title" required /></div>
          <div>
            <Label htmlFor="meeting_type">Type</Label>
            <select name="meeting_type" className="input">
              <option value="client_meeting">Client Meeting</option>
              <option value="discovery_call">Discovery Call</option>
              <option value="review_meeting">Review Meeting</option>
              <option value="follow_up">Follow Up</option>
              <option value="internal_meeting">Internal Meeting</option>
            </select>
          </div>
          <div>
            <Label htmlFor="client_id">Client</Label>
            <select name="client_id" className="input">
              <option value="">Select client...</option>
              {clients.map((c) => <option key={c.id} value={c.id}>{c.first_name} {c.last_name}</option>)}
            </select>
          </div>
          <div><Label htmlFor="scheduled_at">Scheduled at</Label><Input id="scheduled_at" name="scheduled_at" type="datetime-local" /></div>
          <div><Label htmlFor="duration_minutes">Duration (minutes)</Label><Input id="duration_minutes" name="duration_minutes" type="number" placeholder="60" /></div>
          <div><Label htmlFor="location">Location</Label><Input id="location" name="location" placeholder="Zoom / Office / Phone" /></div>
          <div><Label htmlFor="notes">Notes</Label><textarea name="notes" rows={3} className="input" placeholder="Key topics, agenda..." /></div>
          <div className="flex gap-3 pt-2">
            <Button variant="ghost" type="button" onClick={() => setOpen(false)} className="flex-1 justify-center">Cancel</Button>
            <Button type="submit" disabled={loading} className="flex-1 justify-center">{loading ? 'Logging...' : 'Log Meeting'}</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
