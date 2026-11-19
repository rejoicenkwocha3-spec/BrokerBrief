import Link from 'next/link';
import { ArrowRight, CheckCircle2, MapPin, Search, Target, Star, BarChart2, Zap, Eye, FileText, Users } from 'lucide-react';

export const metadata = {
  title: 'Features | Locallyndex',
  description: 'All Locallyndex features: local visibility, business profiles, competitor monitoring, review intelligence, analytics, and AI recommendations.',
};

const categories = [
  {
    icon: MapPin,
    title: 'Business Profile Management',
    description:
      'Store and manage all business profile data in a structured, scored format. Locallyndex highlights missing information and calculates a profile completeness score based on factors that influence local search ranking.',
    features: [
      { name: 'Business profile storage', implemented: true },
      { name: 'Profile completeness scoring', implemented: true },
      { name: 'Category and attribute tracking', implemented: true },
      { name: 'Business hours and service area', implemented: true },
      { name: 'Multi-location account support', implemented: true },
      { name: 'Profile change history', implemented: true },
    ],
  },
  {
    icon: Search,
    title: 'Local Search Intelligence',
    description:
      'Track where your business appears in local search results for the keywords that matter to your category and location. Understand trends over time and identify the keywords driving visibility for your competitors.',
    features: [
      { name: 'Visibility score with weekly tracking', implemented: true },
      { name: 'Local search rank monitoring', implemented: true },
      { name: 'Keyword visibility data', implemented: true },
      { name: 'Local pack appearance tracking', implemented: true },
      { name: 'Search volume estimates', implemented: true },
      { name: 'Historical rank comparison', implemented: true },
    ],
  },
  {
    icon: Target,
    title: 'Competitor Monitoring',
    description:
      'Add your direct local competitors and Locallyndex tracks their visibility scores, review ratings, and profile changes so you always know where you stand relative to them.',
    features: [
      { name: 'Competitor visibility score tracking', implemented: true },
      { name: 'Review volume and rating comparison', implemented: true },
      { name: 'Profile completeness benchmarking', implemented: true },
      { name: 'Side-by-side competitor overview', implemented: true },
      { name: 'Competitive gap identification', implemented: true },
      { name: 'Competitor profile change alerts', implemented: false },
    ],
  },
  {
    icon: Star,
    title: 'Review and Reputation Insights',
    description:
      'Monitor your review data across platforms in one consolidated view. Understand your overall reputation, track response rates, and identify patterns in customer feedback.',
    features: [
      { name: 'Aggregated review summary', implemented: true },
      { name: 'Average rating tracking over time', implemented: true },
      { name: 'Review volume by platform', implemented: true },
      { name: 'Sentiment breakdown', implemented: true },
      { name: 'Response rate monitoring', implemented: true },
      { name: 'Review keyword analysis', implemented: false },
    ],
  },
  {
    icon: BarChart2,
    title: 'Local Market Analytics',
    description:
      'Visualise your visibility performance, review trends, and competitive position over time. All charts and metrics in Locallyndex are built from real data connected to your account.',
    features: [
      { name: 'Visibility score history chart', implemented: true },
      { name: 'Monthly impression estimates', implemented: true },
      { name: 'Review volume trend chart', implemented: true },
      { name: 'Competitor comparison chart', implemented: true },
      { name: 'Platform-level breakdown', implemented: true },
      { name: 'Custom date range filtering', implemented: true },
    ],
  },
  {
    icon: Zap,
    title: 'AI-Powered Recommendations',
    description:
      'Locallyndex analyses your profile, your competitive position, and your review data to generate a prioritised list of specific, actionable steps. Each recommendation includes an effort estimate and an expected impact.',
    features: [
      { name: 'Prioritised action list', implemented: true },
      { name: 'Effort and impact scoring', implemented: true },
      { name: 'Category-specific guidance', implemented: true },
      { name: 'Weekly recommendation refresh', implemented: true },
      { name: 'Mark recommendations as complete', implemented: true },
      { name: 'AI explanation for each action', implemented: true },
    ],
  },
  {
    icon: Eye,
    title: 'Local Visibility Dashboard',
    description:
      'Your overview dashboard surfaces the most important information about your local presence at a glance, so you know what to act on without digging through reports.',
    features: [
      { name: 'At-a-glance visibility score', implemented: true },
      { name: 'Recent changes summary', implemented: true },
      { name: 'Top recommendations highlight', implemented: true },
      { name: 'Competitor standing overview', implemented: true },
      { name: 'Review status summary', implemented: true },
      { name: 'Performance vs last period', implemented: true },
    ],
  },
  {
    icon: FileText,
    title: 'Performance Reporting',
    description:
      'Generate structured performance reports for your business or clients. Reports are built from live data and include visibility score, local rank, review summary, and competitive standing.',
    features: [
      { name: 'Performance report generation', implemented: true },
      { name: 'Visibility score over time', implemented: true },
      { name: 'Competitor comparison inclusion', implemented: true },
      { name: 'Review data summary', implemented: true },
      { name: 'Exportable report format', implemented: false },
      { name: 'Scheduled report delivery', implemented: false },
    ],
  },
  {
    icon: Users,
    title: 'Multi-Location Management',
    description:
      'Add and manage multiple business locations from a single Locallyndex account. Each location has its own visibility score, recommendations, and competitive data.',
    features: [
      { name: 'Multiple location profiles', implemented: true },
      { name: 'Per-location visibility scores', implemented: true },
      { name: 'Location performance comparison', implemented: true },
      { name: 'Location-specific recommendations', implemented: true },
      { name: 'Shared account access', implemented: true },
      { name: 'Location grouping for agencies', implemented: false },
    ],
  },
];

