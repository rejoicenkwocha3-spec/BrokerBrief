'use server';
import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import { getOrgId } from './helpers';

const clientSchema = z.object({
  first_name: z.string().min(1),
  last_name: z.string().min(1),
  email: z.string().email().optional().or(z.literal('')),
  phone: z.string().optional(),
  company: z.string().optional(),
  industry: z.string().optional(),
  client_type: z.enum(['individual', 'company', 'trust', 'smsf', 'other']).default('individual'),
  status: z.enum(['active', 'inactive', 'prospect', 'archived']).default('active'),
  source: z.string().optional(),
  notes: z.string().optional(),
});

export async function createClient_action(formData: FormData) {
  const orgId = await getOrgId();
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const parsed = clientSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { error: 'Invalid data' };

  const { error } = await supabase.from('clients').insert({
    ...parsed.data,
    organisation_id: orgId,
    assigned_to: user!.id,
    email: parsed.data.email || null,
  });

  if (error) return { error: error.message };
  revalidatePath('/clients');
  return { success: true };
}

export async function updateClient_action(id: string, formData: FormData) {
  const orgId = await getOrgId();
  const supabase = await createClient();

  const parsed = clientSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { error: 'Invalid data' };

  const { error } = await supabase.from('clients').update({
    ...parsed.data,
    email: parsed.data.email || null,
    updated_at: new Date().toISOString(),
  }).eq('id', id).eq('organisation_id', orgId);

  if (error) return { error: error.message };
  revalidatePath('/clients');
  revalidatePath(`/clients/${id}`);
  return { success: true };
}

export async function deleteClient_action(id: string) {
  const orgId = await getOrgId();
  const supabase = await createClient();
  const { error } = await supabase.from('clients').delete().eq('id', id).eq('organisation_id', orgId);
  if (error) return { error: error.message };
  revalidatePath('/clients');
  return { success: true };
}

export async function addClientNote_action(clientId: string, content: string) {
  const orgId = await getOrgId();
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const { error } = await supabase.from('client_notes').insert({
    client_id: clientId,
    organisation_id: orgId,
    author_id: user!.id,
    content,
  });

  if (error) return { error: error.message };
  revalidatePath(`/clients/${clientId}`);
  return { success: true };
}
