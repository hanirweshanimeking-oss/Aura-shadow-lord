
import React, { useState, useEffect, useRef } from 'react';
import { GoogleGenAI, Modality } from "@google/genai";
import DhruvaAvatar from './components/DhruvaAvatar';
import PriyaAvatar from './components/PriyaAvatar';
import JarvisAvatar from './components/JarvisAvatar';
import AuraAvatar from './components/AuraAvatar';
import { CompanionState, ChatMessage, ChannelStats, CharacterType } from './types';
import { INITIAL_STATS } from './constants';
import { getCompanionResponse } from './services/geminiService';

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

// --- UTILS ---
function decodeBase64(base64: string) {
  const binaryString = atob(base64);
  const bytes = new Uint8Array(binaryString.length);
  for (let i = 0; i < binaryString.length; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes;
}

async function decodeAudioData(
  data: Uint8Array,
  ctx: AudioContext,
  sampleRate: number,
  numChannels: number,
): Promise<AudioBuffer> {
  const dataInt16 = new Int16Array(data.buffer);
  const frameCount = dataInt16.length / numChannels;
  const buffer = ctx.createBuffer(numChannels, frameCount, sampleRate);

  for (let channel = 0; channel < numChannels; channel++) {
    const channelData = buffer.getChannelData(channel);
    for (let i = 0; i < frameCount; i++) {
      channelData[i] = dataInt16[i * numChannels + channel] / 32768.0;
    }
  }
  return buffer;
}

// --- JARVIS HUD COMPONENT ---
const JarvisHUD = () => {
  const [activeModule, setActiveModule] = useState('SYSTEM CHECK');
  const [logs, setLogs] = useState<string[]>([]);

  const modules = [
    'CORE INTELLIGENCE', 'VOICE AUTH', 'VISUAL UI', 'SYSTEM CONTROL', 
    'PERSONAL ASSISTANT', 'GAMING ANALYSIS', 'DATA ANALYTICS', 
    'TRADING & FINANCE', 'WEB INTELLIGENCE', 'SECURITY PROTOCOL'
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      const randModule = modules[Math.floor(Math.random() * modules.length)];
      setActiveModule(randModule);
      
      const newLog = `> MODULE ${Math.floor(Math.random() * 120)}: ${randModule} - OK`;
      setLogs(prev => [newLog, ...prev.slice(0, 5)]);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden flex flex-col justify-between p-8 z-0">
       {/* Left Column Logs */}
       <div className="absolute top-1/4 left-10 w-64 text-[10px] font-mono text-cyan-500/60 leading-tight">
          <div className="border-b border-cyan-500/30 mb-2 pb-1 text-xs font-bold tracking-widest">SYSTEM LOGS</div>
          {logs.map((log, i) => (
            <div key={i} className={`mb-1 ${i === 0 ? 'text-cyan-300 opacity-100' : 'opacity-50'}`}>{log}</div>
          ))}
       </div>

       {/* Right Column Status */}
       <div className="absolute top-1/4 right-10 w-48 text-right">
          <div className="text-[10px] font-mono text-cyan-500/60 tracking-[0.2em] mb-1">ACTIVE MODULE</div>
          <div className="text-xl font-bold font-mono text-cyan-400 animate-pulse">{activeModule}</div>
          <div className="mt-4 flex flex-col items-end gap-1">
             {[1,2,3].map(i => (
               <div key={i} className="h-1 bg-cyan-800/50 rounded-full" style={{ width: `${Math.random() * 100 + 50}px`}}>
                 <div className="h-full bg-cyan-400/50 animate-[ping_3s_ease-in-out_infinite]" style={{ width: '30%' }} />
               </div>
             ))}
          </div>
       </div>

       {/* Bottom Data Scroll */}
       <div className="absolute bottom-24 left-0 right-0 h-8 bg-cyan-900/10 border-t border-b border-cyan-500/20 flex items-center overflow-hidden">
          <div className="whitespace-nowrap animate-[marquee_20s_linear_infinite] text-[10px] font-mono text-cyan-400/70 tracking-widest px-4">
             PROTOCOL 71: TRADING ACTIVE /// PROTOCOL 91: BIOMETRIC LOCK ENGAGED /// PROTOCOL 51: GAMING HUD READY /// PROTOCOL 11: VOICE LISTENING /// MEMORY INTEGRITY: 100% /// 
             PROTOCOL 71: TRADING ACTIVE /// PROTOCOL 91: BIOMETRIC LOCK ENGAGED /// PROTOCOL 51: GAMING HUD READY /// PROTOCOL 11: VOICE LISTENING /// MEMORY INTEGRITY: 100% ///
          </div>
       </div>
       <style>{`
         @keyframes marquee {
           0% { transform: translateX(0); }
           100% { transform: translateX(-50%); }
         }
       `}</style>
    </div>
  );
};

// --- THEME CONFIG ---
const THEMES = {
  dhruva: {
    bg: 'bg-[#0a0505]',
    text: 'text-red-50',
    accent: 'text-red-500',
    border: 'border-red-900/30',
    barBg: 'bg-red-950/30',
    barFill: 'bg-red-500',
    userMsg: 'from-red-900/80 to-red-800/50',
    button: 'text-red-500',
    buttonActive: 'bg-red-600',
    grid: 'rgba(220, 38, 38, 0.1)',
    selection: 'selection:bg-red-500',
    name: 'DHRUVA'
  },
  priya: {
    bg: 'bg-[#0f1014]',
    text: 'text-slate-50',
    accent: 'text-pink-400',
    border: 'border-pink-500/20',
    barBg: 'bg-pink-900/20',
    barFill: 'bg-pink-400',
    userMsg: 'from-pink-600/80 to-purple-600/50',
    button: 'text-pink-400',
    buttonActive: 'bg-pink-500',
    grid: 'rgba(236, 72, 153, 0.1)',
    selection: 'selection:bg-pink-500',
    name: 'PRIYA'
  },
  jarvis: {
    bg: 'bg-[#050b14]',
    text: 'text-cyan-50',
    accent: 'text-cyan-400',
    border: 'border-cyan-500/30',
    barBg: 'bg-cyan-900/30',
    barFill: 'bg-cyan-400',
    userMsg: 'from-cyan-900/80 to-blue-800/50',
    button: 'text-cyan-400',
    buttonActive: 'bg-cyan-500',
    grid: 'rgba(6, 182, 212, 0.1)',
    selection: 'selection:bg-cyan-500',
    name: 'JARVIS'
  },
  aura: {
    bg: 'bg-[#080c14]',
    text: 'text-indigo-50',
    accent: 'text-indigo-400',
    border: 'border-indigo-500/30',
    barBg: 'bg-indigo-900/30',
    barFill: 'bg-indigo-400',
    userMsg: 'from-violet-600/80 to-indigo-600/50',
    button: 'text-indigo-400',
    buttonActive: 'bg-indigo-500',
    grid: 'rgba(129, 140, 248, 0.1)',
    selection: 'selection:bg-indigo-500',
    name: 'AURA'
  }
};

export const App: React.FC = () => {
  const [character, setCharacter] = useState<CharacterType>('priya');
  const [stats, setStats] = useState<ChannelStats>(INITIAL_STATS);
  const [state, setState] = useState<CompanionState>(CompanionState.IDLE);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  
  const [affectionLevel, setAffectionLevel] = useState(50);
  const [actionLog, setActionLog] = useState<string | null>(null);

  const [isThinking, setIsThinking] = useState(false);
  const [isTalking, setIsTalking] = useState(false);
  const [isListening, setIsListening] = useState(false);
  
  const [inputText, setInputText] = useState('');
  
  const scrollRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);
  const audioContextRef = useRef<AudioContext | null>(null);

  const theme = THEMES[character];

  // Auto-scroll
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  // Audio setup
  useEffect(() => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = false;
      recognitionRef.current.lang = 'en-US';

      recognitionRef.current.onstart = () => setState(CompanionState.LISTENING);
      
      recognitionRef.current.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        handleSendMessage(transcript);
        setIsListening(false);
      };

      recognitionRef.current.onerror = () => {
        setIsListening(false);
        setState(CompanionState.IDLE);
      };
      recognitionRef.current.onend = () => {
        setIsListening(false);
      };
    }
    audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
  }, []);

  const executeAction = (text: string) => {
    const match = text.match(/\[ACTION:\s*([A-Z_]+)\]/);
    if (match) {
      const action = match[1];
      setActionLog(`SYSTEM OVERRIDE: ${action}`);
      setState(CompanionState.EXECUTING);
      
      setTimeout(() => {
        setActionLog(null);
        setState(CompanionState.IDLE);
      }, 3000);
      
      if (action.includes('YOUTUBE')) window.open('https://youtube.com', '_blank');
      if (action.includes('SEARCH')) window.open('https://google.com', '_blank');
    }
  };

  const speakHuman = async (text: string) => {
    // 1. Sanitize text to remove system tags
    const cleanText = text.replace(/\[.*?\]/g, '').trim(); 
    
    // 2. Prevent empty API calls (causes 500 Error)
    if (!cleanText) {
      return;
    }

    try {
      setState(CompanionState.SPEAKING);
      
      // Select voice based on character
      let voiceName = 'Fenrir'; // Dhruva default
      if (character === 'priya') voiceName = 'Kore'; // Female voice
      if (character === 'jarvis') voiceName = 'Puck'; // British-ish/Formal
      if (character === 'aura') voiceName = 'Kore'; // Soft female for Aura

      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash-preview-tts",
        contents: [{ parts: [{ text: cleanText }] }],
        config: {
          responseModalities: [Modality.AUDIO],
          speechConfig: {
            voiceConfig: {
              prebuiltVoiceConfig: { voiceName },
            },
          },
        },
      });

      const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
      if (base64Audio && audioContextRef.current) {
        setIsTalking(true);
        const audioBuffer = await decodeAudioData(
          decodeBase64(base64Audio),
          audioContextRef.current,
          24000,
          1
        );
        const source = audioContextRef.current.createBufferSource();
        source.buffer = audioBuffer;
        source.connect(audioContextRef.current.destination);
        source.onended = () => {
          setIsTalking(false);
          setState(CompanionState.IDLE);
        };
        source.start();
      }
    } catch (e) {
      console.error("TTS Error:", e);
      setIsTalking(false);
      setState(CompanionState.IDLE);
    }
  };

  const handleSendMessage = async (text: string) => {
    if (!text.trim()) return;

    const userMsg: ChatMessage = { role: 'user', content: text, timestamp: Date.now() };
    setMessages(prev => [...prev, userMsg]);
    setInputText('');
    
    setIsThinking(true);
    setState(CompanionState.PROCESSING);
    
    // Affection Logic
    const lower = text.toLowerCase();
    if (lower.match(/love|cute|thanks|cool|good|handsome|pretty|beautiful|smart|funny|sweet|best/)) {
      setAffectionLevel(prev => Math.min(100, prev + 5));
    }
    if (lower.match(/hate|ugly|bad|stupid|idiot|annoying|boring|slow|dumb|weird/)) {
      setAffectionLevel(prev => Math.max(0, prev - 10));
    }

    const response = await getCompanionResponse(text, { ...stats, affectionLevel }, messages, character);
    
    setIsThinking(false);
    
    let nextState = CompanionState.IDLE;
    if (response.includes('[HAPPY]')) nextState = CompanionState.HAPPY;
    else if (response.includes('[UPSET]')) nextState = CompanionState.UPSET;
    else if (response.includes('[SHY]')) nextState = CompanionState.SHY;
    else if (response.includes('[SMUG]')) nextState = CompanionState.SMUG;
    else if (response.includes('[TEASING]')) nextState = CompanionState.TEASING;
    
    setState(nextState);
    executeAction(response);

    const cleanResponse = response.replace(/\[.*?\]/g, ''); 
    const aiMsg: ChatMessage = { role: 'assistant', content: cleanResponse, timestamp: Date.now() };
    setMessages(prev => [...prev, aiMsg]);
    
    // Call speakHuman with the original full response (which includes text)
    // The function handles cleaning internally.
    await speakHuman(response); 
  };

  const toggleListening = () => {
    if (isListening) {
      recognitionRef.current?.stop();
    } else {
      setIsListening(true);
      recognitionRef.current?.start();
    }
  };

  return (
    <div className={`h-screen w-full ${theme.bg} flex flex-col overflow-hidden ${theme.text} font-sans relative ${theme.selection} transition-colors duration-700`}>
      
      {/* Background Stylized Grid */}
      <div className="fixed inset-0 z-0 opacity-10 pointer-events-none" 
           style={{ 
             backgroundImage: `linear-gradient(${theme.grid} 1px, transparent 1px), linear-gradient(90deg, ${theme.grid} 1px, transparent 1px)`,
             backgroundSize: '30px 30px'
           }} 
      />
      <div className={`fixed inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] ${character === 'priya' ? 'from-pink-900/20' : character === 'dhruva' ? 'from-red-900/20' : character === 'aura' ? 'from-indigo-900/20' : 'from-cyan-900/20'} via-[#0a0505] to-[#0a0505] z-0 pointer-events-none transition-colors duration-700`} />

      {/* Top Bar */}
      <div className={`relative z-30 p-6 flex justify-between items-start border-b ${theme.border} bg-black/40 backdrop-blur-sm transition-colors duration-700`}>
        <div className="flex flex-col">
           <h1 className={`text-xl font-black italic tracking-tighter ${theme.accent} uppercase`}>
             {theme.name} <span className="text-xs opacity-60 font-mono not-italic align-top ml-1">v3.0</span>
           </h1>
           <div className="flex gap-2 mt-1">
             {(['dhruva', 'priya', 'jarvis', 'aura'] as CharacterType[]).map(char => (
               <button 
                 key={char}
                 onClick={() => setCharacter(char)}
                 className={`text-[9px] uppercase tracking-widest px-2 py-0.5 rounded border border-white/10 ${character === char ? 'bg-white/10 text-white' : 'text-slate-500 hover:text-slate-300'}`}
               >
                 {char}
               </button>
             ))}
           </div>
        </div>
        <div className="flex gap-4 text-right items-center">
          <div className={`${theme.barBg} border ${theme.border} rounded-lg px-3 py-1 transition-colors duration-700`}>
             <p className={`text-[9px] ${theme.accent} uppercase font-bold tracking-widest mb-1`}>Affection</p>
             <div className="w-24 h-1.5 bg-black rounded-full overflow-hidden">
                <div 
                  className={`h-full ${theme.barFill} transition-all duration-500`} 
                  style={{ width: `${affectionLevel}%` }} 
                />
             </div>
          </div>
        </div>
      </div>

      {/* Main Visual Interface */}
      <main className="flex-1 flex flex-col items-center justify-center relative z-10">
        
        {/* Action Log Toast */}
        {actionLog && (
          <div className={`absolute top-10 ${theme.barBg} border ${theme.border} px-6 py-2 rounded ${theme.accent} animate-pulse tracking-widest font-mono text-xs`}>
            {actionLog}
          </div>
        )}

        {/* Jarvis HUD Overlay */}
        {character === 'jarvis' && <JarvisHUD />}

        {/* Character Avatar */}
        <div className="scale-110 transform transition-transform duration-500 relative z-10">
           {character === 'dhruva' && <DhruvaAvatar state={state} isThinking={isThinking} isTalking={isTalking} affectionLevel={affectionLevel} />}
           {character === 'priya' && <PriyaAvatar state={state} isThinking={isThinking} isTalking={isTalking} affectionLevel={affectionLevel} />}
           {character === 'jarvis' && <JarvisAvatar state={state} />}
           {character === 'aura' && <AuraAvatar state={state} isThinking={isThinking} isTalking={isTalking} />}
        </div>

        {/* Status Text */}
        <div className="mt-4 text-center h-6 relative z-10">
           <p className={`${theme.accent} opacity-60 tracking-widest text-xs font-mono`}>
             {state === CompanionState.LISTENING ? '/// LISTENING ///' : 
              state === CompanionState.PROCESSING ? '/// THINKING ///' : 
              state === CompanionState.SPEAKING ? '/// SPEAKING ///' : ''}
           </p>
        </div>
      </main>

      {/* Chat Area */}
      <footer className={`h-[35%] bg-black/60 backdrop-blur-xl border-t ${theme.border} flex flex-col z-20 relative transition-colors duration-700`}>
        <div className="flex-1 overflow-y-auto p-6 space-y-3 custom-scrollbar" ref={scrollRef}>
          {messages.map((msg, i) => (
            <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[85%] px-5 py-3 rounded-2xl text-sm ${
                msg.role === 'user' 
                ? `bg-gradient-to-br ${theme.userMsg} text-white rounded-tr-none` 
                : 'bg-white/5 border border-white/5 text-slate-300 rounded-tl-none'
              }`}>
                {msg.content}
              </div>
            </div>
          ))}
          {isThinking && <div className={`${theme.accent} opacity-50 text-xs animate-pulse pl-4`}>Typing...</div>}
        </div>

        {/* Input Area */}
        <div className="p-4 flex gap-3 max-w-4xl mx-auto w-full">
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSendMessage(inputText)}
            placeholder={`Talk to ${theme.name}...`}
            className={`flex-1 bg-white/5 border border-white/10 rounded-full px-6 py-3 outline-none ${theme.text} placeholder:opacity-30 focus:border-white/20 transition-colors`}
          />
          <button 
            onClick={toggleListening} 
            className={`w-12 h-12 rounded-full flex items-center justify-center transition-all ${isListening ? `${theme.buttonActive} text-white animate-pulse` : `bg-white/5 hover:bg-white/10 ${theme.button}`}`}
          >
             <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"/></svg>
          </button>
        </div>
      </footer>
      
      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: ${character === 'dhruva' ? '#991b1b' : character === 'priya' ? '#ec4899' : character === 'aura' ? '#818cf8' : '#06b6d4'}; border-radius: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
      `}</style>
    </div>
  );
};
