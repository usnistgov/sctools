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
        vm.inherited = inherited;
        vm.inheritedTailoring = null; // the selected tailoring

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

            if(vm.inheritedTailoring) {
                return UserRecords.inheritedDict[vm.inheritedTailoring];
            } else {
                return UserRecords.recordDict;
            }
        }

        // returns the list of uploaded tailorings/overlays + the current record
        function inherited() {
            var ret = {this: UserRecords.recordDict};
            angular.forEach(UserRecords.inheritedDict, function(value, key) {
                ret[key] = value;
            });

            return ret;
        }
    }
})();