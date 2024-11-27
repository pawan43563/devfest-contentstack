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
    // <div
    //   className="video-uploader-wrapper"
    //   style={{
    //     backgroundColor: "#fff",
    //     color: "#000",
    //     padding: "20px",
    //     borderRadius: "10px",
    //   }}
    // >
    //   <div
    //     className="video-uploader-inputs"
    //     style={{
    //       display: "flex",
    //       flexDirection: "column",
    //       alignItems: "center",
    //       gap: "20px",
    //     }}
    //   >
    //     <input
    //       type="file"
    //       style={{
    //         border: "2px solid #007bff",
    //         padding: "8px",
    //         borderRadius: "5px",
    //       }}
    //       multiple
    //       onChange={(e) => setFiles(e.target.files)}
    //       accept=".mov,.mp4"
    //     />
    //     <button
    //       style={{
    //         border: "2px solid #007bff",
    //         padding: "8px 16px",
    //         borderRadius: "5px",
    //         backgroundColor: "#007bff",
    //         color: "#fff",
    //         marginBottom: "20px",
    //       }}
    //       onClick={handleUpload}
    //     >
    //       Upload
    //     </button>
    //   </div>
    //   {/* <div
    //     className="progress-wrapper"
    //     style={{
    //       display: "flex",
    //       flexDirection: "column",
    //       alignItems: "center",
    //       marginTop: "20px",
    //       width: "50%",
    //       margin: "0 auto",
    //     }}
    //   >
    //     {loading > 0 && loading !== 100 && (
    //       <>
    //         <progress
    //           style={{ width: "100%", height: "20px" }}
    //           value={loading}
    //           max="100"
    //         ></progress>
    //         <span style={{ marginTop: "10px" }}>{statusText}</span>
    //       </>
    //     )}
    //   </div> */}
    //   {/* {thumbnail && (
    //     <div className="thumbnail-wrapper" style={{ display: "flex", justifyContent: "center", marginTop: "20px" }}>
    //       <img src={thumbnail} alt="Thumbnail" style={{ width: "50%", borderRadius: "10px" }} />
    //     </div>
    //   )} */}
    //   {audioFeedback && (
    //     <div
    //       className="video-uploader-output"
    //       style={{
    //         display: "flex",
    //         justifyContent: "center",
    //         marginTop: "20px",
    //       }}
    //     >
    //       <div
    //         className="response-area"
    //         style={{
    //           width: "50%",
    //           border: "1px solid #ccc",
    //           padding: "10px",
    //           borderRadius: "5px",
    //         }}
    //       >
    //         <h2
    //           style={{
    //             fontSize: "1.5rem",
    //             fontWeight: "bold",
    //             marginBottom: "10px",
    //           }}
    //         >
    //           Audio Feedback
    //         </h2>
    //         <Markdown>{audioFeedback}</Markdown>
    //       </div>
    //     </div>
    //   )}
    //   {videoFeedback && (
    //     <div
    //       className="video-uploader-output"
    //       style={{
    //         display: "flex",
    //         justifyContent: "center",
    //         marginTop: "20px",
    //       }}
    //     >
    //       <div
    //         className="response-area"
    //         style={{
    //           width: "50%",
    //           border: "1px solid #ccc",
    //           padding: "10px",
    //           borderRadius: "5px",
    //         }}
    //       >
    //         <h2
    //           style={{
    //             fontSize: "1.5rem",
    //             fontWeight: "bold",
    //             marginBottom: "10px",
    //           }}
    //         >
    //           Visual Feedback
    //         </h2>
    //         <Markdown>{videoFeedback}</Markdown>
    //       </div>
    //     </div>
    //   )}
    // </div>

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
