const form = document.querySelector('form');
const title = document.getElementById('title');
const locationTitle = document.getElementById('location-title');
const weatherGIF = document.getElementById('weather-gif');
const details = document.getElementById('details');
const crazyModeBtn = document.getElementById('crazymode-btn');
const error = document.querySelector('.error');

const API_KEY = 'c55366a475f8035580969e98a3d013b8';

let queryLocation;

async function getWeatherData(location, units='metric') {
  try {
    const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${location}&units=${units}&appid=${API_KEY}`, {mode: 'cors'});
    const weatherData = await response.json();
    return weatherData;
  } catch (err) {
    console.log(err);
  }
}

async function getGIF(query) {
  try {
    const response = await fetch(`https://api.giphy.com/v1/gifs/translate?api_key=uDGCA6SyrLEPPB4HTGhFNBvOscgo7ioK&s=${query}&limit=5`, {mode: 'cors'});
    const imgData = await response.json();       
    weatherGIF.src = imgData.data.images.original.url;
  } catch(err) {
    console.log(err);
  }
}

async function sortWeatherData(weatherData) {
  
  const data = await weatherData;
  
  const sortedData =  {
                        city: `${data.name} ${data.sys.country ? `(${data.sys.country})` : ''} `,
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
    <p id="wind-speed">${weatherData.windSpeed} ${getUnits(crazyMode).speed} wind</p>
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
  let units = {}
  if (crazyMode) {
    units = {
      mode: 'imperial',
      speed: 'mph',
      tempUnit: '°f',
    }
  } else {
    units = {
      mode: 'metric',
      speed: 'm/s',
      tempUnit: '°c',
    }
  }
  return units;
}

async function handleSubmit(e) {
  e.preventDefault();
  if (!form.location.value && !queryLocation) return;
  if (e.target.name === 'submit-btn' && !form.location.value) return;
  const isCrazyModeEnabled = crazyModeBtn.classList.contains('enabled');
  if (e.target.name === 'submit-btn') queryLocation = form.location.value;

  try {
    const weatherData = getWeatherData(queryLocation, getUnits(isCrazyModeEnabled).mode);
    const sortedWeatherData = await sortWeatherData(weatherData);
    locationTitle.innerHTML = sortedWeatherData.city;
    removeErrorMessage();
    renderWeatherData(sortedWeatherData, isCrazyModeEnabled);
    form.reset();
  } catch (err) {
    if (err instanceof TypeError) {
      showErrorMessage();
      weatherGIF.src = 'https://media.giphy.com/media/vKz8r5aTUFFJu/giphy.gif';
    }
  }
}

function showErrorMessage() {
  title.classList.remove('display');
  error.classList.add('display');
}

function removeErrorMessage() {
  title.classList.add('display');
  error.classList.remove('display');
}

function toggleCrazyMode(e) {
  e.preventDefault();
  e.target.classList.toggle('enabled');
  if (queryLocation) handleSubmit(e);
}

form['submit-btn'].addEventListener('click', handleSubmit);
crazyModeBtn.addEventListener('click', toggleCrazyMode);