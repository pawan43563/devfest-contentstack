import React, { useState, useEffect, useCallback, useRef } from "react";
import { Header } from "./header";
import { ChatHeader } from "./chat-header";
import ChatMessage from "./chat-message";
import { ChatInput } from "./chat-input";
import { Loading } from "./loading";
import logo from "../assets/contentstack.png";
import { useChat } from "../hooks/useChat";
import { PreviewTicket } from "./preview-ticket";
import services from "../services";
import { v4 as uuidv4 } from "uuid";

export default function ContentSpock() {
  const {
    messages,
    messagesEndRef,
    scrollToBottom,
    addMessage,
    onLabelClick,
    chatLoading,
    setChatLoading,
    handleSelectInput,
    setMessages,
  } = useChat();

  const [videoAttached, setVideoAttached] = useState(false);
  const [formData, setFormData] = useState(new FormData());
  const [videoPreview, setVideoPreview] = useState("");
  const [input, setInput] = useState("");

  const ref: any = useRef(null);

  const handleInitMsg = (label) => onLabelClick(label, "init");

  const handleLabelMsg = (label, cat) => {
    onLabelClick(label, "label", cat);
  };

  const onVideoAttach = async (files: any) => {
    setVideoAttached(true);
    const formDataTemp = new FormData();
    for (const file of files) {
      formDataTemp.append("upload", file);
      const videoURL = URL.createObjectURL(file);
      setVideoPreview(videoURL);

      const videoElement = document.getElementById(
        "videoPreview"
      ) as HTMLVideoElement;
      if (videoElement) {
        videoElement.src = videoURL;
        videoElement.load();
      }
    }
    setFormData(formDataTemp);
    return;
  };
  const removeVideo = () => setVideoAttached(false);

  const handleSubmit = async () => {
    if (videoAttached && formData) {
      addMessage({
        id: uuidv4(),
        content: "Uploading Video ...",
        isUser: true,
        videoPreview: { videoUrl: videoPreview },
      });

      setVideoAttached(false);
      setChatLoading(true);
      const res = await services.handleVideoUpload(formData);
      setChatLoading(false);
      if (res !== "fail") {
        addMessage({
          id: uuidv4(),
          content: "Video Uploaded Sucessfully",
          avatar: logo,
        });
        if (res !== "success") {
          if (res) {
            addMessage({
              id: uuidv4(),
              content: `We have identified the Label: ${res}. Is this Correct?`,
              avatar: logo,
              labels: ["Yes", "No"],
              onLabelClick: (e) => {
                handleLabelMsg(e, res);
              },
            });
          } else {
            addMessage({
              id: uuidv4(),
              content: `We were not able to identify the Label. Can you Select the label?`,
              avatar: logo,
              selectOptions: ["Launch", "Marketplace App", "CMS", "Automate"],
              onSelectOption: handleSelectInput,
            });
          }
        }
      } else {
        addMessage({
          id: uuidv4(),
          content: "Video Upload Failed. Try Again!",
          avatar: logo,
        });
      }
    }
    else if (input.trim()){
      addMessage({
        id: uuidv4(),
        content: input,
        isUser: true,
      });
      setInput("");
      setChatLoading(true);
      addMessage({
        id: uuidv4(),
        content: "We'll be implementing this feature soon!",
        avatar: logo,
      });
      setChatLoading(false);
    }
  };

  useEffect(() => {
    if (!ref.current) {
      addMessage({
        id: uuidv4(),
        content: "Hey there! Have a query? Facing an issue?",
        avatar: logo,
        labels: ["Yes, please", "No, thanks"],
        onLabelClick: handleInitMsg,
      });
    } else ref.current = true;
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  return (
    <div className="flex flex-col h-full w-full bg-white rounded-lg shadow-lg overflow-hidden">
      <Header title="ContentSpock" />
      <ChatHeader title="AI to solve all your queries and report issues" />
      <div className="flex-1 overflow-y-auto">
        {messages?.map((message) => (
          <ChatMessage
            key={message?.id}
            content={message?.content}
            isUser={message?.isUser ?? false}
            avatar={message?.avatar ?? ""}
            videoPreview={message?.videoPreview}
            labels={message?.labels ?? []}
            onLabelClick={message?.onLabelClick ?? (() => {})}
            selectOptions={message?.selectOptions ?? []}
            onSelectOption={message?.onSelectOption ?? (() => {})}
            isPreview={message?.isPreview ?? false}
          />
        ))}
        <div ref={messagesEndRef} />
        {chatLoading && <Loading />}
      </div>
      <ChatInput
        onSend={handleSubmit}
        onVideoAttach={onVideoAttach}
        removeVideo={removeVideo}
        videoPreview={
          videoAttached ? { thumbnailUrl: "", videoUrl: "" } : undefined
        }
        messages={messages}
        setMessages={setMessages}
        input={input}
        setInput={setInput}
      />
    </div>
  );
}
