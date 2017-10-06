connector.controller('FilterCtrl', function ($scope, $state, $stateParams) {

    $scope.filterObj = {};
    $scope.isShowDate = true;
    $scope.isShowEstimated = false;
    $scope.isActive = null;
    $scope.isCategory = false;

    //Set j storage to store filter obj
    var isJStorage = $.jStorage.get('filterObj');
    if (isJStorage == null || isJStorage == undefined) {
        $.jStorage.set('filterObj', {})
    } else {
        $scope.filterObj = $.jStorage.get('filterObj');
        if ($scope.filterObj.isActive == 1) {
            $scope.isActive = 'A';
        } else if ($scope.filterObj.isActive == 2) {
            $scope.isActive = 'B';
        }
        console.log("$scope.filterObj", $scope.filterObj);
    };

    //To go back
    $scope.getBack = function () {
        $state.go('app.filterResult');
    }

    //Function to get search text from filter page
    $scope.getSearchText = function (value, label) {
        if (value != "") {
            $state.go('searchPage', { searchText: value, label: label })
        }
    };

    $scope.getDataForFilter = function (label) {
        $state.go('searchPage', { label: label })
    }

    //To show estimated loss input fields
    $scope.getRange = function () {
        $scope.isShowEstimated = !$scope.isShowEstimated;
    };

    //To show category
    $scope.getCategory = function () {
        $scope.isCategory = !$scope.isCategory;
    }

    //To clear all fields
    $scope.clear = function () {
        $scope.filterObj = {};
        $scope.filterObj.ownerStatus = "Global";
        $scope.isActive = null
        // $.jStorage.flush('filterObj');
        $.jStorage.set('filterObj', {});
    };

    //To get timeline status
    $scope.getTimelineStatus = function () {
        $state.go('timelinestatus');
    };

    //Function to apply filter
    $scope.applyFilter = function () {
        // if (!_.isEmpty()) {
        $state.go('app.filterResult');
        //}
    };

    //To change the category of assignment
    $scope.category = function (value) {
        $scope.filterObj.ownerStatus = value;
        $.jStorage.set('filterObj', $scope.filterObj);
    };

    $scope.changeStatus = function (value) {
        if (value == 1) {
            $scope.filterObj.timelineStatus = ["Unassigned", "Survey Pending", "ILA Pending", "LOR Pending", "Dox Pending", "Assessment Pending", "Consent Pending", "FSR Pending", "TBB"];
            $scope.filterObj.isActive = value;
            $.jStorage.set('filterObj', $scope.filterObj)
        } else if (value == 2) {
            $scope.filterObj.timelineStatus = ["BBND", "DBND", "Delivered", "Collected", "OnHold", "ReOpened", "Force Closed"]
            $scope.filterObj.isActive = value;
            $.jStorage.set('filterObj', $scope.filterObj)
        }
    };

    //To select date filter
    $scope.getDateType = function () {
        $state.go('date');
    }

})