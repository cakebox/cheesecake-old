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
                    var decodedToken = jwtHelper.decodeToken(response.token);
                    $window.localStorage.setItem('token', response.token);
                    $window.localStorage.setItem('user', decodedToken.user);
                    $rootScope.user = decodedToken.user;
                    $location.path('/');
                }
                else {
                    console.log('>>> Bad credentials');
                }
            })
            .catch(function(error) {
                console.log('>>> Failed to post datas');
                console.log(error);
            });
        };
    })
;
