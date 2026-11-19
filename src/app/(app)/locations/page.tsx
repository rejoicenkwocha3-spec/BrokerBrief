'use client';
import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/browser';
import { TopBar } from '@/components/dashboard/TopBar';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Label } from '@/components/ui/Label';
import { MapPin, Plus, X, Building2 } from 'lucide-react';

interface Location {
  id: string;
  name: string;
  address: string;
  city: string;
  is_primary: boolean;
  business_profiles?: { name: string } | null;
}

interface BusinessProfile {
  id: string;
  name: string;
}

export default function LocationsPage() {
  const [locations, setLocations] = useState<Location[]>([]);
  const [businesses, setBusinesses] = useState<BusinessProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [form, setForm] = useState({ name: '', address: '', city: '', business_id: '', is_primary: false });

  const supabase = createClient();

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;
    const [{ data: locs }, { data: biz }] = await Promise.all([
      supabase.from('locations').select('id, name, address, city, is_primary, business_profiles(name)').eq('user_id', user.id).order('created_at', { ascending: false }),
      supabase.from('business_profiles').select('id, name').eq('user_id', user.id),
    ]);
    setLocations((locs || []) as never);
    setBusinesses(biz || []);
    setLoading(false);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;
    const { error } = await supabase.from('locations').insert({
      user_id: user.id,
      business_id: form.business_id,
      name: form.name,
      address: form.address,
      city: form.city,
      is_primary: form.is_primary,
    });
    if (error) setError(error.message);
    else {
      setShowForm(false);
      setForm({ name: '', address: '', city: '', business_id: '', is_primary: false });
      await loadData();
    }
    setSaving(false);
  };

  return (
    <div>
      <TopBar
        title="Locations"
        subtitle="Manage your business locations"
        actions={
          <Button size="sm" onClick={() => setShowForm(true)}>
            <Plus className="w-3.5 h-3.5" /> Add Location
          </Button>
        }
      />

      <div className="p-6">
        {showForm && (
          <div className="bg-white border border-line rounded-xl p-6 mb-6">
            <div className="flex items-center justify-between mb-5">
              <h2 className="font-semibold text-charcoal">Add Location</h2>
              <button onClick={() => setShowForm(false)} className="p-1.5 hover:bg-surface rounded-lg text-dim">
                <X className="w-4 h-4" />
              </button>
            </div>
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 text-sm rounded-lg px-4 py-3 mb-4">{error}</div>
            )}
            <form onSubmit={handleSave} className="grid md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="business">Business Profile</Label>
                <select
                  id="business"
                  className="input"
                  value={form.business_id}
                  onChange={(e) => setForm({ ...form, business_id: e.target.value })}
                  required
                >
                  <option value="">Select a business</option>
                  {businesses.map((b) => (
                    <option key={b.id} value={b.id}>{b.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <Label htmlFor="locname">Location Name</Label>
                <Input id="locname" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="e.g. Downtown Branch" required />
              </div>
              <div>
                <Label htmlFor="locaddr">Address</Label>
                <Input id="locaddr" value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} placeholder="123 Main Street" required />
              </div>
              <div>
                <Label htmlFor="loccity">City</Label>
                <Input id="loccity" value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} placeholder="City, State" required />
              </div>
              <div className="md:col-span-2 flex items-center gap-2">
                <input type="checkbox" id="primary" checked={form.is_primary} onChange={(e) => setForm({ ...form, is_primary: e.target.checked })} className="rounded border-line" />
                <Label htmlFor="primary" className="mb-0">Set as primary location</Label>
              </div>
              <div className="md:col-span-2 flex gap-3 justify-end">
                <Button type="button" variant="ghost" onClick={() => setShowForm(false)}>Cancel</Button>
                <Button type="submit" disabled={saving}>{saving ? 'Saving...' : 'Save Location'}</Button>
              </div>
            </form>
          </div>
        )}

        {loading ? (
          <div className="bg-white border border-line rounded-xl p-8 text-center">
            <p className="text-sm text-dim">Loading...</p>
          </div>
        ) : businesses.length === 0 ? (
          <div className="bg-white border border-line rounded-xl p-12 text-center">
            <div className="w-14 h-14 rounded-full bg-haze flex items-center justify-center mx-auto mb-4">
              <Building2 className="w-7 h-7 text-brand" />
            </div>
            <h2 className="text-lg font-semibold text-charcoal mb-2">Add a business first</h2>
            <p className="text-sm text-dim max-w-sm mx-auto">
              Locations are linked to a business profile. Add your business profile first, then add locations.
            </p>
          </div>
        ) : locations.length === 0 ? (
          <div className="bg-white border border-line rounded-xl p-12 text-center">
            <div className="w-14 h-14 rounded-full bg-haze flex items-center justify-center mx-auto mb-4">
              <MapPin className="w-7 h-7 text-brand" />
            </div>
            <h2 className="text-lg font-semibold text-charcoal mb-2">No locations added yet</h2>
            <p className="text-sm text-dim max-w-sm mx-auto mb-6">
              Add locations for each physical address your business operates from.
            </p>
            <Button onClick={() => setShowForm(true)}>
              <Plus className="w-4 h-4" /> Add Location
            </Button>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {locations.map((l) => {
              const biz = l.business_profiles as { name: string } | null;
              return (
                <div key={l.id} className="bg-white border border-line rounded-xl p-5">
                  <div className="flex items-start justify-between mb-3">
                    <div className="w-10 h-10 rounded-lg bg-haze flex items-center justify-center">
                      <MapPin className="w-5 h-5 text-brand" />
                    </div>
                    {l.is_primary && (
                      <span className="text-xs bg-brand text-white font-semibold px-2 py-0.5 rounded-full">Primary</span>
                    )}
                  </div>
                  <h3 className="font-semibold text-charcoal mb-1">{l.name}</h3>
                  {biz && <p className="text-xs text-brand font-medium mb-2">{biz.name}</p>}
                  <p className="text-xs text-dim">{l.address}, {l.city}</p>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
