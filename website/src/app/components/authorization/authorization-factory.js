(function() {
    'use strict';

    angular
        .module('cheesecake')
        .factory('Authorization', Authorization);

        function Authorization($rootScope) {
        var service = {
            authorize: authorize
        };

        return service;
        ////////////

        function authorize(loginRequired, permissionsRequired, permissionType) {
            var result = $rootScope.authVars.authorised.authorised,
            user = $rootScope.connectedUser,
            userPermissions = [],
            hasPermission = true,
            permission, i;

            if (loginRequired === true && user === undefined) {
                result = $rootScope.authVars.authorised.loginRequired;
            } else if (loginRequired === true && user !== undefined && (permissionsRequired === undefined || permissionsRequired.length === 0)) {
                // Login is required but no specific permissions are specified.
                result = $rootScope.authVars.authorised.authorised;
            } else if (permissionsRequired) {
                angular.forEach(user.permissions, function (userPermission) {
                    userPermissions.push(userPermission.toLowerCase());
                });

                permissionType = $rootScope.authVars.permissionCheckTypes[permissionType] || $rootScope.authVars.permissionCheckTypes.atLeastOne;

                for (i = 0; i < permissionsRequired.length; i += 1) {
                    permission = permissionsRequired[i].toLowerCase().trim();

                    if (permissionType === $rootScope.authVars.permissionCheckTypes.combinationRequired) {
                        hasPermission = hasPermission && userPermissions.indexOf(permission) > -1;
                        // if all the permissions are required and hasPermission is false there is no point carrying on
                        if (hasPermission === false) {
                            break;
                        }
                    } else if (permissionType === $rootScope.authVars.permissionCheckTypes.atLeastOne) {
                        hasPermission = userPermissions.indexOf(permission) > -1;
                        // if we only need one of the permissions and we have it there is no point carrying on
                        if (hasPermission) {
                            break;
                        }
                    }
                }

                result = hasPermission ? $rootScope.authVars.authorised.authorised : $rootScope.authVars.authorised.notAuthorised;
            }

            return result;
        }
    }

})();
