'use server';
import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import { getOrgId } from './helpers';

const dealSchema = z.object({
  title: z.string().min(1),
  client_id: z.string().uuid().optional().or(z.literal('')),
  value: z.string().optional(),
  currency: z.string().default('USD'),
  stage: z.enum(['new_lead', 'contacted', 'qualified', 'proposal_sent', 'negotiation', 'won', 'lost']).default('new_lead'),
  probability: z.string().optional(),
  expected_close_date: z.string().optional(),
  notes: z.string().optional(),
});

export async function createDeal_action(formData: FormData) {
  const orgId = await getOrgId();
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const parsed = dealSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { error: 'Invalid data' };

  const { error } = await supabase.from('deals').insert({
    organisation_id: orgId,
    owner_id: user!.id,
    title: parsed.data.title,
    client_id: parsed.data.client_id || null,
    value: parsed.data.value ? parseFloat(parsed.data.value) : null,
    currency: parsed.data.currency,
    stage: parsed.data.stage,
    probability: parsed.data.probability ? parseInt(parsed.data.probability) : null,
    expected_close_date: parsed.data.expected_close_date || null,
    notes: parsed.data.notes || null,
  });

  if (error) return { error: error.message };
  revalidatePath('/pipeline');
  return { success: true };
}

export async function updateDealStage_action(dealId: string, stage: string, prevStage: string) {
  const orgId = await getOrgId();
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const { error } = await supabase.from('deals').update({
    stage: stage as 'new_lead' | 'contacted' | 'qualified' | 'proposal_sent' | 'negotiation' | 'won' | 'lost',
    updated_at: new Date().toISOString(),
  }).eq('id', dealId).eq('organisation_id', orgId);

  if (error) return { error: error.message };

  await supabase.from('deal_activities').insert({
    deal_id: dealId,
    organisation_id: orgId,
    user_id: user!.id,
    from_stage: prevStage as 'new_lead',
    to_stage: stage as 'new_lead',
  });

  revalidatePath('/pipeline');
  return { success: true };
}
