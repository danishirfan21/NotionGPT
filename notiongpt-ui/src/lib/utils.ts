import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export type CustomText = {
  text: string;
  bold?: boolean;
  italic?: boolean;
  underline?: boolean;
  strikethrough?: boolean;
  highlight?: boolean;
  superscript?: boolean;
  subscript?: boolean;
  quote?: boolean;
  code?: boolean;
};

export type ParagraphElement = { type: 'paragraph'; children: CustomText[] };
export type CodeBlockElement = { type: 'code-block'; children: CustomText[] };
export type HeadingOne = { type: 'heading-one'; children: CustomText[] };
export type HeadingTwo = { type: 'heading-two'; children: CustomText[] };
export type HeadingThree = { type: 'heading-three'; children: CustomText[] };
export type BulletedList = { type: 'bulleted-list'; children: CustomElement[] };
export type NumberedList = { type: 'numbered-list'; children: CustomElement[] };
export type ListItem = { type: 'list-item'; children: CustomText[] };
export type TableCell = { type: 'table-cell'; children: CustomText[] };
export type TableRow = { type: 'table-row'; children: TableCell[] };
export type TableBlock = { type: 'table'; children: TableRow[] };

export type CustomElement =
  | ParagraphElement
  | CodeBlockElement
  | HeadingOne
  | HeadingTwo
  | HeadingThree
  | BulletedList
  | NumberedList
  | ListItem
  | TableCell
  | TableRow
  | TableBlock;
