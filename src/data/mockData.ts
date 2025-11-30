import { Staff, Patient, Department, Alert, LeaveRequest, Shift, Appointment, DayData } from '../types';

export const staffData: Staff[] = [
  { id: '1', name: 'Dr. Cynthia Opoku-Akoto', role: 'CEO / Consultant', department: 'Administration', status: 'active', avatar: 'CO', type: 'doctor', email: 'cynthia@amc.gh', phone: '+233 24 123 4567', certifications: ['MD', 'FWACP'], joinDate: '2011-11-22' },
  { id: '2', name: 'Dr. Kwame Asante', role: 'Medical Officer', department: 'Emergency', status: 'active', avatar: 'KA', type: 'doctor', email: 'kwame.asante@amc.gh', phone: '+233 24 234 5678', certifications: ['MD', 'BLS', 'ACLS'], joinDate: '2015-03-10' },
  { id: '3', name: 'Dr. Kwesi Amponsah', role: 'ICU Specialist', department: 'ICU/HDU', status: 'active', avatar: 'KW', type: 'doctor', email: 'kwesi.amp@amc.gh', phone: '+233 24 345 6789', certifications: ['MD', 'Critical Care'], joinDate: '2016-07-15' },
  { id: '4', name: 'Dr. Ama Serwaa', role: 'Paediatrician', department: 'Paediatrics', status: 'active', avatar: 'AS', type: 'doctor', email: 'ama.serwaa@amc.gh', phone: '+233 24 456 7890', certifications: ['MD', 'Paediatrics'], joinDate: '2017-01-20' },
  { id: '5', name: 'Abena Mensah', role: 'Emergency Nurse', department: 'Emergency', status: 'active', avatar: 'AM', type: 'nurse', email: 'abena.m@amc.gh', phone: '+233 24 567 8901', certifications: ['RN', 'BLS', 'ACLS'], joinDate: '2018-05-12' },
  { id: '6', name: 'Akosua Frimpong', role: 'ICU Nurse', department: 'ICU/HDU', status: 'on-leave', avatar: 'AF', type: 'nurse', email: 'akosua.f@amc.gh', phone: '+233 24 678 9012', certifications: ['RN', 'Critical Care'], joinDate: '2018-08-25' },
  { id: '7', name: 'Kwabena Ofori', role: 'Lab Technician', department: 'Laboratory', status: 'active', avatar: 'KO', type: 'tech', email: 'kwabena.o@amc.gh', phone: '+233 24 789 0123', certifications: ['MLT', 'Hematology'], joinDate: '2019-02-14' },
  { id: '8', name: 'Kojo Antwi', role: 'Pharmacist', department: 'Pharmacy', status: 'active', avatar: 'KJ', type: 'tech', email: 'kojo.a@amc.gh', phone: '+233 24 890 1234', certifications: ['PharmD'], joinDate: '2019-06-30' },
  { id: '9', name: 'Grace Amoah', role: 'Receptionist', department: 'Front Desk', status: 'active', avatar: 'GA', type: 'admin', email: 'grace.a@amc.gh', phone: '+233 24 901 2345', certifications: [], joinDate: '2020-01-10' },
  { id: '10', name: 'Yaw Mensah', role: 'Radiologist', department: 'Radiology', status: 'active', avatar: 'YM', type: 'tech', email: 'yaw.m@amc.gh', phone: '+233 24 012 3456', certifications: ['RT', 'CT', 'MRI'], joinDate: '2020-09-05' },
];

export const patientData: Patient[] = [
  { id: 'P001', name: 'Kofi Agyemang', age: 45, gender: 'male', phone: '+233 20 111 2222', department: 'Emergency', status: 'in-consultation', queueNumber: 1, waitTime: 5, assignedDoctor: 'Dr. Kwame Asante', visitReason: 'Chest pain' },
  { id: 'P002', name: 'Akua Boateng', age: 32, gender: 'female', phone: '+233 20 222 3333', department: 'Gynaecology', status: 'waiting', queueNumber: 2, waitTime: 15, visitReason: 'Prenatal checkup' },
  { id: 'P003', name: 'Yaw Owusu', age: 8, gender: 'male', phone: '+233 20 333 4444', department: 'Paediatrics', status: 'waiting', queueNumber: 3, waitTime: 20, visitReason: 'Fever and cough' },
  { id: 'P004', name: 'Ama Darko', age: 55, gender: 'female', phone: '+233 20 444 5555', department: 'Internal Medicine', status: 'completed', queueNumber: 4, waitTime: 0, assignedDoctor: 'Dr. Cynthia Opoku-Akoto', visitReason: 'Diabetes follow-up' },
  { id: 'P005', name: 'Kweku Mensah', age: 67, gender: 'male', phone: '+233 20 555 6666', department: 'Nephrology', status: 'admitted', queueNumber: 5, waitTime: 0, assignedDoctor: 'Dr. Kwesi Amponsah', visitReason: 'Kidney complications' },
  { id: 'P006', name: 'Adwoa Asante', age: 28, gender: 'female', phone: '+233 20 666 7777', department: 'ENT', status: 'waiting', queueNumber: 6, waitTime: 25, visitReason: 'Ear infection' },
  { id: 'P007', name: 'Nana Yeboah', age: 42, gender: 'male', phone: '+233 20 777 8888', department: 'Ophthalmology', status: 'in-consultation', queueNumber: 7, waitTime: 0, visitReason: 'Vision problems' },
  { id: 'P008', name: 'Efua Adjei', age: 35, gender: 'female', phone: '+233 20 888 9999', department: 'Gastroenterology', status: 'waiting', queueNumber: 8, waitTime: 30, visitReason: 'Stomach pain' },
];

