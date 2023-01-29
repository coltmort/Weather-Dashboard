const dayjs = require('dayjs')
//import dayjs from 'dayjs' // ES 2015
dayjs().format()

let searchedLocation = ''
let geoApiUrl = () => `http://api.openweathermap.org/geo/1.0/direct?q=${searchedLocation}&limit=1&appid=3bec968599042a39e37664de4f3463aa`
let weatherApiUrl = () => `http://api.openweathermap.org/data/2.5/forecast?${coordinates}&units=imperial&appid=3bec968599042a39e37664de4f3463aa`
let searchedLocationInput = document.querySelector('.searched-location')
let locationSearchButton = document.querySelector('.location-search-button')
let coordinates = ''
let currentWeather = document.querySelector('.current-container')
let forcastContainer = document.querySelector('.current-forecast')

locationSearchButton.addEventListener('click', getGeoApi)



function getGeoApi(){
    searchedLocation = searchedLocationInput.value
    fetch(geoApiUrl())
        .then((response) => response.json())
        .then((data) => `lat=${data[0].lat}&lon=${data[0].lon}`)
        .then((data) => getWeatherApi(data))
}

function getWeatherApi(data){
    coordinates = data
    fetch(weatherApiUrl())
        .then((response) => response.json())
        .then((data) => showWeather(data))
}

function showWeather(data) {
    let location = document.createElement('h1')
    location.textContent = data.city.name
    location.classList.add('text-2xl', 'font-bold')
    currentWeather.appendChild(location)
}