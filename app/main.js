/*
main.js
Author: Kirill Volodkin
Created date: 2019-10-26

This js script will manage user interaction with the page.
It will include: searching for weather, saving the search results to the local storage and retrieving 
them on page reload, displaying the results. 
*/

var baseURLCity = "http://api.openweathermap.org/data/2.5/weather";
var baseURLUvi = "http://api.openweathermap.org/data/2.5/uvi"
var baseURLForecast = "http://api.openweathermap.org/data/2.5/forecast";
var baseURLIcon = "http://openweathermap.org/img/wn/";
var urlIconSuffix = "@2x.png";
var apiKey = "0f6e2259330e30a75efb14a4aaa515ba";
var appIDParam = "APPID";
var queryParam = "q";
var latParam = "lat";
var lonParam = "lon";
var countParam = "cnt";
var count = 5;
var city = "";

// button listener
$("#search_button").on("click", function () {
    city = $("#city_input").val();
    saveCitySearch(city);
    getCityInfo(city);
});

function getCityInfo (city) {
    var cityURL = (`${baseURLCity}?${queryParam}=${city}&${appIDParam}=${apiKey}`); 
    var forecastURL = (`${baseURLForecast}?${queryParam}=${city}&${appIDParam}=${apiKey}`);
    var cityInfo = {};
    var UVIInfo = {};
    var forecastInfo = {};
    var promise = api.call(cityURL, "GET"); //make API call, then get the current results and make another one for UVI
    promise.then(function(result){
        cityInfo = result;
        var lon = cityInfo.coord.lon;
        var lat = cityInfo.coord.lat;
        var uviURL = (`${baseURLUvi}?${lonParam}=${lon}&${latParam}=${lat}&${appIDParam}=${apiKey}`);
        var promise = api.call(uviURL, "GET");
        promise.then(function(result){
            UVIInfo = result;
            populateCurrentWeather (cityInfo, UVIInfo);
        });
    });
    var promise = api.call(forecastURL, "GET");
    promise.then(function(result){
        forecastInfo = result;
        populateForecast (forecastInfo);
    });
}

function populateCurrentWeather (cityInfo, UVIInfo) {
    var cityName = cityInfo.name;
    var date = moment.unix(cityInfo.dt).format("MM/DD/YYYY");
    var temp = Math.round((cityInfo.main.temp - 273.15),0); //converting from Kalvins to Celsius
    var humidity = cityInfo.main.humidity + "%";
    var windSpeed = cityInfo.wind.speed;
    var uvi = UVIInfo.value;
    var icon = cityInfo.weather[0].icon;
    $("#city_name").text(`${cityName} ${date}`);
    $("#city_name").append($("<img>").attr("src",`${baseURLIcon}${icon}${urlIconSuffix}`));
    $("#temp").text(`Temperature: ${temp}°C`);
    $("#hum").text(`Humidity: ${humidity}`);
    $("#wind").text(`Wind Speed: ${windSpeed} m/s`);
    $("#uvi").text(`${uvi}`);
    uvi < 3 ? $("#uvi").attr("class", "badge badge-pill badge-success") : (
        uvi < 8 ? $("#uvi").attr("class", "badge badge-pill badge-warning") 
        : $("#uvi").attr("class", "badge badge-pill badge-danger")
    );
}

function populateForecast (forecastInfo) {
    var points = [4, 12, 20, 28, 36]; // getting info only as of 12:00 PM every day
    for (i in points) {
        var cardID = "forecast_"+(parseInt(i)+1);
        var date = moment.unix(forecastInfo.list[points[i]].dt).format("MM/DD/YYYY");
        var temp = Math.round((forecastInfo.list[points[i]].main.temp - 273.15),0);
        var humidity = forecastInfo.list[points[i]].main.humidity + "%";
        var icon = forecastInfo.list[points[i]].weather[0].icon;
        $(`#${cardID}`).children(".f_city_name").text(date);
        $(`#${cardID}`).children(".f_temp").text(`Temp: ${temp}°C`);
        $(`#${cardID}`).children(".f_hum").text(`Humidity: ${humidity}`);
        $(`#${cardID}`).children(".f_image").children("img").remove(); //clear up existing image
        $(`#${cardID}`).children(".f_image").append($("<img>").attr("src",`${baseURLIcon}${icon}${urlIconSuffix}`));
    }
}

function saveCitySearch (city) {
    citiesList = loadFromLocalStorage("cities");
    if (citiesList) {
        for (c of citiesList) {
            if (c.name === city) { // this part will exit the function, if this city has been already saved before
                return; 
            }
        }
    }
    appendCity(city);
    cityObj = {name: city};
    updateLocalStorage("cities", cityObj);
}

function updateLocalStorage (key, newItem) {
    storedItem = JSON.parse(window.localStorage.getItem(key));
    if (!storedItem) {
        storedItem = [newItem];
    }
    else {
        storedItem.push(newItem);
    }
    window.localStorage.setItem(key, JSON.stringify(storedItem));
}

function loadFromLocalStorage (key) { 
    storedItem = JSON.parse(window.localStorage.getItem(key));
    if (!storedItem) {
        return;
    }
    else {
        return storedItem;
    }
}

function appendCity (city) {
    $("#saved_search").append(`<li class="list-group-item city_button" id="city_${city}">${city}</li>`);
    $("li[id^='city_']").unbind().click(function () { //had to use .unbind for the event to fire only once
        city = $(this).text();
        getCityInfo(city);
        //console.log(`calling a city_button for ${city}`);
    });
}

function preLoadSearchHistory () {
    citiesList = loadFromLocalStorage("cities");
    if (!citiesList) {
        return;
    }
    else {
        for (c of citiesList) {
            appendCity(c.name);
        }
    }
}

preLoadSearchHistory();

// results.list. 4, 12, 20, 28, 36 .main.temp (.main.humidity), .weather.0.icon .dt