// WeatherAPI Configuration
const API_KEY = "7722142ad3e0422091322043250710"; // Replace with your WeatherAPI key
const BASE_URL = "https://api.weatherapi.com/v1";

// DOM Elements
const cityInput = document.getElementById('city-input');
const searchBtn = document.getElementById('search-btn');
const locationBtn = document.getElementById('location-btn');

// Weather Cards
const currentWeatherCard = document.getElementById('current-weather');
const airQualityCard = document.getElementById('air-quality');
const astronomyCard = document.getElementById('astronomy');
const hourlyForecastSection = document.getElementById('hourly-forecast');
const dailyForecastSection = document.getElementById('daily-forecast');
const errorMessage = document.getElementById('error-message');
const errorText = document.getElementById('error-text');
const loader = document.getElementById('loader');

// Background and Animation Elements
const weatherBg = document.getElementById('weather-bg');
const weatherAnimation = document.getElementById('weather-animation');

// Current Weather Elements
const cityName = document.getElementById('city-name');
const currentDate = document.getElementById('current-date');
const localTime = document.getElementById('local-time');
const weatherIcon = document.getElementById('weather-icon');
const temperature = document.getElementById('temperature');
const weatherDescription = document.getElementById('weather-description');
const feelsLike = document.getElementById('feels-like');
const humidity = document.getElementById('humidity');
const wind = document.getElementById('wind');
const pressure = document.getElementById('pressure');
const visibility = document.getElementById('visibility');
const uvIndex = document.getElementById('uv-index');
const precipitation = document.getElementById('precipitation');
const cloudCover = document.getElementById('cloud-cover');

// Air Quality Elements
const aqiValue = document.getElementById('aqi-value');
const aqiLevel = document.getElementById('aqi-level');
const pm2_5 = document.getElementById('pm2-5');
const pm10 = document.getElementById('pm10');
const o3 = document.getElementById('o3');
const no2 = document.getElementById('no2');
const so2 = document.getElementById('so2');
const co = document.getElementById('co');

// Astronomy Elements
const sunrise = document.getElementById('sunrise');
const sunset = document.getElementById('sunset');
const moonrise = document.getElementById('moonrise');
const moonset = document.getElementById('moonset');
const moonPhase = document.getElementById('moon-phase');
const moonIllumination = document.getElementById('moon-illumination');

// Forecast Containers
const hourlyContainer = document.getElementById('hourly-container');
const dailyContainer = document.getElementById('daily-container');

// Global Variables
let currentData = null;

// Initialize the application
function init() {
    // Set up event listeners
    searchBtn.addEventListener('click', handleSearch);
    cityInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') handleSearch();
    });
    locationBtn.addEventListener('click', getLocationWeather);
    
    // Load default city weather
    fetchWeatherByCity('New York');
}

// Handle city search
function handleSearch() {
    const city = cityInput.value.trim();
    if (city) {
        fetchWeatherByCity(city);
    } else {
        showError('Please enter a city name');
    }
}

// Get weather by city name
async function fetchWeatherByCity(city) {
    try {
        showLoader(true);
        clearError();
        
        // Fetch current weather, forecast, and air quality in parallel
        const [currentResponse, forecastResponse, airQualityResponse] = await Promise.all([
            fetch(`${BASE_URL}/current.json?key=${API_KEY}&q=${city}&aqi=yes`),
            fetch(`${BASE_URL}/forecast.json?key=${API_KEY}&q=${city}&days=7&aqi=yes&alerts=yes`),
            fetch(`${BASE_URL}/astronomy.json?key=${API_KEY}&q=${city}`)
        ]);
        
        if (!currentResponse.ok || !forecastResponse.ok) {
            throw new Error('City not found or data unavailable');
        }
        
        const currentData = await currentResponse.json();
        const forecastData = await forecastResponse.json();
        const airQualityData = await airQualityResponse.json();
        
        // Update UI with data
        updateCurrentWeather(currentData);
        updateAirQuality(currentData);
        updateAstronomy(airQualityData);
        updateForecast(forecastData);
        
        // Update background based on weather condition
        updateWeatherBackground(currentData.current.condition.code, currentData.current.is_day);
        
        // Store current data
        this.currentData = currentData;
        
    } catch (error) {
        showError(error.message);
    } finally {
        showLoader(false);
    }
}

