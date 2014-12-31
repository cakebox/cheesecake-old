'use strict';

angular.module('colabsubs', ['ngResource', 'ngRoute', 'ui.bootstrap', 'angular-jwt'])
    .constant('VERSION', 'v0.0.0')
    .constant('API_URL', '//api.colabsubs.perso.dev')
    .config(function ($routeProvider, $httpProvider, jwtInterceptorProvider) {

        $routeProvider
        .when('/', {
            templateUrl: 'app/home/home.html',
            controller: 'HomeCtrl'
        })
        .when('/tvshows', {
            templateUrl: 'app/tvshows/tvshows.html',
            controller: 'TVShowsCtrl'
        })
        .when('/movies', {
            templateUrl: 'app/movies/movies.html',
            controller: 'MoviesCtrl'
        })
        .when('/login', {
            templateUrl: 'app/login/login.html',
            controller: 'LoginCtrl'
        })
        .when('/register', {
            templateUrl: 'app/register/register.html',
            controller: 'RegisterCtrl'
        })
        .when('/account', {
            templateUrl: 'app/account/account.html',
            controller: 'AccountCtrl'
        })
        .when('/logout', {
            templateUrl: 'app/logout/logout.html',
            controller: 'LogoutCtrl'
        })
        .otherwise({
            redirectTo: '/'
        });

        jwtInterceptorProvider.tokenGetter = function(jwtHelper, $http, $window) {
            var token = $window.localStorage.getItem('token');

            if (token && jwtHelper.isTokenExpired(token)) {
                return $http({
                    url: '/users/:idUser/renew_token',
                    method: 'POST',
                    skipAuthorization: true
                })
                .then(function(response) {
                    token = response.token;
                    $window.localStorage.setItem('token', response.token);
                    return token;
                });
            } else {
                return token;
            }
        };

        $httpProvider.interceptors.push('jwtInterceptor');
    })
    .run(function ($rootScope, $window, $timeout, VERSION, jwtHelper) {

        $rootScope.version = VERSION;

        if ($window.localStorage.getItem('token') && !$rootScope.user) {
            // If the user refresh the page with F5, redecode again the token.
            // A object can't be saved in localStorage ?
            var decodedToken = jwtHelper.decodeToken($window.localStorage.getItem('token'));
            $rootScope.user = decodedToken.user;
        }

        $rootScope.alerts = [];

        // Every 3secondes alerts are removed
        // TODO: It's better to set a duration for each alerts, and remove them here if expired
        // $timeout(function() {
        //     $rootScope.alerts.forEach(function (element, index, array) {
        //         array.splice(index, 1);
        //     })
        // }, 3000);

        $rootScope.closeAlert = function(index) {
            $rootScope.alerts.splice(index, 1);
        };
    })
;
