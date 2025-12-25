
import React, { useEffect, useState, useMemo } from 'react';
import { CompanionState } from '../types';

interface JarvisAvatarProps {
  state: CompanionState;
}

const JarvisAvatar: React.FC<JarvisAvatarProps> = ({ state }) => {
  const [ticks, setTicks] = useState(0);

  // Animation Loop
  useEffect(() => {
    const interval = setInterval(() => {
      setTicks(t => t + 1);
    }, 50);
    return () => clearInterval(interval);
  }, []);

  // Dynamic Styles based on State
  const statusColor = useMemo(() => {
    switch(state) {
      case CompanionState.WARNING: return '#ef4444'; // Red
      case CompanionState.PROCESSING: return '#f59e0b'; // Amber
      case CompanionState.SPEAKING: return '#06b6d4'; // Cyan (Pulse)
      case CompanionState.LISTENING: return '#8b5cf6'; // Violet
      default: return '#06b6d4'; // Cyan
    }
  }, [state]);

  const rotationSpeed = state === CompanionState.PROCESSING ? 5 : 0.5;

  return (
    <div className="relative w-96 h-96 flex items-center justify-center">
      {/* Background Holographic Fog */}
      <div className="absolute inset-0 bg-blue-500/5 blur-[60px] rounded-full animate-pulse" />

      <svg viewBox="0 0 400 400" className="w-full h-full drop-shadow-[0_0_20px_rgba(6,182,212,0.3)]">
        <defs>
          <filter id="hologlow">
            <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
            <feMerge>
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
          <linearGradient id="scanGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={statusColor} stopOpacity="0" />
              <stop offset="50%" stopColor={statusColor} stopOpacity="0.5" />
              <stop offset="100%" stopColor={statusColor} stopOpacity="0" />
          </linearGradient>
        </defs>

        {/* --- LAYER 1: OUTER DATA RINGS (Static structural) --- */}
        <circle cx="200" cy="200" r="190" stroke={statusColor} strokeWidth="0.5" fill="none" opacity="0.2" />
        <path d="M200,10 L200,40 M390,200 L360,200 M200,390 L200,360 M10,200 L40,200" stroke={statusColor} strokeWidth="2" opacity="0.5" />

        {/* --- LAYER 2: ROTATING SEGMENTED RINGS --- */}
        <g transform={`rotate(${ticks * rotationSpeed}, 200, 200)`}>
             {/* Large Ring Segments */}
            <circle cx="200" cy="200" r="170" stroke={statusColor} strokeWidth="1" strokeDasharray="100 200" fill="none" opacity="0.4" />
            <circle cx="200" cy="200" r="160" stroke={statusColor} strokeWidth="6" strokeDasharray="4 20" fill="none" opacity="0.3" />
        </g>
        
        <g transform={`rotate(${-ticks * rotationSpeed * 1.5}, 200, 200)`}>
            {/* Medium Ring Segments */}
            <circle cx="200" cy="200" r="130" stroke={statusColor} strokeWidth="2" strokeDasharray="80 80" fill="none" filter="url(#hologlow)" />
            <circle cx="200" cy="200" r="125" stroke={statusColor} strokeWidth="1" strokeDasharray="2 10" fill="none" opacity="0.6" />
        </g>

        {/* --- LAYER 3: INNER CORE MECHANISM --- */}
        <g transform={`rotate(${state === CompanionState.PROCESSING ? ticks * 10 : 0}, 200, 200)`}>
           <path d="M200,80 L200,120" stroke={statusColor} strokeWidth="2" />
           <path d="M200,280 L200,320" stroke={statusColor} strokeWidth="2" />
           <path d="M80,200 L120,200" stroke={statusColor} strokeWidth="2" />
           <path d="M280,200 L320,200" stroke={statusColor} strokeWidth="2" />
           
           <circle cx="200" cy="200" r="100" stroke={statusColor} strokeWidth="1" strokeDasharray="50 150" fill="none" opacity="0.8" />
        </g>

        {/* --- LAYER 4: THE ARC REACTOR CORE --- */}
        <g filter="url(#hologlow)">
            {/* Pulsing Center */}
            <circle cx="200" cy="200" r={state === CompanionState.SPEAKING ? 50 : 40} fill={statusColor} fillOpacity="0.1" stroke={statusColor} strokeWidth="2">
                <animate attributeName="r" values="40;45;40" dur={state === CompanionState.SPEAKING ? "0.5s" : "3s"} repeatCount="indefinite" />
                <animate attributeName="stroke-opacity" values="1;0.5;1" dur="2s" repeatCount="indefinite" />
            </circle>

            {/* Inner Triangle / Reactor Shape */}
            <path d="M200,170 L226,215 L174,215 Z" fill="none" stroke={statusColor} strokeWidth="2" opacity="0.8" transform={`rotate(${ticks}, 200, 200)`} />
            
            {/* Core Light */}
            <circle cx="200" cy="200" r="10" fill="#fff" opacity="0.9">
                 <animate attributeName="opacity" values="0.8;1;0.8" dur="1s" repeatCount="indefinite" />
            </circle>
        </g>
        
        {/* --- LAYER 5: DATA READOUTS --- */}
        <g transform="translate(200, 200)">
             {/* Scanning Line */}
             {state === CompanionState.LISTENING && (
                <rect x="-150" y="-2" width="300" height="4" fill="url(#scanGrad)" opacity="0.8">
                    <animateTransform attributeName="transform" type="translate" from="0 -150" to="0 150" dur="1.5s" repeatCount="indefinite" />
                </rect>
             )}
             
             {/* Random Data Particles */}
             <circle cx="120" cy="-50" r="2" fill={statusColor} opacity="0.6">
                <animate attributeName="cy" values="-50;-40;-50" dur="2s" repeatCount="indefinite" />
             </circle>
             <circle cx="-100" cy="80" r="2" fill={statusColor} opacity="0.6">
                <animate attributeName="cy" values="80;90;80" dur="3s" repeatCount="indefinite" />
             </circle>
        </g>

      </svg>
      
      {/* HUD Text Overlay */}
      <div className="absolute bottom-10 flex flex-col items-center">
         <div className="font-mono text-[10px] tracking-[0.5em] text-cyan-200 opacity-80 uppercase">
             J.A.R.V.I.S 2030
         </div>
         <div className="flex gap-4 mt-2 font-mono text-[8px] text-cyan-400 opacity-60">
             <span>CPU: {Math.floor(Math.random() * 20) + 10}%</span>
             <span>MEM: {Math.floor(Math.random() * 30) + 20}TB</span>
             <span>NET: SECURE</span>
         </div>
      </div>
    </div>
  );
};

export default JarvisAvatar;
