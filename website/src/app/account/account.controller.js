'use strict';

angular.module('colabsubs')
    .controller('AccountCtrl', function ($rootScope, $scope, $location) {

        if ($rootScope.user) {
            $location.path('/');
        }
    })
;
