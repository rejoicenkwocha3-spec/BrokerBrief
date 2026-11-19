import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { TopBar } from '@/components/dashboard/TopBar';
import { Eye, TrendingUp, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export default async function VisibilityPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/signin');

  const { data: snapshots } = await supabase
    .from('visibility_snapshots')
    .select('id, score, local_rank, keyword, recorded_at, business_profiles(name)')
    .eq('user_id', user.id)
    .order('recorded_at', { ascending: false })
    .limit(20);

  const { data: businesses } = await supabase
    .from('business_profiles')
    .select('id, name')
    .eq('user_id', user.id);

  const latestByBusiness = new Map<string, typeof snapshots extends Array<infer T> ? T : never>();
  snapshots?.forEach((s) => {
    const bizId = (s as unknown as { business_id?: string }).business_id ?? 'unknown';
    if (!latestByBusiness.has(bizId)) latestByBusiness.set(bizId, s as never);
  });

  return (
    <div>
      <TopBar
        title="Local Visibility"
        subtitle="Track your local search performance"
      />
      <div className="p-6 space-y-6">

        {!businesses?.length ? (
          <div className="bg-white border border-line rounded-xl p-12 text-center">
            <div className="w-14 h-14 rounded-full bg-haze flex items-center justify-center mx-auto mb-4">
              <Eye className="w-7 h-7 text-brand" />
            </div>
            <h2 className="text-lg font-semibold text-charcoal mb-2">No visibility data yet</h2>
            <p className="text-sm text-dim max-w-sm mx-auto mb-6">
              Add a business profile to start tracking your local search visibility score.
            </p>
            <Link href="/business-profiles" className="inline-flex items-center gap-2 bg-brand hover:bg-brand-dark text-white font-semibold px-5 py-2.5 rounded-lg text-sm transition-colors">
              Add Business Profile <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        ) : (
          <>
            {/* Visibility score cards */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
              {businesses.map((b) => {
                const snap = Array.from(latestByBusiness.values()).find(
                  (s) => {
                    const bp = (s as unknown as { business_profiles?: { name: string } }).business_profiles;
                    return bp?.name === b.name;
                  }
                );
                const score = snap ? (snap as unknown as { score: number }).score : null;
                const rank = snap ? (snap as unknown as { local_rank: number | null }).local_rank : null;
                return (
                  <div key={b.id} className="bg-white border border-line rounded-xl p-6">
                    <p className="text-xs font-medium text-dim mb-3">{b.name}</p>
                    {score !== null ? (
                      <>
                        <div className="flex items-end gap-3 mb-4">
                          <span className="text-5xl font-bold text-charcoal">{score}</span>
                          <span className="text-dim text-sm mb-1">/100</span>
                        </div>
                        <div className="h-2 bg-line rounded-full overflow-hidden mb-3">
                          <div
                            className="h-full rounded-full transition-all"
                            style={{
                              width: `${score}%`,
                              backgroundColor: score >= 70 ? '#2047FF' : score >= 40 ? '#f59e0b' : '#ef4444',
                            }}
                          />
                        </div>
                        {rank && (
                          <p className="text-sm text-dim">
                            Local rank: <span className="font-semibold text-charcoal">#{rank}</span> in category
                          </p>
                        )}
                      </>
                    ) : (
                      <div className="text-center py-4">
                        <TrendingUp className="w-8 h-8 text-line mx-auto mb-2" />
                        <p className="text-sm text-dim">Score pending. Data will appear after setup.</p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Score history */}
            {snapshots && snapshots.length > 0 && (
              <div className="bg-white border border-line rounded-xl p-6">
                <h2 className="font-semibold text-charcoal mb-5">Visibility History</h2>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-line">
                        <th className="text-left pb-3 text-xs font-semibold text-dim">Business</th>
                        <th className="text-left pb-3 text-xs font-semibold text-dim">Keyword</th>
                        <th className="text-right pb-3 text-xs font-semibold text-dim">Score</th>
                        <th className="text-right pb-3 text-xs font-semibold text-dim">Local Rank</th>
                        <th className="text-right pb-3 text-xs font-semibold text-dim">Date</th>
                      </tr>
                    </thead>
                    <tbody>
                      {snapshots.slice(0, 10).map((s) => {
                        const snap = s as unknown as {
                          id: string;
                          score: number;
                          local_rank: number | null;
                          keyword?: string;
                          recorded_at: string;
                          business_profiles?: { name: string } | null;
                        };
                        return (
                          <tr key={snap.id} className="border-b border-line last:border-0">
                            <td className="py-3 text-charcoal">{snap.business_profiles?.name || 'Unknown'}</td>
                            <td className="py-3 text-dim">{snap.keyword || 'General'}</td>
                            <td className="py-3 text-right font-semibold text-charcoal">{snap.score}/100</td>
                            <td className="py-3 text-right text-dim">{snap.local_rank ? `#${snap.local_rank}` : 'N/A'}</td>
                            <td className="py-3 text-right text-dim text-xs">
                              {new Date(snap.recorded_at).toLocaleDateString()}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
