(function() {
    'use strict';

    angular
        .module('cheesecake')
        .run(runBlock);

    /** @ngInject */
    function runBlock($rootScope, $window, $timeout, $location, VERSION, jwtHelper, Authorization) {

        $rootScope.version = VERSION;
        $rootScope.authVars = {
            authorised: {
                authorised: 0,
                loginRequired: 1,
                notAuthorised: 2
            },
            permissionCheckTypes: {
                atLeastOne: 0,
                combinationRequired: 1
            }
        };

        if ($window.localStorage.getItem('token') && !$rootScope.user) {
            // If the user refresh the page with F5, redecode again the token.
            var decodedToken = jwtHelper.decodeToken($window.localStorage.getItem('token'));
            $rootScope.user = decodedToken.user;
        }

        var routeChangeRequiredAfterLogin = false,
            loginRedirectUrl;

        var onRouteChangeStart = $rootScope.$on('$routeChangeStart', function (event, next, previous) {
            var authorised;

            if (routeChangeRequiredAfterLogin && next.originalPath !== '/login') {
                routeChangeRequiredAfterLogin = false;
                $location.path(loginRedirectUrl).replace();
            } else if (angular.isDefined(next.access)) {
                authorised = Authorization.authorize(next.access.loginRequired, next.access.permissionsRequired, next.access.permissionType);

                if (authorised === $rootScope.authVars.authorised.loginRequired) {
                    routeChangeRequiredAfterLogin = true;
                    loginRedirectUrl = next.originalPath;
                    $location.path('/login');
                } else if (authorised === $rootScope.authVars.authorised.notAuthorised) {
                    $location.path(previous ? previous.originalPath : '/').replace();
                }
            }

            // Avoid a connected user to go to login and register pages
            if ($rootScope.user && (next.originalPath === '/login' || next.originalPath === '/register')) {
                $location.path(previous ? previous.originalPath : '/').replace();
            }
        });

        $rootScope.alerts = [];

        // Every 3secondes alerts are removed
        // TODO: It's better to set a duration for each alerts, and remove them here if expired
        // $timeout(function() {
        //     $rootScope.alerts.forEach(function (element, index, array) {
        //         array.splice(index, 1);
        //     })
        // }, 3000);

        $rootScope.closeAlert = function(index) {
            $rootScope.alerts.splice(index, 1);
        };
    }

})();
