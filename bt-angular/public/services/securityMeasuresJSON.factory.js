(function() {
    'use strict';

    angular
        .module('app')
        .factory('SecurityMeasuresJSON', SecurityMeasuresJSON);

    /* @ngInject */
    /*
    * This factory handles the http requests that are being made with our server
    *
    */
    function SecurityMeasuresJSON($http) {
        var service = {
            func: func,
            getXML: getXML,
            jsonPromise: null
        };
        return service;

        ////////////////

        /*
        * A poorly named function (should be renamed) that queries our server for the json version of the SP800-53 security measures
        *
        * This file returns a promise instead of a javascript object (useful when conducting async operaions)
        */
        function func() {
	        if(service.jsonPromise) {
				return service.jsonPromise;
			} else {
				service.jsonPromise = $http.get("/json");
				return service.jsonPromise;
			}
        }

        function getXML(profile) {
            var xmlPromise = $http.post("/xml", profile);
            return xmlPromise;
        }
    }
})();