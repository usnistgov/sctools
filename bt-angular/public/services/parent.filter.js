(function() {
    'use strict';

    angular
        .module('app')
        .filter('parentFilter', parentFilter);

    /* @ngInject */
    function parentFilter() {
        return func;

        ////////////////

        function func(items) {
        	var filtered = {};
            
			angular.forEach(items, function(value, key) {
		 		if( value.config.enhancements !== undefined ) {
                    filtered[key]=value;
                }
			});
            
			return filtered;
        }
    }
})();