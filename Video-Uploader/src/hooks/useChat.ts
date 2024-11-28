import { useState, useCallback, useRef } from "react";
import logo from "../assets/contentstack.png";

interface Message {
  id: string;
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
  onSelectOption?: (label: string) => void;
}

// addMessage({id: "", content:""})

export function useChat() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [chatLoading, setChatLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const handleSelectInput = (label) => onLabelClick(label, "select");

  const addMessage = useCallback((newMessage: Message) => {
    setMessages((prevMessages) => [...prevMessages, newMessage]);
  }, []);

  const onLabelClick = useCallback((label, category) => {
    if (category === "init") {
      addMessage({
        id: "2",
        content: label,
        isUser: true,
      });
      if (label?.toLowerCase()?.includes("yes")) {
        addMessage({
          id: "3",
          content: "Report us through Chat or Video Recording",
          avatar: logo,
        });
      } else {
        addMessage({
          id: "3",
          content: "Do reach out to us in case of any queries",
          avatar: logo,
        });
      }
    } else if (category === "label") {
      addMessage({
        id: "6",
        content: label,
        isUser: true,
      });
      if (label?.toLowerCase()?.includes("yes")) {
        addMessage({
          id: "7",
          content: "Please wait a moment!. we are processing the input",
          avatar: logo,
        });
      } else {
        addMessage({
          id: "7",
          content: "Please select a label from the following",
          avatar: logo,
          selectOptions: ["Launch", "Marketplace", "CMS", "Automate"],
          onSelectOption: handleSelectInput,
        });
      }
    } else if (category === "select") {
      addMessage({
        id: "8",
        content: label,
        isUser: true,
      });
      //   ------ make an api call and update the messages
      // --------------------------------------------------
      //   if (label?.toLowerCase()?.includes("yes")) {
      //     addMessage({
      //       id: "9",
      //       content: "Please wait a moment!. we are processing the input",
      //       avatar: logo,
      //     });
      //   } else {
      //     addMessage({
      //       id: "9",
      //       content: "Please select a label from the following",
      //       avatar: logo,
      //       selectOptions: ["Launch", "Marketplace", "CMS", "Automate"],
      //       onSelectOption: handleSelectInput,
      //     });
      //   }
    }
  }, []);

  const sendMessage = useCallback(
    async (content: string) => {
      // Add user message
      addMessage({
        id: Date.now().toString(),
        content,
        // type: "user"
      });

      try {
        // Make API call
        const response = await fetch("/api/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ message: content }),
        });

        if (!response.ok) throw new Error("Failed to send message");

        const data = await response.json();

        // Add bot response
        addMessage({
          id: Date.now().toString(),
          content: data.reply,
          //   type: "bot",
        });
      } catch (error) {
        console.error("Error sending message:", error);
        // Handle error (e.g., show an error message to the user)
      }
    },
    [addMessage]
  );

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  return {
    messages,
    sendMessage,
    messagesEndRef,
    scrollToBottom,
    addMessage,
    onLabelClick,
    chatLoading,
    setChatLoading,
  };
}
