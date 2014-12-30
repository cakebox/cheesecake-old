'use strict';

angular.module('colabsubs')
    .controller('LogoutCtrl', function ($rootScope, $scope, $location, $window) {

        delete $window.localStorage.token;
        delete $window.localStorage.user;
        delete $rootScope.user;
        $location.path('/');
    })
;
