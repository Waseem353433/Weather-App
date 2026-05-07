 const temperatureEl = document.getElementById('temperature');
    const windSpeedEl = document.getElementById('wind-speed');
    const weatherCodeEl = document.getElementById('weather-code');
    const statusEl = document.getElementById('status');
    const locationEl = document.getElementById('location');
    const cityInput = document.getElementById('city-input');
    const searchForm = document.getElementById('search-form');

    const weatherCodes = {
      0: 'Clear sky',
      1: 'Mainly clear',
      2: 'Partly cloudy',
      3: 'Overcast',
      45: 'Fog',
      48: 'Depositing rime fog',
      51: 'Light drizzle',
      53: 'Moderate drizzle',
      55: 'Dense drizzle',
      56: 'Freezing drizzle',
      57: 'Dense freezing drizzle',
      61: 'Slight rain',
      63: 'Moderate rain',
      65: 'Heavy rain',
      66: 'Freezing rain',
      67: 'Heavy freezing rain',
      71: 'Slight snow',
      73: 'Moderate snow',
      75: 'Heavy snow',
      77: 'Snow grains',
      80: 'Rain showers',
      81: 'Moderate showers',
      82: 'Violent showers',
      85: 'Slight snow showers',
      86: 'Heavy snow showers',
      95: 'Thunderstorm',
      96: 'Thunderstorm with hail',
      99: 'Thunderstorm with heavy hail'
    };

    function updateWeather(city, latitude, longitude) {
      const weatherUrl = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true`;
      statusEl.textContent = `Loading weather for ${city}...`;

      fetch(weatherUrl)
        .then(response => response.json())
        .then(data => {
          const current = data.current_weather;
          temperatureEl.textContent = Math.round(current.temperature);
          windSpeedEl.textContent = `${current.windspeed} km/h`;
          weatherCodeEl.textContent = weatherCodes[current.weathercode] || 'Unknown';
          locationEl.textContent = city;
          statusEl.textContent = 'Updated successfully.';
        })
        .catch(error => {
          console.error(error);
          statusEl.textContent = 'Unable to load weather. Please try again.';
          weatherCodeEl.textContent = 'Error';
        });
    }

    function fetchCoordinates(city) {
      const geoUrl = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city)}&count=1&language=en&format=json`;
      statusEl.textContent = `Searching for ${city}...`;

      return fetch(geoUrl)
        .then(response => response.json())
        .then(data => {
          if (!data.results || data.results.length === 0) {
            throw new Error('City not found');
          }
          return data.results[0];
        });
    }

    searchForm.addEventListener('submit', event => {
      event.preventDefault();
      const city = cityInput.value.trim();
      if (!city) {
        statusEl.textContent = 'Please enter a city name.';
        return;
      }

      fetchCoordinates(city)
        .then(place => {
          const cityLabel = `${place.name}${place.country ? ', ' + place.country : ''}`;
          updateWeather(cityLabel, place.latitude, place.longitude);
        })
        .catch(error => {
          console.error(error);
          statusEl.textContent = 'City not found. Try another name.';
          weatherCodeEl.textContent = '--';
          temperatureEl.textContent = '--';
          windSpeedEl.textContent = '-- km/h';
        });
    });

    updateWeather('Peshawar, PK', 34.0151, 71.5249);