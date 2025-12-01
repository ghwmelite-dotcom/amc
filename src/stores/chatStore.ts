import { create } from 'zustand';
import { ChatChannel, ChatMessage } from '../types';
import { staffData } from '../data/mockData';

// Generate mock chat data
const generateMockChannels = (): ChatChannel[] => {
  const now = new Date().toISOString();
  return [
    // Announcement channel
    {
      id: 'ch_announcements',
      name: 'Announcements',
      type: 'announcement',
      description: 'Hospital-wide announcements and updates',
      icon: '📢',
      color: '#FFD700',
      members: staffData.map(s => s.id),
      createdAt: '2025-01-01T00:00:00Z',
      lastActivity: now,
      unreadCount: 2,
      isPinned: true,
    },
    // Department channels
    {
      id: 'ch_emergency',
      name: 'Emergency Department',
      type: 'department',
      description: 'Emergency team coordination',
      icon: '🚑',
      color: '#FF4757',
      members: ['2', '5'],
      createdAt: '2025-01-01T00:00:00Z',
      lastActivity: now,
      unreadCount: 5,
      isPinned: true,
    },
    {
      id: 'ch_icu',
      name: 'ICU/HDU Team',
      type: 'department',
      description: 'Critical care coordination',
      icon: '💓',
      color: '#FF6B35',
      members: ['3', '6'],
      createdAt: '2025-01-01T00:00:00Z',
      lastActivity: now,
      unreadCount: 0,
    },
    {
      id: 'ch_lab',
      name: 'Laboratory',
      type: 'department',
      description: 'Lab results and requests',
      icon: '🔬',
      color: '#667EEA',
      members: ['7'],
      createdAt: '2025-01-01T00:00:00Z',
      lastActivity: now,
      unreadCount: 3,
    },
    {
      id: 'ch_pharmacy',
      name: 'Pharmacy',
      type: 'department',
      description: 'Medication queries and orders',
      icon: '💊',
      color: '#00D26A',
      members: ['8'],
      createdAt: '2025-01-01T00:00:00Z',
      lastActivity: now,
      unreadCount: 1,
    },
    // Group channels
    {
      id: 'ch_doctors',
      name: 'Doctors Lounge',
      type: 'group',
      description: 'Medical staff discussions',
      icon: '👨‍⚕️',
      color: '#00D4AA',
      members: ['1', '2', '3', '4'],
      createdAt: '2025-01-01T00:00:00Z',
      lastActivity: now,
      unreadCount: 0,
    },
    {
      id: 'ch_nurses',
      name: 'Nursing Station',
      type: 'group',
      description: 'Nursing team coordination',
      icon: '👩‍⚕️',
      color: '#FF6B7A',
      members: ['5', '6'],
      createdAt: '2025-01-01T00:00:00Z',
      lastActivity: now,
      unreadCount: 8,
    },
    {
      id: 'ch_management',
      name: 'Management',
      type: 'group',
      description: 'Administrative discussions',
      icon: '📋',
      color: '#9B59B6',
      members: ['1', '9'],
      createdAt: '2025-01-01T00:00:00Z',
      lastActivity: now,
      unreadCount: 0,
    },
  ];
};