// Get weather by user's location
function getLocationWeather() {
    if (!navigator.geolocation) {
        showError('Geolocation is not supported by your browser');
        return;
    }
    
    showLoader(true);
    
    navigator.geolocation.getCurrentPosition(
        async (position) => {
            try {
                const { latitude, longitude } = position.coords;
                const location = `${latitude},${longitude}`;
                
                // Fetch current weather, forecast, and air quality in parallel
                const [currentResponse, forecastResponse, airQualityResponse] = await Promise.all([
                    fetch(`${BASE_URL}/current.json?key=${API_KEY}&q=${location}&aqi=yes`),
                    fetch(`${BASE_URL}/forecast.json?key=${API_KEY}&q=${location}&days=7&aqi=yes&alerts=yes`),
                    fetch(`${BASE_URL}/astronomy.json?key=${API_KEY}&q=${location}`)
                ]);
                
                if (!currentResponse.ok || !forecastResponse.ok) {
                    throw new Error('Location data unavailable');
                }
                
                const currentData = await currentResponse.json();
                const forecastData = await forecastResponse.json();
                const airQualityData = await airQualityResponse.json();
                
                // Update UI with data
                updateCurrentWeather(currentData);
                updateAirQuality(currentData);
                updateAstronomy(airQualityData);
                updateForecast(forecastData);
                
                // Update background based on weather condition
                updateWeatherBackground(currentData.current.condition.code, currentData.current.is_day);
                
                // Update input field
                cityInput.value = currentData.location.name;
                
                // Store current data
                this.currentData = currentData;
                
            } catch (error) {
                showError(error.message);
            } finally {
                showLoader(false);
            }
        },
        (error) => {
            showLoader(false);
            showError('Unable to retrieve your location');
            console.error('Geolocation error:', error);
        }
    );
}

// Update current weather display
function updateCurrentWeather(data) {
    const location = data.location;
    const current = data.current;
    
    cityName.textContent = `${location.name}, ${location.country}`;
    
    // Format dates and times
    const now = new Date();
    currentDate.textContent = now.toLocaleDateString('en-US', { 
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
    });
    
    localTime.textContent = `Local Time: ${location.localtime}`;
    
    // Weather icon and description
    weatherIcon.src = `https:${current.condition.icon}`;
    weatherIcon.alt = current.condition.text;
    weatherDescription.textContent = current.condition.text;
    
    // Temperature and details (Celsius only)
    temperature.textContent = Math.round(current.temp_c);
    feelsLike.textContent = `${Math.round(current.feelslike_c)}°C`;
    humidity.textContent = `${current.humidity}%`;
    wind.textContent = `${Math.round(current.wind_kph)} km/h`;
    pressure.textContent = `${current.pressure_mb} hPa`;
    visibility.textContent = `${current.vis_km} km`;
    uvIndex.textContent = current.uv;
    precipitation.textContent = `${current.precip_mm} mm`;
    cloudCover.textContent = `${current.cloud}%`;
    
    // Show current weather card
    currentWeatherCard.classList.remove('hidden');
    currentWeatherCard.classList.add('fade-in');
}

