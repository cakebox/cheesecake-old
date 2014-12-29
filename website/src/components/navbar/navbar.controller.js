'use strict';

angular.module('colabsubs')
    .controller('NavbarCtrl', function ($scope, $location) {
        $scope.isActive = function(path) {
            if ($location.path() === path) {
                return true;
            }
            return false;
        };
    })
;
