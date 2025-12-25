
import React, { useState, useEffect } from 'react';
import { CompanionState } from '../types';

interface PriyaAvatarProps {
  state: CompanionState;
  isThinking: boolean;
  isTalking: boolean;
  affectionLevel: number;
}

const PriyaAvatar: React.FC<PriyaAvatarProps> = ({ state, isThinking, isTalking, affectionLevel }) => {
  const [isBlinking, setIsBlinking] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  // --- LOOPING ANIMATIONS ---
  useEffect(() => {
    const blink = () => {
      setIsBlinking(true);
      setTimeout(() => setIsBlinking(false), 150); // Fast snap blink
      setTimeout(blink, Math.random() * 4000 + 2000);
    };
    const t = setTimeout(blink, 2000);
    return () => clearTimeout(t);
  }, []);

  // --- INTERACTIVE TRACKING ---
  useEffect(() => {
    const handleMove = (e: MouseEvent) => {
      // Subtle tracking for a "cool beauty" vibe
      const x = (e.clientX / window.innerWidth - 0.5) * 15;
      const y = (e.clientY / window.innerHeight - 0.5) * 10;
      setMousePos({ x, y });
    };
    window.addEventListener('mousemove', handleMove);
    return () => window.removeEventListener('mousemove', handleMove);
  }, []);

  // --- PALETTE (Dark Beauty / Rias-esque Vibe) ---
  const c = {
    skin: '#fff0e8', // Porcelain skin
    skinShadow: '#ebd4c5',
    hairBase: '#1a0b2e', // Deep Violet/Black
    hairDark: '#11051f',
    hairHighlight: '#4c2d75',
    eyeDark: '#2e0245',
    eyeLight: '#a855f7', // Vibrant Purple
    eyeWhite: '#fdfdfd',
    lash: '#0f0214',
    lipBase: '#fb7185',
    lipGloss: '#fff1f2',
    clothes: '#121212', // Black fabric
    accent: '#db2777' // Magenta accent
  };

  // --- RENDER HELPERS ---

  const renderEye = (side: 'left' | 'right') => {
    const isWink = state === CompanionState.TEASING && side === 'left';
    const isClosed = isBlinking || isWink;
    
    // Tracking logic with emotional overrides
    let lookX = mousePos.x * 0.4;
    let lookY = mousePos.y * 0.4;

    if (state === CompanionState.SHY) {
        lookX = side === 'left' ? 5 : 8; // Look away shyly
        lookY = 8; // Look down
    }

    return (
      <g>
        <defs>
            {/* Mask to keep iris inside eye shape */}
            <clipPath id={`eyeClip-${side}`}>
                <path d="M-30,0 Q0,-25 30,0 Q32,5 28,12 Q0,30 -30,12 Q-32,5 -30,0 Z" />
            </clipPath>
            <radialGradient id="irisGradient">
                <stop offset="30%" stopColor={c.eyeLight} />
                <stop offset="90%" stopColor={c.eyeDark} />
            </radialGradient>
        </defs>

        {isClosed ? (
           // Closed Eye / Wink (Thick Lash Line)
           <g transform={isWink ? "rotate(5)" : ""}>
               <path d="M-28,8 Q0,20 28,8" stroke={c.lash} strokeWidth="4" fill="none" strokeLinecap="round" />
               <path d="M-30,8 Q-35,15 -38,20" stroke={c.lash} strokeWidth="2" fill="none" /> {/* Outer Lash */}
               <path d="M-25,12 Q-30,18 -32,22" stroke={c.lash} strokeWidth="1.5" fill="none" />
           </g>
        ) : (
           <g>
              {/* Sclera (White) */}
              <path d="M-32,0 Q0,-25 32,0 Q35,8 28,16 Q0,32 -32,16 Q-35,8 -32,0 Z" fill={c.eyeWhite} filter="drop-shadow(0px 2px 2px rgba(0,0,0,0.1))" />
              
              {/* Iris Group (Clipped) */}
              <g clipPath={`url(#eyeClip-${side})`}>
                  <g transform={`translate(${lookX}, ${lookY})`}>
                      <circle cx="0" cy="0" r="16" fill="url(#irisGradient)" />
                      <circle cx="0" cy="0" r="6" fill="#1a052b" /> {/* Pupil */}
                      {/* Internal Glimmer */}
                      <ellipse cx="0" cy="8" rx="10" ry="6" fill={c.eyeLight} opacity="0.3" />
                  </g>
              </g>

              {/* Highlights (Glossy Anime Eyes) */}
              <circle cx={-10 + lookX*0.1} cy={-6 + lookY*0.1} r="5" fill="white" opacity="0.95" />
              <circle cx={12 + lookX*0.1} cy={8 + lookY*0.1} r="2" fill="white" opacity="0.7" />

              {/* Upper Eyelash (Thick, winged) */}
              <path d="M-35,2 Q0,-30 35,2 L40,-5 Q0,-42 -40,2 Z" fill={c.lash} />
              
              {/* Loose Lashes */}
              <path d="M35,-2 Q45,-8 48,-15" stroke={c.lash} strokeWidth="2.5" fill="none" strokeLinecap="round" />
              <path d="M36,2 Q46,-2 50,-5" stroke={c.lash} strokeWidth="2" fill="none" strokeLinecap="round" />

              {/* Lower Lid hint */}
              <path d="M-20,18 Q0,22 20,18" stroke={c.lash} strokeWidth="1" fill="none" opacity="0.3" />
           </g>
        )}
      </g>
    );
  };

  const renderMouth = () => {
    if (isTalking) {
        return <path d="M-12,0 Q0,8 12,0 Q6,18 -6,18 Z" fill={c.lipBase} opacity="0.9" />;
    }

    if (state === CompanionState.TEASING) {
        return (
            <g>
                <path d="M-14,-2 Q0,4 14,-2" stroke={c.lipBase} strokeWidth="2" fill="none" strokeLinecap="round" />
                <path d="M-6,0 Q0,12 6,0" fill="#fb7185" stroke="#be123c" strokeWidth="0.5" />
            </g>
        );
    }

    if (state === CompanionState.HAPPY) {
        return <path d="M-15,-2 Q0,12 15,-2" stroke={c.lipBase} strokeWidth="2.5" fill="none" strokeLinecap="round" />;
    }
    
    if (state === CompanionState.SHY) {
        return (
             <path d="M-8,5 Q0,5 8,5" stroke={c.lipBase} strokeWidth="2" fill="none" strokeLinecap="round" opacity="0.8" />
        );
    }

    // Default "Glossy" Lips
    return (
        <g>
            {/* Upper Lip Shadow */}
            <path d="M-12,0 Q0,5 12,0" stroke="#be123c" strokeWidth="1" fill="none" opacity="0.5" />
            {/* Lower Lip Plump */}
            <path d="M-8,2 Q0,10 8,2" fill={c.lipBase} opacity="0.6" />
            {/* Lip Gloss Highlight */}
            <ellipse cx="-3" cy="4" rx="3" ry="1.5" fill="white" opacity="0.4" />
        </g>
    );
  };

  return (
    <div className="relative w-[400px] h-[550px] flex items-center justify-center">
      <svg viewBox="0 0 400 550" className="w-full h-full drop-shadow-2xl overflow-visible">
        <defs>
            <linearGradient id="hairSheen" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={c.hairHighlight} stopOpacity="0.5" />
                <stop offset="40%" stopColor={c.hairBase} stopOpacity="0.1" />
                <stop offset="100%" stopColor={c.hairBase} stopOpacity="0" />
            </linearGradient>
            <linearGradient id="bodyGrad" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor={c.skinShadow} />
                <stop offset="20%" stopColor={c.skin} />
                <stop offset="80%" stopColor={c.skin} />
                <stop offset="100%" stopColor={c.skinShadow} />
            </linearGradient>
            <filter id="softGlow">
                <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
                <feMerge>
                    <feMergeNode in="coloredBlur"/>
                    <feMergeNode in="SourceGraphic"/>
                </feMerge>
            </filter>
        </defs>

        {/* --- BACK HAIR (Volume) --- */}
        <g transform={`translate(${mousePos.x * 0.05}, ${mousePos.y * 0.05}) rotate(${mousePos.x * 0.02}, 200, 400)`}>
            <path d="M100,100 Q40,250 20,450 L380,450 Q360,250 300,100 Z" fill={c.hairDark} />
            <path d="M200,80 Q50,200 50,550 L350,550 Q350,200 200,80" fill={c.hairBase} />
        </g>

        {/* --- BODY (Neck & Chest) --- */}
        <g transform={`translate(${mousePos.x * 0.1}, ${mousePos.y * 0.1})`}>
            {/* Neck */}
            <path d="M165,300 L165,360 L235,360 L235,300" fill={c.skinShadow} />
            <path d="M165,300 L165,350 Q200,365 235,350 L235,300" fill={c.skin} />
            
            {/* Shoulders / Cleavage Hint */}
            <path d="M165,350 Q120,360 80,480 L320,480 Q280,360 235,350" fill="url(#bodyGrad)" />
            {/* Collarbones */}
            <path d="M170,370 Q200,385 230,370" stroke={c.skinShadow} strokeWidth="2" fill="none" opacity="0.6" />
            <path d="M160,370 L140,365" stroke={c.skinShadow} strokeWidth="2" fill="none" opacity="0.4" />
            <path d="M240,370 L260,365" stroke={c.skinShadow} strokeWidth="2" fill="none" opacity="0.4" />

            {/* Clothing: Black Choker */}
            <path d="M166,335 Q200,345 234,335 L234,350 Q200,360 166,350 Z" fill={c.clothes} />
            <circle cx="200" cy="348" r="4" fill="gold" />

            {/* Clothing: Strap Top */}
            <path d="M140,400 Q200,450 260,400 L270,410 L300,550 L100,550 L130,410 Z" fill={c.clothes} />
            {/* Straps */}
            <path d="M150,405 L155,350" stroke={c.clothes} strokeWidth="5" />
            <path d="M250,405 L245,350" stroke={c.clothes} strokeWidth="5" />
            
            {/* Skin Shadow under clothes */}
            <path d="M140,400 Q200,450 260,400" stroke="rgba(0,0,0,0.3)" strokeWidth="4" fill="none" />
        </g>

        {/* --- HEAD --- */}
        <g transform={`translate(${mousePos.x * 0.2}, ${mousePos.y * 0.2}) rotate(${mousePos.x * 0.05}, 200, 300)`}>
            
            {/* Face Shape (V-Line) */}
            <path d="M120,150 Q110,250 140,310 Q200,360 260,310 Q290,250 280,150 L270,80 Q200,60 130,80 Z" fill={c.skin} />
            
            {/* Blush (Heavy for SHY state) */}
            <g opacity={(state === CompanionState.SHY || affectionLevel > 70) ? 0.7 : 0} className="transition-opacity duration-500">
                <ellipse cx="150" cy="270" rx="20" ry="12" fill={c.accent} filter="blur(8px)" opacity="0.6" />
                <ellipse cx="250" cy="270" rx="20" ry="12" fill={c.accent} filter="blur(8px)" opacity="0.6" />
            </g>

            {/* Nose (Defined anime nose) */}
            <path d="M202,255 L198,265 L204,267" fill={c.skinShadow} opacity="0.8" />

            {/* Mouth */}
            <g transform="translate(200, 295) scale(1.3)">
                {renderMouth()}
            </g>

            {/* Eyes */}
            <g transform="translate(155, 230) scale(0.95)">
                {renderEye('left')}
                {/* Eyebrow */}
                <path d="M-35,-25 Q-10,-35 30,-20" stroke={c.hairBase} strokeWidth="2.5" fill="none" opacity="0.8" 
                      transform={state === CompanionState.UPSET ? "rotate(15)" : state === CompanionState.SHY ? "rotate(-5)" : ""} />
            </g>
            <g transform="translate(245, 230) scale(0.95) scale(-1, 1)">
                {renderEye('right')}
                {/* Eyebrow */}
                <path d="M-35,-25 Q-10,-35 30,-20" stroke={c.hairBase} strokeWidth="2.5" fill="none" opacity="0.8"
                      transform={state === CompanionState.UPSET ? "rotate(15)" : state === CompanionState.SHY ? "rotate(-5)" : ""} />
            </g>

            {/* --- FRONT HAIR / BANGS --- */}
            {/* Main Bangs */}
            <path d="M200,60 
                     Q140,60 110,180 
                     L125,140 L140,220 L155,140 
                     L180,240 L200,120 L220,240 
                     L245,140 L260,220 L275,140
                     Q290,180 260,60 Z" 
                     fill={c.hairBase} filter="url(#softGlow)" />
            
            {/* Hair Shine Highlight */}
            <path d="M120,100 Q200,140 280,100 Q200,120 120,100" fill="url(#hairSheen)" opacity="0.6" />

            {/* Long Hime-cut Side Strands */}
            <path d="M110,140 Q100,250 115,380 L130,380 Q120,250 125,140" fill={c.hairBase} />
            <path d="M290,140 Q300,250 285,380 L270,380 Q280,250 275,140" fill={c.hairBase} />
        </g>
        
        {/* Floating Hearts (Subtle & Stylish) */}
        {(state === CompanionState.TEASING || affectionLevel > 80) && (
             <g className="pointer-events-none">
                <path d="M300,200 Q310,190 320,200 Q310,215 300,220 Q290,215 280,200 Q290,190 300,200" fill={c.accent} opacity="0.6">
                    <animate attributeName="transform" type="translate" values="0,0; 0,-20; 0,0" dur="3s" repeatCount="indefinite" />
                    <animate attributeName="opacity" values="0;0.6;0" dur="3s" repeatCount="indefinite" />
                </path>
             </g>
        )}

      </svg>
      {isThinking && <div className="absolute top-20 left-1/2 -translate-x-1/2 w-48 h-48 bg-pink-500/10 blur-3xl rounded-full animate-pulse pointer-events-none" />}
    </div>
  );
};

export default PriyaAvatar;
