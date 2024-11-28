import React, { useRef } from "react";
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

  const [play, setPlay] = React.useState(false);
  const [isModalOpen, setIsModalOpen] = React.useState(false);

  const handleModal = () => {
    setIsModalOpen(true); // Open the modal when fullscreen button is clicked
    handlePlay();
  };

  // Function to close the modal
  const closeModal = () => {
    setIsModalOpen(false);
  };


  const videoRef = useRef<HTMLVideoElement>(null);

  const handlePlay = () => {
    if (videoRef.current) {
      videoRef.current.play();
      setPlay(true);
    }
    if (onPlay) {
      onPlay();
    }
  };
  return (
    <div className="relative w-48 h-32 rounded-lg overflow-hidden shadow-md">
      <video
        src={videoUrl}
        controls
        className="w-full h-full object-cover"
        crossOrigin="anonymous"
        style={{ width: "100%", height: "100%", objectFit: "cover" }}
      ></video>

      {!play && <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-30 transition-opacity hover:bg-opacity-50">
         <Button
          variant="ghost"
          size="icon"
          className="text-white hover:text-purple-200"
          onClick={handleModal}
        >
          <Play className="h-8 w-8" />
          <span className="sr-only">Play video</span>
        </Button>
      </div>}
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

      {/* Fullscreen Modal */}
      {isModalOpen && (
        <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-75 z-50 flex items-center justify-center">
          <div className="relative w-full max-w-screen-lg">
            <video
              ref={videoRef}
              src={videoUrl}
              controls
              autoPlay
              className="w-full h-full object-cover"
              crossOrigin="anonymous"
            ></video>
            <button
              onClick={closeModal}
              className="absolute top-4 right-4 text-white text-xl"
            >
              <X className="h-8 w-8" />
            </button>
          </div>
        </div>
      )}

    </div>
  );
}