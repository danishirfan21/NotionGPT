import { useEffect, useRef, useState } from "react";
import ChatList from "./ChatList";
import ChatInput from "./ChatInput";
import { chatWithAI } from "@/lib/chatWithAI";

export interface ChatMessage {
  id: number;
  role: 'user' | 'ai';
  text: string;
}

interface Props {
  onNewAIMessage?: (text: string) => void;
}

function ChatContainer({ onNewAIMessage }: Props) {
  const [messages, setMessages] = useState<ChatMessage[]>(() => {
    const stored = localStorage.getItem('notiongpt-chat');
    return stored
      ? JSON.parse(stored)
      : [
          { id: 1, role: 'user', text: 'What is AI?' },
          {
            id: 2,
            role: 'ai',
            text: 'AI stands for Artificial Intelligence...',
          },
        ];
  });

  const handleSend = async (text: string) => {
    const userMsg: ChatMessage = {
      id: Date.now(),
      role: 'user',
      text,
    };

    setMessages((prev) => [...prev, userMsg]);

    try {
      const aiReply = await chatWithAI(text);

      const aiMsg: ChatMessage = {
        id: Date.now() + 1,
        role: 'ai',
        text: aiReply,
      };

      setMessages((prev) => [...prev, aiMsg]);
      onNewAIMessage?.(aiMsg.text);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (err) {
      const errMsg: ChatMessage = {
        id: Date.now() + 1,
        role: 'ai',
        text: '⚠️ Failed to fetch AI response.',
      };
      setMessages((prev) => [...prev, errMsg]);
    }
  };
  

  const aiMessageRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    aiMessageRef.current?.scrollIntoView({
      behavior: 'smooth',
      block: 'start',
    });
    localStorage.setItem('notiongpt-chat', JSON.stringify(messages));
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
