import React, { useState, useRef, useEffect } from 'react';
import { ArrowUp, Paperclip, X, Image as ImageIcon } from 'lucide-react';
import { VisualTheme, Attachment } from '../types';

interface InputAreaProps {
  onSendMessage: (text: string, attachment?: Attachment) => void;
  isLoading: boolean;
  theme: VisualTheme;
}

const InputArea: React.FC<InputAreaProps> = ({ onSendMessage, isLoading, theme }) => {
  const [input, setInput] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const [attachment, setAttachment] = useState<Attachment | undefined>(undefined);
  
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 100)}px`;
    }
  }, [input]);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
        const reader = new FileReader();
        reader.onloadend = () => {
            const base64String = reader.result as string;
            // Extract raw base64 data (remove "data:image/jpeg;base64," prefix)
            const base64Data = base64String.split(',')[1];
            
            setAttachment({
                mimeType: file.type,
                data: base64Data
            });
        };
        reader.readAsDataURL(file);
    }
    // Reset input so same file can be selected again
    if (fileInputRef.current) {
        fileInputRef.current.value = '';
    }
  };

  const clearAttachment = () => {
    setAttachment(undefined);
  };

  const handleSubmit = (e?: React.FormEvent) => {
    e?.preventDefault();
    if ((!input.trim() && !attachment) || isLoading) return;
    
    onSendMessage(input, attachment);
    
    setInput('');
    setAttachment(undefined);
    if (textareaRef.current) {
        textareaRef.current.style.height = 'auto';
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  // Theme Styles
  const getThemeStyles = () => {
    switch(theme) {
        case 'pastel':
            return {
                gradient: 'from-violet-200 via-pink-200 to-violet-200',
                container: 'bg-white border-white/60 shadow-[0_4px_20px_rgba(0,0,0,0.04)]',
                corner: '', // No tech corners
                buttonActive: 'bg-zinc-800 text-white shadow-md hover:bg-zinc-700',
                iconHover: 'hover:text-violet-500',
                placeholder: 'placeholder-zinc-400 text-zinc-700',
                previewBg: 'bg-white border-zinc-100 shadow-sm',
                attachmentIcon: 'text-zinc-400 hover:bg-zinc-100'
            };
        case 'zen':
            return {
                gradient: 'from-slate-400 via-emerald-400 to-slate-400',
                container: isFocused ? 'border-emerald-500/30 bg-slate-900' : 'border-slate-700/30 bg-slate-900/80',
                corner: 'border-emerald-400/50',
                buttonActive: 'bg-emerald-600 text-white shadow-md',
                iconHover: 'hover:text-emerald-400',
                placeholder: 'placeholder-slate-500 text-slate-200',
                previewBg: 'bg-slate-800 border-slate-700',
                attachmentIcon: 'text-zinc-500'
            };
        case 'neon':
            return {
                gradient: 'from-fuchsia-600 via-cyan-500 to-fuchsia-600',
                container: isFocused ? 'border-fuchsia-500 bg-black shadow-[0_0_30px_-5px_rgba(217,70,239,0.3)]' : 'border-zinc-800 bg-black/90',
                corner: 'border-cyan-400',
                buttonActive: 'bg-gradient-to-r from-fuchsia-500 to-cyan-500 text-black shadow-[0_0_15px_rgba(217,70,239,0.5)]',
                iconHover: 'hover:text-fuchsia-400',
                placeholder: 'placeholder-zinc-600 text-cyan-50 font-mono',
                previewBg: 'bg-zinc-900 border-fuchsia-500/50',
                attachmentIcon: 'text-zinc-500'
            };
        default: // nexus
            return {
                gradient: 'from-indigo-500 via-purple-500 to-indigo-500',
                container: isFocused ? 'border-indigo-500/40 bg-zinc-900/90' : 'border-white/10 bg-zinc-950/80',
                corner: 'border-indigo-400/50',
                buttonActive: 'bg-white text-black hover:scale-105 active:scale-95 shadow-[0_0_15px_-3px_rgba(255,255,255,0.4)]',
                iconHover: 'hover:text-indigo-400',
                placeholder: 'placeholder-zinc-600 text-zinc-200',
                previewBg: 'bg-zinc-900 border-white/10',
                attachmentIcon: 'text-zinc-500'
            };
    }
  };

  const styles = getThemeStyles();
  
  // Gradient mask for bottom area
  const bottomGradient = theme === 'pastel' 
    ? 'from-[#fdfbf7] via-[#fdfbf7]/95' 
    : theme === 'zen' 
        ? 'from-slate-950 via-slate-950/90' 
        : 'from-zinc-950 via-zinc-950/90';

  return (
    <div className={`fixed bottom-0 left-0 right-0 p-6 z-40 flex flex-col items-center justify-end bg-gradient-to-t ${bottomGradient} to-transparent pt-20 transition-colors duration-500`}>
      
      {/* Image Preview */}
      {attachment && (
        <div className={`relative mb-4 p-2 rounded-xl border backdrop-blur-md animate-[fadeIn_0.3s_ease-out] ${styles.previewBg} max-w-[200px]`}>
            <div className="relative rounded-lg overflow-hidden aspect-video">
                 <img 
                    src={`data:${attachment.mimeType};base64,${attachment.data}`} 
                    alt="Preview" 
                    className="w-full h-full object-cover"
                />
            </div>
            <button 
                onClick={clearAttachment}
                className="absolute -top-2 -right-2 p-1 rounded-full bg-white text-zinc-500 border border-zinc-200 hover:bg-rose-100 hover:text-rose-500 transition-colors shadow-sm"
            >
                <X size={12} />
            </button>
            <div className="mt-2 flex items-center gap-2 px-1">
                <ImageIcon size={12} className="opacity-50" />
                <span className="text-[10px] font-mono truncate opacity-70">Image Attached</span>
            </div>
        </div>
      )}

      <div className="w-full max-w-3xl relative">
        <form 
            onSubmit={handleSubmit}
            className="relative group"
        >
            {/* Glow Behind */}
            <div className={`absolute -inset-1 bg-gradient-to-r rounded-3xl blur-xl transition-all duration-500 ${styles.gradient} ${isFocused ? 'opacity-40' : 'opacity-0 group-hover:opacity-20'}`}></div>
            
            <div className={`relative flex items-end backdrop-blur-xl border rounded-[28px] p-2 transition-all duration-300 ${styles.container}`}>
                
                {/* Decorative corners (Only for tech themes) */}
                {isFocused && theme !== 'zen' && theme !== 'pastel' && (
                    <>
                        <div className={`absolute top-0 left-0 w-2 h-2 border-l border-t rounded-tl-[20px] ${styles.corner}`}></div>
                        <div className={`absolute top-0 right-0 w-2 h-2 border-r border-t rounded-tr-[20px] ${styles.corner}`}></div>
                        <div className={`absolute bottom-0 left-0 w-2 h-2 border-l border-b rounded-bl-[20px] ${styles.corner}`}></div>
                        <div className={`absolute bottom-0 right-0 w-2 h-2 border-r border-b rounded-br-[20px] ${styles.corner}`}></div>
                    </>
                )}

                {/* Left Actions: Attachment */}
                <div className="flex items-center pb-3 pl-2 pr-1">
                    <input 
                        type="file" 
                        accept="image/*"
                        ref={fileInputRef}
                        className="hidden"
                        onChange={handleFileSelect}
                    />
                    <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className={`p-2 rounded-full transition-colors ${styles.attachmentIcon} ${styles.iconHover} active:scale-95`}
                        title="Upload Image"
                    >
                        <Paperclip size={20} strokeWidth={2} />
                    </button>
                </div>

                <textarea
                    ref={textareaRef}
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                    onFocus={() => setIsFocused(true)}
                    onBlur={() => setIsFocused(false)}
                    placeholder="Ketik pesan..."
                    className={`w-full bg-transparent text-base px-2 py-3.5 focus:outline-none resize-none max-h-[100px] scrollbar-hide rounded-2xl font-medium transition-colors duration-300 ${styles.placeholder}`}
                    rows={1}
                    disabled={isLoading}
                />

                {/* Right Actions: Send */}
                <div className="flex items-end gap-1 pb-1 pr-1">
                    <button
                        type="submit"
                        disabled={(!input.trim() && !attachment) || isLoading}
                        className={`p-3 rounded-full flex-shrink-0 transition-all duration-300 flex items-center justify-center relative overflow-hidden shadow-sm
                            ${(!input.trim() && !attachment) || isLoading 
                                ? 'bg-zinc-100 text-zinc-300 opacity-50 cursor-not-allowed' 
                                : styles.buttonActive
                            }`}
                    >
                        <ArrowUp size={18} strokeWidth={3} />
                    </button>
                </div>
            </div>
        </form>
      </div>
    </div>
  );
};

export default InputArea;