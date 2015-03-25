(function() {
    'use strict';

    angular
        .module('app')
        .controller('ProfileCtrl', ProfileCtrl);

    /*
    * This Angular controller is used to set the initial base-line and title of the overlay/tayloring being developed
    * This controller will eventually be involved in querying and serving XML files
    */
    /* @ngInject */
    ProfileCtrl.$inject = ['UserRecords', 'SecurityMeasuresJSON', '$mdSidenav', '$upload'];
    function ProfileCtrl(UserRecords, SecurityMeasuresJSON, $mdSidenav, $upload) {
        /*jshint validthis: true */
        var vm = this;

        vm.setBase = setBase;
        vm.linkXML = linkXML;
        vm.fileSelect = fileSelect;

        vm.data = {};
        vm.title = 'ProfileCtrl';
        vm.file = {};
        vm.filePast = '';
        vm.overlay = UserRecords.profile;


        activate();
        
        function activate() {
            SecurityMeasuresJSON.func().success( function(data) {
                vm.data = data["controls:controls"]["controls:control"];
            })
        }

        function setBase() {
          UserRecords.setBase(vm.data);
        }

        function linkXML() {
            SecurityMeasuresJSON.getXML(UserRecords.records).success( function(data) {
                console.log(data);

                // following section found at: http://stackoverflow.com/questions/20300547/download-csv-file-from-web-api-in-angular-js
                var hiddenElement = document.createElement('a');

                hiddenElement.href = 'data:attachment/text,' + encodeURI(data);
                hiddenElement.target = '_blank';
                hiddenElement.download = 'SP80053.xml';
                hiddenElement.click();
            })
        }

        function fileSelect() {
            if( !vm.file || !vm.file[0] || (vm.filePast === vm.file[0].name) ) {
                return;
            }
            console.log(vm.file[0].name);
            console.log(UserRecords.lookup);
            $upload.upload({url: 'upload', file:vm.file})
                    .success(function(data, status, headers) {
                    UserRecords.deleteAll();
                    angular.forEach(data.root.node, function(element) {
                        var toAdd = {};
                        toAdd.guidance = element.guidance[0];
                        toAdd.id = element.id[0];
                        toAdd.rationale = element.rationale[0];
                        toAdd.scopeMeasure = element.scopeMeasure[0];
                        toAdd.status = element.status[0];
                        UserRecords.lookup[toAdd.id].status = toAdd.status;
                        UserRecords.records[toAdd.id] = toAdd;
                    });
                });
                vm.filePast = angular.copy(vm.file[0].name);
        }
        

    }
})();