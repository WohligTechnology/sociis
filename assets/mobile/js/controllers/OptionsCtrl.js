connector.controller('OptionsCtrl', function ($scope, $state, $stateParams, MyServices, $ionicScrollDelegate) {

    $scope.getBack = function () {
        $state.go('app.filterResult');
    }

})