import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LogIn, User, Shield, Stethoscope, HeartPulse, FlaskConical, UserCog } from 'lucide-react';
import { clsx } from 'clsx';
import { useAuth } from '../contexts/AuthContext';
import { Staff } from '../types';
import ParticleSystem from '../components/effects/ParticleSystem';
import MorphingShapes from '../components/effects/MorphingShapes';
import GridPattern from '../components/effects/GridPattern';

const roleIcons: Record<string, React.ReactNode> = {
  doctor: <Stethoscope className="w-5 h-5" />,
  nurse: <HeartPulse className="w-5 h-5" />,
  tech: <FlaskConical className="w-5 h-5" />,
  admin: <UserCog className="w-5 h-5" />,
};

const roleColors: Record<string, string> = {
  doctor: '#00D4AA',
  nurse: '#FF6B7A',
  tech: '#667EEA',
  admin: '#FFB020',
};

const getRoleBadge = (staff: Staff) => {
  if (staff.role.toLowerCase().includes('ceo')) {
    return { label: 'CEO', color: '#FFD700', icon: <Shield className="w-4 h-4" /> };
  }
  return {
    label: staff.type.charAt(0).toUpperCase() + staff.type.slice(1),
    color: roleColors[staff.type] || '#667EEA',
    icon: roleIcons[staff.type] || <User className="w-4 h-4" />,
  };
};

export const Login: React.FC = () => {
  const navigate = useNavigate();
  const { login, availableUsers, isLoading } = useAuth();
  const [selectedUser, setSelectedUser] = useState<string | null>(null);
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async () => {
    if (!selectedUser) {
      setError('Please select a user to continue');
      return;
    }

    setIsLoggingIn(true);
    setError(null);

    const success = await login(selectedUser);
    if (success) {
      navigate('/');
    } else {
      setError('Failed to login. Please try again.');
    }
    setIsLoggingIn(false);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-amc-dark flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-2 border-amc-teal border-t-transparent rounded-full" />
      </div>
    );
  }

  // Group users by type
  const groupedUsers = availableUsers.reduce((acc, user) => {
    const type = user.type;
    if (!acc[type]) acc[type] = [];
    acc[type].push(user);
    return acc;
  }, {} as Record<string, Staff[]>);

  const typeOrder = ['doctor', 'nurse', 'tech', 'admin'];
  const typeLabels: Record<string, string> = {
    doctor: 'Doctors',
    nurse: 'Nurses',
    tech: 'Technicians',
    admin: 'Administrative',
  };

  return (
    <div className="min-h-screen bg-amc-dark relative overflow-hidden flex items-center justify-center p-4">
      {/* Background Effects */}
      <div className="fixed inset-0 pointer-events-none">
        <GridPattern />
        <MorphingShapes />
        <ParticleSystem />
      </div>

      {/* Main Login Card */}
      <div className="relative z-10 w-full max-w-4xl">
        {/* Header */}
        <div className="text-center mb-8 animate-slide-in">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-gradient-to-br from-amc-teal via-amc-blue to-amc-purple mb-6 animate-logo-glow">
            <span className="text-4xl font-extrabold text-white">A</span>
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-white to-white/70 bg-clip-text text-transparent mb-2">
            Accra Medical Centre
          </h1>
          <p className="text-white/50 text-lg">Staff Management Portal</p>
        </div>

        {/* Login Card */}
        <div className="glass-card p-8 animate-fade-in-up">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-amc-teal/20 flex items-center justify-center">
              <LogIn className="w-5 h-5 text-amc-teal" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-white">Sign In</h2>
              <p className="text-sm text-white/50">Select your profile to continue</p>
            </div>
          </div>

          {error && (
            <div className="mb-6 p-4 rounded-xl bg-amc-red/10 border border-amc-red/20 text-amc-red text-sm">
              {error}
            </div>
          )}

          {/* User Selection Grid */}
          <div className="space-y-6 max-h-[50vh] overflow-y-auto pr-2 custom-scrollbar">
            {typeOrder.map(type => {
              const users = groupedUsers[type];
              if (!users || users.length === 0) return null;

              return (
                <div key={type}>
                  <h3 className="text-sm font-medium text-white/60 uppercase tracking-wider mb-3 flex items-center gap-2">
                    <span
                      className="w-2 h-2 rounded-full"
                      style={{ backgroundColor: roleColors[type] }}
                    />
                    {typeLabels[type]}
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {users.map(user => {
                      const badge = getRoleBadge(user);
                      const isSelected = selectedUser === user.id;

                      return (
                        <button
                          key={user.id}
                          onClick={() => setSelectedUser(user.id)}
                          className={clsx(
                            'relative flex items-center gap-4 p-4 rounded-2xl transition-all duration-300 text-left',
                            'border-2',
                            isSelected
                              ? 'bg-white/10 border-amc-teal shadow-glow-teal'
                              : 'bg-white/[0.02] border-white/[0.06] hover:bg-white/[0.05] hover:border-white/10'
                          )}
                        >
                          {/* Avatar */}
                          <div
                            className={clsx(
                              'w-12 h-12 rounded-xl flex items-center justify-center text-white font-bold text-lg',
                              'bg-gradient-to-br',
                              type === 'doctor' && 'from-amc-teal to-amc-blue',
                              type === 'nurse' && 'from-amc-pink to-amc-red',
                              type === 'tech' && 'from-amc-purple to-amc-blue',
                              type === 'admin' && 'from-amc-orange to-amc-yellow'
                            )}
                          >
                            {user.avatar}
                          </div>

                          {/* Info */}
                          <div className="flex-1 min-w-0">
                            <div className="font-semibold text-white truncate">{user.name}</div>
                            <div className="text-sm text-white/50 truncate">{user.department}</div>
                          </div>

                          {/* Role Badge */}
                          <div
                            className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium"
                            style={{
                              backgroundColor: `${badge.color}20`,
                              color: badge.color,
                            }}
                          >
                            {badge.icon}
                            {badge.label}
                          </div>

                          {/* Selection Indicator */}
                          {isSelected && (
                            <div className="absolute top-2 right-2 w-3 h-3 rounded-full bg-amc-teal animate-pulse" />
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Login Button */}
          <button
            onClick={handleLogin}
            disabled={!selectedUser || isLoggingIn}
            className={clsx(
              'w-full mt-8 py-4 rounded-2xl font-semibold text-lg transition-all duration-300',
              'flex items-center justify-center gap-3',
              selectedUser && !isLoggingIn
                ? 'bg-gradient-to-r from-amc-teal to-amc-blue text-white hover:shadow-glow-teal cursor-pointer'
                : 'bg-white/10 text-white/30 cursor-not-allowed'
            )}
          >
            {isLoggingIn ? (
              <>
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Signing in...
              </>
            ) : (
              <>
                <LogIn className="w-5 h-5" />
                Continue to Dashboard
              </>
            )}
          </button>

          {/* Footer */}
          <p className="text-center text-white/30 text-sm mt-6">
            Demo Mode - Select any user to explore role-based features
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
