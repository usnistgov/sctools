(function() {
    'use strict';

    angular
        .module('app')
        .directive('historyItem', historyItem);

    /* @ngInject */
    function historyItem () {
        // Usage:
        //
        // Creates:
        //
        var directive = {
            controller: controller,
            controllerAs: 'item',
            link: link,
            restrict: 'E',
            scope: {
            	modification: "="
            },
            templateUrl: 'layout/history-item-template.html'
          
        };
        return directive;

        function link(scope, element, attrs) {
       
        	console.log("historyItem")
        }

        function controller() {
            var vm = this;
            vm.collapse = collapse;
            vm.collapseEntry = collapseEntry;
            vm.glyphClass = 'glyphicon glyphicon-circle-arrow-left';

            function collapse() {
                vm.glyphClass = vm.glyphClass==='glyphicon glyphicon-circle-arrow-left'?
                                'glyphicon glyphicon-circle-arrow-down':
                                'glyphicon glyphicon-circle-arrow-left';
            }
            function collapseEntry() {
                return vm.glyphClass==='glyphicon glyphicon-circle-arrow-down';
            }
        }
    }
})();