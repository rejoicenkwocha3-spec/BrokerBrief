'use client';
import { useState } from 'react';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/browser';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Label } from '@/components/ui/Label';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    const supabase = createClient();
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth/callback?next=/settings`,
    });
    if (error) {
      setError(error.message);
      setLoading(false);
    } else {
      setSent(true);
    }
  };

  return (
    <div className="min-h-[calc(100vh-64px)] flex items-center justify-center py-12 px-5">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8">
          <h1 className="text-2xl font-bold text-charcoal mb-2 text-center">Reset your password</h1>

          {sent ? (
            <div className="text-center">
              <div className="w-14 h-14 rounded-full bg-mint flex items-center justify-center mx-auto mb-4 mt-4">
                <span className="text-2xl">✉️</span>
              </div>
              <p className="text-sm text-gray-600 mb-6">We&apos;ve sent a password reset link to <strong>{email}</strong>. Check your inbox.</p>
              <Link href="/signin" className="text-sm text-emerald-brand hover:underline">Back to sign in</Link>
            </div>
          ) : (
            <>
              <p className="text-sm text-gray-500 text-center mb-7">Enter your email and we&apos;ll send you a reset link.</p>
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-600 text-sm rounded-lg px-4 py-3 mb-5">{error}</div>
              )}
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="email">Email address</Label>
                  <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@brokeragegroup.com" required />
                </div>
                <Button type="submit" className="w-full justify-center" disabled={loading}>
                  {loading ? 'Sending...' : 'Send reset link'}
                </Button>
              </form>
              <p className="text-sm text-center text-gray-500 mt-5">
                <Link href="/signin" className="text-emerald-brand hover:underline">Back to sign in</Link>
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
