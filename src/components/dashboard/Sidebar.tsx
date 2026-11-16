'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard, Users, UserPlus, Kanban, Calendar, Sparkles,
  FileText, CheckSquare, BarChart2, UserCheck, Settings2, LogOut,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Avatar } from '@/components/ui/Avatar';
import { createClient } from '@/lib/supabase/browser';
import { useRouter } from 'next/navigation';

const nav = [
  { href: '/dashboard', label: 'Overview', icon: LayoutDashboard },
  { href: '/clients', label: 'Clients', icon: Users },
  { href: '/leads', label: 'Leads', icon: UserPlus },
  { href: '/pipeline', label: 'Pipeline', icon: Kanban },
  { href: '/meetings', label: 'Meetings', icon: Calendar },
  { href: '/ai', label: 'AI Associate', icon: Sparkles, ai: true },
  { href: '/documents', label: 'Documents', icon: FileText },
  { href: '/tasks', label: 'Tasks', icon: CheckSquare },
  { href: '/insights', label: 'Insights', icon: BarChart2 },
  { href: '/team', label: 'Team', icon: UserCheck },
  { href: '/settings', label: 'Settings', icon: Settings2 },
];

interface SidebarProps {
  orgName?: string;
  userFirstName?: string | null;
  userLastName?: string | null;
}

export function Sidebar({ orgName, userFirstName, userLastName }: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();

  const handleSignOut = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push('/signin');
  };

  return (
    <aside className="w-60 bg-white border-r border-gray-100 flex flex-col h-screen sticky top-0 flex-shrink-0">
      {/* Logo */}
      <div className="px-5 py-5 border-b border-gray-100">
        <div className="flex items-center gap-2.5">
          <img src="/logo.jpg" alt="BrokerBrief" className="h-8 w-8 rounded-md object-cover" />
          <span className="font-playfair font-semibold text-charcoal text-lg">BrokerBrief</span>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-0.5">
        {nav.map(({ href, label, icon: Icon, ai }) => {
          const active = pathname === href || (href !== '/dashboard' && pathname.startsWith(href));
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors duration-150',
                active
                  ? 'bg-mint text-forest'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-charcoal',
                ai && !active && 'text-ai-purple hover:text-ai-purple hover:bg-purple-50'
              )}
            >
              <Icon className={cn('w-4.5 h-4.5 flex-shrink-0', ai && 'text-ai-purple')} />
              {label}
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="p-3 border-t border-gray-100">
        {orgName && (
          <p className="px-3 text-xs text-gray-400 mb-2 truncate font-medium">{orgName}</p>
        )}
        <div className="flex items-center gap-2.5 px-3 py-2">
          <Avatar firstName={userFirstName} lastName={userLastName} size="sm" />
          <div className="flex-1 min-w-0">
            <p className="text-xs font-medium text-charcoal truncate">
              {userFirstName} {userLastName}
            </p>
          </div>
          <button
            onClick={handleSignOut}
            className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors"
            title="Sign out"
          >
            <LogOut className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </aside>
  );
}