// Update air quality display
function updateAirQuality(data) {
    const airQuality = data.current.air_quality;
    
    if (!airQuality) {
        airQualityCard.classList.add('hidden');
        return;
    }
    
    const usAqi = airQuality['us-epa-index'];
    
    // Set AQI value and level
    aqiValue.textContent = usAqi;
    aqiValue.style.background = getAqiColor(usAqi);
    aqiLevel.textContent = getAqiLevel(usAqi);
    
    // Update pollutant values
    pm2_5.textContent = airQuality.pm2_5.toFixed(1);
    pm10.textContent = airQuality.pm10.toFixed(1);
    o3.textContent = airQuality.o3.toFixed(1);
    no2.textContent = airQuality.no2.toFixed(1);
    so2.textContent = airQuality.so2.toFixed(1);
    co.textContent = airQuality.co.toFixed(1);
    
    // Show air quality card
    airQualityCard.classList.remove('hidden');
    airQualityCard.classList.add('fade-in');
}

// Get AQI color based on value
function getAqiColor(aqi) {
    const colors = {
        1: '#00E400', // Good
        2: '#FFFF00', // Moderate
        3: '#FF7E00', // Unhealthy for sensitive groups
        4: '#FF0000', // Unhealthy
        5: '#8F3F97', // Very Unhealthy
        6: '#7E0023'  // Hazardous
    };
    return colors[aqi] || '#666';
}

// Get AQI level description
function getAqiLevel(aqi) {
    const levels = {
        1: 'Good',
        2: 'Moderate',
        3: 'Unhealthy for Sensitive Groups',
        4: 'Unhealthy',
        5: 'Very Unhealthy',
        6: 'Hazardous'
    };
    return levels[aqi] || 'Unknown';
}

// Update astronomy display
function updateAstronomy(data) {
    const astronomy = data.astronomy.astro;
    
    sunrise.textContent = astronomy.sunrise;
    sunset.textContent = astronomy.sunset;
    moonrise.textContent = astronomy.moonrise;
    moonset.textContent = astronomy.moonset;
    moonPhase.textContent = astronomy.moon_phase;
    moonIllumination.textContent = `${astronomy.moon_illumination}%`;
    
    // Show astronomy card
    astronomyCard.classList.remove('hidden');
    astronomyCard.classList.add('fade-in');
}

// Update forecast display
function updateForecast(data) {
    // Process hourly forecast (next 24 hours)
    const hourlyData = data.forecast.forecastday[0].hour;
    updateHourlyForecast(hourlyData);
    
    // Process daily forecast (next 7 days)
    const dailyData = data.forecast.forecastday;
    updateDailyForecast(dailyData);
    
    // Show forecast sections
    hourlyForecastSection.classList.remove('hidden');
    dailyForecastSection.classList.remove('hidden');
    hourlyForecastSection.classList.add('fade-in');
    dailyForecastSection.classList.add('fade-in');
}

// Update hourly forecast
function updateHourlyForecast(hourlyData) {
    hourlyContainer.innerHTML = '';
    
    const now = new Date();
    const currentHour = now.getHours();
    
    // Show next 24 hours starting from current hour
    const relevantHours = hourlyData.slice(currentHour, currentHour + 24);
    
    relevantHours.forEach(hour => {
        const time = new Date(hour.time);
        const displayHour = time.getHours();
        const ampm = displayHour >= 12 ? 'PM' : 'AM';
        const displayHour12 = displayHour % 12 || 12;
        
        const card = document.createElement('div');
        card.className = 'hourly-card';
        card.innerHTML = `
            <p>${displayHour12} ${ampm}</p>
            <img src="https:${hour.condition.icon}" alt="${hour.condition.text}">
            <div class="temp">${Math.round(hour.temp_c)}°C</div>
            <div class="muted">${hour.chance_of_rain}%</div>
        `;
        
        hourlyContainer.appendChild(card);
    });
}

// Update daily forecast
function updateDailyForecast(dailyData) {
    dailyContainer.innerHTML = '';
    
    dailyData.forEach(day => {
        const date = new Date(day.date);
        const weekday = date.toLocaleDateString('en-US', { weekday: 'short' });
        
        const card = document.createElement('div');
        card.className = 'daily-card';
        card.innerHTML = `
            <p>${weekday}</p>
            <img src="https:${day.day.condition.icon}" alt="${day.day.condition.text}">
            <div class="temp-range">
                <span class="max-temp">${Math.round(day.day.maxtemp_c)}°C</span>
                <span class="min-temp">${Math.round(day.day.mintemp_c)}°C</span>
            </div>
            <div class="muted">${day.day.daily_chance_of_rain}% rain</div>
        `;
        
        dailyContainer.appendChild(card);
    });
}

