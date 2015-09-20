(function() {
    'use strict';

    angular
        .module('cheesecake')
        .controller('RegisterCtrl', RegisterCtrl);

        function RegisterCtrl($log, $rootScope, $scope, $location, User) {

            $scope.register = function () {

                if ($scope.registerForm.password !== $scope.registerForm.passwordConfirm) {
                    $scope.alerts.push({type: 'danger', msg: 'Passwords doesn\'t match.'});
                    $location.path('/register');
                }

                var user = new User($scope.registerForm);
                user.$save()
                .then(function() {
                    $rootScope.alerts.push({type: 'success', msg: 'Your account has been created.'});
                })
                .catch(function(error) {
                    $log.log('>>> Failed to post datas');
                    $log.log(error);
                });
            };
        }

})();
