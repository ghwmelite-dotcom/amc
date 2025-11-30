import React, { useState, useMemo } from 'react';
import { Search, Plus, Clock, User, Building2, AlertCircle } from 'lucide-react';
import { clsx } from 'clsx';
import Card3D from '../components/common/Card3D';
import Button from '../components/common/Button';
import Badge from '../components/common/Badge';
import Modal from '../components/common/Modal';
import { useAppStore } from '../stores/appStore';
import { patientData, departmentData, appointmentData } from '../data/mockData';
import { getStatusColor } from '../utils/formatters';

const Patients: React.FC = () => {
  const { openModal, activeModal, closeModal, addToast } = useAppStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [filterDepartment, setFilterDepartment] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');

  const filteredPatients = useMemo(() => {
    return patientData.filter((p) => {
      const matchesSearch =
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.id.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesDept = filterDepartment === 'all' || p.department === filterDepartment;
      const matchesStatus = filterStatus === 'all' || p.status === filterStatus;
      return matchesSearch && matchesDept && matchesStatus;
    });
  }, [searchQuery, filterDepartment, filterStatus]);

  const waitingCount = patientData.filter((p) => p.status === 'waiting').length;
  const consultingCount = patientData.filter((p) => p.status === 'in-consultation').length;
  const admittedCount = patientData.filter((p) => p.status === 'admitted').length;

  const todayAppointments = appointmentData.filter(
    (a) => a.status === 'scheduled' || a.status === 'in-progress'
  );

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-4 gap-6">
        {[
          { label: 'In Queue', value: waitingCount, icon: '⏳', color: '#0066FF' },
          { label: 'In Consultation', value: consultingCount, icon: '🩺', color: '#00D4AA' },
          { label: 'Admitted', value: admittedCount, icon: '🛏️', color: '#FF6B35' },
          { label: "Today's Appointments", value: todayAppointments.length, icon: '📅', color: '#667EEA' },
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

      {/* Main Content */}
      <div className="grid grid-cols-[1fr_400px] gap-6">
        {/* Patient Queue */}
        <div className="space-y-4">
          {/* Filters */}
          <div className="flex gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
              <input
                type="text"
                placeholder="Search patients..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="input-field pl-11 w-full"
              />
            </div>
            <select
              value={filterDepartment}
              onChange={(e) => setFilterDepartment(e.target.value)}
              className="input-field w-48"
            >
              <option value="all">All Departments</option>
              {departmentData.map((d) => (
                <option key={d.id} value={d.name}>
                  {d.name}
                </option>
              ))}
            </select>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="input-field w-40"
            >
              <option value="all">All Status</option>
              <option value="waiting">Waiting</option>
              <option value="in-consultation">In Consultation</option>
              <option value="completed">Completed</option>
              <option value="admitted">Admitted</option>
            </select>
            <Button onClick={() => openModal('add-patient')} icon={<Plus className="w-4 h-4" />}>
              Register
            </Button>
          </div>

          {/* Patient List */}
          <Card3D intensity={5} className="glass-card p-6">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <User className="w-5 h-5 text-amc-teal" />
              Patient Queue
            </h3>
            <div className="space-y-3">
              {filteredPatients.map((patient, i) => (
                <Card3D
                  key={patient.id}
                  intensity={10}
                  onClick={() => openModal('patient-detail', patient)}
                  className="flex items-center gap-4 p-4 rounded-xl bg-white/[0.02] border border-white/[0.04] cursor-pointer"
                >
                  {/* Queue Number */}
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center text-lg font-bold"
                    style={{
                      background: `${getStatusColor(patient.status)}20`,
                      color: getStatusColor(patient.status),
                    }}
                  >
                    {patient.queueNumber}
                  </div>

                  {/* Patient Info */}
                  <div className="flex-1 min-w-0">
                    <div className="font-semibold">{patient.name}</div>
                    <div className="text-sm text-white/50">
                      {patient.age} yrs • {patient.gender} • {patient.visitReason}
                    </div>
                  </div>

                  {/* Department */}
                  <Badge variant="default">{patient.department}</Badge>

                  {/* Wait Time */}
                  {patient.status === 'waiting' && (
                    <div className="flex items-center gap-1 text-sm text-white/50">
                      <Clock className="w-4 h-4" />
                      {patient.waitTime} min
                    </div>
                  )}

                  {/* Status */}
                  <Badge
                    variant={
                      patient.status === 'waiting'
                        ? 'info'
                        : patient.status === 'in-consultation'
                          ? 'success'
                          : patient.status === 'admitted'
                            ? 'warning'
                            : 'default'
                    }
                  >
                    {patient.status.replace('-', ' ')}
                  </Badge>
                </Card3D>
              ))}
            </div>
          </Card3D>
        </div>

        {/* Right Sidebar */}
        <div className="space-y-6">
          {/* Today's Appointments */}
          <Card3D intensity={8} className="glass-card p-6">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Building2 className="w-5 h-5 text-amc-blue" />
              Today's Appointments
            </h3>
            <div className="space-y-3">
              {todayAppointments.map((apt, i) => (
                <div
                  key={apt.id}
                  className="p-3 rounded-xl bg-white/[0.03] border border-white/[0.05]"
                >
                  <div className="flex justify-between items-start mb-2">
                    <div className="font-medium">{apt.patientName}</div>
                    <Badge
                      variant={apt.status === 'in-progress' ? 'success' : 'info'}
                      size="sm"
                    >
                      {apt.time}
                    </Badge>
                  </div>
                  <div className="text-sm text-white/50">
                    {apt.doctorName} • {apt.department}
                  </div>
                </div>
              ))}
            </div>
          </Card3D>

          {/* Department Distribution */}
          <Card3D intensity={8} className="glass-card p-6">
            <h3 className="text-lg font-semibold mb-4">Patients by Department</h3>
            <div className="space-y-3">
              {departmentData
                .filter((d) => d.patientCount > 0)
                .sort((a, b) => b.patientCount - a.patientCount)
                .slice(0, 6)
                .map((dept, i) => (
                  <div key={dept.id} className="flex items-center gap-3">
                    <span className="text-xl">{dept.icon}</span>
                    <div className="flex-1">
                      <div className="text-sm">{dept.name}</div>
                      <div className="h-1.5 bg-white/5 rounded-full overflow-hidden mt-1">
                        <div
                          className="h-full rounded-full"
                          style={{
                            width: `${(dept.patientCount / 20) * 100}%`,
                            backgroundColor: dept.color,
                          }}
                        />
                      </div>
                    </div>
                    <span className="text-sm font-medium" style={{ color: dept.color }}>
                      {dept.patientCount}
                    </span>
                  </div>
                ))}
            </div>
          </Card3D>
        </div>
      </div>

      {/* Add Patient Modal */}
      <Modal
        isOpen={activeModal === 'add-patient'}
        onClose={closeModal}
        title="Register New Patient"
        size="lg"
      >
        <form
          onSubmit={(e) => {
            e.preventDefault();
            addToast('Patient registered successfully', 'success');
            closeModal();
          }}
          className="space-y-4"
        >
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-white/60 mb-2">Full Name</label>
              <input type="text" className="input-field" placeholder="Enter full name" required />
            </div>
            <div>
              <label className="block text-sm text-white/60 mb-2">Age</label>
              <input type="number" className="input-field" placeholder="Age" required />
            </div>
            <div>
              <label className="block text-sm text-white/60 mb-2">Gender</label>
              <select className="input-field" required>
                <option value="male">Male</option>
                <option value="female">Female</option>
              </select>
            </div>
            <div>
              <label className="block text-sm text-white/60 mb-2">Phone</label>
              <input type="tel" className="input-field" placeholder="+233 XX XXX XXXX" required />
            </div>
            <div className="col-span-2">
              <label className="block text-sm text-white/60 mb-2">Department</label>
              <select className="input-field" required>
                {departmentData.map((d) => (
                  <option key={d.id} value={d.name}>
                    {d.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="col-span-2">
              <label className="block text-sm text-white/60 mb-2">Reason for Visit</label>
              <textarea className="input-field" rows={3} placeholder="Describe symptoms or reason" required />
            </div>
          </div>
          <div className="flex justify-end gap-3 mt-6">
            <Button variant="secondary" onClick={closeModal} type="button">
              Cancel
            </Button>
            <Button type="submit">Register Patient</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default Patients;
