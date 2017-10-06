connector.controller('DateCtrl', function ($scope, $state, $stateParams, MyServices) {
    $scope.dates = ["Today", "Date Criteria", "As of Today", "MTD", "Monthly", "Quarterly", "Half yearly", "Annual"];
    $scope.months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    $scope.dateType = null;
    $scope.year = null;
    $scope.month = null;
    $scope.showMonth = false;
    $scope.quarterlyRadio = null;
    $scope.DateFilterObj = {};
    $scope.radioHalfYearly = null;
    $scope.filterObj = _.cloneDeep($.jStorage.get('filterObj'));

    if (!_.isEmpty($.jStorage.get('DateFilterObj'))) {
        $scope.dateType = $.jStorage.get('DateFilterObj').dateType;
        $scope.year = $.jStorage.get('DateFilterObj').year;
        if ($scope.year != null || $scope.year != undefined) {
            $scope.showMonth = true;
        }
        $scope.quarterlyRadio = $.jStorage.get('DateFilterObj').quarterlyRadio;
        if ($scope.quarterlyRadio != null) {
            $scope.quarterly = $scope.quarterlyRadio;
        };
        $scope.radioHalfYearly = $.jStorage.get('DateFilterObj').radioHalfYearly;
        if ($scope.radioHalfYearly != null) {
            $scope.halfYearly = $scope.radioHalfYearly;
        }
        $scope.month = $.jStorage.get('DateFilterObj').month;
        $scope.from = new Date($.jStorage.get('DateFilterObj').from);
        $scope.to = new Date($.jStorage.get('DateFilterObj').to);
    }
    //Function to go previous $state
    $scope.getBack = function () {
        console.log(" $scope.from", $scope.from);
        $scope.filterObj.fromDate = $scope.from;
        $scope.filterObj.toDate = $scope.to;
        $scope.DateFilterObj.year = $scope.year;
        $scope.DateFilterObj.month = $scope.month;
        $scope.DateFilterObj.from = $scope.from;
        $scope.DateFilterObj.to = $scope.to;
        $scope.DateFilterObj.quarterlyRadio = $scope.quarterlyRadio;
        $scope.DateFilterObj.radioHalfYearly = $scope.radioHalfYearly;
        $scope.DateFilterObj.dateType = $scope.dateType;
        $.jStorage.set('DateFilterObj', $scope.DateFilterObj);
        $.jStorage.set('filterObj', $scope.filterObj);
        $state.go('filter');
    };

    $scope.dateCriteria = function (val) {
        $scope.from = val;
    }
    //Select date type
    $scope.selectDateType = function (value) {
        $scope.year = null;
        $scope.month = null;
        $scope.from = null;
        $scope.to = null;
        $scope.dateType = value;
        console.log($scope.dateType);
        switch (value) {
            case "Today":
                $scope.from = new Date();
                $scope.to = new Date();
                break;
            case "Date Criteria":
                $scope.from = null;
                $scope.to = new Date();
                break;
            case "As of Today":
                $scope.from = new Date("1/1/1970");
                $scope.to = new Date();
                break;
            case "MTD":
                var year = moment(new Date()).year();
                var month = moment(new Date()).month();
                month++;
                $scope.from = new Date(month + "/1/" + year);
                $scope.to = new Date();
                break;
            case "Monthly":
                $scope.from = "";
                $scope.to = "";
                break;
            case "Quarterly":
                $scope.quarterly = "";
                $scope.quarterlyYear = "";
                $scope.from = "";
                $scope.to = "";
                break;
            case "Half yearly":
                $scope.halfYearly = "";
                $scope.halfYearlyYear = "";
                $scope.from = "";
                $scope.to = "";
                break;
            case "Annual":
                $scope.annualYear = "";
                $scope.from = "";
                $scope.to = "";
                break;
            default:
                {
                    $scope.from = "";
                    $scope.to = "";
                }
        }
    }

    //To get year
    $scope.getYears = function () {
        var year = moment(new Date()).year();
        // year++;
        $scope.years = [];
        for (var i = 1970; i <= year; i++) {
            $scope.years.push(i);
        }
    };
    $scope.getYears();

    $scope.setQuarterlyDate = function (data) {
        console.log('setQuarterlyDate Criteria', data);
        $scope.quarterlyRadio = data;
        if ($scope.year == "" || $scope.year == null) {
            var year = moment(new Date()).year();
        } else {
            var year = $scope.year;
        }
        console.log('years = ', year, $scope.year);
        if (data === "quarterly1") {
            $scope.from = new Date("4/1/" + year);
            $scope.to = new Date("6/30/" + year);
        }
        if (data === "quarterly2") {
            $scope.from = new Date("7/1/" + year);
            $scope.to = new Date("9/30/" + year);
        }
        if (data === "quarterly3") {
            $scope.from = new Date("10/1/" + year);
            $scope.to = new Date("12/31/" + year);
        }
        if (data === "quarterly4") {
            year++;
            $scope.from = new Date("1/1/" + year);
            $scope.to = new Date("3/31/" + year);
        }
    };

    $scope.setHalfYearlyDate = function (data) {
        console.log('setHalfYearlyDate Criteria', data);
        $scope.radioHalfYearly = data;
        if ($scope.year == "" || $scope.year == null) {
            var year = moment(new Date()).year();
        } else {
            var year = $scope.year;
        }
        console.log('years = ', year);
        if (data === "halfYearly1") {
            $scope.from = new Date("4/1/" + year);
            $scope.to = new Date("9/30/" + year);
        }
        if (data === "halfYearly2") {
            $scope.from = new Date("10/1/" + year);
            $scope.to = new Date("3/31/" + year);
        }
    };

    $scope.setQuarterlyYear = function () {
        $scope.filter.quarterly = "";
        $scope.filter.fromDate = "";
        $scope.filter.toDate = "";
    };
    $scope.setHalfYear = function () {
        $scope.halfYearly = "";
        $scope.from = "";
        $scope.to = "";
    };
    $scope.setMonthlyYear = function () {
        $scope.filter.monthlyMonth = "";
        $scope.filter.fromDate = "";
        $scope.filter.toDate = "";
    };
    $scope.setAnnualYear = function () {
        var year = $scope.year;
        $scope.from = new Date("4/1/" + year);
        $scope.to = new Date();
    };
    var month = "";
    $scope.getMonthNumber = function () {
        _.each($scope.months, function (key, value) {
            console.log("$scope.month", $scope.month, key);
            if (key == $scope.month) {
                month = key;
                console.log("values ", value);
                return key;
            }
        });
    };
    $scope.setMonthlyMonth = function (value) {
        $scope.month = value;
        $scope.getMonthNumber();
        console.log("months ", month);
        var start = new Date(month + '/01/' + $scope.year);
        var startDate = moment(month + '/01/' + $scope.year);
        console.log(start);
        var endDate = new Date(startDate.clone().endOf('month'));
        // console.log(endDate);
        $scope.from = start;
        $scope.to = endDate;
    };


    //select year
    $scope.getMyYear = function (val) {

        if (val != null || val != undefined) {
            $scope.year = val;
            $scope.showMonth = true;
        }
    };

    //To save filter obj in jStorage and return to filter page
    // $scope.saveDate = function () {
    //     $scope.filterObj.fromDate = $scope.from;
    //     $scope.filterObj.toDate = $scope.to;
    //     $.jStorage.set('filterObj', $scope.filterObj);
    //     $state.go('filter');
    // };

    //to clear filter
    $scope.clearfilter = function () {
        $scope.filterObj.fromDate = "";
        $scope.filterObj.toDate = "";
        $scope.year = null;
        $scope.month = null;
        $scope.from = null;
        $scope.to = null;
        $scope.dateType = null;
    }

})