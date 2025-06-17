import { describe, it, expect, beforeEach } from 'vitest';
import { useChatStore } from '@/store/chatStore';

const baseState = useChatStore.getState();

describe('chatStore', () => {
  beforeEach(() => {
    useChatStore.setState({
      ...baseState,
      messages: [],
      isLoading: false,
      sessionId: null,
      timeRemaining: 0,
      currentTopic: '',
    });
  });

  it('startSession initializes session', () => {
    useChatStore.getState().startSession();
    const state = useChatStore.getState();
    expect(state.sessionId).not.toBeNull();
    expect(state.timeRemaining).toBe(1800);
    expect(state.messages).toHaveLength(0);
  });

  it('addMessage stores message', () => {
    const msg = {
      id: '1',
      sessionId: 's',
      type: 'user' as const,
      content: 'hi',
      timestamp: new Date(0),
    };
    useChatStore.getState().addMessage(msg);
    expect(useChatStore.getState().messages).toEqual([msg]);
  });

  it('updateTimer sets remaining time', () => {
    useChatStore.getState().updateTimer(60);
    expect(useChatStore.getState().timeRemaining).toBe(60);
  });

  it('endSession resets session', () => {
    useChatStore.getState().startSession();
    useChatStore.getState().endSession();
    const state = useChatStore.getState();
    expect(state.sessionId).toBeNull();
    expect(state.timeRemaining).toBe(0);
  });
});
