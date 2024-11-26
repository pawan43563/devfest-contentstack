import { useState, useEffect } from "react";
import Markdown from "react-markdown";

const VideoUploader = () => {
  const [files, setFiles] = useState<any>([]);
  const [videoFeedback, setVideoFeedback] = useState("");
  const [audioFeedback, setAudioFeedback] = useState("");
  const [loading, setLoading] = useState(0);
  const [statusText, setStatusText] = useState("Processing...");
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [_, setThumbnail] = useState<string | null>(null);

  useEffect(() => {
    let statusInterval: NodeJS.Timeout;
    if (loading > 0 && loading < 100) {
      const statusMessages = [
        "Processing...",
        "Getting feedback from ChatGPT...",
        "Almost there...",
      ];
      let index = 0;

      statusInterval = setInterval(() => {
        setStatusText(statusMessages[index]);
        index = (index + 1) % statusMessages.length;
      }, 5000);
    } else {
      setStatusText("");
    }

    return () => clearInterval(statusInterval);
  }, [loading]);

  const generateThumbnail = (file: File) => {
    const url = URL.createObjectURL(file);
    setThumbnail(url);
  };

  const videoFeedbackCall = async (formData: any) => {
    try {
      setLoading(20);
      fetch("http://localhost:3000/feedback/visual", {
        method: "POST",
        body: formData,
      })
        .then((res) => {
          setLoading(70);
          return res.text();
        })
        .then((data) => {
          console.log(data);
          setLoading(100);
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
      setLoading(20);
      fetch("http://localhost:3000/feedback/audio", {
        method: "POST",
        body: formData,
      })
        .then((res) => {
          setLoading(70);
          return res.text();
        })
        .then((data) => {
          console.log(data);
          setLoading(100);
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

  const handleUpload = async () => {
    const formData = new FormData();
    for (const file of files) {
      formData.append("upload", file);
      generateThumbnail(file);
    }
    videoFeedbackCall(formData);
    audioFeedbackCall(formData);
    return;
  };

  return (
    <div
      className="video-uploader-wrapper"
      style={{
        backgroundColor: "#fff",
        color: "#000",
        padding: "20px",
        borderRadius: "10px",
      }}
    >
      <div
        className="video-uploader-inputs"
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "20px",
        }}
      >
        <h1
          style={{ fontSize: "2rem", fontWeight: "bold", marginBottom: "16px" }}
        >
          Upload Files
        </h1>
        <input
          type="file"
          style={{
            border: "2px solid #007bff",
            padding: "8px",
            borderRadius: "5px",
          }}
          multiple
          onChange={(e) => setFiles(e.target.files)}
          accept=".mov,.mp4"
        />
        <button
          style={{
            border: "2px solid #007bff",
            padding: "8px 16px",
            borderRadius: "5px",
            backgroundColor: "#007bff",
            color: "#fff",
            marginBottom: "20px",
          }}
          onClick={handleUpload}
        >
          Upload
        </button>
      </div>
      <div
        className="progress-wrapper"
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          marginTop: "20px",
          width: "50%",
          margin: "0 auto",
        }}
      >
        {loading > 0 && loading !== 100 && (
          <>
            <progress
              style={{ width: "100%", height: "20px" }}
              value={loading}
              max="100"
            ></progress>
            <span style={{ marginTop: "10px" }}>{statusText}</span>
          </>
        )}
      </div>
      {/* {thumbnail && (
        <div className="thumbnail-wrapper" style={{ display: "flex", justifyContent: "center", marginTop: "20px" }}>
          <img src={thumbnail} alt="Thumbnail" style={{ width: "50%", borderRadius: "10px" }} />
        </div>
      )} */}
      {audioFeedback && (
        <div
          className="video-uploader-output"
          style={{
            display: "flex",
            justifyContent: "center",
            marginTop: "20px",
          }}
        >
          <div
            className="response-area"
            style={{
              width: "50%",
              border: "1px solid #ccc",
              padding: "10px",
              borderRadius: "5px",
            }}
          >
            <h2
              style={{
                fontSize: "1.5rem",
                fontWeight: "bold",
                marginBottom: "10px",
              }}
            >
              Audio Feedback
            </h2>
            <Markdown>{audioFeedback}</Markdown>
          </div>
        </div>
      )}
      {videoFeedback && (
        <div
          className="video-uploader-output"
          style={{
            display: "flex",
            justifyContent: "center",
            marginTop: "20px",
          }}
        >
          <div
            className="response-area"
            style={{
              width: "50%",
              border: "1px solid #ccc",
              padding: "10px",
              borderRadius: "5px",
            }}
          >
            <h2
              style={{
                fontSize: "1.5rem",
                fontWeight: "bold",
                marginBottom: "10px",
              }}
            >
              Visual Feedback
            </h2>
            <Markdown>{videoFeedback}</Markdown>
          </div>
        </div>
      )}
    </div>
  );
};

export default VideoUploader;
