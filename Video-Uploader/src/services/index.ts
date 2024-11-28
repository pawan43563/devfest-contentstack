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
      console.log("Response data:", data);
      return true;
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
      return {
        success: true,
        value: match?.[0] ?? "Undefined",
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
      if (audioRes?.value?.Label) return audioRes?.value?.Label ?? "success";
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
