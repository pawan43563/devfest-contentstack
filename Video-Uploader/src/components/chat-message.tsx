import React, { memo, useState } from "react";
import { Avatar } from "./ui/avatar";
import { VideoPreview } from "./video-preview";
import { Button } from "./ui/button";
import { ChevronDown } from "lucide-react";
import { PreviewTicket } from "./preview-ticket";

interface ChatMessageProps {
  content: string;
  isUser?: boolean;
  avatar?: string;
  videoPreview?: {
    thumbnailUrl: string;
    videoUrl: string;
  };
  labels?: string[];
  onLabelClick?: (label: string) => void;
  selectOptions?: string[];
  onSelectOption?: (option: string) => void;
  isPreview?: boolean;
}

const ChatMessage = memo(function ChatMessage({
  content,
  isUser = false,
  avatar,
  videoPreview,
  labels,
  onLabelClick,
  selectOptions,
  onSelectOption,
  isPreview,
  previewData,
}: any) {
  const [isSelectOpen, setIsSelectOpen] = useState(false);
  const [labelDisable, setLabelDisable] = useState(false);
  const [selectDisable, setSelectDisable] = useState(false);

  return (
    <div className={`flex gap-3 p-4 ${isUser ? "justify-end" : ""}`}>
      {!isUser && <Avatar src={avatar} alt="Bot Avatar" fallback="CS" />}
      <div
        className={`max-w-[80%] space-y-2 ${
          isUser ? "items-end" : "items-start"
        }`}
      >
        <div
          className={`rounded-lg p-3 ${
            isUser
              ? "bg-purple-100 text-purple-900"
              : "bg-gray-100 text-gray-900"
          }`}
        >
          <p className="text-sm">{content}</p>
          {isPreview && (
            <PreviewTicket
              title="Here's a quick preview of Jira Ticket Content"
              content="Click on the component to View Details"
              previewData={previewData} // -----------handle preview overlay here
            />
          )}
          {labels && labels.length > 0 && (
            <div className="mt-2 flex flex-wrap gap-2">
              {labels.map((label, index) => (
                <Button
                  key={index}
                  variant="ghost"
                  size="default"
                  disabled={labelDisable}
                  onClick={() => {
                    setLabelDisable(true);
                    onLabelClick && onLabelClick(label);
                  }}
                  className="text-xs py-1 px-2 rounded-full bg-white hover:bg-gray-100"
                >
                  {label}
                </Button>
              ))}
            </div>
          )}
          {selectOptions && selectOptions.length > 0 && (
            <div className="mt-2 relative">
              <Button
                variant="ghost"
                size="default"
                onClick={() => setIsSelectOpen(!isSelectOpen)}
                className="w-full justify-between"
                disabled={selectDisable}
              >
                Select an option
                <ChevronDown className="h-4 w-4 ml-2" />
              </Button>
              {isSelectOpen && (
                <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg">
                  {selectOptions.map((option, index) => (
                    <Button
                      key={index}
                      variant="ghost"
                      size="default"
                      onClick={() => {
                        setSelectDisable(true);
                        onSelectOption && onSelectOption(option);
                        setIsSelectOpen(false);
                      }}
                      className="w-full justify-start"
                    >
                      {option}
                    </Button>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
        {videoPreview && (
          <VideoPreview
            thumbnailUrl={videoPreview.thumbnailUrl}
            videoUrl={videoPreview.videoUrl}
            onPlay={() => {
              /* Handle video play */
            }}
          />
        )}
      </div>
      {isUser && <Avatar alt="Bot Avatar" fallback="CS" />}
    </div>
  );
});

export default ChatMessage;
