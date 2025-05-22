import { useEffect, useRef, useState } from "react";
import ChatList from "./ChatList";
import ChatInput from "./ChatInput";

export interface ChatMessage {
  id: number;
  role: 'user' | 'ai';
  text: string;
}

interface Props {
  onNewAIMessage?: (text: string) => void;
}

function ChatContainer({ onNewAIMessage }: Props) {
  const [messages, setMessages] = useState<ChatMessage[]>([
    { id: 1, role: 'user', text: 'What is AI?' },
    { id: 2, role: 'ai', text: 'AI stands for Artificial Intelligence...' },
  ]);

  const handleSend = (text: string) => {
    const userMsg: ChatMessage = {
      id: Date.now(),
      role: 'user',
      text,
    };

    const aiMsg: ChatMessage = {
      id: Date.now() + 1,
      role: 'ai',
      text: `You said: "${text}" (This is a mock AI reply)`,
    };

    setMessages((prev) => [...prev, userMsg]);

    setTimeout(() => {
      setMessages((prev) => [...prev, aiMsg]);
      onNewAIMessage?.(aiMsg.text);
    }, 1000);
  };

  const aiMessageRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    aiMessageRef.current?.scrollIntoView({
      behavior: 'smooth',
      block: 'start',
    });
  }, [messages]);

  return (
    <div className="flex flex-col h-[600px] w-full max-w-2xl bg-white border shadow-lg rounded-lg overflow-hidden">
      <div className="flex-1 overflow-y-auto p-4">
        <ChatList messages={messages} aiMessageRef={aiMessageRef} />
      </div>
      <div className="p-3 border-t">
        <ChatInput onSend={handleSend} />
      </div>
    </div>
  );
}

export default ChatContainer;
