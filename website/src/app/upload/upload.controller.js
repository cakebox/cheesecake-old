'use strict';

angular.module('colabsubs')
    .controller('UploadCtrl', function ($scope) {
        $scope.languages = [
            {name: 'English', language: 'english'},
            {name: 'Français', language: 'french'},
            {name: 'Español', language: 'spanish'},
            {name: 'Deutch', language: 'german'}
        ];
        $scope.upload = {
            tags: []
        };

    })
;
