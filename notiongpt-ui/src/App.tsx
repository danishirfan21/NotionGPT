import ChatContainer from './components/Chat/ChatContainer';
import BlockEditor from './components/Editor/BlockEditor';
import { useState, useMemo } from 'react';
import { createEditor } from 'slate';

import type { BaseEditor, Descendant } from 'slate';
import { withReact, type ReactEditor } from 'slate-react';

type CustomElement = { type: 'paragraph'; children: CustomText[] };
type CustomText = { text: string };

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
    children: [{ text: 'Start writing your notes here...' }],
  },
];

function App() {
  const editor = useMemo(() => withReact(createEditor()), []);
  const [noteValue, setNoteValue] = useState<Descendant[]>(initialNote);

  const handleSyncMessageToNotes = (text: string) => {
    setNoteValue((prev) => [
      ...prev,
      { type: 'paragraph', children: [{ text }] },
    ]);
  };

  return (
    <div className="h-screen w-screen grid grid-cols-2 bg-gray-100">
      <div className="border-r flex justify-center items-center">
        <ChatContainer onNewAIMessage={handleSyncMessageToNotes} />
      </div>
      <BlockEditor editor={editor} value={noteValue} onChange={setNoteValue} />
    </div>
  );
}

export default App;
