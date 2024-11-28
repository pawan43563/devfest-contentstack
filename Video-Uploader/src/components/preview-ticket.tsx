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
    <button
      onClick={onClick}
      className=" flex justify-end gap-3 p-4 w-full text-left"
    >
      <div className="flex-1 max-w-[60%] space-y-2 bg-purple-50 hover:bg-purple-100 transition-colors p-3 rounded-lg">
        <h3 className="font-medium text-purple-900 mb-1">{title}</h3>
        <p className="text-purple-700 text-sm">{content}</p>
      </div>
    </button>
  );
}
