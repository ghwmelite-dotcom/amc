import React, { useState } from 'react';
import { UserPlus, Calendar, Users, CalendarOff } from 'lucide-react';
import Modal from './Modal';
import Button from './Button';
import { useAppStore } from '../../stores/appStore';
import { useAuth } from '../../contexts/AuthContext';
import { LEAVE_TYPES, STAFF_ROLES } from '../../utils/constants';
import { departmentData, staffData } from '../../data/mockData';

type QuickAddType = 'patient' | 'appointment' | 'leave' | 'staff' | null;

interface QuickAddModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const QuickAddModal: React.FC<QuickAddModalProps> = ({ isOpen, onClose }) => {
  const { addToast, addPatient, addStaff, addLeaveRequest } = useAppStore();
  const { user, hasPermission } = useAuth();
  const [selectedType, setSelectedType] = useState<QuickAddType>(null);

  // Form states
  const [patientForm, setPatientForm] = useState({
    name: '',
    age: '',
    gender: 'male',
    phone: '',
    condition: '',
    department: '',
  });

  const [appointmentForm, setAppointmentForm] = useState({
    patientName: '',
    doctor: '',
    department: '',
    date: '',
    time: '',
    reason: '',
  });

  const [leaveForm, setLeaveForm] = useState({
    type: 'annual',
    startDate: '',
    endDate: '',
    reason: '',
  });

  const [staffForm, setStaffForm] = useState({
    name: '',
    email: '',
    phone: '',
    role: '',
    department: '',
    type: 'nurse' as 'doctor' | 'nurse' | 'tech' | 'admin',
  });

  const quickAddOptions = [
    {
      id: 'patient',
      icon: <UserPlus className="w-6 h-6" />,
      label: 'New Patient',
      description: 'Register a new patient',
      color: '#FF6B7A',
      permission: 'canViewPatients',
    },
    {
      id: 'appointment',
      icon: <Calendar className="w-6 h-6" />,
      label: 'Appointment',
      description: 'Schedule an appointment',
      color: '#0066FF',
      permission: 'canViewSchedule',
    },
    {
      id: 'leave',
      icon: <CalendarOff className="w-6 h-6" />,
      label: 'Leave Request',
      description: 'Submit leave request',
      color: '#FFB020',
      permission: 'canViewSchedule',
    },
    {
      id: 'staff',
      icon: <Users className="w-6 h-6" />,
      label: 'New Staff',
      description: 'Add a staff member',
      color: '#667EEA',
      permission: 'canManageStaff',
    },
  ];

  const availableOptions = quickAddOptions.filter(
    opt => hasPermission(opt.permission as any)
  );

  const resetForms = () => {
    setPatientForm({ name: '', age: '', gender: 'male', phone: '', condition: '', department: '' });
    setAppointmentForm({ patientName: '', doctor: '', department: '', date: '', time: '', reason: '' });
    setLeaveForm({ type: 'annual', startDate: '', endDate: '', reason: '' });
    setStaffForm({ name: '', email: '', phone: '', role: '', department: '', type: 'nurse' });
    setSelectedType(null);
  };

  const handleClose = () => {
    resetForms();
    onClose();
  };

  const handleSubmitPatient = () => {
    if (!patientForm.name || !patientForm.age || !patientForm.department) {
      addToast('Please fill in required fields', 'error');
      return;
    }
    addPatient({
      id: `P${Date.now()}`,
      name: patientForm.name,
      age: parseInt(patientForm.age),
      gender: patientForm.gender as 'male' | 'female',
      status: 'waiting',
      queueNumber: Math.floor(Math.random() * 100) + 1,
      waitTime: 0,
      department: patientForm.department,
      assignedDoctor: 'Dr. TBD',
      phone: patientForm.phone,
      visitReason: patientForm.condition || 'General Consultation',
    });
    addToast(`Patient ${patientForm.name} registered successfully`, 'success');
    handleClose();
  };

