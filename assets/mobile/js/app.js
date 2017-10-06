// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.services' is found in services.js
// 'starter.controllers' is found in controllers.js
angular.module('starter', ['ionic', 'starter.controllers', 'starter.services'])

  .run(function ($ionicPlatform) {
    $ionicPlatform.ready(function () {
      // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
      // for form inputs)
      if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
        cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
        cordova.plugins.Keyboard.disableScroll(true);

      }
      if (window.StatusBar) {
        // org.apache.cordova.statusbar required
        StatusBar.styleDefault();
      }
    });
  })

  .config(function ($stateProvider, $urlRouterProvider, $ionicConfigProvider) {

    // Ionic uses AngularUI Router which uses the concept of states
    // Learn more here: https://github.com/angular-ui/ui-router
    // Set up the various states which the app can be in.
    // Each state's controller can be found in controllers.js
    $ionicConfigProvider.scrolling.jsScrolling(true);
    $stateProvider

      // setup an abstract state for the tabs directive
      .state('app', {
        cache: false,
        url: '/app',
        abstract: true,
        templateUrl: 'templates/menu.html',
        controller: 'AppCtrl'
      })

      .state('filter', {
        url: '/filter',
        cache: false,
        templateUrl: 'templates/filter.html',
        controller: 'FilterCtrl'
      })

      .state('searchPage', {
        url: '/searchPage/:label',
        cache: false,
        templateUrl: 'templates/searchPage.html',
        controller: 'SearchPageCtrl'
      })

      // .state('searchPage', {
      //   url: '/searchPage/:searchText/:label',
      //   cache: false,
      //   templateUrl: 'templates/searchPage.html',
      //   controller: 'SearchPageCtrl' 
      // })

      .state('app.filterResult', {
        url: '/filterResult',
        cache: false,
        views: {
          'menuContent': {
            templateUrl: 'templates/filterResult.html',
            controller: 'FilterResultCtrl'
          }
        }
      })

      .state('timelinestatus', {
        url: '/timelinestatus',
        cache: false,
        templateUrl: 'templates/timelinestatus.html',
        controller: 'TimelinestatusCtrl'
      })

      .state('date', {
        url: '/date',
        cache: false,
        templateUrl: 'templates/date.html',
        controller: 'DateCtrl'
      })

      .state('options', {
        url: '/options',
        cache: false,
        templateUrl: 'templates/options.html',
        controller: 'OptionsCtrl'
      })

      .state('searchAssginment', {
        url: '/searchAssginment',
        cache: false,
        templateUrl: 'templates/searchAssginment.html',
        controller: 'SearchAssginmentCtrl'
      })

    // if none of the above states are matched, use this as the fallback
    $urlRouterProvider.otherwise('app/filterResult');

  })
  .filter('uploadpath', function () {
    return function (input, width, height, style) {
      var other = "";
      if (width && width != "") {
        other += "&width=" + width;
      }
      if (height && height != "") {
        other += "&height=" + height;
      }
      if (style && style != "") {
        other += "&style=" + style;
      }
      if (input) {
        if (input.indexOf('https://') == -1) {
          return imgpath + input + other;
        } else {
          return input;
        }
      }
    };
  })

  .directive('focusMe', function ($timeout) {
    return {
      link: function (scope, element, attrs) {
        $timeout(function () {
          element[0].focus();
        }, 150);
      }
    };
  });
