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
            controller: 'AccountCtrl',
            access: {
                loginRequired: true
            }
        })
        .when('/logout', {
            templateUrl: 'app/logout/logout.html',
            controller: 'LogoutCtrl',
            access: {
                loginRequired: true
            }
        })
        .when('/administration', {
            templateUrl: 'app/administration/administration.html',
            controller: 'AdministrationCtrl',
            access: {
                loginRequired: true,
                permissionsRequired: ['Modo', 'Admin'],
                permissionType: 'atLeastOne'
            }
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
    .run(function ($rootScope, $window, $timeout, $location, VERSION, jwtHelper, Authorization) {

        $rootScope.version = VERSION;
        $rootScope.authVars = {
            authorised: {
                authorised: 0,
                loginRequired: 1,
                notAuthorised: 2
            },
            permissionCheckTypes: {
                atLeastOne: 0,
                combinationRequired: 1
            }
        };

        if ($window.localStorage.getItem('token') && !$rootScope.user) {
            // If the user refresh the page with F5, redecode again the token.
            var decodedToken = jwtHelper.decodeToken($window.localStorage.getItem('token'));
            $rootScope.user = decodedToken.user;
        }

        var routeChangeRequiredAfterLogin = false,
            loginRedirectUrl;

        $rootScope.$on('$routeChangeStart', function (event, next, previous) {
            var authorised;

            if (routeChangeRequiredAfterLogin && next.originalPath !== '/login') {
                routeChangeRequiredAfterLogin = false;
                $location.path(loginRedirectUrl).replace();
            } else if (next.access !== undefined) {
                authorised = Authorization.authorize(next.access.loginRequired, next.access.permissionsRequired, next.access.permissionType);

                if (authorised === $rootScope.authVars.authorised.loginRequired) {
                    routeChangeRequiredAfterLogin = true;
                    loginRedirectUrl = next.originalPath;
                    $location.path('/login');
                } else if (authorised === $rootScope.authVars.authorised.notAuthorised) {
                    $location.path(previous ? previous.originalPath : '/').replace();
                }
            }

            // Avoid a connected user to go to login and register pages
            if ($rootScope.user && (next.originalPath === '/login' || next.originalPath === '/register')) {
                $location.path(previous ? previous.originalPath : '/').replace();
            }
        });

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