  const handleSubmitAppointment = () => {
    if (!appointmentForm.patientName || !appointmentForm.doctor || !appointmentForm.date || !appointmentForm.time) {
      addToast('Please fill in required fields', 'error');
      return;
    }
    addToast(`Appointment scheduled for ${appointmentForm.patientName} with ${appointmentForm.doctor}`, 'success');
    handleClose();
  };

  const handleSubmitLeave = () => {
    if (!leaveForm.startDate || !leaveForm.endDate || !leaveForm.reason) {
      addToast('Please fill in required fields', 'error');
      return;
    }
    if (!user) return;

    addLeaveRequest({
      id: `L${Date.now()}`,
      staffId: user.staffId,
      staffName: user.name,
      staffRole: staffData.find(s => s.id === user.staffId)?.role || 'Staff',
      department: staffData.find(s => s.id === user.staffId)?.department || 'General',
      type: leaveForm.type as 'annual' | 'sick' | 'maternity' | 'emergency' | 'unpaid',
      startDate: leaveForm.startDate,
      endDate: leaveForm.endDate,
      status: 'pending',
      reason: leaveForm.reason,
      appliedDate: new Date().toISOString().split('T')[0],
    });
    addToast('Leave request submitted successfully', 'success');
    handleClose();
  };

  const handleSubmitStaff = () => {
    if (!staffForm.name || !staffForm.email || !staffForm.role || !staffForm.department) {
      addToast('Please fill in required fields', 'error');
      return;
    }
    addStaff({
      id: `S${Date.now()}`,
      name: staffForm.name,
      role: staffForm.role,
      department: staffForm.department,
      email: staffForm.email,
      phone: staffForm.phone,
      status: 'active',
      avatar: staffForm.name.split(' ').map(n => n[0]).join('').toUpperCase(),
      type: staffForm.type,
      joinDate: new Date().toISOString().split('T')[0],
      certifications: [],
    });
    addToast(`Staff member ${staffForm.name} added successfully`, 'success');
    handleClose();
  };