const generateMockMessages = (): ChatMessage[] => {
  const baseTime = new Date();
  return [
    // Announcements
    {
      id: 'msg_1',
      channelId: 'ch_announcements',
      senderId: '1',
      senderName: 'Dr. Cynthia Opoku-Akoto',
      senderAvatar: 'CO',
      senderRole: 'CEO',
      content: 'Good morning everyone! Reminder that the quarterly staff meeting is tomorrow at 2 PM in the main conference room. Attendance is mandatory for department heads.',
      timestamp: new Date(baseTime.getTime() - 3600000 * 2).toISOString(),
      reactions: { '👍': ['2', '3', '5'], '✅': ['4', '7'] },
      isPinned: true,
    },
    {
      id: 'msg_2',
      channelId: 'ch_announcements',
      senderId: '1',
      senderName: 'Dr. Cynthia Opoku-Akoto',
      senderAvatar: 'CO',
      senderRole: 'CEO',
      content: 'Please welcome our new ICU specialist, Dr. Kwesi Amponsah! He joins us from Korle-Bu Teaching Hospital with over 10 years of experience in critical care medicine. 🎉',
      timestamp: new Date(baseTime.getTime() - 86400000).toISOString(),
      reactions: { '👋': ['2', '4', '5', '6', '7', '8', '9'], '🎉': ['3'] },
    },
    // Emergency Department
    {
      id: 'msg_3',
      channelId: 'ch_emergency',
      senderId: '2',
      senderName: 'Dr. Kwame Asante',
      senderAvatar: 'KA',
      senderRole: 'Medical Officer',
      content: 'Multiple trauma case incoming via ambulance. ETA 10 minutes. Need all hands on deck.',
      timestamp: new Date(baseTime.getTime() - 1800000).toISOString(),
      reactions: { '🚨': ['5'] },
    },
    {
      id: 'msg_4',
      channelId: 'ch_emergency',
      senderId: '5',
      senderName: 'Abena Mensah',
      senderAvatar: 'AM',
      senderRole: 'Emergency Nurse',
      content: 'Copy that. Preparing trauma bay now. Blood bank has been notified.',
      timestamp: new Date(baseTime.getTime() - 1700000).toISOString(),
    },
    {
      id: 'msg_5',
      channelId: 'ch_emergency',
      senderId: '2',
      senderName: 'Dr. Kwame Asante',
      senderAvatar: 'KA',
      senderRole: 'Medical Officer',
      content: 'Update: Patient is stable now. MVA victim, multiple fractures but no internal bleeding. Transferring to ortho.',
      timestamp: new Date(baseTime.getTime() - 600000).toISOString(),
      reactions: { '🙏': ['5', '1'], '✅': ['3'] },
    },
    // Lab channel
    {
      id: 'msg_6',
      channelId: 'ch_lab',
      senderId: '7',
      senderName: 'Kwabena Ofori',
      senderAvatar: 'KO',
      senderRole: 'Lab Technician',
      content: 'Urgent: Blood culture results for patient P003 (Yaw Owusu) show positive for bacterial infection. Recommending immediate antibiotic therapy.',
      timestamp: new Date(baseTime.getTime() - 900000).toISOString(),
      reactions: { '⚠️': ['4'] },
    },
    {
      id: 'msg_7',
      channelId: 'ch_lab',
      senderId: '4',
      senderName: 'Dr. Ama Serwaa',
      senderAvatar: 'AS',
      senderRole: 'Paediatrician',
      content: 'Thanks Kwabena! Starting IV antibiotics now. Please send sensitivity results when ready.',
      timestamp: new Date(baseTime.getTime() - 800000).toISOString(),
    },
    // Doctors Lounge
    {
      id: 'msg_8',
      channelId: 'ch_doctors',
      senderId: '3',
      senderName: 'Dr. Kwesi Amponsah',
      senderAvatar: 'KW',
      senderRole: 'ICU Specialist',
      content: 'Anyone available for a case consultation? Complex respiratory failure in ICU bed 3.',
      timestamp: new Date(baseTime.getTime() - 7200000).toISOString(),
    },
    {
      id: 'msg_9',
      channelId: 'ch_doctors',
      senderId: '1',
      senderName: 'Dr. Cynthia Opoku-Akoto',
      senderAvatar: 'CO',
      senderRole: 'CEO',
      content: 'I can come by in 30 minutes. What\'s the current O2 sat and ventilator settings?',
      timestamp: new Date(baseTime.getTime() - 7100000).toISOString(),
    },
    {
      id: 'msg_10',
      channelId: 'ch_doctors',
      senderId: '3',
      senderName: 'Dr. Kwesi Amponsah',
      senderAvatar: 'KW',
      senderRole: 'ICU Specialist',
      content: 'SpO2 at 88% on FiO2 100%, PEEP 14. Already tried proning. Sending you the full chart.',
      timestamp: new Date(baseTime.getTime() - 7000000).toISOString(),
      attachments: [{
        id: 'att_1',
        type: 'file',
        name: 'patient_chart_icubed3.pdf',
        url: '#',
        size: 245000,
      }],
    },
    // Nursing Station
    {
      id: 'msg_11',
      channelId: 'ch_nurses',
      senderId: '5',
      senderName: 'Abena Mensah',
      senderAvatar: 'AM',
      senderRole: 'Emergency Nurse',
      content: 'Shift handover at 6 PM. Please have your patient notes updated before then.',
      timestamp: new Date(baseTime.getTime() - 14400000).toISOString(),
      reactions: { '👍': ['6'] },
    },
    {
      id: 'msg_12',
      channelId: 'ch_nurses',
      senderId: '6',
      senderName: 'Akosua Frimpong',
      senderAvatar: 'AF',
      senderRole: 'ICU Nurse',
      content: 'Reminder: New IV protocol starts tomorrow. Training video is in the staff portal.',
      timestamp: new Date(baseTime.getTime() - 10800000).toISOString(),
      attachments: [{
        id: 'att_2',
        type: 'link',
        name: 'IV Protocol Training',
        url: '#',
        preview: 'New IV insertion and maintenance protocol...',
      }],
    },
    // Pharmacy
    {
      id: 'msg_13',
      channelId: 'ch_pharmacy',
      senderId: '8',
      senderName: 'Kojo Antwi',
      senderAvatar: 'KJ',
      senderRole: 'Pharmacist',
      content: '⚠️ Stock Alert: We\'re running low on Amoxicillin 500mg. Expected restock in 2 days. Please consider alternatives for non-critical cases.',
      timestamp: new Date(baseTime.getTime() - 5400000).toISOString(),
      isPinned: true,
    },
    // ICU Team
    {
      id: 'msg_14',
      channelId: 'ch_icu',
      senderId: '3',
      senderName: 'Dr. Kwesi Amponsah',
      senderAvatar: 'KW',
      senderRole: 'ICU Specialist',
      content: 'ICU rounds at 7 AM tomorrow. Please prepare patient summaries for beds 1-6.',
      timestamp: new Date(baseTime.getTime() - 3600000).toISOString(),
    },
    {
      id: 'msg_15',
      channelId: 'ch_icu',
      senderId: '6',
      senderName: 'Akosua Frimpong',
      senderAvatar: 'AF',
      senderRole: 'ICU Nurse',
      content: 'Noted. FYI - Bed 4 patient\'s family has requested a meeting. Should I schedule it after rounds?',
      timestamp: new Date(baseTime.getTime() - 3500000).toISOString(),
    },
  ];
};

