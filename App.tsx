import React, { useState, useRef, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { Message, Role, VisualTheme, Attachment } from './types';
import { sendMessageStream } from './services/geminiService';
import Header from './components/Header';
import MessageBubble from './components/MessageBubble';
import InputArea from './components/InputArea';
import SuggestionGrid from './components/SuggestionGrid';

const App: React.FC = () => {
  const [theme, setTheme] = useState<VisualTheme>('pastel');
  const [messages, setMessages] = useState<Message[]>([
    {
        id: 'welcome',
        role: Role.MODEL,
        text: "Halo! Saya farc, AI buatan xDill. Saya siap jadi teman ngobrol kamu soal Crypto dan Psikologi Trading. Gimana nih, ada yang lagi bikin pusing hari ini? Yuk, spill aja!",
        timestamp: Date.now()
    }
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const handleSendMessage = async (text: string, attachment?: Attachment) => {
    const userMsg: Message = {
      id: uuidv4(),
      role: Role.USER,
      text: text,
      timestamp: Date.now(),
      attachment: attachment
    };

    setMessages((prev) => [...prev, userMsg]);
    setIsLoading(true);

    const aiMsgId = uuidv4();
    const aiPlaceholderMsg: Message = {
        id: aiMsgId,
        role: Role.MODEL,
        text: '',
        timestamp: Date.now(),
        isThinking: true
    };
    
    setMessages((prev) => [...prev, aiPlaceholderMsg]);

    try {
      let accumulatedText = "";
      await sendMessageStream(text, attachment, messages, (chunk) => {
        accumulatedText += chunk;
        setMessages((prev) => 
            prev.map(msg => 
                msg.id === aiMsgId 
                ? { ...msg, text: accumulatedText, isThinking: false } 
                : msg
            )
        );
      });
    } catch (error) {
      console.error(error);
      setMessages((prev) => 
        prev.map(msg => 
            msg.id === aiMsgId 
            ? { ...msg, text: "Koneksi neural terputus. Silakan coba lagi.", isThinking: false } 
            : msg
        )
      );
    } finally {
      setIsLoading(false);
    }
  };

  const cycleTheme = () => {
    const themes: VisualTheme[] = ['pastel', 'nexus', 'zen', 'neon'];
    const nextIndex = (themes.indexOf(theme) + 1) % themes.length;
    setTheme(themes[nextIndex]);
  };

  // Theme-based background rendering
  const renderBackground = () => {
    switch (theme) {
        case 'pastel':
            return (
                <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden bg-[#fdfbf7] transition-colors duration-700">
                    <div className="absolute top-[-10%] left-[-10%] w-[70%] h-[70%] bg-rose-100/60 rounded-full blur-[120px] mix-blend-multiply animate-float"></div>
                    <div className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] bg-indigo-100/60 rounded-full blur-[100px] mix-blend-multiply animate-float [animation-delay:2s]"></div>
                    <div className="absolute top-[40%] left-[40%] w-[50%] h-[50%] bg-teal-100/50 rounded-full blur-[100px] mix-blend-multiply animate-float [animation-delay:4s]"></div>
                    <div className="absolute inset-0 bg-white/20 backdrop-blur-[2px]"></div>
                </div>
            );
        case 'zen':
            return (
                <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden bg-slate-900 transition-colors duration-700">
                    <div className="absolute inset-0 bg-gradient-to-b from-slate-800/20 to-slate-950"></div>
                    <div className="absolute top-[-10%] right-[-10%] w-[60%] h-[60%] bg-emerald-900/5 rounded-full blur-[120px]"></div>
                </div>
            );
        case 'neon':
            return (
                <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden bg-black transition-colors duration-700">
                     <div className="absolute inset-0 bg-[linear-gradient(to_right,#222_1px,transparent_1px),linear-gradient(to_bottom,#222_1px,transparent_1px)] bg-[size:2rem_2rem] opacity-20"></div>
                     <div className="absolute top-[10%] left-[20%] w-[300px] h-[300px] bg-fuchsia-600/10 rounded-full blur-[100px] animate-pulse"></div>
                     <div className="absolute bottom-[10%] right-[20%] w-[300px] h-[300px] bg-cyan-600/10 rounded-full blur-[100px] animate-pulse [animation-delay:1s]"></div>
                     <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-10 mix-blend-overlay"></div>
                </div>
            );
        case 'nexus':
        default:
            return (
                <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden bg-zinc-950 transition-colors duration-700">
                    {/* Ambient Gradients */}
                    <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-indigo-900/10 rounded-full blur-[120px] opacity-50 animate-float"></div>
                    <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-violet-900/10 rounded-full blur-[100px] opacity-30"></div>
                    
                    {/* Technical Grid Overlay */}
                    <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]"></div>
                    
                    {/* Subtle Data Noise Texture */}
                    <div className="absolute inset-0 opacity-[0.015] bg-[url('https://grainy-gradients.vercel.app/noise.svg')] mix-blend-overlay"></div>
                </div>
            );
    }
  };

  // Helper for loading indicator colors based on theme
  const getLoadingColors = () => {
    switch(theme) {
        case 'pastel': return 'bg-white text-violet-400 border-violet-100 shadow-sm';
        case 'zen': return 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30';
        case 'neon': return 'bg-fuchsia-500/20 text-fuchsia-400 border-fuchsia-500/50';
        default: return 'bg-zinc-900/80 text-indigo-400 border-indigo-500/30';
    }
  }

  const getLoadingDotColor = () => {
    switch(theme) {
        case 'pastel': return 'bg-violet-400';
        case 'zen': return 'bg-emerald-500';
        case 'neon': return 'bg-fuchsia-500';
        default: return 'bg-indigo-500';
    }
  }

  return (
    <div className={`min-h-screen font-sans selection:text-white overflow-hidden flex flex-col relative transition-colors duration-500 ${
        theme === 'pastel' ? 'text-zinc-700 selection:bg-violet-300 selection:text-violet-900' :
        theme === 'zen' ? 'text-slate-200 selection:bg-emerald-500/30' : 
        theme === 'neon' ? 'text-cyan-50 selection:bg-fuchsia-500/40' : 
        'text-zinc-100 selection:bg-indigo-500/30'
    }`}>
      
      {renderBackground()}

      <Header currentTheme={theme} onToggleTheme={cycleTheme} />

      {/* Main Chat Container */}
      <main className="flex-1 relative z-10 overflow-y-auto pt-28 pb-36 px-4 md:px-0 scrollbar-none">
        <div className="max-w-3xl mx-auto w-full flex flex-col">
            
            {messages.map((msg) => (
                <MessageBubble key={msg.id} message={msg} theme={theme} />
            ))}

            {/* Suggestion Grid - Only show when just the welcome message exists */}
            {messages.length === 1 && !isLoading && (
                <SuggestionGrid onSelect={(text) => handleSendMessage(text)} theme={theme} />
            )}

            {isLoading && messages[messages.length - 1]?.isThinking && (
               <div className="flex items-start gap-4 mt-2 mb-8 px-2 md:px-0 animate-pulse">
                    <div className="hidden md:flex flex-col items-center gap-1 mt-1">
                        <div className={`w-8 h-8 rounded-full border flex items-center justify-center shadow-sm transition-colors duration-300 ${getLoadingColors()}`}>
                            <span className="font-display font-bold text-xs">F</span>
                        </div>
                    </div>
                   <div className="flex flex-col gap-1">
                        <span className={`text-[10px] font-mono uppercase tracking-widest ml-1 ${theme === 'pastel' ? 'text-violet-400' : theme === 'zen' ? 'text-emerald-500/60' : theme === 'neon' ? 'text-fuchsia-500/70' : 'text-indigo-400/70'}`}>Processing</span>
                        <div className="flex gap-1 ml-1">
                             <div className={`w-1.5 h-1.5 rounded-full animate-bounce [animation-delay:-0.3s] ${getLoadingDotColor()}`}></div>
                             <div className={`w-1.5 h-1.5 rounded-full animate-bounce [animation-delay:-0.15s] ${getLoadingDotColor()}`}></div>
                             <div className={`w-1.5 h-1.5 rounded-full animate-bounce ${getLoadingDotColor()}`}></div>
                        </div>
                   </div>
               </div>
            )}
            
            <div ref={messagesEndRef} className="h-4" />
        </div>
      </main>

      <InputArea onSendMessage={handleSendMessage} isLoading={isLoading} theme={theme} />
      
    </div>
  );
};

export default App;