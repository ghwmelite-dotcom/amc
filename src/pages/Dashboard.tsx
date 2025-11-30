import React, { useState, useEffect } from 'react';
import { clsx } from 'clsx';
import { Brain, TrendingUp, AlertTriangle, Users, BedDouble, Clock, Sparkles, Activity } from 'lucide-react';
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
  const [aiInsightIndex, setAiInsightIndex] = useState(0);
  const { notifications, soundEnabled } = useAppStore();
  const { playSound } = useSoundEffects();

  const handleDayClick = (index: number) => {
    if (soundEnabled) playSound('click');
    setSelectedDay(index);
  };

  // AI Insights data
  const aiInsights = [
    {
      id: 1,
      type: 'prediction',
      icon: <TrendingUp className="w-5 h-5" />,
      title: 'Patient Surge Predicted',
      description: 'ER volume expected to increase 40% tomorrow 2-4 PM based on historical patterns',
      severity: 'warning',
      action: 'Pre-schedule 3 additional nurses',
      confidence: 94
    },
    {
      id: 2,
      type: 'optimization',
      icon: <Users className="w-5 h-5" />,
      title: 'Staff Optimization',
      description: 'Night shift in Cardiology is understaffed. Coverage drops to 67% after 10 PM',
      severity: 'critical',
      action: 'Reassign 2 nurses from Pediatrics',
      confidence: 91
    },
    {
      id: 3,
      type: 'forecast',
      icon: <BedDouble className="w-5 h-5" />,
      title: 'Bed Capacity Alert',
      description: 'ICU projected to reach 95% capacity by Friday based on current admission rate',
      severity: 'warning',
      action: 'Review discharge schedule',
      confidence: 87
    },
    {
      id: 4,
      type: 'insight',
      icon: <Clock className="w-5 h-5" />,
      title: 'Wait Time Anomaly',
      description: 'Average wait time in OPD increased 23% this week. Bottleneck at registration',
      severity: 'info',
      action: 'Add temporary registration desk',
      confidence: 89
    }
  ];

  // Rotate AI insights every 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setAiInsightIndex((prev) => (prev + 1) % aiInsights.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

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

      {/* AI Insights Panel */}
      <Card3D
        intensity={8}
        className="glass-card p-6 opacity-0 animate-fade-in-up animation-delay-200 relative overflow-hidden"
      >
        {/* Animated gradient background */}
        <div className="absolute inset-0 bg-gradient-to-r from-amc-purple/5 via-amc-teal/5 to-amc-blue/5 animate-gradient-shift" />

        <div className="relative">
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amc-purple to-amc-blue flex items-center justify-center">
                <Brain className="w-5 h-5 text-white" />
              </div>
              <div>
                <h2 className="text-lg font-semibold flex items-center gap-2">
                  AI-Powered Insights
                  <Sparkles className="w-4 h-4 text-amc-teal animate-pulse" />
                </h2>
                <p className="text-xs text-white/50">Real-time predictions & recommendations</p>
              </div>
            </div>
            <Badge variant="info" dot pulse>
              <Activity className="w-3 h-3 mr-1" />
              Analyzing
            </Badge>
          </div>

          <div className="grid grid-cols-4 gap-4">
            {aiInsights.map((insight, i) => (
              <Card3D
                key={insight.id}
                intensity={15}
                onClick={() => {
                  if (soundEnabled) playSound('click');
                  setAiInsightIndex(i);
                }}
                className={clsx(
                  'p-4 rounded-xl cursor-pointer transition-all duration-300',
                  i === aiInsightIndex
                    ? insight.severity === 'critical'
                      ? 'bg-amc-red/15 border border-amc-red/30'
                      : insight.severity === 'warning'
                        ? 'bg-amc-orange/15 border border-amc-orange/30'
                        : 'bg-amc-blue/15 border border-amc-blue/30'
                    : 'bg-white/[0.02] border border-white/5 hover:bg-white/[0.04]'
                )}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className={clsx(
                    'w-9 h-9 rounded-lg flex items-center justify-center',
                    insight.severity === 'critical' && 'bg-amc-red/20 text-amc-red',
                    insight.severity === 'warning' && 'bg-amc-orange/20 text-amc-orange',
                    insight.severity === 'info' && 'bg-amc-blue/20 text-amc-blue'
                  )}>
                    {insight.icon}
                  </div>
                  <div className="text-right">
                    <div className="text-xs text-white/40">Confidence</div>
                    <div className={clsx(
                      'text-sm font-bold',
                      insight.confidence >= 90 ? 'text-amc-green' : 'text-amc-teal'
                    )}>
                      {insight.confidence}%
                    </div>
                  </div>
                </div>

                <h3 className="font-semibold text-sm mb-1">{insight.title}</h3>
                <p className="text-xs text-white/50 line-clamp-2 mb-3">{insight.description}</p>

                {i === aiInsightIndex && (
                  <div className="pt-3 border-t border-white/10">
                    <div className="flex items-center gap-2 text-xs">
                      <AlertTriangle className="w-3 h-3 text-amc-teal" />
                      <span className="text-amc-teal font-medium">{insight.action}</span>
                    </div>
                  </div>
                )}
              </Card3D>
            ))}
          </div>

          {/* Insight progress indicator */}
          <div className="flex justify-center gap-1.5 mt-4">
            {aiInsights.map((_, i) => (
              <button
                key={i}
                onClick={() => setAiInsightIndex(i)}
                className={clsx(
                  'h-1 rounded-full transition-all duration-300',
                  i === aiInsightIndex ? 'w-6 bg-amc-teal' : 'w-1.5 bg-white/20 hover:bg-white/40'
                )}
              />
            ))}
          </div>
        </div>
      </Card3D>

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
