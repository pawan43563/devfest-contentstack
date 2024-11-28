import { useState, useCallback, useRef, useEffect } from "react";
import logo from "../assets/contentstack.png";
import { v4 as uuidv4 } from 'uuid';
import services from "../services";

interface Message {
  id: string;
  content: string;
  isUser?: boolean;
  avatar?: string;
  videoPreview?: {
    thumbnailUrl?: string;Message
    videoUrl: string;
  };
  labels?: string[];
  onLabelClick?: (label: string) => void;
  selectOptions?: string[];
  onSelectOption?: (label: string) => void;
  isPreview?: boolean;
}

export function useChat() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [chatLoading, setChatLoading] = useState(false);
  const [previewData, setPreviewData] = useState<any>({});
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const loadingDelay = () => {
    setChatLoading(true);
    setTimeout(() => {}, 500);
    setChatLoading(false);
  };

  const handleTicketLabel = (label) => onLabelClick(label, "ticket");

  const handleNoLabelData = () => {
    loadingDelay();
    addMessage({
      id: uuidv4(),
      content: "Unfortunately, we could not find any matching results",
      avatar: logo,
    });
    loadingDelay();
    addMessage({
      id: uuidv4(),
      content: "We would like to help you resolve the resolve",
      avatar: logo,
    });
    loadingDelay();
    addMessage({
      id: uuidv4(),
      content: "Would you like to report the Issue?",
      avatar: logo,
      labels: ["Yes", "No"],
      onLabelClick: handleTicketLabel,
    });
  };

  const handleSelectInput = async (label) => {
    // make a call and add Message
    onLabelClick(label, "select");
    addMessage({
      id: uuidv4(),
      content: "Please wait a moment!. we are processing the input",
      avatar: logo,
    });
    // call to get resolution
    setChatLoading(true);
    const response: any = await services.getResolutionCall(label);
    setChatLoading(false);
    if (response?.status === 400) {
      handleNoLabelData();
    } else {
      addMessage({
        id: uuidv4(),
        content: response,
        avatar: logo,
      });
      addMessage({
        id: uuidv4(),
        content: "Does this resolve your Question?",
        labels: ["Yes", "No"],
        avatar: logo,
        onLabelClick: handleResolveIssue,
      });
    }
  };

  const addMessage = useCallback((newMessage: Message) => {
    setMessages((prevMessages) => [...prevMessages, newMessage]);
  }, []);

  const handleImpactLabel = (label) => {
    onLabelClick(label, "impact");
    setPreviewData((prevData) => ({ ...prevData, Impact: label }));
  };

  const handlePriorityLabel = (label) => {
    onLabelClick(label, "priority");
    setPreviewData((prevData) => ({ ...prevData, Priority: label }));
  };

  const handleResolveIssue = (label) => {
    if (label.toLowerCase() === "yes") {
      addMessage({
        id: uuidv4(),
        content: label,
        isUser: true,
      });
      addMessage({
        id: uuidv4(),
        content: "Hurray!! We're glad that we were able to solve your Query.",
        avatar: logo,
      });
    } else {
      addMessage({
        id: uuidv4(),
        content: label,
        isUser: true,
      });
      // here handle that 
      addMessage({
        id: uuidv4(),
        content: "Would you like to report the Issue?",
        avatar: logo,
        labels: ["Yes", "No"],
        onLabelClick: handleTicketLabel,
      });
    }
  }

  const onLabelClick = useCallback(async (label, category, cat?) => {
    if (category === "init") {
      addMessage({
        id: uuidv4(),
        content: label,
        isUser: true,
      });
      if (label?.toLowerCase()?.includes("yes")) {
        addMessage({
          id: uuidv4(),
          content: "Report us through Chat or Video Recording",
          avatar: logo,
        });
      } else {
        addMessage({
          id: uuidv4(),
          content: "Do reach out to us in case of any queries",
          avatar: logo,
        });
      }
    } else if (category === "label") {
      addMessage({
        id: uuidv4(),
        content: label,
        isUser: true,
      });
      if (label?.toLowerCase()?.includes("yes")) {
        addMessage({
          id: uuidv4(),
          content: "Please wait a moment!. we are processing the input",
          avatar: logo,
        });
        setChatLoading(true);
        // call to get resolution
        const response: any = await services.getResolutionCall(cat);
        console.info("Response", response);
        setChatLoading(false);
        if (response?.status === 400) {
          handleNoLabelData();
        } else {
          addMessage({
            id: uuidv4(),
            content: response,
            avatar: logo,
          });
          addMessage({
            id: uuidv4(),
            content: "Does this resolve your Question?",
            labels: ["Yes", "No"],
            avatar: logo,
            onLabelClick: handleResolveIssue,
          });
        }
      } else {
        addMessage({
          id: uuidv4(),
          content: "Please select a label from the following",
          avatar: logo,
          selectOptions: ["Launch", "Marketplace App", "CMS", "Automate"],
          onSelectOption: handleSelectInput,
        });
      }
    } else if (category === "select") {
      addMessage({
        id: uuidv4(),
        content: label,
        isUser: true,
      });
    } else if (category === "ticket") {
      addMessage({
        id: uuidv4(),
        content: label,
        isUser: true,
      });
      if (label?.toLowerCase() === "yes") {
        loadingDelay();
        addMessage({
          id: uuidv4(),
          content:
            "For reporting this issue, we would like to know some additional details",
          avatar: logo,
        });
        loadingDelay();
        addMessage({
          id: uuidv4(),
          content:
            "Please select the level of impact the issue is having on your customers",
          avatar: logo,
          labels: ["High", "Normal", "Low"],
          onLabelClick: handleImpactLabel,
        });
      } else {
        addMessage({
          id: uuidv4(),
          content: "No worries!!. Do reach out to us in case of any queries",
          avatar: logo,
        });
      }
    } else if (category === "impact") {
      addMessage({
        id: uuidv4(),
        content: label,
        isUser: true,
      });
      addMessage({
        id: uuidv4(),
        content: "What priority would you like to assign to this issue?",
        avatar: logo,
        labels: ["P1", "P2", "P3"],
        onLabelClick: handlePriorityLabel,
      });
    } else if (category === "priority") {
      addMessage({
        id: uuidv4(),
        content: label,
        isUser: true,
      });
      loadingDelay();
      addMessage({
        id: uuidv4(),
        content:
          "Thank you for providing the details. Please wait while we process the issue.",
        avatar: logo,
      });
      setChatLoading(true);
      // --------------- make API call to /feedback/chaat to get details and add to previewData state
      if (true) {
        setChatLoading(false);
        // addMessage({
        //   id: "30",

        // })
      }
    }
  }, []);

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  return {
    messages,
    messagesEndRef,
    scrollToBottom,
    addMessage,
    onLabelClick,
    chatLoading,
    setChatLoading,
    handleSelectInput,
    setMessages,
  };
}
