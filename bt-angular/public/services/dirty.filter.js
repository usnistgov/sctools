(function() {
    'use strict';

    angular
        .module('app')
        .filter('dirtyFilter', dirtyFilter);

    // This filter returns all of the controls that have been modified from their defaults

    /* @ngInject */
    function dirtyFilter() {
        return func;

        ////////////////

        function func(items) {
        	var filtered = {};
            
			angular.forEach(items, function(value, key) {
		 		if( value.dirty ) {
                    filtered[key]=value;
                }
			});
            
			return filtered;
        }
    }
})();