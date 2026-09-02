import { Logo, navItems } from './navConfig';
import { Wifi, WifiOff } from 'lucide-react';
import type { NavItem } from './navConfig';

interface SidebarProps {
  activePage: string;
  onNavigate: (pageId: string) => void;
  isOnline: boolean;
  lastSync: string;
}

export function Sidebar({ activePage, onNavigate, isOnline, lastSync }: SidebarProps) {
  return (
    <aside className="w-64 shrink-0 h-screen sticky top-0 bg-ink-900/80 border-r border-ink-800 flex flex-col">
      <div className="px-4 py-5 border-b border-ink-800">
        <Logo />
      </div>

      <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
        {navItems.map((item: NavItem) => {
          const Icon = item.icon;
          const isActive = activePage === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={`nav-item w-full text-left ${isActive ? 'nav-item-active' : ''}`}
            >
              <Icon className={`w-4.5 h-4.5 shrink-0 ${isActive ? 'text-accent-400' : 'text-ink-400'}`} />
              <span>{item.label}</span>
            </button>
          );
        })}
      </nav>

      <div className="px-3 py-3 border-t border-ink-800 space-y-2">
        <div className="flex items-center gap-2 text-xs text-ink-400">
          {isOnline ? (
            <Wifi className="w-3.5 h-3.5 text-green-400" />
          ) : (
            <WifiOff className="w-3.5 h-3.5 text-orange-400" />
          )}
          <span>{isOnline ? 'Connected' : 'Offline — queued'}</span>
        </div>
        <div className="text-[10px] text-ink-500 font-mono">
          Last sync: {lastSync}
        </div>
      </div>
    </aside>
  );
}
