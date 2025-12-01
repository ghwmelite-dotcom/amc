import React, { useState } from 'react';
import { Users, Activity, Clock, TrendingUp } from 'lucide-react';
import Card3D from '../components/common/Card3D';
import Badge from '../components/common/Badge';
import Button from '../components/common/Button';
import Modal from '../components/common/Modal';
import Avatar from '../components/common/Avatar';
import DonutChart from '../components/charts/DonutChart';
import BarChart from '../components/charts/BarChart';
import { departmentData, staffData } from '../data/mockData';
import { useAppStore } from '../stores/appStore';
import { Department } from '../types';

const Departments: React.FC = () => {
  const { addToast } = useAppStore();
  const [selectedDepartment, setSelectedDepartment] = useState<Department | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);

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
            onClick={() => {
              setSelectedDepartment(dept);
              setShowDetailModal(true);
            }}
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

      {/* Department Detail Modal */}
      <Modal
        isOpen={showDetailModal && selectedDepartment !== null}
        onClose={() => {
          setShowDetailModal(false);
          setSelectedDepartment(null);
        }}
        title={selectedDepartment?.name || 'Department Details'}
        size="lg"
      >
        {selectedDepartment && (
          <div className="space-y-6">
            {/* Department Header */}
            <div className="flex items-center gap-4 pb-4 border-b border-white/10">
              <div
                className="w-16 h-16 rounded-xl flex items-center justify-center text-3xl"
                style={{ background: `${selectedDepartment.color}20`, border: `1px solid ${selectedDepartment.color}30` }}
              >
                {selectedDepartment.icon}
              </div>
              <div className="flex-1">
                <h2 className="text-xl font-bold">{selectedDepartment.name}</h2>
                <p className="text-white/60">{selectedDepartment.description}</p>
              </div>
              <Badge
                variant={
                  selectedDepartment.coverage >= 90
                    ? 'success'
                    : selectedDepartment.coverage >= 80
                      ? 'warning'
                      : 'danger'
                }
              >
                {selectedDepartment.coverage}% Coverage
              </Badge>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-4 gap-4">
              {[
                { label: 'Total Staff', value: selectedDepartment.staffCount, icon: <Users className="w-5 h-5" />, color: '#0066FF' },
                { label: 'Active Now', value: selectedDepartment.activeStaff, icon: <Activity className="w-5 h-5" />, color: '#00D26A' },
                { label: 'Patients', value: selectedDepartment.patientCount, icon: <TrendingUp className="w-5 h-5" />, color: '#667EEA' },
                { label: 'Avg. Wait', value: '15m', icon: <Clock className="w-5 h-5" />, color: '#FFB020' },
              ].map((stat, idx) => (
                <div key={idx} className="p-4 bg-white/5 rounded-xl text-center">
                  <div className="flex justify-center mb-2" style={{ color: stat.color }}>
                    {stat.icon}
                  </div>
                  <div className="text-2xl font-bold" style={{ color: stat.color }}>
                    {stat.value}
                  </div>
                  <div className="text-xs text-white/50">{stat.label}</div>
                </div>
              ))}
            </div>

            {/* Department Head */}
            <div className="p-4 bg-white/5 rounded-xl">
              <div className="text-sm text-white/50 mb-2">Department Head</div>
              <div className="flex items-center gap-3">
                <Avatar name={selectedDepartment.head} type="doctor" size="md" />
                <div>
                  <div className="font-medium">{selectedDepartment.head}</div>
                  <div className="text-sm text-white/50">Head of {selectedDepartment.name}</div>
                </div>
              </div>
            </div>

            {/* Staff List */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold flex items-center gap-2">
                  <Users className="w-4 h-4 text-amc-teal" />
                  Department Staff
                </h3>
                <span className="text-sm text-white/50">{selectedDepartment.staffCount} members</span>
              </div>
              <div className="space-y-2 max-h-[200px] overflow-y-auto">
                {staffData
                  .filter(s => s.department.toLowerCase().includes(selectedDepartment.name.toLowerCase().split(' ')[0]))
                  .slice(0, 6)
                  .map((staff) => (
                    <div key={staff.id} className="flex items-center justify-between p-3 bg-white/5 rounded-xl">
                      <div className="flex items-center gap-3">
                        <Avatar name={staff.name} type={staff.type} size="sm" />
                        <div>
                          <div className="font-medium text-sm">{staff.name}</div>
                          <div className="text-xs text-white/50">{staff.role}</div>
                        </div>
                      </div>
                      <Badge variant={staff.status === 'active' ? 'success' : staff.status === 'on-leave' ? 'warning' : 'default'}>
                        {staff.status}
                      </Badge>
                    </div>
                  ))}
                {staffData.filter(s => s.department.toLowerCase().includes(selectedDepartment.name.toLowerCase().split(' ')[0])).length === 0 && (
                  <div className="text-center py-4 text-white/50 text-sm">
                    No staff members found for this department
                  </div>
                )}
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3 pt-4 border-t border-white/10">
              <Button
                variant="secondary"
                className="flex-1"
                onClick={() => {
                  addToast(`Viewing ${selectedDepartment.name} schedule`, 'info');
                }}
              >
                View Schedule
              </Button>
              <Button
                className="flex-1"
                onClick={() => {
                  addToast(`Editing ${selectedDepartment.name} settings`, 'info');
                }}
              >
                Manage Department
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default Departments;
