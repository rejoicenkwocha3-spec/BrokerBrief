'use client';
import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/browser';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Label } from '@/components/ui/Label';
import { Mail } from 'lucide-react';

export default function SignUpPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [checkEmail, setCheckEmail] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirm) { setError('Passwords do not match'); return; }
    if (password.length < 8) { setError('Password must be at least 8 characters'); return; }
    setLoading(true);
    setError('');

    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
      setError('Authentication is not configured. Please contact support.');
      setLoading(false);
      return;
    }

    try {
      const supabase = createClient();
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: { emailRedirectTo: `${window.location.origin}/auth/callback?next=/onboarding` },
      });
      if (error) {
        setError(error.message);
      } else if (data.session) {
        router.refresh();
        router.push('/onboarding');
      } else {
        setCheckEmail(true);
      }
    } catch {
      setError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (checkEmail) {
    return (
      <div className="min-h-[calc(100vh-64px)] flex items-center justify-center py-12 px-5 bg-surface">
        <div className="w-full max-w-md">
          <div className="bg-white rounded-2xl border border-line p-10 text-center">
            <div className="w-14 h-14 rounded-full bg-haze flex items-center justify-center mx-auto mb-5">
              <Mail className="w-7 h-7 text-brand" />
            </div>
            <h1 className="text-2xl font-bold text-charcoal mb-2">Check your email</h1>
            <p className="text-sm text-dim mb-2">We sent a confirmation link to</p>
            <p className="text-sm font-semibold text-charcoal mb-6">{email}</p>
            <p className="text-sm text-dim mb-7">
              Click the link in the email to confirm your account and get started. It may take a minute to arrive.
            </p>
            <Button variant="ghost" className="w-full justify-center" onClick={() => setCheckEmail(false)}>
              Use a different email
            </Button>
            <p className="text-xs text-dim mt-4">
              Already confirmed?{' '}
              <Link href="/signin" className="text-brand hover:underline">Sign in</Link>
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-64px)] flex items-center justify-center py-12 px-5 bg-surface">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl border border-line p-10">
          <div className="flex justify-center mb-7">
            <div className="flex items-center gap-2.5">
              <img src="/logo.svg" alt="Locallyndex" className="h-8 w-auto" />
              <span className="font-bold text-charcoal text-xl">Locallyndex</span>
            </div>
          </div>
          <h1 className="text-2xl font-bold text-charcoal mb-1 text-center">Create your account</h1>
          <p className="text-sm text-dim text-center mb-7">Start improving your local visibility today.</p>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 text-sm rounded-lg px-4 py-3 mb-5">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="email">Email address</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@yourbusiness.com"
                required
              />
            </div>
            <div>
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="At least 8 characters"
                required
              />
            </div>
            <div>
              <Label htmlFor="confirm">Confirm password</Label>
              <Input
                id="confirm"
                type="password"
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                placeholder="Repeat your password"
                required
              />
            </div>
            <Button type="submit" className="w-full justify-center mt-2" disabled={loading}>
              {loading ? 'Creating account...' : 'Create account'}
            </Button>
          </form>

          <p className="text-xs text-center text-dim mt-5">
            By signing up, you agree to our{' '}
            <Link href="#" className="text-brand hover:underline">Terms of Service</Link> and{' '}
            <Link href="#" className="text-brand hover:underline">Privacy Policy</Link>.
          </p>

          <p className="text-sm text-center text-dim mt-4">
            Already have an account?{' '}
            <Link href="/signin" className="text-brand hover:underline font-medium">Log in</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
