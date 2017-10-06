connector.controller('SearchAssginmentCtrl', function ($scope, $state, $stateParams, MyServices) {

    $scope.filterObj = {};
    $scope.filterObj = _.cloneDeep($.jStorage.get('filterObj'));
    $scope.filterObj.pagenumber = 1;
    $scope.assignmentList = [];

    $scope.getBack = function () {
        $state.go('app.filterResult');
    };

    //To search record
    $scope.searchRecord = function (value1) {
        $scope.filterObj.name = value1;
        MyServices.getAll($scope.filterObj, function (data) {
            if (data.value) {
                $scope.assignmentList = data.data.results;
            } else {
                $scope.assignmentList = [];
            }
        })
    };

    //To select the record
    $scope.getMyResult = function (value) {
        var selectedItem = _.find($scope.assignmentList, function (o) {
            if (o.name == value.name) {
                return o;
            }
        });

        if (selectedItem != undefined) {
            $scope.filterObj.name = value.name;
            $.jStorage.set('filterObj', $scope.filterObj);
            $state.go('app.filterResult');
        }
    }

})
