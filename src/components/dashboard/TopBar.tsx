interface TopBarProps {
  title: string;
  subtitle?: string;
  actions?: React.ReactNode;
}

export function TopBar({ title, subtitle, actions }: TopBarProps) {
  return (
    <div className="flex items-center justify-between py-5 px-6 border-b border-line bg-white sticky top-0 z-10">
      <div>
        <h1 className="text-lg font-semibold text-charcoal">{title}</h1>
        {subtitle && <p className="text-sm text-dim mt-0.5">{subtitle}</p>}
      </div>
      {actions && (
        <div className="flex items-center gap-3">{actions}</div>
      )}
    </div>
  );
}
