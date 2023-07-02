let cityInputEl = document.querySelector('#city-name');
const searchBtn = document.querySelector('.search-btn');
const clearBtn = document.querySelector('.clear-btn');
const savedContainer = document.querySelector('.searched')
const columnRight = document.querySelector('.col-right')
const currentCardLeft = document.querySelector('.current-left');
const currentCardRight = document.querySelector('.current-right');
let forecastCards = document.querySelectorAll('.card');

let searchArr = []; 
const apiKey = 'f2db296797ed76354316200166fc1172';

// Handle city search submission
function formSubmitHandler(event) {
    event.preventDefault();

    let city = cityInputEl.value.trim();
    // If empty input, stop function
    if (city === '') {
        return;
    }
    fetchLatLong(city);
    storeSearches(city);
    // Clear search input 
    cityInputEl.value = '';
}

// Fetch longitude and latitude values for search input from Geocoding API
function fetchLatLong(city) {
    const apiUrl = 'http://api.openweathermap.org/geo/1.0/direct?q=' + city + '&limit=1&appid=' + apiKey;

    fetch(apiUrl)
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            console.log(data);
            const lat = data[0].lat;
            const lon = data[0].lon;
            fetchCurrentWeather(lat, lon);
            fetchFutureWeather(lat, lon);
            columnRight.classList.remove('hidden');
        })
}

// Fetch current weather data from Current Weather Data API
function fetchCurrentWeather(lat, lon) {
    const apiUrl = 'https://api.openweathermap.org/data/2.5/weather?lat=' + lat + '&lon=' + lon + '&appid=' + apiKey + '&units=imperial'; 

    fetch(apiUrl)
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            displayCurrentWeather(data);
        })
}

// Fetch 5 day forecast data from 5 Day / 3 Hour Forecasst API
function fetchFutureWeather(lat, lon) {
    const apiUrl = 'https://api.openweathermap.org/data/2.5/forecast?lat=' + lat + '&lon=' + lon + '&appid=' + apiKey + '&units=imperial';

    fetch(apiUrl)
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            console.log(data);
            displayFutureWeather(data);
        })
}

// Dynamically generate current weather information and elements
function displayCurrentWeather(data) {
    // Clear contents
    currentCardRight.innerHTML = '';
    currentCardLeft.innerHTML = '';

    // City and current date
    const cityDate = data.name + '  ' + dayjs().format('MM/DD/YYYY');
    const cityDateEl = document.createElement('h4');
    cityDateEl.innerHTML = cityDate;

    // Icon representation of weather condition and alt description
    const currentIconEl = document.createElement('img');
    const currentIconCode = data.weather[0].icon;
    const currentIconDesc = data.weather[0].description;
    currentIconEl.setAttribute('src', 'https://openweathermap.org/img/wn/' + currentIconCode + '@2x.png');
    currentIconEl.setAttribute('alt', currentIconDesc);
    currentIconEl.classList.add('img-fluid', 'weather-icon');

    // Temperature
    const currentTempEl = document.createElement('p');
    currentTempEl.innerHTML = 'Temp: ' + data.main.temp + ' \u2109'; // unicode for degree Fahrenheit

    // Wind speed
    const currentWindEl = document.createElement('p');
    currentWindEl.innerHTML = 'Wind: ' + data.wind.speed + ' mph';

    // Humidity
    const currentHumidityEl = document.createElement("p");
    currentHumidityEl.innerHTML = 'Humidity: ' + data.main.humidity + ' %';

    currentCardLeft.append(cityDateEl, currentTempEl, currentWindEl, currentHumidityEl);
    currentCardRight.append(currentIconEl)
}

function displayFutureWeather(data) {
    const dayStartArr = [];
    let firstDayIndex;
    for (let i = 0; i < data.list.length; i++) {
        if (data.list[i].dt_txt.includes('00:00:00')) {
            dayStartArr.push(i);
            firstDayIndex = dayStartArr[0];
        }
    }

    for (let i = 0; i < forecastCards.length; i++) {
        // Clear input from all forecast cards
        forecastCards[i].innerHTML = '';
        // Dates
        // Split string into date and time substrings
        const dt_txtArr = data.list[firstDayIndex].dt_txt.split(' ', 1)
        const date = dt_txtArr[0];
        const dateEl = document.createElement('h4');
        dateEl.innerHTML = dayjs(date).format('MM/DD/YYYY');

        // Icon representations of weather condition and alt descriptions
        const iconEl = document.createElement('img');
        const iconCode = data.list[firstDayIndex].weather[0].icon;
        const iconDesc = data.list[firstDayIndex].weather[0].description;
        iconEl.setAttribute('src', 'https://openweathermap.org/img/wn/' + iconCode + '@2x.png');
        iconEl.setAttribute('alt', iconDesc);
        iconEl.classList.add('img-fluid', 'weather-icon');

        // Temperatures
        const tempEl = document.createElement('p');
        tempEl.innerHTML = 'Temp: ' + data.list[firstDayIndex].main.temp + ' \u2109';

        // Wind speeds
        const windEl = document.createElement('p');
        windEl.innerHTML = 'Wind: ' + data.list[firstDayIndex].wind.speed + ' mph';

        // Humidities
        const humidityEl = document.createElement("p");
        humidityEl.innerHTML = "Humidity: " + data.list[firstDayIndex].main.humidity + "%";

        // Skip to next index with a time of "00:00:00"
        firstDayIndex +=8;

        forecastCards[i].append(dateEl, iconEl, tempEl, windEl, humidityEl);
        }
}

// Save searches in local storage
function storeSearches(city) {
    // If search term already in array, stop function
    if (searchArr.includes(city)) {
        return;
    }
    // Otherwise, add search term to array
    searchArr.push(city);
    localStorage.setItem('searches', JSON.stringify(searchArr));
    renderSearches();
}

// Load searched cities as buttons
function renderSearches() {
    // Clear input
    savedContainer.innerHTML = '';
    for (let i = 0; i < searchArr.length; i++) {
        let searchedBtn = document.createElement('button');
        searchedBtn.classList.add('btn', 'searched-btn', 'text-uppercase', 'btn-history');
        searchedBtn.setAttribute('type', 'button');
        searchedBtn.setAttribute('search-term', searchArr[i]);
        searchedBtn.textContent = searchArr[i];
        savedContainer.append(searchedBtn);
    }
}

// Event listeners for search, searched and clear buttons
searchBtn.addEventListener('click', formSubmitHandler);



init();