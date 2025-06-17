'use client';
import { Mic } from 'lucide-react';

interface VoiceInputProps {
  onVoiceInput?: () => void;
}

const VoiceInput = ({ onVoiceInput }: VoiceInputProps) => {
  return (
    <button
      onClick={onVoiceInput}
      className="rounded p-2 text-blue-500 hover:text-blue-700"
      aria-label="voice input"
    >
      <Mic size={20} />
    </button>
  );
};

export default VoiceInput;
