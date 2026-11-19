import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { TopBar } from '@/components/dashboard/TopBar';
import { BarChart2, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { AnalyticsCharts } from './AnalyticsCharts';

export default async function AnalyticsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/signin');

  const { data: snapshots } = await supabase
    .from('visibility_snapshots')
    .select('score, local_rank, recorded_at, business_profiles(name)')
    .eq('user_id', user.id)
    .order('recorded_at', { ascending: true })
    .limit(90);

  const { data: businesses } = await supabase
    .from('business_profiles')
    .select('id, name')
    .eq('user_id', user.id);

  return (
    <div>
      <TopBar title="Analytics" subtitle="Performance trends for your local business" />
      <div className="p-6 space-y-6">
        {!businesses?.length ? (
          <div className="bg-white border border-line rounded-xl p-12 text-center">
            <div className="w-14 h-14 rounded-full bg-haze flex items-center justify-center mx-auto mb-4">
              <BarChart2 className="w-7 h-7 text-brand" />
            </div>
            <h2 className="text-lg font-semibold text-charcoal mb-2">No analytics data yet</h2>
            <p className="text-sm text-dim max-w-sm mx-auto mb-6">
              Add a business profile to start generating analytics data.
            </p>
            <Link href="/business-profiles" className="inline-flex items-center gap-2 bg-brand hover:bg-brand-dark text-white font-semibold px-5 py-2.5 rounded-lg text-sm transition-colors">
              Add Business <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        ) : (
          <AnalyticsCharts snapshots={(snapshots || []) as never} businesses={businesses} />
        )}
      </div>
    </div>
  );
}
