export const MARK_FORMATS = [
  { key: 'bold', label: 'Bold' },
  { key: 'italic', label: 'Italic' },
  { key: 'underline', label: 'Underline' },
  { key: 'strikethrough', label: 'Strikethrough' },
  { key: 'code', label: 'Code' },
  { key: 'highlight', label: 'Highlight' },
  { key: 'superscript', label: 'Superscript' },
  { key: 'subscript', label: 'Subscript' },
  { key: 'quote', label: 'Quote' },
];

export type MarkFormat =
  | 'bold'
  | 'italic'
  | 'underline'
  | 'strikethrough'
  | 'code'
  | 'highlight'
  | 'superscript'
  | 'subscript'
  | 'quote';
