connector.controller('TimelinestatusCtrl', function ($scope, $state, $stateParams, MyServices, $ionicPlatform, $ionicScrollDelegate) {
    $scope.filterObj = {};
    $scope.filterObj = _.cloneDeep($.jStorage.get('filterObj'));
    $scope.isList = 1;
    $scope.activeButton1 = 'active';

    //In mylist tab all records are always selected so, default its true
    $scope.alwaysActive = true;

    // $scope.activeStatus = ["Unassigned", "Survey Pending", "ILA Pending", "LOR Pending", "Dox Pending", "Assessment Pending", "Consent Pending", "FSR Pending", "TBB"];
    // $scope.inactiveStatus = ["BBND", "DBND", "Delivered", "Collected", "OnHold", "ReOpened", "Force Closed"];


    $scope.timelineStatus = ["Unassigned", "Survey Pending", "ILA Pending", "LOR Pending", "Dox Pending", "Assessment Pending", "Consent Pending", "FSR Pending", "TBB", "BBND", "DBND", "Delivered", "Collected", "OnHold", "ReOpened", "Force Closed"];
    if ($scope.filterObj.timelineStatus != undefined) {
        var demo = _.difference($scope.timelineStatus, $scope.filterObj.timelineStatus);
        $scope.timelineStatus = demo;
    }

    //To switch tab
    $scope.changeTab = function (value) {
        if (value == 1) {
            $ionicScrollDelegate.scrollTop();
            $scope.isList = 1;
            $scope.activeButton1 = 'active';
            $scope.activeButton2 = '';
        } else {
            $ionicScrollDelegate.scrollTop();
            $scope.isList = 2;
            $scope.activeButton1 = '';
            $scope.activeButton2 = 'active';
        }

    }

    //To select the time line status
    $scope.selectItem = function (obj) {
        var selectedItem = _.find($scope.filterObj.timelineStatus, function (o) {
            if (o == obj) {
                return o;
            }
        });
        console.log(selectedItem);
        if (selectedItem == undefined) {
            if ($scope.filterObj.timelineStatus == undefined) {
                $scope.filterObj.timelineStatus = [];
                $scope.filterObj.timelineStatus.push(obj)

                _.pull($scope.timelineStatus, obj);
            } else {
                $scope.filterObj.timelineStatus.push(obj)
                _.pull($scope.timelineStatus, obj);
            }
            $ionicPlatform.ready(function () {
                window.plugins.toast.showWithOptions(
                    {
                        message: "Added to list",
                        duration: "short", // which is 2000 ms. "long" is 4000. Or specify the nr of ms yourself.
                        position: "bottom",
                        addPixelsY: -40  // added a negative value to move it up a bit (default 0)
                    }
                );
            });
        } else {
            _.pull($scope.filterObj.timelineStatus, selectedItem);
        }
        // console.log($scope.filterObj.timelineStatus);
    };

    //To remove record from preselected list 
    $scope.removeRecord = function (value1) {
        var selectedItem = _.find($scope.filterObj.timelineStatus, function (o) {
            if (o == value1) {
                return o;
            }
        });
        console.log(selectedItem);
        if (selectedItem != undefined) {
            _.pull($scope.filterObj.timelineStatus, selectedItem);
            // value1.checked = false;
            $scope.timelineStatus.push(value1);
        }
    };

    //To save filter obj in jStorage and return to filter page
    // $scope.saveList = function () {
    //     $.jStorage.set('filterObj', $scope.filterObj);
    //     $state.go('filter');
    // };

    //Function to go previous $state
    $scope.getBack = function () {
        $.jStorage.set('filterObj', $scope.filterObj);
        $state.go('filter');
    };


    //To clear filter 
    $scope.clearfilter = function () {
        _.each($scope.filterObj.timelineStatus, function (n) {
            $scope.timelineStatus.push(n);
        });
        $scope.filterObj.isActive = null;
        $scope.filterObj.timelineStatus = [];
    }
})