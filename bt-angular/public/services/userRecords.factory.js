(function() {
    'use strict';

    angular
        .module('app')
        .factory('UserRecords', UserRecords);

    /* @ngInject */
    /*
    * This service manages the list of changes that the user makes against the security measure catalog
    */
    function UserRecords($filter) {

        ////////////////

        var service = {
            
            // config information
            profile: { name:'', baseline:''},
            

            recordDict: {},
            focusRecord: new Record(),
            focusID: focusID,
            initRecords: initRecords,
            revertRecord: revertRecord,
            changeRecord: changeRecord,
            setSysBaseline: setSysBaseline,
            dirtySubSet: dirtySubSet,
            registerFocusCallback: registerFocusCallback,


            // the record that is currently selected
            currentRecord: {
                        id:'',
                        status:'',
                        guidance:'',
                        rationale:'',
                        scopeMeasure:'',
                        enhanceMeasure:''
                    },
            // a object(used as a hash table) to bind the states (added, scoped, baseline, etc.) to the unique identifiers (AC-1, AC-2, etc.)
            lookup: {},
            // the array of records that the user has manipulated
            records: {},
            noEnhanceLookup: {}
        };
        return service;

        

        // Function that should be called as a constructor
        // Calling this without the 'new' keyword will yoeld unexpected behavior
        function Record( uid, state, dirty, baseline, family, priority, title ) {
            this.uid = uid;
            this.state = state;
            this.dirty = dirty?true:false;
            this.comments = {
                text:null,
                rationale:null,
                link:null
            };
            this.config = {
                baseline:baseline,
                family:family,
                priority:priority,
                title:title
            };
        }

        // Function that transforms the JSON data from the server into a client useful form
        function initRecords( data ) {

            for( var i = 0; i < data.length; i ++ ) {
                var temp = new Record( data[i].number[0],
                                       undefined,                                   
                                       false,    
                                       data[i]['baseline-impact'],
                                       data[i].family?data[i].family[0]:null,
                                       data[i].priority?data[i].priority[0]:null, 
                                       data[i].title?data[i].title[0]:null
                                       );

                service.recordDict[data[i].number[0]] = temp;
               
            }
        }

        // Check individual record against baseline
        function matchConfig( config, baseline) {
            for( var i = 0; i < service.profile.baseline.length; i ++ ) {
                if( config.baseline && config.baseline.indexOf( service.profile.baseline ) > -1 ) {
                    return 'base';
                }
            }
            return 'not';
        }

        // Function that initializes the state parameters of the records
        function setSysBaseline() {
            angular.forEach(service.recordDict, function(record) {
                record.state = matchConfig(record.config);
            });
        }

        // Returns weather or not the change was successful
        function changeRecord( uid, state, text, rationale, link ) {
            var ref = service.recordDict[uid];
            if(ref) {
                ref.state = state;
                ref.comments.text = text;
                ref.comments.rationale = rationale;
                ref.comments.link = link;
                ref.dirty = true;
                return true;
            }
            return false;
        }

        // Used for deleting purposes
        function revertRecord(uid) {
            var ref = service.recordDict[uid];
            if(ref) {
                service.recordDict[uid] = new Record(  
                            uid,
                            matchConfig(ref.config),
                            false,
                            ref.config.baseline,
                            ref.config.family,
                            ref.config.priority,
                            ref.config.title
                    );
                return true;
            }
            return false;
        }

        function focusID( uid ) {
            var ref = service.recordDict[uid];
            if(ref) {
                service.focusRecord = ref;
                if ( registerFocusCallback.prototype.callbacks ) {
                    angular.forEach( registerFocusCallback.prototype.callbacks,
                            function(callback) { callback(service.focusRecord); } );
                }
                return true;
            } else {
                return false;
            }
        } 

        function registerFocusCallback( callback ) {
            if( !registerFocusCallback.prototype.callbacks ) {
                registerFocusCallback.prototype.callbacks = [];
            }

            registerFocusCallback.prototype.callbacks.push(callback);

        }

        function dirtySubSet() {
            return $filter('dirtyFilter')(service.recordDict);
        }
        
    }
})();