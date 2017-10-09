connector.controller('AppCtrl', function ($scope, $state, $stateParams, MyServices, $rootScope) {

    $scope.filterObj = _.cloneDeep($.jStorage.get('filterObj'));

    //Function to go to filter page
    $scope.filter = function () {
        $state.go('filter');
    };

    $scope.search = function () {
        $state.go('searchAssginment');
    };

    //To download excel
    $scope.generateMRExcel = function () {
        MyServices.saveJsonStore($scope.filterObj, function (data) {
            console.log(data);
            window.open($rootScope.adminurl + 'Assignment/generateExcel?id=' + data + "&accessToken=" +
                $.jStorage.get("accessToken"), '_blank');
        });
    };

    $scope.generateStatusReport = function () {
        MyServices.saveJsonStore($scope.filterObj, function (data) {
            console.log(data);
            window.open($rootScope.adminurl + 'Assignment/generateStatusReport?id=' + data + "&accessToken=" +
                $.jStorage.get("accessToken"), '_blank');
        });
    };

    //To set navigation urls
    MyServices.getUrls();
})