/*
api.js
Author: Kirill VOlodkin
Created date: 2019-10-26

This js script will use IIFE to create a simple model for api call.
The api "object" will take in url and method as parameters and return a JSON object
*/

var api = (function () {
    return {
        url: "",
        method: "",
        result: {},
        call: function (url, method) {
            this.url = url;
            this.method = method;
            return $.ajax({
                url: this.url,
                method: this.method
            });
        }
    }
})();
