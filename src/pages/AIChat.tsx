import React, { useState, useRef, useEffect } from 'react';
import {
  Send,
  Plus,
  Trash2,
  MessageSquare,
  Bot,
  Sparkles,
  Brain,
  ChevronLeft,
  ChevronRight,
  BookOpen,
  AlertTriangle,
  X,
  Lightbulb,
  Pill,
  Calendar,
  Users,
  Activity,
} from 'lucide-react';
import { clsx } from 'clsx';
import Card3D from '../components/common/Card3D';
import Button from '../components/common/Button';
import Modal from '../components/common/Modal';
import { useAIChatStore, QUICK_ACTIONS, AIMessage } from '../stores/aiChatStore';
import { useAuth } from '../contexts/AuthContext';

const categoryIcons: Record<string, React.ReactNode> = {
  protocols: <BookOpen className="w-4 h-4" />,
  staff: <Users className="w-4 h-4" />,
  patients: <Activity className="w-4 h-4" />,
  schedule: <Calendar className="w-4 h-4" />,
  drugs: <Pill className="w-4 h-4" />,
};

const formatTime = (timestamp: string) => {
  const date = new Date(timestamp);
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));

  if (days === 0) {
    return date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
  } else if (days === 1) {
    return 'Yesterday';
  } else if (days < 7) {
    return date.toLocaleDateString('en-US', { weekday: 'short' });
  } else {
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  }
};

