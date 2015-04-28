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
            profile: { name:'', baseline:''},   // session information  
            inheritedDict: {},                  // list of uploaded dictionairies
            addInherited: addInherited,         // function that adds to inheritedDict
            overlays: [],                       // list of uploaded dictionaires that are overlays
            Record: Record,                     // constructor function
            
            recordDict: {},                     // list of 80053 controls and changes (Used Constantly)
            
            focusRecord: new Record(),          // the currently selected record
            focusID: focusID,                   // function that changes the focus record
            initRecords: initRecords,           // function that sets recordDict
            revertRecord: revertRecord,         // function that removes a change
            changeRecord: changeRecord,         // function that adds a change
            setSysBaseline: setSysBaseline,     // function that updates recordDict for the baseline
            dirtySubSet: dirtySubSet,           // function that returns changed records
            parentSubSet: parentSubSet,         // function that returns all non-enhancement records
            registerFocusCallback: registerFocusCallback,   // function that registers a function to be called on focusId
            inheritRecord: inheritRecord,       // function that adds a dictionairy to a records inherit list
            applyOverlays: applyOverlays        // function that incorporates overlays into the tailoring

        };
        return service;

        

        // Function that should be called as a constructor
        // Calling this without the 'new' keyword will yoeld unexpected behavior
        function Record( uid, state, dirty, baseline, family, priority, title , enhancements, merge) {
            this.uid = uid;
            this.state = state;
            this.dirty = dirty?true:false;
            this.mergeConflict = merge;
            this.comments = {
                text:null,
                rationale:null,
                link:null
            };
            this.config = {
                baseline:baseline,
                family:family,
                priority:priority,
                title:title,
                enhancements:enhancements
            };
        }

        // Setter for recordDict
        function initRecords( data ) {
            service.recordDict = data;

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
                if(!record.dirty) {
                    record.state = matchConfig(record.config);
                }
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
                            ref.config.title,
                            ref.config.enhancements,
                            ref.mergeConflict>0?ref.mergeConflict-1:0
                    );
                return true;
            }
            return false;
        }

        // Sets the focus record
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

        // Function that creates a call back chain for when an ID is focused (i.e. on selection)
        function registerFocusCallback( callback ) {
            if( !registerFocusCallback.prototype.callbacks ) {
                registerFocusCallback.prototype.callbacks = [];
            }

            registerFocusCallback.prototype.callbacks.push(callback);

        }

        // Returns a list of the records that have been modified
        function dirtySubSet() {
            return $filter('dirtyFilter')(service.recordDict);
        }

        // Returns a list of the records that have been modified
        function parentSubSet() {
            return $filter('parentFilter')(service.recordDict);
        }

        // This will add a dictionairy to the list of uploaded xml-forms
        function addInherited(dictionairy) {
            service.inheritedDict[dictionairy.profile.name] = dictionairy;
        }

        // This function adds an inherited dictionairy to the session's record's inherited list
        function inheritRecord(item, dictionairy) {
            if(service.recordDict[item.uid].inherit && service.recordDict[item.uid].inherit.indexOf(dictionairy.profile.name) > -1) {
                return; // if this record has already inherited this tailoring
            }
             if(service.recordDict[item.uid].inherit) {
                service.recordDict[item.uid].inherit.push(dictionairy.profile.name);
            } else {
                service.recordDict[item.uid].inherit = [dictionairy.profile.name];
            }
        }


        // This function will handle merging overlays into the tailoring
        // This function does a first come first serve collision strategy
        // May not deal with multiple inheritance in the desired way
        function applyOverlays( passedOverlays ) {
            // found at http://stackoverflow.com/questions/11704509/function-that-returns-difference-of-two-arrays-of-strings-in-javascript
            function diff(A, B) {
                return B.filter(function (a) {
                    return A.indexOf(a) == -1;
                });
            }

            if(!applyOverlays.prototype.overlays) {
                applyOverlays.prototype.overlays = [];
            }

            // these are the recently removed overlays
            angular.forEach(diff(passedOverlays, applyOverlays.prototype.overlays), function(overlay) {
                angular.forEach(service.inheritedDict[overlay], function(value, key) {
                    var thisRecord = service.recordDict[key];

                    if(!thisRecord) {
                        // not a record
                    } else if(thisRecord.mergeConflict === 1) {
                        thisRecord.state = 'not';
                        service.revertRecord(thisRecord.uid);


                        angular.forEach(passedOverlays, function(suboverlay) {
                            var value = service.inheritedDict[suboverlay][thisRecord.uid];

                            if(value) {
                                 service.changeRecord(value.uid,
                                     value.state, 
                                     value.comments.guidance,
                                     value.comments.rationale,
                                     value.comments.enhanceMeasure);
                                service.recordDict[key].dirty = value.dirty;
                            }
                        });
                    } else {
                        service.revertRecord(thisRecord.uid);
                   }
                });
            });


            // these are the newly added overlays
            angular.forEach(diff(applyOverlays.prototype.overlays, passedOverlays), function(overlay) {

                //service.profile.baseline = service.inheritedDict[overlay].profile.baseline;
                angular.forEach(service.inheritedDict[overlay], function(value, key) {

                    var thisRecord = service.recordDict[key];
                    if(!thisRecord) {
                        // not a record
                    } else if( (thisRecord.state == 'scope' && (value.state == 'base' || value.state == 'add' || value.state == 'comp')) ||
                        (value.state == 'scope' && (thisRecord.state == 'base' || thisRecord.state == 'add' || thisRecord.state == 'comp')) || 
                        (value.dirty && thisRecord.dirty) ) {
                        // conflict
                        thisRecord.mergeConflict ++;
                    } else {
                        service.changeRecord(value.uid,
                                     value.state, 
                                     value.comments.guidance,
                                     value.comments.rationale,
                                     value.comments.enhanceMeasure);
                        service.recordDict[key].dirty = value.dirty;
                    }
                });
            });
            //service.setSysBaseline();

            applyOverlays.prototype.overlays = angular.copy(passedOverlays);

            service.overlays = passedOverlays;
        }

    }
})();