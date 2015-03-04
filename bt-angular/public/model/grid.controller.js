(function() {
    'use strict';

    angular
        .module('app')
        .controller('GridCtrl', GridCtrl);

    /*
    * This is the Angular controller in control of the ui-grid that displays, filters, and allows users to select security measures
    */

    /* @ngInject */
    GridCtrl.$inject = ['UserRecords', 'SecurityMeasuresJSON', '$scope', '$filter'];
    function GridCtrl(UserRecords, SecurityMeasuresJSON, $scope, $filter) {
        /*jshint validthis: true */
        var vm = this;
        vm.title = 'GridCtrl';
		
		    vm.srcData = {};
        vm.dispData ={};

        vm.selectMeasure = selectMeasure;
        vm.setRow = setRow;
        vm.updateFilter = updateFilter;
        vm.measuresList = measuresList;

        vm.familyFilter = [];
        vm.measureFilter = [];
        vm.families = [
            "ACCESS CONTROL"
           ,"AUDIT AND ACCOUNTABILITY"
           ,"AWARENESS AND TRAINING"
           ,"CONFIGURATION MANAGEMENT"
           ,"CONTINGENCY PLANNING"
           ,"IDENTIFICATION AND AUTHENTICATION"
           ,"INCIDENT RESPONSE"
           ,"MAINTENANCE"
           ,"MEDIA PROTECTION"
           ,"PERSONNEL SECURITY"
           ,"PHYSICAL AND ENVIRONMENTAL PROTECTION"
           ,"PLANNING"
           ,"Program Management"
           ,"RISK ASSESSMENT"
           ,"SECURITY ASSESSMENT AND AUTHORIZATION"
           ,"SYSTEM AND COMMUNICATIONS PROTECTION"
           ,"SYSTEM AND INFORMATION INTEGRITY"
           ,"SYSTEM AND SERVICES ACQUISITION"
        ];

        
        vm.overlay = UserRecords.profile;

        // the configuration for the ui-grid
        vm.gridOptions = {
          enablePaginationControls: true,
          //enableFiltering: true,
          enableRowSelection: true,
          multiSelect: false,
          enableRowHeaderSelection: false,
          columnDefs: [
              { field: 'number[0]',
                width: '8%',
              displayName: 'Measure' },
            { field: 'title[0]',
            width: '37%',
              displayName: 'Title' },
            { field: 'priority[0]',
               width: '8%',
              displayName: 'Priority' },
            { field: 'baseline-impact', 
            width: '17%',
            displayName: 'Baseline'},
            { field: 'family[0]', 
            width: '20%',
            displayName: 'Family'}
          ]
        };

        vm.gridOptions.appScopeProvider= vm;
 
        // this sets up the callback function for a selection event       
        vm.gridOptions.onRegisterApi = function(gridApi) {
          vm.gridApi = gridApi;
          vm.gridApi.selection.on.rowSelectionChanged( $scope, (function(row) {
            vm.selectMeasure(row.entity); 
          }));
          vm.gridApi.core.addRowHeaderColumn( {  name: 'rowHeaderCol', displayName: 'Status', width: 100, cellTemplate: '/layout/row-header-template.html'} );
          UserRecords.registerCallback(vm.setRow);
        };
        
        vm.lookup = UserRecords.lookup;

        activate();

        /*
        * This is the callback that updates the rows
        * It is a linear algorithm
        * I do not like it (slightly inefficient)
        */

        function setRow(measure) {
          vm.gridApi.selection.clearSelectedRows();
          for(var i = 0; i < vm.gridApi.grid.rows.length; i ++) {
            if(measure.id === vm.gridApi.grid.rows[i].entity.number[0]) {
              vm.gridApi.selection.toggleRowSelection(vm.gridApi.grid.rows[i].entity);
              break;
            }
          }
        }

        function activate() {
            // collects the json object from the Security MeasuresJSON service
            SecurityMeasuresJSON.func().success( function(data) {
                vm.srcData = data["controls:controls"]["controls:control"];
                vm.gridOptions.data = vm.srcData;
                vm.dispData = angular.copy(vm.srcData);
                
                // initilazes the state of the various data points
                for( var i = 0; i < vm.srcData.length; i ++ ) {
                  vm.lookup[vm.srcData[i].number[0]] = "not";
                }
            })
        }

        // the call back for selection
       function selectMeasure(row) {
            if(row.number[0] !== UserRecords.currentRecord.id) {
              UserRecords.setCurrById(row.number[0]); 
            }
        }

        function measuresList() {
           return $filter('familyFilter')(vm.srcData, vm.familyFilter);
        }

        function updateFilter() {
          vm.dispData = $filter('measureFilter')( $filter('familyFilter')(vm.srcData, vm.familyFilter), vm.measureFilter);
          vm.gridOptions.data = vm.dispData;
        }
        
    }
})();