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
import { Minus, type LucideIcon, Plus } from 'lucide-react';
import {
  Heading1,
  Heading2,
  Heading3,
  List,
  ListOrdered,
  Code2,
  Bold,
  Italic,
  Underline,
  Strikethrough,
  Highlighter,
  Superscript,
  Subscript,
  Quote,
  Code,
  Table,
} from 'lucide-react';
import { addColumn, addRow, removeColumn, removeRow } from '../../lib/TableUtils';


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
      case 'table':
        return (
          <div className="relative group">
            <table
              {...attributes}
              className="table-auto border border-gray-300"
            >
              {children}
            </table>
            <div className="absolute -top-8 left-0 hidden group-hover:flex gap-2 bg-white p-1 shadow rounded z-10">
              {[
                {
                  label: 'Row',
                  icon: <Plus size={16} />,
                  onClick: () => addRow(editor, element),
                },
                {
                  label: 'Row',
                  icon: <Minus size={16} />,
                  onClick: () => removeRow(editor, element),
                },
                {
                  label: 'Col',
                  icon: <Plus size={16} />,
                  onClick: () => addColumn(editor, element),
                },
                {
                  label: 'Col',
                  icon: <Minus size={16} />,
                  onClick: () => removeColumn(editor, element),
                },
              ].map(({ label, icon, onClick }, i) => (
                <button
                  key={i}
                  onClick={onClick}
                  className="flex items-center gap-1 text-xs bg-gray-100 px-2 py-1 border border-gray-300 rounded hover:bg-gray-200 transition"
                >
                  {icon}
                  <span>{label}</span>
                </button>
              ))}
            </div>
          </div>
        );
      case 'table-row':
        return <tr {...attributes}>{children}</tr>;
      case 'table-cell':
        return (
          <td
            {...attributes}
            className="border border-gray-300 px-3 py-2 text-left align-top min-w-[120px]"
          >
            {children}
          </td>
        );

      default:
        return <p {...attributes}>{children}</p>;
    }
  }, [editor]);

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
    icon: LucideIcon;
  }; 

  const SLASH_COMMANDS: SlashCommand[] = [
    { label: 'Heading 1', value: 'heading-one', type: 'block', icon: Heading1 },
    { label: 'Heading 2', value: 'heading-two', type: 'block', icon: Heading2 },
    {
      label: 'Heading 3',
      value: 'heading-three',
      type: 'block',
      icon: Heading3,
    },
    {
      label: 'Bulleted List',
      value: 'bulleted-list',
      type: 'block',
      icon: List,
    },
    {
      label: 'Numbered List',
      value: 'numbered-list',
      type: 'block',
      icon: ListOrdered,
    },
    { label: 'Code Block', value: 'code-block', type: 'block', icon: Code2 },

    { label: 'Bold', value: 'bold', type: 'mark', icon: Bold },
    { label: 'Italic', value: 'italic', type: 'mark', icon: Italic },
    { label: 'Underline', value: 'underline', type: 'mark', icon: Underline },
    {
      label: 'Strikethrough',
      value: 'strikethrough',
      type: 'mark',
      icon: Strikethrough,
    },
    { label: 'Highlight', value: 'highlight', type: 'mark', icon: Highlighter },
    {
      label: 'Superscript',
      value: 'superscript',
      type: 'mark',
      icon: Superscript,
    },
    { label: 'Subscript', value: 'subscript', type: 'mark', icon: Subscript },
    { label: 'Quote', value: 'quote', type: 'mark', icon: Quote },
    { label: 'Inline Code', value: 'code', type: 'mark', icon: Code },
    { label: 'Table', value: 'table', type: 'block', icon: Table },
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
    <div className="flex flex-col h-full w-full bg-white border-l">
      <h2 className="text-xl font-semibold px-4 pt-4 p-4">📝 Notes</h2>

      <Slate
        editor={editor}
        initialValue={value}
        key={JSON.stringify(value)}
        onChange={onChange}
      >
        {/* Full-height container */}
        <div className="flex flex-col flex-1 overflow-hidden">
          {/* Sticky toolbar */}
          <div className="sticky top-0 z-10 bg-white px-4 py-2 border-b">
            <Toolbar />
          </div>

          {/* Scrollable editable content */}
          <div className="flex-1 overflow-auto px-4 py-4 custom-scroll">
            <Editable
              renderLeaf={renderLeaf}
              renderElement={renderElement}
              placeholder="Start writing your notes here..."
              className="outline-none text-gray-800 min-h-full"
              onKeyDown={handleKeyDown(editor, slash)}
            />
          </div>
        </div>

        {/* Slash command dropdown */}
        {showSlashMenu && (
          <ul
            ref={menuRef}
            className="absolute bg-white border border-gray-300 shadow-md w-60 rounded z-50"
          >
            {filteredCommands.map((cmd, index) => {
              const Icon = cmd.icon;
              return (
                <li
                  key={cmd.value}
                  className={`flex items-center gap-2 px-4 py-2 cursor-pointer ${
                    index === focusedIndex ? 'bg-gray-200' : ''
                  }`}
                  onMouseEnter={() => setFocusedIndex(index)}
                  onClick={() => {
                    handleSlashCommand(editor, cmd.value);
                    setShowSlashMenu(false);
                    setSlashCommand('');
                  }}
                >
                  <Icon size={16} className="text-gray-600" />
                  <span>{cmd.label}</span>
                </li>
              );
            })}
          </ul>
        )}
      </Slate>
    </div>
  );
  
}

export default BlockEditor;
