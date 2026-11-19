'use client';
import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/browser';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Label } from '@/components/ui/Label';

export default function SignInPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
      setError('Authentication is not configured. Please contact support.');
      setLoading(false);
      return;
    }

    try {
      const supabase = createClient();
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) {
        setError(error.message);
      } else {
        router.refresh();
        router.push('/dashboard');
      }
    } catch {
      setError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

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
          <h1 className="text-2xl font-bold text-charcoal mb-1 text-center">Welcome back</h1>
          <p className="text-sm text-dim text-center mb-7">Log in to your Locallyndex account</p>

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
              <div className="flex justify-between items-center mb-1.5">
                <Label htmlFor="password">Password</Label>
                <Link href="/forgot-password" className="text-xs text-brand hover:underline">Forgot password?</Link>
              </div>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                required
              />
            </div>
            <Button type="submit" className="w-full justify-center mt-2" disabled={loading}>
              {loading ? 'Logging in...' : 'Log in'}
            </Button>
          </form>

          <p className="text-sm text-center text-dim mt-6">
            Don&apos;t have an account?{' '}
            <Link href="/signup" className="text-brand hover:underline font-medium">Create account</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
