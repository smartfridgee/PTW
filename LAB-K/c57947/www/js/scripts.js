// Zmienne do API
const API_KEY = "68e40a8a06b7891cf568b88c0aa4863e";
const units = "metric";
const lang = "pl";

const loadDataViaXMLHttpRequest = (city) => {
    const xhr = new XMLHttpRequest();
    xhr.open("GET", `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=${units}&lang=${lang}`);
    xhr.onload = () => {
        if (xhr.status === 200) {
            const data = JSON.parse(xhr.responseText);
            console.debug("Data loaded via XMLHttpRequest:", data);
           fillCurrentWeather(data);
        } else {
            console.error("Failed to load data via XMLHttpRequest");
        }
    };
    xhr.onerror = () => {
        console.error("Network error while loading data via XMLHttpRequest");
    };
    xhr.send();
};

const fillCurrentWeather = (data) => {
    // Dane pogodowe
    const data_date_and_time = new Date(data.dt * 1000);
    const data_date = data_date_and_time.toLocaleString("pl-PL", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
    });
    const data_time = data_date_and_time.toLocaleString("pl-PL", {
        hour: "2-digit",
        minute: "2-digit"
    });
    const data_temp = data.main.temp.toFixed(0);
    const data_feels_like = data.main.feels_like.toFixed(0);
    const data_desc = data.weather[0].description.charAt(0).toUpperCase() + data.weather[0].description.slice(1);
    const data_icon = data.weather[0].icon;

    const currentWeatherDiv = document.querySelector(".current-weather");
    currentWeatherDiv.innerHTML = `
        <div class="weather-data">
            <div class="weather-data-section-1">
                <p class="weather-date">${data_date}</p>
                <p class="weather-city">${data.name}</p>
                <p class="weather-time">${data_time}</p>
            </div>
            <div class="weather-data-section-2">
                <p class="weather-temp">${data_temp}°C</p>
                <div class="weather-additional-info-container">
                    <p class="weather-temp-feels-like value">${data_feels_like}°C</p>
                    <p class="label">Odczuwalna</p>
                </div>
                <div class="weather-additional-info-container value">
                    <p class="weather-desc">${data_desc}</p>
                    <p class="label">Opis</p>
                </div>
            </div>
        </div>
        <div class="weather-icon-container">
            <img class="weather-icon" src="https://openweathermap.org/img/wn/${data_icon}@2x.png" alt="Weather Icon">
        </div>
    `;
};

const loadDataViaFetch = (city) => {
    fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${API_KEY}&units=${units}&lang=${lang}`)
        .then(response => {
            if (!response.ok) {
                throw new Error("Network response was not ok :( However it's okay to feel down sometimes, just remember that after the rain comes the rainbow! 🌈");
            }
            return response.json();
        })
        .then(data => {
            console.debug("Data loaded via Fetch API:", data);
            fillForecast(data);
        })
        .catch(error => {
            console.error("Failed to load data via Fetch API:", error);
        });
};

const fillForecast = (data) => {
    const forecastDiv = document.querySelector(".forecast-weather");
    forecastDiv.replaceChildren(); // Clear previous forecast

    data.list.forEach(item => {
        const item_date_and_time = new Date(item.dt * 1000);
        const item_date = item_date_and_time.toLocaleString("pl-PL", {
            weekday: "short",
            hour: "2-digit",
            minute: "2-digit"
        });
        const item_temp = item.main.temp.toFixed(0);
        const item_desc = item.weather[0].description.charAt(0).toUpperCase() + item.weather[0].description.slice(1);
        const item_icon = item.weather[0].icon;
        const item_feels_like = item.main.feels_like.toFixed(0);

        const forecastItemDiv = document.createElement("div");
        forecastItemDiv.classList.add("forecast-weather-item");
        forecastItemDiv.innerHTML = `
            <div class="forecast-weahter-section-1">
                <div>
                    <p class="forecast-weather-date">${item_date}</p>
                    <p class="forecast-weather-temp">${item_temp}°C</p>
                </div>
                <img class="forecast-weather-icon" src="https://openweathermap.org/img/wn/${item_icon}.png" alt="Weather Icon">
            </div>
            <div class="forecast-weahter-section-2">
                <p class="value">${item_feels_like}°C</p>
                <p class="label">Odczuwalna</p>
            </div>
            <div class="forecast-weahter-section-2">
                <p class="value">${item_desc}</p>
                <p class="label">Opis</p>
            </div>
        `;
        forecastDiv.appendChild(forecastItemDiv);
    });
}

const getWeatherData = () => {
    const inputField = document.getElementById("inputField");
    const city = inputField.value.trim();
    if (city) {
        loadDataViaXMLHttpRequest(city);
        loadDataViaFetch(city);
    } else {
        console.warn("Please enter a city name");
    }
};

document.getElementById("buttonix").addEventListener("click", getWeatherData);

window.onload = () => {
    loadDataViaXMLHttpRequest("Szczecin");
    // loadDataViaFetch("Szczecin");
};

(()=>{
    console.log("bruh");
})();