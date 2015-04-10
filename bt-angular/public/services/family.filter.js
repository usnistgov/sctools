(function() {
    'use strict';

    angular
        .module('app')
        .filter('familyFilter', familyFilter);

    // This filter is used to select all controls that match a certain familyy

    /* @ngInject */
    function familyFilter() {
        return func;

        ////////////////

        function func(items, filters) {
        	var filtered = [];
			angular.forEach(items, function(item) {
		 		if(filters.indexOf(item.config.family) > -1 || filters.length === 0) {
				 	filtered.push(item);
		 		}
			});
			return filtered;
        }
    }
})();