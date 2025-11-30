import { format, formatDistanceToNow, parseISO, isToday, isTomorrow, isYesterday } from 'date-fns';

export const formatDate = (date: string | Date): string => {
  const d = typeof date === 'string' ? parseISO(date) : date;
  return format(d, 'MMM d, yyyy');
};

export const formatTime = (time: string): string => {
  const [hours, minutes] = time.split(':').map(Number);
  const period = hours >= 12 ? 'PM' : 'AM';
  const hour12 = hours % 12 || 12;
  return `${hour12}:${minutes.toString().padStart(2, '0')} ${period}`;
};

export const formatDateTime = (date: string | Date): string => {
  const d = typeof date === 'string' ? parseISO(date) : date;
  return format(d, 'MMM d, yyyy h:mm a');
};

export const formatRelativeTime = (date: string | Date): string => {
  const d = typeof date === 'string' ? parseISO(date) : date;
  return formatDistanceToNow(d, { addSuffix: true });
};

export const formatDayLabel = (date: string | Date): string => {
  const d = typeof date === 'string' ? parseISO(date) : date;
  if (isToday(d)) return 'Today';
  if (isTomorrow(d)) return 'Tomorrow';
  if (isYesterday(d)) return 'Yesterday';
  return format(d, 'EEEE');
};

export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-GH', {
    style: 'currency',
    currency: 'GHS',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

export const formatNumber = (num: number): string => {
  return new Intl.NumberFormat('en-GH').format(num);
};

export const formatPercentage = (value: number): string => {
  return `${Math.round(value)}%`;
};

export const getInitials = (name: string): string => {
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
};

export const getStatusColor = (status: string): string => {
  const colors: Record<string, string> = {
    active: '#00D26A',
    'on-leave': '#FFB020',
    'off-duty': '#6B7280',
    waiting: '#0066FF',
    'in-consultation': '#00D4AA',
    completed: '#00D26A',
    admitted: '#FF6B35',
    pending: '#FFB020',
    approved: '#00D26A',
    rejected: '#FF4757',
    scheduled: '#0066FF',
    'in-progress': '#00D4AA',
    cancelled: '#FF4757',
  };
  return colors[status] || '#6B7280';
};

export const getShiftColor = (shift: string): { bg: string; border: string; text: string } => {
  const colors: Record<string, { bg: string; border: string; text: string }> = {
    morning: {
      bg: 'rgba(255, 217, 61, 0.15)',
      border: 'rgba(255, 217, 61, 0.3)',
      text: '#FFD93D',
    },
    afternoon: {
      bg: 'rgba(0, 212, 170, 0.15)',
      border: 'rgba(0, 212, 170, 0.3)',
      text: '#00D4AA',
    },
    night: {
      bg: 'rgba(102, 126, 234, 0.15)',
      border: 'rgba(102, 126, 234, 0.3)',
      text: '#667EEA',
    },
  };
  return colors[shift.toLowerCase()] || colors.morning;
};

export const getTypeColor = (type: string): string => {
  const colors: Record<string, string> = {
    doctor: 'linear-gradient(135deg, #0066FF, #00D4AA)',
    nurse: 'linear-gradient(135deg, #00D26A, #00D4AA)',
    tech: 'linear-gradient(135deg, #667EEA, #764BA2)',
    admin: 'linear-gradient(135deg, #FF6B35, #FFB020)',
  };
  return colors[type] || colors.admin;
};
