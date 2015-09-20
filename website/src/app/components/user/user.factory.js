(function() {
    'use strict';

    angular
        .module('cheesecake')
        .factory('User', User);

        function User($resource, BACKEND_URL) {
            var User, actions;

            actions = {
                login: {
                    method: 'POST',
                    url: BACKEND_URL + '/users/login',
                    skipAuthorization: true
                }
            };

            User = $resource(BACKEND_URL + '/users/:id', null, actions);
            return User;
        }

})();
