import React, { useEffect, useRef, useState } from "react";
import { Send, Video } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { VideoPreview } from "./video-preview";
import { useChat } from "../hooks/useChat";

interface ChatInputProps {
  placeholder?: string;
  onSend: () => void;
  removeVideo: () => void;
  onVideoAttach?: (files: any[]) => void;
  videoPreview?: {
    thumbnailUrl: string;
    videoUrl: string;
  };
}

export function ChatInput({
  placeholder = "Ask a question",
  onSend,
  onVideoAttach,
  videoPreview,
  removeVideo,
}: any) {
  const [input, setInput] = useState("");
  const [files, setFiles] = useState<any>([]);

  const videoInputRef = useRef<HTMLInputElement>(null);

  const handleVideoBtnClick = () => {
    if (videoInputRef.current) {
      videoInputRef.current.click();
    }
  };

  const handleRemoveVideo = () => {
    setFiles([]);
    removeVideo();
  };

  useEffect(() => {
    if (files.length > 0) {
      if (onVideoAttach) onVideoAttach(files);
    }
  }, [files]);

  // const handleSubmit = useCallback(
  //   (e: React.FormEvent) => {
  //     e.preventDefault();
  //     if (input.trim()) {
  //       sendMessage(input.trim());
  //       setInput("");
  //     }
  //   },
  //   [input, sendMessage]
  // );

  return (
    <div className="p-4 border-t">
      {videoPreview && (
        <div className="mb-4">
          <VideoPreview
            thumbnailUrl={videoPreview.thumbnailUrl}
            videoUrl={videoPreview.videoUrl}
            onRemove={handleRemoveVideo}
            onPlay={() => {
              /* Handle video play */
            }}
          />
        </div>
      )}
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="icon" onClick={handleVideoBtnClick}>
          <Video className="h-5 w-5 text-purple-600" />
          <span className="sr-only">Attach video</span>
          <input
            ref={videoInputRef}
            type="file"
            style={{ display: "none" }}
            onChange={(e) => setFiles(e.target.files)}
            accept=".mov,.mp4"
          />
        </Button>
        <Input
          value={input}
          placeholder={placeholder}
          className="flex-1"
          onChange={(e) => setInput(e.target.value)}
        />
        <Button
          size="icon"
          className="bg-purple-600 hover:bg-purple-700"
          onClick={onSend}
        >
          <Send className="h-4 w-4" />
          <span className="sr-only">Send message</span>
        </Button>
      </div>
    </div>
  );
}
