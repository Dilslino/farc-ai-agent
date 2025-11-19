import React from 'react';
import ReactMarkdown from 'react-markdown';
import { VisualTheme } from '../types';

interface MarkdownRendererProps {
  content: string;
  theme?: VisualTheme;
}

const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({ content, theme = 'nexus' }) => {
  
  // Determine classes based on theme
  const isLightMode = theme === 'pastel';

  // Base prose class
  const baseProse = isLightMode 
    ? 'prose prose-zinc' 
    : 'prose prose-invert';

  const markerColor = isLightMode
    ? 'prose-li:marker:text-zinc-400'
    : 'prose-li:marker:text-zinc-600';

  return (
    <div className={`${baseProse} max-w-none prose-p:leading-7 prose-p:mb-4 prose-headings:font-display prose-headings:font-medium prose-strong:font-semibold ${markerColor}`}>
      <ReactMarkdown
        components={{
          // Explicitly handle strong/bold text to ensure it's visible
          strong({children}) {
            return <strong className={`font-bold ${isLightMode ? 'text-zinc-900' : 'text-white'}`}>{children}</strong>
          },
          code({ node, className, children, ...props }) {
            const match = /language-(\w+)/.exec(className || '');
            const isInline = !match && !String(children).includes('\n');
            
            // Inline Code Style
            if (isInline) {
                return (
                  <code className={`${isLightMode ? 'bg-zinc-100 text-violet-600 border-zinc-200' : 'bg-zinc-800/50 text-indigo-300 border-white/5'} rounded px-1.5 py-0.5 font-mono text-[0.85em] border`} {...props}>
                    {children}
                  </code>
                );
            }

            // Block Code Style
            return (
              <div className={`my-4 rounded-lg overflow-hidden border p-4 ${isLightMode ? 'bg-zinc-50 border-zinc-200' : 'bg-zinc-900/50 border-white/5'}`}>
                <code className={`${className} text-sm block font-mono ${isLightMode ? 'text-zinc-700' : 'text-zinc-300'}`} {...props}>
                  {children}
                </code>
              </div>
            );
          },
          ul({children}) {
            return <ul className={`list-disc pl-5 space-y-1 my-3 ${isLightMode ? 'marker:text-zinc-400' : 'marker:text-zinc-600'}`}>{children}</ul>
          },
          ol({children}) {
            return <ol className={`list-decimal pl-5 space-y-1 my-3 ${isLightMode ? 'marker:text-zinc-400' : 'marker:text-zinc-600'}`}>{children}</ol>
          },
          blockquote({children}) {
            return <blockquote className={`border-l-2 pl-4 py-1 my-4 italic rounded-r-lg ${isLightMode ? 'border-violet-300 text-zinc-600 bg-violet-50' : 'border-indigo-500/50 text-zinc-400 bg-zinc-900/30'}`}>{children}</blockquote>
          },
          a({children, href}) {
            return <a href={href} className={`${isLightMode ? 'text-violet-600 hover:text-violet-700' : 'text-indigo-400 hover:text-indigo-300'} underline underline-offset-4 decoration-dotted`} target="_blank" rel="noopener noreferrer">{children}</a>
          }
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
};

export default MarkdownRenderer;