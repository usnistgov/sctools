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
        vm.dirty = false;
        vm.data = [];
        vm.state = {

            id: null,
            status: null,
            guidance: null,
            rationale: null,
            enhanceMeasure: null,
            scopeMeasure: null
        };

        vm.modContains = modContains;
        vm.deleteMod = deleteMod;        
        vm.submitMod = submitMod;
        vm.modDelta = modDelta;
        vm.getEnhance = getEnhance;
        vm.unsetEnhance = unsetEnhance;
        vm.clearMod = clearMod;
        vm.recordDict = recordDict;
        vm.inherited = inherited;
        vm.inheritedTailoring = [];
        vm.inheritMeasure = inheritMeasure;
        vm.inheritedDict = UserRecords.inheritedDict;

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
                vm.inheritedTailoring = UserRecords.focusRecord.inherit?UserRecords.focusRecord.inherit:[];
                vm.state.id = UserRecords.focusRecord.uid;
                vm.state.status  = UserRecords.focusRecord.state;
                vm.state.guidance = UserRecords.focusRecord.comments.text;
                vm.state.rationale = UserRecords.focusRecord.comments.rationale;
                vm.state.enhanceMeasure = UserRecords.focusRecord.comments.link;
                vm.state.scopeMeasure = UserRecords.focusRecord.comments.link;
            });
        }

        // checks if the current modificaiton already has a record in the modification list
        function modContains() {
          return UserRecords.focusRecord.dirty;
        }

        // delete the current modification
        function deleteMod() {

            UserRecords.revertRecord(UserRecords.focusRecord.uid);
            UserRecords.focusID(UserRecords.focusRecord.uid);
            vm.clearMod();
            // UserRecords.deleteRecord();
            // vm.dirty = false;
        }

        // submits the current record
        function submitMod() {

                UserRecords.focusRecord.inherit = vm.inheritedTailoring;
            UserRecords.changeRecord(vm.state.id,
                                     vm.state.status, 
                                     vm.state.guidance,
                                     vm.state.rationale,
                                     vm.state.enhanceMeasure);

            if(vm.inheritedTailoring) {
                // var parentRecord = UserRecords.inheritedDict[vm.inheritedTailoring][UserRecords.focusRecord.uid];
                
                // UserRecords.inheritRecord(parentRecord, UserRecords.inheritedDict[vm.inheritedTailoring]);
            }
            // UserRecords.submitRecord();
            // vm.dirty = false;
            // console.log(UserRecords.dirtySubSet());
        }

        function clearMod() {
            vm.state.scopeMeasure = '';
            vm.state.enhanceMeasure = '';
            vm.state.rationale = '';
            vm.state.guidance = '';
            vm.inheritedTailoring = [];
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
            if(vm.state.scopeMeasure &&
               UserRecords.recordDict &&
               UserRecords.recordDict[vm.state.scopeMeasure] && 
               UserRecords.recordDict[vm.state.scopeMeasure].config.enhancements !== undefined ) {
                return UserRecords.recordDict[vm.state.scopeMeasure].config.enhancements;
            } else {
                return null;
            }
        }

        // A hackyway of transitioning between the enhanceMeasure and scopeMeasure fields of the currentRecord
        function unsetEnhance() {
            vm.state.enhanceMeasure = vm.state.scopeMeasure;
        }

        // a getter for the records
        function recordDict() {
            return UserRecords.recordDict;
        }


        function inherited() {
            if(!UserRecords.focusRecord.uid) {
                return {};
            }
            var focusid = UserRecords.focusRecord.uid
            var ret = UserRecords.inheritedDict;
            var filtered = {};
            angular.forEach(ret, function(value, key) {
                if(value[focusid] && value[focusid].dirty) {
                    filtered[key] = value;
                }
            })
            return filtered;
        }

        function inheritMeasure() {
            // if(vm.inheritedTailoring) {
            //     var parentRecord = UserRecords.inheritedDict[vm.inheritedTailoring][UserRecords.focusRecord.uid];
                
            //     vm.state.status = parentRecord.state;
            //     vm.state.scopeMeasure = parentRecord.comments.link;
            //     vm.state.enhanceMeasure = parentRecord.comments.link;
            //     vm.state.rationale = parentRecord.comments.rationale;
            //     vm.state.guidance = parentRecord.comments.text;

                
            // } else {

            //     vm.state.status  = UserRecords.focusRecord.state;
            //     vm.state.guidance = UserRecords.focusRecord.comments.text;
            //     vm.state.rationale = UserRecords.focusRecord.comments.rationale;
            //     vm.state.enhanceMeasure = UserRecords.focusRecord.comments.link;
            //     vm.state.scopeMeasure = UserRecords.focusRecord.comments.link;

            // }
        }


    }
})();