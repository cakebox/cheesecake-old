'use strict';

angular.module('colabsubs')
    .directive('access', ['$rootScope', 'Authorization', function ($rootScope, Authorization) {

        var linkFct = function (scope, element, attrs) {
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
        };

        return {
            restrict: 'A',
            link: linkFct
        };
    }])
;
