import { Slate, Editable } from 'slate-react';
import type { Descendant } from 'slate';

interface Props {
  value: Descendant[];
  onChange: (value: Descendant[]) => void;
  editor: any;
}

function BlockEditor({ value, onChange, editor }: Props) {
  return (
    <div className="h-full w-full p-6 bg-white overflow-auto border-l">
      <h2 className="text-xl font-semibold mb-4">📝 Notes</h2>
      <Slate
        editor={editor}
        initialValue={value}
        key={JSON.stringify(value)}
        onChange={onChange}
      >
        <Editable
          placeholder="Type something..."
          className="outline-none min-h-[300px] text-gray-800"
        />
      </Slate>
    </div>
  );
}

export default BlockEditor;
