import React from 'react';
import { Editor } from 'slate';
import { toggleMark } from './marks';

interface Props {
  editor: Editor;
}

const Toolbar = ({ editor }: Props) => {
  return (
    <div className="flex space-x-2 mb-4">
      <button
        className="px-2 py-1 border rounded"
        onMouseDown={(e) => {
          e.preventDefault();
          toggleMark(editor, 'bold');
        }}
      >
        Bold
      </button>
      <button
        className="px-2 py-1 border rounded"
        onMouseDown={(e) => {
          e.preventDefault();
          toggleMark(editor, 'italic');
        }}
      >
        Italic
      </button>
    </div>
  );
};

export default Toolbar;
