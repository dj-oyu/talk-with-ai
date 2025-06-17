"use client";
import { useEffect, useState } from "react";
import { Menu, Settings, Send } from "lucide-react";
import ChatWindow from "@/components/chat/ChatWindow";
import VoiceInput from "@/components/chat/VoiceInput";
import { useChatStore } from "@/store/chatStore";

const formatTime = (seconds: number) => {
  const m = Math.floor(seconds / 60)
    .toString()
    .padStart(2, "0");
  const s = Math.floor(seconds % 60)
    .toString()
    .padStart(2, "0");
  return `${m}:${s}`;
};

export default function ChatPage() {
  const [input, setInput] = useState("");
  const addMessage = useChatStore((state) => state.addMessage);
  const startSession = useChatStore((state) => state.startSession);
  const updateTimer = useChatStore((state) => state.updateTimer);
  const timeRemaining = useChatStore((state) => state.timeRemaining);

  useEffect(() => {
    startSession();
  }, [startSession]);

  useEffect(() => {
    const interval = setInterval(() => {
      const current = useChatStore.getState().timeRemaining;
      if (current > 0) {
        updateTimer(current - 1);
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [updateTimer]);

  const handleSend = () => {
    if (!input.trim()) return;
    addMessage({
      id: Date.now().toString(),
      sessionId: useChatStore.getState().sessionId ?? "",
      type: "user",
      content: input,
      timestamp: new Date(),
    });
    setInput("");
  };

  return (
    <div className="flex min-h-screen flex-col">
      <header className="flex items-center justify-between border-b p-4">
        <Menu />
        <h1 className="text-lg font-bold">Talk with AI</h1>
        <Settings />
      </header>
      <div className="border-b p-2 text-sm">
        🕐 残り時間: {formatTime(timeRemaining)}
      </div>
      <ChatWindow />
      <div className="flex items-center border-t p-2">
        <VoiceInput />
        <input
          className="mx-2 flex-1 rounded border px-2 py-1 text-sm"
          placeholder="入力..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
        <button
          onClick={handleSend}
          className="text-blue-500"
          aria-label="send"
        >
          <Send size={20} />
        </button>
      </div>
    </div>
  );
}
