import React, { useState, useEffect, useMemo } from 'react';
import { useLocation } from 'react-router-dom';
import { Bell, Plus, X, Crown, Briefcase, Building2, ChevronDown, Eye, Stethoscope, UserCog } from 'lucide-react';
import { clsx } from 'clsx';
import { useAppStore } from '../../stores/appStore';
import { useSoundEffects } from '../../hooks/useSoundEffects';
import { useAuth } from '../../contexts/AuthContext';
import Button from '../common/Button';
import Card3D from '../common/Card3D';

type ViewMode = 'executive' | 'operations' | 'department' | 'clinical' | 'support';

interface ViewModeConfig {
  id: ViewMode;
  label: string;
  icon: React.ReactNode;
  description: string;
  color: string;
  roles: string[];
}

const allViewModes: ViewModeConfig[] = [
  { id: 'executive', label: 'CEO View', icon: <Crown className="w-4 h-4" />, description: 'Strategic KPIs & financials', color: '#FFD700', roles: ['ceo', 'admin'] },
  { id: 'operations', label: 'Operations', icon: <Briefcase className="w-4 h-4" />, description: 'Daily operations & staff', color: '#00D4AA', roles: ['ceo', 'admin', 'doctor'] },
  { id: 'clinical', label: 'Clinical', icon: <Stethoscope className="w-4 h-4" />, description: 'Patient care & treatments', color: '#FF6B7A', roles: ['ceo', 'doctor', 'nurse'] },
  { id: 'department', label: 'My Department', icon: <Building2 className="w-4 h-4" />, description: 'Department-specific view', color: '#667EEA', roles: ['ceo', 'admin', 'doctor', 'nurse', 'technician'] },
  { id: 'support', label: 'Support', icon: <UserCog className="w-4 h-4" />, description: 'Lab, pharmacy & services', color: '#17A2B8', roles: ['ceo', 'admin', 'technician', 'receptionist'] },
];

const pageTitles: Record<string, string> = {
  '/': 'Dashboard',
  '/schedule': 'Schedule',
  '/staff': 'Staff Directory',
  '/departments': 'Departments',
  '/leave': 'Leave Management',
  '/reports': 'Analytics',
  '/patients': 'Patients',
  '/emergency': 'Emergency',
  '/chat': 'Staff Chat',
  '/integrations': 'System Integrations',
  '/compliance': 'Compliance & Audit',
  '/settings': 'Settings',
};

export const Header: React.FC = () => {
  const location = useLocation();
  const [time, setTime] = useState(new Date());
  const [showViewDropdown, setShowViewDropdown] = useState(false);
  const { user } = useAuth();
  const {
    showNotifications,
    setShowNotifications,
    notifications,
    markNotificationRead,
    dismissNotification,
    soundEnabled,
    openModal,
    addToast,
  } = useAppStore();
  const { playSound } = useSoundEffects();

  // Filter view modes based on user role
  const viewModes = useMemo(() => {
    if (!user) return allViewModes.slice(0, 1);
    return allViewModes.filter(mode => mode.roles.includes(user.role));
  }, [user]);

  // Set default view based on role
  const defaultView = useMemo(() => {
    if (!user) return 'operations';
    switch (user.role) {
      case 'ceo': return 'executive';
      case 'doctor': return 'clinical';
      case 'nurse': return 'clinical';
      case 'technician': return 'support';
      case 'receptionist': return 'support';
      case 'admin': return 'operations';
      default: return 'department';
    }
  }, [user]);

  const [currentView, setCurrentView] = useState<ViewMode>(defaultView);

  useEffect(() => {
    setCurrentView(defaultView);
  }, [defaultView]);

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const unreadCount = notifications.filter((n) => !n.read).length;
  const currentViewData = viewModes.find((v) => v.id === currentView) || viewModes[0];

  const handleViewChange = (view: ViewMode) => {
    if (soundEnabled) playSound('success');
    setCurrentView(view);
    setShowViewDropdown(false);
    const viewData = viewModes.find((v) => v.id === view)!;
    addToast(`Switched to ${viewData.label}`, 'success');
  };

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
        {/* View Mode Toggle */}
        <div className="relative">
          <button
            onClick={() => {
              if (soundEnabled) playSound('click');
              setShowViewDropdown(!showViewDropdown);
            }}
            className="glass-card p-3 px-4 flex items-center gap-3 hover:bg-white/[0.04] transition-colors"
          >
            <div
              className="w-8 h-8 rounded-lg flex items-center justify-center"
              style={{ backgroundColor: `${currentViewData.color}20`, color: currentViewData.color }}
            >
              {currentViewData.icon}
            </div>
            <div className="text-left">
              <div className="text-sm font-medium flex items-center gap-2">
                {currentViewData.label}
                <ChevronDown className={clsx('w-3 h-3 transition-transform', showViewDropdown && 'rotate-180')} />
              </div>
              <div className="text-[10px] text-white/40">{currentViewData.description}</div>
            </div>
          </button>

          {/* View Dropdown */}
          {showViewDropdown && (
            <div className="absolute right-0 top-full mt-2 w-64 glass-card p-2 animate-fade-in-up z-50">
              <div className="flex items-center gap-2 px-3 py-2 mb-2 border-b border-white/10">
                <Eye className="w-4 h-4 text-amc-teal" />
                <span className="text-sm font-medium">Switch View</span>
              </div>
              {viewModes.map((mode) => (
                <button
                  key={mode.id}
                  onClick={() => handleViewChange(mode.id)}
                  className={clsx(
                    'w-full flex items-center gap-3 p-3 rounded-xl transition-colors',
                    currentView === mode.id
                      ? 'bg-white/10'
                      : 'hover:bg-white/5'
                  )}
                >
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center"
                    style={{ backgroundColor: `${mode.color}20`, color: mode.color }}
                  >
                    {mode.icon}
                  </div>
                  <div className="text-left flex-1">
                    <div className="text-sm font-medium">{mode.label}</div>
                    <div className="text-xs text-white/50">{mode.description}</div>
                  </div>
                  {currentView === mode.id && (
                    <div className="w-2 h-2 rounded-full bg-amc-green" />
                  )}
                </button>
              ))}
            </div>
          )}
        </div>

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
