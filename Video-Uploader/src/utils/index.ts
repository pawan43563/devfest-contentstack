const parseToJSON = (text) => {
  const lines = text.trim().split("\n");
  const json = {};
  let currentKey: any = null;

  for (const line of lines) {
    const trimmedLine = line.trim();

    // Check for a new key (formatted as **Key:**)
    if (trimmedLine.startsWith("**") && trimmedLine.includes(":**")) {
      const key = trimmedLine.split(":**")[0].replace(/\*\*/g, "").trim(); // Remove ** and extract the key
      json[key] = ""; // Initialize the key with an empty string
      currentKey = key; // Set as the current key
    } else if (currentKey) {
      // Append to the current key's value
      json[currentKey] += ` ${trimmedLine}`; // Add line content to the value
    }
  }

  // Trim any extra whitespace in values
  Object.keys(json).forEach((key) => {
    json[key] = json[key].trim();
  });

  return json;
};

const utils = {
  parseToJSON,
};

export default utils;
