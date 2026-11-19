'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard, Building2, MapPin, Eye, Target, Star,
  BarChart2, Zap, FileText, CreditCard, Settings, LogOut,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { createClient } from '@/lib/supabase/browser';
import { useRouter } from 'next/navigation';

const nav = [
  { href: '/dashboard', label: 'Overview', icon: LayoutDashboard, exact: true },
  { href: '/business-profiles', label: 'Business Profiles', icon: Building2 },
  { href: '/locations', label: 'Locations', icon: MapPin },
  { href: '/visibility', label: 'Local Visibility', icon: Eye },
  { href: '/competitors', label: 'Competitors', icon: Target },
  { href: '/reviews', label: 'Reviews', icon: Star },
  { href: '/analytics', label: 'Analytics', icon: BarChart2 },
  { href: '/ai-recommendations', label: 'AI Recommendations', icon: Zap },
  { href: '/reports', label: 'Reports', icon: FileText },
  { href: '/billing', label: 'Billing', icon: CreditCard },
  { href: '/settings', label: 'Settings', icon: Settings },
];

interface SidebarProps {
  userEmail?: string | null;
  userFirstName?: string | null;
  userLastName?: string | null;
}

export function Sidebar({ userEmail, userFirstName, userLastName }: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();

  const handleSignOut = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push('/signin');
  };

  const displayName = userFirstName
    ? `${userFirstName}${userLastName ? ' ' + userLastName : ''}`
    : userEmail || 'Account';

  return (
    <aside className="w-60 bg-white border-r border-line flex flex-col h-screen sticky top-0 flex-shrink-0">
      {/* Logo */}
      <div className="px-5 py-5 border-b border-line">
        <Link href="/dashboard" className="flex items-center gap-2.5">
          <img src="/logo.svg" alt="Locallndex" className="h-7 w-auto" />
          <span className="font-bold text-charcoal">Locallndex</span>
        </Link>
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-0.5">
        {nav.map(({ href, label, icon: Icon, exact }) => {
          const active = exact ? pathname === href : (pathname === href || pathname.startsWith(href + '/'));
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors duration-150',
                active ? 'bg-haze text-brand' : 'text-dim hover:bg-surface hover:text-charcoal'
              )}
            >
              <Icon className="w-4 h-4 flex-shrink-0" />
              {label}
            </Link>
          );
        })}
      </nav>

      {/* User footer */}
      <div className="p-3 border-t border-line">
        <div className="flex items-center gap-2.5 px-3 py-2 rounded-lg hover:bg-surface transition-colors">
          <div className="w-7 h-7 rounded-full bg-haze flex items-center justify-center flex-shrink-0">
            <span className="text-xs font-semibold text-brand">
              {displayName.charAt(0).toUpperCase()}
            </span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-medium text-charcoal truncate">{displayName}</p>
          </div>
          <button
            onClick={handleSignOut}
            className="p-1.5 rounded-lg hover:bg-line text-dim hover:text-charcoal transition-colors"
            title="Sign out"
          >
            <LogOut className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </aside>
  );
}
