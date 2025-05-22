import { useCallback, useState } from 'react';
import { Slate, Editable, type RenderElementProps } from 'slate-react';
import { Editor } from 'slate';
import type { Descendant } from 'slate';
import Toolbar from './Toolbar';
import { handleKeyDown } from '../../lib/handleKeyDown';

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
    if (leaf.code) {
      el = (
        <code className="bg-gray-200 px-1 rounded text-sm font-mono text-red-600">
          {el}
        </code>
      );
    }
    if (leaf.highlight) {
      el = <span className="bg-yellow-300 px-1 rounded-sm">{el}</span>;
    }
    if (leaf.superscript) el = <sup>{el}</sup>;
    if (leaf.subscript) el = <sub>{el}</sub>;
    if (leaf.quote) {
      el = (
        <span className="italic text-gray-500 border-l-2 pl-2 border-gray-300">
          {el}
        </span>
      );
    }

    return <span {...attributes}>{el}</span>;
  }, []);
  
  const renderElement = useCallback((props: RenderElementProps) => {
    const { attributes, children, element } = props;
    switch (element.type) {
      case 'heading-one':
        return (
          <h1 {...attributes} className="text-3xl font-bold my-2">
            {children}
          </h1>
        );
      case 'heading-two':
        return (
          <h2 {...attributes} className="text-2xl font-semibold my-2">
            {children}
          </h2>
        );
      case 'heading-three':
        return (
          <h3 {...attributes} className="text-xl font-medium my-2">
            {children}
          </h3>
        );
      case 'bulleted-list':
        return (
          <ul {...attributes} className="list-disc pl-6 my-2">
            {children}
          </ul>
        );
      case 'numbered-list':
        return (
          <ol {...attributes} className="list-decimal pl-6 my-2">
            {children}
          </ol>
        );
      case 'list-item':
        return <li {...attributes}>{children}</li>;
      case 'code-block':
        return (
          <pre
            {...attributes}
            className="bg-gray-100 p-2 rounded text-sm font-mono text-purple-800"
          >
            <code>{children}</code>
          </pre>
        );
      default:
        return <p {...attributes}>{children}</p>;
    }
  }, []);

  return (
    <div className="h-full w-full p-6 bg-white overflow-auto border-l overflow-auto custom-scroll p-4 h-full">
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
          renderElement={renderElement}
          placeholder="Type something..."
          className="outline-none min-h-[300px] text-gray-800"
          onKeyDown={handleKeyDown(editor)}
        />
      </Slate>
    </div>
  );
}

export default BlockEditor;
