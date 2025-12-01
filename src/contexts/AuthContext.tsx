import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { AuthUser, UserRole, UserPermissions, Staff } from '../types';
import { staffData } from '../data/mockData';

// Role-based permissions matrix
const rolePermissions: Record<UserRole, UserPermissions> = {
  ceo: {
    canViewDashboard: true,
    canViewAllStaff: true,
    canManageStaff: true,
    canViewPatients: true,
    canManagePatients: true,
    canViewSchedule: true,
    canManageSchedule: true,
    canApproveLeave: true,
    canViewReports: true,
    canViewEmergency: true,
    canManageEmergency: true,
    canViewCompliance: true,
    canManageCompliance: true,
    canViewIntegrations: true,
    canManageIntegrations: true,
    canViewChat: true,
    canAccessAdminSettings: true,
  },
  doctor: {
    canViewDashboard: true,
    canViewAllStaff: true,
    canManageStaff: false,
    canViewPatients: true,
    canManagePatients: true,
    canViewSchedule: true,
    canManageSchedule: false,
    canApproveLeave: false,
    canViewReports: true,
    canViewEmergency: true,
    canManageEmergency: true,
    canViewCompliance: true,
    canManageCompliance: false,
    canViewIntegrations: false,
    canManageIntegrations: false,
    canViewChat: true,
    canAccessAdminSettings: false,
  },
  nurse: {
    canViewDashboard: true,
    canViewAllStaff: true,
    canManageStaff: false,
    canViewPatients: true,
    canManagePatients: true,
    canViewSchedule: true,
    canManageSchedule: false,
    canApproveLeave: false,
    canViewReports: false,
    canViewEmergency: true,
    canManageEmergency: true,
    canViewCompliance: false,
    canManageCompliance: false,
    canViewIntegrations: false,
    canManageIntegrations: false,
    canViewChat: true,
    canAccessAdminSettings: false,
  },
  technician: {
    canViewDashboard: true,
    canViewAllStaff: true,
    canManageStaff: false,
    canViewPatients: true,
    canManagePatients: false,
    canViewSchedule: true,
    canManageSchedule: false,
    canApproveLeave: false,
    canViewReports: false,
    canViewEmergency: false,
    canManageEmergency: false,
    canViewCompliance: false,
    canManageCompliance: false,
    canViewIntegrations: true,
    canManageIntegrations: false,
    canViewChat: true,
    canAccessAdminSettings: false,
  },
  admin: {
    canViewDashboard: true,
    canViewAllStaff: true,
    canManageStaff: true,
    canViewPatients: true,
    canManagePatients: true,
    canViewSchedule: true,
    canManageSchedule: true,
    canApproveLeave: true,
    canViewReports: true,
    canViewEmergency: true,
    canManageEmergency: false,
    canViewCompliance: true,
    canManageCompliance: true,
    canViewIntegrations: true,
    canManageIntegrations: true,
    canViewChat: true,
    canAccessAdminSettings: true,
  },
  receptionist: {
    canViewDashboard: true,
    canViewAllStaff: true,
    canManageStaff: false,
    canViewPatients: true,
    canManagePatients: true,
    canViewSchedule: true,
    canManageSchedule: false,
    canApproveLeave: false,
    canViewReports: false,
    canViewEmergency: false,
    canManageEmergency: false,
    canViewCompliance: false,
    canManageCompliance: false,
    canViewIntegrations: false,
    canManageIntegrations: false,
    canViewChat: true,
    canAccessAdminSettings: false,
  },
};

// Map staff types to user roles
const staffTypeToRole: Record<string, UserRole> = {
  doctor: 'doctor',
  nurse: 'nurse',
  tech: 'technician',
  admin: 'admin',
};

// Get role from staff - special case for CEO
function getRoleFromStaff(staff: Staff): UserRole {
  if (staff.role.toLowerCase().includes('ceo') || staff.role.toLowerCase().includes('consultant')) {
    if (staff.department === 'Administration') return 'ceo';
  }
  if (staff.role.toLowerCase().includes('receptionist')) {
    return 'receptionist';
  }
  return staffTypeToRole[staff.type] || 'admin';
}

interface AuthContextType {
  user: AuthUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (staffId: string) => Promise<boolean>;
  logout: () => void;
  hasPermission: (permission: keyof UserPermissions) => boolean;
  availableUsers: Staff[];
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const AUTH_STORAGE_KEY = 'amc_auth_user';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Load user from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem(AUTH_STORAGE_KEY);
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        setUser(parsed);
      } catch {
        localStorage.removeItem(AUTH_STORAGE_KEY);
      }
    }
    setIsLoading(false);
  }, []);

  const login = useCallback(async (staffId: string): Promise<boolean> => {
    const staff = staffData.find(s => s.id === staffId);
    if (!staff) return false;

    const role = getRoleFromStaff(staff);
    const authUser: AuthUser = {
      id: `auth_${staff.id}`,
      staffId: staff.id,
      name: staff.name,
      email: staff.email,
      role,
      department: staff.department,
      avatar: staff.avatar,
      permissions: rolePermissions[role],
    };

    setUser(authUser);
    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(authUser));
    return true;
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    localStorage.removeItem(AUTH_STORAGE_KEY);
  }, []);

  const hasPermission = useCallback((permission: keyof UserPermissions): boolean => {
    if (!user) return false;
    return user.permissions[permission];
  }, [user]);

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        logout,
        hasPermission,
        availableUsers: staffData,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

export { rolePermissions };