export const departmentData: Department[] = [
  { id: 'D001', name: 'Emergency', icon: '🚑', color: '#FF4757', staffCount: 12, activeStaff: 8, patientCount: 15, coverage: 100, head: 'Dr. Kwame Asante', description: '24/7 Emergency Care' },
  { id: 'D002', name: 'ICU/HDU', icon: '💓', color: '#FF6B35', staffCount: 8, activeStaff: 5, patientCount: 6, coverage: 75, head: 'Dr. Kwesi Amponsah', description: 'Intensive & High Dependency Care' },
  { id: 'D003', name: 'Laboratory', icon: '🔬', color: '#667EEA', staffCount: 6, activeStaff: 4, patientCount: 0, coverage: 100, head: 'Kwabena Ofori', description: 'Medical Testing Services' },
  { id: 'D004', name: 'Pharmacy', icon: '💊', color: '#00D26A', staffCount: 5, activeStaff: 3, patientCount: 0, coverage: 80, head: 'Kojo Antwi', description: 'Medication Services' },
  { id: 'D005', name: 'Radiology', icon: '📡', color: '#00D4AA', staffCount: 4, activeStaff: 3, patientCount: 0, coverage: 100, head: 'Yaw Mensah', description: 'CT, MRI, X-ray, Ultrasound' },
  { id: 'D006', name: 'Paediatrics', icon: '👶', color: '#FFD93D', staffCount: 10, activeStaff: 7, patientCount: 12, coverage: 95, head: 'Dr. Ama Serwaa', description: 'Child Healthcare' },
  { id: 'D007', name: 'Gynaecology', icon: '🩺', color: '#FF6B7A', staffCount: 8, activeStaff: 6, patientCount: 10, coverage: 90, head: 'Dr. Ama Serwaa', description: 'Women\'s Health' },
  { id: 'D008', name: 'Internal Medicine', icon: '💉', color: '#0066FF', staffCount: 12, activeStaff: 9, patientCount: 18, coverage: 92, head: 'Dr. Cynthia Opoku-Akoto', description: 'General Adult Medicine' },
  { id: 'D009', name: 'Nephrology', icon: '🫘', color: '#9B59B6', staffCount: 4, activeStaff: 3, patientCount: 5, coverage: 85, head: 'Dr. Kwesi Amponsah', description: 'Kidney Care' },
  { id: 'D010', name: 'ENT', icon: '👂', color: '#3498DB', staffCount: 4, activeStaff: 3, patientCount: 8, coverage: 88, head: 'Dr. Kwame Asante', description: 'Ear, Nose & Throat' },
  { id: 'D011', name: 'Ophthalmology', icon: '👁', color: '#1ABC9C', staffCount: 3, activeStaff: 2, patientCount: 6, coverage: 80, head: 'Dr. Ama Serwaa', description: 'Eye Care' },
  { id: 'D012', name: 'Gastroenterology', icon: '🫃', color: '#E67E22', staffCount: 4, activeStaff: 3, patientCount: 7, coverage: 90, head: 'Dr. Cynthia Opoku-Akoto', description: 'Digestive System Care' },
];

export const alertData: Alert[] = [
  { id: 'A001', type: 'critical', icon: '🚨', title: 'ICU Night Understaffed', description: '1/2 nurses scheduled for night shift', time: '10m ago', read: false },
  { id: 'A002', type: 'warning', icon: '⚠️', title: 'Certifications Expiring', description: '3 BLS certifications expire this week', time: '1h ago', read: false },
  { id: 'A003', type: 'info', icon: '🔄', title: 'Shift Swap Request', description: 'Kofi Mensah requests evening shift swap', time: '2h ago', read: false },
  { id: 'A004', type: 'success', icon: '✅', title: 'Leave Approved', description: 'Grace Amoah - Dec 5-10', time: '3h ago', read: true },
  { id: 'A005', type: 'warning', icon: '💊', title: 'Low Inventory Alert', description: 'Paracetamol stock below threshold', time: '4h ago', read: false },
];

