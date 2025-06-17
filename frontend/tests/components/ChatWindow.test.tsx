import React from 'react';
import { render, screen } from '@testing-library/react';
import ChatWindow from '@/components/chat/ChatWindow';
import { useChatStore } from '@/store/chatStore';
import { describe, it, expect, beforeEach } from 'vitest';

const initialState = useChatStore.getState();

describe('ChatWindow', () => {
  beforeEach(() => {
    useChatStore.setState({ ...initialState, messages: [] });
  });

  it('renders messages from the store', () => {
    useChatStore.getState().addMessage({
      id: '1',
      sessionId: 's',
      type: 'user',
      content: 'hello world',
      timestamp: new Date(0),
    });
    render(<ChatWindow />);
    expect(screen.getByText('hello world')).toBeInTheDocument();
  });
});
