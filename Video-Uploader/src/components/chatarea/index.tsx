import React, { useEffect, useState } from "react";
import VideoUploader from "../uploader/VideoUploader";
import "./styles.css"

function ChatArea() {
  const [videoFeedback, setVideoFeedback] = useState("");
  const [audioFeedback, setAudioFeedback] = useState("");
  const [formData, setFormData] = useState(new FormData());

  const videoFeedbackCall = async (formData: any) => {
    try {
      //   setLoading(20);
      fetch("http://localhost:3000/feedback/visual", {
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
      fetch("http://localhost:3000/feedback/audio", {
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
    }
    setFormData(formDataTemp);
    return;
  };

  useEffect(() => {
    console.log(videoFeedback, audioFeedback);
  }, [videoFeedback, audioFeedback]);


    function sendVideoAndAudio(): void {
        if(formData){
            videoFeedbackCall(formData);
            audioFeedbackCall(formData);
        }
    }

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
            <div className="message user-message">
              <p>What is Contentstack?</p>
            </div>
            <div className="message bot-message">
              <div className="bot-avatar">
                {/* <!-- <img src="./images/contentstack.png" /> --> */}
              </div>
              <p>
                Contentstack is a modern headless content management system
                (CMS) designed to help organizations create, manage, and deliver
                digital content across various channels and devices. Unlike
                traditional CMS platforms that couple content management with a
                front-end interface, Contentstack separates the content
                (back-end) from the presentation layer (front-end). This allows
                developers and content creators to work independently and gives
                greater flexibility for delivering content to websites, mobile
                apps, IoT devices, and more.
              </p>
            </div>
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
          <input type="text" id="userInput" placeholder="Ask a question" />
          <VideoUploader handleUpload={handleUpload} />

            <button id="sendButton" className="send-button" onClick={sendVideoAndAudio}>
              &#10148;
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

export default ChatArea;
