'use strict';

angular.module('colabsubs')
    .controller('AccountCtrl', function ($rootScope, $scope, $location, User) {

        if (!$rootScope.user) {
            $location.path('/');
        }

        $scope.user.informations = User.get({id: $rootScope.user.id});
    })
;
