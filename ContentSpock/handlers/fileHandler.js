document.addEventListener("DOMContentLoaded", function () {
  const attachButton = document.getElementById("attachButton");
  const fileInput = document.getElementById("fileInput");

  attachButton.addEventListener("click", function (e) {
    e.preventDefault();
    fileInput.click();
  });

  fileInput.addEventListener("change", function (e) {
    const file = e.target.files[0];
    if (file) {
      if (file.type.startsWith("video/")) {
        alert(`Video file selected: ${file.name}`);
        // handle file upload
      } else {
        alert("Please select a video file.");
        fileInput.value = "";
      }
    }
  });
});
