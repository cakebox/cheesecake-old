'use strict';

angular.module('colabsubs')
    .controller('AccountCtrl', function ($rootScope, $scope, $location, User) {

        $scope.user.informations = User.get({id: $rootScope.user.id});
    })
;
