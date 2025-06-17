'use client';
import { create } from 'zustand';

export interface Message {
  id: string;
  sessionId: string;
  type: 'user' | 'ai';
  content: string;
  timestamp: Date;
  metadata?: {
    confidence?: number;
    topic?: string;
    codeSnippet?: boolean;
  };
}

interface ChatState {
  messages: Message[];
  isLoading: boolean;
  sessionId: string | null;
  timeRemaining: number;
  currentTopic: string;

  addMessage: (message: Message) => void;
  startSession: () => void;
  endSession: () => void;
  updateTimer: (seconds: number) => void;
  setCurrentTopic: (topic: string) => void;
}

export const useChatStore = create<ChatState>((set) => ({
  messages: [],
  isLoading: false,
  sessionId: null,
  timeRemaining: 0,
  currentTopic: '',
  addMessage: (message) =>
    set((state) => ({ messages: [...state.messages, message] })),
  startSession: () =>
    set(() => ({ sessionId: `${Date.now()}`, messages: [], timeRemaining: 30 * 60 })),
  endSession: () => set(() => ({ sessionId: null, timeRemaining: 0 })),
  updateTimer: (seconds) => set(() => ({ timeRemaining: seconds })),
  setCurrentTopic: (topic) => set(() => ({ currentTopic: topic })),
}));
