(function() {
    'use strict';

    angular
        .module('cheesecake')
        .controller('NavbarCtrl', NavbarCtrl);

        function NavbarCtrl($scope, $location) {
            $scope.isActive = function(path) {
                if ($location.path() === path) {
                    return true;
                }
                return false;
            };
        }

})();
