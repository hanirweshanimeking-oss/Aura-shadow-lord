
import React, { useState, useEffect } from 'react';
// Corrected: Using CompanionState from types as PriyaState was an incorrect reference
import { CompanionState } from '../types';

interface MJAvatarProps {
  // Corrected: Updated to use CompanionState
  state: CompanionState;
  isThinking: boolean;
  isTalking: boolean;
  affectionLevel: number;
}

const MJAvatar: React.FC<MJAvatarProps> = ({ state, isThinking, isTalking, affectionLevel }) => {
  const [isBlinking, setIsBlinking] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const blink = () => {
      setIsBlinking(true);
      setTimeout(() => setIsBlinking(false), 120);
      setTimeout(blink, Math.random() * 4000 + 2000);
    };
    const t = setTimeout(blink, 2000);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    const handleMove = (e: MouseEvent) => {
      const x = (e.clientX / window.innerWidth - 0.5) * 6;
      const y = (e.clientY / window.innerHeight - 0.5) * 4;
      setMousePos({ x, y });
    };
    window.addEventListener('mousemove', handleMove);
    return () => window.removeEventListener('mousemove', handleMove);
  }, []);

  const colors = {
    hair: '#1b262c',
    hairLight: '#32424a',
    skin: '#fde7d8',
    eyes: '#2c3e50',
    shirt: '#ffffff',
    cardigan: '#a2d9ff',
    blush: '#ff9a9e',
    mouth: '#e74c3c'
  };

  const renderEyes = () => {
    // Corrected: Replaced PriyaState with CompanionState
    if (isBlinking && state !== CompanionState.HAPPY) {
      return (
        <g>
          <path d="M35,45 Q40,46 45,45" stroke={colors.eyes} strokeWidth="2.5" fill="none" strokeLinecap="round" />
          <path d="M55,45 Q60,46 65,45" stroke={colors.eyes} strokeWidth="2.5" fill="none" strokeLinecap="round" />
        </g>
      );
    }

    // Corrected: Replaced PriyaState with CompanionState
    const eyeOffset = state === CompanionState.UPSET ? { x: 0, y: 2 } : mousePos;

    switch (state) {
      // Corrected: Replaced PriyaState with CompanionState
      case CompanionState.HAPPY:
        return (
          <g className="animate-bounce">
            <path d="M33,46 Q40,38 47,46" stroke={colors.eyes} strokeWidth="4" fill="none" strokeLinecap="round" />
            <path d="M53,46 Q60,38 67,46" stroke={colors.eyes} strokeWidth="4" fill="none" strokeLinecap="round" />
          </g>
        );
      case CompanionState.SHY:
        return (
          <g transform={`translate(${eyeOffset.x * 0.4}, ${eyeOffset.y * 0.4})`}>
            <ellipse cx="40" cy="45" rx="4.5" ry="6" fill={colors.eyes} />
            <ellipse cx="60" cy="45" rx="4.5" ry="6" fill={colors.eyes} />
            <circle cx="42" cy="42" r="2" fill="white" />
            <circle cx="62" cy="42" r="2" fill="white" />
          </g>
        );
      default:
        return (
          <g transform={`translate(${eyeOffset.x}, ${eyeOffset.y})`}>
            <ellipse cx="40" cy="45" rx="4.5" ry="6" fill={colors.eyes} />
            <ellipse cx="60" cy="45" rx="3.5" ry="5" fill={colors.eyes} />
            <circle cx="41" cy="43" r="1.5" fill="white" />
            <circle cx="61" cy="43" r="1.5" fill="white" />
          </g>
        );
    }
  };

  const renderMouth = () => {
    if (isTalking) {
      return <ellipse cx="50" cy="68" rx="4" ry="5" fill={colors.mouth} className="animate-[pulse_0.1s_infinite]" />;
    }
    // Corrected: Replaced PriyaState with CompanionState
    if (state === CompanionState.HAPPY) return <path d="M42,65 Q50,78 58,65" stroke={colors.mouth} strokeWidth="3" fill="none" strokeLinecap="round" />;
    if (state === CompanionState.UPSET) return <path d="M44,72 Q50,67 56,72" stroke={colors.eyes} strokeWidth="2.5" fill="none" strokeLinecap="round" />;
    return <path d="M46,69 Q50,70 54,69" stroke={colors.eyes} strokeWidth="1.5" fill="none" opacity="0.6" />;
  };

  return (
    <div className="relative w-80 h-80 flex items-center justify-center">
      <svg 
        viewBox="0 0 100 100" 
        className="w-full h-full drop-shadow-2xl"
      >
        <defs>
          <linearGradient id="hairGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={colors.hairLight} />
            <stop offset="100%" stopColor={colors.hair} />
          </linearGradient>
          <radialGradient id="blushGrad">
            <stop offset="0%" stopColor={colors.blush} stopOpacity="0.8" />
            <stop offset="100%" stopColor={colors.blush} stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* BODY - BREATHING */}
        <g className="animate-[pulse_4s_ease-in-out_infinite]">
          <path d="M15,100 Q50,88 85,100 L95,120 L5,120 Z" fill={colors.cardigan} />
          <path d="M42,92 L50,110 L58,92" fill={colors.shirt} />
        </g>

        {/* HEAD - FLOATING & TILTING */}
        <g transform={`translate(0, ${isTalking ? -1 : 0}) rotate(${mousePos.x * 0.5}, 50, 50)`} className="transition-transform duration-300">
          {/* Back Hair */}
          <path d="M20,55 Q15,20 50,15 Q85,20 80,55 L85,90 Q50,85 15,90 Z" fill="url(#hairGrad)" />
          
          {/* Face */}
          <path d="M30,40 Q30,85 50,85 Q70,85 70,40 Q70,25 50,25 Q30,25 30,40" fill={colors.skin} />
          
          {/* Blush */}
          {/* Corrected: Replaced PriyaState with CompanionState */}
          {(state === CompanionState.HAPPY || state === CompanionState.SHY || affectionLevel > 70) && (
            <g opacity={Math.min(1, affectionLevel / 100)}>
              <circle cx="34" cy="58" r="7" fill="url(#blushGrad)" />
              <circle cx="66" cy="58" r="7" fill="url(#blushGrad)" />
            </g>
          )}

          {renderEyes()}
          {renderMouth()}
          
          {/* Front Hair */}
          <path d="M30,30 Q35,15 50,18 Q65,15 70,30 Q55,42 50,30 Q45,42 30,30" fill="url(#hairGrad)" />
          <path d="M28,35 Q20,45 18,65" stroke={colors.hair} strokeWidth="4" fill="none" strokeLinecap="round" />
          <path d="M72,35 Q80,45 82,65" stroke={colors.hair} strokeWidth="4" fill="none" strokeLinecap="round" />
        </g>
      </svg>

      {isThinking && (
        <div className="absolute top-10 left-1/2 -translate-x-1/2 w-48 h-10 bg-cyan-400/10 blur-3xl rounded-full animate-pulse" />
      )}
    </div>
  );
};

export default MJAvatar;
