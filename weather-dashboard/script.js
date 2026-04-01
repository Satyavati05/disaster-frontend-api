const cityInput = document.getElementById('city-input');
const searchBtn = document.getElementById('search-btn');
const weatherContent = document.getElementById('weather-content');
const loadingContainer = document.getElementById('loading-container');
const errorMessage = document.getElementById('error-message');

const cityName = document.getElementById('city-name');
const currentDate = document.getElementById('current-date');
const temperature = document.getElementById('temperature');
const description = document.getElementById('description');
const mainIcon = document.getElementById('main-icon');
const humidity = document.getElementById('humidity');
const windSpeed = document.getElementById('wind-speed');
const feelsLike = document.getElementById('feels-like');
const forecastRow = document.getElementById('forecast-row');

const weatherCodes = {
    0: { desc: 'Clear sky', icon: '☀️' },
    1: { desc: 'Mainly clear', icon: '🌤️' },
    2: { desc: 'Partly cloudy', icon: '⛅' },
    3: { desc: 'Overcast', icon: '☁️' },
    45: { desc: 'Fog', icon: '🌫️' },
    48: { desc: 'Depositing rime fog', icon: '🌫️' },
    51: { desc: 'Drizzle: Light', icon: '🌦️' },
    53: { desc: 'Drizzle: Moderate', icon: '🌦️' },
    55: { desc: 'Drizzle: Dense', icon: '🌦️' },
    61: { desc: 'Rain: Slight', icon: '🌧️' },
    63: { desc: 'Rain: Moderate', icon: '🌧️' },
    65: { desc: 'Rain: Heavy', icon: '🌧️' },
    71: { desc: 'Snow fall: Slight', icon: '❄️' },
    73: { desc: 'Snow fall: Moderate', icon: '❄️' },
    75: { desc: 'Snow fall: Heavy', icon: '❄️' },
    95: { desc: 'Thunderstorm: Slight', icon: '⛈️' },
    96: { desc: 'Thunderstorm with hail', icon: '⛈️' },
};

async function getCoordinates(city) {
    try {
        const response = await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${city}&count=1&language=en&format=json`);
        const data = await response.json();
        if (!data.results || data.results.length === 0) return null;
        return data.results[0];
    } catch (error) {
        console.error('Error fetching coordinates:', error);
        return null;
    }
}

async function getWeatherData(lat, lon) {
    try {
        const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,apparent_temperature,is_day,weather_code,wind_speed_10m&daily=weather_code,temperature_2m_max,temperature_2m_min&timezone=auto`;
        const response = await fetch(url);
        return await response.json();
    } catch (error) {
        console.error('Error fetching weather:', error);
        return null;
    }
}

function updateUI(weatherData, cityInfo) {
    const { current, daily } = weatherData;
    const currentStatus = weatherCodes[current.weather_code] || { desc: 'Unknown', icon: '❓' };

    cityName.textContent = `${cityInfo.name}, ${cityInfo.country_code}`;
    currentDate.textContent = new Date().toLocaleDateString('en-US', { weekday: 'long', day: 'numeric', month: 'long' });
    temperature.textContent = `${Math.round(current.temperature_2m)}°C`;
    description.textContent = currentStatus.desc;
    mainIcon.textContent = currentStatus.icon;
    humidity.textContent = `${current.relative_humidity_2m}%`;
    windSpeed.textContent = `${current.wind_speed_10m} km/h`;
    feelsLike.textContent = `${Math.round(current.apparent_temperature)}°C`;

    forecastRow.innerHTML = '';
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    
    // Fill forecast for next 5 days
    for (let i = 1; i <= 5; i++) {
        const date = new Date(daily.time[i]);
        const dayName = days[date.getDay()];
        const status = weatherCodes[daily.weather_code[i]] || { desc: 'Unknown', icon: '❓' };
        
        const forecastItem = document.createElement('div');
        forecastItem.className = 'forecast-item';
        forecastItem.innerHTML = `
            <span class="forecast-day">${dayName}</span>
            <span class="forecast-icon">${status.icon}</span>
            <span class="forecast-temp">${Math.round(daily.temperature_2m_high || daily.temperature_2m_max[i])}°/ ${Math.round(daily.temperature_2m_low || daily.temperature_2m_min[i])}°</span>
        `;
        forecastRow.appendChild(forecastItem);
    }

    loadingContainer.classList.add('hidden');
    errorMessage.classList.add('hidden');
    weatherContent.classList.remove('hidden');
}

async function handleSearch() {
    const city = cityInput.value.trim();
    if (!city) return;

    weatherContent.classList.add('hidden');
    errorMessage.classList.add('hidden');
    loadingContainer.classList.remove('hidden');

    const coords = await getCoordinates(city);
    if (!coords) {
        loadingContainer.classList.add('hidden');
        errorMessage.classList.remove('hidden');
        return;
    }

    const weatherData = await getWeatherData(coords.latitude, coords.longitude);
    if (!weatherData) {
        loadingContainer.classList.add('hidden');
        errorMessage.classList.remove('hidden');
        return;
    }

    updateUI(weatherData, coords);
}

searchBtn.addEventListener('click', handleSearch);
cityInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') handleSearch();
});

// Initial load
window.addEventListener('load', () => {
    cityInput.value = 'Mumbai';
    handleSearch();
});
