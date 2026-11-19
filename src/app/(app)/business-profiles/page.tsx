'use client';
import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/browser';
import { TopBar } from '@/components/dashboard/TopBar';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Label } from '@/components/ui/Label';
import { Building2, Plus, MapPin, ExternalLink, X } from 'lucide-react';

interface BusinessProfile {
  id: string;
  name: string;
  category: string;
  address: string;
  city: string;
  website?: string;
  phone?: string;
  visibility_score?: number;
}

export default function BusinessProfilesPage() {
  const [profiles, setProfiles] = useState<BusinessProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [form, setForm] = useState({ name: '', category: '', address: '', city: '', website: '', phone: '' });

  const supabase = createClient();

  useEffect(() => {
    loadProfiles();
  }, []);

  const loadProfiles = async () => {
    setLoading(true);
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;
    const { data } = await supabase
      .from('business_profiles')
      .select('id, name, category, address, city, website, phone')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });
    setProfiles(data || []);
    setLoading(false);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;
    const { error } = await supabase.from('business_profiles').insert({
      user_id: user.id,
      name: form.name,
      category: form.category,
      address: form.address,
      city: form.city,
      website: form.website || null,
      phone: form.phone || null,
    });
    if (error) {
      setError(error.message);
    } else {
      setShowForm(false);
      setForm({ name: '', category: '', address: '', city: '', website: '', phone: '' });
      await loadProfiles();
    }
    setSaving(false);
  };

  return (
    <div>
      <TopBar
        title="Business Profiles"
        subtitle="Manage your business information"
        actions={
          <Button size="sm" onClick={() => setShowForm(true)}>
            <Plus className="w-3.5 h-3.5" /> Add Business
          </Button>
        }
      />

      <div className="p-6">
        {/* Add form */}
        {showForm && (
          <div className="bg-white border border-line rounded-xl p-6 mb-6">
            <div className="flex items-center justify-between mb-5">
              <h2 className="font-semibold text-charcoal">Add Business Profile</h2>
              <button onClick={() => setShowForm(false)} className="p-1.5 hover:bg-surface rounded-lg text-dim">
                <X className="w-4 h-4" />
              </button>
            </div>
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 text-sm rounded-lg px-4 py-3 mb-4">{error}</div>
            )}
            <form onSubmit={handleSave} className="grid md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="name">Business Name</Label>
                <Input id="name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="My Business Name" required />
              </div>
              <div>
                <Label htmlFor="category">Business Category</Label>
                <Input id="category" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} placeholder="e.g. Restaurant, Plumber" required />
              </div>
              <div>
                <Label htmlFor="address">Street Address</Label>
                <Input id="address" value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} placeholder="123 Main Street" required />
              </div>
              <div>
                <Label htmlFor="city">City</Label>
                <Input id="city" value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} placeholder="City, State" required />
              </div>
              <div>
                <Label htmlFor="website">Website (optional)</Label>
                <Input id="website" type="url" value={form.website} onChange={(e) => setForm({ ...form, website: e.target.value })} placeholder="https://yourbusiness.com" />
              </div>
              <div>
                <Label htmlFor="phone">Phone (optional)</Label>
                <Input id="phone" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} placeholder="+1 555 000 0000" />
              </div>
              <div className="md:col-span-2 flex gap-3 justify-end">
                <Button type="button" variant="ghost" onClick={() => setShowForm(false)}>Cancel</Button>
                <Button type="submit" disabled={saving}>{saving ? 'Saving...' : 'Save Business'}</Button>
              </div>
            </form>
          </div>
        )}

        {/* Profiles list */}
        {loading ? (
          <div className="bg-white border border-line rounded-xl p-8 text-center">
            <p className="text-sm text-dim">Loading...</p>
          </div>
        ) : profiles.length === 0 ? (
          <div className="bg-white border border-line rounded-xl p-12 text-center">
            <div className="w-14 h-14 rounded-full bg-haze flex items-center justify-center mx-auto mb-4">
              <Building2 className="w-7 h-7 text-brand" />
            </div>
            <h2 className="text-lg font-semibold text-charcoal mb-2">No business profiles yet</h2>
            <p className="text-sm text-dim max-w-sm mx-auto mb-6">
              Add your first business to start tracking your local visibility score and generating AI recommendations.
            </p>
            <Button onClick={() => setShowForm(true)}>
              <Plus className="w-4 h-4" /> Add Business Profile
            </Button>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {profiles.map((p) => (
              <div key={p.id} className="bg-white border border-line rounded-xl p-5 hover:border-brand/30 transition-colors">
                <div className="flex items-start justify-between mb-3">
                  <div className="w-10 h-10 rounded-lg bg-haze flex items-center justify-center">
                    <Building2 className="w-5 h-5 text-brand" />
                  </div>
                  {p.website && (
                    <a href={p.website} target="_blank" rel="noopener noreferrer" className="p-1.5 hover:bg-surface rounded-lg text-dim">
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  )}
                </div>
                <h3 className="font-semibold text-charcoal mb-1">{p.name}</h3>
                <p className="text-xs text-brand font-medium mb-2">{p.category}</p>
                <div className="flex items-center gap-1 text-xs text-dim">
                  <MapPin className="w-3 h-3" />
                  <span>{p.address}, {p.city}</span>
                </div>
                {p.phone && <p className="text-xs text-dim mt-1">{p.phone}</p>}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
