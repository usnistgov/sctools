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
        vm.modifications = UserRecords.recordDict;
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

        function dirtyList() {
            var ref =  UserRecords.dirtySubSet();
            return ref;
        }

    }
})();