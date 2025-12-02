import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
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
  Settings,
  Link2,
  Shield,
  LogOut,
  MessageSquare,
  Bot,
} from 'lucide-react';
import { useAppStore } from '../../stores/appStore';
import { useSoundEffects } from '../../hooks/useSoundEffects';
import { useAuth } from '../../contexts/AuthContext';
import Avatar from '../common/Avatar';
import { UserPermissions } from '../../types';

interface NavItem {
  id: string;
  icon: React.FC<{ className?: string; style?: React.CSSProperties }>;
  label: string;
  color: string;
  path: string;
  permission?: keyof UserPermissions;
}

const navItems: NavItem[] = [
  { id: 'dashboard', icon: LayoutDashboard, label: 'Dashboard', color: '#00D4AA', path: '/', permission: 'canViewDashboard' },
  { id: 'ai-assistant', icon: Bot, label: 'AI Assistant', color: '#A855F7', path: '/ai-chat' },
  { id: 'schedule', icon: Calendar, label: 'Schedule', color: '#0066FF', path: '/schedule', permission: 'canViewSchedule' },
  { id: 'staff', icon: Users, label: 'Staff', color: '#667EEA', path: '/staff', permission: 'canViewAllStaff' },
  { id: 'departments', icon: Building2, label: 'Departments', color: '#FF6B35', path: '/departments' },
  { id: 'leave', icon: CalendarOff, label: 'Leave', color: '#FFB020', path: '/leave', permission: 'canViewSchedule' },
  { id: 'reports', icon: BarChart3, label: 'Analytics', color: '#00D26A', path: '/reports', permission: 'canViewReports' },
  { id: 'patients', icon: UserPlus, label: 'Patients', color: '#FF6B7A', path: '/patients', permission: 'canViewPatients' },
  { id: 'emergency', icon: AlertTriangle, label: 'Emergency', color: '#FF4757', path: '/emergency', permission: 'canViewEmergency' },
  { id: 'chat', icon: MessageSquare, label: 'Staff Chat', color: '#00CED1', path: '/chat', permission: 'canViewChat' },
  { id: 'integrations', icon: Link2, label: 'Integrations', color: '#17A2B8', path: '/integrations', permission: 'canViewIntegrations' },
  { id: 'compliance', icon: Shield, label: 'Compliance', color: '#8B5CF6', path: '/compliance', permission: 'canViewCompliance' },
  { id: 'settings', icon: Settings, label: 'Settings', color: '#9B59B6', path: '/settings' },
];

const roleLabels: Record<string, string> = {
  ceo: 'CEO',
  doctor: 'Doctor',
  nurse: 'Nurse',
  technician: 'Technician',
  admin: 'Administrator',
  receptionist: 'Receptionist',
};

export const Sidebar: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { sidebarExpanded, setSidebarExpanded, soundEnabled } = useAppStore();
  const { playSound } = useSoundEffects();
  const { user, logout, hasPermission } = useAuth();

  const handleMouseEnter = () => {
    setSidebarExpanded(true);
    if (soundEnabled) playSound('hover');
  };

  const handleNavClick = () => {
    if (soundEnabled) playSound('whoosh');
  };

  const handleLogout = () => {
    if (soundEnabled) playSound('click');
    logout();
    navigate('/login');
  };

  // Filter nav items based on user permissions
  const filteredNavItems = navItems.filter(item => {
    if (!item.permission) return true;
    return hasPermission(item.permission);
  });

  const staffType = user?.role === 'ceo' ? 'doctor' :
                    user?.role === 'technician' ? 'tech' :
                    user?.role === 'receptionist' ? 'admin' :
                    user?.role || 'admin';

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
      <nav className="flex-1 flex flex-col gap-2 overflow-y-auto custom-scrollbar">
        {filteredNavItems.map((item) => {
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
      <div className="mt-4 space-y-2">
        <div className={clsx(
          'flex items-center gap-3 rounded-2xl transition-all duration-300',
          sidebarExpanded ? 'p-4 bg-white/[0.03]' : 'justify-center'
        )}>
          <Avatar
            name={user?.name || 'User'}
            initials={user?.avatar || 'U'}
            type={staffType as 'doctor' | 'nurse' | 'tech' | 'admin'}
            size="md"
          />
          {sidebarExpanded && user && (
            <div className="animate-fade-in flex-1 min-w-0">
              <div className="font-semibold text-sm text-white truncate">
                {user.name.split(' ').slice(0, 2).join(' ')}
              </div>
              <div className="text-xs text-white/50">{roleLabels[user.role] || user.role}</div>
            </div>
          )}
        </div>

        {/* Logout Button */}
        <button
          onClick={handleLogout}
          className={clsx(
            'flex items-center gap-3 rounded-2xl transition-all duration-300 w-full',
            sidebarExpanded ? 'px-4 py-3' : 'p-3 justify-center',
            'text-white/40 hover:text-amc-red hover:bg-amc-red/10'
          )}
        >
          <LogOut className="w-5 h-5 flex-shrink-0" />
          {sidebarExpanded && (
            <span className="text-sm font-medium animate-fade-in">Sign Out</span>
          )}
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
