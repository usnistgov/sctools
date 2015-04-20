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
    ProfileCtrl.$inject = ['UserRecords', '$mdSidenav', '$upload', '$window', '$http', 'SecurityMeasuresJSON', '$filter'];
    function ProfileCtrl(UserRecords, $mdSidenav, $upload, $window, $http, SecurityMeasuresJSON, $filter) {
        /*jshint validthis: true */
        var vm = this;

        vm.setBase = setBase;
        vm.linkXML = linkXML;
        vm.fileSelect = fileSelect;
        vm.title = 'ProfileCtrl';
        vm.file = {};
        vm.file_hist = [];
        vm.overlay = UserRecords.profile;
        vm.inheritedTailoring = null;
        vm.inheritMeasure = inheritMeasure;
        vm.inherited = inherited;

        function setBase() {
          UserRecords.setSysBaseline();
        }

        function openSaveAsDialog(filename, content, mediaType) {
            var blob = new Blob([content], {type: mediaType});
            saveAs(blob, filename);
        }


        // This is the function called when the download button is clicked
        // It makes a request to the Node server that returns XML
        // The function then attempts to force a client side download using the FileSaver library
        // This does not currently work in Safari, but sends an alert to the client browser
        function linkXML() {
            var toDown = { records: UserRecords.dirtySubSet(), profile: UserRecords.profile };
            SecurityMeasuresJSON.getXML(toDown).success( function(data) {
                console.log(data);

                // following section found at: http://stackoverflow.com/questions/20300547/download-csv-file-from-web-api-in-angular-js
                var hiddenElement = document.createElement('a');

                //hiddenElement.href = 'data:text/xml;charset=utf-8,' + encodeURIComponent(data);
                hiddenElement.href = 'data:text/xml;charset=utf-8,' + encodeURIComponent(data);
                hiddenElement.target = '_blank';
                hiddenElement.download = 'SP80053_'+UserRecords.profile.name.replace(/ /g, "_")+'.xml';


                // this test was located at https://github.com/eligrey/FileSaver.js/issues/12
                // it appears to figure out if the download will work by testing Blob compatibility
                var svg = new Blob(
                ["<svg xmlns='http://www.w3.org/2000/svg'></svg>"],
                {type: "image/svg+xml;charset=utf-8"}
                );
                var img = new Image();
                img.onload = function() { 
                        console.log("SUPPORT"); 
                         openSaveAsDialog(hiddenElement.download, data, 'data:text/xml');
                    };
                img.onerror = function() { 
                        console.log("unsupported"); 
                        var win = window.open(hiddenElement.href);    
                        if(!win || win.closed || typeof win.closed=='undefined') 
                        { 
                         alert('Your browser does not support Blob urls. Please switch browsers or unblock popups to use this feature.');       
                        }  
                };
                img.src = URL.createObjectURL(svg);

            });
        }

        // This is the function fired on upload
        // It uses the upload service to send a copy of the selected File to the Node server
        // The response from the server is the converted JSON that is used internally
        function fileSelect() {
            if ( !vm.file || !vm.file[0]) { // prevents oddness in event handler
                return;
            }
            //vm.file_hist.push(vm.file[0].name);
            $upload.upload({url: 'upload', file:vm.file})
                    .success(function(data, status, headers) {
                    var dict = {};
                    dict.profile = {};
                    dict.profile.name = data.root.name[0];
                    dict.profile.baseline = data.root.baseline[0];
                    // UserRecords.profile.name = data.root.name[0];
                    // UserRecords.profile.baseline = data.root.baseline[0];
                    // UserRecords.setSysBaseline();
                    angular.forEach(data.root.node, function(element) {
                             var temp = new UserRecords.Record(
                                         element.uid[0],
                                         element.state[0],
                                         true,
                                         UserRecords.recordDict[element.uid[0]].config.baseline,
                                         UserRecords.recordDict[element.uid[0]].config.family,
                                         UserRecords.recordDict[element.uid[0]].config.priority,
                                         UserRecords.recordDict[element.uid[0]].config.enhancements);    
        
                             temp.comments.text = element.comments[0].text[0];
                             temp.comments.rationale = element.comments[0].rationale[0];
                             temp.comments.link = element.comments[0].link[0];
                             dict[temp.uid] = temp;
                      });
                    UserRecords.addInherited(dict);
                });
        }
        
        function inheritMeasure() {
            if(vm.inheritedTailoring) {
                var data = $filter('dirtyFilter')(UserRecords.inheritedDict[vm.inheritedTailoring]);
                // UserRecords.profile.name = data.profile.name;
                // UserRecords.profile.baseline = data.profile.baseline;
                console.log(data);
                // UserRecords.setSysBaseline();
                angular.forEach(data, function(element, key) {
                    UserRecords.inheritRecord(element, UserRecords.inheritedDict[vm.inheritedTailoring]);
                    // UserRecords.changeRecord(element.uid, element.state, element.comments.text, element.comments.rationale, element.comments.link);
                })
            }
        }

        function inherited() {
            return UserRecords.inheritedDict;
        }

    }
})();