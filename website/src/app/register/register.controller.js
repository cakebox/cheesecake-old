'use strict';

angular.module('colabsubs')
    .controller('RegisterCtrl', function ($rootScope, $scope, $location, User) {

        if ($rootScope.user) {
            $location.path('/');
        }

        $scope.register = function () {

            if ($scope.registerForm.password !== $scope.registerForm.passwordConfirm) {
                console.log('>>> Password don\'t match');
                $location.path('/register');
            }

            var user = new User($scope.registerForm);
            user.$save()
            .then(function(response) {
                console.log(response);
            })
            .catch(function(error) {
                console.log('>>> Failed to post datas');
                console.log(error);
            });
        };
    })
;
