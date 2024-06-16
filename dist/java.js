document.addEventListener('DOMContentLoaded', () => {
    const apiKey = '5e82b588cd375913189bbff52b483f12'; // Replace with your API key
    const cityInput = document.getElementById('city-input');
    const searchButton = document.querySelector('button');
    const currentWeatherDiv = document.getElementById('current-weather');
    const forecastDiv = document.getElementById('forecast');
  
    searchButton.addEventListener('click', () => {
      const city = cityInput.value;
      if (city) {
        getWeather(city);
      }
    });
  
    async function getWeather(city) {
      try {
        const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`);
        const data = await response.json();
        displayCurrentWeather(data);
        getForecast(city);
      } catch (error) {
        console.error('Error fetching weather data:', error);
      }
    }
  
    async function getForecast(city) {
      try {
        const response = await fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=metric`);
        const data = await response.json();
        const dailyData = processDailyData(data.list);
        displayForecast(dailyData);
      } catch (error) {
        console.error('Error fetching forecast data:', error);
      }
    }
  
    function processDailyData(list) {
      const daily = {};
      list.forEach(item => {
        const date = new Date(item.dt * 1000).toLocaleDateString();
        if (!daily[date]) {
          daily[date] = {
            temp: [],
            weather: item.weather[0].description
          };
        }
        daily[date].temp.push(item.main.temp);
      });
  
      return Object.keys(daily).map(date => {
        const temps = daily[date].temp;
        return {
          date,
          temp: (temps.reduce((a, b) => a + b, 0) / temps.length).toFixed(1),
          weather: daily[date].weather
        };
      });
    }
  
    function displayCurrentWeather(data) {
      currentWeatherDiv.innerHTML = `
        <h2 class="text-2xl font-bold">${data.name}</h2>
        <p class="text-lg">${data.weather[0].description}</p>
        <p class="text-lg">${data.main.temp}°C</p>
      `;
    }
  
    function displayForecast(data) {
      forecastDiv.innerHTML = data.map(day => `
        <div id="Forecast1" class="bg-red-500 p-4 rounded-lg mb-4 animate-fadeIn">
          <h3 class="font-bold">${day.date}</h3>
          <p>${day.weather}</p>
          <p>${day.temp}°C</p>
        </div>
      `).join('');
    }
  });
  