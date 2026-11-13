'use client';
import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Dialog, DialogTrigger, DialogContent } from '@/components/ui/Dialog';
import { Input } from '@/components/ui/Input';
import { Label } from '@/components/ui/Label';
import { Plus } from 'lucide-react';
import { createTask_action } from '@/app/actions/tasks';
import { useRouter } from 'next/navigation';

interface Client { id: string; first_name: string; last_name: string }

export function AddTaskButton({ clients }: { clients: Client[] }) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    const result = await createTask_action(new FormData(e.currentTarget));
    if (!result.error) { setOpen(false); router.refresh(); }
    setLoading(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm"><Plus className="w-4 h-4" /> Add Task</Button>
      </DialogTrigger>
      <DialogContent title="Add Task">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div><Label htmlFor="title">Task title *</Label><Input id="title" name="title" required /></div>
          <div>
            <Label htmlFor="priority">Priority</Label>
            <select name="priority" className="input">
              <option value="medium">Medium</option>
              <option value="low">Low</option>
              <option value="high">High</option>
              <option value="urgent">Urgent</option>
            </select>
          </div>
          <div><Label htmlFor="due_date">Due date</Label><Input id="due_date" name="due_date" type="date" /></div>
          <div>
            <Label htmlFor="client_id">Link to client</Label>
            <select name="client_id" className="input">
              <option value="">None</option>
              {clients.map((c) => <option key={c.id} value={c.id}>{c.first_name} {c.last_name}</option>)}
            </select>
          </div>
          <div><Label htmlFor="description">Description</Label><textarea name="description" rows={2} className="input" /></div>
          <div className="flex gap-3 pt-2">
            <Button variant="ghost" type="button" onClick={() => setOpen(false)} className="flex-1 justify-center">Cancel</Button>
            <Button type="submit" disabled={loading} className="flex-1 justify-center">{loading ? 'Adding...' : 'Add Task'}</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
