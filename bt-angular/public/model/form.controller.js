(function() {
    'use strict';

    angular
        .module('app')
        .controller('FormCtrl', FormCtrl);

    /* @ngInject */
    /*
    * This is the Angular controller for the entire view. It currently has no assigned actions
    */
    function FormCtrl() {
        /*jshint validthis: true */   

        var vm = this;

        activate();
        
        function activate() {
            console.log("Welcome to the Overlayer");
        }

    }
})();