
function getDate() {
    let date = new Date();
    let days = ["Sunday", "Monday", "Tuesday","Wednesday","Thursday","Friday","Saturday"];
    let months = ["Jan", "Feb", "Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
    document.querySelector("#day").innerHTML=days[date.getDay()];
    document.querySelector("#current-date").innerHTML=`${date.getDate()} ${months[date.getMonth()]} ${date.getFullYear()}`;
}
function convertDate(date) {
    let dateUnix = new Date(date*1000);
    let days = ["Sun", "Mon", "Tue","Wed","Thu","Fri","Sat"];
    return days[dateUnix.getDay()];
}
function displayWeather(response) {
    document.querySelector("#city").innerHTML =`<i class="fa-solid fa-location-dot"></i> ${response.data.name}, ${response.data.sys.country}`;
    document.querySelector("#temperature").innerHTML=`${Math.round(response.data.main.temp)}°C`;
    document.querySelector("#weather-description").innerHTML=response.data.weather[0].main;
    document.querySelector("#humidity").innerHTML=`${response.data.main.humidity}%`;
    document.querySelector("#wind").innerHTML=`${Math.round(response.data.wind.speed)} km/h`;
    document.querySelector(".weather-today-icon").innerHTML=`<img src= "https://openweathermap.org/img/wn/${response.data.weather[0].icon}@2x.png" alt="${response.data.weather[0].main}">`;
    
    fetch(`https://api.pexels.com/v1/search?query=${response.data.weather[0].main}`,{
  headers: {
    Authorization: apiKeyPhoto
  }
})
   .then(resp => {
     return resp.json()
   })
   .then(data => {
     document.querySelector(".weather-today").style.backgroundImage = `url(${data.photos[Math.floor(Math.random() * 11)].src.original})`;
   });



}
function displayForecast(response) {
    let forecastHTML = "";
    let cnt=0;
    for(let i=6;cnt<5;i+=7) {
        forecastHTML+=`<div class="col">
        <div class="forecast-day">
            <div class="forecast-icon"><img src= "https://openweathermap.org/img/wn/${response.data.list[i].weather[0].icon}@2x.png" alt="${response.data.list[i].weather[0].main}"></div>
            <h3 class="forecast-day-of-week">${convertDate(response.data.list[i].dt)}</h3>
            <h3 class="forecast-temperature-of-day">${Math.round(response.data.list[i].main.temp)}°C</h3>
        </div>
    </div>`;
    document.querySelector(".row-forecast").innerHTML = forecastHTML;
    cnt++;
    }
}
function getWeatherByLocation(position) {
    let apiUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${position.coords.latitude}&lon=${position.coords.longitude}&appid=${apiKey}&units=metric`;
    let apiUrlForecast=`https://api.openweathermap.org/data/2.5/forecast?lat=${position.coords.latitude}&lon=${position.coords.longitude}&appid=${apiKey}&units=metric`;
    axios.get(apiUrl).then(displayWeather);
    axios.get(apiUrlForecast).then(displayForecast);
}
function searchCity(city) {
    let apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;
    let apiUrlForecast=`https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=metric`;
    axios.get(apiUrl).then(displayWeather);
    axios.get(apiUrlForecast).then(displayForecast);
}
function handleSubmit(event) {
    event.preventDefault();
    let inputCity = document.querySelector("#city-search-input");
    searchCity(inputCity.value);
    form.reset();
}
let form = document.querySelector(".location");
form.addEventListener("submit", handleSubmit);
let apiKey = "63116731662a94eebc651f7bb7447ea1";
let apiKeyPhoto = "563492ad6f91700001000001fad823e515b64ac2b496f68498c35bf4";

document.querySelector(".location-btn").addEventListener('click', async () => {
    navigator.geolocation.getCurrentPosition(getWeatherByLocation);
});
getDate();
searchCity("Kyiv");