  const renderForm = () => {
    switch (selectedType) {
      case 'patient':
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-white/70 mb-2">
                  Full Name <span className="text-amc-red">*</span>
                </label>
                <input
                  type="text"
                  value={patientForm.name}
                  onChange={(e) => setPatientForm({ ...patientForm, name: e.target.value })}
                  placeholder="Enter patient name"
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/30 focus:outline-none focus:border-amc-teal"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-white/70 mb-2">
                  Age <span className="text-amc-red">*</span>
                </label>
                <input
                  type="number"
                  value={patientForm.age}
                  onChange={(e) => setPatientForm({ ...patientForm, age: e.target.value })}
                  placeholder="Age"
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/30 focus:outline-none focus:border-amc-teal"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-white/70 mb-2">Gender</label>
                <select
                  value={patientForm.gender}
                  onChange={(e) => setPatientForm({ ...patientForm, gender: e.target.value })}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-amc-teal"
                >
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-white/70 mb-2">Phone</label>
                <input
                  type="tel"
                  value={patientForm.phone}
                  onChange={(e) => setPatientForm({ ...patientForm, phone: e.target.value })}
                  placeholder="+233 XX XXX XXXX"
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/30 focus:outline-none focus:border-amc-teal"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-white/70 mb-2">
                Department <span className="text-amc-red">*</span>
              </label>
              <select
                value={patientForm.department}
                onChange={(e) => setPatientForm({ ...patientForm, department: e.target.value })}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-amc-teal"
              >
                <option value="">Select department</option>
                {departmentData.map((dept) => (
                  <option key={dept.id} value={dept.name}>{dept.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-white/70 mb-2">Condition/Complaint</label>
              <textarea
                value={patientForm.condition}
                onChange={(e) => setPatientForm({ ...patientForm, condition: e.target.value })}
                placeholder="Brief description of condition"
                rows={2}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/30 focus:outline-none focus:border-amc-teal resize-none"
              />
            </div>
            <div className="flex gap-3 pt-4">
              <Button variant="secondary" className="flex-1" onClick={() => setSelectedType(null)}>
                Back
              </Button>
              <Button className="flex-1" onClick={handleSubmitPatient}>
                Register Patient
              </Button>
            </div>
          </div>
        );

      case 'appointment':
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-white/70 mb-2">
                Patient Name <span className="text-amc-red">*</span>
              </label>
              <input
                type="text"
                value={appointmentForm.patientName}
                onChange={(e) => setAppointmentForm({ ...appointmentForm, patientName: e.target.value })}
                placeholder="Enter patient name"
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/30 focus:outline-none focus:border-amc-teal"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-white/70 mb-2">
                  Doctor <span className="text-amc-red">*</span>
                </label>
                <select
                  value={appointmentForm.doctor}
                  onChange={(e) => setAppointmentForm({ ...appointmentForm, doctor: e.target.value })}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-amc-teal"
                >
                  <option value="">Select doctor</option>
                  {staffData.filter(s => s.type === 'doctor').map((doc) => (
                    <option key={doc.id} value={doc.name}>{doc.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-white/70 mb-2">Department</label>
                <select
                  value={appointmentForm.department}
                  onChange={(e) => setAppointmentForm({ ...appointmentForm, department: e.target.value })}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-amc-teal"
                >
                  <option value="">Select department</option>
                  {departmentData.map((dept) => (
                    <option key={dept.id} value={dept.name}>{dept.name}</option>
                  ))}
                </select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-white/70 mb-2">
                  Date <span className="text-amc-red">*</span>
                </label>
                <input
                  type="date"
                  value={appointmentForm.date}
                  onChange={(e) => setAppointmentForm({ ...appointmentForm, date: e.target.value })}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-amc-teal"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-white/70 mb-2">
                  Time <span className="text-amc-red">*</span>
                </label>
                <input
                  type="time"
                  value={appointmentForm.time}
                  onChange={(e) => setAppointmentForm({ ...appointmentForm, time: e.target.value })}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-amc-teal"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-white/70 mb-2">Reason for Visit</label>
              <textarea
                value={appointmentForm.reason}
                onChange={(e) => setAppointmentForm({ ...appointmentForm, reason: e.target.value })}
                placeholder="Brief description"
                rows={2}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/30 focus:outline-none focus:border-amc-teal resize-none"
              />
            </div>
            <div className="flex gap-3 pt-4">
              <Button variant="secondary" className="flex-1" onClick={() => setSelectedType(null)}>
                Back
              </Button>
              <Button className="flex-1" onClick={handleSubmitAppointment}>
                Schedule Appointment
              </Button>
            </div>
          </div>
        );

      case 'leave':
        return (
          <div className="space-y-4">
            <div className="p-4 rounded-xl bg-amc-blue/10 border border-amc-blue/20">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-amc-blue/20 flex items-center justify-center">
                  {user?.avatar || user?.name?.charAt(0)}
                </div>
                <div>
                  <div className="font-medium">{user?.name}</div>
                  <div className="text-sm text-white/50">Submitting leave request</div>
                </div>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-white/70 mb-2">
                Leave Type <span className="text-amc-red">*</span>
              </label>
              <select
                value={leaveForm.type}
                onChange={(e) => setLeaveForm({ ...leaveForm, type: e.target.value })}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-amc-teal"
              >
                {LEAVE_TYPES.map((type) => (
                  <option key={type.id} value={type.id}>{type.label}</option>
                ))}
              </select>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-white/70 mb-2">
                  Start Date <span className="text-amc-red">*</span>
                </label>
                <input
                  type="date"
                  value={leaveForm.startDate}
                  onChange={(e) => setLeaveForm({ ...leaveForm, startDate: e.target.value })}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-amc-teal"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-white/70 mb-2">
                  End Date <span className="text-amc-red">*</span>
                </label>
                <input
                  type="date"
                  value={leaveForm.endDate}
                  onChange={(e) => setLeaveForm({ ...leaveForm, endDate: e.target.value })}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-amc-teal"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-white/70 mb-2">
                Reason <span className="text-amc-red">*</span>
              </label>
              <textarea
                value={leaveForm.reason}
                onChange={(e) => setLeaveForm({ ...leaveForm, reason: e.target.value })}
                placeholder="Explain the reason for your leave request"
                rows={3}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/30 focus:outline-none focus:border-amc-teal resize-none"
              />
            </div>
            <div className="flex gap-3 pt-4">
              <Button variant="secondary" className="flex-1" onClick={() => setSelectedType(null)}>
                Back
              </Button>
              <Button className="flex-1" onClick={handleSubmitLeave}>
                Submit Request
              </Button>
            </div>
          </div>
        );

      case 'staff':
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-white/70 mb-2">
                  Full Name <span className="text-amc-red">*</span>
                </label>
                <input
                  type="text"
                  value={staffForm.name}
                  onChange={(e) => setStaffForm({ ...staffForm, name: e.target.value })}
                  placeholder="Enter full name"
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/30 focus:outline-none focus:border-amc-teal"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-white/70 mb-2">
                  Staff Type <span className="text-amc-red">*</span>
                </label>
                <select
                  value={staffForm.type}
                  onChange={(e) => setStaffForm({ ...staffForm, type: e.target.value as any })}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-amc-teal"
                >
                  <option value="doctor">Doctor</option>
                  <option value="nurse">Nurse</option>
                  <option value="tech">Technician</option>
                  <option value="admin">Administrative</option>
                </select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-white/70 mb-2">
                  Email <span className="text-amc-red">*</span>
                </label>
                <input
                  type="email"
                  value={staffForm.email}
                  onChange={(e) => setStaffForm({ ...staffForm, email: e.target.value })}
                  placeholder="email@amc.com"
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/30 focus:outline-none focus:border-amc-teal"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-white/70 mb-2">Phone</label>
                <input
                  type="tel"
                  value={staffForm.phone}
                  onChange={(e) => setStaffForm({ ...staffForm, phone: e.target.value })}
                  placeholder="+233 XX XXX XXXX"
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/30 focus:outline-none focus:border-amc-teal"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-white/70 mb-2">
                  Role <span className="text-amc-red">*</span>
                </label>
                <select
                  value={staffForm.role}
                  onChange={(e) => setStaffForm({ ...staffForm, role: e.target.value })}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-amc-teal"
                >
                  <option value="">Select role</option>
                  {STAFF_ROLES.map((role) => (
                    <option key={role} value={role}>{role}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-white/70 mb-2">
                  Department <span className="text-amc-red">*</span>
                </label>
                <select
                  value={staffForm.department}
                  onChange={(e) => setStaffForm({ ...staffForm, department: e.target.value })}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-amc-teal"
                >
                  <option value="">Select department</option>
                  {departmentData.map((dept) => (
                    <option key={dept.id} value={dept.name}>{dept.name}</option>
                  ))}
                </select>
              </div>
            </div>
            <div className="flex gap-3 pt-4">
              <Button variant="secondary" className="flex-1" onClick={() => setSelectedType(null)}>
                Back
              </Button>
              <Button className="flex-1" onClick={handleSubmitStaff}>
                Add Staff Member
              </Button>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title={selectedType ? `Add ${quickAddOptions.find(o => o.id === selectedType)?.label}` : 'Quick Add'}
      size={selectedType ? 'md' : 'lg'}
    >
      {!selectedType ? (
        <div className="grid grid-cols-2 gap-4">
          {availableOptions.map((option) => (
            <button
              key={option.id}
              onClick={() => setSelectedType(option.id as QuickAddType)}
              className="p-6 rounded-xl bg-white/[0.02] border border-white/[0.05] hover:bg-white/[0.05] hover:border-white/10 transition-all text-left group"
            >
              <div
                className="w-14 h-14 rounded-xl flex items-center justify-center mb-4 transition-transform group-hover:scale-110"
                style={{ backgroundColor: `${option.color}20`, color: option.color }}
              >
                {option.icon}
              </div>
              <div className="font-semibold text-lg mb-1">{option.label}</div>
              <div className="text-sm text-white/50">{option.description}</div>
            </button>
          ))}
          {availableOptions.length === 0 && (
            <div className="col-span-2 text-center py-8 text-white/50">
              You don't have permission to add any items.
            </div>
          )}
        </div>
      ) : (
        renderForm()
      )}
    </Modal>
  );
};

export default QuickAddModal;
