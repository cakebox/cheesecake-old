(function() {
    'use strict';

    angular
        .module('cheesecake')
        .directive('access', access);

        function access($rootScope, Authorization) {
                var directive = {
                    link:     linkFct,
                    restrict: 'A',
                };

                return directive;
                ////////////

                function linkFct(scope, element, attrs) {
                    var makeVisible = function () {
                        element.removeClass('hidden');
                    },
                    makeHidden = function () {
                        element.addClass('hidden');
                    },
                    determineVisibility = function (resetFirst) {
                        var result;
                        if (resetFirst) {
                            makeVisible();
                        }

                        result = Authorization.authorize(true, roles, attrs.accessPermissionType);
                        if (result === $rootScope.authVars.authorised.authorised) {
                            makeVisible();
                        } else {
                            makeHidden();
                        }
                    },
                    roles = attrs.access.split(',');

                    if (roles.length > 0) {
                        determineVisibility(true);
                    }
                }
            }

})();
