// app.js

const apiKey = '96f47e9de4494c31b33f8891380284ec'; // Replace with your OpenWeatherMap API key
const apiBaseUrl = 'https://api.openweathermap.org/data/2.5/';

async function fetchWeather(city) {
    const response = await fetch(`${apiBaseUrl}weather?q=${city}&appid=${apiKey}&units=metric`);
    if (response.ok) {
        return await response.json();
    } else {
        alert('City not found');
    }
}

async function fetchForecast(city) {
    const response = await fetch(`${apiBaseUrl}forecast?q=${city}&appid=${apiKey}&units=metric`);
    if (response.ok) {
        return await response.json();
    } else {
        alert('City not found');
    }
}

function updateCurrentWeather(cityData) {
    document.getElementById('cityName').innerText = cityData.name;
    document.getElementById('currentTemp').innerText = `${Math.round(cityData.main.temp)}°`;
    document.getElementById('currentCondition').innerText = cityData.weather[0].description;
    document.getElementById('highLow').innerText = `H: ${Math.round(cityData.main.temp_max)}° L: ${Math.round(cityData.main.temp_min)}°`;
    changeBackground(cityData.weather[0].main, cityData.weather[0].icon);
}

function changeBackground(weatherDescription, weatherIcon) {
    document.body.className = ''; // Reset any existing weather classes

    if (weatherIcon.includes('n')) {
        document.body.classList.add('night');
    } else {
        switch (weatherDescription.toLowerCase()) {
            case 'clear':
                document.body.classList.add('clear');
                break;
            case 'clouds':
                document.body.classList.add('cloudy');
                break;
            case 'rain':
            case 'drizzle':
                document.body.classList.add('rainy');
                break;
            case 'sun':
                document.body.classList.add('sunny');
                break;
            default:
                document.body.classList.add('clear');
                break;
        }
    }
}

function updateHourlyForecast(forecastData) {
    const hourlyForecastContainer = document.getElementById('hourlyForecast');
    hourlyForecastContainer.innerHTML = '';
    for (let i = 0; i < 8; i++) {
        const forecast = forecastData.list[i];
        const hourElem = document.createElement('div');
        hourElem.classList.add('hour');
        hourElem.innerHTML = `
            <p>${new Date(forecast.dt * 1000).getHours()}:00</p>
            <p>${Math.round(forecast.main.temp)}°</p>
            <p>${forecast.weather[0].description}</p>
        `;
        hourlyForecastContainer.appendChild(hourElem);
    }
}

function updateDailyForecast(forecastData) {
    const dailyForecastContainer = document.getElementById('dailyForecast');
    dailyForecastContainer.innerHTML = '';
    const dailyData = [];
    for (let i = 0; i < forecastData.list.length; i++) {
        const forecast = forecastData.list[i];
        const date = new Date(forecast.dt * 1000).toDateString();
        if (!dailyData.find(d => d.date === date)) {
            dailyData.push({
                date,
                temp: Math.round(forecast.main.temp),
                description: forecast.weather[0].description
            });
        }
    }
    dailyData.slice(0, 7).forEach(day => {
        const dayElem = document.createElement('div');
        dayElem.classList.add('day');
        dayElem.innerHTML = `
            <p>${day.date.split(' ')[0]}</p>
            <p>${day.temp}°</p>
            <p>${day.description}</p>
        `;
        dailyForecastContainer.appendChild(dayElem);
    });
}

function updateAdditionalInfo(cityData) {
    const additionalInfoContainer = document.getElementById('additionalInfo');
    additionalInfoContainer.innerHTML = '';
    const humidityElem = document.createElement('div');
    humidityElem.classList.add('info-item');
    humidityElem.innerHTML = `
        <h3>Humidity</h3>
        <p>${cityData.main.humidity}%</p>
    `;
    additionalInfoContainer.appendChild(humidityElem);

    const windElem = document.createElement('div');
    windElem.classList.add('info-item');
    windElem.innerHTML = `
        <h3>Wind Speed</h3>
        <p>${cityData.wind.speed} m/s</p>
    `;
    additionalInfoContainer.appendChild(windElem);

    const pressureElem = document.createElement('div');
    pressureElem.classList.add('info-item');
    pressureElem.innerHTML = `
        <h3>Pressure</h3>
        <p>${cityData.main.pressure} hPa</p>
    `;
    additionalInfoContainer.appendChild(pressureElem);
}

async function updateWeather(city) {
    const cityData = await fetchWeather(city);
    if (cityData) {
        updateCurrentWeather(cityData);
        updateAdditionalInfo(cityData);
    }
    const forecastData = await fetchForecast(city);
    if (forecastData) {
        updateHourlyForecast(forecastData);
        updateDailyForecast(forecastData);
    }
}

document.getElementById('searchButton').addEventListener('click', () => {
    const city = document.getElementById('searchInput').value;
    updateWeather(city);
});

document.getElementById('searchInput').addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        const city = document.getElementById('searchInput').value;
        updateWeather(city);
    }
});

// Initial load
updateWeather('Vadodara'); // You can set a default city
