import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import VoiceInput from '@/components/chat/VoiceInput';
import { describe, it, expect, vi } from 'vitest';

describe('VoiceInput', () => {
  it('calls handler on click', () => {
    const handler = vi.fn();
    const { getByRole } = render(<VoiceInput onVoiceInput={handler} />);
    fireEvent.click(getByRole('button'));
    expect(handler).toHaveBeenCalled();
  });
});
