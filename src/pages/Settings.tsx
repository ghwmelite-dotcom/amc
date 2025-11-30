import React from 'react';
import { User, Bell, Volume2, Monitor, Info, Shield, Database, Globe } from 'lucide-react';
import { clsx } from 'clsx';
import Card3D from '../components/common/Card3D';
import Button from '../components/common/Button';
import Avatar from '../components/common/Avatar';
import Badge from '../components/common/Badge';
import { useAppStore } from '../stores/appStore';
import { HOSPITAL_INFO } from '../utils/constants';

const Settings: React.FC = () => {
  const { soundEnabled, setSoundEnabled, addToast } = useAppStore();

  const settingSections = [
    {
      title: 'Notifications',
      icon: Bell,
      color: '#0066FF',
      settings: [
        { id: 'email', label: 'Email Notifications', description: 'Receive updates via email', enabled: true },
        { id: 'push', label: 'Push Notifications', description: 'Browser push notifications', enabled: true },
        { id: 'sms', label: 'SMS Alerts', description: 'Critical alerts via SMS', enabled: false },
      ],
    },
    {
      title: 'Display',
      icon: Monitor,
      color: '#667EEA',
      settings: [
        { id: 'animations', label: 'Animations', description: 'Enable UI animations', enabled: true },
        { id: 'compact', label: 'Compact Mode', description: 'Reduce spacing and padding', enabled: false },
        { id: 'highContrast', label: 'High Contrast', description: 'Increase text visibility', enabled: false },
      ],
    },
    {
      title: 'Privacy & Security',
      icon: Shield,
      color: '#00D26A',
      settings: [
        { id: 'twoFactor', label: 'Two-Factor Auth', description: 'Extra security for your account', enabled: true },
        { id: 'sessions', label: 'Active Sessions', description: 'Manage logged-in devices', enabled: true },
        { id: 'audit', label: 'Audit Log', description: 'Track account activity', enabled: true },
      ],
    },
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-[1fr_400px] gap-6">
        {/* Main Settings */}
        <div className="space-y-6">
          {/* Profile Section */}
          <Card3D intensity={8} className="glass-card p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <User className="w-5 h-5 text-amc-teal" />
                Profile Settings
              </h3>
              <Button
                variant="secondary"
                size="sm"
                onClick={() => addToast('Edit profile coming soon', 'info')}
              >
                Edit Profile
              </Button>
            </div>

            <div className="flex items-start gap-6">
              <Avatar
                name="Dr. Cynthia Opoku-Akoto"
                initials="CO"
                type="doctor"
                size="xl"
              />
              <div className="flex-1 space-y-4">
                <div>
                  <div className="text-xl font-semibold">Dr. Cynthia Opoku-Akoto</div>
                  <div className="text-white/50">CEO / Consultant Physician</div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <div className="text-xs text-white/40 mb-1">Email</div>
                    <div className="text-sm">cynthia@accramedicalcentre.com</div>
                  </div>
                  <div>
                    <div className="text-xs text-white/40 mb-1">Phone</div>
                    <div className="text-sm">+233 24 123 4567</div>
                  </div>
                  <div>
                    <div className="text-xs text-white/40 mb-1">Department</div>
                    <div className="text-sm">Administration</div>
                  </div>
                  <div>
                    <div className="text-xs text-white/40 mb-1">Role</div>
                    <Badge variant="info">Administrator</Badge>
                  </div>
                </div>
              </div>
            </div>
          </Card3D>

          {/* Sound Settings */}
          <Card3D intensity={8} className="glass-card p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-amc-orange/20 flex items-center justify-center">
                  <Volume2 className="w-5 h-5 text-amc-orange" />
                </div>
                <div>
                  <div className="font-semibold">Sound Effects</div>
                  <div className="text-sm text-white/50">Enable UI sound feedback</div>
                </div>
              </div>
              <button
                onClick={() => {
                  setSoundEnabled(!soundEnabled);
                  addToast(`Sound ${!soundEnabled ? 'enabled' : 'disabled'}`, 'info');
                }}
                className={clsx(
                  'w-14 h-8 rounded-full transition-all duration-300 relative',
                  soundEnabled ? 'bg-amc-teal' : 'bg-white/20'
                )}
              >
                <div
                  className={clsx(
                    'absolute top-1 w-6 h-6 rounded-full bg-white transition-all duration-300',
                    soundEnabled ? 'left-7' : 'left-1'
                  )}
                />
              </button>
            </div>
          </Card3D>

          {/* Setting Sections */}
          {settingSections.map((section, i) => {
            const Icon = section.icon;
            return (
              <Card3D
                key={i}
                intensity={8}
                className="glass-card p-6 opacity-0 animate-fade-in-up"
                style={{ animationDelay: `${i * 100}ms`, animationFillMode: 'forwards' }}
              >
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <Icon className="w-5 h-5" style={{ color: section.color }} />
                  {section.title}
                </h3>
                <div className="space-y-4">
                  {section.settings.map((setting) => (
                    <div key={setting.id} className="flex items-center justify-between">
                      <div>
                        <div className="font-medium">{setting.label}</div>
                        <div className="text-sm text-white/50">{setting.description}</div>
                      </div>
                      <button
                        onClick={() => addToast(`${setting.label} setting updated`, 'success')}
                        className={clsx(
                          'w-12 h-7 rounded-full transition-all duration-300 relative',
                          setting.enabled ? 'bg-amc-teal' : 'bg-white/20'
                        )}
                      >
                        <div
                          className={clsx(
                            'absolute top-1 w-5 h-5 rounded-full bg-white transition-all duration-300',
                            setting.enabled ? 'left-6' : 'left-1'
                          )}
                        />
                      </button>
                    </div>
                  ))}
                </div>
              </Card3D>
            );
          })}
        </div>

        {/* Right Sidebar */}
        <div className="space-y-6">
          {/* About */}
          <Card3D intensity={8} className="glass-card p-6">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Info className="w-5 h-5 text-amc-blue" />
              About AMC
            </h3>
            <div className="space-y-4">
              <div className="flex justify-center mb-4">
                <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-amc-teal via-amc-blue to-amc-purple flex items-center justify-center text-4xl font-bold animate-logo-glow">
                  A
                </div>
              </div>
              <div className="text-center mb-4">
                <div className="text-xl font-bold">{HOSPITAL_INFO.name}</div>
                <div className="text-sm text-white/50">{HOSPITAL_INFO.location}</div>
              </div>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-white/50">Founded</span>
                  <span>{HOSPITAL_INFO.founded}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/50">CEO</span>
                  <span>{HOSPITAL_INFO.ceo}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/50">Staff</span>
                  <span>{HOSPITAL_INFO.staffCount}+ professionals</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/50">Patients/Year</span>
                  <span>{HOSPITAL_INFO.patientsPerYear.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/50">Operating Hours</span>
                  <span>{HOSPITAL_INFO.operatingHours}</span>
                </div>
              </div>
            </div>
          </Card3D>

          {/* System Info */}
          <Card3D intensity={8} className="glass-card p-6">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Database className="w-5 h-5 text-amc-purple" />
              System Info
            </h3>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-white/50">Version</span>
                <Badge variant="info" size="sm">v1.0.0</Badge>
              </div>
              <div className="flex justify-between">
                <span className="text-white/50">Environment</span>
                <span>Production</span>
              </div>
              <div className="flex justify-between">
                <span className="text-white/50">Last Update</span>
                <span>Nov 30, 2025</span>
              </div>
              <div className="flex justify-between">
                <span className="text-white/50">Status</span>
                <Badge variant="success" dot>Online</Badge>
              </div>
            </div>
          </Card3D>

          {/* Quick Links */}
          <Card3D intensity={8} className="glass-card p-6">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Globe className="w-5 h-5 text-amc-teal" />
              Quick Links
            </h3>
            <div className="space-y-2">
              {[
                { label: 'Documentation', icon: '📚' },
                { label: 'Support Center', icon: '🎧' },
                { label: 'Training Portal', icon: '🎓' },
                { label: 'Report Issue', icon: '🐛' },
              ].map((link, i) => (
                <button
                  key={i}
                  onClick={() => addToast(`Opening ${link.label}...`, 'info')}
                  className="w-full p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-colors flex items-center gap-3 text-left"
                >
                  <span className="text-xl">{link.icon}</span>
                  <span className="text-sm">{link.label}</span>
                </button>
              ))}
            </div>
          </Card3D>
        </div>
      </div>

      {/* Footer Actions */}
      <div className="flex justify-between items-center pt-6 border-t border-white/10">
        <Button
          variant="ghost"
          onClick={() => addToast('Logging out...', 'info')}
        >
          Sign Out
        </Button>
        <div className="text-sm text-white/30">
          © 2025 Accra Medical Centre. All rights reserved.
        </div>
      </div>
    </div>
  );
};

export default Settings;
