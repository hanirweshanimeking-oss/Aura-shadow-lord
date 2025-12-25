
import React, { useState, useEffect } from 'react';
import { CompanionState } from '../types';

interface DhruvaAvatarProps {
  state: CompanionState;
  isThinking: boolean;
  isTalking: boolean;
  affectionLevel: number;
}

const DhruvaAvatar: React.FC<DhruvaAvatarProps> = ({ state, isThinking, isTalking, affectionLevel }) => {
  const [isBlinking, setIsBlinking] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const blink = () => {
      setIsBlinking(true);
      setTimeout(() => setIsBlinking(false), 150);
      setTimeout(blink, Math.random() * 4000 + 2000);
    };
    const t = setTimeout(blink, 2000);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    const handleMove = (e: MouseEvent) => {
      // Limit range for subtle movement
      const x = (e.clientX / window.innerWidth - 0.5) * 15;
      const y = (e.clientY / window.innerHeight - 0.5) * 15;
      setMousePos({ x, y });
    };
    window.addEventListener('mousemove', handleMove);
    return () => window.removeEventListener('mousemove', handleMove);
  }, []);

  const c = {
    skin: '#ffe4ce',
    skinShadow: '#eac0a3',
    hair: '#111111',
    hairLight: '#2a2a2a',
    hoodieRed: '#d02e2e',
    hoodieDark: '#8a1c1c',
    plaid: 'rgba(50, 0, 0, 0.2)',
    shirt: '#151515',
    zipper: '#2a2a2a',
    drawstring: '#1a1a1a',
    button: '#222222',
    logo: '#ffffff',
    eyeWhite: '#ffffff',
    eyeDark: '#1a1a1a'
  };

  const renderEyes = () => {
    if (isBlinking && state !== CompanionState.HAPPY) {
      return (
        <g>
          <path d="M118,138 Q130,142 142,138" stroke="#111" strokeWidth="2.5" fill="none" />
          <path d="M168,138 Q180,142 192,138" stroke="#111" strokeWidth="2.5" fill="none" />
        </g>
      );
    }

    // Default sharp anime eyes
    const eyeBase = (offsetX: number) => (
      <g transform={`translate(${offsetX}, 0)`}>
         {/* Eye Shape */}
         <path d="M115,135 Q130,125 145,135 L143,140 Q130,144 117,140 Z" fill={c.eyeWhite} />
         <path d="M115,135 Q130,122 145,135" stroke="#111" strokeWidth="3" fill="none" />
         
         {/* Iris */}
         <circle cx="130" cy="136" r="4.5" fill={c.eyeDark} />
         {/* Highlight */}
         <circle cx="128" cy="134" r="1.5" fill="white" />
      </g>
    );

    const rightEyeBase = (offsetX: number) => (
      <g transform={`translate(${offsetX}, 0)`}>
         <path d="M165,135 Q180,125 195,135 L193,140 Q180,144 167,140 Z" fill={c.eyeWhite} />
         <path d="M165,135 Q180,122 195,135" stroke="#111" strokeWidth="3" fill="none" />
         
         <circle cx="180" cy="136" r="4.5" fill={c.eyeDark} />
         <circle cx="178" cy="134" r="1.5" fill="white" />
      </g>
    );

    if (state === CompanionState.HAPPY) {
      return (
        <g>
           <path d="M115,140 Q130,125 145,140" stroke="#111" strokeWidth="3" fill="none" />
           <path d="M165,140 Q180,125 195,140" stroke="#111" strokeWidth="3" fill="none" />
        </g>
      );
    }

    const lookX = mousePos.x * 0.4;
    const lookY = mousePos.y * 0.4;

    return (
      <g transform={`translate(${lookX}, ${lookY})`}>
        {eyeBase(0)}
        {rightEyeBase(0)}
      </g>
    );
  };

  const renderMouth = () => {
    if (isTalking) {
      return <path d="M145,170 Q155,180 165,170 Q155,160 145,170" fill="#5c3a3a" className="animate-[pulse_0.15s_infinite]" />;
    }
    if (state === CompanionState.SMUG) {
      return <path d="M145,170 Q155,172 165,168" stroke="#5c3a3a" strokeWidth="2" fill="none" />;
    }
    if (state === CompanionState.HAPPY) {
      return <path d="M145,170 Q155,178 165,170" stroke="#5c3a3a" strokeWidth="2" fill="none" />;
    }
    // Neutral serious
    return <path d="M148,172 L162,172" stroke="#5c3a3a" strokeWidth="2" fill="none" />;
  };

  return (
    <div className="relative w-80 h-96 flex items-center justify-center">
      <svg viewBox="0 0 300 400" className="w-full h-full drop-shadow-2xl">
        <defs>
          {/* Plaid Pattern Definition */}
          <pattern id="plaidPattern" x="0" y="0" width="60" height="60" patternUnits="userSpaceOnUse" patternTransform="rotate(0)">
            <rect width="60" height="60" fill={c.hoodieRed} />
            <rect x="0" y="0" width="60" height="30" fill={c.plaid} />
            <rect x="0" y="0" width="30" height="60" fill={c.plaid} />
            <rect x="0" y="0" width="30" height="30" fill="rgba(0,0,0,0.1)" />
            <rect x="30" y="30" width="30" height="30" fill="rgba(0,0,0,0.1)" />
          </pattern>
          <filter id="dropshadow" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="2" dy="4" stdDeviation="3" floodOpacity="0.3" />
          </filter>
        </defs>

        {/* --- BODY GROUP --- */}
        <g className="animate-[pulse_4s_ease-in-out_infinite] origin-bottom">
          
          {/* Back Hood */}
          <path d="M80,120 Q150,90 220,120 L230,160 L70,160 Z" fill={c.hoodieDark} />

          {/* Torso/Hoodie Base with Pattern */}
          <path d="M50,400 L60,200 Q80,160 110,180 L110,400 Z" fill="url(#plaidPattern)" /> {/* Left Arm */}
          <path d="M250,400 L240,200 Q220,160 190,180 L190,400 Z" fill="url(#plaidPattern)" /> {/* Right Arm */}
          <rect x="100" y="180" width="100" height="220" fill="url(#plaidPattern)" /> {/* Center Block */}

          {/* Hoodie Shading/Creases */}
          <path d="M110,180 L110,400" stroke="rgba(0,0,0,0.2)" strokeWidth="1" />
          <path d="M190,180 L190,400" stroke="rgba(0,0,0,0.2)" strokeWidth="1" />
          
          {/* Black T-Shirt */}
          <path d="M120,170 L180,170 L180,210 Q150,225 120,210 Z" fill={c.shirt} />

          {/* Zipper Placket (Center Strip) */}
          <rect x="145" y="180" width="10" height="220" fill={c.hoodieRed} opacity="0.8" />
          <line x1="150" y1="180" x2="150" y2="400" stroke={c.hoodieDark} strokeWidth="1" />

          {/* Snap Buttons */}
          <circle cx="150" cy="220" r="3" fill={c.button} />
          <circle cx="150" cy="270" r="3" fill={c.button} />
          <circle cx="150" cy="320" r="3" fill={c.button} />
          <circle cx="150" cy="370" r="3" fill={c.button} />

          {/* Drawstrings (Black) */}
          <path d="M125,185 Q130,220 128,260" stroke={c.drawstring} strokeWidth="4" fill="none" strokeLinecap="round" />
          <circle cx="128" cy="265" r="3" fill={c.drawstring} />
          <path d="M175,185 Q170,220 172,260" stroke={c.drawstring} strokeWidth="4" fill="none" strokeLinecap="round" />
          <circle cx="172" cy="265" r="3" fill={c.drawstring} />

          {/* Logo (White bird-like shape + Text) */}
          <g transform="translate(195, 230) scale(0.7)">
             <path d="M0,0 C10,-15 25,-5 20,5 C15,15 5,10 0,0 Z" fill={c.logo} />
             <path d="M20,5 L28,-5" stroke={c.logo} strokeWidth="2" />
             <rect x="-5" y="15" width="30" height="3" fill={c.logo} />
             <rect x="-2" y="20" width="20" height="2" fill={c.logo} />
          </g>

          {/* Neck Shadow */}
          <path d="M120,150 L120,180 Q150,190 180,180 L180,150" fill={c.skinShadow} opacity="0.6" />
        </g>

        {/* --- HEAD GROUP --- */}
        <g transform={`translate(0, ${isThinking ? -3 : 0}) rotate(${mousePos.x * 0.3}, 150, 200)`} className="transition-transform duration-300">
          
          {/* Face Shape */}
          <path d="M105,100 L105,150 Q105,195 150,210 Q195,195 195,150 L195,100 Z" fill={c.skin} />
          
          {/* Ears */}
          <path d="M95,135 Q105,125 105,145 Q95,160 95,145 Z" fill={c.skin} />
          <path d="M205,135 Q195,125 195,145 Q205,160 205,145 Z" fill={c.skin} />

          {/* Blush */}
          {(state === CompanionState.SHY || affectionLevel > 70) && (
            <g opacity={Math.min(1, affectionLevel / 100)}>
              <ellipse cx="120" cy="165" rx="8" ry="4" fill="#e08888" opacity="0.4" filter="url(#dropshadow)" />
              <ellipse cx="180" cy="165" rx="8" ry="4" fill="#e08888" opacity="0.4" filter="url(#dropshadow)" />
            </g>
          )}

          {/* Eyebrows (Serious/Sharp) */}
          <g transform={`translate(0, ${state === CompanionState.UPSET ? 4 : 0})`}>
             <path d="M110,128 Q125,122 140,128" stroke={c.hair} strokeWidth="2.5" fill="none" />
             <path d="M160,128 Q175,122 190,128" stroke={c.hair} strokeWidth="2.5" fill="none" />
          </g>

          {/* Eyes & Mouth */}
          {renderEyes()}
          {renderMouth()}
          
          {/* Nose */}
          <path d="M152,150 L148,158 L153,160" fill="rgba(0,0,0,0.1)" />

          {/* Hair System (Spiky Black) */}
          {/* Back Hair */}
          <path d="M90,110 Q100,50 150,40 Q200,50 210,110 L205,140 Q200,120 195,110" fill={c.hair} />
          
          {/* Front Bangs (Complex Spikes) */}
          <g filter="url(#dropshadow)">
            <path d="
              M85,110 
              C80,80 110,40 150,35 
              C190,40 220,80 215,110
              L212,145 L205,120 
              L195,140 L185,95
              L175,135 L165,80
              L150,130 L135,80
              L125,135 L115,95
              L105,140 L95,120
              L88,145 Z" 
              fill={c.hair} 
            />
            {/* Some lighter highlights on hair */}
            <path d="M130,60 L140,90 L135,60" fill={c.hairLight} opacity="0.5" />
            <path d="M170,60 L160,90 L165,60" fill={c.hairLight} opacity="0.5" />
          </g>
          
          {/* Sideburns */}
          <path d="M105,110 L102,155 L108,130" fill={c.hair} />
          <path d="M195,110 L198,155 L192,130" fill={c.hair} />

        </g>
      </svg>
      
      {/* Interaction Halo */}
      {isThinking && (
        <div className="absolute top-12 left-1/2 -translate-x-1/2 w-48 h-12 bg-red-600/20 blur-3xl rounded-full animate-pulse pointer-events-none" />
      )}
    </div>
  );
};

export default DhruvaAvatar;
