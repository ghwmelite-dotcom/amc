import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Bell, Plus, X } from 'lucide-react';
import { clsx } from 'clsx';
import { useAppStore } from '../../stores/appStore';
import { useSoundEffects } from '../../hooks/useSoundEffects';
import Button from '../common/Button';
import Card3D from '../common/Card3D';

const pageTitles: Record<string, string> = {
  '/': 'Dashboard',
  '/schedule': 'Schedule',
  '/staff': 'Staff Directory',
  '/departments': 'Departments',
  '/leave': 'Leave Management',
  '/reports': 'Analytics',
  '/patients': 'Patients',
  '/emergency': 'Emergency',
  '/settings': 'Settings',
};

export const Header: React.FC = () => {
  const location = useLocation();
  const [time, setTime] = useState(new Date());
  const {
    showNotifications,
    setShowNotifications,
    notifications,
    markNotificationRead,
    dismissNotification,
    soundEnabled,
    openModal,
  } = useAppStore();
  const { playSound } = useSoundEffects();

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const handleNotificationToggle = () => {
    if (soundEnabled) playSound('click');
    setShowNotifications(!showNotifications);
  };

  const handleQuickAdd = () => {
    if (soundEnabled) playSound('success');
    openModal('quick-add');
  };

  const title = pageTitles[location.pathname] || 'Dashboard';

  return (
    <header className="flex justify-between items-start mb-10">
      {/* Left side */}
      <div className="animate-slide-in">
        <div className="text-xs text-white/40 uppercase tracking-[3px] mb-2">
          Accra Medical Centre
        </div>
        <h1 className="text-4xl font-bold bg-gradient-to-r from-white to-white/70 bg-clip-text text-transparent">
          {title}
        </h1>
        <p className="text-white/50 mt-2 text-sm">
          {time.toLocaleDateString('en-US', {
            weekday: 'long',
            month: 'long',
            day: 'numeric',
            year: 'numeric',
          })}
        </p>
      </div>

      {/* Right side */}
      <div className="flex items-center gap-4">
        {/* Time Display */}
        <div className="glass-card p-4 px-7 flex items-center gap-5">
          <div className="w-12 h-12 rounded-full bg-gradient-to-r from-amc-teal via-amc-blue to-amc-purple p-[2px] animate-spin-slow">
            <div className="w-full h-full rounded-full bg-amc-darker flex items-center justify-center text-base">
              ⏱
            </div>
          </div>
          <div>
            <div className="text-3xl font-bold font-mono tracking-wider gradient-text">
              {time.toLocaleTimeString('en-US', { hour12: false })}
            </div>
            <div className="text-xs text-white/40">GMT+0 • ACCRA</div>
          </div>
        </div>

        {/* Notifications */}
        <div className="relative">
          <button
            onClick={handleNotificationToggle}
            className="w-13 h-13 rounded-2xl glass-card flex items-center justify-center hover:bg-white/[0.04] transition-colors"
          >
            <Bell className="w-5 h-5 text-white" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-gradient-to-r from-amc-red to-amc-pink text-xs font-bold flex items-center justify-center shadow-glow-red animate-pulse">
                {unreadCount}
              </span>
            )}
          </button>

          {/* Notifications Dropdown */}
          {showNotifications && (
            <div className="absolute right-0 top-full mt-2 w-80 glass-card p-4 animate-fade-in-up z-50">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-white">Notifications</h3>
                <button
                  onClick={() => setShowNotifications(false)}
                  className="p-1 rounded-lg hover:bg-white/10"
                >
                  <X className="w-4 h-4 text-white/50" />
                </button>
              </div>
              <div className="space-y-2 max-h-80 overflow-y-auto">
                {notifications.length === 0 ? (
                  <p className="text-white/50 text-sm text-center py-4">
                    No notifications
                  </p>
                ) : (
                  notifications.map((notification) => (
                    <Card3D
                      key={notification.id}
                      intensity={10}
                      onClick={() => markNotificationRead(notification.id)}
                      className={clsx(
                        'p-3 rounded-xl cursor-pointer',
                        notification.type === 'critical' && 'bg-amc-red/10 border border-amc-red/20',
                        notification.type === 'warning' && 'bg-amc-orange/10 border border-amc-orange/20',
                        notification.type === 'info' && 'bg-amc-blue/10 border border-amc-blue/20',
                        notification.type === 'success' && 'bg-amc-green/10 border border-amc-green/20',
                        !notification.read && 'ring-1 ring-white/10'
                      )}
                    >
                      <div className="flex gap-3">
                        <span className="text-xl">{notification.icon}</span>
                        <div className="flex-1 min-w-0">
                          <div className="font-medium text-sm text-white">
                            {notification.title}
                          </div>
                          <div className="text-xs text-white/50 truncate">
                            {notification.description}
                          </div>
                        </div>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            dismissNotification(notification.id);
                          }}
                          className="p-1 rounded hover:bg-white/10"
                        >
                          <X className="w-3 h-3 text-white/40" />
                        </button>
                      </div>
                    </Card3D>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        {/* Quick Add */}
        <Button onClick={handleQuickAdd} icon={<Plus className="w-4 h-4" />}>
          Quick Add
        </Button>
      </div>
    </header>
  );
};

export default Header;
