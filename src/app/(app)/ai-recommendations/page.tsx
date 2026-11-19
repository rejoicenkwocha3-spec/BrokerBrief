import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { TopBar } from '@/components/dashboard/TopBar';
import { Zap, ArrowRight, CheckCircle2 } from 'lucide-react';
import Link from 'next/link';

export default async function AIRecommendationsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/signin');

  const { data: recommendations } = await supabase
    .from('ai_recommendations')
    .select('id, title, description, priority, type, status, created_at, business_profiles(name)')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false });

  const { data: businesses } = await supabase
    .from('business_profiles')
    .select('id, name')
    .eq('user_id', user.id);

  const pending = recommendations?.filter((r) => r.status === 'pending') || [];
  const done = recommendations?.filter((r) => r.status === 'done') || [];

  const priorityOrder = { high: 0, medium: 1, low: 2 };
  const sorted = [...pending].sort((a, b) => {
    const pa = priorityOrder[a.priority as keyof typeof priorityOrder] ?? 1;
    const pb = priorityOrder[b.priority as keyof typeof priorityOrder] ?? 1;
    return pa - pb;
  });

  return (
    <div>
      <TopBar title="AI Recommendations" subtitle="Prioritised actions to improve your local visibility" />
      <div className="p-6 space-y-6">

        {!businesses?.length ? (
          <div className="bg-white border border-line rounded-xl p-12 text-center">
            <div className="w-14 h-14 rounded-full bg-haze flex items-center justify-center mx-auto mb-4">
              <Zap className="w-7 h-7 text-brand" />
            </div>
            <h2 className="text-lg font-semibold text-charcoal mb-2">No recommendations yet</h2>
            <p className="text-sm text-dim max-w-sm mx-auto mb-6">
              Add a business profile to receive AI-powered recommendations tailored to your local market position.
            </p>
            <Link href="/business-profiles" className="inline-flex items-center gap-2 bg-brand hover:bg-brand-dark text-white font-semibold px-5 py-2.5 rounded-lg text-sm transition-colors">
              Add Business <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        ) : sorted.length === 0 && done.length === 0 ? (
          <div className="bg-white border border-line rounded-xl p-12 text-center">
            <div className="w-14 h-14 rounded-full bg-haze flex items-center justify-center mx-auto mb-4">
              <Zap className="w-7 h-7 text-brand" />
            </div>
            <h2 className="text-lg font-semibold text-charcoal mb-2">Recommendations generating</h2>
            <p className="text-sm text-dim max-w-sm mx-auto">
              AI recommendations are generated based on your business data. Check back shortly.
            </p>
          </div>
        ) : (
          <>
            {/* Summary bar */}
            <div className="grid grid-cols-3 gap-4">
              {[
                { label: 'Open Actions', value: sorted.length, color: 'text-brand' },
                { label: 'High Priority', value: sorted.filter((r) => r.priority === 'high').length, color: 'text-red-500' },
                { label: 'Completed', value: done.length, color: 'text-green-500' },
              ].map(({ label, value, color }) => (
                <div key={label} className="bg-white border border-line rounded-xl p-5">
                  <p className="text-xs text-dim mb-1">{label}</p>
                  <p className={`text-2xl font-bold ${color}`}>{value}</p>
                </div>
              ))}
            </div>

            {/* Pending recommendations */}
            {sorted.length > 0 && (
              <div className="bg-white border border-line rounded-xl overflow-hidden">
                <div className="px-6 py-4 border-b border-line">
                  <h2 className="font-semibold text-charcoal">Open Recommendations</h2>
                </div>
                <div className="divide-y divide-line">
                  {sorted.map((r) => {
                    const rec = r as unknown as {
                      id: string;
                      title: string;
                      description?: string;
                      priority: string;
                      type?: string;
                      business_profiles?: { name: string } | null;
                    };
                    return (
                      <div key={rec.id} className="p-5 flex gap-4 items-start">
                        <div className="flex-shrink-0 mt-0.5">
                          <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${
                            rec.priority === 'high' ? 'bg-brand text-white' :
                            rec.priority === 'medium' ? 'bg-haze text-brand' :
                            'bg-surface text-dim'
                          }`}>
                            {rec.priority}
                          </span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-charcoal mb-1">{rec.title}</p>
                          {rec.description && <p className="text-sm text-dim leading-relaxed">{rec.description}</p>}
                          {rec.business_profiles && (
                            <p className="text-xs text-dim mt-1.5">{rec.business_profiles.name}</p>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Completed */}
            {done.length > 0 && (
              <div className="bg-white border border-line rounded-xl overflow-hidden">
                <div className="px-6 py-4 border-b border-line flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-green-500" />
                  <h2 className="font-semibold text-charcoal">Completed</h2>
                </div>
                <div className="divide-y divide-line">
                  {done.map((r) => (
                    <div key={r.id} className="p-5 opacity-60">
                      <p className="font-medium text-charcoal line-through">{r.title}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
