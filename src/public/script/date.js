// Función para obtener la fecha y hora actual en español y el huso horario de Argentina (UTC-3)
function getCurrentDateTime() {
  const now = new Date();
  const dateOptions = {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
    timeZone: "America/Argentina/Buenos_Aires", // Establecemos el huso horario de Argentina
  };
  const timeOptions = {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    timeZone: "America/Argentina/Buenos_Aires", // Establecemos el huso horario de Argentina
  };
  const date = now.toLocaleDateString("es", dateOptions); // Agregamos "es" para español
  const time = now.toLocaleTimeString("es", timeOptions); // Agregamos "es" para español
  return `${date}, ${time}`;
}

// Function to update the date and time in the specified element
function updateDateTime() {
  const dateTimeElement = document.getElementById("dateTime");
  dateTimeElement.textContent = getCurrentDateTime();
}

// Update the date and time immediately when the page loads
updateDateTime();

// Update the date and time every second (1000 milliseconds)
setInterval(updateDateTime, 1000);
