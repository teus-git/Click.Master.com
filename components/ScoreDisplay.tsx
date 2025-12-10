import React, { useEffect, useState } from 'react';

interface ScoreDisplayProps {
  score: number;
}

export const ScoreDisplay: React.FC<ScoreDisplayProps> = ({ score }) => {
  const [scale, setScale] = useState(1);

  useEffect(() => {
    // Trigger a small 'pop' animation on score change
    setScale(1.2);
    const timeout = setTimeout(() => setScale(1), 100);
    return () => clearTimeout(timeout);
  }, [score]);

  return (
    <div className="flex flex-col items-center">
      <div 
        className="font-display text-7xl sm:text-8xl font-bold text-white transition-transform duration-100 ease-out drop-shadow-2xl"
        style={{ transform: `scale(${scale})` }}
      >
        {score}
      </div>
    </div>
  );
};
