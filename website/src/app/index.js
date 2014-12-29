'use strict';

angular.module('colabsubs', ['ngCookies', 'ngResource', 'ngRoute', 'ui.bootstrap'])
    .config(function ($routeProvider) {
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
        .otherwise({
            redirectTo: '/'
        });
    })
;
