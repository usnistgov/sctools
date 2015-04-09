(function() {

    angular
        .module('app')
        .directive('historyItem', historyItem);

    /* @ngInject */
    function historyItem () {
        // Usage: This is used in the form-history ng-repeat.
        //
        // Creates: A box that shows a single change from UserRecords
        //
        var directive = {
            controller: controller,
            controllerAs: 'item',
            link: link,
            restrict: 'E',
            scope: {
                uid: "=",
            	modification: "="
            },
            templateUrl: 'layout/history-item-template.html'
          
        };
        return directive;

        function link(scope, element, attrs) {
        }

        function controller() {
            var vm = this;
            vm.collapse = collapse;
            vm.collapseEntry = collapseEntry;
            vm.glyphClass = 'glyphicon glyphicon-circle-arrow-left';

            // The following logic sets the glyphcon of the arrow that shows the collapse state
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