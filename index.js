
const weatherApi = "https://api.weather.gov/alerts/active?area=";

const stateInput = document.getElementById("state-input");
const fetchButton = document.getElementById("fetch-alerts");
const alertsDisplay = document.getElementById("alerts-display");
const errorMessage = document.getElementById("error-message");

async function fetchWeatherData(state) {
  const stateCode = state.trim().toUpperCase();

  if (!/^[A-Z]{2}$/.test(stateCode)) {
    displayError("Please enter a valid two-letter state abbreviation.");
    return;
  }

  alertsDisplay.innerHTML = "";
  errorMessage.textContent = "";
  errorMessage.classList.add("hidden");

  try {
    const response = await fetch(weatherApi + stateCode);

    if (!response.ok) {
      throw new Error("Unable to fetch weather alerts.");
    }

    const data = await response.json();
    displayWeather(data);
  } catch (error) {
    displayError("Network failure: " + error.message);
  }
}

function displayWeather(data) {
  alertsDisplay.innerHTML = "";
  errorMessage.textContent = "";
  errorMessage.classList.add("hidden");

  const alerts = data.features || [];

  const heading = document.createElement("h2");
  heading.textContent = "Weather Alerts: " + alerts.length;
  alertsDisplay.appendChild(heading);

  alerts.forEach(function(alert) {
    const headline = document.createElement("p");

    headline.textContent =
      alert.properties.headline ||
      alert.properties.event ||
      "Weather Alert";

    alertsDisplay.appendChild(headline);
  });
}

function displayError(message) {
  alertsDisplay.innerHTML = "";
  errorMessage.textContent = message;
  errorMessage.classList.remove("hidden");
}

fetchButton.addEventListener("click", async function() {
  const state = stateInput.value;
  stateInput.value = "";

  await fetchWeatherData(state);
});
