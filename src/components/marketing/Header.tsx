'use client';
import Link from 'next/link';
import { useState } from 'react';
import { Menu, X } from 'lucide-react';

export function Header() {
  const [open, setOpen] = useState(false);
  return (
    <header className="sticky top-0 z-50 bg-forest text-white">
      <div className="max-w-7xl mx-auto px-5 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-md bg-emerald-brand flex items-center justify-center">
            <span className="text-white font-bold text-sm">B</span>
          </div>
          <span className="font-playfair font-semibold text-lg">BrokerBrief</span>
        </Link>

        <nav className="hidden md:flex items-center gap-1">
          {['Platform', 'Solutions', 'Features', 'Pricing'].map((item) => (
            <Link
              key={item}
              href={item === 'Pricing' ? '/pricing' : '#'}
              className="px-4 py-2 text-sm font-medium text-white/80 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
            >
              {item}
            </Link>
          ))}
        </nav>

        <div className="hidden md:flex items-center gap-3">
          <Link href="/signin" className="px-4 py-2 text-sm font-medium text-white/80 hover:text-white transition-colors">
            Log in
          </Link>
          <Link href="/signup" className="px-4 py-2 text-sm font-semibold bg-emerald-brand hover:bg-[#068a58] text-white rounded-lg transition-colors">
            Get Started
          </Link>
        </div>

        <button className="md:hidden p-2 rounded-lg hover:bg-white/10 transition-colors" onClick={() => setOpen(!open)}>
          {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {open && (
        <div className="md:hidden border-t border-white/10 bg-forest px-5 py-4 space-y-1">
          {['Platform', 'Solutions', 'Features', 'Pricing'].map((item) => (
            <Link key={item} href={item === 'Pricing' ? '/pricing' : '#'} className="block px-3 py-2.5 text-sm text-white/80 hover:text-white rounded-lg" onClick={() => setOpen(false)}>
              {item}
            </Link>
          ))}
          <div className="pt-3 border-t border-white/10 flex gap-3">
            <Link href="/signin" className="flex-1 text-center py-2 text-sm text-white/80 border border-white/20 rounded-lg" onClick={() => setOpen(false)}>Log in</Link>
            <Link href="/signup" className="flex-1 text-center py-2 text-sm font-semibold bg-emerald-brand text-white rounded-lg" onClick={() => setOpen(false)}>Get Started</Link>
          </div>
        </div>
      )}
    </header>
  );
}
