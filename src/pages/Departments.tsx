import React from 'react';
import { Users, Activity, TrendingUp, Calendar } from 'lucide-react';
import { clsx } from 'clsx';
import Card3D from '../components/common/Card3D';
import Badge from '../components/common/Badge';
import DonutChart from '../components/charts/DonutChart';
import BarChart from '../components/charts/BarChart';
import { departmentData } from '../data/mockData';
import { useAppStore } from '../stores/appStore';

const Departments: React.FC = () => {
  const { addToast } = useAppStore();

  const totalStaff = departmentData.reduce((sum, d) => sum + d.staffCount, 0);
  const totalActive = departmentData.reduce((sum, d) => sum + d.activeStaff, 0);
  const avgCoverage = Math.round(
    departmentData.reduce((sum, d) => sum + d.coverage, 0) / departmentData.length
  );

  return (
    <div className="space-y-6">
      {/* Summary Stats */}
      <div className="grid grid-cols-4 gap-6">
        {[
          { label: 'Total Departments', value: departmentData.length, icon: '🏥', color: '#00D4AA' },
          { label: 'Total Staff', value: totalStaff, icon: '👥', color: '#0066FF' },
          { label: 'Active Now', value: totalActive, icon: '✅', color: '#00D26A' },
          { label: 'Avg Coverage', value: `${avgCoverage}%`, icon: '📊', color: '#667EEA' },
        ].map((stat, i) => (
          <Card3D
            key={i}
            intensity={12}
            className="glass-card p-6 opacity-0 animate-fade-in-up"
            style={{ animationDelay: `${i * 100}ms`, animationFillMode: 'forwards' }}
          >
            <div className="flex items-center gap-4">
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl"
                style={{ background: `${stat.color}20`, border: `1px solid ${stat.color}30` }}
              >
                {stat.icon}
              </div>
              <div>
                <div className="text-2xl font-bold" style={{ color: stat.color }}>
                  {stat.value}
                </div>
                <div className="text-sm text-white/50">{stat.label}</div>
              </div>
            </div>
          </Card3D>
        ))}
      </div>

      {/* Department Cards */}
      <div className="grid grid-cols-3 gap-6">
        {departmentData.map((dept, i) => (
          <Card3D
            key={dept.id}
            intensity={12}
            onClick={() => addToast(`Viewing ${dept.name} department`, 'info')}
            className="glass-card p-6 cursor-pointer opacity-0 animate-fade-in-up"
            style={{ animationDelay: `${(i + 4) * 50}ms`, animationFillMode: 'forwards' }}
          >
            {/* Header */}
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl"
                  style={{ background: `${dept.color}20`, border: `1px solid ${dept.color}30` }}
                >
                  {dept.icon}
                </div>
                <div>
                  <h3 className="font-semibold text-lg">{dept.name}</h3>
                  <p className="text-sm text-white/50">{dept.description}</p>
                </div>
              </div>
              <Badge
                variant={
                  dept.coverage >= 90
                    ? 'success'
                    : dept.coverage >= 80
                      ? 'warning'
                      : 'danger'
                }
              >
                {dept.coverage}%
              </Badge>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-3 gap-4 mb-4">
              <div className="text-center">
                <div className="text-xl font-bold text-white">{dept.staffCount}</div>
                <div className="text-xs text-white/40">Total Staff</div>
              </div>
              <div className="text-center">
                <div className="text-xl font-bold text-amc-green">{dept.activeStaff}</div>
                <div className="text-xs text-white/40">Active</div>
              </div>
              <div className="text-center">
                <div className="text-xl font-bold text-amc-blue">{dept.patientCount}</div>
                <div className="text-xs text-white/40">Patients</div>
              </div>
            </div>

            {/* Coverage Bar */}
            <div className="mb-4">
              <div className="flex justify-between text-xs mb-1">
                <span className="text-white/50">Coverage</span>
                <span style={{ color: dept.color }}>{dept.coverage}%</span>
              </div>
              <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-1000"
                  style={{
                    width: `${dept.coverage}%`,
                    background: `linear-gradient(90deg, ${dept.color}, ${dept.color}80)`,
                    boxShadow: `0 0 10px ${dept.color}40`,
                  }}
                />
              </div>
            </div>

            {/* Department Head */}
            <div className="flex items-center justify-between pt-4 border-t border-white/5">
              <div className="text-xs text-white/40">Department Head</div>
              <div className="text-sm font-medium">{dept.head}</div>
            </div>
          </Card3D>
        ))}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-2 gap-6">
        {/* Coverage by Department */}
        <Card3D intensity={8} className="glass-card p-6">
          <h3 className="text-lg font-semibold mb-6 flex items-center gap-2">
            <Activity className="w-5 h-5 text-amc-teal" />
            Coverage by Department
          </h3>
          <BarChart
            data={departmentData.slice(0, 6).map((d) => ({
              label: d.name.slice(0, 8),
              value: d.coverage,
              color: d.color,
            }))}
            height={200}
            horizontal
          />
        </Card3D>

        {/* Staff Distribution */}
        <Card3D intensity={8} className="glass-card p-6">
          <h3 className="text-lg font-semibold mb-6 flex items-center gap-2">
            <Users className="w-5 h-5 text-amc-blue" />
            Staff Distribution
          </h3>
          <div className="flex items-center justify-center gap-8">
            <DonutChart value={totalActive} max={totalStaff} size={140} strokeWidth={12} color="#00D26A" label="Active" />
            <div className="space-y-3">
              {departmentData.slice(0, 5).map((dept) => (
                <div key={dept.id} className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: dept.color }} />
                  <span className="text-sm text-white/70">{dept.name}</span>
                  <span className="text-sm font-medium ml-auto">{dept.staffCount}</span>
                </div>
              ))}
            </div>
          </div>
        </Card3D>
      </div>
    </div>
  );
};

export default Departments;
