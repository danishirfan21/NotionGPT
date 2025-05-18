export const renderLeaf = ({ attributes, children, leaf }: any) => {
  if (leaf.bold) children = <strong>{children}</strong>;
  if (leaf.italic) children = <em>{children}</em>;
  if (leaf.underline) children = <u>{children}</u>;
  if (leaf.strikethrough) children = <s>{children}</s>;
  if (leaf.highlight) {
    children = (
      <span style={{ backgroundColor: 'yellow', padding: '0 2px' }}>
        {children}
      </span>
    );
  }
  if (leaf.superscript) children = <sup>{children}</sup>;
  if (leaf.subscript) children = <sub>{children}</sub>;
  if (leaf.quote) {
    children = (
      <span className="italic text-gray-500 border-l-2 pl-2 border-gray-300">
        {children}
      </span>
    );
  }
  if (leaf.code) {
    children = (
      <code className="bg-gray-200 text-red-600 rounded px-1 text-sm">
        {children}
      </code>
    );
  }

  return <span {...attributes}>{children}</span>;
};
