import ChatContainer from './components/Chat/ChatContainer';
import BlockEditor from './components/Editor/BlockEditor';
import { useState, useMemo } from 'react';
import { createEditor } from 'slate';
import type { BaseEditor, Descendant } from 'slate';
import { withReact, type ReactEditor } from 'slate-react';
import type { CustomElement, CustomText } from './lib/utils';
import { useDebouncedEffect } from './hooks/useDebouncedEffect';
import { summarizeNotes } from './lib/summarizeNotes';

declare module 'slate' {
  interface CustomTypes {
    Editor: BaseEditor & ReactEditor;
    Element: CustomElement;
    Text: CustomText;
  }
}

const initialNote: Descendant[] = [
  {
    type: 'paragraph',
    children: [{ text: '' }],
  },
];

export default function App() {
  const editor = useMemo(() => withReact(createEditor()), []);
  const [noteValue, setNoteValue] = useState<Descendant[]>(initialNote);
  const [activeTab, setActiveTab] = useState<'chat' | 'notes'>('chat');
  const [isSummarizing, setIsSummarizing] = useState(false);

  const handleSyncMessageToNotes = (text: string) => {
    setNoteValue((prev) => {
      const first = prev[0];
      const isFirstEmpty =
        prev.length === 1 &&
        typeof first === 'object' &&
        'type' in first &&
        first.type === 'paragraph' &&
        Array.isArray(first.children) &&
        first.children[0]?.text === '';

      const cleaned = isFirstEmpty ? [] : prev;

      return [
        ...cleaned,
        { type: 'paragraph', children: [{ text }], generatedByAI: true },
      ];
    });
  };  

  useDebouncedEffect(
    () => {
      localStorage.setItem('notiongpt-notes', JSON.stringify(noteValue));
    },
    500,
    [noteValue]
  );

  const handleSummarize = async () => {
    setIsSummarizing(true);
    try {
      const summary = await summarizeNotes(noteValue);
      setNoteValue((prev) => [
        ...prev,
        {
          type: 'paragraph',
          children: [{ text: summary }],
          generatedByAI: true,
        },
      ]);
    } catch (err) {
      alert('Failed to summarize notes');
      console.error(err);
    }
    setIsSummarizing(false);
  };
  

  return (
    <div className="h-screen w-screen flex flex-col overflow-hidden bg-gray-100">
      {/* Desktop Layout */}
      <div className="hidden md:flex flex-1 h-screen">
        <div className="w-1/2 border-r flex justify-center items-center p-4">
          <ChatContainer onNewAIMessage={handleSyncMessageToNotes} />
        </div>
        <div className="w-1/2 p-4">
          <div className="h-full w-full bg-white rounded-xl shadow-sm border flex flex-col overflow-hidden p-4">
            {activeTab === 'notes' && (
              <button
                onClick={handleSummarize}
                disabled={isSummarizing}
                className="text-sm px-3 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 transition mb-2 self-end"
              >
                {isSummarizing ? 'Summarizing...' : '🧠 Summarize Notes'}
              </button>
            )}
            <BlockEditor
              value={noteValue}
              onChange={setNoteValue}
              editor={editor}
            />
          </div>
        </div>
      </div>

      {/* Mobile Layout */}
      <div className="flex-1 md:hidden">
        {activeTab === 'chat' ? (
          <ChatContainer onNewAIMessage={handleSyncMessageToNotes} />
        ) : (
          <div className="p-4 space-y-2">
            <button
              onClick={handleSummarize}
              disabled={isSummarizing}
              className="w-full text-sm px-3 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 transition"
            >
              {isSummarizing ? 'Summarizing...' : '🧠 Summarize Notes'}
            </button>
            <BlockEditor
              editor={editor}
              value={noteValue}
              onChange={setNoteValue}
            />
          </div>
        )}
      </div>

      {/* Mobile Tab Switcher */}
      <div className="md:hidden flex border-t bg-white">
        <button
          className={`w-1/2 py-2 text-sm ${
            activeTab === 'chat' ? 'bg-gray-200 font-semibold' : ''
          }`}
          onClick={() => setActiveTab('chat')}
        >
          Chat
        </button>
        <button
          className={`w-1/2 py-2 text-sm ${
            activeTab === 'notes' ? 'bg-gray-200 font-semibold' : ''
          }`}
          onClick={() => setActiveTab('notes')}
        >
          Notes
        </button>
      </div>

      {/* Clear Button (hidden on mobile) */}
      <button
        onClick={() => {
          localStorage.removeItem('notiongpt-chat');
          localStorage.removeItem('notiongpt-notes');
          location.reload();
        }}
        className="hidden md:block absolute top-2 right-4 text-xs underline text-red-500 z-50 p-6"
      >
        Clear All Data
      </button>
    </div>
  );
}
