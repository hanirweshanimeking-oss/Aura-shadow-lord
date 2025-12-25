
export type CharacterType = 'jarvis' | 'dhruva' | 'priya' | 'aura';

export enum CompanionState {
  IDLE = 'IDLE',
  LISTENING = 'LISTENING',
  PROCESSING = 'PROCESSING',
  SPEAKING = 'SPEAKING',
  EXECUTING = 'EXECUTING',
  WARNING = 'WARNING',
  HAPPY = 'HAPPY',
  UPSET = 'UPSET',
  SHY = 'SHY',
  SMUG = 'SMUG',
  TEASING = 'TEASING'
}

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  timestamp: number;
}

export interface ChannelStats {
  systemIntegrity: number;
  processingLoad: number;
  lastUpdated: number;
  affectionLevel?: number;
}

export interface CompanionProps {
  state: CompanionState;
  isThinking: boolean;
  isTalking: boolean;
  affectionLevel: number;
}
