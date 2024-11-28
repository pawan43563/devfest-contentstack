import React from "react";
import { Play, X } from "lucide-react";
import { Button } from "./ui/button";

interface VideoPreviewProps {
  thumbnailUrl: string;
  videoUrl: string;
  onPlay?: () => void;
  onRemove?: () => void;
}

export function VideoPreview({
  thumbnailUrl,
  videoUrl,
  onPlay,
  onRemove,
}: VideoPreviewProps) {
  return (
    <div className="relative w-48 h-32 rounded-lg overflow-hidden shadow-md">
      <img
        src={thumbnailUrl}
        alt="Video thumbnail"
        className="w-full h-full object-cover"
      />
      <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-30 transition-opacity hover:bg-opacity-50">
        <Button
          variant="ghost"
          size="icon"
          className="text-white hover:text-purple-200"
          onClick={() => onPlay?.()}
        >
          <Play className="h-8 w-8" />
          <span className="sr-only">Play video</span>
        </Button>
      </div>
      {onRemove && (
        <Button
          variant="ghost"
          size="icon"
          className="absolute top-1 right-1 text-white bg-black bg-opacity-50 hover:bg-opacity-75 hover:text-red-500"
          onClick={onRemove}
        >
          <X className="h-5 w-5" />
          <span className="sr-only">Remove video</span>
        </Button>
      )}
    </div>
  );
}
