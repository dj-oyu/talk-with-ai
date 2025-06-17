"use client";
import MessageBubble from "./MessageBubble";
import { useChatStore } from "@/store/chatStore";

import { useEffect, useRef } from "react";

const ChatWindow = () => {
  const messages = useChatStore((state) => state.messages);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = containerRef.current;
    if (el) {
      el.scrollTop = el.scrollHeight;
    }
  }, [messages]);

  return (
    <div ref={containerRef} className="flex-1 space-y-4 overflow-y-auto p-4">
      {messages.map((msg) => (
        <MessageBubble key={msg.id} message={msg} />
      ))}
    </div>
  );
};

export default ChatWindow;