export const leaveRequestData: LeaveRequest[] = [
  { id: 'L001', staffId: '6', staffName: 'Akosua Frimpong', staffRole: 'ICU Nurse', department: 'ICU/HDU', type: 'annual', startDate: '2025-12-01', endDate: '2025-12-05', status: 'approved', reason: 'Family vacation', appliedDate: '2025-11-20' },
  { id: 'L002', staffId: '9', staffName: 'Grace Amoah', staffRole: 'Receptionist', department: 'Front Desk', type: 'annual', startDate: '2025-12-05', endDate: '2025-12-10', status: 'approved', reason: 'Wedding ceremony', appliedDate: '2025-11-15' },
  { id: 'L003', staffId: '5', staffName: 'Abena Mensah', staffRole: 'Emergency Nurse', department: 'Emergency', type: 'sick', startDate: '2025-12-02', endDate: '2025-12-03', status: 'pending', reason: 'Medical checkup', appliedDate: '2025-11-28' },
  { id: 'L004', staffId: '7', staffName: 'Kwabena Ofori', staffRole: 'Lab Technician', department: 'Laboratory', type: 'emergency', startDate: '2025-12-10', endDate: '2025-12-12', status: 'pending', reason: 'Family emergency', appliedDate: '2025-11-29' },
  { id: 'L005', staffId: '4', staffName: 'Dr. Ama Serwaa', staffRole: 'Paediatrician', department: 'Paediatrics', type: 'annual', startDate: '2025-12-20', endDate: '2025-12-27', status: 'pending', reason: 'Christmas holiday', appliedDate: '2025-11-25' },
];

export const shiftData: Shift[] = [
  { id: 'S001', staffId: '2', staffName: 'Dr. Kwame Asante', date: '2025-11-30', type: 'morning', startTime: '06:00', endTime: '14:00', department: 'Emergency', status: 'active' },
  { id: 'S002', staffId: '5', staffName: 'Abena Mensah', date: '2025-11-30', type: 'morning', startTime: '06:00', endTime: '14:00', department: 'Emergency', status: 'active' },
  { id: 'S003', staffId: '1', staffName: 'Dr. Cynthia Opoku-Akoto', date: '2025-11-30', type: 'morning', startTime: '08:00', endTime: '17:00', department: 'Administration', status: 'active' },
  { id: 'S004', staffId: '7', staffName: 'Kwabena Ofori', date: '2025-11-30', type: 'afternoon', startTime: '14:00', endTime: '22:00', department: 'Laboratory', status: 'scheduled' },
  { id: 'S005', staffId: '3', staffName: 'Dr. Kwesi Amponsah', date: '2025-11-30', type: 'night', startTime: '22:00', endTime: '06:00', department: 'ICU/HDU', status: 'scheduled' },
];

export const appointmentData: Appointment[] = [
  { id: 'AP001', patientId: 'P001', patientName: 'Kofi Agyemang', doctorId: '2', doctorName: 'Dr. Kwame Asante', department: 'Emergency', date: '2025-11-30', time: '09:00', status: 'in-progress', type: 'emergency' },
  { id: 'AP002', patientId: 'P002', patientName: 'Akua Boateng', doctorId: '4', doctorName: 'Dr. Ama Serwaa', department: 'Gynaecology', date: '2025-11-30', time: '10:00', status: 'scheduled', type: 'follow-up' },
  { id: 'AP003', patientId: 'P004', patientName: 'Ama Darko', doctorId: '1', doctorName: 'Dr. Cynthia Opoku-Akoto', department: 'Internal Medicine', date: '2025-11-30', time: '11:00', status: 'completed', type: 'consultation' },
  { id: 'AP004', patientId: 'P007', patientName: 'Nana Yeboah', doctorId: '4', doctorName: 'Dr. Ama Serwaa', department: 'Ophthalmology', date: '2025-11-30', time: '14:00', status: 'scheduled', type: 'consultation' },
  { id: 'AP005', patientId: 'P003', patientName: 'Yaw Owusu', doctorId: '4', doctorName: 'Dr. Ama Serwaa', department: 'Paediatrics', date: '2025-11-30', time: '15:00', status: 'scheduled', type: 'consultation' },
];

export const weekData: DayData[] = [
  { day: 'SAT', date: 30, shifts: 156, coverage: 94, alerts: 2, today: true },
  { day: 'SUN', date: 1, shifts: 142, coverage: 89, alerts: 1 },
  { day: 'MON', date: 2, shifts: 168, coverage: 97, alerts: 0 },
  { day: 'TUE', date: 3, shifts: 165, coverage: 95, alerts: 1 },
  { day: 'WED', date: 4, shifts: 158, coverage: 92, alerts: 0 },
  { day: 'THU', date: 5, shifts: 170, coverage: 98, alerts: 0 },
  { day: 'FRI', date: 6, shifts: 145, coverage: 85, alerts: 3 },
];

export const chartData = {
  coverage: [88, 92, 85, 94, 97, 91, 94, 89, 96, 94],
  shifts: [145, 152, 148, 165, 170, 158, 156, 142, 168, 165],
  patients: [320, 345, 312, 378, 395, 365, 350, 328, 382, 370],
  revenue: [45000, 52000, 48000, 55000, 58000, 51000, 53000, 49000, 56000, 54000],
};

export const hospitalStats = {
  totalStaff: 219,
  totalPatients: 90000,
  targetPatients: 120000,
  founded: '2011-11-22',
  openedDate: '2012-02-01',
  location: '6 Angola Close, Ringway, Osu, Accra',
  secondHub: 'Takoradi (Western Region)',
  operatingHours: '24/7',
  ceo: 'Dr. Cynthia Opoku-Akoto',
};