interface ChatState {
  channels: ChatChannel[];
  messages: Record<string, ChatMessage[]>; // channelId -> messages
  activeChannelId: string | null;
  onlineUsers: Set<string>;
  typingUsers: Record<string, string[]>; // channelId -> userIds
  searchQuery: string;

  // Actions
  setActiveChannel: (channelId: string) => void;
  sendMessage: (channelId: string, content: string, senderId: string, senderName: string, senderAvatar: string, senderRole: string) => void;
  addReaction: (messageId: string, emoji: string, userId: string) => void;
  removeReaction: (messageId: string, emoji: string, userId: string) => void;
  markChannelRead: (channelId: string) => void;
  setSearchQuery: (query: string) => void;
  togglePinMessage: (messageId: string) => void;
  togglePinChannel: (channelId: string) => void;
  setUserOnline: (userId: string, online: boolean) => void;
  setTyping: (channelId: string, userId: string, isTyping: boolean) => void;
}

// Group messages by channel
const groupMessagesByChannel = (messages: ChatMessage[]): Record<string, ChatMessage[]> => {
  return messages.reduce((acc, msg) => {
    if (!acc[msg.channelId]) acc[msg.channelId] = [];
    acc[msg.channelId].push(msg);
    return acc;
  }, {} as Record<string, ChatMessage[]>);
};

