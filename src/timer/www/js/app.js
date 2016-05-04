angular.module('yoTimer', [
  'yoTimer.controllers',
  'yoTimer.directives',
  'yoTimer.templates'
])

.run(function() {
  console.log('run');
})

// .config(function($stateProvider, $urlRouterProvider) {
//
//   $stateProvider
//     .state('timer', {
//       url: '/timer',
//       templateUrl: 'templates/timer.html',
//       controller: 'timerCtrl'
//     });
//
// });
