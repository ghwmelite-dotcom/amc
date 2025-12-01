import React, { useState, useMemo } from 'react';
import { Search, Plus, Clock, User, Building2, Phone, UserCheck } from 'lucide-react';
import Card3D from '../components/common/Card3D';
import Button from '../components/common/Button';
import Badge from '../components/common/Badge';
import Modal from '../components/common/Modal';
import { useAppStore } from '../stores/appStore';
import { departmentData, appointmentData } from '../data/mockData';
import { getStatusColor } from '../utils/formatters';
import { Patient } from '../types';

const Patients: React.FC = () => {
  const { patients, addPatient, updatePatient, openModal, activeModal, closeModal, modalData, addToast } = useAppStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [filterDepartment, setFilterDepartment] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');

  // New patient form state
  const [newPatient, setNewPatient] = useState({
    name: '',
    age: '',
    gender: 'male' as Patient['gender'],
    phone: '',
    department: '',
    visitReason: '',
  });

  const resetForm = () => {
    setNewPatient({
      name: '',
      age: '',
      gender: 'male',
      phone: '',
      department: '',
      visitReason: '',
    });
  };

  const handleAddPatient = () => {
    if (!newPatient.name || !newPatient.age || !newPatient.department || !newPatient.visitReason) {
      addToast('Please fill in all required fields', 'error');
      return;
    }

    const maxQueue = patients.reduce((max, p) => Math.max(max, p.queueNumber), 0);
    const patient: Patient = {
      id: `P${String(patients.length + 1).padStart(3, '0')}`,
      name: newPatient.name,
      age: parseInt(newPatient.age),
      gender: newPatient.gender,
      phone: newPatient.phone || '+233 XX XXX XXXX',
      department: newPatient.department,
      status: 'waiting',
      queueNumber: maxQueue + 1,
      waitTime: 0,
      visitReason: newPatient.visitReason,
    };

    addPatient(patient);
    addToast(`${newPatient.name} registered - Queue #${patient.queueNumber}`, 'success');
    resetForm();
    closeModal();
  };

  const handleUpdateStatus = (patientId: string, status: Patient['status'], doctorName?: string) => {
    const update: Partial<Patient> = { status };
    if (doctorName) update.assignedDoctor = doctorName;
    if (status !== 'waiting') update.waitTime = 0;
    updatePatient(patientId, update);
    addToast(`Patient status updated to ${status.replace('-', ' ')}`, 'success');
  };

  const selectedPatient = modalData as Patient | null;

  const filteredPatients = useMemo(() => {
    return patients.filter((p) => {
      const matchesSearch =
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.id.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesDept = filterDepartment === 'all' || p.department === filterDepartment;
      const matchesStatus = filterStatus === 'all' || p.status === filterStatus;
      return matchesSearch && matchesDept && matchesStatus;
    });
  }, [patients, searchQuery, filterDepartment, filterStatus]);

  const waitingCount = patients.filter((p) => p.status === 'waiting').length;
  const consultingCount = patients.filter((p) => p.status === 'in-consultation').length;
  const admittedCount = patients.filter((p) => p.status === 'admitted').length;

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
              {filteredPatients.map((patient) => (
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
              {todayAppointments.map((apt) => (
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
                .map((dept) => (
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
        onClose={() => { resetForm(); closeModal(); }}
        title="Register New Patient"
        size="lg"
      >
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-white/60 mb-2">Full Name *</label>
              <input
                type="text"
                className="input-field"
                placeholder="Enter full name"
                value={newPatient.name}
                onChange={(e) => setNewPatient({ ...newPatient, name: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-sm text-white/60 mb-2">Age *</label>
              <input
                type="number"
                className="input-field"
                placeholder="Age"
                min="0"
                max="150"
                value={newPatient.age}
                onChange={(e) => setNewPatient({ ...newPatient, age: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-sm text-white/60 mb-2">Gender *</label>
              <select
                className="input-field"
                value={newPatient.gender}
                onChange={(e) => setNewPatient({ ...newPatient, gender: e.target.value as Patient['gender'] })}
              >
                <option value="male">Male</option>
                <option value="female">Female</option>
              </select>
            </div>
            <div>
              <label className="block text-sm text-white/60 mb-2">Phone</label>
              <input
                type="tel"
                className="input-field"
                placeholder="+233 XX XXX XXXX"
                value={newPatient.phone}
                onChange={(e) => setNewPatient({ ...newPatient, phone: e.target.value })}
              />
            </div>
            <div className="col-span-2">
              <label className="block text-sm text-white/60 mb-2">Department *</label>
              <select
                className="input-field"
                value={newPatient.department}
                onChange={(e) => setNewPatient({ ...newPatient, department: e.target.value })}
              >
                <option value="">Select department</option>
                {departmentData.map((d) => (
                  <option key={d.id} value={d.name}>{d.name}</option>
                ))}
              </select>
            </div>
            <div className="col-span-2">
              <label className="block text-sm text-white/60 mb-2">Reason for Visit *</label>
              <textarea
                className="input-field"
                rows={3}
                placeholder="Describe symptoms or reason"
                value={newPatient.visitReason}
                onChange={(e) => setNewPatient({ ...newPatient, visitReason: e.target.value })}
              />
            </div>
          </div>
          <div className="flex justify-end gap-3 mt-6">
            <Button variant="secondary" onClick={() => { resetForm(); closeModal(); }}>
              Cancel
            </Button>
            <Button onClick={handleAddPatient}>Register Patient</Button>
          </div>
        </div>
      </Modal>

      {/* Patient Detail Modal */}
      <Modal
        isOpen={activeModal === 'patient-detail' && !!selectedPatient}
        onClose={closeModal}
        title="Patient Details"
        size="lg"
      >
        {selectedPatient && (
          <div className="space-y-6">
            {/* Patient Info */}
            <div className="flex items-start gap-6">
              <div
                className="w-16 h-16 rounded-2xl flex items-center justify-center text-2xl font-bold"
                style={{
                  background: `${getStatusColor(selectedPatient.status)}20`,
                  color: getStatusColor(selectedPatient.status),
                }}
              >
                #{selectedPatient.queueNumber}
              </div>
              <div className="flex-1">
                <h3 className="text-2xl font-bold mb-1">{selectedPatient.name}</h3>
                <p className="text-white/60">
                  {selectedPatient.age} years old • {selectedPatient.gender.charAt(0).toUpperCase() + selectedPatient.gender.slice(1)}
                </p>
                <div className="flex gap-2 mt-2">
                  <Badge variant="default">{selectedPatient.department}</Badge>
                  <Badge
                    variant={
                      selectedPatient.status === 'waiting' ? 'info' :
                      selectedPatient.status === 'in-consultation' ? 'success' :
                      selectedPatient.status === 'admitted' ? 'warning' : 'default'
                    }
                  >
                    {selectedPatient.status.replace('-', ' ')}
                  </Badge>
                </div>
              </div>
            </div>

            {/* Contact & Details */}
            <div className="grid grid-cols-2 gap-4">
              <div className="glass-card p-4 rounded-xl flex items-center gap-3">
                <Phone className="w-5 h-5 text-amc-teal" />
                <div>
                  <div className="text-xs text-white/50">Phone</div>
                  <div className="text-sm">{selectedPatient.phone}</div>
                </div>
              </div>
              <div className="glass-card p-4 rounded-xl flex items-center gap-3">
                <Clock className="w-5 h-5 text-amc-blue" />
                <div>
                  <div className="text-xs text-white/50">Wait Time</div>
                  <div className="text-sm">
                    {selectedPatient.status === 'waiting' ? `${selectedPatient.waitTime} min` : 'N/A'}
                  </div>
                </div>
              </div>
            </div>

            {/* Visit Reason */}
            <div className="p-4 bg-white/5 rounded-xl">
              <div className="text-xs text-white/50 mb-2">Reason for Visit</div>
              <div className="text-sm">{selectedPatient.visitReason}</div>
            </div>

            {/* Assigned Doctor */}
            {selectedPatient.assignedDoctor && (
              <div className="p-4 bg-amc-teal/10 border border-amc-teal/20 rounded-xl flex items-center gap-3">
                <UserCheck className="w-5 h-5 text-amc-teal" />
                <div>
                  <div className="text-xs text-white/50">Assigned Doctor</div>
                  <div className="text-sm font-medium">{selectedPatient.assignedDoctor}</div>
                </div>
              </div>
            )}

            {/* Status Update Actions */}
            <div className="border-t border-white/10 pt-4">
              <div className="text-sm text-white/60 mb-3">Update Status</div>
              <div className="flex flex-wrap gap-2">
                {selectedPatient.status !== 'in-consultation' && (
                  <Button
                    size="sm"
                    variant="secondary"
                    onClick={() => handleUpdateStatus(selectedPatient.id, 'in-consultation', 'Dr. Kwame Asante')}
                  >
                    Start Consultation
                  </Button>
                )}
                {selectedPatient.status !== 'admitted' && (
                  <Button
                    size="sm"
                    variant="secondary"
                    onClick={() => handleUpdateStatus(selectedPatient.id, 'admitted')}
                  >
                    Admit Patient
                  </Button>
                )}
                {selectedPatient.status !== 'completed' && (
                  <Button
                    size="sm"
                    variant="secondary"
                    onClick={() => handleUpdateStatus(selectedPatient.id, 'completed')}
                  >
                    Mark Completed
                  </Button>
                )}
              </div>
            </div>

            <div className="flex justify-end gap-3">
              <Button variant="secondary" onClick={closeModal}>Close</Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default Patients;
