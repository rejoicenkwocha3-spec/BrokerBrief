import Link from 'next/link';
import { ArrowRight, CheckCircle2 } from 'lucide-react';

const solutions = [
  {
    type: 'Mortgage Brokerage',
    headline: 'Close more loans. Lose fewer leads.',
    desc: 'Mortgage brokerages juggle dozens of clients at different stages of the lending process. BrokerBrief gives your team a single workspace to manage every applicant, track loan pipelines, store compliance documents, and automate follow-ups — from first enquiry to settlement.',
    outcomes: [
      'Track every applicant from initial enquiry to settlement',
      'Store lender documents, valuations, and approvals in one place',
      'Get AI-generated summaries of every client call',
      'Set automated reminders for conditional approval deadlines',
      'Monitor your full pipeline in a visual Kanban board',
    ],
  },
  {
    type: 'Financial Planning',
    headline: 'Deepen client relationships. Grow recurring revenue.',
    desc: 'Financial planners need a CRM built for long-term relationships. BrokerBrief tracks every touchpoint, meeting, document, and review date — so you stay ahead of client needs and never miss an annual review or rebalancing window.',
    outcomes: [
      'Log advice meetings with AI-generated notes and action items',
      'Store SOAs, ROAs, and client agreements per client',
      'Track review dates and trigger automatic reminders',
      'Monitor AUM and client retention across your book',
      'AI Associate answers questions about any client on demand',
    ],
  },
  {
    type: 'Real Estate',
    headline: 'Manage every listing. Win every referral.',
    desc: 'Real estate brokerages move fast. BrokerBrief helps your agents manage buyer and seller relationships, track active listings through the pipeline, log inspections and offers, and store contracts — all from one platform built for deal velocity.',
    outcomes: [
      'Track buyers and sellers through a 7-stage pipeline',
      'Log property inspections, offers, and negotiations',
      'Store contracts, disclosures, and settlement documents',
      'Manage referral sources and agent performance',
      'Get instant AI summaries of any client or property history',
    ],
  },
  {
    type: 'Insurance Brokerage',
    headline: 'Retain more clients. Spot renewal opportunities early.',
    desc: 'Insurance brokers live and die by renewal rates. BrokerBrief tracks every policy, renewal date, and coverage change — with automated reminders and a full client history that lets your team have informed conversations at every renewal.',
    outcomes: [
      'Track policy renewals and expiry dates per client',
      'Store policy documents, certificates, and claim records',
      'Automate renewal outreach reminders 90, 60, and 30 days out',
      'Log every coverage review meeting with AI summaries',
      'Monitor retention rate and lapsed policies in real time',
    ],
  },
];

export default function SolutionsPage() {
  return (
    <div className="bg-soft-white">
      {/* Hero */}
      <section className="bg-forest text-white pt-20 pb-24 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle at 20% 50%, #079B65 0%, transparent 50%), radial-gradient(circle at 80% 50%, #8154E8 0%, transparent 50%)' }} />
        <div className="max-w-4xl mx-auto px-5 text-center relative">
          <p className="text-xs font-semibold text-emerald-brand uppercase tracking-widest mb-4">Solutions</p>
          <h1 className="font-playfair text-4xl md:text-5xl font-bold leading-tight mb-6">
            Built for the way your brokerage works.
          </h1>
          <p className="text-lg text-white/70 max-w-2xl mx-auto mb-10 leading-relaxed">
            Whether you run a mortgage, financial planning, real estate, or insurance brokerage, BrokerBrief is designed to fit your workflow — not the other way around.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/signup" className="inline-flex items-center gap-2 bg-emerald-brand hover:bg-[#068a58] text-white font-semibold px-7 py-3.5 rounded-xl text-base transition-colors">
              Start free trial <ArrowRight className="w-4 h-4" />
            </Link>
            <Link href="/platform" className="inline-flex items-center gap-2 border border-white/30 hover:bg-white/10 text-white font-medium px-7 py-3.5 rounded-xl text-base transition-colors">
              See the platform
            </Link>
          </div>
        </div>
      </section>

      {/* Solution cards */}
      <section className="py-20">
        <div className="max-w-5xl mx-auto px-5 space-y-20">
          {solutions.map(({ type, headline, desc, outcomes }, i) => (
            <div key={type} className={`grid md:grid-cols-2 gap-12 items-start ${i % 2 === 1 ? 'md:[&>*:first-child]:order-2' : ''}`}>
              <div>
                <p className="text-xs font-semibold text-emerald-brand uppercase tracking-widest mb-3">{type}</p>
                <h2 className="font-playfair text-3xl font-bold text-charcoal mb-4">{headline}</h2>
                <p className="text-gray-500 leading-relaxed">{desc}</p>
              </div>
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                <p className="text-sm font-semibold text-charcoal mb-4">What you get</p>
                <ul className="space-y-3">
                  {outcomes.map((o) => (
                    <li key={o} className="flex items-start gap-3 text-sm text-gray-600">
                      <CheckCircle2 className="w-4 h-4 text-emerald-brand flex-shrink-0 mt-0.5" />
                      {o}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Common ground */}
      <section className="py-20 bg-white">
        <div className="max-w-5xl mx-auto px-5 text-center">
          <p className="text-xs font-semibold text-emerald-brand uppercase tracking-widest mb-3">Every solution includes</p>
          <h2 className="font-playfair text-3xl md:text-4xl font-bold text-charcoal mb-4">
            The full BrokerBrief platform. No add-ons.
          </h2>
          <p className="text-gray-500 max-w-xl mx-auto mb-12">Every plan includes CRM, pipeline management, meeting intelligence, document storage, AI Associate, and business insights. No feature is locked behind a higher tier.</p>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 max-w-3xl mx-auto">
            {[
              'CRM and client management',
              'Visual deal pipeline',
              'Meeting notes and AI summaries',
              'Secure document storage',
              'AI Associate 24/7',
              'Business intelligence dashboards',
              'Team collaboration tools',
              'Task and follow-up management',
              'Multi-role access control',
            ].map((f) => (
              <div key={f} className="bg-soft-white border border-gray-100 rounded-xl p-4 text-sm text-gray-700 font-medium text-left flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-brand flex-shrink-0 mt-0.5" />
                {f}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 bg-soft-white">
        <div className="max-w-3xl mx-auto px-5 text-center">
          <h2 className="font-playfair text-4xl font-bold text-charcoal mb-5">The intelligence behind every deal.</h2>
          <p className="text-lg text-gray-500 mb-10">Start your 14-day free trial. No credit card required.</p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/signup" className="inline-flex items-center gap-2 bg-emerald-brand hover:bg-[#068a58] text-white font-semibold px-8 py-4 rounded-xl text-base transition-colors">
              Start free trial <ArrowRight className="w-4 h-4" />
            </Link>
            <Link href="/pricing" className="inline-flex items-center gap-2 border border-gray-200 hover:bg-light-grey text-charcoal font-medium px-8 py-4 rounded-xl text-base transition-colors">
              View pricing
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
