const API_KEY = "4be26b839f7fb2c4e3bf15ae99d7a62c";
const BASE_URL = "https://api.openweathermap.org/data/2.5/";

const cityInput = document.querySelector('#city');
const getWeatherBtn = document.querySelector('#get-weather');
const forecastList = document.querySelector('#hourly-forecast-list');
const forecastTemplate = document.querySelector('#hourly-weather-template');

getWeatherBtn.addEventListener('click', handleSearch);
cityInput.addEventListener('keydown', (e) => {
  if(e.key === 'Enter')
    handleSearch();
});
function handleSearch(){
  const cityName = cityInput.value.trim();
  if(!cityName){
    cityInput.setCustomValidity("Wprowadź nazwę miasta!");
    cityInput.reportValidity();
    return;
  }

  fetchCurrentWeather(cityName);

  fetchForecast(cityName);
}

function fetchCurrentWeather(city){
  const url = `${BASE_URL}weather?q=${encodeURIComponent(city)}&appid=${API_KEY}&units=metric&lang=pl`;
  const xhr = new XMLHttpRequest();

  xhr.open('GET', url);

  xhr.addEventListener('load', ()=>{
    if(xhr.status >= 200 && xhr.status <= 300) {
      const data = JSON.parse(xhr.responseText);
      console.log('Current weather:', data);
      displayCurrentWeather(data);
    }else{
      console.error("Request error: ", xhr.status);
      alert(`Nie udało się znaleźć miejscowości "${city}", Kod błędu: ${xhr.status}`);
    }
  });

  xhr.send();
}
function fetchForecast(city){
  const url = `${BASE_URL}forecast?q=${encodeURIComponent(city)}&appid=${API_KEY}&units=metric&lang=pl`;

  fetch(url)
    .then((response) => {
      if(!response.ok)
        throw new Error(`HTTP error! status: ${response.status}`);
      return response.json();
    })
    .then((data) => {
      console.log('Forecast 5-day (Fetch response):', data);
      displayForecast(data);
    })
    .catch((error) => {
      console.error(`Błąd pobierania prognozy Fetch: ${error}`);
  });
}



function displayCurrentWeather(data) {
  const cityNameEl = document.querySelector('[data-city-name]');
  const tempEl = document.querySelector('[data-current-temp]');
  const descEl = document.querySelector('[data-current-desc]');
  const feelsEl = document.querySelector('[data-current-feels]');
  const windEl = document.querySelector('[data-current-wind]');
  const humidityEl = document.querySelector('[data-current-humidity]');
  const pressureEl = document.querySelector('[data-current-pressure]');
  const iconEl = document.querySelector('[data-current-icon]');
  const iconCode = data.weather[0].icon;

  cityNameEl.textContent = `${data.name}, ${data.sys.country}`;
  tempEl.textContent = `${Math.round(data.main.temp)}°`;
  descEl.textContent = data.weather[0].description;
  feelsEl.textContent = `${Math.round(data.main.feels_like)}°`;
  windEl.textContent = `${Math.round(data.wind.speed * 3.6)} km/h`;
  humidityEl.textContent = `${data.main.humidity}%`;
  pressureEl.textContent = `${data.main.pressure} hPa`;

  iconEl.src = `https://openweathermap.org/img/wn/${iconCode}@2x.png`;
  iconEl.alt = data.weather[0].description;
}

function displayForecast(data) {
  forecastList.innerHTML = '';

  // Pobierz np. 8 najbliższych wpisów (najbliższe 24 godziny co 3h)
  const upcomingEntries = data.list.slice(0, 8);

  upcomingEntries.forEach((item) => {
    const clone = forecastTemplate.content.cloneNode(true);

    const date = new Date(item.dt * 1000);
    const timeFormatted = date.toLocaleTimeString('pl-PL', { hour: '2-digit', minute: '2-digit' });
    const dateFormatted = date.toLocaleDateString('pl-PL', { weekday: 'short', day: 'numeric', month: 'numeric' });

    clone.querySelector('[data-hour]').textContent = `${dateFormatted}, ${timeFormatted}`;
    clone.querySelector('[data-temperature]').textContent = `${Math.round(item.main.temp)}°`;
    clone.querySelector('[data-description]').textContent = item.weather[0].description;
    clone.querySelector('[data-feels-like]').textContent = `${Math.round(item.main.feels_like)}°`;
    clone.querySelector('[data-wind]').textContent = `${Math.round(item.wind.speed * 3.6)} km/h`;
    clone.querySelector('[data-humidity]').textContent = `${item.main.humidity}%`;
    clone.querySelector('[data-pressure]').textContent = `${item.main.pressure} hPa`;

    const iconEl = clone.querySelector('[data-icon]');
    const iconCode = item.weather[0].icon;
    iconEl.src = `https://openweathermap.org/img/wn/${iconCode}@2x.png`;
    iconEl.alt = item.weather[0].description;

    forecastList.appendChild(clone);
  });
}
