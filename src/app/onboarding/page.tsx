'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/browser';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Label } from '@/components/ui/Label';
import { slugify } from '@/lib/utils';
import { CheckCircle2, ArrowRight } from 'lucide-react';

type Step = 1 | 2 | 3;

export default function OnboardingPage() {
  const router = useRouter();
  const [step, setStep] = useState<Step>(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Step 1: org
  const [orgName, setOrgName] = useState('');
  const [orgEmail, setOrgEmail] = useState('');
  const [orgPhone, setOrgPhone] = useState('');
  const [country, setCountry] = useState('');
  const [brokerageType, setBrokerageType] = useState('');

  // Step 2: profile
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [jobTitle, setJobTitle] = useState('');

  const handleStep1 = (e: React.FormEvent) => {
    e.preventDefault();
    if (!orgName.trim()) { setError('Organisation name is required'); return; }
    setError('');
    setStep(2);
  };

  const handleStep2 = (e: React.FormEvent) => {
    e.preventDefault();
    if (!firstName.trim() || !lastName.trim()) { setError('Full name is required'); return; }
    setError('');
    setStep(3);
  };

  const handleFinish = async () => {
    setLoading(true);
    setError('');
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { router.push('/signin'); return; }

    const slug = slugify(orgName) + '-' + Math.random().toString(36).substring(2, 6);

    // Create organisation
    const { data: org, error: orgError } = await supabase
      .from('organisations')
      .insert({ name: orgName, slug, email: orgEmail || null, phone: orgPhone || null, country: country || null, brokerage_type: brokerageType || null })
      .select('id')
      .single();

    if (orgError) { setError(orgError.message); setLoading(false); return; }

    // Update profile
    const { error: profileError } = await supabase
      .from('profiles')
      .update({ first_name: firstName, last_name: lastName, job_title: jobTitle || null, onboarding_completed: true })
      .eq('id', user.id);

    if (profileError) { setError(profileError.message); setLoading(false); return; }

    // Add as owner
    const { error: memberError } = await supabase
      .from('organisation_members')
      .insert({ organisation_id: org.id, user_id: user.id, role: 'owner' });

    if (memberError) { setError(memberError.message); setLoading(false); return; }

    router.push('/dashboard');
  };

  const steps = [
    { n: 1, label: 'Your Brokerage' },
    { n: 2, label: 'Your Profile' },
    { n: 3, label: 'All Set' },
  ];

  return (
    <div className="min-h-screen bg-soft-white flex items-center justify-center py-12 px-5">
      <div className="w-full max-w-lg">
        {/* Progress */}
        <div className="flex items-center justify-between mb-8">
          {steps.map(({ n, label }, i) => (
            <div key={n} className="flex items-center">
              <div className={`flex items-center gap-2 ${step === n ? 'text-forest' : step > n ? 'text-emerald-brand' : 'text-gray-400'}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center font-semibold text-sm border-2 transition-colors ${step > n ? 'bg-emerald-brand border-emerald-brand text-white' : step === n ? 'border-forest text-forest' : 'border-gray-200 text-gray-400'}`}>
                  {step > n ? <CheckCircle2 className="w-4 h-4" /> : n}
                </div>
                <span className="text-sm font-medium hidden sm:block">{label}</span>
              </div>
              {i < steps.length - 1 && <div className={`w-10 h-0.5 mx-3 ${step > n ? 'bg-emerald-brand' : 'bg-gray-200'}`} />}
            </div>
          ))}
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8">
          {error && <div className="bg-red-50 border border-red-200 text-red-600 text-sm rounded-lg px-4 py-3 mb-5">{error}</div>}

          {step === 1 && (
            <form onSubmit={handleStep1}>
              <h2 className="text-2xl font-bold text-charcoal mb-1">Set up your brokerage</h2>
              <p className="text-sm text-gray-500 mb-7">Tell us about your organisation.</p>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="orgName">Brokerage name *</Label>
                  <Input id="orgName" value={orgName} onChange={(e) => setOrgName(e.target.value)} placeholder="Acme Brokerage Group" required />
                </div>
                <div>
                  <Label htmlFor="orgEmail">Business email</Label>
                  <Input id="orgEmail" type="email" value={orgEmail} onChange={(e) => setOrgEmail(e.target.value)} placeholder="contact@acmebrokerage.com" />
                </div>
                <div>
                  <Label htmlFor="orgPhone">Phone number</Label>
                  <Input id="orgPhone" value={orgPhone} onChange={(e) => setOrgPhone(e.target.value)} placeholder="+1 555 000 0000" />
                </div>
                <div>
                  <Label htmlFor="country">Country</Label>
                  <Input id="country" value={country} onChange={(e) => setCountry(e.target.value)} placeholder="Australia" />
                </div>
                <div>
                  <Label htmlFor="brokerageType">Brokerage type</Label>
                  <select
                    id="brokerageType"
                    value={brokerageType}
                    onChange={(e) => setBrokerageType(e.target.value)}
                    className="input"
                  >
                    <option value="">Select type...</option>
                    <option>Mortgage Brokerage</option>
                    <option>Financial Planning</option>
                    <option>Insurance Brokerage</option>
                    <option>Real Estate</option>
                    <option>Investment Advisory</option>
                    <option>Other</option>
                  </select>
                </div>
              </div>
              <Button type="submit" className="w-full justify-center mt-6">
                Continue <ArrowRight className="w-4 h-4" />
              </Button>
            </form>
          )}

          {step === 2 && (
            <form onSubmit={handleStep2}>
              <h2 className="text-2xl font-bold text-charcoal mb-1">Your profile</h2>
              <p className="text-sm text-gray-500 mb-7">How should your team know you?</p>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="firstName">First name *</Label>
                    <Input id="firstName" value={firstName} onChange={(e) => setFirstName(e.target.value)} placeholder="Alex" required />
                  </div>
                  <div>
                    <Label htmlFor="lastName">Last name *</Label>
                    <Input id="lastName" value={lastName} onChange={(e) => setLastName(e.target.value)} placeholder="Chen" required />
                  </div>
                </div>
                <div>
                  <Label htmlFor="jobTitle">Job title</Label>
                  <Input id="jobTitle" value={jobTitle} onChange={(e) => setJobTitle(e.target.value)} placeholder="Principal Broker" />
                </div>
              </div>
              <div className="flex gap-3 mt-6">
                <Button variant="ghost" type="button" onClick={() => setStep(1)} className="flex-1 justify-center">Back</Button>
                <Button type="submit" className="flex-1 justify-center">Continue <ArrowRight className="w-4 h-4" /></Button>
              </div>
            </form>
          )}

          {step === 3 && (
            <div className="text-center">
              <div className="w-16 h-16 rounded-full bg-mint flex items-center justify-center mx-auto mb-5">
                <CheckCircle2 className="w-8 h-8 text-forest" />
              </div>
              <h2 className="text-2xl font-bold text-charcoal mb-2">You&apos;re all set!</h2>
              <p className="text-sm text-gray-500 mb-2">
                <strong>{orgName}</strong> is ready. Your workspace is set up with full CRM, pipeline, meetings, documents, and AI Associate.
              </p>
              <p className="text-sm text-gray-400 mb-8">Your 14-day free trial starts now.</p>
              <Button onClick={handleFinish} disabled={loading} className="w-full justify-center">
                {loading ? 'Setting up...' : 'Go to dashboard'}
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
