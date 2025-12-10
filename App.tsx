import React, { useState, useEffect, useCallback, useRef } from 'react';
import { ClickButton } from './components/ClickButton';
import { ScoreDisplay } from './components/ScoreDisplay';
import { RankDisplay } from './components/RankDisplay';
import { generateRankTitle } from './services/geminiService';
import { RankResponse } from './types';

// Simple particle system type
interface Particle {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  color: string;
}

export default function App() {
  const [count, setCount] = useState<number>(0);
  const [rank, setRank] = useState<string>("Iniciante");
  const [isAiLoading, setIsAiLoading] = useState<boolean>(false);
  const [particles, setParticles] = useState<Particle[]>([]);
  
  // Use a ref to track if we've already fetched for a specific milestone
  // to avoid double fetching in strict mode or rapid clicking
  const lastFetchedMilestone = useRef<number>(0);

  const handleAiRankGeneration = useCallback(async (currentScore: number) => {
    // Generate a new rank every 20 clicks to keep it interesting, or on the first 10
    if (currentScore > 0 && (currentScore === 10 || currentScore % 20 === 0)) {
        if (lastFetchedMilestone.current === currentScore) return;
        lastFetchedMilestone.current = currentScore;

        setIsAiLoading(true);
        try {
            const response: RankResponse = await generateRankTitle(currentScore);
            if (response && response.title) {
                setRank(response.title);
            }
        } catch (error) {
            console.error("Failed to fetch AI rank", error);
        } finally {
            setIsAiLoading(false);
        }
    }
  }, []);

  const addParticles = (x: number, y: number) => {
    const newParticles: Particle[] = [];
    const colors = ['#818cf8', '#c084fc', '#2dd4bf', '#fb7185'];
    
    for (let i = 0; i < 8; i++) {
      newParticles.push({
        id: Date.now() + i,
        x,
        y,
        vx: (Math.random() - 0.5) * 10,
        vy: (Math.random() - 0.5) * 10,
        color: colors[Math.floor(Math.random() * colors.length)]
      });
    }

    setParticles(prev => [...prev, ...newParticles]);
  };

  // Animation loop for particles
  useEffect(() => {
    if (particles.length === 0) return;

    const interval = setInterval(() => {
      setParticles(prev => prev.map(p => ({
        ...p,
        x: p.x + p.vx,
        y: p.y + p.vy,
        vy: p.vy + 0.5, // gravity
      })).filter(p => p.y < window.innerHeight && p.x > 0 && p.x < window.innerWidth)); // Remove if off screen roughly
    }, 16);

    return () => clearInterval(interval);
  }, [particles.length]);

  const handleClick = (e: React.MouseEvent<HTMLButtonElement> | React.TouchEvent<HTMLButtonElement>) => {
    // Get coordinates for particles
    let clientX, clientY;
    if ('touches' in e) {
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
    } else {
      clientX = (e as React.MouseEvent).clientX;
      clientY = (e as React.MouseEvent).clientY;
    }

    addParticles(clientX, clientY);
    
    const newCount = count + 1;
    setCount(newCount);
    handleAiRankGeneration(newCount);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center relative bg-gradient-to-br from-slate-900 via-purple-950 to-slate-900 overflow-hidden selection:bg-indigo-500 selection:text-white">
      
      {/* Background Decor */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none opacity-20">
         <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-purple-600 rounded-full blur-[120px] animate-float"></div>
         <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-indigo-600 rounded-full blur-[120px] animate-float" style={{animationDelay: '2s'}}></div>
      </div>

      {/* Particle Rendering */}
      {particles.map(p => (
        <div 
            key={p.id}
            className="absolute rounded-full pointer-events-none"
            style={{
                left: p.x,
                top: p.y,
                width: '8px',
                height: '8px',
                backgroundColor: p.color,
                opacity: 0.8,
                transform: `scale(${Math.random() * 0.5 + 0.5})`
            }}
        />
      ))}

      <div className="z-10 w-full max-w-md px-6 flex flex-col items-center gap-12">
        
        {/* Header / Score */}
        <div className="text-center space-y-4">
            <h1 className="text-slate-400 text-sm font-semibold tracking-widest uppercase">
                Contador de Cliques
            </h1>
            <ScoreDisplay score={count} />
            <RankDisplay rank={rank} isLoading={isAiLoading} />
        </div>

        {/* Main Action */}
        <div className="flex justify-center items-center py-8">
            <ClickButton onClick={handleClick} />
        </div>

        {/* Footer info */}
        <p className="text-slate-500 text-xs text-center max-w-xs leading-relaxed opacity-60">
          A única função é clicar.<br/> 
          A inteligência artificial irá julgar seu progresso.
        </p>

      </div>
    </div>
  );
}