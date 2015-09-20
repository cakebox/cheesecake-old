(function() {
    'use strict';

    angular
        .module('cheesecake')
        .factory('User', User);

        function User($resource, API_URL) {
            var User, actions;

            actions = {
                login: {
                    method: 'POST',
                    url: API_URL + '/users/login',
                    skipAuthorization: true
                }
            };

            User = $resource(API_URL + '/users/:id', null, actions);
            return User;
        }

})();
