(function() {
    'use strict';

    angular
        .module('app')
        .filter('measureFilter', measureFilter);

    // This filter is used to return the controls and their enhancements as listed among the filtered controls

    /* @ngInject */
    function measureFilter(UserRecords) {
        return func;

        ////////////////


        // filters is a list of controls(ex: AC-2)
        function func(items, filters) {
        	var filtered = [];
            if(filters.length ===0) {
                return items;
            }
			angular.forEach(items, function(item) {
		 		if(filters.indexOf(item.uid) > -1 || filters.length === 0) {
				 	filtered.push(item);
                    if(item.config.enhancements) {
                        angular.forEach(item.config.enhancements, function(enhancement) {
                            var mold = UserRecords.recordDict[enhancement];
                            filtered.push(mold);
                        });
                    }
		 		}
			});
			return filtered;
        }
    }
})();