(function() {
    'use strict';

    angular
        .module('app')
        .filter('dirtyFilter', dirtyFilter);

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