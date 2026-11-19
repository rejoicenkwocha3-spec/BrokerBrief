import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { TopBar } from '@/components/dashboard/TopBar';
import { FileText, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export default async function ReportsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/signin');

  const { data: businesses } = await supabase
    .from('business_profiles')
    .select('id, name, category')
    .eq('user_id', user.id);

  const { data: snapshots } = await supabase
    .from('visibility_snapshots')
    .select('score, local_rank, recorded_at, business_profiles(name)')
    .eq('user_id', user.id)
    .order('recorded_at', { ascending: false })
    .limit(30);

  const { data: reviews } = await supabase
    .from('review_summaries')
    .select('platform, rating, total_reviews, business_profiles(name)')
    .eq('user_id', user.id);

  return (
    <div>
      <TopBar title="Reports" subtitle="Performance summaries for your business" />
      <div className="p-6 space-y-6">

        {!businesses?.length ? (
          <div className="bg-white border border-line rounded-xl p-12 text-center">
            <div className="w-14 h-14 rounded-full bg-haze flex items-center justify-center mx-auto mb-4">
              <FileText className="w-7 h-7 text-brand" />
            </div>
            <h2 className="text-lg font-semibold text-charcoal mb-2">No report data yet</h2>
            <p className="text-sm text-dim max-w-sm mx-auto mb-6">
              Add a business profile and start tracking visibility to generate performance reports.
            </p>
            <Link href="/business-profiles" className="inline-flex items-center gap-2 bg-brand hover:bg-brand-dark text-white font-semibold px-5 py-2.5 rounded-lg text-sm transition-colors">
              Add Business <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        ) : (
          <>
            {businesses.map((b) => {
              const bizSnapshots = snapshots?.filter((s) => {
                const bp = (s as unknown as { business_profiles?: { name: string } }).business_profiles;
                return bp?.name === b.name;
              }) || [];
              const latestScore = bizSnapshots[0] ? (bizSnapshots[0] as unknown as { score: number }).score : null;
              const latestRank = bizSnapshots[0] ? (bizSnapshots[0] as unknown as { local_rank: number | null }).local_rank : null;
              const bizReviews = reviews?.filter((r) => {
                const bp = (r as unknown as { business_profiles?: { name: string } }).business_profiles;
                return bp?.name === b.name;
              }) || [];
              const avgRating = bizReviews.length
                ? bizReviews.reduce((sum, r) => sum + r.rating, 0) / bizReviews.length
                : null;
              const totalReviews = bizReviews.reduce((sum, r) => sum + r.total_reviews, 0);

              return (
                <div key={b.id} className="bg-white border border-line rounded-2xl overflow-hidden">
                  {/* Report header */}
                  <div className="px-7 py-5 border-b border-line flex items-center justify-between">
                    <div>
                      <h2 className="font-bold text-charcoal text-lg">{b.name}</h2>
                      <p className="text-sm text-dim">{b.category}</p>
                    </div>
                    <span className="text-xs text-dim">
                      Report date: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                    </span>
                  </div>

                  {/* Metrics */}
                  <div className="grid grid-cols-2 md:grid-cols-4">
                    {[
                      { label: 'Visibility Score', value: latestScore != null ? `${latestScore}/100` : 'No data' },
                      { label: 'Local Rank', value: latestRank != null ? `#${latestRank}` : 'No data' },
                      { label: 'Avg Review Rating', value: avgRating != null ? avgRating.toFixed(1) : 'No data' },
                      { label: 'Total Reviews', value: totalReviews > 0 ? `${totalReviews}` : 'No data' },
                    ].map(({ label, value }, i) => (
                      <div key={label} className={`p-5 ${i < 3 ? 'border-r border-line' : ''}`}>
                        <p className="text-xs text-dim mb-1">{label}</p>
                        <p className="text-xl font-bold text-charcoal">{value}</p>
                      </div>
                    ))}
                  </div>

                  {/* Score history */}
                  {bizSnapshots.length > 0 && (
                    <div className="px-7 py-5 border-t border-line">
                      <p className="text-xs font-semibold text-dim uppercase tracking-widest mb-3">Recent Visibility Scores</p>
                      <div className="flex items-end gap-1.5 h-16">
                        {bizSnapshots.slice(0, 12).reverse().map((s, i) => {
                          const snap = s as unknown as { score: number };
                          return (
                            <div
                              key={i}
                              className="flex-1 rounded-t-sm bg-brand opacity-80"
                              style={{ height: `${snap.score}%` }}
                              title={`Score: ${snap.score}`}
                            />
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </>
        )}
      </div>
    </div>
  );
}
