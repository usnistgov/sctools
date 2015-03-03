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
        .state('home', {
          url: '/home',
          views: {
            'header': { templateUrl: 'layout/form-profile.html'},
            'history': { templateUrl: 'layout/form-history.html' },
            'selector': { templateUrl: 'layout/form-selection.html' },
            'modifier': { templateUrl: 'layout/form-modifier.html' }
          }
        })

  $urlRouterProvider.otherwise('home');

  $mdThemingProvider.theme('default')
      .primaryPalette('light-blue')
      .accentPalette('cyan')
})


