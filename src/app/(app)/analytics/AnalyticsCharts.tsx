'use client';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface Snapshot {
  score: number;
  local_rank: number | null;
  recorded_at: string;
  business_profiles?: { name: string } | null;
}

interface Business {
  id: string;
  name: string;
}

interface Props {
  snapshots: Snapshot[];
  businesses: Business[];
}

export function AnalyticsCharts({ snapshots, businesses }: Props) {
  const chartData = snapshots.map((s) => ({
    date: new Date(s.recorded_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    score: s.score,
    rank: s.local_rank ?? null,
  }));

  if (!snapshots.length) {
    return (
      <div className="bg-white border border-line rounded-xl p-10 text-center">
        <p className="text-sm text-dim">
          Analytics data will appear here once your visibility scores are recorded.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Business Profiles', value: `${businesses.length}` },
          { label: 'Latest Score', value: snapshots.length ? `${snapshots[snapshots.length - 1].score}/100` : 'N/A' },
          { label: 'Score Change (30d)', value: snapshots.length >= 2 ? `+${(snapshots[snapshots.length - 1].score - snapshots[0].score)}` : 'N/A' },
          { label: 'Data Points', value: `${snapshots.length}` },
        ].map(({ label, value }) => (
          <div key={label} className="bg-white border border-line rounded-xl p-5">
            <p className="text-xs text-dim mb-1">{label}</p>
            <p className="text-2xl font-bold text-charcoal">{value}</p>
          </div>
        ))}
      </div>

      {/* Visibility score chart */}
      <div className="bg-white border border-line rounded-xl p-6">
        <h2 className="font-semibold text-charcoal mb-5">Visibility Score Over Time</h2>
        <ResponsiveContainer width="100%" height={240}>
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#E6E6EB" />
            <XAxis dataKey="date" tick={{ fontSize: 11, fill: '#777985' }} tickLine={false} axisLine={false} />
            <YAxis domain={[0, 100]} tick={{ fontSize: 11, fill: '#777985' }} tickLine={false} axisLine={false} />
            <Tooltip
              contentStyle={{ border: '1px solid #E6E6EB', borderRadius: '8px', fontSize: '12px' }}
              itemStyle={{ color: '#171717' }}
            />
            <Line
              type="monotone"
              dataKey="score"
              stroke="#2047FF"
              strokeWidth={2}
              dot={false}
              name="Visibility Score"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Rank chart */}
      {chartData.some((d) => d.rank !== null) && (
        <div className="bg-white border border-line rounded-xl p-6">
          <h2 className="font-semibold text-charcoal mb-5">Local Search Rank</h2>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E6E6EB" />
              <XAxis dataKey="date" tick={{ fontSize: 11, fill: '#777985' }} tickLine={false} axisLine={false} />
              <YAxis reversed domain={[1, 20]} tick={{ fontSize: 11, fill: '#777985' }} tickLine={false} axisLine={false} />
              <Tooltip
                contentStyle={{ border: '1px solid #E6E6EB', borderRadius: '8px', fontSize: '12px' }}
                formatter={(v) => [`#${v}`, 'Local Rank']}
              />
              <Line
                type="monotone"
                dataKey="rank"
                stroke="#2047FF"
                strokeWidth={2}
                dot={false}
                name="Local Rank"
              />
            </LineChart>
          </ResponsiveContainer>
          <p className="text-xs text-dim mt-2">Lower rank number means higher position in local search.</p>
        </div>
      )}
    </div>
  );
}
