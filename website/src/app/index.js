'use strict';

angular.module('colabsubs', ['ngResource', 'ngRoute', 'ui.bootstrap', 'angular-jwt'])
    .constant('apiUrl', '//api.colabsubs.perso.dev')
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
    .run(function ($rootScope, $window, jwtHelper) {

        if ($window.localStorage.getItem('token') && !$rootScope.user) {
            // If the user refresh the page with F5, redecode again the token.
            // A object can't be saved in localStorage ?
            var decodedToken = jwtHelper.decodeToken($window.localStorage.getItem('token'))
            $rootScope.user = decodedToken.user;
        }
    })
;
