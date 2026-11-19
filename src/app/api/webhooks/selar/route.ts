import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Map Selar product/plan identifiers to our plan names
const PLAN_MAP: Record<string, 'starter' | 'growth' | 'scale'> = {
  '47plan': 'starter',
  '57plan': 'growth',
  '97plan': 'scale',
};

function getPlan(productId: string): 'starter' | 'growth' | 'scale' | null {
  for (const [key, plan] of Object.entries(PLAN_MAP)) {
    if (productId.toLowerCase().includes(key)) return plan;
  }
  return null;
}

export async function POST(request: Request) {
  // Verify the webhook secret to ensure the request is from Selar
  const webhookSecret = process.env.SELAR_WEBHOOK_SECRET;
  if (webhookSecret) {
    const signature = request.headers.get('x-selar-signature') ?? request.headers.get('authorization');
    if (!signature || signature !== webhookSecret) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
  }

  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
  }

  // Selar sends order data — extract what we need
  // Field names may vary; adjust if Selar changes their payload structure
  const event = (body.event as string) ?? '';
  const orderId = (body.order_id ?? body.id ?? body.transaction_id) as string;
  const buyerEmail = (body.buyer_email ?? body.customer_email ?? body.email) as string;
  const productId = (body.product_id ?? body.product_link ?? body.link ?? '') as string;
  const status = (body.status ?? body.payment_status ?? '') as string;

  // Only process successful payment events
  const isSuccess =
    event.toLowerCase().includes('success') ||
    event.toLowerCase().includes('paid') ||
    event.toLowerCase().includes('completed') ||
    status.toLowerCase().includes('success') ||
    status.toLowerCase().includes('paid') ||
    status.toLowerCase().includes('completed');

  if (!isSuccess) {
    // Acknowledge non-payment events without taking action
    return NextResponse.json({ received: true, action: 'skipped' });
  }

  if (!buyerEmail || !productId || !orderId) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
  }

  const plan = getPlan(productId);
  if (!plan) {
    return NextResponse.json({ error: 'Unknown product' }, { status: 400 });
  }

  // Use service role key — never expose this in frontend code
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { autoRefreshToken: false, persistSession: false } }
  );

  // Look up the user by their email
  const { data: users, error: userError } = await supabase
    .from('profiles')
    .select('id')
    .eq('email', buyerEmail)
    .limit(1);

  if (userError || !users?.length) {
    // User may not have signed up yet — log and return 200 so Selar doesn't retry endlessly
    console.error('Selar webhook: user not found for email', buyerEmail);
    return NextResponse.json({ received: true, action: 'user_not_found' });
  }

  const userId = users[0].id;
  const expiresAt = new Date();
  expiresAt.setMonth(expiresAt.getMonth() + 1); // 30-day access

  // Upsert subscription — idempotent on selar_order_id
  const { error: upsertError } = await supabase
    .from('subscriptions')
    .upsert(
      {
        user_id: userId,
        plan,
        status: 'active',
        selar_order_id: orderId,
        started_at: new Date().toISOString(),
        expires_at: expiresAt.toISOString(),
      },
      { onConflict: 'selar_order_id' }
    );

  if (upsertError) {
    console.error('Selar webhook: failed to upsert subscription', upsertError);
    return NextResponse.json({ error: 'Database error' }, { status: 500 });
  }

  return NextResponse.json({ received: true, action: 'subscription_activated', plan });
}
