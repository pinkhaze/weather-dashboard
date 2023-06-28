const searchBtn = document.querySelector('.search-btn');
let cityInputEl = document.querySelector('#city-name');

let forecastCards = document.querySelectorAll('.day');

const apiKey = 'f2db296797ed76354316200166fc1172';

const formSubmitHandler = function (event) {
    event.preventDefault();

    let cityName = cityInputEl.value.trim();
    cityInputEl.value = '';
    fetchLatLong(cityName);
}

const fetchLatLong = function (city){
    const apiUrl = 'http://api.openweathermap.org/geo/1.0/direct?q=' + city + '&limit=1&appid=' + apiKey;
    console.log(apiUrl);

    fetch(apiUrl)
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            console.log(data);
            const lat = data[0].lat;
            const lon = data[0].lon;
            fetchWeather(lat, lon);
        })
}

function fetchWeather(lat, lon) {
    console.log(lat, lon);

    const apiUrl = 'https://api.openweathermap.org/data/2.5/forecast?lat=' + lat + '&lon=' + lon + '&appid=' + apiKey + '&units=imperial';

    fetch(apiUrl)
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            console.log(data);
            displayWeather(data);
        })
}

function displayWeather(data) {
   
}
searchBtn.addEventListener('click', formSubmitHandler);