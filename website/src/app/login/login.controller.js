'use strict';

angular.module('colabsubs')
    .controller('LoginCtrl', function ($rootScope, $scope, $location, $window, jwtHelper, User) {

        if ($rootScope.user) {
            $location.path('/');
        }

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
                console.log('>>> Failed to post datas');
                console.log(error);
            });
        };
    })
;
