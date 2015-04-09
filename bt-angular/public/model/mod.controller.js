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
        vm.state = {

            id: null,
            status: null,
            guidance: null,
            rationale: null,
            enhanceMeasure: null,
            scopeMeasure: null
        }

        vm.modContains = modContains;
        vm.deleteMod = deleteMod;        
        vm.submitMod = submitMod;
        vm.modDelta = modDelta;
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
            UserRecords.registerFocusCallback( function() { 
                vm.state.id = UserRecords.focusRecord.uid;
                vm.state.status  = UserRecords.focusRecord.state;
                vm.state.guidance = UserRecords.focusRecord.comments.text;
                vm.state.rationale = UserRecords.focusRecord.comments.rationale;
                vm.state.enhanceMeasure = UserRecords.focusRecord.comments.link;
                vm.state.scopeMeasure = UserRecords.focusRecord.comments.link;
            });
            SecurityMeasuresJSON.func().success( function(data) {
                vm.data = data["controls:controls"]["controls:control"];
            });
        }

        // checks if the current modificaiton already has a record in the modification list
        function modContains() {
          return UserRecords.focusRecord.dirty;
        }

        // delete the current modification
        function deleteMod() {

            UserRecords.revertRecord(UserRecords.focusRecord.uid);

            vm.clearMod();
            // UserRecords.deleteRecord();
            // vm.dirty = false;
        }

        // submits the current record
        function submitMod() {
            UserRecords.changeRecord(vm.state.id,
                                     vm.state.status, 
                                     vm.state.guidance,
                                     vm.state.rationale,
                                     vm.state.enhanceMeasure);

            // UserRecords.submitRecord();
            // vm.dirty = false;
            // console.log(UserRecords.dirtySubSet());
        }

        function clearMod() {
            vm.state.scopeMeasure = '';
            vm.state.enhanceMeasure = '';
            vm.state.rationale = '';
            vm.state.guidance = '';
        }
        // checks if the status has been mutated in the form
        function modDelta() {
          if( vm.state.status != 'base' && vm.state.status != 'not' ) {
            return true;
          } else {
            return false;
          }
        }

        // returns a list of the id's of the compensating controls
        function getEnhance() {
            var list = [];
            var id = vm.state.scopeMeasure;
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
            vm.state.enhanceMeasure = vm.state.scopeMeasure;
        }

    }
})();