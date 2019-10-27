/*
main.js
Author: Kirill Volodkin
Created date: 2019-10-26

This js script will manage user interaction with the page.
It will include: searching for weather, saving the search results to the local storage and retrieving 
them on page reload, displaying the results. 
*/

var baseURL = "https://api.openweathermap.org/data/2.5/weather";
var apiKey = "0f6e2259330e30a75efb14a4aaa515ba";
var appIDParam = "APPID";
var queryParam = "q";
var city = "London";

var URL = (`${baseURL}?${queryParam}=${city}&${appIDParam}=${apiKey}`); 
console.log(URL);

function responseHandler(result) {
    return result;
}

var promise = api.call(URL, "GET");

promise.then(function(result){
    console.log(result);
})
