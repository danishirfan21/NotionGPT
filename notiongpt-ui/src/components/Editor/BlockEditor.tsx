import { useCallback } from 'react';
import { Slate, Editable } from 'slate-react';
import { Editor } from 'slate';
import type { Descendant } from 'slate';
import Toolbar from './Toolbar';

interface Props {
  value: Descendant[];
  onChange: (value: Descendant[]) => void;
  editor: Editor;
}

function BlockEditor({ value, onChange, editor }: Props) {
  const renderLeaf = useCallback((props: any) => {
    const { attributes, children, leaf } = props;
    let el = children;

    if (leaf.bold) el = <strong>{el}</strong>;
    if (leaf.italic) el = <em>{el}</em>;
    if (leaf.underline) el = <u>{el}</u>;
    if (leaf.strikethrough) el = <s>{el}</s>;
    if (leaf.code)
      el = <code className="bg-gray-200 px-1 rounded text-sm">{el}</code>;

    return <span {...attributes}>{el}</span>;
  }, []);
  

  return (
    <div className="h-full w-full p-6 bg-white overflow-auto border-l">
      <h2 className="text-xl font-semibold mb-4">📝 Notes</h2>
      <Slate
        editor={editor}
        initialValue={value}
        key={JSON.stringify(value)}
        onChange={onChange}
      >
        <Toolbar />
        <Editable
          renderLeaf={renderLeaf}
          placeholder="Type something..."
          className="outline-none min-h-[300px] text-gray-800"
        />
      </Slate>
    </div>
  );
}

export default BlockEditor;
