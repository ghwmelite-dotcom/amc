import React, { useState } from 'react';
import { clsx } from 'clsx';
import Card3D from '../components/common/Card3D';
import StatCard from '../components/common/StatCard';
import Avatar from '../components/common/Avatar';
import Badge from '../components/common/Badge';
import DonutChart from '../components/charts/DonutChart';
import AnimatedLineChart from '../components/charts/AnimatedLineChart';
import { useSoundEffects } from '../hooks/useSoundEffects';
import { useAppStore } from '../stores/appStore';
import { weekData, shiftData, departmentData, chartData } from '../data/mockData';
import { getShiftColor } from '../utils/formatters';

const Dashboard: React.FC = () => {
  const [selectedDay, setSelectedDay] = useState(0);
  const { notifications, soundEnabled } = useAppStore();
  const { playSound } = useSoundEffects();

  const handleDayClick = (index: number) => {
    if (soundEnabled) playSound('click');
    setSelectedDay(index);
  };

  const stats = [
    {
      label: 'Active Staff',
      value: 219,
      icon: '👥',
      gradient: ['#00D4AA', '#00A693'] as [string, string],
      trend: '+12',
      up: true,
      chartData: chartData.shifts,
    },
    {
      label: "Today's Shifts",
      value: 156,
      icon: '📋',
      gradient: ['#0066FF', '#0052CC'] as [string, string],
      trend: '+8',
      up: true,
      chartData: chartData.coverage,
    },
    {
      label: 'Coverage Rate',
      value: 94,
      suffix: '%',
      icon: '🎯',
      gradient: ['#00D26A', '#00B85C'] as [string, string],
      trend: '+5',
      up: true,
      chartData: chartData.patients,
    },
    {
      label: 'On Leave',
      value: 12,
      icon: '🏖️',
      gradient: ['#667EEA', '#5A67D8'] as [string, string],
      trend: '-3',
      up: false,
      chartData: [8, 10, 12, 9, 11, 14, 12, 10, 13, 12],
    },
  ];

  const activeAlerts = notifications.filter((n) => !n.read);

  return (
    <div className="space-y-8">
      {/* Stats Row */}
      <div className="grid grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <StatCard key={i} {...stat} delay={i * 100} />
        ))}
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-[1fr_420px] gap-6">
        {/* Left Column */}
        <div className="space-y-6">
          {/* Week Overview */}
          <Card3D
            intensity={8}
            className="glass-card p-7 opacity-0 animate-fade-in-up animation-delay-400"
          >
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold flex items-center gap-3">
                <span className="opacity-60">📅</span>
                Week Overview
              </h2>
              <div className="flex gap-2">
                {['← Prev', 'Next →'].map((text, i) => (
                  <button
                    key={i}
                    onClick={() => soundEnabled && playSound('click')}
                    className="px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-sm text-white hover:bg-white/10 transition-colors"
                  >
                    {text}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-7 gap-3">
              {weekData.map((day, i) => (
                <Card3D
                  key={i}
                  intensity={20}
                  onClick={() => handleDayClick(i)}
                  className={clsx(
                    'p-5 rounded-2xl text-center cursor-pointer relative overflow-hidden transition-all duration-300',
                    day.today
                      ? 'bg-gradient-to-br from-amc-teal/15 to-amc-blue/15 border border-amc-teal/30'
                      : selectedDay === i
                        ? 'bg-white/5'
                        : 'bg-white/[0.02] border border-white/5'
                  )}
                >
                  {day.today && (
                    <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-amc-teal to-amc-blue" />
                  )}

                  <div
                    className={clsx(
                      'text-xs font-semibold tracking-wider mb-2',
                      day.today ? 'text-amc-teal' : 'text-white/40'
                    )}
                  >
                    {day.day}
                  </div>

                  <div
                    className={clsx(
                      'text-2xl font-bold mb-4',
                      day.today ? 'text-white' : 'text-white/80'
                    )}
                  >
                    {day.date}
                  </div>

                  {/* Coverage Ring */}
                  <div className="flex justify-center mb-3">
                    <DonutChart
                      value={day.coverage}
                      size={60}
                      strokeWidth={6}
                      color="auto"
                      label="%"
                    />
                  </div>

                  <div className="text-xs text-white/50">{day.shifts} shifts</div>

                  {day.alerts > 0 && (
                    <div className="absolute top-3 right-3 w-5 h-5 rounded-full bg-amc-red text-[10px] font-bold flex items-center justify-center shadow-glow-red animate-pulse">
                      {day.alerts}
                    </div>
                  )}
                </Card3D>
              ))}
            </div>
          </Card3D>

          {/* Live Schedule */}
          <Card3D
            intensity={5}
            className="glass-card p-7 opacity-0 animate-fade-in-up animation-delay-500"
          >
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold flex items-center gap-3">
                <span className="opacity-60">⚡</span>
                Live Schedule
              </h2>
              <Badge variant="success" dot pulse>
                Live
              </Badge>
            </div>

            <div className="space-y-3">
              {shiftData.map((shift, i) => {
                const shiftColors = getShiftColor(shift.type);
                return (
                  <Card3D
                    key={i}
                    intensity={10}
                    className="flex items-center gap-4 p-4 rounded-2xl bg-white/[0.02] border border-white/[0.04] cursor-pointer"
                  >
                    <div className="relative">
                      <Avatar
                        name={shift.staffName}
                        type={shift.staffName.includes('Dr.') ? 'doctor' : 'nurse'}
                        size="md"
                        status={shift.status === 'active' ? 'active' : undefined}
                        showStatus
                      />
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="font-semibold text-[15px]">{shift.staffName}</div>
                      <div className="text-sm text-white/50">{shift.department}</div>
                    </div>

                    <Badge variant="default">{shift.department}</Badge>

                    <div
                      className="px-4 py-2 rounded-xl text-xs font-semibold"
                      style={{
                        background: shiftColors.bg,
                        border: `1px solid ${shiftColors.border}`,
                        color: shiftColors.text,
                      }}
                    >
                      {shift.startTime} - {shift.endTime}
                    </div>
                  </Card3D>
                );
              })}
            </div>
          </Card3D>
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          {/* Alerts */}
          <Card3D
            intensity={8}
            className="glass-card p-7 opacity-0 animate-fade-in-up animation-delay-300"
          >
            <h2 className="text-xl font-semibold mb-6 flex items-center gap-3">
              <span className="opacity-60">🚨</span>
              Active Alerts
            </h2>

            <div className="space-y-3">
              {activeAlerts.slice(0, 4).map((alert, i) => (
                <Card3D
                  key={i}
                  intensity={12}
                  onClick={() => soundEnabled && playSound('alert')}
                  className={clsx(
                    'flex gap-3.5 p-4 rounded-2xl cursor-pointer',
                    alert.type === 'critical' && 'bg-amc-red/10 border border-amc-red/20 animate-alert-pulse',
                    alert.type === 'warning' && 'bg-amc-orange/10 border border-amc-orange/20',
                    alert.type === 'info' && 'bg-amc-blue/10 border border-amc-blue/20',
                    alert.type === 'success' && 'bg-amc-green/10 border border-amc-green/20'
                  )}
                >
                  <div
                    className={clsx(
                      'w-11 h-11 rounded-xl flex items-center justify-center text-xl flex-shrink-0',
                      alert.type === 'critical' && 'bg-amc-red/15',
                      alert.type === 'warning' && 'bg-amc-orange/15',
                      alert.type === 'info' && 'bg-amc-blue/15',
                      alert.type === 'success' && 'bg-amc-green/15'
                    )}
                  >
                    {alert.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-semibold text-sm">{alert.title}</div>
                    <div className="text-xs text-white/50">{alert.description}</div>
                  </div>
                  <div className="text-xs text-white/30 flex-shrink-0">{alert.time}</div>
                </Card3D>
              ))}
            </div>
          </Card3D>

          {/* Coverage Chart */}
          <Card3D
            intensity={8}
            className="glass-card p-7 opacity-0 animate-fade-in-up animation-delay-400"
          >
            <h2 className="text-xl font-semibold mb-5 flex items-center gap-3">
              <span className="opacity-60">📈</span>
              Coverage Trend
            </h2>
            <AnimatedLineChart data={chartData.coverage} color="#00D4AA" height={140} />
          </Card3D>

          {/* Department Status */}
          <Card3D
            intensity={8}
            className="glass-card p-7 opacity-0 animate-fade-in-up animation-delay-500"
          >
            <h2 className="text-xl font-semibold mb-6 flex items-center gap-3">
              <span className="opacity-60">🏥</span>
              Departments
            </h2>

            <div className="space-y-4">
              {departmentData.slice(0, 6).map((dept, i) => (
                <div key={i}>
                  <div className="flex justify-between items-center mb-2">
                    <div className="flex items-center gap-2.5">
                      <span className="text-lg">{dept.icon}</span>
                      <span className="text-sm font-medium">{dept.name}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-sm text-white/50">
                        {dept.activeStaff}/{dept.staffCount}
                      </span>
                      <span
                        className={clsx(
                          'text-sm font-semibold',
                          dept.coverage >= 90
                            ? 'text-amc-green'
                            : dept.coverage >= 80
                              ? 'text-amc-orange'
                              : 'text-amc-red'
                        )}
                      >
                        {dept.coverage}%
                      </span>
                    </div>
                  </div>
                  <div className="h-1.5 rounded-full bg-white/5 overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-1000"
                      style={{
                        width: `${dept.coverage}%`,
                        background: `linear-gradient(90deg, ${dept.color}, ${dept.color}AA)`,
                        boxShadow: `0 0 10px ${dept.color}50`,
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </Card3D>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
