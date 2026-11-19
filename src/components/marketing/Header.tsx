'use client';
import Link from 'next/link';
import { useState } from 'react';
import { Menu, X } from 'lucide-react';

const navItems = [
  { label: 'Platform', href: '/platform' },
  { label: 'Solutions', href: '/solutions' },
  { label: 'Features', href: '/features' },
  { label: 'Pricing', href: '/pricing' },
];

export function Header() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-line">
      <div className="max-w-6xl mx-auto px-5 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2.5">
          <img src="/logo.svg" alt="Locallndex" className="h-7 w-auto" />
          <span className="font-semibold text-charcoal text-lg tracking-tight">Locallndex</span>
        </Link>

        <nav className="hidden md:flex items-center gap-1">
          {navItems.map(({ label, href }) => (
            <Link
              key={label}
              href={href}
              className="px-4 py-2 text-sm font-medium text-dim hover:text-charcoal hover:bg-surface rounded-lg transition-colors"
            >
              {label}
            </Link>
          ))}
        </nav>

        <div className="hidden md:flex items-center gap-3">
          <Link href="/signin" className="px-4 py-2 text-sm font-medium text-dim hover:text-charcoal transition-colors">
            Log in
          </Link>
          <Link href="/signup" className="px-4 py-2 text-sm font-semibold bg-brand hover:bg-brand-dark text-white rounded-lg transition-colors">
            Get Started
          </Link>
        </div>

        <button
          className="md:hidden p-2 rounded-lg hover:bg-surface transition-colors text-dim"
          onClick={() => setOpen(!open)}
          aria-label="Toggle menu"
        >
          {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {open && (
        <div className="md:hidden border-t border-line bg-white px-5 py-4 space-y-1">
          {navItems.map(({ label, href }) => (
            <Link
              key={label}
              href={href}
              className="block px-3 py-2.5 text-sm text-dim hover:text-charcoal hover:bg-surface rounded-lg"
              onClick={() => setOpen(false)}
            >
              {label}
            </Link>
          ))}
          <div className="pt-3 border-t border-line flex gap-3">
            <Link href="/signin" className="flex-1 text-center py-2.5 text-sm text-dim border border-line rounded-lg" onClick={() => setOpen(false)}>
              Log in
            </Link>
            <Link href="/signup" className="flex-1 text-center py-2.5 text-sm font-semibold bg-brand text-white rounded-lg" onClick={() => setOpen(false)}>
              Get Started
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
