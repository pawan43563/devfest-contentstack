import { useState, useCallback, useRef, useEffect } from "react";
import logo from "../assets/contentstack.png";
import services from "../services";

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

  const handleSelectInput = async (label) => {
    // make a call and add Message
    onLabelClick(label, "select");
    addMessage({
      id: "7",
      content: "Please wait a moment!. we are processing the input",
      avatar: logo,
    });
    // call to get resolution
    const response = await services.getResolutionCall(label);
    console.info("Response", response);
    if (response?.status === 400) {
      // ADD HERE CREATE TICKET
      addMessage({
        id: "8",
        content: "Would you like to create a ticket?",
        avatar: logo,
      });
    } else {
      addMessage({
        id: "8",
        content: response,
        avatar: logo,
      });
    }
  };

  const addMessage = useCallback((newMessage: Message) => {
    setMessages((prevMessages) => [...prevMessages, newMessage]);
  }, []);

  const handleTicketLabel = (label) => onLabelClick(label, "ticket");

  const handleImpactLabel = (label) => onLabelClick(label, "impact");

  const handlePriorityLabel = (label) => onLabelClick(label, "priority");

  const onLabelClick = useCallback(async (label, category, cat?) => {
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
        console.log("labelCategory", cat);
        setChatLoading(true);
        // call to get resolution
        const response = await services.getResolutionCall(cat);
        console.info("Response", response);
        setChatLoading(false);
        if (response?.status === 400) {
          addMessage({
            id: "8",
            content: "Unfortunately, we could not find any matching results",
            avatar: logo,
          });
          addMessage({
            id: "9",
            content: "We would like to help you resolve the resolve",
            avatar: logo,
          });
          addMessage({
            id: "10",
            content: "Would you like to report the Issue?",
            avatar: logo,
            labels: ["Yes", "No"],
            onLabelClick: handleTicketLabel,
          });
        } else {
          addMessage({
            id: "8",
            content: response,
            avatar: logo,
          });
        }
      } else {
        addMessage({
          id: "7",
          content: "Please select a label from the following",
          avatar: logo,
          selectOptions: ["Launch", "Marketplace App", "CMS", "Automate"],
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
    } else if (category === "ticket") {
      addMessage({
        id: "20",
        content: label,
        isUser: true,
      });
      if (label?.toLowerCase() === "yes") {
        addMessage({
          id: "21",
          content:
            "For reporting this issue, we would like to know some additional details",
          avatar: logo,
        });
        addMessage({
          id: "22",
          content:
            "Please select the level of impact the issue is having on your customers",
          avatar: logo,
          labels: ["High", "Normal", "Low"],
          onLabelClick: handleImpactLabel,
        });
      } else {
        addMessage({
          id: "21",
          content: "No worries!!. Do reach out to us in case of any queries",
          avatar: logo,
        });
      }
    } else if (category === "impact") {
      addMessage({
        id: "23",
        content: label,
        isUser: true,
      });
      addMessage({
        id: "24",
        content: "What priority would you like to assign to this issue?",
        avatar: logo,
        labels: ["P1", "P2", "P3"],
        onLabelClick: handlePriorityLabel,
      });
    } else if (category === "priority") {
      addMessage({
        id: "25",
        content: label,
        isUser: true,
      });
      addMessage({
        id: "26",
        content:
          "Thank you for providing the details. Please wait while we process the issue.",
        avatar: logo,
        labels: ["P1", "P2", "P3"],
        onLabelClick: handlePriorityLabel,
      });
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
