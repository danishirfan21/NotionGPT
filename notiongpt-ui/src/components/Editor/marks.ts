import { Editor } from 'slate';

type MarkFormat = 'bold' | 'italic';

export const toggleMark = (editor: Editor, format: MarkFormat) => {
  const isActive = isMarkActive(editor, format);
  if (isActive) {
    Editor.removeMark(editor, format);
  } else {
    Editor.addMark(editor, format, true);
  }
};

export const isMarkActive = (editor: Editor, format: MarkFormat) => {
  const marks = Editor.marks(editor);
  return marks ? (marks as any)[format] === true : false;
};
