import React from 'react';
import { Bot, Sparkles, Brain, AlertTriangle, BookOpen, Zap } from 'lucide-react';

interface AIMessageBubbleProps {
  content: string;
  timestamp: string;
  isTyping?: boolean;
}

const AIMessageBubble: React.FC<AIMessageBubbleProps> = ({ content, timestamp, isTyping }) => {
  const formatTime = (ts: string) => {
    return new Date(ts).toLocaleString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });
  };

  // Parse content for special formatting
  const renderContent = (text: string) => {
    // Split by lines and process
    const lines = text.split('\n');

    return lines.map((line, i) => {
      // Headers (bold with **)
      if (line.startsWith('**') && line.endsWith('**')) {
        return (
          <div key={i} className="font-semibold text-white mt-2 mb-1 first:mt-0">
            {line.replace(/\*\*/g, '')}
          </div>
        );
      }

      // Headers with content after **Header:**
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
            <span className="text-amc-purple mt-1">•</span>
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

      // Warning/Alert lines
      if (line.includes('⚠️') || line.toLowerCase().includes('warning')) {
        return (
          <div key={i} className="flex items-center gap-2 text-amc-yellow mt-2 bg-amc-yellow/10 px-3 py-2 rounded-lg">
            <AlertTriangle className="w-4 h-4 flex-shrink-0" />
            <span>{line.replace('⚠️', '').trim()}</span>
          </div>
        );
      }

      // Empty lines
      if (!line.trim()) {
        return <div key={i} className="h-2" />;
      }

      // Regular text
      return (
        <div key={i} className="text-white/80">
          {line}
        </div>
      );
    });
  };

  if (isTyping) {
    return (
      <div className="flex gap-3 px-4 py-3">
        {/* AI Avatar */}
        <div className="relative flex-shrink-0">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amc-purple via-purple-500 to-pink-500 flex items-center justify-center shadow-lg shadow-purple-500/20">
            <Bot className="w-5 h-5 text-white" />
          </div>
          <div className="absolute -bottom-0.5 -right-0.5 w-4 h-4 rounded-full bg-amc-green border-2 border-amc-darker flex items-center justify-center">
            <Sparkles className="w-2 h-2 text-white" />
          </div>
        </div>

        {/* Typing indicator */}
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <span className="font-semibold text-sm bg-gradient-to-r from-amc-purple to-pink-400 bg-clip-text text-transparent">
              AMC AI Assistant
            </span>
            <span className="text-xs text-amc-purple/60">AI</span>
          </div>
          <div className="inline-flex items-center gap-2 px-4 py-3 rounded-2xl rounded-tl-md bg-gradient-to-br from-amc-purple/20 to-purple-900/20 border border-amc-purple/20">
            <Brain className="w-4 h-4 text-amc-purple animate-pulse" />
            <span className="text-white/60 text-sm">Thinking</span>
            <div className="flex gap-1">
              <div className="w-2 h-2 rounded-full bg-amc-purple animate-bounce" style={{ animationDelay: '0ms' }} />
              <div className="w-2 h-2 rounded-full bg-amc-purple animate-bounce" style={{ animationDelay: '150ms' }} />
              <div className="w-2 h-2 rounded-full bg-amc-purple animate-bounce" style={{ animationDelay: '300ms' }} />
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex gap-3 px-4 py-3 animate-fade-in-up">
      {/* AI Avatar */}
      <div className="relative flex-shrink-0">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amc-purple via-purple-500 to-pink-500 flex items-center justify-center shadow-lg shadow-purple-500/20 animate-pulse-glow">
          <Bot className="w-5 h-5 text-white" />
        </div>
        <div className="absolute -bottom-0.5 -right-0.5 w-4 h-4 rounded-full bg-amc-green border-2 border-amc-darker flex items-center justify-center">
          <Zap className="w-2 h-2 text-white" />
        </div>
      </div>

      {/* Message Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-2">
          <span className="font-semibold text-sm bg-gradient-to-r from-amc-purple to-pink-400 bg-clip-text text-transparent">
            AMC AI Assistant
          </span>
          <div className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-amc-purple/20 border border-amc-purple/30">
            <Sparkles className="w-3 h-3 text-amc-purple" />
            <span className="text-[10px] font-medium text-amc-purple">AI</span>
          </div>
          <span className="text-xs text-white/30">{formatTime(timestamp)}</span>
        </div>

        {/* Message bubble with gradient border */}
        <div className="relative group">
          {/* Gradient border effect */}
          <div className="absolute -inset-[1px] bg-gradient-to-r from-amc-purple/50 via-pink-500/50 to-amc-purple/50 rounded-2xl rounded-tl-md blur-sm opacity-50 group-hover:opacity-75 transition-opacity" />

          {/* Content */}
          <div className="relative px-4 py-3 rounded-2xl rounded-tl-md bg-gradient-to-br from-amc-purple/10 via-purple-900/10 to-pink-900/10 border border-amc-purple/20 backdrop-blur-sm">
            <div className="text-sm leading-relaxed space-y-1">
              {renderContent(content)}
            </div>
          </div>
        </div>

        {/* AI Footer */}
        <div className="flex items-center gap-3 mt-2 text-xs text-white/40">
          <div className="flex items-center gap-1">
            <Brain className="w-3 h-3" />
            <span>AI Generated</span>
          </div>
          <div className="flex items-center gap-1">
            <BookOpen className="w-3 h-3" />
            <span>Based on AMC Knowledge Base</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIMessageBubble;
