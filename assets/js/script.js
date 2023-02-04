let searchedLocation = ''
let iconURL = (icon) =>`http://openweathermap.org/img/wn/${icon}.png`
let geoApiUrl = () => `http://api.openweathermap.org/geo/1.0/direct?q=${searchedLocation}&limit=1&appid=3bec968599042a39e37664de4f3463aa`
let weatherApiUrl = () => `http://api.openweathermap.org/data/2.5/forecast?${coordinates}&units=imperial&appid=3bec968599042a39e37664de4f3463aa`
let searchedLocationInput = document.querySelector('.searched-location')
let locationSearchButton = document.querySelector('.location-search-button')
let coordinates = ''
let currentWeather = document.querySelector('.current-container')
let forcastContainer = document.querySelector('.forcast-wrapper')
let searchHistory = []
let historyContainer = document.querySelector('.history-container')


locationSearchButton.addEventListener('click', () => getGeoApi(searchedLocationInput.value))
searchedLocationInput.addEventListener('keydown', (event) => {
    if(event.key === 'Enter'){
        getGeoApi(searchedLocationInput.value)
    }
})

retrieveCachedSearchHistory()

function onError(a){
    searchedLocationInput.setCustomValidity(`Invalid city name:
Please try again.`)
    searchedLocationInput.reportValidity()
}

function updateSearchHistory(search){
    let newArray = searchHistory.find(element => element === search)
    if(!newArray){
    searchHistory.unshift(search)}
}

function cacheSearchHistory(){
    localStorage.setItem('search-history', JSON.stringify(searchHistory))
}

function retrieveCachedSearchHistory(){
    if(localStorage.getItem('search-history'))
    searchHistory = JSON.parse(localStorage.getItem('search-history'))
    writeSearchHistory()
}

function checkResponseStatus(response){
    if(response.status){
        return response
    }
}

function getGeoApi(location){
    searchedLocationInput.value = ''
    searchedLocationInput.setCustomValidity('')
    searchedLocationInput.reportValidity()
    searchedLocation = location
    fetch(geoApiUrl())
        .then(checkResponseStatus)
        .then((response) => response.json())
        .then((data) => `lat=${data[0].lat}&lon=${data[0].lon}`)
        .then((data) => getWeatherApi(data))
        .catch(onError)
}

function getWeatherApi(data){
    coordinates = data
    fetch(weatherApiUrl())
        .then((response) => response.json())
        .then((data) => showWeather(data))
}

function showWeather(data) {
    console.log(data)
    clearDisplay()
    updateSearchHistory(data.city.name)
    let location = document.createElement('h1')
    location.textContent = data.city.name
    location.classList.add('text-2xl', 'font-bold')
    currentWeather.appendChild(location)
    writeWeatherData(data, 0, currentWeather)
    writeWeatherData(data, 4, forcastContainer)
    writeWeatherData(data, 12, forcastContainer)
    writeWeatherData(data, 20, forcastContainer)
    writeWeatherData(data, 28, forcastContainer)
    writeWeatherData(data, 36, forcastContainer)
    writeSearchHistory()
    cacheSearchHistory()
}

function writeWeatherData(data, hour, DOMlocation){
    let wrapper = document.createElement('div')
    wrapper.classList.add('border-2', 'border-gray-800', 'rounded-md', 'bg-slate-300', 'p-4')
    DOMlocation.appendChild(wrapper)
    let weatherIcon = document.createElement('img')
    weatherIcon.setAttribute('src', iconURL(data.list[0].weather[0].icon))
    wrapper.appendChild(weatherIcon)
    let currentTime = document.createElement('span')
    currentTime.textContent = dayjs.unix(data.list[hour].dt).format('MMM D, YYYY hh:mm a')
    currentTime.classList.add('text-lg', 'font-bold')
    wrapper.appendChild(currentTime)
    let currentTemp = document.createElement('p')
    currentTemp.textContent = `Temp: ${data.list[hour].main.temp}\u00B0F`
    wrapper.appendChild(currentTemp)
    let currentWind = document.createElement('p')
    currentWind.textContent = `Wind: ${data.list[hour].wind.speed} MPH`
    wrapper.appendChild(currentWind)
    let currentHumidity = document.createElement('p')
    currentHumidity.textContent = `Humidity: ${data.list[hour].main.humidity} %`
    wrapper.appendChild(currentHumidity)
}

function writeSearchHistory(){
    if(searchHistory.length > 0){
        searchHistory.forEach(city => {
            let button = document.createElement('button')
            button.textContent = city
            button.classList.add('px-2', 'py-1', 'rounded-md', 'px-2', 'py-1', 'border-2', 'hover:bg-slate-100', 'active:bg-orange-200')
            historyContainer.appendChild(button)
            button.addEventListener('click', () => getGeoApi(city))
        })
    }
}

function clearDisplay(){
    while(currentWeather.childElementCount != 0){
        currentWeather.removeChild(currentWeather.firstChild)}
    while(forcastContainer.childElementCount != 0){
        forcastContainer.removeChild(forcastContainer.firstChild)}
    while(historyContainer.childElementCount != 0){
        historyContainer.removeChild(historyContainer.firstChild)
    }

}