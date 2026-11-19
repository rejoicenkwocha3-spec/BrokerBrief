import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { TopBar } from '@/components/dashboard/TopBar';
import { Building2, MapPin, Eye, Star, ArrowRight, Zap, TrendingUp, AlertCircle } from 'lucide-react';
import Link from 'next/link';

export default async function DashboardPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/signin');

  // Fetch business profiles count
  const { count: businessCount } = await supabase
    .from('business_profiles')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', user.id);

  // Fetch locations count
  const { count: locationCount } = await supabase
    .from('locations')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', user.id);

  // Fetch recent AI recommendations
  const { data: recommendations } = await supabase
    .from('ai_recommendations')
    .select('id, title, priority, type')
    .eq('user_id', user.id)
    .eq('status', 'pending')
    .order('created_at', { ascending: false })
    .limit(5);

  // Fetch latest visibility snapshot
  const { data: latestVisibility } = await supabase
    .from('visibility_snapshots')
    .select('score, local_rank, recorded_at, business_profiles(name)')
    .eq('user_id', user.id)
    .order('recorded_at', { ascending: false })
    .limit(1)
    .maybeSingle();

  // Fetch review summary
  const { data: reviewSummary } = await supabase
    .from('review_summaries')
    .select('rating, total_reviews, platform, business_id')
    .eq('user_id', user.id)
    .order('synced_at', { ascending: false })
    .limit(1)
    .maybeSingle();

  const hasData = (businessCount ?? 0) > 0;

  return (
    <div>
      <TopBar
        title="Overview"
        subtitle="Your local visibility at a glance"
        actions={
          hasData ? undefined : (
            <Link href="/business-profiles" className="inline-flex items-center gap-2 bg-brand hover:bg-brand-dark text-white text-sm font-semibold px-4 py-2 rounded-lg transition-colors">
              Add Business <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          )
        }
      />

      <div className="p-6 space-y-6">

        {/* Empty state */}
        {!hasData && (
          <div className="bg-white border border-line rounded-xl p-10 text-center">
            <div className="w-14 h-14 rounded-full bg-haze flex items-center justify-center mx-auto mb-4">
              <Building2 className="w-7 h-7 text-brand" />
            </div>
            <h2 className="text-lg font-semibold text-charcoal mb-2">Add your first business</h2>
            <p className="text-sm text-dim max-w-sm mx-auto mb-6">
              Start by adding your business profile. Locallyndex will calculate your visibility score and generate recommendations.
            </p>
            <Link
              href="/business-profiles"
              className="inline-flex items-center gap-2 bg-brand hover:bg-brand-dark text-white font-semibold px-5 py-2.5 rounded-lg text-sm transition-colors"
            >
              Add Business Profile <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        )}

        {/* Metric cards */}
        {hasData && (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              {
                label: 'Visibility Score',
                value: latestVisibility?.score ? `${latestVisibility.score}/100` : 'N/A',
                icon: Eye,
                sub: latestVisibility ? 'Last updated recently' : 'No data yet',
                href: '/visibility',
              },
              {
                label: 'Local Rank',
                value: latestVisibility?.local_rank ? `#${latestVisibility.local_rank}` : 'N/A',
                icon: TrendingUp,
                sub: 'In your category',
                href: '/visibility',
              },
              {
                label: 'Review Rating',
                value: reviewSummary?.rating ? reviewSummary.rating.toFixed(1) : 'N/A',
                icon: Star,
                sub: reviewSummary ? `${reviewSummary.total_reviews} reviews` : 'No reviews yet',
                href: '/reviews',
              },
              {
                label: 'Business Profiles',
                value: `${businessCount ?? 0}`,
                icon: Building2,
                sub: `${locationCount ?? 0} locations`,
                href: '/business-profiles',
              },
            ].map(({ label, value, icon: Icon, sub, href }) => (
              <Link
                key={label}
                href={href}
                className="bg-white border border-line rounded-xl p-5 hover:border-brand/30 transition-colors group"
              >
                <div className="flex items-center justify-between mb-3">
                  <p className="text-xs font-medium text-dim">{label}</p>
                  <div className="w-7 h-7 rounded-lg bg-haze flex items-center justify-center">
                    <Icon className="w-3.5 h-3.5 text-brand" />
                  </div>
                </div>
                <p className="text-2xl font-bold text-charcoal mb-1">{value}</p>
                <p className="text-xs text-dim">{sub}</p>
              </Link>
            ))}
          </div>
        )}

        {/* Two-column section */}
        {hasData && (
          <div className="grid lg:grid-cols-2 gap-6">

            {/* AI Recommendations */}
            <div className="bg-white border border-line rounded-xl p-5">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-semibold text-charcoal flex items-center gap-2">
                  <Zap className="w-4 h-4 text-brand" />
                  Top Recommendations
                </h2>
                <Link href="/ai-recommendations" className="text-xs text-brand hover:underline">
                  View all
                </Link>
              </div>
              {recommendations && recommendations.length > 0 ? (
                <ul className="space-y-3">
                  {recommendations.map((r) => (
                    <li key={r.id} className="flex items-start gap-3">
                      <span className={`text-xs font-semibold px-2 py-0.5 rounded-full flex-shrink-0 mt-0.5 ${
                        r.priority === 'high' ? 'bg-brand text-white' : 'bg-haze text-brand'
                      }`}>
                        {r.priority}
                      </span>
                      <p className="text-sm text-charcoal">{r.title}</p>
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="text-center py-6">
                  <Zap className="w-8 h-8 text-line mx-auto mb-2" />
                  <p className="text-sm text-dim">Recommendations will appear once your profile is set up.</p>
                </div>
              )}
            </div>

            {/* Quick actions */}
            <div className="bg-white border border-line rounded-xl p-5">
              <h2 className="font-semibold text-charcoal mb-4">Quick Actions</h2>
              <div className="space-y-2">
                {[
                  { href: '/business-profiles', icon: Building2, label: 'Manage business profiles', desc: 'Add or update your business information' },
                  { href: '/locations', icon: MapPin, label: 'Add a location', desc: 'Track multiple locations from one account' },
                  { href: '/competitors', icon: AlertCircle, label: 'Monitor competitors', desc: 'Track nearby businesses in your category' },
                  { href: '/reviews', icon: Star, label: 'View review summary', desc: 'See your reputation across platforms' },
                ].map(({ href, icon: Icon, label, desc }) => (
                  <Link
                    key={href}
                    href={href}
                    className="flex items-center gap-3 p-3 rounded-lg hover:bg-surface transition-colors group"
                  >
                    <div className="w-8 h-8 rounded-lg bg-haze flex items-center justify-center flex-shrink-0">
                      <Icon className="w-4 h-4 text-brand" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-charcoal">{label}</p>
                      <p className="text-xs text-dim truncate">{desc}</p>
                    </div>
                    <ArrowRight className="w-3.5 h-3.5 text-line group-hover:text-brand transition-colors" />
                  </Link>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
