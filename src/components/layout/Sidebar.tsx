import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { clsx } from 'clsx';
import {
  LayoutDashboard,
  Calendar,
  Users,
  Building2,
  CalendarOff,
  BarChart3,
  UserPlus,
  AlertTriangle,
  Settings
} from 'lucide-react';
import { useAppStore } from '../../stores/appStore';
import { useSoundEffects } from '../../hooks/useSoundEffects';
import Avatar from '../common/Avatar';

const navItems = [
  { id: 'dashboard', icon: LayoutDashboard, label: 'Dashboard', color: '#00D4AA', path: '/' },
  { id: 'schedule', icon: Calendar, label: 'Schedule', color: '#0066FF', path: '/schedule' },
  { id: 'staff', icon: Users, label: 'Staff', color: '#667EEA', path: '/staff' },
  { id: 'departments', icon: Building2, label: 'Departments', color: '#FF6B35', path: '/departments' },
  { id: 'leave', icon: CalendarOff, label: 'Leave', color: '#FFB020', path: '/leave' },
  { id: 'reports', icon: BarChart3, label: 'Analytics', color: '#00D26A', path: '/reports' },
  { id: 'patients', icon: UserPlus, label: 'Patients', color: '#FF6B7A', path: '/patients' },
  { id: 'emergency', icon: AlertTriangle, label: 'Emergency', color: '#FF4757', path: '/emergency' },
  { id: 'settings', icon: Settings, label: 'Settings', color: '#9B59B6', path: '/settings' },
];

export const Sidebar: React.FC = () => {
  const location = useLocation();
  const { sidebarExpanded, setSidebarExpanded, soundEnabled } = useAppStore();
  const { playSound } = useSoundEffects();

  const handleMouseEnter = () => {
    setSidebarExpanded(true);
    if (soundEnabled) playSound('hover');
  };

  const handleNavClick = () => {
    if (soundEnabled) playSound('whoosh');
  };

  return (
    <aside
      onMouseEnter={handleMouseEnter}
      onMouseLeave={() => setSidebarExpanded(false)}
      className={clsx(
        'fixed left-0 top-0 h-screen z-50 flex flex-col py-6 px-4 transition-all duration-300 ease-out',
        'bg-gradient-to-b from-white/[0.05] to-white/[0.02] backdrop-blur-xl border-r border-white/[0.06]',
        sidebarExpanded ? 'w-60' : 'w-[88px]'
      )}
    >
      {/* Logo */}
      <div className={clsx(
        'flex items-center gap-3.5 mb-10',
        sidebarExpanded ? 'px-2' : 'justify-center'
      )}>
        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-amc-teal via-amc-blue to-amc-purple flex items-center justify-center flex-shrink-0 animate-logo-glow">
          <span className="text-2xl font-extrabold text-white">A</span>
        </div>
        {sidebarExpanded && (
          <div className="animate-fade-in">
            <div className="font-bold text-lg text-white">AMC</div>
            <div className="text-xs text-white/50">Scheduler</div>
          </div>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 flex flex-col gap-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;

          return (
            <Link
              key={item.id}
              to={item.path}
              onClick={handleNavClick}
              className={clsx(
                'relative flex items-center gap-3.5 rounded-2xl transition-all duration-300',
                sidebarExpanded ? 'px-4 py-3.5' : 'p-3.5 justify-center',
                isActive
                  ? 'text-white'
                  : 'text-white/40 hover:text-white/70 hover:bg-white/[0.03]'
              )}
              style={{
                background: isActive ? `linear-gradient(135deg, ${item.color}30, ${item.color}15)` : undefined,
              }}
            >
              {isActive && (
                <div
                  className="absolute left-0 w-1 h-6 rounded-r-full"
                  style={{
                    background: `linear-gradient(180deg, ${item.color}, ${item.color}80)`,
                    boxShadow: `0 0 20px ${item.color}`,
                  }}
                />
              )}
              <Icon
                className="w-5 h-5 flex-shrink-0"
                style={{ color: isActive ? item.color : undefined }}
              />
              {sidebarExpanded && (
                <span className="text-sm font-medium animate-fade-in">{item.label}</span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* User */}
      <div className={clsx(
        'flex items-center gap-3 rounded-2xl transition-all duration-300',
        sidebarExpanded ? 'p-4 bg-white/[0.03]' : 'justify-center'
      )}>
        <Avatar
          name="Dr. Cynthia Opoku-Akoto"
          initials="CO"
          type="doctor"
          size="md"
        />
        {sidebarExpanded && (
          <div className="animate-fade-in">
            <div className="font-semibold text-sm text-white">Dr. Opoku-Akoto</div>
            <div className="text-xs text-white/50">Administrator</div>
          </div>
        )}
      </div>
    </aside>
  );
};

export default Sidebar;
