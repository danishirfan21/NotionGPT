import { Editor, Transforms } from 'slate';
import { toggleMark } from '../components/Editor/Marks';
import { toggleBlock, type BlockFormat } from '../components/Editor/BlockUtils';
import type { MarkFormat } from '../components/Editor/MarkFormats';

type SlashState = {
  show: boolean;
  setShow: React.Dispatch<React.SetStateAction<boolean>>;
  command: string;
  setCommand: React.Dispatch<React.SetStateAction<string>>;
  handleSlashCommand: (
    editor: Editor,
    command: BlockFormat | MarkFormat
  ) => void;
  filteredCommands: { label: string; value: BlockFormat | MarkFormat }[];
  focusedIndex: number;
  setFocusedIndex: React.Dispatch<React.SetStateAction<number>>;
};


export const handleKeyDown =
  (editor: Editor, slash?: SlashState) =>
  (event: React.KeyboardEvent<HTMLDivElement>) => {
    const { metaKey, ctrlKey, shiftKey, altKey, key } = event;
    const isCmd = metaKey || ctrlKey;
    const k = key.toLowerCase();

    if (isCmd && k === 'b') return prevent(() => toggleMark(editor, 'bold'));
    if (isCmd && k === 'i') return prevent(() => toggleMark(editor, 'italic'));
    if (isCmd && !shiftKey && k === 'u')
      return prevent(() => toggleMark(editor, 'underline'));
    if (isCmd && k === 's')
      return prevent(() => toggleMark(editor, 'strikethrough'));
    if (isCmd && k === 'h')
      return prevent(() => toggleMark(editor, 'highlight'));
    if (isCmd && shiftKey && k === 'q')
      return prevent(() => toggleMark(editor, 'quote'));
    if (isCmd && k === 'k') return prevent(() => toggleMark(editor, 'code'));
    if (isCmd && shiftKey && k === 'p')
      return prevent(() => toggleMark(editor, 'superscript'));
    if (isCmd && shiftKey && k === 'b')
      return prevent(() => toggleMark(editor, 'subscript'));
    if (isCmd && shiftKey && k === 'c')
      return prevent(() => toggleBlock(editor, 'code-block'));
    if (ctrlKey && altKey && k === '1')
      return prevent(() => toggleBlock(editor, 'heading-one'));
    if (ctrlKey && altKey && k === '2')
      return prevent(() => toggleBlock(editor, 'heading-two'));
    if (ctrlKey && altKey && k === '3')
      return prevent(() => toggleBlock(editor, 'heading-three'));
    if (isCmd && shiftKey && k === 'l')
      return prevent(() => toggleBlock(editor, 'numbered-list'));
    if (isCmd && shiftKey && k === 'u')
      return prevent(() => toggleBlock(editor, 'bulleted-list'));

    if (!slash) return;

    const {
      show,
      setShow,
      command,
      setCommand,
      handleSlashCommand,
      filteredCommands,
      focusedIndex,
      setFocusedIndex,
    } = slash;

    if (key === '/') {
      setShow(true);
      setCommand('');
      return;
    }

    if (show && key.length === 1 && /^[a-zA-Z0-9]$/.test(key)) {
      setCommand((prev) => prev + key);
      return;
    }

    if (show && key === 'Backspace') {
      setCommand((prev) => {
        const updated = prev.slice(0, -1);
        if (updated === '') setShow(false);
        return updated;
      });
      return;
    }

    if (show) {
      if (key === 'ArrowDown') {
        event.preventDefault();
        setFocusedIndex((prev) => (prev + 1) % filteredCommands.length);
        return;
      }

      if (key === 'ArrowUp') {
        event.preventDefault();
        setFocusedIndex(
          (prev) =>
            (prev - 1 + filteredCommands.length) % filteredCommands.length
        );
        return;
      }

      if (key === 'Enter') {
        event.preventDefault();
        const selected = filteredCommands[focusedIndex];
        if (selected) {
          Transforms.delete(editor, {
            at: {
              anchor: {
                ...editor.selection!.anchor,
                offset: editor.selection!.anchor.offset - (command.length + 1),
              },
              focus: editor.selection!.anchor,
            },
          });
          handleSlashCommand(editor, selected.value);
          setShow(false);
          setCommand('');
        }
        return;
      }

      if (key === 'Escape') {
        setShow(false);
        return;
      }
    }
  };

const prevent = (action: () => void) => {
  action();
};
