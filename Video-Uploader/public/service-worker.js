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
  