const AIChat: React.FC = () => {
  const { user } = useAuth();
  const {
    conversations,
    activeConversationId,
    isTyping,
    sidebarOpen,
    createConversation,
    setActiveConversation,
    sendMessage,
    deleteConversation,
    clearAllConversations,
    toggleSidebar,
  } = useAIChatStore();

  const [input, setInput] = useState('');
  const [showClearModal, setShowClearModal] = useState(false);
  const [showMobileSidebar, setShowMobileSidebar] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const activeConversation = conversations.find((c) => c.id === activeConversationId);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [activeConversation?.messages, isTyping]);

  // Focus input on load
  useEffect(() => {
    inputRef.current?.focus();
  }, [activeConversationId]);

  const handleSend = async () => {
    if (!input.trim() || isTyping) return;
    const message = input.trim();
    setInput('');
    await sendMessage(message, user?.name);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleQuickAction = async (prompt: string) => {
    setInput('');
    await sendMessage(prompt, user?.name);
  };

  const handleNewChat = () => {
    createConversation();
    setShowMobileSidebar(false);
  };

  const filteredQuickActions = selectedCategory
    ? QUICK_ACTIONS.filter((q) => q.category === selectedCategory)
    : QUICK_ACTIONS;

  const renderMessage = (message: AIMessage) => {
    const isUser = message.role === 'user';

    if (isUser) {
      return (
        <div key={message.id} className="flex justify-end mb-4 animate-fade-in">
          <div className="max-w-[80%] md:max-w-[70%]">
            <div className="px-4 py-3 rounded-2xl rounded-br-md bg-gradient-to-r from-amc-teal to-amc-blue text-white">
              <p className="text-sm whitespace-pre-wrap">{message.content}</p>
            </div>
            <div className="text-xs text-white/30 mt-1 text-right">
              {formatTime(message.timestamp)}
            </div>
          </div>
        </div>
      );
    }

    // AI Message
    return (
      <div key={message.id} className="flex gap-3 mb-6 animate-fade-in-up">
        {/* AI Avatar */}
        <div className="flex-shrink-0">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amc-purple via-purple-500 to-pink-500 flex items-center justify-center shadow-lg shadow-purple-500/20 animate-pulse-glow">
            <Bot className="w-5 h-5 text-white" />
          </div>
        </div>

        {/* Message Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-2">
            <span className="font-semibold text-sm bg-gradient-to-r from-amc-purple to-pink-400 bg-clip-text text-transparent">
              AMC AI Assistant
            </span>
            {message.confidence && (
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-amc-purple/20 text-amc-purple border border-amc-purple/30">
                {message.confidence}% confident
              </span>
            )}
          </div>

          {/* Message bubble */}
          <div className="relative group">
            <div className="absolute -inset-[1px] bg-gradient-to-r from-amc-purple/30 via-pink-500/30 to-amc-purple/30 rounded-2xl rounded-tl-md blur-sm opacity-50" />
            <div className="relative px-4 py-3 rounded-2xl rounded-tl-md bg-white/[0.03] border border-white/[0.08] backdrop-blur-sm">
              <div className="text-sm leading-relaxed text-white/90 whitespace-pre-wrap">
                {renderAIContent(message.content)}
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="flex items-center gap-4 mt-2 text-xs text-white/40">
            <span>{formatTime(message.timestamp)}</span>
            {message.sources && message.sources.length > 0 && (
              <div className="flex items-center gap-1">
                <BookOpen className="w-3 h-3" />
                <span>{message.sources.join(', ')}</span>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  const renderAIContent = (content: string) => {
    const lines = content.split('\n');

    return lines.map((line, i) => {
      // Bold headers
      if (line.startsWith('**') && line.endsWith('**')) {
        return (
          <div key={i} className="font-semibold text-white mt-3 mb-1 first:mt-0">
            {line.replace(/\*\*/g, '')}
          </div>
        );
      }

      // Headers with content
      if (line.includes('**') && line.includes(':')) {
        const parts = line.split('**');
        return (
          <div key={i} className="mt-2 first:mt-0">
            <span className="font-semibold text-white">{parts[1]}</span>
            <span className="text-white/80">{parts[2] || ''}</span>
          </div>
        );
      }

      // List items
      if (line.startsWith('- ') || line.startsWith('• ')) {
        return (
          <div key={i} className="flex items-start gap-2 ml-2 text-white/80">
            <span className="text-amc-purple mt-0.5">•</span>
            <span>{line.substring(2)}</span>
          </div>
        );
      }

      // Numbered list
      if (/^\d+\.\s/.test(line)) {
        const num = line.match(/^(\d+)\./)?.[1];
        return (
          <div key={i} className="flex items-start gap-2 ml-2 text-white/80">
            <span className="text-amc-purple font-medium min-w-[20px]">{num}.</span>
            <span>{line.replace(/^\d+\.\s/, '')}</span>
          </div>
        );
      }

      // Warning lines
      if (line.includes('⚠️') || line.toLowerCase().includes('warning')) {
        return (
          <div key={i} className="flex items-center gap-2 text-amc-yellow mt-2 bg-amc-yellow/10 px-3 py-2 rounded-lg">
            <AlertTriangle className="w-4 h-4 flex-shrink-0" />
            <span>{line.replace('⚠️', '').trim()}</span>
          </div>
        );
      }

      // Empty lines
      if (!line.trim()) return <div key={i} className="h-2" />;

      // Regular text
      return <div key={i} className="text-white/80">{line}</div>;
    });
  };

  return (
    <div className="h-[calc(100vh-140px)] md:h-[calc(100vh-180px)] flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amc-purple via-purple-500 to-pink-500 flex items-center justify-center shadow-lg shadow-purple-500/30">
            <Brain className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold flex items-center gap-2">
              AMC AI Assistant
              <span className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-amc-purple/20 border border-amc-purple/30 text-xs font-medium text-amc-purple">
                <Sparkles className="w-3 h-3" />
                BETA
              </span>
            </h1>
            <p className="text-sm text-white/50">Your intelligent hospital companion</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="secondary"
            size="sm"
            onClick={handleNewChat}
            icon={<Plus className="w-4 h-4" />}
            className="hidden md:flex"
          >
            New Chat
          </Button>
          <button
            onClick={() => setShowMobileSidebar(true)}
            className="md:hidden p-2.5 rounded-xl bg-white/5 hover:bg-white/10"
          >
            <MessageSquare className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex gap-4 overflow-hidden">
        {/* Mobile Sidebar Overlay */}
        {showMobileSidebar && (
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 md:hidden"
            onClick={() => setShowMobileSidebar(false)}
          />
        )}

        {/* Conversation Sidebar */}
        <Card3D
          intensity={6}
          className={clsx(
            'glass-card flex-col z-50',
            // Mobile: Fixed overlay
            'fixed inset-y-0 left-0 w-[85%] max-w-[300px] md:relative md:w-64',
            'transform transition-transform duration-300 md:transform-none',
            showMobileSidebar ? 'translate-x-0 flex' : '-translate-x-full md:translate-x-0',
            sidebarOpen ? 'md:flex' : 'md:hidden'
          )}
        >
          {/* Sidebar Header */}
          <div className="p-4 border-b border-white/10">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold">Conversations</h3>
              <button
                onClick={() => setShowMobileSidebar(false)}
                className="md:hidden p-2 rounded-lg hover:bg-white/10"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <Button
              variant="primary"
              size="sm"
              onClick={handleNewChat}
              icon={<Plus className="w-4 h-4" />}
              className="w-full"
            >
              New Chat
            </Button>
          </div>

          {/* Conversation List */}
          <div className="flex-1 overflow-y-auto p-2 space-y-1">
            {conversations.length === 0 ? (
              <div className="text-center py-8 text-white/40 text-sm">
                <MessageSquare className="w-8 h-8 mx-auto mb-2 opacity-50" />
                <p>No conversations yet</p>
              </div>
            ) : (
              conversations.map((conv) => (
                <button
                  key={conv.id}
                  onClick={() => {
                    setActiveConversation(conv.id);
                    setShowMobileSidebar(false);
                  }}
                  className={clsx(
                    'w-full flex items-start gap-3 p-3 rounded-xl text-left transition-colors group',
                    activeConversationId === conv.id
                      ? 'bg-amc-purple/20 border border-amc-purple/30'
                      : 'hover:bg-white/5'
                  )}
                >
                  <MessageSquare className="w-4 h-4 mt-0.5 text-amc-purple flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium truncate">{conv.title}</div>
                    <div className="text-xs text-white/40">{formatTime(conv.updatedAt)}</div>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteConversation(conv.id);
                    }}
                    className="p-1 rounded-lg opacity-0 group-hover:opacity-100 hover:bg-white/10 text-white/40 hover:text-amc-red"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </button>
              ))
            )}
          </div>

          {/* Sidebar Footer */}
          {conversations.length > 0 && (
            <div className="p-3 border-t border-white/10">
              <button
                onClick={() => setShowClearModal(true)}
                className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-xl text-sm text-white/50 hover:text-amc-red hover:bg-amc-red/10 transition-colors"
              >
                <Trash2 className="w-4 h-4" />
                Clear All
              </button>
            </div>
          )}
        </Card3D>

        {/* Sidebar Toggle (Desktop) */}
        <button
          onClick={toggleSidebar}
          className="hidden md:flex items-center justify-center w-6 h-12 my-auto rounded-r-lg bg-white/5 hover:bg-white/10 transition-colors"
        >
          {sidebarOpen ? (
            <ChevronLeft className="w-4 h-4" />
          ) : (
            <ChevronRight className="w-4 h-4" />
          )}
        </button>

        {/* Chat Area */}
        <Card3D intensity={6} className="flex-1 glass-card flex flex-col overflow-hidden">
          {activeConversation && activeConversation.messages.length > 0 ? (
            <>
              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-2">
                {activeConversation.messages.map((msg) => renderMessage(msg))}

                {/* Typing Indicator */}
                {isTyping && (
                  <div className="flex gap-3 mb-6 animate-fade-in">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amc-purple via-purple-500 to-pink-500 flex items-center justify-center">
                      <Bot className="w-5 h-5 text-white" />
                    </div>
                    <div className="flex items-center gap-2 px-4 py-3 rounded-2xl rounded-tl-md bg-white/[0.03] border border-white/[0.08]">
                      <Brain className="w-4 h-4 text-amc-purple animate-pulse" />
                      <span className="text-white/60 text-sm">Thinking</span>
                      <div className="flex gap-1">
                        <div className="w-2 h-2 rounded-full bg-amc-purple animate-bounce" style={{ animationDelay: '0ms' }} />
                        <div className="w-2 h-2 rounded-full bg-amc-purple animate-bounce" style={{ animationDelay: '150ms' }} />
                        <div className="w-2 h-2 rounded-full bg-amc-purple animate-bounce" style={{ animationDelay: '300ms' }} />
                      </div>
                    </div>
                  </div>
                )}

                <div ref={messagesEndRef} />
              </div>

              {/* Input Area */}
              <div className="p-4 border-t border-white/10">
                <div className="flex gap-3">
                  <textarea
                    ref={inputRef}
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={handleKeyPress}
                    placeholder="Ask me anything about protocols, schedules, drugs..."
                    rows={1}
                    className="flex-1 px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-white/40 focus:outline-none focus:border-amc-purple/50 resize-none"
                    style={{ maxHeight: '120px' }}
                    disabled={isTyping}
                  />
                  <button
                    onClick={handleSend}
                    disabled={!input.trim() || isTyping}
                    className={clsx(
                      'p-3 rounded-xl transition-all',
                      input.trim() && !isTyping
                        ? 'bg-gradient-to-r from-amc-purple to-pink-500 text-white shadow-lg shadow-purple-500/30'
                        : 'bg-white/10 text-white/30'
                    )}
                  >
                    <Send className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </>
          ) : (
            /* Empty State - Welcome Screen */
            <div className="flex-1 flex flex-col items-center justify-center p-6 overflow-y-auto">
              {/* Hero */}
              <div className="text-center mb-8">
                <div className="w-24 h-24 rounded-3xl bg-gradient-to-br from-amc-purple via-purple-500 to-pink-500 flex items-center justify-center mx-auto mb-6 shadow-2xl shadow-purple-500/30 animate-pulse-glow">
                  <Brain className="w-12 h-12 text-white" />
                </div>
                <h2 className="text-2xl font-bold mb-2">How can I help you today?</h2>
                <p className="text-white/50 max-w-md">
                  I'm your AI assistant for Accra Medical Centre. Ask me about protocols,
                  schedules, drug interactions, patient info, and more.
                </p>
              </div>

              {/* Category Filters */}
              <div className="flex flex-wrap justify-center gap-2 mb-6">
                <button
                  onClick={() => setSelectedCategory(null)}
                  className={clsx(
                    'px-4 py-2 rounded-full text-sm font-medium transition-colors',
                    !selectedCategory
                      ? 'bg-amc-purple text-white'
                      : 'bg-white/5 text-white/60 hover:bg-white/10'
                  )}
                >
                  All
                </button>
                {['protocols', 'drugs', 'schedule', 'staff', 'patients'].map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={clsx(
                      'flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-colors capitalize',
                      selectedCategory === cat
                        ? 'bg-amc-purple text-white'
                        : 'bg-white/5 text-white/60 hover:bg-white/10'
                    )}
                  >
                    {categoryIcons[cat]}
                    {cat}
                  </button>
                ))}
              </div>

              {/* Quick Actions Grid */}
              <div className="w-full max-w-3xl">
                <div className="text-sm text-white/40 mb-3 flex items-center gap-2">
                  <Lightbulb className="w-4 h-4" />
                  Quick prompts
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {filteredQuickActions.slice(0, 9).map((action) => (
                    <button
                      key={action.id}
                      onClick={() => handleQuickAction(action.prompt)}
                      disabled={isTyping}
                      className="flex items-center gap-3 p-4 rounded-xl bg-white/[0.03] border border-white/[0.06] hover:bg-white/[0.06] hover:border-amc-purple/30 transition-all text-left group"
                    >
                      <span className="text-2xl group-hover:scale-110 transition-transform">
                        {action.icon}
                      </span>
                      <span className="text-sm text-white/80 group-hover:text-white">
                        {action.label}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Input Area for Empty State */}
              <div className="w-full max-w-2xl mt-8">
                <div className="relative">
                  <textarea
                    ref={inputRef}
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={handleKeyPress}
                    placeholder="Type your question here..."
                    rows={2}
                    className="w-full px-5 py-4 pr-14 rounded-2xl bg-white/5 border border-white/10 text-white placeholder:text-white/40 focus:outline-none focus:border-amc-purple/50 resize-none"
                    disabled={isTyping}
                  />
                  <button
                    onClick={handleSend}
                    disabled={!input.trim() || isTyping}
                    className={clsx(
                      'absolute right-3 bottom-3 p-2.5 rounded-xl transition-all',
                      input.trim() && !isTyping
                        ? 'bg-gradient-to-r from-amc-purple to-pink-500 text-white shadow-lg shadow-purple-500/30'
                        : 'bg-white/10 text-white/30'
                    )}
                  >
                    <Send className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          )}
        </Card3D>
      </div>

      {/* Clear All Modal */}
      <Modal
        isOpen={showClearModal}
        onClose={() => setShowClearModal(false)}
        title="Clear All Conversations"
        size="sm"
      >
        <div className="space-y-4">
          <p className="text-white/70">
            Are you sure you want to delete all conversations? This action cannot be undone.
          </p>
          <div className="flex gap-3">
            <Button
              variant="secondary"
              className="flex-1"
              onClick={() => setShowClearModal(false)}
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              className="flex-1 !bg-amc-red"
              onClick={() => {
                clearAllConversations();
                setShowClearModal(false);
              }}
            >
              Delete All
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default AIChat;
