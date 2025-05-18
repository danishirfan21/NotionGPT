import { useSlate } from 'slate-react';
import type { MarkFormat } from './MarkFormats';
import { cn } from '../../lib/utils';
import { isMarkActive, toggleMark } from './Marks';


const MARKS: { format: MarkFormat; label: string }[] = [
  { format: 'bold', label: 'Bold' },
  { format: 'italic', label: 'Italic' },
  { format: 'underline', label: 'Underline' },
  { format: 'strikethrough', label: 'Strikethrough' },
  { format: 'highlight', label: 'Highlight' },
  { format: 'superscript', label: 'Sup' },
  { format: 'subscript', label: 'Sub' },
  { format: 'quote', label: 'Quote' },
  { format: 'code', label: 'Code' },
];


export default function Toolbar() {
  const editor = useSlate();

  return (
    <div className="flex gap-2 mb-4 flex-wrap">
      {MARKS.map(({ format, label }) => {
        const active = isMarkActive(editor, format);
        return (
          <button
            key={format}
            onMouseDown={(e) => {
              e.preventDefault();
              toggleMark(editor, format);
            }}
            className={cn(
              'px-2 py-1 border rounded text-sm',
              active
                ? 'bg-black text-white'
                : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
            )}
          >
            {label}
          </button>
        );
      })}
    </div>
  );
}
