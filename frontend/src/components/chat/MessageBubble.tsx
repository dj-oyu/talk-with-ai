"use client";
import { FC } from "react";
import type { Message } from "@/store/chatStore";

interface Props {
  message: Message;
}

const MessageBubble: FC<Props> = ({ message }) => {
  const isUser = message.type === "user";
  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"}`}>
      {!isUser && <span className="mr-2">👩‍💻</span>}
      <div
        className={`max-w-xs rounded-lg px-3 py-2 text-sm ${
          isUser ? "bg-blue-500 text-white" : "bg-gray-100"
        }`}
      >
        <p>{message.content}</p>
        <div className="mt-1 text-right text-[10px] opacity-70">
          {message.timestamp.toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          })}
        </div>
      </div>
      {isUser && <span className="ml-2">👤</span>}
    </div>
  );
};

export default MessageBubble;
