import Link from 'next/link';
import { CheckCircle2 } from 'lucide-react';

const plans = [
  {
    name: 'Starter',
    price: 'Free',
    period: 'forever',
    desc: 'Perfect for solo brokers getting started.',
    features: [
      'Up to 50 clients',
      'Basic CRM and pipeline',
      'Task management',
      '5 GB document storage',
      '10 AI queries/month',
      'Email support',
    ],
    cta: 'Get started free',
    href: '/signup',
    highlight: false,
  },
  {
    name: 'Professional',
    price: '$79',
    period: 'per user/month',
    desc: 'For growing brokerages that need full power.',
    features: [
      'Unlimited clients',
      'Full CRM, pipeline & meetings',
      'AI Associate (unlimited)',
      'AI meeting summaries',
      'Document intelligence',
      '50 GB storage',
      'Team management (up to 10)',
      'Priority support',
      'API access',
    ],
    cta: 'Start 14-day trial',
    href: '/signup',
    highlight: true,
  },
  {
    name: 'Enterprise',
    price: 'Custom',
    period: 'contact us',
    desc: 'For large brokerages with custom requirements.',
    features: [
      'Everything in Professional',
      'Unlimited team members',
      'Custom integrations',
      'Dedicated account manager',
      'SLA guarantee',
      'Custom contract & billing',
      'On-premise option',
      'SSO & advanced security',
    ],
    cta: 'Contact sales',
    href: 'mailto:sales@brokerbrief.com',
    highlight: false,
  },
];

export default function PricingPage() {
  return (
    <div className="bg-soft-white py-20">
      <div className="max-w-5xl mx-auto px-5">
        <div className="text-center mb-14">
          <h1 className="font-playfair text-4xl md:text-5xl font-bold text-charcoal mb-4">Simple, transparent pricing.</h1>
          <p className="text-gray-500 text-lg">Start free. Scale as your brokerage grows.</p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {plans.map(({ name, price, period, desc, features, cta, href, highlight }) => (
            <div
              key={name}
              className={`rounded-2xl p-7 relative ${
                highlight
                  ? 'bg-forest text-white shadow-xl ring-2 ring-emerald-brand'
                  : 'bg-white border border-gray-100 shadow-sm'
              }`}
            >
              {highlight && (
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-emerald-brand text-white text-xs font-bold px-4 py-1 rounded-full">
                  Most Popular
                </div>
              )}
              <h2 className={`text-xl font-bold mb-1 ${highlight ? 'text-white' : 'text-charcoal'}`}>{name}</h2>
              <div className="flex items-baseline gap-1.5 mb-1">
                <span className={`text-4xl font-bold ${highlight ? 'text-white' : 'text-charcoal'}`}>{price}</span>
                {price !== 'Custom' && (
                  <span className={`text-sm ${highlight ? 'text-white/60' : 'text-gray-400'}`}>{period}</span>
                )}
              </div>
              <p className={`text-sm mb-6 ${highlight ? 'text-white/60' : 'text-gray-500'}`}>{desc}</p>
              <Link
                href={href}
                className={`block w-full text-center py-2.5 rounded-lg font-semibold text-sm transition-colors mb-7 ${
                  highlight
                    ? 'bg-emerald-brand hover:bg-[#068a58] text-white'
                    : 'bg-forest hover:bg-[#043820] text-white'
                }`}
              >
                {cta}
              </Link>
              <ul className="space-y-2.5">
                {features.map((f) => (
                  <li key={f} className={`flex items-start gap-2.5 text-sm ${highlight ? 'text-white/80' : 'text-gray-600'}`}>
                    <CheckCircle2 className={`w-4 h-4 flex-shrink-0 mt-0.5 ${highlight ? 'text-emerald-brand' : 'text-bright-green'}`} />
                    {f}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-16 text-center">
          <p className="text-gray-500 mb-2">All plans include a 14-day free trial. No credit card required.</p>
          <p className="text-sm text-gray-400">Questions? <a href="mailto:hello@brokerbrief.com" className="text-emerald-brand hover:underline">Contact us</a></p>
        </div>
      </div>
    </div>
  );
}
