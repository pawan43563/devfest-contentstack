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
      const labelOptions = ["Launch", "Marketplace App", "CMS", "Automate"];

      let foundLabel;
      if (videoRes?.value !== "undefined") {
        foundLabel = labelOptions.find((label) =>
          videoRes?.value?.toLowerCase().includes(label?.toLowerCase())
        );
      } else if (audioRes?.value !== "undefined") {
        foundLabel = labelOptions.find((label) =>
          audioRes?.value?.toLowerCase().includes(label?.toLowerCase())
        );
      }
      if (foundLabel) return foundLabel ?? "success";
    } else {
      return "fail";
    }
  } catch (error) {
    console.log("Error posting audio:", error);
  }
};

const resolutionChecker = (data) => {
  try {
    const ignoreWords = [
      "unfortunately",
      "does not match",
      "apologize",
      "sorry",
      "I'm sorry",
      "I apologize",
      "There isn't specific troubleshooting",
      "analysis is missing"
    ];
    if (
      ignoreWords?.find(
        (word) =>
          data?.includes(word.toLocaleLowerCase()) || data?.includes(word)
      )
    ) {
      return {
        status: 400,
      };
    }
    return data;
  } catch (error) {
    console.info("Error inside resolutionChecker", error);
    return {
      status: 400,
    };
  }
};

const getResolutionCall = async (label: any) =>
  fetch("http://localhost:3000/feedback/chat?userId=user123", {
    method: "POST",
    body: JSON.stringify({
      issueLabel: label,
    }),
  })
    .then((res) => {
      return res.text();
    })
    .then((data) => {
      console.log("Response data:", data);
      return resolutionChecker(data);
    })
    .catch((err) => {
      console.log("Error:", err);
      return {
        success: false,
      };
    });

const getTicketSummary = async (userId) => {
  return fetch(`http://localhost:3000/jira/get-ticket-summary?userId=${userId}`, {
    method: "GET",
  })
    .then((res) => {
      return res.json();
    })
    .then((data) => {
      return data;
    })
    .catch((err) => {
      console.log("Error:", err);
      return {
        success: false,
      };
    });
};

const createTicket = async (ticketDetails, userId) => {
  return fetch(`http://localhost:3000/jira/create-ticket?userId=${userId}`, {
    method: "POST",
    body: JSON.stringify(ticketDetails),
  })
    .then((res) => {
      return res.json();
    })
    .then((data) => {
      return data;
    })
    .catch((err) => {
      console.log("Error:", err);
      return {
        success: false,
      };
    });
};

const services = {
  handleVideoUpload,
  getResolutionCall,
  getTicketSummary,
  createTicket,
};

export default services;
