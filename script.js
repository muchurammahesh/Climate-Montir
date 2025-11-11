const cityInput = document.getElementById("cityInput");
const searchBtn = document.getElementById("searchBtn");
const cityName = document.getElementById("cityName");
const temperature = document.getElementById("temperature");
const description = document.getElementById("description");
const humidity = document.getElementById("humidity");
const weatherIcon = document.getElementById("weatherIcon");
const forecastCards = document.getElementById("forecastCards");
const loading = document.getElementById("loading");
const errorMsg = document.getElementById("error");
const currentWeather = document.getElementById("currentWeather");
const forecast = document.getElementById("forecast");

async function fetchWeather(city) {
  loading.classList.remove("hidden");
  errorMsg.classList.add("hidden");
  currentWeather.classList.add("hidden");
  forecast.classList.add("hidden");

  try {
    const res = await fetch(`https://wttr.in/${city}?format=j1`);
    if (!res.ok) throw new Error("City not found");

    const data = await res.json();
    updateCurrentWeather(city, data);
    updateForecast(data.weather);

    localStorage.setItem("lastCity", city);
  } catch (err) {
    errorMsg.classList.remove("hidden");
  } finally {
    loading.classList.add("hidden");
  }
}

function updateCurrentWeather(city, data) {
  const current = data.current_condition[0];
  cityName.textContent = city.charAt(0).toUpperCase() + city.slice(1);
  temperature.textContent = `🌡 ${current.temp_C}°C`;
  description.textContent = `☁️ ${current.weatherDesc[0].value}`;
  humidity.textContent = `💧 Humidity: ${current.humidity}%`;
  weatherIcon.src = getWeatherIcon(current.weatherDesc[0].value);

  currentWeather.classList.remove("hidden");
}

function updateForecast(days) {
  forecastCards.innerHTML = "";
  days.forEach(day => {
    const card = document.createElement("div");
    card.classList.add("forecast-card");
    card.innerHTML = `
      <h4>${day.date}</h4>
      <p>🌞 Max: ${day.maxtempC}°C</p>
      <p>🌙 Min: ${day.mintempC}°C</p>
    `;
    forecastCards.appendChild(card);
  });
  forecast.classList.remove("hidden");
}

function getWeatherIcon(description) {
  description = description.toLowerCase();
  if (description.includes("rain")) return "https://cdn-icons-png.flaticon.com/512/1163/1163624.png";
  if (description.includes("sun") || description.includes("clear")) return "https://cdn-icons-png.flaticon.com/512/869/869869.png";
  if (description.includes("cloud")) return "https://cdn-icons-png.flaticon.com/512/414/414825.png";
  if (description.includes("snow")) return "https://cdn-icons-png.flaticon.com/512/642/642102.png";
  return "https://cdn-icons-png.flaticon.com/512/1146/1146869.png";
}

searchBtn.addEventListener("click", () => {
  const city = cityInput.value.trim();
  if (city) fetchWeather(city);
});

cityInput.addEventListener("keypress", e => {
  if (e.key === "Enter") {
    const city = cityInput.value.trim();
    if (city) fetchWeather(city);
  }
});

window.addEventListener("load", () => {
  const lastCity = localStorage.getItem("lastCity");
  if (lastCity) fetchWeather(lastCity);
});
