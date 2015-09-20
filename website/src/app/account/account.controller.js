(function() {
    'use strict';

    angular
        .module('cheesecake')
        .controller('AccountCtrl', AccountCtrl);

        function AccountCtrl($rootScope, $scope, User) {

            $scope.user.informations = User.get({id: $rootScope.user.id});
        }

})();
