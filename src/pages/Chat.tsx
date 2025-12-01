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
  X,
  Plus,
  PhoneOff,
  Mic,
  MicOff,
  VideoOff,
  Image,
  File,
  Camera,
  Menu,
  MoreVertical,
  Copy,
} from 'lucide-react';
import { clsx } from 'clsx';
import Card3D from '../components/common/Card3D';
import Avatar from '../components/common/Avatar';
import Badge from '../components/common/Badge';
import Button from '../components/common/Button';
import Modal from '../components/common/Modal';
import { useChatStore } from '../stores/chatStore';
import { useAppStore } from '../stores/appStore';
import { useAuth } from '../contexts/AuthContext';
import { ChatChannel } from '../types';
import { staffData, departmentData } from '../data/mockData';

const EMOJI_OPTIONS = ['👍', '❤️', '😂', '😮', '😢', '🎉', '🙏', '✅', '⚠️', '🚨'];
const EXTENDED_EMOJIS = ['👍', '❤️', '😂', '😮', '😢', '🎉', '🙏', '✅', '⚠️', '🚨', '👏', '🔥', '💯', '👀', '🤔', '😊', '🙌', '💪', '☕', '🏥'];

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
  const { addToast } = useAppStore();
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
    addChannel,
  } = useChatStore();

  const [messageInput, setMessageInput] = useState('');
  const [showEmojiPicker, setShowEmojiPicker] = useState<string | null>(null);
  const [showInputEmoji, setShowInputEmoji] = useState(false);
  const [showChannelInfo, setShowChannelInfo] = useState(false);
  const [showCallModal, setShowCallModal] = useState(false);
  const [showVideoModal, setShowVideoModal] = useState(false);
  const [callActive, setCallActive] = useState(false);
  const [callDuration, setCallDuration] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);
  const [showAttachMenu, setShowAttachMenu] = useState(false);
  const [showNewChannelModal, setShowNewChannelModal] = useState(false);
  const [showDirectMessageModal, setShowDirectMessageModal] = useState(false);
  const [showMobileSidebar, setShowMobileSidebar] = useState(false);
  const [showMobileActions, setShowMobileActions] = useState(false);
  const [selectedMessageId, setSelectedMessageId] = useState<string | null>(null);
  const [newChannelForm, setNewChannelForm] = useState({
    name: '',
    description: '',
    type: 'group' as 'group' | 'department',
  });
  const [pendingAttachment, setPendingAttachment] = useState<{
    name: string;
    size: number;
    type: 'image' | 'file';
    url: string;
  } | null>(null);
  const [localStream, setLocalStream] = useState<MediaStream | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const localVideoRef = useRef<HTMLVideoElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

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

  // Handle video stream for video calls
  useEffect(() => {
    const startCamera = async () => {
      if (showVideoModal && !isVideoOff) {
        try {
          const stream = await navigator.mediaDevices.getUserMedia({
            video: { width: 640, height: 480, facingMode: 'user' },
            audio: true,
          });
          setLocalStream(stream);
          if (localVideoRef.current) {
            localVideoRef.current.srcObject = stream;
          }
        } catch (err) {
          console.error('Error accessing camera:', err);
          addToast('Could not access camera. Please check permissions.', 'error');
        }
      }
    };

    if (showVideoModal && !isVideoOff) {
      startCamera();
    }

    return () => {
      if (localStream) {
        localStream.getTracks().forEach(track => track.stop());
        setLocalStream(null);
      }
    };
  }, [showVideoModal, isVideoOff]);

  // Update video element when stream changes
  useEffect(() => {
    if (localVideoRef.current && localStream) {
      localVideoRef.current.srcObject = localStream;
    }
  }, [localStream]);

  // Stop camera when video is turned off or modal closes
  useEffect(() => {
    if ((!showVideoModal || isVideoOff) && localStream) {
      localStream.getTracks().forEach(track => track.stop());
      setLocalStream(null);
    }
  }, [showVideoModal, isVideoOff]);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = () => {
      setShowEmojiPicker(null);
      setShowInputEmoji(false);
      setShowAttachMenu(false);
      setSelectedMessageId(null);
    };

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  const handleSendMessage = () => {
    if ((!messageInput.trim() && !pendingAttachment) || !activeChannelId || !user) return;

    const staffInfo = staffData.find(s => s.id === user.staffId);
    const attachment = pendingAttachment ? {
      id: `att-${Date.now()}`,
      type: pendingAttachment.type,
      name: pendingAttachment.name,
      url: pendingAttachment.url,
      size: pendingAttachment.size,
    } : undefined;

    sendMessage(
      activeChannelId,
      messageInput.trim() || (pendingAttachment ? `Sent ${pendingAttachment.type === 'image' ? 'an image' : 'a file'}` : ''),
      user.staffId,
      user.name,
      user.avatar,
      staffInfo?.role || 'Staff',
      attachment
    );
    setMessageInput('');
    setPendingAttachment(null);
    inputRef.current?.focus();
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
    setSelectedMessageId(null);
  };

  // Call duration timer
  useEffect(() => {
    let timer: ReturnType<typeof setInterval>;
    if (callActive) {
      timer = setInterval(() => {
        setCallDuration(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [callActive]);

  const formatCallDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleStartCall = (isVideo: boolean) => {
    if (isVideo) {
      setShowVideoModal(true);
    } else {
      setShowCallModal(true);
    }
    setCallActive(true);
    setCallDuration(0);
    setShowMobileActions(false);
    addToast(`${isVideo ? 'Video' : 'Voice'} call started with ${activeChannel?.name}`, 'info');
  };

  const handleEndCall = () => {
    setCallActive(false);
    setShowCallModal(false);
    setShowVideoModal(false);
    setIsMuted(false);
    setIsVideoOff(false);
    addToast(`Call ended - Duration: ${formatCallDuration(callDuration)}`, 'success');
  };

  const handleFileSelect = (type: 'image' | 'file' | 'camera') => {
    setShowAttachMenu(false);
    if (type === 'camera') {
      addToast('Camera capture not available in this demo', 'info');
      return;
    }
    fileInputRef.current?.click();
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const isImage = file.type.startsWith('image/');
      const url = URL.createObjectURL(file);
      setPendingAttachment({
        name: file.name,
        size: file.size,
        type: isImage ? 'image' : 'file',
        url,
      });
      addToast(`File "${file.name}" ready to send`, 'success');
    }
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleRemoveAttachment = () => {
    if (pendingAttachment?.url) {
      URL.revokeObjectURL(pendingAttachment.url);
    }
    setPendingAttachment(null);
  };

  const handleAddEmoji = (emoji: string) => {
    setMessageInput(prev => prev + emoji);
    setShowInputEmoji(false);
    inputRef.current?.focus();
  };

  const handleCreateChannel = () => {
    if (!newChannelForm.name.trim()) {
      addToast('Please enter a channel name', 'error');
      return;
    }

    const newChannel: ChatChannel = {
      id: `ch-${Date.now()}`,
      name: newChannelForm.name,
      type: newChannelForm.type,
      description: newChannelForm.description,
      members: [user?.staffId || '1'],
      unreadCount: 0,
      isPinned: false,
      color: newChannelForm.type === 'department' ? '#667EEA' : '#00D4AA',
      createdAt: new Date().toISOString(),
    };

    addChannel(newChannel);
    setShowNewChannelModal(false);
    setNewChannelForm({ name: '', description: '', type: 'group' });
    setActiveChannel(newChannel.id);
    addToast(`Channel "${newChannelForm.name}" created`, 'success');
  };

  const handleStartDirectMessage = (staffId: string) => {
    const staff = staffData.find(s => s.id === staffId);
    if (!staff) return;

    const existingDM = channels.find(
      ch => ch.type === 'direct' && ch.members.includes(staffId) && ch.members.includes(user?.staffId || '')
    );

    if (existingDM) {
      setActiveChannel(existingDM.id);
      setShowDirectMessageModal(false);
      return;
    }

    const newDM: ChatChannel = {
      id: `dm-${Date.now()}`,
      name: staff.name,
      type: 'direct',
      description: staff.role,
      members: [user?.staffId || '1', staffId],
      unreadCount: 0,
      isPinned: false,
      createdAt: new Date().toISOString(),
    };

    addChannel(newDM);
    setActiveChannel(newDM.id);
    setShowDirectMessageModal(false);
    addToast(`Started conversation with ${staff.name}`, 'success');
  };

  const getStaffType = (role: string): 'doctor' | 'nurse' | 'tech' | 'admin' => {
    const lowerRole = role.toLowerCase();
    if (lowerRole.includes('doctor') || lowerRole.includes('dr.') || lowerRole.includes('ceo') || lowerRole.includes('specialist') || lowerRole.includes('paediatrician') || lowerRole.includes('medical officer')) return 'doctor';
    if (lowerRole.includes('nurse')) return 'nurse';
    if (lowerRole.includes('tech') || lowerRole.includes('pharmacist') || lowerRole.includes('radiologist')) return 'tech';
    return 'admin';
  };

  const handleChannelSelect = (channelId: string) => {
    setActiveChannel(channelId);
    setShowMobileSidebar(false);
  };

  const handleLongPress = (messageId: string) => {
    setSelectedMessageId(messageId);
    // Trigger haptic feedback on supported devices
    if ('vibrate' in navigator) {
      navigator.vibrate(50);
    }
  };

  const handleCopyMessage = (content: string) => {
    navigator.clipboard.writeText(content);
    addToast('Message copied to clipboard', 'success');
    setSelectedMessageId(null);
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
            onClick={() => handleChannelSelect(channel.id)}
            className={clsx(
              'w-full flex items-center gap-3 px-3 py-3 md:py-2.5 rounded-xl transition-all duration-200 haptic-tap no-tap-highlight',
              activeChannelId === channel.id
                ? 'bg-white/10 text-white'
                : 'text-white/60 hover:text-white hover:bg-white/5 active:bg-white/10'
            )}
          >
            <div
              className="w-10 h-10 md:w-8 md:h-8 rounded-xl md:rounded-lg flex items-center justify-center flex-shrink-0"
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
              <div className="w-6 h-6 md:w-5 md:h-5 rounded-full bg-amc-red text-white text-xs font-bold flex items-center justify-center">
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
    const isSelected = selectedMessageId === message.id;

    return (
      <div
        key={message.id}
        className={clsx(
          'group relative px-3 md:px-4 py-1 transition-colors no-tap-highlight',
          showAvatar ? 'mt-4' : 'mt-0.5',
          isSelected && 'bg-white/5'
        )}
        onContextMenu={(e) => {
          e.preventDefault();
          handleLongPress(message.id);
        }}
        onTouchStart={() => {
          const timer = setTimeout(() => handleLongPress(message.id), 500);
          const clear = () => {
            clearTimeout(timer);
            document.removeEventListener('touchend', clear);
            document.removeEventListener('touchmove', clear);
          };
          document.addEventListener('touchend', clear);
          document.addEventListener('touchmove', clear);
        }}
      >
        <div className="flex gap-2 md:gap-3">
          {/* Avatar column */}
          <div className="w-8 md:w-10 flex-shrink-0">
            {showAvatar && (
              <Avatar
                name={message.senderName}
                initials={message.senderAvatar}
                type={getStaffType(message.senderRole)}
                size="sm"
              />
            )}
          </div>

          {/* Message content */}
          <div className="flex-1 min-w-0">
            {showAvatar && (
              <div className="flex items-center gap-2 mb-1 flex-wrap">
                <span className="font-semibold text-sm">{message.senderName}</span>
                <span className="text-xs text-white/40 hidden md:inline">{message.senderRole}</span>
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
            <div className="text-sm text-white/90 leading-relaxed whitespace-pre-wrap break-words">
              {message.content}
            </div>

            {/* Attachments */}
            {message.attachments?.map(att => (
              <div key={att.id} className="mt-2">
                {att.type === 'image' ? (
                  <div className="rounded-xl overflow-hidden bg-black/20 max-w-[280px] md:max-w-sm border border-white/10">
                    <img
                      src={att.url}
                      alt={att.name}
                      className="max-w-full max-h-48 md:max-h-64 object-contain"
                      loading="lazy"
                    />
                    <div className="px-3 py-2 flex items-center justify-between bg-white/5">
                      <span className="text-xs text-white/60 truncate">{att.name}</span>
                      {att.size && (
                        <span className="text-xs text-white/40 ml-2">
                          {(att.size / 1024).toFixed(0)} KB
                        </span>
                      )}
                    </div>
                  </div>
                ) : (
                  <a
                    href={att.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-3 px-3 md:px-4 py-2 md:py-3 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 active:bg-white/15 transition-colors"
                  >
                    <div className="w-8 h-8 md:w-10 md:h-10 rounded-lg bg-amc-blue/20 flex items-center justify-center flex-shrink-0">
                      <File className="w-4 h-4 md:w-5 md:h-5 text-amc-blue" />
                    </div>
                    <div className="min-w-0">
                      <div className="text-sm font-medium text-amc-blue truncate">{att.name}</div>
                      {att.size && (
                        <div className="text-xs text-white/40">
                          {(att.size / 1024).toFixed(0)} KB
                        </div>
                      )}
                    </div>
                  </a>
                )}
              </div>
            ))}

            {/* Reactions */}
            {message.reactions && Object.keys(message.reactions).length > 0 && (
              <div className="flex flex-wrap gap-1 mt-2">
                {Object.entries(message.reactions).map(([emoji, userIds]) => (
                  <button
                    key={emoji}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleReaction(message.id, emoji);
                    }}
                    className={clsx(
                      'inline-flex items-center gap-1 px-2 py-1 rounded-full text-sm transition-colors haptic-tap',
                      userIds.includes(user?.staffId || '')
                        ? 'bg-amc-blue/20 border border-amc-blue/30'
                        : 'bg-white/5 border border-white/10 hover:bg-white/10 active:bg-white/15'
                    )}
                  >
                    <span>{emoji}</span>
                    <span className="text-xs text-white/60">{userIds.length}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Message actions (on hover for desktop, tap for mobile) */}
          <div className={clsx(
            'transition-opacity flex items-start gap-1 pt-1',
            isSelected ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
          )}>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setShowEmojiPicker(showEmojiPicker === message.id ? null : message.id);
              }}
              className="p-1.5 md:p-2 rounded-lg hover:bg-white/10 active:bg-white/15 text-white/50 hover:text-white touch-target"
            >
              <Smile className="w-4 h-4" />
            </button>

            {/* Emoji picker dropdown */}
            {showEmojiPicker === message.id && (
              <div
                className="absolute right-2 z-50 mt-8 p-2 rounded-xl glass-card flex gap-1 flex-wrap max-w-[220px] animate-scale-in"
                onClick={e => e.stopPropagation()}
              >
                {EMOJI_OPTIONS.map(emoji => (
                  <button
                    key={emoji}
                    onClick={() => handleReaction(message.id, emoji)}
                    className="w-9 h-9 rounded-lg hover:bg-white/10 active:bg-white/15 text-lg flex items-center justify-center haptic-tap"
                  >
                    {emoji}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Mobile context menu */}
        {isSelected && (
          <div
            className="absolute left-0 right-0 bottom-full mb-2 mx-4 p-2 rounded-xl glass-card flex items-center justify-around animate-scale-in md:hidden z-50"
            onClick={e => e.stopPropagation()}
          >
            <button
              onClick={() => handleCopyMessage(message.content)}
              className="flex flex-col items-center gap-1 p-2 rounded-lg hover:bg-white/10 active:bg-white/15"
            >
              <Copy className="w-5 h-5" />
              <span className="text-xs">Copy</span>
            </button>
            <button
              onClick={() => {
                setShowEmojiPicker(message.id);
                setSelectedMessageId(null);
              }}
              className="flex flex-col items-center gap-1 p-2 rounded-lg hover:bg-white/10 active:bg-white/15"
            >
              <Smile className="w-5 h-5" />
              <span className="text-xs">React</span>
            </button>
            <button
              onClick={() => setSelectedMessageId(null)}
              className="flex flex-col items-center gap-1 p-2 rounded-lg hover:bg-white/10 active:bg-white/15 text-white/50"
            >
              <X className="w-5 h-5" />
              <span className="text-xs">Cancel</span>
            </button>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="h-[calc(100vh-140px)] md:h-[calc(100vh-180px)] flex flex-col relative">
      {/* Mobile Header */}
      <div className="md:hidden flex items-center gap-2 p-3 glass-card rounded-xl mb-3">
        <button
          onClick={() => setShowMobileSidebar(true)}
          className="p-2.5 rounded-xl bg-white/5 hover:bg-white/10 active:bg-white/15 touch-target haptic-tap"
        >
          <Menu className="w-5 h-5" />
        </button>
        <div className="flex-1 min-w-0" onClick={() => activeChannel && setShowChannelInfo(true)}>
          {activeChannel ? (
            <div className="flex items-center gap-2">
              <div
                className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
                style={{
                  backgroundColor: activeChannel.color ? `${activeChannel.color}20` : 'rgba(255,255,255,0.1)',
                  color: activeChannel.color || '#fff',
                }}
              >
                {activeChannel.icon || channelIcons[activeChannel.type]}
              </div>
              <div className="min-w-0">
                <h3 className="font-semibold text-sm truncate">{activeChannel.name}</h3>
                <p className="text-xs text-white/50">{activeChannel.members.length} members</p>
              </div>
            </div>
          ) : (
            <span className="text-white/50">Select a channel</span>
          )}
        </div>
        {activeChannel && (
          <button
            onClick={() => setShowMobileActions(true)}
            className="p-2.5 rounded-xl bg-white/5 hover:bg-white/10 active:bg-white/15 touch-target haptic-tap"
          >
            <MoreVertical className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Main content wrapper */}
      <div className="flex-1 flex gap-0 md:gap-6 overflow-hidden">
        {/* Mobile Sidebar Overlay */}
        {showMobileSidebar && (
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 md:hidden animate-fade-in"
            onClick={() => setShowMobileSidebar(false)}
          />
        )}

        {/* Channels Sidebar */}
        <Card3D
          intensity={6}
          className={clsx(
            'glass-card flex flex-col flex-shrink-0 z-50',
            // Mobile: Fixed overlay
            'fixed inset-y-0 left-0 w-[85%] max-w-[320px] transform transition-transform duration-300 md:transform-none',
            showMobileSidebar ? 'translate-x-0 animate-slide-in-left' : '-translate-x-full',
            // Desktop: Static sidebar
            'md:relative md:w-72 md:translate-x-0'
          )}
          style={{
            paddingTop: 'env(safe-area-inset-top)',
          }}
        >
          {/* Mobile Close Button */}
          <div className="md:hidden flex items-center justify-between p-4 border-b border-white/10">
            <h3 className="font-semibold text-lg">Channels</h3>
            <button
              onClick={() => setShowMobileSidebar(false)}
              className="p-2.5 rounded-xl hover:bg-white/10 active:bg-white/15 touch-target"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Search and Actions */}
          <div className="p-4 border-b border-white/10 md:border-t-0 space-y-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
              <input
                type="text"
                placeholder="Search channels..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 md:py-2.5 rounded-xl bg-white/5 border border-white/10 text-base md:text-sm text-white placeholder:text-white/40 focus:outline-none focus:border-amc-teal/50"
              />
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => {
                  setShowNewChannelModal(true);
                  setShowMobileSidebar(false);
                }}
                className="flex-1 flex items-center justify-center gap-2 px-3 py-3 md:py-2 rounded-xl bg-amc-teal/10 border border-amc-teal/20 text-amc-teal text-sm font-medium hover:bg-amc-teal/20 active:bg-amc-teal/30 transition-colors haptic-tap"
              >
                <Plus className="w-4 h-4" />
                Channel
              </button>
              <button
                onClick={() => {
                  setShowDirectMessageModal(true);
                  setShowMobileSidebar(false);
                }}
                className="flex-1 flex items-center justify-center gap-2 px-3 py-3 md:py-2 rounded-xl bg-amc-blue/10 border border-amc-blue/20 text-amc-blue text-sm font-medium hover:bg-amc-blue/20 active:bg-amc-blue/30 transition-colors haptic-tap"
              >
                <MessageSquare className="w-4 h-4" />
                Message
              </button>
            </div>
          </div>

          {/* Channel List */}
          <div className="flex-1 overflow-y-auto p-3 momentum-scroll">
            {renderChannelList(groupedChannels.pinned, 'Pinned')}
            {renderChannelList(groupedChannels.announcements, 'Announcements')}
            {renderChannelList(groupedChannels.departments, 'Departments')}
            {renderChannelList(groupedChannels.groups, 'Groups')}
            {renderChannelList(groupedChannels.direct, 'Direct Messages')}
          </div>

          {/* Online Users */}
          <div className="p-4 border-t border-white/10 safe-bottom">
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
        <Card3D intensity={6} className="flex-1 glass-card flex flex-col overflow-hidden rounded-xl md:rounded-3xl">
          {activeChannel ? (
            <>
              {/* Channel Header - Desktop only */}
              <div className="hidden md:flex px-6 py-4 border-b border-white/10 items-center justify-between">
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
                  <button
                    onClick={() => handleStartCall(false)}
                    className="p-2 rounded-xl hover:bg-white/10 text-white/50 hover:text-white transition-colors"
                    title="Start voice call"
                  >
                    <Phone className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => handleStartCall(true)}
                    className="p-2 rounded-xl hover:bg-white/10 text-white/50 hover:text-white transition-colors"
                    title="Start video call"
                  >
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
              <div className="flex-1 overflow-y-auto py-2 md:py-4 momentum-scroll chat-scroll">
                {/* Pinned Messages */}
                {channelMessages.filter(m => m.isPinned).length > 0 && (
                  <div className="mx-3 md:mx-4 mb-4 p-3 rounded-xl bg-amc-yellow/10 border border-amc-yellow/20">
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
                  <div className="px-3 md:px-4 py-2 text-sm text-white/50 flex items-center gap-2">
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
              <div className="p-3 md:p-4 border-t border-white/10 safe-bottom bg-amc-darker/50">
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileUpload}
                  className="hidden"
                  accept="image/*,.pdf,.doc,.docx,.xls,.xlsx"
                />

                {/* Pending Attachment Preview */}
                {pendingAttachment && (
                  <div className="mb-3 p-3 rounded-xl bg-white/5 border border-white/10 animate-scale-in">
                    <div className="flex items-center gap-3">
                      {pendingAttachment.type === 'image' ? (
                        <div className="w-14 h-14 md:w-16 md:h-16 rounded-lg overflow-hidden bg-black/20 flex-shrink-0">
                          <img
                            src={pendingAttachment.url}
                            alt={pendingAttachment.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      ) : (
                        <div className="w-12 h-12 rounded-lg bg-amc-blue/20 flex items-center justify-center flex-shrink-0">
                          <File className="w-6 h-6 text-amc-blue" />
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-medium text-white truncate">{pendingAttachment.name}</div>
                        <div className="text-xs text-white/50">
                          {(pendingAttachment.size / 1024).toFixed(1)} KB • Ready to send
                        </div>
                      </div>
                      <button
                        onClick={handleRemoveAttachment}
                        className="p-2 rounded-lg hover:bg-white/10 active:bg-white/15 text-white/50 hover:text-white touch-target"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                )}

                <div className="flex items-end gap-2">
                  {/* Attachment Button */}
                  <div className="relative">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setShowAttachMenu(!showAttachMenu);
                      }}
                      className={clsx(
                        'p-3 md:p-2.5 rounded-xl transition-colors touch-target haptic-tap',
                        pendingAttachment
                          ? 'bg-amc-teal/20 text-amc-teal'
                          : 'hover:bg-white/10 active:bg-white/15 text-white/50 hover:text-white'
                      )}
                    >
                      <Paperclip className="w-5 h-5" />
                    </button>
                    {showAttachMenu && (
                      <div
                        className="absolute bottom-full left-0 mb-2 p-2 rounded-xl glass-card animate-scale-in z-10 min-w-[140px]"
                        onClick={e => e.stopPropagation()}
                      >
                        <button
                          onClick={() => handleFileSelect('image')}
                          className="flex items-center gap-3 w-full px-3 py-3 md:py-2 rounded-lg hover:bg-white/10 active:bg-white/15 text-sm text-white/70 haptic-tap"
                        >
                          <Image className="w-5 h-5 text-amc-blue" />
                          Image
                        </button>
                        <button
                          onClick={() => handleFileSelect('file')}
                          className="flex items-center gap-3 w-full px-3 py-3 md:py-2 rounded-lg hover:bg-white/10 active:bg-white/15 text-sm text-white/70 haptic-tap"
                        >
                          <File className="w-5 h-5 text-amc-teal" />
                          File
                        </button>
                        <button
                          onClick={() => handleFileSelect('camera')}
                          className="flex items-center gap-3 w-full px-3 py-3 md:py-2 rounded-lg hover:bg-white/10 active:bg-white/15 text-sm text-white/70 haptic-tap"
                        >
                          <Camera className="w-5 h-5 text-amc-purple" />
                          Camera
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Text Input */}
                  <div className="flex-1 relative">
                    <textarea
                      ref={inputRef}
                      value={messageInput}
                      onChange={(e) => setMessageInput(e.target.value)}
                      onKeyDown={handleKeyPress}
                      placeholder={`Message #${activeChannel.name}...`}
                      rows={1}
                      className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-base md:text-sm text-white placeholder:text-white/40 focus:outline-none focus:border-amc-teal/50 resize-none"
                      style={{ maxHeight: '120px', minHeight: '48px' }}
                    />
                  </div>

                  {/* Emoji Button */}
                  <div className="relative hidden md:block">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setShowInputEmoji(!showInputEmoji);
                      }}
                      className="p-2.5 rounded-xl hover:bg-white/10 active:bg-white/15 text-white/50 hover:text-white transition-colors touch-target"
                    >
                      <Smile className="w-5 h-5" />
                    </button>
                    {showInputEmoji && (
                      <div
                        className="absolute bottom-full right-0 mb-2 p-3 rounded-xl glass-card animate-scale-in z-10"
                        onClick={e => e.stopPropagation()}
                      >
                        <div className="grid grid-cols-5 gap-1">
                          {EXTENDED_EMOJIS.map(emoji => (
                            <button
                              key={emoji}
                              onClick={() => handleAddEmoji(emoji)}
                              className="w-9 h-9 rounded-lg hover:bg-white/10 active:bg-white/15 text-xl flex items-center justify-center haptic-tap"
                            >
                              {emoji}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Send Button */}
                  <button
                    onClick={handleSendMessage}
                    disabled={!messageInput.trim() && !pendingAttachment}
                    className={clsx(
                      'p-3 md:p-2.5 rounded-xl transition-all touch-target haptic-tap',
                      (messageInput.trim() || pendingAttachment)
                        ? 'bg-gradient-to-r from-amc-teal to-amc-blue text-white active:scale-95'
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
            <div className="flex-1 flex flex-col items-center justify-center text-center p-6 md:p-8">
              <div className="w-20 h-20 md:w-24 md:h-24 rounded-3xl bg-gradient-to-br from-amc-teal/20 to-amc-blue/20 flex items-center justify-center mb-6">
                <MessageSquare className="w-10 h-10 md:w-12 md:h-12 text-amc-teal" />
              </div>
              <h2 className="text-xl md:text-2xl font-bold mb-2">Welcome to Staff Chat</h2>
              <p className="text-white/50 max-w-md text-sm md:text-base">
                Select a channel from the sidebar to start collaborating with your colleagues.
              </p>
              <button
                onClick={() => setShowMobileSidebar(true)}
                className="mt-6 px-6 py-3 rounded-xl bg-amc-teal/20 border border-amc-teal/30 text-amc-teal font-medium md:hidden haptic-tap"
              >
                View Channels
              </button>
            </div>
          )}
        </Card3D>

        {/* Channel Info Sidebar - Desktop */}
        {showChannelInfo && activeChannel && (
          <Card3D intensity={6} className="hidden md:flex w-80 glass-card flex-col flex-shrink-0 animate-fade-in">
            <div className="p-6 border-b border-white/10 flex items-center justify-between">
              <h3 className="font-semibold">Channel Details</h3>
              <button
                onClick={() => setShowChannelInfo(false)}
                className="p-1.5 rounded-lg hover:bg-white/10 text-white/50"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-6">
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
                <div className="space-y-2 max-h-48 overflow-y-auto">
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

      {/* Mobile Actions Sheet */}
      <Modal
        isOpen={showMobileActions}
        onClose={() => setShowMobileActions(false)}
        title="Actions"
        size="sm"
      >
        <div className="space-y-2">
          <button
            onClick={() => {
              handleStartCall(false);
            }}
            className="w-full flex items-center gap-4 p-4 rounded-xl hover:bg-white/5 active:bg-white/10 transition-colors haptic-tap"
          >
            <div className="w-10 h-10 rounded-xl bg-amc-teal/20 flex items-center justify-center">
              <Phone className="w-5 h-5 text-amc-teal" />
            </div>
            <div className="text-left">
              <div className="font-medium">Voice Call</div>
              <div className="text-sm text-white/50">Start a voice call</div>
            </div>
          </button>
          <button
            onClick={() => {
              handleStartCall(true);
            }}
            className="w-full flex items-center gap-4 p-4 rounded-xl hover:bg-white/5 active:bg-white/10 transition-colors haptic-tap"
          >
            <div className="w-10 h-10 rounded-xl bg-amc-blue/20 flex items-center justify-center">
              <Video className="w-5 h-5 text-amc-blue" />
            </div>
            <div className="text-left">
              <div className="font-medium">Video Call</div>
              <div className="text-sm text-white/50">Start a video call</div>
            </div>
          </button>
          <button
            onClick={() => {
              setShowChannelInfo(true);
              setShowMobileActions(false);
            }}
            className="w-full flex items-center gap-4 p-4 rounded-xl hover:bg-white/5 active:bg-white/10 transition-colors haptic-tap"
          >
            <div className="w-10 h-10 rounded-xl bg-amc-purple/20 flex items-center justify-center">
              <Info className="w-5 h-5 text-amc-purple" />
            </div>
            <div className="text-left">
              <div className="font-medium">Channel Info</div>
              <div className="text-sm text-white/50">View details & members</div>
            </div>
          </button>
          {activeChannel && (
            <button
              onClick={() => {
                togglePinChannel(activeChannel.id);
                setShowMobileActions(false);
              }}
              className="w-full flex items-center gap-4 p-4 rounded-xl hover:bg-white/5 active:bg-white/10 transition-colors haptic-tap"
            >
              <div className={clsx(
                'w-10 h-10 rounded-xl flex items-center justify-center',
                activeChannel.isPinned ? 'bg-amc-yellow/20' : 'bg-white/10'
              )}>
                <Pin className={clsx('w-5 h-5', activeChannel.isPinned ? 'text-amc-yellow' : 'text-white/70')} />
              </div>
              <div className="text-left">
                <div className="font-medium">{activeChannel.isPinned ? 'Unpin Channel' : 'Pin Channel'}</div>
                <div className="text-sm text-white/50">
                  {activeChannel.isPinned ? 'Remove from pinned' : 'Add to pinned channels'}
                </div>
              </div>
            </button>
          )}
        </div>
      </Modal>

      {/* Channel Info Modal - Mobile */}
      <Modal
        isOpen={showChannelInfo}
        onClose={() => setShowChannelInfo(false)}
        title="Channel Details"
        size="md"
        mobileStyle="bottom-sheet"
      >
        {activeChannel && (
          <div className="space-y-6">
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
              <div className="p-4 rounded-xl bg-white/5 text-center">
                <div className="text-2xl font-bold text-amc-teal">{activeChannel.members.length}</div>
                <div className="text-xs text-white/50">Members</div>
              </div>
              <div className="p-4 rounded-xl bg-white/5 text-center">
                <div className="text-2xl font-bold text-amc-blue">{channelMessages.length}</div>
                <div className="text-xs text-white/50">Messages</div>
              </div>
            </div>

            {/* Members List */}
            <div>
              <h5 className="text-sm font-medium text-white/60 mb-3">Members</h5>
              <div className="space-y-2 max-h-60 overflow-y-auto momentum-scroll">
                {activeChannel.members.map(memberId => {
                  const member = staffData.find(s => s.id === memberId);
                  if (!member) return null;
                  const isOnline = onlineUsers.has(memberId);

                  return (
                    <div key={memberId} className="flex items-center gap-3 p-3 rounded-xl hover:bg-white/5 active:bg-white/10">
                      <div className="relative">
                        <Avatar
                          name={member.name}
                          initials={member.avatar}
                          type={member.type}
                          size="md"
                        />
                        <div
                          className={clsx(
                            'absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full border-2 border-amc-darker',
                            isOnline ? 'bg-amc-green' : 'bg-white/30'
                          )}
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="font-medium truncate">{member.name}</div>
                        <div className="text-sm text-white/40">{member.role}</div>
                      </div>
                      <Badge variant={isOnline ? 'success' : 'default'} size="sm">
                        {isOnline ? 'Online' : 'Offline'}
                      </Badge>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </Modal>

      {/* Voice Call Modal */}
      <Modal
        isOpen={showCallModal}
        onClose={handleEndCall}
        title="Voice Call"
        size="sm"
        mobileStyle="center"
      >
        <div className="text-center py-6 md:py-8">
          <div className="w-20 h-20 md:w-24 md:h-24 rounded-full bg-amc-teal/20 flex items-center justify-center mx-auto mb-6">
            {activeChannel?.type === 'direct' ? (
              <Avatar
                name={activeChannel.name}
                initials={activeChannel.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                type="doctor"
                size="lg"
              />
            ) : (
              <Phone className="w-10 h-10 md:w-12 md:h-12 text-amc-teal" />
            )}
          </div>
          <h3 className="text-lg md:text-xl font-semibold mb-2">{activeChannel?.name}</h3>
          <p className="text-white/50 mb-6">
            {callActive ? formatCallDuration(callDuration) : 'Calling...'}
          </p>

          <div className="flex justify-center gap-4">
            <button
              onClick={() => setIsMuted(!isMuted)}
              className={clsx(
                'p-4 md:p-4 rounded-full transition-colors touch-target haptic-tap',
                isMuted ? 'bg-amc-red' : 'bg-white/10 hover:bg-white/20 active:bg-white/25'
              )}
            >
              {isMuted ? <MicOff className="w-6 h-6" /> : <Mic className="w-6 h-6" />}
            </button>
            <button
              onClick={handleEndCall}
              className="p-4 md:p-4 rounded-full bg-amc-red hover:bg-amc-red/80 active:bg-amc-red/70 transition-colors touch-target haptic-tap"
            >
              <PhoneOff className="w-6 h-6" />
            </button>
          </div>
        </div>
      </Modal>

      {/* Video Call Modal */}
      <Modal
        isOpen={showVideoModal}
        onClose={handleEndCall}
        title="Video Call"
        size="lg"
        mobileStyle="center"
      >
        <div className="py-2 md:py-4">
          <div className="aspect-video rounded-xl bg-black mb-4 flex items-center justify-center relative overflow-hidden">
            {/* Remote video / Other participant placeholder */}
            <div className="absolute inset-0 bg-gradient-to-br from-amc-teal/10 to-amc-blue/10" />
            <div className="text-center z-10">
              <div className="w-16 h-16 md:w-24 md:h-24 rounded-full bg-amc-teal/20 flex items-center justify-center mx-auto mb-4">
                {activeChannel?.type === 'direct' ? (
                  <Avatar
                    name={activeChannel.name}
                    initials={activeChannel.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                    type="doctor"
                    size="lg"
                  />
                ) : (
                  <Users className="w-8 h-8 md:w-12 md:h-12 text-amc-teal" />
                )}
              </div>
              <h3 className="text-base md:text-lg font-semibold">{activeChannel?.name}</h3>
              <p className="text-white/50 text-sm">
                {callActive ? formatCallDuration(callDuration) : 'Connecting...'}
              </p>
            </div>

            {/* Self view with actual camera feed */}
            <div className="absolute bottom-2 right-2 md:bottom-4 md:right-4 w-24 h-18 md:w-40 md:h-28 rounded-lg bg-black border-2 border-white/20 overflow-hidden shadow-lg">
              {isVideoOff ? (
                <div className="w-full h-full flex items-center justify-center bg-amc-darker">
                  <VideoOff className="w-6 h-6 md:w-8 md:h-8 text-white/30" />
                </div>
              ) : localStream ? (
                <video
                  ref={localVideoRef}
                  autoPlay
                  playsInline
                  muted
                  className="w-full h-full object-cover mirror"
                  style={{ transform: 'scaleX(-1)' }}
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-amc-darker">
                  <div className="text-center">
                    <div className="w-5 h-5 md:w-6 md:h-6 border-2 border-amc-teal border-t-transparent rounded-full animate-spin mx-auto mb-1" />
                    <span className="text-xs text-white/50 hidden md:inline">Starting camera...</span>
                  </div>
                </div>
              )}
              <div className="absolute bottom-1 left-1 px-1.5 md:px-2 py-0.5 rounded bg-black/60 text-xs text-white/70">
                You
              </div>
            </div>
          </div>

          <div className="flex justify-center gap-3 md:gap-4">
            <button
              onClick={() => setIsMuted(!isMuted)}
              className={clsx(
                'p-3.5 md:p-4 rounded-full transition-colors touch-target haptic-tap',
                isMuted ? 'bg-amc-red' : 'bg-white/10 hover:bg-white/20 active:bg-white/25'
              )}
            >
              {isMuted ? <MicOff className="w-5 h-5 md:w-6 md:h-6" /> : <Mic className="w-5 h-5 md:w-6 md:h-6" />}
            </button>
            <button
              onClick={() => setIsVideoOff(!isVideoOff)}
              className={clsx(
                'p-3.5 md:p-4 rounded-full transition-colors touch-target haptic-tap',
                isVideoOff ? 'bg-amc-red' : 'bg-white/10 hover:bg-white/20 active:bg-white/25'
              )}
            >
              {isVideoOff ? <VideoOff className="w-5 h-5 md:w-6 md:h-6" /> : <Video className="w-5 h-5 md:w-6 md:h-6" />}
            </button>
            <button
              onClick={handleEndCall}
              className="p-3.5 md:p-4 rounded-full bg-amc-red hover:bg-amc-red/80 active:bg-amc-red/70 transition-colors touch-target haptic-tap"
            >
              <PhoneOff className="w-5 h-5 md:w-6 md:h-6" />
            </button>
          </div>
        </div>
      </Modal>

      {/* New Channel Modal */}
      <Modal
        isOpen={showNewChannelModal}
        onClose={() => setShowNewChannelModal(false)}
        title="Create New Channel"
        size="md"
      >
        <div className="space-y-4 py-2">
          <div>
            <label className="block text-sm font-medium text-white/70 mb-2">Channel Name</label>
            <input
              type="text"
              value={newChannelForm.name}
              onChange={(e) => setNewChannelForm({ ...newChannelForm, name: e.target.value })}
              placeholder="e.g., project-alpha"
              className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-base text-white placeholder:text-white/40 focus:outline-none focus:border-amc-teal/50"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-white/70 mb-2">Description</label>
            <input
              type="text"
              value={newChannelForm.description}
              onChange={(e) => setNewChannelForm({ ...newChannelForm, description: e.target.value })}
              placeholder="What's this channel about?"
              className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-base text-white placeholder:text-white/40 focus:outline-none focus:border-amc-teal/50"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-white/70 mb-2">Channel Type</label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setNewChannelForm({ ...newChannelForm, type: 'group' })}
                className={clsx(
                  'p-4 rounded-xl border transition-colors text-left haptic-tap',
                  newChannelForm.type === 'group'
                    ? 'border-amc-teal bg-amc-teal/10'
                    : 'border-white/10 hover:border-white/20 active:bg-white/5'
                )}
              >
                <Users className="w-6 h-6 mb-2 text-amc-teal" />
                <div className="font-medium">Group</div>
                <div className="text-xs text-white/50">For teams and projects</div>
              </button>
              <button
                type="button"
                onClick={() => setNewChannelForm({ ...newChannelForm, type: 'department' })}
                className={clsx(
                  'p-4 rounded-xl border transition-colors text-left haptic-tap',
                  newChannelForm.type === 'department'
                    ? 'border-amc-blue bg-amc-blue/10'
                    : 'border-white/10 hover:border-white/20 active:bg-white/5'
                )}
              >
                <Hash className="w-6 h-6 mb-2 text-amc-blue" />
                <div className="font-medium">Department</div>
                <div className="text-xs text-white/50">For department comms</div>
              </button>
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            <Button
              variant="secondary"
              className="flex-1 py-3"
              onClick={() => setShowNewChannelModal(false)}
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              className="flex-1 py-3"
              onClick={handleCreateChannel}
            >
              Create Channel
            </Button>
          </div>
        </div>
      </Modal>

      {/* Direct Message Modal */}
      <Modal
        isOpen={showDirectMessageModal}
        onClose={() => setShowDirectMessageModal(false)}
        title="New Direct Message"
        size="md"
      >
        <div className="py-2">
          <div className="mb-4">
            <label className="block text-sm font-medium text-white/70 mb-2">Select a staff member</label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
              <input
                type="text"
                placeholder="Search staff..."
                className="w-full pl-10 pr-4 py-3 rounded-xl bg-white/5 border border-white/10 text-base text-white placeholder:text-white/40 focus:outline-none focus:border-amc-teal/50"
              />
            </div>
          </div>

          <div className="space-y-2 max-h-80 overflow-y-auto momentum-scroll">
            {staffData
              .filter(staff => staff.id !== user?.staffId)
              .map(staff => {
                const isOnline = onlineUsers.has(staff.id);
                const dept = departmentData.find(d => d.name === staff.department);

                return (
                  <button
                    key={staff.id}
                    onClick={() => handleStartDirectMessage(staff.id)}
                    className="w-full flex items-center gap-3 p-3 md:p-3 rounded-xl hover:bg-white/5 active:bg-white/10 transition-colors text-left haptic-tap"
                  >
                    <div className="relative">
                      <Avatar
                        name={staff.name}
                        initials={staff.avatar}
                        type={staff.type}
                        size="md"
                      />
                      <div
                        className={clsx(
                          'absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full border-2 border-amc-darker',
                          isOnline ? 'bg-amc-green' : 'bg-white/30'
                        )}
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-medium truncate">{staff.name}</div>
                      <div className="text-sm text-white/50 truncate">{staff.role}</div>
                      <div className="text-xs text-white/30">{dept?.name || 'Unknown Department'}</div>
                    </div>
                    <Badge variant={isOnline ? 'success' : 'default'} size="sm">
                      {isOnline ? 'Online' : 'Offline'}
                    </Badge>
                  </button>
                );
              })}
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default Chat;
