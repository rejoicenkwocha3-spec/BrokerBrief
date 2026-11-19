import Link from 'next/link';
import {
  ArrowRight, MapPin, TrendingUp, Eye, Star, BarChart2, Shield,
  CheckCircle2, ChevronDown, Search, Zap, Target, Globe, Users,
} from 'lucide-react';

export const metadata = {
  title: 'Locallyndex: Local Business Visibility and Growth Platform',
  description:
    'Understand your local market, improve your online visibility, and discover smarter opportunities to grow your business with Locallyndex.',
};

const faqs = [
  {
    q: 'What is Locallyndex?',
    a: 'Locallyndex is a B2B SaaS platform that helps businesses improve their local online presence, monitor local search performance, track competitors, and act on AI-powered growth recommendations.',
  },
  {
    q: 'Who is Locallyndex designed for?',
    a: 'Locallyndex serves small and medium businesses, multi-location operators, marketing agencies managing local clients, retail businesses, and service-based businesses.',
  },
  {
    q: 'Does Locallyndex require technical knowledge to use?',
    a: 'No. The platform is designed to surface useful intelligence in plain language. You do not need marketing or technical expertise to understand your visibility score or act on recommendations.',
  },
  {
    q: 'Can I manage multiple business locations?',
    a: 'Yes. Locallyndex supports multi-location management, allowing you to track visibility, reviews, and performance for each location from a single dashboard.',
  },
  {
    q: 'How is payment handled?',
    a: 'Subscriptions are managed via Selar. After completing checkout, your plan is activated and you gain full access to your selected tier.',
  },
];

