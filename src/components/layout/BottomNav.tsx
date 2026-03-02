import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Search, Plus, BookTemplate, Settings } from 'lucide-react';

export function BottomNav() {
  const navItems = [
    { to: '/vault', label: 'Home', icon: LayoutDashboard, exact: true },
    { to: '/vault/search', label: 'Search', icon: Search },
    { to: '/vault/new', label: 'New', icon: Plus, accent: true },
    { to: '/vault/templates', label: 'Templates', icon: BookTemplate },
    { to: '/vault/settings', label: 'Settings', icon: Settings },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 flex items-center justify-around border-t border-border bg-black/95 backdrop-blur-md px-2 pb-safe pt-2 sm:hidden">
      {navItems.map(({ to, label, icon: Icon, exact, accent }) => (
        <NavLink
          key={to}
          to={to}
          end={exact}
          className={({ isActive }) => [
            'flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-xl transition-all text-[10px] font-medium',
            accent
              ? isActive
                ? 'text-black bg-accent'
                : 'text-accent bg-accent/10 border border-accent/30'
              : isActive
                ? 'text-accent'
                : 'text-text-dim hover:text-text-muted',
          ].join(' ')}
        >
          <Icon size={18} />
          {label}
        </NavLink>
      ))}
    </nav>
  );
}
