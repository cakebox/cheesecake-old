(function() {
    'use strict';

    angular
        .module('cheesecake')
        .config(config);

    /** @ngInject */
    function config($httpProvider, jwtInterceptorProvider) {

        jwtInterceptorProvider.tokenGetter = getToken;
        $httpProvider.interceptors.push('jwtInterceptor');

        /*@ngInject*/
        function getToken(config, $window) {
            // Skip authentication for any requests ending in .html
            if (config.url.substr(config.url.length - 5) === '.html') {
                return null;
            }

            return $window.localStorage.getItem('token');
        }
    }

})();
