import React, { useState, useRef, useEffect, useMemo } from 'react';
import {
  Send,
  Search,
  Hash,
  Users,
  MessageSquare,
  Megaphone,
  Pin,
  Smile,
  Paperclip,
  Phone,
  Video,
  Info,
  X
} from 'lucide-react';
import { clsx } from 'clsx';
import Card3D from '../components/common/Card3D';
import Avatar from '../components/common/Avatar';
import Badge from '../components/common/Badge';
import { useChatStore } from '../stores/chatStore';
import { useAuth } from '../contexts/AuthContext';
import { ChatChannel } from '../types';
import { staffData } from '../data/mockData';

const EMOJI_OPTIONS = ['👍', '❤️', '😂', '😮', '😢', '🎉', '🙏', '✅', '⚠️', '🚨'];

const channelIcons: Record<string, React.ReactNode> = {
  department: <Hash className="w-4 h-4" />,
  group: <Users className="w-4 h-4" />,
  direct: <MessageSquare className="w-4 h-4" />,
  announcement: <Megaphone className="w-4 h-4" />,
};

const formatFullTime = (timestamp: string) => {
  return new Date(timestamp).toLocaleString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  });
};

const Chat: React.FC = () => {
  const { user } = useAuth();
  const {
    channels,
    messages,
    activeChannelId,
    onlineUsers,
    typingUsers,
    searchQuery,
    setActiveChannel,
    sendMessage,
    addReaction,
    removeReaction,
    setSearchQuery,
    togglePinChannel,
  } = useChatStore();

  const [messageInput, setMessageInput] = useState('');
  const [showEmojiPicker, setShowEmojiPicker] = useState<string | null>(null);
  const [showChannelInfo, setShowChannelInfo] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const activeChannel = channels.find(ch => ch.id === activeChannelId);
  const channelMessages = activeChannelId ? (messages[activeChannelId] || []) : [];
  const channelTypingUsers = activeChannelId ? (typingUsers[activeChannelId] || []) : [];

  // Filter channels based on search
  const filteredChannels = useMemo(() => {
    if (!searchQuery) return channels;
    const query = searchQuery.toLowerCase();
    return channels.filter(ch => ch.name.toLowerCase().includes(query));
  }, [channels, searchQuery]);

  // Group channels by type
  const groupedChannels = useMemo(() => {
    const pinned = filteredChannels.filter(ch => ch.isPinned);
    const unpinned = filteredChannels.filter(ch => !ch.isPinned);

    return {
      pinned,
      announcements: unpinned.filter(ch => ch.type === 'announcement'),
      departments: unpinned.filter(ch => ch.type === 'department'),
      groups: unpinned.filter(ch => ch.type === 'group'),
      direct: unpinned.filter(ch => ch.type === 'direct'),
    };
  }, [filteredChannels]);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [channelMessages]);

  // Set first channel as active if none selected
  useEffect(() => {
    if (!activeChannelId && channels.length > 0) {
      setActiveChannel(channels[0].id);
    }
  }, [activeChannelId, channels, setActiveChannel]);

  const handleSendMessage = () => {
    if (!messageInput.trim() || !activeChannelId || !user) return;

    const staffInfo = staffData.find(s => s.id === user.staffId);
    sendMessage(
      activeChannelId,
      messageInput.trim(),
      user.staffId,
      user.name,
      user.avatar,
      staffInfo?.role || 'Staff'
    );
    setMessageInput('');
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleReaction = (messageId: string, emoji: string) => {
    if (!user) return;
    const msg = channelMessages.find(m => m.id === messageId);
    if (msg?.reactions?.[emoji]?.includes(user.staffId)) {
      removeReaction(messageId, emoji, user.staffId);
    } else {
      addReaction(messageId, emoji, user.staffId);
    }
    setShowEmojiPicker(null);
  };

  const getStaffType = (role: string): 'doctor' | 'nurse' | 'tech' | 'admin' => {
    const lowerRole = role.toLowerCase();
    if (lowerRole.includes('doctor') || lowerRole.includes('dr.') || lowerRole.includes('ceo') || lowerRole.includes('specialist') || lowerRole.includes('paediatrician') || lowerRole.includes('medical officer')) return 'doctor';
    if (lowerRole.includes('nurse')) return 'nurse';
    if (lowerRole.includes('tech') || lowerRole.includes('pharmacist') || lowerRole.includes('radiologist')) return 'tech';
    return 'admin';
  };

  const renderChannelList = (channelList: ChatChannel[], title?: string) => {
    if (channelList.length === 0) return null;

    return (
      <div className="mb-4">
        {title && (
          <div className="text-xs font-medium text-white/40 uppercase tracking-wider px-3 mb-2">
            {title}
          </div>
        )}
        {channelList.map(channel => (
          <button
            key={channel.id}
            onClick={() => setActiveChannel(channel.id)}
            className={clsx(
              'w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200',
              activeChannelId === channel.id
                ? 'bg-white/10 text-white'
                : 'text-white/60 hover:text-white hover:bg-white/5'
            )}
          >
            <div
              className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
              style={{
                backgroundColor: channel.color ? `${channel.color}20` : 'rgba(255,255,255,0.1)',
                color: channel.color || '#fff',
              }}
            >
              {channel.icon || channelIcons[channel.type]}
            </div>
            <div className="flex-1 text-left min-w-0">
              <div className="font-medium text-sm truncate flex items-center gap-1">
                {channel.name}
                {channel.isPinned && <Pin className="w-3 h-3 text-white/40" />}
              </div>
              {channel.description && (
                <div className="text-xs text-white/40 truncate">{channel.description}</div>
              )}
            </div>
            {channel.unreadCount ? (
              <div className="w-5 h-5 rounded-full bg-amc-red text-white text-xs font-bold flex items-center justify-center">
                {channel.unreadCount > 9 ? '9+' : channel.unreadCount}
              </div>
            ) : null}
          </button>
        ))}
      </div>
    );
  };

  const renderMessage = (message: ReturnType<typeof useChatStore.getState>['messages'][string][number], index: number) => {
    const prevMessage = channelMessages[index - 1];
    const showAvatar = !prevMessage || prevMessage.senderId !== message.senderId ||
      new Date(message.timestamp).getTime() - new Date(prevMessage.timestamp).getTime() > 300000;

    return (
      <div
        key={message.id}
        className={clsx(
          'group flex gap-3 px-4 py-1 hover:bg-white/[0.02] transition-colors',
          showAvatar ? 'mt-4' : 'mt-0.5'
        )}
      >
        {/* Avatar column */}
        <div className="w-10 flex-shrink-0">
          {showAvatar && (
            <Avatar
              name={message.senderName}
              initials={message.senderAvatar}
              type={getStaffType(message.senderRole)}
              size="md"
            />
          )}
        </div>

        {/* Message content */}
        <div className="flex-1 min-w-0">
          {showAvatar && (
            <div className="flex items-center gap-2 mb-1">
              <span className="font-semibold text-sm">{message.senderName}</span>
              <span className="text-xs text-white/40">{message.senderRole}</span>
              <span className="text-xs text-white/30">{formatFullTime(message.timestamp)}</span>
              {message.isPinned && (
                <Badge variant="warning" size="sm">
                  <Pin className="w-3 h-3 mr-1" />
                  Pinned
                </Badge>
              )}
            </div>
          )}

          {/* Message text */}
          <div className="text-sm text-white/90 leading-relaxed whitespace-pre-wrap">
            {message.content}
          </div>

          {/* Attachments */}
          {message.attachments?.map(att => (
            <div
              key={att.id}
              className="mt-2 inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-white/5 border border-white/10"
            >
              <Paperclip className="w-4 h-4 text-white/50" />
              <span className="text-sm text-amc-blue">{att.name}</span>
              {att.size && (
                <span className="text-xs text-white/40">
                  {(att.size / 1024).toFixed(0)} KB
                </span>
              )}
            </div>
          ))}

          {/* Reactions */}
          {message.reactions && Object.keys(message.reactions).length > 0 && (
            <div className="flex flex-wrap gap-1 mt-2">
              {Object.entries(message.reactions).map(([emoji, userIds]) => (
                <button
                  key={emoji}
                  onClick={() => handleReaction(message.id, emoji)}
                  className={clsx(
                    'inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-sm transition-colors',
                    userIds.includes(user?.staffId || '')
                      ? 'bg-amc-blue/20 border border-amc-blue/30'
                      : 'bg-white/5 border border-white/10 hover:bg-white/10'
                  )}
                >
                  <span>{emoji}</span>
                  <span className="text-xs text-white/60">{userIds.length}</span>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Message actions (on hover) */}
        <div className="opacity-0 group-hover:opacity-100 transition-opacity flex items-start gap-1 pt-1">
          <button
            onClick={() => setShowEmojiPicker(showEmojiPicker === message.id ? null : message.id)}
            className="p-1.5 rounded-lg hover:bg-white/10 text-white/50 hover:text-white"
          >
            <Smile className="w-4 h-4" />
          </button>

          {/* Emoji picker dropdown */}
          {showEmojiPicker === message.id && (
            <div className="absolute z-50 mt-8 p-2 rounded-xl glass-card flex gap-1 flex-wrap max-w-[200px]">
              {EMOJI_OPTIONS.map(emoji => (
                <button
                  key={emoji}
                  onClick={() => handleReaction(message.id, emoji)}
                  className="w-8 h-8 rounded-lg hover:bg-white/10 text-lg flex items-center justify-center"
                >
                  {emoji}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="h-[calc(100vh-180px)] flex gap-6">
      {/* Channels Sidebar */}
      <Card3D intensity={6} className="w-72 glass-card flex flex-col flex-shrink-0">
        {/* Search */}
        <div className="p-4 border-b border-white/10">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
            <input
              type="text"
              placeholder="Search channels..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-sm text-white placeholder:text-white/40 focus:outline-none focus:border-amc-teal/50"
            />
          </div>
        </div>

        {/* Channel List */}
        <div className="flex-1 overflow-y-auto p-3 custom-scrollbar">
          {renderChannelList(groupedChannels.pinned, 'Pinned')}
          {renderChannelList(groupedChannels.announcements, 'Announcements')}
          {renderChannelList(groupedChannels.departments, 'Departments')}
          {renderChannelList(groupedChannels.groups, 'Groups')}
          {renderChannelList(groupedChannels.direct, 'Direct Messages')}
        </div>

        {/* Online Users */}
        <div className="p-4 border-t border-white/10">
          <div className="text-xs font-medium text-white/40 uppercase tracking-wider mb-3">
            Online Now ({onlineUsers.size})
          </div>
          <div className="flex flex-wrap gap-2">
            {[...onlineUsers].slice(0, 8).map(userId => {
              const staff = staffData.find(s => s.id === userId);
              if (!staff) return null;
              return (
                <div key={userId} className="relative group">
                  <Avatar
                    name={staff.name}
                    initials={staff.avatar}
                    type={staff.type}
                    size="sm"
                  />
                  <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-amc-green border-2 border-amc-darker" />
                  <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 rounded-lg bg-black text-xs whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                    {staff.name}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </Card3D>

      {/* Main Chat Area */}
      <Card3D intensity={6} className="flex-1 glass-card flex flex-col overflow-hidden">
        {activeChannel ? (
          <>
            {/* Channel Header */}
            <div className="px-6 py-4 border-b border-white/10 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center"
                  style={{
                    backgroundColor: activeChannel.color ? `${activeChannel.color}20` : 'rgba(255,255,255,0.1)',
                    color: activeChannel.color || '#fff',
                  }}
                >
                  {activeChannel.icon || channelIcons[activeChannel.type]}
                </div>
                <div>
                  <h2 className="font-semibold flex items-center gap-2">
                    {activeChannel.name}
                    {activeChannel.isPinned && <Pin className="w-4 h-4 text-white/40" />}
                  </h2>
                  <p className="text-sm text-white/50">
                    {activeChannel.members.length} members
                    {activeChannel.description && ` • ${activeChannel.description}`}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button className="p-2 rounded-xl hover:bg-white/10 text-white/50 hover:text-white transition-colors">
                  <Phone className="w-5 h-5" />
                </button>
                <button className="p-2 rounded-xl hover:bg-white/10 text-white/50 hover:text-white transition-colors">
                  <Video className="w-5 h-5" />
                </button>
                <button
                  onClick={() => togglePinChannel(activeChannel.id)}
                  className={clsx(
                    'p-2 rounded-xl hover:bg-white/10 transition-colors',
                    activeChannel.isPinned ? 'text-amc-yellow' : 'text-white/50 hover:text-white'
                  )}
                >
                  <Pin className="w-5 h-5" />
                </button>
                <button
                  onClick={() => setShowChannelInfo(!showChannelInfo)}
                  className="p-2 rounded-xl hover:bg-white/10 text-white/50 hover:text-white transition-colors"
                >
                  <Info className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto py-4 custom-scrollbar">
              {/* Pinned Messages */}
              {channelMessages.filter(m => m.isPinned).length > 0 && (
                <div className="mx-4 mb-4 p-3 rounded-xl bg-amc-yellow/10 border border-amc-yellow/20">
                  <div className="flex items-center gap-2 text-sm text-amc-yellow mb-2">
                    <Pin className="w-4 h-4" />
                    <span className="font-medium">Pinned Messages</span>
                  </div>
                  {channelMessages.filter(m => m.isPinned).slice(0, 2).map(msg => (
                    <div key={msg.id} className="text-sm text-white/70 truncate">
                      <span className="font-medium">{msg.senderName}:</span> {msg.content}
                    </div>
                  ))}
                </div>
              )}

              {/* Messages */}
              {channelMessages.map((msg, i) => renderMessage(msg, i))}
              <div ref={messagesEndRef} />

              {/* Typing indicator */}
              {channelTypingUsers.length > 0 && (
                <div className="px-4 py-2 text-sm text-white/50 flex items-center gap-2">
                  <div className="flex gap-1">
                    <div className="w-2 h-2 rounded-full bg-white/50 animate-bounce" style={{ animationDelay: '0ms' }} />
                    <div className="w-2 h-2 rounded-full bg-white/50 animate-bounce" style={{ animationDelay: '150ms' }} />
                    <div className="w-2 h-2 rounded-full bg-white/50 animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                  <span>
                    {channelTypingUsers.length === 1
                      ? `${staffData.find(s => s.id === channelTypingUsers[0])?.name} is typing...`
                      : `${channelTypingUsers.length} people are typing...`}
                  </span>
                </div>
              )}
            </div>

            {/* Message Input */}
            <div className="p-4 border-t border-white/10">
              <div className="flex items-end gap-3">
                <button className="p-2.5 rounded-xl hover:bg-white/10 text-white/50 hover:text-white transition-colors">
                  <Paperclip className="w-5 h-5" />
                </button>
                <div className="flex-1 relative">
                  <textarea
                    value={messageInput}
                    onChange={(e) => setMessageInput(e.target.value)}
                    onKeyDown={handleKeyPress}
                    placeholder={`Message #${activeChannel.name}...`}
                    rows={1}
                    className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-sm text-white placeholder:text-white/40 focus:outline-none focus:border-amc-teal/50 resize-none"
                    style={{ maxHeight: '120px' }}
                  />
                </div>
                <button className="p-2.5 rounded-xl hover:bg-white/10 text-white/50 hover:text-white transition-colors">
                  <Smile className="w-5 h-5" />
                </button>
                <button
                  onClick={handleSendMessage}
                  disabled={!messageInput.trim()}
                  className={clsx(
                    'p-2.5 rounded-xl transition-all',
                    messageInput.trim()
                      ? 'bg-gradient-to-r from-amc-teal to-amc-blue text-white hover:shadow-glow-teal'
                      : 'bg-white/10 text-white/30'
                  )}
                >
                  <Send className="w-5 h-5" />
                </button>
              </div>
            </div>
          </>
        ) : (
          // No channel selected state
          <div className="flex-1 flex flex-col items-center justify-center text-center p-8">
            <div className="w-24 h-24 rounded-3xl bg-gradient-to-br from-amc-teal/20 to-amc-blue/20 flex items-center justify-center mb-6">
              <MessageSquare className="w-12 h-12 text-amc-teal" />
            </div>
            <h2 className="text-2xl font-bold mb-2">Welcome to Staff Chat</h2>
            <p className="text-white/50 max-w-md">
              Select a channel from the sidebar to start collaborating with your colleagues. Stay connected with department updates, announcements, and team discussions.
            </p>
          </div>
        )}
      </Card3D>

      {/* Channel Info Sidebar */}
      {showChannelInfo && activeChannel && (
        <Card3D intensity={6} className="w-80 glass-card flex-shrink-0 animate-fade-in">
          <div className="p-6 border-b border-white/10 flex items-center justify-between">
            <h3 className="font-semibold">Channel Details</h3>
            <button
              onClick={() => setShowChannelInfo(false)}
              className="p-1.5 rounded-lg hover:bg-white/10 text-white/50"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="p-6 space-y-6">
            {/* Channel Info */}
            <div className="text-center">
              <div
                className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4"
                style={{
                  backgroundColor: activeChannel.color ? `${activeChannel.color}20` : 'rgba(255,255,255,0.1)',
                  color: activeChannel.color || '#fff',
                  fontSize: '2rem',
                }}
              >
                {activeChannel.icon || channelIcons[activeChannel.type]}
              </div>
              <h4 className="text-lg font-semibold">{activeChannel.name}</h4>
              <p className="text-sm text-white/50 mt-1">{activeChannel.description}</p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 gap-4">
              <div className="p-3 rounded-xl bg-white/5 text-center">
                <div className="text-2xl font-bold text-amc-teal">{activeChannel.members.length}</div>
                <div className="text-xs text-white/50">Members</div>
              </div>
              <div className="p-3 rounded-xl bg-white/5 text-center">
                <div className="text-2xl font-bold text-amc-blue">{channelMessages.length}</div>
                <div className="text-xs text-white/50">Messages</div>
              </div>
            </div>

            {/* Members List */}
            <div>
              <h5 className="text-sm font-medium text-white/60 mb-3">Members</h5>
              <div className="space-y-2 max-h-48 overflow-y-auto custom-scrollbar">
                {activeChannel.members.map(memberId => {
                  const member = staffData.find(s => s.id === memberId);
                  if (!member) return null;
                  const isOnline = onlineUsers.has(memberId);

                  return (
                    <div key={memberId} className="flex items-center gap-3 p-2 rounded-xl hover:bg-white/5">
                      <div className="relative">
                        <Avatar
                          name={member.name}
                          initials={member.avatar}
                          type={member.type}
                          size="sm"
                        />
                        <div
                          className={clsx(
                            'absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-amc-darker',
                            isOnline ? 'bg-amc-green' : 'bg-white/30'
                          )}
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-medium truncate">{member.name}</div>
                        <div className="text-xs text-white/40">{member.role}</div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </Card3D>
      )}
    </div>
  );
};

export default Chat;
