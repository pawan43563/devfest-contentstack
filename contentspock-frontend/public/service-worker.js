const CONTENTSTACK_ORIGINS = [
  "https://app.contentstack.com",
  "https://eu-app.contentstack.com",
  "https://azure-na-app.contentstack.com",
  "https://azure-eu-app.contentstack.com",
  "https://gcp-na-app.contentstack.com",
  "https://gcp-eu-app.contentstack.com",
];

// Allows users to open the side panel by clicking on the action toolbar icon
chrome.sidePanel
  .setPanelBehavior({ openPanelOnActionClick: true })
  .catch((error) => console.error(error));

chrome.tabs.onUpdated.addListener(async (tabId, info, tab) => {
  if (!tab.url) return;
  const url = new URL(tab.url);
  if (CONTENTSTACK_ORIGINS.includes(url.origin)) {
    await chrome.sidePanel.setOptions({
      tabId,
      path: "index.html",
      enabled: true,
    });
  } else {
    // Disables the side panel on all other sites
    await chrome.sidePanel.setOptions({
      tabId,
      enabled: false,
    });
  }
});

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === "showOverlay") {
    // Query the active tab
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (tabs.length > 0) {
        chrome.scripting.executeScript({
          target: { tabId: tabs[0].id },
          func: injectOverlay,
          args: [message.content],
        });
      }
    });
  }
});

function injectOverlay(content) {
  if (!document.getElementById("custom-overlay")) {
    const overlay = document.createElement("div");
    overlay.id = "custom-overlay";
    overlay.style.position = "fixed";
    overlay.style.top = "0";
    overlay.style.left = "0";
    overlay.style.width = "100%";
    overlay.style.height = "100%";
    overlay.style.backgroundColor = "rgba(0, 0, 0, 0.8)";
    overlay.style.zIndex = "9999";
    overlay.style.display = "flex";
    overlay.style.justifyContent = "center";
    overlay.style.alignItems = "center";
    overlay.innerHTML = `${content}`;

    document.body.appendChild(overlay);

    document.getElementById("closeOverlay").addEventListener("click", () => {
      document.body.removeChild(overlay);
    });
  }
}
