connector.controller('FilterResultCtrl', function ($scope, $state, $stateParams, MyServices, $ionicScrollDelegate) {

    $scope.profile = _.cloneDeep($.jStorage.get("profile"));
    $scope.getLoginEmployee = _.cloneDeep($.jStorage.get("getLoginEmployee"));
    $scope.role = _.cloneDeep($.jStorage.get("role"));
    $scope.accessToken = _.cloneDeep($.jStorage.get("accessToken"));


    $scope.filterObj = _.cloneDeep($.jStorage.get('filterObj'));
    if ($scope.filterObj != null) {
        if ($scope.filterObj.ownerStatus == null || $scope.filterObj.ownerStatus == "" || $scope.filterObj.ownerStatus == undefined) {
            $scope.filterObj.ownerStatus = "Global";
        }
        $scope.filterObj.pagelimit = 10;
        $scope.filterObj.pagenumber = 1;
        $scope.filterObj.pagelimit = 10;
        $scope.filterObj.ownerId = $scope.getLoginEmployee._id;
        $scope.filterObj.accessToken = $scope.accessToken;
        $scope.filterObj.sorting = ["", 1];
    } else {
        $scope.filterObj = {};
        $scope.filterObj.pagenumber = 1;
        $scope.filterObj.pagelimit = 10;
        $scope.filterObj.ownerId = $scope.getLoginEmployee._id;
        $scope.filterObj.accessToken = $scope.accessToken;
        $scope.filterObj.ownerStatus = "Global";
        $scope.filterObj.sorting = ["", 1];
    }
    $scope.isList = 1;
    $scope.activeButton1 = 'active';
    $scope.noMoreItemsAvailable = false;
    $scope.filterData = [];

    //To switch tab
    $scope.changeTab = function (value) {
        if (value == 1) {
            // $scope.noMoreItemsAvailable = false;
            $scope.filterObj.pagenumber = 1;
            $ionicScrollDelegate.scrollTop();
            $scope.isList = 1;
            $scope.activeButton1 = 'active';
            $scope.activeButton2 = '';
        } else {
            // $scope.noMoreItemsAvailable = false;
            $scope.filterObj.pagenumber = 1;
            $ionicScrollDelegate.scrollTop();
            $scope.isList = 2;
            $scope.activeButton1 = '';
            $scope.activeButton2 = 'active';
        }

    };

    $scope.options = function () {
        $state.go('options');
    };
    //Function to get filtered data
    $scope.getData = function () {
        // $scope.filterObj.sorting = ["", 1];
        // $scope.filterObj.pagenumber = 1;
        // $scope.filterObj.ownerId = "58996fb21d8a3a0fc6ea7820";
        // $scope.filterObj.pagelimit = 10;
        // $scope.filterObj.ownerStatus = "All files";
        // $scope.filterObj.accessToken = "LLKUZluWC8QSKj4P";
        $.jStorage.set('filterObj', $scope.filterObj);
        $scope.temp = _.cloneDeep($scope.filterObj);
        //For branch
        if ($scope.filterObj.branch != undefined) {
            if ($scope.filterObj.branch.length > 0) {
                $scope.temp.branch = [];
                _.each($scope.filterObj.branch, function (n) {
                    $scope.temp.branch.push(n_.id);
                })
            }

        };

        //For city
        if ($scope.filterObj.city != undefined) {
            if ($scope.filterObj.city.length > 0) {
                $scope.temp.city = [];
                _.each($scope.filterObj.city, function (n) {
                    $scope.temp.city.push(n._id);
                })
            }
        }

        //For broker
        if ($scope.filterObj.broker != undefined) {
            if ($scope.filterObj.broker.length > 0) {
                $scope.temp.broker = [];
                _.each($scope.filterObj.broker, function (n) {
                    $scope.temp.broker.push(n._id);
                })
            }
        }

        //For department
        if ($scope.filterObj.department != undefined) {
            if ($scope.filterObj.department.length > 0) {
                $scope.temp.department = [];
                _.each($scope.filterObj.department, function (n) {
                    $scope.temp.department.push(n._id);
                })
            }
        }
        //For insured
        if ($scope.filterObj.insured != undefined) {
            if ($scope.filterObj.insured.length > 0) {
                $scope.temp.insured = [];
                _.each($scope.filterObj.insured, function (n) {
                    $scope.temp.insured.push(n._id);
                })
            }
        }

        //For insurer
        if ($scope.filterObj.insurer != undefined) {
            if ($scope.filterObj.insurer.length > 0) {
                $scope.temp.insurer = [];
                _.each($scope.filterObj.insurer, function (n) {
                    $scope.temp.insurer.push(n._id);
                })
            }
        }

        //For owner
        if ($scope.filterObj.owner != undefined) {
            if ($scope.filterObj.owner.length > 0) {
                $scope.temp.owner = [];
                _.each($scope.filterObj.owner, function (n) {
                    $scope.temp.owner.push(n._id);
                })
            }
        }
        MyServices.getAll($scope.temp, function (data) {
            console.log("final data", data);
            if (data.value) {
                console.log("data.data.results.length", data.data.results);
                if (data.data.results.length > 0) {
                    $scope.noMoreItemsAvailable = true;
                    _.each(data.data.results, function (n) {
                        $scope.filterData.push(n);
                    });
                    console.log(" $scope.filterData", $scope.filterData.length);
                    $scope.totalCount = data.data.total;
                } else if ($scope.filterData) {
                    $scope.noMoreItemsAvailable = false;
                } else {
                    $scope.filterData = [];
                    $scope.noMoreItemsAvailable = false;
                }
            } else {
                $scope.filterData = [];
                $scope.noMoreItemsAvailable = false;
                console.log("Error");
            }
        })
    };
    $scope.getData();

    //Function to go back to filter page
    $scope.filter = function () {
        $state.go('filter');
    };

    $scope.loadmore = function () {
        console.log("loadmore called");
        $scope.filterObj.pagenumber++;
        $ionicScrollDelegate.resize()
        $scope.$broadcast('scroll.infiniteScrollComplete');
        $scope.getData();
    }
})