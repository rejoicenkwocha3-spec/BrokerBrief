import Link from 'next/link';
import { CheckCircle2, ArrowRight } from 'lucide-react';

export const metadata = {
  title: 'Pricing | Locallndex',
  description: 'Locallndex pricing plans for every business size. No hidden fees. Cancel any time.',
};

const plans = [
  {
    name: 'Starter',
    price: '$47',
    period: 'per month',
    tagline: 'For independent businesses getting started with local visibility.',
    href: 'https://selar.co/47plan',
    highlight: false,
    features: [
      { text: '1 business location', available: true },
      { text: 'Visibility score tracking', available: true },
      { text: 'Profile completeness scoring', available: true },
      { text: 'Basic competitor monitoring (2 competitors)', available: true },
      { text: 'Review summary dashboard', available: true },
      { text: 'AI recommendations', available: true },
      { text: 'Monthly performance snapshot', available: true },
      { text: 'Standard support', available: true },
      { text: 'Multi-location support', available: false },
      { text: 'Performance reports', available: false },
      { text: 'API access', available: false },
    ],
  },
  {
    name: 'Growth',
    price: '$57',
    period: 'per month',
    tagline: 'For businesses ready to grow their local market presence.',
    href: 'https://selar.co/57plan',
    highlight: true,
    features: [
      { text: 'Up to 3 business locations', available: true },
      { text: 'Full visibility analytics', available: true },
      { text: 'Profile completeness scoring', available: true },
      { text: 'Full competitor monitoring (5 competitors)', available: true },
      { text: 'Review management tools', available: true },
      { text: 'Priority AI recommendations', available: true },
      { text: 'Monthly performance reports', available: true },
      { text: 'Priority support', available: true },
      { text: 'Location performance comparison', available: true },
      { text: 'API access', available: false },
      { text: 'White-label reports', available: false },
    ],
  },
  {
    name: 'Scale',
    price: '$97',
    period: 'per month',
    tagline: 'For multi-location businesses and agencies managing multiple clients.',
    href: 'https://selar.co/97plan',
    highlight: false,
    features: [
      { text: 'Up to 10 business locations', available: true },
      { text: 'Full visibility analytics', available: true },
      { text: 'Profile completeness scoring', available: true },
      { text: 'Unlimited competitor monitoring', available: true },
      { text: 'Full review management tools', available: true },
      { text: 'Priority AI recommendations', available: true },
      { text: 'Full performance reporting suite', available: true },
      { text: 'Dedicated support', available: true },
      { text: 'Location performance comparison', available: true },
      { text: 'API access', available: true },
      { text: 'White-label reports', available: true },
    ],
  },
];

const faqs = [
  {
    q: 'How is payment handled?',
    a: 'All payments are processed securely through Selar. After completing checkout, your plan is activated and you gain access to your selected tier.',
  },
  {
    q: 'Can I change my plan later?',
    a: 'Yes. You can upgrade at any time by selecting a new plan from your billing dashboard.',
  },
  {
    q: 'Is there a free trial?',
    a: 'You can create an account and explore the platform. Paid features become available after selecting a plan.',
  },
  {
    q: 'What counts as a business location?',
    a: 'Each unique physical address you manage on the platform counts as one location. A business with one shop has one location; a business with three branches has three.',
  },
  {
    q: 'What happens if I cancel?',
    a: 'Your access continues until the end of your current billing period. After that, your account moves to limited access and your data remains available for 30 days.',
  },
];

