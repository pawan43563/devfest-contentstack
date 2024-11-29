import React, { useEffect, useState } from "react";
import VideoUploader from "../uploader/VideoUploader";
import config from "../../../public/config.json";
import "./styles.css";

const labelOptions = ["Marketplace App", "Launch", "Automate"];

function ChatArea() {
  const [videoFeedback, setVideoFeedback] = useState("");
  const [audioFeedback, setAudioFeedback] = useState("");
  const [formData, setFormData] = useState(new FormData());
  const [Label, setLabel] = useState<Array<any>>([]);
  const [labelBoolean, setLabelBoolean] = useState<boolean>(false);
  const [labelCorrect, setLabelCorrect] = useState<boolean>(false);
  const [videoPreview, setVideoPreview] = useState("");

  const videoFeedbackCall = async (formData: any) => {
    try {
      //   setLoading(20);
      fetch(`${config.BACKEND_API_URL}/feedback/visual?userId=user123`, {
        method: "POST",
        body: formData,
      })
        .then((res) => {
          //   setLoading(70);
          return res.text();
        })
        .then((data) => {
          console.log(data);
          //   setLoading(100);
          setVideoFeedback(data as string);
          console.log("Response data:", data);
        })
        .catch((err) => {
          console.log("Error:", err);
        });
    } catch (error) {
      console.log("Error posting video:", error);
    }
  };

  const audioFeedbackCall = async (formData: any) => {
    try {
      //   setLoading(20);
      fetch(`${config.BACKEND_API_URL}/feedback/audio?userId=user123`, {
        method: "POST",
        body: formData,
      })
        .then((res) => {
          //   setLoading(70);
          return res.text();
        })
        .then((data) => {
          console.log(data);
          //   setLoading(100);
          setAudioFeedback(data as string);
          console.log("Response data:", data);
          setLabelBoolean(true);
        })
        .catch((err) => {
          console.log("Error:", err);
        });
    } catch (error) {
      console.log("Error posting audio:", error);
    }
  };

  const handleUpload = async (files: any) => {
    const formDataTemp = new FormData();
    for (const file of files) {
      formDataTemp.append("upload", file);
      const videoURL = URL.createObjectURL(file);
      setVideoPreview(videoURL);
    }
    setFormData(formDataTemp);
    return;
  };

  useEffect(() => {
    console.log(videoFeedback, audioFeedback);
    const regex = /(?<=Label:\s).*/;
    const audioLabel: any = audioFeedback?.match(regex);
    const videoLabel: any = videoFeedback?.match(regex);

    if (labelOptions?.includes(audioLabel?.[0])) {
      setLabel(audioLabel?.[0]);
    } else if (labelOptions?.includes(videoLabel?.[0])) {
      setLabel(videoLabel?.[0]);
    }
  }, [videoFeedback, audioFeedback]);

  function sendVideoAndAudio(): void {
    if (formData) {
      videoFeedbackCall(formData);
      audioFeedbackCall(formData);
    }
  }

  const jiraTicketData = {
    id: "PROJ-123",
    title: "Implement new user authentication flow",
    description:
      "We need to update our user authentication process to improve security and user experience. This includes adding two-factor authentication and social login options.",
    status: "In Progress",
    priority: "High",
    assignee: {
      name: "Jane Doe",
      avatar: "/placeholder.svg?height=32&width=32",
    },
    reportee: "John Smith",
    company: "Acme Corp",
    impactScope: "Multiple Users",
    occurrenceType: "Every Time",
    startDate: "2023-06-15",
    businessImpact:
      "This issue is causing a 15% decrease in successful logins, potentially leading to lost revenue and decreased user satisfaction. Estimated impact is $10,000 per day.",
  };

  // Function to generate the Jira ticket preview HTML
  function generateJiraTicketPreviewHTML(ticket) {
    return `
      <div style="position: fixed; inset: 0; background-color: rgba(0, 0, 0, 0.5); display: flex; align-items: center; justify-content: center; padding: 1rem; overflow-y: auto;">
        <div style="background-color: white; border-radius: 0.5rem; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); width: 100%; max-width: 48rem;">
          <div style="display: flex; justify-content: space-between; align-items: center; padding: 1rem 1.5rem; border-bottom: 1px solid #e5e7eb;">
            <h2 style="font-size: 1.5rem; font-weight: bold; margin: 0;">Jira Ticket: ${ticket.id}</h2>
            <button style="background: none; border: none; cursor: pointer; font-size: 1.5rem;" id="closeOverlay" aria-label="Close preview">&times;</button>
          </div>
          <div style="padding: 1.5rem;">
            <div style="margin-bottom: 1rem;">
              <h3 style="font-size: 1.25rem; font-weight: 600; margin: 0 0 0.5rem 0;">${ticket.title}</h3>
              <p style="font-size: 0.875rem; color: #6b7280; margin: 0;">${ticket.description}</p>
            </div>
            <div style="display: flex; flex-wrap: wrap; gap: 0.5rem; margin-bottom: 1rem;">
              <span style="background-color: #e5e7eb; color: #374151; font-size: 0.75rem; font-weight: 600; padding: 0.25rem 0.5rem; border-radius: 9999px;">${ticket.status}</span>
              <div style="display: flex; align-items: center;">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#eab308" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <circle cx="12" cy="12" r="10"></circle>
                  <line x1="12" y1="8" x2="12" y2="12"></line>
                  <line x1="12" y1="16" x2="12.01" y2="16"></line>
                </svg>
                <span style="font-size: 0.875rem; font-weight: 500; margin-left: 0.5rem;">${ticket.priority} Priority</span>
              </div>
            </div>
            <hr style="border: 0; border-top: 1px solid #e5e7eb; margin: 1rem 0;">
            <div style="display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 1rem;">
              <div style="display: flex; align-items: center;">
                <img src="${ticket.assignee.avatar}" alt="${ticket.assignee.name}" style="width: 2rem; height: 2rem; border-radius: 9999px; margin-right: 0.5rem;">
                <div>
                  <div style="font-size: 0.875rem; font-weight: 500;">Assignee</div>
                  <div style="font-size: 0.875rem; color: #6b7280;">${ticket.assignee.name}</div>
                </div>
              </div>
              <div style="display: flex; align-items: center;">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#6b7280" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="margin-right: 0.5rem;">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                  <circle cx="12" cy="7" r="4"></circle>
                </svg>
                <div>
                  <div style="font-size: 0.875rem; font-weight: 500;">Reportee</div>
                  <div style="font-size: 0.875rem; color: #6b7280;">${ticket.reportee}</div>
                </div>
              </div>
              <div style="display: flex; align-items: center;">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#6b7280" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="margin-right: 0.5rem;">
                  <rect x="2" y="2" width="20" height="20" rx="2" ry="2"></rect>
                  <path d="M7 12h10"></path>
                  <path d="M12 7v10"></path>
                </svg>
                <div>
                  <div style="font-size: 0.875rem; font-weight: 500;">Company</div>
                  <div style="font-size: 0.875rem; color: #6b7280;">${ticket.company}</div>
                </div>
              </div>
              <div style="display: flex; align-items: center;">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#6b7280" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="margin-right: 0.5rem;">
                  <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                  <circle cx="9" cy="7" r="4"></circle>
                  <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                  <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                </svg>
                <div>
                  <div style="font-size: 0.875rem; font-weight: 500;">Impact Scope</div>
                  <div style="font-size: 0.875rem; color: #6b7280;">${ticket.impactScope}</div>
                </div>
              </div>
              <div style="display: flex; align-items: center;">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#6b7280" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="margin-right: 0.5rem;">
                  <circle cx="12" cy="12" r="10"></circle>
                  <polyline points="12 6 12 12 16 14"></polyline>
                </svg>
                <div>
                  <div style="font-size: 0.875rem; font-weight: 500;">Occurrence</div>
                  <div style="font-size: 0.875rem; color: #6b7280;">${ticket.occurrenceType}</div>
                </div>
              </div>
              <div style="display: flex; align-items: center;">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#6b7280" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="margin-right: 0.5rem;">
                  <circle cx="12" cy="12" r="10"></circle>
                  <polyline points="12 6 12 12 16 14"></polyline>
                </svg>
                <div>
                  <div style="font-size: 0.875rem; font-weight: 500;">Start Date</div>
                  <div style="font-size: 0.875rem; color: #6b7280;">${ticket.startDate}</div>
                </div>
              </div>
            </div>
            <hr style="border: 0; border-top: 1px solid #e5e7eb; margin: 1rem 0;">
            <div>
              <div style="display: flex; align-items: center; margin-bottom: 0.5rem;">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#6b7280" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="margin-right: 0.5rem;">
                  <line x1="12" y1="1" x2="12" y2="23"></line>
                  <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
                </svg>
                <div style="font-size: 0.875rem; font-weight: 500;">Business Impact</div>
              </div>
              <p style="font-size: 0.875rem; color: #6b7280; margin: 0;">${ticket.businessImpact}</p>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  const handleOpenOverlay = () => {
    const overlayContent = generateJiraTicketPreviewHTML(jiraTicketData);
    // Send a message to the background overlay script
    chrome.runtime.sendMessage({
      action: "showOverlay",
      content: overlayContent,
    });
  };

  const handleLabelChange = (event: any) => {
    setLabel(event.target.value);
  };
  const [messages, setMessages] = useState([
    { text: "What is Contentstack?", type: "user" },
    {
      text: "Contentstack is a modern headless content management system that allows you to manage your content in a flexible and scalable way.",
      type: "bot",
    },
  ]);

  return (
    <>
      <div className="container">
        <div className="help-center">
          <div className="header">
            <div className="header-icon">
              <img src="./images/contentstack.png" />
            </div>
            <h1>ContentSpock</h1>
          </div>
          <div className="chat-area">
            <div className="messages">
              {messages.map((message, index) => (
                <div
                  key={index}
                  className={`message ${
                    message.type === "user" ? "user-message" : "bot-message"
                  }`}
                >
                  {message.text}
                </div>
              ))}
              {videoPreview && (
                <div className="video-preview">
                  <video src={videoPreview} controls />
                </div>
              )}
            </div>
          </div>
          <div className="label__container">
            {labelBoolean && (
              <div className="message user-message">
                <p>Is the fetched label correct?</p>
                <button onClick={() => setLabelCorrect(true)}>Yes</button>
                <button onClick={() => setLabelCorrect(false)}>No</button>
                {!labelCorrect && (
                  <select onChange={handleLabelChange}>
                    <option value="">Select a label</option>
                    {labelOptions.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                )}
              </div>
            )}
          </div>
          <div className="ticket-preview">
            <button className="jira-preview-button" onClick={handleOpenOverlay}>
              Preview Ticket
            </button>
          </div>
          <div className="report-issue">
            <div className="report-issue-left">
              <p style={{ fontSize: "14px" }}>Observed an Issue?</p>
            </div>
            <button id="reportIssueBtn" className="report-button">
              Report Issue
            </button>
          </div>
          <div className="input-area">
            <div className="text-input">
              <input type="text" id="userInput" placeholder="Ask a question" />
              <VideoUploader handleUpload={handleUpload} />
              <button
                id="sendButton"
                className="send-button"
                onClick={sendVideoAndAudio}
              >
                &#10148;
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default ChatArea;
