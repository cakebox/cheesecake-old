'use strict';

angular.module('colabsubs')
    .controller('RegisterCtrl', function ($rootScope, $scope, $location) {

        if ($rootScope.user) {
            $location.path('/');
        }
    })
;
