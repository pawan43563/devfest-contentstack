import { Button } from "./ui/button";
import { MoreVertical } from "lucide-react";

interface ChatHeaderProps {
  title: string;
  onMenu?: () => void;
}

export function ChatHeader({ title, onMenu }: ChatHeaderProps) {
  return (
    <div className="flex items-center justify-between px-3 py-1 border-b">
      <div>
        <h3 className="text-sm font-medium">{title}</h3>
      </div>
      <Button variant="ghost" size="icon" onClick={onMenu}>
        <MoreVertical className="h-3 w-3" />
        <span className="sr-only">Menu</span>
      </Button>
    </div>
  );
}
