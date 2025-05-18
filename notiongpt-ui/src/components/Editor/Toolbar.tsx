import { useSlate } from 'slate-react';
import { isMarkActive, toggleMark } from './marks';

const Toolbar = () => {
  const editor = useSlate();

  const Button = ({ format, label }: { format: string; label: string }) => {
    const active = isMarkActive(editor, format);
    return (
      <button
        onMouseDown={(e) => {
          e.preventDefault();
          toggleMark(editor, format);
        }}
        className={`px-2 py-1 border rounded mr-2 ${
          active ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-800'
        }`}
      >
        {label}
      </button>
    );
  };

  return (
    <div className="mb-2">
      <Button format="bold" label="Bold" />
      <Button format="italic" label="Italic" />
    </div>
  );
};

export default Toolbar;
