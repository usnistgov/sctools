(function() {
    'use strict';

    angular
        .module('app')
        .filter('familyFilter', familyFilter);

    /* @ngInject */
    function familyFilter() {
        return func;

        ////////////////

        function func(items, filters) {
        	var filtered = [];
			angular.forEach(items, function(item) {
		 		if(filters.indexOf(item.family[0]) > -1 || filters.length === 0) {
				 	filtered.push(item);
		 		}
			})
			return filtered;
        }
    }
})();