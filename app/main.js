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

$("#city_button").on("click", function () {
    city = $(this).text();
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
        console.log(cityInfo);
        var lon = cityInfo.coord.lon;
        var lat = cityInfo.coord.lat;
        var uviURL = (`${baseURLUvi}?${lonParam}=${lon}&${latParam}=${lat}&${appIDParam}=${apiKey}`);
        var promise = api.call(uviURL, "GET");
        promise.then(function(result){
            UVIInfo = result;
            console.log(UVIInfo);
        });
    });
    var promise = api.call(forecastURL, "GET");
    promise.then(function(result){
        forecastInfo = result;
        console.log(forecastInfo);
    });
}

function populateCurrentWeather (cityInfo, UVIInfo) {

}

function populateForecast (forecastInfo) {

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
    $("#saved_search").append(`<li class="list-group-item">${city}</li>`);
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