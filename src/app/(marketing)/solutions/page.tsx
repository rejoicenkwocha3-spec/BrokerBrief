import Link from 'next/link';
import { ArrowRight, CheckCircle2 } from 'lucide-react';

export const metadata = {
  title: 'Solutions | Locallndex',
  description: 'Locallndex solutions for small businesses, multi-location operators, marketing agencies, retail and service businesses.',
};

const solutions = [
  {
    id: 'smb',
    title: 'Small and Medium Businesses',
    subtitle: 'Compete locally with the same intelligence as larger brands.',
    description:
      'Most small businesses rely on word of mouth and hope their online presence is good enough. Locallndex shows you exactly where you stand, what your competitors are doing better, and which actions will have the greatest impact on how local customers find you.',
    benefits: [
      'Understand your visibility score and what is holding it back',
      'See how nearby competitors rank compared to you',
      'Get a prioritised action list that fits a small team',
      'Track improvements week by week without manual reporting',
      'Monitor review sentiment and respond to opportunities',
    ],
    outcome: 'Businesses using Locallndex identify visibility gaps they would otherwise never discover. Acting on the platform recommendations typically improves local search position within 60 to 90 days.',
  },
  {
    id: 'multi-location',
    title: 'Multi-Location Businesses',
    subtitle: 'One platform for all your locations.',
    description:
      'Managing local visibility for multiple locations is time-consuming when done manually. Locallndex gives you a unified dashboard where you can monitor, compare, and improve performance across every location from a single account.',
    benefits: [
      'Individual visibility scores for each location',
      'Side-by-side performance comparison across locations',
      'Location-specific AI recommendations',
      'Consolidated review data per location',
      'Identify underperforming locations quickly',
    ],
    outcome: 'Multi-location operators using Locallndex spend less time gathering data and more time acting on it. They identify which locations need attention before those locations start losing ground to competitors.',
  },
  {
    id: 'agencies',
    title: 'Marketing Agencies',
    subtitle: 'Deliver local performance data your clients actually understand.',
    description:
      'Agencies managing local marketing for multiple clients need reliable data, clear reporting, and insights they can act on without spending hours on manual research. Locallndex gives you the tools to deliver local visibility intelligence at scale.',
    benefits: [
      'Manage multiple client businesses from one account',
      'Generate clear, branded performance reports',
      'Demonstrate ROI with before and after visibility data',
      'Surface actionable recommendations for each client',
      'Track local search position improvements over time',
    ],
    outcome: 'Agencies using Locallndex reduce the time spent on local performance reporting and produce data-led recommendations that clients find credible and actionable.',
  },
  {
    id: 'retail',
    title: 'Retail Businesses',
    subtitle: 'More customers walking through your door.',
    description:
      'Retail businesses depend on local footfall and discovery. Locallndex helps you understand how customers find similar businesses nearby, what drives local search clicks, and how your in-store experience translates into online reputation signals.',
    benefits: [
      'Track keywords driving retail discovery in your area',
      'Monitor review themes related to customer experience',
      'Compare your visibility with nearby retail competitors',
      'Identify gaps in your business profile that reduce clicks',
      'Act on specific improvements without a marketing team',
    ],
    outcome: 'Retail businesses using Locallndex better understand the digital touchpoints that precede in-store visits and prioritise the actions most likely to drive local foot traffic.',
  },
  {
    id: 'service',
    title: 'Service-Based Businesses',
    subtitle: 'Get found when local customers need you most.',
    description:
      'Service businesses: plumbers, cleaners, consultants, healthcare providers, and others depend heavily on being found in local search at the right moment. Locallndex helps you maintain the visibility and reputation signals that make customers choose you over the competition.',
    benefits: [
      'Monitor local search position for high-intent service keywords',
      'Track review volume and rating quality by service type',
      'Identify profile gaps that reduce conversion from search to contact',
      'Benchmark against comparable service providers in your area',
      'Receive category-specific growth recommendations',
    ],
    outcome: 'Service businesses using Locallndex make informed decisions about where to invest time on their online presence, focusing on what drives enquiries rather than general online activity.',
  },
];

export default function SolutionsPage() {
  return (
    <div className="bg-surface">

      {/* Hero */}
      <section className="bg-white py-20 border-b border-line">
        <div className="max-w-4xl mx-auto px-5 text-center">
          <p className="section-label mb-3">Solutions</p>
          <h1 className="text-4xl md:text-5xl font-bold text-charcoal mb-5 tracking-tight">
            Local visibility intelligence for every type of business.
          </h1>
          <p className="text-lg text-dim max-w-2xl mx-auto leading-relaxed">
            Whether you run one location or many, Locallndex gives you the data and tools to improve how local customers find and choose your business.
          </p>
        </div>
      </section>

      {/* Solution Cards */}
      <section className="py-20">
        <div className="max-w-5xl mx-auto px-5 space-y-12">
          {solutions.map(({ id, title, subtitle, description, benefits, outcome }) => (
            <div key={id} className="bg-white border border-line rounded-2xl p-8 md:p-10">
              <div className="grid md:grid-cols-5 gap-8">
                <div className="md:col-span-3">
                  <h2 className="text-2xl font-bold text-charcoal mb-1 tracking-tight">{title}</h2>
                  <p className="text-brand font-medium text-sm mb-4">{subtitle}</p>
                  <p className="text-dim leading-relaxed mb-6">{description}</p>
                  <div className="bg-haze border border-brand/20 rounded-lg p-4">
                    <p className="text-xs font-semibold text-brand uppercase tracking-widest mb-2">Outcome</p>
                    <p className="text-sm text-charcoal leading-relaxed">{outcome}</p>
                  </div>
                </div>
                <div className="md:col-span-2">
                  <p className="text-xs font-semibold text-dim uppercase tracking-widest mb-4">What you get</p>
                  <ul className="space-y-3">
                    {benefits.map((b) => (
                      <li key={b} className="flex items-start gap-3 text-sm text-dim">
                        <CheckCircle2 className="w-4 h-4 text-brand flex-shrink-0 mt-0.5" />
                        {b}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-white border-t border-line">
        <div className="max-w-2xl mx-auto px-5 text-center">
          <h2 className="text-3xl font-bold text-charcoal mb-4 tracking-tight">Find your solution.</h2>
          <p className="text-dim mb-8">
            Create your account and see your local visibility score within minutes. No technical setup required.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/signup" className="inline-flex items-center gap-2 bg-brand hover:bg-brand-dark text-white font-semibold px-7 py-3.5 rounded-lg transition-colors">
              Get Started <ArrowRight className="w-4 h-4" />
            </Link>
            <Link href="/pricing" className="inline-flex items-center gap-2 border border-line hover:bg-surface text-charcoal font-medium px-7 py-3.5 rounded-lg transition-colors">
              View pricing
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