export const useChatStore = create<ChatState>((set, get) => ({
  channels: generateMockChannels(),
  messages: groupMessagesByChannel(generateMockMessages()),
  activeChannelId: null,
  onlineUsers: new Set(['1', '2', '3', '5', '7', '8']), // Some users online by default
  typingUsers: {},
  searchQuery: '',

  setActiveChannel: (channelId) => {
    set({ activeChannelId: channelId });
    // Mark channel as read when opened
    get().markChannelRead(channelId);
  },

  sendMessage: (channelId, content, senderId, senderName, senderAvatar, senderRole) => {
    const newMessage: ChatMessage = {
      id: `msg_${Date.now()}`,
      channelId,
      senderId,
      senderName,
      senderAvatar,
      senderRole,
      content,
      timestamp: new Date().toISOString(),
    };

    set((state) => ({
      messages: {
        ...state.messages,
        [channelId]: [...(state.messages[channelId] || []), newMessage],
      },
      channels: state.channels.map(ch =>
        ch.id === channelId ? { ...ch, lastActivity: newMessage.timestamp } : ch
      ),
    }));
  },

  addReaction: (messageId, emoji, userId) => {
    set((state) => {
      const newMessages = { ...state.messages };
      for (const channelId in newMessages) {
        newMessages[channelId] = newMessages[channelId].map(msg => {
          if (msg.id === messageId) {
            const reactions = msg.reactions ? { ...msg.reactions } : {};
            if (!reactions[emoji]) reactions[emoji] = [];
            if (!reactions[emoji].includes(userId)) {
              reactions[emoji] = [...reactions[emoji], userId];
            }
            return { ...msg, reactions };
          }
          return msg;
        });
      }
      return { messages: newMessages };
    });
  },

  removeReaction: (messageId, emoji, userId) => {
    set((state) => {
      const newMessages = { ...state.messages };
      for (const channelId in newMessages) {
        newMessages[channelId] = newMessages[channelId].map(msg => {
          if (msg.id === messageId && msg.reactions?.[emoji]) {
            const reactions = { ...msg.reactions };
            reactions[emoji] = reactions[emoji].filter(id => id !== userId);
            if (reactions[emoji].length === 0) delete reactions[emoji];
            return { ...msg, reactions };
          }
          return msg;
        });
      }
      return { messages: newMessages };
    });
  },

  markChannelRead: (channelId) => {
    set((state) => ({
      channels: state.channels.map(ch =>
        ch.id === channelId ? { ...ch, unreadCount: 0 } : ch
      ),
    }));
  },

  setSearchQuery: (query) => set({ searchQuery: query }),

  togglePinMessage: (messageId) => {
    set((state) => {
      const newMessages = { ...state.messages };
      for (const channelId in newMessages) {
        newMessages[channelId] = newMessages[channelId].map(msg =>
          msg.id === messageId ? { ...msg, isPinned: !msg.isPinned } : msg
        );
      }
      return { messages: newMessages };
    });
  },

  togglePinChannel: (channelId) => {
    set((state) => ({
      channels: state.channels.map(ch =>
        ch.id === channelId ? { ...ch, isPinned: !ch.isPinned } : ch
      ),
    }));
  },

  setUserOnline: (userId, online) => {
    set((state) => {
      const newOnlineUsers = new Set(state.onlineUsers);
      if (online) {
        newOnlineUsers.add(userId);
      } else {
        newOnlineUsers.delete(userId);
      }
      return { onlineUsers: newOnlineUsers };
    });
  },

  setTyping: (channelId, userId, isTyping) => {
    set((state) => {
      const channelTyping = [...(state.typingUsers[channelId] || [])];
      if (isTyping && !channelTyping.includes(userId)) {
        channelTyping.push(userId);
      } else if (!isTyping) {
        const idx = channelTyping.indexOf(userId);
        if (idx > -1) channelTyping.splice(idx, 1);
      }
      return {
        typingUsers: { ...state.typingUsers, [channelId]: channelTyping },
      };
    });
  },
}));

export default useChatStore;
