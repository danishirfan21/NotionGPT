import { useCallback, useEffect, useRef, useState } from 'react';
import { Slate, Editable, type RenderElementProps, type RenderLeafProps, ReactEditor } from 'slate-react';
import { Editor, Transforms } from 'slate';
import type { Descendant } from 'slate';
import Toolbar from './Toolbar';
import { handleKeyDown } from '../../lib/handleKeyDown';
import { toggleBlock, type BlockFormat } from './BlockUtils';
import { toggleMark } from './Marks';
import { Range } from 'slate';
import type { MarkFormat } from './MarkFormats';

interface Props {
  value: Descendant[];
  onChange: (value: Descendant[]) => void;
  editor: Editor;
}

function BlockEditor({ value, onChange, editor }: Props) {
  const renderLeaf = useCallback(
    ({ attributes, children, leaf }: RenderLeafProps) => {
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

  const [slashCommand, setSlashCommand] = useState<string>('');
  const [showSlashMenu, setShowSlashMenu] = useState<boolean>(false);
  const [focusedIndex, setFocusedIndex] = useState(0);
  const menuRef = useRef<HTMLUListElement | null>(null);

  const deleteSlashTrigger = () => {
    const { selection } = editor;
    if (!selection || !Range.isCollapsed(selection)) return;

    const offset = slashCommand.length + 1;
    const start = {
      ...selection.anchor,
      offset: selection.anchor.offset - offset,
    };

    Transforms.delete(editor, {
      at: { anchor: start, focus: selection.anchor },
    });
  };


  const handleSlashCommand = (
    editor: Editor,
    command: BlockFormat | MarkFormat
  ) => {
    const cmd = SLASH_COMMANDS.find((c) => c.value === command);
    if (!cmd) return;

    if (cmd.type === 'block') {
      toggleBlock(editor, cmd.value as BlockFormat);
    } else if (cmd.type === 'mark') {
      toggleMark(editor, cmd.value as MarkFormat);
    }
    deleteSlashTrigger()
  };

  type SlashCommand = {
    label: string;
    value: BlockFormat | MarkFormat;
    type: 'block' | 'mark';
  };  

  const SLASH_COMMANDS: SlashCommand[] = [
    { label: 'Heading 1', value: 'heading-one', type: 'block' },
    { label: 'Heading 2', value: 'heading-two', type: 'block' },
    { label: 'Heading 3', value: 'heading-three', type: 'block' },
    { label: 'Bulleted List', value: 'bulleted-list', type: 'block' },
    { label: 'Numbered List', value: 'numbered-list', type: 'block' },
    { label: 'Code Block', value: 'code-block', type: 'block' },

    { label: 'Bold', value: 'bold', type: 'mark' },
    { label: 'Italic', value: 'italic', type: 'mark' },
    { label: 'Underline', value: 'underline', type: 'mark' },
    { label: 'Strikethrough', value: 'strikethrough', type: 'mark' },
    { label: 'Highlight', value: 'highlight', type: 'mark' },
    { label: 'Superscript', value: 'superscript', type: 'mark' },
    { label: 'Subscript', value: 'subscript', type: 'mark' },
    { label: 'Quote', value: 'quote', type: 'mark' },
    { label: 'Inline Code', value: 'code', type: 'mark' },
  ];

  const filteredCommands = SLASH_COMMANDS.filter((cmd) =>
    cmd.label.toLowerCase().includes(slashCommand.toLowerCase())
  );  

  const slash = {
    show: showSlashMenu,
    setShow: setShowSlashMenu,
    command: slashCommand,
    setCommand: setSlashCommand,
    handleSlashCommand,
    filteredCommands,
    focusedIndex,
    setFocusedIndex,
  };

  console.log('SlashCommand:', slashCommand);
  console.log('Filtered:', filteredCommands);

  useEffect(() => {
    if (!showSlashMenu || !editor.selection || !menuRef.current) return;

    const slashOffset = slashCommand.length + 1;
    const anchor = editor.selection.anchor;

    if (anchor.offset < slashOffset) return;

    const pointBeforeSlash = {
      ...anchor,
      offset: anchor.offset - slashOffset,
    };

    const range: Range = {
      anchor: pointBeforeSlash,
      focus: pointBeforeSlash,
    };

    try {
      const domRange = ReactEditor.toDOMRange(editor, range);
      const rect = domRange.getBoundingClientRect();

      const menu = menuRef.current;
      menu.style.position = 'absolute';
      menu.style.left = `${rect.left + window.scrollX}px`;
      menu.style.top = `${rect.top + window.scrollY + rect.height}px`;
      menu.style.zIndex = '9999';
    } catch (e) {
      console.warn('Dropdown positioning error:', e);
    }
  }, [showSlashMenu, slashCommand, editor]);
  
  
  

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
          onKeyDown={handleKeyDown(editor, slash)}
        />
        {showSlashMenu && (
          <ul
            ref={menuRef}
            className="absolute bg-white border border-gray-300 shadow-md w-60 rounded z-50"
          >
            {filteredCommands.map((cmd, index) => (
              <li
                key={cmd.value}
                className={`px-4 py-2 cursor-pointer ${
                  index === focusedIndex ? 'bg-gray-200' : ''
                }`}
                onMouseEnter={() => setFocusedIndex(index)}
                onClick={() => {
                  handleSlashCommand(editor, cmd.value);
                  setShowSlashMenu(false);
                  setSlashCommand('');
                }}
              >
                {cmd.label}
              </li>
            ))}
          </ul>
        )}
      </Slate>
    </div>
  );
}

export default BlockEditor;
