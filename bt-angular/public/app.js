var app = angular
          .module('app', [
            'ui.layout', 
            'ui.router',
            'ngMaterial',
            'ui.grid',
            'ui.grid.autoResize',
            'ui.grid.selection',
            'angularFileUpload']);

app.config( function($stateProvider, $urlRouterProvider, $mdThemingProvider) {
  $stateProvider
        .state('root', {
          url: '/',
          views: {
            'header': { templateUrl: 'layout/form-profile.html'},
            'history': { templateUrl: 'layout/form-history.html' },
            'selector': { templateUrl: 'layout/form-selection.html' },
            'modifier': { templateUrl: 'layout/form-modifier.html' }
          }
          
        })

  $urlRouterProvider.otherwise('/');

  $mdThemingProvider.theme('default')
      .primaryPalette('light-blue')
      .accentPalette('cyan')
})

// app.provider('spData', function spDataProvider() { {

//   this.$get = ['$http', function spDataFactory($http) {
//       var service =  {
//         loadDataPromise: $http.get("/json").then(function(data) {
//           console.log('success');
//           service.data = data;
//         }),
//         data: {}
//       };

//       return service;
       
      


//   }];

// }})

app.service('spData', ['$http', function($http){

  return {

    loadDataPromise: function() {
          console.log("YO")
          return $http.get("/json").then(function(data) {
            console.log("SUCCESS")

            return {
              data: data
            }
          })
        }

  }
  
}])

