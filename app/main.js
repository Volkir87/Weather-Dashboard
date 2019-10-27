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
    var cityURL = (`${baseURLCity}?${queryParam}=${city}&${appIDParam}=${apiKey}`); 
    var forecastURL = (`${baseURLForecast}?${queryParam}=${city}&${appIDParam}=${apiKey}`); //
    var cityInfo = {};
    var UVIInfo = {};

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
        console.log(result);
    });



})


