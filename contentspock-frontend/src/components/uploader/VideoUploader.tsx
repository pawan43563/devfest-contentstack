import { useState, useEffect } from "react";
import Markdown from "react-markdown";

const VideoUploader = ({ handleUpload }: any) => {
  const [files, setFiles] = useState<any>([]);
  const [loading, setLoading] = useState(0);
  const [statusText, setStatusText] = useState("Processing...");
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [_, setThumbnail] = useState<string | null>(null);
  const [showDropdown, setShowDropdown] = useState(false);

  const toggleDropdown = () => {
    setShowDropdown(!showDropdown);
  };

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

  useEffect(() => {
    if (files.length > 0) {
      handleUpload(files);
      setShowDropdown(false);
    }
  }, [files]);

  const generateThumbnail = (file: File) => {
    const url = URL.createObjectURL(file);
    setThumbnail(url);
  };

  function handleRecordVideo(event: React.MouseEvent<HTMLButtonElement>): void {
    throw new Error("Function not implemented.");
  }

  return (
    <div
      style={{
        position: "relative",
        display: "inline-block",
        overflow: "visible",
      }}
    >
      <button
        onClick={toggleDropdown}
        style={{
          // backgroundColor: "#007bff",
          // color: "white",
          border: "none",
          borderRadius: "50%",
          width: "40px",
          height: "40px",
          fontSize: "22px",
          cursor: "pointer",
        }}
      >
        +
      </button>
      {showDropdown && (
        <div
          style={{
            position: "absolute",
            top: "-140px",
            left: "-20px",
            backgroundColor: "white",
            boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
            borderRadius: "8px",
            overflow: "hidden",
            zIndex: 1000,
          }}
        >
          <label
            style={{
              display: "block",
              padding: "10px 20px",
              width: "100%",
              textAlign: "left",
              backgroundColor: "white",
              border: "none",
              cursor: "pointer",
            }}
          >
            Upload Video
            <input
              type="file"
              style={{ display: "none" }}
              onChange={(e) => setFiles(e.target.files)}
              accept=".mov,.mp4"
            />
          </label>
          <button
            onClick={handleRecordVideo}
            style={{
              display: "block",
              padding: "10px 20px",
              width: "100%",
              textAlign: "left",
              backgroundColor: "white",
              border: "none",
              cursor: "pointer",
            }}
          >
            Record Video
          </button>
        </div>
      )}
    </div>
  );
};

export default VideoUploader;