export default function PricingPage() {
  return (
    <div className="bg-surface">

      {/* Hero */}
      <section className="bg-white py-20 border-b border-line">
        <div className="max-w-3xl mx-auto px-5 text-center">
          <p className="section-label mb-3">Pricing</p>
          <h1 className="text-4xl md:text-5xl font-bold text-charcoal mb-5 tracking-tight">
            Straightforward pricing.<br />No hidden fees.
          </h1>
          <p className="text-lg text-dim max-w-xl mx-auto leading-relaxed">
            Choose the plan that fits your business. All plans include core visibility tools and AI recommendations.
          </p>
        </div>
      </section>

      {/* Note on pricing */}
      <div className="bg-haze border-b border-brand/20 py-3">
        <p className="text-center text-xs text-brand font-medium">
          Prices shown in USD. Payment is processed via Selar. Access is activated after payment confirmation.
        </p>
      </div>

      {/* Pricing Cards */}
      <section className="py-20">
        <div className="max-w-5xl mx-auto px-5">
          <div className="grid md:grid-cols-3 gap-6">
            {plans.map(({ name, price, period, tagline, href, highlight, features }) => (
              <div
                key={name}
                className={`rounded-2xl border p-8 relative flex flex-col ${
                  highlight ? 'bg-brand border-brand text-white' : 'bg-white border-line'
                }`}
              >
                {highlight && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-charcoal text-white text-xs font-semibold px-3 py-1 rounded-full whitespace-nowrap">
                    Most Popular
                  </div>
                )}

                <div className="mb-6">
                  <h2 className={`font-bold text-xl mb-1 ${highlight ? 'text-white' : 'text-charcoal'}`}>{name}</h2>
                  <p className={`text-sm mb-4 ${highlight ? 'text-white/70' : 'text-dim'}`}>{tagline}</p>
                  <div className="flex items-baseline gap-1">
                    <span className={`text-5xl font-bold tracking-tight ${highlight ? 'text-white' : 'text-charcoal'}`}>{price}</span>
                    <span className={`text-sm ${highlight ? 'text-white/60' : 'text-dim'}`}>{period}</span>
                  </div>
                </div>

                <a
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`w-full py-3 rounded-lg text-sm font-semibold text-center block mb-7 transition-colors ${
                    highlight
                      ? 'bg-white text-brand hover:bg-white/90'
                      : 'bg-brand text-white hover:bg-brand-dark'
                  }`}
                >
                  Get {name}
                </a>

                <ul className="space-y-3 flex-1">
                  {features.map(({ text, available }) => (
                    <li key={text} className={`flex items-start gap-3 text-sm ${!available ? 'opacity-40' : ''}`}>
                      <CheckCircle2 className={`w-4 h-4 flex-shrink-0 mt-0.5 ${highlight ? 'text-white/70' : available ? 'text-brand' : 'text-dim'}`} />
                      <span className={highlight ? 'text-white/80' : available ? 'text-charcoal' : 'text-dim'}>
                        {text}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Feature Comparison Table */}
      <section className="py-10 pb-20">
        <div className="max-w-5xl mx-auto px-5">
          <div className="bg-white border border-line rounded-2xl overflow-hidden">
            <div className="grid grid-cols-4 border-b border-line">
              <div className="p-5 col-span-1">
                <p className="text-sm font-semibold text-dim">Feature</p>
              </div>
              {['Starter', 'Growth', 'Scale'].map((name) => (
                <div key={name} className="p-5 text-center border-l border-line">
                  <p className="text-sm font-semibold text-charcoal">{name}</p>
                </div>
              ))}
            </div>
            {[
              { feature: 'Business locations', values: ['1', '3', '10'] },
              { feature: 'Visibility score tracking', values: ['tick', 'tick', 'tick'] },
              { feature: 'Competitor monitoring', values: ['2', '5', 'Unlimited'] },
              { feature: 'AI recommendations', values: ['tick', 'Priority', 'Priority'] },
              { feature: 'Review dashboard', values: ['tick', 'tick', 'tick'] },
              { feature: 'Performance reports', values: ['Monthly', 'Full suite', 'Full suite'] },
              { feature: 'API access', values: ['—', '—', 'tick'] },
              { feature: 'White-label reports', values: ['—', '—', 'tick'] },
              { feature: 'Support', values: ['Standard', 'Priority', 'Dedicated'] },
            ].map(({ feature, values }) => (
              <div key={feature} className="grid grid-cols-4 border-b border-line last:border-0">
                <div className="p-4 text-sm text-dim">{feature}</div>
                {values.map((v, i) => (
                  <div key={i} className="p-4 text-center text-sm border-l border-line">
                    {v === 'tick' ? (
                      <CheckCircle2 className="w-4 h-4 text-brand mx-auto" />
                    ) : (
                      <span className={v === '—' ? 'text-line' : 'text-charcoal font-medium'}>{v}</span>
                    )}
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20 bg-white border-y border-line">
        <div className="max-w-3xl mx-auto px-5">
          <div className="text-center mb-12">
            <h2 className="text-2xl font-bold text-charcoal tracking-tight">Pricing questions.</h2>
          </div>
          <div className="space-y-4">
            {faqs.map(({ q, a }) => (
              <div key={q} className="border border-line rounded-xl p-6">
                <h3 className="font-semibold text-charcoal mb-2">{q}</h3>
                <p className="text-sm text-dim leading-relaxed">{a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20">
        <div className="max-w-2xl mx-auto px-5 text-center">
          <h2 className="text-3xl font-bold text-charcoal mb-4 tracking-tight">Ready to start?</h2>
          <p className="text-dim mb-8">Create your account and choose your plan to get started.</p>
          <Link href="/signup" className="inline-flex items-center gap-2 bg-brand hover:bg-brand-dark text-white font-semibold px-7 py-3.5 rounded-lg transition-colors">
            Get Started <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>
    </div>
  );
}
