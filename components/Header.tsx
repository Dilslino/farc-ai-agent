import React from 'react';
import { VisualTheme } from '../types';
import { Monitor, Palette, Moon, Sun } from 'lucide-react';

interface HeaderProps {
  currentTheme: VisualTheme;
  onToggleTheme: () => void;
}

const Header: React.FC<HeaderProps> = ({ currentTheme, onToggleTheme }) => {
  
  // Theme specific styles
  const getThemeStyles = () => {
    switch(currentTheme) {
        case 'pastel':
            return {
                indicator: 'bg-emerald-400 shadow-[0_0_10px_rgba(52,211,153,0.4)]',
                text: 'text-zinc-500',
                hoverText: 'hover:text-violet-500',
                title: 'text-zinc-800'
            };
        case 'zen':
            return {
                indicator: 'bg-emerald-500',
                text: 'text-slate-400',
                hoverText: 'hover:text-emerald-400',
                title: 'text-slate-200'
            };
        case 'neon':
            return {
                indicator: 'bg-fuchsia-500',
                text: 'text-cyan-200/60',
                hoverText: 'hover:text-fuchsia-300',
                title: 'text-white'
            };
        default: // nexus
            return {
                indicator: 'bg-indigo-500',
                text: 'text-zinc-500',
                hoverText: 'hover:text-indigo-400',
                title: 'text-white'
            };
    }
  };

  const styles = getThemeStyles();

  return (
    <header className={`fixed top-0 left-0 right-0 h-20 z-50 flex items-center justify-between px-6 md:px-8 pointer-events-none backdrop-blur-[2px] transition-all duration-500 ${currentTheme === 'pastel' ? 'bg-white/30' : 'bg-gradient-to-b from-zinc-950 via-zinc-950/80 to-transparent'}`}>
      {/* Left: Brand */}
      <div className="pointer-events-auto flex flex-col gap-0.5">
        <div className="flex items-baseline gap-1.5">
            <h1 className={`text-xl font-display font-bold tracking-tight transition-colors duration-300 ${styles.title}`}>
            Farc
            </h1>
            <div className={`w-1.5 h-1.5 rounded-full animate-pulse ${styles.indicator}`}></div>
        </div>
      </div>

      {/* Right: Minimal Status & Theme Switcher */}
      <div className="pointer-events-auto flex items-center gap-4 md:gap-6">
        
        {/* Minimal Creator Tag */}
        <div className="hidden md:flex flex-col items-end opacity-80">
             <span className={`text-[10px] font-mono uppercase tracking-[0.2em] transition-colors duration-300 ${styles.text}`}>xDill Systems</span>
             <div className="flex items-center gap-1.5 mt-0.5">
                <span className={`w-1 h-1 rounded-full ${styles.indicator}`}></span>
                <span className={`text-[8px] font-bold uppercase tracking-wider opacity-50 ${currentTheme === 'pastel' ? 'text-zinc-500' : currentTheme === 'zen' ? 'text-slate-400' : 'text-zinc-400'}`}>Online</span>
            </div>
        </div>

        <div className={`hidden md:block w-[1px] h-5 bg-current opacity-10 ${currentTheme === 'pastel' ? 'text-zinc-900' : 'text-white'}`}></div>

        {/* Theme Switcher Button - Icon Only, Minimal */}
        <button 
            onClick={onToggleTheme}
            className={`group relative p-2 rounded-full transition-all duration-300 hover:bg-white/10 ${styles.text} ${styles.hoverText}`}
            title={`Theme: ${currentTheme.toUpperCase()}`}
        >
             {currentTheme === 'pastel' && <Sun size={18} strokeWidth={1.5} />}
             {currentTheme === 'nexus' && <Monitor size={18} strokeWidth={1.5} />}
             {currentTheme === 'zen' && <Moon size={18} strokeWidth={1.5} />}
             {currentTheme === 'neon' && <Palette size={18} strokeWidth={1.5} />}
             
             {/* Tiny indicator dot */}
             <span className="absolute top-1.5 right-2 w-1 h-1 rounded-full bg-current opacity-0 group-hover:opacity-100 transition-opacity"></span>
        </button>
      </div>
    </header>
  );
};

export default Header;