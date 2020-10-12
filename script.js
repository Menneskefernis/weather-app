const form = document.querySelector('form');
const weatherGIF = document.getElementById('weather-gif');
const details = document.getElementById('details');

const API_KEY = 'c55366a475f8035580969e98a3d013b8';

async function getWeatherData(city) {
 
    const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&units=imperial&appid=${API_KEY}`, {mode: 'cors'});
    const weatherData = await response.json();
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
  const sortedData =  {
                        weather: data.weather[0].description,
                        humidity: data.main.humidity,
                        windSpeed: data.wind.speed,
                        temperature: data.main.temp,
                        maxTemperature: data.main.temp_max,
                        minTemperature: data.main.temp_min,
                      };

  return sortedData;  
}

async function renderWeatherData(data) {
  const weatherData = await data;
  
  markup = `
    <h2>${weatherData.weather}</h2>
    <p>${weatherData.humidity}% Humidity</p>
    <p>${weatherData.windSpeed} Wind Speed</p>
    <div>
      <p>${weatherData.temperature} Degrees</p>
      <p>Maximum ${weatherData.maxTemperature} Degrees</p>
      <p>Minimum ${weatherData.minTemperature} Degrees</p>
    </div>
  `
  details.insertAdjacentHTML('afterbegin', markup);
  getGIF(weatherData.weather);
}

function handleSubmit(e) {
  e.preventDefault();
  const location = form.location.value;
  
  const weatherData = getWeatherData(location);
  const sortedWeatherData = sortWeatherData(weatherData);
  renderWeatherData(sortedWeatherData);
  console.log(form.location.value)
}



form.addEventListener('click', handleSubmit);