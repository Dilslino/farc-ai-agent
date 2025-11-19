import React from 'react';
import { TrendingUp, Brain, Zap, Globe } from 'lucide-react';
import { VisualTheme } from '../types';

interface SuggestionGridProps {
  onSelect: (text: string) => void;
  theme: VisualTheme;
}

const suggestions = [
  {
    id: 'market',
    icon: TrendingUp,
    title: "Psikologi Pasar",
    prompt: "Jelaskan psikologi di balik siklus pasar kripto.",
    desc: "Emosi Bull & Bear."
  },
  {
    id: 'fomo',
    icon: Zap,
    title: "FOMO",
    prompt: "Gimana caranya ngatasin FOMO biar gak nyangkut?",
    desc: "Takut ketinggalan."
  },
  {
    id: 'btc',
    icon: Globe,
    title: "Sosial Bitcoin",
    prompt: "Analisis Bitcoin sebagai kesepakatan sosial.",
    desc: "Antropologi koin."
  },
  {
    id: 'bias',
    icon: Brain,
    title: "Bias Trader",
    prompt: "Apa aja bias kognitif yang bikin boncos?",
    desc: "Sabotase otak."
  }
];

const SuggestionGrid: React.FC<SuggestionGridProps> = ({ onSelect, theme }) => {

  const getThemeClasses = () => {
    switch(theme) {
        case 'pastel':
            return {
                line: 'bg-zinc-200',
                text: 'text-zinc-400',
                cardBg: 'bg-white border-white shadow-[0_2px_8px_rgba(0,0,0,0.04)] hover:shadow-[0_8px_16px_rgba(0,0,0,0.06)] hover:-translate-y-0.5',
                cardBorderHover: 'hover:border-violet-100',
                iconBg: 'bg-violet-50 text-violet-500',
                iconColor: 'text-violet-500',
                title: 'text-zinc-700 group-hover:text-violet-600',
                desc: 'text-zinc-400',
                corner: ''
            };
        case 'zen':
            return {
                line: 'bg-emerald-500/50',
                text: 'text-emerald-400',
                cardBg: 'bg-slate-800/30 border-slate-700/30 hover:bg-slate-800/60',
                cardBorderHover: 'hover:border-emerald-500/30',
                iconBg: 'bg-slate-900 border-slate-700',
                iconColor: 'text-emerald-400',
                title: 'text-slate-200 group-hover:text-emerald-300',
                desc: 'text-slate-500 group-hover:text-slate-400',
                corner: 'group-hover:border-r-emerald-500/20'
            };
        case 'neon':
            return {
                line: 'bg-fuchsia-500/50',
                text: 'text-fuchsia-400',
                cardBg: 'bg-zinc-900/60 border-fuchsia-500/20 hover:bg-black',
                cardBorderHover: 'hover:border-fuchsia-500',
                iconBg: 'bg-black border-fuchsia-900',
                iconColor: 'text-cyan-400',
                title: 'text-cyan-50 group-hover:text-fuchsia-300',
                desc: 'text-zinc-500 group-hover:text-zinc-300',
                corner: 'group-hover:border-r-fuchsia-500/40'
            };
        default: // nexus
            return {
                line: 'bg-indigo-500/50',
                text: 'text-indigo-300',
                cardBg: 'bg-zinc-900/40 border-white/5 hover:bg-zinc-900/80',
                cardBorderHover: 'hover:border-indigo-500/30',
                iconBg: 'bg-zinc-950 border-white/5',
                iconColor: 'text-indigo-400',
                title: 'text-zinc-200 group-hover:text-indigo-100',
                desc: 'text-zinc-500 group-hover:text-zinc-400',
                corner: 'group-hover:border-r-indigo-500/20'
            };
    }
  };

  const styles = getThemeClasses();

  return (
    <div className="w-full max-w-3xl mx-auto mt-4 mb-8 px-2 md:px-0 animate-[fadeIn_0.8s_ease-out_0.2s_both]">
      <div className="flex items-center gap-3 mb-4 px-1 opacity-70">
        <div className={`h-[1px] w-8 ${styles.line}`}></div>
        <p className={`text-[10px] font-mono uppercase tracking-[0.2em] ${styles.text}`}>Saran Topik</p>
        <div className={`h-[1px] flex-1 ${theme === 'pastel' ? 'bg-zinc-200' : 'bg-white/10'}`}></div>
      </div>
      
      <div className="grid grid-cols-2 gap-3">
        {suggestions.map((item, idx) => (
          <button
            key={idx}
            onClick={() => onSelect(item.prompt)}
            className={`group relative flex flex-col md:flex-row items-start md:items-center gap-3 p-4 rounded-2xl border transition-all duration-300 text-left overflow-hidden ${styles.cardBg} ${styles.cardBorderHover}`}
          >
            <div className={`p-2 rounded-xl border transition-all ${styles.iconBg} group-hover:scale-110`}>
              <item.icon className={`w-4 h-4 ${styles.iconColor}`} />
            </div>
            
            <div className="flex-1 relative z-10">
              <h3 className={`text-xs font-display font-bold transition-colors ${styles.title}`}>
                {item.title}
              </h3>
              <p className={`text-[10px] mt-0.5 font-medium leading-relaxed transition-colors ${styles.desc}`}>
                {item.desc}
              </p>
            </div>
            
            {/* Corner Accent (Only for tech themes) */}
            {theme !== 'pastel' && (
                 <div className={`absolute top-0 right-0 w-0 h-0 border-t-[20px] border-r-[20px] border-t-transparent border-r-transparent transition-all duration-300 ${styles.corner}`}></div>
            )}
          </button>
        ))}
      </div>
    </div>
  );
};

export default SuggestionGrid;