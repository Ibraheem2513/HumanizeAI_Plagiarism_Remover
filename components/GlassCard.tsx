import React from 'react';

interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
}

export const GlassCard: React.FC<GlassCardProps> = ({ children, className = '' }) => {
  return (
    <div className={`
      relative overflow-hidden
      bg-glass-100 
      backdrop-blur-xl 
      border border-glass-border 
      rounded-3xl 
      shadow-[0_8px_32px_0_rgba(31,38,135,0.37)] 
      ${className}
    `}>
      {/* Glossy gradient overlay */}
      <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-white/10 to-transparent pointer-events-none" />
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
};