export default function HomePage() {
  return (
    <div className="bg-surface">

      {/* Hero */}
      <section className="relative pt-20 pb-24 overflow-hidden bg-white">
        <div className="absolute inset-0 bg-dots opacity-60" />
        <div className="relative max-w-4xl mx-auto px-5 text-center">
          <div className="inline-flex items-center gap-2 border border-line rounded-full px-4 py-1.5 text-sm text-dim mb-8">
            <MapPin className="w-3.5 h-3.5 text-brand" />
            <span>Local Business Intelligence Platform</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-bold text-charcoal leading-tight mb-6 tracking-tight">
            Make Your Business<br />Easier to Find.
          </h1>
          <p className="text-lg md:text-xl text-dim max-w-2xl mx-auto mb-10 leading-relaxed">
            Understand your local market, improve your online visibility, and discover smarter opportunities to grow your business with Locallyndex.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/signup"
              className="inline-flex items-center gap-2 bg-brand hover:bg-brand-dark text-white font-semibold px-7 py-3.5 rounded-lg text-base transition-colors"
            >
              Get Started <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/platform"
              className="inline-flex items-center gap-2 border border-line hover:bg-surface text-charcoal font-medium px-7 py-3.5 rounded-lg text-base transition-colors"
            >
              Explore Platform
            </Link>
          </div>
        </div>
      </section>

      {/* Dashboard Preview */}
      <section className="py-16 bg-surface border-y border-line">
        <div className="max-w-5xl mx-auto px-5">
          <div className="bg-white border border-line rounded-2xl shadow-sm overflow-hidden">
            {/* Mock dashboard header */}
            <div className="border-b border-line px-6 py-4 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <img src="/logo.svg" alt="Locallyndex" className="h-6 w-auto" />
                <span className="font-semibold text-charcoal text-sm">Locallyndex</span>
              </div>
              <div className="flex items-center gap-6">
                <span className="text-xs text-dim">Overview</span>
                <span className="text-xs text-dim">Visibility</span>
                <span className="text-xs text-dim">Reviews</span>
                <span className="text-xs text-brand font-medium">Analytics</span>
              </div>
            </div>
            {/* Mock metric cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-0">
              {[
                { label: 'Visibility Score', value: '74', unit: '/100', trend: '+6' },
                { label: 'Local Search Rank', value: '#3', unit: '', trend: '+2' },
                { label: 'Review Rating', value: '4.6', unit: '/ 5', trend: '+0.2' },
                { label: 'Monthly Impressions', value: '2,840', unit: '', trend: '+18%' },
              ].map(({ label, value, unit, trend }, i) => (
                <div key={label} className={`p-5 ${i < 3 ? 'border-r border-line' : ''}`}>
                  <p className="text-xs text-dim mb-1">{label}</p>
                  <p className="text-2xl font-bold text-charcoal">
                    {value}<span className="text-sm font-normal text-dim">{unit}</span>
                  </p>
                  <p className="text-xs text-brand mt-1">{trend} this month</p>
                </div>
              ))}
            </div>
            {/* Mock chart area */}
            <div className="p-6 border-t border-line">
              <div className="flex items-end gap-2 h-24">
                {[40, 55, 48, 70, 65, 74, 80, 72, 85, 78, 90, 88].map((h, i) => (
                  <div
                    key={i}
                    className="flex-1 rounded-t-sm"
                    style={{ height: `${h}%`, backgroundColor: i === 11 ? '#2047FF' : '#EEF2FF' }}
                  />
                ))}
              </div>
              <p className="text-xs text-dim mt-3">Visibility score trend over 12 months</p>
            </div>
          </div>
        </div>
      </section>

      {/* Platform Introduction */}
      <section className="py-20 bg-white">
        <div className="max-w-5xl mx-auto px-5">
          <div className="text-center mb-14">
            <p className="section-label mb-3">The Platform</p>
            <h2 className="text-3xl md:text-4xl font-bold text-charcoal mb-4 tracking-tight">
              Three capabilities. One platform.
            </h2>
            <p className="text-dim max-w-xl mx-auto">
              Locallyndex combines local market intelligence, visibility management, and growth tools into a single, coherent workspace for your business.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                icon: BarChart2,
                title: 'Intelligence',
                desc: 'Understand how your business appears in local search, what your competitors are doing, and where your market opportunities are.',
              },
              {
                icon: Eye,
                title: 'Visibility',
                desc: 'Monitor your local search rankings, business profile completeness, and online presence across the platforms that matter most.',
              },
              {
                icon: TrendingUp,
                title: 'Growth',
                desc: 'Receive prioritised, actionable recommendations tailored to your business category, location, and competitive position.',
              },
            ].map(({ icon: Icon, title, desc }) => (
              <div key={title} className="bg-surface border border-line rounded-xl p-6">
                <div className="w-10 h-10 rounded-lg bg-haze flex items-center justify-center mb-4">
                  <Icon className="w-5 h-5 text-brand" />
                </div>
                <h3 className="font-semibold text-charcoal text-lg mb-2">{title}</h3>
                <p className="text-sm text-dim leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Key Benefits */}
      <section className="py-20">
        <div className="max-w-5xl mx-auto px-5">
          <div className="text-center mb-14">
            <p className="section-label mb-3">Why Locallyndex</p>
            <h2 className="text-3xl md:text-4xl font-bold text-charcoal tracking-tight">
              Everything your local presence needs.
            </h2>
          </div>
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div className="space-y-6">
              {[
                {
                  icon: Search,
                  title: 'Know your local search position',
                  desc: 'Track where your business ranks in local search results and discover the keywords driving visibility in your area.',
                },
                {
                  icon: Target,
                  title: 'Identify gaps before competitors do',
                  desc: 'Surface opportunities in your local market: underserved categories, unmonitored keywords, and profile weaknesses.',
                },
                {
                  icon: Star,
                  title: 'Understand your review landscape',
                  desc: 'Monitor review volume, average ratings, and sentiment across platforms without switching between tabs.',
                },
                {
                  icon: Zap,
                  title: 'Act on AI-powered recommendations',
                  desc: 'Receive prioritised actions tailored to your business. No generic advice: specific steps ranked by impact.',
                },
              ].map(({ icon: Icon, title, desc }) => (
                <div key={title} className="flex gap-4">
                  <div className="w-9 h-9 rounded-lg bg-haze flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Icon className="w-4.5 h-4.5 text-brand" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-charcoal mb-1">{title}</h3>
                    <p className="text-sm text-dim leading-relaxed">{desc}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="bg-white border border-line rounded-2xl p-6 space-y-4">
              <p className="text-xs font-semibold text-dim uppercase tracking-widest mb-2">AI Recommendations</p>
              {[
                { priority: 'High', title: 'Complete your Google Business Profile', desc: 'Adding opening hours increases click-through rate by 30% on average.' },
                { priority: 'Medium', title: 'Respond to recent reviews', desc: '3 reviews from last week have no response. Responding improves trust signals.' },
                { priority: 'Medium', title: 'Add photos to your profile', desc: 'Profiles with 10 or more photos receive significantly more engagement.' },
              ].map(({ priority, title, desc }) => (
                <div key={title} className="border border-line rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${priority === 'High' ? 'bg-brand text-white' : 'bg-haze text-brand'}`}>
                      {priority}
                    </span>
                  </div>
                  <p className="text-sm font-medium text-charcoal mb-1">{title}</p>
                  <p className="text-xs text-dim">{desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Feature Highlights */}
      <section className="py-20 bg-white">
        <div className="max-w-5xl mx-auto px-5">
          <div className="text-center mb-14">
            <p className="section-label mb-3">Features</p>
            <h2 className="text-3xl md:text-4xl font-bold text-charcoal tracking-tight">
              Built for serious local businesses.
            </h2>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                icon: MapPin,
                title: 'Business Profile Management',
                desc: 'Store and manage all your business profile data in one place. Track completeness and identify missing information.',
                features: ['Profile completeness scoring', 'Multi-location support', 'Category and attribute tracking'],
              },
              {
                icon: Search,
                title: 'Local Search Intelligence',
                desc: 'Monitor local search rankings for target keywords and understand how customers find businesses in your category.',
                features: ['Keyword rank tracking', 'Local pack visibility', 'Search volume data'],
              },
              {
                icon: Target,
                title: 'Competitor Monitoring',
                desc: 'Track the visibility scores, review ratings, and profile changes of your direct local competitors.',
                features: ['Competitor visibility scores', 'Side-by-side comparison', 'Profile change alerts'],
              },
              {
                icon: Star,
                title: 'Review and Reputation Insights',
                desc: 'Aggregate review data across platforms to understand your reputation and identify response priorities.',
                features: ['Multi-platform aggregation', 'Sentiment summary', 'Response rate tracking'],
              },
              {
                icon: BarChart2,
                title: 'Local Market Analytics',
                desc: 'Visualise your performance trends and understand what is driving changes in your visibility and engagement.',
                features: ['Visibility score history', 'Impression trends', 'Performance benchmarking'],
              },
              {
                icon: Zap,
                title: 'AI Recommendations',
                desc: 'Receive a prioritised list of improvements tailored to your specific business, category, and location.',
                features: ['Priority-ranked actions', 'Effort vs. impact scoring', 'Weekly updated suggestions'],
              },
            ].map(({ icon: Icon, title, desc, features }) => (
              <div key={title} className="bg-surface border border-line rounded-xl p-6">
                <div className="w-10 h-10 rounded-lg bg-haze flex items-center justify-center mb-4">
                  <Icon className="w-5 h-5 text-brand" />
                </div>
                <h3 className="font-semibold text-charcoal mb-2">{title}</h3>
                <p className="text-sm text-dim mb-4 leading-relaxed">{desc}</p>
                <ul className="space-y-1.5">
                  {features.map((f) => (
                    <li key={f} className="flex items-center gap-2 text-xs text-dim">
                      <CheckCircle2 className="w-3.5 h-3.5 text-brand flex-shrink-0" />
                      {f}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <div className="text-center mt-10">
            <Link href="/features" className="inline-flex items-center gap-2 text-brand font-medium text-sm hover:underline">
              View all features <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Solutions Overview */}
      <section className="py-20">
        <div className="max-w-5xl mx-auto px-5">
          <div className="text-center mb-14">
            <p className="section-label mb-3">Solutions</p>
            <h2 className="text-3xl md:text-4xl font-bold text-charcoal tracking-tight">
              For every business that relies on local customers.
            </h2>
          </div>
          <div className="grid md:grid-cols-2 gap-5">
            {[
              {
                title: 'Small and Medium Businesses',
                desc: 'Get a clear picture of your local search position and take targeted steps to reach more nearby customers.',
              },
              {
                title: 'Multi-Location Businesses',
                desc: 'Manage visibility, reviews, and competitors for each location from a single account dashboard.',
              },
              {
                title: 'Marketing Agencies',
                desc: 'Deliver local performance reporting and data-driven recommendations for every client you manage.',
              },
              {
                title: 'Retail and Service Businesses',
                desc: 'Understand what drives foot traffic and digital discovery so you can invest in what actually works.',
              },
            ].map(({ title, desc }) => (
              <div key={title} className="bg-white border border-line rounded-xl p-6 flex gap-4">
                <div className="w-2 h-2 rounded-full bg-brand flex-shrink-0 mt-2" />
                <div>
                  <h3 className="font-semibold text-charcoal mb-1.5">{title}</h3>
                  <p className="text-sm text-dim leading-relaxed">{desc}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="text-center mt-10">
            <Link href="/solutions" className="inline-flex items-center gap-2 text-brand font-medium text-sm hover:underline">
              View all solutions <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-5">
          <div className="text-center mb-14">
            <p className="section-label mb-3">How It Works</p>
            <h2 className="text-3xl md:text-4xl font-bold text-charcoal tracking-tight">
              Set up in minutes. See results immediately.
            </h2>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                step: '01',
                title: 'Add your business',
                desc: 'Enter your business details and location. Locallyndex builds your starting profile and pulls available public data.',
              },
              {
                step: '02',
                title: 'Review your visibility score',
                desc: 'Your dashboard shows your current local search position, profile completeness, and competitive standing.',
              },
              {
                step: '03',
                title: 'Act on recommendations',
                desc: 'Follow prioritised AI recommendations to improve your score, respond to reviews, and outperform nearby competitors.',
              },
            ].map(({ step, title, desc }) => (
              <div key={step} className="text-center">
                <div className="w-12 h-12 rounded-full border-2 border-brand text-brand font-bold text-sm flex items-center justify-center mx-auto mb-4">
                  {step}
                </div>
                <h3 className="font-semibold text-charcoal mb-2">{title}</h3>
                <p className="text-sm text-dim leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Preview */}
      <section className="py-20">
        <div className="max-w-5xl mx-auto px-5">
          <div className="text-center mb-14">
            <p className="section-label mb-3">Pricing</p>
            <h2 className="text-3xl md:text-4xl font-bold text-charcoal tracking-tight">
              Straightforward plans for every stage.
            </h2>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                name: 'Starter',
                price: '$47',
                period: '/month',
                desc: 'For independent businesses getting started with local visibility.',
                features: ['1 business location', 'Visibility score tracking', 'Basic competitor monitoring', 'Review summary dashboard', 'AI recommendations'],
                href: 'https://selar.co/47plan',
                highlight: false,
              },
              {
                name: 'Growth',
                price: '$57',
                period: '/month',
                desc: 'For businesses ready to grow their local market presence.',
                features: ['Up to 3 locations', 'Advanced visibility analytics', 'Full competitor monitoring', 'Review management tools', 'Priority AI recommendations', 'Monthly performance reports'],
                href: 'https://selar.co/57plan',
                highlight: true,
              },
              {
                name: 'Scale',
                price: '$97',
                period: '/month',
                desc: 'For multi-location businesses and agencies managing multiple clients.',
                features: ['Up to 10 locations', 'Full platform access', 'API access', 'White-label reports', 'Dedicated support', 'All Growth features'],
                href: 'https://selar.co/97plan',
                highlight: false,
              },
            ].map(({ name, price, period, desc, features, href, highlight }) => (
              <div
                key={name}
                className={`rounded-xl border p-7 relative ${highlight ? 'bg-brand border-brand text-white' : 'bg-white border-line'}`}
              >
                {highlight && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-charcoal text-white text-xs font-semibold px-3 py-1 rounded-full">
                    Most Popular
                  </div>
                )}
                <h3 className={`font-bold text-lg mb-1 ${highlight ? 'text-white' : 'text-charcoal'}`}>{name}</h3>
                <div className="flex items-baseline gap-1 mb-2">
                  <span className={`text-4xl font-bold ${highlight ? 'text-white' : 'text-charcoal'}`}>{price}</span>
                  <span className={`text-sm ${highlight ? 'text-white/70' : 'text-dim'}`}>{period}</span>
                </div>
                <p className={`text-sm mb-6 ${highlight ? 'text-white/70' : 'text-dim'}`}>{desc}</p>
                <a
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`w-full py-2.5 rounded-lg text-sm font-semibold text-center block mb-6 transition-colors ${
                    highlight
                      ? 'bg-white text-brand hover:bg-white/90'
                      : 'bg-brand text-white hover:bg-brand-dark'
                  }`}
                >
                  Get {name}
                </a>
                <ul className="space-y-2.5">
                  {features.map((f) => (
                    <li key={f} className="flex items-center gap-2 text-sm">
                      <CheckCircle2 className={`w-4 h-4 flex-shrink-0 ${highlight ? 'text-white/70' : 'text-brand'}`} />
                      <span className={highlight ? 'text-white/80' : 'text-dim'}>{f}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <div className="text-center mt-10">
            <Link href="/pricing" className="inline-flex items-center gap-2 text-brand font-medium text-sm hover:underline">
              Compare all plans <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20 bg-white">
        <div className="max-w-3xl mx-auto px-5">
          <div className="text-center mb-14">
            <p className="section-label mb-3">FAQ</p>
            <h2 className="text-3xl md:text-4xl font-bold text-charcoal tracking-tight">
              Common questions.
            </h2>
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

      {/* Final CTA */}
      <section className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-dots opacity-60" />
        <div className="relative max-w-3xl mx-auto px-5 text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-charcoal mb-5 tracking-tight">
            Start improving your local<br />presence today.
          </h2>
          <p className="text-lg text-dim mb-10">
            Join businesses using Locallyndex to understand, improve, and grow their local market position.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/signup"
              className="inline-flex items-center gap-2 bg-brand hover:bg-brand-dark text-white font-semibold px-8 py-4 rounded-lg text-base transition-colors"
            >
              Get Started <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/pricing"
              className="inline-flex items-center gap-2 border border-line hover:bg-white text-charcoal font-medium px-8 py-4 rounded-lg text-base transition-colors"
            >
              View pricing
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
}
