import { Bell } from 'lucide-react';

interface TopBarProps {
  title: string;
  subtitle?: string;
  actions?: React.ReactNode;
}

export function TopBar({ title, subtitle, actions }: TopBarProps) {
  return (
    <div className="flex items-center justify-between py-5 px-6 border-b border-gray-100 bg-white sticky top-0 z-10">
      <div>
        <h1 className="text-xl font-semibold text-charcoal">{title}</h1>
        {subtitle && <p className="text-sm text-gray-500 mt-0.5">{subtitle}</p>}
      </div>
      <div className="flex items-center gap-3">
        {actions}
        <button className="p-2 rounded-lg hover:bg-gray-100 transition-colors text-gray-500">
          <Bell className="w-4.5 h-4.5" />
        </button>
      </div>
    </div>
  );
}
