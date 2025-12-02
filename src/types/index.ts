import { LucideIcon } from 'lucide-react';

// User Role Types
export type UserRole = 'ceo' | 'doctor' | 'nurse' | 'technician' | 'admin' | 'receptionist';

export interface UserPermissions {
  canViewDashboard: boolean;
  canViewAllStaff: boolean;
  canManageStaff: boolean;
  canViewPatients: boolean;
  canManagePatients: boolean;
  canViewSchedule: boolean;
  canManageSchedule: boolean;
  canApproveLeave: boolean;
  canViewReports: boolean;
  canViewEmergency: boolean;
  canManageEmergency: boolean;
  canViewCompliance: boolean;
  canManageCompliance: boolean;
  canViewIntegrations: boolean;
  canManageIntegrations: boolean;
  canViewChat: boolean;
  canAccessAdminSettings: boolean;
}

export interface AuthUser {
  id: string;
  staffId: string;
  name: string;
  email: string;
  role: UserRole;
  department: string;
  avatar: string;
  permissions: UserPermissions;
}

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

// Chat Types
export type ChatChannelType = 'department' | 'group' | 'direct' | 'announcement';

export interface ChatChannel {
  id: string;
  name: string;
  type: ChatChannelType;
  description?: string;
  icon?: string;
  color?: string;
  members: string[]; // Staff IDs
  createdAt: string;
  lastActivity?: string;
  unreadCount?: number;
  isPinned?: boolean;
}

export interface ChatMessage {
  id: string;
  channelId: string;
  senderId: string;
  senderName: string;
  senderAvatar: string;
  senderRole: string;
  content: string;
  timestamp: string;
  isEdited?: boolean;
  replyTo?: string;
  reactions?: Record<string, string[]>; // emoji -> list of user IDs
  attachments?: ChatAttachment[];
  isPinned?: boolean;
  isSystem?: boolean;
}

export interface ChatAttachment {
  id: string;
  type: 'image' | 'file' | 'link';
  name: string;
  url: string;
  size?: number;
  preview?: string;
}

export interface OnlineStatus {
  oderId: string;
  status: 'online' | 'away' | 'busy' | 'offline';
  lastSeen?: string;
}

export interface TypingIndicator {
  oderId: string;
  channelId: string;
  timestamp: number;
}

// AI Triage Types
export interface TriageData {
  symptoms: string;
  vitalSigns?: {
    temperature?: number;
    heartRate?: number;
    bloodPressureSystolic?: number;
    bloodPressureDiastolic?: number;
    oxygenSaturation?: number;
    respiratoryRate?: number;
  };
  painLevel?: number; // 1-10
  symptomDuration?: string;
  additionalNotes?: string;
}

export interface TriageResult {
  priorityScore: number;
  priorityLevel: 'critical' | 'high' | 'medium' | 'low';
  priorityColor: string;
  estimatedWaitTime: number;
  recommendedDepartment: string;
  reasoning: string[];
  alerts: string[];
  aiConfidence: number;
}

export interface PatientWithTriage extends Patient {
  triageData?: TriageData;
  triageResult?: TriageResult;
  triageTimestamp?: string;
}