export default function FeaturesPage() {
  return (
    <div className="bg-surface">

      {/* Hero */}
      <section className="bg-white py-20 border-b border-line">
        <div className="max-w-4xl mx-auto px-5 text-center">
          <p className="section-label mb-3">Features</p>
          <h1 className="text-4xl md:text-5xl font-bold text-charcoal mb-5 tracking-tight">
            Everything you need to understand<br />and improve your local presence.
          </h1>
          <p className="text-lg text-dim max-w-2xl mx-auto leading-relaxed">
            Every Locallyndex feature is built around a clear purpose: helping your business appear more prominently to local customers and act on the intelligence that improves your position.
          </p>
        </div>
      </section>

      {/* Feature Legend */}
      <section className="py-8 border-b border-line bg-white">
        <div className="max-w-5xl mx-auto px-5 flex items-center gap-6 text-sm text-dim">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-brand" />
            <span>Available now</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-full border-2 border-line" />
            <span>Coming soon</span>
          </div>
        </div>
      </section>

      {/* Feature Categories */}
      <section className="py-20">
        <div className="max-w-5xl mx-auto px-5 space-y-8">
          {categories.map(({ icon: Icon, title, description, features }) => (
            <div key={title} className="bg-white border border-line rounded-2xl p-8">
              <div className="grid md:grid-cols-5 gap-8">
                <div className="md:col-span-3">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-lg bg-haze flex items-center justify-center">
                      <Icon className="w-5 h-5 text-brand" />
                    </div>
                    <h2 className="font-bold text-charcoal text-lg">{title}</h2>
                  </div>
                  <p className="text-dim leading-relaxed text-sm">{description}</p>
                </div>
                <div className="md:col-span-2">
                  <ul className="space-y-2.5">
                    {features.map(({ name, implemented }) => (
                      <li key={name} className="flex items-center gap-3 text-sm">
                        {implemented ? (
                          <CheckCircle2 className="w-4 h-4 text-brand flex-shrink-0" />
                        ) : (
                          <div className="w-4 h-4 rounded-full border-2 border-line flex-shrink-0" />
                        )}
                        <span className={implemented ? 'text-charcoal' : 'text-dim'}>{name}</span>
                        {!implemented && (
                          <span className="text-xs bg-line text-dim px-2 py-0.5 rounded-full ml-auto">Soon</span>
                        )}
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
          <h2 className="text-3xl font-bold text-charcoal mb-4 tracking-tight">Start using all these features today.</h2>
          <p className="text-dim mb-8">Create your account and have your first visibility report in minutes.</p>
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
