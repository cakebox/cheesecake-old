(function() {
    'use strict';

    angular
        .module('cheesecake')
        .controller('LogoutCtrl', LogoutCtrl);

        function LogoutCtrl($rootScope, $location, $window) {
            delete $window.localStorage.token;
            delete $window.localStorage.user;
            delete $rootScope.user;
            $location.path('/');
        }

})();
