import { create } from 'zustand';
import { Alert, Staff, Patient, LeaveRequest } from '../types';
import { alertData, staffData, patientData, leaveRequestData } from '../data/mockData';

interface AppState {
  // Sidebar state
  sidebarExpanded: boolean;
  setSidebarExpanded: (expanded: boolean) => void;

  // Notifications
  notifications: Alert[];
  showNotifications: boolean;
  setShowNotifications: (show: boolean) => void;
  markNotificationRead: (id: string) => void;
  dismissNotification: (id: string) => void;

  // Staff
  staff: Staff[];
  addStaff: (staff: Staff) => void;
  updateStaff: (id: string, data: Partial<Staff>) => void;

  // Patients
  patients: Patient[];
  addPatient: (patient: Patient) => void;
  updatePatient: (id: string, data: Partial<Patient>) => void;

  // Leave Requests
  leaveRequests: LeaveRequest[];
  addLeaveRequest: (request: LeaveRequest) => void;
  approveLeave: (id: string) => void;
  rejectLeave: (id: string) => void;

  // Settings
  soundEnabled: boolean;
  setSoundEnabled: (enabled: boolean) => void;

  // Modal state
  activeModal: string | null;
  modalData: unknown;
  openModal: (modalId: string, data?: unknown) => void;
  closeModal: () => void;

  // Toast
  toasts: Array<{ id: string; message: string; type: 'success' | 'error' | 'info' }>;
  addToast: (message: string, type: 'success' | 'error' | 'info') => void;
  removeToast: (id: string) => void;
}

export const useAppStore = create<AppState>((set) => ({
  // Sidebar
  sidebarExpanded: false,
  setSidebarExpanded: (expanded) => set({ sidebarExpanded: expanded }),

  // Notifications
  notifications: alertData,
  showNotifications: false,
  setShowNotifications: (show) => set({ showNotifications: show }),
  markNotificationRead: (id) =>
    set((state) => ({
      notifications: state.notifications.map((n) =>
        n.id === id ? { ...n, read: true } : n
      ),
    })),
  dismissNotification: (id) =>
    set((state) => ({
      notifications: state.notifications.filter((n) => n.id !== id),
    })),

  // Staff
  staff: staffData,
  addStaff: (staff) =>
    set((state) => ({ staff: [...state.staff, staff] })),
  updateStaff: (id, data) =>
    set((state) => ({
      staff: state.staff.map((s) => (s.id === id ? { ...s, ...data } : s)),
    })),

  // Patients
  patients: patientData,
  addPatient: (patient) =>
    set((state) => ({ patients: [...state.patients, patient] })),
  updatePatient: (id, data) =>
    set((state) => ({
      patients: state.patients.map((p) => (p.id === id ? { ...p, ...data } : p)),
    })),

  // Leave Requests
  leaveRequests: leaveRequestData,
  addLeaveRequest: (request) =>
    set((state) => ({ leaveRequests: [...state.leaveRequests, request] })),
  approveLeave: (id) =>
    set((state) => ({
      leaveRequests: state.leaveRequests.map((l) =>
        l.id === id ? { ...l, status: 'approved' as const } : l
      ),
    })),
  rejectLeave: (id) =>
    set((state) => ({
      leaveRequests: state.leaveRequests.map((l) =>
        l.id === id ? { ...l, status: 'rejected' as const } : l
      ),
    })),

  // Settings
  soundEnabled: true,
  setSoundEnabled: (enabled) => set({ soundEnabled: enabled }),

  // Modal
  activeModal: null,
  modalData: null,
  openModal: (modalId, data = null) => set({ activeModal: modalId, modalData: data }),
  closeModal: () => set({ activeModal: null, modalData: null }),

  // Toast
  toasts: [],
  addToast: (message, type) =>
    set((state) => ({
      toasts: [...state.toasts, { id: Date.now().toString(), message, type }],
    })),
  removeToast: (id) =>
    set((state) => ({
      toasts: state.toasts.filter((t) => t.id !== id),
    })),
}));

export default useAppStore;
