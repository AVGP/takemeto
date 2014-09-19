angular.module('tmt', ['ionic', 'tmt.controllers', 'tmt.services'])

.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if(window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
    }
    if(window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
    }
  });
})

.config(function($stateProvider, $urlRouterProvider) {

  // Ionic uses AngularUI Router which uses the concept of states
  // Learn more here: https://github.com/angular-ui/ui-router
  // Set up the various states which the app can be in.
  // Each state's controller can be found in controllers.js
  $stateProvider

    // setup an abstract state for the tabs directive
    .state('tab', {
      url: "/tab",
      abstract: true,
      templateUrl: "templates/tabs.html"
    })

    // Each tab has its own nav history stack:

    .state('tab.quick', {
      url: '/quick',
      views: {
        'tab-quick': {
          templateUrl: 'templates/tab-quick.html',
          controller: 'QuickCtrl'
        }
      }
    })

    .state('tab.navigate', {
      url: '/navigate',
      views: {
        'tab-navigate': {
          templateUrl: 'templates/tab-navigate.html',
          controller: 'NavigationCtrl'
        }
      }
    })
    .state('tab.schedule', {
      url: '/schedule',
      views: {
        'tab-schedule': {
          templateUrl: 'templates/tab-schedule.html',
          controller: 'ScheduleCtrl'
        }
      }
    })
    .state('tab.stations', {
      url: '/stations',
      views: {
        'tab-stations': {
          templateUrl: 'templates/tab-stations.html',
          controller: 'StationsCtrl'
        }
      }
    });

  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/tab/quick');

});

