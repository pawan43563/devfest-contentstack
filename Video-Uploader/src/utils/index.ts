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

function extractDetails(input) {
  const cleanedInput = input.replace(/[^a-zA-Z0-9:.\s\n]/g, '');

  const fields: any = {};

  // Step 2: Extract Title
  const titleMatch = cleanedInput.match(/Title:\s*(.+)/);
  if (titleMatch) fields.title = titleMatch[1].trim();

  // Step 3: Extract Summary
  const summaryMatch = cleanedInput.match(/Summary:\s*(.+)/);
  if (summaryMatch) fields.summary = summaryMatch[1].trim();

  // Step 4: Extract Description
  const descriptionMatch = cleanedInput.match(/Description:\s*([\s\S]*?)(?=\nLabel:|\n?$)/);
  if (descriptionMatch) fields.description = descriptionMatch[1].trim();

  // Step 5: Extract Label
  const labelMatch = cleanedInput.match(/Label:\s*(.+)/);
  if (labelMatch) fields.label = labelMatch[1].trim();

  return fields;
}

const utils = {
  parseToJSON,
  extractDetails
};

export default utils;
