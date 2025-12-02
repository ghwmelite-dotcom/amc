import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { generateChatResponse } from '../services/aiService';

export interface AIMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  type?: 'answer' | 'lookup' | 'suggestion' | 'alert' | 'summary';
  confidence?: number;
  sources?: string[];
}

export interface AIConversation {
  id: string;
  title: string;
  messages: AIMessage[];
  createdAt: string;
  updatedAt: string;
}

interface AIQuickAction {
  id: string;
  icon: string;
  label: string;
  prompt: string;
  category: 'protocols' | 'staff' | 'patients' | 'schedule' | 'drugs';
}

export const QUICK_ACTIONS: AIQuickAction[] = [
  { id: 'q1', icon: '🩸', label: 'Blood Transfusion Protocol', prompt: 'What is the blood transfusion protocol?', category: 'protocols' },
  { id: 'q2', icon: '💊', label: 'Drug Interactions', prompt: 'Check drug interactions for warfarin', category: 'drugs' },
  { id: 'q3', icon: '🌙', label: 'Night Shift Staff', prompt: 'Who is on night shift tonight?', category: 'schedule' },
  { id: 'q4', icon: '🛏️', label: 'Bed Availability', prompt: 'What is the current bed availability?', category: 'patients' },
  { id: 'q5', icon: '🚨', label: 'Code Blue Protocol', prompt: 'What is the Code Blue response protocol?', category: 'protocols' },
  { id: 'q6', icon: '💉', label: 'IV Insertion Guide', prompt: 'What is the IV insertion protocol?', category: 'protocols' },
  { id: 'q7', icon: '📊', label: 'Patient Statistics', prompt: 'How many patients are currently in the hospital?', category: 'patients' },
  { id: 'q8', icon: '🏥', label: 'Emergency Contacts', prompt: 'What are the emergency contact numbers?', category: 'protocols' },
  { id: 'q9', icon: '👨‍⚕️', label: 'Find Doctor', prompt: 'Find a doctor in the Emergency department', category: 'staff' },
  { id: 'q10', icon: '🧴', label: 'Hand Hygiene', prompt: 'What is the hand hygiene protocol?', category: 'protocols' },
  { id: 'q11', icon: '😷', label: 'Isolation Precautions', prompt: 'What are the isolation precautions?', category: 'protocols' },
  { id: 'q12', icon: '💊', label: 'Medication Rights', prompt: 'What are the 6 rights of medication administration?', category: 'drugs' },
];

interface AIChatState {
  conversations: AIConversation[];
  activeConversationId: string | null;
  isTyping: boolean;
  sidebarOpen: boolean;

  // Actions
  createConversation: () => string;
  setActiveConversation: (id: string) => void;
  sendMessage: (content: string, userName?: string) => Promise<void>;
  deleteConversation: (id: string) => void;
  clearAllConversations: () => void;
  toggleSidebar: () => void;
  getActiveConversation: () => AIConversation | null;
}

export const useAIChatStore = create<AIChatState>()(
  persist(
    (set, get) => ({
      conversations: [],
      activeConversationId: null,
      isTyping: false,
      sidebarOpen: true,

      createConversation: () => {
        const newConversation: AIConversation = {
          id: `conv_${Date.now()}`,
          title: 'New Conversation',
          messages: [],
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };

        set((state) => ({
          conversations: [newConversation, ...state.conversations],
          activeConversationId: newConversation.id,
        }));

        return newConversation.id;
      },

      setActiveConversation: (id) => {
        set({ activeConversationId: id });
      },

      sendMessage: async (content, userName) => {
        const state = get();
        let conversationId = state.activeConversationId;

        // Create new conversation if none exists
        if (!conversationId) {
          conversationId = get().createConversation();
        }

        const userMessage: AIMessage = {
          id: `msg_${Date.now()}`,
          role: 'user',
          content,
          timestamp: new Date().toISOString(),
        };

        // Add user message
        set((state) => ({
          conversations: state.conversations.map((conv) =>
            conv.id === conversationId
              ? {
                  ...conv,
                  messages: [...conv.messages, userMessage],
                  // Update title from first message
                  title: conv.messages.length === 0
                    ? content.slice(0, 40) + (content.length > 40 ? '...' : '')
                    : conv.title,
                  updatedAt: new Date().toISOString(),
                }
              : conv
          ),
          isTyping: true,
        }));

        try {
          // Generate AI response
          const response = await generateChatResponse(content, {
            userName,
            recentMessages: get()
              .conversations.find((c) => c.id === conversationId)
              ?.messages.slice(-10)
              .map((m) => m.content),
          });

          const aiMessage: AIMessage = {
            id: `msg_ai_${Date.now()}`,
            role: 'assistant',
            content: response.content,
            timestamp: new Date().toISOString(),
            type: response.type,
            confidence: response.confidence,
            sources: response.sources,
          };

          // Add AI response
          set((state) => ({
            conversations: state.conversations.map((conv) =>
              conv.id === conversationId
                ? {
                    ...conv,
                    messages: [...conv.messages, aiMessage],
                    updatedAt: new Date().toISOString(),
                  }
                : conv
            ),
            isTyping: false,
          }));
        } catch (error) {
          // Add error message
          const errorMessage: AIMessage = {
            id: `msg_err_${Date.now()}`,
            role: 'assistant',
            content: "I apologize, but I'm having trouble processing that request. Please try again.",
            timestamp: new Date().toISOString(),
            type: 'alert',
          };

          set((state) => ({
            conversations: state.conversations.map((conv) =>
              conv.id === conversationId
                ? {
                    ...conv,
                    messages: [...conv.messages, errorMessage],
                    updatedAt: new Date().toISOString(),
                  }
                : conv
            ),
            isTyping: false,
          }));
        }
      },

      deleteConversation: (id) => {
        set((state) => {
          const newConversations = state.conversations.filter((c) => c.id !== id);
          return {
            conversations: newConversations,
            activeConversationId:
              state.activeConversationId === id
                ? newConversations[0]?.id || null
                : state.activeConversationId,
          };
        });
      },

      clearAllConversations: () => {
        set({
          conversations: [],
          activeConversationId: null,
        });
      },

      toggleSidebar: () => {
        set((state) => ({ sidebarOpen: !state.sidebarOpen }));
      },

      getActiveConversation: () => {
        const state = get();
        return state.conversations.find((c) => c.id === state.activeConversationId) || null;
      },
    }),
    {
      name: 'amc-ai-chat',
      partialize: (state) => ({
        conversations: state.conversations,
        activeConversationId: state.activeConversationId,
      }),
    }
  )
);

export default useAIChatStore;
