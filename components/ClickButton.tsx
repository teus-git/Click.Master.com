import React from 'react';

interface ClickButtonProps {
  onClick: (e: React.MouseEvent<HTMLButtonElement> | React.TouchEvent<HTMLButtonElement>) => void;
}

export const ClickButton: React.FC<ClickButtonProps> = ({ onClick }) => {
  return (
    <button
      onClick={onClick}
      className={`
        relative group
        w-48 h-48 sm:w-64 sm:h-64 rounded-full
        bg-gradient-to-br from-indigo-500 to-purple-600
        text-white font-display text-2xl sm:text-3xl font-bold tracking-wider
        shadow-[0_20px_50px_-12px_rgba(79,70,229,0.5)]
        transition-all duration-100 ease-out
        transform
        hover:scale-105 hover:shadow-[0_30px_60px_-12px_rgba(79,70,229,0.6)]
        active:scale-95 active:shadow-[0_10px_30px_-10px_rgba(79,70,229,0.4)]
        focus:outline-none focus:ring-4 focus:ring-indigo-400/30
        border-4 border-white/10
        flex items-center justify-center
        overflow-hidden
      `}
      aria-label="Clique para ganhar pontos"
    >
      {/* Shine Effect */}
      <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none rounded-full" />
      
      {/* Inner Glow/Shadow for 3D feel */}
      <div className="absolute inset-0 rounded-full shadow-[inset_0_4px_20px_rgba(0,0,0,0.2)] pointer-events-none" />
      
      <span className="relative z-10 drop-shadow-md">
        CLICAR
      </span>
      
      {/* Ripple container could go here if using JS-based ripples, but we rely on active:scale for feel */}
    </button>
  );
};
