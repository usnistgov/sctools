(function() {
    'use strict';

    angular
        .module('app')
        .factory('UserRecords', UserRecords);

    /* @ngInject */
    /*
    * This service manages the list of changes that the user makes against the security measure catalog
    */
    function UserRecords() {

        ////////////////

        var service = {
            // the record that is currently selected
            currentRecord: {
                        id:'',
                        status:'',
                        guidance:'',
                        rationale:'',
                        scopeMeasure:'',
                        enhanceMeasure:''
                    },
            // config information
            profile: { name:'', baseline:''},
            // the array of records that the user has manipulated
            records: {},
            // a object(used as a hash table) to bind the states (added, scoped, baseline, etc.) to the unique identifiers (AC-1, AC-2, etc.)
            lookup: {},
            noEnhanceLookup: {},
            getRecordById: getRecordById,
            setCurrById: setCurrById,
            submitRecord: submitRecord,
            deleteRecord: deleteRecord,
            deleteAll: deleteAll,
            setBase: setBase, 
            registerSelectCallback: registerSelectCallback,
            selectCallbacks: []
        };
        return service;

        

        // returns an element of the modification list based on its id or null
        function getRecordById(id) {
            if(id in service.records) {
                return service.records[id];
            } else {
                return null;
            }
        }

        /*
        * removes the current selected record from the 'records' array
        * returns the currentRecord to a boiler plate code
        *
        * TODO: Have currentRecord's new status (baseline or not-included) be set based on the json data
        */
        function deleteRecord() {
            if( service.lookup[service.currentRecord.id].baseline && service.lookup[service.currentRecord.id].baseline.indexOf(service.profile.baseline) > -1) {
                service.lookup[service.currentRecord.id].status = 'base';
            } else {
                service.lookup[service.currentRecord.id].status = 'not';
            }
            delete service.records[service.currentRecord.id];

            return service.currentRecord;
        }

        function deleteAll() {
            angular.forEach(service.records, function(key) {
                if( service.lookup[key.id].baseline && service.lookup[key.id].baseline.indexOf(service.profile.baseline) > -1) {
                    service.lookup[key.id].status = 'base';
                } else {
                    service.lookup[key.id].status = 'not';
                }
                delete service.records[key.id];
            });
        }

        /*
        * Changes the currentRecord to match an id
        * If an entry in the 'records' array contains the id, that record will be used
        * Otherwise a record will be created
        *
        * Angular.copy is used to prevent unwanted two-way databinding between the views in the display
        */
        function setCurrById(id) {
            service.currentRecord = angular.copy(service.currentRecord);
            var existingRecord = getRecordById(id);
            if(existingRecord !== null) { 
                service.currentRecord =  angular.copy(existingRecord);
            } else {
                service.currentRecord = {id:id,
                                status:service.lookup[id].status,
                                guidance:'',
                                rationale:'',
                                scopeMeasure:'',
                                enhanceMeasure:''
                            };
            }
            angular.forEach(service.selectCallbacks, function(callback) { callback(service.currentRecord); });
            return service.currentRecord;
                                                
        }

        /*
        * This function adds the current record to the 'records' array
        * It does a little error checking
        * If the security measure already exists in the 'records', that record will be changed
        */
        function submitRecord() {
            if((service.currentRecord.guidance.length > 0 || service.currentRecord.rationale.length > 0)) {
                var toPush = angular.copy(service.currentRecord);
                service.lookup[service.currentRecord.id].status = toPush.status;
                var existingRecord = getRecordById(service.currentRecord.id);
                if(existingRecord) {
                    existingRecord.id = toPush.id;
                    existingRecord.status = toPush.status;
                    existingRecord.guidance = toPush.guidance;
                    existingRecord.rationale = toPush.rationale;
                    existingRecord.scopeMeasure = toPush.scopeMeasure;
                    existingRecord.enhanceMeasure = toPush.enhanceMeasure;
                } else {
                    service.records[toPush.id] = toPush;
                }
            }
            return service.currentRecord;
        }

        /*
        * This function takes in the json data from the security measures and uses it along with the 'profile' data to initialize the states of the measures
        */
        function setBase(data) {
             for( var i = 0; i < data.length; i ++ ) {
                if(data[i]['baseline-impact'] && data[i]['baseline-impact'].indexOf(service.profile.baseline) > -1) {
                  if(service.records[data[i].number[0]] && service.records[data[i].number[0]].status == 'not') {
                       service.records[data[i].number[0]].status = 'base';
                  }
                  if(!service.lookup[data[i].number[0]] || service.lookup[data[i].number[0]].status === 'not') {
                    service.lookup[data[i].number[0]] = {status:'base', baseline:data[i]['baseline-impact']};  
                  }
                  if(!service.noEnhanceLookup[data[i].number[0]]) {
                    service.noEnhanceLookup[data[i].number[0]] = {status:'base', baseline:data[i]['baseline-impact']};
                  } 
                } else {
                  if (!service.lookup[data[i].number[0]] || service.lookup[data[i].number[0]].status === 'base') {
                    service.lookup[data[i].number[0]] = {status:'not', baseline:data[i]['baseline-impact']};
                  }
                  if(!service.noEnhanceLookup[data[i].number[0]]) {
                    service.noEnhanceLookup[data[i].number[0]] = {status:'not', baseline:data[i]['baseline-impact']};
                  } 
                  if(service.records[data[i].number[0]] && service.records[data[i].number[0]].status == 'base') {
                      service.records[data[i].number[0]].status = 'not';
                  }
                }
                if(data[i]['control-enhancements']) {
                    for( var j = 0; j < data[i]['control-enhancements'][0]['control-enhancement'].length; j ++ ) {
                        var item = data[i]['control-enhancements'][0]['control-enhancement'][j];
                        if(item['baseline-impact'] && item['baseline-impact'].indexOf(service.profile.baseline) > -1) {
                            if(service.records[item.number[0]] && service.records[data[i].number[0]].status == 'not') {
                                 service.records[item.number[0]].status = 'base';
                            }
                          
                          if(!service.lookup[item.number[0]] || service.lookup[item.number[0]].status === 'not') {
                            service.lookup[item.number[0]] = {status:'base', baseline:item['baseline-impact']};  
                          } 
                        } else {
                              if (!service.lookup[item.number[0]] || service.lookup[item.number[0]].status === 'base') {
                                service.lookup[item.number[0]] = {status:'not', baseline:item['baseline-impact']};
                              }
                              if(service.records[item.number[0]] && service.records[data[i].number[0]].status == 'base') {
                                 service.records[item.number[0]].status = 'not';
                              }
                        }

                    }
                }
            }  
        }

        function registerSelectCallback(callback) {
            service.selectCallbacks.push(callback);
        }

    }
})();