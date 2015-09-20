(function() {
    'use strict';

    angular
        .module('cheesecake')
        .config(config);

    /** @ngInject */
    function config($httpProvider, jwtInterceptorProvider) {

        jwtInterceptorProvider.tokenGetter = function(jwtHelper, $http, $window, API_URL) {
            var token = $window.localStorage.getItem('token');

            if (token && jwtHelper.isTokenExpired(token)) {
                var decodedToken = jwtHelper.decodeToken(token);
                return $http({
                    url: API_URL + '/users/' + decodedToken.user.id + '/renew_token',
                    method: 'POST',
                    skipAuthorization: false
                })
                .then(function(response) {
                    token = response.token;
                    $window.localStorage.setItem('token', response.token);
                    return token;
                });
            } else {
                return token;
            }
        };

        $httpProvider.interceptors.push('jwtInterceptor');
    }

})();
