const form = document.querySelector('form');
const locationTitle = document.getElementById('location-title');
const weatherGIF = document.getElementById('weather-gif');
const details = document.getElementById('details');
const crazyModeCheckbox = document.querySelector('#crazymode input');

const API_KEY = 'c55366a475f8035580969e98a3d013b8';

async function getWeatherData(city, units='metric') {
 
    const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&units=${units}&appid=${API_KEY}`, {mode: 'cors'});
    const weatherData = await response.json();
    console.log(weatherData)
    return weatherData;
}

async function getGIF(query) {
  try {
    const response = await fetch(`https://api.giphy.com/v1/gifs/translate?api_key=uDGCA6SyrLEPPB4HTGhFNBvOscgo7ioK&s=${query}&limit=5`, {mode: 'cors'});
    const imgData = await response.json();       
    weatherGIF.src = imgData.data.images.original.url;
  } catch(err) {
    console.log(err)
  }
}

async function sortWeatherData(weatherData) {
  const data = await weatherData;
  console.log(data.name)
  const sortedData =  {
                        city: `${data.name} (${data.sys.country})`,
                        weather: data.weather[0].description,
                        humidity: data.main.humidity,
                        windSpeed: data.wind.speed,
                        temperature: data.main.temp,
                        maxTemperature: data.main.temp_max,
                        minTemperature: data.main.temp_min,
                      };

  return sortedData;  
}

async function renderWeatherData(data, crazyMode=false) {
  const weatherData = await data;
  
  markup = `
    <h2 id="weather">${weatherData.weather.toUpperCase()}</h2>
    <p id="humidity">${weatherData.humidity}% Humidity</p>
    <p id="wind-speed">${weatherData.windSpeed} ${getUnits(crazyMode).speed}</p>
    <div id="temperature">
      <p>${weatherData.temperature} ${getUnits(crazyMode).tempUnit}</p>
      <p>Maximum ${weatherData.maxTemperature} ${getUnits(crazyMode).tempUnit}</p>
      <p>Minimum ${weatherData.minTemperature} ${getUnits(crazyMode).tempUnit}</p>
    </div>
  `
  details.innerHTML = markup;
  getGIF(weatherData.weather);
}

function getUnits(crazyMode=false) {
  const units = {}
  if (crazyMode) {
    units.mode = 'imperial';
    units.speed = 'mph';
    units.tempUnit = '°f';
  } else {
    units.mode = 'metric';
    units.speed = 'm/s';
    units.tempUnit = '°c';
  }
  return units;
}

async function handleSubmit(e) {
  e.preventDefault();
  if (!form.location.value) return;

  const location = form.location.value;
  const weatherData = getWeatherData(location, getUnits(crazyModeCheckbox.checked).mode);
  const sortedWeatherData = await sortWeatherData(weatherData);
  locationTitle.innerHTML = sortedWeatherData.city;
  renderWeatherData(sortedWeatherData, crazyModeCheckbox.checked);
}

form['submit-btn'].addEventListener('click', handleSubmit);
crazyModeCheckbox.addEventListener('change', handleSubmit);