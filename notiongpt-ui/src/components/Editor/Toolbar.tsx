import { useSlate } from 'slate-react';
import type { MarkFormat } from './MarkFormats';
import { isMarkActive, toggleMark } from './marks';

const FORMAT_OPTIONS: { label: string; format: MarkFormat }[] = [
  { label: 'Bold', format: 'bold' },
  { label: 'Italic', format: 'italic' },
  { label: 'Underline', format: 'underline' },
  { label: 'Strikethrough', format: 'strikethrough' },
  { label: 'Code', format: 'code' },
];

const Toolbar = () => {
  const editor = useSlate();

  return (
    <div className="mb-2 flex flex-wrap gap-2">
      {FORMAT_OPTIONS.map(({ format, label }) => {
        const active = isMarkActive(editor, format);
        return (
          <button
            key={format}
            onMouseDown={(e) => {
              e.preventDefault();
              toggleMark(editor, format);
            }}
            className={`px-2 py-1 rounded border ${
              active ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-800'
            }`}
          >
            {label}
          </button>
        );
      })}
    </div>
  );
};

export default Toolbar;
