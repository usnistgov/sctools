(function() {
    'use strict';

    angular
        .module('app')
        .controller('HistoryCtrl', HistoryCtrl);

    /*
    * This Angular controller has the required wiring for the session log histry
    */  
    /* @ngInject */
    HistoryCtrl.$inject = ['UserRecords'];
    function HistoryCtrl(UserRecords) {
        /*jshint validthis: true */
        var vm = this;
        vm.title = 'HistoryCtrl';

        // access the record list
        vm.modifications = modifications;
        vm.currentMod = currentMod;
        vm.selectLog = selectLog;
        vm.dirtyList = dirtyList;

        // get the currently selected record
        function currentMod() {
            return UserRecords.focusRecord;
        }

        // sets the currently selected record
        function selectLog(uid) {
          UserRecords.focusID(uid);
        }

        // a getter for the modified records
        function dirtyList() {
            var ref =  UserRecords.dirtySubSet();
            return ref;
        }

        // a getter for the records
        function modifications() {
            return UserRecords.recordDict;
        }
    }
})();