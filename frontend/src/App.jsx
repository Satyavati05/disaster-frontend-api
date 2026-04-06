import { useState, useEffect } from 'react'
import './App.css'
import GlobalRiskMonitor from './GlobalRiskMonitor'

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

function App() {
  const [currentView, setCurrentView] = useState('weather'); // 'weather' or 'map'
  const [cityInput, setCityInput] = useState('Mumbai');
  const [weatherData, setWeatherData] = useState(null);
  const [cityInfo, setCityInfo] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  const getCoordinates = async (city) => {
      try {
          const response = await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${city}&count=1&language=en&format=json`);
          const data = await response.json();
          if (!data.results || data.results.length === 0) return null;
          return data.results[0];
      } catch (err) {
          console.error('Error fetching coordinates:', err);
          return null;
      }
  };

  const getWeatherData = async (lat, lon) => {
      try {
          const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,apparent_temperature,is_day,weather_code,wind_speed_10m&daily=weather_code,temperature_2m_max,temperature_2m_min&timezone=auto`;
          const response = await fetch(url);
          return await response.json();
      } catch (err) {
          console.error('Error fetching weather:', err);
          return null;
      }
  };

  const handleSearch = async () => {
      if (!cityInput.trim()) return;

      setLoading(true);
      setError(false);
      setWeatherData(null);

      const coords = await getCoordinates(cityInput.trim());
      if (!coords) {
          setLoading(false);
          setError(true);
          return;
      }

      const data = await getWeatherData(coords.latitude, coords.longitude);
      if (!data) {
          setLoading(false);
          setError(true);
          return;
      }

      setCityInfo(coords);
      setWeatherData(data);
      setLoading(false);
  };

  const handleKeyPress = (e) => {
      if (e.key === 'Enter') handleSearch();
  };

  useEffect(() => {
      handleSearch();
      // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const renderForecast = () => {
      if (!weatherData) return null;
      
      const { daily } = weatherData;
      const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
      
      const forecastItems = [];
      for (let i = 1; i <= 5; i++) {
          const date = new Date(daily.time[i]);
          const dayName = days[date.getDay()];
          const status = weatherCodes[daily.weather_code[i]] || { desc: 'Unknown', icon: '❓' };
          
          forecastItems.push(
              <div key={i} className="forecast-item">
                  <span className="forecast-day">{dayName}</span>
                  <span className="forecast-icon">{status.icon}</span>
                  <span className="forecast-temp">
                      {Math.round(daily.temperature_2m_max?.[i] || daily.temperature_2m_high?.[i])}°/ {Math.round(daily.temperature_2m_min?.[i] || daily.temperature_2m_low?.[i])}°
                  </span>
              </div>
          );
      }
      return forecastItems;
  };

  if (currentView === 'map') {
      return (
          <>
            <GlobalRiskMonitor />
            <button 
                onClick={() => setCurrentView('weather')}
                style={{
                  position: 'fixed', bottom: '20px', right: '20px', zIndex: 1000, 
                  background: '#ff6e40', color: 'white', border: 'none', padding: '12px 20px', 
                  borderRadius: '30px', fontWeight: 'bold', cursor: 'pointer', boxShadow: '0 4px 15px rgba(255, 110, 64, 0.4)'
                }}>
                Back to Dashboard
            </button>
          </>
      );
  }

  return (
    <>
      <div className="background-container"></div>
      <div className="container" style={{ position: 'relative' }}>
          <button 
              onClick={() => setCurrentView('map')}
              style={{
                  position: 'absolute', top: '10px', right: '20px', 
                  background: 'rgba(255,255,255,0.2)', border: '1px solid rgba(255,255,255,0.3)',
                  color: 'white', padding: '8px 16px', borderRadius: '20px', cursor: 'pointer',
                  backdropFilter: 'blur(10px)'
              }}>
              🗺️ Open Risk Map
          </button>
          <header style={{ marginTop: '40px' }}>
              <div className="search-container">
                  <input 
                      type="text" 
                      id="city-input" 
                      placeholder="Search for a city..." 
                      autoComplete="off"
                      value={cityInput}
                      onChange={(e) => setCityInput(e.target.value)}
                      onKeyDown={handleKeyPress}
                  />
                  <button id="search-btn" onClick={handleSearch}>
                      <span className="search-icon">🔍</span>
                  </button>
              </div>
          </header>

          {loading && (
              <div id="loading-container" className="loading">
                  <p>Searching for weather data...</p>
              </div>
          )}

          {error && (
              <div id="error-message">
                  <p>Oops! Could not find weather for that location.</p>
              </div>
          )}

          {weatherData && cityInfo && !loading && !error && (
              <main id="weather-content">
                  <div className="current-weather">
                      <div className="city-info">
                          <h1 id="city-name">{cityInfo.name}, {cityInfo.country_code}</h1>
                          <p id="current-date">
                              {new Date().toLocaleDateString('en-US', { weekday: 'long', day: 'numeric', month: 'long' })}
                          </p>
                      </div>
                      <div className="temp-container">
                          <div className="main-temp" id="temperature">
                              {Math.round(weatherData.current.temperature_2m)}°C
                          </div>
                          <div className="weather-desc" id="description">
                              {(weatherCodes[weatherData.current.weather_code] || { desc: 'Unknown' }).desc}
                          </div>
                      </div>
                      <div className="weather-icon-large" id="main-icon">
                          {(weatherCodes[weatherData.current.weather_code] || { icon: '❓' }).icon}
                      </div>
                  </div>

                  <div className="stats-grid">
                      <div className="stat-card">
                          <span className="stat-icon">💧</span>
                          <div className="stat-info">
                              <span className="stat-label">Humidity</span>
                              <span className="stat-value" id="humidity">{weatherData.current.relative_humidity_2m}%</span>
                          </div>
                      </div>
                      <div className="stat-card">
                          <span className="stat-icon">💨</span>
                          <div className="stat-info">
                              <span className="stat-label">Wind Speed</span>
                              <span className="stat-value" id="wind-speed">{weatherData.current.wind_speed_10m} km/h</span>
                          </div>
                      </div>
                      <div className="stat-card">
                          <span className="stat-icon">🌡️</span>
                          <div className="stat-info">
                              <span className="stat-label">Feels Like</span>
                              <span className="stat-value" id="feels-like">{Math.round(weatherData.current.apparent_temperature)}°C</span>
                          </div>
                      </div>
                  </div>

                  <div className="forecast-container">
                      <h2>Next 5 Days</h2>
                      <div className="forecast-row" id="forecast-row">
                          {renderForecast()}
                      </div>
                  </div>
              </main>
          )}
      </div>
    </>
  )
}

export default App
