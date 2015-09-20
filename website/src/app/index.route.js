(function() {
    'use strict';

    angular
        .module('cheesecake')
        .config(routeConfig);

    function routeConfig($routeProvider) {

        $routeProvider
            .when('/', {
                templateUrl: 'app/home/home.html',
                controller: 'HomeCtrl'
            })
            .when('/subtitles', {
                templateUrl: 'app/search/search.html',
                controller: 'SearchCtrl'
            })
            .when('/subtitle/:id', {
                templateUrl: 'app/subtitle/subtitle.html',
                controller: 'SubtitleCtrl'
            })
            .when('/upload', {
                templateUrl: 'app/upload/upload.html',
                controller: 'UploadCtrl',
                access: {
                    loginRequired: true
                }
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
            .when('/about', {
                templateUrl: 'app/about/about.html',
                controller: 'AboutCtrl'
            })
            .otherwise({
                redirectTo: '/'
            });
    }

})();
