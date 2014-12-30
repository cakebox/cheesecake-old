'use strict';

angular.module('colabsubs')
    .factory('User', function ($resource, apiUrl) {
        var User, actions;

        actions = {
            login: {
                method: 'POST',
                url: apiUrl + '/users',
                skipAuthorization: true
            }
        };

        User = $resource(apiUrl + '/users/:id', null, actions);
        return User;
    })
;
