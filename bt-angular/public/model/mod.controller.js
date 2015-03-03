(function() {
    'use strict';

    angular
        .module('app')
        .controller('ModCtrl', ModCtrl);

    /*
    * This angular controller provides the thin layer between the form-modifier.html page and our UserRecords
    */
    /* @ngInject */
    ModCtrl.$inject = ['UserRecords'];
    function ModCtrl(UserRecords) {
        /*jshint validthis: true */
        var vm = this;
        vm.title = 'ModCtrl';
        
        vm.modContains = modContains;
        vm.deleteMod = deleteMod;        
        vm.submitMod = submitMod;
        vm.modDelta = modDelta;
        vm.currentMod = currentMod;

        // this array sets the allowed operations (ex: a measure in the baseline can't be added to the baseline)
        vm.changeChart = {
          'base': {'base':true, 'scope':true, 'add':false, 'comp':false, 'not':false},
          'scope': {'base':false, 'scope':true, 'add':false, 'comp':false, 'not':false},
          'add': {'base':false, 'scope':false, 'add':true, 'comp':false, 'not':false},
          'comp': {'base':false, 'scope':false, 'add':false, 'comp':true, 'not':false},
          'not': {'base':false, 'scope':false, 'add':true, 'comp':true, 'not':true}
        };

        // gets the current record
        function currentMod() {
            return UserRecords.currentRecord;
        }

        // checks if the current modificaiton already has a record in the modification list
        function modContains() {
          return UserRecords.getRecordById(UserRecords.currentRecord.id) === null;
        }

        // delete the current modification
        function deleteMod() {
            UserRecords.deleteRecord();
        }

        // submits the current record
        function submitMod() {
            UserRecords.submitRecord();
        }

        // checks if the status has been mutated in the form
        function modDelta() {
          if( vm.currentMod().status === vm.currentMod().prior) {
            return false;
          } else {
            return true;
          }
        }

    }
})();