import { Activity, Clock, MapPin, LogOut, User as UserIcon } from 'lucide-react';
import { NotificationBell } from './NotificationBell';
import { useAuth } from '@/lib/auth';

interface HeaderProps {
  title: string;
  subtitle: string;
  lastUpdate: string;
}

export function Header({ title, subtitle, lastUpdate }: HeaderProps) {
  const { profile, signOut } = useAuth();

  return (
    <header className="px-6 py-4 border-b border-ink-800 bg-ink-900/40 backdrop-blur-sm">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-xl font-bold text-ink-50 tracking-tight">{title}</h1>
          <p className="text-sm text-ink-400 mt-0.5">{subtitle}</p>
        </div>
        <div className="flex items-center gap-5 text-xs">
          <div className="flex items-center gap-2 text-ink-300">
            <span className="relative flex h-2 w-2">
              <span className="animate-pulse-ring absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500" />
            </span>
            <span className="font-medium">Monitoring Active</span>
          </div>
          <div className="flex items-center gap-1.5 text-ink-400">
            <Clock className="w-3.5 h-3.5" />
            <span className="font-mono">{lastUpdate}</span>
          </div>
          <div className="flex items-center gap-1.5 text-ink-400">
            <MapPin className="w-3.5 h-3.5" />
            <span>NER — India</span>
          </div>

          <div className="h-5 w-px bg-ink-700" />

          <NotificationBell />

          {profile && (
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg bg-ink-800/60 border border-ink-700">
                <div className="w-6 h-6 rounded-full bg-accent-500/20 flex items-center justify-center">
                  <UserIcon className="w-3.5 h-3.5 text-accent-400" />
                </div>
                <div className="flex flex-col leading-none">
                  <span className="text-xs font-medium text-ink-100">{profile.full_name ?? 'User'}</span>
                  <span className="text-[10px] text-ink-500">{profile.role}</span>
                </div>
              </div>
              <button
                onClick={signOut}
                className="p-1.5 rounded-lg hover:bg-ink-800/60 transition-colors"
                title="Sign out"
              >
                <LogOut className="w-4 h-4 text-ink-400 hover:text-red-400" />
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
