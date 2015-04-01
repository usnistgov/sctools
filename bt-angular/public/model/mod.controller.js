(function() {
    'use strict';

    angular
        .module('app')
        .controller('ModCtrl', ModCtrl);

    /*
    * This angular controller provides the thin layer between the form-modifier.html page and our UserRecords
    */
    /* @ngInject */
    ModCtrl.$inject = ['UserRecords', 'SecurityMeasuresJSON'];
    function ModCtrl(UserRecords, SecurityMeasuresJSON) {
        /*jshint validthis: true */
        var vm = this;
        vm.title = 'ModCtrl';
        vm.dirty = false;
        vm.data = [];
        vm.modContains = modContains;
        vm.deleteMod = deleteMod;        
        vm.submitMod = submitMod;
        vm.modDelta = modDelta;
        vm.currentMod = currentMod;
        vm.lookup = UserRecords.noEnhanceLookup;
        vm.getEnhance = getEnhance;
        vm.unsetEnhance = unsetEnhance;
        vm.clearMod = clearMod;
        // this array sets the allowed operations (ex: a measure in the baseline can't be added to the baseline)
        vm.changeChart = {
          'base': {'base':true, 'scope':true, 'add':false, 'comp':false, 'not':false},
          'scope': {'base':true, 'scope':true, 'add':false, 'comp':false, 'not':false},
          'add': {'base':false, 'scope':false, 'add':true, 'comp':true, 'not':true},
          'comp': {'base':false, 'scope':false, 'add':true, 'comp':true, 'not':true},
          'not': {'base':false, 'scope':false, 'add':true, 'comp':true, 'not':true}
        };

        activate();
        
        function activate() {
            SecurityMeasuresJSON.func().success( function(data) {
                vm.data = data["controls:controls"]["controls:control"];
            })
        }

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
            vm.clearMod()
            UserRecords.deleteRecord();
            vm.dirty = false;
        }

        // submits the current record
        function submitMod() {
            UserRecords.submitRecord();
            vm.dirty = false;
        }

        function clearMod() {
            UserRecords.currentRecord.scopeMeasure = '';
            UserRecords.currentRecord.enhanceMeasure = '';
            UserRecords.currentRecord.rationale = '';
            UserRecords.currentRecord.guidance = '';
        }
        // checks if the status has been mutated in the form
        function modDelta() {
          if( UserRecords.currentRecord.status != 'base' && UserRecords.currentRecord.status != 'not' ) {
            return true;
          } else {
            return false;
          }
        }

        // returns a list of the id's of the compensating controls
        function getEnhance() {
            var list = [];
            var id = UserRecords.currentRecord.scopeMeasure;
            angular.forEach(vm.data, function(record) {
                if(record.number[0] === id && record['control-enhancements'] &&
                                              record['control-enhancements'][0] &&
                                              record['control-enhancements'][0]['control-enhancement']) {
                    angular.forEach(record['control-enhancements'][0]['control-enhancement'], function(enhancement) {
                        list.push(enhancement.number[0]);
                    });
                }
            });
            return list;
        }

        // A hackyway of transitioning between the enhanceMeasure and scopeMeasure fields of the currentRecord
        function unsetEnhance() {
            UserRecords.currentRecord.enhanceMeasure = UserRecords.currentRecord.scopeMeasure;
        }

    }
})();