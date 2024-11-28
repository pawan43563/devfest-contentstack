function generateJiraTicketPreviewHTML({
  Impact,
  Priority,
  time,
  title,
  summary,
  label,
}) {
  return `
    <div style="position: fixed; inset: 0; background-color: rgba(0, 0, 0, 0.5); display: flex; align-items: center; justify-content: center; padding: 1rem; overflow-y: auto; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;">
  <div style="background-color: white; border-radius: 0.5rem; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); width: 100%; max-width: 48rem;">
    <div style="display: flex; justify-content: space-between; align-items: center; padding: 1rem 1.5rem; border-bottom: 1px solid #e5e7eb;">
      <h2 style="font-size: 1.5rem; font-weight: bold; margin: 0;">Jira Ticket</h2>
      <button style="background: none; border: none; cursor: pointer; font-size: 1.5rem;" id="closeOverlay" aria-label="Close preview">&times;</button>
    </div>
    <div style="padding: 1.5rem;">
      <div style="margin-bottom: 1rem;">
        <h3 style="font-size: 1.25rem; font-weight: 600; margin: 0 0 0.5rem 0;">${title}</h3>
        <p style="font-size: 0.875rem; color: #6b7280; margin: 0;">${summary}</p>
      </div>
      <div style="display: flex; flex-wrap: wrap; gap: 0.5rem; margin-bottom: 1rem;">
        <span style="background-color: #e5e7eb; color: #374151; font-size: 0.75rem; font-weight: 600; padding: 0.25rem 0.5rem; border-radius: 9999px;">${label}</span>
        <div style="display: flex; align-items: center;">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#eab308" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="12" cy="12" r="10"></circle>
            <line x1="12" y1="8" x2="12" y2="12"></line>
            <line x1="12" y1="16" x2="12.01" y2="16"></line>
          </svg>
          <span style="font-size: 0.875rem; font-weight: 500; margin-left: 0.5rem;">${Priority} Priority</span>
        </div>
      </div>
      <hr style="border: 0; border-top: 1px solid #e5e7eb; margin: 1rem 0;">
      <div style="display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 1rem;">
        <div style="display: flex; align-items: center;">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#6b7280" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="margin-right: 0.5rem;">
            <circle cx="12" cy="12" r="10"></circle>
            <polyline points="12 6 12 12 16 14"></polyline>
          </svg>
          <div>
            <div style="font-size: 0.875rem; font-weight: 500;">Time</div>
            <div style="font-size: 0.875rem; color: #6b7280;">${time}</div>
          </div>
        </div>
        <div style="display: flex; align-items: center;">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#6b7280" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="margin-right: 0.5rem;">
            <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
            <circle cx="9" cy="7" r="4"></circle>
            <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
            <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
          </svg>
          <div>
            <div style="font-size: 0.875rem; font-weight: 500;">Customer Impact</div>
            <div style="font-size: 0.875rem; color: #6b7280;">${Impact}</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>
  `;
}

const handlePreview = (previewData: any) => {
  console.info("previewData handlePreview", previewData)
  const overlayContent = generateJiraTicketPreviewHTML(previewData);
  // Send a message to the background overlay script
  chrome.runtime.sendMessage({
    action: "showOverlay",
    content: overlayContent,
  });
};

export function PreviewTicket({
  title,
  content,
  previewData,
}: {
  title: string;
  content: string;
  previewData: any;
}) {
  const fn = () => handlePreview(previewData)
  return (
    <button onClick={fn}>
      <h3 className="font-medium text-purple-900 mb-1">{title}</h3>
      <p className="text-purple-700 text-sm">{content}</p>
    </button>
  );
}
