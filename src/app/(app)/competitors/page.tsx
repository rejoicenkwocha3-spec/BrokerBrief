'use client';
import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/browser';
import { TopBar } from '@/components/dashboard/TopBar';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Label } from '@/components/ui/Label';
import { Target, Plus, X } from 'lucide-react';

interface Competitor {
  id: string;
  name: string;
  address?: string;
  category?: string;
  visibility_score?: number;
  notes?: string;
  business_profiles?: { name: string } | null;
}

interface BusinessProfile {
  id: string;
  name: string;
}

export default function CompetitorsPage() {
  const [competitors, setCompetitors] = useState<Competitor[]>([]);
  const [businesses, setBusinesses] = useState<BusinessProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [form, setForm] = useState({ name: '', address: '', category: '', business_id: '', notes: '' });

  const supabase = createClient();

  useEffect(() => { loadData(); }, []);

  const loadData = async () => {
    setLoading(true);
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;
    const [{ data: comps }, { data: biz }] = await Promise.all([
      supabase.from('tracked_competitors').select('id, name, address, category, visibility_score, notes, business_profiles(name)').eq('user_id', user.id).order('created_at', { ascending: false }),
      supabase.from('business_profiles').select('id, name').eq('user_id', user.id),
    ]);
    setCompetitors((comps || []) as never);
    setBusinesses(biz || []);
    setLoading(false);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;
    const { error } = await supabase.from('tracked_competitors').insert({
      user_id: user.id,
      business_id: form.business_id || null,
      name: form.name,
      address: form.address || null,
      category: form.category || null,
      notes: form.notes || null,
    });
    if (error) setError(error.message);
    else {
      setShowForm(false);
      setForm({ name: '', address: '', category: '', business_id: '', notes: '' });
      await loadData();
    }
    setSaving(false);
  };

  return (
    <div>
      <TopBar
        title="Competitor Insights"
        subtitle="Track businesses competing for your local customers"
        actions={
          <Button size="sm" onClick={() => setShowForm(true)}>
            <Plus className="w-3.5 h-3.5" /> Add Competitor
          </Button>
        }
      />
      <div className="p-6">
        {showForm && (
          <div className="bg-white border border-line rounded-xl p-6 mb-6">
            <div className="flex items-center justify-between mb-5">
              <h2 className="font-semibold text-charcoal">Add Competitor</h2>
              <button onClick={() => setShowForm(false)} className="p-1.5 hover:bg-surface rounded-lg text-dim">
                <X className="w-4 h-4" />
              </button>
            </div>
            {error && <div className="bg-red-50 border border-red-200 text-red-600 text-sm rounded-lg px-4 py-3 mb-4">{error}</div>}
            <form onSubmit={handleSave} className="grid md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="compname">Competitor Name</Label>
                <Input id="compname" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Competitor Business Name" required />
              </div>
              <div>
                <Label htmlFor="compcat">Category</Label>
                <Input id="compcat" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} placeholder="e.g. Coffee Shop" />
              </div>
              <div>
                <Label htmlFor="compaddr">Address</Label>
                <Input id="compaddr" value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} placeholder="Their address" />
              </div>
              <div>
                <Label htmlFor="yourbiz">Your Business (optional)</Label>
                <select className="input" value={form.business_id} onChange={(e) => setForm({ ...form, business_id: e.target.value })}>
                  <option value="">Link to business (optional)</option>
                  {businesses.map((b) => <option key={b.id} value={b.id}>{b.name}</option>)}
                </select>
              </div>
              <div className="md:col-span-2">
                <Label htmlFor="compnotes">Notes</Label>
                <Input id="compnotes" value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} placeholder="Why are you tracking this competitor?" />
              </div>
              <div className="md:col-span-2 flex gap-3 justify-end">
                <Button type="button" variant="ghost" onClick={() => setShowForm(false)}>Cancel</Button>
                <Button type="submit" disabled={saving}>{saving ? 'Saving...' : 'Save Competitor'}</Button>
              </div>
            </form>
          </div>
        )}

        {loading ? (
          <div className="bg-white border border-line rounded-xl p-8 text-center"><p className="text-sm text-dim">Loading...</p></div>
        ) : competitors.length === 0 ? (
          <div className="bg-white border border-line rounded-xl p-12 text-center">
            <div className="w-14 h-14 rounded-full bg-haze flex items-center justify-center mx-auto mb-4">
              <Target className="w-7 h-7 text-brand" />
            </div>
            <h2 className="text-lg font-semibold text-charcoal mb-2">No competitors tracked yet</h2>
            <p className="text-sm text-dim max-w-sm mx-auto mb-6">
              Add local businesses you compete with to track their visibility and compare your performance.
            </p>
            <Button onClick={() => setShowForm(true)}>
              <Plus className="w-4 h-4" /> Add Competitor
            </Button>
          </div>
        ) : (
          <div className="bg-white border border-line rounded-xl overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-line bg-surface">
                  <th className="text-left p-4 text-xs font-semibold text-dim">Business</th>
                  <th className="text-left p-4 text-xs font-semibold text-dim">Category</th>
                  <th className="text-left p-4 text-xs font-semibold text-dim">Address</th>
                  <th className="text-right p-4 text-xs font-semibold text-dim">Visibility Score</th>
                </tr>
              </thead>
              <tbody>
                {competitors.map((c) => (
                  <tr key={c.id} className="border-b border-line last:border-0 hover:bg-surface/50">
                    <td className="p-4">
                      <p className="font-medium text-charcoal">{c.name}</p>
                      {c.notes && <p className="text-xs text-dim mt-0.5">{c.notes}</p>}
                    </td>
                    <td className="p-4 text-dim">{c.category || 'N/A'}</td>
                    <td className="p-4 text-dim">{c.address || 'N/A'}</td>
                    <td className="p-4 text-right">
                      {c.visibility_score != null ? (
                        <span className="font-semibold text-charcoal">{c.visibility_score}/100</span>
                      ) : (
                        <span className="text-dim text-xs">Not tracked</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