// Update weather background based on condition
function updateWeatherBackground(conditionCode, isDay) {
    // Clear previous animations
    weatherAnimation.innerHTML = '';
    
    // Remove all background classes
    weatherBg.classList.remove('bg-sunny', 'bg-cloudy', 'bg-rainy', 'bg-snowy', 'bg-night');
    
    // Set background based on condition code and time of day
    if (!isDay) {
        weatherBg.classList.add('bg-night');
        createStars();
        return;
    }
    
    // Weather condition codes from WeatherAPI
    if (conditionCode === 1000) { // Sunny
        weatherBg.classList.add('bg-sunny');
        createSun();
        createClouds(2);
    } else if (conditionCode >= 1003 && conditionCode <= 1009) { // Cloudy
        weatherBg.classList.add('bg-cloudy');
        createClouds(5);
    } else if (conditionCode >= 1063 && conditionCode <= 1201) { // Rainy
        weatherBg.classList.add('bg-rainy');
        createClouds(4);
        createRain();
    } else if (conditionCode >= 1210 && conditionCode <= 1225) { // Snowy
        weatherBg.classList.add('bg-snowy');
        createClouds(3);
        createSnow();
    } else {
        weatherBg.classList.add('bg-default');
    }
}

// Create sun animation
function createSun() {
    const sun = document.createElement('div');
    sun.className = 'sun';
    weatherAnimation.appendChild(sun);
}

// Create cloud animations
function createClouds(count) {
    for (let i = 0; i < count; i++) {
        const cloud = document.createElement('div');
        cloud.className = `cloud cloud-${i+1}`;
        cloud.style.top = `${20 + i * 15}%`;
        cloud.style.left = `${Math.random() * 100}%`;
        cloud.style.animationDelay = `${Math.random() * 20}s`;
        weatherAnimation.appendChild(cloud);
    }
}

// Create rain animation
function createRain() {
    for (let i = 0; i < 60; i++) {
        const drop = document.createElement('div');
        drop.className = 'rain-drop';
        drop.style.left = `${Math.random() * 100}%`;
        drop.style.animationDelay = `${Math.random() * 2}s`;
        weatherAnimation.appendChild(drop);
    }
}

// Create snow animation
function createSnow() {
    for (let i = 0; i < 40; i++) {
        const flake = document.createElement('div');
        flake.className = 'snow-flake';
        flake.style.left = `${Math.random() * 100}%`;
        flake.style.animationDelay = `${Math.random() * 10}s`;
        weatherAnimation.appendChild(flake);
    }
}

// Create stars for night
function createStars() {
    for (let i = 0; i < 100; i++) {
        const star = document.createElement('div');
        star.className = 'star';
        star.style.left = `${Math.random() * 100}%`;
        star.style.top = `${Math.random() * 100}%`;
        star.style.animationDelay = `${Math.random() * 4}s`;
        weatherAnimation.appendChild(star);
    }
}

// Show/hide loader
function showLoader(show) {
    loader.style.display = show ? 'block' : 'none';
}

// Show error message
function showError(message) {
    errorText.textContent = message;
    errorMessage.classList.remove('hidden');
    errorMessage.classList.add('fade-in');
    
    // Hide weather cards when error is shown
    currentWeatherCard.classList.add('hidden');
    airQualityCard.classList.add('hidden');
    astronomyCard.classList.add('hidden');
    hourlyForecastSection.classList.add('hidden');
    dailyForecastSection.classList.add('hidden');
}

// Clear error message
function clearError() {
    errorMessage.classList.add('hidden');
}

// Initialize the app when DOM is loaded
document.addEventListener('DOMContentLoaded', init);