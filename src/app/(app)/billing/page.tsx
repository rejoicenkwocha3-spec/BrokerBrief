import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { TopBar } from '@/components/dashboard/TopBar';
import { CreditCard, CheckCircle2, ArrowRight, ExternalLink } from 'lucide-react';

const plans = [
  {
    name: 'Starter',
    price: '$47/month',
    href: 'https://selar.co/47plan',
    features: ['1 business location', 'Visibility score tracking', 'Basic competitor monitoring', 'AI recommendations', 'Review summary'],
  },
  {
    name: 'Growth',
    price: '$57/month',
    href: 'https://selar.co/57plan',
    features: ['Up to 3 locations', 'Full visibility analytics', 'Full competitor monitoring', 'Priority AI recommendations', 'Monthly reports'],
    popular: true,
  },
  {
    name: 'Scale',
    price: '$97/month',
    href: 'https://selar.co/97plan',
    features: ['Up to 10 locations', 'All Growth features', 'API access', 'White-label reports', 'Dedicated support'],
  },
];

export default async function BillingPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/signin');

  const { data: subscription } = await supabase
    .from('subscriptions')
    .select('plan, status, started_at, expires_at')
    .eq('user_id', user.id)
    .maybeSingle();

  const activePlan = subscription?.status === 'active' ? subscription.plan : null;

  return (
    <div>
      <TopBar title="Billing and Subscription" subtitle="Manage your Locallndex plan" />
      <div className="p-6 space-y-6">

        {/* Current plan status */}
        <div className="bg-white border border-line rounded-xl p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-lg bg-haze flex items-center justify-center">
              <CreditCard className="w-5 h-5 text-brand" />
            </div>
            <div>
              <p className="font-semibold text-charcoal">Current Plan</p>
              <p className="text-sm text-dim">
                {activePlan
                  ? `${activePlan.charAt(0).toUpperCase() + activePlan.slice(1)} plan is active`
                  : 'No active subscription'}
              </p>
            </div>
          </div>
          {subscription?.expires_at && (
            <p className="text-sm text-dim">
              Plan renews: {new Date(subscription.expires_at).toLocaleDateString('en-US', {
                year: 'numeric', month: 'long', day: 'numeric',
              })}
            </p>
          )}
          {!activePlan && (
            <div className="mt-4 p-4 bg-haze rounded-lg">
              <p className="text-sm text-brand font-medium mb-1">No active subscription</p>
              <p className="text-sm text-dim">
                Select a plan below to unlock full platform access. Payment is processed via Selar.
              </p>
            </div>
          )}
        </div>

        {/* Plans */}
        <div>
          <h2 className="font-semibold text-charcoal mb-4">Available Plans</h2>
          <div className="grid md:grid-cols-3 gap-5">
            {plans.map(({ name, price, href, features, popular }) => {
              const isActive = activePlan?.toLowerCase() === name.toLowerCase();
              return (
                <div
                  key={name}
                  className={`bg-white border rounded-xl p-6 relative ${popular ? 'border-brand' : 'border-line'}`}
                >
                  {popular && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-brand text-white text-xs font-semibold px-3 py-1 rounded-full">
                      Most Popular
                    </div>
                  )}
                  <h3 className="font-bold text-charcoal text-lg mb-1">{name}</h3>
                  <p className="text-2xl font-bold text-brand mb-4">{price}</p>
                  {isActive ? (
                    <div className="w-full py-2.5 rounded-lg text-sm font-semibold text-center bg-green-50 text-green-700 border border-green-200 mb-5 flex items-center justify-center gap-1.5">
                      <CheckCircle2 className="w-4 h-4" /> Current Plan
                    </div>
                  ) : (
                    <a
                      href={href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full py-2.5 rounded-lg text-sm font-semibold text-center bg-brand hover:bg-brand-dark text-white block mb-5 transition-colors flex items-center justify-center gap-1.5"
                    >
                      {activePlan ? 'Switch to ' + name : 'Get ' + name}
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  )}
                  <ul className="space-y-2">
                    {features.map((f) => (
                      <li key={f} className="flex items-center gap-2 text-sm text-dim">
                        <CheckCircle2 className="w-3.5 h-3.5 text-brand flex-shrink-0" />
                        {f}
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })}
          </div>
        </div>

        {/* Payment note */}
        <div className="bg-surface border border-line rounded-xl p-5">
          <p className="text-sm font-semibold text-charcoal mb-1">About payments</p>
          <p className="text-sm text-dim">
            All payments are processed securely via Selar. After completing checkout, your plan will be activated and you will gain access to your selected tier. If you have questions about billing, contact our support team.
          </p>
        </div>
      </div>
    </div>
  );
}
