import { Transforms, type Editor, Element as SlateElement } from 'slate';
import { ReactEditor } from "slate-react";
import type { CustomText } from './utils';

export type TableCell = {
  type: 'table-cell';
  children: CustomText[];
};

export type TableRow = {
  type: 'table-row';
  children: TableCell[];
};

export type TableBlock = {
  type: 'table';
  children: TableRow[];
};

export const addRow = (editor: Editor, table: TableBlock) => {
    const newRow: TableRow = {
      type: 'table-row', // string literal, matches TableRow type exactly
      children: table.children[0].children.map(
        (): TableCell => ({
          type: 'table-cell', // again, must match exactly
          children: [{ text: '' }],
        })
      ),
    };
      

  const path = ReactEditor.findPath(editor, table);
  Transforms.insertNodes(editor, newRow, {
    at: [...path, table.children.length],
  });
};

export const removeRow = (editor: Editor, table: SlateElement) => {
  if (table.children.length <= 1) return;
  const path = ReactEditor.findPath(editor, table);
  Transforms.removeNodes(editor, {
    at: [...path, table.children.length - 1],
  });
};

export const addColumn = (editor: Editor, table: SlateElement) => {
  const path = ReactEditor.findPath(editor, table);
  table.children.forEach((row, rowIndex) => {
    if (!('children' in row)) return;
    const cellPath = [...path, rowIndex, row.children.length];
    Transforms.insertNodes(
      editor,
      {
        type: 'table-cell',
        children: [{ text: '' }],
      },
      { at: cellPath }
    );
  });
};

export const removeColumn = (editor: Editor, table: SlateElement) => {
  const path = ReactEditor.findPath(editor, table);

  const firstRow = table.children[0];
  if (!('children' in firstRow)) return;

  const colCount = (firstRow as SlateElement).children.length;
  if (colCount <= 1) return;

  table.children.forEach((_row, rowIndex) => {
    const cellPath = [...path, rowIndex, colCount - 1];
    Transforms.removeNodes(editor, { at: cellPath });
  });
};
  
