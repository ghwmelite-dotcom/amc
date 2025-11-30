import {
  LayoutDashboard,
  Calendar,
  Users,
  Building2,
  CalendarOff,
  BarChart3,
  UserPlus,
  AlertTriangle,
  Settings
} from 'lucide-react';
import { NavItem } from '../types';

export const NAV_ITEMS: NavItem[] = [
  { id: 'dashboard', icon: LayoutDashboard, label: 'Dashboard', color: '#00D4AA', path: '/' },
  { id: 'schedule', icon: Calendar, label: 'Schedule', color: '#0066FF', path: '/schedule' },
  { id: 'staff', icon: Users, label: 'Staff', color: '#667EEA', path: '/staff' },
  { id: 'departments', icon: Building2, label: 'Departments', color: '#FF6B35', path: '/departments' },
  { id: 'leave', icon: CalendarOff, label: 'Leave', color: '#FFB020', path: '/leave' },
  { id: 'reports', icon: BarChart3, label: 'Analytics', color: '#00D26A', path: '/reports' },
  { id: 'patients', icon: UserPlus, label: 'Patients', color: '#FF6B7A', path: '/patients' },
  { id: 'emergency', icon: AlertTriangle, label: 'Emergency', color: '#FF4757', path: '/emergency' },
  { id: 'settings', icon: Settings, label: 'Settings', color: '#9B59B6', path: '/settings' },
];

export const SHIFT_TIMES = {
  morning: { start: '06:00', end: '14:00', label: 'Morning Shift' },
  afternoon: { start: '14:00', end: '22:00', label: 'Afternoon Shift' },
  night: { start: '22:00', end: '06:00', label: 'Night Shift' },
};

export const LEAVE_TYPES = [
  { id: 'annual', label: 'Annual Leave', color: '#0066FF' },
  { id: 'sick', label: 'Sick Leave', color: '#FF6B35' },
  { id: 'maternity', label: 'Maternity Leave', color: '#FF6B7A' },
  { id: 'emergency', label: 'Emergency Leave', color: '#FF4757' },
  { id: 'unpaid', label: 'Unpaid Leave', color: '#6B7280' },
];

export const PATIENT_STATUSES = [
  { id: 'waiting', label: 'Waiting', color: '#0066FF' },
  { id: 'in-consultation', label: 'In Consultation', color: '#00D4AA' },
  { id: 'completed', label: 'Completed', color: '#00D26A' },
  { id: 'admitted', label: 'Admitted', color: '#FF6B35' },
];

export const STAFF_ROLES = [
  'Medical Officer',
  'Consultant',
  'Specialist',
  'Nurse',
  'Lab Technician',
  'Pharmacist',
  'Radiologist',
  'Receptionist',
  'Administrator',
];

export const HOSPITAL_INFO = {
  name: 'Accra Medical Centre',
  shortName: 'AMC',
  founded: 'November 22, 2011',
  opened: 'February 2012',
  location: '6 Angola Close, Ringway, Osu, Accra',
  secondHub: 'Takoradi (Western Region)',
  phone: '+233 30 279 3333',
  email: 'info@accramedicalcentre.com',
  website: 'www.accramedicalcentre.com',
  ceo: 'Dr. Cynthia Opoku-Akoto',
  staffCount: 219,
  patientsPerYear: 90000,
  targetPatients: 120000,
  operatingHours: '24/7, including holidays',
};

export const THEME_COLORS = {
  primary: {
    teal: '#00D4AA',
    blue: '#0066FF',
    purple: '#667EEA',
  },
  status: {
    success: '#00D26A',
    warning: '#FFB020',
    danger: '#FF4757',
    info: '#0066FF',
  },
  accent: {
    orange: '#FF6B35',
    yellow: '#FFD93D',
    pink: '#FF6B7A',
  },
  background: {
    dark: '#05080F',
    darker: '#0a0f18',
    card: 'rgba(255, 255, 255, 0.02)',
    cardHover: 'rgba(255, 255, 255, 0.04)',
  },
  text: {
    primary: '#ffffff',
    secondary: 'rgba(255, 255, 255, 0.7)',
    muted: 'rgba(255, 255, 255, 0.5)',
    disabled: 'rgba(255, 255, 255, 0.3)',
  },
  border: {
    default: 'rgba(255, 255, 255, 0.06)',
    hover: 'rgba(255, 255, 255, 0.1)',
    active: 'rgba(255, 255, 255, 0.15)',
  },
};
