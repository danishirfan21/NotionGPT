interface Props {
  role: 'user' | 'ai';
  text: string;
}

function ChatItem({ role, text }: Props) {
  const isUser = role === 'user';
  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-2`}>
      <div
        className={`px-4 py-2 rounded-xl text-white max-w-sm whitespace-pre-wrap ${
          isUser ? 'bg-blue-600' : 'bg-gray-700'
        }`}
      >
        {text}
      </div>
    </div>
  );
}

export default ChatItem;
