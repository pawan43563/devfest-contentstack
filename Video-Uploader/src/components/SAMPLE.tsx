import React from "react";
import { Header } from "./header";
import { ChatHeader } from "./chat-header";
import ChatMessage from "./chat-message";
import { ChatInput } from "./chat-input";
import { Loading } from "./loading";
import logo from "../assets/contentstack.png";
import { PreviewTicket } from "./preview-ticket";

export default function ContentSpock() {
  return (
    <div className="flex flex-col h-full w-full bg-white rounded-lg shadow-lg overflow-hidden">
      <Header title="ContentSpock" />
      <ChatHeader title="AI to solve all your queries and report issues" />
      <div className="flex-1 overflow-y-auto">
        <ChatMessage
          content="Hey there! Have a query? Facing an issue?"
          avatar={logo}
          labels={["Yes, please", "No, thanks"]}
          onLabelClick={() => {}}
          isUser={true}
        />
        <ChatMessage
          content="Report us through Chat or Video Recording"
          avatar={logo}
        />
        <ChatMessage
          content="Here's a video tutorial on content migration in Contentstack."
          isUser={true}
          videoPreview={{
            thumbnailUrl: "/placeholder.svg?height=180&width=320",
            videoUrl: "#",
          }}
        />
        <ChatMessage
          content="To migrate content between stacks in Contentstack, you need to use the contentstack-export and contentstack-import tools. First, export the content from the source stack using the contentstack-export utility, which saves the data in JSON format. Would you like me to explain the process step by step?"
          avatar={logo}
          labels={["Yes, please", "No, thanks"]}
          onLabelClick={() => {}}
        />
        <Loading />
        <PreviewTicket
          title="Here's a quick preview of Jira Ticket Content"
          content="Click on the component to View Details"
          onClick={() => {}}
        />
        <ChatMessage
          content="Hey there! Have a query? Facing an issue?"
          isUser
          selectOptions={["Launch", "Marketplace", "CMS", "Automate"]}
          onSelectOption={() => {}}
        />
      </div>
      <ChatInput
        videoPreview={{
          thumbnailUrl: "/placeholder.svg?height=90&width=160",
          videoUrl: "#",
        }}
      />
      <ChatInput />
    </div>
  );
}
