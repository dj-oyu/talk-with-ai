import React from 'react';
import { render, screen } from '@testing-library/react';
import MessageBubble from '@/components/chat/MessageBubble';
import { describe, it, expect } from 'vitest';

describe('MessageBubble', () => {
  it('renders user message with icon', () => {
    const message = {
      id: '1',
      sessionId: 's',
      type: 'user' as const,
      content: 'Hello',
      timestamp: new Date(0),
    };
    render(<MessageBubble message={message} />);
    expect(screen.getByText('Hello')).toBeInTheDocument();
    expect(screen.getByText('👤')).toBeInTheDocument();
  });

  it('renders ai message with avatar', () => {
    const message = {
      id: '2',
      sessionId: 's',
      type: 'ai' as const,
      content: 'Hi there',
      timestamp: new Date(0),
    };
    render(<MessageBubble message={message} />);
    expect(screen.getByText('Hi there')).toBeInTheDocument();
    expect(screen.getByText('👩‍💻')).toBeInTheDocument();
  });
});
