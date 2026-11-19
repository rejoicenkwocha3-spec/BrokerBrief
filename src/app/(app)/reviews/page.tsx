import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { TopBar } from '@/components/dashboard/TopBar';
import { Star, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export default async function ReviewsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/signin');

  const { data: summaries } = await supabase
    .from('review_summaries')
    .select('id, platform, rating, total_reviews, positive_pct, negative_pct, synced_at, business_profiles(name)')
    .eq('user_id', user.id)
    .order('synced_at', { ascending: false });

  const { data: businesses } = await supabase
    .from('business_profiles')
    .select('id, name')
    .eq('user_id', user.id);

  return (
    <div>
      <TopBar
        title="Reviews and Reputation"
        subtitle="Your review data across platforms"
      />
      <div className="p-6 space-y-6">

        {!businesses?.length ? (
          <div className="bg-white border border-line rounded-xl p-12 text-center">
            <div className="w-14 h-14 rounded-full bg-haze flex items-center justify-center mx-auto mb-4">
              <Star className="w-7 h-7 text-brand" />
            </div>
            <h2 className="text-lg font-semibold text-charcoal mb-2">No review data yet</h2>
            <p className="text-sm text-dim max-w-sm mx-auto mb-6">
              Add a business profile to start tracking your reviews and reputation.
            </p>
            <Link href="/business-profiles" className="inline-flex items-center gap-2 bg-brand hover:bg-brand-dark text-white font-semibold px-5 py-2.5 rounded-lg text-sm transition-colors">
              Add Business <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        ) : summaries && summaries.length > 0 ? (
          <>
            {/* Summary cards */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
              {summaries.map((s) => {
                const summary = s as unknown as {
                  id: string;
                  platform: string;
                  rating: number;
                  total_reviews: number;
                  positive_pct: number | null;
                  negative_pct: number | null;
                  synced_at: string;
                  business_profiles?: { name: string } | null;
                };
                return (
                  <div key={summary.id} className="bg-white border border-line rounded-xl p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <p className="font-semibold text-charcoal">{summary.platform}</p>
                        {summary.business_profiles && (
                          <p className="text-xs text-dim">{summary.business_profiles.name}</p>
                        )}
                      </div>
                      <span className="text-xs text-dim">
                        Updated {new Date(summary.synced_at).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="flex items-baseline gap-2 mb-3">
                      <span className="text-4xl font-bold text-charcoal">{summary.rating.toFixed(1)}</span>
                      <span className="text-dim text-sm">/ 5</span>
                    </div>
                    <div className="flex gap-0.5 mb-3">
                      {[1, 2, 3, 4, 5].map((s) => (
                        <Star
                          key={s}
                          className={`w-4 h-4 ${s <= Math.round(summary.rating) ? 'text-brand fill-brand' : 'text-line'}`}
                        />
                      ))}
                    </div>
                    <p className="text-sm text-dim mb-3">{summary.total_reviews} reviews</p>
                    {summary.positive_pct != null && (
                      <div className="space-y-1.5">
                        <div className="flex items-center gap-2 text-xs">
                          <span className="text-dim w-16">Positive</span>
                          <div className="flex-1 h-1.5 bg-line rounded-full overflow-hidden">
                            <div className="h-full bg-brand rounded-full" style={{ width: `${summary.positive_pct}%` }} />
                          </div>
                          <span className="text-charcoal font-medium w-8">{summary.positive_pct}%</span>
                        </div>
                        {summary.negative_pct != null && (
                          <div className="flex items-center gap-2 text-xs">
                            <span className="text-dim w-16">Negative</span>
                            <div className="flex-1 h-1.5 bg-line rounded-full overflow-hidden">
                              <div className="h-full bg-red-400 rounded-full" style={{ width: `${summary.negative_pct}%` }} />
                            </div>
                            <span className="text-charcoal font-medium w-8">{summary.negative_pct}%</span>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </>
        ) : (
          <div className="bg-white border border-line rounded-xl p-12 text-center">
            <div className="w-14 h-14 rounded-full bg-haze flex items-center justify-center mx-auto mb-4">
              <Star className="w-7 h-7 text-brand" />
            </div>
            <h2 className="text-lg font-semibold text-charcoal mb-2">No review data available</h2>
            <p className="text-sm text-dim max-w-sm mx-auto">
              Review summaries will appear here once your business review data has been synced.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
