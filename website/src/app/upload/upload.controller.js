(function() {
    'use strict';

    angular
        .module('cheesecake')
        .controller('UploadCtrl', UploadCtrl);

        function UploadCtrl($scope) {
            $scope.languages = [
                {name: 'English', language: 'english'},
                {name: 'Français', language: 'french'},
                {name: 'Español', language: 'spanish'},
                {name: 'Deutch', language: 'german'}
            ];

            $scope.upload = {
                tags: []
            };
        }

})();
