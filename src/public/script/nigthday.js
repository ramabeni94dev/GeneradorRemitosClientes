// Function to toggle dark mode
function toggleDarkMode() {
  const body = document.body;
  body.classList.toggle("dark-mode");
  // Save the user's preference in local storage
  const darkModeEnabled = body.classList.contains("dark-mode");
  localStorage.setItem("darkMode", JSON.stringify(darkModeEnabled));

  // Toggle the visibility of the icons based on the current mode
  const modeToggle = document.getElementById("modeToggle");
  const sunIcon = modeToggle.querySelector(".fa-sun");
  const moonIcon = modeToggle.querySelector(".fa-moon");
  sunIcon.classList.toggle("d-none");
  moonIcon.classList.toggle("d-none");
}

// Check if the user has a preference for dark mode from local storage
const darkModePreference = JSON.parse(localStorage.getItem("darkMode"));
if (darkModePreference !== null) {
  document.body.classList.toggle("dark-mode", darkModePreference);

  // Show the appropriate icon based on the preference
  const modeToggle = document.getElementById("modeToggle");
  const sunIcon = modeToggle.querySelector(".fa-sun");
  const moonIcon = modeToggle.querySelector(".fa-moon");
  sunIcon.classList.toggle("d-none", darkModePreference);
  moonIcon.classList.toggle("d-none", !darkModePreference);
}

// Add event listener to the toggle button
document.getElementById("modeToggle").addEventListener("click", toggleDarkMode);
