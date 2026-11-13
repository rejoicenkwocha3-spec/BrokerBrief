'use server';
import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import { getOrgId } from './helpers';

const leadSchema = z.object({
  first_name: z.string().min(1),
  last_name: z.string().min(1),
  email: z.string().email().optional().or(z.literal('')),
  phone: z.string().optional(),
  company: z.string().optional(),
  source: z.string().optional(),
  notes: z.string().optional(),
});

export async function createLead_action(formData: FormData) {
  const orgId = await getOrgId();
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const parsed = leadSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { error: 'Invalid data' };

  const { error } = await supabase.from('leads').insert({
    organisation_id: orgId,
    assigned_to: user!.id,
    first_name: parsed.data.first_name,
    last_name: parsed.data.last_name,
    email: parsed.data.email || null,
    phone: parsed.data.phone || null,
    company: parsed.data.company || null,
    source: parsed.data.source || null,
    notes: parsed.data.notes || null,
    status: 'new',
  });

  if (error) return { error: error.message };
  revalidatePath('/leads');
  return { success: true };
}

export async function convertLead_action(leadId: string) {
  const orgId = await getOrgId();
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const { data: lead } = await supabase.from('leads').select('*').eq('id', leadId).eq('organisation_id', orgId).single();
  if (!lead) return { error: 'Lead not found' };

  const { data: client, error: clientError } = await supabase.from('clients').insert({
    organisation_id: orgId,
    assigned_to: user!.id,
    first_name: lead.first_name,
    last_name: lead.last_name,
    email: lead.email,
    phone: lead.phone,
    company: lead.company,
    source: lead.source,
    status: 'active',
    client_type: 'individual',
  }).select('id').single();

  if (clientError) return { error: clientError.message };

  await supabase.from('leads').update({
    status: 'converted',
    converted_client_id: client.id,
    converted_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  }).eq('id', leadId);

  revalidatePath('/leads');
  revalidatePath('/clients');
  return { success: true, clientId: client.id };
}
