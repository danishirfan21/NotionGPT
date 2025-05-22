import { Editor } from 'slate';
import { toggleMark } from '../components/Editor/Marks';
import { toggleBlock } from '../components/Editor/BlockUtils';

export const handleKeyDown = (editor: Editor) => (event: React.KeyboardEvent<HTMLDivElement>) => {
  const { metaKey, ctrlKey, shiftKey, altKey, key } = event;
  const isCmd = metaKey || ctrlKey;
  const k = key.toLowerCase();

  if (isCmd && k === 'b') {
    event.preventDefault();
    toggleMark(editor, 'bold');
  }

  if (isCmd && k === 'i') {
    event.preventDefault();
    toggleMark(editor, 'italic');
  }

  if (isCmd && !shiftKey && k === 'u') {
    event.preventDefault();
    toggleMark(editor, 'underline');
  }

  if (isCmd && k === 's') {
    event.preventDefault();
    toggleMark(editor, 'strikethrough');
  }

  if (isCmd && k === 'h') {
    event.preventDefault();
    toggleMark(editor, 'highlight');
  }

  if (isCmd && shiftKey && k === 'q') {
    event.preventDefault();
    toggleMark(editor, 'quote');
  }

  if (isCmd && k === 'k') {
    event.preventDefault();
    toggleMark(editor, 'code');
  }

  if (isCmd && shiftKey && k === 'p') {
    event.preventDefault();
    toggleMark(editor, 'superscript');
  }

  if (isCmd && shiftKey && k === 'b') {
    event.preventDefault();
    toggleMark(editor, 'subscript');
  }

  if (isCmd && shiftKey && k === 'c') {
    event.preventDefault();
    toggleBlock(editor, 'code-block');
  }

  if (ctrlKey && altKey && k === '1') {
    event.preventDefault();
    toggleBlock(editor, 'heading-one');
  }

  if (ctrlKey && altKey && k === '2') {
    event.preventDefault();
    toggleBlock(editor, 'heading-two');
  }

  if (ctrlKey && altKey && k === '3') {
    event.preventDefault();
    toggleBlock(editor, 'heading-three');
  }

  if (isCmd && shiftKey && k === 'l') {
    event.preventDefault();
    toggleBlock(editor, 'numbered-list');
  }

  if (isCmd && shiftKey && k === 'u') {
    event.preventDefault();
    toggleBlock(editor, 'bulleted-list');
  }

  if (k === '/') {
    console.log('Slash menu opened');
  }

  if (k === 'escape') {
    console.log('Slash menu closed');
  }
};
