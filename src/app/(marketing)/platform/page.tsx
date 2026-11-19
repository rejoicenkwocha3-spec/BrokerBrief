import Link from 'next/link';
import { ArrowRight, BarChart2, Eye, Zap, MapPin, Star, Target, Shield, CheckCircle2 } from 'lucide-react';

export const metadata = {
  title: 'Platform | Locallndex',
  description: 'How the Locallndex platform helps businesses understand their local presence, identify opportunities, and grow.',
};

export default function PlatformPage() {
  return (
    <div className="bg-surface">

      {/* Hero */}
      <section className="bg-white py-20 border-b border-line">
        <div className="max-w-4xl mx-auto px-5 text-center">
          <p className="section-label mb-3">The Platform</p>
          <h1 className="text-4xl md:text-5xl font-bold text-charcoal mb-5 tracking-tight">
            Local business intelligence<br />built for real growth.
          </h1>
          <p className="text-lg text-dim max-w-2xl mx-auto leading-relaxed">
            Locallndex brings together the data, insights, and tools your business needs to improve its local visibility and attract more customers in a single, clean workspace.
          </p>
        </div>
      </section>

      {/* Platform Overview */}
      <section className="py-20">
        <div className="max-w-5xl mx-auto px-5">
          <div className="grid md:grid-cols-3 gap-6 mb-20">
            {[
              {
                icon: BarChart2,
                title: 'Local Market Intelligence',
                desc: 'Understand what is happening in your local market. See how your business ranks in local search, which keywords drive visibility, and where your competitors are winning.',
                points: ['Local search position tracking', 'Keyword visibility data', 'Market share indicators', 'Category benchmarking'],
              },
              {
                icon: Eye,
                title: 'Business Visibility Management',
                desc: 'Your local visibility score tells you, at a glance, how well your business appears to nearby customers across the platforms they use.',
                points: ['Visibility score with breakdown', 'Profile completeness analysis', 'Citation consistency checks', 'Platform coverage overview'],
              },
              {
                icon: Zap,
                title: 'Growth Recommendations',
                desc: 'The platform analyses your profile, your competitors, and your market to generate a prioritised list of actions you can take to improve.',
                points: ['Prioritised action list', 'Effort and impact estimates', 'Category-specific guidance', 'Weekly updated insights'],
              },
            ].map(({ icon: Icon, title, desc, points }) => (
              <div key={title} className="bg-white border border-line rounded-xl p-6">
                <div className="w-11 h-11 rounded-lg bg-haze flex items-center justify-center mb-5">
                  <Icon className="w-5 h-5 text-brand" />
                </div>
                <h2 className="font-bold text-charcoal text-lg mb-3">{title}</h2>
                <p className="text-sm text-dim leading-relaxed mb-5">{desc}</p>
                <ul className="space-y-2">
                  {points.map((p) => (
                    <li key={p} className="flex items-center gap-2 text-sm text-dim">
                      <CheckCircle2 className="w-3.5 h-3.5 text-brand flex-shrink-0" />
                      {p}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* Deep Dive Sections */}
          <div className="space-y-16">

            {/* Business Profiles */}
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div>
                <p className="section-label mb-3">Business Profiles</p>
                <h2 className="text-2xl md:text-3xl font-bold text-charcoal mb-4 tracking-tight">
                  Your business data, organised and scored.
                </h2>
                <p className="text-dim leading-relaxed mb-6">
                  Add your business once and Locallndex builds a structured profile that tracks the information most important to local search performance. Add multiple locations and manage each from the same account.
                </p>
                <ul className="space-y-3">
                  {[
                    'Complete business information with category and attributes',
                    'Profile completeness scoring with specific gaps highlighted',
                    'Multi-location support from a single account',
                    'Business hours, service area, and contact details',
                  ].map((p) => (
                    <li key={p} className="flex items-start gap-3 text-sm text-dim">
                      <CheckCircle2 className="w-4 h-4 text-brand flex-shrink-0 mt-0.5" />
                      {p}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="bg-white border border-line rounded-xl p-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <p className="font-semibold text-charcoal">My Coffee House</p>
                    <p className="text-xs text-dim">Food and Beverage</p>
                  </div>
                  <span className="text-xs bg-haze text-brand font-semibold px-2.5 py-1 rounded-full">Active</span>
                </div>
                <div className="mb-4">
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-xs text-dim">Profile completeness</span>
                    <span className="text-xs font-semibold text-brand">78%</span>
                  </div>
                  <div className="h-2 bg-line rounded-full overflow-hidden">
                    <div className="h-full bg-brand rounded-full" style={{ width: '78%' }} />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { label: 'Visibility Score', value: '74/100' },
                    { label: 'Local Rank', value: '#3' },
                    { label: 'Review Rating', value: '4.6' },
                    { label: 'Total Reviews', value: '142' },
                  ].map(({ label, value }) => (
                    <div key={label} className="bg-surface rounded-lg p-3">
                      <p className="text-xs text-dim mb-1">{label}</p>
                      <p className="font-semibold text-charcoal text-sm">{value}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Competitors */}
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div className="order-2 md:order-1 bg-white border border-line rounded-xl p-6">
                <p className="text-xs font-semibold text-dim uppercase tracking-widest mb-4">Competitor Overview</p>
                {[
                  { name: 'The Corner Cafe', rank: '#1', score: 88, reviews: 4.9 },
                  { name: 'Sunrise Roasters', rank: '#2', score: 81, reviews: 4.7 },
                  { name: 'My Coffee House', rank: '#3', score: 74, reviews: 4.6, isYou: true },
                  { name: 'Brewed Local', rank: '#4', score: 68, reviews: 4.3 },
                ].map(({ name, rank, score, reviews, isYou }) => (
                  <div
                    key={name}
                    className={`flex items-center gap-4 py-3 border-b border-line last:border-0 ${isYou ? 'opacity-100' : 'opacity-60'}`}
                  >
                    <span className="text-xs font-bold text-dim w-6">{rank}</span>
                    <div className="flex-1">
                      <p className={`text-sm font-medium ${isYou ? 'text-brand' : 'text-charcoal'}`}>
                        {name} {isYou && <span className="text-xs">(you)</span>}
                      </p>
                    </div>
                    <span className="text-xs text-dim">Score: {score}</span>
                    <span className="text-xs text-dim">{reviews} stars</span>
                  </div>
                ))}
              </div>
              <div className="order-1 md:order-2">
                <p className="section-label mb-3">Competitor Monitoring</p>
                <h2 className="text-2xl md:text-3xl font-bold text-charcoal mb-4 tracking-tight">
                  Know exactly where you stand.
                </h2>
                <p className="text-dim leading-relaxed mb-6">
                  Track the visibility scores, review ratings, and profile completeness of your direct competitors. Understand what they are doing better and where you have an opportunity to overtake them.
                </p>
                <ul className="space-y-3">
                  {[
                    'Competitor visibility scores compared to yours',
                    'Review volume and rating comparison',
                    'Profile completeness benchmarking',
                    'Identify where competitors rank higher than you',
                  ].map((p) => (
                    <li key={p} className="flex items-start gap-3 text-sm text-dim">
                      <Target className="w-4 h-4 text-brand flex-shrink-0 mt-0.5" />
                      {p}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Reviews */}
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div>
                <p className="section-label mb-3">Review Intelligence</p>
                <h2 className="text-2xl md:text-3xl font-bold text-charcoal mb-4 tracking-tight">
                  Your reputation at a glance.
                </h2>
                <p className="text-dim leading-relaxed mb-6">
                  Review volume and rating quality directly affect local search rankings. Locallndex surfaces your review data in one view, so you can see your overall reputation and prioritise responses.
                </p>
                <ul className="space-y-3">
                  {[
                    'Aggregated review summary across platforms',
                    'Average rating and volume tracking',
                    'Sentiment breakdown: positive, neutral, negative',
                    'Response rate monitoring',
                  ].map((p) => (
                    <li key={p} className="flex items-start gap-3 text-sm text-dim">
                      <Star className="w-4 h-4 text-brand flex-shrink-0 mt-0.5" />
                      {p}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="bg-white border border-line rounded-xl p-6">
                <p className="text-xs font-semibold text-dim uppercase tracking-widest mb-4">Review Summary</p>
                <div className="flex items-center gap-4 mb-5">
                  <div>
                    <p className="text-5xl font-bold text-charcoal">4.6</p>
                    <div className="flex gap-0.5 mt-1">
                      {[1,2,3,4,5].map((s) => (
                        <Star key={s} className={`w-4 h-4 ${s <= 4 ? 'text-brand fill-brand' : 'text-line'}`} />
                      ))}
                    </div>
                    <p className="text-xs text-dim mt-1">142 reviews</p>
                  </div>
                  <div className="flex-1 space-y-1.5">
                    {[
                      { stars: 5, pct: 68 }, { stars: 4, pct: 20 }, { stars: 3, pct: 7 },
                      { stars: 2, pct: 3 }, { stars: 1, pct: 2 },
                    ].map(({ stars, pct }) => (
                      <div key={stars} className="flex items-center gap-2">
                        <span className="text-xs text-dim w-4">{stars}</span>
                        <div className="flex-1 h-1.5 bg-line rounded-full overflow-hidden">
                          <div className="h-full bg-brand rounded-full" style={{ width: `${pct}%` }} />
                        </div>
                        <span className="text-xs text-dim w-6">{pct}%</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-surface rounded-lg p-3 text-center">
                    <p className="text-xs text-dim mb-1">Response rate</p>
                    <p className="font-bold text-charcoal">63%</p>
                  </div>
                  <div className="bg-surface rounded-lg p-3 text-center">
                    <p className="text-xs text-dim mb-1">Unanswered</p>
                    <p className="font-bold text-charcoal">12</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Security & Trust */}
      <section className="py-20 bg-white border-y border-line">
        <div className="max-w-5xl mx-auto px-5">
          <div className="text-center mb-12">
            <p className="section-label mb-3">Security</p>
            <h2 className="text-2xl md:text-3xl font-bold text-charcoal tracking-tight">
              Your data is private by design.
            </h2>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { icon: Shield, title: 'Row-Level Security', desc: 'Every database query is scoped to your account. No data is shared between users.' },
              { icon: MapPin, title: 'Your data, your control', desc: 'Your business information is never shared with third parties or used to train external models.' },
              { icon: Star, title: 'Encrypted in transit', desc: 'All data is encrypted in transit and at rest using industry-standard protocols.' },
            ].map(({ icon: Icon, title, desc }) => (
              <div key={title} className="bg-surface border border-line rounded-xl p-6">
                <div className="w-10 h-10 rounded-lg bg-haze flex items-center justify-center mb-4">
                  <Icon className="w-5 h-5 text-brand" />
                </div>
                <h3 className="font-semibold text-charcoal mb-2">{title}</h3>
                <p className="text-sm text-dim leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20">
        <div className="max-w-2xl mx-auto px-5 text-center">
          <h2 className="text-3xl font-bold text-charcoal mb-4 tracking-tight">Ready to get started?</h2>
          <p className="text-dim mb-8">Create your account and see your local visibility score within minutes.</p>
          <Link href="/signup" className="inline-flex items-center gap-2 bg-brand hover:bg-brand-dark text-white font-semibold px-7 py-3.5 rounded-lg transition-colors">
            Get Started <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>
    </div>
  );
}
