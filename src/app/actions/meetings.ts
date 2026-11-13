'use server';
import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import { getOrgId } from './helpers';

const meetingSchema = z.object({
  title: z.string().min(1),
  meeting_type: z.enum(['client_meeting', 'discovery_call', 'review_meeting', 'internal_meeting', 'follow_up']).default('client_meeting'),
  client_id: z.string().optional(),
  scheduled_at: z.string().optional(),
  duration_minutes: z.string().optional(),
  location: z.string().optional(),
  notes: z.string().optional(),
});

export async function createMeeting_action(formData: FormData) {
  const orgId = await getOrgId();
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const parsed = meetingSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { error: 'Invalid data' };

  const { error } = await supabase.from('meetings').insert({
    organisation_id: orgId,
    created_by: user!.id,
    title: parsed.data.title,
    meeting_type: parsed.data.meeting_type,
    client_id: parsed.data.client_id || null,
    scheduled_at: parsed.data.scheduled_at || null,
    duration_minutes: parsed.data.duration_minutes ? parseInt(parsed.data.duration_minutes) : null,
    location: parsed.data.location || null,
    notes: parsed.data.notes || null,
    status: 'scheduled',
  });

  if (error) return { error: error.message };
  revalidatePath('/meetings');
  return { success: true };
}

export async function completeMeeting_action(meetingId: string) {
  const orgId = await getOrgId();
  const supabase = await createClient();

  const { error } = await supabase.from('meetings').update({
    status: 'completed',
    updated_at: new Date().toISOString(),
  }).eq('id', meetingId).eq('organisation_id', orgId);

  if (error) return { error: error.message };
  revalidatePath('/meetings');
  return { success: true };
}
