import ChatItem from './ChatItem';
// import { ChatMessage } from './ChatContainer';

interface ChatMessage {
  id: number;
  role: 'user' | 'ai';
  text: string;
}

interface Props {
  messages: ChatMessage[];
}

function ChatList({ messages }: Props) {
  return (
    <div className="flex flex-col gap-3">
      {messages.map((msg) => (
        <ChatItem key={msg.id} role={msg.role} text={msg.text} />
      ))}
    </div>
  );
}

export default ChatList;
