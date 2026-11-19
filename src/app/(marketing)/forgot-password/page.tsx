'use client';
import { useState } from 'react';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/browser';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Label } from '@/components/ui/Label';
import { Mail } from 'lucide-react';

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
    <div className="min-h-[calc(100vh-64px)] flex items-center justify-center py-12 px-5 bg-surface">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl border border-line p-10">
          <div className="flex justify-center mb-7">
            <div className="flex items-center gap-2.5">
              <img src="/logo.svg" alt="Locallndex" className="h-8 w-auto" />
              <span className="font-bold text-charcoal text-xl">Locallndex</span>
            </div>
          </div>
          <h1 className="text-2xl font-bold text-charcoal mb-2 text-center">Reset your password</h1>

          {sent ? (
            <div className="text-center mt-4">
              <div className="w-14 h-14 rounded-full bg-haze flex items-center justify-center mx-auto mb-5">
                <Mail className="w-7 h-7 text-brand" />
              </div>
              <p className="text-sm text-dim mb-6">
                We sent a password reset link to <strong className="text-charcoal">{email}</strong>. Check your inbox.
              </p>
              <Link href="/signin" className="text-sm text-brand hover:underline">Back to log in</Link>
            </div>
          ) : (
            <>
              <p className="text-sm text-dim text-center mb-7">
                Enter your email and we will send you a reset link.
              </p>
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-600 text-sm rounded-lg px-4 py-3 mb-5">{error}</div>
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
                <Button type="submit" className="w-full justify-center" disabled={loading}>
                  {loading ? 'Sending...' : 'Send reset link'}
                </Button>
              </form>
              <p className="text-sm text-center text-dim mt-5">
                <Link href="/signin" className="text-brand hover:underline">Back to log in</Link>
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
