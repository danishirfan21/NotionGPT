import { Editor, Transforms, Element as SlateElement } from 'slate';

export type BlockFormat =
  | 'paragraph'
  | 'code-block'
  | 'heading-one'
  | 'heading-two'
  | 'heading-three'
  | 'bulleted-list'
  | 'numbered-list'
  | 'table';

const LIST_TYPES = ['bulleted-list', 'numbered-list'];

type TableBlock = {
  type: 'table';
  children: TableRow[];
};

type TableRow = {
  type: 'table-row';
  children: TableCell[];
};

type TableCell = {
  type: 'table-cell';
  children: { text: string }[];
};


export const isBlockActive = (editor: Editor, format: BlockFormat) => {
  const [match] = Editor.nodes(editor, {
    match: (n) =>
      !Editor.isEditor(n) &&
      SlateElement.isElement(n) &&
      (n as SlateElement).type === format,
  });

  return !!match;
};

export const toggleBlock = (editor: Editor, format: BlockFormat) => {
  const isActive = isBlockActive(editor, format);
  const isList = LIST_TYPES.includes(format);

  Transforms.unwrapNodes(editor, {
    match: (n) =>
      !Editor.isEditor(n) &&
      SlateElement.isElement(n) &&
      LIST_TYPES.includes((n as SlateElement).type),
    split: true,
  });

  if (isActive) {
    Transforms.setNodes(editor, { type: 'paragraph' });
    return;
  }

  if (format === 'table') {
    const table: TableBlock = {
      type: 'table',
      children: [
        {
          type: 'table-row',
          children: [
            { type: 'table-cell', children: [{ text: '' }] },
            { type: 'table-cell', children: [{ text: '' }] },
          ],
        },
        {
          type: 'table-row',
          children: [
            { type: 'table-cell', children: [{ text: '' }] },
            { type: 'table-cell', children: [{ text: '' }] },
          ],
        },
      ],
    };    
    Transforms.insertNodes(editor, table);
    return;
  }

  const newType = isList ? 'list-item' : format;
  Transforms.setNodes(editor, { type: newType });

  if (isList) {
    const block = { type: format, children: [] };
    Transforms.wrapNodes(editor, block);
  }
};

