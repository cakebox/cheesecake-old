(function() {
    'use strict';

    angular
        .module('cheesecake')
        .controller('LoginCtrl', LoginCtrl);

        function LoginCtrl($log, $rootScope, $scope, $location, $window, jwtHelper, User) {

            $scope.login = function () {
                var user = new User($scope.loginForm);

                user.$login()
                .then(function(response) {
                    if (response.token) {
                        $window.localStorage.setItem('token', response.token);

                        var decodedToken = jwtHelper.decodeToken(response.token);
                        $rootScope.user = decodedToken.user;

                        $location.path('/');
                    }
                    else {
                        $rootScope.alerts.push({type: 'danger', msg: 'Username or password are wrong.'});
                    }
                })
                .catch(function(error) {
                    $log.log('>>> Failed to post datas');
                    $log.log(error);
                });
            };
        }

})();
