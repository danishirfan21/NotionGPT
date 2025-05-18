import { useMemo, useState, useCallback } from 'react';
import { createEditor } from 'slate';
import { Slate, Editable, withReact, ReactEditor } from 'slate-react';
import type { Descendant, BaseEditor } from 'slate';

// Define types for Slate
type CustomElement = { type: 'paragraph'; children: CustomText[] };
type CustomText = { text: string };

declare module 'slate' {
  interface CustomTypes {
    Editor: BaseEditor & ReactEditor;
    Element: CustomElement;
    Text: CustomText;
  }
}

// 👇 Define initialValue at the top level immediately
const initialValue: Descendant[] = [
  {
    type: 'paragraph',
    children: [{ text: 'Start writing your notes here...' }],
  },
];

function BlockEditor() {
  // 👇 Create editor inside component (safely inside useMemo)
  const editor = useMemo(() => withReact(createEditor()), []);

  // 👇 Assign initialValue correctly
  const [value, setValue] = useState<Descendant[]>(initialValue);

  const renderElement = useCallback((props: any) => {
    return <p {...props.attributes}>{props.children}</p>;
  }, []);

  return (
    <div className="h-full w-full p-6 bg-white overflow-auto border-l">
      <h2 className="text-xl font-semibold mb-4">📝 Notes</h2>
      {value && (
        <Slate editor={editor} initialValue={value} onChange={setValue}>
          <Editable
            renderElement={renderElement}
            placeholder="Type something..."
            className="outline-none min-h-[300px] text-gray-800"
          />
        </Slate>
      )}
      {/* <Slate editor={editor} value={value} onChange={setValue}> */}
      {/* <Editable
          renderElement={renderElement}
          placeholder="Type something..."
          className="outline-none min-h-[300px] text-gray-800"
        />
      </Slate> */}
    </div>
  );
}

export default BlockEditor;
