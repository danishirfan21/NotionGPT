import { useSlate } from 'slate-react';
import { cn } from '../../lib/utils';
import { isMarkActive, toggleMark } from './Marks';
import { isBlockActive, toggleBlock, type BlockFormat } from './BlockUtils';
import type { MarkFormat } from './MarkFormats';
import {
  Bold,
  Italic,
  Underline,
  Strikethrough,
  Highlighter,
  Superscript,
  Subscript,
  Quote,
  Code2,
  List,
  ListOrdered,
  Heading1,
  Heading2,
  Heading3,
  FileCode,
  Table,
} from 'lucide-react';
import type { JSX } from 'react';

const MARKS: {
  format: MarkFormat;
  label: string;
  icon: JSX.Element;
  tooltip: string;
}[] = [
  {
    format: 'bold',
    label: 'Bold',
    icon: <Bold size={16} />,
    tooltip: 'Bold (Ctrl+B)',
  },
  {
    format: 'italic',
    label: 'Italic',
    icon: <Italic size={16} />,
    tooltip: 'Italic (Ctrl+I)',
  },
  {
    format: 'underline',
    label: 'Underline',
    icon: <Underline size={16} />,
    tooltip: 'Underline (Ctrl+U)',
  },
  {
    format: 'strikethrough',
    label: 'Strikethrough',
    icon: <Strikethrough size={16} />,
    tooltip: 'Strikethrough (Ctrl+S)',
  },
  {
    format: 'highlight',
    label: 'Highlight',
    icon: <Highlighter size={16} />,
    tooltip: 'Highlight (Ctrl+H)',
  },
  {
    format: 'superscript',
    label: 'Superscript',
    icon: <Superscript size={16} />,
    tooltip: 'Superscript (Ctrl+Shift+P)',
  },
  {
    format: 'subscript',
    label: 'Subscript',
    icon: <Subscript size={16} />,
    tooltip: 'Subscript (Ctrl+Shift+B)',
  },
  {
    format: 'quote',
    label: 'Quote',
    icon: <Quote size={16} />,
    tooltip: 'Quote (Ctrl+Shift+Q)',
  },
  {
    format: 'code',
    label: 'Inline Code',
    icon: <Code2 size={16} />,
    tooltip: 'Inline Code (Ctrl+K)',
  },
];

const BLOCKS: {
  format: BlockFormat;
  label: string;
  icon: JSX.Element;
  tooltip: string;
}[] = [
  {
    format: 'heading-one',
    label: 'H1',
    icon: <Heading1 size={16} />,
    tooltip: 'Heading 1 (Ctrl+Alt+1)',
  },
  {
    format: 'heading-two',
    label: 'H2',
    icon: <Heading2 size={16} />,
    tooltip: 'Heading 2 (Ctrl+Alt+2)',
  },
  {
    format: 'heading-three',
    label: 'H3',
    icon: <Heading3 size={16} />,
    tooltip: 'Heading 3 (Ctrl+Alt+3)',
  },
  {
    format: 'bulleted-list',
    label: 'Bullet List',
    icon: <List size={16} />,
    tooltip: 'Bullet List (Ctrl+Shift+U)',
  },
  {
    format: 'numbered-list',
    label: 'Numbered List',
    icon: <ListOrdered size={16} />,
    tooltip: 'Numbered List (Ctrl+Shift+L)',
  },
  {
    format: 'table',
    label: 'Table',
    icon: <Table size={16} />,
    tooltip: 'Insert Table (/table)',
  },
];

export default function Toolbar() {
  const editor = useSlate();

  return (
    <div className="flex gap-2 mb-4 flex-wrap">
      {MARKS.map(({ format, label, icon, tooltip }) => {
        const active = isMarkActive(editor, format);
        return (
          <button
            key={format}
            title={tooltip}
            onMouseDown={(e) => {
              e.preventDefault();
              toggleMark(editor, format);
            }}
            className={cn(
              'flex items-center gap-1 px-2 py-1 border rounded text-sm',
              active
                ? 'bg-black text-white'
                : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
            )}
          >
            {icon}
            <span>{label}</span>
          </button>
        );
      })}

      <button
        title='Code Block (Ctrl+Shift+C)'
        onMouseDown={(e) => {
          e.preventDefault();
          toggleBlock(editor, 'code-block');
        }}
        className={cn(
          'flex items-center gap-1 px-2 py-1 border rounded text-sm',
          isBlockActive(editor, 'code-block')
            ? 'bg-black text-white'
            : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
        )}
      >
        <FileCode size={16} />
        <span>Code Block</span>
      </button>

      {BLOCKS.map(({ format, label, icon, tooltip }) => (
        <button
          title={tooltip}
          key={format}
          onMouseDown={(e) => {
            e.preventDefault();
            toggleBlock(editor, format);
          }}
          className={cn(
            'flex items-center gap-1 px-2 py-1 border rounded text-sm',
            isBlockActive(editor, format)
              ? 'bg-black text-white'
              : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
          )}
        >
          {icon}
          <span>{label}</span>
        </button>
      ))}
    </div>
  );
}
