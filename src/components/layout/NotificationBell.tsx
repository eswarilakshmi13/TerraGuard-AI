import { useState, useRef, useEffect } from 'react';
import { Bell, CheckCheck, BellRing, AlertTriangle, OctagonAlert, Info } from 'lucide-react';
import { useAuth } from '@/lib/auth';
import { RiskBadge } from '@/components/ui/RiskBadge';
import type { RiskLevel } from '@/types';

export function NotificationBell() {
  const { notifications, unreadCount, markNotificationRead, markAllRead } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const formatTime = (iso: string) => {
    const date = new Date(iso);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMin = Math.floor(diffMs / 60000);
    if (diffMin < 1) return 'Just now';
    if (diffMin < 60) return `${diffMin}m ago`;
    const diffHr = Math.floor(diffMin / 60);
    if (diffHr < 24) return `${diffHr}h ago`;
    return date.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });
  };

  const getRiskIcon = (level: string) => {
    if (level === 'CRITICAL') return <OctagonAlert className="w-4 h-4 text-red-400" />;
    if (level === 'HIGH') return <AlertTriangle className="w-4 h-4 text-orange-400" />;
    if (level === 'MODERATE') return <AlertTriangle className="w-4 h-4 text-yellow-400" />;
    return <Info className="w-4 h-4 text-green-400" />;
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 rounded-lg hover:bg-ink-800/60 transition-colors"
        aria-label="Notifications"
      >
        <Bell className="w-5 h-5 text-ink-300" />
        {unreadCount > 0 && (
          <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] px-1 flex items-center justify-center rounded-full bg-red-500 text-white text-[10px] font-bold">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 top-full mt-2 w-96 max-w-[calc(100vw-2rem)] card shadow-2xl z-50 animate-fade-in overflow-hidden">
          <div className="flex items-center justify-between px-4 py-3 border-b border-ink-800">
            <div className="flex items-center gap-2">
              <BellRing className="w-4 h-4 text-accent-400" />
              <h3 className="text-sm font-semibold text-ink-100">Notifications</h3>
              {unreadCount > 0 && (
                <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-red-500/15 text-red-400">
                  {unreadCount} new
                </span>
              )}
            </div>
            {unreadCount > 0 && (
              <button
                onClick={markAllRead}
                className="flex items-center gap-1 text-xs text-accent-400 hover:text-accent-300 font-medium"
              >
                <CheckCheck className="w-3.5 h-3.5" />
                Mark all read
              </button>
            )}
          </div>

          <div className="max-h-96 overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <Bell className="w-8 h-8 text-ink-600 mb-2" />
                <p className="text-sm text-ink-500">No notifications yet</p>
                <p className="text-xs text-ink-600 mt-1">Risk alerts will appear here when you log in.</p>
              </div>
            ) : (
              <div className="divide-y divide-ink-800/50">
                {notifications.map((notif) => (
                  <button
                    key={notif.id}
                    onClick={() => {
                      if (!notif.is_read) markNotificationRead(notif.id);
                    }}
                    className={`w-full text-left p-3 hover:bg-ink-800/40 transition-colors ${
                      !notif.is_read ? 'bg-accent-500/5' : ''
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div className="shrink-0 mt-0.5">{getRiskIcon(notif.risk_level)}</div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2 mb-1">
                          <RiskBadge level={notif.risk_level as RiskLevel} size="sm" />
                          <span className="text-[10px] text-ink-500 font-mono shrink-0">
                            {formatTime(notif.created_at)}
                          </span>
                        </div>
                        <p className="text-sm font-medium text-ink-100 mb-1 truncate">{notif.title}</p>
                        <p className="text-xs text-ink-400 leading-relaxed line-clamp-3">{notif.message}</p>
                        <div className="flex items-center gap-2 mt-1.5 text-[10px] text-ink-500">
                          <span className="font-mono">{notif.risk_probability}% risk</span>
                          <span>·</span>
                          <span>{notif.zone_name}</span>
                        </div>
                      </div>
                      {!notif.is_read && (
                        <span className="w-2 h-2 rounded-full bg-accent-400 shrink-0 mt-1.5" />
                      )}
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
