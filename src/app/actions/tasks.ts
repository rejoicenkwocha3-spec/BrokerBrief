'use server';
import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import { getOrgId } from './helpers';

const taskSchema = z.object({
  title: z.string().min(1),
  description: z.string().optional(),
  priority: z.enum(['low', 'medium', 'high', 'urgent']).default('medium'),
  due_date: z.string().optional(),
  client_id: z.string().optional(),
});

export async function createTask_action(formData: FormData) {
  const orgId = await getOrgId();
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const parsed = taskSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { error: 'Invalid data' };

  const { error } = await supabase.from('tasks').insert({
    organisation_id: orgId,
    created_by: user!.id,
    assigned_to: user!.id,
    title: parsed.data.title,
    description: parsed.data.description || null,
    priority: parsed.data.priority,
    due_date: parsed.data.due_date || null,
    client_id: parsed.data.client_id || null,
    status: 'todo',
  });

  if (error) return { error: error.message };
  revalidatePath('/tasks');
  return { success: true };
}

export async function completeTask_action(taskId: string) {
  const orgId = await getOrgId();
  const supabase = await createClient();

  const { error } = await supabase.from('tasks').update({
    status: 'completed',
    completed_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  }).eq('id', taskId).eq('organisation_id', orgId);

  if (error) return { error: error.message };
  revalidatePath('/tasks');
  return { success: true };
}
