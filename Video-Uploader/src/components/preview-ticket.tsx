export function PreviewTicket({
  title,
  content,
  onClick,
}: {
  title: string;
  content: string;
  onClick: () => void;
}) {
  return (
    <button onClick={onClick}>
      <h3 className="font-medium text-purple-900 mb-1">{title}</h3>
      <p className="text-purple-700 text-sm">{content}</p>
    </button>
  );
}
