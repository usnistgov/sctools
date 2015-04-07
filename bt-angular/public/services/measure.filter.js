(function() {
    'use strict';

    angular
        .module('app')
        .filter('measureFilter', measureFilter);

    /* @ngInject */
    function measureFilter() {
        return func;

        ////////////////

        function func(items, filters) {
        	var filtered = [];
            if(filters.length ===0) {
                return items;
            }
			angular.forEach(items, function(item) {
		 		if(filters.indexOf(item) > -1 || filters.length === 0) {
				 	filtered.push(item);
                    if(item['control-enhancements']) {
                        angular.forEach(item['control-enhancements'][0]['control-enhancement'], function(enhancement) {
                            var mold = angular.copy(enhancement);
                            mold.family = [item.family[0]];
                            mold.priority = [item.priority[0]];
                            filtered.push(mold);
                        });
                    }
		 		}
			});
			return filtered;
        }
    }
})();