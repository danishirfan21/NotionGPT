import ChatItem from './ChatItem';
// import { ChatMessage } from './ChatContainer';

interface ChatMessage {
  id: number;
  role: 'user' | 'ai';
  text: string;
}

interface Props {
  messages: ChatMessage[];
  aiMessageRef?: React.RefObject<HTMLDivElement | null>;
}

function ChatList({ messages, aiMessageRef }: Props) {
  return (
    <div className="flex flex-col gap-3">
      {messages.map((msg, index) => {
        const isLastAI = msg.role === 'ai' && index === messages.length - 1;

        return (
          <div key={msg.id} ref={isLastAI ? aiMessageRef : undefined}>
            <ChatItem role={msg.role} text={msg.text} />
          </div>
        );
      })}
    </div>
  );
}

export default ChatList;
