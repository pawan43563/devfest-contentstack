import utils from "../utils";

const videoFeedbackCall = async (formData: any) =>
  fetch("http://localhost:3000/feedback/visual?userId=user123", {
    method: "POST",
    body: formData,
  })
    .then((res) => {
      return res.text();
    })
    .then((data) => {
      //   setVideoFeedback(data as string);
      const labelRegex = /Label:\s*(.+)/;
      const match = data.match(labelRegex);
      console.log("match", match);
      return {
        success: true,
        value: match?.[0] ?? "undefined",
      };
    })
    .catch((err) => {
      console.log("Error:", err);
      return false;
    });

const audioFeedbackCall = async (formData: any) =>
  fetch("http://localhost:3000/feedback/audio?userId=user123", {
    method: "POST",
    body: formData,
  })
    .then((res) => {
      return res.text();
    })
    .then((data) => {
      //   setAudioFeedback(data as string);
      //   setLabelBoolean(true);
      console.log("Response data:", data);
      const labelRegex = /Label:\s*(.+)/;
      const match = data.match(labelRegex);
      console.log("match", match);
      return {
        success: true,
        value: match?.[0] ?? "undefined",
      };
    })
    .catch((err) => {
      console.log("Error:", err);
      return {
        success: false,
      };
    });

const handleVideoUpload = async (formData) => {
  try {
    const videoRes: any = await videoFeedbackCall(formData);
    const audioRes: any = await audioFeedbackCall(formData);
    if (audioRes?.success && videoRes) {
      const labelOptions = ["Launch", "Marketplace", "CMS", "Automate"]
      let foundLabel;
      console.log("foundLabel", audioRes, videoRes);
      if (videoRes?.value !== "undefined") {
        foundLabel = labelOptions.find(label => videoRes?.value?.toLowerCase().includes(label?.toLowerCase()));
      } else if (audioRes?.value !== "undefined") {
        foundLabel = labelOptions.find(label => audioRes?.value?.toLowerCase().includes(label?.toLowerCase()));
      }
      console.log("foundLabel", foundLabel);
      if (foundLabel) return foundLabel ?? "success";
    } else {
      return "fail";
    }
  } catch (error) {
    console.log("Error posting audio:", error);
  }
};

const services = {
  handleVideoUpload,
};

export default services;
