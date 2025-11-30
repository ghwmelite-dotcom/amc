import { LucideIcon } from 'lucide-react';

export interface Staff {
  id: string;
  name: string;
  role: string;
  department: string;
  status: 'active' | 'on-leave' | 'off-duty';
  avatar: string;
  type: 'doctor' | 'nurse' | 'tech' | 'admin';
  email: string;
  phone: string;
  certifications: string[];
  joinDate: string;
}

export interface Patient {
  id: string;
  name: string;
  age: number;
  gender: 'male' | 'female';
  phone: string;
  department: string;
  status: 'waiting' | 'in-consultation' | 'completed' | 'admitted';
  queueNumber: number;
  waitTime: number;
  assignedDoctor?: string;
  visitReason: string;
}

export interface Appointment {
  id: string;
  patientId: string;
  patientName: string;
  doctorId: string;
  doctorName: string;
  department: string;
  date: string;
  time: string;
  status: 'scheduled' | 'in-progress' | 'completed' | 'cancelled';
  type: 'consultation' | 'follow-up' | 'emergency';
}

export interface Department {
  id: string;
  name: string;
  icon: string;
  color: string;
  staffCount: number;
  activeStaff: number;
  patientCount: number;
  coverage: number;
  head: string;
  description: string;
}

export interface Alert {
  id: string;
  type: 'critical' | 'warning' | 'info' | 'success';
  icon: string;
  title: string;
  description: string;
  time: string;
  read: boolean;
}

export interface LeaveRequest {
  id: string;
  staffId: string;
  staffName: string;
  staffRole: string;
  department: string;
  type: 'annual' | 'sick' | 'maternity' | 'emergency' | 'unpaid';
  startDate: string;
  endDate: string;
  status: 'pending' | 'approved' | 'rejected';
  reason: string;
  appliedDate: string;
}

export interface Shift {
  id: string;
  staffId: string;
  staffName: string;
  date: string;
  type: 'morning' | 'afternoon' | 'night';
  startTime: string;
  endTime: string;
  department: string;
  status: 'scheduled' | 'active' | 'completed';
}

export interface DayData {
  day: string;
  date: number;
  shifts: number;
  coverage: number;
  alerts: number;
  today?: boolean;
}

export interface NavItem {
  id: string;
  icon: LucideIcon;
  label: string;
  color: string;
  path: string;
}

export interface StatCardProps {
  label: string;
  value: number;
  suffix?: string;
  icon: string;
  gradient: [string, string];
  trend: string;
  up: boolean;
  chartData: number[];
}
