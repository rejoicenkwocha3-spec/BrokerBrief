'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/browser';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Label } from '@/components/ui/Label';
import { ArrowRight, Building2, User } from 'lucide-react';

const categories = [
  'Restaurant and Food',
  'Retail',
  'Health and Beauty',
  'Professional Services',
  'Home Services',
  'Healthcare',
  'Fitness and Wellness',
  'Education and Training',
  'Hospitality and Travel',
  'Other',
];

export default function OnboardingPage() {
  const router = useRouter();
  const [step, setStep] = useState<1 | 2>(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Step 1: profile
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');

  // Step 2: business
  const [businessName, setBusinessName] = useState('');
  const [category, setCategory] = useState('');
  const [city, setCity] = useState('');

  const handleStep1 = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { setError('Not authenticated'); setLoading(false); return; }
    const { error } = await supabase.from('profiles').upsert({
      id: user.id,
      email: user.email!,
      first_name: firstName,
      last_name: lastName,
      onboarding_completed: false,
    });
    if (error) setError(error.message);
    else setStep(2);
    setLoading(false);
  };

  const handleStep2 = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { setError('Not authenticated'); setLoading(false); return; }

    // Create first business profile
    const { error: bizError } = await supabase.from('business_profiles').insert({
      user_id: user.id,
      name: businessName,
      category,
      city,
      address: '',
    });
    if (bizError && !bizError.message.includes('does not exist')) {
      // If the table doesn't exist yet, we still complete onboarding
    }

    // Mark onboarding complete
    await supabase.from('profiles').update({ onboarding_completed: true }).eq('id', user.id);
    router.push('/dashboard');
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-surface flex items-center justify-center py-12 px-5">
      <div className="w-full max-w-lg">
        {/* Logo */}
        <div className="flex items-center gap-2.5 justify-center mb-10">
          <img src="/logo.svg" alt="Locallndex" className="h-8 w-auto" />
          <span className="font-bold text-charcoal text-xl">Locallndex</span>
        </div>

        {/* Progress */}
        <div className="flex gap-2 mb-8">
          {[1, 2].map((s) => (
            <div
              key={s}
              className={`flex-1 h-1 rounded-full transition-colors ${s <= step ? 'bg-brand' : 'bg-line'}`}
            />
          ))}
        </div>

        {step === 1 && (
          <div className="bg-white border border-line rounded-2xl p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-lg bg-haze flex items-center justify-center">
                <User className="w-5 h-5 text-brand" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-charcoal">Your profile</h1>
                <p className="text-sm text-dim">Step 1 of 2</p>
              </div>
            </div>
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 text-sm rounded-lg px-4 py-3 mb-5">{error}</div>
            )}
            <form onSubmit={handleStep1} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="first_name">First name</Label>
                  <Input id="first_name" value={firstName} onChange={(e) => setFirstName(e.target.value)} placeholder="First name" required />
                </div>
                <div>
                  <Label htmlFor="last_name">Last name</Label>
                  <Input id="last_name" value={lastName} onChange={(e) => setLastName(e.target.value)} placeholder="Last name" required />
                </div>
              </div>
              <Button type="submit" className="w-full justify-center" disabled={loading}>
                {loading ? 'Saving...' : 'Continue'} <ArrowRight className="w-4 h-4" />
              </Button>
            </form>
          </div>
        )}

        {step === 2 && (
          <div className="bg-white border border-line rounded-2xl p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-lg bg-haze flex items-center justify-center">
                <Building2 className="w-5 h-5 text-brand" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-charcoal">Your first business</h1>
                <p className="text-sm text-dim">Step 2 of 2</p>
              </div>
            </div>
            <p className="text-sm text-dim mb-5">
              Add your business to get your first visibility score and AI recommendations. You can add more businesses later.
            </p>
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 text-sm rounded-lg px-4 py-3 mb-5">{error}</div>
            )}
            <form onSubmit={handleStep2} className="space-y-4">
              <div>
                <Label htmlFor="bizname">Business name</Label>
                <Input id="bizname" value={businessName} onChange={(e) => setBusinessName(e.target.value)} placeholder="My Business Name" required />
              </div>
              <div>
                <Label htmlFor="category">Business category</Label>
                <select id="category" className="input" value={category} onChange={(e) => setCategory(e.target.value)} required>
                  <option value="">Select a category</option>
                  {categories.map((c) => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div>
                <Label htmlFor="city">City</Label>
                <Input id="city" value={city} onChange={(e) => setCity(e.target.value)} placeholder="City, State or Country" required />
              </div>
              <div className="flex gap-3">
                <Button type="button" variant="ghost" onClick={() => setStep(1)} className="flex-1 justify-center">
                  Back
                </Button>
                <Button type="submit" className="flex-2 flex-1 justify-center" disabled={loading}>
                  {loading ? 'Setting up...' : 'Go to Dashboard'} <ArrowRight className="w-4 h-4" />
                </Button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
