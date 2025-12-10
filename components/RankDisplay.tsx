import React from 'react';

interface RankDisplayProps {
  rank: string;
  isLoading: boolean;
}

export const RankDisplay: React.FC<RankDisplayProps> = ({ rank, isLoading }) => {
  return (
    <div className="h-8 flex items-center justify-center">
      {isLoading ? (
        <div className="flex space-x-1 items-center animate-pulse">
            <div className="w-2 h-2 bg-indigo-400 rounded-full"></div>
            <div className="w-2 h-2 bg-indigo-400 rounded-full"></div>
            <div className="w-2 h-2 bg-indigo-400 rounded-full"></div>
        </div>
      ) : (
        <div 
            className="text-indigo-300 text-lg sm:text-xl font-medium tracking-wide animate-in fade-in slide-in-from-bottom-2 duration-500"
            key={rank} // Re-animate on rank change
        >
          {rank}
        </div>
      )}
    </div>
  );
};
