import React from 'react';
import { Message, Role, VisualTheme } from '../types';
import MarkdownRenderer from './MarkdownRenderer';

interface MessageBubbleProps {
  message: Message;
  theme: VisualTheme;
}

const MessageBubble: React.FC<MessageBubbleProps> = ({ message, theme }) => {
  const isUser = message.role === Role.USER;

  // Theme-specific styling helpers
  const getStyles = () => {
    switch (theme) {
        case 'pastel':
            return {
                avatarBg: 'bg-white border-violet-100',
                avatarText: 'text-violet-500',
                avatarShadow: 'shadow-sm',
                thread: 'from-transparent',
                // User: Soft Gradient with Dark Text
                userBubble: 'bg-gradient-to-br from-violet-100 to-rose-100 text-zinc-800 shadow-sm border border-white/50',
                aiLabel: 'text-violet-400',
                endBlock: 'bg-violet-200 text-violet-300',
                markdownClass: 'prose-zinc',
                imageBorder: 'border-violet-100 shadow-sm'
            };
        case 'zen':
            return {
                avatarBg: 'bg-slate-800/80 border-slate-700',
                avatarText: 'text-emerald-400',
                avatarShadow: 'shadow-none',
                thread: 'from-emerald-500/20',
                userBubble: 'bg-slate-200 text-slate-900 shadow-sm',
                aiLabel: 'text-emerald-500',
                endBlock: 'bg-emerald-500/30 text-emerald-500/50',
                markdownClass: 'prose-zinc',
                imageBorder: 'border-slate-300'
            };
        case 'neon':
            return {
                avatarBg: 'bg-black border-fuchsia-500/50',
                avatarText: 'text-fuchsia-400',
                avatarShadow: 'shadow-[0_0_20px_-5px_rgba(217,70,239,0.4)]',
                thread: 'from-fuchsia-500/50',
                userBubble: 'bg-white text-black shadow-[0_0_15px_rgba(255,255,255,0.3)] rounded-none skew-x-[-6deg]',
                aiLabel: 'text-cyan-400',
                endBlock: 'bg-cyan-500/30 text-cyan-500/50',
                markdownClass: '',
                imageBorder: 'border-fuchsia-500/50 shadow-[0_0_10px_rgba(217,70,239,0.3)]'
            };
        default: // nexus
            return {
                avatarBg: 'bg-zinc-900/80 border-indigo-500/30',
                avatarText: 'text-indigo-400',
                avatarShadow: 'shadow-[0_0_15px_-3px_rgba(99,102,241,0.2)]',
                thread: 'from-indigo-500/30',
                userBubble: 'bg-zinc-100 text-zinc-950 shadow-lg shadow-white/5',
                aiLabel: 'text-indigo-400',
                endBlock: 'bg-indigo-500/30 text-indigo-500/40',
                markdownClass: '',
                imageBorder: 'border-white/10'
            };
    }
  };

  const styles = getStyles();

  return (
    <div 
        className={`group flex w-full mb-6 ${isUser ? 'justify-end' : 'justify-start'} animate-[fadeIn_0.4s_ease-out_forwards]`}
    >
      {/* Avatar Area - Enhanced with Data Thread */}
      {!isUser && (
        <div className="hidden md:flex flex-shrink-0 mr-6 mt-1 flex-col items-center gap-1 h-auto">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center border relative z-10 transition-all duration-300 ${styles.avatarBg} ${styles.avatarShadow}`}>
                <span className={`font-display font-bold text-sm ${styles.avatarText}`}>F</span>
            </div>
            {/* Vertical Data Thread Line (Hidden in pastel for cleaner look) */}
            {theme !== 'pastel' && (
                <div className={`w-[1px] flex-1 bg-gradient-to-b to-transparent min-h-[20px] transition-colors duration-500 ${styles.thread}`}></div>
            )}
        </div>
      )}

      <div 
        className={`relative max-w-[90%] md:max-w-[70%] lg:max-w-[60%] transition-all duration-300`}
      >
        {isUser ? (
            // User Style
            <div className="flex flex-col items-end gap-2">
                {message.attachment && (
                    <div className={`overflow-hidden rounded-2xl border ${styles.imageBorder} mb-1 max-w-[250px]`}>
                        <img 
                            src={`data:${message.attachment.mimeType};base64,${message.attachment.data}`} 
                            alt="User upload" 
                            className="w-full h-auto object-cover"
                        />
                    </div>
                )}
                
                {message.text && (
                    <div className={`px-6 py-3.5 rounded-[2rem] rounded-tr-sm relative overflow-hidden transition-all duration-300 ${styles.userBubble}`}>
                        <span className={`relative z-10 text-base font-medium leading-relaxed ${theme === 'neon' ? 'skew-x-[6deg] inline-block' : ''}`}>
                            {message.text}
                        </span>
                    </div>
                )}
            </div>
        ) : (
            // AI Style
            <div className={`px-4 py-2 md:px-6 md:py-4 rounded-3xl ${theme === 'pastel' ? 'bg-white/70 backdrop-blur-sm shadow-sm border border-white/50' : ''}`}>
                {/* Mobile Avatar Label */}
                <div className="md:hidden flex items-center gap-2 mb-2">
                    <span className={`text-xs font-mono font-bold tracking-wider ${styles.aiLabel}`}>FARC.AI</span>
                </div>

                <div className={`leading-relaxed ${theme === 'pastel' ? 'text-zinc-700 font-normal' : theme === 'zen' ? 'text-slate-300 font-light' : theme === 'neon' ? 'text-cyan-50 drop-shadow-[0_0_5px_rgba(6,182,212,0.3)] font-light' : 'text-zinc-300 font-light'}`}>
                    <MarkdownRenderer content={message.text} theme={theme} />
                </div>
                
                {/* Decorative footer for AI messages - Hidden in pastel */}
                {theme !== 'pastel' && (
                    <div className="mt-4 flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                        <div className={`h-[1px] w-4 ${styles.endBlock.split(' ')[0]}`}></div>
                        <span className={`text-[9px] font-mono uppercase tracking-widest ${styles.endBlock.split(' ')[1]}`}>End_Block</span>
                    </div>
                )}
            </div>
        )}
      </div>
    </div>
  );
};

export default MessageBubble;