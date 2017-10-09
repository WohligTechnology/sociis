var globalfunction = {};
// var adminurl = adminurl;
angular.module('phonecatControllers', ['templateservicemod', 'navigationservice', 'assignmenttemplate', 'ui.bootstrap', 'ui.select', 'ngAnimate', 'toastr', 'ngSanitize', 'angular-flexslider', 'ui.tinymce', 'imageupload', 'ngMap', 'toggle-switch', 'cfp.hotkeys', 'ui.sortable', 'infinite-scroll', 'dragularModule', 'cleave.js', 'monospaced.elastic', 'ngFileUpload'])

    .controller('DashboardCtrl', function ($scope, $window, TemplateService, NavigationService, $timeout, base64, $state) {
        //Used to name the .html file
        $scope.Arr = [];
        $scope.template = TemplateService.changecontent("dashboard", $state);
        console.log(' $scope.template == ', $scope.template);
        $scope.menutitle = NavigationService.makeactive("Dashboard");
        TemplateService.title = $scope.menutitle;
        $scope.navigation = NavigationService.getnav();
        var global = false;
        var allFiles = false;
        // var myFiles = false;
        // var shareWith = false;
        if ($scope.template.assignmentRole['Global View']) {
            if ($scope.template.assignmentRole['Global View'].view.val) {
                global = true;
            }
        }
        if ($scope.template.assignmentRole['All Files']) {
            if ($scope.template.assignmentRole['All Files'].view.val) {
                allFiles = true;
            }
        }
        $scope.refreshBranch = function (data) {
            var formdata = {};
            formdata.keyword = data;
            NavigationService.searchBranch(formdata, 1, function (data) {
                $scope.branchData = data.data.results;
            });
        };
        $scope.summaryFilter = {};
        $scope.summaryFilter.branch = [];
        $scope.assignmentSummary = {};

        $scope.AllAssignmentSummary = function () {
            var branches = [];
            branches = $scope.summaryFilter.branch;
            $scope.summaryFilter.branch = _.map(branches, function (values) {
                return values._id;
            });
            var formData = {};
            formData.branch = $scope.summaryFilter.branch;
            NavigationService.getAssignmentSummary(formData, function (data) {
                if (data.value) {
                    $scope.assignmentSummary = data.data;
                    console.log(' $scope.assignmentSummary', $scope.assignmentSummary);
                }
            });
            // $scope.$apply();        
            $scope.summaryFilter.branch = branches;
        };
        $scope.AllAssignmentSummary();

        $scope.filter = {};
        $scope.getDefaultStatus = function () {
            if (global) {
                $scope.filter.typeOfStatus = "Global";
            } else {
                if (allFiles) {
                    $scope.filter.typeOfStatus = "All files";
                } else {
                    $scope.filter.typeOfStatus = "";
                }
            }
        };
        $scope.getDefaultStatus();
        $scope.getDashCounts = function (dashData) {
            var formData = {};
            formData.typeOfStatus = $scope.filter.typeOfStatus;
            // console.log('formData : ',formData);
            NavigationService.getDashboardCounts(formData, function (data) {
                $scope.Arr = data.data.timelineStatus;
                $scope.statusColor = [];
                $scope.timelineCount = false;
                var Total = 0;
                _.each($scope.Arr, function (n) {
                    Total = Total + n.count;
                });
                if (Total === 0) {
                    $scope.timelineCount = true;
                }
                var totalObj = {
                    _id: "Total",
                    count: Total
                }

                $scope.Arr.push(totalObj);
                var arrTimeline = [{
                    status: "Unassigned",
                    color: "#f5006b",
                    textColor: "#ffffff",
                    order: 1
                }, {
                    status: "Survey Pending",
                    color: "#d500f9",
                    textColor: "#ffffff",
                    order: 2
                }, {
                    status: "ILA Pending",
                    color: "#8000ff",
                    textColor: "#ffffff",
                    order: 3
                }, {
                    status: "LOR Pending",
                    color: "#2222eb",
                    textColor: "#ffffff",
                    order: 4
                }, {
                    status: "Dox Pending",
                    color: "#2979ff",
                    textColor: "#ffffff",
                    order: 5
                }, {
                    status: "Assessment Pending",
                    color: "#00b0ff",
                    textColor: "#000000",
                    order: 6
                }, {
                    status: "Consent Pending",
                    color: "#00e5ff",
                    textColor: "#000000",
                    order: 7
                }, {
                    status: "FSR Pending",
                    color: " #00d7c3",
                    textColor: "#000000",
                    order: 8
                }, {
                    status: "TBB",
                    color: "#00c888",
                    textColor: "#000000",
                    order: 9
                }, {
                    status: "BBND",
                    color: "#28d728",
                    textColor: "#000000",
                    order: 10
                }, {
                    status: "DBND",
                    color: "#76ff03",
                    textColor: "#000000",
                    order: 11
                }, {
                    status: "Delivered",
                    color: "#c6ff00",
                    textColor: "#000000",
                    order: 12
                }, {
                    status: "Collected",
                    color: "#ffea00",
                    textColor: "#000000",
                    order: 13
                }, {
                    status: "ReOpened",
                    color: "#ff6900",
                    textColor: "#ffffff",
                    order: 14
                }, {
                    status: "OnHold",
                    color: "#ff1744",
                    textColor: "#ffffff",
                    order: 15
                }, {
                    status: "Force Closed",
                    color: "#607d8b",
                    textColor: "#ffffff",
                    order: 16
                }, {
                    status: "Total",
                    color: "#ffffff",
                    textColor: "#000000",
                    order: 17
                }];

                $scope.timelineArray = [];
                _.each($scope.Arr, function (mainArr) {
                    _.each(arrTimeline, function (subArr) {
                        if (mainArr._id === subArr.status) {
                            subArr.count = mainArr.count;
                            $scope.timelineArray.push(subArr);
                        }
                    });
                });
                $scope.timelineArray = _.orderBy($scope.timelineArray, ["order"], ["asc"]);
                $scope.approvalsPendingArr = [];
                $scope.approvalView = false;
                if (!_.isEmpty(data.data.sbcPending)) {
                    $scope.approvalsPendingArr.push({
                        status: "Surveyor Approvals",
                        color: "#e600b2",
                        textColor: "#ffffff",
                        order: 1,
                        state: "sbcApproval-list",
                        count: data.data.sbcPending[0].count
                    });
                    $scope.approvalView = true;
                }
                if (!_.isEmpty(data.data.ilaPending)) {
                    $scope.approvalsPendingArr.push({
                        status: "ILA Approvals",
                        color: "#8000ff",
                        textColor: "#ffffff",
                        order: 2,
                        state: "ilaApproval-list",
                        count: data.data.ilaPending[0].count
                    });
                    $scope.approvalView = true;
                }
                if (!_.isEmpty(data.data.lorPending)) {
                    $scope.approvalsPendingArr.push({
                        status: "LOR Approvals",
                        color: "#2222eb",
                        textColor: "#ffffff",
                        order: 3,
                        state: "lorApproval-list",
                        count: data.data.lorPending[0].count
                    });
                    $scope.approvalView = true;
                }
                if (!_.isEmpty(data.data.invoicePending)) {
                    $scope.approvalsPendingArr.push({
                        status: "Invoice Approvals",
                        color: "#14cf58",
                        textColor: "#000000",
                        order: 4,
                        state: "invoiceApproval-list",
                        count: data.data.invoicePending[0].count
                    });
                    $scope.approvalView = true;
                }
                if (!_.isEmpty(data.data.assignmentPending)) {
                    $scope.approvalsPendingArr.push({
                        status: "Assignment Approvals",
                        color: "#ff4022",
                        textColor: "#ffffff",
                        order: 5,
                        state: "assignmentApproval-list",
                        count: data.data.assignmentPending[0].count
                    });
                    $scope.approvalView = true;
                }
                var approvalTotals = 0;
                _.each($scope.approvalsPendingArr, function (n) {
                    approvalTotals = approvalTotals + n.count;
                });
                $scope.appTotal = {
                    status: "Total",
                    color: "#ffffff",
                    textColor: "#000000",
                    order: 6,
                    count: approvalTotals,
                };
                $scope.approvalsPendingArr = _.orderBy($scope.approvalsPendingArr, ["order"], ["asc"]);
            });
        };
        $scope.getDashCounts();



        $scope.gotoAssignmentList = function (data) {
            if (data !== "Total") {
                $state.go("assignment-list", {
                    timelineStatus: [data]
                });
            } else {
                $state.go("assignment-list", {
                    timelineStatus: ["Pending", "Unassigned", "Survey Pending", "ILA Pending", "LOR Pending", "Dox Pending", "Part Dox Pending", "Assessment Pending", "Consent Pending", "JIR Pending", "FSR Pending", "BBND", "DBND", "Collected", "Dispatched", "Force Closed", "ReOpened", "ForceClosed", "OnHold", "Delivered"]
                });
            }
        }

        $scope.colors = ["red", "pink", "sky", "purple", "red", "pink", "sky", "purple"];
    })


    .controller('AccessController', function ($scope, $window, TemplateService, NavigationService, $timeout, $state) {
        if ($.jStorage.get("accessToken")) {

        } else {
            $state.go("login");
        }
    })

    .controller('LoginCtrl', function ($scope, $window, TemplateService, NavigationService, $timeout, $stateParams, $state) {
        //Used to name the .html file

        $scope.menutitle = NavigationService.makeactive("Login");
        TemplateService.title = $scope.menutitle;
        $scope.currentHost = window.location.origin;
        if ($stateParams.id) {
            NavigationService.parseAccessToken($stateParams.id, function () {
                NavigationService.profile(function () {
                    $state.go("dashboard");
                }, function () {
                    $state.go("login");
                });
            });
        } else {
            NavigationService.removeAccessToken();
        }

    })


    .controller('BranchListCtrl', function ($scope, $window, TemplateService, NavigationService, $timeout, $stateParams, $state, toastr) {
        //Used to name the .html file
        $scope.template = TemplateService.changecontent("branch-list", $state);
        $scope.menutitle = NavigationService.makeactive("Branch List");
        TemplateService.title = $scope.menutitle;
        $scope.navigation = NavigationService.getnav();
        $scope.currentPage = $stateParams.page;
        var i = 0;
        $scope.search = {
            keyword: ""
        };
        if ($stateParams.keyword) {
            $scope.search.keyword = $stateParams.keyword;
        }
        $scope.showAllCountries = function (keywordChange) {
            $scope.totalItems = undefined;
            if (keywordChange) {
                $scope.currentPage = 1;
            }
            NavigationService.searchBranch({
                page: $scope.currentPage,
                keyword: $scope.search.keyword
            }, ++i, function (data, ini) {
                if (ini == i) {
                    $scope.allBranch = data.data.results;
                    $scope.totalItems = data.data.total;
                    $scope.maxRow = data.data.options.count;
                }
            });
        };
        $scope.cancel = function () {
            $window.history.back();
        };
        $scope.changePage = function (page) {
            var goTo = "branch-list";
            if ($scope.search.keyword) {
                goTo = "branch-list";
            }
            $state.go(goTo, {
                page: page,
                keyword: $scope.search.keyword
            });
        };
        $scope.showAllCountries();
        $scope.deleteBranch = function (id) {
            globalfunction.confDel(function (value) {
                console.log(value);
                if (value) {
                    NavigationService.deleteBranch(id, function (data) {
                        if (data.value) {
                            $scope.showAllCountries();
                            toastr.success("Branch deleted successfully.", "Branch deleted");
                        } else {
                            toastr.error("There was an error while deleting Branch", "Branch deleting error");
                        }


                    });
                }
            });
        };
    })

    .controller('CountryCtrl', function ($scope, $window, TemplateService, NavigationService, $timeout, $state, $stateParams, toastr) {
        //Used to name the .html file
        $scope.template = TemplateService.changecontent("country-list", $state);
        $scope.menutitle = NavigationService.makeactive("Country List");
        TemplateService.title = $scope.menutitle;
        $scope.navigation = NavigationService.getnav();
        $scope.currentPage = $stateParams.page;
        var i = 0;
        $scope.search = {
            keyword: ""
        };
        if ($stateParams.keyword) {
            $scope.search.keyword = $stateParams.keyword;
        }
        $scope.showAllCountries = function (keywordChange) {
            $scope.totalItems = undefined;
            if (keywordChange) {
                $scope.currentPage = 1;
            }
            NavigationService.searchCountry({
                page: $scope.currentPage,
                keyword: $scope.search.keyword
            }, ++i, function (data, ini) {
                if (ini == i) {
                    $scope.countries = data.data.results;
                    $scope.totalItems = data.data.total;
                    $scope.maxRow = data.data.options.count;
                }
            });
        };
        $scope.cancel = function () {
            $window.history.back();
        };
        $scope.changePage = function (page) {
            var goTo = "country-list";
            if ($scope.search.keyword) {
                goTo = "country-list";
            }
            $state.go(goTo, {
                page: page,
                keyword: $scope.search.keyword
            });
        };
        $scope.showAllCountries();
        $scope.deleteCountry = function (id) {
            globalfunction.confDel(function (value) {
                console.log(value);
                if (value) {
                    NavigationService.deleteCountry(id, function (data) {
                        if (data.value) {
                            $scope.showAllCountries();
                            toastr.success("Country deleted successfully.", "Country deleted");
                        } else {
                            toastr.error("There was an error while deleting country", "Country deleting error");
                        }


                    });
                }
            });
        };
    })

    .controller('ModelViewCtrl', function ($scope, $window, hotkeys, TemplateService, NavigationService, $timeout, $state, $stateParams, toastr, $uibModal) {
        $scope.modelCamel = _.camelCase($stateParams.model);
        var a = _.startCase($scope.modelCamel).split(" ");
        $scope.ModelApi = "";
        _.each(a, function (n) {
            $scope.ModelApi = $scope.ModelApi + n;
        });
        $scope.checker = 1;
        var ownerId = "";
        $scope.ownersId = "";
        $scope.getLoginEmployee = $.jStorage.get("getLoginEmployee");
        ownerId = $scope.getLoginEmployee._id;
        $scope.ownersId = $scope.getLoginEmployee._id;
        $scope.filter = {}
        $scope.MyFiles = function () {
            console.log("In MyFiles", ownerId);
            NavigationService.searchModel($scope.ModelApi, {
                page: $scope.currentPage,
                keyword: $scope.search.keyword,
                filter: {
                    owner: ownerId
                }
            }, ++i, function (data, ini) {
                if (ini == i) {
                    $scope.modelList = data.data.results;
                    $scope.totalItems = data.data.total;
                    $scope.maxRow = data.data.options.count;
                    console.log("modelList", $scope.modelList);
                }
            });
        };
        hotkeys.bindTo($scope).add({
            combo: 'enter',
            description: 'This one goes to 11',
            callback: function () {
                $state.go("create" + $scope.modelCamel);
            }
        });

        $scope.modelCap = _.capitalize($stateParams.model);
        $scope.modelLow = _.lowerCase($stateParams.model);
        $scope.template = TemplateService.changecontent($scope.modelCamel + "-list", $state);
        $scope.menutitle = NavigationService.makeactive($scope.modelCap + " List");
        TemplateService.title = $scope.menutitle;
        $scope.navigation = NavigationService.getnav();
        $scope.currentPage = $stateParams.page;
        var i = 0;
        //
        //
        $scope.search = {
            keyword: ""
        };
        if ($stateParams.keyword) {
            $scope.search.keyword = $stateParams.keyword;
        }
        console.log("OwnerId", ownerId);
        $scope.showAll = function (keywordChange) {
            TemplateService.getLoader();
            $scope.totalItems = undefined;
            if (keywordChange) {
                $scope.currentPage = 1;
            }
            NavigationService.searchModel($scope.ModelApi, {
                page: $scope.currentPage,
                keyword: $scope.search.keyword,
            }, ++i, function (data, ini) {
                if (ini == i) {
                    $scope.modelList = data.data.results;
                    $scope.totalItems = data.data.total;
                    $scope.maxRow = data.data.options.count;
                    console.log("modelListSearchmodel", $scope.modelList);
                    TemplateService.removeLoader();
                }
            });
        };

        $scope.forceClose = function (data) {
            var formData = {};
            formData._id = data._id;
            formData.timelineStatus = "Force Closed";
            formData.getAllTaskStatus.forceClosed = "Done";
            formData.getAllTaskStatus.forceClosedTime = Date.now();
            NavigationService.calcGlobalAssignmentStatus(formData, function (timelineStatus) {
                if (data.value == true) {
                    NavigationService.modelSave("Assignment", formData, function (data) {
                        if (data.value == true) {
                            console.log("DDDDD");
                            $scope.showAssignment();
                        }
                    });
                } else {
                    toastr("Error in ForceClosing Assignment " + formData.name);
                }
            })

        };
        $scope.changePages = function (page, filter) {


            var goTo = $scope.modelCamel + "-list";
            if ($scope.search.keyword) {
                goTo = $scope.modelCamel + "-list";
            }
            console.log("goto", goTo);
            console.log("sorting", [$scope.filter.sortName, $scope.filter.sortNumber]);
            $state.go(goTo, {
                page: page,
            });
        };

        $scope.cancel = function () {
            console.log("Model");
            $window.history.back();
        };
        $scope.changePage = function (page) {
            console.log("In Change Page", $scope.filter);
            var goTo = $scope.modelCamel + "-list";
            if ($scope.search.keyword) {
                goTo = $scope.modelCamel + "-list";
            }
            $state.go(goTo, {
                page: page,
                keyword: $scope.search.keyword
            });
        };

        if ($stateParams.model === "assignment") {
            $scope.showAssignment();
        } else if ($stateParams.model === "invoice") {
            $scope.showAllInvoices();
        } else {
            $scope.showAll();
        }
        $scope.deleteModel = function (id) {
            console.log("Delete Id", id);
            globalfunction.confDel(function (value) {
                console.log("Delete value", value);
                if (value) {
                    console.log("$scope.ModelApi", $scope.ModelApi);
                    NavigationService.deleteModel($scope.ModelApi, id, function (data) {
                        if (data.value) {
                            if ($stateParams.model === "assignment") {
                                $scope.showAssignment();
                            } else {
                                $scope.showAll();
                            }
                            toastr.success($scope.modelCap + " deleted successfully.", $scope.modelCap + " deleted");
                        } else {
                            toastr.error("There was an error while deleting " + $scope.modelCap, $scope.modelCap + " deleting error");
                        }


                    });
                }
            });
        };

        $scope.generateCustomersExcel = function () {
            NavigationService.saveJsonStore($scope.filter2, function (data) {
                window.open(adminurl + 'Customer/generateCustomersExcel?id=' + data + "&accessToken=" +
                    $.jStorage.get("accessToken"), '_blank');
            });
        };

        $scope.changeStatus = function (ind) {
            NavigationService.modelSave($scope.ModelApi, ind, function (data) {
                if (data.value === true) {}
            });
        };

        $scope.checkStateActive = function (activeVar) {
            if (activeVar === "active") {
                $scope.filter.timelineStatus = ["Unassigned", "Survey Pending", "ILA Pending", "LOR Pending", "Dox Pending", "Part Dox Pending", "Assessment Pending", "Consent Pending", "FSR Pending", "OnHold", "DBND"];
            } else {
                $scope.filter.timelineStatus = ["Force Closed", "BBND", "Dispatched", "Collected"];
            }
        };

        $scope.assignmentFilter = function () {
            $scope.filter.dates = ["Today", "Date Criteria", "As of Today", "MTD", "Monthly", "Quarterly", "Half yearly", "Annual"];
            $scope.filter.years = $scope.getYears();
            $scope.filter.months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
            console.log('years : ', $scope.filter.years);
            var modalInstance = $uibModal.open({
                scope: $scope,
                templateUrl: '/frontend/views/modal/assignment-filter.html',
                size: 'lg'
            });
        };

        $scope.getYears = function () {
            var year = moment(new Date()).year();
            // year++;
            var years = [];
            for (var i = 1970; i <= year; i++) {
                years.push(i);
            }
            return years
        };
        //From-To Financial dates filters
        $scope.getDateCriteria = function (data) {
            switch (data) {
                case "Today":
                    $scope.filter.fromDate = new Date();
                    $scope.filter.toDate = new Date();
                    break;
                case "Date Criteria":
                    $scope.filter.fromDate = "";
                    $scope.filter.toDate = new Date();
                    break;
                case "As of Today":
                    $scope.filter.fromDate = new Date("1/1/1970");
                    $scope.filter.toDate = new Date();
                    break;
                case "MTD":
                    var year = moment(new Date()).year();
                    var month = moment(new Date()).month();
                    month++;
                    $scope.filter.fromDate = new Date(month + "/1/" + year);
                    $scope.filter.toDate = new Date();
                    break;
                case "Monthly":
                    $scope.filter.fromDate = "";
                    $scope.filter.toDate = "";
                    break;
                case "Quarterly":
                    $scope.quarterly = "";
                    $scope.quarterlyYear = "";
                    $scope.filter.fromDate = "";
                    $scope.filter.toDate = "";
                    break;
                case "Half yearly":
                    $scope.halfYearly = "";
                    $scope.halfYearlyYear = "";
                    $scope.filter.fromDate = "";
                    $scope.filter.toDate = "";
                    break;
                case "Annual":
                    $scope.annualYear = "";
                    $scope.filter.fromDate = "";
                    $scope.filter.toDate = "";
                    break;
                default:
                    {
                        $scope.filter.fromDate = "";
                        $scope.filter.toDate = "";
                    }
            }
            console.log('date Criteria', data);
        };
        $scope.setQuarterlyDate = function (data) {
            console.log('setQuarterlyDate Criteria', data);
            if ($scope.filter.quarterlyYear == "") {
                var year = moment(new Date()).year();
            } else {
                var year = $scope.filter.quarterlyYear;
            }
            console.log('years = ', year, $scope.filter.quarterlyYear);
            if (data === "quarterly1") {
                $scope.filter.fromDate = new Date("4/1/" + year);
                $scope.filter.toDate = new Date("6/30/" + year);
            }
            if (data === "quarterly2") {
                $scope.filter.fromDate = new Date("7/1/" + year);
                $scope.filter.toDate = new Date("9/30/" + year);
            }
            if (data === "quarterly3") {
                $scope.filter.fromDate = new Date("10/1/" + year);
                $scope.filter.toDate = new Date("12/31/" + year);
            }
            if (data === "quarterly4") {
                year++;
                $scope.filter.fromDate = new Date("1/1/" + year);
                $scope.filter.toDate = new Date("3/31/" + year);
            }
        };
        $scope.setHalfYearlyDate = function (data) {
            console.log('setHalfYearlyDate Criteria', data);
            if ($scope.filter.halfYearlyYear == "") {
                var year = moment(new Date()).year();
            } else {
                var year = $scope.filter.halfYearlyYear;
            }
            console.log('years = ', year);
            if (data === "halfYearly1") {
                $scope.filter.fromDate = new Date("4/1/" + year);
                $scope.filter.toDate = new Date("9/30/" + year);
            }
            if (data === "halfYearly2") {
                $scope.filter.fromDate = new Date("10/1/" + year);
                $scope.filter.toDate = new Date("3/31/" + year);
            }
        };

        $scope.setQuarterlyYear = function () {
            $scope.filter.quarterly = "";
            $scope.filter.fromDate = "";
            $scope.filter.toDate = "";
        };
        $scope.setHalfYear = function () {
            $scope.filter.halfYearly = "";
            $scope.filter.fromDate = "";
            $scope.filter.toDate = "";
        };
        $scope.setMonthlyYear = function () {
            $scope.filter.monthlyMonth = "";
            $scope.filter.fromDate = "";
            $scope.filter.toDate = "";
        };
        $scope.setAnnualYear = function () {
            var year = $scope.filter.annualYear;
            $scope.filter.fromDate = new Date("4/1/" + year);
            $scope.filter.toDate = new Date();
        };
        var month = "";
        $scope.getMonthNumber = function () {
            _.each($scope.filter.months, function (key, value) {
                console.log("values key", value, key);
                if (key == $scope.filter.monthlyMonth) {
                    month = key;
                    console.log("values ", value);
                    return key;
                }
            });
        };
        $scope.setMonthlyMonth = function () {
            $scope.getMonthNumber();
            console.log("months ", month);
            var start = new Date(month + '/01/' + $scope.filter.monthlyYear);
            var startDate = moment(month + '/01/' + $scope.filter.monthlyYear);
            console.log(startDate);
            var endDate = new Date(startDate.clone().endOf('month'));
            console.log(endDate);
            $scope.filter.fromDate = start;
            $scope.filter.toDate = endDate;
        };
        $scope.doFilter = function (data) {
            console.log("Form Data To Filter", data);
        };
        $scope.timelineStatus = ["Unassigned", "Survey Pending", "ILA Pending", "LOR Pending", "Dox Pending", "Part Dox Pending", "Assessment Pending", "Consent Pending", "FSR Pending", "BBND", "Dispatched", "Collected", "Force Closed"];
        var formData2 = {};
        formData2.filter = {
            "name": "Insurer"
        };
        NavigationService.searchModel("CustomerSegment", formData2, 1, function (data) {
            $scope.customerSegmentId = data.data.results[0]._id;
        });
        $scope.refreshInsurer = function (data, insurer) {
            var formdata = {};
            formdata.keyword = data;
            formdata.filter = {
                "customerSegment": $scope.customerSegmentId
            };
            NavigationService.searchCustomer(formdata, 1, function (data) {
                console.log("searchCustomer", data.data.results);
                $scope.insurerData = data.data.results;
            });
        };
        // $scope.refreshInsurer();
        var formData3 = {};
        formData3.filter = {
            "name": "Insured"
        };
        NavigationService.searchModel("CustomerSegment", formData3, 1, function (data) {
            $scope.customerSegmentInsurerdId = data.data.results[0]._id;
        });
        $scope.refreshInsurerd = function (data, insured) {
            var formdata = {};
            formdata.keyword = data;
            formdata.filter = {
                "customerSegment": $scope.customerSegmentInsurerdId
            };
            NavigationService.searchCustomer(formdata, 1, function (data) {
                console.log("searchCustomer", data.data.results);
                $scope.insuredData = data.data.results;
            });
        };
        var formData4 = {};
        formData4.filter = {
            "name": "Broker"
        };
        NavigationService.searchModel("CustomerSegment", formData4, 1, function (data) {
            $scope.brokerSegmentId = data.data.results[0]._id;
        });
        $scope.refreshBroker = function (data, insurer) {
            var formdata = {};
            formdata.keyword = data;
            formdata.filter = {
                "customerSegment": $scope.brokerSegmentId
            };
            NavigationService.searchCustomer(formdata, 1, function (data) {
                console.log("searchCustomer", data.data.results);
                $scope.brokerData = data.data.results;
            });
        };

        $scope.refreshCity = function (data) {
            var formdata = {};
            formdata.keyword = data;
            // formdata.filter = {
            //     "_id": causeloss
            // };
            NavigationService.searchCity(formdata, 1, function (data) {
                console.log("searchPopulatedCity", data.data.results);
                $scope.cityData = data.data.results;
            });
        };

        $scope.refreshBranch = function (data) {
            var formdata = {};
            formdata.keyword = data;
            NavigationService.searchBranch(formdata, 1, function (data) {
                console.log("searchBranch", data.data.results);
                $scope.branchData = data.data.results;
            });
        };

        $scope.refreshDepartment = function (data) {
            var formdata = {};
            formdata.keyword = data;
            // formdata.filter = {
            //     "_id": causeloss
            // };
            NavigationService.searchDepartment(formdata, 1, function (data) {
                console.log("searchCustomer", data.data.results);
                $scope.departmentData = data.data.results;
            });
        };
        var formData5 = {};
        formData5.filter = {
            "name": "Back Office"
        };
        NavigationService.searchModel("Func", formData5, 1, function (data) {
            $scope.backEnd = data.data.results[0]._id;
            $scope.getBackendEmployeeOnly();
        });
        $scope.getBackendEmployeeOnly = function (data) {
            console.log("Data Of OWner", data);
            var formdata = {
                func: $scope.backEnd
            };
            if (data !== undefined) {
                formdata.keyword = data;
            }

            // formdata.filter = {
            //     func: $scope.backEnd,
            //     isSurveyor: true
            // };
            NavigationService.getBackendEmployeeOnly(formdata, 1, function (data) {
                console.log("Backend", data);
                $scope.ownerData = data.data.results;
            });
        };

    })

    .controller('AssignmentCtrl', function ($scope, $window, hotkeys, TemplateService, NavigationService, $timeout, $state, $stateParams, toastr, $uibModal) {
        $scope.template = TemplateService.changecontent("assignment-list", $state);
        console.log('Template ', $scope.template);
        $scope.menutitle = NavigationService.makeactive("Assignment List");
        TemplateService.title = $scope.menutitle;
        $scope.navigation = NavigationService.getnav();
        var global = false;
        var allFiles = false;
        var myFiles = false;
        var shareWith = false;
        if ($scope.template.assignmentRole['Global View']) {
            if ($scope.template.assignmentRole['Global View'].view.val) {
                global = true;
            }
        }
        if ($scope.template.assignmentRole['All Files']) {
            if ($scope.template.assignmentRole['All Files'].view.val) {
                allFiles = true;
            }
        }
        if ($scope.template.assignmentRole['My Files']) {
            if ($scope.template.assignmentRole['My Files'].view.val) {
                myFiles = true;
            }
        }
        if ($scope.template.assignmentRole['Share With']) {
            if ($scope.template.assignmentRole['Share With'].view.val) {
                shareWith = true;
            }
        }
        var ownerId = "";
        $scope.ownersId = "";
        $scope.getLoginEmployee = $.jStorage.get("getLoginEmployee");
        ownerId = $scope.getLoginEmployee._id;
        $scope.ownersId = $scope.getLoginEmployee._id;
        console.log("ownerId", ownerId);
        $scope.clearFilter = function () {
            $scope.filter.from = "";
            $scope.filter.fromDate = "";
            $scope.filter.to = "";
            $scope.filter.toDate = "";
            $scope.filter.owner = [];
            $scope.filter.branch = [];
            $scope.filter.broker = [];
            $scope.filter.city = [];
            $scope.filter.department = [];
            $scope.filter.insured = [];
            $scope.filter.insurer = [];
            $scope.filter.timelineStatus = [];
            $scope.filter.pagenumber = 1;
            $scope.filter.date = "";
            $scope.filter.halfYearly = "";
            $scope.filter.halfYearlyYear = "";
            $scope.filter.quarterly = "";
            $scope.filter.quarterlyYear = "";
            $scope.filter.annualYear = "";
            $scope.filter.monthlyMonth = "";
            $scope.filter.monthlyYear = "";
            $.jStorage.set("AssignmentFilter", $scope.filter);
        };

        $scope.filter = {};
        $scope.getDefaultStatus = function () {
            if (global) {
                $scope.filter.ownerStatus = "Global";
            } else {
                if (allFiles) {
                    $scope.filter.ownerStatus = "All files";
                } else {
                    if (myFiles) {
                        $scope.filter.ownerStatus = "My files";
                    } else {
                        if (shareWith) {
                            $scope.filter.ownerStatus = "Shared with me";
                        } else {
                            $scope.filter.ownerStatus = "";
                        }
                    }
                }
            }
        };

        if ($stateParams.ownerStatus) {
            $scope.filter.ownerStatus = $stateParams.ownerStatus;
        } else {
            $scope.getDefaultStatus();
        }
        if ($stateParams.sorting) {
            $scope.filter.sorting = $stateParams.sorting;
        } else {
            $scope.filter.sorting = [];
        }
        if ($stateParams.timelineStatus) {
            $scope.filter.timelineStatus = $stateParams.timelineStatus;
        } else {
            $scope.filter.timelineStatus = [];
        }
        if ($stateParams.branch) {
            $scope.filter.branch = $stateParams.branch;
        } else {
            $scope.filter.branch = [];
        }
        if ($stateParams.owner) {
            $scope.filter.owner = $stateParams.owner;
        } else {
            $scope.filter.owner = [];
        }
        if ($stateParams.ownerId) {
            $scope.filter.ownerId = $stateParams.ownerId;
        } else {
            $scope.filter.ownerId = ownerId;
        }
        // if ($stateParams.ownerStatus) {
        //     $scope.filter.ownerStatus = $stateParams.ownerStatus;
        // } else {
        //     $scope.filter.ownerStatus = "My files";
        // }
        if ($stateParams.name) {
            $scope.filter.name = $stateParams.name;
        } else {
            $scope.filter.name = "";
        }
        if ($stateParams.city) {
            $scope.filter.city = $stateParams.city;
        } else {
            $scope.filter.city = [];
        }
        if ($stateParams.insurer) {
            $scope.filter.insurer = $stateParams.insurer;
        } else {
            $scope.filter.insurer = [];
        }
        if ($stateParams.broker) {
            $scope.filter.broker = $stateParams.broker;
        } else {
            $scope.filter.broker = [];
        }
        if ($stateParams.insured) {
            $scope.filter.insured = $stateParams.insured;
        } else {
            $scope.filter.insured = [];
        }
        if ($stateParams.from) {
            $scope.filter.from = $stateParams.from;
        } else {
            $scope.filter.from = "";
        }
        if ($stateParams.to) {
            $scope.filter.to = $stateParams.to;
        } else {
            $scope.filter.to = "";
        }
        if ($stateParams.fromDate) {
            $scope.filter.fromDate = $stateParams.fromDate;
        } else {
            $scope.filter.fromDate = "";
        }
        if ($stateParams.toDate) {
            $scope.filter.toDate = $stateParams.toDate;
        } else {
            $scope.filter.toDate = "";
        }
        if ($stateParams.department) {
            $scope.filter.department = $stateParams.department;
        } else {
            $scope.filter.department = [];
        }

        $scope.generateMRExcel = function () {
            NavigationService.saveJsonStore($scope.filter2, function (data) {
                console.log(data);
                window.open(adminurl + 'Assignment/generateExcel?id=' + data + "&accessToken=" +
                    $.jStorage.get("accessToken"), '_blank');
            });
        };

        $scope.generateStatusReport = function () {
            NavigationService.saveJsonStore($scope.filter2, function (data) {
                console.log(data);
                window.open(adminurl + 'Assignment/generateStatusReport?id=' + data + "&accessToken=" +
                    $.jStorage.get("accessToken"), '_blank');
            });
        };

        $scope.transfer = function () {
            var modalInstance = $uibModal.open({
                scope: $scope,
                templateUrl: '/frontend/views/modal/transfer-to.html',
                size: 'md'
            });
        };

        $scope.transferTo = function () {
            if (_.isEmpty($scope.deleteIndexs)) {
                toastr.info("", "Please Select at least One Record");
            } else {
                $scope.transfer();
            }
        };

        $scope.refreshTimeline = function () {
            $scope.getTimeline();
        };
        $scope.transferData = {};
        $scope.transferData.to = {};
        $scope.deleteIndexs = [];
        $scope.deleteSurveyIndexs = [];
        $scope.surveyData = {};
        $scope.selectAllData = function (type, flag) {
            // console.log('flag ', flag);
            if (flag === true) {
                $scope.deleteIndexs = [];
                _.each($scope.modelList, function (value, key) {
                    $scope.deleteIndexs.push({
                        id: key,
                        _id: value._id,
                        name: value.name
                    });
                    // console.log('delete Indexs : ', $scope.deleteIndexs);
                });
            } else {
                $scope.deleteIndexs = [];
            }
        };
        $scope.addDataToTransfer = function (type, index, data, name) {
            // console.log('add data',data);
            var matchIndex = _.findIndex($scope.modelList, function (o) {
                // console.log(" 1", o._id.toString(), "2 : ", data.toString());
                return o._id.toString() == data.toString();
            });
            // console.log("matchIndex : ", matchIndex);
            var duplicateIndex = -1;
            if (!_.isEmpty($scope.deleteIndexs)) {
                duplicateIndex = _.findIndex($scope.deleteIndexs, function (o) {
                    return o.id == matchIndex;
                });
                // console.log('duplicateIndex : ', duplicateIndex);
            }

            if (_.isEmpty($scope.deleteIndexs)) {
                $scope.deleteIndexs.push({
                    id: matchIndex,
                    _id: data.toString(),
                    name: name
                });
            } else {
                if (duplicateIndex === -1) {
                    $scope.deleteIndexs.push({
                        id: matchIndex,
                        _id: data.toString(),
                        name: name
                    });
                } else {
                    $scope.deleteIndexs.splice(duplicateIndex, 1);
                }
            }
            // console.log('deleteIndexs : ', $scope.deleteIndexs);
        };
        $scope.transferSelectedData = function () {
            TemplateService.getToastr();
            NavigationService.transferAssignment({
                ids: $scope.deleteIndexs,
                employeeTo: $scope.transferData.to,
                employeeFrom: {
                    _id: $.jStorage.get("getLoginEmployee")._id,
                    name: $.jStorage.get("getLoginEmployee").name,
                    officeEmail: $.jStorage.get("getLoginEmployee").officeEmail,
                    officeMobile: $.jStorage.get("getLoginEmployee").officeMobile,
                }
            }, function (data) {
                if (data.value) {
                    if (data.data) {
                        toastr.clear();
                        toastr.success("", "Assignment(s) Trasnfered Successfully");
                        // $state.reload();
                        $scope.showAssignment();
                    } else {
                        toastr.clear();
                        toastr.error("There was an error while tranfering assignment ", "Error Transfering Assignment");
                    }
                } else {
                    toastr.clear();
                    toastr.error("There was an error while tranfering assignment ", "Error Transfering Assignment");
                }
            });

        };
        // $scope.transferElement = function (type, index) {
        //     console.log("type : ", type, "index", index);

        //     var formData = {};
        //     var a = {};
        //     formData._id = $scope.assignment._id;
        //     if (type === "jir") {
        //         $scope.assignment.jir.splice(index, 1);
        //         formData.jir = $scope.assignment.jir;
        //         a.title = "Jir Deleted";
        //         a.subTitle = "Jir Deleted Successfully";
        //     } else if (type === "photos") {
        //         $scope.assignment.photos.splice(index, 1);
        //         formData.photos = $scope.assignment.photos;
        //         a.title = "Photos Deleted";
        //         a.subTitle = "Photos Deleted Successfully";
        //     } else if (type === "Documents") {
        //         $scope.assignment.docs.splice(index, 1);
        //         formData.docs = $scope.assignment.docs;
        //         a.title = "Document Deleted";
        //         a.subTitle = "Document Deleted Successfully";
        //     }
        //     NavigationService.assignmentSave(formData, function (data) {
        //         if (data.value) {
        //             if (data.data.nModified === 1) {
        //                 a.type = "Normal";
        //                 a.employee = $scope.employee;
        //                 $scope.timeline.chat.push(a);
        //                 $scope.timelineSave();
        //                 toastr.success(a.subTitle, a.title);
        //             } else {
        //                 toastr.error("There was an error while delete the " + _.capitalize(type), "Error Deleting " + _.capitalize(type));
        //             }
        //         } else {
        //             toastr.error("There was an error while delete the " + _.capitalize(type), "Error Deleting " + _.capitalize(type));
        //         }
        //     });
        // }

        $scope.currentPage = $stateParams.page;
        var i = 0;
        $scope.search = {
            keyword: ""
        };
        if ($stateParams.keyword) {
            $scope.search.keyword = $stateParams.keyword;
        }

        $scope.filter.sortName = "";
        $scope.filter.sortNumber = 1;

        $scope.filter.maxRow = 10;
        $scope.limitValues = [10, 50, 100];
        $scope.changeRecordLimit = function () {
            console.log("changeRecordLimit : ", $scope.filter.maxRow);
            $scope.showAssignment();
        }
        if ($.jStorage.get("AssignmentFilter")) {
            $scope.filter = $.jStorage.get("AssignmentFilter");
            if ($stateParams.timelineStatus) {
                $scope.filter.timelineStatus = $stateParams.timelineStatus
            }
        }
        $scope.showAssignment = function (keywordChange, sorting) {

            if (_.isEmpty(sorting)) {
                sorting = [];
            }
            if (!_.isEmpty($stateParams.sorting)) {
                $scope.filter.sortName = $stateParams.sorting[0];
                $scope.filter.sortNumber = $stateParams.sorting[1];
                console.log("state : sortname::: ", $scope.filter.sortName, $scope.filter.sortNumber);
            }
            if (sorting[0]) {
                console.log("sorting=====", sorting);
                $scope.filter.sortName = sorting[0];
                if (sorting[1] == 1) {
                    $scope.filter.sortNumber = -1;
                } else {
                    $scope.filter.sortNumber = 1;
                }
            }
            TemplateService.getLoader();
            var owners = [];
            owners = $scope.filter.owner;
            $scope.filter.owner = [];
            _.each(owners, function (values) {
                $scope.filter.owner.push(values._id);
            });

            var cities = [];
            cities = $scope.filter.city;
            $scope.filter.city = _.map(cities, function (values) {
                return values._id;
            });

            var branches = [];
            branches = $scope.filter.branch;
            $scope.filter.branch = _.map(branches, function (values) {
                return values._id;
            });

            var departments = [];
            departments = $scope.filter.department;
            $scope.filter.department = _.map(departments, function (values) {
                return values._id;
            });

            var insurers = [];
            insurers = $scope.filter.insurer;
            $scope.filter.insurer = _.map(insurers, function (values) {
                return values._id;
            });

            var insureds = [];
            insureds = $scope.filter.insured;
            $scope.filter.insured = _.map(insureds, function (values) {
                return values._id;
            });

            var brokers = [];
            brokers = $scope.filter.broker;
            $scope.filter.broker = _.map(brokers, function (values) {
                return values._id;
            });
            $scope.totalItems = undefined;
            if (keywordChange) {
                $scope.currentPage = 1;
            }
            console.log("$scope.timelineStatus", $scope.filter.timelineStatus);
            NavigationService.getLoginEmployee($.jStorage.get("profile").email, function (data) {
                ownerId = data.data._id;
                // $scope.ownersId = data.data._id;
                console.log("In $scope.ownersId", ownerId);
                $scope.filter2 = {
                    sorting: [$scope.filter.sortName, $scope.filter.sortNumber],
                    pagenumber: $scope.currentPage,
                    pagelimit: $scope.filter.maxRow,
                    timelineStatus: $scope.filter.timelineStatus,
                    ownerStatus: $scope.filter.ownerStatus,
                    name: $scope.filter.name,
                    owner: $scope.filter.owner,
                    ownerId: ownerId,
                    city: $scope.filter.city,
                    insurer: $scope.filter.insurer,
                    insured: $scope.filter.insured,
                    broker: $scope.filter.broker,
                    from: $scope.filter.from,
                    to: $scope.filter.to,
                    branch: $scope.filter.branch,
                    department: $scope.filter.department,
                    fromDate: $scope.filter.fromDate,
                    toDate: $scope.filter.toDate
                };


                NavigationService.getAllAssignment("Assignment", $scope.filter2, ++i, function (data, ini) {
                    if (ini == i) {
                        $scope.modelList = data.data.results;
                        $scope.totalItems = data.data.total;
                        // $scope.maxRow = $scope.maxRow;
                    }
                    TemplateService.removeLoader();
                });
                $scope.filter.insurer = insurers;
                $scope.filter.insured = insureds;
                $scope.filter.owner = owners;
                $scope.filter.city = cities;
                $scope.filter.branch = branches;
                $scope.filter.broker = brokers;
                $scope.filter.department = departments;

                $.jStorage.set("AssignmentFilter", $scope.filter);
            });
        };
        $scope.changePages = function (page, filter) {
            var goTo = "assignment-list";
            if ($scope.search.keyword) {
                goTo = "assignment-list";
            }
            $state.go(goTo, {
                page: page,
            });
        };

        $scope.cancel = function () {
            $window.history.back();
        };

        $scope.showAssignment();

        $scope.checkStateActive = function (activeVar) {
            if (activeVar === "active") {
                $scope.filter.timelineStatus = ["Unassigned", "Survey Pending", "ILA Pending", "LOR Pending", "Dox Pending", "Assessment Pending", "Consent Pending", "FSR Pending", "TBB"];
            } else {
                $scope.filter.timelineStatus = ["BBND", "DBND", "Delivered", "Collected", "OnHold", "ReOpened", "Force Closed"];
            }
        };

        $scope.assignmentFilter = function () {
            $scope.filter.dates = ["Today", "Date Criteria", "As of Today", "MTD", "Monthly", "Quarterly", "Half yearly", "Annual"];
            $scope.filter.years = $scope.getYears();
            $scope.filter.months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
            console.log('years : ', $scope.filter.years);
            var modalInstance = $uibModal.open({
                scope: $scope,
                templateUrl: '/frontend/views/modal/assignment-filter.html',
                size: 'lg'
            });
        };

        $scope.getYears = function () {
            var year = moment(new Date()).year();
            // year++;
            var years = [];
            for (var i = 1970; i <= year; i++) {
                years.push(i);
            }
            return years
        };
        //From-To Financial dates filters
        $scope.getDateCriteria = function (data) {
            switch (data) {
                case "Today":
                    $scope.filter.fromDate = new Date();
                    $scope.filter.toDate = new Date();
                    break;
                case "Date Criteria":
                    $scope.filter.fromDate = "";
                    $scope.filter.toDate = new Date();
                    break;
                case "As of Today":
                    $scope.filter.fromDate = new Date("1/1/1970");
                    $scope.filter.toDate = new Date();
                    break;
                case "MTD":
                    var year = moment(new Date()).year();
                    var month = moment(new Date()).month();
                    month++;
                    $scope.filter.fromDate = new Date(month + "/1/" + year);
                    $scope.filter.toDate = new Date();
                    break;
                case "Monthly":
                    $scope.filter.fromDate = "";
                    $scope.filter.toDate = "";
                    break;
                case "Quarterly":
                    $scope.quarterly = "";
                    $scope.quarterlyYear = "";
                    $scope.filter.fromDate = "";
                    $scope.filter.toDate = "";
                    break;
                case "Half yearly":
                    $scope.halfYearly = "";
                    $scope.halfYearlyYear = "";
                    $scope.filter.fromDate = "";
                    $scope.filter.toDate = "";
                    break;
                case "Annual":
                    $scope.annualYear = "";
                    $scope.filter.fromDate = "";
                    $scope.filter.toDate = "";
                    break;
                default:
                    {
                        $scope.filter.fromDate = "";
                        $scope.filter.toDate = "";
                    }
            }
            console.log('date Criteria', data);
        };
        $scope.setQuarterlyDate = function (data) {
            console.log('setQuarterlyDate Criteria', data);
            if ($scope.filter.quarterlyYear == "") {
                var year = moment(new Date()).year();
            } else {
                var year = $scope.filter.quarterlyYear;
            }
            console.log('years = ', year, $scope.filter.quarterlyYear);
            if (data === "quarterly1") {
                $scope.filter.fromDate = new Date("4/1/" + year);
                $scope.filter.toDate = new Date("6/30/" + year);
            }
            if (data === "quarterly2") {
                $scope.filter.fromDate = new Date("7/1/" + year);
                $scope.filter.toDate = new Date("9/30/" + year);
            }
            if (data === "quarterly3") {
                $scope.filter.fromDate = new Date("10/1/" + year);
                $scope.filter.toDate = new Date("12/31/" + year);
            }
            if (data === "quarterly4") {
                year++;
                $scope.filter.fromDate = new Date("1/1/" + year);
                $scope.filter.toDate = new Date("3/31/" + year);
            }
        };
        $scope.setHalfYearlyDate = function (data) {
            console.log('setHalfYearlyDate Criteria', data);
            if ($scope.filter.halfYearlyYear == "") {
                var year = moment(new Date()).year();
            } else {
                var year = $scope.filter.halfYearlyYear;
            }
            console.log('years = ', year);
            if (data === "halfYearly1") {
                $scope.filter.fromDate = new Date("4/1/" + year);
                $scope.filter.toDate = new Date("9/30/" + year);
            }
            if (data === "halfYearly2") {
                $scope.filter.fromDate = new Date("10/1/" + year);
                $scope.filter.toDate = new Date("3/31/" + year);
            }
        };

        $scope.setQuarterlyYear = function () {
            $scope.filter.quarterly = "";
            $scope.filter.fromDate = "";
            $scope.filter.toDate = "";
        };
        $scope.setHalfYear = function () {
            $scope.filter.halfYearly = "";
            $scope.filter.fromDate = "";
            $scope.filter.toDate = "";
        };
        $scope.setMonthlyYear = function () {
            $scope.filter.monthlyMonth = "";
            $scope.filter.fromDate = "";
            $scope.filter.toDate = "";
        };
        $scope.setAnnualYear = function () {
            var year = $scope.filter.annualYear;
            $scope.filter.fromDate = new Date("4/1/" + year);
            $scope.filter.toDate = new Date();
        };
        var month = "";
        $scope.getMonthNumber = function () {
            _.each($scope.filter.months, function (key, value) {
                console.log("values key", value, key);
                if (key == $scope.filter.monthlyMonth) {
                    month = key;
                    // console.log("values ", value);
                    return key;
                }
            });
        };
        $scope.setMonthlyMonth = function () {
            $scope.getMonthNumber();
            console.log("months ", month);
            var start = new Date(month + '/01/' + $scope.filter.monthlyYear);
            var startDate = moment(month + '/01/' + $scope.filter.monthlyYear);
            // console.log(startDate);
            var endDate = new Date(startDate.clone().endOf('month'));
            // console.log(endDate);
            $scope.filter.fromDate = start;
            $scope.filter.toDate = endDate;
        };
        $scope.doFilter = function (data) {
            // console.log("Form Data To Filter", data);
        };
        $scope.timelineStatus = ["Unassigned", "Survey Pending", "ILA Pending", "LOR Pending", "Dox Pending", "Assessment Pending", "Consent Pending", "FSR Pending", "TBB", "BBND", "DBND", "Delivered", "Collected", "OnHold", "ReOpened", "Force Closed"];

        $scope.refreshInsurer = function (data, insurer) {
            var formData2 = {};
            formData2.filter = {
                "name": "Insurer"
            };
            NavigationService.searchModel("CustomerSegment", formData2, 1, function (data) {
                $scope.customerSegmentId = data.data.results[0]._id;
            });
            var formdata = {};
            formdata.keyword = data;
            formdata.filter = {
                "customerSegment": $scope.customerSegmentId
            };
            NavigationService.searchCustomer(formdata, 1, function (data) {
                console.log("searchCustomer", data.data.results);
                $scope.insurerData = data.data.results;
            });
        };
        // $scope.refreshInsurer();

        $scope.refreshInsurerd = function (data, insured) {
            var formData3 = {};
            formData3.filter = {
                "name": "Insured"
            };
            NavigationService.searchModel("CustomerSegment", formData3, 1, function (data) {
                $scope.customerSegmentInsurerdId = data.data.results[0]._id;
            });
            var formdata = {};
            formdata.keyword = data;
            formdata.filter = {
                "customerSegment": $scope.customerSegmentInsurerdId
            };
            NavigationService.searchCustomer(formdata, 1, function (data) {
                $scope.insuredData = data.data.results;
            });
        };

        $scope.refreshBroker = function (data, insurer) {
            var formData4 = {};
            formData4.filter = {
                "name": "Broker"
            };
            NavigationService.searchModel("CustomerSegment", formData4, 1, function (data) {
                $scope.brokerSegmentId = data.data.results[0]._id;
            });
            var formdata = {};
            formdata.keyword = data;
            formdata.filter = {
                "customerSegment": $scope.brokerSegmentId
            };
            NavigationService.searchCustomer(formdata, 1, function (data) {
                $scope.brokerData = data.data.results;
            });
        };

        $scope.refreshCity = function (data) {
            var formdata = {};
            formdata.keyword = data;
            // formdata.filter = {
            //     "_id": causeloss
            // };
            NavigationService.searchCity(formdata, 1, function (data) {
                $scope.cityData = data.data.results;
            });
        };

        $scope.refreshBranch = function (data) {
            var formdata = {};
            formdata.keyword = data;
            NavigationService.searchBranch(formdata, 1, function (data) {
                $scope.branchData = data.data.results;
            });
        };

        $scope.refreshDepartment = function (data) {
            var formdata = {};
            formdata.keyword = data;
            // formdata.filter = {
            //     "_id": causeloss
            // };
            NavigationService.searchDepartment(formdata, 1, function (data) {
                $scope.departmentData = data.data.results;
            });
        };

        $scope.refreshEmployee = function (data) {
            NavigationService.searchEmployees({
                keyword: data
            }, 1, function (data) {
                if (_.isEmpty(data.data)) {
                    $scope.employees = [];
                } else {
                    $scope.employees = data.data.results;
                }
            });
        };
        $scope.getBackendEmployeeOnly = function (data) {
            var formData5 = {};
            formData5.filter = {
                "name": "Back Office"
            };
            NavigationService.searchModel("Func", formData5, 1, function (datas) {
                $scope.backEnd = datas.data.results[0]._id;
                var formdata = {
                    func: $scope.backEnd
                };
                if (data !== undefined) {
                    formdata.keyword = data;
                }
                NavigationService.getBackendEmployeeOnly(formdata, 1, function (data) {
                    $scope.ownerData = data.data.results;
                });
            });

        };
        if ($.jStorage.get("AssignmentFilter")) {
            $scope.filter = $.jStorage.get("AssignmentFilter");
        }

    })


    .controller('InvoiceViewCtrl', function ($scope, $window, hotkeys, TemplateService, NavigationService, $timeout, $state, $stateParams, toastr, $uibModal) {
        $scope.modelCamel = _.camelCase($stateParams.model);
        var a = _.startCase($scope.modelCamel).split(" ");
        $scope.ModelApi = "";
        _.each(a, function (n) {
            $scope.ModelApi = $scope.ModelApi + n;
        });
        $scope.checker = 1;
        var ownerId = "";
        $scope.ownersId = "";
        $scope.getLoginEmployee = $.jStorage.get("getLoginEmployee");
        ownerId = $scope.getLoginEmployee._id;
        $scope.ownersId = $scope.getLoginEmployee._id;
        $scope.confCancel = function (invoice) {
            if (invoice.approvalStatus != "Cancelled") {
                globalfunction.confCancel(function (value) {
                    console.log("Delete value", value);
                    if (value) {
                        var formData = {
                            _id: invoice._id
                        }
                        NavigationService.cancelInvoice(formData, function (data) {
                            console.log(data)
                            if (data.value == true) {
                                toastr.success("Invoice Cancelled");
                                $scope.showAllInvoices();
                            } else {
                                toastr.error("Error in Invoice Cancellation");
                            }
                        });
                    }
                });
            } else {
                toastr.error("Invoice already Cancelled");
            }
        };
        $scope.reviseCheck = function (index, invoiceId, assignmentId) {
            console.log("In confInvoice", index);
            if ($scope.modelList[index].approvalStatus == "Approved" || $scope.modelList[index].approvalStatus == "Revised") {
                // toastr.success("Continue");
                $scope.gotoRevise(invoiceId, assignmentId)
            } else {
                toastr.error("Can not Revise " + $scope.modelList[index].approvalStatus + " Invoice");
            }
        };
        // globalfunction.confCancel(function (value) {
        //     console.log("Delete value", value);
        //     if (value) {
        //         var formData1 = {
        //             _id: id,
        //             approvalStatus: "Cancelled"
        //         }
        //         NavigationService.getOneModel($scope.ModelApi, id, function (data) {
        //             var formData = data.data;
        //             console.log("ABCD", formData);
        //             formData.approvalStatus = "Cancelled",
        //                 NavigationService.modelSave($scope.ModelApi, formData, function (data) {
        //                     console.log("ABCD", data);
        //                     if (data.value === true) {
        //                         console.log("Done Success");
        //                         $scope.showAllInvoices();
        //                     }
        //                 });
        //         });
        //     }
        // });

        console.log("stateparams", $stateParams);
        $scope.invoiceFilter = {};
        if ($stateParams.sorting) {
            $scope.invoiceFilter.sorting = $stateParams.sorting;
        } else {
            $scope.invoiceFilter.sorting = [];
        }
        if ($stateParams.invoiceNumber) {
            $scope.invoiceFilter.invoiceNumber = $stateParams.invoiceNumber;
        } else {
            $scope.invoiceFilter.invoiceNumber = "";
        }
        if ($stateParams.timelineStatus) {
            $scope.invoiceFilter.timelineStatus = $stateParams.timelineStatus;
        } else {
            $scope.invoiceFilter.timelineStatus = [];
        }
        if ($stateParams.branch) {
            $scope.invoiceFilter.branch = $stateParams.branch;
        } else {
            $scope.invoiceFilter.branch = [];
        }
        if ($stateParams.owner) {
            $scope.invoiceFilter.owner = $stateParams.owner;
        } else {
            $scope.invoiceFilter.owner = [];
        }
        if ($stateParams.ownerId) {
            $scope.invoiceFilter.ownerId = $stateParams.ownerId;
        } else {
            $scope.invoiceFilter.ownerId = ownerId;
        }
        if ($stateParams.ownerStatus) {
            $scope.invoiceFilter.ownerStatus = $stateParams.ownerStatus;
        } else {
            $scope.invoiceFilter.ownerStatus = "My files";
        }
        if ($stateParams.name) {
            $scope.invoiceFilter.name = $stateParams.name;
        } else {
            $scope.invoiceFilter.name = "";
        }
        if ($stateParams.city) {
            $scope.invoiceFilter.city = $stateParams.city;
        } else {
            $scope.invoiceFilter.city = [];
        }
        if ($stateParams.insurer) {
            $scope.invoiceFilter.insurer = $stateParams.insurer;
        } else {
            $scope.invoiceFilter.insurer = [];
        }
        if ($stateParams.broker) {
            $scope.invoiceFilter.broker = $stateParams.broker;
        } else {
            $scope.invoiceFilter.broker = [];
        }
        if ($stateParams.insured) {
            $scope.invoiceFilter.insured = $stateParams.insured;
        } else {
            $scope.invoiceFilter.insured = [];
        }
        if ($stateParams.from) {
            $scope.invoiceFilter.from = $stateParams.from;
        } else {
            $scope.invoiceFilter.from = "";
        }

        if ($stateParams.to) {
            $scope.invoiceFilter.to = $stateParams.to;
        } else {
            $scope.invoiceFilter.to = "";
        }
        if ($stateParams.fromDate) {
            $scope.invoiceFilter.fromDate = $stateParams.fromDate;
        } else {
            $scope.invoiceFilter.fromDate = "";
        }
        if ($stateParams.toDate) {
            $scope.invoiceFilter.toDate = $stateParams.toDate;
        } else {
            $scope.invoiceFilter.toDate = "";
        }
        if ($stateParams.department) {
            $scope.invoiceFilter.department = $stateParams.department;
        } else {
            $scope.invoiceFilter.department = [];
        }

        $scope.generateSalesRegisterExcel = function () {
            NavigationService.saveJsonStore($scope.invoiceFilter2, function (data) {
                window.open(adminurl + 'Invoice/generateSalesRegisterExcel?id=' + data + "&accessToken=" +
                    $.jStorage.get("accessToken"), '_self');
            });
        };

        $scope.MyFiles = function () {
            console.log("In MyFiles", ownerId);
            NavigationService.searchModel($scope.ModelApi, {
                page: $scope.currentPage,
                keyword: $scope.search.keyword,
                filter: {
                    owner: ownerId
                }
            }, ++i, function (data, ini) {
                if (ini == i) {
                    $scope.modelList = data.data.results;
                    $scope.totalItems = data.data.total;
                    $scope.maxRow = data.data.options.count;
                    console.log("modelList", $scope.modelList);
                }
            });
        };
        hotkeys.bindTo($scope).add({
            combo: 'enter',
            description: 'This one goes to 11',
            callback: function () {
                $state.go("create" + $scope.modelCamel);
            }
        });

        $scope.modelCap = _.capitalize($stateParams.model);
        $scope.modelLow = _.lowerCase($stateParams.model);
        $scope.template = TemplateService.changecontent($scope.modelCamel + "-list", $state);
        $scope.menutitle = NavigationService.makeactive($scope.modelCap + " List");
        TemplateService.title = $scope.menutitle;
        $scope.navigation = NavigationService.getnav();
        $scope.currentPage = $stateParams.page;
        var i = 0;
        //  
        // 
        $scope.search = {
            keyword: ""
        };
        if ($stateParams.keyword) {
            $scope.search.keyword = $stateParams.keyword;
        }
        console.log("OwnerId", ownerId);

        $scope.invoiceFilter.sortName = "";
        $scope.invoiceFilter.sortNumber = 1;

        $scope.invoiceFilter.maxRow = 10;
        $scope.limitValues = [10, 50, 100];
        $scope.changeRecordLimit = function () {
            $scope.showAllInvoices();
        }
        if ($.jStorage.get("InvoiceFilter")) {
            $scope.invoiceFilter = $.jStorage.get("InvoiceFilter");
        }

        $scope.showAllInvoices = function (keywordChange, sorting) {
            if (_.isEmpty(sorting)) {
                sorting = [];
            }
            if (!_.isEmpty($stateParams.sorting)) {
                $scope.invoiceFilter.sortName = $stateParams.sorting[0];
                $scope.invoiceFilter.sortNumber = $stateParams.sorting[1];
                // console.log("state : sortname::: ", $scope.invoiceFilter.sortName, $scope.invoiceFilter.sortNumber);
            }
            if (sorting[0]) {
                console.log("sorting=====", sorting);
                $scope.invoiceFilter.sortName = sorting[0];
                if (sorting[1] == 1) {
                    $scope.invoiceFilter.sortNumber = -1;
                } else {
                    $scope.invoiceFilter.sortNumber = 1;
                }
            }
            TemplateService.getLoader();
            var owners = [];
            owners = $scope.invoiceFilter.owner;
            $scope.invoiceFilter.owner = [];
            _.each(owners, function (values) {
                $scope.invoiceFilter.owner.push(values._id);
            });

            var cities = [];
            cities = $scope.invoiceFilter.city;
            $scope.invoiceFilter.city = _.map(cities, function (values) {
                return values._id;
            });

            var branches = [];
            branches = $scope.invoiceFilter.branch;
            $scope.invoiceFilter.branch = _.map(branches, function (values) {
                return values._id;
            });

            var departments = [];
            departments = $scope.invoiceFilter.department;
            $scope.invoiceFilter.department = _.map(departments, function (values) {
                return values._id;
            });

            var insurers = [];
            insurers = $scope.invoiceFilter.insurer;
            $scope.invoiceFilter.insurer = _.map(insurers, function (values) {
                return values._id;
            });

            var insureds = [];
            insureds = $scope.invoiceFilter.insured;
            $scope.invoiceFilter.insured = _.map(insureds, function (values) {
                return values._id;
            });

            $scope.totalItems = undefined;
            if (keywordChange) {
                $scope.currentPage = 1;
            }
            // NavigationService.getLoginEmployee($.jStorage.get("profile").email, function (data) {
            // ownerId = 
            $scope.invoiceFilter2 = {
                invoiceNumber: $scope.invoiceFilter.invoiceNumber,
                sorting: [$scope.invoiceFilter.sortName, $scope.invoiceFilter.sortNumber],
                pagenumber: $scope.currentPage,
                pagelimit: $scope.invoiceFilter.maxRow,
                timelineStatus: $scope.invoiceFilter.timelineStatus,
                ownerStatus: $scope.invoiceFilter.ownerStatus,
                name: $scope.invoiceFilter.name,
                owner: $scope.invoiceFilter.owner,
                ownerId: ownerId,
                invoiceApproval: $scope.invoiceFilter.invoiceApproval,
                city: $scope.invoiceFilter.city,
                insurer: $scope.invoiceFilter.insurer,
                insured: $scope.invoiceFilter.insured,
                broker: $scope.invoiceFilter.broker,
                from: $scope.invoiceFilter.from,
                to: $scope.invoiceFilter.to,
                branch: $scope.invoiceFilter.branch,
                department: $scope.invoiceFilter.department,
                fromDate: $scope.invoiceFilter.fromDate,
                toDate: $scope.invoiceFilter.toDate
            };

            NavigationService.getAllInvoices($scope.ModelApi, $scope.invoiceFilter2, ++i, function (data, ini) {
                if (ini == i) {
                    $scope.modelList = data.data.results;
                    $scope.totalItems = data.data.total;
                    $scope.maxRow = 10;
                    console.log("modelList", $scope.modelList, $scope.totalItems);
                }
                TemplateService.removeLoader();
            });
            $scope.invoiceFilter.insurer = insurers;
            $scope.invoiceFilter.insured = insureds;
            $scope.invoiceFilter.owner = owners;
            $scope.invoiceFilter.city = cities;
            $scope.invoiceFilter.branch = branches;
            $scope.invoiceFilter.department = departments;
            $.jStorage.set("InvoiceFilter", $scope.invoiceFilter);
            // });
        };
        $scope.invoiceStatus = ["Approved", "Cancelled", "Revised"];
        $scope.changePages = function (page, filter) {

            var goTo = $scope.modelCamel + "-list";
            if ($scope.search.keyword) {
                goTo = $scope.modelCamel + "-list";
            }
            console.log("goto", goTo);
            console.log("sorting", [$scope.invoiceFilter.sortName, $scope.invoiceFilter.sortNumber]);
            $state.go(goTo, {
                page: page,
            });
        };

        $scope.cancel = function () {
            console.log("Model");
            $window.history.back();
        }

        $scope.showAllInvoices();

        $scope.deleteModel = function (id) {
            console.log("Delete Id", id);
            globalfunction.confDel(function (value) {
                console.log("Delete value", value);
                if (value) {
                    console.log("$scope.ModelApi", $scope.ModelApi);
                    NavigationService.deleteModel($scope.ModelApi, id, function (data) {
                        if (data.value) {
                            if ($stateParams.model === "assignment") {
                                $scope.showAssignment();
                            } else {
                                $scope.showAll();
                            }
                            toastr.success($scope.modelCap + " deleted successfully.", $scope.modelCap + " deleted");
                        } else {
                            toastr.error("There was an error while deleting " + $scope.modelCap, $scope.modelCap + " deleting error");
                        }


                    });
                }
            });
        };

        $scope.changeStatus = function (ind) {
            NavigationService.modelSave($scope.ModelApi, ind, function (data) {
                if (data.value === true) {}
            });
        };

        // Sanket
        $scope.gotoRevise = function (invoiceId, assignmentId) {
            $state.go("editInvoice", {
                invoiceId: invoiceId,
                assignmentId: assignmentId
            });
        }

        $scope.checkStateActive = function (activeVar) {
            if (activeVar === "active") {
                $scope.invoiceFilter.timelineStatus = ["Unassigned", "Survey Pending", "ILA Pending", "LOR Pending", "Dox Pending", "Part Dox Pending", "Assessment Pending", "Consent Pending", "FSR Pending", "OnHold", "DBND"];
            } else {
                $scope.invoiceFilter.timelineStatus = ["Force Closed", "BBND", "Dispatched", "Collected"];
            }
        };
        $scope.clearFilter = function () {
            console.log("Sorting", $scope.invoiceFilter.sorting);
            $scope.invoiceFilter.from = "";
            $scope.invoiceFilter.fromDate = "";
            $scope.invoiceFilter.invoiceNumber = "";
            $scope.invoiceFilter.to = "";
            $scope.invoiceFilter.toDate = "";
            $scope.invoiceFilter.owner = [];
            $scope.invoiceFilter.branch = [];
            $scope.invoiceFilter.broker = [];
            $scope.invoiceFilter.city = [];
            $scope.invoiceFilter.department = [];
            $scope.invoiceFilter.insured = [];
            $scope.invoiceFilter.insurer = [];
            $scope.invoiceFilter.timelineStatus = [];
            $scope.invoiceFilter.pagenumber = 1;
            $scope.invoiceFilter.sortName = "";
            $scope.invoiceFilter.date = "";
            $scope.invoiceFilter.halfYearly = "";
            $scope.invoiceFilter.quarterly = "";
            $scope.invoiceFilter.invoiceApproval = [];
            $.jStorage.set("InvoiceFilter", $scope.invoiceFilter);
        };

        $scope.invoiceFilterModal = function () {
            $scope.invoiceFilter.dates = ["Today", "Date Criteria", "As of Today", "MTD", "Monthly", "Quarterly", "Half yearly", "Annual"];
            $scope.invoiceFilter.years = $scope.getYears();
            $scope.invoiceFilter.months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
            var modalInstance = $uibModal.open({
                scope: $scope,
                templateUrl: '/frontend/views/modal/invoice-filter.html',
                size: 'lg'
            });
        };

        $scope.getYears = function () {
            var year = moment(new Date()).year();
            // year++;
            var years = [];
            for (var i = 1970; i <= year; i++) {
                years.push(i);
            }
            return years
        };
        //From-To Financial dates filters
        $scope.getDateCriteria = function (data) {
            switch (data) {
                case "Today":
                    $scope.invoiceFilter.fromDate = new Date();
                    $scope.invoiceFilter.toDate = new Date();
                    break;
                case "Date Criteria":
                    $scope.invoiceFilter.fromDate = "";
                    $scope.invoiceFilter.toDate = new Date();
                    break;
                case "As of Today":
                    $scope.invoiceFilter.fromDate = new Date("1/1/1970");
                    $scope.invoiceFilter.toDate = new Date();
                    break;
                case "MTD":
                    var year = moment(new Date()).year();
                    var month = moment(new Date()).month();
                    month++;
                    $scope.invoiceFilter.fromDate = new Date(month + "/1/" + year);
                    $scope.invoiceFilter.toDate = new Date();
                    break;
                case "Monthly":
                    $scope.invoiceFilter.fromDate = "";
                    $scope.invoiceFilter.toDate = "";
                    break;
                case "Quarterly":
                    $scope.quarterly = "";
                    $scope.quarterlyYear = "";
                    $scope.invoiceFilter.fromDate = "";
                    $scope.invoiceFilter.toDate = "";
                    break;
                case "Half yearly":
                    $scope.halfYearly = "";
                    $scope.halfYearlyYear = "";
                    $scope.invoiceFilter.fromDate = "";
                    $scope.invoiceFilter.toDate = "";
                    break;
                case "Annual":
                    $scope.annualYear = "";
                    $scope.invoiceFilter.fromDate = "";
                    $scope.invoiceFilter.toDate = "";
                    break;
                default:
                    {
                        $scope.invoiceFilter.fromDate = "";
                        $scope.invoiceFilter.toDate = "";
                    }
            }
            console.log('date Criteria', data);
        };
        $scope.setQuarterlyDate = function (data) {
            console.log('setQuarterlyDate Criteria', data);
            if ($scope.invoiceFilter.quarterlyYear == "") {
                var year = moment(new Date()).year();
            } else {
                var year = $scope.invoiceFilter.quarterlyYear;
            }
            console.log('years = ', year, $scope.invoiceFilter.quarterlyYear);
            if (data === "quarterly1") {
                $scope.invoiceFilter.fromDate = new Date("4/1/" + year);
                $scope.invoiceFilter.toDate = new Date("6/30/" + year);
            }
            if (data === "quarterly2") {
                $scope.invoiceFilter.fromDate = new Date("7/1/" + year);
                $scope.invoiceFilter.toDate = new Date("9/30/" + year);
            }
            if (data === "quarterly3") {
                $scope.invoiceFilter.fromDate = new Date("10/1/" + year);
                $scope.invoiceFilter.toDate = new Date("12/31/" + year);
            }
            if (data === "quarterly4") {
                year++;
                $scope.invoiceFilter.fromDate = new Date("1/1/" + year);
                $scope.invoiceFilter.toDate = new Date("3/31/" + year);
            }
        };
        $scope.setHalfYearlyDate = function (data) {
            console.log('setHalfYearlyDate Criteria', data);
            if ($scope.invoiceFilter.halfYearlyYear == "") {
                var year = moment(new Date()).year();
            } else {
                var year = $scope.invoiceFilter.halfYearlyYear;
            }
            console.log('years = ', year);
            if (data === "halfYearly1") {
                $scope.invoiceFilter.fromDate = new Date("4/1/" + year);
                $scope.invoiceFilter.toDate = new Date("9/30/" + year);
            }
            if (data === "halfYearly2") {
                $scope.invoiceFilter.fromDate = new Date("10/1/" + year);
                $scope.invoiceFilter.toDate = new Date("3/31/" + year);
            }
        };

        $scope.setQuarterlyYear = function () {
            $scope.invoiceFilter.quarterly = "";
            $scope.invoiceFilter.fromDate = "";
            $scope.invoiceFilter.toDate = "";
        };
        $scope.setHalfYear = function () {
            $scope.invoiceFilter.halfYearly = "";
            $scope.invoiceFilter.fromDate = "";
            $scope.invoiceFilter.toDate = "";
        };
        $scope.setMonthlyYear = function () {
            $scope.invoiceFilter.monthlyMonth = "";
            $scope.invoiceFilter.fromDate = "";
            $scope.invoiceFilter.toDate = "";
        };
        $scope.setAnnualYear = function () {
            var year = $scope.invoiceFilter.annualYear;
            $scope.invoiceFilter.fromDate = new Date("4/1/" + year);
            $scope.invoiceFilter.toDate = new Date();
        };
        var month = "";
        $scope.getMonthNumber = function () {
            _.each($scope.invoiceFilter.months, function (key, value) {
                console.log("values key", value, key);
                if (key == $scope.invoiceFilter.monthlyMonth) {
                    month = key;
                    console.log("values ", value);
                    return key;
                }
            });
        };
        $scope.setMonthlyMonth = function () {
            $scope.getMonthNumber();
            console.log("months ", month);
            var start = new Date(month + '/01/' + $scope.invoiceFilter.monthlyYear);
            var startDate = moment(month + '/01/' + $scope.invoiceFilter.monthlyYear);
            console.log(startDate);
            var endDate = new Date(startDate.clone().endOf('month'));
            console.log(endDate);
            $scope.invoiceFilter.fromDate = start;
            $scope.invoiceFilter.toDate = endDate;
        };

        $scope.doFilter = function (data) {
            console.log("Form Data To Filter", data);
        };
        $scope.timelineStatus = ["Unassigned", "Survey Pending", "ILA Pending", "LOR Pending", "Dox Pending", "Part Dox Pending", "Assessment Pending", "Consent Pending", "FSR Pending", "BBND", "Dispatched", "Collected", "Force Closed"];
        var formData2 = {};
        formData2.filter = {
            "name": "Insurer"
        };
        NavigationService.searchModel("CustomerSegment", formData2, 1, function (data) {
            $scope.customerSegmentId = data.data.results[0]._id;
        });
        $scope.refreshInsurer = function (data, insurer) {
            var formdata = {};
            formdata.keyword = data;
            formdata.filter = {
                "customerSegment": $scope.customerSegmentId
            };
            NavigationService.searchCustomer(formdata, 1, function (data) {
                console.log("searchCustomer", data.data.results);
                $scope.insurerData = data.data.results;
            });
        };
        // $scope.refreshInsurer();
        var formData3 = {};
        formData3.filter = {
            "name": "Insured"
        };
        NavigationService.searchModel("CustomerSegment", formData3, 1, function (data) {
            $scope.customerSegmentInsurerdId = data.data.results[0]._id;
        });
        $scope.refreshInsurerd = function (data, insured) {
            var formdata = {};
            formdata.keyword = data;
            formdata.filter = {
                "customerSegment": $scope.customerSegmentInsurerdId
            };
            NavigationService.searchCustomer(formdata, 1, function (data) {
                console.log("searchCustomer", data.data.results);
                $scope.insuredData = data.data.results;
            });
        };
        var formData4 = {};
        formData4.filter = {
            "name": "Broker"
        };
        NavigationService.searchModel("CustomerSegment", formData4, 1, function (data) {
            $scope.brokerSegmentId = data.data.results[0]._id;
        });
        $scope.refreshBroker = function (data, insurer) {
            var formdata = {};
            formdata.keyword = data;
            formdata.filter = {
                "customerSegment": $scope.brokerSegmentId
            };
            NavigationService.searchCustomer(formdata, 1, function (data) {
                console.log("searchCustomer", data.data.results);
                $scope.brokerData = data.data.results;
            });
        };

        $scope.refreshCity = function (data) {
            var formdata = {};
            formdata.keyword = data;
            // formdata.filter = {
            //     "_id": causeloss
            // };
            NavigationService.searchCity(formdata, 1, function (data) {
                console.log("searchPopulatedCity", data.data.results);
                $scope.cityData = data.data.results;
            });
        };

        $scope.refreshBranch = function (data) {
            var formdata = {};
            formdata.keyword = data;
            NavigationService.searchBranch(formdata, 1, function (data) {
                console.log("searchBranch", data.data.results);
                $scope.branchData = data.data.results;
            });
        };

        $scope.refreshDepartment = function (data) {
            var formdata = {};
            formdata.keyword = data;
            // formdata.filter = {
            //     "_id": causeloss
            // };
            NavigationService.searchDepartment(formdata, 1, function (data) {
                console.log("searchCustomer", data.data.results);
                $scope.departmentData = data.data.results;
            });
        };
        var formData5 = {};
        formData5.filter = {
            "name": "Back Office"
        };
        NavigationService.searchModel("Func", formData5, 1, function (data) {
            $scope.backEnd = data.data.results[0]._id;
            $scope.getBackendEmployeeOnly();
        });
        $scope.getBackendEmployeeOnly = function (data) {
            console.log("Data Of OWner", data);
            var formdata = {
                func: $scope.backEnd
            };
            if (data !== undefined) {
                formdata.keyword = data;
            }

            // formdata.filter = {
            //     func: $scope.backEnd,
            //     isSurveyor: true
            // };
            NavigationService.getBackendEmployeeOnly(formdata, 1, function (data) {
                console.log("Backend", data);
                $scope.ownerData = data.data.results;
            });
        };

        if ($.jStorage.get("InvoiceFilter")) {
            $scope.invoiceFilter = $.jStorage.get("InvoiceFilter");
        }

    })

    .controller('KnowledgeBaseViewCtrl', function ($scope, $window, hotkeys, TemplateService, NavigationService, $timeout, $state, $stateParams, toastr) {
        //Used to name the .html file        
        $scope.modelCamel = _.camelCase($stateParams.model);
        var a = _.startCase($scope.modelCamel).split(" ");
        $scope.ModelApi = "";
        _.each(a, function (n) {
            $scope.ModelApi = $scope.ModelApi + n;
        });


        hotkeys.bindTo($scope).add({
            combo: 'enter',
            description: 'This one goes to 11',
            callback: function () {
                $state.go("create" + $scope.modelCamel);
            }
        });

        $scope.modelCap = _.capitalize($stateParams.model);
        $scope.modelLow = _.lowerCase($stateParams.model);

        $scope.template = TemplateService.changecontent($scope.modelCamel + "-list");
        $scope.menutitle = NavigationService.makeactive($scope.modelCap + " List");
        TemplateService.title = $scope.menutitle;
        $scope.navigation = NavigationService.getnav();
        $scope.currentPage = $stateParams.page;
        var i = 0;
        //  
        // 
        $scope.search = {
            keyword: ""
        };
        if ($stateParams.keyword) {
            $scope.search.keyword = $stateParams.keyword;
        }
        $scope.getAllTags = function () {
            NavigationService.searchModel("Tag", {}, 0, function (data) {
                $scope.tags = data.data.results;
            });
        };
        $scope.getAllTags();

        var newTag = 7091990;

        // 
        $scope.showAll = function (keywordChange, tagId) {
            $scope.totalItems = undefined;
            if (keywordChange) {
                $scope.currentPage = 1;
            }
            var filterObj = {
                page: $scope.currentPage,
                keyword: $scope.search.keyword
            };
            if (tagId) {
                newTag = tagId;
            }
            if (newTag != 7091990) {
                filterObj.filter = {
                    tag: newTag
                }
            }
            NavigationService.searchKnowledgeBase($scope.ModelApi, filterObj, ++i, function (data, ini) {
                if (ini == i) {
                    $scope.modelList = data.data.results;
                    $scope.totalItems = data.data.total;
                    $scope.maxRow = data.data.options.count;
                    console.log("modelList", $scope.modelList);
                }
            });
        };
        $scope.cancel = function () {
            $window.history.back();
        };
        $scope.changePage = function (page) {
            var goTo = $scope.modelCamel + "-list";
            if ($scope.search.keyword) {
                goTo = $scope.modelCamel + "-list";
            }
            $state.go(goTo, {
                page: page,
                keyword: $scope.search.keyword
            });
        };
        $scope.showAll();


        $scope.deleteModel = function (id) {
            console.log("Delete Id", id);
            globalfunction.confDel(function (value) {
                console.log("Delete value", value);
                if (value) {
                    console.log("$scope.ModelApi", $scope.ModelApi);
                    NavigationService.deleteModel($scope.ModelApi, id, function (data) {
                        if (data.value) {
                            $scope.showAll();
                            toastr.success($scope.modelCap + " deleted successfully.", $scope.modelCap + " deleted");
                        } else {
                            toastr.error("There was an error while deleting " + $scope.modelCap, $scope.modelCap + " deleting error");
                        }


                    });
                }
            });
        };
        $scope.changeStatus = function (ind) {
            NavigationService.modelSave($scope.ModelApi, ind, function (data) {
                if (data.value === true) {}
            });
        };
    })

    .controller('CreateModelCtrl', function ($scope, hotkeys, $window, TemplateService, NavigationService, $timeout, $state, toastr, $stateParams) {
        //Used to name the .html file
        $scope.modelCamel = _.camelCase($stateParams.model);
        var a = _.startCase($scope.modelCamel).split(" ");
        $scope.ModelApi = "";
        _.each(a, function (n) {
            $scope.ModelApi = $scope.ModelApi + n;
        });

        $scope.modelCap = _.capitalize($stateParams.model);
        $scope.modelLow = _.lowerCase($stateParams.model);
        $scope.template = TemplateService.changecontent($scope.modelCamel + "-detail");
        $scope.menutitle = NavigationService.makeactive($scope.modelCap);
        TemplateService.title = $scope.menutitle;
        $scope.navigation = NavigationService.getnav();
        $scope.header = {
            "name": "Create " + $scope.modelCap
        };

        // FOR EMPLOYEE
        $scope.userStatus = [{
            "name": "Active",
            "value": true
        }, {
            "name": "Inactive",
            "value": false
        }];
        $scope.salutations = ["Mr.", "Mrs.", "Ms.", "Dr."];
        $scope.houseColors = ["Red", "Green", "Blue", "Yellow", "White"];

        $scope.dateOptions = {
            showWeeks: true
        };

        $scope.popup = {
            to: false,
            from: false,
            toReciept: false,
            fromReciept: false,
            toCertificate: false,
            fromCertificate: false,
            toLicense: false,
            fromLicense: false,
            birthDate: false,
            marriageDate: false,
            joiningDate: false,
            leavingDate: false
        };


        $scope.format = 'dd-MMMM-yyyy';

        // FOR EMPLOYEE

        $scope.formData = {};
        $scope.formData.status = true;
        $scope.cancel = function () {
            $window.history.back();
        };
        hotkeys.bindTo($scope).add({
            combo: 'ctrl+enter',
            callback: function (formData) {
                NavigationService.modelSave($scope.ModelApi, $scope.formData, function (data) {
                    if (data.value === true) {
                        $window.history.back();
                        toastr.success($scope.modelCap + " " + formData.name + " created successfully.", $scope.modelCap + " Created");
                    } else {
                        toastr.error($scope.modelCap + " creation failed.", $scope.modelCap + " creation error");
                    }
                });
            }
        });
        $scope.saveModel = function (formData) {
            NavigationService.modelSave($scope.ModelApi, $scope.formData, function (data) {
                if (data.value === true) {
                    $window.history.back();
                    toastr.success($scope.modelCap + " " + formData.name + " created successfully.", $scope.modelCap + " Created");
                } else {
                    toastr.error($scope.modelCap + " creation failed.", $scope.modelCap + " creation error");
                }
            });
        };

    })

    .controller('EditModelCtrl', function ($scope, hotkeys, $window, TemplateService, NavigationService, $timeout, $stateParams, $state, toastr, $uibModal) {
        $scope.modelCamel = _.camelCase($stateParams.model);
        var a = _.startCase($scope.modelCamel).split(" ");
        $scope.ModelApi = "";
        _.each(a, function (n) {
            $scope.ModelApi = $scope.ModelApi + n;
        });
        $scope.modelCap = _.capitalize($stateParams.model);
        $scope.modelLow = _.lowerCase($stateParams.model);
        $scope.template = TemplateService.changecontent($scope.modelCamel + "-detail");
        $scope.menutitle = NavigationService.makeactive($scope.modelCap);
        TemplateService.title = $scope.menutitle;
        $scope.navigation = NavigationService.getnav();
        $scope.formData = {};
        $scope.header = {
            "name": "Edit " + $scope.modelCap
        };
        $scope.salutations = ["Mr.", "Mrs.", "Ms.", "Dr."];


        NavigationService.getOneModel($scope.ModelApi, $stateParams.id, function (data) {
            $scope.formData = data.data;
            // if (data.data.city) {
            //     $scope.formData.country = data.data.city.district.state.zone.country._id;
            //     $scope.formData.zone = data.data.city.district.state.zone._id;
            //     $scope.formData.state = data.data.city.district.state._id;
            //     $scope.formData.district = data.data.city.district._id;
            //     $scope.formData.city = data.data.city._id;
            // }
        });
        $scope.cancel = function () {
            $window.history.back();
        };
        hotkeys.bindTo($scope).add({
            combo: 'ctrl+enter',
            callback: function (formData) {
                NavigationService.modelSave($scope.ModelApi, $scope.formData, function (data) {
                    if (data.value === true) {
                        $window.history.back();
                        toastr.success($scope.modelCap + $scope.formData.name + " edited successfully.", $scope.modelCap + " Edited");
                    } else {
                        toastr.error($scope.modelCap + " edition failed.", $scope.modelCap + " editing error");
                    }
                });
            }
        });
        $scope.saveModel = function (formValid) {
            NavigationService.modelSave($scope.ModelApi, $scope.formData, function (data) {
                if (data.value === true) {
                    $window.history.back();
                    toastr.success($scope.modelCap + $scope.formData.name + " edited successfully.", $scope.modelCap + " Edited");
                } else {
                    toastr.error($scope.modelCap + " edition failed.", $scope.modelCap + " editing error");
                }
            });
        };


        //  FOR LIST OF ARRAY STARTS
        $scope.formData.officers = [];
        $scope.addOfficer = function () {
            var modalInstance = $uibModal.open({
                scope: $scope,
                templateUrl: '/frontend/views/modal/modal-officer.html',
                size: 'lg'
            });
        };
        $scope.$watch("modelData.from", function (newVal, oldVal) {

            console.log("OLD DATA");
            $scope.abc();
        });
        $scope.$watch("modelData.to", function (newVal, oldVal) {
            $scope.abc();
        });
        $scope.abc = function (modalData) {
            console.log("IIIIIIIIIIIIIIINNNNNNNNNNNNN");
            console.log("Data", modalData);
        };
        $scope.createOfficer = function (modelData) {
            $scope.formData.officers.push(modelData);
            console.log($scope.formData);
        };
        //  FOR LIST OF ARRAY ENDS
    })
    .controller('EditTaxCtrl', function ($scope, hotkeys, $window, TemplateService, NavigationService, $timeout, $stateParams, $state, toastr, $uibModal) {
        $scope.modelCamel = _.camelCase($stateParams.model);
        var a = _.startCase($scope.modelCamel).split(" ");
        $scope.ModelApi = "";
        _.each(a, function (n) {
            $scope.ModelApi = $scope.ModelApi + n;
        });
        $scope.modelCap = _.capitalize($stateParams.model);
        $scope.modelLow = _.lowerCase($stateParams.model);
        $scope.template = TemplateService.changecontent($scope.modelCamel + "-detail");
        $scope.menutitle = NavigationService.makeactive($scope.modelCap);
        TemplateService.title = $scope.menutitle;
        $scope.navigation = NavigationService.getnav();
        $scope.formData = {};
        $scope.header = {
            "name": "Edit " + $scope.modelCap
        };
        $scope.salutations = ["Mr.", "Mrs.", "Ms.", "Dr."];

        NavigationService.getOneModel($scope.ModelApi, $stateParams.id, function (data) {
            $scope.formData = data.data;
            $scope.formData.fromDate = new Date(data.data.fromDate);
            $scope.formData.toDate = new Date($scope.formData.toDate);
        });
        $scope.cancel = function () {
            $window.history.back();
        };
        hotkeys.bindTo($scope).add({
            combo: 'ctrl+enter',
            callback: function (formData) {
                NavigationService.modelSave($scope.ModelApi, $scope.formData, function (data) {
                    if (data.value === true) {
                        $window.history.back();
                        toastr.success($scope.modelCap + $scope.formData.name + " edited successfully.", $scope.modelCap + " Edited");
                    } else {
                        toastr.error($scope.modelCap + " edition failed.", $scope.modelCap + " editing error");
                    }
                });
            }
        });
        $scope.saveModel = function (formValid) {
            NavigationService.modelSave($scope.ModelApi, $scope.formData, function (data) {
                if (data.value === true) {
                    $window.history.back();
                    toastr.success($scope.modelCap + " " + $scope.formData.name + " edited successfully.", $scope.modelCap + " Edited");
                } else {
                    toastr.error($scope.modelCap + " edition failed.", $scope.modelCap + " editing error");
                }
            });
        };


        //  FOR LIST OF ARRAY STARTS
        $scope.formData.officers = [];
        $scope.addOfficer = function () {
            var modalInstance = $uibModal.open({
                scope: $scope,
                templateUrl: '/frontend/views/modal/modal-officer.html',
                size: 'lg'
            });
        };
        $scope.$watch("modelData.from", function (newVal, oldVal) {

            console.log("OLD DATA");
            $scope.abc();
        });
        $scope.$watch("modelData.to", function (newVal, oldVal) {
            $scope.abc();
        });
        $scope.abc = function (modalData) {
            console.log("IIIIIIIIIIIIIIINNNNNNNNNNNNN");
            console.log("Data", modalData);
        };
        $scope.createOfficer = function (modelData) {
            $scope.formData.officers.push(modelData);
            console.log($scope.formData);
        };
        //  FOR LIST OF ARRAY ENDS

    })


    .controller('CreateCountryCtrl', function ($scope, hotkeys, $window, TemplateService, NavigationService, $timeout, $state, toastr) {
        //Used to name the .html file

        $scope.template = TemplateService.changecontent("country-detail");
        $scope.menutitle = NavigationService.makeactive("Country");
        TemplateService.title = $scope.menutitle;
        $scope.navigation = NavigationService.getnav();

        $scope.header = {
            "name": "Create Country"
        };
        $scope.formData = {};
        $scope.cancel = function () {
            $window.history.back();
        };
        hotkeys.bindTo($scope).add({
            combo: 'ctrl+enter',
            callback: function (formData) {
                NavigationService.countrySave($scope.formData, function (data) {
                    if (data.value === true) {
                        // $state.go('country-list');
                        $window.history.back();
                        toastr.success("Country " + $scope.formData.name + " created successfully.", "Country Created");
                    } else {
                        toastr.error("Country creation failed.", "Country creation error");
                    }
                });
            }
        });
        $scope.saveCountry = function (formData) {
            console.log($scope.formData);
            NavigationService.countrySave($scope.formData, function (data) {
                if (data.value === true) {
                    // $state.go('country-list');
                    $window.history.back();
                    toastr.success("Country " + $scope.formData.name + " created successfully.", "Country Created");
                } else {
                    toastr.error("Country creation failed.", "Country creation error");
                }
            });
        };

    })

    .controller('CreateLorCategoryCtrl', function ($scope, hotkeys, $window, TemplateService, NavigationService, $timeout, $state, toastr, $uibModal) {
        //Used to name the .html file

        $scope.template = TemplateService.changecontent("lorCategory-detail");
        $scope.menutitle = NavigationService.makeactive("LorCategory");
        TemplateService.title = $scope.menutitle;
        $scope.navigation = NavigationService.getnav();

        $scope.header = {
            "name": "Create Invoice Expenditure"
        };
        $scope.formData = {};
        $scope.cancel = function () {
            $window.history.back();
        };
        $scope.salutations = ["Original", "Copy"];
        hotkeys.bindTo($scope).add({
            combo: 'ctrl+enter',
            callback: function (formData) {
                console.log($scope.formData);
                NavigationService.lorCategorySave($scope.formData, function (data) {
                    if (data.value === true) {
                        $window.history.back();
                        toastr.success("LorCategory " + $scope.formData.name + " created successfully.", "LorCategory Created");
                    } else {
                        toastr.error("LorCategory creation failed.", "LorCategory creation error");
                    }
                });
            }
        });

        $scope.saveLorCategory = function (formData) {
            console.log($scope.formData);
            NavigationService.lorCategorySave($scope.formData, function (data) {
                if (data.value === true) {
                    $window.history.back();
                    toastr.success("LorCategory " + $scope.formData.name + " created successfully.", "LorCategory Created");
                } else {
                    toastr.error("LorCategory creation failed.", "LorCategory creation error");
                }
            });
        };

    })

    .controller('EditLorCategoryCtrl', function ($scope, hotkeys, $window, TemplateService, NavigationService, $timeout, $stateParams, $state, toastr, $uibModal) {
        //Used to name the .html file

        $scope.template = TemplateService.changecontent("lorCategory-detail");
        $scope.menutitle = NavigationService.makeactive("LorCategory");
        TemplateService.title = $scope.menutitle;
        $scope.navigation = NavigationService.getnav();
        $scope.formData = {};
        $scope.salutations = ["Original", "Copy"];
        $scope.header = {
            "name": "Edit Country"
        };

        NavigationService.getOneModel("LorCategory", $stateParams.id, function (data) {
            $scope.formData = data.data;
        });
        $scope.cancel = function () {
            $window.history.back();
        };
        hotkeys.bindTo($scope).add({
            combo: 'ctrl+enter',
            callback: function (formData) {
                console.log($scope.formData);
                NavigationService.lorCategorySave($scope.formData, function (data) {
                    if (data.value === true) {
                        $window.history.back();
                        toastr.success("LorCategory " + $scope.formData.name + " created successfully.", "LorMaster Created");
                    } else {
                        toastr.error("LorCategory creation failed.", "LorCategory creation error");
                    }
                });
            }
        });
        $scope.saveLorCategory = function (formValid) {
            console.log($scope.formData);
            NavigationService.lorCategorySave($scope.formData, function (data) {
                if (data.value === true) {
                    $window.history.back();
                    toastr.success("LorCategory " + $scope.formData.name + " created successfully.", "LorMaster Created");
                } else {
                    toastr.error("LorCategory creation failed.", "LorCategory creation error");
                }
            });
        };

    })
    .controller('CreateLorMasterCtrl', function ($scope, hotkeys, $window, TemplateService, NavigationService, $timeout, $state, toastr, $uibModal) {
        //Used to name the .html file

        $scope.template = TemplateService.changecontent("lorMaster-detail");
        $scope.menutitle = NavigationService.makeactive("LorMaster");
        TemplateService.title = $scope.menutitle;
        $scope.navigation = NavigationService.getnav();

        $scope.header = {
            "name": "Create Invoice Expenditure"
        };
        $scope.formData = {};
        $scope.cancel = function () {
            $window.history.back();
        };
        $scope.salutations = ["Original", "Copy"];
        hotkeys.bindTo($scope).add({
            combo: 'ctrl+enter',
            callback: function (formData) {
                console.log($scope.formData);
                NavigationService.lorMasterSave($scope.formData, function (data) {
                    if (data.value === true) {
                        $window.history.back();
                        toastr.success("LorMaster " + $scope.formData.name + " created successfully.", "LorMaster Created");
                    } else {
                        toastr.error("LorMaster creation failed.", "LorMaster creation error");
                    }
                });
            }
        });

        $scope.saveLorMaster = function (formData) {
            console.log($scope.formData);
            NavigationService.lorMasterSave($scope.formData, function (data) {
                if (data.value === true) {
                    $window.history.back();
                    toastr.success("LorMaster " + $scope.formData.name + " created successfully.", "LorMaster Created");
                } else {
                    toastr.error("LorMaster creation failed.", "LorMaster creation error");
                }
            });
        };

    })

    .controller('EditLorMasterCtrl', function ($scope, hotkeys, $window, TemplateService, NavigationService, $timeout, $stateParams, $state, toastr, $uibModal) {
        //Used to name the .html file

        $scope.template = TemplateService.changecontent("lorMaster-detail");
        $scope.menutitle = NavigationService.makeactive("LorMaster");
        TemplateService.title = $scope.menutitle;
        $scope.navigation = NavigationService.getnav();
        $scope.formData = {};
        $scope.salutations = ["Original", "Copy"];
        $scope.header = {
            "name": "Edit Country"
        };

        NavigationService.getOneModel("LorMaster", $stateParams.id, function (data) {
            $scope.formData = data.data;
        });
        $scope.refreshLorCategory = function (data) {
            var formdata = {};
            formdata.keyword = data;
            NavigationService.searchLorCategory(formdata, 1, function (data) {
                console.log("LorCategory", data);
                $scope.lorcategory = data.data.results;
            });
        };
        $scope.cancel = function () {
            $window.history.back();
        };
        hotkeys.bindTo($scope).add({
            combo: 'ctrl+enter',
            callback: function (formData) {
                console.log($scope.formData);
                NavigationService.lorMasterSave($scope.formData, function (data) {
                    if (data.value === true) {
                        $window.history.back();
                        toastr.success("LorMaster " + $scope.formData.name + " created successfully.", "LorMaster Created");
                    } else {
                        toastr.error("LorMaster creation failed.", "LorMaster creation error");
                    }
                });
            }
        });
        $scope.saveLorMaster = function (formValid) {
            console.log($scope.formData);
            NavigationService.lorMasterSave($scope.formData, function (data) {
                if (data.value === true) {
                    $window.history.back();
                    toastr.success("LorMaster " + $scope.formData.name + " created successfully.", "LorMaster Created");
                } else {
                    toastr.error("LorMaster creation failed.", "LorMaster creation error");
                }
            });
        };

    })




    .controller('CreateInvoiceExpenditureCtrl', function ($scope, hotkeys, $window, TemplateService, NavigationService, $timeout, $state, toastr, $uibModal) {
        //Used to name the .html file

        $scope.template = TemplateService.changecontent("invoiceExpenditure-detail");
        $scope.menutitle = NavigationService.makeactive("InvoiceExpenditure");
        TemplateService.title = $scope.menutitle;
        $scope.navigation = NavigationService.getnav();

        $scope.header = {
            "name": "Create Invoice Expenditure"
        };
        $scope.formData = {};
        $scope.formData.rateArray = [];
        $scope.cancel = function () {
            $window.history.back();
        };
        hotkeys.bindTo($scope).add({
            combo: 'ctrl+enter',
            callback: function (formData) {
                NavigationService.invoiceExpenditureSave($scope.formData, function (data) {
                    if (data.value === true) {
                        $window.history.back();
                        toastr.success("InvoiceExpenditure " + formData.name + " created successfully.", "InvoiceExpenditure Created");
                    } else {
                        toastr.error("InvoiceExpenditure creation failed.", "InvoiceExpenditure creation error");
                    }
                });
            }
        });

        $scope.addModal = function (filename, index, holdobj, data, current, wholeObj) {
            if (index !== "") {
                $scope.modalData = data;
                $scope.modalIndex = index;
                $scope.modalData.validFrom = new Date(data.validFrom);
                $scope.modalData.validTo = new Date(data.validTo);
            } else {
                $scope.modalData = {};
                $scope.modalIndex = "";
            }
            $scope.wholeObj = wholeObj;
            $scope.current = current;
            $scope.holdObject = holdobj;
            var modalInstance = $uibModal.open({
                scope: $scope,
                templateUrl: '/frontend/views/modal/' + filename + '.html',
                size: 'lg'
            });
        };

        $scope.addElements = function (moddata) {
            if ($scope.modalIndex !== "") {
                $scope.formData.rate = moddata.rate;
                $scope.wholeObj[$scope.modalIndex] = moddata;
            } else {
                $scope.newjson = moddata;
                var a = moddata;
                switch ($scope.holdObject) {
                    case "rateArray":
                        $scope.formData.rate = moddata.rate;
                        $scope.formData.rateArray.push(moddata);
                        break;
                    default:
                        {
                            $scope.wholeObj.push($scope.newjson);
                        }
                }
            }
        };

        $scope.deleteElements = function (index, data) {
            data.splice(index, 1);
        };

        $scope.saveInvoiceExpenditure = function (formData) {
            console.log($scope.formData);
            NavigationService.invoiceExpenditureSave($scope.formData, function (data) {
                if (data.value === true) {
                    $window.history.back();
                    toastr.success("InvoiceExpenditure " + formData.name + " created successfully.", "InvoiceExpenditure Created");
                } else {
                    toastr.error("InvoiceExpenditure creation failed.", "InvoiceExpenditure creation error");
                }
            });
        };

    })

    .controller('EditInvoiceExpenditureCtrl', function ($scope, hotkeys, $window, TemplateService, NavigationService, $timeout, $stateParams, $state, toastr, $uibModal) {
        //Used to name the .html file

        $scope.template = TemplateService.changecontent("invoiceExpenditure-detail");
        $scope.menutitle = NavigationService.makeactive("InvoiceExpenditure");
        TemplateService.title = $scope.menutitle;
        $scope.navigation = NavigationService.getnav();
        $scope.formData = {};
        $scope.formData.rateArray = [];

        $scope.header = {
            "name": "Edit Country"
        };

        NavigationService.getOneinvoiceExpenditure($stateParams.id, function (data) {
            $scope.formData = data.data;
            console.log('$scope.oneCountry', $scope.oneCountry);

        });
        $scope.cancel = function () {
            $window.history.back();
        };

        $scope.addModal = function (filename, index, holdobj, data, current, wholeObj) {
            if (index !== "") {
                $scope.modalData = data;
                $scope.modalIndex = index;
                $scope.modalData.validFrom = new Date(data.validFrom);
                $scope.modalData.validTo = new Date(data.validTo);
            } else {
                $scope.modalData = {};
                $scope.modalIndex = "";
            }
            $scope.wholeObj = wholeObj;
            $scope.current = current;
            $scope.holdObject = holdobj;
            var modalInstance = $uibModal.open({
                scope: $scope,
                templateUrl: '/frontend/views/modal/' + filename + '.html',
                size: 'lg'
            });
        };

        $scope.addElements = function (moddata) {
            if ($scope.modalIndex !== "") {
                $scope.formData.rate = moddata.rate;
                $scope.wholeObj[$scope.modalIndex] = moddata;
            } else {
                $scope.newjson = moddata;
                var a = moddata;
                switch ($scope.holdObject) {
                    case "rateArray":
                        $scope.formData.rate = moddata.rate;
                        $scope.formData.rateArray.push(moddata);
                        break;
                    default:
                        {
                            $scope.wholeObj.push($scope.newjson);
                        }
                }
            }
        };

        $scope.deleteElements = function (index, data) {
            data.splice(index, 1);
        };

        hotkeys.bindTo($scope).add({
            combo: 'ctrl+enter',
            callback: function (formData) {
                NavigationService.invoiceExpenditureSave($scope.formData, function (data) {
                    if (data.value === true) {
                        $window.history.back();
                        console.log("Check this one");
                        toastr.success("InvoiceExpenditure " + $scope.formData.name + " edited successfully.", "InvoiceExpenditure Edited");
                    } else {
                        toastr.error("InvoiceExpenditure edition failed.", "InvoiceExpenditure editing error");
                    }
                });
            }
        });

        $scope.saveInvoiceExpenditure = function (formValid) {
            NavigationService.invoiceExpenditureSave($scope.formData, function (data) {
                if (data.value === true) {
                    $window.history.back();
                    console.log("Check this one");
                    toastr.success("InvoiceExpenditure " + $scope.formData.name + " edited successfully.", "InvoiceExpenditure Edited");
                } else {
                    toastr.error("InvoiceExpenditure edition failed.", "InvoiceExpenditure editing error");
                }
            });
        };

    })
    .controller('CreateAssignmentCtrl', function ($scope, $window, TemplateService, hotkeys, NavigationService, $filter, $timeout, $state, toastr, $stateParams, $uibModal) {
        //Used to name the .html file

        $scope.template = TemplateService.changecontent("assignment-detail");
        $scope.menutitle = NavigationService.makeactive("Assignment");
        TemplateService.title = $scope.menutitle;
        $scope.navigation = NavigationService.getnav();
        $scope.header = {
            "name": "Create Assignment"
        };
        $scope.a = function () {
            console.log("CTRL + ENTER");
        };
        $scope.loginUser = $.jStorage.get("getLoginEmployee");
        $scope.hideSaveCancel = false;
        $scope.formData = {};
        $scope.formData.status = true;
        $scope.formData.appointment = $stateParams.pdf;
        $scope.formData.invoices = [];
        $scope.formData.products = [];
        $scope.formData.LRs = [];
        $scope.formData.vehicleNumber = [];
        $scope.formData.others = [];
        $scope.formData.shareWith = [];
        var person = {
            persons: []
        };
        person.persons.push($scope.loginUser);
        console.log(person);
        $scope.formData.shareWith.push(person);
        $scope.formData.locationArr = [];
        $scope.formData.product = [];
        $scope.modalData = {};
        $scope.modalIndex = "";
        $scope.wholeObj = [];
        $scope.ownerEmail = {};
        $scope.addModels = function (dataArray, data) {
            dataArray.push(data);
        };
        $scope.formData.isInsured = true;
        $scope.formData.typeOfClaim = true;
        // cancel
        $scope.cancel = function () {
            $window.history.back();
        };
        $scope.dateOfAppointmentLimit = {
            maxDate: new Date()
        };

        hotkeys.bindTo($scope).add({
            combo: 'ctrl+enter',
            callback: function (formData) {
                $scope.hideSaveCancel = true;
                NavigationService.assignmentSave($scope.formData, function (data) {
                    console.log(data);
                    if (data.value === true) {

                        // $state.go('assignment-list');
                        $window.history.back();
                        toastr.success("Assignment " + data.data.name + " created successfully.", "Assignment Created");
                    } else {
                        $scope.hideSaveCancel = false;
                        toastr.error("Assignment creation failed, " + data.error.message + ".", "Assignment creation error");
                    }
                });
            }
        });
        var formData2 = {}
        formData2.filter = {
            "name": "Back Office"
        };
        NavigationService.searchModel("Func", formData2, 1, function (data) {
            $scope.backEnd = data.data.results[0]._id;
            $scope.getBackendEmployeeOnly();
        });


        $scope.populateAddress = function (data) {
            console.log("In Populate");
            var formdata = {};
            formData.zone = data;
            console.log("Form Data", formData);
        };

        $scope.clone = function (data) {
            console.log("Done", data);
            $state.go("createassignment", {
                'assignment': data,
                'pdf': $stateParams.pdf
            });
        }
        //  CLONE ASSIGNMENT
        if ($stateParams.assignment) {
            NavigationService.getOneAssignments("Assignment", $stateParams.assignment, function (data) {
                $scope.formData.clone = data.data._id;
                $scope.formData.company = data.data.company;
                $scope.formData.office = data.data.office;
                $scope.formData.branch = data.data.branch;
                $scope.formData.department = data.data.department;
                $scope.formData.owner = data.data.owner;
                $scope.formData.typeOfClaim = data.data.typeOfClaim;
                $scope.formData.shareWith = data.data.shareWith;
                $scope.formData.isInsured = data.data.isInsured;
                $scope.formData.postLoss = data.data.postLoss;
                $scope.formData.customer = data.data.customer;
                $scope.formData.segment = data.data.segment;
                $scope.formData.customerCompany = data.data.customerCompany;
                $scope.formData.insured = data.data.insured;
                $scope.formData.insuredOffice = data.data.insuredOffice;
                $scope.formData.insurer = data.data.insurer;
                $scope.formData.insurerOffice = data.data.insurerOffice;
                $scope.formData.broker = data.data.broker;
                $scope.formData.brokerOffice = data.data.brokerOffice;
                $scope.formData.policyDepartment = data.data.policyDepartment;
                $scope.formData.policyType = data.data.policyType;
            });
        }

        NavigationService.searchCompany({}, 1, function (data) {
            $scope.formData.company = data.data.results[0]._id;
        });
        //$scope.ownerEmail = $.jStorage.get("profile").email;
        NavigationService.getEmployeeOfficeEmail({
            email: $.jStorage.get("profile").email
        }, 1, function (data) {

        });
        if ($stateParams.emailId) {
            console.log($stateParams);
            $.jStorage.set("messageId", $stateParams.emailId);
        }

        console.log("state params", $stateParams, "$.jStorage.get('messageId')", $.jStorage.get("messageId"));
        NavigationService.detailEmail({
            "messageId": $.jStorage.get("messageId")
        }, function (data) {
            $scope.formData.email = data.data;
            console.log("Email ............", $scope.formData.email, data);
            var a = $filter("base64url")(data.data.raw);

            $scope.formData.email.attachment = [];
            switch ($scope.formData.email.payload.mimeType) {
                case "multipart/related":
                    {
                        _.each($scope.formData.email.payload.parts, function (data) {
                            console.log("in parts");
                            console.log(data);
                            if (data.mimeType == "multipart/alternative") {
                                _.each(data.parts, function (data2) {
                                    if (data2.mimeType == "text/html") {
                                        console.log("In related");
                                        $scope.formData.email.body = data2.body.data;
                                    }
                                });

                            }
                            if (data.filename !== "") {
                                console.log("in attach");
                                $scope.formData.email.attachment.push(data);
                                console.log($scope.formData.email.attachment);
                            }
                        });
                        console.log("scope email", $scope.formData.email);
                    }
                    break;
                case "multipart/mixed":
                    {
                        _.each($scope.formData.email.payload.parts, function (data) {
                            console.log("in parts");
                            console.log(data);
                            if (data.mimeType == "multipart/alternative") {
                                _.each(data.parts, function (data2) {
                                    if (data2.mimeType == "text/html") {
                                        console.log("In Mixed");
                                        $scope.formData.email.body = data2.body.data;
                                    }
                                });

                            }
                            if (data.mimeType == "application/zip") {
                                console.log("In Zip outer If");
                                _.each(data.parts, function (data2) {
                                    console.log("In Zip _.each");
                                    if (data2.mimeType == "multipart/alternative") {
                                        console.log("In Zip");
                                        $scope.formData.email.body = data2.body.data;
                                    }
                                });

                            }
                            if (data.filename !== "") {
                                console.log("in attach");
                                $scope.formData.email.attachment.push(data);
                                console.log($scope.formData.email.attachment);
                            }
                        });
                        console.log("scope email", $scope.formData.email);
                    }
                    break;

                case "multipart/alternative":
                    {
                        _.each($scope.formData.email.payload.parts, function (data) {

                            if (data.mimeType == "text/html") {
                                console.log("In Alternative");
                                $scope.formData.email.body = data.body.data;
                            }

                        });
                        console.log("scope email", $scope.formData.email);
                    }
                    break;
                case "text/html":
                    {
                        console.log("In text/html");
                        $scope.formData.email.body = $scope.formData.email.payload.body.data;
                        console.log("scope email", $scope.formData.email);
                    }
                    break;
            }
            var doa = moment(parseInt(data.data.internalDate));
            $scope.formData.dateOfAppointment = new Date(doa);
            // $.jStorage.set("assignmentEmail", $scope.formData.email);

        });

        $scope.refreshShareWith = function (data, office) {
            var formdata = {};
            formdata.keyword = data;
            // NavigationService.getBackendEmployee(formdata, 1, function (data) {
            //     $scope.shareWith = data.data.results;
            // });
            NavigationService.getShareWith1(formdata, 1, function (data) {
                $scope.shareWith = data.data.results;
            });
        };
        $scope.refreshNature = function (data, causeloss) {
            var formdata = {};
            formdata.keyword = data;
            formdata.filter = {
                "_id": causeloss
            };
            NavigationService.getNatureLoss(formdata, 1, function (data) {
                console.log("getNatureLoss", data.data.results);
                $scope.natureLoss = data.data.results;
            });
        };
        $scope.$watch("formData.causeOfLoss", function (newVal, oldVal) {

            console.log(newVal);
            $scope.refreshNature("", newVal);
        });

        $scope.addModal = function (filename, index, holdobj, data, current, wholeObj) {
            if (index !== "") {
                $scope.modalData = data;
                $scope.modalIndex = index;
            } else {
                $scope.modalData = {};
                $scope.modalIndex = "";
            }
            $scope.wholeObj = wholeObj;
            $scope.current = current;
            $scope.holdObject = holdobj;
            if (data === "datefilter") {
                $scope.dateOptions = {
                    maxDate: new Date()
                }
            }
            var modalInstance = $uibModal.open({
                scope: $scope,
                templateUrl: '/frontend/views/modal/' + filename + '.html',
                size: 'lg'
            });
        };
        $scope.type = "";
        $scope.assignmentMatchedData = [];
        $scope.getAssignmentDuplication = function (data) {
            NavigationService.getAssignmentMatchedData(data, function (matched) {
                console.log("matched", matched.data);
                if (matched.value) {
                    if (!_.isEmpty(matched.data)) {
                        $scope.type = data.type;
                        $scope.assignmentMatchedData = matched.data;
                        console.log("$scope.assignmentMatchedData", $scope.assignmentMatchedData);
                        $scope.matchedFound();
                    }
                } else {
                    $scope.assignmentMatchedData = [];
                }
            });

        };
        $scope.matchedFound = function () {
            var modalInstance = $uibModal.open({
                scope: $scope,
                templateUrl: '/frontend/views/modal/assignment-matched.html',
                size: 'lg',
                backdrop: 'static'
            });
        };
        $scope.addElements = function (moddata) {
            if ($scope.modalIndex !== "") {
                console.log("In Assignment if", moddata);
                $scope.wholeObj[$scope.modalIndex] = moddata;
            } else {
                console.log("In Assignment else", moddata, $scope.wholeObj);
                $scope.newjson = moddata;
                var a = moddata;
                switch ($scope.holdObject) {
                    case "invoice":
                        {
                            var newmod = a.invoiceNumber.split(',');
                            _.each(newmod, function (n) {
                                $scope.newjson = {};
                                $scope.newjson.invoiceNumber = n;
                                $scope.newjson.invoiceNumberDate = moddata.invoiceNumberDate;
                                $scope.wholeObj.push($scope.newjson);
                                var matchData = {};
                                matchData.type = "invoices";
                                matchData.match = n;
                                $scope.getAssignmentDuplication(matchData);
                            });
                        }
                        break;
                    case "products":
                        // {
                        //     var newmod1 = a.item.split(',');
                        //     _.each(newmod1, function (n) {
                        //         $scope.newjson = {};
                        //         $scope.newjson.item = n;
                        //         $scope.wholeObj.push($scope.newjson);
                        //     });
                        // }

                        $scope.wholeObj.push(a);

                        break;
                    case "LRs":
                        var newmod2 = a.lrNumber.split(',');
                        _.each(newmod2, function (n) {
                            $scope.newjson = {};
                            $scope.newjson.lrNumber = n;
                            $scope.newjson.lrNumberDate = moddata.lrNumberDate;
                            $scope.wholeObj.push($scope.newjson);
                            var matchData = {};
                            matchData.type = "LRs";
                            matchData.match = n;
                            $scope.getAssignmentDuplication(matchData);
                        });
                        break;
                    case "Vehicle":
                        var newmod3 = a.vehicleNumber.split(',');
                        _.each(newmod3, function (n) {
                            $scope.newjson = {};
                            $scope.newjson.vehicleNumber = n;
                            $scope.wholeObj.push($scope.newjson);
                        });
                        break;
                    case "Location":
                        var newmod4 = a.locationString.split(',');
                        _.each(newmod4, function (n) {
                            $scope.newjson = {};
                            $scope.newjson.locationString = n;
                            $scope.wholeObj.push($scope.newjson);
                            var matchData = {};
                            matchData.type = "locationArr";
                            matchData.match = n;
                            $scope.getAssignmentDuplication(matchData);
                        });
                        break;
                    case "Product":
                        var newmod5 = a.product.split(',');
                        _.each(newmod5, function (n) {
                            $scope.newjson = {};
                            $scope.newjson.product = n;
                            $scope.wholeObj.push($scope.newjson);
                            var matchData = {};
                            matchData.type = "product";
                            matchData.match = n;
                            $scope.getAssignmentDuplication(matchData);
                        });
                        break;
                    default:
                        {
                            $scope.wholeObj.push($scope.newjson);
                        }

                }

            }
        };

        $scope.deleteElements = function (index, data) {
            data.splice(index, 1);
        };

        $scope.assignmentName = "";
        $scope.assignmentId = "";
        // $scope.assignmentMatchedData = {};
        $scope.submit = function (formData) {

            TemplateService.creategetAllTaskStatus(formData, function (err, data) {
                if (err) {
                    toastr.error("Assignment  creation failed");
                } else {
                    NavigationService.calcGlobalAssignmentStatus(data, function (timelineStatus) {
                        if (timelineStatus.value == true) {
                            data.timelineStatus = timelineStatus.data;
                            NavigationService.assignmentSave(data, function (data) {
                                if (data.value === true) {
                                    $scope.assignmentName = data.data.name;
                                    $scope.assignmentId = data.data._id;
                                    toastr.success("Assignment " + $scope.assignmentName + " created successfully.", "Assignment Created");
                                    $state.go("timeline", {
                                        id: data.data._id,
                                    });
                                } else {
                                    $scope.hideSaveCancel = false;
                                    toastr.error("Assignment  creation failed," + data.error.message + ".", "Assignment creation error");
                                }
                            });
                        }
                    });
                }
            });

            delete formData._id;
            $scope.hideSaveCancel = true;
        };

    })
    .controller('EditAssignmentCtrl', function ($scope, $window, hotkeys, TemplateService, NavigationService, $timeout, $state, toastr, $stateParams, $uibModal, $filter) {
        //Used to name the .html file
        $scope.menutitle = NavigationService.makeactive("Assignment");
        TemplateService.title = $scope.menutitle;
        $scope.navigation = NavigationService.getnav();
        $scope.header = {
            "name": "Edit Assignment"
        };
        $scope.name = {};
        $scope.msg = "";
        $scope.MRnumber = "";
        $scope.formData = {};
        $scope.formData.status = true;
        $scope.formData.invoice = [];
        $scope.formData.products = [];
        $scope.formData.LRs = [];
        $scope.formData.vehicleNumber = [];
        $scope.formData.others = [];
        $scope.formData.shareWith = [];
        $scope.formData.product = [];
        $scope.formData.locationArr = [];
        $scope.modalData = {};
        $scope.modalIndex = "";
        $scope.wholeObj = [];
        $scope.addModels = function (dataArray, data) {
            dataArray.push(data);
        };
        $scope.format = 'dd-MMMM-yyyy';

        $scope.dateOfAppointmentLimit = {
            maxDate: new Date()
        };
        // 
        hotkeys.bindTo($scope).add({
            combo: 'ctrl+enter',
            callback: function (formData) {
                console.log($scope.formData);
                NavigationService.assignmentSave($scope.formData, function (data) {
                    console.log(data);
                    if (data.value === true) {
                        // $state.go('assignment-list');
                        $window.history.back();
                        toastr.success("Assignment " + $scope.msg + " Edited successfully.", "Assignment Edited");
                    } else {
                        toastr.error("Assignment creation failed, " + data.error.message + ".", "Assignment creation error");
                    }
                });

            }
        });
        // 


        NavigationService.getOneAssignments("Assignment", $stateParams.id, function (data) {
            if (data.data) {
                $scope.template = TemplateService.changecontent("assignment-detail");
                $scope.msg = data.data.name;
                $scope.formData = data.data;
                if ((data.data.insuredOffice || data.data.insurerOffice) && data.data.policyType) {
                    NavigationService.getPolicyDoc({
                        filter: {
                            insuredOffice: data.data.insuredOffice ? data.data.insuredOffice._id : '',
                            insurerOffice: data.data.insurerOffice ? data.data.insurerOffice._id : '',
                            policyType: data.data.policyType._id
                        }
                    }, 1, function (data) {
                        // console.log("POLICY DOC", data);
                        if (!_.isEmpty(data.data.results)) {
                            $scope.formData.policyDoc = data.data.results[0];
                        }
                    });
                }

                if (data.data.dateOfLoss !== undefined) {
                    $scope.formData.dateOfLoss = new Date(data.data.dateOfLoss);
                }
                $scope.formData.dateOfIntimation = new Date(data.data.dateOfIntimation);
                $scope.formData.dateOfAppointment = new Date(data.data.dateOfAppointment);
                if (data.data.insuredOfficer !== undefined) {
                    $scope.formData.insuredOfficer = data.data.insuredOfficer._id;
                }
                if (!_.isEmpty(data.data.city)) {
                    var cityName = data.data.city.name + ", " + data.data.city.district.name + ", " + data.data.city.district.state.name + ", " + data.data.city.district.state.zone.name + ", " + data.data.city.district.state.zone.country.name;
                    $scope.formData.city = {
                        name: cityName,
                        _id: data.data.city._id
                    }
                }
            }
        });

        // cancel


        $scope.refreshShareWith = function (data, office) {
            var formdata = {};
            formdata.keyword = data;
            NavigationService.getShareWith1(formdata, 1, function (data) {
                $scope.shareWith = data.data.results;
            });
            // NavigationService.getBackendEmployee(formdata, 1, function (data) {
            //     $scope.shareWith = data.data.results;
            // });
        };

        $scope.refreshNature = function (data, causeloss) {
            var formdata = {};
            formdata.keyword = data;
            formdata.filter = {
                "_id": causeloss
            };
            NavigationService.getNatureLoss(formdata, 1, function (data) {
                $scope.natureLoss = data.data.results;
            });
        };
        $scope.$watch("formData.causeOfLoss", function (newVal, oldVal) {

            console.log(newVal);
            $scope.refreshNature("", newVal);
        });
        $scope.addModal = function (filename, index, holdobj, data, current, wholeObj) {
            if (index !== "") {
                $scope.modalData = data;
                $scope.modalIndex = index;
            } else {
                $scope.modalData = {};
                $scope.modalIndex = "";
            }
            $scope.wholeObj = wholeObj;
            $scope.current = current;
            $scope.holdObject = holdobj;
            var modalInstance = $uibModal.open({
                scope: $scope,
                templateUrl: '/frontend/views/modal/' + filename + '.html',
                size: 'lg'
            });
        };

        $scope.type = "";
        $scope.assignmentMatchedData = [];
        $scope.getAssignmentDuplication = function (data) {
            NavigationService.getAssignmentMatchedData(data, function (matched) {
                console.log("matched", matched.data);
                if (matched.value) {
                    if (!_.isEmpty(matched.data)) {
                        $scope.type = data.type;
                        $scope.assignmentMatchedData = matched.data;
                        console.log("$scope.assignmentMatchedData", $scope.assignmentMatchedData);
                        $scope.matchedFound();
                    }
                } else {
                    $scope.assignmentMatchedData = [];
                }
            });

        };
        $scope.matchedFound = function () {
            var modalInstance = $uibModal.open({
                scope: $scope,
                templateUrl: '/frontend/views/modal/assignment-matched.html',
                size: 'lg',
                backdrop: 'static'
            });
        };

        $scope.addElements = function (moddata) {
            console.log("moddata", moddata);
            if ($scope.modalIndex !== "") {
                $scope.wholeObj[$scope.modalIndex] = moddata;
            } else {
                $scope.newjson = moddata;
                var a = moddata;
                switch ($scope.holdObject) {
                    case "invoice":
                        {
                            var newmod = a.invoiceNumber.split(',');
                            _.each(newmod, function (n) {
                                $scope.newjson = {};
                                $scope.newjson.invoiceNumber = n;
                                $scope.newjson.invoiceNumberDate = moddata.invoiceNumberDate;
                                $scope.wholeObj.push($scope.newjson);
                                var matchData = {};
                                matchData.type = "invoices";
                                matchData.match = n;
                                $scope.getAssignmentDuplication(matchData);
                            });
                        }
                        break;
                    case "products":
                        {
                            // var newmod1 = a.item.split(',');
                            // _.each(newmod1, function (n) {
                            //     $scope.newjson = {};
                            //     $scope.newjson.item = n;
                            //     $scope.wholeObj.push($scope.newjson);
                            // });
                            $scope.wholeObj.push(a);
                        }
                        break;
                    case "LRs":
                        var newmod2 = a.lrNumber.split(',');
                        _.each(newmod2, function (n) {
                            $scope.newjson = {};
                            $scope.newjson.lrNumber = n;
                            $scope.newjson.lrNumberDate = moddata.lrNumberDate;
                            $scope.wholeObj.push($scope.newjson);
                            var matchData = {};
                            matchData.type = "LRs";
                            matchData.match = n;
                            $scope.getAssignmentDuplication(matchData);
                        });
                        break;
                    case "Vehicle":
                        var newmod3 = a.vehicleNumber.split(',');
                        _.each(newmod3, function (n) {
                            $scope.newjson = {};
                            $scope.newjson.vehicleNumber = n;
                            $scope.wholeObj.push($scope.newjson);
                        });
                        break;
                    case "Location":
                        var newmod4 = a.locationString.split(',');
                        _.each(newmod4, function (n) {
                            $scope.newjson = {};
                            $scope.newjson.locationString = n;
                            $scope.wholeObj.push($scope.newjson);
                            var matchData = {};
                            matchData.type = "locationArr";
                            matchData.match = n;
                            $scope.getAssignmentDuplication(matchData);
                        });
                        break;
                    case "Product":
                        var newmod5 = a.product.split(',');
                        _.each(newmod5, function (n) {
                            $scope.newjson = {};
                            $scope.newjson.product = n;
                            $scope.wholeObj.push($scope.newjson);
                            var matchData = {};
                            matchData.type = "product";
                            matchData.match = n;
                            $scope.getAssignmentDuplication(matchData);
                        });
                        break;
                    default:
                        {
                            $scope.wholeObj.push($scope.newjson);
                        }

                }

            }
        };

        $scope.deleteElements = function (index, data) {
            data.splice(index, 1);
        };


        $scope.submit = function (formData) {
            NavigationService.assignmentSave($scope.formData, function (data) {
                if (data.value === true) {
                    $window.history.back();
                    toastr.success("Assignment " + $scope.msg + " Edited successfully.", "Assignment Edited");
                } else {
                    toastr.error("Assignment creation failed, " + data.error.message + ".", "Assignment creation error");
                }
            });
        };
        // Cancel
        $scope.cancel = function () {
            console.log("In Cancel");
            $window.history.back();
        };

    })
    .controller('EditCountryCtrl', function ($scope, hotkeys, $window, TemplateService, NavigationService, $timeout, $stateParams, $state, toastr) {
        //Used to name the .html file

        $scope.template = TemplateService.changecontent("country-detail");
        $scope.menutitle = NavigationService.makeactive("Country");
        TemplateService.title = $scope.menutitle;
        $scope.navigation = NavigationService.getnav();

        $scope.header = {
            "name": "Edit Country"
        };

        NavigationService.getOneCountry($stateParams.id, function (data) {
            $scope.formData = data.data;
            console.log('$scope.oneCountry', $scope.oneCountry);

        });
        $scope.cancel = function () {
            $window.history.back();
        };
        hotkeys.bindTo($scope).add({
            combo: 'ctrl+enter',
            callback: function (formData) {
                NavigationService.countryEditSave($scope.formData, function (data) {
                    if (data.value === true) {
                        // $state.go('country-list');
                        $window.history.back();
                        console.log("Check this one");
                        toastr.success("Country " + $scope.formData.name + " edited successfully.", "Country Edited");
                    } else {
                        toastr.error("Country edition failed.", "Country editing error");
                    }
                });
            }
        });

        $scope.saveCountry = function (formValid) {
            NavigationService.countryEditSave($scope.formData, function (data) {
                if (data.value === true) {
                    // $state.go('country-list');
                    $window.history.back();
                    console.log("Check this one");
                    toastr.success("Country " + $scope.formData.name + " edited successfully.", "Country Edited");
                } else {
                    toastr.error("Country edition failed.", "Country editing error");
                }
            });
        };

    })

    .controller('OfficeCtrl', function ($scope, $window, TemplateService, NavigationService, $timeout, $stateParams, $state, toastr) {
        //Used to name the .html file
        $scope.template = TemplateService.changecontent("office-list", $state);
        $scope.menutitle = NavigationService.makeactive("Office List");
        TemplateService.title = $scope.menutitle;
        $scope.navigation = NavigationService.getnav();
        $scope.currentPage = $stateParams.page;
        var i = 0;
        $scope.search = {
            keyword: ""
        };
        if ($stateParams.keyword) {
            $scope.search.keyword = $stateParams.keyword;
        }
        $scope.showAllCountries = function (keywordChange) {
            $scope.totalItems = undefined;
            if (keywordChange) {
                $scope.currentPage = 1;
            }
            NavigationService.searchOffice({
                page: $scope.currentPage,
                keyword: $scope.search.keyword
            }, ++i, function (data, ini) {
                console.log(data.data);

                if (ini == i) {
                    console.log(data.data);
                    $scope.allOffices = data.data.results;
                    $scope.totalItems = data.data.total;
                    $scope.maxRow = data.data.options.count;
                }
            });
        };

        $scope.changePage = function (page) {
            console.log("1100", page);
            var goTo = "office-list";
            if ($scope.search.keyword) {
                goTo = "office-list";
            }
            $state.go(goTo, {
                page: page,
                keyword: $scope.search.keyword
            });
        };
        $scope.showAllCountries();

        $scope.deleteOffice = function (id) {
            globalfunction.confDel(function (value) {
                if (value) {
                    NavigationService.deleteOffice(id, function (data) {
                        if (data.value) {
                            $scope.showAllCountries();
                            toastr.success("Office deleted successfully.", "Office deleted");
                        } else {
                            toastr.error("There was an error while deleting Office", "Office deleting error");
                        }


                    });
                }
            });
        };

        $scope.changeStatus = function (ind) {
            NavigationService.officeSave(ind, function (data) {
                if (data.value === true) {}
            });
        };
    })
    .controller('CreateOfficeCtrl', function ($scope, hotkeys, $window, TemplateService, NavigationService, $timeout, $state, toastr) {
        //Used to name the .html file
        $scope.template = TemplateService.changecontent("office-detail");
        $scope.menutitle = NavigationService.makeactive("Office");
        TemplateService.title = $scope.menutitle;
        $scope.navigation = NavigationService.getnav();

        $scope.header = {
            "name": "Create Office"
        };
        $scope.formData = {};
        $scope.cancel = function () {
            $window.history.back();
        };
        hotkeys.bindTo($scope).add({
            combo: 'ctrl+enter',
            callback: function (formData) {
                if (formData.lat && formData.lng) {
                    formData.location = [];
                    formData.location.push(formData.lng);
                    formData.location.push(formData.lat);
                }
                NavigationService.officeSave($scope.formData, function (data) {
                    if (data.value === true) {
                        $window.history.back();
                        toastr.success("Office " + formData.name + " created successfully.", "Office Created");
                    } else {
                        toastr.error("Office creation failed.", "Office creation error");
                    }
                });
            }
        });

        $scope.saveOffice = function (formData) {
            if (formData.lat && formData.lng) {
                formData.location = [];
                formData.location.push(formData.lng);
                formData.location.push(formData.lat);
            }
            NavigationService.officeSave($scope.formData, function (data) {
                if (data.value === true) {
                    $window.history.back();
                    toastr.success("Office " + formData.name + " created successfully.", "Office Created");
                } else {
                    toastr.error("Office creation failed.", "Office creation error");
                }
            });
        };

    })
    .controller('EditOfficeCtrl', function ($scope, hotkeys, $window, TemplateService, NavigationService, $timeout, $stateParams, $state, toastr) {
        //Used to name the .html file
        $scope.template = TemplateService.changecontent("office-detail");
        $scope.menutitle = NavigationService.makeactive("Office");
        TemplateService.title = $scope.menutitle;
        $scope.navigation = NavigationService.getnav();

        $scope.header = {
            "name": "Edit Office"
        };
        $scope.cancel = function () {
            $window.history.back();
        };
        NavigationService.getOneOffice($stateParams.id, function (data) {
            $scope.formData = data.data;

        });

        hotkeys.bindTo($scope).add({
            combo: 'ctrl+enter',
            callback: function (formData) {
                if (formData.lat && formData.lng) {
                    formData.location = [];
                    formData.location.push(formData.lng);
                    formData.location.push(formData.lat);
                }
                NavigationService.officeSave($scope.formData, function (data) {
                    if (data.value === true) {
                        $window.history.back();
                        toastr.success("Office " + $scope.formData.name + " edited successfully.", "Office Edited");
                    } else {
                        toastr.error("Office edition failed.", "Office editing error");
                    }
                });
            }
        });

        $scope.saveOffice = function (formData) {
            if (formData.lat && formData.lng) {
                formData.location = [];
                formData.location.push(formData.lng);
                formData.location.push(formData.lat);
            }
            NavigationService.officeSave($scope.formData, function (data) {
                if (data.value === true) {
                    // $state.go('office-list');
                    $window.history.back();
                    toastr.success("Office " + $scope.formData.name + " edited successfully.", "Office Edited");
                } else {
                    toastr.error("Office edition failed.", "Office editing error");
                }
            });
        };

    })
    .controller('TypeOfOfficeCtrl', function ($scope, $window, TemplateService, NavigationService, $timeout, $stateParams, $state, toastr) {
        //Used to name the .html file
        $scope.template = TemplateService.changecontent("typeOfOffice-list", $state);
        $scope.menutitle = NavigationService.makeactive("Type Of Office List");
        TemplateService.title = $scope.menutitle;
        $scope.navigation = NavigationService.getnav();
        $scope.currentPage = $stateParams.page;
        var i = 0;
        $scope.search = {
            keyword: ""
        };
        if ($stateParams.keyword) {
            $scope.search.keyword = $stateParams.keyword;
        }
        $scope.cancel = function () {
            $window.history.back();
        };
        $scope.showAllCountries = function (keywordChange) {
            $scope.totalItems = undefined;
            if (keywordChange) {
                $scope.currentPage = 1;
            }
            NavigationService.searchTypeOfOffice({
                page: $scope.currentPage,
                keyword: $scope.search.keyword
            }, ++i, function (data, ini) {
                if (ini == i) {
                    $scope.allTypeOfOffices = data.data.results;
                    $scope.totalItems = data.data.total;
                    $scope.maxRow = data.data.options.count;
                }
            });
        };

        $scope.changePage = function (page) {
            var goTo = "typeOfOffice-list";
            if ($scope.search.keyword) {
                goTo = "typeOfOffice-list";
            }
            $state.go(goTo, {
                page: page,
                keyword: $scope.search.keyword
            });
        };
        $scope.showAllCountries();
        $scope.deleteTypeOfOffice = function (id) {
            globalfunction.confDel(function (value) {
                console.log(value);
                if (value) {
                    NavigationService.deleteTypeOfOffice(id, function (data) {
                        if (data.value) {
                            $scope.showAllCountries();
                            toastr.success("Office deleted successfully.", "Office deleted");
                        } else {
                            toastr.error("There was an error while deleting Office", "Office deleting error");
                        }
                    });
                }
            });
        };
    })
    .controller('CreateTypeOfOfficeCtrl', function ($scope, hotkeys, $window, TemplateService, NavigationService, $timeout, $state, toastr) {
        //Used to name the .html file
        $scope.template = TemplateService.changecontent("typeOfOffice-detail");
        $scope.menutitle = NavigationService.makeactive("Type Of Office");
        TemplateService.title = $scope.menutitle;
        $scope.navigation = NavigationService.getnav();

        $scope.header = {
            "name": "Create Type Of Office"
        };
        $scope.cancel = function () {
            $window.history.back();
        };
        $scope.formData = {};

        hotkeys.bindTo($scope).add({
            combo: 'ctrl+enter',
            callback: function (formData) {
                $scope.errormsg = "";
                NavigationService.typeofofficeSave($scope.formData, function (data) {
                    if (data.value === true) {
                        $window.history.back();
                        toastr.success("Type Of Office " + $scope.formData.name + " created successfully.", "Type Of Office Created");
                    } else {
                        if (data.error.errors) {
                            var i = 0;
                            _.each(data.error.errors, function (data) {
                                $scope.errormsg += data.message + "\n\n";
                            });
                        }
                        toastr.error($scope.errormsg, "Type Of Office creation failed.");
                    }
                });
            }
        });

        $scope.savetypeOfOffice = function (formData) {
            $scope.errormsg = "";
            NavigationService.typeofofficeSave($scope.formData, function (data) {
                if (data.value === true) {
                    $window.history.back();
                    toastr.success("Type Of Office " + $scope.formData.name + " created successfully.", "Type Of Office Created");
                } else {
                    if (data.error.errors) {
                        var i = 0;
                        _.each(data.error.errors, function (data) {
                            $scope.errormsg += data.message + "\n\n";
                        });
                    }
                    toastr.error($scope.errormsg, "Type Of Office creation failed.");
                }
            });
        };

    })
    .controller('EditTypeOfOfficeCtrl', function ($scope, hotkeys, $window, TemplateService, NavigationService, $timeout, $stateParams, $state, toastr) {
        //Used to name the .html file
        $scope.template = TemplateService.changecontent("typeOfOffice-detail");
        $scope.menutitle = NavigationService.makeactive("Type Of Office");
        TemplateService.title = $scope.menutitle;
        $scope.navigation = NavigationService.getnav();

        $scope.header = {
            "name": "Edit Type Of Office"
        };

        NavigationService.getOneTypeOfOffice($stateParams.id, function (data) {
            $scope.formData = data.data;
        });
        $scope.cancel = function () {
            $window.history.back();
        };

        hotkeys.bindTo($scope).add({
            combo: 'ctrl+enter',
            callback: function (formData) {
                $scope.errormsg = "";
                NavigationService.typeofofficeSave($scope.formData, function (data) {
                    if (data.value === true) {
                        $window.history.back();
                        toastr.success("Type Of Office " + $scope.formData.name + " Updated successfully.", "Type Of Office Updated");
                    } else {
                        if (data.error.errors) {
                            var i = 0;
                            _.each(data.error.errors, function (data) {
                                $scope.errormsg += data.message;
                            });
                        }
                        toastr.error($scope.errormsg, "Type Of Office creation failed.");
                    }
                });
            }
        });


        $scope.savetypeOfOffice = function (formValid) {
            $scope.errormsg = "";

            //  if (formValid.$valid) {
            //  $scope.formComplete = true;
            NavigationService.typeofofficeSave($scope.formData, function (data) {
                if (data.value === true) {
                    // $state.go('typeOfOffice-list');
                    $window.history.back();
                    toastr.success("Type Of Office " + $scope.formData.name + " Updated successfully.", "Type Of Office Updated");
                } else {
                    if (data.error.errors) {
                        var i = 0;
                        _.each(data.error.errors, function (data) {
                            $scope.errormsg += data.message;
                        });

                    }
                    toastr.error($scope.errormsg, "Type Of Office creation failed.");
                }
            });
            //  }
        };

    })
    .controller('ZoneCtrl', function ($scope, $window, TemplateService, NavigationService, $timeout, $stateParams, toastr, $state) {
        //Used to name the .html file
        $scope.template = TemplateService.changecontent("zone-list", $state);
        $scope.menutitle = NavigationService.makeactive("Zone List");
        TemplateService.title = $scope.menutitle;
        $scope.navigation = NavigationService.getnav();
        $scope.currentPage = $stateParams.page;
        var i = 0;
        $scope.search = {
            keyword: ""
        };
        if ($stateParams.keyword) {
            $scope.search.keyword = $stateParams.keyword;
        }
        $scope.showAllCountries = function (keywordChange) {
            $scope.totalItems = undefined;
            if (keywordChange) {
                $scope.currentPage = 1;
            }
            NavigationService.searchZone({
                page: $scope.currentPage,
                keyword: $scope.search.keyword
            }, ++i, function (data, ini) {
                console.log(data.data);

                if (ini == i) {
                    console.log(data.data);
                    $scope.countries = data.data.results;
                    $scope.totalItems = data.data.total;
                    $scope.maxRow = data.data.options.count;

                }
            });
        };

        $scope.changePage = function (page) {
            var goTo = "zone-list";
            if ($scope.search.keyword) {
                goTo = "zone-list";
            }
            $state.go(goTo, {
                page: page,
                keyword: $scope.search.keyword
            });
        };
        $scope.showAllCountries();
        $scope.cancel = function () {
            $window.history.back();
        };
        $scope.deleteZone = function (id) {
            globalfunction.confDel(function (value) {
                console.log(value);
                if (value) {
                    NavigationService.deleteZone(id, function (data) {
                        if (data.value) {
                            $scope.showAllCountries();
                            toastr.success("Country deleted successfully.", "Country deleted");
                        } else {
                            toastr.error("There was an error while deleting country", "Country deleting error");
                        }


                    });
                }
            });
        };
    })
    .controller('CreateZoneCtrl', function ($scope, hotkeys, $window, TemplateService, NavigationService, $timeout, $state, toastr) {
        //Used to name the .html file
        $scope.template = TemplateService.changecontent("zone-detail");
        $scope.menutitle = NavigationService.makeactive("Zone");
        TemplateService.title = $scope.menutitle;
        $scope.navigation = NavigationService.getnav();

        $scope.header = {
            "name": "Create Zone"
        };
        $scope.cancel = function () {
            $window.history.back();
        };
        hotkeys.bindTo($scope).add({
            combo: 'ctrl+enter',
            callback: function (formData) {
                NavigationService.zoneSave(formData, function (data) {
                    if (data.value === true) {
                        $window.history.back();
                        toastr.success("Zone " + formData.name + " created successfully.", "Zone Created");
                    } else {
                        toastr.error("Zone creation failed.", "Zone creation error");
                    }
                });
            }
        });
        $scope.saveZone = function (formData) {
            NavigationService.zoneSave(formData, function (data) {
                if (data.value === true) {
                    $window.history.back();
                    toastr.success("Zone " + formData.name + " created successfully.", "Zone Created");
                } else {
                    toastr.error("Zone creation failed.", "Zone creation error");
                }
            });
        };
    })
    .controller('EditZoneCtrl', function ($scope, hotkeys, $window, TemplateService, NavigationService, $timeout, $stateParams, $state, toastr) {
        //Used to name the .html file
        $scope.template = TemplateService.changecontent("zone-detail");
        $scope.menutitle = NavigationService.makeactive("Zone");
        TemplateService.title = $scope.menutitle;
        $scope.navigation = NavigationService.getnav();

        $scope.header = {
            "name": "Edit Zone"
        };

        NavigationService.getOneZone($stateParams.id, function (data) {
            $scope.formData = data.data;
        });
        $scope.cancel = function () {
            $window.history.back();
        };
        hotkeys.bindTo($scope).add({
            combo: 'ctrl+enter',
            callback: function (formData) {
                $scope.hideSaveCancel = true;
                NavigationService.zoneSave($scope.formData, function (data) {
                    if (data.value === true) {
                        // $state.go('zone-list');
                        $window.history.back();
                        toastr.success("Zone " + $scope.formData.name + " edited successfully.", "Zone Edited");
                    } else {
                        toastr.error("Zone edition failed.", "Zone editing error");
                    }
                });
            }
        });
        $scope.saveZone = function (formValid) {
            NavigationService.zoneSave($scope.formData, function (data) {
                if (data.value === true) {
                    // $state.go('zone-list');
                    $window.history.back();
                    toastr.success("Zone " + $scope.formData.name + " edited successfully.", "Zone Edited");
                } else {
                    toastr.error("Zone edition failed.", "Zone editing error");
                }
            });
        };
    })
    .controller('StateCtrl', function ($scope, $window, TemplateService, NavigationService, $timeout, $stateParams, toastr, $state) {
        //Used to name the .html file
        $scope.template = TemplateService.changecontent("state-list", $state);
        $scope.menutitle = NavigationService.makeactive("State List");
        TemplateService.title = $scope.menutitle;
        $scope.navigation = NavigationService.getnav();
        $scope.currentPage = $stateParams.page;
        var i = 0;
        $scope.search = {
            keyword: ""
        };
        if ($stateParams.keyword) {
            $scope.search.keyword = $stateParams.keyword;
        }
        $scope.showAllCountries = function (keywordChange) {
            $scope.totalItems = undefined;
            if (keywordChange) {
                $scope.currentPage = 1;
            }
            NavigationService.searchState({
                page: $scope.currentPage,
                keyword: $scope.search.keyword
            }, ++i, function (data, ini) {
                console.log(data.data);

                if (ini == i) {
                    console.log(data.data);
                    $scope.allStates = data.data.results;
                    $scope.totalItems = data.data.total;
                    $scope.maxRow = data.data.options.count;

                }
            });
        };
        $scope.cancel = function () {
            $window.history.back();
        };
        $scope.changePage = function (page) {
            var goTo = "state-list";
            if ($scope.search.keyword) {
                goTo = "state-list";
            }
            $state.go(goTo, {
                page: page,
                keyword: $scope.search.keyword
            });
        };
        $scope.showAllCountries();

        $scope.deleteState = function (id) {
            globalfunction.confDel(function (value) {
                if (value) {
                    NavigationService.deleteState(id, function (data) {
                        if (data.value) {
                            $scope.showAllCountries();
                            toastr.success("State deleted successfully.", "State deleted");
                        } else {
                            toastr.error("There was an error while deleting State", "State deleting error");
                        }


                    });
                }
            });
        };

    })

    .controller('CreateStateCtrl', function ($scope, hotkeys, $window, TemplateService, NavigationService, $timeout, $state, toastr) {
        //Used to name the .html file
        $scope.template = TemplateService.changecontent("state-detail");
        $scope.menutitle = NavigationService.makeactive("State");
        TemplateService.title = $scope.menutitle;
        $scope.navigation = NavigationService.getnav();

        $scope.header = {
            "name": "Create State"
        };
        $scope.formData = {};
        $scope.cancel = function () {
            $window.history.back();
        };
        hotkeys.bindTo($scope).add({
            combo: 'ctrl+enter',
            callback: function (formData) {
                $scope.hideSaveCancel = true;
                NavigationService.stateSave($scope.formData, function (data) {
                    if (data.value === true) {
                        // $state.go('state-list');
                        $window.history.back();
                        toastr.success("State " + formData.name + " created successfully.", "State Created");
                    } else {
                        toastr.error("State creation failed.", "State creation error");
                    }
                });
            }
        });
        $scope.saveState = function (formData) {
            NavigationService.stateSave($scope.formData, function (data) {
                if (data.value === true) {
                    // $state.go('state-list');
                    $window.history.back();
                    toastr.success("State " + formData.name + " created successfully.", "State Created");
                } else {
                    toastr.error("State creation failed.", "State creation error");
                }
            });
        };

    })
    .controller('EditStateCtrl', function ($scope, hotkeys, $window, TemplateService, NavigationService, $timeout, $stateParams, $state, toastr) {
        //Used to name the .html file
        $scope.template = TemplateService.changecontent("state-detail");
        $scope.menutitle = NavigationService.makeactive("State");
        TemplateService.title = $scope.menutitle;
        $scope.navigation = NavigationService.getnav();

        $scope.header = {
            "name": "Edit State"
        };

        NavigationService.getOneState($stateParams.id, function (data) {
            $scope.formData = data.data;
            $scope.formData.country = data.data.zone.country._id;
            $scope.formData.zone = data.data.zone._id;
        });
        $scope.cancel = function () {
            $window.history.back();
        };
        hotkeys.bindTo($scope).add({
            combo: 'ctrl+enter',
            callback: function (formData) {
                $scope.hideSaveCancel = true;
                NavigationService.stateSave($scope.formData, function (data) {
                    if (data.value === true) {
                        // $state.go('state-list');
                        $window.history.back();
                        toastr.success("State " + $scope.formData.name + " edited successfully.", "State Edited");
                    } else {
                        toastr.error("State edition failed.", "State editing error");
                    }
                });
            }
        });
        $scope.saveState = function (formValid) {
            NavigationService.stateSave($scope.formData, function (data) {
                if (data.value === true) {
                    // $state.go('state-list');
                    $window.history.back();
                    toastr.success("State " + $scope.formData.name + " edited successfully.", "State Edited");
                } else {
                    toastr.error("State edition failed.", "State editing error");
                }
            });
        };
    })
    .controller('DistrictCtrl', function ($scope, $window, TemplateService, NavigationService, $timeout, $stateParams, toastr, $state) {
        //Used to name the .html file
        $scope.template = TemplateService.changecontent("district-list");
        $scope.menutitle = NavigationService.makeactive("district List");
        TemplateService.title = $scope.menutitle;
        $scope.navigation = NavigationService.getnav();

        $scope.currentPage = $stateParams.page;
        var i = 0;
        $scope.search = {
            keyword: ""
        };
        if ($stateParams.keyword) {
            $scope.search.keyword = $stateParams.keyword;
        }
        $scope.showAllCountries = function (keywordChange) {
            $scope.totalItems = undefined;
            if (keywordChange) {
                $scope.currentPage = 1;
            }
            NavigationService.searchDistrict({
                page: $scope.currentPage,
                keyword: $scope.search.keyword
            }, ++i, function (data, ini) {
                console.log(data.data);

                if (ini == i) {
                    console.log(data.data);
                    $scope.allDistricts = data.data.results;
                    $scope.totalItems = data.data.total;
                    $scope.maxRow = data.data.options.count;

                }
            });
        };

        $scope.changePage = function (page) {
            var goTo = "district-list";
            if ($scope.search.keyword) {
                goTo = "district-list";
            }
            $state.go(goTo, {
                page: page,
                keyword: $scope.search.keyword
            });
        };
        $scope.showAllCountries();

        $scope.deleteDistrict = function (id) {
            globalfunction.confDel(function (value) {
                console.log(value);
                if (value) {
                    NavigationService.deleteDistrict(id, function (data) {
                        if (data.value) {
                            $scope.showAllCountries();
                            toastr.success("District deleted successfully.", "District deleted");
                        } else {
                            toastr.error("There was an error while deleting District", "District deleting error");
                        }


                    });
                }
            });
        };


    })
    .controller('EmployeeCtrl', function ($scope, $window, TemplateService, NavigationService, $timeout, $state) {
        //Used to name the .html file
        $scope.template = TemplateService.changecontent("employee-list");
        $scope.menutitle = NavigationService.makeactive("Employee");
        TemplateService.title = $scope.menutitle;
        $scope.navigation = NavigationService.getnav();

        $scope.showAllEmployees = function () {
            NavigationService.getAllEmployees(function (data) {
                $scope.allEmployees = data.data;
                console.log('$scope.allEmployees', $scope.allEmployees);

            });
        };
        $scope.showAllEmployees();

        $scope.deleteEmployee = function (id) {

            NavigationService.deleteEmployee({
                id: id
            }, function (data) {
                $scope.showAllEmployees();

            });
        };

    })
    .controller('LeaveListCtrl', function ($scope, $window, TemplateService, NavigationService, $timeout, $state, $stateParams) {
        //Used to name the .html file
        $scope.template = TemplateService.changecontent("leave-list");
        $scope.menutitle = NavigationService.makeactive("Leave List");
        TemplateService.title = $scope.menutitle;
        $scope.navigation = NavigationService.getnav();
        $scope.currentPage = $stateParams.page;
        var i = 0;
        $scope.search = {
            keyword: ""
        };
        if ($stateParams.keyword) {
            $scope.search.keyword = $stateParams.keyword;
        }
        $scope.showAllLeaves = function (keywordChange) {
            $scope.totalItems = undefined;
            console.log("showAllLeaves");
            if (keywordChange) {
                $scope.currentPage = 1;
            }
            NavigationService.searchLeaves({

                page: $scope.currentPage,
                keyword: $scope.search.keyword
            }, ++i, function (data, ini) {
                if (ini == i) {
                    console.log("In searchLeaves");
                    $scope.leaveList = data.data.results;
                    $scope.totalItems = data.data.total;
                    $scope.maxRow = data.data.options.count;
                }
            });
        };

    })
    // .controller('EditLeaveListCtrl', function ( $scope, $window, TemplateService, NavigationService, $timeout, $stateParams, $state) {
    //     //Used to name the .html file
    //     $scope.template = TemplateService.changecontent("leave-detail");
    //     $scope.menutitle = NavigationService.makeactive("LeaveManagement");
    //     TemplateService.title = $scope.menutitle;
    //     $scope.navigation = NavigationService.getnav();
    //     $scope.userStatus = [{
    //         "name": "Active",
    //         "value": true
    //     }, {
    //         "name": "Inactive",
    //         "value": false
    //     }];
    //     $scope.header = {
    //         "name": "Edit LeaveManagement"
    //     };

    //     NavigationService.getOneLeaveManagement($stateParams.id, function (data) {
    //         $scope.formData = data.data;
    //         console.log('$scope.formData', $scope.formData);

    //     });

    //     $scope.saveLeaveManagement= function (formValid) {

    //         //  if (formValid.$valid) {
    //         //  $scope.formComplete = true;
    //         NavigationService.leaveManagementEditSave($scope.formData, function (data) {
    //             if (data.value === true) {
    //                 $state.go('leaveManagement-list');
    //             }
    //         });
    //         //  }
    //     };
    //     NavigationService.getAllUniqueTypes(function (data) {
    //         $scope.allUniqueTypes = data.data;
    //         console.log('$scope.allUniqueTypes', $scope.allUniqueTypes);

    //     });

    // })

    .controller('ReimbursementListCtrl', function ($scope, $window, TemplateService, NavigationService, $timeout, $state) {
        //Used to name the .html file
        $scope.template = TemplateService.changecontent("reimbursement-list");
        $scope.menutitle = NavigationService.makeactive("Reimbursement List");
        TemplateService.title = $scope.menutitle;
        $scope.navigation = NavigationService.getnav();


    })
    .controller('ReimbursementDetailCtrl', function ($scope, $window, TemplateService, NavigationService, $timeout, $state) {
        //Used to name the .html file
        $scope.template = TemplateService.changecontent("reimbursement-detail");
        $scope.menutitle = NavigationService.makeactive("Reimbursement Detail");
        TemplateService.title = $scope.menutitle;
        $scope.navigation = NavigationService.getnav();


    })
    .controller('LeaveDetailCtrl', function ($scope, $window, TemplateService, NavigationService, $timeout, $state) {
        //Used to name the .html file
        $scope.template = TemplateService.changecontent("leave-detail");
        $scope.menutitle = NavigationService.makeactive("Leave Detail");
        TemplateService.title = $scope.menutitle;
        $scope.navigation = NavigationService.getnav();


    })
    .controller('TemplateILACtrl', function ($scope, $window, TemplateService, NavigationService, $timeout, $state) {
        //Used to name the .html file
        $scope.template = TemplateService.changecontent("templateIla-list");
        $scope.menutitle = NavigationService.makeactive("ILA Template");
        TemplateService.title = $scope.menutitle;
        $scope.navigation = NavigationService.getnav();
        $scope.header = {
            "name": "LOR Template List"
        };

    })

    .controller('KnowledgebaseListCtrl', function ($scope, $window, TemplateService, NavigationService, $timeout, $state) {
        //Used to name the .html file
        $scope.template = TemplateService.changecontent("knowledgebase-list");
        $scope.menutitle = NavigationService.makeactive("Knowledge Base");
        TemplateService.title = $scope.menutitle;
        $scope.navigation = NavigationService.getnav();


    })
    .controller('KnowledgebaseDetailCtrl', function ($scope, $window, TemplateService, NavigationService, $timeout, $state) {
        //Used to name the .html file
        $scope.template = TemplateService.changecontent("knowledgebase-detail");
        $scope.menutitle = NavigationService.makeactive("Knowledge Base Detail");
        TemplateService.title = $scope.menutitle;
        $scope.navigation = NavigationService.getnav();


    })
    .controller('AllDocumentCtrl', function ($scope, $window, TemplateService, NavigationService, $timeout, $state, $stateParams, toastr) {
        //Used to name the .html file

        $scope.modelCamel = _.camelCase($stateParams.model);
        var a = _.startCase($scope.modelCamel).split(" ");
        $scope.ModelApi = "";
        _.each(a, function (n) {
            $scope.ModelApi = $scope.ModelApi + n;
        });

        $scope.template = TemplateService.changecontent("all-document");
        $scope.menutitle = NavigationService.makeactive("All Document");
        TemplateService.title = $scope.menutitle;
        $scope.navigation = NavigationService.getnav();
        $scope.modelList = [];
        $scope.name;
        $scope.dept = [{
            "name": "Jir",
            "type": "Jir"
        }, {
            "name": "Law",
            "type": "Law"
        }, {
            "name": "Insurance",
            "type": "Insurance"
        }, {
            "name": "Survey",
            "type": "Survey"
        }, {
            "name": "Surveyor",
            "type": "Surveyor"
        }, {
            "name": "ILR",
            "type": "ILR"
        }, {
            "name": "ILA",
            "type": "ILA"
        }];

        // 
        $scope.deleteModel = function (id, type) {
            console.log("Delete Id Type", id, type);
            globalfunction.confDel(function (value) {
                console.log("Delete value", value);
                if (value) {
                    NavigationService.deleteModel($scope.ModelApi, id, function (data) {
                        if (data.value) {
                            console.log("Delete Value", data.value);
                            $scope.viewJIR(type);
                            toastr.success($scope.modelCap + " deleted successfully.", $scope.modelCap + " deleted");
                        } else {
                            toastr.error("There was an error while deleting " + $scope.modelCap, $scope.modelCap + " deleting error");
                        }


                    });
                }
            });
        };


        // 

        $scope.viewJIR = function (data) {
            $scope.name = data;
            NavigationService.searchAllDocument(data, function (data) {
                $scope.modelList = data.data;
                console.log("DATA IN ALL", $scope.modelList);
            });
        }

        $scope.viewJIR($scope.dept[0].type);
    })
    .controller('EditTemplateILACtrl', function ($scope, $window, TemplateService, NavigationService, $timeout, $stateParams, $state, toastr) {
        //Used to name the .html file
        $scope.template = TemplateService.changecontent("templateIla-detail");
        $scope.menutitle = NavigationService.makeactive("Edit ILA Template");
        TemplateService.title = $scope.menutitle;
        $scope.navigation = NavigationService.getnav();

        $scope.header = {
            "name": "Edit ILA Template"
        };
        $scope.formData = {};
        // $scope.formData.status = true;

        NavigationService.getOneModel("TemplateIla", $stateParams.id, function (data) {
            $scope.formData = data.data;
        });


        $scope.itemTypes = [{
            value: '',
            name: 'Select type of item'
        }, {
            value: 'Custom Input',
            name: 'Custom Input'
        }, {
            value: 'System Fields',
            name: 'System Fields'
        }, {
            value: 'Dropdown',
            name: 'Dropdown'
        }];

        $scope.inputTypes = [{
            value: '',
            name: 'Select type of input'
        }, {
            value: 'Text',
            name: 'Text'
        }, {
            value: 'Date',
            name: 'Date'
        }, {
            value: 'Textarea',
            name: 'Textarea'
        }];


        $scope.addHead = function () {
            $scope.formData.forms.push({
                head: $scope.formData.forms.length + 1,
                items: [{}]
            });
        };
        $scope.removeHead = function (index) {
            if ($scope.formData.forms.length > 1) {
                $scope.formData.forms.splice(index, 1);
            } else {
                $scope.formData.forms = [{
                    head: '',
                    items: [{}, {}]
                }];
            }
        };

        $scope.addItem = function (obj) {
            var index = $scope.formData.forms.indexOf(obj);
            $scope.formData.forms[index].items.push({});
        };

        $scope.removeItem = function (obj, indexItem) {
            var indexHead = $scope.formData.forms.indexOf(obj);
            if ($scope.formData.forms[indexHead].items.length > 1) {
                $scope.formData.forms[indexHead].items.splice(indexItem, 1);
            } else {
                $scope.formData.forms[indexHead].items = [{}];
            }
        };

        $scope.sortableOptions = {
            handle: ' .handleBar',
            axis: 'y',
            'ui-floating': true,
            start: function (e, ui) {
                $('#sortable-ul-selector-id').sortable("refreshPositions");
                $('#sortable-ul-selector-id').sortable("refresh");
            }
        };
        $scope.cancel = function () {
            $window.history.back();
        }
        $scope.saveModel = function (data) {
            NavigationService.modelSave("TemplateIla", $scope.formData, function (data) {
                if (data.value === true) {
                    // $state.go('templateIla-list');
                    $window.history.back();
                    toastr.success("Template ILA " + $scope.formData.name + " edited successfully.", "Template ILA Edited");
                } else {
                    toastr.error("Template ILA Edition failed.", "Template ILA edition error");
                }
            });
        };
    })

    .controller('CreateTemplateILACtrl', function ($scope, $window, TemplateService, NavigationService, $timeout, $stateParams, $state, toastr) {
        //Used to name the .html file
        $scope.template = TemplateService.changecontent("templateIla-detail");
        $scope.menutitle = NavigationService.makeactive("Create ILA Template");
        TemplateService.title = $scope.menutitle;
        $scope.navigation = NavigationService.getnav();

        $scope.header = {
            "name": "Create ILA Template"
        };

        $scope.itemTypes = [{
            value: '',
            name: 'Select type of item'
        }, {
            value: 'Custom Input',
            name: 'Custom Input'
        }, {
            value: 'System Fields',
            name: 'System Fields'
        }, {
            value: 'Dropdown',
            name: 'Dropdown'
        }];

        $scope.inputTypes = [{
            value: '',
            name: 'Select type of input'
        }, {
            value: 'Text',
            name: 'Text'
        }, {
            value: 'Date',
            name: 'Date'
        }, {
            value: 'Textarea',
            name: 'Textarea'
        }];

        $scope.formData = {};
        $scope.formData.status = true;

        $scope.formData.forms = [{
            head: '',
            items: [{}, {}]
        }];

        $scope.addHead = function () {
            $scope.formData.forms.push({
                head: $scope.formData.forms.length + 1,
                items: [{}]
            });
        };
        $scope.removeHead = function (index) {
            if ($scope.formData.forms.length > 1) {
                $scope.formData.forms.splice(index, 1);
            } else {
                $scope.formData.forms = [{
                    head: '',
                    items: [{}, {}]
                }];
            }
        };

        $scope.addItem = function (obj) {
            var index = $scope.formData.forms.indexOf(obj);
            $scope.formData.forms[index].items.push({});
        };

        $scope.removeItem = function (obj, indexItem) {
            var indexHead = $scope.formData.forms.indexOf(obj);
            if ($scope.formData.forms[indexHead].items.length > 1) {
                $scope.formData.forms[indexHead].items.splice(indexItem, 1);
            } else {
                $scope.formData.forms[indexHead].items = [{}];
            }
        };

        $scope.sortableOptions = {
            handle: ' .handleBar',
            axis: 'y',
            'ui-floating': true,
            start: function (e, ui) {
                $('#sortable-ul-selector-id').sortable("refreshPositions");
                $('#sortable-ul-selector-id').sortable("refresh");
            }
        };
        $scope.cancel = function () {
            $window.history.back();
        }
        $scope.saveModel = function (data) {
            $scope.saveModel = function (formData) {
                NavigationService.modelSave("TemplateIla", $scope.formData, function (data) {
                    if (data.value === true) {
                        // $state.go('templateIla-list');
                        $window.history.back();
                        toastr.success("Template ILA " + $scope.formData.name + " created successfully.", "Template ILA Created");
                    } else {
                        toastr.error("Template ILA creation failed.", "Template ILA creation error");
                    }
                });
            };
        };


    })

    .controller('TemplateISRCtrl', function ($scope, $window, TemplateService, NavigationService, $timeout, $state) {
        //Used to name the .html file
        $scope.template = TemplateService.changecontent("templateIsr-list");
        $scope.menutitle = NavigationService.makeactive("ISR List");
        TemplateService.title = $scope.menutitle;
        $scope.navigation = NavigationService.getnav();

    })


    .controller('EditTemplateISRCtrl', function ($scope, $window, TemplateService, NavigationService, $timeout, $stateParams, $state, toastr) {
        //Used to name the .html file
        $scope.template = TemplateService.changecontent("templateIsr-detail");
        $scope.menutitle = NavigationService.makeactive("Edit ISR Template");
        TemplateService.title = $scope.menutitle;
        $scope.navigation = NavigationService.getnav();

        $scope.header = {
            "name": "Edit ISR Template"
        };
        $scope.formData = {};
        // $scope.formData.status = true;

        NavigationService.getOneModel("TemplateIsr", $stateParams.id, function (data) {
            $scope.formData = data.data;
        });

        $scope.itemTypes = [{
            value: '',
            name: 'Select type of item'
        }, {
            value: 'Custom Input',
            name: 'Custom Input'
        }, {
            value: 'System Fields',
            name: 'System Fields'
        }, {
            value: 'Dropdown',
            name: 'Dropdown'
        }];

        $scope.inputTypes = [{
            value: '',
            name: 'Select type of input'
        }, {
            value: 'Text',
            name: 'Text'
        }, {
            value: 'Date',
            name: 'Date'
        }, {
            value: 'Textarea',
            name: 'Textarea'
        }];


        $scope.addHead = function () {
            $scope.formData.forms.push({
                head: $scope.formData.forms.length + 1,
                items: [{}]
            });
        };
        $scope.removeHead = function (index) {
            if ($scope.formData.forms.length > 1) {
                $scope.formData.forms.splice(index, 1);
            } else {
                $scope.formData.forms = [{
                    head: '',
                    items: [{}, {}]
                }];
            }
        };

        $scope.addItem = function (obj) {
            var index = $scope.formData.forms.indexOf(obj);
            $scope.formData.forms[index].items.push({});
        };

        $scope.removeItem = function (obj, indexItem) {
            var indexHead = $scope.formData.forms.indexOf(obj);
            if ($scope.formData.forms[indexHead].items.length > 1) {
                $scope.formData.forms[indexHead].items.splice(indexItem, 1);
            } else {
                $scope.formData.forms[indexHead].items = [{}];
            }
        };

        $scope.sortableOptions = {
            handle: ' .handleBar',
            axis: 'y',
            'ui-floating': true,
            start: function (e, ui) {
                $('#sortable-ul-selector-id').sortable("refreshPositions");
                $('#sortable-ul-selector-id').sortable("refresh");
            }
        };
        $scope.cancel = function () {
            $window.history.back();
        }
        $scope.saveModel = function (data) {
            $scope.saveModel = function (formData) {
                NavigationService.modelSave("TemplateIsr", $scope.formData, function (data) {
                    if (data.value === true) {
                        // $state.go('templateIsr-list');
                        $window.history.back();
                        toastr.success("Template ISR " + formData.name + " edited successfully.", "Template ISR Edited");
                    } else {
                        toastr.error("Template ISR Edition failed.", "Template ISR edition error");
                    }
                });
            };
        };
    })

    .controller('CreateTemplateISRCtrl', function ($scope, $window, TemplateService, NavigationService, $timeout, $stateParams, $state, toastr) {
        //Used to name the .html file
        $scope.template = TemplateService.changecontent("templateIsr-detail");
        $scope.menutitle = NavigationService.makeactive("Create ISR Template");
        TemplateService.title = $scope.menutitle;
        $scope.navigation = NavigationService.getnav();

        $scope.header = {
            "name": "Create ISR Template"
        };

        $scope.itemTypes = [{
            value: '',
            name: 'Select type of item'
        }, {
            value: 'Custom Input',
            name: 'Custom Input'
        }, {
            value: 'System Fields',
            name: 'System Fields'
        }, {
            value: 'Dropdown',
            name: 'Dropdown'
        }];

        $scope.inputTypes = [{
            value: '',
            name: 'Select type of input'
        }, {
            value: 'Text',
            name: 'Text'
        }, {
            value: 'Date',
            name: 'Date'
        }, {
            value: 'Textarea',
            name: 'Textarea'
        }];

        $scope.formData = {};
        $scope.formData.status = true;

        $scope.formData.forms = [{
            head: '',
            items: [{}, {}]
        }];

        $scope.addHead = function () {
            $scope.formData.forms.push({
                head: $scope.formData.forms.length + 1,
                items: [{}]
            });
        };
        $scope.removeHead = function (index) {
            if ($scope.formData.forms.length > 1) {
                $scope.formData.forms.splice(index, 1);
            } else {
                $scope.formData.forms = [{
                    head: '',
                    items: [{}, {}]
                }];
            }
        };

        $scope.addItem = function (obj) {
            var index = $scope.formData.forms.indexOf(obj);
            $scope.formData.forms[index].items.push({});
        };

        $scope.removeItem = function (obj, indexItem) {
            var indexHead = $scope.formData.forms.indexOf(obj);
            if ($scope.formData.forms[indexHead].items.length > 1) {
                $scope.formData.forms[indexHead].items.splice(indexItem, 1);
            } else {
                $scope.formData.forms[indexHead].items = [{}];
            }
        };

        $scope.sortableOptions = {
            handle: ' .handleBar',
            axis: 'y',
            'ui-floating': true,
            start: function (e, ui) {
                $('#sortable-ul-selector-id').sortable("refreshPositions");
                $('#sortable-ul-selector-id').sortable("refresh");
            }
        };
        $scope.cancel = function () {
            $window.history.back();
        }
        $scope.saveModel = function (data) {
            $scope.saveModel = function (formData) {
                NavigationService.modelSave("TemplateIsr", $scope.formData, function (data) {
                    if (data.value === true) {
                        // $state.go('templateIla-list');
                        $window.history.back();
                        toastr.success("Template ISR " + formData.name + " created successfully.", "Template ISR Created");
                    } else {
                        toastr.error("Template ISR creation failed.", "Template ISR creation error");
                    }
                });
            };
        };


    })


    .controller('TemplateJIRCtrl', function ($scope, $window, TemplateService, NavigationService, $timeout, $state) {
        //Used to name the .html file
        $scope.template = TemplateService.changecontent("templateJir-list");
        $scope.menutitle = NavigationService.makeactive("JIR List");
        TemplateService.title = $scope.menutitle;
        $scope.navigation = NavigationService.getnav();

    })


    .controller('EditTemplateJIRCtrl', function ($scope, $window, TemplateService, NavigationService, $timeout, $stateParams, $state, toastr) {
        //Used to name the .html file
        $scope.template = TemplateService.changecontent("templateJir-detail");
        $scope.menutitle = NavigationService.makeactive("Edit JIR Template");
        TemplateService.title = $scope.menutitle;
        $scope.navigation = NavigationService.getnav();

        $scope.header = {
            "name": "Edit JIR Template"
        };
        $scope.formData = {};
        // $scope.formData.status = true;

        NavigationService.getOneModel("TemplateJir", $stateParams.id, function (data) {
            $scope.formData = data.data;
        });

        $scope.itemTypes = [{
            value: '',
            name: 'Select type of item'
        }, {
            value: 'Custom Input',
            name: 'Custom Input'
        }, {
            value: 'System Fields',
            name: 'System Fields'
        }, {
            value: 'Dropdown',
            name: 'Dropdown'
        }];

        $scope.inputTypes = [{
            value: '',
            name: 'Select type of input'
        }, {
            value: 'Text',
            name: 'Text'
        }, {
            value: 'Date',
            name: 'Date'
        }, {
            value: 'Textarea',
            name: 'Textarea'
        }];


        $scope.addHead = function () {
            $scope.formData.forms.push({
                head: $scope.formData.forms.length + 1,
                items: [{}]
            });
        };
        $scope.removeHead = function (index) {
            if ($scope.formData.forms.length > 1) {
                $scope.formData.forms.splice(index, 1);
            } else {
                $scope.formData.forms = [{
                    head: '',
                    items: [{}, {}]
                }];
            }
        };

        $scope.addItem = function (obj) {
            var index = $scope.formData.forms.indexOf(obj);
            $scope.formData.forms[index].items.push({});
        };

        $scope.removeItem = function (obj, indexItem) {
            var indexHead = $scope.formData.forms.indexOf(obj);
            if ($scope.formData.forms[indexHead].items.length > 1) {
                $scope.formData.forms[indexHead].items.splice(indexItem, 1);
            } else {
                $scope.formData.forms[indexHead].items = [{}];
            }
        };

        $scope.sortableOptions = {
            handle: ' .handleBar',
            axis: 'y',
            'ui-floating': true,
            start: function (e, ui) {
                $('#sortable-ul-selector-id').sortable("refreshPositions");
                $('#sortable-ul-selector-id').sortable("refresh");
            }
        };
        $scope.cancel = function () {
            $window.history.back();
        }
        $scope.saveModel = function (data) {
            console.log(data);
            $scope.saveModel = function (formData) {
                NavigationService.modelSave("TemplateJir", $scope.formData, function (data) {
                    if (data.value === true) {
                        // $state.go('templateJir-list');
                        $window.history.back();
                        toastr.success("Template JIR " + formData.name + " edited successfully.", "Template JIR Edited");
                    } else {
                        toastr.error("Template JIR Edition failed.", "Template JIR edition error");
                    }
                });
            };
        };
    })

    .controller('CreateTemplateJIRCtrl', function ($scope, $window, TemplateService, NavigationService, $timeout, $stateParams, $state, toastr) {
        //Used to name the .html file
        $scope.template = TemplateService.changecontent("templateJir-detail");
        $scope.menutitle = NavigationService.makeactive("Create JIR Template");
        TemplateService.title = $scope.menutitle;
        $scope.navigation = NavigationService.getnav();

        $scope.header = {
            "name": "Create JIR Template"
        };

        $scope.itemTypes = [{
            value: '',
            name: 'Select type of item'
        }, {
            value: 'Custom Input',
            name: 'Custom Input'
        }, {
            value: 'System Fields',
            name: 'System Fields'
        }, {
            value: 'Dropdown',
            name: 'Dropdown'
        }];

        $scope.inputTypes = [{
            value: '',
            name: 'Select type of input'
        }, {
            value: 'Text',
            name: 'Text'
        }, {
            value: 'Date',
            name: 'Date'
        }, {
            value: 'Textarea',
            name: 'Textarea'
        }];

        $scope.formData = {};
        $scope.formData.status = true;

        $scope.formData.forms = [{
            head: '',
            items: [{}, {}]
        }];

        $scope.addHead = function () {
            $scope.formData.forms.push({
                head: $scope.formData.forms.length + 1,
                items: [{}]
            });
        };
        $scope.removeHead = function (index) {
            if ($scope.formData.forms.length > 1) {
                $scope.formData.forms.splice(index, 1);
            } else {
                $scope.formData.forms = [{
                    head: '',
                    items: [{}, {}]
                }];
            }
        };

        $scope.addItem = function (obj) {
            var index = $scope.formData.forms.indexOf(obj);
            $scope.formData.forms[index].items.push({});
        };

        $scope.removeItem = function (obj, indexItem) {
            var indexHead = $scope.formData.forms.indexOf(obj);
            if ($scope.formData.forms[indexHead].items.length > 1) {
                $scope.formData.forms[indexHead].items.splice(indexItem, 1);
            } else {
                $scope.formData.forms[indexHead].items = [{}];
            }
        };

        $scope.sortableOptions = {
            handle: ' .handleBar',
            axis: 'y',
            'ui-floating': true,
            start: function (e, ui) {
                $('#sortable-ul-selector-id').sortable("refreshPositions");
                $('#sortable-ul-selector-id').sortable("refresh");
            }
        };
        $scope.cancel = function () {
            $window.history.back();
        }
        $scope.saveModel = function (data) {
            console.log(data);
            $scope.saveModel = function (formData) {
                NavigationService.modelSave("TemplateJir", $scope.formData, function (data) {
                    if (data.value === true) {
                        // $state.go('templateJir-list');
                        $window.history.back();
                        toastr.success("Template JIR " + formData.name + " created successfully.", "Template JIR Created");
                    } else {
                        toastr.error("Template JIR creation failed.", "Template JIR creation error");
                    }
                });
            };
        };


    })

    .controller('CreateLeaveCtrl', function ($scope, hotkeys, $window, TemplateService, NavigationService, $timeout, $state, $uibModal, $stateParams, toastr, $filter) {
        //Used to name the .html file
        $scope.template = TemplateService.changecontent("leaveManagement-detail");
        $scope.menutitle = NavigationService.makeactive("LeaveManagement");
        TemplateService.title = $scope.menutitle;
        $scope.navigation = NavigationService.getnav();
        $scope.formData = {};
        // $scope.formData.personalDocument = [];
        // $scope.formData.licenseDocument = [];
        // $scope.formData.IIISLACertificate = [];
        // $scope.formData.IIISLAReciept = [];
        // $scope.formData.CTCDetails = [];
        $scope.header = {
            "name": "Create Leave"
        };
        $scope.userStatus = [{
            "name": "Active",
            "value": true
        }, {
            "name": "Inactive",
            "value": false
        }];
        $scope.status = ["Approved", "Pending", "Rejected", "Partially Approved"];
        // $scope.houseColors = ["Red", "Green", "Blue", "Yellow", "White"];

        $scope.dateOptions = {
            showWeeks: true
        };


        $scope.format = 'dd-MMMM-yyyy';
        $scope.modalData = {};
        $scope.holdObject = '';
        $scope.modalIndex = 0;

        $scope.changeDOB = function (date) {
            console.log($filter('ageFilter')(date));
        };
        $scope.minDate = new Date();
        $scope.addModal = function (filename, index, holdobj, data, current) {
            if (index !== "") {
                $scope.modalData = data;
                $scope.modalIndex = index;
                $scope.modalData.from = new Date(data.from);
                $scope.modalData.to = new Date(data.to);
            } else {
                $scope.modalData = {};
                if (current.length > 0) {
                    $scope.modalData.from = new Date(current[current.length - 1].to);
                    $scope.modalData.grade = current[current.length - 1].grade;
                }
                $scope.modalIndex = "";
            }
            $scope.holdObject = holdobj;
            console.log($scope.holdObject);
            var modalInstance = $uibModal.open({
                scope: $scope,
                templateUrl: '/frontend/views/modal/' + filename + '.html',
                size: 'lg'
            });
        };

        $scope.cancel = function () {
            $window.history.back();
        }
        hotkeys.bindTo($scope).add({
            combo: 'ctrl+enter',
            callback: function (formData) {
                NavigationService.modelSave("LeaveManagement", $scope.formData, function (data) {
                    if (data.value === true) {
                        console.log("Data In Else", data.value);
                        // $state.go('leaveManagement-list');
                        $window.history.back();
                        toastr.success("Leave Of " + " " + formData.name + " created successfully.", "Employee" + " Created");
                    } else {
                        console.log("Data In Else", data.value);
                        toastr.error("Leave Of " + " creation failed.", "Employee" + " creation error");
                    }
                });
            }
        });
        $scope.saveModel = function (formData) {
            console.log("SAVE MODEL DATA", formData);
            // $scope.formData.name = $scope.formData.firstName + " " + $scope.formData.lastName;

            NavigationService.modelSave("LeaveManagement", $scope.formData, function (data) {
                if (data.value === true) {
                    console.log("Data In Else", data.value);
                    // $state.go('leaveManagement-list');
                    $window.history.back();
                    toastr.success("Leave Of " + " " + formData.name + " created successfully.", "Employee" + " Created");
                } else {
                    console.log("Data In Else", data.value);
                    toastr.error("Leave Of " + " creation failed.", "Employee" + " creation error");
                }
            });
        };
    })



    .controller('CreateKnowledgeBaseCtrl', function ($scope, hotkeys, $window, TemplateService, NavigationService, $timeout, $state, $uibModal, $stateParams, toastr, $filter) {
        //Used to name the .html file
        $scope.template = TemplateService.changecontent("knowledgeBase-detail");
        $scope.menutitle = NavigationService.makeactive("KnowledgeBase");
        TemplateService.title = $scope.menutitle;
        $scope.navigation = NavigationService.getnav();
        $scope.formData = {};
        $scope.header = {
            "name": "Create All-Documents"
        };
        $scope.userStatus = [{
            "name": "Active",
            "value": true
        }, {
            "name": "Inactive",
            "value": false
        }];



        $scope.dateOptions = {
            showWeeks: true
        };



        $scope.format = 'dd-MMMM-yyyy';
        $scope.modalData = {};
        $scope.holdObject = '';
        $scope.modalIndex = 0;

        $scope.changeDOB = function (date) {
            console.log($filter('ageFilter')(date));
        };
        $scope.minDate = new Date();
        $scope.addModal = function (filename, index, holdobj, data, current) {
            if (index !== "") {
                $scope.modalData = data;
                $scope.modalIndex = index;
                $scope.modalData.from = new Date(data.from);
                $scope.modalData.to = new Date(data.to);
            } else {
                $scope.modalData = {};
                if (current.length > 0) {
                    $scope.modalData.from = new Date(current[current.length - 1].to);
                    $scope.modalData.grade = current[current.length - 1].grade;
                }
                $scope.modalIndex = "";
            }
            $scope.holdObject = holdobj;
            console.log($scope.holdObject);
            var modalInstance = $uibModal.open({
                scope: $scope,
                templateUrl: '/frontend/views/modal/' + filename + '.html',
                size: 'lg'
            });
        };

        $scope.refreshTags = function (data) {
            console.log("Data Inn", data);
            var formdata = {};
            formdata.keyword = data;
            NavigationService.searchTags(formdata, 1, function (data) {
                $scope.tags = data.data.results;
            });
        };
        $scope.cancel = function () {
            $window.history.back();
        }
        hotkeys.bindTo($scope).add({
            combo: 'ctrl+enter',
            callback: function (formData) {
                NavigationService.modelSave("KnowledgeBase", $scope.formData, function (data) {
                    if (data.value === true) {
                        console.log("Data In If", data.value);
                        $window.history.back();
                        toastr.success("Document for " + " " + formData.name + " created successfully.", "Employee" + " Created");
                    } else {
                        console.log("Data In Else", data.value);
                        toastr.error("Document for " + " creation failed.", "Employee" + " creation error");
                    }
                });
            }
        });
        $scope.saveModel = function (formData) {
            console.log("SAVE MODEL DATA", formData);
            NavigationService.modelSave("KnowledgeBase", $scope.formData, function (data) {
                if (data.value === true) {
                    console.log("Data In If", data.value);
                    // $state.go('knowledgebase-list');
                    $window.history.back();
                    toastr.success("Document for " + " " + formData.name + " created successfully.", "Employee" + " Created");
                } else {
                    console.log("Data In Else", data.value);
                    toastr.error("Document for " + " creation failed.", "Employee" + " creation error");
                }
            });
        };
    })

    // 
    .controller('EditKnowledgeBaseCtrl', function ($scope, hotkeys, $window, TemplateService, NavigationService, $timeout, $stateParams, $state, toastr) {
        //Used to name the .html file
        $scope.template = TemplateService.changecontent("knowledgeBase-detail");
        $scope.menutitle = NavigationService.makeactive("Policy Type");
        TemplateService.title = $scope.menutitle;
        $scope.navigation = NavigationService.getnav();
        $scope.userStatus = [{
            "name": "Active",
            "value": true
        }, {
            "name": "Inactive",
            "value": false
        }];
        $scope.header = {
            "name": "Edit Policy Type"
        };
        $scope.tags = [];
        $scope.refreshTags = function (data) {
            console.log("Data Inn", data);
            var formdata = {};
            formdata.keyword = data;
            NavigationService.searchTags(formdata, 1, function (data) {
                $scope.tags = data.data.results;
            });
        };

        NavigationService.getOneModel("KnowledgeBase", $stateParams.id, function (data) {
            $scope.formData = data.data;
        });
        $scope.cancel = function () {
            $window.history.back();
        }
        hotkeys.bindTo($scope).add({
            combo: 'ctrl+enter',
            callback: function (formData) {
                _.each(formData.tag, function (n) {
                    n = n._id;
                });
                NavigationService.modelSave("KnowledgeBase", $scope.formData, function (data) {
                    if (data.value === true) {
                        $window.history.back();
                        toastr.success("KnowledgeBase" + $scope.formData.name + " edited successfully.", "KnowledgeBase" + " Edited");
                    } else {
                        toastr.error("KnowledgeBase" + " edition failed.", "KnowledgeBase" + " editing error");
                    }
                });
            }
        });
        $scope.saveModel = function (formData) {
            _.each(formData.tag, function (n) {
                n = n._id;
            });
            NavigationService.modelSave("KnowledgeBase", $scope.formData, function (data) {
                if (data.value === true) {
                    $window.history.back();
                    toastr.success("KnowledgeBase" + $scope.formData.name + " edited successfully.", "KnowledgeBase" + " Edited");
                } else {
                    toastr.error("KnowledgeBase" + " edition failed.", "KnowledgeBase" + " editing error");
                }
            });
        };

    })
    // 

    .controller('CreateAllDocumentCtrl', function ($scope, $window, TemplateService, NavigationService, $timeout, $state, $uibModal, $stateParams, toastr, $filter) {
        //Used to name the .html file
        $scope.template = TemplateService.changecontent("all-document-details");
        $scope.menutitle = NavigationService.makeactive("Jir");
        TemplateService.title = $scope.menutitle;
        $scope.navigation = NavigationService.getnav();
        $scope.formData = {};
        $scope.header = {
            "name": "Create Document"
        };
        $scope.userStatus = [{
            "name": "Active",
            "value": true
        }, {
            "name": "Inactive",
            "value": false
        }];



        $scope.dateOptions = {
            showWeeks: true
        };

        $scope.status = ["Jir", "Law", "Insurance", "Survey", "Surveyor", "ILR", "ILA"];

        $scope.format = 'dd-MMMM-yyyy';
        $scope.modalData = {};
        $scope.holdObject = '';
        $scope.modalIndex = 0;

        $scope.changeDOB = function (date) {
            console.log($filter('ageFilter')(date));
        };
        $scope.minDate = new Date();
        $scope.addModal = function (filename, index, holdobj, data, current) {
            if (index !== "") {
                $scope.modalData = data;
                $scope.modalIndex = index;
                $scope.modalData.from = new Date(data.from);
                $scope.modalData.to = new Date(data.to);
            } else {
                $scope.modalData = {};
                if (current.length > 0) {
                    $scope.modalData.from = new Date(current[current.length - 1].to);
                    $scope.modalData.grade = current[current.length - 1].grade;
                }
                $scope.modalIndex = "";
            }
            $scope.holdObject = holdobj;
            console.log($scope.holdObject);
            var modalInstance = $uibModal.open({
                scope: $scope,
                templateUrl: '/frontend/views/modal/' + filename + '.html',
                size: 'lg'
            });
        };

        $scope.cancel = function () {
            $window.history.back();
        }
        $scope.saveModel = function (formData) {
            console.log("SAVE MODEL DATA", formData);

            NavigationService.modelSave("Jir", $scope.formData, function (data) {
                if (data.value === true) {
                    console.log("Data In If", data.value);
                    // $state.go('all-document');
                    $window.history.back();
                    toastr.success("Document for " + " " + formData.name + " created successfully.", "Document" + " Created");
                } else {
                    console.log("Data In Else", data.value);
                    toastr.error("Document for " + " creation failed.", "Document" + " creation error");
                }
            });
        };
    })

    .controller('CreateReimbursementCtrl', function ($scope, hotkeys, $window, TemplateService, NavigationService, $timeout, $state, $uibModal, $stateParams, toastr, $filter) {
        //Used to name the .html file
        $scope.template = TemplateService.changecontent("reimbursement-detail");
        $scope.menutitle = NavigationService.makeactive("Reimbursement");
        TemplateService.title = $scope.menutitle;
        $scope.navigation = NavigationService.getnav();
        $scope.formData = {};
        $scope.totals = {};
        $scope.calculateExpense = function (data) {
            console.log("totals", data.expenseAmount);
            $scope.totals.expense += data.expenseAmount;
        }
        $scope.resetExpense = function () {
            $scope.totals.expense = 0;
        }

        $scope.calculateLodgingBoarding = function (data) {
            console.log("lodgingBoardingTotal", data.lodgingBoardingTotal);
            $scope.totals.lodgingBoarding += data.lodgingBoardingTotal;
        }
        $scope.resetLodgingBoarding = function () {
            $scope.totals.lodgingBoarding = 0;
        }

        $scope.calculateTravelExpense = function (data) {
            console.log("totals", data.travelExpenseAmount);
            $scope.totals.travelExpense += data.travelExpenseAmount;
        }
        $scope.resetTravelExpense = function () {
            $scope.totals.travelExpense = 0;
        }

        $scope.calculatePocketExpense = function (data) {
            console.log("pocketExpenseTotal", data.pocketExpenseTotal);
            $scope.totals.pocketExpense += data.pocketExpenseTotal;
        }
        $scope.resetPocketExpense = function () {
            $scope.totals.pocketExpense = 0;
        }

        $scope.calculateGrandTotal = function (data) {
            console.log("Total data!", data);
            // data = _.cloneDeep(data);
            // if(data.expense){
            //     var dataExpense = data.expense;
            // } else {
            //     var dataExpense = 0
            // }
            //   if(data.travelExpense){
            //     var dataTravelExpense = data.travelExpense;
            // } else {
            //     var dataTravelExpense = 0
            // }
            //   if(data.lodgingBoarding){
            //     var dataLodgingBoarding = data.lodgingBoarding;
            // } else {
            //     var dataLodgingBoarding = 0
            // }
            //   if(data.pocketExpense){
            //     var dataPocketExpense = data.pocketExpense;
            // } else {
            //     var dataPocketExpense = 0
            // }
            // console.log("totalssss",data);
            // console.log("data.expense",data.expense);
            // console.log("data.travelExpense",data.travelExpense);
            // console.log("data.lodgingBoarding",data.lodgingBoarding);
            // console.log("data.pocketExpense",data.pocketExpense);
            $scope.grandTotal = 0;
            // console.log("$scope.totals.grandTotal",$scope.grandTotal);
        }

        $scope.resetGrandTotal = function () {
            $scope.totals.grandTotal = 0;
        }
        // $scope.formData.personalDocument = [];
        // $scope.formData.licenseDocument = [];
        // $scope.formData.IIISLACertificate = [];
        // $scope.formData.IIISLAReciept = [];
        // $scope.formData.CTCDetails = [];
        $scope.header = {
            "name": "Create Reimbursement"
        };
        $scope.userStatus = [{
            "name": "Active",
            "value": true
        }, {
            "name": "Inactive",
            "value": false
        }];
        $scope.status = ["Approved", "Pending", "Rejected", "Partially Approved"];
        // $scope.houseColors = ["Red", "Green", "Blue", "Yellow", "White"];

        $scope.dateOptions = {
            showWeeks: true
        };


        $scope.format = 'dd-MMMM-yyyy';
        $scope.modalData = {};
        $scope.holdObject = '';
        $scope.modalIndex = 0;

        $scope.changeDOB = function (date) {
            console.log($filter('ageFilter')(date));
        };
        $scope.minDate = new Date();
        $scope.addModal = function (filename, index, holdobj, data, current) {
            if (index !== "") {
                $scope.modalData = data;
                $scope.modalIndex = index;
            } else {
                $scope.modalData = {};
                if (current.length > 0) {}
                $scope.modalIndex = "";
            }
            $scope.holdObject = holdobj;
            console.log($scope.holdObject, filename);
            var modalInstance = $uibModal.open({
                scope: $scope,
                templateUrl: '/frontend/views/modal/' + filename + '.html',
                size: 'lg'
            });
        };
        $scope.deleteElements = function (index, data) {
            data.splice(index, 1);
        };
        $scope.wholeObj = [];
        $scope.formData.expense = [];
        $scope.formData.travelExpense = [];
        $scope.formData.lodgingBoarding = [];
        $scope.formData.pocketExpense = [];
        $scope.addElements = function (moddata) {
            console.log("moddata", moddata);
            if ($scope.modalIndex !== "") {
                switch ($scope.holdObject) {
                    case "Expense":
                        {
                            $scope.formData.expense[$scope.modalIndex] = moddata;
                        }
                        break;
                    case "Travel Expense":
                        {
                            $scope.formData.travelExpense[$scope.modalIndex] = moddata;
                        }
                        break;
                    case "Lodging Boarding":
                        {
                            $scope.formData.lodgingBoarding[$scope.modalIndex] = moddata;
                        }
                        break;
                    case "Pocket Expense":
                        {
                            $scope.formData.pocketExpense[$scope.modalIndex] = moddata;
                        }
                        break;

                    default:
                        {
                            // $scope.formData.push($scope.newjson);
                        }

                }
            } else {
                switch ($scope.holdObject) {
                    case "Expense":
                        {
                            $scope.formData.expense.push(moddata);
                        }
                        break;
                    case "Travel Expense":
                        {
                            $scope.formData.travelExpense.push(moddata);
                        }
                        break;
                    case "Lodging Boarding":
                        {
                            $scope.formData.lodgingBoarding.push(moddata);
                        }
                        break;
                    case "Pocket Expense":
                        {
                            $scope.formData.pocketExpense.push(moddata);
                        }
                        break;

                    default:
                        {
                            // $scope.formData.push($scope.newjson);
                        }
                }

            }
        };

        $scope.cancel = function () {
            $window.history.back();
        }
        hotkeys.bindTo($scope).add({
            combo: 'ctrl+enter',
            callback: function (formData) {
                NavigationService.modelSave("Reimbursement", $scope.formData, function (data) {
                    console.log($scope.formData);
                    console.log(data.value);
                    if (data.value === true) {
                        console.log("Data In If", data.value);
                        // $state.go('reimbursement-list');
                        $window.history.back();
                        toastr.success("Reimbursement created successfully.", "Employee" + " Created");
                    } else {
                        console.log("Data In Else", data.value);
                        toastr.error("Reimbursement creation failed.", "Employee" + " creation error");
                    }
                });
            }
        });
        $scope.saveModel = function (formData) {
            console.log(formData);
            NavigationService.modelSave("Reimbursement", $scope.formData, function (data) {
                console.log($scope.formData);
                console.log(data.value);
                if (data.value === true) {
                    console.log("Data In If", data.value);
                    // $state.go('reimbursement-list');
                    $window.history.back();
                    toastr.success("Reimbursement created successfully.", "Employee" + " Created");
                } else {
                    console.log("Data In Else", data.value);
                    toastr.error("Reimbursement creation failed.", "Employee" + " creation error");
                }
            });
        };
    })


    .controller('EditReimbursementCtrl', function ($scope, hotkeys, $window, TemplateService, NavigationService, $timeout, $state, $uibModal, $stateParams, toastr, $filter) {
        //Used to name the .html file
        $scope.template = TemplateService.changecontent("reimbursement-detail");
        $scope.menutitle = NavigationService.makeactive("Reimbursement");
        TemplateService.title = $scope.menutitle;
        $scope.navigation = NavigationService.getnav();
        $scope.formData = {};
        $scope.totals = {};
        $scope.calculateExpense = function (data) {
            console.log("totals", data.expenseAmount);
            $scope.totals.expense += data.expenseAmount;
        }
        $scope.resetExpense = function () {
            $scope.totals.expense = 0;
        }

        $scope.calculateLodgingBoarding = function (data) {
            console.log("lodgingBoardingTotal", data.lodgingBoardingTotal);
            $scope.totals.lodgingBoarding += data.lodgingBoardingTotal;
        }
        $scope.resetLodgingBoarding = function () {
            $scope.totals.lodgingBoarding = 0;
        }

        $scope.calculateTravelExpense = function (data) {
            console.log("totals", data.travelExpenseAmount);
            $scope.totals.travelExpense += data.travelExpenseAmount;
        }
        $scope.resetTravelExpense = function () {
            $scope.totals.travelExpense = 0;
        }

        $scope.calculatePocketExpense = function (data) {
            console.log("pocketExpenseTotal", data.pocketExpenseTotal);
            $scope.totals.pocketExpense += data.pocketExpenseTotal;
        }
        $scope.resetPocketExpense = function () {
            $scope.totals.pocketExpense = 0;
        }

        $scope.calculateGrandTotal = function (data) {
            console.log("Total data!", data);
            // data = _.cloneDeep(data);
            if (data.expense) {
                var dataExpense = data.expense;
                console.log($scope.totals.expense, "expense--", dataExpense);
            } else {
                var dataExpense = 0
            }
            if (data.travelExpense) {
                var dataTravelExpense = data.travelExpense;
            } else {
                var dataTravelExpense = 0
            }
            if (data.lodgingBoarding) {
                var dataLodgingBoarding = data.lodgingBoarding;
            } else {
                var dataLodgingBoarding = 0
            }
            if (data.pocketExpense) {
                var dataPocketExpense = data.pocketExpense;
            } else {
                var dataPocketExpense = 0
            }
            console.log("totalssss", data);
            console.log("data.expense", dataExpense);
            console.log("data.travelExpense", data.travelExpense);
            console.log("data.lodgingBoarding", data.lodgingBoarding);
            console.log("data.pocketExpense", data.pocketExpense);
            $scope.totals.grandTotal = dataExpense + dataTravelExpense + dataLodgingBoarding + dataPocketExpense;
            console.log("$scope.totals.grandTotal", $scope.totals.grandTotal);
        }

        $scope.resetGrandTotal = function () {
            // $scope.totals.grandTotal = 0;
        }


        $scope.header = {
            "name": "Edit Reimbursement"
        };
        $scope.userStatus = [{
            "name": "Active",
            "value": true
        }, {
            "name": "Inactive",
            "value": false
        }];
        $scope.status = ["Approved", "Pending", "Rejected", "Partially Approved"];
        $scope.dateOptions = {
            showWeeks: true,
            formatDayTitle: 'dd-MMMM-yyyy'
        };


        $scope.format = 'dd-MMMM-yyyy';
        $scope.modalData = {};
        $scope.holdObject = '';
        $scope.modalIndex = 0;

        $scope.changeDOB = function (date) {
            console.log($filter('ageFilter')(date));
        };
        $scope.minDate = new Date();
        $scope.addModal = function (filename, index, holdobj, data, current) {
            if (index !== "") {
                $scope.modalData = data;
                if ($scope.modalData.expenseDate) {
                    $scope.modalData.expenseDate = new Date($scope.modalData.expenseDate)
                }
                if ($scope.modalData.depatureDate) {
                    $scope.modalData.depatureDate = new Date($scope.modalData.depatureDate)
                }
                if ($scope.modalData.arrivalDate) {
                    $scope.modalData.arrivalDate = new Date($scope.modalData.arrivalDate)
                }
                if ($scope.modalData.lodgingBoardingDate) {
                    $scope.modalData.lodgingBoardingDate = new Date($scope.modalData.lodgingBoardingDate)
                }
                if ($scope.modalData.pocketExpenseDate) {
                    $scope.modalData.pocketExpenseDate = new Date($scope.modalData.pocketExpenseDate)
                }
                $scope.modalIndex = index;
            } else {
                $scope.modalData = {};
                if (current.length > 0) {}
                $scope.modalIndex = "";
            }
            $scope.holdObject = holdobj;
            console.log($scope.holdObject);
            var modalInstance = $uibModal.open({
                scope: $scope,
                templateUrl: '/frontend/views/modal/' + filename + '.html',
                size: 'lg'
            });
        };
        $scope.addElements = function (moddata) {
            console.log("moddata", moddata);
            if ($scope.modalIndex !== "") {
                switch ($scope.holdObject) {
                    case "Expense":
                        {
                            $scope.formData.expense[$scope.modalIndex] = moddata;
                        }
                        break;
                    case "Travel Expense":
                        {
                            $scope.formData.travelExpense[$scope.modalIndex] = moddata;
                        }
                        break;
                    case "Lodging Boarding":
                        {
                            $scope.formData.lodgingBoarding[$scope.modalIndex] = moddata;
                        }
                        break;
                    case "Pocket Expense":
                        {
                            $scope.formData.pocketExpense[$scope.modalIndex] = moddata;
                        }
                        break;

                    default:
                        {
                            // $scope.formData.push($scope.newjson);
                        }

                }
            } else {
                switch ($scope.holdObject) {
                    case "Expense":
                        {
                            $scope.formData.expense.push(moddata);
                        }
                        break;
                    case "Travel Expense":
                        {
                            $scope.formData.travelExpense.push(moddata);
                        }
                        break;
                    case "Lodging Boarding":
                        {
                            $scope.formData.lodgingBoarding.push(moddata);
                        }
                        break;
                    case "Pocket Expense":
                        {
                            $scope.formData.pocketExpense.push(moddata);
                        }
                        break;

                    default:
                        {
                            // $scope.formData.push($scope.newjson);
                        }
                }

            }
        };
        $scope.deleteElements = function (index, data) {
            data.splice(index, 1);
        };

        NavigationService.getOneModel("Reimbursement", $stateParams.id, function (data) {
            $scope.formData = data.data;
            console.log("$scope.formData", $scope.formData);
            if (data.data.name) {
                $scope.formData.name = data.data.name._id;
                $scope.formData.assignment = data.data.assignment._id;
            }
            if (data.data.from) {
                $scope.formData.from = new Date(data.data.from);
            }
            if (data.data.to) {
                $scope.formData.to = new Date(data.data.to);
            }
            if (data.data.fromDate) {
                $scope.formData.fromDate = new Date(data.data.fromDate);
            }
            if (data.data.toDate) {
                $scope.formData.toDate = new Date(data.data.toDate);
            }
            if (data.data.approvedFrom) {
                $scope.formData.approvedFrom = new Date(data.data.approvedFrom);
            }
            if (data.data.approvedTo) {
                $scope.formData.approvedTo = new Date(data.data.approvedTo);
            }
            // $scope.formData.name = $scope.formData.companyShortName + '-' + $scope.formData.TOFShortName + '-' + $scope.formData.officeCode + '-' + $scope.formData.city1;
        });

        $scope.cancel = function () {
            $window.history.back();
        }
        hotkeys.bindTo($scope).add({
            combo: 'ctrl+enter',
            callback: function (formData) {
                NavigationService.modelSave("Reimbursement", $scope.formData, function (data) {
                    if (data.value === true) {
                        console.log("Data In Else", data.value);
                        // $state.go('reimbursement-list');
                        $window.history.back();
                        toastr.success("Reimbursement Of created successfully.", "Reimbursement" + " Created");
                    } else {
                        console.log("Data In Else", data.value);
                        toastr.error("Reimbursement Of creation failed.", "Reimbursement" + " creation error");
                    }
                });
            }
        });
        $scope.saveModel = function (formData) {
            console.log(formData);
            // $scope.formData.name = $scope.formData.firstName + " " + $scope.formData.lastName;

            NavigationService.modelSave("Reimbursement", $scope.formData, function (data) {
                if (data.value === true) {
                    console.log("Data In Else", data.value);
                    // $state.go('reimbursement-list');
                    $window.history.back();
                    toastr.success("Reimbursement created successfully.", "Reimbursement" + " Created");
                } else {
                    console.log("Data In Else", data.value);
                    toastr.error("Reimbursement creation failed.", "Reimbursement" + " creation error");
                }
            });
        };
    })


    .controller('EditLeaveCtrl', function ($scope, hotkeys, $window, TemplateService, NavigationService, $timeout, $state, $uibModal, $stateParams, toastr, $filter) {
        //Used to name the .html file
        $scope.template = TemplateService.changecontent("leaveManagement-detail");
        $scope.menutitle = NavigationService.makeactive("LeaveManagement");
        TemplateService.title = $scope.menutitle;
        $scope.navigation = NavigationService.getnav();
        $scope.formData = {};

        $scope.header = {
            "name": "Edit Leave"
        };
        $scope.userStatus = [{
            "name": "Active",
            "value": true
        }, {
            "name": "Inactive",
            "value": false
        }];
        $scope.status = ["Approved", "Pending", "Rejected", "Partially Approved"];
        $scope.dateOptions = {
            showWeeks: true
        };


        $scope.format = 'dd-MMMM-yyyy';
        $scope.modalData = {};
        $scope.holdObject = '';
        $scope.modalIndex = 0;

        $scope.changeDOB = function (date) {
            console.log($filter('ageFilter')(date));
        };
        $scope.minDate = new Date();
        $scope.addModal = function (filename, index, holdobj, data, current) {
            if (index !== "") {
                $scope.modalData = data;
                $scope.modalIndex = index;
                $scope.modalData.from = new Date(data.from);
                $scope.modalData.to = new Date(data.to);
            } else {
                $scope.modalData = {};
                if (current.length > 0) {
                    $scope.modalData.from = new Date(current[current.length - 1].to);
                    $scope.modalData.grade = current[current.length - 1].grade;
                }
                $scope.modalIndex = "";
            }
            $scope.holdObject = holdobj;
            console.log($scope.holdObject);
            var modalInstance = $uibModal.open({
                scope: $scope,
                templateUrl: '/frontend/views/modal/' + filename + '.html',
                size: 'lg'
            });
        };

        NavigationService.getOneModel("LeaveManagement", $stateParams.id, function (data) {
            $scope.formData = data.data;
            console.log("$scope.formData", $scope.formData);
            if (data.data.name) {
                $scope.formData.name = data.data.name._id;
                console.log("$scope.formData.fromDate", $scope.formData.fromDate);
            }
            if (data.data.fromDate) {
                $scope.formData.fromDate = new Date(data.data.fromDate);
            }
            if (data.data.toDate) {
                $scope.formData.toDate = new Date(data.data.toDate);
            }
            if (data.data.approvedFrom) {
                $scope.formData.approvedFrom = new Date(data.data.approvedFrom);
            }
            if (data.data.approvedTo) {
                $scope.formData.approvedTo = new Date(data.data.approvedTo);
            }
            // $scope.formData.name = $scope.formData.companyShortName + '-' + $scope.formData.TOFShortName + '-' + $scope.formData.officeCode + '-' + $scope.formData.city1;
        });
        $scope.cancel = function () {
            $window.history.back();
        }
        hotkeys.bindTo($scope).add({
            combo: 'ctrl+enter',
            callback: function (formData) {
                NavigationService.modelSave("LeaveManagement", $scope.formData, function (data) {
                    if (data.value === true) {
                        console.log("Data In Else", data.value);
                        // $state.go('leaveManagement-list');
                        $window.history.back();
                        toastr.success("Leave Of " + " " + formData.name + " created successfully.", "Leave" + " Created");
                    } else {
                        console.log("Data In Else", data.value);
                        toastr.error("Leave Of " + " creation failed.", "Leave" + " creation error");
                    }
                });
            }
        });
        $scope.saveModel = function (formData) {
            console.log(formData);
            // $scope.formData.name = $scope.formData.firstName + " " + $scope.formData.lastName;
            NavigationService.modelSave("LeaveManagement", $scope.formData, function (data) {
                if (data.value === true) {
                    console.log("Data In Else", data.value);
                    // $state.go('leaveManagement-list');
                    $window.history.back();
                    toastr.success("Leave Of " + " " + formData.name + " created successfully.", "Leave" + " Created");
                } else {
                    console.log("Data In Else", data.value);
                    toastr.error("Leave Of " + " creation failed.", "Leave" + " creation error");
                }
            });
        };
    })

    .controller('CreateEmployeeCtrl', function ($scope, hotkeys, $window, TemplateService, NavigationService, $timeout, $state, $uibModal, $stateParams, toastr, $filter) {
        //Used to name the .html file
        $scope.template = TemplateService.changecontent("employee-detail");
        $scope.menutitle = NavigationService.makeactive("Employee");
        TemplateService.title = $scope.menutitle;
        $scope.navigation = NavigationService.getnav();
        $scope.formData = {};
        $scope.formData.personalDocument = [];
        $scope.formData.licenseDocument = [];
        $scope.formData.IIISLACertificate = [];
        $scope.formData.IIISLAReciept = [];
        $scope.formData.CTCDetails = [];
        $scope.header = {
            "name": "Create Employee"
        };
        $scope.userStatus = [{
            "name": "Active",
            "value": true
        }, {
            "name": "Inactive",
            "value": false
        }];
        $scope.cancel = function () {
            $window.history.back();
        }
        $scope.salutations = ["Mr.", "Mrs.", "Ms.", "Dr."];
        $scope.houseColors = ["Red", "Green", "Blue", "Yellow", "White"];

        $scope.dateOptions = {
            showWeeks: true
        };

        $scope.popup = {
            to: false,
            from: false,
            toReciept: false,
            fromReciept: false,
            toCertificate: false,
            fromCertificate: false,
            toLicense: false,
            fromLicense: false,
            birthDate: false,
            marriageDate: false,
            joiningDate: false,
            leavingDate: false
        };

        $scope.format = 'dd-MMMM-yyyy';
        $scope.modalData = {};
        $scope.holdObject = '';
        $scope.modalIndex = 0;

        $scope.changeDOB = function (date) {
            console.log($filter('ageFilter')(date));
        };
        $scope.minDate = new Date();
        $scope.addModal = function (filename, index, holdobj, data, current) {
            if (index !== "") {
                $scope.modalData = data;
                $scope.modalIndex = index;
                $scope.modalData.from = new Date(data.from);
                $scope.modalData.to = new Date(data.to);
            } else {
                $scope.modalData = {};
                if (current.length > 0) {
                    $scope.modalData.from = new Date(current[current.length - 1].to);
                    $scope.modalData.grade = current[current.length - 1].grade;
                }
                $scope.modalIndex = "";
            }
            $scope.holdObject = holdobj;
            console.log($scope.holdObject);
            var modalInstance = $uibModal.open({
                scope: $scope,
                templateUrl: '/frontend/views/modal/' + filename + '.html',
                size: 'lg'
            });
        };
        $scope.refreshNature = function (data) {
            var formdata = {};
            formdata.keyword = data;
            NavigationService.searchBranch(formdata, 1, function (data) {
                console.log("searchBranch", data);
                $scope.natureLoss = data.data.results;
            });
        };
        $scope.refreshNatureRole = function (data) {
            var formdata = {};
            formdata.keyword = data;
            NavigationService.searchRole(formdata, 1, function (data) {
                console.log("searchBranch....", data);
                $scope.roleList = data.data.results;
            });
        };
        $scope.addElements = function (data) {
            console.log(data);
            console.log($scope.holdObject);
            switch ($scope.holdObject) {
                case 'personalDocument':
                    if ($scope.modalIndex !== "") {
                        $scope.formData.personalDocument[$scope.modal] = data;
                    } else {
                        $scope.formData.personalDocument.push(data);
                    }
                    break;
                case 'licenseDocument':
                    if ($scope.modalIndex !== "") {
                        $scope.formData.licenseDocument[$scope.modal] = data;
                    } else {
                        $scope.formData.licenseDocument.push(data);
                    }
                    break;
                case 'IIISLACertificate':
                    if ($scope.modalIndex !== "") {
                        $scope.formData.IIISLACertificate[$scope.modal] = data;
                    } else {
                        $scope.formData.IIISLACertificate.push(data);
                    }
                    break;
                case 'IIISLAReciept':
                    if ($scope.modalIndex !== "") {
                        $scope.formData.IIISLAReciept[$scope.modal] = data;
                    } else {
                        $scope.formData.IIISLAReciept.push(data);
                    }
                    break;
                case 'CTCDetails':
                    if ($scope.modalIndex !== "") {
                        console.log("Model Data if", $scope.formData.grade);
                        $scope.formData.CTCDetails[$scope.modal] = data;
                        $scope.formData.grade = data.grade;
                        // console.log("Model Data if",$scope.formData.grade);                       
                        // $scope.refreshGrade($scope.formData.grade);
                        // $scope.formData.grade = $scope.formData.CTCDetails[$scope.formData.CTCDetails.length - 1].grade;
                    } else {
                        console.log("Model Data else", $scope.formData);
                        var length1 = $scope.formData.CTCDetails.length;
                        console.log("Length1", length1);
                        if (length1 !== 0) {
                            $scope.formData.CTCDetails[length1 - 1].to = data.from;
                            console.log("ABC", $scope.formData.CTCDetails[length1 - 1].to);
                        }
                        $scope.formData.CTCDetails.push(data);
                        // $scope.formData.grade = $scope.formData.CTCDetails[$scope.formData.CTCDetails.length - 1].grade;
                        $scope.formData.grade = data.grade;
                    }
                    break;
                default:

            }
        };
        $scope.editElements = function (elemObject, data) {

        };
        $scope.deleteElements = function (index, name) {
            switch (name) {
                case 'personalDocument':
                    $scope.formData.personalDocument.splice(index, 1);
                    break;
                case 'licenseDocument':
                    $scope.formData.licenseDocument.splice(index, 1);
                    break;
                case 'IIISLACertificate':
                    $scope.formData.IIISLACertificate.splice(index, 1);
                    break;
                case 'IIISLAReciept':
                    $scope.formData.IIISLAReciept.splice(index, 1);
                    break;
                case 'CTCDetails':
                    $scope.formData.CTCDetails.splice(index, 1);
                    break;
                default:

            }
        };

        $scope.cancel = function () {
            $window.history.back();
        }
        hotkeys.bindTo($scope).add({
            combo: 'ctrl+enter',
            callback: function (formData) {
                if (formData.lat && formData.lng) {
                    formData.location = [];
                    formData.location.push(formData.lat);
                    formData.location.push(formData.lng);
                }
                $scope.formData.name = $scope.formData.firstName + " " + $scope.formData.lastName;
                NavigationService.modelSave("Employee", $scope.formData, function (data) {
                    if (data.value === true) {
                        // $state.go('employee-list');
                        $window.history.back();
                        toastr.success("Employee" + " " + formData.name + " created successfully.", "Employee" + " Created");
                    } else {
                        toastr.error("Employee" + " creation failed.", "Employee" + " creation error");
                    }
                });
            }
        });
        $scope.saveModel = function (formData) {
            if (formData.lat && formData.lng) {
                formData.location = [];
                formData.location.push(formData.lat);
                formData.location.push(formData.lng);
            }
            console.log(formData);
            $scope.formData.name = $scope.formData.firstName + " " + $scope.formData.lastName;
            NavigationService.modelSave("Employee", $scope.formData, function (data) {
                if (data.value === true) {
                    // $state.go('employee-list');
                    $window.history.back();
                    toastr.success("Employee" + " " + formData.name + " created successfully.", "Employee" + " Created");
                } else {
                    toastr.error("Employee" + " creation failed.", "Employee" + " creation error");
                }
            });
        };
    })
    .controller('EditEmployeeCtrl', function ($scope, hotkeys, $window, TemplateService, NavigationService, $timeout, $state, $stateParams, $filter, $uibModal, toastr) {
        //Used to name the .html file
        $scope.template = TemplateService.changecontent("employee-detail");
        $scope.menutitle = NavigationService.makeactive("Employee");
        TemplateService.title = $scope.menutitle;
        $scope.navigation = NavigationService.getnav();
        $scope.formData = {};
        $scope.formData.personalDocument = [];
        $scope.formData.licenseDocument = [];
        $scope.formData.IIISLACertificate = [];
        $scope.formData.IIISLAReciept = [];
        $scope.formData.CTCDetails = [];
        $scope.uploadMsg = "";
        $scope.modalData = {};
        $scope.uploadurl = imgpath;
        console.log($scope.uploadurl);
        $scope.header = {
            "name": "Edit Employee"
        };
        $scope.userStatus = [{
            "name": "Active",
            "value": true
        }, {
            "name": "Inactive",
            "value": false
        }];

        $scope.salutations = ["Mr.", "Mrs.", "Ms.", "Dr."];
        $scope.houseColors = ["Red", "Green", "Blue", "Yellow", "White"];

        $scope.dateOptions = {
            showWeeks: true
        };

        $scope.popup = {
            to: false,
            from: false,
            toReciept: false,
            fromReciept: false,
            toCertificate: false,
            fromCertificate: false,
            toLicense: false,
            fromLicense: false,
            birthDate: false,
            marriageDate: false,
            joiningDate: false,
            leavingDate: false
        };

        $scope.format = 'dd-MMMM-yyyy';
        $scope.modalData = {};
        $scope.modalData1 = {};
        $scope.holdObject = '';
        $scope.modalIndex = 0;

        $scope.changeDOB = function (date) {
            console.log($filter('ageFilter')(date));
        };


        $scope.refreshNature = function (data) {
            var formdata = {};
            formdata.keyword = data;
            NavigationService.searchBranch(formdata, 1, function (data) {
                console.log("searchBranch", data);
                $scope.natureLoss = data.data.results;
            });
        };
        $scope.refreshNatureRole = function (data) {
            var formdata = {};
            formdata.keyword = data;
            NavigationService.searchRole(formdata, 1, function (data) {
                console.log("searchBranch....", data);
                $scope.roleList = data.data.results;
            });
        };

        $scope.refreshGrade = function (data) {
            // var formdata = {};
            // formdata.keyword = data;
            NavigationService.getOneModel("Grade", data, function (data) {
                console.log("searchGrade", data);
                $scope.formData.grade = data.data;
            });
        };
        $scope.addModal = function (filename, index, holdobj, data, current) {
            console.log("formData.grade", $scope.formData.grade);
            if (index !== "") {

                $scope.modalData = data;
                $scope.modalData.from = new Date(data.from);
                $scope.modalData.to = new Date(data.to);

                $scope.modalIndex = index;
            } else {
                $scope.modalData = {};
                console.log(moment());
                if (current.length > 0) {
                    $scope.modalData.from = new Date(current[current.length - 1].to);
                    $scope.modalData.from = $scope.modalData.from.setDate($scope.modalData.from.getDate() + 1);
                    $scope.modalData.grade = current[current.length - 1].grade;
                }
                $scope.modalIndex = "";
            }
            $scope.holdObject = holdobj;
            var modalInstance = $uibModal.open({
                scope: $scope,
                templateUrl: '/frontend/views/modal/' + filename + '.html',
                size: 'lg'
            });
        };

        $scope.addElements = function (data) {
            switch ($scope.holdObject) {
                case 'personalDocument':
                    if ($scope.modalIndex !== "") {
                        $scope.formData.personalDocument[$scope.modal] = data;
                    } else {
                        $scope.formData.personalDocument.push(data);
                    }
                    break;
                case 'licenseDocument':
                    if ($scope.modalIndex !== "") {
                        $scope.formData.licenseDocument[$scope.modal] = data;
                    } else {
                        $scope.formData.licenseDocument.push(data);
                    }
                    break;
                case 'IIISLACertificate':
                    if ($scope.modalIndex !== "") {
                        $scope.formData.IIISLACertificate[$scope.modal] = data;
                    } else {
                        $scope.formData.IIISLACertificate.push(data);
                    }
                    break;
                case 'IIISLAReciept':
                    if ($scope.modalIndex !== "") {
                        $scope.formData.IIISLAReciept[$scope.modal] = data;
                    } else {
                        $scope.formData.IIISLAReciept.push(data);
                    }
                    break;
                case 'CTCDetails':
                    if ($scope.modalIndex !== "") {
                        console.log("Model Data if", $scope.formData.grade);
                        $scope.formData.CTCDetails[$scope.modal] = data;
                        $scope.formData.grade = data.grade;
                        // console.log("Model Data if",$scope.formData.grade);                       
                        $scope.refreshGrade($scope.formData.grade);
                        // $scope.formData.grade = $scope.formData.CTCDetails[$scope.formData.CTCDetails.length - 1].grade;
                    } else {
                        console.log("Model Data else", $scope.formData);
                        var length1 = $scope.formData.CTCDetails.length;
                        console.log("Length1", length1);
                        if (length1 !== 0) {
                            $scope.formData.CTCDetails[length1 - 1].to = data.from;
                            console.log("ABC", $scope.formData.CTCDetails[length1 - 1].to);
                        }
                        $scope.formData.CTCDetails.push(data);
                        // $scope.formData.grade = $scope.formData.CTCDetails[$scope.formData.CTCDetails.length - 1].grade;
                        $scope.formData.grade = data.grade;
                    }
                    break;
                default:

            }
        };
        $scope.editElements = function (elemObject, data) {

        };

        $scope.deleteElements = function (index, name) {
            switch (name) {
                case 'personalDocument':
                    $scope.formData.personalDocument.splice(index, 1);
                    break;
                case 'licenseDocument':
                    $scope.formData.licenseDocument.splice(index, 1);
                    break;
                case 'IIISLACertificate':
                    $scope.formData.IIISLACertificate.splice(index, 1);
                    break;
                case 'IIISLAReciept':
                    $scope.formData.IIISLAReciept.splice(index, 1);
                    break;
                case 'CTCDetails':
                    $scope.formData.CTCDetails.splice(index, 1);
                    break;
                default:

            }
        };


        NavigationService.getOneModel("Employee", $stateParams.id, function (data) {
            $scope.formData = data.data;
            // if (data.data.city) {
            //     $scope.formData.country = data.data.city.district.state.zone.country._id;
            //     $scope.formData.zone = data.data.city.district.state.zone._id;
            //     $scope.formData.state = data.data.city.district.state._id;
            //     $scope.formData.district = data.data.city.district._id;
            //     $scope.formData.city = data.data.city._id;
            // }
            NavigationService.getDepartment(function (data1) {
                $scope.departments = data1.data.results;
            });
            if (data.data.birthDate) {
                $scope.formData.birthDate = new Date(data.data.birthDate);
            }
            if (data.data.joiningDate) {
                $scope.formData.joiningDate = new Date(data.data.joiningDate);
            }
            if (data.data.marriageDate) {
                $scope.formData.marriageDate = new Date(data.data.marriageDate);
            }
            if (data.data.leavingDate) {
                $scope.formData.leavingDate = new Date(data.data.leavingDate);
            }
        });
        $scope.cancel = function () {
            $window.history.back();
        }
        hotkeys.bindTo($scope).add({
            combo: 'ctrl+enter',
            callback: function (formData) {
                if (formData.lat && formData.lng) {
                    formData.location = [];
                    formData.location.push(formData.lat);
                    formData.location.push(formData.lng);
                }
                $scope.formData.name = $scope.formData.firstName + " " + $scope.formData.lastName;
                console.log($scope.formData);
                NavigationService.modelSave("Employee", $scope.formData, function (data) {
                    if (data.value === true) {
                        // $state.go('employee-list');
                        $window.history.back();
                        toastr.success("Employee" + $scope.formData.name + " edited successfully.", "Employee" + " Edited");
                    } else {
                        toastr.error("Employee" + " edition failed.", "Employee" + " editing error");
                    }
                });
            }
        });
        $scope.saveModel = function (formData) {
            if (formData.lat && formData.lng) {
                formData.location = [];
                formData.location.push(formData.lat);
                formData.location.push(formData.lng);
            }
            $scope.formData.name = $scope.formData.firstName + " " + $scope.formData.lastName;
            NavigationService.modelSave("Employee", $scope.formData, function (data) {
                if (data.value === true) {
                    // $state.go('employee-list');
                    $window.history.back();
                    toastr.success("Employee" + $scope.formData.name + " edited successfully.", "Employee" + " Edited");
                } else {
                    toastr.error("Employee" + " edition failed.", "Employee" + " editing error");
                }
            });
        };
    })

    .controller('ProductCtrl', function ($scope, $window, TemplateService, NavigationService, $timeout, $state, $stateParams, toastr) {
        //Used to name the .html file
        $scope.template = TemplateService.changecontent("product-list", $state);
        $scope.menutitle = NavigationService.makeactive("Product");
        TemplateService.title = $scope.menutitle;
        $scope.navigation = NavigationService.getnav();
        $scope.currentPage = $stateParams.page;
        var i = 0;
        $scope.search = {
            keyword: ""
        };
        if ($stateParams.keyword) {
            $scope.search.keyword = $stateParams.keyword;
        }
        $scope.showAllCountries = function (keywordChange) {
            $scope.totalItems = undefined;
            if (keywordChange) {
                $scope.currentPage = 1;
            }
            NavigationService.searchProduct({
                page: $scope.currentPage,
                keyword: $scope.search.keyword
            }, ++i, function (data, ini) {
                if (ini == i) {
                    $scope.allProduct = data.data.results;
                    $scope.totalItems = data.data.total;
                    $scope.maxRow = data.data.options.count;
                }
            });
        };
        $scope.cancel = function () {
            $window.history.back();
        };
        $scope.changePage = function (page) {
            var goTo = "product-list";
            if ($scope.search.keyword) {
                goTo = "product-list";
            }
            $state.go(goTo, {
                page: page,
                keyword: $scope.search.keyword
            });
        };
        $scope.showAllCountries();
        $scope.deleteProduct = function (id) {
            globalfunction.confDel(function (value) {
                console.log(value);
                if (value) {
                    NavigationService.deleteProduct(id, function (data) {
                        if (data.value) {
                            $scope.showAllCountries();
                            toastr.success("Product deleted successfully.", "Product deleted");
                        } else {
                            toastr.error("There was an error while deleting Product", "Product deleting error");
                        }
                    });
                }
            });
        };
    })
    .controller('CreateProductCtrl', function ($scope, hotkeys, $window, TemplateService, NavigationService, $timeout, $state, toastr) {
        //Used to name the .html file
        $scope.template = TemplateService.changecontent("product-detail");
        $scope.menutitle = NavigationService.makeactive("Product");
        TemplateService.title = $scope.menutitle;
        $scope.navigation = NavigationService.getnav();
        $scope.header = {
            "name": "Create Product"
        };
        $scope.userStatus = [{
            "name": "Active",
            "value": true
        }, {
            "name": "Inactive",
            "value": false
        }];
        $scope.formData = {};
        $scope.cancel = function () {
            $window.history.back();
        };
        hotkeys.bindTo($scope).add({
            combo: 'ctrl+enter',
            callback: function (formData) {
                NavigationService.productSave($scope.formData, function (data) {
                    if (data.value === true) {
                        // $state.go('product-list');
                        $window.history.back();
                        toastr.success("Product " + formData.name + " created successfully.", "Product Created");
                    } else {
                        toastr.error("Product creation failed.", "Product creation error");
                    }
                });
            }
        });
        $scope.saveProduct = function (formData) {
            NavigationService.productSave($scope.formData, function (data) {
                if (data.value === true) {
                    // $state.go('product-list');
                    $window.history.back();
                    toastr.success("Product " + formData.name + " created successfully.", "Product Created");
                } else {
                    toastr.error("Product creation failed.", "Product creation error");
                }
            });
        };

    })
    .controller('EditProductCtrl', function ($scope, hotkeys, $window, TemplateService, NavigationService, $timeout, $state, $stateParams, toastr) {
        //Used to name the .html file
        $scope.template = TemplateService.changecontent("product-detail");
        $scope.menutitle = NavigationService.makeactive("Product");
        TemplateService.title = $scope.menutitle;
        $scope.navigation = NavigationService.getnav();
        $scope.header = {
            "name": "Edit Product "
        };
        $scope.userStatus = [{
            "name": "Active",
            "value": true
        }, {
            "name": "Inactive",
            "value": false
        }];
        NavigationService.getOneProduct($stateParams.id, function (data) {
            $scope.formData = data.data;
            $scope.formData.industry = data.data.category.industry._id;
            $scope.formData.category = data.data.category._id;

        });
        $scope.cancel = function () {
            $window.history.back();
        };
        hotkeys.bindTo($scope).add({
            combo: 'ctrl+enter',
            callback: function (formData) {
                NavigationService.productSave($scope.formData, function (data) {
                    if (data.value === true) {
                        $window.history.back();
                        toastr.success("Product " + $scope.formData.name + " edited successfully.", "Product Edited");
                    } else {
                        toastr.error("Product edition failed.", "Product editing error");
                    }
                });
            }
        });
        $scope.saveProduct = function (formValid) {
            NavigationService.productSave($scope.formData, function (data) {
                if (data.value === true) {
                    $window.history.back();
                    toastr.success("Product " + $scope.formData.name + " edited successfully.", "Product Edited");
                } else {
                    toastr.error("Product edition failed.", "Product editing error");
                }
            });
        };
    })
    .controller('SalvageCtrl', function ($scope, $window, TemplateService, NavigationService, $timeout, $state) {
        //Used to name the .html file
        $scope.template = TemplateService.changecontent("salvage-list");
        $scope.menutitle = NavigationService.makeactive("Salvage");
        TemplateService.title = $scope.menutitle;

        $scope.navigation = NavigationService.getnav();

        $scope.showAllSalvage = function () {
            NavigationService.getAllSalvage(function (data) {
                $scope.allSalvage = data.data;
                console.log('$scope.allSalvage', $scope.allSalvage);

            });
        };
        $scope.showAllSalvage();

        $scope.deleteSalvage = function (id) {

            NavigationService.deleteSalvage({
                id: id
            }, function (data) {
                $scope.showAllSalvage();

            });
        };
    })
    .controller('CreateSalvageCtrl', function ($scope, hotkeys, $window, TemplateService, NavigationService, $timeout, $state) {
        //Used to name the .html file
        $scope.template = TemplateService.changecontent("salvage-detail");
        $scope.menutitle = NavigationService.makeactive("Salvage");
        TemplateService.title = $scope.menutitle;
        $scope.navigation = NavigationService.getnav();
        $scope.header = {
            "name": "Edit Salvage "
        };
        $scope.userStatus = [{
            "name": "Active",
            "value": true
        }, {
            "name": "Inactive",
            "value": false
        }];
        $scope.formData = {};
        $scope.cancel = function () {
            $window.history.back();
        };
        hotkeys.bindTo($scope).add({
            combo: 'ctrl+enter',
            callback: function (formData) {
                NavigationService.salvageSave($scope.formData, function (data) {
                    if (data.value === true) {
                        // $state.go('salvage-list');
                        $window.history.back();
                    }

                });
            }
        });
        $scope.saveSalvage = function (formData) {
            NavigationService.salvageSave($scope.formData, function (data) {
                if (data.value === true) {
                    // $state.go('salvage-list');
                    $window.history.back();
                }

            });
        };
    })
    .controller('EditSalvageCtrl', function ($scope, hotkeys, $window, TemplateService, NavigationService, $timeout, $state, $stateParams) {
        //Used to name the .html file
        $scope.template = TemplateService.changecontent("salvage-detail");
        $scope.menutitle = NavigationService.makeactive("Salvage");
        TemplateService.title = $scope.menutitle;
        $scope.navigation = NavigationService.getnav();
        $scope.userStatus = [{
            "name": "Active",
            "value": true
        }, {
            "name": "Inactive",
            "value": false
        }];

        NavigationService.getOneSalvage($stateParams.id, function (data) {
            $scope.formData = data.data;
            console.log(data.data);

        });
        $scope.cancel = function () {
            $window.history.back();
        };
        hotkeys.bindTo($scope).add({
            combo: 'ctrl+enter',
            callback: function (formData) {
                NavigationService.salvageEditSave($scope.formData, function (data) {
                    if (data.value === true) {
                        // $state.go('salvage-list');
                        $window.history.back();
                    }
                });
            }
        });
        $scope.saveSalvage = function (formValid) {
            NavigationService.salvageEditSave($scope.formData, function (data) {
                if (data.value === true) {
                    // $state.go('salvage-list');
                    $window.history.back();
                }
            });
        };
    })
    .controller('BankMasterCtrl', function ($scope, $window, TemplateService, NavigationService, $timeout, $state, $stateParams, toastr) {
        //Used to name the .html file
        $scope.template = TemplateService.changecontent("bankmaster-list", $state);
        $scope.menutitle = NavigationService.makeactive("Bank List");
        TemplateService.title = $scope.menutitle;
        $scope.navigation = NavigationService.getnav();
        $scope.currentPage = $stateParams.page;
        var i = 0;
        $scope.search = {
            keyword: ""
        };
        if ($stateParams.keyword) {
            $scope.search.keyword = $stateParams.keyword;
        }
        $scope.showAllCountries = function (keywordChange) {
            $scope.totalItems = undefined;
            if (keywordChange) {
                $scope.currentPage = 1;
            }
            NavigationService.searchBank({
                page: $scope.currentPage,
                keyword: $scope.search.keyword
            }, ++i, function (data, ini) {
                console.log(data.data);

                if (ini == i) {
                    console.log(data.data);
                    $scope.allBank = data.data.results;
                    $scope.totalItems = data.data.total;
                    $scope.maxRow = data.data.options.count;
                }
            });
        };
        $scope.cancel = function () {
            $window.history.back();
        };
        $scope.changePage = function (page) {
            var goTo = "bankMaster-list";
            if ($scope.search.keyword) {
                goTo = "bankMaster-list";
            }
            $state.go(goTo, {
                page: page,
                keyword: $scope.search.keyword
            });
        };
        $scope.showAllCountries();

        $scope.deleteBank = function (id) {
            globalfunction.confDel(function (value) {
                if (value) {
                    NavigationService.deleteBank(id, function (data) {
                        if (data.value) {
                            $scope.showAllCountries();
                            toastr.success("Bank deleted successfully.", "Bank deleted");
                        } else {
                            toastr.error("There was an error while deleting Bank", "Bank deleting error");
                        }


                    });
                }
            });
        };
        $scope.changeStatus = function (ind) {
            NavigationService.bankSave(ind, function (data) {
                if (data.value === true) {}
            });
        };
    })
    .controller('CreateBankmasterCtrl', function ($scope, hotkeys, $window, TemplateService, NavigationService, $timeout, $state, toastr) {
        //Used to name the .html file
        $scope.template = TemplateService.changecontent("bankMaster-detail");
        $scope.menutitle = NavigationService.makeactive("Create Bank");
        TemplateService.title = $scope.menutitle;
        $scope.navigation = NavigationService.getnav();
        $scope.formData = {};
        $scope.userStatus = [{
            "name": "Active",
            "value": true
        }, {
            "name": "Inactive",
            "value": false
        }];
        $scope.header = {
            "name": "Create Bank Master"
        };
        $scope.cancel = function () {
            $window.history.back();
        };
        hotkeys.bindTo($scope).add({
            combo: 'ctrl+enter',
            callback: function (formData) {
                NavigationService.bankSave($scope.formData, function (data) {
                    if (data.value === true) {
                        // $state.go('bankMaster-list');
                        $window.history.back();
                        toastr.success("Bank " + $scope.formData.name + " created successfully.", "Bank Created");
                    } else {
                        toastr.error("Bank creation failed.", "Bank creation error");
                    }
                });
            }
        });
        $scope.saveBank = function (formData) {
            NavigationService.bankSave($scope.formData, function (data) {
                if (data.value === true) {
                    // $state.go('bankMaster-list');
                    $window.history.back();
                    toastr.success("Bank " + $scope.formData.name + " created successfully.", "Bank Created");
                } else {
                    toastr.error("Bank creation failed.", "Bank creation error");
                }
            });
        };
    })
    .controller('EditBankmasterCtrl', function ($scope, hotkeys, $window, TemplateService, NavigationService, $timeout, $state, $stateParams, toastr) {
        //Used to name the .html file
        $scope.template = TemplateService.changecontent("bankMaster-detail");
        $scope.menutitle = NavigationService.makeactive("Edit Bank");
        TemplateService.title = $scope.menutitle;
        $scope.navigation = NavigationService.getnav();
        $scope.userStatus = [{
            "name": "Active",
            "value": true
        }, {
            "name": "Inactive",
            "value": false
        }];
        $scope.header = {
            "name": "Edit Bank Master"
        };
        NavigationService.getOneBank($stateParams.id, function (data) {
            $scope.formData = data.data;
            console.log(data.data);

        });
        $scope.cancel = function () {
            $window.history.back();
        };
        hotkeys.bindTo($scope).add({
            combo: 'ctrl+enter',
            callback: function (formData) {
                NavigationService.bankSave($scope.formData, function (data) {
                    if (data.value === true) {
                        // $state.go('bankMaster-list');
                        $window.history.back();
                        toastr.success("Bank " + $scope.formData.name + " created successfully.", "Bank Created");
                    } else {
                        toastr.error("Bank creation failed.", "Bank creation error");
                    }
                });
            }
        });
        $scope.saveBank = function (formValid) {
            NavigationService.bankSave($scope.formData, function (data) {
                if (data.value === true) {
                    // $state.go('bankMaster-list');
                    $window.history.back();
                    toastr.success("Bank " + $scope.formData.name + " created successfully.", "Bank Created");
                } else {
                    toastr.error("Bank creation failed.", "Bank creation error");
                }
            });
        };
    })
    .controller('CreateContactManagementCtrl', function ($scope, $window, TemplateService, NavigationService, $timeout, $state) {
        //Used to name the .html file
        $scope.template = TemplateService.changecontent("contactManagement-detail");
        $scope.menutitle = NavigationService.makeactive("Contact Management");
        TemplateService.title = $scope.menutitle;
        $scope.navigation = NavigationService.getnav();
        $scope.cancel = function () {
            $window.history.back();
        };
    })
    .controller('ContactManagementCtrl', function ($scope, $window, TemplateService, NavigationService, $timeout, $state) {
        //Used to name the .html file
        $scope.template = TemplateService.changecontent("contactManagement-list");
        $scope.menutitle = NavigationService.makeactive("Contact Management List");
        TemplateService.title = $scope.menutitle;
        $scope.navigation = NavigationService.getnav();
        $scope.cancel = function () {
            $window.history.back();
        };
    })
    .controller('CreateContactTypeCtrl', function ($scope, $window, TemplateService, NavigationService, $timeout, $state) {
        //Used to name the .html file
        $scope.template = TemplateService.changecontent("contactType-detail");
        $scope.menutitle = NavigationService.makeactive("Contact Type");
        TemplateService.title = $scope.menutitle;
        $scope.navigation = NavigationService.getnav();
        $scope.cancel = function () {
            $window.history.back();
        };
    })
    .controller('ContactTypeCtrl', function ($scope, $window, TemplateService, NavigationService, $timeout, $state) {
        //Used to name the .html file
        $scope.template = TemplateService.changecontent("contactType-list");
        $scope.menutitle = NavigationService.makeactive("Contact Type List");
        TemplateService.title = $scope.menutitle;
        $scope.navigation = NavigationService.getnav();
        $scope.cancel = function () {
            $window.history.back();
        };
    })
    .controller('CreateContactTypeOfficeCtrl', function ($scope, $window, TemplateService, NavigationService, $timeout, $state) {
        //Used to name the .html file
        $scope.template = TemplateService.changecontent("contactTypeOffice-detail");
        $scope.menutitle = NavigationService.makeactive("Contact Type of Office Type");
        TemplateService.title = $scope.menutitle;
        $scope.navigation = NavigationService.getnav();
        $scope.cancel = function () {
            $window.history.back();
        };
    })
    .controller('ContactTypeOfficeCtrl', function ($scope, $window, TemplateService, NavigationService, $timeout, $state) {
        //Used to name the .html file
        $scope.template = TemplateService.changecontent("contactTypeOffice-list");
        $scope.menutitle = NavigationService.makeactive("Contact Type of Office List");
        TemplateService.title = $scope.menutitle;
        $scope.navigation = NavigationService.getnav();
        $scope.cancel = function () {
            $window.history.back();
        };
    })
    .controller('CompanyCtrl', function ($scope, $window, TemplateService, NavigationService, $timeout, $state, $stateParams, toastr) {
        //Used to name the .html file
        $scope.template = TemplateService.changecontent("company-list", $state);
        $scope.menutitle = NavigationService.makeactive("List of Companies");
        TemplateService.title = $scope.menutitle;
        $scope.navigation = NavigationService.getnav();
        $scope.currentPage = $stateParams.page;
        var i = 0;
        $scope.search = {
            keyword: ""
        };
        if ($stateParams.keyword) {
            $scope.search.keyword = $stateParams.keyword;
        }
        $scope.showAllCountries = function (keywordChange) {
            $scope.totalItems = undefined;
            if (keywordChange) {
                $scope.currentPage = 1;
            }
            NavigationService.searchCompany({
                page: $scope.currentPage,
                keyword: $scope.search.keyword
            }, ++i, function (data, ini) {
                console.log(data.data);

                if (ini == i) {
                    console.log(data.data);
                    $scope.allCompanies = data.data.results;
                    $scope.totalItems = data.data.total;
                    $scope.maxRow = data.data.options.count;

                }
            });
        };
        $scope.cancel = function () {
            $window.history.back();
        };

        $scope.changePage = function (page) {
            var goTo = "state-list";
            if ($scope.search.keyword) {
                goTo = "state-list";
            }
            $state.go(goTo, {
                page: page,
                keyword: $scope.search.keyword
            });
        };
        $scope.showAllCountries();

        $scope.deleteCompany = function (id) {
            globalfunction.confDel(function (value) {
                if (value) {
                    NavigationService.deleteCompany(id, function (data) {
                        if (data.value) {
                            $scope.showAllCountries();
                            toastr.success("Company deleted successfully.", "Company deleted");
                        } else {
                            toastr.error("There was an error while deleting Company", "Company deleting error");
                        }


                    });
                }
            });
        };

    })
    .controller('CreateCompanyCtrl', function (hotkeys, $scope, $window, TemplateService, NavigationService, $timeout, $state, toastr) {
        //Used to name the .html file
        $scope.template = TemplateService.changecontent("company-detail");
        $scope.menutitle = NavigationService.makeactive("Create Company");
        TemplateService.title = $scope.menutitle;
        $scope.navigation = NavigationService.getnav();
        $scope.userStatus = [{
            "name": "Active",
            "value": true
        }, {
            "name": "Inactive",
            "value": false
        }];


        $scope.header = {
            "name": "Create Company"
        };
        $scope.cancel = function () {
            $window.history.back();
        };
        $scope.formData = {};
        $scope.formData.GSTINByState = [];
        NavigationService.getGSTINDetails($scope.formData.GSTINByState, function (newGSTINByState) {
            console.log("Company newGSTINByState", newGSTINByState);
            if (newGSTINByState.value == true) {
                $scope.formData.GSTINByState = newGSTINByState.data;
            }
        });
        // Ctrl + Enter
        hotkeys.bindTo($scope).add({
            combo: 'ctrl+enter',
            callback: function (formData) {
                $scope.hideSaveCancel = true;
                NavigationService.companySave(formData, function (data) {
                    if (data.value === true) {
                        // $state.go('company-list');
                        $window.history.back();
                        toastr.success("company " + formData.name + " created successfully.", "company Created");
                    } else {
                        $scope.hideSaveCancel = false;
                        toastr.error("company creation failed.", "company creation error");
                    }
                });
            }
        });

        // 
        $scope.saveCompany = function (formData) {
            NavigationService.companySave(formData, function (data) {
                if (data.value === true) {
                    // $state.go('company-list');
                    $window.history.back();
                    toastr.success("company " + formData.name + " created successfully.", "company Created");
                } else {
                    toastr.error("company creation failed.", "company creation error");
                }
            });
        };
    })
    .controller('EditCompanyCtrl', function (hotkeys, $scope, $window, TemplateService, NavigationService, $timeout, $state, $stateParams, toastr) {
        //Used to name the .html file
        $scope.template = TemplateService.changecontent("company-detail");
        $scope.menutitle = NavigationService.makeactive("Edit Company");
        TemplateService.title = $scope.menutitle;
        $scope.navigation = NavigationService.getnav();
        $scope.userStatus = [{
            "name": "Active",
            "value": true
        }, {
            "name": "Inactive",
            "value": false
        }];

        $scope.header = {
            "name": "Edit Company"
        };
        $scope.formData = {};
        $scope.cancel = function () {
            $window.history.back();
        };
        NavigationService.getOneCompany($stateParams.id, function (data) {
            $scope.formData = data.data;
            NavigationService.getGSTINDetails($scope.formData.GSTINByState, function (newGSTINByState) {
                console.log("Company newGSTINByState", newGSTINByState);
                if (newGSTINByState.value == true) {
                    $scope.formData.GSTINByState = newGSTINByState.data;
                }
            });
            // if (data.data.city) {
            //     $scope.formData.country = data.data.city.district.state.zone.country._id;
            //     $scope.formData.zone = data.data.city.district.state.zone._id;
            //     $scope.formData.state = data.data.city.district.state._id;
            //     $scope.formData.district = data.data.city.district._id;
            //     $scope.formData.city = data.data.city._id;
            // }
        });


        // Ctrl + ENTER
        hotkeys.bindTo($scope).add({
            combo: 'ctrl+enter',
            callback: function (formData) {
                $scope.hideSaveCancel = true;
                NavigationService.companySave($scope.formData, function (data) {
                    if (data.value === true) {
                        $window.history.back();
                        toastr.success("Company " + $scope.formData.name + " edited successfully.", "Company Edited");
                    } else {
                        $scope.hideSaveCancel = false;
                        toastr.error("Company edition failed.", "Company editing error");
                    }
                });
            }
        });
        // 
        $scope.saveCompany = function (formValid) {
            NavigationService.companySave($scope.formData, function (data) {
                if (data.value === true) {
                    // $state.go('company-list');
                    $window.history.back();
                    toastr.success("Company " + $scope.formData.name + " edited successfully.", "Company Edited");
                } else {
                    toastr.error("Company edition failed.", "Company editing error");
                }
            });
        };

    })
    .controller('CreateDistrictCtrl', function ($scope, hotkeys, $window, TemplateService, NavigationService, $timeout, $state, $stateParams, toastr) {
        //Used to name the .html file
        $scope.template = TemplateService.changecontent("district-detail");
        $scope.menutitle = NavigationService.makeactive("District");
        TemplateService.title = $scope.menutitle;
        $scope.navigation = NavigationService.getnav();
        $scope.formData = {};
        $scope.header = {
            "name": "Create District"
        };
        $scope.cancel = function () {
            $window.history.back();
        };
        hotkeys.bindTo($scope).add({
            combo: 'ctrl+enter',
            callback: function (formData) {
                NavigationService.districtSave($scope.formData, function (data) {
                    if (data.value === true) {
                        $window.history.back();
                        toastr.success("District " + formData.name + " created successfully.", "District Created");
                    } else {
                        toastr.error("District creation failed.", "District creation error");
                    }
                });
            }
        });
        $scope.saveDistrict = function (formData) {
            NavigationService.districtSave($scope.formData, function (data) {
                if (data.value === true) {
                    $window.history.back();
                    toastr.success("District " + formData.name + " created successfully.", "District Created");
                } else {
                    toastr.error("District creation failed.", "District creation error");
                }
            });
        };
    })
    .controller('EditDistrictCtrl', function ($scope, hotkeys, $window, TemplateService, NavigationService, $timeout, $stateParams, $state, toastr) {
        //Used to name the .html file
        $scope.template = TemplateService.changecontent("district-detail");
        $scope.menutitle = NavigationService.makeactive("District");
        TemplateService.title = $scope.menutitle;
        $scope.navigation = NavigationService.getnav();

        $scope.header = {
            "name": "Edit District"
        };

        NavigationService.getOneDistrict($stateParams.id, function (data) {
            $scope.formData = data.data;
            $scope.formData.country = data.data.state.zone.country._id;
            $scope.formData.zone = data.data.state.zone._id;
            $scope.formData.state = data.data.state._id;
        });
        $scope.cancel = function () {
            $window.history.back();
        };
        hotkeys.bindTo($scope).add({
            combo: 'ctrl+enter',
            callback: function (formData) {
                NavigationService.districtSave($scope.formData, function (data) {
                    if (data.value === true) {
                        // $state.go('district-list');
                        $window.history.back();
                        toastr.success("District " + $scope.formData.name + " edited successfully.", "District Edited");
                    } else {
                        toastr.error("District edition failed.", "District editing error");
                    }
                });
            }
        });
        $scope.saveDistrict = function (formValid) {
            NavigationService.districtSave($scope.formData, function (data) {
                if (data.value === true) {
                    // $state.go('district-list');
                    $window.history.back();
                    toastr.success("District " + $scope.formData.name + " edited successfully.", "District Edited");
                } else {
                    toastr.error("District edition failed.", "District editing error");
                }
            });
        };
    })
    .controller('CurrencyCtrl', function ($scope, $window, TemplateService, NavigationService, $timeout, $stateParams, $state, toastr) {
        //Used to name the .html file
        $scope.template = TemplateService.changecontent("currency-list");
        $scope.menutitle = NavigationService.makeactive("Currency List");
        TemplateService.title = $scope.menutitle;
        $scope.navigation = NavigationService.getnav();
        $scope.currentPage = $stateParams.page;
        var i = 0;
        $scope.search = {
            keyword: ""
        };
        if ($stateParams.keyword) {
            $scope.search.keyword = $stateParams.keyword;
        }
        $scope.showAllCountries = function (keywordChange) {
            $scope.totalItems = undefined;
            if (keywordChange) {
                $scope.currentPage = 1;
            }
            NavigationService.searchCurrency({
                page: $scope.currentPage,
                keyword: $scope.search.keyword
            }, ++i, function (data, ini) {
                console.log(data.data);

                if (ini == i) {
                    console.log(data.data);
                    $scope.allCurrencies = data.data.results;
                    $scope.totalItems = data.data.total;
                    $scope.maxRow = data.data.options.count;

                }
            });
        };
        $scope.cancel = function () {
            $window.history.back();
        };
        $scope.changePage = function (page) {
            var goTo = "zone-list";
            if ($scope.search.keyword) {
                goTo = "zone-list";
            }
            $state.go(goTo, {
                page: page,
                keyword: $scope.search.keyword
            });
        };
        $scope.showAllCountries();

        $scope.deleteCurrency = function (id) {
            globalfunction.confDel(function (value) {
                console.log(value);
                if (value) {
                    NavigationService.deleteCurrency(id, function (data) {
                        if (data.value) {
                            $scope.showAllCountries();
                            toastr.success("Currency deleted successfully.", "Currency deleted");
                        } else {
                            toastr.error("There was an error while deleting Currency", "Currency deleting error");
                        }


                    });
                }
            });
        };
    })
    .controller('CreateCurrencyCtrl', function ($scope, hotkeys, $window, TemplateService, NavigationService, $timeout, $state, toastr) {
        //Used to name the .html file
        $scope.template = TemplateService.changecontent("currency-detail");
        $scope.menutitle = NavigationService.makeactive("Currency");
        TemplateService.title = $scope.menutitle;
        $scope.navigation = NavigationService.getnav();

        $scope.header = {
            "name": "Create Currency"
        };
        $scope.formData = {};
        $scope.cancel = function () {
            $window.history.back();
        };
        hotkeys.bindTo($scope).add({
            combo: 'ctrl+enter',
            callback: function (formData) {
                NavigationService.currencySave($scope.formData, function (data) {
                    if (data.value === true) {
                        // $state.go('currency-list');
                        $window.history.back();
                        toastr.success("Currency " + $scope.formData.name + " created successfully.", "Currency Created");
                    } else {
                        toastr.error("Currency creation failed.", "Currency creation error");
                    }
                });
            }
        });
        $scope.saveCurrency = function (formData) {
            NavigationService.currencySave($scope.formData, function (data) {
                if (data.value === true) {
                    // $state.go('currency-list');
                    $window.history.back();
                    toastr.success("Currency " + $scope.formData.name + " created successfully.", "Currency Created");
                } else {
                    toastr.error("Currency creation failed.", "Currency creation error");
                }
            });
        };

    })
    .controller('EditCurrencyCtrl', function ($scope, hotkeys, $window, TemplateService, NavigationService, $timeout, $stateParams, $state, toastr) {
        //Used to name the .html file
        $scope.template = TemplateService.changecontent("currency-detail");
        $scope.menutitle = NavigationService.makeactive("Currency");
        TemplateService.title = $scope.menutitle;
        $scope.navigation = NavigationService.getnav();

        $scope.header = {
            "name": "Edit Currency"
        };

        NavigationService.getOneCurrency($stateParams.id, function (data) {
            $scope.formData = data.data;
        });
        $scope.cancel = function () {
            console.log("EditCurrencyCtrl");
            $window.history.back();
        };
        hotkeys.bindTo($scope).add({
            combo: 'ctrl+enter',
            callback: function (formData) {
                NavigationService.currencySave($scope.formData, function (data) {
                    if (data.value === true) {
                        $window.history.back();
                        toastr.success("Currency " + $scope.formData.name + " created successfully.", "Currency Created");
                    } else {
                        toastr.error("Currency creation failed.", "Currency creation error");
                    }
                });
            }
        });
        $scope.saveCurrency = function (formValid) {
            NavigationService.currencySave($scope.formData, function (data) {
                if (data.value === true) {
                    $window.history.back();
                    toastr.success("Currency " + $scope.formData.name + " created successfully.", "Currency Created");
                } else {
                    toastr.error("Currency creation failed.", "Currency creation error");
                }
            });
        };

    })
    .controller('CityCtrl', function ($scope, $window, TemplateService, NavigationService, $uibModal, $timeout, $stateParams, $state, toastr) {
        //Used to name the .html file
        $scope.template = TemplateService.changecontent("city-list", $state);
        $scope.menutitle = NavigationService.makeactive("City Lists");
        TemplateService.title = $scope.menutitle;
        $scope.navigation = NavigationService.getnav();
        $scope.currentPage = $stateParams.page;
        var i = 0;
        $scope.search = {
            keyword: ""
        };
        $scope.cityFilter = {};
        if ($stateParams.keyword) {
            $scope.search.keyword = $stateParams.keyword;
        }
        if ($stateParams.sorting) {
            $scope.cityFilter.sorting = $stateParams.sorting;
        } else {
            $scope.cityFilter.sorting = [];
        }
        if ($stateParams.city) {
            $scope.cityFilter.city = $stateParams.city;
        } else {
            $scope.cityFilter.city = "";
        }

        $scope.cityFilter.sortName = "";
        $scope.cityFilter.sortNumber = 1;

        $scope.clearFilter = function () {
            // console.log("Sorting", $scope.invoiceFilter.sorting);
            $scope.cityFilter.city = [];
            $scope.cityFilter.state = [];
            $scope.cityFilter.district = [];
            $scope.cityFilter.zone = [];
            $scope.cityFilter.country = [];
            $.jStorage.set("CityFilter", $scope.cityFilter);
        };

        $scope.generateExcel = function () {
            NavigationService.saveJsonStore($scope.cityFilter2, function (data) {
                window.open(adminurl + 'City/generateCityExcel?id=' + data + "&accessToken=" +
                    $.jStorage.get("accessToken"), '_self');
            });
        };

        $scope.cityFilter.maxRow = 10;
        $scope.limitValues = [10, 50, 100];
        $scope.changeRecordLimit = function () {
            $scope.showAllCities();
        }
        if ($.jStorage.get("CityFilter")) {
            $scope.cityFilter = $.jStorage.get("CityFilter");
            console.log('IN  jstorage city filter');
        }

        $scope.showAllCities = function (keywordChange, sorting) {
            if (_.isEmpty(sorting)) {
                sorting = [];
            }
            if (!_.isEmpty($stateParams.sorting)) {
                $scope.cityFilter.sortName = $stateParams.sorting[0];
                $scope.cityFilter.sortNumber = $stateParams.sorting[1];
                console.log("state : sortname::: ", $scope.cityFilter.sortName, $scope.cityFilter.sortNumber);
            }
            if (sorting[0]) {
                // console.log("sorting=====", sorting);
                $scope.cityFilter.sortName = sorting[0];
                if (sorting[1] == 1) {
                    $scope.cityFilter.sortNumber = -1;
                } else {
                    $scope.cityFilter.sortNumber = 1;
                }
            }
            TemplateService.getLoader();

            var cities = [];
            cities = $scope.cityFilter.city;
            $scope.cityFilter.city = _.map(cities, function (values) {
                return values.name;
            });
            // console.log("cityFilter owner", $scope.cityFilter.owner);

            var states = [];
            states = $scope.cityFilter.state;
            $scope.cityFilter.state = _.map(states, function (values) {
                return values.name;
            });
            // console.log("cityFilter state", $scope.cityFilter.branch);

            var districts = [];
            districts = $scope.cityFilter.district;
            $scope.cityFilter.district = _.map(districts, function (values) {
                return values.name;
            });
            // console.log("cityFilter district", $scope.cityFilter.district);

            var zones = [];
            zones = $scope.cityFilter.zone;
            $scope.cityFilter.zone = _.map(zones, function (values) {
                return values.name;
            });
            // console.log("cityFilter zone", $scope.cityFilter.zone);

            var countries = [];
            countries = $scope.cityFilter.country;
            $scope.cityFilter.country = _.map(countries, function (values) {
                return values.name;
            });

            $scope.totalItems = undefined;
            if (keywordChange) {
                $scope.currentPage = 1;
            }
            $scope.cityFilter2 = {
                pagenumber: $scope.currentPage,
                pagelimit: $scope.cityFilter.maxRow,
                sorting: [$scope.cityFilter.sortName, $scope.cityFilter.sortNumber],
                city: $scope.cityFilter.city,
                state: $scope.cityFilter.state,
                district: $scope.cityFilter.district,
                zone: $scope.cityFilter.zone,
                country: $scope.cityFilter.country
            };
            NavigationService.getAllCity($scope.cityFilter2, ++i, function (data, ini) {
                console.log(data.data);
                if (ini == i) {
                    TemplateService.removeLoader();
                    console.log(data.data);
                    $scope.allCities = data.data.results;
                    $scope.totalItems = data.data.total;
                    // $scope.cityFilter.maxRow = 10;
                }
            });
            $scope.cityFilter.city = cities;
            $scope.cityFilter.state = states;
            $scope.cityFilter.district = districts;
            $scope.cityFilter.zone = zones;
            $scope.cityFilter.country = countries;
            $.jStorage.set("CityFilter", $scope.cityFilter);
        };

        $scope.changePage = function (page) {
            var goTo = "city-list";
            if ($scope.search.keyword) {
                goTo = "city-list";
            }
            $state.go(goTo, {
                page: page,
                keyword: $scope.search.keyword
            });
        };
        $scope.showAllCities();
        $scope.citiesFilter = function () {
            var modalInstance = $uibModal.open({
                scope: $scope,
                templateUrl: '/frontend/views/modal/city-filter.html',
                size: 'lg'
            });
        };
        $scope.tagTransform = function (newTag) {
            return {
                name: newTag
            };
        };
        $scope.refreshCity = function (data) {
            var formdata = {};
            formdata.keyword = data;
            NavigationService.searchCity(formdata, 1, function (data) {
                $scope.cities = data.data.results;
            });
        };
        $scope.refreshDistrict = function (data) {
            var formdata = {};
            formdata.keyword = data;
            NavigationService.searchDistrict(formdata, 1, function (data) {
                $scope.districts = data.data.results;
            });
        };
        $scope.refreshState = function (data) {
            var formdata = {};
            formdata.keyword = data;
            NavigationService.searchState(formdata, 1, function (data) {
                $scope.states = data.data.results;
            });
        };
        $scope.refreshZone = function (data) {
            var formdata = {};
            formdata.keyword = data;
            NavigationService.searchZone(formdata, 1, function (data) {
                $scope.zones = data.data.results;
            });
        };
        $scope.refreshCountry = function (data) {
            var formdata = {};
            formdata.keyword = data;
            NavigationService.searchCountry(formdata, 1, function (data) {
                $scope.countries = data.data.results;
            });
        };
        // if ($.jStorage.get("CityFilter")) {
        //     $scope.cityFilter =  $.jStorage.get("CityFilter");
        // }

        $scope.deleteCity = function (id) {
            globalfunction.confDel(function (value) {
                console.log(value);
                if (value) {
                    NavigationService.deleteCity(id, function (data) {
                        if (data.value) {
                            $scope.showAllCities();
                            toastr.success("City deleted successfully.", "City deleted");
                        } else {
                            toastr.error("There was an error while deleting City", "City deleting error");
                        }
                    });
                }
            });
        };
    })

    .controller('LogisticCtrl', function ($scope, $window, TemplateService, NavigationService, $timeout, $stateParams, $state, toastr) {
        //Used to name the .html file
        $scope.template = TemplateService.changecontent("logistic-list");
        $scope.menutitle = NavigationService.makeactive("Logistic Lists");
        TemplateService.title = $scope.menutitle;
        $scope.navigation = NavigationService.getnav();
        $scope.currentPage = $stateParams.page;
        var i = 0;
        $scope.logisticFilter = {};
        $scope.logisticFilter.timelineStatus = "All";
        $scope.logisticFilter.text = "";
        // if ($stateParams.keyword) {
        //     $scope.logisticFilter.keyword = $stateParams.keyword;
        // }

        if ($.jStorage.get("LogisticFilter")) {
            $scope.logisticFilter = $.jStorage.get("LogisticFilter");
        }
        if ($stateParams.timelineStatus) {
            $scope.logisticFilter.timelineStatus = $stateParams.timelineStatus;
        }
        if ($stateParams.text) {
            $scope.logisticFilter.text = $stateParams.text;
        }
        $scope.showAllLogistic = function (keywordChange) {
            $scope.totalItems = undefined;
            if (keywordChange) {
                $scope.currentPage = 1;
            }
            NavigationService.searchLogistic({
                page: $scope.currentPage,
                text: $scope.logisticFilter.text,
                timelineStatus: $scope.logisticFilter.timelineStatus
            }, ++i, function (data, ini) {
                if (ini == i) {
                    $scope.logistics = data.data.results;
                    $scope.totalItems = data.data.total;
                    $scope.maxRow = data.data.options.count;
                }
            });
            $.jStorage.set("LogisticFilter", $scope.LogisticFilter);
        };
        $scope.changePage = function (page) {
            var goTo = "logistic-list";
            $state.go(goTo, {
                page: page,
                text: $scope.logisticFilter.text,
                timelineStatus: $scope.logisticFilter.timelineStatus
            });
        };
        $scope.showAllLogistic();
    })
    .controller('EditLogisticCtrl', function ($scope, hotkeys, $window, TemplateService, NavigationService, $timeout, $stateParams, $state, toastr) {
        //Used to name the .html file
        $scope.template = TemplateService.changecontent("logistic-detail");
        $scope.menutitle = NavigationService.makeactive("Edit Logistic");
        TemplateService.title = $scope.menutitle;
        $scope.navigation = NavigationService.getnav();

        $scope.header = {
            "name": "Edit Logistic"
        };
        $scope.apiCallFlag = false;
        NavigationService.getOneModel("Assignment", $stateParams.id, function (data) {
            console.log('data', data);
            $scope.formData = data.data;
            $scope.formData.name = [{
                _id: data.data._id,
                name: data.data.name
            }];
            $scope.apiCallFlag = true;
            console.log(data.data.outwardDate, data.data.docketDate)
            if (data.data.outwardDate !== undefined) {
                $scope.formData.outwardDate = new Date(data.data.outwardDate);
            }
            if (data.data.docketDate !== undefined) {
                $scope.formData.docketDate = new Date(data.data.docketDate);
            }
            if (data.data.recievedDate !== undefined) {
                $scope.formData.recievedDate = new Date(data.data.recievedDate);
            }
            if (data.data.recievedTime !== undefined) {
                $scope.formData.recievedTime = new Date(data.data.recievedTime);
            }
        });
        $scope.cancel = function () {
            $window.history.back();
        };
        // hotkeys.bindTo($scope).add({
        //     combo: 'ctrl+enter',
        //     callback: function (formData) {
        //         NavigationService.modelSave("Assignment", $scope.formData, function (data) {
        //             if (data.value === true) {
        //                 $window.history.back();
        //                 toastr.success("Logistic" + " " + formData.name + " created successfully.", "Assignment" + " Created");
        //             } else {
        //                 toastr.error("Assignment" + " creation failed.", "Assignment" + " creation error");
        //             }
        //         });
        //     }
        // });
        // console.log('$scope.formData.timelineStatus', $scope.formData);
        $scope.refreshMrNumber = function (data) {
            if ($scope.apiCallFlag) {
                NavigationService.getMRNames({
                    timelineStatus: $scope.formData.timelineStatus,
                    keyword: data
                }, 1, function (data) {
                    if (_.isEmpty(data.data)) {
                        $scope.assignmentNumbers = [];
                    } else {
                        $scope.assignmentNumbers = data.data.results;
                    }
                });
            }
        };

        $scope.saveLogistic = function (formValid) {
            var successToaster;
            var errorToaster;
            if ($scope.formData.timelineStatus == "BBND") {
                successToaster = "Assignment(s) DBND";
                errorToaster = "Error in DBND";
            } else {
                successToaster = "Assignment(s) Delivered";
                errorToaster = "Error in Delivery";
            }
            NavigationService.modelSaveLogistic("Assignment", $scope.formData, function (data) {
                if (data.value === true) {
                    $window.history.back();
                    toastr.success(successToaster);
                } else {
                    toastr.error(errorToaster);
                }
            });
        };
    })

    .controller('CreateCityCtrl', function ($scope, hotkeys, $window, TemplateService, NavigationService, $timeout, $state, $stateParams, toastr) {
        //Used to name the .html file
        $scope.template = TemplateService.changecontent("city-detail");
        $scope.menutitle = NavigationService.makeactive("Create City");
        TemplateService.title = $scope.menutitle;
        $scope.navigation = NavigationService.getnav();
        var vm = this;
        vm.availableColors = ['Red', 'Green', 'Blue', 'Yellow', 'Magenta', 'Maroon', 'Umbra', 'Turquoise'];

        $scope.header = {
            "name": "Create City"
        };
        $scope.formData = {};
        $scope.cancel = function () {
            $window.history.back();
        };
        hotkeys.bindTo($scope).add({
            combo: 'ctrl+enter',
            callback: function (formData) {
                $scope.hideSaveCancel = true;
                NavigationService.citySave($scope.formData, function (data) {
                    if (data.value === true) {
                        $window.history.back();
                        toastr.success("City " + formData.name + " created successfully.", "City Created");
                    } else {
                        toastr.error("City creation failed.", "City creation error");
                    }
                });
            }
        });
        $scope.saveCity = function (formData) {
            NavigationService.citySave($scope.formData, function (data) {
                if (data.value === true) {
                    $window.history.back();
                    toastr.success("City " + formData.name + " created successfully.", "City Created");
                } else {
                    toastr.error("City creation failed.", "City creation error");
                }
            });
        };
    })
    .controller('EditCityCtrl', function ($scope, hotkeys, $window, TemplateService, NavigationService, $timeout, $stateParams, $state, toastr) {
        //Used to name the .html file
        $scope.template = TemplateService.changecontent("city-detail");
        $scope.menutitle = NavigationService.makeactive("Edit City");
        TemplateService.title = $scope.menutitle;
        $scope.navigation = NavigationService.getnav();

        $scope.header = {
            "name": "Edit City"
        };
        NavigationService.getOneCity($stateParams.id, function (data) {
            $scope.formData = data.data;
            $scope.formData.country = data.data.district.state.zone.country._id;
            $scope.formData.zone = data.data.district.state.zone._id;
            $scope.formData.state = data.data.district.state._id;
            $scope.formData.district = data.data.district._id;
        });
        $scope.cancel = function () {
            $window.history.back();
        };
        hotkeys.bindTo($scope).add({
            combo: 'ctrl+enter',
            callback: function (formData) {
                NavigationService.citySave($scope.formData, function (data) {
                    if (data.value === true) {
                        // $state.go('city-list');
                        $window.history.back();
                        toastr.success("City " + $scope.formData.name + " edited successfully.", "City Edited");
                    } else {
                        toastr.error("City edition failed.", "City editing error");
                    }
                });
            }
        });
        $scope.saveCity = function (formValid) {
            NavigationService.citySave($scope.formData, function (data) {
                if (data.value === true) {
                    // $state.go('city-list');
                    $window.history.back();
                    toastr.success("City " + $scope.formData.name + " edited successfully.", "City Edited");
                } else {
                    toastr.error("City edition failed.", "City editing error");
                }
            });
        };
    })
    .controller('DepartmentCtrl', function ($scope, $window, TemplateService, NavigationService, $timeout) {
        //Used to name the .html file
        $scope.template = TemplateService.changecontent("department-list");
        $scope.menutitle = NavigationService.makeactive("Department List");
        TemplateService.title = $scope.menutitle;
        $scope.navigation = NavigationService.getnav();

        $scope.showAllDepartments = function () {
            NavigationService.getAllDepartments(function (data) {
                $scope.allDepartments = data.data;

            });
        };
        $scope.showAllDepartments();

        $scope.deleteDepartment = function (id) {

            NavigationService.deleteDepartment({
                id: id
            }, function (data) {
                $scope.showAllDepartments();

            });
        };

    })
    .controller('CreateDepartmentCtrl', function ($scope, $window, TemplateService, NavigationService, $timeout, $state) {
        //Used to name the .html file
        $scope.template = TemplateService.changecontent("department-detail");
        $scope.menutitle = NavigationService.makeactive("Department");
        TemplateService.title = $scope.menutitle;
        $scope.navigation = NavigationService.getnav();
        $scope.userStatus = [{
            "name": "Active",
            "value": true
        }, {
            "name": "Inactive",
            "value": false
        }];
        $scope.header = {
            "name": "Create Department"
        };
        $scope.formData = {};
        $scope.saveDepartment = function (formData) {

            NavigationService.departmentSave($scope.formData, function (data) {
                console.log(data);
                if (data.value === true) {
                    $window.history.back();
                }

            });
        };

        NavigationService.getAllUniqueTypes(function (data) {
            $scope.allUniqueTypes = data.data;
            console.log('$scope.allUniqueTypes', $scope.allUniqueTypes);

        });

    })
    .controller('EditDepartmentCtrl', function ($scope, $window, TemplateService, NavigationService, $timeout, $stateParams, $state) {
        //Used to name the .html file
        $scope.template = TemplateService.changecontent("department-detail");
        $scope.menutitle = NavigationService.makeactive("Department");
        TemplateService.title = $scope.menutitle;
        $scope.navigation = NavigationService.getnav();
        $scope.userStatus = [{
            "name": "Active",
            "value": true
        }, {
            "name": "Inactive",
            "value": false
        }];
        $scope.header = {
            "name": "Edit Department"
        };

        NavigationService.getOneDepartment($stateParams.id, function (data) {
            $scope.formData = data.data;
            console.log('$scope.formData', $scope.formData);

        });

        $scope.saveDepartment = function (formValid) {

            //  if (formValid.$valid) {
            //  $scope.formComplete = true;
            NavigationService.departmentEditSave($scope.formData, function (data) {
                if (data.value === true) {
                    // $state.go('department-list');
                    $window.history.back();
                }
            });
            //  }
        };
        NavigationService.getAllUniqueTypes(function (data) {
            $scope.allUniqueTypes = data.data;
            console.log('$scope.allUniqueTypes', $scope.allUniqueTypes);

        });

    })
    .controller('UniqueTypetCtrl', function ($scope, $window, TemplateService, NavigationService, $timeout) {
        //Used to name the .html file
        $scope.template = TemplateService.changecontent("uniqueType-list");
        $scope.menutitle = NavigationService.makeactive("Unique Type List");
        TemplateService.title = $scope.menutitle;
        $scope.navigation = NavigationService.getnav();

        $scope.showAllUniqueTypes = function () {
            NavigationService.getAllUniqueTypes(function (data) {
                $scope.allUniqueTypes = data.data;

            });
        };
        $scope.cancel = function () {
            $window.history.back();
        };
        $scope.showAllUniqueTypes();

        $scope.deleteUniqueType = function (id) {

            NavigationService.deleteUniqueType({
                id: id
            }, function (data) {
                $scope.showAllUniqueTypes();

            });
        };

    })
    .controller('CreateUniqueTypeCtrl', function ($scope, $window, TemplateService, NavigationService, $timeout, $state) {
        //Used to name the .html file
        $scope.template = TemplateService.changecontent("uniqueType-detail");
        $scope.menutitle = NavigationService.makeactive("Unique Type");
        TemplateService.title = $scope.menutitle;
        $scope.navigation = NavigationService.getnav();

        $scope.header = {
            "name": "Create Unique Type"
        };
        $scope.formData = {};
        $scope.cancel = function () {
            $window.history.back();
        };
        $scope.saveUniqueType = function (formData) {

            NavigationService.uniquetypeSave($scope.formData, function (data) {
                console.log(data);
                if (data.value === true) {
                    $window.history.back();
                }

            });
        };

        // NavigationService.getAllallUniqueTypes(function(data) {
        //     $scope.allUniqueTypes = data.data;
        //     console.log('$scope.allUniqueTypes', $scope.allUniqueTypes);
        //
        // });

    })
    .controller('EditUniqueTypeCtrl', function ($scope, $window, TemplateService, NavigationService, $timeout, $stateParams, $state) {
        //Used to name the .html file
        $scope.template = TemplateService.changecontent("uniqueType-detail");
        $scope.menutitle = NavigationService.makeactive("Unique Type");
        TemplateService.title = $scope.menutitle;
        $scope.navigation = NavigationService.getnav();

        $scope.header = {
            "name": "Edit Unique Type"
        };

        NavigationService.getOneUniqueType($stateParams.id, function (data) {
            $scope.formData = data.data;
            console.log('$scope.formData', $scope.formData);
        });
        $scope.cancel = function () {
            $window.history.back();
        };
        $scope.saveUniqueType = function (formValid) {

            //  if (formValid.$valid) {
            //  $scope.formComplete = true;
            NavigationService.UniqueTypeEditSave($scope.formData, function (data) {
                if (data.value === true) {
                    // $state.go('uniquetype-list');
                    $window.history.back();
                }
            });
            //  }
        };

        // NavigationService.getAllallUniqueTypes(function(data) {
        //     $scope.allUniqueTypes = data.data;
        //     console.log('$scope.allUniqueTypes', $scope.allUniqueTypes);
        //
        // });

    })


    .controller('CustomerSegmentCtrl', function ($scope, $window, TemplateService, NavigationService, $timeout) {
        //Used to name the .html file
        $scope.template = TemplateService.changecontent("customerSegment-list");
        $scope.menutitle = NavigationService.makeactive("Customer Segment List");
        TemplateService.title = $scope.menutitle;
        $scope.navigation = NavigationService.getnav();

        $scope.showAllCustomerSegments = function () {
            NavigationService.getAllCustomerSegments(function (data) {
                $scope.allCustomerSegments = data.data;

            });
        };
        $scope.showAllCustomerSegments();

        $scope.deleteCustomerSegment = function (id) {

            NavigationService.deleteCustomerSegment({
                id: id
            }, function (data) {
                $scope.showAllCustomerSegments();

            });
        };

    })
    .controller('CreateCustomerSegmentCtrl', function ($scope, hotkeys, $window, TemplateService, NavigationService, $timeout, $state) {
        //Used to name the .html file
        $scope.template = TemplateService.changecontent("customerSegment-detail");
        $scope.menutitle = NavigationService.makeactive("Customer Segment");
        TemplateService.title = $scope.menutitle;
        $scope.navigation = NavigationService.getnav();

        $scope.header = {
            "name": "Create Customer Segment"
        };
        $scope.formData = {};
        $scope.cancel = function () {
            $window.history.back();
        };
        hotkeys.bindTo($scope).add({
            combo: 'ctrl+enter',
            callback: function (formData) {
                NavigationService.customersegmentSave($scope.formData, function (data) {
                    console.log(data);
                    if (data.value === true) {
                        $window.history.back();
                    }
                });
            }
        });
        $scope.saveCustomerSegment = function (formData) {
            NavigationService.customersegmentSave($scope.formData, function (data) {
                console.log(data);
                if (data.value === true) {
                    $window.history.back();
                }
            });
        };
    })
    .controller('EditCustomerSegmentCtrl', function ($scope, hotkeys, $window, TemplateService, NavigationService, $timeout, $stateParams, $state) {
        //Used to name the .html file
        $scope.template = TemplateService.changecontent("customerSegment-detail");
        $scope.menutitle = NavigationService.makeactive("Customer Segment");
        TemplateService.title = $scope.menutitle;
        $scope.navigation = NavigationService.getnav();

        $scope.header = {
            "name": "Edit Customer Segment"
        };

        NavigationService.getOneCustomerSegment($stateParams.id, function (data) {
            $scope.formData = data.data;
            console.log('$scope.formData', $scope.formData);

        });

        $scope.cancel = function () {
            $window.history.back();
        };
        hotkeys.bindTo($scope).add({
            combo: 'ctrl+enter',
            callback: function (formData) {
                NavigationService.CustomerSegmentEditSave($scope.formData, function (data) {
                    if (data.value === true) {
                        $window.history.back();
                    }
                });
            }
        });

        $scope.saveCustomerSegment = function (formValid) {
            NavigationService.CustomerSegmentEditSave($scope.formData, function (data) {
                if (data.value === true) {
                    $window.history.back();
                }
            });
        };

    })


    .controller('PolicyTypeCtrl', function ($scope, $window, TemplateService, NavigationService, $timeout) {
        //Used to name the .html file
        $scope.template = TemplateService.changecontent("policyName-list");
        $scope.menutitle = NavigationService.makeactive("Policy Name List");
        TemplateService.title = $scope.menutitle;
        $scope.navigation = NavigationService.getnav();

        $scope.showAllPolicyTypes = function () {
            NavigationService.getAllPolicyTypes(function (data) {
                $scope.allPolicyTypes = data.data;

            });
        };
        $scope.showAllPolicyTypes();

        $scope.deletePolicyType = function (id) {

            NavigationService.deletePolicyType({
                id: id
            }, function (data) {
                $scope.showAllPolicyTypes();

            });
        };

    })
    .controller('CreatePolicyTypeCtrl', function ($scope, hotkeys, $window, TemplateService, NavigationService, $timeout, $state, $stateParams, toastr) {
        //Used to name the .html file
        $scope.template = TemplateService.changecontent("policyType-detail");
        $scope.menutitle = NavigationService.makeactive("Policy Type");
        TemplateService.title = $scope.menutitle;
        $scope.navigation = NavigationService.getnav();
        $scope.userStatus = [{
            "name": "Active",
            "value": true
        }, {
            "name": "Inactive",
            "value": false
        }];
        $scope.header = {
            "name": "Create Policy Type"
        };
        $scope.formData = {};
        $scope.insurers = [];
        var formData2 = {}
        formData2.filter = {
            "name": "Insurer"
        }
        NavigationService.searchModel("CustomerSegment", formData2, 1, function (data) {
            $scope.customerSegmentId = data.data.results[0]._id;
        });
        $scope.refreshInsurer = function (data) {
            console.log("Data Inn", data);
            var formdata = {};
            formdata.keyword = data;
            formdata.filter = {
                customerSegment: $scope.customerSegmentId
            }
            NavigationService.searchInsurerOffice(formdata, 1, function (data) {
                $scope.insurers = data.data.results;
            });
        };

        $scope.democlick = function (new_value) {
            var new_object = {};
            new_object.name = new_value;
            console.log(new_object);
            return new_object;
        };

        $scope.cancel = function () {
            $window.history.back();
        }
        hotkeys.bindTo($scope).add({
            combo: 'ctrl+enter',
            callback: function (formData) {
                _.each(formData.insurer, function (n) {
                    n = n._id;
                });
                console.log($scope.formData);
                NavigationService.modelSave("PolicyType", $scope.formData, function (data) {
                    if (data.value === true) {
                        // $state.go('policyType-list');
                        $window.history.back();
                        toastr.success("PolicyType" + " " + formData.name + " created successfully.", "PolicyType" + " Created");
                    } else {
                        toastr.error("PolicyType" + " creation failed.", "PolicyType" + " creation error");
                    }
                });
            }
        });
        $scope.saveModel = function (formData) {
            _.each(formData.insurer, function (n) {
                n = n._id;
            });
            console.log($scope.formData);
            NavigationService.modelSave("PolicyType", $scope.formData, function (data) {
                if (data.value === true) {
                    // $state.go('policyType-list');
                    $window.history.back();
                    toastr.success("PolicyType" + " " + formData.name + " created successfully.", "PolicyType" + " Created");
                } else {
                    toastr.error("PolicyType" + " creation failed.", "PolicyType" + " creation error");
                }
            });
        };


    })
    .controller('EditPolicyTypeCtrl', function ($scope, hotkeys, $window, TemplateService, NavigationService, $timeout, $stateParams, $state, toastr) {
        //Used to name the .html file
        $scope.template = TemplateService.changecontent("policyType-detail");
        $scope.menutitle = NavigationService.makeactive("Policy Type");
        TemplateService.title = $scope.menutitle;
        $scope.navigation = NavigationService.getnav();
        $scope.userStatus = [{
            "name": "Active",
            "value": true
        }, {
            "name": "Inactive",
            "value": false
        }];
        $scope.header = {
            "name": "Edit Policy Type"
        };
        $scope.insurers = [];
        var formData2 = {}
        formData2.filter = {
            "name": "Insurer"
        }
        NavigationService.searchModel("CustomerSegment", formData2, 1, function (data) {
            $scope.customerSegmentId = data.data.results[0]._id;
        });
        $scope.refreshInsurer = function (data) {
            var formdata = {};
            formdata.keyword = data;
            formdata.filter = {
                customerSegment: $scope.customerSegmentId
            }
            NavigationService.searchInsurerOffice(formdata, 1, function (data) {
                $scope.insurers = data.data.results;
            });
        };

        NavigationService.getOneModel("PolicyType", $stateParams.id, function (data) {
            $scope.formData = data.data;
        });
        $scope.cancel = function () {
            $window.history.back();
        }
        hotkeys.bindTo($scope).add({
            combo: 'ctrl+enter',
            callback: function (formData) {
                _.each(formData.insurer, function (n) {
                    n = n._id;
                });
                NavigationService.modelSave("PolicyType", $scope.formData, function (data) {
                    if (data.value === true) {
                        // $state.go('policyType-list');
                        $window.history.back();
                        toastr.success("PolicyType" + $scope.formData.name + " edited successfully.", "PolicyType" + " Edited");
                    } else {
                        toastr.error("PolicyType" + " edition failed.", "PolicyType" + " editing error");
                    }
                });
            }
        });
        $scope.saveModel = function (formData) {
            _.each(formData.insurer, function (n) {
                n = n._id;
            });
            NavigationService.modelSave("PolicyType", $scope.formData, function (data) {
                if (data.value === true) {
                    // $state.go('policyType-list');
                    $window.history.back();
                    toastr.success("PolicyType" + $scope.formData.name + " edited successfully.", "PolicyType" + " Edited");
                } else {
                    toastr.error("PolicyType" + " edition failed.", "PolicyType" + " editing error");
                }
            });
        };

    })
    .controller('PolicyCtrl', function ($scope, $window, TemplateService, NavigationService, $timeout) {
        //Used to name the .html file
        $scope.template = TemplateService.changecontent("policy-list");
        $scope.menutitle = NavigationService.makeactive("Policy List");
        TemplateService.title = $scope.menutitle;
        $scope.navigation = NavigationService.getnav();

        $scope.showAllPolicies = function () {
            NavigationService.getAllPolicies(function (data) {
                $scope.allPolicies = data.data;

            });
        };
        $scope.showAllPolicies();

        $scope.cancel = function () {
            $window.history.back();
        };

        $scope.deletePolicy = function (id) {

            NavigationService.deletePolicy({
                id: id
            }, function (data) {
                $scope.showAllPolicies();

            });
        };

    })
    .controller('CreatePolicyCtrl', function ($scope, $window, TemplateService, NavigationService, $timeout, $state) {
        //Used to name the .html file
        $scope.template = TemplateService.changecontent("policy-detail");
        $scope.menutitle = NavigationService.makeactive("Policy");
        TemplateService.title = $scope.menutitle;
        $scope.navigation = NavigationService.getnav();

        $scope.header = {
            "name": "Create Policy"
        };
        $scope.formData = {};
        $scope.cancel = function () {
            $window.history.back();
        };
        $scope.savePolicy = function (formData) {

            NavigationService.policySave($scope.formData, function (data) {
                console.log(data);
                if (data.value === true) {
                    $window.history.back();
                }

            });
        };
        NavigationService.getAllPolicyTypes(function (data) {
            $scope.allPolicyTypes = data.data;

        });

    })
    .controller('EditPolicyCtrl', function ($scope, $window, TemplateService, NavigationService, $timeout, $stateParams, $state) {
        //Used to name the .html file
        $scope.template = TemplateService.changecontent("policy-detail");
        $scope.menutitle = NavigationService.makeactive("Policy");
        TemplateService.title = $scope.menutitle;
        $scope.navigation = NavigationService.getnav();

        $scope.header = {
            "name": "Edit Policy"
        };

        NavigationService.getOnePolicy($stateParams.id, function (data) {
            $scope.formData = data.data;
        });
        $scope.cancel = function () {
            $window.history.back();
        };

        $scope.savePolicy = function (formValid) {

            //  if (formValid.$valid) {
            //  $scope.formComplete = true;
            NavigationService.PolicyEditSave($scope.formData, function (data) {
                if (data.value === true) {
                    // $state.go('policy-list');
                    $window.history.back();
                }
            });
            //  }
        };

        NavigationService.getAllPolicyTypes(function (data) {
            $scope.allPolicyTypes = data.data;

        });

    })

    .controller('PolicyDocCtrl', function ($scope, $window, TemplateService, NavigationService, $timeout) {
        //Used to name the .html file
        $scope.template = TemplateService.changecontent("policyDoc-list");
        $scope.menutitle = NavigationService.makeactive("Policy Document List");
        TemplateService.title = $scope.menutitle;
        $scope.navigation = NavigationService.getnav();

        $scope.showAllPolicyDocs = function () {
            NavigationService.getAllPolicyDocs(function (data) {
                $scope.allPolicyDocs = data.data;

            });
        };
        $scope.showAllPolicyDocs();

        $scope.deletePolicyDoc = function (id) {

            NavigationService.deletePolicyDoc({
                id: id
            }, function (data) {
                $scope.showAllPolicyDocs();

            });
        };

    })
    .controller('CreatePolicyDocCtrl', function ($scope, hotkeys, $window, $uibModal, TemplateService, NavigationService, $timeout, $state, $stateParams, toastr) {
        //Used to name the .html file
        $scope.template = TemplateService.changecontent("policyDoc-detail");
        $scope.menutitle = NavigationService.makeactive("Policy Document");
        TemplateService.title = $scope.menutitle;
        $scope.navigation = NavigationService.getnav();
        $scope.userStatus = [{
            "name": "Active",
            "value": true
        }, {
            "name": "Inactive",
            "value": false
        }];
        $scope.header = {
            "name": "Create Policy Doc"
        };
        $scope.formData = {};
        $scope.formData.status = true;
        $scope.formData.listOfDocuments = [];
        $scope.check = true;
        $scope.modelData = {};
        $scope.cancel = function () {
            $window.history.back();
        }
        hotkeys.bindTo($scope).add({
            combo: 'ctrl+enter',
            callback: function (formData) {
                if ($scope.check) {
                    console.log(formData);
                    NavigationService.modelSave("PolicyDoc", $scope.formData, function (data) {
                        $scope.check = false;
                        if (data.value === true) {
                            // $state.go('policyDoc-list');
                            $window.history.back();
                            toastr.success("Policy Document" + " " + formData.name + " created successfully.", "Policy Document" + " Created");
                        } else {
                            toastr.error("Policy Document" + " creation failed.", "Policy Document" + " creation error");
                        }
                    });
                }
            }
        });
        $scope.saveModel = function (formData) {
            if ($scope.check) {
                console.log(formData);
                NavigationService.modelSave("PolicyDoc", $scope.formData, function (data) {
                    $scope.check = false;
                    if (data.value === true) {
                        // $state.go('policyDoc-list');
                        $window.history.back();
                        toastr.success("Policy Document" + " " + formData.name + " created successfully.", "Policy Document" + " Created");
                    } else {
                        toastr.error("Policy Document" + " creation failed.", "Policy Document" + " creation error");
                    }
                });
            }
        };

        $scope.addDocument = function () {
            var modalInstance = $uibModal.open({
                scope: $scope,
                templateUrl: '/frontend/views/modal/modal-policydoc.html',
                size: 'lg'
            });
        };

        $scope.createOfficer = function (modelData) {
            if ($scope.buttonValue === "Save") {
                $scope.formData.listOfDocuments.push(modelData);
            } else {
                $scope.formData.listOfDocuments[$scope.formIndex] = modelData;
            }
        };
        $scope.openCreateOfficer = function () {
            $scope.buttonValue = "Save";
            $scope.modelData = {};
            $scope.addDocument();
        };
        $scope.openEditOfficer = function (index) {
            $scope.formIndex = index;
            $scope.buttonValue = "Edit";
            $scope.modelData = $scope.formData.listOfDocuments[index];
            $scope.addDocument();
        };
        $scope.deleteOfficer = function (index) {
            $scope.formData.listOfDocuments.splice(index, 1);
        };

        $scope.modelData.from = $scope.modelData.to = $scope.modelData.policyNo = null


        $scope.$watch("modelData.from", function (newVal, oldVal) {

            console.log(newVal);
            console.log(oldVal);
            $scope.modelData.from = newVal;
            $scope.abc($scope.modelData);
        });
        $scope.$watch("modelData.to", function (newVal, oldVal) {
            console.log(newVal);
            console.log(oldVal);
            $scope.modelData.to = newVal;
            $scope.abc($scope.modelData);
        });
        $scope.$watch("modelData.policyNo", function (newVal, oldVal) {
            console.log(newVal);
            console.log(oldVal);
            $scope.modelData.policyNo = newVal;
            $scope.abc($scope.modelData);
        });
        $scope.abc = function (modelData) {
            console.log("modelData", modelData);
            if (modelData.from && modelData.to && modelData.policyNo) {
                modelData.name = moment(modelData.from).format("DDMMMYY") + "-" + moment(modelData.to).format("DDMMMYY") + "-" + modelData.policyNo;
            }
        };



        $scope.dateOptions = {
            showWeeks: true
        };

        $scope.popup1 = {
            opened: false
        };
        $scope.popup2 = {
            opened: false
        };

        $scope.dateFrom = function () {
            $scope.popup1.opened = true;
        };
        $scope.dateTo = function () {
            $scope.popup2.opened = true;
        };

        $scope.format = 'dd-MMMM-yyyy';

    })
    .controller('EditPolicyDocCtrl', function ($scope, hotkeys, $window, TemplateService, NavigationService, $timeout, $uibModal, $stateParams, $state, toastr) {
        //Used to name the .html file
        $scope.template = TemplateService.changecontent("policyDoc-detail");
        $scope.menutitle = NavigationService.makeactive("Policy Document");
        TemplateService.title = $scope.menutitle;
        $scope.navigation = NavigationService.getnav();
        $scope.userStatus = [{
            "name": "Active",
            "value": true
        }, {
            "name": "Inactive",
            "value": false
        }];
        $scope.header = {
            "name": "Create Policy Doc"
        };
        $scope.formData = {};
        $scope.formData.listOfDocuments = [];
        $scope.modelData = {};
        NavigationService.getOneModel("PolicyDoc", $stateParams.id, function (data) {
            $scope.formData = data.data;

        });
        $scope.cancel = function () {
            $window.history.back();
        }
        hotkeys.bindTo($scope).add({
            combo: 'ctrl+enter',
            callback: function (formData) {
                console.log(formData);
                NavigationService.modelSave("PolicyDoc", $scope.formData, function (data) {
                    if (data.value === true) {
                        // $state.go('policyDoc-list');
                        $window.history.back();
                        toastr.success("Policy Document" + " " + formData.name + " created successfully.", "Policy Document" + " Created");
                    } else {
                        toastr.error("Policy Document" + " creation failed.", "Policy Document" + " creation error");
                    }
                });
            }
        });
        $scope.saveModel = function (formData) {
            console.log(formData);
            NavigationService.modelSave("PolicyDoc", $scope.formData, function (data) {
                if (data.value === true) {
                    // $state.go('policyDoc-list');
                    $window.history.back();
                    toastr.success("Policy Document" + " " + formData.name + " created successfully.", "Policy Document" + " Created");
                } else {
                    toastr.error("Policy Document" + " creation failed.", "Policy Document" + " creation error");
                }
            });
        };
        // 
        $scope.modelData.from = $scope.modelData.to = $scope.modelData.policyNo = null


        $scope.$watch("modelData.from", function (newVal, oldVal) {

            console.log(newVal);
            console.log(oldVal);
            $scope.modelData.from = newVal;
            $scope.abc($scope.modelData);
        });
        $scope.$watch("modelData.to", function (newVal, oldVal) {
            console.log(newVal);
            console.log(oldVal);
            $scope.modelData.to = newVal;
            $scope.abc($scope.modelData);
        });
        $scope.$watch("modelData.policyNo", function (newVal, oldVal) {
            console.log(newVal);
            console.log(oldVal);
            $scope.modelData.policyNo = newVal;
            $scope.abc($scope.modelData);
        });
        $scope.abc = function (modelData) {
            console.log("modelData", modelData);
            if (modelData.from && modelData.to && modelData.policyNo) {
                modelData.name = moment(modelData.from).format("DDMMMYY") + "-" + moment(modelData.to).format("DDMMMYY") + "-" + modelData.policyNo;
            }
        };
        // 
        $scope.addDocument = function () {
            var modalInstance = $uibModal.open({
                scope: $scope,
                templateUrl: '/frontend/views/modal/modal-policydoc.html',
                size: 'lg'
            });
        };

        $scope.createOfficer = function (modelData) {
            if ($scope.buttonValue === "Save") {
                $scope.formData.listOfDocuments.push(modelData);
            } else {
                $scope.formData.listOfDocuments[$scope.formIndex] = modelData;
            }
        };
        $scope.openCreateOfficer = function () {
            $scope.buttonValue = "Save";
            $scope.modelData = {};
            $scope.addDocument();
        };
        $scope.openEditOfficer = function (index) {
            $scope.formIndex = index;
            $scope.buttonValue = "Edit";
            $scope.modelData = $scope.formData.listOfDocuments[index];
            $scope.modelData.from = new Date($scope.formData.listOfDocuments[index].from);
            $scope.modelData.to = new Date($scope.formData.listOfDocuments[index].to);
            $scope.addDocument();
        };
        $scope.deleteOfficer = function (index) {
            $scope.formData.listOfDocuments.splice(index, 1);
        };



        $scope.dateOptions = {
            showWeeks: true
        };

        $scope.popup1 = {
            opened: false
        };
        $scope.popup2 = {
            opened: false
        };

        $scope.dateFrom = function () {
            $scope.popup1.opened = true;
        };
        $scope.dateTo = function () {
            $scope.popup2.opened = true;
        };

        $scope.format = 'dd-MMMM-yyyy';
    })

    .controller('IndustryCtrl', function ($scope, $window, TemplateService, NavigationService, $timeout, $stateParams, $state, toastr) {
        //Used to name the .html file
        $scope.template = TemplateService.changecontent("industry-list", $state);
        $scope.menutitle = NavigationService.makeactive("Industry List");
        TemplateService.title = $scope.menutitle;
        $scope.navigation = NavigationService.getnav();
        $scope.currentPage = $stateParams.page;
        var i = 0;
        $scope.search = {
            keyword: ""
        };
        if ($stateParams.keyword) {
            $scope.search.keyword = $stateParams.keyword;
        }
        $scope.showAllCountries = function (keywordChange) {
            $scope.totalItems = undefined;
            if (keywordChange) {
                $scope.currentPage = 1;
            }
            NavigationService.searchIndustry({
                page: $scope.currentPage,
                keyword: $scope.search.keyword
            }, ++i, function (data, ini) {
                console.log(data.data);

                if (ini == i) {
                    console.log(data.data);
                    $scope.allIndustries = data.data.results;
                    $scope.totalItems = data.data.total;
                    $scope.maxRow = data.data.options.count;

                }
            });
        };

        $scope.changePage = function (page) {
            var goTo = "industry-list";
            if ($scope.search.keyword) {
                goTo = "industry-list";
            }
            $state.go(goTo, {
                page: page,
                keyword: $scope.search.keyword
            });
        };
        $scope.showAllCountries();
        $scope.cancel = function () {
            $window.history.back();
        };
        $scope.deleteIndustry = function (id) {
            globalfunction.confDel(function (value) {
                console.log(value);
                if (value) {
                    NavigationService.deleteIndustry(id, function (data) {
                        if (data.value) {
                            $scope.showAllCountries();
                            toastr.success("Industry deleted successfully.", "Industry deleted");
                        } else {
                            toastr.error("There was an error while deleting Industry", "Industry deleting error");
                        }


                    });
                }
            });
        };
        $scope.changeStatus = function (ind) {
            NavigationService.industrySave(ind, function (data) {
                if (data.value === true) {
                    // $state.go('industry-list');
                    $window.history.back();
                }
            });
        };

    })
    .controller('CreateIndustryCtrl', function ($scope, hotkeys, $window, TemplateService, NavigationService, $timeout, $state, toastr) {
        //Used to name the .html file
        $scope.template = TemplateService.changecontent("industry-detail");
        $scope.menutitle = NavigationService.makeactive("Industry");
        TemplateService.title = $scope.menutitle;
        $scope.navigation = NavigationService.getnav();
        $scope.userStatus = [{
            "name": "Active",
            "value": true
        }, {
            "name": "Inactive",
            "value": false
        }];
        $scope.header = {
            "name": "Create Industry"
        };
        $scope.formData = {};
        $scope.cancel = function () {
            $window.history.back();
        };
        hotkeys.bindTo($scope).add({
            combo: 'ctrl+enter',
            callback: function (formData) {
                NavigationService.industrySave($scope.formData, function (data) {
                    if (data.value === true) {
                        $window.history.back();
                        toastr.success("Industry " + $scope.formData.name + " created successfully.", "Industry Created");
                    } else {
                        toastr.error("Industry creation failed.", "Industry creation error");
                    }
                });
            }
        });
        $scope.saveIndustry = function (formData) {
            NavigationService.industrySave($scope.formData, function (data) {
                if (data.value === true) {
                    $window.history.back();
                    toastr.success("Industry " + $scope.formData.name + " created successfully.", "Industry Created");
                } else {
                    toastr.error("Industry creation failed.", "Industry creation error");
                }
            });
        };

    })
    .controller('EditIndustryCtrl', function ($scope, hotkeys, $window, TemplateService, NavigationService, $timeout, $stateParams, $state, toastr) {
        //Used to name the .html file
        $scope.template = TemplateService.changecontent("industry-detail");
        $scope.menutitle = NavigationService.makeactive("Industry");
        TemplateService.title = $scope.menutitle;
        $scope.navigation = NavigationService.getnav();
        $scope.userStatus = [{
            "name": "Active",
            "value": true
        }, {
            "name": "Inactive",
            "value": false
        }];
        $scope.header = {
            "name": "Edit Industry"
        };

        NavigationService.getOneIndustry($stateParams.id, function (data) {
            $scope.formData = data.data;
        });

        $scope.cancel = function () {
            $window.history.back();
        };
        hotkeys.bindTo($scope).add({
            combo: 'ctrl+enter',
            callback: function (formData) {
                NavigationService.industrySave($scope.formData, function (data) {
                    if (data.value === true) {
                        // $state.go('industry-list');
                        $window.history.back();
                        toastr.success("Industry " + $scope.formData.name + " created successfully.", "Industry Created");
                    } else {
                        toastr.error("Industry creation failed.", "Industry creation error");
                    }
                });
            }
        });
        $scope.saveIndustry = function (formValid) {
            NavigationService.industrySave($scope.formData, function (data) {
                if (data.value === true) {
                    // $state.go('industry-list');
                    $window.history.back();
                    toastr.success("Industry " + $scope.formData.name + " created successfully.", "Industry Created");
                } else {
                    toastr.error("Industry creation failed.", "Industry creation error");
                }
            });
        };

    })
    .controller('CategoryCtrl', function ($scope, $window, TemplateService, NavigationService, $timeout, $stateParams, $state, toastr) {
        //Used to name the .html file
        $scope.template = TemplateService.changecontent("category-list", $state);
        $scope.menutitle = NavigationService.makeactive("Category List");
        TemplateService.title = $scope.menutitle;
        $scope.navigation = NavigationService.getnav();
        $scope.currentPage = $stateParams.page;
        var i = 0;
        $scope.search = {
            keyword: ""
        };
        if ($stateParams.keyword) {
            $scope.search.keyword = $stateParams.keyword;
        }
        $scope.showAllCountries = function (keywordChange) {
            $scope.totalItems = undefined;
            if (keywordChange) {
                $scope.currentPage = 1;
            }
            NavigationService.searchCategory({
                page: $scope.currentPage,
                keyword: $scope.search.keyword
            }, ++i, function (data, ini) {
                console.log(data.data);

                if (ini == i) {
                    console.log(data.data);
                    $scope.allCategories = data.data.results;
                    $scope.totalItems = data.data.total;
                    $scope.maxRow = data.data.options.count;

                }
            });
        };

        $scope.changePage = function (page) {
            var goTo = "category-list";
            if ($scope.search.keyword) {
                goTo = "category-list";
            }
            $state.go(goTo, {
                page: page,
                keyword: $scope.search.keyword
            });
        };
        $scope.showAllCountries();

        $scope.deleteCategory = function (id) {
            globalfunction.confDel(function (value) {
                if (value) {
                    NavigationService.deleteCategory(id, function (data) {
                        if (data.value) {
                            $scope.showAllCountries();
                            toastr.success("Category deleted successfully.", "Category deleted");
                        } else {
                            toastr.error("There was an error while deleting Category", "Category deleting error");
                        }


                    });
                }
            });
        };
        $scope.changeStatus = function (ind) {
            NavigationService.categorySave(ind, function (data) {
                if (data.value === true) {}
            });
        };
    })
    .controller('CreateCategoryCtrl', function ($scope, hotkeys, $window, TemplateService, NavigationService, $timeout, $state, toastr) {
        //Used to name the .html file
        $scope.template = TemplateService.changecontent("category-detail");
        $scope.menutitle = NavigationService.makeactive("Category");
        TemplateService.title = $scope.menutitle;
        $scope.navigation = NavigationService.getnav();
        $scope.userStatus = [{
            "name": "Active",
            "value": true
        }, {
            "name": "Inactive",
            "value": false
        }];
        $scope.header = {
            "name": "Create Category"
        };
        $scope.formData = {};
        $scope.cancel = function () {
            $window.history.back();
        };
        hotkeys.bindTo($scope).add({
            combo: 'ctrl+enter',
            callback: function (formData) {
                NavigationService.categorySave($scope.formData, function (data) {
                    if (data.value === true) {
                        $window.history.back();
                        toastr.success("Category " + formData.name + " created successfully.", "Category Created");
                    } else {
                        toastr.error("Category creation failed.", "Category creation error");
                    }
                });
            }
        });
        $scope.saveCategory = function (formData) {
            NavigationService.categorySave($scope.formData, function (data) {
                if (data.value === true) {
                    $window.history.back();
                    toastr.success("Category " + formData.name + " created successfully.", "Category Created");
                } else {
                    toastr.error("Category creation failed.", "Category creation error");
                }
            });
        };
    })
    .controller('EditCategoryCtrl', function ($scope, hotkeys, $window, TemplateService, NavigationService, $timeout, $stateParams, $state, toastr) {
        //Used to name the .html file
        $scope.template = TemplateService.changecontent("category-detail");
        $scope.menutitle = NavigationService.makeactive("Category");
        TemplateService.title = $scope.menutitle;
        $scope.navigation = NavigationService.getnav();
        $scope.userStatus = [{
            "name": "Active",
            "value": true
        }, {
            "name": "Inactive",
            "value": false
        }];
        $scope.header = {
            "name": "Edit Category"
        };

        NavigationService.getOneCategory($stateParams.id, function (data) {
            $scope.formData = data.data;
            console.log('$scope.formData', $scope.formData);

        });
        $scope.cancel = function () {
            $window.history.back();
        };
        hotkeys.bindTo($scope).add({
            combo: 'ctrl+enter',
            callback: function (formData) {
                NavigationService.categorySave($scope.formData, function (data) {
                    if (data.value === true) {
                        $window.history.back();
                        toastr.success("Category " + $scope.formData.name + " edited successfully.", "Category Edited");
                    } else {
                        toastr.error("Category edition failed.", "Category editing error");
                    }
                });
            }
        });
        $scope.saveCategory = function (formValid) {
            NavigationService.categorySave($scope.formData, function (data) {
                if (data.value === true) {
                    $window.history.back();
                    toastr.success("Category " + $scope.formData.name + " edited successfully.", "Category Edited");
                } else {
                    toastr.error("Category edition failed.", "Category editing error");
                }
            });
        };
    })

    .controller('FuncCtrl', function ($scope, $window, TemplateService, NavigationService, $timeout) {
        //Used to name the .html file
        $scope.template = TemplateService.changecontent("func-list");
        $scope.menutitle = NavigationService.makeactive("Function List");
        TemplateService.title = $scope.menutitle;
        $scope.navigation = NavigationService.getnav();

        $scope.showAllFunc = function () {
            NavigationService.getAllFunc(function (data) {
                $scope.allFunc = data.data;

            });
        };
        $scope.showAllFunc();

        $scope.deleteFunc = function (id) {

            NavigationService.deleteFunc({
                id: id
            }, function (data) {
                $scope.showAllFunc();

            });
        };

    })
    .controller('CreateFuncCtrl', function ($scope, $window, TemplateService, NavigationService, $timeout, $state) {
        //Used to name the .html file
        $scope.template = TemplateService.changecontent("func-detail");
        $scope.menutitle = NavigationService.makeactive("Function");
        TemplateService.title = $scope.menutitle;
        $scope.navigation = NavigationService.getnav();

        $scope.header = {
            "name": "Create Function"
        };
        $scope.formData = {};
        $scope.saveFunc = function (formData) {

            NavigationService.funcSave($scope.formData, function (data) {
                console.log(data);
                if (data.value === true) {
                    $window.history.back();
                }

            });
        };

    })
    .controller('EditFuncCtrl', function ($scope, $window, TemplateService, NavigationService, $timeout, $stateParams, $state) {
        //Used to name the .html file
        $scope.template = TemplateService.changecontent("func-detail");
        $scope.menutitle = NavigationService.makeactive("Function");
        TemplateService.title = $scope.menutitle;
        $scope.navigation = NavigationService.getnav();

        $scope.header = {
            "name": "Edit Function"
        };

        NavigationService.getOneFunc($stateParams.id, function (data) {
            $scope.formData = data.data;
            console.log('$scope.formData', $scope.formData);

        });

        $scope.saveFunc = function (formValid) {

            //  if (formValid.$valid) {
            //  $scope.formComplete = true;
            NavigationService.FuncEditSave($scope.formData, function (data) {
                if (data.value === true) {
                    // $state.go('func-list');
                    $window.history.back();
                }
            });
        };

    })
    .controller('CauseLossCtrl', function ($scope, hotkeys, $window, TemplateService, NavigationService, $timeout) {
        //Used to name the .html file
        $scope.template = TemplateService.changecontent("causeLoss-list");
        $scope.menutitle = NavigationService.makeactive("Cause of Loss List");
        TemplateService.title = $scope.menutitle;
        $scope.navigation = NavigationService.getnav();

        $scope.showAllCauseLoss = function () {
            NavigationService.getAllCauseLoss(function (data) {
                $scope.allCauseLoss = data.data;

            });
        };
        $scope.showAllCauseLoss();

        $scope.deleteCauseLoss = function (id) {

            NavigationService.deleteCauseLoss({
                id: id
            }, function (data) {
                $scope.showAllCauseLoss();

            });
        };

    })
    .controller('CreateCauseLossCtrl', function ($scope, hotkeys, $window, TemplateService, NavigationService, $timeout, $state, $stateParams, toastr) {
        //Used to name the .html file
        $scope.template = TemplateService.changecontent("causeLoss-detail");
        $scope.menutitle = NavigationService.makeactive("Cause of Loss");
        TemplateService.title = $scope.menutitle;
        $scope.navigation = NavigationService.getnav();
        $scope.userStatus = [{
            "name": "Active",
            "value": true
        }, {
            "name": "Inactive",
            "value": false
        }];
        $scope.header = {
            "name": "Create Cause of Loss"
        };
        $scope.natureOfLosses = ['Fire', 'Theft', 'Burglary'];
        $scope.formData = {};
        $scope.tagTransform = function (newTag) {
            var item = {
                name: newTag
            };
            return item;
        };

        $scope.departments = [];
        $scope.refreshDepartments = function (data) {
            console.log("Data Inn", data);
            var formdata = {};
            formdata.keyword = data;
            NavigationService.searchDepartment(formdata, 1, function (data) {
                $scope.departments = data.data.results;
            });
        };
        $scope.refreshDepartments();

        $scope.refreshNature = function (data) {
            var formdata = {};
            formdata.keyword = data;
            NavigationService.getNature(formdata, 1, function (data) {
                $scope.natureOfLosses = data.data.results;
            });
        };
        $scope.refreshNature();
        $scope.clicked = function (select) {
            console.log("fsdfasd");
            console.log(select[select.length - 1].name);
            NavigationService.saveNature({
                'name': select[select.length - 1].name
            }, function (data) {
                $scope.formData.natureOfLoss[$scope.formData.natureOfLoss.length - 1] = data.data;
            });
        };
        $scope.cancel = function () {
            $window.history.back();
        }
        hotkeys.bindTo($scope).add({
            combo: 'ctrl+enter',
            callback: function (formData) {
                NavigationService.modelSave("CauseLoss", $scope.formData, function (data) {
                    if (data.value === true) {
                        // $state.go('causeLoss' + '-list');
                        $window.history.back();
                        toastr.success("Customer" + " " + formData.name + " created successfully.", "Customer" + " Created");
                    } else {
                        toastr.error("Customer" + " creation failed.", "Customer" + " creation error");
                    }
                });
            }
        });
        $scope.saveModel = function (formData) {
            NavigationService.modelSave("CauseLoss", $scope.formData, function (data) {
                if (data.value === true) {
                    // $state.go('causeLoss' + '-list');
                    $window.history.back();
                    toastr.success("Customer" + " " + formData.name + " created successfully.", "Customer" + " Created");
                } else {
                    toastr.error("Customer" + " creation failed.", "Customer" + " creation error");
                }
            });
        };

    })
    .controller('EditCauseLossCtrl', function ($scope, hotkeys, $window, TemplateService, NavigationService, $timeout, $stateParams, $state, toastr) {
        //Used to name the .html file
        $scope.template = TemplateService.changecontent("causeLoss-detail");
        $scope.menutitle = NavigationService.makeactive("Cause of Loss");
        TemplateService.title = $scope.menutitle;
        $scope.navigation = NavigationService.getnav();
        $scope.userStatus = [{
            "name": "Active",
            "value": true
        }, {
            "name": "Inactive",
            "value": false
        }];
        $scope.header = {
            "name": "Edit Cause of Loss"
        };
        $scope.natureOfLosses = ['Fire', 'Theft', 'Burglary'];

        $scope.tagTransform = function (newTag) {
            var item = {
                name: newTag
            };
            return item;
        };

        $scope.departments = [];
        $scope.refreshDepartments = function (data) {
            console.log("Data Inn", data);
            var formdata = {};
            formdata.keyword = data;
            NavigationService.searchDepartment(formdata, 1, function (data) {
                $scope.departments = data.data.results;
            });
        };
        $scope.refreshDepartments();

        $scope.refreshNature = function (data) {
            var formdata = {};
            formdata.keyword = data;
            NavigationService.getNature(formdata, 1, function (data) {
                $scope.natureOfLosses = data.data.results;
            });
        };
        $scope.refreshNature();
        $scope.clicked = function (select) {
            NavigationService.saveNature({
                'name': select[select.length - 1].name
            }, function (data) {
                $scope.formData.natureOfLoss[$scope.formData.natureOfLoss.length - 1] = data.data;
            });
        };

        NavigationService.getOneModel("CauseLoss", $stateParams.id, function (data) {
            $scope.formData = data.data;
        });
        $scope.cancel = function () {
            $window.history.back();
        }
        hotkeys.bindTo($scope).add({
            combo: 'ctrl+enter',
            callback: function (formData) {
                NavigationService.modelSave("CauseLoss", $scope.formData, function (data) {
                    if (data.value === true) {
                        $window.history.back();
                        toastr.success("Cause Of Loss" + $scope.formData.name + " edited successfully.", "Cause Of Loss" + " Edited");
                    } else {
                        toastr.error("Cause Of Loss" + " edition failed.", "Cause Of Loss" + " editing error");
                    }
                });
            }
        });
        $scope.saveModel = function (formValid) {
            NavigationService.modelSave("CauseLoss", $scope.formData, function (data) {
                if (data.value === true) {
                    $window.history.back();
                    toastr.success("Cause Of Loss" + $scope.formData.name + " edited successfully.", "Cause Of Loss" + " Edited");
                } else {
                    toastr.error("Cause Of Loss" + " edition failed.", "Cause Of Loss" + " editing error");
                }
            });
        };

    })
    .controller('NatureLossCtrl', function ($scope, $window, TemplateService, NavigationService, $timeout) {
        //Used to name the .html file
        $scope.template = TemplateService.changecontent("natureLoss-list");
        $scope.menutitle = NavigationService.makeactive("Nature of Loss List");
        TemplateService.title = $scope.menutitle;
        $scope.navigation = NavigationService.getnav();

        $scope.showAllNatureLoss = function () {
            NavigationService.getAllNatureLoss(function (data) {
                $scope.allNatureLoss = data.data;

            });
        };
        $scope.showAllNatureLoss();

        $scope.deleteNatureLoss = function (id) {

            NavigationService.deleteNatureLoss({
                id: id
            }, function (data) {
                $scope.showAllNatureLoss();

            });
        };

    })
    .controller('CreateNatureLossCtrl', function ($scope, hotkeys, $window, TemplateService, NavigationService, $timeout, $state) {
        //Used to name the .html file
        $scope.template = TemplateService.changecontent("natureLoss-detail");
        $scope.menutitle = NavigationService.makeactive("Nature of Loss");
        TemplateService.title = $scope.menutitle;
        $scope.navigation = NavigationService.getnav();
        $scope.userStatus = [{
            "name": "Active",
            "value": true
        }, {
            "name": "Inactive",
            "value": false
        }];
        $scope.header = {
            "name": "Create Nature Loss"
        };
        $scope.formData = {};
        $scope.cancel = function () {
            $window.history.back();
        };
        hotkeys.bindTo($scope).add({
            combo: 'ctrl+enter',
            callback: function (formData) {
                NavigationService.naturelossSave($scope.formData, function (data) {
                    console.log(data);
                    if (data.value === true) {
                        $window.history.back();
                    }

                });
            }
        });
        $scope.saveNatureLoss = function (formData) {
            NavigationService.naturelossSave($scope.formData, function (data) {
                console.log(data);
                if (data.value === true) {
                    $window.history.back();
                }

            });
        };
        NavigationService.getAllDepartments(function (data) {
            $scope.allDepartments = data.data;

        });
        NavigationService.getAllCauseLoss(function (data) {
            $scope.allCauseLoss = data.data;

        });

    })
    .controller('EditNatureLossCtrl', function ($scope, hotkeys, $window, TemplateService, NavigationService, $timeout, $stateParams, $state) {
        //Used to name the .html file
        $scope.template = TemplateService.changecontent("natureLoss-detail");
        $scope.menutitle = NavigationService.makeactive("Nature of Loss");
        TemplateService.title = $scope.menutitle;
        $scope.navigation = NavigationService.getnav();
        $scope.userStatus = [{
            "name": "Active",
            "value": true
        }, {
            "name": "Inactive",
            "value": false
        }];
        $scope.header = {
            "name": "Edit Nature Loss"
        };

        NavigationService.getOneNatureLoss($stateParams.id, function (data) {
            $scope.formData = data.data;
            console.log('$scope.formData', $scope.formData);

        });
        $scope.cancel = function () {
            $window.history.back();
        };
        hotkeys.bindTo($scope).add({
            combo: 'ctrl+enter',
            callback: function (formData) {
                NavigationService.NatureLossEditSave($scope.formData, function (data) {
                    if (data.value === true) {
                        // $state.go('natureloss-list');
                        $window.history.back();
                    }
                });
            }
        });
        $scope.saveNatureLoss = function (formValid) {

            //  if (formValid.$valid) {
            //  $scope.formComplete = true;
            NavigationService.NatureLossEditSave($scope.formData, function (data) {
                if (data.value === true) {
                    // $state.go('natureloss-list');
                    $window.history.back();
                }
            });
        };
        NavigationService.getAllDepartments(function (data) {
            $scope.allDepartments = data.data;

        });
        NavigationService.getAllCauseLoss(function (data) {
            $scope.allCauseLoss = data.data;

        });
    })
    .controller('BusinessBranchCtrl', function ($scope, $window, TemplateService, NavigationService, $timeout) {
        //Used to name the .html file
        $scope.template = TemplateService.changecontent("businessBranch-list");
        $scope.menutitle = NavigationService.makeactive("Business Branch List");
        TemplateService.title = $scope.menutitle;
        $scope.navigation = NavigationService.getnav();

        $scope.showAllBusinessBranch = function () {
            NavigationService.getAllBusinessBranch(function (data) {
                $scope.allBusinessBranch = data.data;

            });
        };
        $scope.showAllBusinessBranch();

        $scope.deleteBusinessBranch = function (id) {

            NavigationService.deleteBusinessBranch({
                id: id
            }, function (data) {
                $scope.showAllBusinessBranch();

            });
        };

    })
    .controller('CreateBusinessBranchCtrl', function ($scope, $window, TemplateService, NavigationService, $timeout, $state) {
        //Used to name the .html file
        $scope.template = TemplateService.changecontent("businessBranch-detail");
        $scope.menutitle = NavigationService.makeactive("Business Branch");
        TemplateService.title = $scope.menutitle;
        $scope.navigation = NavigationService.getnav();

        $scope.header = {
            "name": "Create Business Branch"
        };
        $scope.formData = {};
        $scope.saveBusinessBranch = function (formData) {

            $scope.cancel = function () {
                $window.history.back();
            };

            NavigationService.businessbranchSave($scope.formData, function (data) {
                console.log(data);
                if (data.value === true) {
                    $window.history.back();
                }

            });
        };

    })
    .controller('EditBusinessBranchCtrl', function ($scope, $window, TemplateService, NavigationService, $timeout, $stateParams, $state) {
        //Used to name the .html file
        $scope.template = TemplateService.changecontent("businessBranch-detail");
        $scope.menutitle = NavigationService.makeactive("Business Branch");
        TemplateService.title = $scope.menutitle;
        $scope.navigation = NavigationService.getnav();

        $scope.header = {
            "name": "Edit Business Branch"
        };

        NavigationService.getOneBusinessBranch($stateParams.id, function (data) {
            $scope.formData = data.data;
            console.log('$scope.formData', $scope.formData);

        });
        $scope.cancel = function () {
            $window.history.back();
        };
        $scope.saveBusinessBranch = function (formValid) {

            //  if (formValid.$valid) {
            //  $scope.formComplete = true;
            NavigationService.BusinessBranchEditSave($scope.formData, function (data) {
                if (data.value === true) {
                    // $state.go('businessbranch-list');
                    $window.history.back();
                }
            });
        };
    })









    .controller('MenuCtrl', function ($scope, $window, TemplateService, NavigationService, $timeout) {
        //Used to name the .html file
        $scope.template = TemplateService.changecontent("menu-list");
        $scope.menutitle = NavigationService.makeactive("Menu List");
        TemplateService.title = $scope.menutitle;
        $scope.navigation = NavigationService.getnav();
        $scope.showAllMenus = function () {
            NavigationService.getAllMenus(function (data) {
                $scope.allMenus = data.data;
                console.log('$scope.allMenus', $scope.allZones);
            });

        };
        $scope.showAllMenus();

        $scope.cancel = function () {
            $window.history.back();
        };
        $scope.deleteMenu = function (id) {

            NavigationService.deleteMenu({
                id: id
            }, function (data) {
                $scope.showAllMenus();

            });
        };


    })
    .controller('CreateMenuCtrl', function ($scope, $window, TemplateService, NavigationService, $timeout, $state) {
        //Used to name the .html file
        $scope.template = TemplateService.changecontent("menu-detail");
        $scope.menutitle = NavigationService.makeactive("Menu");
        TemplateService.title = $scope.menutitle;
        $scope.navigation = NavigationService.getnav();
        $scope.userStatus = [{
            "name": "Active",
            "value": true
        }, {
            "name": "Inactive",
            "value": false
        }];
        $scope.header = {
            "name": "Create Menu"
        };
        $scope.formData = {};
        $scope.cancel = function () {
            $window.history.back();
        };
        $scope.saveMenu = function (formData) {

            NavigationService.menuSave($scope.formData, function (data) {
                console.log(data);
                if (data.value === true) {
                    $window.history.back();
                }

            });
        };

        // NavigationService.getAllCountries(function(data) {
        //     $scope.allCountries = data.data;
        //     console.log('$scope.allCountries', $scope.allCountries);
        //
        // });

    })
    .controller('EditMenuCtrl', function ($scope, $window, TemplateService, NavigationService, $timeout, $stateParams, $state) {
        //Used to name the .html file
        $scope.template = TemplateService.changecontent("menu-detail");
        $scope.menutitle = NavigationService.makeactive("Menu");
        TemplateService.title = $scope.menutitle;
        $scope.navigation = NavigationService.getnav();
        $scope.userStatus = [{
            "name": "Active",
            "value": true
        }, {
            "name": "Inactive",
            "value": false
        }];
        $scope.header = {
            "name": "Edit Menu"
        };

        NavigationService.getOneMenu($stateParams.id, function (data) {
            $scope.formData = data.data;

        });
        $scope.cancel = function () {
            $window.history.back();
        };
        $scope.saveMenu = function (formValid) {

            //  if (formValid.$valid) {
            //  $scope.formComplete = true;
            NavigationService.menuEditSave($scope.formData, function (data) {
                if (data.value === true) {
                    // $state.go('menu-list');
                    $window.history.back();
                }
            });
            //  }
        };

        // NavigationService.getAllCountries(function(data) {
        //     $scope.allCountries = data.data;
        //     console.log('$scope.allCountries', $scope.allCountries);
        //
        // });

    })









    .controller('RoleCtrl', function ($scope, $window, TemplateService, NavigationService, $timeout) {
        //Used to name the .html file
        $scope.template = TemplateService.changecontent("role-list");
        $scope.menutitle = NavigationService.makeactive("Role List");
        TemplateService.title = $scope.menutitle;
        $scope.navigation = NavigationService.getnav();
        $scope.showAllRoles = function () {
            NavigationService.getAllRoles(function (data) {
                $scope.allRoles = data.data;
                console.log('$scope.allRoles', $scope.allZones);
            });

        };
        $scope.showAllRoles();

        $scope.cancel = function () {
            $window.history.back();
        };

        $scope.deleteRole = function (id) {

            NavigationService.deleteRole({
                id: id
            }, function (data) {
                $scope.showAllRoles();

            });
        };


    })
    .controller('RolessCtrl', function ($scope, $window, TemplateService, NavigationService, $timeout, $stateParams, $state, toastr) {
        //Used to name the .html file
        $scope.template = TemplateService.changecontent("roles-list");
        $scope.menutitle = NavigationService.makeactive("Roles List");
        TemplateService.title = $scope.menutitle;
        $scope.navigation = NavigationService.getnav();
        var i = 0;
        $scope.search = {
            keyword: ""
        };
        if ($stateParams.keyword) {
            $scope.search.keyword = $stateParams.keyword;
        }
        $scope.changePage = function (page) {
            var goTo = "roles-list";
            if ($scope.search.keyword) {
                goTo = "roles-list";
            }
            console.log("Page", page);
            $state.go(goTo, {
                page: page,
                keyword: $scope.search.keyword
            });
        };
        $scope.showAll = function (keywordChange) {
            $scope.totalItems = undefined;
            if (keywordChange) {
                $scope.currentPage = 1;
            } else {
                $scope.currentPage = $stateParams.page;
            }
            NavigationService.searchModel("Role", {
                page: $scope.currentPage,
                keyword: $scope.search.keyword,
            }, ++i, function (data, ini) {
                if (ini == i) {
                    $scope.modelList = data.data.results;
                    $scope.totalItems = data.data.total;
                    $scope.maxRow = data.data.options.count;
                }
            });
        };
        $scope.showAll();

        $scope.deleteRole = function (id) {
            NavigationService.deleteRole({
                _id: id
            }, function (data) {
                $scope.showAll();

            });
        };
        $scope.deleteModel = function (id) {
            console.log("Delete Id", id);
            globalfunction.confDel(function (value) {
                console.log("Delete value", value);
                if (value) {
                    NavigationService.deleteModel("Role", id, function (data) {
                        if (data.value) {
                            $scope.showAll();
                            toastr.success($scope.modelCap + " deleted successfully.", $scope.modelCap + " deleted");
                        } else {
                            toastr.error("There was an error while deleting " + $scope.modelCap, $scope.modelCap + " deleting error");
                        }


                    });
                }
            });
        };


    })
    .controller('RoleEditCtrl', function ($scope, $window, TemplateService, NavigationService, $timeout, $stateParams, $state, toastr) {
        //Used to name the .html file
        $scope.template = TemplateService.changecontent("roles");
        $scope.menutitle = NavigationService.makeactive("Roles");
        TemplateService.title = $scope.menutitle;
        $scope.navigation = NavigationService.getnav();
        $scope.formData = {};
        NavigationService.getOneModel("Role", $stateParams.id, function (data) {
            $scope.formData = data.data;

            $scope.formData.roles = NavigationService.getRoleSingle([{
                roles: getAllRoles()
            }, data.data]).roles;
        });
        $scope.saveModel = function (formData) {
            NavigationService.modelSave("Role", $scope.formData, function (data) {
                if (data.value === true) {
                    $window.history.back();
                    toastr.success($scope.modelCap + " " + formData.name + " created successfully.", $scope.modelCap + " Created");
                } else {
                    toastr.error($scope.modelCap + " creation failed.", $scope.modelCap + " creation error");
                }
            });
        };
    })
    .controller('CreateRoleCtrl', function ($scope, $window, TemplateService, NavigationService, $timeout, $state) {
        //Used to name the .html file
        $scope.template = TemplateService.changecontent("role-detail");
        $scope.menutitle = NavigationService.makeactive("Role");
        TemplateService.title = $scope.menutitle;
        $scope.navigation = NavigationService.getnav();

        $scope.header = {
            "name": "Create Role"
        };
        $scope.formData = {};
        $scope.UserType = ['internal', 'external'];
        $scope.cancel = function () {
            $window.history.back();
        };
        $scope.saveRole = function (formData) {

            NavigationService.roleSave($scope.formData, function (data) {
                console.log(data);
                if (data.value === true) {
                    $window.history.back();
                }

            });
        };

        NavigationService.getAllMenus(function (data) {
            $scope.allMenus = data.data;
            console.log('$scope.allMenus', $scope.allZones);
        });

    })
    .controller('EditRoleCtrl', function ($scope, $window, TemplateService, NavigationService, $timeout, $stateParams, $state) {
        //Used to name the .html file
        $scope.template = TemplateService.changecontent("role-detail");
        $scope.menutitle = NavigationService.makeactive("Role");
        TemplateService.title = $scope.menutitle;
        $scope.navigation = NavigationService.getnav();

        $scope.header = {
            "name": "Edit Role"
        };
        $scope.UserType = ['internal', 'external'];
        NavigationService.getOneRole($stateParams.id, function (data) {
            $scope.formData = data.data;
        });
        $scope.cancel = function () {
            $window.history.back();
        };
        $scope.saveRole = function (formValid) {
            NavigationService.roleEditSave($scope.formData, function (data) {
                if (data.value === true) {
                    $window.history.back();
                }
            });
            //  }
        };

        NavigationService.getAllMenus(function (data) {
            $scope.allMenus = data.data;
            console.log('$scope.allMenus', $scope.allZones);
        });

    })









    .controller('UserCtrl', function ($scope, $window, TemplateService, NavigationService, $timeout) {
        //Used to name the .html file
        $scope.template = TemplateService.changecontent("user-list");
        $scope.menutitle = NavigationService.makeactive("User List");
        TemplateService.title = $scope.menutitle;
        $scope.navigation = NavigationService.getnav();
        $scope.UserType = ['internal', 'external'];
        $scope.showAllUsers = function () {
            NavigationService.getAllUsers(function (data) {
                $scope.allUsers = data.data;
                console.log('$scope.allUsers', $scope.allZones);
            });

        };
        $scope.showAllUsers();


        $scope.deleteUser = function (id) {
            $scope.cancel = function () {
                $window.history.back();
            };
            NavigationService.deleteUser({
                id: id
            }, function (data) {
                $scope.showAllUsers();

            });
        };


    })
    .controller('CreateUserCtrl', function ($scope, $window, TemplateService, NavigationService, $timeout, $state) {
        //Used to name the .html file
        $scope.template = TemplateService.changecontent("user-detail");
        $scope.menutitle = NavigationService.makeactive("User");
        TemplateService.title = $scope.menutitle;
        $scope.navigation = NavigationService.getnav();
        $scope.UserType = ['internal', 'external'];
        $scope.header = {
            "name": "Create User"
        };
        $scope.UserType = ['internal', 'external'];
        $scope.userStatus = [{
            "name": "Active",
            "value": true
        }, {
            "name": "Inactive",
            "value": false
        }];
        $scope.formData = {};
        $scope.UserType = ['internal', 'external'];
        $scope.saveUser = function (formData) {

            NavigationService.userSave($scope.formData, function (data) {
                console.log(data);
                if (data.value === true) {
                    $window.history.back();
                }

            });
        };
        $scope.cancel = function () {
            $window.history.back();
        };
        NavigationService.getAllMenus(function (data) {
            $scope.allMenus = data.data;
            console.log('$scope.allMenus', $scope.allZones);
        });
        NavigationService.getAllRoles(function (data) {
            $scope.allRoles = data.data;
            console.log('$scope.allRoles', $scope.allZones);
        });
        NavigationService.getAllDepartments(function (data) {
            $scope.allDepartments = data.data;

        });

    })
    .controller('EditUserCtrl', function ($scope, $window, TemplateService, NavigationService, $timeout, $stateParams, $state) {
        //Used to name the .html file
        $scope.template = TemplateService.changecontent("user-detail");
        $scope.menutitle = NavigationService.makeactive("User");
        TemplateService.title = $scope.menutitle;
        $scope.navigation = NavigationService.getnav();
        $scope.UserType = ['internal', 'external'];
        $scope.header = {
            "name": "Edit User"
        };

        $scope.UserRole = [{
            user_type: '',
            roleName: '',
            menu: '',
            roleDescription: ''
        }];
        console.log('addd', $scope.UserRole);

        $scope.UserType = ['internal', 'external'];
        $scope.userStatus = [{
            "name": "Active",
            "value": true
        }, {
            "name": "Inactive",
            "value": false
        }];
        $scope.UserType = ['internal', 'external'];
        NavigationService.getOneUser($stateParams.id, function (data) {
            $scope.UserRole = data.data.role;
            console.log('inside', $scope.UserRole);
            $scope.formData = data.data;
            console.log('$scope.formData', $scope.formData);

        });
        $scope.cancel = function () {
            $window.history.back();
        };
        $scope.saveUser = function (formValid) {

            //  if (formValid.$valid) {
            //  $scope.formComplete = true;
            NavigationService.userEditSave($scope.formData, function (data) {
                if (data.value === true) {
                    // $state.go('user-list');
                    $window.history.back();
                }
            });
            //  }
        };

        NavigationService.getAllMenus(function (data) {
            $scope.allMenus = data.data;
            console.log('$scope.allMenus', $scope.allZones);
        });
        NavigationService.getAllRoles(function (data) {
            $scope.allRoles = data.data;
            console.log('$scope.allRoles', $scope.allZones);
        });
        NavigationService.getAllDepartments(function (data) {
            $scope.allDepartments = data.data;

        });

    })

    .controller('BranchCreateCtrl', function ($scope, hotkeys, $window, TemplateService, NavigationService, $timeout, toastr, $state) {
        //Used to name the .html file
        $scope.template = TemplateService.changecontent("branch-create");
        $scope.menutitle = NavigationService.makeactive("Create Branch");
        TemplateService.title = $scope.menutitle;
        $scope.navigation = NavigationService.getnav();
        $scope.formData = {};
        $scope.header = {
            "name": "Create Branch Master"
        };
        $scope.cancel = function () {
            $window.history.back();
        };

        hotkeys.bindTo($scope).add({
            combo: 'ctrl+enter',
            callback: function (formData) {
                $scope.hideSaveCancel = true;
                NavigationService.branchSave($scope.formData, function (data) {
                    if (data.value === true) {
                        $window.history.back();
                        toastr.success("Branch " + $scope.formData.name + " created successfully.", "Branch Created");
                    } else {
                        toastr.error("Branch creation failed.", "Branch creation error");
                    }
                });
            }
        });

        $scope.submit = function (formData) {
            NavigationService.branchSave($scope.formData, function (data) {
                if (data.value === true) {
                    $window.history.back();
                    toastr.success("Branch " + $scope.formData.name + " created successfully.", "Branch Created");
                } else {
                    toastr.error("Branch creation failed.", "Branch creation error");
                }
            });
        };
    })
    .controller('BranchEditCtrl', function ($scope, hotkeys, $window, TemplateService, NavigationService, $timeout, $stateParams, $state, toastr) {
        //Used to name the .html file
        $scope.template = TemplateService.changecontent("branch-create");
        $scope.menutitle = NavigationService.makeactive("Edit Branch");
        TemplateService.title = $scope.menutitle;
        $scope.navigation = NavigationService.getnav();

        $scope.header = {
            "name": "Edit Branch"
        };
        NavigationService.getOneBranch($stateParams.id, function (data) {
            $scope.formData = data.data;
            $scope.formData.company = data.data.office.company;

        });
        $scope.cancel = function () {
            $window.history.back();
        };

        hotkeys.bindTo($scope).add({
            combo: 'ctrl+enter',
            callback: function (formData) {
                $scope.hideSaveCancel = true;
                NavigationService.branchSave($scope.formData, function (data) {
                    if (data.value === true) {
                        $window.history.back();
                        toastr.success("Branch " + $scope.formData.name + " edited successfully.", "Branch Edited");
                    } else {
                        toastr.error("Branch edition failed.", "Branch editing error");
                    }
                });
            }
        });

        $scope.submit = function (formValid) {
            NavigationService.branchSave($scope.formData, function (data) {
                if (data.value === true) {
                    $window.history.back();
                    toastr.success("Branch " + $scope.formData.name + " edited successfully.", "Branch Edited");
                } else {
                    toastr.error("Branch edition failed.", "Branch editing error");
                }
            });
        };
    })

    .controller('headerctrl', function ($scope, $window, $rootScope, TemplateService, $state, $uibModal) {

        $scope.template = TemplateService;
        $rootScope.isMobile = false;
        $scope.$on('$stateChangeSuccess', function (event, toState, toParams, fromState, fromParams) {
            $(window).scrollTop(0);
            // if viewable is not there in navigation state send to dashboard
        });


        if (screen.width > 600) {
            $rootScope.isMobile = false;
        } else {
            $rootScope.isMobile = true;
            var splitUrl = adminurl.split('api/')
            $rootScope.mobileUrl = splitUrl[0] + "mobile/index.html#/app/filterResult";
            console.log("$rootScope.isMobile", splitUrl[0]);
        }


        $scope.processForm = function (event) {
            var element = angular.element(event.target);
            //Old Class
            console.log("OLD CLASS : " + element.attr('class'));

        };


        globalfunction.confDel = function (callback) {

            var modalInstance = $uibModal.open({
                animation: $scope.animationsEnabled,
                templateUrl: '/frontend/views/modal/conf-delete.html',
                size: 'sm',
                scope: $scope
            });
            $scope.close = function (value) {
                callback(value);
                modalInstance.close("cancel");
            };
        };
        globalfunction.confInvoice = function (callback) {

            var modalInstance = $uibModal.open({
                animation: $scope.animationsEnabled,
                templateUrl: '/frontend/views/modal/conf-invoice.html',
                size: 'sm',
                scope: $scope
            });
            $scope.close = function (value) {
                callback(value);
                modalInstance.close("cancel");
            };
        };
        globalfunction.confCancel = function (callback) {

            var modalInstance = $uibModal.open({
                animation: $scope.animationsEnabled,
                templateUrl: '/frontend/views/modal/conf-cancel.html',
                size: 'sm',
                scope: $scope
            });
            $scope.close = function (value) {
                callback(value);
                modalInstance.close("cancel");
            };
        };
        globalfunction.confLor = function (callback) {

            var modalInstance = $uibModal.open({
                animation: $scope.animationsEnabled,
                templateUrl: '/frontend/views/modal/conf-lor.html',
                size: 'sm',
                scope: $scope
            });
            $scope.close = function (value) {
                callback(value);
                modalInstance.close("cancel");
            };
        };
        globalfunction.confPara = function (callback) {
            var modalInstance = $uibModal.open({
                animation: $scope.animationsEnabled,
                templateUrl: '/frontend/views/modal/conf-para.html',
                size: 'sm',
                scope: $scope
            });
            $scope.close = function (value) {
                callback(value);
                modalInstance.close("cancel");
            };
        };
        // TemplateService.getRole();
    })
    .controller('languageCtrl', function ($scope, $window, TemplateService, $translate, $rootScope) {

        $scope.changeLanguage = function () {
            console.log("Language CLicked");

            if (!$.jStorage.get("language")) {
                $translate.use("hi");
                $.jStorage.set("language", "hi");
            } else {
                if ($.jStorage.get("language") == "en") {
                    $translate.use("hi");
                    $.jStorage.set("language", "hi");
                } else {
                    $translate.use("en");
                    $.jStorage.set("language", "en");
                }
            }
            //  $rootScope.$apply();
        };
    })


    .controller('CustomerCompanyCtrl', function ($scope, $window, TemplateService, NavigationService, $timeout) {
        //Used to name the .html file
        $scope.template = TemplateService.changecontent("customerCompany-list");
        $scope.menutitle = NavigationService.makeactive("Customer Company List");
        TemplateService.title = $scope.menutitle;
        $scope.navigation = NavigationService.getnav();
        $scope.showAllCustomerCompanies = function () {
            NavigationService.getAllCustomerCompanies(function (data) {
                $scope.allCustomerCompanies = data.data;
                console.log('$scope.allCustomerCompanies', $scope.allCustomerCompanies);

            });
        };
        $scope.showAllCustomerCompanies();
        $scope.deleteCustomerCompany = function (id) {

            NavigationService.deleteCustomerCompany({
                id: id
            }, function (data) {
                $scope.showAllCustomerCompanies();

            });
        };
    })
    .controller('CreateCustomerCompanyCtrl', function ($scope, $window, TemplateService, NavigationService, $timeout, $state) {
        //Used to name the .html file
        $scope.template = TemplateService.changecontent("customerCompany-detail");
        $scope.menutitle = NavigationService.makeactive("Customer Company");
        TemplateService.title = $scope.menutitle;
        $scope.navigation = NavigationService.getnav();

        $scope.header = {
            "name": "Create Customer Company"
        };
        $scope.formData = {};
        $scope.formData.GSTINByState = [];
        NavigationService.getGSTINDetails($scope.formData.GSTINByState, function (newGSTINByState) {
            if (newGSTINByState.value == true) {
                $scope.formData.GSTINByState = newGSTINByState.data;
            }
        });
        // NavigationService.createStatesForGST(function (data) {
        //     $scope.formData.GSTINByState = data.data;
        // })
        $scope.saveModel = function (formData) {
            NavigationService.modelSave("CustomerCompany", $scope.formData, function (data) {
                if (data.value === true) {
                    $window.history.back();
                }
            });
        };

    })
    .controller('EditCustomerCompanyCtrl', function ($scope, $window, TemplateService, NavigationService, $timeout, $stateParams, $state) {
        //Used to name the .html file
        $scope.template = TemplateService.changecontent("customerCompany-detail");
        $scope.menutitle = NavigationService.makeactive("Customer Company");
        TemplateService.title = $scope.menutitle;
        $scope.navigation = NavigationService.getnav();

        $scope.header = {
            "name": "Edit Customer Company"
        };
        NavigationService.getOneModel("CustomerCompany", $stateParams.id, function (data) {
            $scope.formData = data.data;
            NavigationService.getGSTINDetails($scope.formData.GSTINByState, function (newGSTINByState) {
                if (newGSTINByState.value == true) {
                    $scope.formData.GSTINByState = newGSTINByState.data;
                }
            });
        });
        $scope.saveModel = function (formValid) {
            NavigationService.customerCompanyEditSave($scope.formData, function (data) {
                if (data.value === true) {
                    $window.history.back();
                }
            });
        };

    })

    .controller('CustomerCtrl', function ($scope, $window, TemplateService, NavigationService, $timeout, $state, $stateParams, $uibModal, toastr) {
        //Used to name the .html file
        $scope.template = TemplateService.changecontent("customer-list", $state);
        $scope.menutitle = NavigationService.makeactive("Customer List");
        TemplateService.title = $scope.menutitle;
        $scope.currentPage = $stateParams.page;
        var i = 0;
        $scope.search = {
            keyword: ""
        };
        if ($stateParams.keyword) {
            $scope.search.keyword = $stateParams.keyword;
        }
        $scope.showAll = function (keywordChange) {
            $scope.totalItems = undefined;
            if (keywordChange) {
                $scope.currentPage = 1;
            }
            NavigationService.searchCustomer({
                page: $scope.currentPage,
                keyword: $scope.search.keyword
            }, ++i, function (data, ini) {
                if (ini == i) {
                    $scope.customerList = data.data.results;
                    $scope.totalItems = data.data.total;
                    $scope.maxRow = data.data.options.count;
                }
            });
        };

        $scope.changePage = function (page) {
            var goTo = "typeOfOffice-list";
            if ($scope.search.keyword) {
                goTo = "typeOfOffice-list";
            }
            $state.go(goTo, {
                page: page,
                keyword: $scope.search.keyword
            });
        };
        $scope.showAll();
    })

    .controller('CreateCustomerCtrl', function ($scope, hotkeys, $window, TemplateService, NavigationService, $timeout, $state, $uibModal, $stateParams, toastr, $filter) {
        //Used to name the .html file
        $scope.template = TemplateService.changecontent("customer-detail");
        $scope.menutitle = NavigationService.makeactive("Create Customer");
        TemplateService.title = $scope.menutitle;
        $scope.navigation = NavigationService.getnav();
        $scope.formData = {};
        $scope.formIndex = 0;
        $scope.buttonValue = "Save";
        $scope.formData.officers = [];
        $scope.format = 'dd-MMMM-yyyy';
        $scope.header = {
            "name": "Create Customer"
        };
        $scope.userStatus = [{
            "name": "Active",
            "value": true
        }, {
            "name": "Inactive",
            "value": false
        }];
        $scope.salutations = ["Mr.", "Mrs.", "Ms.", "Dr."];
        $scope.formData.companyShortName = "";
        $scope.formData.TOFShortName1 = "";
        $scope.formData.officeCode = "";
        $scope.formData.city1 = "";

        $scope.popup = {
            birthDate: false
        };
        $scope.showing = false;
        $scope.passType = 'password';
        $scope.showPass = function () {
            $scope.showing = !$scope.showing;
            if ($scope.showing === false) {
                $scope.passType = 'password';
            } else {
                $scope.passType = 'text';
            }
        };

        $scope.cancel = function () {
            $window.history.back();
        }
        hotkeys.bindTo($scope).add({
            combo: 'ctrl+enter',
            callback: function (formData) {
                NavigationService.modelSave("Customer", $scope.formData, function (data) {
                    if (data.value === true) {
                        // $state.go('customer' + '-list');
                        $window.history.back();
                        toastr.success("Customer" + " " + formData.name + " created successfully.", "Customer" + " Created");
                    } else {
                        toastr.error("Error while creating " + data.error.message, "Error");
                    }
                });
            }
        });
        $scope.saveModel = function (formData) {
            NavigationService.modelSave("Customer", $scope.formData, function (data) {
                if (data.value === true) {
                    // $state.go('customer' + '-list');
                    $window.history.back();
                    toastr.success("Customer" + " " + formData.name + " created successfully.", "Customer" + " Created");
                } else {
                    toastr.error("Customer" + data.error.message + " creation failed.", "Customer" + " creation error");
                }
            });
        };
    })
    .controller('EditCustomerCtrl', function ($scope, hotkeys, $window, TemplateService, NavigationService, $timeout, $state, $stateParams, $uibModal, toastr) {
        //Used to name the .html file
        $scope.template = TemplateService.changecontent("customer-detail");
        $scope.menutitle = NavigationService.makeactive("Edit Customer");
        TemplateService.title = $scope.menutitle;
        $scope.navigation = NavigationService.getnav();
        $scope.formData = {};
        $scope.formIndex = 0;
        $scope.buttonValue = "Save";
        $scope.formData.officers = [];
        $scope.format = 'dd-MMMM-yyyy';
        // $scope.
        $scope.header = {
            "name": "Edit Customer"
        };
        $scope.userStatus = [{
            "name": "Active",
            "value": true
        }, {
            "name": "Inactive",
            "value": false
        }];
        $scope.salutations = ["Mr.", "Mrs.", "Ms.", "Dr."];
        $scope.formData.companyShortName = "";
        $scope.formData.TOFShortName = "";
        $scope.formData.officeCode = "";
        $scope.formData.city1 = "";
        $scope.popup = {
            birthDate: false
        };
        $scope.showing = false;
        $scope.passType = 'password';



        NavigationService.getOneModel("Customer", $stateParams.id, function (data) {
            $scope.formData = data.data;
            $scope.formData.creditPending = $scope.formData.creditAlloted - $scope.formData.creditExhausted;
        });
        $scope.cancel = function () {
            $window.history.back();
        }
        hotkeys.bindTo($scope).add({
            combo: 'ctrl+enter',
            callback: function (formData) {
                NavigationService.modelSave("Customer", $scope.formData, function (data) {
                    if (data.value === true) {
                        // $state.go("customer" + '-list');
                        $window.history.back();
                        toastr.success("Customer" + $scope.formData.name + " edited successfully.", "Customer" + " Edited");
                    } else {
                        toastr.error("Customer" + data.error.message + " edition failed.", "Customer" + " editing error");
                    }
                });
            }
        });
        $scope.saveModel = function (formValid) {
            NavigationService.modelSave("Customer", $scope.formData, function (data) {
                if (data.value === true) {
                    // $state.go("customer" + '-list');
                    $window.history.back();
                    toastr.success("Customer" + $scope.formData.name + " edited successfully.", "Customer" + " Edited");
                } else {
                    toastr.error("Customer" + data.error.message + " edition failed.", "Customer" + " editing error");
                }
            });
        };

    })

    .controller('EditGradeCtrl', function ($scope, $window, TemplateService, NavigationService, $timeout, $state, $stateParams) {
        //Used to name the .html file
        $scope.template = TemplateService.changecontent("grade-detail");
        $scope.menutitle = NavigationService.makeactive("Grade");
        TemplateService.title = $scope.menutitle;
        $scope.navigation = NavigationService.getnav();
    })
    .controller('CreateGradeCtrl', function ($scope, $window, TemplateService, NavigationService, $timeout, $state, $stateParams) {
        //Used to name the .html file
        $scope.template = TemplateService.changecontent("grade-detail");
        $scope.menutitle = NavigationService.makeactive("Grade");
        TemplateService.title = $scope.menutitle;
        $scope.navigation = NavigationService.getnav();
    })
    .controller('GradeCtrl', function ($scope, $window, TemplateService, NavigationService, $timeout, $state, $stateParams) {
        //Used to name the .html file
        $scope.template = TemplateService.changecontent("grade-list");
        $scope.menutitle = NavigationService.makeactive("Grade List");
        TemplateService.title = $scope.menutitle;
        $scope.navigation = NavigationService.getnav();
    })
    .controller('EditSurveyCodeCtrl', function ($scope, $window, TemplateService, NavigationService, $timeout, $state, $stateParams) {
        //Used to name the .html file
        $scope.template = TemplateService.changecontent("surveyCode-detail");
        $scope.menutitle = NavigationService.makeactive("Survey Code");
        TemplateService.title = $scope.menutitle;
        $scope.navigation = NavigationService.getnav();
    })
    .controller('CreateSurveyCodeCtrl', function ($scope, $window, TemplateService, NavigationService, $timeout, $state, $stateParams) {
        //Used to name the .html file
        $scope.template = TemplateService.changecontent("surveyCode-detail");
        $scope.menutitle = NavigationService.makeactive("Survey Code");
        TemplateService.title = $scope.menutitle;
        $scope.navigation = NavigationService.getnav();
    })
    .controller('SurveyCodeCtrl', function ($scope, $window, TemplateService, NavigationService, $timeout, $state, $stateParams) {
        //Used to name the .html file
        $scope.template = TemplateService.changecontent("surveyCode-list");
        $scope.menutitle = NavigationService.makeactive("Survey Code List");
        TemplateService.title = $scope.menutitle;
        $scope.navigation = NavigationService.getnav();
    })
    .controller('TransferOfficeCtrl', function ($scope, $window, TemplateService, NavigationService, $timeout, $state, $stateParams) {
        //Used to name the .html file
        $scope.template = TemplateService.changecontent("transferOffice-detail");
        $scope.menutitle = NavigationService.makeactive("Transfer Office");
        TemplateService.title = $scope.menutitle;
        $scope.navigation = NavigationService.getnav();
    })
    .controller('CreateTransferOfficeCtrl', function ($scope, $window, TemplateService, NavigationService, $timeout, $state, $stateParams) {
        //Used to name the .html file
        $scope.template = TemplateService.changecontent("transferOffice-detail");
        $scope.menutitle = NavigationService.makeactive("Transfer Office");
        TemplateService.title = $scope.menutitle;
        $scope.navigation = NavigationService.getnav();
    })
    .controller('TransferOfficeCtrl', function ($scope, $window, TemplateService, NavigationService, $timeout, $state, $stateParams) {
        //Used to name the .html file
        $scope.template = TemplateService.changecontent("transferOffice-list");
        $scope.menutitle = NavigationService.makeactive("Transfer Office List");
        TemplateService.title = $scope.menutitle;
        $scope.navigation = NavigationService.getnav();
    })
    .controller('ActivityTypeCtrl', function ($scope, $window, TemplateService, NavigationService, $timeout, $stateParams, $state, toastr) {
        //Used to name the .html file
        $scope.template = TemplateService.changecontent("activityType-list", $state);
        $scope.menutitle = NavigationService.makeactive("Activity Type List");
        TemplateService.title = $scope.menutitle;
        $scope.navigation = NavigationService.getnav();
        $scope.currentPage = $stateParams.page;
        var i = 0;
        $scope.search = {
            keyword: ""
        };
        if ($stateParams.keyword) {
            $scope.search.keyword = $stateParams.keyword;
        }
        $scope.showAllCountries = function (keywordChange) {
            $scope.totalItems = undefined;
            if (keywordChange) {
                $scope.currentPage = 1;
            }
            NavigationService.searchTypeOfOffice({
                page: $scope.currentPage,
                keyword: $scope.search.keyword
            }, ++i, function (data, ini) {
                if (ini == i) {
                    $scope.allTypeOfOffices = data.data.results;
                    $scope.totalItems = data.data.total;
                    $scope.maxRow = data.data.options.count;
                }
            });
        };

        $scope.changePage = function (page) {
            var goTo = "typeOfOffice-list";
            if ($scope.search.keyword) {
                goTo = "typeOfOffice-list";
            }
            $state.go(goTo, {
                page: page,
                keyword: $scope.search.keyword
            });
        };
        $scope.showAllCountries();
        $scope.deleteTypeOfOffice = function (id) {
            globalfunction.confDel(function (value) {
                console.log(value);
                if (value) {
                    NavigationService.deleteTypeOfOffice(id, function (data) {
                        if (data.value) {
                            $scope.showAllCountries();
                            toastr.success("Office deleted successfully.", "Office deleted");
                        } else {
                            toastr.error("There was an error while deleting Office", "Office deleting error");
                        }
                    });
                }
            });
        };
    })
    .controller('CreateActivityTypeCtrl', function ($scope, hotkeys, $window, TemplateService, NavigationService, $timeout, $state, toastr) {
        //Used to name the .html file
        $scope.template = TemplateService.changecontent("activityType-detail");
        $scope.menutitle = NavigationService.makeactive("Activity Type");
        TemplateService.title = $scope.menutitle;
        $scope.navigation = NavigationService.getnav();

        $scope.header = {
            "name": "Create Activity Type"
        };
        $scope.formData = {};
        $scope.cancel = function () {
            $window.history.back();
        };
        hotkeys.bindTo($scope).add({
            combo: 'ctrl+enter',
            callback: function (formData) {
                NavigationService.typeofofficeSave($scope.formData, function (data) {
                    if (data.value === true) {
                        // $state.go('typeOfOffice-list');
                        $window.history.back();
                        toastr.success("Type Of Office " + $scope.formData.name + " created successfully.", "Type Of Office Created");
                    } else {
                        toastr.error("Type Of Office creation failed.", "Type Of Office creation error");
                    }
                });
            }
        });
        $scope.savetypeOfOffice = function (formData) {
            NavigationService.typeofofficeSave($scope.formData, function (data) {
                if (data.value === true) {
                    // $state.go('typeOfOffice-list');
                    $window.history.back();
                    toastr.success("Type Of Office " + $scope.formData.name + " created successfully.", "Type Of Office Created");
                } else {
                    toastr.error("Type Of Office creation failed.", "Type Of Office creation error");
                }
            });
        };

    })
    .controller('EditActivityTypeCtrl', function ($scope, hotkeys, $window, TemplateService, NavigationService, $timeout, $stateParams, $state, toastr) {
        //Used to name the .html file
        $scope.template = TemplateService.changecontent("activityType-detail");
        $scope.menutitle = NavigationService.makeactive("Activity Type");
        TemplateService.title = $scope.menutitle;
        $scope.navigation = NavigationService.getnav();

        $scope.header = {
            "name": "Edit Activity Type"
        };

        NavigationService.getOneTypeOfOffice($stateParams.id, function (data) {
            $scope.formData = data.data;
        });
        $scope.cancel = function () {
            $window.history.back();
        };
        hotkeys.bindTo($scope).add({
            combo: 'ctrl+enter',
            callback: function (formData) {
                NavigationService.typeofofficeSave($scope.formData, function (data) {
                    if (data.value === true) {
                        $window.history.back();
                        toastr.success("Type Of Office " + $scope.formData.name + " created successfully.", "Type Of Office Created");
                    } else {
                        toastr.error("Type Of Office creation failed.", "Type Of Office creation error");
                    }
                });
            }
        });
        $scope.savetypeOfOffice = function (formValid) {
            NavigationService.typeofofficeSave($scope.formData, function (data) {
                if (data.value === true) {
                    $window.history.back();
                    toastr.success("Type Of Office " + $scope.formData.name + " created successfully.", "Type Of Office Created");
                } else {
                    toastr.error("Type Of Office creation failed.", "Type Of Office creation error");
                }
            });
            //  }
        };

    })
    .controller('ExpenseCtrl', function ($scope, $window, TemplateService, NavigationService, $timeout, $stateParams, $state, toastr) {
        //Used to name the .html file
        $scope.template = TemplateService.changecontent("expense-list");
        $scope.menutitle = NavigationService.makeactive("Expense List");
        TemplateService.title = $scope.menutitle;
        $scope.navigation = NavigationService.getnav();
        $scope.currentPage = $stateParams.page;
        var i = 0;
        $scope.search = {
            keyword: ""
        };
        if ($stateParams.keyword) {
            $scope.search.keyword = $stateParams.keyword;
        }
        $scope.showAllCountries = function (keywordChange) {
            $scope.totalItems = undefined;
            if (keywordChange) {
                $scope.currentPage = 1;
            }
            NavigationService.searchTypeOfOffice({
                page: $scope.currentPage,
                keyword: $scope.search.keyword
            }, ++i, function (data, ini) {
                if (ini == i) {
                    $scope.allTypeOfOffices = data.data.results;
                    $scope.totalItems = data.data.total;
                    $scope.maxRow = data.data.options.count;
                }
            });
        };

        $scope.changePage = function (page) {
            var goTo = "typeOfOffice-list";
            if ($scope.search.keyword) {
                goTo = "typeOfOffice-list";
            }
            $state.go(goTo, {
                page: page,
                keyword: $scope.search.keyword
            });
        };
        $scope.showAllCountries();
        $scope.deleteTypeOfOffice = function (id) {
            globalfunction.confDel(function (value) {
                console.log(value);
                if (value) {
                    NavigationService.deleteTypeOfOffice(id, function (data) {
                        if (data.value) {
                            $scope.showAllCountries();
                            toastr.success("Office deleted successfully.", "Office deleted");
                        } else {
                            toastr.error("There was an error while deleting Office", "Office deleting error");
                        }
                    });
                }
            });
        };
    })
    .controller('CreateExpenseCtrl', function ($scope, $window, TemplateService, NavigationService, $timeout, $state, toastr) {
        //Used to name the .html file
        $scope.template = TemplateService.changecontent("expense-detail");
        $scope.menutitle = NavigationService.makeactive("Expense");
        TemplateService.title = $scope.menutitle;
        $scope.navigation = NavigationService.getnav();

        $scope.header = {
            "name": "Create Expense"
        };
        $scope.formData = {};
        $scope.savetypeOfOffice = function (formData) {

            NavigationService.typeofofficeSave($scope.formData, function (data) {
                if (data.value === true) {
                    // $state.go('typeOfOffice-list');
                    $window.history.back();
                    toastr.success("Type Of Office " + $scope.formData.name + " created successfully.", "Type Of Office Created");
                } else {
                    toastr.error("Type Of Office creation failed.", "Type Of Office creation error");
                }
            });
        };

    })
    .controller('EditExpenseCtrl', function ($scope, $window, TemplateService, NavigationService, $timeout, $stateParams, $state, toastr) {
        //Used to name the .html file
        $scope.template = TemplateService.changecontent("expense-detail");
        $scope.menutitle = NavigationService.makeactive("Expense");
        TemplateService.title = $scope.menutitle;
        $scope.navigation = NavigationService.getnav();

        $scope.header = {
            "name": "Edit Expense"
        };

        NavigationService.getOnetypeOfOffice($stateParams.id, function (data) {
            $scope.formData = data.data;
        });

        $scope.savetypeOfOffice = function (formValid) {

            //  if (formValid.$valid) {
            //  $scope.formComplete = true;
            NavigationService.typeofofficeSave($scope.formData, function (data) {
                if (data.value === true) {
                    // $state.go('typeOfOffice-list');
                    $window.history.back();
                    toastr.success("Type Of Office " + $scope.formData.name + " created successfully.", "Type Of Office Created");
                } else {
                    toastr.error("Type Of Office creation failed.", "Type Of Office creation error");
                }
            });
            //  }
        };

    })

    .controller('EditTemplateCtrl', function ($scope, $window, TemplateService, NavigationService, $timeout, $stateParams, $state, toastr) {
        //Used to name the .html file
        $scope.template = TemplateService.changecontent("template-detail");
        $scope.menutitle = NavigationService.makeactive("Edit Template");
        TemplateService.title = $scope.menutitle;
        $scope.navigation = NavigationService.getnav();

        $scope.header = {
            "name": "Edit Template"
        };
        $scope.formData = {};
        // $scope.formData.status = true;

        NavigationService.getOneModel("Template", $stateParams.id, function (data) {
            $scope.formData = data.data;
        });

        $scope.itemTypes = [{
            value: '',
            name: 'Select type of item'
        }, {
            value: 'Custom Input',
            name: 'Custom Input'
        }, {
            value: 'System Fields',
            name: 'System Fields'
        }, {
            value: 'Dropdown',
            name: 'Dropdown'
        }];

        $scope.inputTypes = [{
            value: '',
            name: 'Select type of input'
        }, {
            value: 'Text',
            name: 'Text'
        }, {
            value: 'Date',
            name: 'Date'
        }, {
            value: 'Textarea',
            name: 'Textarea'
        }];

        $scope.addHead = function () {
            $scope.formData.forms.push({
                head: $scope.formData.forms.length + 1,
                items: [{}]
            });
        };
        $scope.removeHead = function (index) {
            if ($scope.formData.forms.length > 1) {
                $scope.formData.forms.splice(index, 1);
            } else {
                $scope.formData.forms = [{
                    head: '',
                    items: [{}, {}]
                }];
            }
        };

        $scope.addItem = function (obj) {
            var index = $scope.formData.forms.indexOf(obj);
            $scope.formData.forms[index].items.push({});
        };

        $scope.removeItem = function (obj, indexItem) {
            var indexHead = $scope.formData.forms.indexOf(obj);
            if ($scope.formData.forms[indexHead].items.length > 1) {
                $scope.formData.forms[indexHead].items.splice(indexItem, 1);
            } else {
                $scope.formData.forms[indexHead].items = [{}];
            }
        };

        $scope.sortableOptions = {
            handle: ' .handleBar',
            axis: 'y',
            'ui-floating': true,
            start: function (e, ui) {
                $('#sortable-ul-selector-id').sortable("refreshPositions");
                $('#sortable-ul-selector-id').sortable("refresh");
            }
        };
        $scope.cancel = function () {
            $window.history.back();
        }
        $scope.saveModel = function (data) {
            $scope.saveModel = function (formData) {
                NavigationService.modelSave("Template", $scope.formData, function (data) {
                    if (data.value === true) {
                        // $state.go('template-list');
                        $window.history.back();
                        toastr.success("Template " + formData.name + " edited successfully.", "Template Edited");
                    } else {
                        toastr.error("Template Edition failed.", "Template edition error");
                    }
                });
            };
        };
    })
    .controller('CreateTemplateCtrl', function ($scope, $window, TemplateService, NavigationService, $timeout, $stateParams, $state, toastr) {
        //Used to name the .html file
        $scope.template = TemplateService.changecontent("template-detail");
        $scope.menutitle = NavigationService.makeactive("Create Template");
        TemplateService.title = $scope.menutitle;
        $scope.navigation = NavigationService.getnav();

        $scope.header = {
            "name": "Create Template"
        };

        $scope.itemTypes = [{
            value: '',
            name: 'Select type of item'
        }, {
            value: 'Custom Input',
            name: 'Custom Input'
        }, {
            value: 'System Fields',
            name: 'System Fields'
        }, {
            value: 'Dropdown',
            name: 'Dropdown'
        }];

        $scope.inputTypes = [{
            value: '',
            name: 'Select type of input'
        }, {
            value: 'Text',
            name: 'Text'
        }, {
            value: 'Date',
            name: 'Date'
        }, {
            value: 'Textarea',
            name: 'Textarea'
        }];

        $scope.formData = {};
        $scope.formData.status = true;

        $scope.formData.forms = [{
            head: '',
            items: [{}, {}]
        }];

        $scope.addHead = function () {
            $scope.formData.forms.push({
                head: $scope.formData.forms.length + 1,
                items: [{}]
            });
        };
        $scope.removeHead = function (index) {
            if ($scope.formData.forms.length > 1) {
                $scope.formData.forms.splice(index, 1);
            } else {
                $scope.formData.forms = [{
                    head: '',
                    items: [{}, {}]
                }];
            }
        };

        $scope.addItem = function (obj) {
            var index = $scope.formData.forms.indexOf(obj);
            $scope.formData.forms[index].items.push({});
        };

        $scope.removeItem = function (obj, indexItem) {
            var indexHead = $scope.formData.forms.indexOf(obj);
            if ($scope.formData.forms[indexHead].items.length > 1) {
                $scope.formData.forms[indexHead].items.splice(indexItem, 1);
            } else {
                $scope.formData.forms[indexHead].items = [{}];
            }
        };

        $scope.sortableOptions = {
            handle: ' .handleBar',
            axis: 'y',
            'ui-floating': true,
            start: function (e, ui) {
                $('#sortable-ul-selector-id').sortable("refreshPositions");
                $('#sortable-ul-selector-id').sortable("refresh");
            }
        };
        $scope.cancel = function () {
            $window.history.back();
        }
        $scope.saveModel = function (data) {
            $scope.saveModel = function (formData) {
                NavigationService.modelSave("Template", $scope.formData, function (data) {
                    if (data.value === true) {
                        // $state.go('template-list');
                        $window.history.back();
                        toastr.success("Template " + formData.name + " created successfully.", "Template Created");
                    } else {
                        toastr.error("Template creation failed.", "Template creation error");
                    }
                });
            };
        };


    })
    .controller('TemplateCtrl', function ($scope, $window, TemplateService, NavigationService, $timeout, $stateParams, $state, toastr) {
        //Used to name the .html file
        $scope.template = TemplateService.changecontent("template-list");
        $scope.menutitle = NavigationService.makeactive("Templates");
        TemplateService.title = $scope.menutitle;
        $scope.navigation = NavigationService.getnav();

        $scope.header = {
            "name": "Template List"
        };
    })
    .controller('CreateTemplateLORCtrl', function ($scope, $window, TemplateService, NavigationService, $timeout, $stateParams, $state, toastr) {
        //Used to name the .html file
        $scope.template = TemplateService.changecontent("templateLor-detail");
        $scope.menutitle = NavigationService.makeactive("Create LOR Template");
        TemplateService.title = $scope.menutitle;
        $scope.navigation = NavigationService.getnav();
        $scope.flag = true;
        $scope.header = {
            "name": "Create LOR Template"
        };
        $scope.showOriginalCopySwitch = true;
        $scope.formData = {};
        // $scope.formData.forms=[];            
        NavigationService.getAccordianData(function (data) {
            $scope.formData.forms = data.data;
        });
        $scope.addToForm = function (data) {
            console.log(data);
        };

        var obj = {};


        $scope.isDateNeeded = false;
        $scope.isTypeNeeded = false;

        $scope.cancel = function () {
            $window.history.back();
        }
        $scope.saveModel = function (formData) {
            NavigationService.modelSave("TemplateLor", $scope.formData, function (data) {
                if (data.value === true) {
                    // $state.go('templateLor-list');
                    $window.history.back();
                    toastr.success("LOR Template " + formData.name + " created successfully.", "LOR Template Created");
                } else {
                    toastr.error("LOR Template creation failed.", "LOr Template creation error");
                }
            });
        };

    })
    .controller('EditTemplateLORCtrl', function ($scope, $window, TemplateService, NavigationService, $timeout, $stateParams, $state, toastr) {
        //Used to name the .html file
        $scope.template = TemplateService.changecontent("templateLor-detail");
        $scope.menutitle = NavigationService.makeactive("Edit LOR Template");
        TemplateService.title = $scope.menutitle;
        $scope.navigation = NavigationService.getnav();
        $scope.flag = true;
        $scope.header = {
            "name": "Edit LOR Template"
        };
        console.log("HHHHHHHiiiiiiiiii");
        $scope.showOriginalCopySwitch = true;

        function findItemValue(category, item) {

            var retCategory = _.find($scope.formData.forms, function (formCategory) {
                return formCategory._id == category._id;
            });
            if (_.isEmpty(retCategory)) {
                return item;
            }
            var retItem = _.find(retCategory.items, function (formItem) {
                return formItem._id == item._id;
            });

            if (_.isEmpty(retItem)) {
                return item;
            }
            return retItem;
        }

        async.parallel({
            getOneModel: function (complete) {
                NavigationService.getOneModel("TemplateLor", $stateParams.id, function (data) {
                    $scope.formData = data.data;
                    complete();
                });
            },
            getAccordianData: function (complete) {
                NavigationService.getAccordianData(function (data) {
                    $scope.lorCategory = data.data;
                    complete();
                });
            }
        }, function (err, data) {
            _.each($scope.lorCategory, function (Category) {
                _.each(Category.items, function (Item) {
                    Item.isCheck = findItemValue(Category, Item).isCheck;
                });
            });
            $scope.formData.forms = $scope.lorCategory;
        });



        $scope.isDateNeeded = false;
        $scope.isTypeNeeded = false;

        $scope.saveModel = function (formData) {
            NavigationService.modelSave("TemplateLor", $scope.formData, function (data) {
                if (data.value === true) {
                    // $state.go('templateLor-list');
                    $window.history.back();
                    toastr.success("LOR Template " + formData.name + " edited successfully.", "LOR Template Edited");
                } else {
                    toastr.error("LOR Template edition failed.", "LOr Template edition error");
                }
            });
        };
    })




    .controller('EditTemplateInvoiceCtrl', function ($scope, $window, TemplateService, NavigationService, $timeout, $stateParams, $state, toastr) {
        //Used to name the .html file
        $scope.template = TemplateService.changecontent("templateInvoice-detail");
        $scope.menutitle = NavigationService.makeactive("Edit Invoice Template");
        TemplateService.title = $scope.menutitle;
        $scope.navigation = NavigationService.getnav();

        $scope.header = {
            "name": "Edit Invoice Template"
        };

        $scope.formData = {};
        NavigationService.getOneModel("TemplateInvoice", $stateParams.id, function (data) {
            $scope.formData = data.data;
        });

        $scope.formData.invoiceExpenditure = [{
            invoiceExpenditure: '',
        }];

        $scope.required = true;

        $scope.addHead = function () {
            $scope.formData.invoiceExpenditure.push({
                invoiceExpenditure: ''
            });
        };
        $scope.removeHead = function (index) {
            if ($scope.formData.invoiceExpenditure.length > 1) {
                $scope.formData.invoiceExpenditure.splice(index, 1);
            } else {
                $scope.formData.invoiceExpenditure = [{
                    invoiceExpenditure: ''
                }];
            }
        };
        $scope.sortableOptions = {
            handle: ' .handleBar',
            axis: 'y',
            'ui-floating': true,
            start: function (e, ui) {
                $('#sortable-ul-selector-id').sortable("refreshPositions");
                $('#sortable-ul-selector-id').sortable("refresh");
            }
        };
        $scope.cancel = function () {
            $window.history.back();
        }
        $scope.saveModel = function (data) {
            $scope.saveModel = function (formData) {
                NavigationService.modelSave("TemplateInvoice", $scope.formData, function (data) {
                    if (data.value === true) {
                        $window.history.back();
                        toastr.success("Invoice Template " + formData.name + " edited successfully.", "Invoice Template Edited");
                    } else {
                        toastr.error("Invoice Template edition failed.", "Invoice Template edition error");
                    }
                });
            };
        };
    })

    .controller('CreateTemplateInvoiceCtrl', function ($scope, $window, TemplateService, NavigationService, $timeout, $stateParams, $state, toastr) {
        //Used to name the .html file
        $scope.template = TemplateService.changecontent("templateInvoice-detail");
        $scope.menutitle = NavigationService.makeactive("Create Invoice Template");
        TemplateService.title = $scope.menutitle;
        $scope.navigation = NavigationService.getnav();

        $scope.header = {
            "name": "Create Invoice Template"
        };
        $scope.formData = {};
        $scope.formData.status = true;
        $scope.formData.invoiceExpenditure = [{}];

        $scope.required = true;

        $scope.addHead = function () {
            $scope.formData.invoiceExpenditure.push({});
        };
        $scope.removeHead = function (index) {
            if ($scope.formData.invoiceExpenditure.length > 1) {
                $scope.formData.invoiceExpenditure.splice(index, 1);
            } else {
                $scope.formData.invoiceExpenditure = [{}];
            }
        };
        $scope.sortableOptions = {
            handle: ' .handleBar',
            axis: 'y',
            'ui-floating': true,
            start: function (e, ui) {
                $('#sortable-ul-selector-id').sortable("refreshPositions");
                $('#sortable-ul-selector-id').sortable("refresh");
            }
        };
        $scope.cancel = function () {
            $window.history.back();
        }
        $scope.saveModel = function (data) {
            $scope.saveModel = function (formData) {
                NavigationService.modelSave("templateInvoice", $scope.formData, function (data) {
                    if (data.value === true) {
                        $window.history.back();
                        toastr.success("Invoice Template " + formData.name + " created successfully.", "Invoice Template Created");
                    } else {
                        toastr.error("Invoice Template creation failed.", "Invoice Template creation error");
                    }
                });
            };
        };

    })

    .controller('CreateInvoiceCtrl', function ($scope, $window, TemplateService, NavigationService, $timeout, $stateParams, $state, toastr) {
        //Used to name the .html file
        $scope.template = TemplateService.changecontent("invoice-detail");
        $scope.menutitle = NavigationService.makeactive("Create Invoice");
        TemplateService.title = $scope.menutitle;
        $scope.navigation = NavigationService.getnav();
        $scope.assignment = {};
        $scope.getLoginEmployee = $.jStorage.get("getLoginEmployee");
        $scope.disableSave = false;
        $scope.formData = {};
        $scope.formData.name = "";
        $scope.formData.employee = $scope.getLoginEmployee._id;
        $scope.formData.invoiceList = [{}];
        $scope.addHead = function () {
            $scope.formData.invoiceList.push({});
        };
        $scope.removeHead = function (index) {
            if ($scope.formData.invoiceList.length > 1) {
                $scope.formData.invoiceList.splice(index, 1);
                $scope.calAmtOnRemove();
            } else {
                $scope.formData.invoiceList = [{}];
                $scope.calAmtOnRemove();
            }
        };
        $scope.calculateCreditPending = function (data) {
            // $scope.ChangeCustomerState();
            NavigationService.getOneModel("Customer", data._id, function (data) {
                if (data.value == true) {
                    $scope.showCreditLimit = true;
                    var billedToCreditDetails = data.data;
                    $scope.creditPending = billedToCreditDetails.creditLimitAlloted - billedToCreditDetails.creditLimitExhausted;
                }
            });
        };

        $scope.refreshBilledTos = function (data) {
            var formdata = {};
            formdata.keyword = data;
            NavigationService.searchCustomer(formdata, 1, function (data) {
                $scope.billedTos = data.data.results;
            });

        };
        $scope.refreshBilledTos();
        $scope.formData.tax = [];
        // $scope.formData.status = true;
        $scope.required = true;
        $scope.formData.total = 0;
        $scope.showForm = false;

        $scope.message = {};
        $scope.message.attachment = [];
        // $scope.timeline = {};
        $scope.formData.grandTotal = 0;
        $scope.cancel = function () {
            $window.history.back();
        }
        $scope.getParentEmployee = function () {
            NavigationService.getEmployeeData($scope.empId, function (data) {
                if (data.value) {
                    $scope.employee = data.data;
                    if ($scope.message.employee.employee) {
                        $scope.employee.push({
                            _id: $scope.message.employee._id,
                            name: $scope.message.employee.name,
                            email: $scope.message.employee.officeEmail
                        });
                        _.map($scope.employee, function (values) {
                            values.email.toString();
                            values.name.toString();
                        });
                        $scope.employee = _.uniqBy($scope.employee, "email");
                    }
                } else {
                    $scope.employee.push({
                        _id: $scope.message.employee._id,
                        name: $scope.message.employee.name,
                        email: $scope.message.employee.officeEmail
                    });
                    _.map($scope.employee, function (values) {
                        values.email.toString();
                        values.name.toString();
                    });
                    $scope.employee = _.uniqBy($scope.employee, "email");

                }
            });
        };
        $scope.getLoginEmployee = $.jStorage.get("getLoginEmployee");
        $scope.message.employee = $scope.getLoginEmployee;
        $scope.empId = $scope.getLoginEmployee._id;
        $scope.employee = [];
        $scope.getParentEmployee();
        // NavigationService.getTimeline($stateParams.assignmentId, function (data) {
        //     $scope.timeline = data.data;
        // });
        // Called Dynamically For getting All Taxes (getTax)
        // State Of Company
        // state of billedTo Customer
        // pass in one function & calculate type of tax
        $scope.getdescriptions = function (data) {
            var formData = {};
            formData.keyword = data;
            NavigationService.searchInvoiceExpenditure(formData, 1, function (data) {
                $scope.descriptions = data.data.results;
            });
        }
        $scope.saveDraft = function (data) {
            $scope.disableSave = true;
            TemplateService.getToastr();
            var assignmentData = {
                _id: $scope.assignment._id,
                invoice: $scope.assignment.invoice,
                companyState: $scope.assignment.company.city.district.state
            }
            var timelineData = {
                type: "Normal",
                employee: $scope.message.employee._id,
                title: "Invoice " + $scope.assignment.name + " Saved as Draft"
            };
            $scope.formData.createdBy = $.jStorage.get("getLoginEmployee")._id;
            var newObj = {
                invoice: $scope.formData,
                assignment: assignmentData,
                createdBy: $.jStorage.get("getLoginEmployee")._id,
                type: "Create",
                timeline: timelineData
            }

            NavigationService.saveInvoiceDraft(newObj, function (data) {
                if (data.value === true) {
                    toastr.clear();
                    toastr.success("Invoice saved as draft");
                    $window.history.back();
                } else {
                    $scope.disableSave = false;
                    toastr.clear();
                    toastr.error("Invoice draft failed to save");
                }
            });
        };
        $scope.getAll = function (invoice, $index) {
            console.log("Invoice", invoice);
            $scope.formData.invoiceList[$index].name = invoice.name;
            $scope.formData.invoiceList[$index].description = invoice.description;
            $scope.formData.invoiceList[$index].unit = invoice.unit;
            $scope.formData.invoiceList[$index].rate = invoice.rate;
            $scope.formData.invoiceList[$index].type = invoice.type;
        }
        $scope.change = function (form, $index) {
            console.log("ABC", form);
            // $scope.formData.invoiceList[$index].name=form.name;
        }
        $scope.getTemplateDetails = function (data) {
            // $scope.ChangeCustomerState();
            NavigationService.getTemplate("TemplateInvoice", data, function (data) {
                if (data.value === true) {
                    $scope.showForm = true;
                    $scope.formData.invoiceList = data.data;
                } else {
                    toastr.error("Template Access failed.");
                }
            });
        }

        $scope.CalcGST = function (companyState, customerState) {
            console.log("GST", companyState, customerState);
            if (companyState == customerState) {
                $scope.formData.GSTType = "intraState";
                _.each($scope.formData.tax, function (n) {
                    if (n.intraStatePercent || n.intraStatePercent == 0) {
                        n.percent = n.intraStatePercent;
                    }
                });
            } else {
                $scope.formData.GSTType = "interState";
                _.each($scope.formData.tax, function (n) {
                    if (n.interStatePercent || n.interStatePercent == 0) {
                        n.percent = n.interStatePercent;
                    }
                });
            }
            $scope.calAmtAfterBilledToChange();
        }
        $scope.calAmtAfterBilledToChange = function () {
            console.log("HERE IN -->");
            $scope.formData.total = 0;
            $scope.formData.grandTotal = 0;
            TemplateService.getInvoiceWithTax($scope.formData, function (err, data) {
                $scope.formData = data;
            });
        }
        $scope.calAmt = function (a, b, index) {
            $scope.formData.total = 0;
            $scope.formData.grandTotal = 0;
            if ($scope.formData.invoiceList[index].unit == "grm") {
                $scope.formData.invoiceList[index].amount = a * b / 1000;
            } else {
                $scope.formData.invoiceList[index].amount = a * b;
            }
            TemplateService.getInvoiceWithTax($scope.formData, function (err, data) {
                $scope.formData = data;
            });
        }
        $scope.calAmtOnRemove = function () {
            $scope.formData.total = 0;
            $scope.formData.grandTotal = 0;
            TemplateService.getInvoiceWithTax($scope.formData, function (err, data) {
                $scope.formData = data;
            });
        }
        $scope.saveModel = function (data) {
            var Name = _.split($scope.formData.officeEmail, "<");
            var newName = _.trim(Name[0]);
            _.each($scope.employee, function (n) {
                if (n.name == newName) {
                    $scope.formData.sentTo = n._id // SentTo is Authorizer
                }
            });
            NavigationService.getOneModel("Customer", $scope.formData.billedTo._id, function (data) {
                if (data.value == true) {
                    var billedToCreditDetails = data.data;
                    var creditLimitPending = billedToCreditDetails.creditLimitAlloted - billedToCreditDetails.creditLimitExhausted;
                    if (creditLimitPending >= $scope.formData.grandTotal) {
                        $scope.formData.createdBy = $.jStorage.get("getLoginEmployee")._id,
                            $scope.formData.assignment = $stateParams.assignmentId;
                        // Sending For Generate of Invoice Number
                        var newAssignment = {
                            _id: $scope.assignment._id,
                            name: $scope.assignment.name,
                            invoice: $scope.assignment.invoice,
                            companyState: $scope.assignment.company.city.district.state,
                            timelineStatus: $scope.assignment.timelineStatus
                        }
                        var wholeFormData = {
                            invoiceData: _.clone($scope.formData),
                            getAllTaskStatus: $scope.assignment.getAllTaskStatus,
                            employee: $.jStorage.get("getLoginEmployee")._id,
                            invoiceApproval: false,
                            newAssignment: newAssignment
                        }
                        NavigationService.invoiceApproval(wholeFormData, function (data) {
                            if (data.value) {
                                toastr.clear();
                                $window.history.back();
                                toastr.success("Invoice " + data.data.invoiceNumber + " sent for Authorization");
                            } else {
                                if (data.error.msg == "Invoice number is to be unique") {
                                    toastr.error(data.error.number + " already exist");
                                } else {
                                    toastr.clear();
                                    toastr.error("GSTIN missing for " + $scope.billedToState.name + " for " + $scope.customerCompany, "Cannot create Invoice");
                                    $scope.disableSave = false;
                                }
                            }
                        });
                    } else {
                        toastr.clear();
                        toastr.error("Invoice Total exceeds credit limit pending");
                        $window.history.back();
                    }
                }
            });
        }

        $scope.previewPdf = function (data) {
            var Name = _.split($scope.formData.officeEmail, "<");
            var newName = _.trim(Name[0]);
            _.each($scope.employee, function (n) {
                if (n.name == newName) {
                    $scope.formData.sentTo = n._id // SentTo is Authorizer
                }
            });
            NavigationService.getOneModel("Customer", $scope.formData.billedTo._id, function (data) {
                if (data.value == true) {
                    var billedToCreditDetails = data.data;
                    var creditLimitPending = billedToCreditDetails.creditLimitAlloted - billedToCreditDetails.creditLimitExhausted;
                    if (creditLimitPending >= $scope.formData.grandTotal) {
                        $scope.formData.createdBy = $.jStorage.get("getLoginEmployee")._id,
                            $scope.formData.assignment = $stateParams.assignmentId;
                        // Sending For Generate of Invoice Number
                        var newAssignment = {
                            _id: $scope.assignment._id,
                            name: $scope.assignment.name,
                            invoice: $scope.assignment.invoice,
                            companyState: $scope.assignment.company.city.district.state
                        }
                        var wholeFormData = {
                            invoiceData: _.clone($scope.formData),
                            getAllTaskStatus: $scope.assignment.getAllTaskStatus,
                            employee: $.jStorage.get("getLoginEmployee")._id,
                            invoiceApproval: false,
                            newAssignment: newAssignment
                        }
                        NavigationService.generateInvoicePreview(wholeFormData, function (data) {
                            if (data.value) {
                                toastr.clear();
                                console.log('data.data', data.data);
                                window.open(adminurl + 'upload/readFile?file=' + data.data, '_blank');
                            } else {
                                if (data.error.msg == "Invoice number is to be unique") {
                                    toastr.error(data.error.number + " already exist");
                                } else {
                                    toastr.clear();
                                    toastr.error("GSTIN missing for " + $scope.billedToState.name + " for " + $scope.customerCompany, "Cannot create Invoice");
                                    $scope.disableSave = false;
                                }
                            }
                        });
                    } else {
                        toastr.clear();
                        toastr.error("Invoice Total exceeds credit limit pending");
                    }
                }
            });
        };
        $scope.createInvoice = function (data) {
            NavigationService.createInvoice($scope.formData, function (data) {
                console.log("Data In Result", data);
                toastr.success("Invoice Created Successfully");
                $window.history.back();
            });
        };

    })
    .controller('EditInvoiceCtrl', function ($scope, $window, $uibModal, TemplateService, NavigationService, $timeout, $stateParams, $state, toastr) {
        //Used to name the .html file
        $scope.template = TemplateService.changecontent("invoice-detail");
        $scope.menutitle = NavigationService.makeactive("Edit Invoice");
        TemplateService.title = $scope.menutitle;
        $scope.navigation = NavigationService.getnav();
        $scope.formData = {};
        $scope.showCreditLimitOnEdit = true;
        $scope.formData.invoiceList = [];
        $scope.formData.tax = [];
        $scope.getLoginEmployee = $.jStorage.get("getLoginEmployee");
        NavigationService.invoiceEditData("Invoice", $stateParams.invoiceId, function (data) {
            $scope.formData = data.data;
            $scope.assignment = data.data.assignment;
            console.log("------>", data.data.assignment);
            $scope.oldGrandTotal = $scope.formData.grandTotal;
            $scope.creditPending = $scope.formData.billedTo.creditLimitAlloted - $scope.formData.billedTo.creditLimitExhausted
            if ($scope.formData.approvalStatus == "Approved" || $scope.formData.approvalStatus == "Revised") {
                $scope.approval = true;
                $scope.disableSave = true;
                $scope.saveForInvoiceList = true;
            }
            // Assignment Details :Start
            if ($scope.assignment.survey.length !== 0) {
                $scope.surveyDate = moment(new Date($scope.assignment.survey[$scope.assignment.survey.length - 1].surveyDate)).add(5, "hours").add(30, "minutes").format("DD/MM/YYYY");
            }
            $scope.assignedDate = moment(new Date($scope.assignment.surveyDate)).add(5, "hours").add(30, "minutes").format("DD/MM/YYYY");

            $scope.policyDetails = $scope.assignment.policyNumber;

            $scope.billedTos = [];
            if ($scope.assignment.customer) {
                $scope.billedTos.push($scope.assignment.customer);
            }
            if ($scope.assignment.insuredOffice) {
                $scope.billedTos.push($scope.assignment.insuredOffice);
            }
            if ($scope.assignment.insurerOffice) {
                $scope.billedTos.push($scope.assignment.insurerOffice);
            }
            if ($scope.assignment.brokerOffice) {
                $scope.billedTos.push($scope.assignment.brokerOffice);
            }
            $scope.oldbilledTos = _.cloneDeep($scope.billedTos);
            $scope.companyState = $scope.assignment.company.city.district.state;
            $scope.companyStateId = $scope.assignment.company.city.district.state._id;

            // Assignment Details :End 
            if ($scope.formData.approvalTime || $scope.formData.approvalStatus == "Approved" || $scope.formData.approvalStatus == "Revised") {
                // Dont Create New Taxs Array Once Invoice Is Approved 
            } else {
                NavigationService.getTax(function (data) {
                    $scope.formData.tax = [];
                    _.each(data.data.results, function (taxObj, key) {
                        if (moment(new Date(Date.now())).isBetween(moment(new Date(taxObj.fromDate)), moment(new Date(taxObj.toDate)))) {
                            $scope.formData.tax.push(taxObj);
                        }
                    });
                    $scope.ChangeCustomerState();
                });
            }
        });
        $scope.showCreditLimit = true;
        $scope.approval = false;
        $scope.disableSave = false;
        if ($stateParams.approval) {
            $scope.approval = true;
        }
        $scope.formData.status = true;
        $scope.required = true;
        $scope.showForm = true;
        $scope.message = {};
        $scope.message.attachment = [];
        // $scope.timeline = {};
        $scope.descriptions = [];
        // $scope.assignment = {};
        // $scope.assignment._id = $stateParams.assignmentId;

        $scope.cancel = function () {
            $window.history.back();
        }
        $scope.addHead = function () {
            $scope.formData.invoiceList.push({});
        };
        $scope.getdescriptions = function (data) {
            var formData = {};
            formData.keyword = data;
            NavigationService.searchInvoiceExpenditure(formData, 1, function (data) {
                $scope.descriptions = data.data.results;
                console.log("Tax", $scope.descriptions);
            });
        }
        $scope.refreshBilledTos = function (data) {
            console.log("Data", data);
            if (data !== "") {
                var formdata = {};
                formdata.keyword = data;
                NavigationService.searchCustomer(formdata, 1, function (data) {
                    $scope.billedTos = data.data.results;
                });
            } else {
                $scope.billedTos = $scope.oldbilledTos;
            }
        };
        $scope.getAll = function (invoice, $index) {
            console.log("Invoice", invoice);
            $scope.formData.invoiceList[$index].name = invoice.name;
            $scope.formData.invoiceList[$index].description = invoice.description;
            $scope.formData.invoiceList[$index].unit = invoice.unit;
            $scope.formData.invoiceList[$index].rate = invoice.rate;
            $scope.formData.invoiceList[$index].type = invoice.type;
        }
        $scope.removeHead = function (index) {
            if ($scope.formData.invoiceList.length > 1) {
                $scope.formData.invoiceList.splice(index, 1);
                $scope.calAmtOnRemove();
            } else {
                $scope.formData.invoiceList = [{}];
                $scope.calAmtOnRemove();
            }
        };
        $scope.getParentEmployee = function () {
            NavigationService.getEmployeeData($scope.empId, function (data) {
                if (data.value) {
                    $scope.employee = data.data;
                    if ($scope.message.employee.employee) {
                        $scope.employee.push({
                            _id: $scope.message.employee._id,
                            name: $scope.message.employee.name,
                            email: $scope.message.employee.officeEmail
                        });
                        _.map($scope.employee, function (values) {
                            values.email.toString();
                            values.name.toString();
                        });

                        $scope.employee = _.uniqBy($scope.employee, "email");
                    }
                } else {
                    $scope.employee.push({
                        _id: $scope.message.employee._id,
                        name: $scope.message.employee.name,
                        email: $scope.message.employee.officeEmail
                    });
                    _.map($scope.employee, function (values) {
                        values.email.toString();
                        values.name.toString();
                    });
                    $scope.employee = _.uniqBy($scope.employee, "email");

                }
                console.log("$scope.forms.employee", $scope.employee);
            });
        };
        $scope.getLoginEmployee = $.jStorage.get("getLoginEmployee");
        $scope.message.employee = $scope.getLoginEmployee;
        $scope.empId = $scope.getLoginEmployee._id;
        $scope.employee = [];
        $scope.getParentEmployee();
        // NavigationService.getTimeline($stateParams.assignmentId, function (data) {
        //     $scope.timeline = data.data;
        //     console.log("unwanted Hit", $scope.timeline);
        // }); 
        $scope.calculateCreditPending = function (data) {
            // $scope.ChangeCustomerState();
            NavigationService.getOneModel("Customer", data._id, function (data) {
                if (data.value == true) {
                    $scope.showCreditLimit = true;
                    var billedToCreditDetails = data.data;
                    $scope.creditPending = billedToCreditDetails.creditLimitAlloted - billedToCreditDetails.creditLimitExhausted;
                }
            });
        };

        $scope.calAmtAfterBilledToChange = function () {
            console.log("Here IN -->");
            $scope.formData.total = 0;
            $scope.formData.grandTotal = 0;
            TemplateService.getInvoiceWithTax($scope.formData, function (err, data) {
                $scope.formData = data;
            });
        }
        $scope.calAmt = function (a, b, index) {
            $scope.formData.total = 0;
            $scope.formData.grandTotal = 0;
            $scope.formData.invoiceList[index].amount = a * b;
            TemplateService.getInvoiceWithTax($scope.formData, function (err, data) {
                $scope.formData = data;
            });
        }
        $scope.calAmtOnRemove = function () {
            $scope.formData.total = 0;
            $scope.formData.grandTotal = 0;
            TemplateService.getInvoiceWithTax($scope.formData, function (err, data) {
                $scope.formData = data;
            });
        }
        $scope.saveModel = function (data) {
            console.log("IN HERE");
            TemplateService.getToastr();
            $scope.disableSave = true;
            $scope.formData.assignment = $scope.assignment._id;
            console.log("$scope.formData.assignment", $scope.formData.assignment);
            var newAssignment = {
                _id: $scope.assignment._id,
                name: $scope.assignment.name,
                invoice: $scope.assignment.invoice,
                timelineStatus: $scope.assignment.timelineStatus,
                companyState: $scope.assignment.company.city.district.state
            }
            var wholeFormData = {
                invoiceData: _.clone($scope.formData),
                getAllTaskStatus: $scope.assignment.getAllTaskStatus,
                employee: $.jStorage.get("getLoginEmployee")._id,
                invoiceApproval: true,
                newAssignment: newAssignment,
                billedTo: ""
            }
            if ($scope.approval) {
                NavigationService.getOneModel("Customer", $scope.formData.billedTo._id, function (data) {
                    if (data.value == true) {
                        var billedToCreditDetails = data.data;
                        var creditLimitPending = billedToCreditDetails.creditLimitAlloted - billedToCreditDetails.creditLimitExhausted;
                        if (creditLimitPending >= $scope.formData.grandTotal) {
                            $scope.formData.assignment = $stateParams.assignmentId;
                            var newBilledTo = {
                                _id: billedToCreditDetails._id,
                                creditLimitExhausted: billedToCreditDetails.creditLimitExhausted + $scope.formData.grandTotal
                            }
                            wholeFormData.billedTo = newBilledTo;
                            wholeFormData.invoiceApproval = true;
                            NavigationService.invoiceApproval(wholeFormData, function (data) {
                                if (data.value) {
                                    toastr.success("Invoice " + data.data.invoiceNumber + " Authorized");
                                    toastr.clear();
                                    $window.history.back();
                                } else {
                                    toastr.clear();
                                    toastr.error("Invoice Authorization failed");
                                    $scope.disableSave = false;
                                }
                            });
                        } else {
                            toastr.clear();
                            toastr.error("Invoice Total exceeds credit limit pending");
                            $window.history.back();
                        }
                    }
                });
            } else {
                var Name = _.split($scope.formData.officeEmail, "<");
                var newName = _.trim(Name[0]);
                _.each($scope.employee, function (n) {
                    if (n.name == newName) {
                        wholeFormData.invoiceData.sentTo = n._id // SentTo is Authorizer
                    }
                });
                wholeFormData.invoiceData.createdBy = $.jStorage.get("getLoginEmployee")._id;
                NavigationService.getOneModel("Customer", $scope.formData.billedTo._id, function (data) {
                    if (data.value == true) {
                        var billedToCreditDetails = data.data;
                        var creditLimitPending = billedToCreditDetails.creditLimitAlloted - billedToCreditDetails.creditLimitExhausted;
                        if (creditLimitPending >= $scope.formData.grandTotal) {
                            wholeFormData.invoiceApproval = false;
                            $scope.disableSave = true;
                            NavigationService.invoiceApproval(wholeFormData, function (data) {
                                if (data.value) {
                                    toastr.clear();
                                    $window.history.back();
                                    toastr.success("Invoice " + data.data.invoiceNumber + " sent for Authorization");
                                } else {
                                    if (data.error.msg == "Invoice number is to be unique") {
                                        toastr.error(data.error.number + " already exist");
                                    } else {
                                        toastr.clear();
                                        toastr.error("GSTIN missing for " + $scope.billedToState.name + " for " + $scope.customerCompany, "Cannot create Invoice");
                                        $scope.disableSave = false;
                                    }
                                }
                            });
                        } else {
                            toastr.clear();
                            toastr.error("Invoice Total exceeds credit limit pending");
                            $window.history.back();
                        }
                    }
                });
            }
        };
        $scope.previewPdf = function (data) {
            TemplateService.getToastr();
            $scope.formData.assignment = $scope.assignment._id;
            var newAssignment = {
                _id: $scope.assignment._id,
                name: $scope.assignment.name,
                invoice: $scope.assignment.invoice,
                timelineStatus: $scope.assignment.timelineStatus,
                companyState: $scope.assignment.company.city.district.state
            }
            var wholeFormData = {
                invoiceData: _.clone($scope.formData),
                getAllTaskStatus: $scope.assignment.getAllTaskStatus,
                employee: $.jStorage.get("getLoginEmployee")._id,
                invoiceApproval: true,
                newAssignment: newAssignment,
                billedTo: ""
            }
            if ($scope.approval) {
                NavigationService.getOneModel("Customer", $scope.formData.billedTo._id, function (data) {
                    if (data.value == true) {
                        var billedToCreditDetails = data.data;
                        var creditLimitPending = billedToCreditDetails.creditLimitAlloted - billedToCreditDetails.creditLimitExhausted;
                        if (creditLimitPending >= $scope.formData.grandTotal) {
                            $scope.formData.assignment = $stateParams.assignmentId;
                            var newBilledTo = {
                                _id: billedToCreditDetails._id,
                                creditLimitExhausted: billedToCreditDetails.creditLimitExhausted + $scope.formData.grandTotal
                            }
                            wholeFormData.billedTo = newBilledTo;
                            wholeFormData.invoiceApproval = true;
                            NavigationService.generateInvoicePreview(wholeFormData, function (data) {
                                if (data.value) {
                                    toastr.clear();
                                    window.open(adminurl + 'upload/readFile?file=' + data.data, '_blank');
                                } else {
                                    toastr.clear();
                                    toastr.error("Invoice Authorization failed");
                                    $scope.disableSave = false;
                                }
                            });
                        } else {
                            toastr.clear();
                            toastr.error("Invoice Total exceeds credit limit pending");
                        }
                    }
                });
            } else {
                var Name = _.split($scope.formData.officeEmail, "<");
                var newName = _.trim(Name[0]);
                _.each($scope.employee, function (n) {
                    if (n.name == newName) {
                        wholeFormData.invoiceData.sentTo = n._id // SentTo is Authorizer
                    }
                });
                wholeFormData.invoiceData.createdBy = $.jStorage.get("getLoginEmployee")._id;
                NavigationService.getOneModel("Customer", $scope.formData.billedTo._id, function (data) {
                    if (data.value == true) {
                        var billedToCreditDetails = data.data;
                        var creditLimitPending = billedToCreditDetails.creditLimitAlloted - billedToCreditDetails.creditLimitExhausted;
                        if (creditLimitPending >= $scope.formData.grandTotal) {
                            wholeFormData.invoiceApproval = false;
                            $scope.disableSave = true;
                            NavigationService.generateInvoicePreview(wholeFormData, function (data) {
                                if (data.value) {
                                    toastr.clear();
                                    window.open(adminurl + 'upload/readFile?file=' + data.data, '_blank');
                                } else {
                                    if (data.error.msg == "Invoice number is to be unique") {
                                        toastr.error(data.error.number + " already exist");
                                    } else {
                                        toastr.clear();
                                        toastr.error("GSTIN missing for " + $scope.billedToState.name + " for " + $scope.customerCompany, "Cannot create Invoice");
                                        $scope.disableSave = false;
                                    }
                                }
                            });
                        } else {
                            toastr.clear();
                            toastr.error("Invoice Total exceeds credit limit pending");
                        }
                    }
                });
            }
        };
        $scope.saveRevise = function () {
            TemplateService.getToastr();
            NavigationService.getOneModel("Customer", $scope.formData.billedTo._id, function (data) {
                if (data.value == true) {
                    var billedToCreditDetails = data.data;
                    var creditLimitPending = billedToCreditDetails.creditLimitAlloted + $scope.oldGrandTotal - billedToCreditDetails.creditLimitExhausted;
                    if (creditLimitPending >= $scope.formData.grandTotal) {
                        var newBilledTo = {
                            _id: billedToCreditDetails._id,
                            creditLimitExhausted: billedToCreditDetails.creditLimitExhausted + $scope.formData.grandTotal - $scope.oldGrandTotal
                        }
                        $scope.saveForInvoiceList = false;
                        $scope.formData.approvalStatus = "Revised";
                        var assignment = {
                            companyState: $scope.assignment.company.city.district.state
                        }
                        var wholeObj = {
                            invoiceData: $scope.formData,
                            assignmentId: $scope.assignment._id,
                            employee: $.jStorage.get("getLoginEmployee")._id,
                            billedTo: newBilledTo,
                            assignment: assignment
                        }
                        NavigationService.reviseInvoice(wholeObj, function (data) {
                            console.log("New Invoice", data);
                            if (data.value === true) {
                                toastr.clear();
                                $window.history.back();
                                toastr.success("Invoice " + $scope.formData.invoiceNumber + " Revised");
                            } else {
                                toastr.clear();
                                $scope.saveForInvoiceList = true;
                                toastr.error("Invoice " + $scope.formData.invoiceNumber + " revision failed");
                            }
                        });
                    } else {
                        toastr.error("Invoice Total exceeds credit limit pending");
                    }
                }
            });
        }
        $scope.comment = function (filterStatus) {
            $scope.filterStatus = filterStatus;
            var modalInstance = $uibModal.open({
                scope: $scope,
                templateUrl: '/frontend/views/modal/revise-comment.html',
                size: 'md'
            });
            NavigationService.getOneModel("Assignment", $scope.assignment._id, function (data) {
                $scope.assignmentData = data.data;
            });
        };
        $scope.submitReject = function (filter) {
            var NewAssignmentData = {
                _id: $scope.assignmentData._id,
                invoice: $scope.assignmentData.invoice
            }
            NewAssignmentData.invoice.pop($scope.formData._id);
            var wholeObj = {
                invoiceId: $scope.formData._id,
                invoiceNumber: $scope.formData.invoiceNumber,
                employee: $.jStorage.get("getLoginEmployee")._id,
                message: filter.comment,
                assignment: NewAssignmentData
            }
            NavigationService.rejectInvoice(wholeObj, function (data) {
                if (data.value) {
                    toastr.clear();
                    toastr.success("Invoice" + $scope.formData.invoiceNumber + " rejected");
                    $window.history.back();
                } else {
                    toastr.clear();
                    toastr.error("Invoice" + $scope.formData.invoiceNumber + " rejection failed");
                }
            });
        };
        $scope.submitRevise = function (filter) {
            $scope.formData.approvalStatus = "Regenerated";
            var assignment = {
                companyState: $scope.assignment.company.city.district.state
            }
            var wholeObj = {
                invoice: $scope.formData,
                employee: $.jStorage.get("getLoginEmployee")._id,
                message: filter.comment,
                assignmentId: $scope.assignmentData._id,
                assignment: assignment
            }
            NavigationService.regenerateInvoice(wholeObj, function (data) {
                if (data.value) {
                    toastr.clear();
                    toastr.success("Invoice" + $scope.formData.invoiceNumber + " sent back for Regeneration");
                    $window.history.back();
                } else {
                    toastr.clear();
                    toastr.error("Invoice" + $scope.formData.invoiceNumber + " failed to Regenerate");
                }
            });
        };
        $scope.saveDraft = function (data) {
            $scope.disableSave = true;
            TemplateService.getToastr();
            var assignmentData = {
                _id: $scope.assignment._id,
                invoice: $scope.assignment.invoice,
                companyState: $scope.assignment.company.city.district.state
            }
            var timelineData = {
                type: "Normal",
                employee: $scope.message.employee._id,
                title: "Invoice " + $scope.assignment.name + " Saved as Draft"
            };
            var newObj = {
                invoice: $scope.formData,
                assignment: assignmentData,
                createdBy: $.jStorage.get("getLoginEmployee")._id,
                type: "Edit",
                timeline: timelineData
            }
            NavigationService.saveInvoiceDraft(newObj, function (data) {
                if (data.value === true) {
                    toastr.clear();
                    toastr.success("Invoice saved as draft");
                    $window.history.back();
                } else {
                    $scope.disableSave = false;
                    toastr.clear();
                    toastr.error("Invoice draft failed to save");
                }
            });
        };
    })

    .controller('TemplateLORCtrl', function ($scope, $window, TemplateService, NavigationService, $timeout, $stateParams, $state, toastr) {
        $scope.template = TemplateService.changecontent("template-lor-list");
        $scope.menutitle = NavigationService.makeactive("LOR Templates");
        TemplateService.title = $scope.menutitle;
        $scope.navigation = NavigationService.getnav();

        $scope.header = {
            "name": "LOR Template List"
        };
    })

    .controller('TemplateInvoiceCtrl', function ($scope, $window, TemplateService, NavigationService, $timeout, $stateParams, $state, toastr) {
        $scope.template = TemplateService.changecontent("template-invoice");
        $scope.menutitle = NavigationService.makeactive("Template Invoice");
        TemplateService.title = $scope.menutitle;
        $scope.navigation = NavigationService.getnav();

        $scope.header = {
            "name": "Invoice Template"
        };
        $scope.assignment = {};
        $scope.assignment.templateInvoice = [];
        $scope.templateArray = [];
        NavigationService.getOneModel("Assignment", $stateParams.assignment, function (data) {
            $scope.assignment = data;
        });
        NavigationService.getExpenditure($stateParams.assignmentTemplate, function (data) {
            $scope.templateArray = data.data[0];
        });
    })

    .controller('TemplateViewCtrl', function ($scope, $uibModal, $window, TemplateService, NavigationService, $timeout, $stateParams, $state, toastr, AssignmentTemplate) {
        //Used to name the .html file
        $scope.template = TemplateService.changecontent("template-view");
        $scope.menutitle = NavigationService.makeactive("Form Name");
        TemplateService.title = $scope.menutitle;
        $scope.navigation = NavigationService.getnav();
        $scope.flag = true;
        $scope.header = {
            "name": "Form Name"
        };
        $scope.approval = false;
        if ($stateParams.approval) {
            $scope.approval = true;
        }
        $scope.itemTypes = [{
            value: '',
            name: 'Select Status'
        }, {
            value: 'Copy',
            name: 'Copy'
        }, {
            value: 'Original',
            name: 'Original'
        }];
        $scope.Saved = false;
        $scope.forms = [{
            head: 'Snapshot',
            items: [{
                name: 'Insurer',
                type: 'text'
            }, {
                name: 'Date',
                type: 'date'
            }, {
                name: 'Address',
                type: 'textarea'
            }, {
                name: 'City',
                type: 'system'
            }, {
                name: 'Country',
                type: 'dropdown',
                dropdownValues: ['Mumbai', 'Bihar', 'Orissa']
            }]
        }];
        $scope.isDateNeeded = true;
        $scope.isTypeNeeded = true;
        $scope.confirmNoDocsPendingB = false; // Check For All Docs Waived or Recieved Default False;
        $scope.doxStatus1 = [];
        $scope.doxStatus2 = [];
        $scope.assignment = {};
        $scope.assignment.templateIla = [];
        $scope.assignment.templateIsr = [];
        $scope.assignment.templateLor = [];
        $scope.assignment.templateJir = [];
        $scope.message = {};
        // $scope.timeline = {};
        // $scope.timeline.attachment = [];
        $scope.message.title = "Sent a new message";
        $scope.tempt = $stateParams.type;
        $scope.templateIlaName = $stateParams.templateName;
        console.log('$stateParams.templateName', $stateParams.templateName);


        $scope.confirmNoDocsPending = function (data) {
            $scope.confirmDocsRecieved = [];
            $scope.confirmRecievedForLor = [];
            _.each(data, function (form, key) {
                _.each(form.items, function (item, key2) {
                    if (item.isCheck) {
                        if (item.submit == "Pending" || item.submit == "Partially Recieved") {
                            $scope.confirmNoDocsPendingB = false;
                            $scope.confirmDocsRecieved.push(false);
                            $scope.confirmRecievedForLor.push(false);
                        }
                        if (item.submit == "Received" || item.submit == "Waived") {
                            $scope.confirmDocsRecieved.push(true);
                        }
                        if (item.submit == "Received") {
                            $scope.confirmRecievedForLor.push(true);
                        }

                    }
                });
            });
            $timeout(function () {
                $scope.checkconfirmNoDocsPending();
                $scope.checkconfirmRecievedForLor();
            }, 1000);
            console.log("In confirmNoDocsPending", data);
        };
        $scope.checkconfirmRecievedForLor = function () {
            var ifTrue = _.findIndex($scope.confirmRecievedForLor, function (n) {
                return n;
            });
            if (ifTrue >= 0) {
                $scope.confirmIfRecieved = true;
            } else {
                $scope.confirmIfRecieved = false;
            }
        }
        $scope.checkLorPara = function () {
            $scope.forms.templateName2 = "Demo";
            if ($scope.assignment.templateLor.length == 1 && $scope.assignment.templateLor[0].approvalStatus !== "Approved") {
                _.each($scope.forms.forms, function (form, key) {
                    _.each(form.items, function (item, key2) {
                        if (item.isCheck) {
                            if (item.submit == "Received") {
                                $scope.doxStatus1.push(false);
                                console.log("Here in checkLorPara2");
                            } else {
                                console.log("Here in checkLorPara3");
                                $scope.doxStatus1.push(true);
                            }
                        }
                    });
                });
            } else {
                _.each($scope.forms.forms, function (form, key) {
                    _.each(form.items, function (item, key2) {
                        if (item.isCheck) {
                            if (item.submit == "Received") {
                                $scope.doxStatus2.push(false);
                                console.log("Here in checkLorPara4");
                            } else {
                                console.log("Here in checkLorPara5");
                                $scope.doxStatus2.push(true);
                            }
                        }
                    });
                });
            }
            $timeout(function () {
                $scope.checkcomfirmLorPara();
            }, 1000);
        };
        $scope.checkcomfirmLorPara = function () {
            console.log("$scope.doxStatus1.length", $scope.doxStatus1, $scope.doxStatus1.length);
            if ($scope.doxStatus1.length !== 0) {
                var ifFalse = _.findIndex($scope.doxStatus1, function (n) {
                    return !n;
                });
                if (ifFalse >= 0) {
                    console.log("three");
                    $scope.forms.typeOfPdf = "three";
                    $scope.forms.openingPara = "Thank you very much for extending your cooperation during our visit. During the course of our visit we were able to collect following documents.";
                    $scope.forms.middlePara = "To enable us to proceed further and finalize the loss you are requested to submit complete, clear and legible copies of the documents / information as indicated below.";
                    $scope.forms.closingPara = "You are requested to kindly submit the same as early as possible. Should you need any help in terms of documents sought by us, please feel at ease to get in touch with us.<br> Thanking you and assuring you of best possible attention at all times.";
                } else {
                    console.log("one");
                    $scope.forms.typeOfPdf = "one";
                    $scope.forms.openingPara = "Thank you very much for extending your cooperation during our visit. To enable us to proceed further and finalize the loss you are requested to submit complete, clear and legible copies of the documents / information as indicated below.";
                    $scope.forms.middlePara = "";
                    $scope.forms.closingPara = "You are requested to kindly submit the same as early as possible. Should you need any help in terms of documents sought by us, please feel at ease to get in touch with us.<br> Thanking you and assuring you of best possible attention at all times.";
                }
                $scope.doxStatus1 = [];
            } else {
                var ifFalse = _.findIndex($scope.doxStatus2, function (n) {
                    return !n;
                });
                if (ifFalse >= 0) {
                    console.log("four");
                    $scope.forms.typeOfPdf = "four";
                    $scope.forms.openingPara = "This refers to your claim, the list of requirements shared earlier and your revert on the same. We appreciate that following information / documents asked for have been provided to us.";
                    $scope.forms.middlePara = "However, we are yet to receive following documents / information from your end.";
                    $scope.forms.closingPara = "You are requested to kindly expedite the same.<br> Thanking you and assuring you of best possible attention at all times.";
                } else {
                    console.log("Two");
                    $scope.forms.typeOfPdf = "two";
                    $scope.forms.openingPara = "This refers to your claim and the list of requirements shared earlier. We regret to state that we are yet to receive these documents/information from your end. Kindly treat this communication as GENTLE REMINDER from our end.";
                    $scope.forms.middlePara = "";
                    $scope.forms.closingPara = "You are requested to kindly expedite the same.<br> Thanking you and assuring you of best possible attention at all times.";
                }
                $scope.doxStatus2 = [];
            }
        };
        $scope.checkconfirmNoDocsPending = function () {
            console.log("$scope.confirmDocsRecieved", $scope.confirmDocsRecieved);
            var ifFalse = _.findIndex($scope.confirmDocsRecieved, function (n) {
                return !n;
            });
            console.log("ifFalse", ifFalse);

            if (ifFalse >= 0) {
                $scope.confirmNoDocsPendingB = false;
            } else {
                $scope.confirmNoDocsPendingB = true;
            }
        };
        $scope.addToCategory = function (category) {
            console.log(category.addSub);
            if (category.addSub !== undefined && category.addSub !== "") {
                category.items.push({
                    name: category.addSub,
                    isCheck: true,
                    submit: "Pending"
                });
                toastr.success("Enter Added Successfully");
                category.addSub = ""; // To Empty The Text
            } else {
                toastr.error("Enter Sub-Category Name");
            }
        };
        $scope.getParentEmployee = function () {
            console.log("$scope.empId", $scope.empId);
            NavigationService.getEmployeeData($scope.empId, function (data) {
                console.log("getparent data", data);
                if (data.value) {
                    $scope.employee = data.data;
                    if ($scope.message.employee.employee) {
                        $scope.employee.push({
                            _id: $scope.message.employee._id,
                            name: $scope.message.employee.name,
                            email: $scope.message.employee.officeEmail
                        });
                        _.map($scope.employee, function (values) {
                            values.email.toString();
                            values.name.toString();
                        });

                        $scope.employee = _.uniqBy($scope.employee, "email");
                    }
                } else {
                    $scope.employee.push({
                        _id: $scope.message.employee._id,
                        name: $scope.message.employee.name,
                        email: $scope.message.employee.officeEmail
                    });
                    _.map($scope.employee, function (values) {
                        values.email.toString();
                        values.name.toString();
                    });
                    $scope.employee = _.uniqBy($scope.employee, "email");

                }
                console.log("$scope.forms.employee", $scope.employee);
            });
        };
        $scope.getLoginEmployee = $.jStorage.get("getLoginEmployee");
        $scope.message.employee = $scope.getLoginEmployee;
        $scope.empId = $scope.getLoginEmployee._id;
        $scope.employee = [];
        $scope.getParentEmployee();


        if ($stateParams.assignmentTemplate === "") {
            NavigationService.getOneModel($stateParams.type, $stateParams.template, function (data) {
                $scope.forms = data.data;
            });
        } else {
            var a = {
                _id: $stateParams.assignmentTemplate,
                type: _.camelCase($stateParams.type)
            };
            NavigationService.getAssignmentTemplate(a, function (data) {
                // console.log("6", data.data);
                if (data.data.name === "ICICI Cargo template") {
                    _.map(data.data.forms, function (n) {
                        _.map(n.items, function (m) {
                            if (m.value == "Date") {
                                m.field = new Date(m.field);
                            }
                            if (m.type == "Dropdown") {
                                m.dropdownValues = [];
                                m.dropdownValues = _.split(m.value, ",");
                            }

                        });
                    });
                } else {
                    _.each(data.data.forms, function (n) {
                        _.each(n.items, function (m) {
                            if (m.value == "Date") {
                                m.field = moment(m.field, 'ddd, MMM Do, YYYY').toDate();
                            }
                            if (m.type == "Dropdown") {
                                m.dropdownValues = [];
                                m.dropdownValues = _.split(m.value, ",");
                            }

                        });
                    });
                }

                $scope.forms = data.data;
                if ($scope.forms.type === "templateLor") {
                    if ($scope.forms.openingPara === undefined) {
                        $scope.forms.openingPara = "";
                    }
                    if ($scope.forms.middlePara === undefined) {
                        $scope.forms.middlePara = "";
                    }
                    if ($scope.forms.closingPara === undefined) {
                        $scope.forms.closingPara = "";
                    }
                    console.log("$scope.forms.openingPara", $scope.forms);
                    $scope.wholeFormData = _.cloneDeep(data.data);
                    // $scope.lorShowCategory(false);
                    $scope.confirmNoDocsPending($scope.forms.forms)
                }
                $scope.forms.templateName = data.data.assignment.name;
                $scope.assignment = data.data.assignment;
                // $scope.getTimeline();
            });
        }
        $scope.hasSubCategory = function (category) {
            var retValue = true;
            var indexNum = _.findIndex(category.items, function (n) {
                return n.isCheck;
            });
            if (indexNum >= 0) {
                retValue = true;
            } else {
                retValue = false;
            }
            return retValue;
        };
        $scope.getIsCheckCount = function (category) {
            console.log("................................", category);
            var a = _.countBy(category.items, 'isCheck');
            if (a.true == undefined) {
                return 0;
            }
            return a.true;
        };


        $scope.lorShowCategory = function (data) {
            $scope.showAll = data;
        }

        $scope.addHead = function () {
            $scope.forms.forms.push({
                head: $scope.forms.forms.length + 1,
                items: [{
                    submit: "Pending"
                }]
            });
        };
        $scope.removeHead = function (index) {
            if ($scope.forms.forms.length > 1) {
                $scope.forms.forms.splice(index, 1);
            } else {
                $scope.forms.forms = [{
                    head: '',
                    items: [{}, {}]
                }];
            }
        };
        $scope.addItem = function (obj) {
            console.log("Add Item", obj, $scope.forms.type);
            if ($scope.forms.type == "templateLor") {
                console.log("Add Item In If", obj);
                var index = $scope.forms.forms.indexOf(obj);
                $scope.forms.forms[index].items.push({
                    submit: "Pending"
                });
            } else {
                var index = $scope.forms.forms.indexOf(obj);
                $scope.forms.forms[index].items.push({});
            }
        };

        $scope.removeItem = function (obj, indexItem) {
            var indexHead = $scope.forms.forms.indexOf(obj);
            if ($scope.forms.forms[indexHead].items.length > 1) {
                $scope.forms.forms[indexHead].items.splice(indexItem, 1);
            } else {
                $scope.forms.forms[indexHead].items = [{}];
            }
        };
        $scope.getdescriptions = function (data) {
            console.log("7");
            console.log("IN getdescriptions");
            var formData = {};
            formData.keyword = data;
            formData.filter = {
                "lorCategory": $scope.lorCategory
            };
            NavigationService.searchLorMaster(formData, 1, function (data) {
                $scope.descriptions = data.data.results;
            });
        }
        $scope.getCategories = function (data) {
            var formData = {};
            formData.keyword = data;
            NavigationService.searchLorCategory(formData, 1, function (data) {
                $scope.categories = data.data.results;
            });
        }
        $scope.getOneDescription = function (invoice, $index, outerIndex) {
            $scope.flag = false;
            $scope.lorCategory = invoice._id;
            $scope.forms.forms[outerIndex].items[$index].category = invoice.name;
            $scope.getdescriptions();
        };
        $scope.getAll = function (invoice, $index, outerIndex) {
            console.log("Invoice", invoice, $index, outerIndex);
            $scope.forms.forms[outerIndex].items[$index].name = invoice.name;
            $scope.forms.forms[outerIndex].items[$index].type = invoice.status;
        };
        // $scope.getdescriptions = function (data) {
        //     var formData = {};
        //     formData.keyword = data;
        //     NavigationService.searchLorMaster(formData, 1, function (data) {
        //         $scope.descriptions = data.data.results;
        //         console.log("Tax", $scope.descriptions);
        //     });
        // }
        // $scope.getAll = function (invoice, $index, outerIndex) {
        //     console.log("Invoice", invoice, $index, outerIndex);
        //     $scope.forms.forms[outerIndex].items[$index].name = invoice.name;
        //     $scope.forms.forms[outerIndex].items[$index].type = invoice.status;
        // }
        // $scope.sendMessage = function (type) {
        //     console.log("DEF");
        //     $scope.message.type = type;
        //     var a = {
        //         type: $stateParams.type,
        //         url: {
        //             assignmentTemplate: $stateParams.assignmentTemplate,
        //             type: $stateParams.type
        //         }
        //     };
        //     if (!$scope.message.attachment) {
        //         $scope.message.attachment = [];
        //     }
        //     $scope.message.attachment.push(a);
        //     $scope.timeline.chat.push($scope.message);
        //     NavigationService.saveChat($scope.timeline, function (data) {});
        // };

        // $scope.updateTimelineChat = function (timeline, success) {
        //     console.log("Template updateTimelineChat");
        //     $scope.timeline.chat.push(timeline);
        //     NavigationService.saveChat($scope.timeline, function (data) {
        //         if (data.value) {
        //             toastr.clear();
        //             toastr.success(success[0], success[1]);
        //             $window.history.back();
        //             $scope.getTimeline();
        //         } else {
        //             toastr.clear();
        //             toastr.error("There was an error while updating Timeline.", "Error Updating Timeline");
        //             $window.history.back();
        //         }
        //     });
        // };

        // $scope.getTimeline = function () {
        //     NavigationService.getOneModel("Timeline", $scope.assignment.timeline[0], function (data) {
        //         $scope.timeline = data.data;
        //     });
        // };

        if ($stateParams.assignment !== "") {
            NavigationService.getOneModel("Assignment", $stateParams.assignment, function (data) {
                $scope.assignment = data.data;
                // $scope.getTimeline();
            });
        }

        $scope.cancel = function () {
            $window.history.back();
        }
        // $scope.sendMessage2 = function (type) {
        //     $scope.timeline.chat.push(type);
        //     NavigationService.saveChat($scope.timeline, function (data) {
        //         console.log("FFFFF", data);
        //         $scope.getTimeline();
        //     });
        // };
        $scope.saveAssignment = function (obj, type, timeline, success) {
            console.log("Approval", obj);
            NavigationService.saveAssignmentTemplate(obj, function (data) {
                if (data.value) {
                    if (_.isEmpty(timeline)) {
                        toastr.clear();
                        toastr.success(success[0], success[1]);
                        $window.history.back();
                    } else {
                        console.log("success : ", success);
                        // $scope.updateTimelineChat(timeline, success);
                    }
                } else {
                    toastr.clear();
                    toastr.error("There was an error while saving " + type + " Template.", "Error " + type + " Template");
                    $window.history.back();
                }
            });
        };

        $scope.saveDraft = function (templateObj) {
            if ($scope.approval) {
                $scope.forms.approval = true
            }
            $scope.disableSave = true;
            console.log("Whole Data", $scope.forms, $scope.assignment);
            $scope.forms.assignment = $scope.assignment;
            TemplateService.getToastr();
            if ($scope.forms.type === "templateIla") {
                type = "ILA";
            } else if ($scope.forms.type === "templateLor") {
                type = "LOR";
            }
            var timelineData = {
                type: "Normal",
                employee: $scope.message.employee._id,
                title: type + " " + templateObj.templateName + " Saved as Draft"
            };
            $scope.forms.timelineData = timelineData;
            $scope.forms.draftTimeStamp = Date.now();
            $scope.forms.templateIlaName = $scope.templateIlaName;
            NavigationService.saveDraft($scope.forms, function (data) {
                if (data.value) {
                    toastr.clear();
                    toastr.success(type + " " + templateObj.templateName + " Saved as Draft");
                    $window.history.back();
                    $state.reload();
                } else {
                    toastr.clear();
                    toastr.error(type + " draft failed");
                    $scope.disableSave = false;
                }
            });
        };
        $scope.checkCanCreateLor = function (templateObj) {
            globalfunction.confPara(function (value) {
                if (value) {
                    console.log("True");
                    if ($scope.confirmIfRecieved) {
                        console.log("2");
                        if ($scope.forms.openingPara == "" || $scope.forms.middlePara == "" || $scope.forms.closingPara == "" || $scope.forms.openingPara == undefined || $scope.forms.middlePara == undefined || $scope.forms.closingPara == undefined) {
                            toastr.error("Please  fill All Paragraphs");
                            return false;
                        } else {
                            $scope.generateLor(templateObj);
                        }
                    } else {
                        if ($scope.forms.openingPara == "" || $scope.forms.closingPara == "" || $scope.forms.openingPara == undefined || $scope.forms.closingPara == undefined) {
                            toastr.error("Please  fill All Paragraphs");
                            return false;
                        } else {
                            $scope.generateLor(templateObj);
                        }
                    }
                } else {
                    console.log("False");
                    return false;
                }
            });

        };
        // New
        $scope.generateLor = function (templateObj) {
            $scope.forms.reqtimestamp = Date.now();
            var n = $scope.forms.assignment.templateLor.length
            var timelineData = {
                type: "Normal",
                employee: $.jStorage.get("getLoginEmployee")._id,
                title: "LOR Reminder " + n + " sent for authorization"
            };
            var ifRegenerate = false;
            if ($scope.forms.approvalStatus == "Regenerate") {
                ifRegenerate = true
            }
            if ($scope.forms.lorCount == "NA" || ifRegenerate) {
                var assignment = {
                    _id: $scope.forms.assignment._id,
                    name: $scope.forms.assignment.name,
                    templateLor: $scope.forms.assignment.templateLor
                }
                $scope.forms.lorCount = "LOR";
                // $scope.forms.approvalStatus = "Pending";
                $scope.forms.reqtimestamp = Date.now();
                var newformData = $scope.forms;
                delete newformData.assignment;
                var wholeObj = {
                    assignment: assignment,
                    formData: newformData,
                    employee: $.jStorage.get("getLoginEmployee")._id,
                    type: "LOR"
                }
                NavigationService.sentIlaLorForApproval(wholeObj, function (data) {
                    if (data.value == true) {
                        $state.reload();
                        toastr.clear();
                        $window.history.back();
                    } else {
                        toastr.clear();
                        toastr.err("Unable To Save");
                        $scope.disableSave = false;
                    }
                });
            } else {
                templateObj.received = 0;
                templateObj.pending = 0;
                _.each(templateObj.forms, function (n) {
                    _.each(n.items, function (items) {
                        if (items.isCheck) {
                            if (items.submit == "Received" || items.submit == "Waived") {
                                templateObj.received++;
                            }
                            if (items.submit == "Pending" || items.submit == "Partially Recieved") {
                                templateObj.pending++;
                            }
                        }
                    });
                });
                delete templateObj.file;
                templateObj.approvalStatus = "Pending";
                templateObj.reqtimestamp = Date.now();
                delete templateObj._id;
                delete templateObj.assignment;
                $scope.assignment[_.camelCase($stateParams.type)].push(templateObj);
                var assignmentData = {
                    _id: $scope.assignment._id,
                    templateLor: $scope.assignment.templateLor
                }
                var wholeObj = {
                    assignment: assignmentData,
                    timelineData: timelineData,
                    formData: $scope.forms
                }
                NavigationService.onlyLorForApproval(wholeObj, function (data) {
                    if (data.value) {
                        toastr.clear();
                        $window.history.back();
                    } else {
                        toastr.clear();
                        toastr.err("Unable To Save");
                        $scope.disableSave = false;
                    }
                });
            }
        };
        $scope.saveModel = function (templateObj) {
            TemplateService.getToastr();
            console.log("$stateParams.type = ", $stateParams.type, "Save Data", templateObj, $scope.assignment);
            if ($stateParams.assignment !== "") {
                delete templateObj._id;
                $scope.assignment[_.camelCase($stateParams.type)].push(templateObj);
                NavigationService.modelSave("Assignment", $scope.assignment, function (data) {
                    if (data.value) {
                        $scope.message.title = "Created New " + $stateParams.type;
                        $scope.sendMessage("Template");
                        toastr.clear();
                        toastr.success("Created " + $stateParams.type + " for " + $scope.assignment.name, $stateParams.type);
                        $window.history.back();
                    } else {
                        toastr.error("Error occured in Creating " + $stateParams.type + " for " + $scope.assignment.name, $stateParams.type);
                    }
                });
            } else {
                var Name = _.split($scope.forms.officeEmail, "<");
                var newName = _.trim(Name[0]);
                _.each($scope.employee, function (n) {
                    if (n.name == newName) {
                        $scope.forms.sentTo = n._id // SentTo is Authorizer
                    }
                });
                $scope.forms.sentBy = $.jStorage.get("getLoginEmployee")._id;
                if (templateObj.type == "templateLor") {
                    toastr.clear();
                    $scope.checkCanCreateLor(templateObj);
                } else if (templateObj.type == "templateIla") {
                    $scope.goToILA = false;
                    // Apply Before TimeOut To Check If Custom Input & dropdown is Selected 
                    if ($stateParams.templateName != "ICICI Cargo template") {
                        _.each(templateObj.forms, function (n) {
                            _.each(n.items, function (m) {

                                if (m.type == "Custom Input") {
                                    if (m.field == undefined || m.field == "" || m.field == "Invalid Date") {
                                        $scope.goToILA = true;
                                    }
                                }
                                if (m.type == "Dropdown") {
                                    if (m.field == undefined || m.field == "") {
                                        $scope.goToILA = true;
                                    }
                                }
                            });
                        });
                    }
                    // No Change
                    $timeout(function () {
                        if ($scope.goToILA) {
                            toastr.error("Please Enter All Fields");
                        } else {
                            // var Name = _.split($scope.forms.officeEmail, "<");
                            // var newName = _.trim(Name[0]);
                            // _.each($scope.employee, function (n) {
                            //     if (n.name == newName) {
                            //         $scope.forms.sentTo = n._id // SentTo is Authorizer
                            //     }
                            // });
                            // $scope.forms.sentBy = $.jStorage.get("getLoginEmployee")._id;
                            var assignment = {
                                _id: $scope.forms.assignment._id,
                                name: $scope.forms.assignment.name,
                                templateIla: $scope.forms.assignment.templateIla
                            }
                            $scope.forms.reqtimestamp = Date.now();
                            var newformData = $scope.forms;
                            delete newformData.assignment;
                            var wholeObj = {
                                assignment: assignment,
                                formData: newformData,
                                employee: $.jStorage.get("getLoginEmployee")._id,
                                type: "ILA"
                            }
                            NavigationService.sentIlaLorForApproval(wholeObj, function (data) {
                                if (data.value) {
                                    $state.reload();
                                    toastr.clear();
                                    $window.history.back();
                                } else {
                                    toastr.clear();
                                    toastr.err("Unable To Save");
                                    $scope.disableSave = false;
                                }
                            });
                        }
                    }, 2000);
                }
            }
        };

        $scope.confLor = function () {
            globalfunction.confLor(function (value) {
                if (value) {
                    $scope.confirmAllDocs($scope.forms);
                }
            });
        };
        $scope.confirmAllDocs = function (templateObj) {
            TemplateService.getToastr();
            console.log("In All Docs FFFFF", templateObj);
            $scope.Saved = true;
            $scope.forms.authTimestamp = new Date();
            $scope.forms.approvalStatus = "All Docs Received";
            $scope.forms.assignment.getAllTaskStatus.docs = "Done";
            $scope.forms.assignment.getAllTaskStatus.docsTime = Date.now();

            $scope.forms.templateIlaName = $scope.templateIlaName;
            NavigationService.editAssignmentTemplate($scope.forms, function (data) {
                console.log("After PDF Generate", data);
                if (data.value) {
                    var a = {};
                    var goto = "";
                    var type = "";
                    a.employee = $scope.message.employee;
                    a.title = "LOR " + $scope.assignment.name + " All Docs Received";
                    a.type = "File";
                    a.attachment = data.data.name;
                    var obj = {};
                    var getAllTaskStatus = {
                        type: "Docs",
                        docs: "Done",
                        docsTime: Date.now()
                    };
                    console.log("$stateParams.approval");
                    var obj = {
                        assignId: $scope.assignment._id,
                        _id: $scope.forms._id,
                        approvalStatus: "All Docs Received",
                        authTimestamp: new Date(),
                        type: $scope.forms.type,
                        getAllTaskStatus: getAllTaskStatus
                    };
                    var mainObj = {
                        assignmentData: obj,
                        timelineData: a
                    }
                    // var success = [];
                    // success[0] = "Approved " + templateObj.templateName + " for " + $scope.assignment.name;
                    // success[1] = $stateParams.type;
                    // allDocsRecieved
                    NavigationService.allDocsRecieved(mainObj, function (data) {
                        if (data.value) {
                            toastr.clear();
                            toastr.success("Success");
                        } else {
                            toastr.error("Failed " + $scope.assignment.name + " LOR");
                        }
                    });
                } else {
                    toastr.clear();
                    toastr.error("Error occured in Updating " + $stateParams.type + " for " + $scope.assignment.name, $stateParams.type);
                }
            });
        };
        $scope.approveLorAfterCheck = function (templateObj) {
            TemplateService.getToastr();
            var timelineData = {
                attachment: [],
                type: "File",
                viewEmailStatus: "true",
                event: "LOR Release",
                employee: $scope.message.employee._id,
                title: "LOR " + templateObj.templateName + " authorized"
            };
            if ($scope.forms.assignment.templateLor.length == 1) {
                timelineData.title = "LOR authorized"
            } else {
                var lorLength = $scope.forms.assignment.templateLor.length - 1;
                timelineData.title = "LOR Reminder " + lorLength + " authorized";
            }
            $scope.forms.timelineData = timelineData;
            $scope.forms.assignment.getAllTaskStatus.lor = "Done";
            if ($scope.forms.assignment.getAllTaskStatus.lorTime == undefined) {
                $scope.forms.assignment.getAllTaskStatus.lorTime = Date.now();
            }
            $scope.forms.authTimestamp = new Date();
            $scope.forms.approvalStatus = "Approved";
            $scope.forms.templateIlaName = $scope.templateIlaName;
            NavigationService.ilaLorApproval($scope.forms, function (data) {
                if (data.value) {
                    $state.reload();
                    toastr.clear();
                    $window.history.back();
                } else {
                    toastr.clear();
                    toastr.err("Unable To Save");
                    $scope.disableSave = false;
                }
            });
        };
        $scope.checkLORConf = function (templateObj) {
            globalfunction.confPara(function (value) {
                if (value) {
                    $scope.approveLorAfterCheck(templateObj);
                }
            });
        };
        $scope.acceptModel = function (templateObj) {
            if (templateObj.type == "templateIla") {
                TemplateService.getToastr();
                var timelineData = {
                    attachment: [],
                    type: "File",
                    viewEmailStatus: "true",
                    event: "ILA Release",
                    employee: $scope.message.employee._id,
                    title: "ILA " + templateObj.templateName + " authorized"
                };
                $scope.forms.timelineData = timelineData
                $scope.forms.assignment.getAllTaskStatus.ila = "Done",
                    $scope.forms.assignment.getAllTaskStatus.ilaTime = Date.now();
                $scope.forms.authTimestamp = new Date();
                $scope.forms.approvalStatus = "Approved";
                $scope.forms.templateIlaName = $scope.templateIlaName;
                NavigationService.ilaLorApproval($scope.forms, function (data) {
                    if (data.value) {
                        $state.reload();
                        toastr.clear();
                        $window.history.back();
                    } else {
                        toastr.clear();
                        toastr.err("Unable To Save");
                        $scope.disableSave = false;
                    }
                });
            } else {
                //
                $scope.checkLORConf(templateObj);
                // 
            }

        };
        $scope.comment = function (data) {
            if (data == "Revise") {
                $scope.filterStatus = "Revise";
            } else {
                $scope.filterStatus = "Reject";
            }
            console.log("In", $scope.forms._id);
            var modalInstance = $uibModal.open({
                scope: $scope,
                templateUrl: '/frontend/views/modal/revise-comment.html',
                size: 'md'
            });
        };
        $scope.submitRevise = function (filter) {
            TemplateService.getToastr();
            if ($scope.forms.type == "templateLor") {
                var type = "LOR";
                var assignment = {
                    _id: $scope.forms.assignment._id,
                    name: $scope.forms.assignment.name,
                    templateLor: $scope.forms.assignment.templateLor
                }
            } else {
                var type = "ILA";
                var assignment = {
                    _id: $scope.forms.assignment._id,
                    name: $scope.forms.assignment.name,
                    templateIla: $scope.forms.assignment.templateIla
                }
            }
            var newformData = $scope.forms;
            delete newformData.assignment;
            wholeObj = {
                formData: newformData,
                assignment: assignment,
                employee: $.jStorage.get("getLoginEmployee")._id,
                type: type,
                message: filter.comment
            }
            NavigationService.saveAndRegenerateIlaLor(wholeObj, function (data) {
                if (data.value) {
                    toastr.clear();
                    toastr.success(type + " " + assignment.name + " sent back for regeneration");
                    $window.history.back();
                } else {
                    toastr.clear();
                    toastr.error(type + " " + assignment.name + " sent back for regeneration failed");
                }
            });
        };
        $scope.submitReject = function (filter) {
            var type;
            var assignment = {};
            console.log("$scope.forms.assignment.templateLor", $scope.forms.assignment.templateLor);
            if ($scope.forms.type == "templateLor") {
                type = "LOR";
                assignment = {
                    _id: $scope.forms.assignment._id,
                    name: $scope.forms.assignment.name,
                    templateLor: $scope.forms.assignment.templateLor
                }
            } else {
                type = "ILA";
                assignment = {
                    _id: $scope.forms.assignment._id,
                    name: $scope.forms.assignment.name,
                    templateIla: $scope.forms.assignment.templateIla
                }
            }
            var wholeObj = {
                message: filter.comment,
                type: type,
                assignment: assignment,
                employee: $.jStorage.get("getLoginEmployee")._id
            }
            NavigationService.rejectILALOR(wholeObj, function (data) {
                if (data.value) {
                    toastr.success(type + "for " + assignment.name + " rejected");
                    window.history.back();
                } else {
                    toastr.error("failed rejecting " + type + " for " + assignment.name);
                }
            });
        };
        $scope.previewPdf = function () {
            // var pdf = new jsPDF();
            // // var pdf = new jsPDF({
            // //     orientation: 'landscape',
            // //     unit: 'in',
            // //     format: [4, 2]
            // // });
            // var margin = {
            //     top: 10,
            //     bottom: 20,
            //     left: 10,
            //     width: 522
            // };
            // // $scope.formDatas="Hero!!!";
            // $http.get("frontend/views/pdf/new-ila.html")
            //     .then(function (response) {
            //         // console.log("response",response);
            //         pdf.fromHTML($('#pdfView').get(0), margin.top, margin.left, {
            //             pagesplit: true
            //         }, function () {
            //             // pdf.text('Hello world!', 10, 10)
            //             pdf.save('ILA' + '.pdf');
            //         });
            //     });

            TemplateService.getToastr();
            $scope.forms.authTimestamp = new Date();
            $scope.forms.templateIlaName = $scope.templateIlaName;
            // console.log('$scope.forms', $scope.forms);
            NavigationService.getPdfPreview($scope.forms, function (data) {
                if (data.value) {
                    toastr.clear();
                    window.open(adminurl + 'upload/readFile?file=' + data.data, '_blank');
                } else {
                    toastr.clear();
                    toastr.err("Error Previewing PDF");
                }
            });
        };
    })
    .controller('TimelineCtrl', function ($scope, $window, TemplateService, NavigationService, AssignmentTemplate, $timeout, $uibModal, $stateParams, toastr, $filter, $state, fakeFac, Upload, $rootScope) {
        $scope.template = TemplateService.changecontent("timeline", $state);
        console.log("template :", $scope.template);
        $scope.menutitle = NavigationService.makeactive("Timeline");
        TemplateService.title = $scope.menutitle;
        $scope.navigation = NavigationService.getnav();
        $scope.emailData = {};
        $scope.email = {
            message: ""
        };
        $scope.assignment = {};
        var role = $.jStorage.get("role");

        //To include html pages for photo grid
        $scope.photoGridObj = {
            one: "/frontend/views/content/photo-1.html",
            two: "/frontend/views/content/photo-2.html",
            three: "/frontend/views/content/photo-3.html",
            four: "/frontend/views/content/photo-4.html",
            five: "/frontend/views/content/photo-5.html",
            six: "/frontend/views/content/photo-5plus.html",
        };

        // For Access Button Rights Visibility Rights
        _.each(role.roles, function (n) {
            // console.log("In ilaAccess", n);
            if (n.mainMenu == "Timeline" && n.subMenu == "Request" && n.view.val) {
                $scope.requestAccess = true;
            }
            if (n.mainMenu == "Timeline" && n.subMenu == "Approval" && n.view.val) {
                $scope.approvalAccess = true;
            }
            if (n.mainMenu == "Timeline" && n.subMenu == "ILA-Waive") {
                $scope.ilaAccess = true;
            }
            if (n.mainMenu == "Timeline" && n.subMenu == "LOR-Waive") {
                $scope.lorAccess = true;
            }
            if (n.mainMenu == "Timeline" && n.subMenu == "Survey-Waive") {
                $scope.surveyAccess = true;
            }
            if (n.mainMenu == "Timeline" && n.subMenu == "Assessment-Waive") {
                $scope.assessmentAccess = true;
            }
            if (n.mainMenu == "Timeline" && n.subMenu == "Consent-Waive") {
                $scope.consentAccess = true;
            }
            if (n.mainMenu == "Timeline" && n.subMenu == "FSR-Waive") {
                $scope.fsrAccess = true;
            }
        });
        $scope.accessForEditButton = false;
        $scope.accessForEditButtons = function () {
            // $scope.yourPromise = fakeFac.success().then(function () {
            //     console.log("Success");
            $scope.accessForEditButton = !$scope.accessForEditButton;
            // });
        };
        $scope.assignmentRefresh = function () {
            NavigationService.getOneModel("Assignment", $stateParams.id, function (data) {
                $scope.assignment = data.data;
                if ($scope.assignment.ilaAccessReq == undefined) {
                    $scope.assignment.ilaAccessReq = $scope.assignment.ilaAccess;
                }
                if ($scope.assignment.lorAccessReq == undefined) {
                    $scope.assignment.lorAccessReq = $scope.assignment.lorAccess;
                }
                if ($scope.assignment.surveyAccessReq == undefined) {
                    $scope.assignment.surveyAccessReq = $scope.assignment.surveyAccess;
                }
                if ($scope.assignment.assessmentAccessReq == undefined) {
                    $scope.assignment.assessmentAccessReq = $scope.assignment.assessmentAccess;
                }
                if ($scope.assignment.consentAccessReq == undefined) {
                    $scope.assignment.consentAccessReq = $scope.assignment.consentAccess;
                }
                if ($scope.assignment.fsrAccessReq == undefined) {
                    $scope.assignment.fsrAccessReq = $scope.assignment.fsrAccess;
                }
                // Please  Confirm As Per TestServer
                // NavigationService.setGlobalAssignmentStatus($scope.assignment, function (data) {});
                _.each($scope.assignment, function (n, assignmentKey) {
                    // console.log("assignment for template");
                    _.each($scope.files, function (m, filesKey) {
                        if (assignmentKey === m.type) {
                            m.files = n;
                        }
                    });
                    console.log(assignmentKey);
                });
                if ($scope.assignment.natureOfLoss) {
                    $scope.assignment.natureloss = "";
                }
                if (data.data.timeline && data.data.timeline[0]) {
                    // console.log("in if");
                    $scope.timelineID = data.data.timeline[0];
                    $scope.getTimeline();
                } else {
                    console.log("in else");
                    NavigationService.createTimeline(data.data._id, function (data) {
                        NavigationService.getOneModel("Assignment", $stateParams.id, function (data) {
                            $scope.timelineID = data.data.timeline[0];
                            $scope.getTimeline();
                        });
                    });
                }
                $scope.getWaiverStatus();
                // Photos Limit
                $scope.photoLimit = 16;
                if ($scope.assignment.survey) {
                    if ($scope.assignment.survey.length == 0) {
                        $scope.photoLimit = 16
                    } else {
                        $scope.photoLimit = 16 * $scope.assignment.survey.length
                    }
                }
            });

        }
        $scope.assignmentRefresh();

        $scope.surveyDate;
        $scope.getAllSurveyors = [];
        $scope.finalSurveyors = [];
        $scope.assignment = {};
        $scope.emailtos = [];
        $scope.tinymceModel = 'Initial content';
        $scope.tinymceOptions = {
            resize: true,
            plugins: 'link image code print textcolor',
            toolbar: 'undo redo | bold italic | alignleft aligncenter alignright | code'
        };
        $scope.tagHandler = function (tag) {
            return {
                name: "",
                email: tag
            }
        }
        $scope.createInvoiceButton = function () {
            // if ($scope.assignment.timelineStatus !== "Force Closed") {
            //     var invoiceCreateFlag = false;
            //     if ($scope.assignment.getAllTaskStatus.assessment == "Waived" && $scope.assignment.getAllTaskStatus.consent == "Waived") {
            //         invoiceCreateFlag = true;
            //     } else if ($scope.assignment.getAllTaskStatus.assessment == "Not Done" && $scope.assignment.getAllTaskStatus.consent == "Not Done") {
            //         toastr.error("Invoice cannot be made without uploading Assessment and Consent");
            //     } else if ($scope.assignment.getAllTaskStatus.assessment !== "Waived") {
            //         console.log("AAAAAAAAAAA", $scope.assignment.getAllTaskStatus.assessment)
            //         if ($scope.assignment.assessment) {
            //             if ($scope.assignment.assessment.length == 1) {
            //                 invoiceCreateFlag = true;
            //             } else {
            //                 if ($scope.assignment.assessment.length == 0) {
            //                     toastr.error("Invoice cannot be made without uploading Assessment");
            //                     console.log("1");
            //                 } else if ($scope.assignment.assessment.length > 1) {
            //                     toastr.error("There should be not be more than one Assessment");
            //                 }
            //             }
            //         } else {
            //             console.log("2");
            //             toastr.error("Invoice cannot be made without uploading Assessment");
            //         }


            //     } else if ($scope.assignment.getAllTaskStatus.consent != "Waived") {
            //         if ($scope.assignment.consent) {
            //             if ($scope.assignment.consent.length == 1) {
            //                 invoiceCreateFlag = true;
            //             } else {
            //                 if ($scope.assignment.consent.length == 0) {
            //                     toastr.error("Invoice cannot be made without uploading Consent");
            //                 } else if ($scope.assignment.consent.length > 1) {
            //                     toastr.error("There should be not be more than one Consent");
            //                 }
            //             }
            //         } else {
            //             toastr.error("Invoice cannot be made without uploading Consent");
            //         }

            //     }
            // if (invoiceCreateFlag) {
            //     if ($scope.assignment.invoice.length === 0) {
            //         $scope.viewInvoice($scope.assignment, ''); // For First Invoice
            //     } else if ($scope.assignment.invoice.length === 1) {
            //         if (_.isEmpty($scope.assignment.invoice[0].approvalTime)) {
            //             toastr.error("Last Invoice in Process");
            //         } else {
            //             $scope.confInvoice(); // From 2nd
            //         }
            //     } else if (!_.isEmpty($scope.assignment.invoice[$scope.assignment.invoice.length - 1].approvalTime)) {
            //         $scope.confInvoice();
            //     } else {
            //         toastr.error("Last Invoice in Process");
            //     }
            // }
            // } else {
            //     toastr.error("Assignment is Force Closed ");
            // }
            if ($scope.assignment.timelineStatus !== "Force Closed") {
                NavigationService.calcAssignmentStatusForInvoiceCreation($scope.assignment, function (data) {
                    if (data.value) {
                        console.log(data);
                        if (data.data) {
                            if ($scope.assignment.invoice.length === 0) {
                                $scope.viewInvoice($scope.assignment, ''); // For First Invoice
                            } else if ($scope.assignment.invoice.length === 1) {
                                if (_.isEmpty($scope.assignment.invoice[0].approvalTime)) {
                                    toastr.error("Last Invoice in Process");
                                } else {
                                    $scope.confInvoice(); // From 2nd
                                }
                            } else if (!_.isEmpty($scope.assignment.invoice[$scope.assignment.invoice.length - 1].approvalTime)) {
                                $scope.confInvoice();
                            } else {
                                toastr.error("Last Invoice in Process");
                            }
                        } else {
                            toastr.error("Please complete all activities till TBB1");
                        }
                    } else {
                        toastr.error("Please complete all activities till TBB");
                    }
                })
            } else {
                toastr.error("Assignment is Force Closed ");
            }
        };
        $scope.confInvoice = function () {
            globalfunction.confInvoice(function (value) {
                console.log("Delete value", value);
                if (value) {
                    console.log("$scope.ModelApi", $scope.ModelApi);
                    $scope.viewInvoice($scope.assignment, '');
                }
            });
        };

        $scope.forceClose = function () {
            var modalInstance = $uibModal.open({
                scope: $scope,
                templateUrl: '/frontend/views/modal/forceclose-comment.html',
                size: 'md'
            });
        }
        $scope.reopen = function () {
            var modalInstance = $uibModal.open({
                scope: $scope,
                templateUrl: '/frontend/views/modal/reopen-comment.html',
                size: 'md'
            });
        }
        $scope.onhold = function () {
            var modalInstance = $uibModal.open({
                scope: $scope,
                templateUrl: '/frontend/views/modal/onhold-comment.html',
                size: 'md'
            });
        }

        $scope.unhold = function () {
            $scope.assignment.timelineStatus = $scope.assignment.prevtimelineStatus;
            var newChat = {};
            newChat.employee = $scope.message.employee._id;
            newChat.title = "Assignment " + $scope.assignment.name + " UnHold";
            newChat.type = "Normal";
            NavigationService.modelSave('assignment', $scope.assignment, function (data) {
                if (data.value === true) {
                    $scope.sendMessage2(newChat);
                    toastr.success($scope.assignment.name + " Updated", "Assignment " + $scope.assignment.name);
                } else {
                    toastr.error("Error in updating " + $scope.assignment.name + ".", "Assignment " + $scope.assignment.name);
                }
            });
        }

        $scope.getEmployeeEmailsTo = function (select) {
            NavigationService.getEmployeeNameEmail({
                keyword: select
            }, i, function (data) {
                // console.log("1data", data);
                if (data.value === true) {
                    $scope.employeeTo = data.data;
                    // console.log("$scope.employeeTo", $scope.employeeTo);
                } else {
                    $scope.employeeTo = [];
                }
            });
        }
        $scope.getEmployeeEmailsCc = function (select) {
            NavigationService.getEmployeeNameEmail({
                keyword: select
            }, i, function (data) {
                // console.log("1data", data);
                if (data.value === true) {
                    $scope.employeeCc = data.data;
                    // console.log("$scope.employeeCc", $scope.employeeCc);
                } else {
                    $scope.employeeCc = [];
                }
            });
        }

        $scope.getEmployeeEmailsBcc = function (select) {
            NavigationService.getEmployeeNameEmail({
                keyword: select
            }, i, function (data) {
                // console.log("1data", data);
                if (data.value === true) {
                    $scope.employeeBcc = data.data;
                    console.log("$scope.employeeBcc", $scope.employeeBcc);
                } else {
                    $scope.employeeBcc = [];
                }
            });
        }
        $scope.getEmployeeEmailsTo("");
        $scope.getEmployeeEmailsCc("");
        $scope.getEmployeeEmailsBcc("");

        $scope.refreshEmployeeTo = function (select) {
            console.log("$select", select);
            $scope.getEmployeeEmailsTo(select);
        }
        $scope.refreshEmployeeCc = function (select) {
            console.log("$select", select);
            $scope.getEmployeeEmailsCc(select);
        }
        $scope.refreshEmployeeBcc = function (select) {
            console.log("$select", select);
            $scope.getEmployeeEmailsBcc(select);
        }

        $scope.submitForceClose = function (data) {
            $scope.assignment.forceClosedComment = data.comment;
            $scope.assignment.forceClosedReqTime = Date.now();
            $scope.assignment.getAllTaskStatus.forceClosed = "Pending";
            $scope.assignment.assignmentapprovalStatus = "Pending ForceClosed";
            console.log($scope.assignment.forceCloseComment);
            var newChat = {};
            newChat.employee = $scope.message.employee._id;
            newChat.title = "Assignment " + $scope.assignment.name + " Sent for ForceClose";
            newChat.message = data.comment;
            newChat.type = "Normal";
            if ($scope.assignment.sentBy !== undefined) {
                if (_.isEmpty($scope.assignment.sentBy)) {
                    delete($scope.assignment.sentBy)
                }
            };
            var finalData = {};
            finalData.assignment = $scope.assignment;
            finalData.timeline = newChat;
            NavigationService.changeAssignmentApprovalStatus(finalData, function (data) {
                if (data.value === true) {
                    // ////$state.reload();
                    toastr.success($scope.assignment.name + " Updated", "Assignment " + $scope.assignment.name);
                } else {
                    toastr.error("Error in updating " + $scope.assignment.name + ".", "Assignment " + $scope.assignment.name);
                }
            });
        }
        $scope.submitReopen = function (data) {
            $scope.assignment.sentBy = $.jStorage.get("getLoginEmployee")._id;
            $scope.assignment.reopenComment = data.comment;
            $scope.assignment.reopenReqTime = Date.now();
            $scope.assignment.getAllTaskStatus.ReOpened = "Pending";
            $scope.assignment.assignmentapprovalStatus = "Pending ReOpened";
            var newChat = {};
            newChat.employee = $scope.message.employee._id;
            newChat.title = "Assignment " + $scope.assignment.name + " Sent for ReOpen";
            newChat.message = data.comment;
            newChat.type = "Normal";
            if ($scope.assignment.sentBy !== undefined) {
                if (_.isEmpty($scope.assignment.sentBy)) {
                    delete($scope.assignment.sentBy)
                }
            };
            var finalData = {};
            finalData.assignment = $scope.assignment;
            finalData.timeline = newChat;
            NavigationService.changeAssignmentApprovalStatus(finalData, function (data) {
                if (data.value === true) {
                    //////$state.reload();
                    toastr.success($scope.assignment.name + " Updated", "Assignment " + $scope.assignment.name);
                } else {
                    toastr.error("Error in updating " + $scope.assignment.name + ".", "Assignment " + $scope.assignment.name);
                }
            });
        }
        $scope.submitOnhold = function (data) {
            $scope.assignment.onholdComment = data.comment;
            $scope.assignment.onholdReqTime = Date.now();
            $scope.assignment.getAllTaskStatus.OnHold = "Pending";
            $scope.assignment.assignmentapprovalStatus = "Pending OnHold";
            var newChat = {};
            newChat.employee = $scope.message.employee._id;
            newChat.title = "Assignment " + $scope.assignment.name + " Sent for OnHold";
            newChat.message = data.comment;
            newChat.type = "Normal";
            if ($scope.assignment.sentBy !== undefined) {
                if (_.isEmpty($scope.assignment.sentBy)) {
                    delete($scope.assignment.sentBy)
                }
            };
            var finalData = {};
            finalData.assignment = $scope.assignment;
            finalData.timeline = newChat;
            NavigationService.changeAssignmentApprovalStatus(finalData, function (data) {
                if (data.value === true) {
                    //////$state.reload();
                    toastr.success($scope.assignment.name + " Updated", "Assignment " + $scope.assignment.name);
                } else {
                    toastr.error("Error in updating " + $scope.assignment.name + ".", "Assignment " + $scope.assignment.name);
                }
            });
        }
        $scope.sendMessage2 = function (type) {
            $scope.timeline.chat.push(type);
            NavigationService.saveChat($scope.timeline, function (data) {
                console.log("FFFFF", data);
                $scope.getTimeline();
            });
        };

        $scope.emailersData = function (type, emailData, index) {
            console.log("email Data", emailData);
            $scope.emailData = {};
            // emailData.to =  _.uniq(emailData.to);
            var i = 0;
            var toData = [];
            _.map(emailData.to, function (values) {
                values.email.toString();
                values.name.toString();
            });
            emailData.to = _.uniqBy(emailData.to, "email");
            console.log("values array ", emailData.to);
            emailData.assignmentName = (emailData.assignmentName ? emailData.assignmentName : "NA");
            emailData.assignmentNo = (emailData.assignmentNo ? emailData.assignmentNo : "NA");
            emailData.ownerName = (emailData.ownerName ? emailData.ownerName : "NA");
            emailData.ownerEmail = (emailData.ownerEmail ? emailData.ownerEmail : "NA");
            emailData.ownerPhone = (emailData.ownerPhone ? emailData.ownerPhone : "NA");
            emailData.siteCity = (emailData.siteCity ? emailData.siteCity : "NA");
            emailData.to = (emailData.to ? emailData.to : []);
            emailData.cc = (emailData.cc ? emailData.cc : []);
            emailData.bcc = (emailData.bcc ? emailData.bcc : []);
            emailData.surveyorNumber = (emailData.surveyorNumber ? emailData.surveyorNumber : "NA");
            emailData.surveyorName = (emailData.surveyorName ? emailData.surveyorName : "");
            emailData.surveyorEmail = (emailData.surveyorEmail ? emailData.surveyorEmail : "");
            emailData.insuredName = (emailData.insuredName ? emailData.insuredName : "NA");
            emailData.ilaAuthDate = (emailData.ilaAuthDate ? emailData.ilaAuthDate : "NA");
            emailData.claimNo = (emailData.claimNo ? emailData.claimNo : "NA");
            emailData.productName = (emailData.productName ? emailData.productName : "NA");
            emailData.policyDoc = (emailData.policyDoc ? emailData.policyDoc : "NA");
            emailData.bankDetails = (emailData.bankDetails ? emailData.bankDetails : "NA");
            emailData.threadId = (emailData.threadId ? emailData.threadId : "");
            emailData.originalSubject = (emailData.originalSubject ? emailData.originalSubject : "NA");
            emailData.originalFrom = (emailData.originalFrom ? emailData.originalFrom : "NA");
            emailData.originalBody = (emailData.originalBody ? emailData.originalBody : "");
            emailData.toEmail = (emailData.toEmail ? emailData.toEmail : "");

            switch (type) {
                case "Acknowledgment Email":
                    {
                        var emails = {
                            name: 'Acknowledgment Email',
                            from: emailData.ownerEmail,
                            to: emailData.toEmail,
                            cc: emailData.cc,
                            bcc: emailData.bcc,
                            subject: emailData.originalSubject + ". Assignment : " + emailData.assignmentNo + " | Site City : " + emailData.siteCity,
                            message: "<html><body><p style='font-size: 16px;'>Dear Sir/Madam,</p><p style='font-size: 16px;'>Thank you for retaining us to inspect & assess the subject loss. This is to confirm that " + emailData.surveyorName + " shall be attending this claim. He can be reached on " + emailData.surveyorNumber + ". Our reference number for this claim would be " + emailData.assignmentNo + "</p> <p style='font-size: 16px;'>Should you ever need any support / information / update, please feel at ease to get in touch with me.</p><br>" + "<p style='font-size: 16px;'>Warm Regards, <br>" + emailData.ownerName + "<br> " + emailData.ownerPhone + "<br>" + emailData.ownerEmail + "</p></body></html><br>" + emailData.originalMessage,
                            mailType: "updateThreadId"
                        }
                        $scope.emailData = emails;
                    }
                    break;

                case "Deputation mail":
                    {
                        var to = [];
                        to.push({
                            name: emailData.surveyorName,
                            email: emailData.surveyorEmail
                        });
                        var emails = {
                            name: 'Deputation mail',
                            from: emailData.ownerEmail,
                            to: to,
                            cc: emailData.cc,
                            bcc: emailData.bcc,
                            subject: emailData.originalSubject + ". Assignment : " + emailData.assignmentNo + " | Site City : " + emailData.siteCity,
                            message: "<html><body><p style='font-size: 16px;'>Dear " + emailData.surveyorName + ",</p><p style='font-size: 16px;'>Please refer to our telecom, in respect of the subject claim. You are requested to kindly attend the loss inline with the discussions held and specific requirements of the claim. Our reference number for this claim would be " + emailData.assignmentNo + "</p> <p style='font-size: 16px;'>In order to assist you, we are attaching relevant format of JIR. Please ensure to capture every detail there in & get the same duly signed by the concerned person. In an unlikely event wherein there is a difference of opinion between yourself & the concerned person, both the opinions may be recorded. We would appreciate a brief call from the site while you are attending the loss as this helps us update the insurer's of the developments. Should you ever need any support / information / update please feel at ease to get in touch with me. I will be more than willing to assist.</p><br>" + "<p style='font-size: 16px;'>Warm Regards, <br>" + emailData.ownerName + "<br> " + emailData.ownerPhone + "<br>" + emailData.ownerEmail + "</p></body></html><br>" + emailData.originalMessage,
                            // threadId: emailData.threadId
                        }
                        $scope.emailData = emails;
                    }
                    break;
                case "On Survey Attended":
                    {
                        var emails = {
                            name: 'On Survey Attended',
                            from: emailData.ownerEmail,
                            to: emailData.toEmail,
                            cc: emailData.cc,
                            bcc: emailData.bcc,
                            subject: emailData.originalSubject + ". Assignment : " + emailData.assignmentNo + " | Site City : " + emailData.siteCity,
                            message: "<html><body><p style='font-size: 16px;'>We are pleased to inform you that the survey for the said claim has been attended on " + emailData.surveyDate + " No sooner we receive further details, we shall update you in this regard. Meanwhile, request you to kindly bear with us. Should you ever need any support / information / update please feel at ease to get in touch with me. I will be more than willing to assist.</p><br>" + "<p style='font-size: 16px;'>Warm Regards, <br>" + emailData.ownerName + "<br> " + emailData.ownerPhone + "<br>" + emailData.ownerEmail + "</p></body></html>",
                            threadId: emailData.threadId
                        }
                        $scope.emailData = emails;
                    }
                    break;

                case "ILA Release":
                    {
                        var emails = {
                            name: 'ILA Release',
                            from: emailData.ownerEmail,
                            to: emailData.toEmail,
                            cc: emailData.cc,
                            bcc: emailData.bcc,
                            subject: emailData.originalSubject + ". Assignment : " + emailData.assignmentNo + " | Site City : " + emailData.siteCity,
                            message: "<html><body><p style='font-size: 16px;'>Dear Sir/Madam,</p><p style='font-size: 16px;'>We are pleased to release the ILA in respect of our Assignment No. " + emailData.assignmentNo + " and your claim " + emailData.claimNo + " and policy " + emailData.policyDoc + ".</p><p style='font-size: 16px;'>We hope that the same shall serve your purpose. Should you ever need any support / information / update please feel at ease to get in touch with me. I will be more than willing to assist.</p>" + "<p style='font-size: 16px;'> Warm Regards, <br>" + emailData.ownerName + "<br> " + emailData.ownerPhone + "<br>" + emailData.ownerEmail + "</p></body></html>",
                            threadId: emailData.threadId

                        }

                        $scope.emailData = emails;
                    }
                    break;

                case "ILA Send for Authorization":
                    {
                        var emails = {
                            name: 'ILA Send for Authorization',
                            from: emailData.ownerEmail,
                            to: "",
                            cc: emailData.cc,
                            bcc: emailData.bcc,
                            subject: "ILA Send for Authorization Mail of Assignment : " + emailData.assignmentNo,
                            message: "<html><body><p style='font-size: 16px;'>Please go through the ILA for Assignment No. " + emailData.assignmentNo + " in respect of loss sustained by " + emailData.insuredName + " on account of damage to " + emailData.productName + " and authorize the same.</p><br>" + "<p style='font-size: 16px;'> Warm Regards, <br>" + $.jStorage.get("profile").name + "</p></body></html>"
                        }
                        $scope.emailData = emails;
                    }
                    break;

                case "Invoice Authorization":
                    {
                        var emails = {
                            name: 'Invoice Authorization',
                            from: emailData.ownerEmail,
                            to: emailData.to,
                            cc: emailData.cc,
                            bcc: emailData.bcc,
                            subject: "Invoice Authorization : " + emailData.invoiceNumber,
                            message: "<html><body><p style='font-size: 16px;'>I have gone through the Invoice prepared for " + emailData.insuredName + ", Invoice No. " + emailData.invoiceNumber + " and authorized the same. It is OK to release.</p><br>" + "<p style='font-size: 16px;'> Warm Regards, <br>" + emailData.ownerName + "<br> " + emailData.ownerPhone + "<br>" + emailData.ownerEmail + "</p></body></html>"
                        }
                        $scope.emailData = emails;
                    }
                    break;

                case "Invoice Back to Regenerate":
                    {
                        var emails = {
                            name: 'Invoice Back to Regenerate',
                            from: emailData.ownerEmail,
                            to: emailData.to,
                            cc: emailData.cc,
                            bcc: emailData.bcc,
                            subject: "Invoice Back to Regenerate : " + emailData.invoiceNumber,
                            message: "<html><body><p style='font-size: 16px;'>I have gone through the Invoice prepared for " + emailData.insuredName + ", Invoice No. " + emailData.invoiceNumber + ". Kindly make the changes as advised to you & resend for authorization.</p><p style='font-size: 16px;'>Please let me know if assistance required.</p>" + "<p style='font-size: 16px;'> Warm Regards, <br>" + emailData.ownerName + "<br> " + emailData.ownerPhone + "<br>" + emailData.ownerEmail + "</p></body></html>"
                        }
                        $scope.emailData = emails;
                    }
                    break;

                case "Invoice Cancel":
                    {
                        var emails = {
                            name: 'Invoice Cancel',
                            from: emailData.ownerEmail,
                            to: emailData.to,
                            cc: emailData.cc,
                            bcc: emailData.bcc,
                            subject: "Invoice Cancel : " + emailData.invoiceNumber,
                            message: "<html><body><p style='font-size: 16px;'>This is to inform all that the Invoice " + emailData.invoiceNumber + " has been canceled.</p><p style='font-size: 16px;'>You may update your record accordingly.</p>" + "<p style='font-size: 16px;'> Warm Regards, <br>" + emailData.ownerName + "<br> " + emailData.ownerPhone + "<br>" + emailData.ownerEmail + "</p></body></html>"
                        }
                        $scope.emailData = emails;
                    }
                    break;

                case "Invoice Release":
                    {
                        var emails = {
                            name: 'Invoice Release',
                            from: emailData.ownerEmail,
                            to: emailData.toEmail,
                            cc: emailData.cc,
                            bcc: emailData.bcc,
                            subject: emailData.originalSubject + ". Assignment : " + emailData.assignmentNo + " | Site City : " + emailData.siteCity,
                            message: "<html><body><p style='font-size: 16px;'>Dear Sir/Madam, We are pleased to attach our bill for professional services rendered for your kind perusal & payment. Our bank details are as follows: " + emailData.bankDetails + " You are requested to kindly release our payment & confirm in order to enable us to release the report.</p><br>" + "<p style='font-size: 16px;'> Warm Regards, <br>" + emailData.ownerName + "<br> " + emailData.ownerPhone + "<br>" + emailData.ownerEmail + "</p></body></html>",
                            threadId: emailData.threadId
                        }
                        $scope.emailData = emails;
                    }
                    break;

                case "Invoice Revise":
                    {
                        var emails = {
                            name: 'Invoice Revise',
                            from: emailData.ownerEmail,
                            to: emailData.to,
                            cc: emailData.cc,
                            bcc: emailData.bcc,
                            subject: "Invoice Revise : " + emailData.invoiceNumber,
                            message: "<html><body><p style='font-size: 16px;'>Invoice " + emailData.invoiceNumber + " has been revised, you are requested to kindly make a note of the same. Copy of the revised invoice is attached for perusal.</p><br>" + "<p style='font-size: 16px;'> Warm Regards, <br>" + emailData.ownerName + "<br> " + emailData.ownerPhone + "<br>" + emailData.ownerEmail + "</p></body></html>"
                        }
                        $scope.emailData = emails;
                    }
                    break;

                case "Invoice Send Authorization":
                    {
                        var emails = {
                            name: 'Invoice Send Authorization',
                            from: emailData.ownerEmail,
                            to: emailData.to,
                            cc: emailData.cc,
                            bcc: emailData.bcc,
                            subject: "Invoice Send Authorization : " + emailData.invoiceNumber,
                            message: "<html><body><p style='font-size: 16px;'>Please go through the Invoice for Assignment No. " + emailData.assignmentNo + " in respect of loss sustained by " + emailData.insuredName + " on account of damage to " + emailData.productName + " and authorize the same</p><br>" + "<p style='font-size: 16px;'> Warm Regards, <br>" + emailData.ownerName + "<br> " + emailData.ownerPhone + "<br>" + emailData.ownerEmail + "</p></body></html>"
                        }
                        $scope.emailData = emails;
                    }
                    break;


                case "LOR Release":
                    {

                        var to = [];
                        var emails = {
                            name: 'LOR Release',
                            from: emailData.ownerEmail,
                            to: emailData.toEmail,
                            cc: emailData.cc,
                            bcc: emailData.bcc,
                            subject: emailData.originalSubject + ". Assignment : " + emailData.assignmentNo + " | Site City : " + emailData.siteCity,
                            message: "<html><body><p style='font-size: 16px;'>We are pleased to release LOR in respect of our Assignment : " + emailData.assignmentNo + " and your claim " + emailData.claimNo + " and Policy " + emailData.policyDoc + "</p><br>" + "<p style='font-size: 16px;'><p style='font-size: 16px;'>We hope that the same shall serve your purpose.Should you ever need any support / information / update please feel at ease to get in touch with me. I will be more than willing to assist.</p><br> Warm Regards, <br>" + emailData.ownerName + "<br> " + emailData.ownerPhone + "<br>" + emailData.ownerEmail + "</p></body></html>",
                            threadId: emailData.threadId
                        }
                        $scope.emailData = emails;
                    }
                    break;

                case "LOR Back to Regenerate":
                    {
                        var emails = {
                            name: 'LOR Back to Regenerate',
                            from: emailData.ownerEmail,
                            to: emailData.to,
                            cc: emailData.cc,
                            bcc: emailData.bcc,
                            subject: "LOR is Send For Authorization For Assignment : " + emailData.assignmentNo,
                            message: "<html><body><p style='font-size: 16px;'>Requesting you to go through the LOR prepared for " + emailData.insuredName + ", Assignment " + emailData.assignmentNo + "and authorize the same.</p><br>" + "<p style='font-size: 16px;'> Warm Regards, <br>" + emailData.ownerName + "</p></body></html>"
                        }
                        $scope.emailData = emails;
                    }
                    break;

                case "Assignment Force Close Request":
                    {

                        var to = [];
                        var emails = {
                            name: 'Assignment Force Close Request',
                            from: emailData.ownerEmail,
                            to: to,
                            cc: emailData.cc,
                            bcc: emailData.bcc,
                            subject: "",
                            message: "<html><body><p style='font-size: 16px;'>Dear #SupervisorsName#,Requesting you to please Force Close the Assignment.Reason mentioned below. #Reason#</p><br> Warm Regards, <br>" + $.jStorage.get("profile").name + "<br> " + $.jStorage.get("profile").mobile + "<br>" + $.jStorage.get("profile").officeEmail + "</p></body></html>"
                        }
                        $scope.emailData = emails;
                    }
                    break;

                case "Assignment Reopen Request":
                    {

                        var to = [];
                        var emails = {
                            name: 'Assignment Reopen Request',
                            from: emailData.ownerEmail,
                            to: to,
                            cc: emailData.cc,
                            bcc: emailData.bcc,
                            subject: "Request for Reopening of Assignment : " + emailData.assignmentNo,
                            message: "<html><body><p style='font-size: 16px;'>Dear #SupervisorsName#,Requesting you to please Re-open the Assignment due to some reasons. #Reason#</p><br> Warm Regards, <br>" + $.jStorage.get("profile").name + "<br> " + $.jStorage.get("profile").mobile + "<br>" + $.jStorage.get("profile").officeEmail + "</p></body></html>"
                        }
                        $scope.emailData = emails;
                    }
                    break;

                case "Assignment Transfer":
                    {

                        var to = [];
                        var emails = {
                            name: 'Assignment Reopen Request',
                            from: emailData.ownerEmail,
                            to: to,
                            cc: emailData.cc,
                            bcc: emailData.bcc,
                            subject: "Transfer of Assignment : " + emailData.assignmentNo,
                            message: "<html><body><p style='font-size: 16px;'>This is to inform you that the Assignment No. #AssignmentNo# being handled by #PreviousOwner# so far has been now transferred to #NewAssignmentOwner# for operational reasons</p><br> Warm Regards, <br>" + $.jStorage.get("profile").name + "<br> " + $.jStorage.get("profile").mobile + "<br>" + $.jStorage.get("profile").email + "</p></body></html>"
                        }
                        $scope.emailData = emails;
                    }
                    break;


                default:
                    {
                        // $scope.formData.push($scope.newjson);
                    }

            }

        }

        var i = 0;
        $scope.search = {
            keyword: ""
        };
        $scope.event = "";
        $scope.getMail = function (chat, mailType) {

            var type = chat.event;

            if (mailType != undefined) {
                type = mailType
                $scope.event = mailType;
                console.log("mailType", mailType);
            }
            $scope.chatId = chat._id;
            console.log("$stateParams.id", $stateParams.id, "chat", chat, "chatID", $scope.chatId);

            var emailData = {};

            NavigationService.getOneAssignment({
                _id: $stateParams.id
            }, ++i, function (data, ini) {
                if (ini == i) {

                    console.log("bank comopany ", data.data.company.bank);
                    var accountNumber = (data.data.company.bank.accountNumber ? data.data.company.bank.accountNumber : "");
                    var neftCode = (data.data.company.bank.neftCode ? data.data.company.bank.neftCode : "");
                    var branchName = (data.data.company.bank.branchName ? data.data.company.bank.branchName : "");
                    emailData.bankDetails = "Account Number : " + accountNumber + ", " + "Neft Code : " + neftCode + ", " + "Branch Name : " + branchName;
                    NavigationService.getOnePolicyDoc(data.data.policyDoc, function (data1) {

                        function getFromHeader(input) {
                            if (data.data.email) {
                                if (data.data.email.payload) {
                                    var obj = _.filter(data.data.email.payload.headers, function (n) {
                                        return n.name == input;
                                    });
                                    if (obj.length == 0) {
                                        return "NA";
                                    } else {
                                        return obj[0].value;
                                    }
                                } else {
                                    return "";
                                }
                            } else {
                                return "";
                            }


                        }
                        emailData.originalDate = getFromHeader("Date");
                        emailData.originalDate = moment(emailData.originaldate).format('llll');
                        emailData.originalSubject = getFromHeader("Subject");
                        emailData.originalFrom = getFromHeader("From");
                        emailData.originalTo = getFromHeader("To");
                        emailData.originaCc = getFromHeader("Cc");
                        emailData.originalDeliveredTo = getFromHeader("Delivered-To");
                        //  emailData.original.body = base64url.decode(data.data.email.body);
                        if (data.data.email) {
                            if (data.data.email.body) {
                                emailData.originalBody = $filter("base64url")(data.data.email.body);
                            }
                        }

                        // console.log("Email attachment.................................", $scope.email.body);

                        emailData.originalMessage =
                            "<br>---------- Original message ----------<br>" +
                            "From: " + emailData.originalFrom + "<br>" +
                            "Date: " + emailData.originalDate + "<br>" +
                            "Subject: " + emailData.originalSubject + "<br>" +
                            "To: " + emailData.originalTo + "<br>" +
                            "Cc: " + emailData.originaCc + "<br>" + emailData.originalBody;
                        var Email = "";
                        var toName = "";
                        emailData.toEmail = [];
                        if (!_.isEmpty(emailData.originalFrom)) {
                            var temp = emailData.originalFrom.split("<");
                            toName = temp[0];
                            if (temp[1]) {
                                var temp2 = temp[1].split(">");
                                console.log("toNAME", temp[0], "toemail", temp[1], "temp", temp);
                                Email = temp2[0];
                            } else {
                                Email = temp[0]
                            }

                            emailData.toEmail.push({
                                name: toName,
                                email: Email
                            });
                        }
                        console.log("Data getpolicy", data1);
                        if (data1.value == true) {
                            if (data1.data.listOfDocuments) {
                                emailData.policyDoc = data1.data.listOfDocuments[0].policyNo;
                                console.log(" emailData.policyDoc", emailData.policyDoc);
                            }
                        } else {
                            emailData.policyDoc = "NA"
                        }
                        emailData.threadId = (data.data.threadId ? data.data.threadId : "");
                        emailData.assignmentNo = data.data.name;
                        emailData.ownerName = data.data.owner.name;
                        emailData.ownerEmail = data.data.owner.officeEmail;
                        emailData.ownerPhone = data.data.owner.officeMobile;
                        if (data.data.city) {
                            emailData.siteCity = data.data.city.name;
                        }
                        emailData.insuredName = (data.data.insured.name ? data.data.insured.name : "");
                        emailData.claimNo = (data.data.insurerClaimId ? data.data.insurerClaimId : "");
                        if (data.data.templateIla[0]) {
                            emailData.ilaAuthDate = data.data.templateIla[0].authTimestamp;
                        }

                        if (data.data.products[0]) {
                            emailData.productName = (data.data.products[0].product.name ? data.data.products[0].product.name : "");
                        }

                        emailData.surveyDate = (chat.surveyDate ? moment(chat.surveyDate).format("DD/MM/YYYY") : "");
                        emailData.invoiceNumber = (chat.invoiceNumber ? chat.invoiceNumber : "");
                        console.log("threadId : ", data.data.threadId);



                        if (chat.surveyor != undefined) {
                            _.each(data.data.survey, function (values) {
                                var id1 = "";
                                var id2 = "";
                                id1 = values.employee._id.toString();
                                id2 = chat.surveyor.toString();
                                console.log("id1", id1, "id2", id2, "survey: ", values);
                                if (id1 === id2) {
                                    console.log("In surveyor");
                                    emailData.surveyorNumber = values.employee.mobile;
                                    emailData.surveyorName = values.employee.name;
                                    emailData.surveyorEmail = values.employee.officeEmail;
                                    emailData.surveyDate = values.surveyDate;
                                }
                            });
                        }


                        emailData.to = [];
                        console.log("email office ", data.data.owner.officeEmail);
                        emailData.to.push({
                            name: data.data.owner.name,
                            email: data.data.owner.officeEmail
                        });

                        emailData.cc = [];
                        if (!_.isEmpty(data.data.shareWith)) {
                            _.each(data.data.shareWith, function (values) {
                                console.log("values", values);
                                _.each(values.persons, function (personss) {
                                    console.log("persons", personss);
                                    emailData.cc.push({
                                        name: personss.name,
                                        email: personss.officeEmail
                                    })
                                });
                            });
                        }
                        console.log("emailers cc", emailData.cc, "emailers to", emailData.to);
                        $scope.emailersData(type, emailData);
                        console.log("emailers", $scope.emailData);
                        $scope.results = data;
                        console.log("emailers to", emailData.to);
                        $scope.emailersData(type, emailData);
                        console.log("emailers", $scope.emailData);
                        $scope.results = data;
                        console.log("data.results", $scope.results);

                        var modalInstance = $uibModal.open({
                            scope: $scope,
                            templateUrl: '/frontend/views/modal/modal-email.html',
                            size: 'lg'
                        });

                    });
                }
            });
        };

        // $scope.changeStatus = function (type, value) {
        //     TemplateService.getToastr();
        //     var oldStatus = $scope.assignment.timelineStatus;
        //     if (type === 'survey') {
        //         if (value === true) {
        //             $scope.assignment.timelineStatus = "ILA Pending";
        //         } else {
        //             $scope.assignment.timelineStatus = "Unassigned";
        //         }
        //         $scope.ilaStatus = false;
        //         $scope.lorStatus = false;
        //     } else if (type === 'ila') {
        //         if (value === true) {
        //             $scope.assignment.timelineStatus = "LOR Pending";
        //         } else {
        //             $scope.assignment.timelineStatus = "ILA pending";
        //         }
        //         $scope.surveyStatus = false;
        //         $scope.lorStatus = false;
        //     } else if (type === 'lor') {
        //         if (value === true) {
        //             $scope.assignment.timelineStatus = "Assessment Pending";
        //         } else {
        //             $scope.assignment.timelineStatus = "LOR Pending";
        //         }
        //         $scope.ilaStatus = false;
        //         $scope.surveyStatus = false;
        //     }
        //     var formData = {};
        //     formData._id = $scope.assignment._id;
        //     formData.timelineStatus = $scope.assignment.timelineStatus;
        //     NavigationService.assignmentSave(formData, function (data) {
        //         console.log("Saved Assignment", data);
        //         if (data.value) {
        //             toastr.clear();
        //             a.title = "Assignment Status Changed " + oldStatus + " To " + $scope.assignment.timelineStatus;
        //             a.type = "Normal";
        //             a.employee = $scope.employee;
        //             $scope.timeline.chat.push(a);
        //             $scope.timelineSave();
        //             ////$state.reload();
        //             toastr.success("", "Assignment Status Changed Successfully");
        //         } else {
        //             toastr.clear();
        //             toastr.error("There was an error while changing assignment status", "Error Changing Assignment Status");
        //         }
        //     });
        // }

        $scope.openSurveyDate = function () {
            $scope.popup = {};
            $scope.popup.surveyDate = true;
            $scope.surveys.surveyClass = 'survey-assigned-open';
        };
        $scope.getWaiverStatus = function () {
            $scope.forceClosedCommentArr = [];
            var forceClosedComment = _.split($scope.assignment.forceClosedComment, "&");
            _.each(forceClosedComment, function (n, key) {
                n = _.trim(n);
                if (_.endsWith(n, "Compulsory")) {
                    var newString = _.replace(n, " Compulsory", "");
                    var CompulsoryObj = _.split(newString, ",");
                    _.each(CompulsoryObj, function (m, key) {
                        var obj = _.trim(m);
                        obj = obj + " Compulsory";
                        $scope.forceClosedCommentArr.push(obj);
                    });
                } else if (_.endsWith(n, "Waive")) {
                    var newString = _.replace(n, " Waive", "");
                    var WaiveObj = _.split(newString, ",");
                    _.each(WaiveObj, function (m, key) {
                        var obj = _.trim(m);
                        obj = obj + " Waive";
                        $scope.forceClosedCommentArr.push(obj);
                    });
                }
            });
            console.log("forceClosedCommentArr", $scope.forceClosedCommentArr)
        }
        $scope.saveSurvey = function () {
            console.log("$scope.assignment.getAllTaskStatus.survey", $scope.assignment.getAllTaskStatus.survey, $scope.assignment.surveyAccessReq, $scope.assignment.surveyAccess);
            if ($scope.assignment.getAllTaskStatus.survey == "Done") {
                $scope.assignment.surveyAccessReq = $scope.assignment.surveyAccess;
                toastr.error("Cannot waive assurvey is already done");
            } else {
                var message = ""
                if ($scope.assignment.surveyAccessReq) {
                    message = "Survey Compulsory"
                    _.pull($scope.forceClosedCommentArr, "Survey Waived");
                    $scope.forceClosedCommentArr.push(message);
                } else {
                    message = "Survey Waived"
                    _.pull($scope.forceClosedCommentArr, "Survey Compulsory");
                    $scope.forceClosedCommentArr.push(message);
                }
            }
        }
        $scope.saveILA = function () {
            if ($scope.assignment.getAllTaskStatus.ila == "Done") {
                $scope.assignment.ilaAccessReq = $scope.assignment.ilaAccess;
                toastr.error("Cannot waive ILA is already done");
            } else {
                var message = ""
                if ($scope.assignment.ilaAccessReq) {
                    message = "ILA Compulsory";
                    _.pull($scope.forceClosedCommentArr, "ILA Waived");
                    $scope.forceClosedCommentArr.push(message);
                } else {
                    message = "ILA Waived";
                    _.pull($scope.forceClosedCommentArr, "ILA Compulsory");
                    $scope.forceClosedCommentArr.push(message);
                }
            }
        }
        $scope.saveLOR = function () {
            if ($scope.assignment.getAllTaskStatus.lor == "Done") {
                $scope.assignment.lorAccessReq = $scope.assignment.lorAccess;
                toastr.error("Cannot waive LOR is already done");
            } else {
                var message = ""
                if ($scope.assignment.lorAccessReq) {
                    message = "LOR Compulsory";
                    _.pull($scope.forceClosedCommentArr, "LOR Waived");
                    $scope.forceClosedCommentArr.push(message);
                } else {
                    message = "LOR Waived";
                    _.pull($scope.forceClosedCommentArr, "LOR Compulsory");
                    $scope.forceClosedCommentArr.push(message);
                }
            }
        }
        $scope.saveAssessment = function () {
            if ($scope.assignment.getAllTaskStatus.assessment == "Done") {
                $scope.assignment.assessmentAccessReq = $scope.assignment.assessmentAccess;
                toastr.error("Cannot waive Assessment is already done");
            } else {
                var message = ""
                if ($scope.assignment.assessmentAccessReq) {
                    message = "Assessment Compulsory";
                    _.pull($scope.forceClosedCommentArr, "Assessment Waived");
                    $scope.forceClosedCommentArr.push(message);
                } else {
                    message = "Assessment Waived";
                    _.pull($scope.forceClosedCommentArr, "Assessment Compulsory");
                    $scope.forceClosedCommentArr.push(message);
                }
            }
        }
        $scope.saveConsent = function () {
            if ($scope.assignment.getAllTaskStatus.consent == "Done") {
                $scope.assignment.consentAccessReq = $scope.assignment.consentAccess;
                toastr.error("Cannot waive Consent is already done");
            } else {
                var message = ""
                if ($scope.assignment.consentAccessReq) {
                    message = "Consent Compulsory";
                    _.pull($scope.forceClosedCommentArr, "Consent Waived");
                    $scope.forceClosedCommentArr.push(message);
                } else {
                    message = "Consent Waived";
                    _.pull($scope.forceClosedCommentArr, "Consent Compulsory");
                    $scope.forceClosedCommentArr.push(message);
                }
            }
        }
        $scope.saveFSR = function () {
            if ($scope.assignment.getAllTaskStatus.fsr == "Done") {
                $scope.assignment.fsrAccessReq = $scope.assignment.fsrAccess;
                toastr.error("Cannot waive FSR is already done");
            } else {
                var message = ""
                if ($scope.assignment.fsrAccessReq) {
                    message = "FSR Compulsory";
                    _.pull($scope.forceClosedCommentArr, "FSR Waived");
                    $scope.forceClosedCommentArr.push(message);
                } else {
                    message = "FSR Waived";
                    _.pull($scope.forceClosedCommentArr, "FSR Compulsory");
                    $scope.forceClosedCommentArr.push(message);
                }
            }
            console.log("-->", $scope.forceClosedCommentArr);
        }
        $scope.submitRequestForAccessButtons = function () {
            $scope.accessForEditButton = !$scope.accessForEditButton;
            var timelineData = [];
            var timelineTitle = [];
            $scope.assignment.forceClosedComment = "";
            _.each($scope.forceClosedCommentArr, function (n, key) {
                if (_.endsWith(n, "Compulsory")) {
                    var newString = _.split(n, " ");
                    timelineTitle.push(newString[0]);
                }
            });
            _.each(timelineTitle, function (n, key) {
                if (key == 0) {
                    $scope.assignment.forceClosedComment = n;
                } else {
                    $scope.assignment.forceClosedComment = $scope.assignment.forceClosedComment + ", " + n;
                }
            });
            if (timelineTitle.length != 0) {
                $scope.assignment.forceClosedComment = $scope.assignment.forceClosedComment + " Compulsory"
            }
            timelineTitle = [];
            _.each($scope.forceClosedCommentArr, function (n, key) {
                if (_.endsWith(n, "Waived")) {
                    var newString = _.split(n, " ");
                    timelineTitle.push(newString[0]);
                }
            });
            _.each(timelineTitle, function (n, key) {
                if (key == 0) {
                    if ($scope.assignment.forceClosedComment == "") {
                        $scope.assignment.forceClosedComment = n;
                    } else {
                        $scope.assignment.forceClosedComment = $scope.assignment.forceClosedComment + " & " + n;
                    }
                } else {
                    $scope.assignment.forceClosedComment = $scope.assignment.forceClosedComment + ", " + n;
                }
            });
            if (timelineTitle.length != 0) {
                $scope.assignment.forceClosedComment = $scope.assignment.forceClosedComment + " Waive"
            }
            console.log("$scope.assignment.forceClosedComment", $scope.assignment.forceClosedComment);
            var timelineObj = {
                employee: $.jStorage.get("getLoginEmployee")._id,
                type: "Normal",
                title: "Request for " + $scope.assignment.forceClosedComment
            };
            timelineData.push(timelineObj);
            var AssignmentData = {
                _id: $scope.assignment._id,
                sentBy: $.jStorage.get("getLoginEmployee")._id,
                forceClosedComment: $scope.assignment.forceClosedComment,
                assignmentapprovalStatus: "Request AccessButton",
                fsrAccessReq: $scope.assignment.fsrAccessReq,
                consentAccessReq: $scope.assignment.consentAccessReq,
                assessmentAccessReq: $scope.assignment.assessmentAccessReq,
                lorAccessReq: $scope.assignment.lorAccessReq,
                ilaAccessReq: $scope.assignment.ilaAccessReq,
                surveyAccessReq: $scope.assignment.surveyAccessReq
            };
            var wholeObj = {
                assignment: AssignmentData,
                employee: $.jStorage.get("getLoginEmployee")._id,
                timelineData: timelineData
            };
            if (wholeObj.assignment.forceClosedComment == "" || $scope.assignment.assignmentapprovalStatus == "Request AccessButton") {
                console.log("$scope.assignment.assignmentapprovalStatus", $scope.assignment.assignmentapprovalStatus);
                if ($scope.assignment.assignmentapprovalStatus == "Request AccessButton") {
                    toastr.error("Request already sent");
                } else {
                    toastr.error("No changes requested");
                }
            } else {
                NavigationService.submitRequestForAccessButtons(wholeObj, function (data) {
                    if (data.value == true) {
                        $scope.assignment.forceClosedComment = "";
                        toastr.success("Waiver request Sent");
                    } else {
                        toastr.error("Error In sending Waiver request");
                    }
                });
            }
            $scope.yourPromise1 = fakeFac.success().then(function () {});
        };
        $scope.submitApprovalForAccessButtons = function () {
            $scope.accessForEditButton = !$scope.accessForEditButton;
            var timelineData = [];
            var timelineTitle = [];
            var timelineObj = {
                employee: $.jStorage.get("getLoginEmployee")._id,
                type: "Normal",
                title: ""
            }
            $scope.assignment.forceClosedComment = "";
            $scope.assignment.fsrAccess = $scope.assignment.fsrAccessReq;
            if ($scope.assignment.fsrAccess) {
                // if ($scope.assignment.fsrAccess !== $scope.assignment.fsrAccessReq) {
                //     var title = "FSR Compulsory";
                //     timelineData.push(title);
                // }
                if ($scope.assignment.getAllTaskStatus.fsr !== "Done") {
                    $scope.assignment.getAllTaskStatus.fsr = "Not Done";
                }
            } else {
                // if ($scope.assignment.fsrAccess !== $scope.assignment.fsrAccessReq) {
                //     var title = "FSR Waived";
                //     timelineData.push(title);
                // }
                if ($scope.assignment.getAllTaskStatus.fsr !== "Done") {
                    $scope.assignment.getAllTaskStatus.fsr = "Waived";
                }
            }
            // if ($scope.assignment.consentAccess !== $scope.assignment.consentAccessReq) {
            $scope.assignment.consentAccess = $scope.assignment.consentAccessReq;
            if ($scope.assignment.consentAccess) {
                // var title = "Consent Compulsory";
                // timelineData.push(title);
                if ($scope.assignment.getAllTaskStatus.consent !== "Done") {
                    $scope.assignment.getAllTaskStatus.consent = "Not Done";
                }
            } else {
                // var title = "Consent Waived";
                // timelineData.push(title);
                if ($scope.assignment.getAllTaskStatus.consent !== "Done") {
                    $scope.assignment.getAllTaskStatus.consent = "Waived";
                }
            }
            // }
            // if ($scope.assignment.assessmentAccess !== $scope.assignment.assessmentAccessReq) {
            $scope.assignment.assessmentAccess = $scope.assignment.assessmentAccessReq;
            if ($scope.assignment.assessmentAccess) {
                // var title = "Assessment Compulsory";
                // timelineData.push(title);
                if ($scope.assignment.getAllTaskStatus.assessment !== "Done") {
                    $scope.assignment.getAllTaskStatus.assessment = "Not Done";
                }
            } else {
                // var title = "Assessment Waived";
                // timelineData.push(title);
                if ($scope.assignment.getAllTaskStatus.assessment !== "Done") {
                    $scope.assignment.getAllTaskStatus.assessment = "Waived";
                }
            }
            // }
            // if ($scope.assignment.lorAccess !== $scope.assignment.lorAccessReq) {
            $scope.assignment.lorAccess = $scope.assignment.lorAccessReq;
            if ($scope.assignment.lorAccess) {
                // var title = "LOR Compulsory";
                // timelineData.push(title);
                if ($scope.assignment.getAllTaskStatus.lor !== "Done") {
                    $scope.assignment.getAllTaskStatus.lor = "Not Done";
                    $scope.assignment.getAllTaskStatus.docs = "Not Done";
                }
            } else {
                // var title = "LOR Waived";
                // timelineData.push(title);
                if ($scope.assignment.getAllTaskStatus.lor !== "Done") {
                    $scope.assignment.getAllTaskStatus.lor = "Waived";
                    $scope.assignment.getAllTaskStatus.docs = "Waived";
                }
            }
            // }
            // if ($scope.assignment.ilaAccess !== $scope.assignment.ilaAccessReq) {
            $scope.assignment.ilaAccess = $scope.assignment.ilaAccessReq;
            if ($scope.assignment.ilaAccess) {
                // var title = "ILA Compulsory";
                // timelineData.push(title);
                if ($scope.assignment.getAllTaskStatus.ila !== "Done") {
                    $scope.assignment.getAllTaskStatus.ila = "Not Done";
                }
            } else {
                // var title = "ILA Waived";
                // timelineData.push(title);
                if ($scope.assignment.getAllTaskStatus.ila !== "Done") {
                    $scope.assignment.getAllTaskStatus.ila = "Waived";
                }
            }
            // }
            // if ($scope.assignment.surveyAccess !== $scope.assignment.surveyAccessReq) {
            $scope.assignment.surveyAccess = $scope.assignment.surveyAccessReq;
            if ($scope.assignment.surveyAccess) {
                // var title = "Survey Compulsory";
                // timelineData.push(title);
                if ($scope.assignment.getAllTaskStatus.survey !== "Done") {
                    $scope.assignment.getAllTaskStatus.surveyAssigned = "Not Done";
                    $scope.assignment.getAllTaskStatus.survey = "Not Done";
                }
            } else {
                // var title = "Survey Waived";
                // timelineData.push(title);
                if ($scope.assignment.getAllTaskStatus.survey !== "Done") {
                    $scope.assignment.getAllTaskStatus.surveyAssigned = "Waived";
                    $scope.assignment.getAllTaskStatus.survey = "Waived";
                }
            }
            // }
            _.each($scope.forceClosedCommentArr, function (n, key) {
                if (_.endsWith(n, "Compulsory")) {
                    var newString = _.split(n, " ");
                    timelineTitle.push(newString[0]);
                }
            });
            _.each(timelineTitle, function (n, key) {
                if (key == 0) {
                    timelineObj.title = n;
                } else {
                    timelineObj.title = timelineObj.title + ", " + n;
                }
            });
            if (timelineTitle.length != 0) {
                timelineObj.title = timelineObj.title + " Compulsory"
            }
            timelineTitle = [];
            console.log("timelineData", timelineData);
            _.each($scope.forceClosedCommentArr, function (n, key) {
                if (_.endsWith(n, "Waived")) {
                    var newString = _.split(n, " ");
                    timelineTitle.push(newString[0]);
                }
            });
            _.each(timelineTitle, function (n, key) {
                if (key == 0) {
                    if (timelineObj.title == "") {
                        timelineObj.title = n;
                    } else {
                        timelineObj.title = timelineObj.title + " & " + n;
                    }
                } else {
                    timelineObj.title = timelineObj.title + ", " + n;
                }
            });
            if (timelineTitle.length != 0) {
                timelineObj.title = timelineObj.title + " Waived "
            }

            // timeline
            if (timelineObj.title == "") {
                toastr.error("Nothing to approve");
            } else {
                timelineTitle = [];
                timelineObj.title = "Approved : " + timelineObj.title;
                timelineTitle.push(timelineObj)
                var wholeObj = {
                    timelineData: timelineTitle,
                    assignment: $scope.assignment,
                    employee: $.jStorage.get("getLoginEmployee")
                }
                NavigationService.submitApprovalForAccessButtons(wholeObj, function (data) {
                    if (data.value == true) {
                        toastr.clear();
                        toastr.success("For " + $scope.assignment.name, "Waivers Approved");
                        $scope.forceClosedCommentArr = [];
                    } else {
                        toastr.error("Error In Approval")
                    }
                });
            }
        };

        // 1st
        $scope.surveys = {};
        $scope.surveys.surveyClass = 'survey-assigned-open';
        $scope.saveSurveyDate = function (data) {
            $scope.surveys.surveyClass = 'survey-assigned';
            var formdata = {};
            $scope.surveyDate = data.surveyDate;
            $scope.surveyTime = new Date(data.surveyTime);
            formdata.surveyDate = data.surveyDate;
            formdata.surveyTime = new Date(data.surveyTime);
            formdata._id = $stateParams.id;
            NavigationService.assignmentSave(formdata, function (data) {
                if (data.value) {
                    $scope.getAssignmentData();
                } else {
                    toastr.error("There was an error while saving survey Date", "Error Survey Date");
                }
            });
        };

        // 2nd
        $scope.getAssignmentData = function (type) {
            // console.log("surveyDate", $scope.surveyDate);
            NavigationService.getOneModel("Assignment", $stateParams.id, function (data) {
                $scope.assignment = data.data;
                if (!_.isEmpty($scope.search.keyword)) {
                    data.data.keyword = $scope.search.keyword;
                }
                NavigationService.getNearestOffice(data.data, function (data) {
                    if (data.value) {
                        $scope.finalSurveyors = data.data;
                    } else {
                        toastr.error("There was an error while searching surveyors", "Error finding surveyors")
                    }
                });

            });
        };

        // 3rd
        // $scope.displayFinalSurveyor = function () {
        //     console.log("surveyDate", $scope.surveyDate);
        //     var arrayOfId = _.cloneDeep($scope.getAllSurveyors);
        //     console.log("arrayOfId", arrayOfId);
        //     var arrayId = [];
        //     _.each(arrayOfId, function (n) {
        //         delete n.date,
        //             delete n.officeEmail,
        //             arrayId.push(n._id);
        //         NavigationService.getOneModel("Employee", n._id, function (data) {
        //             $scope.finalSurveyors.push(data.data)
        //             console.log("final Surveyors : ", $scope.finalSurveyors);
        //         });
        //     });
        // };

        // Don't Delete
        //  $scope.displayFinalSurveyor = function () {
        //     console.log("surveyDate", $scope.surveyDate);
        //     var arrayOfId = _.cloneDeep($scope.getAllSurveyors);
        //     console.log("arrayOfId", arrayOfId);
        //     var arrayId = [];
        //     _.each(arrayOfId, function (n) {
        //         delete n.date,
        //             delete n.officeEmail,
        //             arrayId.push(n._id);
        //     });
        //     console.log("arrayOfId", arrayId);
        //     NavigationService.getNearerSurveyor2({
        //         ids: arrayId
        //     }, function (data) {
        //         var final = data.data;
        //         console.log("Final Data", data, final)
        //         $scope.finalSurveyors = final;
        //     });
        // };

        $scope.updateEmployeeAssignment = function (empId) {
            var emp = {};
            emp.assignment = {
                assignment: $stateParams.id
            };
            emp._id = empId;
            console.log("Employee", emp);
            NavigationService.saveEmployeeAssignment(emp, function (data) {
                console.log("Success On Save EmployeeAssignment", data);
            });
        };
        $scope.surveyorAssigned = false;
        $scope.surveysAssigned = function (empId) {
            TemplateService.getToastr();
            var assignment = {};
            assignment._id = $stateParams.id,
                assignment.survey = {
                    employee: empId,
                    status: "Approval Pending",
                    sentFrom: $.jStorage.get("getLoginEmployee")._id,
                    surveyDate: $scope.surveyDate,
                    surveyTime: $scope.surveyTime
                }
            NavigationService.surveyorSentForApproval(assignment, function (data) {
                if (data.value) {
                    var surveyorName;
                    $scope.surveyorAssigned = true;
                    console.log("Success On Save EmployeeAssignment", data);
                    toastr.clear();
                    _.each($scope.finalSurveyors, function (n) {
                        if (n._id == empId) {
                            surveyorName = n.name;
                        }
                    });
                    toastr.success(surveyorName + " sent for approval for " + moment($scope.surveyDate).format("DD/MM/YYYY"));
                    ////$state.reload();
                } else {
                    toastr.clear();
                    toastr.error("Surveyor Assign Failed");
                }
            });
        }
        $scope.updateAssignmentEmployee = function (empId) {
            console.log("IN11-2162-1705-0012", empId);
            if ($scope.assignment.survey.length > 0) {
                var newSurveyDate = moment($scope.surveyDate).format("DD/MM/YYYY");
                var flag = false;
                var surveyorName;
                _.each($scope.assignment.survey, function (values) {
                    var oldSurveyDate = moment(values.surveyDate).format("DD/MM/YYYY");
                    console.log(newSurveyDate, oldSurveyDate, empId, values.employee._id, values.status);
                    if (newSurveyDate === oldSurveyDate && empId == values.employee._id && values.status != "Declined") {
                        flag = true;
                        surveyorName = values.employee.name;
                    }
                });
                if (flag == false) {
                    $scope.surveysAssigned(empId);
                } else {
                    toastr.error(surveyorName + " is already Assigned on " + newSurveyDate, {
                        timeOut: 4000
                    });
                }
            } else {
                $scope.surveysAssigned(empId);
            }
        };
        $scope.repeat = _.times(20, Number);
        $scope.assignSurveyor = function () {
            $scope.modalInstance = $uibModal.open({
                scope: $scope,
                templateUrl: '/frontend/views/modal/modal-assign-surveyor.html',
                size: 'lg'
            });
        };
        $scope.markActivity = function () {
            var modalInstance = $uibModal.open({
                scope: $scope,
                templateUrl: '/frontend/views/modal/mark-activity.html',
                size: 'lg'
            });
        };
        $scope.newAssessment = function () {
            var modalInstance = $uibModal.open({
                scope: $scope,
                templateUrl: '/frontend/views/modal/new-assessment.html',
                size: 'md'
            });
        };
        $scope.viewStaff = function () {
            var modalInstance = $uibModal.open({
                scope: $scope,
                templateUrl: '/frontend/views/modal/staff-rating.html',
                size: 'lg'
            });
        };
        $scope.viewSurveyor = function () {
            var modalInstance = $uibModal.open({
                scope: $scope,
                templateUrl: '/frontend/views/modal/surveyor-rating.html',
                size: 'lg'
            });
        };
        $scope.viewClient = function () {
            var modalInstance = $uibModal.open({
                scope: $scope,
                templateUrl: '/frontend/views/modal/client-rating.html',
                size: 'lg'
            });
        };
        $scope.viewPhotos = function () {
            var modalInstance = $uibModal.open({
                scope: $scope,
                templateUrl: '/frontend/views/modal/new-photos.html',
                size: 'lg',
                backdrop: 'static'
            });
        };
        $scope.viewILA = function () {
            var modalInstance = $uibModal.open({
                scope: $scope,
                templateUrl: '/frontend/views/modal/new-ila.html',
                size: 'lg'
            });
        };
        $scope.viewFSR = function () {
            var modalInstance = $uibModal.open({
                scope: $scope,
                templateUrl: '/frontend/views/modal/new-fsr.html',
                size: 'lg'
            });
        };
        $scope.viewFiles = function () {
            var modalInstance = $uibModal.open({
                scope: $scope,
                templateUrl: '/frontend/views/modal/other-file.html',
                size: 'lg',
                backdrop: 'static'
            });
        };
        $scope.viewImages = function () {
            var modalInstance = $uibModal.open({
                scope: $scope,
                templateUrl: '/frontend/views/modal/upload-image.html',
                size: 'lg'
            });
        };
        $scope.viewDocs = function () {
            var modalInstance = $uibModal.open({
                scope: $scope,
                templateUrl: '/frontend/views/modal/upload-document.html',
                size: 'lg'
            });
        };
        $scope.viewISR = function () {
            var modalInstance = $uibModal.open({
                scope: $scope,
                templateUrl: '/frontend/views/modal/new-isr.html',
                size: 'lg'
            });
        };
        $scope.viewLOR = function () {
            var modalInstance = $uibModal.open({
                scope: $scope,
                templateUrl: '/frontend/views/modal/new-lor.html',
                size: 'lg'
            });
        };

        $scope.allAssessment = function (check) {
            $scope.showCreate = check;
            var modalInstance = $uibModal.open({
                scope: $scope,
                templateUrl: '/frontend/views/modal/assessment.html',
                size: 'md'
            });
        };
        $scope.viewConsent = function (check) {
            $scope.showCreate = check;
            var modalInstance = $uibModal.open({
                scope: $scope,
                templateUrl: '/frontend/views/modal/new-consent.html',
                size: 'md'
            });
        };

        $scope.newEmail = function () {
            var modalInstance = $uibModal.open({
                scope: $scope,
                templateUrl: '/frontend/views/modal/modal-email.html',
                size: 'lg'
            });
        };
        $scope.newInvoice = function () {
            var modalInstance = $uibModal.open({
                scope: $scope,
                templateUrl: '/frontend/views/modal/invoice.html',
                size: 'lg'
            });
        };

        $scope.newMessage = function () {
            var modalInstance = $uibModal.open({
                scope: $scope,
                templateUrl: '/frontend/views/modal/modal-message.html',
                size: 'lg'
            });
        };
        $scope.transfer = function () {
            var modalInstance = $uibModal.open({
                scope: $scope,
                templateUrl: '/frontend/views/modal/transfer.html',
                size: 'lg'
            });
        };
        $scope.viewJIR = function () {
            var modalInstance = $uibModal.open({
                scope: $scope,
                templateUrl: '/frontend/views/modal/new-jir.html',
                size: 'lg',
                backdrop: 'static'
            });
        };
        $scope.selectOneRecord = function () {
            var modalInstance = $uibModal.open({
                scope: $scope,
                templateUrl: '/frontend/views/modal/select-one-record.html',
                size: 'lg',
                backdrop: 'static'
            });
        };

        $scope.generateZip = function (type) {
            window.open(adminurl + 'Assignment/generateZip?id=' + $scope.assignment._id + '&type=' + type, '_self');
            window.close();
        }
        $scope.refreshTimeline = function () {
            $scope.getTimeline();
        };
        $scope.deleteIndexs = [];
        $scope.deleteSurveyIndexs = [];
        $scope.surveyData = {};
        $scope.selectAllData = function (type, flag) {
            console.log('flag ', flag);
            if (flag === true) {
                if (type === 'jir') {
                    var matchedData = $scope.assignment.jir;
                } else if (type === 'photos') {
                    var matchedData = $scope.assignment.photos;
                } else if (type === 'Documents') {
                    var matchedData = $scope.assignment.docs;
                }
                _.each(matchedData, function (value, key) {
                    $scope.deleteIndexs.push({
                        id: key,
                        file: value.file.toString()
                    });
                    console.log('delete Indexs : ', $scope.deleteIndexs);
                });
            } else {
                $scope.deleteIndexs = [];
            }
        };
        $scope.selectAllSurveyData = function (type, flag) {
            console.log('flag ', flag);
            if (flag === true) {
                if (type === 'jir') {
                    var matchedData = $scope.surveyData.jir;
                } else if (type === 'photos') {
                    var matchedData = $scope.surveyData.photos;
                } else if (type === 'Documents') {
                    var matchedData = $scope.surveyData.doc;
                }
                _.each(matchedData, function (value, key) {
                    $scope.deleteSurveyIndexs.push({
                        id: key,
                        file: value.file.toString()
                    });
                    console.log('delete Indexs : ', $scope.deleteSurveyIndexs);
                });
            } else {
                $scope.deleteSurveyIndexs = [];
            }
        };
        $scope.addDataToDelete = function (type, index, data) {
            if (type === 'jir') {
                var matchedData = $scope.assignment.jir;
            } else if (type === 'photos') {
                var matchedData = $scope.assignment.photos;
            } else if (type === 'Documents') {
                var matchedData = $scope.assignment.docs;
            }
            var matchIndex = _.findIndex(matchedData, function (o) {
                console.log(" 1", o.file.toString(), "2 : ", data.toString());
                return o.file.toString() == data.toString();
            });
            console.log("matchIndex : ", matchIndex);
            var duplicateIndex = -1;
            if (!_.isEmpty($scope.deleteIndexs)) {
                duplicateIndex = _.findIndex($scope.deleteIndexs, function (o) {
                    return o.id == matchIndex;
                });
                console.log('duplicateIndex : ', duplicateIndex);
            }

            if (_.isEmpty($scope.deleteIndexs)) {
                $scope.deleteIndexs.push({
                    id: matchIndex,
                    file: data.toString()
                });
            } else {
                if (duplicateIndex === -1) {
                    $scope.deleteIndexs.push({
                        id: matchIndex,
                        file: data.toString()
                    });
                } else {
                    $scope.deleteIndexs.splice(duplicateIndex, 1);
                }
            }
            console.log('deleteIndexs : ', $scope.deleteIndexs);
        };
        $scope.addSurveyDataToDelete = function (type, index, data) {
            if (type === 'jir') {
                var matchedData = $scope.surveyData.jir;
            } else if (type === 'photos') {
                var matchedData = $scope.surveyData.photos;
            } else if (type === 'Documents') {
                var matchedData = $scope.surveyData.doc;
            }
            var matchIndex = _.findIndex(matchedData, function (o) {
                console.log(" 1", o.file.toString(), "2 : ", data.toString());
                return o.file.toString() == data.toString();
            });
            console.log("matchIndex : ", matchIndex);
            var duplicateIndex = -1;
            if (!_.isEmpty($scope.deleteSurveyIndexs)) {
                duplicateIndex = _.findIndex($scope.deleteSurveyIndexs, function (o) {
                    return o.id == matchIndex;
                });
                console.log('duplicateIndex : ', duplicateIndex);
            }

            if (_.isEmpty($scope.deleteSurveyIndexs)) {
                $scope.deleteSurveyIndexs.push({
                    id: matchIndex,
                    file: data.toString()
                });
            } else {
                if (duplicateIndex === -1) {
                    $scope.deleteSurveyIndexs.push({
                        id: matchIndex,
                        file: data.toString()
                    });
                } else {
                    $scope.deleteSurveyIndexs.splice(duplicateIndex, 1);
                }
            }
            console.log('deleteSurveyIndexs : ', $scope.deleteSurveyIndexs);
        };
        $scope.deleteSelectedData = function (type) {
            if (_.isEmpty($scope.deleteIndexs)) {
                $scope.selectOneRecord();
            } else {
                _.each($scope.deleteIndexs, function (deleteData) {
                    if (type === 'jir') {
                        var matchedData = $scope.assignment.jir
                    } else if (type === 'photos') {
                        var matchedData = $scope.assignment.photos
                    } else if (type === 'Documents') {
                        var matchedData = $scope.assignment.docs
                    }
                    var matchIndex = -1;
                    matchIndex = _.findIndex(matchedData, function (o) {
                        console.log(" 1", o.file.toString(), "2 : ", deleteData.file.toString());
                        return o.file.toString() == deleteData.file.toString();
                    });
                    if (matchIndex != -1) {
                        if (type === 'jir') {
                            $scope.assignment.jir.splice(matchIndex, 1);
                        } else if (type === 'photos') {
                            $scope.assignment.photos.splice(matchIndex, 1);
                        } else if (type === 'Documents') {
                            $scope.assignment.docs.splice(matchIndex, 1);
                        }

                    }
                });

                setTimeout(function () {
                    var formData = {};
                    var a = {};
                    formData._id = $scope.assignment._id;
                    if (type === "jir") {
                        formData.jir = $scope.assignment.jir;
                        a.title = "Jir Deleted";
                        a.subTitle = "Jir Deleted Successfully"
                    } else if (type === "photos") {
                        formData.photos = $scope.assignment.photos;
                        a.title = "Photos Deleted";
                        a.subTitle = "Photos Deleted Successfully"
                    } else if (type === "Documents") {
                        formData.docs = $scope.assignment.docs;
                        a.title = "Document Deleted";
                        a.subTitle = "Document Deleted Successfully"
                    }
                    NavigationService.assignmentSave(formData, function (data) {
                        if (data.value) {
                            if (data.data.nModified === 1) {
                                a.type = "Normal";
                                a.employee = $scope.employee;
                                $scope.timeline.chat.push(a);
                                $scope.timelineSave();
                                toastr.success(a.subTitle, a.title);
                            } else {
                                toastr.error("There was an error while delete the Jir ", "Error Deleting Jir");
                            }
                        } else {
                            toastr.error("There was an error while delete the Jir ", "Error Deleting Jir");
                        }
                    });
                }, 2000);
            }


        };
        $scope.deleteSurveySelectedData = function (type) {
            if (_.isEmpty($scope.deleteSurveyIndexs)) {
                $scope.selectOneRecord();
            } else {
                _.each($scope.deleteSurveyIndexs, function (deleteData) {
                    if (type === 'jir') {
                        var matchedData = $scope.surveyData.jir
                    } else if (type === 'photos') {
                        var matchedData = $scope.surveyData.photos
                    } else if (type === 'Documents') {
                        var matchedData = $scope.surveyData.doc
                    }
                    var matchIndex = -1;
                    matchIndex = _.findIndex(matchedData, function (o) {
                        console.log(" 1", o.file.toString(), "2 : ", deleteData.file.toString());
                        return o.file.toString() == deleteData.file.toString();
                    });
                    if (matchIndex != -1) {
                        if (type === 'jir') {
                            $scope.surveyData.jir.splice(matchIndex, 1);
                            toastr.success("Jir Deleted Successfully", "Jir Deleted");
                        } else if (type === 'photos') {
                            $scope.surveyData.photos.splice(matchIndex, 1);
                            toastr.success("Photo Deleted Successfully", "Photo Deleted");
                        } else if (type === 'Documents') {
                            $scope.surveyData.doc.splice(matchIndex, 1);
                            toastr.success("Document Deleted Successfully", "Document Deleted");
                        }

                    }
                });
            }
        };
        $scope.timelineSave = function () {
            NavigationService.saveChat($scope.timeline, function (data) {
                if (data.value === false) {
                    toastr.success("There was an error while saving data to the timeline", "Timeline Error");
                }
            });
        };
        $scope.removeElement = function (type, index) {
            console.log("type : ", type, "index", index);

            var formData = {};
            var a = {};
            formData._id = $scope.assignment._id;
            if (type === "jir") {
                $scope.assignment.jir.splice(index, 1);
                formData.jir = $scope.assignment.jir;
                a.title = "Jir Deleted";
                a.subTitle = "Jir Deleted Successfully";
            } else if (type === "photos") {
                $scope.assignment.photos.splice(index, 1);
                formData.photos = $scope.assignment.photos;
                a.title = "Photos Deleted";
                a.subTitle = "Photos Deleted Successfully";
            } else if (type === "Documents") {
                $scope.assignment.docs.splice(index, 1);
                formData.docs = $scope.assignment.docs;
                a.title = "Document Deleted";
                a.subTitle = "Document Deleted Successfully";
            }
            NavigationService.assignmentSave(formData, function (data) {
                if (data.value) {
                    if (data.data.nModified === 1) {
                        a.type = "Normal";
                        a.employee = $scope.employee;
                        $scope.timeline.chat.push(a);
                        $scope.timelineSave();
                        toastr.success(a.subTitle, a.title);
                    } else {
                        toastr.error("There was an error while delete the " + _.capitalize(type), "Error Deleting " + _.capitalize(type));
                    }
                } else {
                    toastr.error("There was an error while delete the " + _.capitalize(type), "Error Deleting " + _.capitalize(type));
                }
            });
        }

        $scope.removeSurveyElement = function (type, index) {
            if (type === 'jir') {
                $scope.surveyData.jir.splice(index, 1);
                toastr.success("Jir Deleted Successfully", "Jir Deleted");
            } else if (type === 'photos') {
                $scope.surveyData.photos.splice(index, 1);
                toastr.success("Photo Deleted Successfully", "Photo Deleted");
            } else if (type === 'Documents') {
                $scope.surveyData.doc.splice(index, 1);
                toastr.success("Document Deleted Successfully", "Document Deleted");
            }
        };

        $scope.surveyUpload = function () {
            $scope.clearSurveyUpload();
            var modalInstance = $uibModal.open({
                scope: $scope,
                templateUrl: '/frontend/views/modal/survey-upload.html',
                size: 'lg'
            });
        };
        $scope.surveyUploadSubmit = function (surveyData) {
            TemplateService.getToastr();
            var formData = {};
            formData.files = true;
            formData.assignId = $stateParams.id;
            formData.empId = $scope.employee;
            formData.jir = $scope.surveyData.jir;
            formData.photos = $scope.surveyData.photos;
            formData.doc = $scope.surveyData.doc;
            NavigationService.editSurvey(formData, function (data) {
                if (data.value) {
                    if (data.data.nModified === 1) {
                        toastr.clear();
                        $scope.getTimeline();
                        toastr.success("", "Assignment Survey files uploaded Successfully");
                    } else {
                        toastr.clear();
                        toastr.error("There was an error while updating survey data", "Error Upading Survey files");
                    }
                } else {
                    toastr.clear();
                    toastr.error("There was an error while updating survey data", "Error Upading Survey files");
                }
            });
        };
        var validSurveyor = false;
        $scope.assignmentSurvey = function () {
            // console.log("$scope.assignment.survey Data", $scope.assignment.survey);
            _.each($scope.assignment.survey, function (n, key) {
                console.log("$scope.assignment", $scope.assignment);
                // && ((n.employee._id === $scope.employee._id) || ($scope.employee._id === $scope.assignment.owner._id))
                if (n.status === "Pending") {
                    console.log("IN If", n, validSurveyor);
                    $scope.offlineSurvey.surveyId = n._id;
                    validSurveyor = true;
                }
            });
            if (validSurveyor) {
                console.log("validSurveyor", validSurveyor);
                var modalInstance = $uibModal.open({
                    scope: $scope,
                    templateUrl: '/frontend/views/modal/assignment-survey.html',
                    size: 'lg'
                });
                validSurveyor = false;
            } else {
                console.log("validSurveyor", validSurveyor);
                toastr.error("Invalid Surveyor");
            }
        };
        $scope.assignmentSurveyForm = function () {
            var modalInstance = $uibModal.open({
                scope: $scope,
                templateUrl: '/frontend/views/modal/survey-form.html',
                size: 'md'
            });
        };
        $scope.assignmentSurveyEdit = function () {
            var modalInstance = $uibModal.open({
                scope: $scope,
                templateUrl: '/frontend/views/modal/survey-edit.html',
                size: 'lg'
            });
        };
        $scope.surveyEditForm = function (survey) {
            console.log('SURVEY ', survey);
            $scope.offlineEditSurvey = {};
            $scope.offlineEditSurvey.surveyId = survey._id;
            $scope.offlineEditSurvey.startTime = new Date(survey.surveyStartTime);
            $scope.offlineEditSurvey.endTime = new Date(survey.surveyEndTime);
            $scope.offlineEditSurvey.surveyDate = new Date(survey.surveyDate);
            $scope.offlineEditSurvey.surveyTime = survey.surveyTime ? new Date(survey.surveyTime) : "";
            $scope.offlineEditSurvey.address = survey.address;
            $scope.offlineEditSurvey.assignId = $stateParams.id;
            $scope.offlineEditSurvey.empId = $scope.employee._id;
            console.log('offline SURVEY ', $scope.offlineEditSurvey);
            var modalInstance = $uibModal.open({
                scope: $scope,
                templateUrl: '/frontend/views/modal/survey-edit-form.html',
                size: 'md'
            });
        };
        $scope.checker = 1;
        $scope.offlineSurvey = {};
        $scope.offlineSurvey.photos = [];
        $scope.offlineSurvey.jir = [];
        $scope.offlineSurvey.doc = [];

        $scope.clearSurveyUpload = function () {
            $scope.surveyData = {};
            $scope.surveyData.photos = [];
            $scope.surveyData.jir = [];
            $scope.surveyData.doc = [];
        };
        $scope.clearSurveyUpload();
        $scope.clearOfflineSurvey = function () {
            $scope.offlineSurvey = {};
            $scope.offlineSurvey.photos = [];
            $scope.offlineSurvey.jir = [];
            $scope.offlineSurvey.doc = [];
        };
        $scope.dateOptions = {
            maxDate: new Date()
        }
        $scope.dateOption = {
            showWeeks: true
        }

        $scope.submitSurvey = function (data) {
            toastr.error("Please Wait", {
                timeOut: 1000
            });
            console.log("Data Of Survey", data);
            $scope.offlineSurvey.startTime = new Date(data.startTime);
            $scope.offlineSurvey.endTime = new Date(data.endTime);
            $scope.offlineSurvey.address = data.address;
            // $scope.offlineSurvey.surveyTime = new Date(data.surveyTime);
            $scope.offlineSurvey.surveyDate = data.surveyDate;
            $scope.offlineSurvey.assignId = $stateParams.id;
            $scope.offlineSurvey.empId = $scope.employee._id;
            NavigationService.mobileSubmit($scope.offlineSurvey, function (data) {
                if (data.data) {
                    toastr.success($scope.assignment.name + " Survey Done");
                    ////$state.reload();
                } else {
                    toastr.error("There was an error while doing survey.", "Error Offline Survey");
                }
            });

            $scope.offlineSurvey = {};
            $scope.offlineSurvey.photos = [];
            $scope.offlineSurvey.jir = [];
            $scope.offlineSurvey.doc = [];

        };

        $scope.submitEditSurvey = function (data) {
            TemplateService.getToastr();
            $scope.offlineEditSurvey.startTime = new Date(data.startTime);
            $scope.offlineEditSurvey.endTime = new Date(data.endTime);
            $scope.offlineEditSurvey.surveyTime = data.surveyTime ? new Date(data.surveyTime) : "";
            NavigationService.editSurvey($scope.offlineEditSurvey, function (data) {
                if (data.data.nModified === 1) {
                    toastr.clear();
                    toastr.success($scope.assignment.name + " Survey Updated Successfully");
                    $scope.getTimeline();
                    ////$state.reload();
                } else {
                    toastr.error("There was an error while doing survey.", "Error Offline Survey");
                }
            });
        };

        $scope.PhotoUploadCallback = function (data, length) {
            _.each(data, function (image) {
                var n = {};
                n.file = image;
                n.fileName = Date.now();
                $scope.offlineSurvey.photos.push(n);
            });
            // console.log('$scope.offlineSurvey.photos',$scope.offlineSurvey.photos);
        };
        $scope.SurveyPhotoUploadCallback = function (data, length) {
            _.each(data, function (image) {
                var n = {};
                n.file = image;
                n.fileName = Date.now();
                $scope.surveyData.photos.push(n);
            });
        };
        $scope.JirUploadCallback = function (data, length) {
            _.each(data, function (image) {
                var n = {};
                n.file = image;
                n.fileName = Date.now();
                $scope.offlineSurvey.jir.push(n);
            });
        };
        $scope.SurveyJirUploadCallback = function (data, length) {
            _.each(data, function (image) {
                var n = {};
                n.file = image;
                n.fileName = Date.now();
                $scope.surveyData.jir.push(n);
            });
        };
        $scope.DocsUploadCallback = function (data, length) {
            _.each(data, function (image) {
                var n = {};
                n.file = image;
                n.fileName = Date.now();
                $scope.offlineSurvey.doc.push(n);
            });
        };
        $scope.SurveyDocsUploadCallback = function (data, length) {
            _.each(data, function (image) {
                var n = {};
                n.file = image;
                n.fileName = Date.now();
                $scope.surveyData.doc.push(n);
            });
        };
        // $scope.viewJIR = function () {
        //     var modalInstance = $uibModal.open({
        //         scope: $scope,
        //         templateUrl: '/frontend/views/modal/modal-files.html',
        //         size: 'md'
        //     });
        // };


        var modalInstance = function () {};
        $scope.allTemplate = "";
        $scope.saveAssignmentTemplate = function (name, temp) {
            var type;
            console.log("NAME", name);
            if (name == "templateIla") {
                type = "ILA";
            } else {
                type = "LOR";
            }
            NavigationService.modelSave('assignment', temp, function (data) {
                if (data.value === true) {
                    toastr.success(type + " draft deleted");
                } else {
                    toastr.error("Error deleting " + type + " draft");
                }
            });
        };
        $scope.disablePdfRegen = true;
        $scope.refreshInvoicePdf = function (invoiceId) {
            $scope.disablePdfRegen = false;
            TemplateService.getToastr();
            NavigationService.getOneModel("Invoice", invoiceId, function (data) {
                $scope.invoiceData = data.data;
                console.log("$scope.invoiceData", $scope.invoiceData, invoiceId);
                NavigationService.generateInvoicePdf($scope.invoiceData, function (data) {
                    if (data.value === true) {
                        console.log("Data of Pdf", data.data.name);
                        $scope.invoiceData.file = data.data.name;
                        NavigationService.modelSave("Invoice", $scope.invoiceData, function (data) {
                            $scope.disablePdfRegen = true;
                            toastr.clear();
                            toastr.success("PDF refreshed successfully");
                            ////$state.reload();
                        });
                    } else {
                        $scope.disablePdfRegen = true;
                        toastr.clear();
                        toastr.error("PDF refreshed failed");
                    }
                });
            });

        };
        $scope.deleteTemplate = function (type, index, name) {
            var allowDelete = false;
            if (name == "LOR" || name == "ILA" || name == "INVOICE") {
                if ($scope.assignment[type][index].approvalStatus == "Draft") {
                    allowDelete = true;
                } else {
                    toastr.error("Only Draft can be deleted");
                }
            } else if ($scope.assignment[type].length > 1) {
                allowDelete = true;
            } else {
                toastr.error("Atleast one " + name + " should be there in folder");
            }
            if (allowDelete) {
                if ($scope.assignment[type][index].templateName) {
                    $scope.message.title = name + " " + $scope.assignment[type][index].templateName + " Deleted"
                } else {
                    $scope.message.title = name + " Deleted"
                }
                $scope.assignment[type].splice(index, 1);
                var newAssignment = {
                    "_id": $scope.assignment._id
                };
                newAssignment[type] = $scope.assignment[type];
                $scope.saveAssignmentTemplate(type, newAssignment);
            }
        };
        $scope.createTemplate = function (tmp) {
            delete tmp._id;
            if ($scope.api === "TemplateInvoice") {
                var newObj = {};
                $scope.assignment[_.camelCase($scope.api)].push(tmp);
            } else {
                tmp.approvalStatus = "Draft";
                // approvalStatus
                $scope.assignment[_.camelCase($scope.api)].push(tmp);
            }

            NavigationService.modelSave("Assignment", $scope.assignment, function (data) {
                if (data.value) {
                    var type = "Ila";
                    if ($scope.api == "TemplateIla") {
                        type = "ILA";
                    } else {
                        type = "LOR";
                    }
                    toastr.success(type + " template " + tmp.name + " selected");
                    $scope.assignmentRefresh();
                } else {
                    toastr.error("Error occured in Creating " + $stateParams.type + " for " + $scope.assignment.name, $stateParams.type);
                }
            });
        };

        $scope.transferAssignment = function (modelData) {
            console.log("modelData , assignment", modelData, $scope.assignment);
            $scope.assignment.owner = modelData.owner;
            NavigationService.modelSave("Assignment", $scope.assignment, function (data) {
                if (data.value === true) {
                    NavigationService.getOneModel("Employee", modelData.owner, function (data) {
                        var transferEmployee = data.data;
                        $scope.message.title = "Transfered To " + transferEmployee.name;
                        $scope.sendMessage("Normal")
                    });
                } else {
                    toastr.error("Error occured in Transfering ");
                }
            });
        };
        $scope.ilaCreateCheck = function () {
            if ($scope.assignment.timelineStatus !== 'Force Closed') {
                if ($scope.assignment.templateIla.length == 0) {
                    if ($scope.assignment.typeOfClaim) {
                        if ($scope.assignment.isInsured) {
                            if ($scope.assignment.postLoss != true) {
                                if ($scope.assignment.dateOfLoss) {
                                    if ($scope.assignment.getAllTaskStatus.survey == "Done") {
                                        if ($scope.assignment.ilaAccess) {
                                            $scope.viewTemplates('ILAs', 'TemplateIla', '');
                                        } else {
                                            if ($scope.assignment.branch.ITAT) {
                                                toastr.error("Disallowed by Supervisor for this Assignment");
                                            } else {
                                                toastr.error("Disallowed at Branch level. Please contact Supervisor");
                                            }
                                        }
                                    } else {
                                        toastr.error("ILA cannot be made without doing Survey");
                                    }
                                } else {
                                    if ($scope.assignment.ilaAccess) { // Check For ILA Waive Button
                                        toastr.error("Please enter Date of Loss");
                                    } else {
                                        if ($scope.assignment.branch.ITAT) {
                                            toastr.error("Disallowed by Supervisor for this Assignment");
                                        } else {
                                            toastr.error("Please enter Date of Loss");
                                            toastr.error("Disallowed at Branch level. Please contact Supervisor");
                                        }
                                    }
                                }
                            } else {
                                toastr.error("ILA is not made for Inspection");
                            }

                        } else {
                            toastr.error("Insured does not have a Policy");
                        }
                    } else {
                        toastr.error("ILA is not made for Desktop. There is no Loss");
                    }
                } else {
                    toastr.error("Multiple ILAs Not Allowed");
                }
            } else {
                toastr.error("Assignment is Force Closed");
            }
        };
        $scope.surveyCreateCheck = function () {
            if ($scope.assignment.timelineStatus !== 'Force Closed') {
                if ($scope.assignment.typeOfClaim) {
                    if ($scope.assignment.surveyAccess) {
                        $scope.assignSurveyor();
                    } else {
                        if ($scope.assignment.branch.STAT) {
                            toastr.error("Disallowed by Supervisor for this Assignment");
                        } else {
                            toastr.error("Disallowed at Branch level. Please contact Supervisor");
                        }
                    }
                } else {
                    toastr.error("Survey is not done for Desktop Claims");
                }
            } else {
                toastr.error("Assignment is Force Closed");
            }
        };
        $scope.lorCreateCheck = function () {
            if ($scope.assignment.timelineStatus !== 'Force Closed') {
                if ($scope.assignment.templateLor.length == 0) {
                    if ($scope.assignment.dateOfLoss) {
                        if ($scope.assignment.lorAccess) {
                            $scope.viewTemplates('LORs', 'TemplateLor', '');
                        } else {
                            if ($scope.assignment.branch.LTAT) {
                                toastr.error("Disallowed by Supervisor for this Assignment");
                            } else {
                                toastr.error("Disallowed at Branch level Please contact Supervisor");
                            }
                        }
                    } else {
                        if ($scope.assignment.lorAccess) { // Check For LOR Waive Button
                            toastr.error("Please enter Date of Loss");
                        } else {
                            if ($scope.assignment.branch.LTAT) {
                                toastr.error("Disallowed by Supervisor for this Assignment");
                            } else {
                                toastr.error("Please enter Date of Loss");
                                toastr.error("Disallowed at Branch level Please contact Supervisor");
                            }
                        }
                    }
                } else {
                    toastr.error("Please edit last LOR to create another LOR");
                }
            } else {
                toastr.error("Assignment is Force Closed");
            }
        }
        // Sanket Deshmukh
        $scope.showEdit = function (temp, getApi, data) {
            if (data.approvalStatus == "Pending") {
                toastr.error("ILA sent for Authorization", "Cannot Edit");
            } else if (data.approvalStatus == "Approved") {
                toastr.error("ILA is Authorized", "Cannot Edit");
            } else {
                $scope.viewTemplates(temp, getApi, data);
            }
        };
        $scope.viewTemplates = function (temp, getApi, data) {
            $scope.allTemplate = temp;
            $scope.api = getApi;
            console.log("Here");
            if (data === "") {
                NavigationService.searchModel(getApi, {
                    page: "1",
                    keyword: ""
                }, "", function (data) {
                    $scope.templateList = data.data.results;
                });
                var modalInstance = $uibModal.open({
                    scope: $scope,
                    templateUrl: '/frontend/views/modal/modal-template.html',
                    size: 'md'
                });
            } else {
                console.log("In Else");
                $state.go("template-view", {
                    "assignmentTemplate": data._id,
                    "type": getApi,
                    "templateName": data.name
                });
            }
        };
        //For Invoice create new button
        $scope.buttonStatus = false;
        $scope.checkButtonViewStatus = function (assignment) {
            console.log("is isInspection ", assignment.isInspection, "date of loss", assignment.dateOfLoss);
            if (_.isEmpty(assignment.dateOfLoss)) {
                if (assignment.isInspection == true) {
                    $scope.buttonStatus = true
                } else {
                    $scope.buttonStatus = false
                }
                console.log("buttonStatus : = ", $scope.buttonStatus);
            } else {
                $scope.buttonStatus = true;
                console.log("buttonStatus : = ", $scope.buttonStatus);
            }
        };


        $scope.viewInvoice = function (assignment, invoice) {
            if (invoice === '') {
                $state.go("createInvoice", {
                    "invoiceId": invoice._id,
                    "assignmentId": assignment._id,
                    "type": "InvoiceExpenditure"
                });
            } else {
                $state.go("editInvoice", {
                    "invoiceId": invoice._id,
                    "assignmentId": assignment._id,
                    "type": "InvoiceExpenditure"
                });
            }
        };

        $scope.templateAttachment = function (attachment) {
            console.log(attachment);
            $state.go("template-view", attachment[0].url);
        };

        // $scope.files = [{
        //     name: "JIR",
        //     type: "templateJir",
        //     count: 2,
        //     files: []
        // }, {
        //     name: "ILA",
        //     type: "templateIla",
        //     count: 0,
        //     files: []
        // }, {
        //     name: "ISR",
        //     type: "templateIsr",
        //     count: 0,
        //     files: []
        // }, {
        //     name: "LOR",
        //     type: "templateLor",
        //     count: 0,
        //     files: []
        // }, {
        //     name: "Assesments",
        //     type: "assessment",
        //     count: 0,
        //     files: []
        // }, {
        //     name: "FSR",
        //     type: "",
        //     count: 0,
        //     files: []
        // }, {
        //     name: "Invoice",
        //     type: "",
        //     count: 0,
        //     files: []
        // }, {
        //     name: "Documents",
        //     type: "docs",
        //     count: 0,
        //     files: []
        // }, {
        //     name: "Photos",
        //     type: "photos",
        //     count: 0,
        //     files: []
        // }, {
        //     name: "Total Attachments",
        //     count: 2,
        //     files: []
        // }];


        //  INTEGRATION STARTS
        $scope.assignment = {};
        $scope.message = {};
        $scope.message.employee = "";
        $scope.timeline = {};
        console.log(new Date());
        $scope.message.title = "Sent a new message";
        $scope.assessment = {};
        $scope.doc = {};
        $scope.photo = {};
        $scope.showCreate = false;
        $scope.assessmentCreateCheck = function () {
            if ($scope.assignment.timelineStatus !== "Force Closed") {
                if ($scope.assignment.assessmentAccess == false) {
                    if ($scope.assignment.branch.ATAT) {
                        toastr.error("Assessment is Waived by Supervisor");
                    } else {
                        toastr.error("Assessment is Waived at Branch Level");
                    }
                } else {
                    console.log("1..");
                    if ($scope.assignment.postLoss !== true) {
                        if ($scope.assignment.dateOfLoss) {
                            console.log("2..");
                            $scope.showCreate = true;
                        } else {
                            toastr.error("Date Of Loss Required");
                        }
                    } else {
                        console.log("3..");
                        $scope.showCreate = true;
                    }
                }
            } else {
                toastr.error("Assignment is Force Closed");
            }
        }
        $scope.fsrCreateCheck = function () {
            if ($scope.assignment.timelineStatus !== "Force Closed") {
                if ($scope.assignment.fsrAccess == false) {
                    if ($scope.assignment.branch.FSR) {
                        toastr.error("FSR is Waived by Supervisor");
                    } else {
                        toastr.error("FSR is Waived at Branch Level");
                    }
                } else {
                    console.log("1..");
                    if ($scope.assignment.postLoss !== true) {
                        if ($scope.assignment.dateOfLoss) {
                            console.log("2..");
                            $scope.showCreate = true;
                        } else {
                            toastr.error("Date Of Loss Required");
                        }
                    } else {
                        console.log("3..");
                        $scope.showCreate = true;
                    }
                }
            } else {
                toastr.error("Assignment is Force Closed");
            }
        }
        $scope.consentCreateCheck = function () {
            if ($scope.assignment.timelineStatus !== "Force Closed") {
                if ($scope.assignment.consentAccess == false) {
                    if ($scope.assignment.branch.CTAT) {
                        toastr.error("Consent is Waived by Supervisor");
                    } else {
                        toastr.error("Consent is Waived at Branch Level");
                    }
                } else {
                    console.log("1..");
                    if ($scope.assignment.postLoss !== true) {
                        if ($scope.assignment.dateOfLoss) {
                            console.log("2..");
                            $scope.showCreate = true;
                        } else {
                            toastr.error("Date Of Loss Required");
                        }
                    } else {
                        console.log("3..");
                        $scope.showCreate = true;
                    }
                }
            } else {
                toastr.error("Assignment is Force Closed");
            }
        }
        NavigationService.getLoginEmployee($.jStorage.get("profile").email, function (data) {
            // NavigationService.getOneModel("User", $.jStorage.get("profile")._id, function (data) {
            $scope.employee = data.data;
            $scope.message.employee = data.data;
            // console.log("In Employee", $scope.employee, data);
            $scope.assessment.employee = $scope.employee.employee;
            $scope.photo.employee = $scope.employee.employee;
            $scope.doc.employee = $scope.employee.employee;
        });
        //call refresh service when socket is on
        function updateTimelineSocket(data) {
            console.log("Nilesh Rocks", data);
            $scope.timeline = data.timeline;
            $scope.timelineChat = _.orderBy($scope.timeline.chat, ["time"], ["desc"]);
            $scope.timlineListTotal = $scope.timelineChat.length;
            $scope.timelineList = [];
            $scope.timlineListLimit = 0;
            $scope.loadMoreBtn = false;
            if (10 < $scope.timelineChat.length) {
                $scope.loadMoreBtn = true;
                console.log("In getloadMoreBtn", $scope.loadMoreBtn);
            }
            $scope.loadMore();
            $scope.assignment = data.assignment;
            $scope.$apply();
            if (data.byUser != $.jStorage.get('getLoginEmployee')._id) {
                toastr.success("New activity added on timeline");
            }
            $scope.getWaiverStatus();
        }

        function establishSocket() {
            console.log("updateTimeline" + $scope.timelineID);
            io.socket.on("updateTimeline" + $scope.timelineID, updateTimelineSocket);
        }

        //To stop socket
        $scope.$on('$stateChangeStart', function (event, toState, fromState) {
            // console.log(event, toState, fromState);
            if ($scope.timelineID != undefined) {
                if ($state.current.name != toState) {
                    io.socket.off("updateTimeline" + $scope.employee._id, updateTimelineSocket);
                    console.log("socket off");
                }
            }
        });
        $scope.getTimeline = function () {
            NavigationService.getOneModel("Timeline", $scope.timelineID, function (data) {
                $scope.timeline = data.data;
                $scope.timelineChat = _.orderBy(data.data.chat, ["time"], ["desc"]);
                $scope.timlineListTotal = $scope.timelineChat.length;
                $scope.loadMoreBtn = false;
                if (10 < $scope.timelineChat.length) {
                    $scope.loadMoreBtn = true;
                    console.log("In getloadMoreBtn", $scope.loadMoreBtn);
                }
                $scope.loadMore();
                if ($scope.timeline.chat.length == 0) {
                    var newChat = {};
                    newChat.employee = $scope.message.employee._id;
                    newChat.title = "Assignment Created Successfully by " + $scope.employee.name;
                    newChat.type = "Normal";
                    $scope.sendMessage2(newChat);
                }
            });
            establishSocket();
        };
        // $scope.options = {
        //     disableBtn: false,
        //     btnLoadingClass: 'is-spinning'
        // };
        $scope.timelineList = [];
        $scope.timlineListLimit = 0;
        $scope.loadMore = function (flag) {
            for (j = 1; j <= 10; j++) {
                if ($scope.timlineListLimit === $scope.timlineListTotal) {
                    $scope.loadMoreBtn = false;
                }
                if ($scope.timlineListLimit < $scope.timlineListTotal) {
                    $scope.timelineList.push($scope.timelineChat[$scope.timlineListLimit]);
                    $scope.timlineListLimit++;
                }

            };
        };
        $scope.sendMessage = function (type) {
            console.log("ABC", $scope.timeline);
            $scope.message.type = type;
            $scope.timeline.chat.push($scope.message);
            NavigationService.saveTimelineAndAssignment($scope.timeline, function (data) {
                // console.log("FFFFF", data);
                if (data.value) {
                    NavigationService.updateEmailStatus({
                        timelineId: $scope.timeline._id,
                        chatId: $scope.chatId,
                        event: $scope.event
                    }, function (data) {
                        console.log(data);
                        if (data.value) {
                            console.log("Mail Status Updated!!");
                        } else {
                            // console.log("There was an error while updating email status !!");
                            toastr.error("There was an error while updating email status.", "Error Updating Email Status.");
                        }
                    });
                    // $scope.getTimeline();
                } else {
                    toastr.error("There was an error while updating timeline.", "Error Updating Timeline.");
                    $scope.getTimeline();
                }

            });
        };
        $scope.sendMessageFromPhoto = function (type) {
            $scope.timeline.chat.push(type);
            NavigationService.saveChat($scope.timeline, function (data) {
                console.log("FFFFF", data);
                $scope.getTimeline();
            });
        };

        //  send email
        $scope.sendEmail = function (modalForm) {

            $scope.msgSend = "Sending..";
            $scope.newTo = angular.copy($scope.emailData);
            $scope.newTo.to = [];
            _.each($scope.emailData.to, function (n) {
                $scope.newTo.to.push(n.email);
            });
            $scope.newTo.cc = [];
            _.each($scope.emailData.cc, function (n) {
                $scope.newTo.cc.push(n.email);
            });
            $scope.newTo.bcc = [];
            _.each($scope.emailData.bcc, function (n) {
                $scope.newTo.bcc.push(n.email);
            });
            $scope.newTo.to = $scope.newTo.to.join();
            $scope.newTo.cc = $scope.newTo.cc.join();
            $scope.newTo.bcc = $scope.newTo.bcc.join();
            $scope.newTo._id = $stateParams.id;
            console.log("newTo : ", $scope.newTo);
            NavigationService.sendEmail($scope.newTo, function (data) {
                console.log(data);
                if (data.value) {
                    if (data.data.error) {
                        toastr.error(data.data.error.code + " Code " + data.data.error.message, "Send email.");
                    } else {
                        $scope.message.email = $scope.newTo;
                        $scope.message.email.response = data;
                        $scope.sendMessage("Email");
                        toastr.success("Your message has been send.", "Send email.");
                        $timeout(function () {
                            modalInstance.close();
                        }, 1000);
                        $scope.getTimeline();
                    }

                } else {
                    // $scope.msgSend = "Error in sending email";
                    toastr.error("Error in sending email.", "Send email.");
                }
            });
        };

        $scope.saveAssignment = function (otherInfo) {
            if (otherInfo === "Assessment") {
                $scope.assignment.getAllTaskStatus.assessment = "Done";
                $scope.assignment.getAllTaskStatus.assessmentTime = Date.now();
                // $scope.assignment.timelineStatus = "Consent Pending";
            } else if (otherInfo === "Docs") {
                console.log("In Docs")
                // $scope.assignment.timelineStatus = "Assessment Pending";
            } else if (otherInfo === "FSR") {
                $scope.assignment.getAllTaskStatus.fsr = "Done";
                $scope.assignment.getAllTaskStatus.fsrTime = Date.now();
            } else if (otherInfo === "Consent") {
                $scope.assignment.getAllTaskStatus.consent = "Done";
                $scope.assignment.getAllTaskStatus.consentTime = Date.now();
            }
            console.log($scope.assignment.consent);
            NavigationService.assignmentSave($scope.assignment, function (data) {
                if (data.value === true) {
                    // $scope.reload();
                    // $scope.message.title = otherInfo + " Uploaded.";
                    // $scope.sendMessage("File");
                    toastr.success($scope.assignment.name + " Updated", "Assignment " + $scope.assignment.name);
                } else {
                    toastr.error("Error in updating " + $scope.assignment.name + ".", "Assignment " + $scope.assignment.name);
                }
            });
        };

        $scope.onFileUploadCallback1 = function (data) {
            if (data.file) {
                if (!$scope.assignment.assessment) {
                    $scope.assignment.assessment = [];
                }
                data.fileName = Date.now();
                $scope.message.attachment = [];
                var a = {
                    type: "Assessment",
                    url: data.file[0]
                };
                $scope.message.attachment.push(a);
                $scope.assignment.assessment.push(data);
                $scope.saveAssignment("Assessment");
            }
        };

        // $scope.onFileUploadCallback = function (data) {
        //     if (data.file) {
        //         if (!$scope.assignment.fsrs) {
        //             $scope.assignment.fsrs = [];
        //         }
        //         data.fileName = Date.now();
        //         $scope.message.attachment = [];
        //         var a = {
        //             type: "FSR",
        //             url: data.file[0]
        //         };
        //         $scope.message.attachment.push(a);
        //         $scope.assignment.fsrs.push(data);
        //         $scope.saveAssignment("FSR");
        //     }
        // };

        var a = {};
        var b = 0;
        $scope.arr = [];

        $scope.onFileUploadCallback = function (data, length) {
            console.log("Photo Data", data, $scope.timeline, $scope.timelineID);
            if ($scope.checker === length) {
                $scope.arr.push(data);
                $scope.checker = 1;
                var array = _.cloneDeep($scope.arr);
                var newArray = _.each($scope.arr, function (n) {
                    a.employee = $scope.message.employee,
                        a.file = n,
                        a.fileName = Date.now();
                    a.type = "File",
                        a.title = "FSR Uploaded",
                        a.attachment = n;
                    $scope.assignment.fsrs.push(_.cloneDeep(a));
                    $scope.sendMessageFromPhoto(_.cloneDeep(a));
                    console.log("Array to be Passed", a);
                });
                $scope.arr = [];
                $scope.saveAssignment("FSR");
            } else {
                $scope.arr.push(data);
                $scope.checker++;
            }
        };

        //         $scope.onInvoiceUploadCallback = function (data, length) {
        //     console.log("Photo Data", data, $scope.timeline, $scope.timelineID);
        //     if ($scope.checker === length) {
        //         $scope.arr.push(data);
        //         $scope.checker = 1;
        //         var array = _.cloneDeep($scope.arr);
        //         var newArray = _.each($scope.arr, function (n) {
        //             a.employee = $scope.message.employee,
        //                 a.file = n,
        //                 a.fileName = Date.now();
        //                 a.type = "File",
        //                 a.title = "FSR Uploaded",
        //                 a.attachment = n;
        //             $scope.assignment.invoice.push(_.cloneDeep(a));
        //             $scope.sendMessageFromPhoto(_.cloneDeep(a));
        //             console.log("Array to be Passed", a);
        //         });
        //         $scope.arr = [];
        //         $scope.saveAssignment("FSR");
        //     } else {
        //         $scope.arr.push(data);
        //         $scope.checker++;
        //     }
        // };

        //To upload photo timeline and assignmet
        $scope.uploadPhotosOnTimeLineAndAssignment = function (type, photosType) {
            $scope.timeline.chat.push(type);
            $scope.timeline.type = photosType;
            NavigationService.saveTimelineAndAssignment($scope.timeline, function (data) {
                console.log("FFFFF", data);
                // $scope.getTimeline();
            });
        }

        $scope.onPhotoUploadCallback = function (data, length) {
            var timeline = {}
            timeline.file = data;
            timeline.employee = $scope.message.employee;
            timeline.fileName = Date.now();
            timeline.type = "Normal";
            timeline.title = "Photo(s) Uploaded";
            timeline.attachment = data;
            $scope.assignment.photos.push(_.cloneDeep(timeline));
            // console.log('$scope.assignment.photos',$scope.assignment.photos);
            $scope.uploadPhotosOnTimeLineAndAssignment(_.cloneDeep(timeline), 'photos');
        };

        $scope.onJirUploadCallback = function (data, length) {
            var timeline = {}
            timeline.file = data;
            timeline.employee = $scope.message.employee;
            timeline.fileName = Date.now();
            timeline.type = "Normal";
            timeline.title = "Jir(s) Uploaded";
            timeline.attachment = data;
            $scope.assignment.jir.push(_.cloneDeep(timeline));
            console.log('$scope.assignment.jir', $scope.assignment.jir);
            $scope.uploadPhotosOnTimeLineAndAssignment(_.cloneDeep(timeline), 'jir');
        };

        $scope.onAssessmentUploadCallback = function (data, length) {
            if ($scope.checker === length) {
                TemplateService.getToastr();
                $scope.arr.push(data);
                var timelineData = {
                    title: "Assessment Uploaded",
                    type: "File",
                    employee: $.jStorage.get("getLoginEmployee")._id
                }
                var assessmentSaveObject = {
                    timelineData: timelineData,
                    arr: $scope.arr,
                    assignment: $scope.assignment,
                    type: "assessment"
                }
                console.log("Data OF Assessment", $scope.arr, $scope.assignment);
                NavigationService.uploadAssessment(assessmentSaveObject, function (data) {
                    if (data.value) {
                        ////$state.reload();
                        toastr.clear();
                    } else {
                        toastr.clear();
                        toastr.err("Unable To Save");
                        $scope.disableSave = false;
                    }
                });
                $scope.checker = 1;
                $scope.arr = [];
            } else {
                $scope.arr.push(data);
                $scope.checker++;
            }
        };
        $scope.onConsentUploadCallback = function (data, length) {
            if ($scope.checker === length) {
                TemplateService.getToastr();
                $scope.arr.push(data);
                var timelineData = {
                    title: "Consent Uploaded",
                    type: "File",
                    employee: $.jStorage.get("getLoginEmployee")._id
                }
                var assessmentSaveObject = {
                    timelineData: timelineData,
                    arr: $scope.arr,
                    assignment: $scope.assignment,
                    type: "consent"
                }
                NavigationService.uploadAssessment(assessmentSaveObject, function (data) {
                    if (data.value) {
                        ////$state.reload();
                        toastr.clear();
                    } else {
                        toastr.clear();
                        toastr.err("Unable To Save");
                        $scope.disableSave = false;
                    }
                });
                $scope.checker = 1;
                $scope.arr = [];
            } else {
                $scope.arr.push(data);
                $scope.checker++;
            }
        };
        $scope.onFsrUploadCallback = function (data, length) {
            if ($scope.checker === length) {
                TemplateService.getToastr();
                $scope.arr.push(data);
                var timelineData = {
                    title: "FSR Uploaded",
                    type: "File",
                    employee: $.jStorage.get("getLoginEmployee")._id
                }
                var assessmentSaveObject = {
                    timelineData: timelineData,
                    arr: $scope.arr,
                    assignment: $scope.assignment,
                    type: "fsr"
                }
                NavigationService.uploadAssessment(assessmentSaveObject, function (data) {
                    if (data.value) {
                        ////$state.reload();
                        toastr.clear();
                    } else {
                        toastr.clear();
                        toastr.err("Unable To Save");
                        $scope.disableSave = false;
                    }
                });
                $scope.checker = 1;
                $scope.arr = [];
            } else {
                $scope.arr.push(data);
                $scope.checker++;
            }
        };
        $scope.onDocsUploadCallback = function (data, length) {
            var timeline = {}
            timeline.file = data;
            timeline.employee = $scope.message.employee;
            timeline.fileName = Date.now();
            timeline.type = "Normal";
            timeline.title = "Document(s) Uploaded";
            timeline.attachment = data;
            $scope.assignment.docs.push(_.cloneDeep(timeline));
            $scope.uploadPhotosOnTimeLineAndAssignment(_.cloneDeep(timeline), 'Documents');
        };
    })


    .controller('EmailInboxCtrl', function ($scope, $window, $uibModal, TemplateService, NavigationService, $timeout, $stateParams, $state, toastr, base64) {
        //Used to name the .html file
        $scope.template = TemplateService.changecontent("email-inbox");
        $scope.menutitle = NavigationService.makeactive("Email Inbox");
        TemplateService.title = $scope.menutitle;
        $scope.navigation = NavigationService.getnav();

        $scope.header = {
            "name": "Email Inbox"
        };
        $scope.msg = "Loading...";
        $scope.msgSend = "";
        $scope.allSelect = false;
        $scope.mails = [];
        $scope.emailForm = {};
        $scope.labelIds = "INBOX";
        $scope.tabMenue = [{
            title: "Inbox",
            label: "INBOX",
            class: "active"
        }, {
            title: "Draft",
            label: "DRAFT",
            class: ""
        }, {
            title: "Important",
            label: "IMPORTANT",
            class: ""
        }, {
            title: "Sent",
            label: "SENT",
            class: ""
        }, {
            title: "Trash",
            label: "TRASH",
            class: ""
        }];
        $scope.scrollDisable = false;
        // GMAIL CALL
        $scope.tabSelected = function (label, tab) {
            _.each($scope.tabMenue, function (n) {
                n.class = "";
            });
            tab.class = "active";
            $scope.msg = "Loading...";
            $scope.emailForm.search = "";
            $scope.mails = [];
            $scope.labelIds = label;
            $scope.reloadGmail();
        };
        $scope.reloadGmail = function (nextPageToken) {
            NavigationService.gmailCall({
                url: "messages",
                method: "GET",
                nextPageToken: nextPageToken,
                search: $scope.emailForm.search,
                labelIds: $scope.labelIds
            }, function (data) {
                console.log(data);
                if (data.data.resultSizeEstimate === 0) {
                    $scope.msg = "You don't have any e-mails.";
                } else {
                    $scope.msg = "";
                }
                if (!nextPageToken) {
                    $scope.mails = data.data.messages;
                } else {
                    _.each(data.data.messages, function (n) {
                        $scope.mails.push(n);
                    });
                }
                $scope.nextPage = data.data.nextPageToken;

            });
        };
        $scope.reloadGmail();
        $scope.showSingle = function (data) {
            console.log("Email Data Before Passing", data);
            $.jStorage.set("oneEmail", data);
            $state.go("email-single", {
                // id: data.threadId
                id: data.id
            });
        };

        function getHeight() {
            $scope.emailheight = $window.innerHeight - 130;
        }
        getHeight();

        angular.element($window).bind('resize', function () {
            getHeight();
            $scope.$apply();
        });

        $scope.tinymceModel = 'Initial content';
        $scope.tinymceOptions = {
            plugins: 'link image code',
            toolbar: 'undo redo | bold italic | alignleft aligncenter alignright | code'
        };

        $scope.emailToDelete = [];
        $scope.selectAll = function (check) {
            console.log(check);
            if (check) {
                _.each($scope.mails, function (n) {
                    n.checked = true;
                    $scope.emailToDelete.push(n.threadId);
                });
            } else {
                $scope.emailToDelete = [];
                _.each($scope.mails, function (n) {
                    n.checked = false;

                });
            }
        };
        $scope.addEmailToDelete = function (data) {
            var a = _.findIndex($scope.emailToDelete, function (o) {
                return o == data.id;
            });
            console.log(a);
            if (a == -1) {
                $scope.emailToDelete.push(data.id);
            } else {
                // var ind =
                $scope.emailToDelete.splice(a, 1);
            }

            console.log($scope.emailToDelete);
        };

        $scope.email = {
            message: ""
        };
        $scope.emailtos = [{
            name: 'Jagruti',
            email: 'jagruti@wohlig.com'
        }, {
            name: 'Tushar',
            email: 'tushar@wohlig.com'
        }, {
            name: 'Chintan',
            email: 'chintan@wohlig.com'
        }, {
            name: 'Harsh',
            email: 'harsh@wohlig.com'
        }, {
            name: 'Raj',
            email: 'raj@wohlig.com'
        }];
        var modalInstance = function () {};
        $scope.newEmail = function () {
            $scope.msgSend = "";
            modalInstance = $uibModal.open({
                scope: $scope,
                templateUrl: '/frontend/views/modal/modal-email.html',
                size: 'lg'
            });
        };
        $scope.sendEmail = function (modalForm) {

            $scope.msgSend = "Sending..";
            $scope.newTo = angular.copy($scope.email);
            $scope.newTo.to = [];
            _.each($scope.email.to, function (n) {
                $scope.newTo.to.push(n.email);
            });
            $scope.newTo.cc = [];
            _.each($scope.email.cc, function (n) {
                $scope.newTo.cc.push(n.email);
            });
            $scope.newTo.bcc = [];
            _.each($scope.email.bcc, function (n) {
                $scope.newTo.bcc.push(n.email);
            });
            $scope.newTo.to = $scope.newTo.to.join();
            $scope.newTo.cc = $scope.newTo.cc.join();
            $scope.newTo.bcc = $scope.newTo.bcc.join();
            console.log($scope.newTo);
            NavigationService.sendEmail($scope.newTo, function (data) {
                console.log(data);
                if (data.value) {
                    toastr.success("Your message has been send.", "Send email.");
                    $timeout(function () {
                        modalInstance.close();
                    }, 1000);
                } else {
                    // $scope.msgSend = "Error in sending email";
                    toastr.success("Error in sending email.", "Send email.");
                }
            });
        };
        // $scope.files = [{
        //     type: "JIR",
        //     count: 2,
        //     files: [{
        //         name: "doc1.docx",
        //         selection: true
        //     }, {
        //         name: "doc2.docx",
        //         selection: true
        //     }]
        // }, {
        //     type: "ILA",
        //     count: 0,
        //     files: []
        // }, {
        //     type: "ILR",
        //     count: 0,
        //     files: []
        // }, {
        //     type: "LOR",
        //     count: 0,
        //     files: []
        // }, {
        //     type: "Assesments",
        //     count: 0,
        //     files: []
        // }, {
        //     type: "FSR",
        //     count: 0,
        //     files: []
        // }, {
        //     type: "Invoice",
        //     count: 0,
        //     files: []
        // }, {
        //     type: "Documents",
        //     count: 0,
        //     files: []
        // }, {
        //     type: "Images",
        //     count: 0,
        //     files: []
        // }, {
        //     type: "Total Attachments",
        //     count: 2,
        //     files: [{
        //         name: "doc1.docx",
        //         selection: true
        //     }, {
        //         name: "doc2.docx",
        //         selection: true
        //     }]
        // }];


    })

    .controller('EmailSingleCtrl', function ($scope, $window, $filter, TemplateService, NavigationService, $timeout, $stateParams, $state, toastr) {
        //Used to name the .html file
        $scope.template = TemplateService.changecontent("email-single");
        $scope.menutitle = NavigationService.makeactive("Single Mail");
        TemplateService.title = $scope.menutitle;
        $scope.navigation = NavigationService.getnav();

        $scope.header = {
            "name": "Single Mail"
        };
        console.log();
        $scope.pdf = {};

        $scope.createAssignment = function () {
            NavigationService.pdfGenerate({
                "messageId": $stateParams.id
            }, function (data) {

                $scope.pdf = data.data;

                $state.go("createassignmentemail", {
                    'emailId': $scope.email.id,
                    'model': "assignment",
                    'pdf': $scope.pdf.name
                });

            });
        };

        NavigationService.detailEmail({
            "messageId": $stateParams.id
        }, function (data) {
            $scope.email = data.data;
            console.log("Email ............", $scope.email, data);
            var a = $filter("base64url")(data.data.raw);

            $scope.email.attachment = [];
            switch ($scope.email.payload.mimeType) {
                case "multipart/related":
                    {
                        _.each($scope.email.payload.parts, function (data) {
                            console.log("in parts");
                            console.log(data);
                            if (data.mimeType == "multipart/alternative") {
                                _.each(data.parts, function (data2) {
                                    if (data2.mimeType == "text/html") {
                                        console.log("In related");
                                        $scope.email.body = data2.body.data;
                                    }
                                });

                            }
                            if (data.filename !== "") {
                                console.log("in attach");
                                $scope.email.attachment.push(data);
                                console.log($scope.email.attachment);
                            }
                        });
                        console.log("scope email", $scope.email);
                    }
                    break;
                case "multipart/mixed":
                    {
                        _.each($scope.email.payload.parts, function (data) {
                            console.log("in parts");
                            console.log(data);
                            if (data.mimeType == "multipart/alternative") {
                                _.each(data.parts, function (data2) {
                                    if (data2.mimeType == "text/html") {
                                        console.log("In Mixed");
                                        $scope.email.body = data2.body.data;
                                    }
                                });

                            }
                            if (data.mimeType == "application/zip") {
                                console.log("In Zip outer If");
                                _.each(data.parts, function (data2) {
                                    console.log("In Zip _.each");
                                    if (data2.mimeType == "multipart/alternative") {
                                        console.log("In Zip");
                                        $scope.email.body = data2.body.data;
                                    }
                                });

                            }
                            if (data.filename !== "") {
                                console.log("in attach");
                                $scope.email.attachment.push(data);
                                console.log($scope.email.attachment);
                            }
                        });
                        console.log("scope email", $scope.email);
                    }
                    break;

                case "multipart/alternative":
                    {
                        _.each($scope.email.payload.parts, function (data) {

                            if (data.mimeType == "text/html") {
                                console.log("In Alternative");
                                $scope.email.body = data.body.data;
                            }

                        });
                        console.log("scope email", $scope.email);
                    }
                    break;
                case "text/html":
                    {
                        console.log("In text/html");
                        $scope.email.body = $scope.email.payload.body.data;
                        console.log("scope email", $scope.email);
                    }
                    break;
            }
            $.jStorage.set("assignmentEmail", $scope.email);

        });

        $scope.accessToken = $.jStorage.get("accessToken");
        $scope.openAttachment = function (f) {
            var a = {
                "attachmentId": f.body.attachmentId,
                "fileName": f.filename,
                "messageId": $stateParams.id
            };
            var win = window.open(adminurl + "user/getAttachment?accessToken=" + $scope.accessToken + "&fileName=" + f.filename + "&attachmentId=" + f.body.attachmentId + "&messageId=" + $stateParams.id, '_blank');
            // NavigationService.getAttachment(a, function (data) {
            //     console.log(data);
            // });
        };


        $scope.emailSnippet = '<div dir="ltr">Dear Chintan,<div><br></div><div>Seen the links. What next?</div></div><div data-smartmail="gmail_signature"><div><br></div><div>Warm Regards,</div><div><br></div><div><b>Arun Arora</b></div><div><font color="#666666">M: +91 81080 99789</font></div><div>______________________________<wbr>____________________</div><div><br></div><div><b><font color="#000099">Absolute Insurance Surveyors &amp; Loss Assessors Pvt Ltd</font></b></div><div><font color="#666666">501/502, Ideal Trade Centre, Sector 11,&nbsp;CBD Belapur, Navi Mumbai 400 614</font></div><div><font color="#666666">T: +91 22 2756 2983 | F: +91 22 2756 2984</font></div></div>';

    })



    .controller('IlaApprovalsCtrl', function ($scope, $window, TemplateService, NavigationService, $timeout, base64, $stateParams, $state, toastr) {
        //Used to name the .html file
        $scope.template = TemplateService.changecontent("ila-approval", $state);
        $scope.menutitle = NavigationService.makeactive("Approvals");
        TemplateService.title = $scope.menutitle;
        $scope.navigation = NavigationService.getnav();
        $scope.currentPage = $stateParams.page;
        var i = 0;
        $scope.employee = $.jStorage.get("getLoginEmployee");
        // NavigationService.getLoginEmployee($.jStorage.get("profile").email, function (data) {
        //     $scope.employee = data.data._id;
        //     console.log("In $scope.ownersId", $scope.employee);
        // });
        $scope.list = [{
            name: 'ILA',
            value: 'ILA'
        }, {
            name: 'LOR',
            value: 'LOR'
        }]
        $scope.getAll = function (data) {
            console.log(data);
            $scope.approvalType = data.value;
            $scope.showAll();
        }
        $scope.search = {
            keyword: ""
        };
        if ($stateParams.keyword) {
            $scope.search.keyword = $stateParams.keyword;
        }
        $scope.approvalType = "ILA";

        //Code by--- Nilesh
        //Function to get approval list.
        function getApprovalList() {
            NavigationService.getApprovalListIla({
                page: $scope.currentPage,
                type: "templateIla",
                employee: $scope.employee._id,
                keyword: $scope.search.keyword
            }, ++i, function (data, ini) {
                if (ini == i) {
                    $scope.ilaList = data.data.results;
                    $scope.totalItems = data.data.total;
                    $scope.maxRow = data.data.options.count;
                }
                console.log("$scope.ilaList", $scope.ilaList);
            });
        };

        //For socket
        // io.socket.on("updateTimeline" + $scope.employee._id, function (data) {
        //     console.log("Nilesh Rocks", data);
        //     $scope.timeline = data.timeline;
        //     $scope.assignment = data.assignment;
        //     $scope.$apply();
        //     if (data.byUser != $.jStorage.get('getLoginEmployee')._id) {
        //         toastr.success("New activity added on timeline");
        //     }
        // });
        //Code ends ---- Nilesh
        $scope.showAll = function (keywordChange) {
            // console.log("In $scope.ownersId1111111", $scope.employee);
            $scope.totalItems = undefined;
            if (keywordChange) {
                $scope.currentPage = 1;
            }
            getApprovalList();
        };
        $scope.cancel = function () {
            $window.history.back();
        };
        $scope.changePage = function (page) {
            console.log("Page", page);
            var goTo = "ilaApproval-list";
            if ($scope.search.keyword) {
                goTo = "ilaApproval-list";
            }
            $state.go(goTo, {
                page: page,
                keyword: $scope.search.keyword
            });
        };
        $scope.showAll();
        $scope.getDelayClass = function (val) {
            var retClass = "";
            var hours = moment().diff(moment(val), "hours");
            retClass = TemplateService.getDelayClass(hours);
            return retClass;
        };

        $scope.viewTemplates = function (temp, getApi, data) {
            $scope.allTemplate = temp;
            $scope.api = getApi;
            $state.go("template-view", {
                "assignmentTemplate": data._id,
                "type": getApi,
                "approval": true,
                "templateName": data.name
            });
        };
        $scope.saveOnTimeline = function () {
            NavigationService.saveChat($scope.timeline, function (data) {
                // console.log("FFFFF", data);
                if (data.value === false) {
                    toastr.success("There was an error while saving data to the timeline", "Timeline Error");
                }
            });
        }
        $scope.saveAssignment = function (obj) {
            console.log("Approval", obj);
            NavigationService.saveAssignmentTemplate(obj, function (data) {
                $scope.showAll();
            });
        }
        $scope.acceptIla = function (assignment) {
            $scope.assignment = assignment;
            NavigationService.getOneModel("Timeline", $scope.assignment.timeline[0], function (data) {
                $scope.timeline = data.data;
                console.log("$scope.assignment.templateIla.templateName", $scope.assignment.templateIla.templateName);
                var a = {};
                a.title = "ILA " + $scope.assignment.templateIla.templateName + " Approved ";
                a.type = "Normal",
                    a.employee = $scope.employee,
                    $scope.timeline.chat.push(a);
                $scope.saveOnTimeline();
                var obj = {
                    assignId: $scope.assignment._id,
                    _id: $scope.assignment.templateIla._id,
                    approvalStatus: "Approved",
                    type: "templateIla"
                }
                $scope.saveAssignment(obj);
                toastr.success("Approved ILA for " + $scope.assignment.name);
            });
        };

        $scope.reviseIla = function (assignment) {
            $scope.assignment = assignment;
            NavigationService.getOneModel("Timeline", $scope.assignment.timeline[0], function (data) {
                $scope.timeline = data.data;
                console.log("$scope.assignment.templateIla.templateName", $scope.assignment.templateIla.templateName);
                var a = {};
                a.title = "ILA " + $scope.assignment.templateIla.templateName + " Revised ";
                a.type = "Normal",
                    a.employee = $scope.employee,
                    $scope.timeline.chat.push(a);
                $scope.saveOnTimeline();
                var obj = {
                    assignId: $scope.assignment._id,
                    _id: $scope.assignment.templateIla._id,
                    approvalStatus: "Revised",
                    type: "templateIla"
                }
                $scope.saveAssignment(obj);
                toastr.success("Revised ILA for " + $scope.assignment.name);
            });
        }

    })

    .controller('LorApprovalsCtrl', function ($scope, $window, TemplateService, NavigationService, $timeout, base64, $stateParams, $state, toastr) {
        //Used to name the .html file
        $scope.template = TemplateService.changecontent("lor-approval", $state);
        $scope.menutitle = NavigationService.makeactive("Approvals");
        TemplateService.title = $scope.menutitle;
        $scope.navigation = NavigationService.getnav();
        $scope.currentPage = $stateParams.page;
        var i = 0;
        $scope.employee = $.jStorage.get("getLoginEmployee");
        // NavigationService.getLoginEmployee($.jStorage.get("profile").email, function (data) {
        //     $scope.employee = data.data._id;
        //     console.log("In $scope.ownersId", $scope.employee);
        // });
        $scope.getAll = function (data) {
            console.log(data);
            $scope.approvalType = data.value;
            $scope.showAll();
        }
        $scope.search = {
            keyword: ""
        };
        if ($stateParams.keyword) {
            $scope.search.keyword = $stateParams.keyword;
        }
        $scope.approvalType = "LOR";
        $scope.showAll = function (keywordChange) {
            $scope.totalItems = undefined;
            if (keywordChange) {
                $scope.currentPage = 1;
            }
            NavigationService.getApprovalListLor({
                page: $scope.currentPage,
                type: "templateLor",
                employee: $scope.employee._id,
                keyword: $scope.search.keyword
            }, ++i, function (data, ini) {
                if (ini == i) {
                    $scope.lorList = data.data.results;
                    $scope.totalItems = data.data.total;
                    $scope.maxRow = data.data.options.count;
                }
                console.log("$scope.lorList", data);
            });
        };
        $scope.cancel = function () {
            $window.history.back();
        };
        $scope.changePage = function (page) {
            console.log("Page", page);
            var goTo = "lorApproval-list";
            if ($scope.search.keyword) {
                goTo = "lorApproval-list";
            }
            $state.go(goTo, {
                page: page,
                keyword: $scope.search.keyword
            });
        };
        $scope.showAll();
        // $scope.someDate = moment().subtract(24, "hours").toDate();
        $scope.getDelayClass = function (val) {
            var retClass = "";
            var hours = moment().diff(moment(val), "hours");
            retClass = TemplateService.getDelayClass(hours);
            return retClass;
        };

        $scope.viewTemplates = function (temp, getApi, data) {
            $scope.allTemplate = temp;
            $scope.api = getApi;
            $state.go("template-view", {
                "assignmentTemplate": data._id,
                "type": getApi,
                "approval": true
            });
        };
        $scope.saveOnTimeline = function () {
            NavigationService.saveChat($scope.timeline, function (data) {
                console.log("FFFFF", data);
            });
        }
        $scope.saveAssignment = function (obj) {
            console.log("Approval", obj);
            NavigationService.saveAssignmentTemplate(obj, function (data) {
                $scope.showAll();
            });
        }
        $scope.acceptLor = function (assignment) {
            $scope.assignment = assignment;
            NavigationService.getOneModel("Timeline", $scope.assignment.timeline[0], function (data) {
                $scope.timeline = data.data;
                console.log("$scope.assignment.templateLor.templateName", $scope.assignment.templateLor.templateName);
                var a = {};
                a.title = "LOR " + $scope.assignment.templateLor.templateName + " Approved ";
                a.type = "Normal",
                    a.employee = $scope.employee,
                    $scope.timeline.chat.push(a);
                $scope.saveOnTimeline();
                var obj = {
                    assignId: $scope.assignment._id,
                    _id: $scope.assignment.templateLor._id,
                    approvalStatus: "Approved",
                    type: "templateLor"
                }
                $scope.saveAssignment(obj);
                toastr.success("Approved LOR for " + $scope.assignment.name);
            });
        };

        $scope.reviseLor = function (assignment) {
            $scope.assignment = assignment;
            NavigationService.getOneModel("Timeline", $scope.assignment.timeline[0], function (data) {
                $scope.timeline = data.data;
                console.log("$scope.assignment.templateLor.templateName", $scope.assignment.templateLor.templateName);
                var a = {};
                a.title = "LOR " + $scope.assignment.templateLor.templateName + " Revised ";
                a.type = "Normal",
                    a.employee = $scope.employee,
                    $scope.timeline.chat.push(a);
                $scope.saveOnTimeline();
                var obj = {
                    assignId: $scope.assignment._id,
                    _id: $scope.assignment.templateLor._id,
                    approvalStatus: "Revised",
                    type: "templateLor"
                }
                $scope.saveAssignment(obj);
                toastr.success("Revised LOR for " + $scope.assignment.name);
            });
        }

    })

    .controller('InvoiceApprovalsCtrl', function ($scope, $window, TemplateService, NavigationService, $timeout, base64, $stateParams, $state, toastr) {
        //Used to name the .html file
        $scope.template = TemplateService.changecontent("invoice-approval", $state);
        $scope.menutitle = NavigationService.makeactive("Approvals");
        TemplateService.title = $scope.menutitle;
        $scope.navigation = NavigationService.getnav();
        $scope.currentPage = $stateParams.page;
        var i = 0;
        $scope.employee = $.jStorage.get("getLoginEmployee");
        // NavigationService.getLoginEmployee($.jStorage.get("profile").email, function (data) {
        //     $scope.employee = data.data._id;
        //     console.log("In $scope.ownersId", $scope.employee);
        // });
        $scope.getAll = function (data) {
            console.log(data);
            $scope.approvalType = data.value;
            $scope.showAll();
        }
        $scope.search = {
            keyword: ""
        };
        if ($stateParams.keyword) {
            $scope.search.keyword = $stateParams.keyword;
        }
        $scope.approvalType = "invoice";
        $scope.showAll = function (keywordChange) {
            $scope.employee = $.jStorage.get("getLoginEmployee");
            $scope.totalItems = undefined;
            if (keywordChange) {
                $scope.currentPage = 1;
            }
            NavigationService.getInvoiceApprovalList({
                page: $scope.currentPage,
                keyword: $scope.search.keyword,
                employee: $scope.employee._id
            }, ++i, function (data, ini) {
                if (ini == i) {
                    $scope.invoiceList = data.data.results;
                    $scope.totalItems = data.data.total;
                    $scope.maxRow = data.data.options.count;
                    console.log("modelList", $scope.invoiceList);
                }
            });
        };

        // 
        $scope.viewInvoice = function (invoice, assignment) {
            $state.go("editInvoice", {
                "invoiceId": invoice,
                "assignmentId": assignment._id,
                "approval": true
            });
        }
        // 
        $scope.cancel = function () {
            $window.history.back();
        };
        $scope.changePage = function (page) {
            console.log("Page", page);
            var goTo = "invoiceApproval-list";
            if ($scope.search.keyword) {
                goTo = "invoiceApproval-list";
            }
            $state.go(goTo, {
                page: page,
                keyword: $scope.search.keyword
            });
        };
        $scope.showAll();
        // $scope.someDate = moment().subtract(24, "hours").toDate();
        $scope.getDelayClass = function (val) {
            var retClass = "";
            var hours = moment().diff(moment(val), "hours");
            retClass = TemplateService.getDelayClass(hours);
            return retClass;
        };

        $scope.viewTemplates = function (temp, getApi, data) {
            $scope.allTemplate = temp;
            $scope.api = getApi;
            console.log("$scope.api", $scope.api);
            console.log("In Else");
            $state.go("template-view", {
                "assignmentTemplate": data._id,
                "type": getApi,
                "approval": true
            });
        };
        $scope.saveOnTimeline = function () {
            NavigationService.saveChat($scope.timeline, function (data) {
                console.log("FFFFF", data);
            });
        }
        $scope.acceptInvoice = function (data, assignment) {
            $scope.invoice = data
            $scope.assignment = assignment;
            NavigationService.getOneModel("Timeline", $scope.assignment.timeline[0], function (data) {
                $scope.timeline = data.data;
                var a = {};
                a.title = "Invoice " + $scope.invoice.invoiceNumber + " Approved ";
                a.event = "Invoice Release",
                    a.viewEmailStatus = "true",
                    a.invoiceNumber = $scope.invoice.invoiceNumber;
                a.type = "Normal",
                    a.employee = $scope.employee,
                    $scope.timeline.chat.push(a);
                $scope.saveOnTimeline();
                $scope.invoice.approvalStatus = "Approved";
                NavigationService.modelSave("Invoice", $scope.invoice, function (data) {
                    if (data.value == true) {
                        console.log("sdfghjk");
                        toastr.success("Approved Invoice for " + $scope.assignment.name);
                        $scope.showAll();
                    }
                });
            });
        };

        $scope.reviseInvoice = function (data, assignment) {
            $scope.invoice = data
            $scope.assignment = assignment;
            NavigationService.getOneModel("Timeline", $scope.assignment.timeline[0], function (data) {
                $scope.timeline = data.data;
                var a = {};
                a.title = "Invoice " + $scope.invoice.invoiceNumber + " Revised ";
                a.invoiceNumber = $scope.invoice.invoiceNumber;
                a.type = "Normal",
                    a.employee = $scope.employee,
                    $scope.timeline.chat.push(a);
                $scope.saveOnTimeline();
                $scope.invoice.approvalStatus = "Approved";
                NavigationService.modelSave("Invoice", $scope.invoice, function (data) {
                    if (data.value == true) {
                        toastr.success("Revised Invoice for " + $scope.assignment.name);
                        $scope.showAll();
                    }
                });
            });
        }

    })

    .controller('SbcApprovalsCtrl', function ($scope, $window, TemplateService, NavigationService, $timeout, base64, $stateParams, $state, toastr, $uibModal) {
        //Used to name the .html file
        $scope.template = TemplateService.changecontent("sbc-approval", $state);
        $scope.menutitle = NavigationService.makeactive("Approvals");
        TemplateService.title = $scope.menutitle;
        $scope.navigation = NavigationService.getnav();
        $scope.currentPage = $stateParams.page;
        var i = 0;
        $scope.getLoginEmployee = $.jStorage.get("getLoginEmployee");
        $scope.employee = $scope.getLoginEmployee._id;
        $scope.getAll = function (data) {
            console.log(data);
            $scope.approvalType = data.value;
            $scope.showAll();
        }
        $scope.search = {
            keyword: ""
        };
        if ($stateParams.keyword) {
            $scope.search.keyword = $stateParams.keyword;
        }
        $scope.approvalType = "sbc";
        $scope.showAll = function (keywordChange) {
            $scope.totalItems = undefined;
            if (keywordChange) {
                $scope.currentPage = 1;
            }
            NavigationService.getSurveyorApprovalList({
                page: $scope.currentPage,
                name: $scope.search.keyword,
            }, ++i, function (data, ini) {
                if (ini == i) {
                    $scope.sbcList = data.data.results;
                    $scope.totalItems = data.data.total;
                    $scope.maxRow = data.data.options.count;
                }
            });
        };

        // 
        $scope.viewInvoice = function (invoice, assignment) {
            $state.go("editInvoice", {
                "invoiceId": invoice,
                "assignmentId": assignment._id
            });
        }

        // 
        $scope.cancel = function () {
            $window.history.back();
        };
        $scope.changePage = function (page) {
            console.log("Page", page);
            var goTo = "sbcApproval-list";
            if ($scope.search.keyword) {
                goTo = "sbcApproval-list";
            }
            $state.go(goTo, {
                page: page,
                keyword: $scope.search.keyword
            });
        };
        $scope.showAll();
        $scope.saveAssignment = function (obj) {
            console.log("Approval", obj);
            NavigationService.saveAssignmentTemplate(obj, function (data) {
                console.log("Done", data);
                $scope.showAll();
            });
        };
        // $scope.someDate = moment().subtract(24, "hours").toDate();
        $scope.getDelayClass = function (val) {
            var retClass = "";
            var hours = moment().diff(moment(val), "hours");
            retClass = TemplateService.getDelayClass(hours);
            return retClass;
        };

        $scope.viewTemplates = function (temp, getApi, data) {
            $scope.allTemplate = temp;
            $scope.api = getApi;
            console.log("$scope.api", $scope.api);
            console.log("In Else");
            $state.go("template-view", {
                "assignmentTemplate": data._id,
                "type": getApi,
                "approval": true
            });
        };
        $scope.saveOnTimeline = function () {
            NavigationService.saveChat($scope.timeline, function (data) {
                console.log("FFFFF", data);
            });
        }
        $scope.acceptSbc = function (assignment) {
            TemplateService.getToastr();
            $scope.assignment = {
                _id: assignment._id,
                getAllTaskStatus: assignment.getAllTaskStatus,
                survey: assignment.survey
            };
            var wholeObj = {
                assignment: $scope.assignment,
                employee: $scope.employee
            }
            NavigationService.sbcApproval(wholeObj, function (data) {
                if (data.value) {
                    toastr.success(assignment.survey.employee.name + " assigned for " + assignment.name, "Surveyor Approved");
                    $state.reload();
                } else {
                    toastr.clear();
                    toastr.err("Unable to Approve");
                }
            });
        };
        $scope.surveyorFilter = function (assignment) {
            $scope.assignment = assignment;
            $scope.survey = assignment.survey._id;
            console.log("surveyorFilter", $scope.assignment, $scope.survey);
            var modalInstance = $uibModal.open({
                scope: $scope,
                templateUrl: '/frontend/views/modal/surveyor-filter.html',
                size: 'md'
            });
        };
        $scope.changeSurveyor = function (data) {
            var formData = {};
            formData.employee = data.employee;
            formData.surveyId = $scope.survey;
            formData.assignId = $scope.assignment._id;
            NavigationService.updateNewSurveyor(formData, function (data) {
                console.log("Data................", data);
                $scope.showAll();
            });
        };
        $scope.surveyor = {};
        $scope.removeSurveyor = function (data) {
            $scope.surveyor = data;
            console.log("surveyor data : ", data);
            var modalInstance = $uibModal.open({
                scope: $scope,
                templateUrl: '/frontend/views/modal/conf-delete.html',
                size: 'md'
            });
        };

        $scope.close = function (data) {
            if (data == true) {
                var formData = {};
                formData.surveyId = $scope.surveyor.survey._id;
                formData.assignId = $scope.surveyor._id;
                var surveyorName = $scope.surveyor.survey.employee.name;
                var wholeObj = {
                    formData: formData,
                    surveyorName: surveyorName,
                    employee: $scope.employee
                }
                console.log("surveyorFilter", formData);
                NavigationService.removeSurveyor(wholeObj, function (data) {
                    if (data.value) {
                        toastr.success("Surveyor " + surveyorName + " Rejected");
                    } else {
                        toastr.error("error while rejecting surveyor " + surveyorName);
                    }
                    $scope.showAll();
                });
            } else {
                $scope.showAll();
            }
        };


    })
    .controller('AssignmentApprovalsCtrl', function ($scope, $window, TemplateService, NavigationService, $timeout, base64, $stateParams, $state, toastr, $uibModal) {
        //Used to name the .html file
        $scope.template = TemplateService.changecontent("assignment-approval", $state);
        $scope.menutitle = NavigationService.makeactive("Approvals");
        TemplateService.title = $scope.menutitle;
        $scope.navigation = NavigationService.getnav();
        $scope.currentPage = $stateParams.page;
        var i = 0;
        $scope.getLoginEmployee = $.jStorage.get("getLoginEmployee");
        $scope.employee = $scope.getLoginEmployee._id;
        // NavigationService.getLoginEmployee($.jStorage.get("profile").email, function (data) {
        //     $scope.employee = data.data._id;
        //     console.log("In $scope.ownersId", $scope.employee);
        // });
        $scope.getAll = function (data) {
            console.log(data);
            $scope.approvalType = data.value;
            $scope.showAll();
        }
        $scope.search = {
            keyword: ""
        };
        if ($stateParams.keyword) {
            $scope.search.keyword = $stateParams.keyword;
        }
        $scope.approvalType = "sbc";
        $scope.showAll = function (keywordChange) {
            $scope.employee = $.jStorage.get("getLoginEmployee");
            $scope.totalItems = undefined;
            if (keywordChange) {
                $scope.currentPage = 1;
            }
            NavigationService.getAssignmentApprovalList({
                page: $scope.currentPage,
                keyword: $scope.search.keyword,
                employee: $scope.employee._id
            }, ++i, function (data, ini) {
                if (ini == i) {
                    var array = [];
                    _.each(data.data.results, function (n) {
                        if (n.assignmentapprovalStatus == "Pending ForceClosed") {
                            n.newStatus = "Force-Close";
                            n.newTime = n.forceClosedReqTime;
                        }
                        if (n.assignmentapprovalStatus == "Pending ReOpened") {
                            n.newStatus = "ReOpen";
                            n.newTime = n.reopenReqTime;
                            n.reason = n.reopenComment;
                        }
                        if (n.assignmentapprovalStatus == "Pending OnHold") {
                            n.newStatus = "OnHold";
                            n.newTime = n.onholdReqTime;
                            n.reason = n.onholdComment;
                        }
                        if (n.assignmentapprovalStatus == "Request AccessButton") {
                            n.newStatus = "Waiver(s)";
                            n.newTime = n.waiverReqTime;
                        }
                    });
                    $scope.modelList = data.data.results;
                    $scope.totalItems = data.data.total;
                    $scope.maxRow = data.data.options.count;
                }
            });
        };

        // 
        $scope.viewInvoice = function (invoice, assignment) {
            $state.go("editInvoice", {
                "invoiceId": invoice,
                "assignmentId": assignment._id
            });
        }

        // 
        $scope.cancel = function () {
            $window.history.back();
        };
        $scope.changePage = function (page) {
            console.log("Page", page);
            var goTo = "assignmentApproval-list";
            if ($scope.search.keyword) {
                goTo = "assignmentApproval-list";
            }
            $state.go(goTo, {
                page: page,
                keyword: $scope.search.keyword
            });
        };
        $scope.showAll();
        $scope.saveAssignment = function (obj) {
            console.log("Approval", obj);
            NavigationService.saveAssignmentTemplate(obj, function (data) {
                console.log("Done", data);
                $scope.showAll();
            });
        };
        // $scope.someDate = moment().subtract(24, "hours").toDate();
        $scope.getDelayClass = function (val) {
            var retClass = "";
            var hours = moment().diff(moment(val), "hours");
            retClass = TemplateService.getDelayClass(hours);
            return retClass;
        };

        $scope.viewTemplates = function (temp, getApi, data) {
            $scope.allTemplate = temp;
            $scope.api = getApi;
            console.log("$scope.api", $scope.api);
            console.log("In Else");
            $state.go("template-view", {
                "assignmentTemplate": data._id,
                "type": getApi,
                "approval": true
            });
        };
        $scope.updateTimelineChat = function (timeline, success) {
            NavigationService.updateTimeline(timeline, function (data) {
                if (data.value) {
                    toastr.clear();
                    toastr.success(success[0], success[1]);
                    $scope.showAll();
                } else {
                    toastr.clear();
                    toastr.error("There was an error while updating Timeline.", "Error Updating Timeline");
                }
            });
        }
        $scope.saveOnTimeline = function () {
            NavigationService.saveChat($scope.timeline, function (data) {
                console.log("FFFFF", data);
            });
        }
        $scope.acceptForceClosed = function (assignment) {
            $scope.assignment = assignment;
            var timeline = {};
            if ($scope.assignment.assignmentapprovalStatus == "Pending ForceClosed") {
                $scope.assignment.prevtimelineStatus = $scope.assignment.timelineStatus;
                $scope.assignment.getAllTaskStatus.forceClosed = "Done";
                $scope.assignment.forceClosedRespTime = Date.now();
                $scope.assignment.assignmentapprovalStatus = "ForceClosed";
                timeline.title = "Assignment " + $scope.assignment.name + " ForceClosed";
            } else if ($scope.assignment.assignmentapprovalStatus == "Pending ReOpened") {
                $scope.assignment.prevtimelineStatus = $scope.assignment.timelineStatus;
                $scope.assignment.getAllTaskStatus.ReOpened = "Done";
                $scope.assignment.reopenRespTime = Date.now();
                $scope.assignment.assignmentapprovalStatus = "ReOpened";
                timeline.title = "Assignment " + $scope.assignment.name + " ReOpened";
            } else if ($scope.assignment.assignmentapprovalStatus == "Pending OnHold") {
                $scope.assignment.prevtimelineStatus = $scope.assignment.timelineStatus;
                $scope.assignment.getAllTaskStatus.OnHold = "Done";
                $scope.assignment.timelineStatus = "OnHold";
                $scope.assignment.onholdRespTime = Date.now();
                $scope.assignment.assignmentapprovalStatus = "OnHold";
                timeline.title = "Assignment " + $scope.assignment.name + " OnHold";
            }

            timeline.type = "Normal";
            timeline.employee = $scope.employee._id;
            if (_.isEmpty($scope.assignment.sentBy)) {
                delete($scope.assignment.sentBy)
            };
            var finalData = {};
            finalData.assignment = $scope.assignment;
            finalData.timeline = timeline;
            NavigationService.changeAssignmentApprovalStatus(finalData, function (data) {
                if (data.value === true) {
                    $state.reload();
                    toastr.success("Assignment " + $scope.assignment.name + " " + $scope.assignment.assignmentapprovalStatus + " Successfully");
                } else {
                    toastr.error("Error in updating " + $scope.assignment.name + ".", "Assignment " + $scope.assignment.name);
                }
            });
        };

        $scope.rejectAssignmentApproval = function (assignment) {
            $scope.assignment = assignment;
            var timeline = {};
            if ($scope.assignment.assignmentapprovalStatus == "Pending ForceClosed") {
                $scope.assignment.prevtimelineStatus = "";
                $scope.assignment.getAllTaskStatus.forceClosed = "Not Done";
                $scope.assignment.forceClosedCancelledTime = Date.now();
                $scope.assignment.assignmentapprovalStatus = "Cancelled ForceClosed";
                timeline.title = "Assignment " + $scope.assignment.name + " ForceClosed Cancelled";
            } else if ($scope.assignment.assignmentapprovalStatus == "Pending ReOpened") {
                $scope.assignment.prevtimelineStatus = "";
                $scope.assignment.getAllTaskStatus.ReOpened = "Not Done";
                $scope.assignment.reopenCancelledTime = Date.now();
                $scope.assignment.assignmentapprovalStatus = "Cancelled ReOpened";
                timeline.title = "Assignment " + $scope.assignment.name + " ReOpened Cancelled";
            } else if ($scope.assignment.assignmentapprovalStatus == "Pending OnHold") {
                $scope.assignment.prevtimelineStatus = "";
                $scope.assignment.getAllTaskStatus.OnHold = "Not Done";
                $scope.assignment.onholdCancelledTime = Date.now();
                $scope.assignment.assignmentapprovalStatus = "Cancelled OnHold";
                timeline.title = "Assignment " + $scope.assignment.name + " OnHold Cancelled";
            }

            timeline.type = "Normal";
            timeline.employee = $scope.employee._id;
            if ($scope.assignment.sentBy !== undefined) {
                if (_.isEmpty($scope.assignment.sentBy)) {
                    delete($scope.assignment.sentBy)
                }
            };
            var finalData = {};
            finalData.assignment = $scope.assignment;
            finalData.timeline = timeline;
            NavigationService.changeAssignmentApprovalStatus(finalData, function (data) {
                if (data.value === true) {
                    $state.reload();
                    toastr.success("Assignment " + $scope.assignment.name + " " + $scope.assignment.assignmentapprovalStatus + " Successfully");
                } else {
                    toastr.error("Error in updating " + $scope.assignment.name + ".", "Assignment " + $scope.assignment.name);
                }
            });
        };
        $scope.rejectApproval = function (assignment) {
            $scope.assignment = assignment;
            $scope.assignment.ilaAccessReq = $scope.assignment.ilaAccess,
                $scope.assignment.lorAccessReq = $scope.assignment.lorAccess,
                $scope.assignment.surveyAccessReq = $scope.assignment.surveyAccess,
                $scope.assignment.assessmentAccessReq = $scope.assignment.assessmentAccess,
                $scope.assignment.consentAccessReq = $scope.assignment.consentAccess,
                $scope.assignment.fsrAccessReq = $scope.assignment.fsrAccess,
                console.log("Done", assignment);
            var timelineObj = {
                employee: $.jStorage.get("getLoginEmployee")._id,
                type: "Normal",
                title: ""
            }
            $scope.assignment.forceClosedComment = "";
            timelineTitle = [];
            timelineObj.title = "Rejected : " + $scope.assignment.reason;
            timelineTitle.push(timelineObj)
            var wholeObj = {
                timelineData: timelineTitle,
                assignment: $scope.assignment,
                employee: $.jStorage.get("getLoginEmployee")
            }
            NavigationService.submitApprovalForAccessButtons(wholeObj, function (data) {
                if (data.value == true) {
                    toastr.clear();
                    toastr.success("For " + $scope.assignment.name, "Waivers Rejected");
                    $state.reload();
                    $scope.forceClosedCommentArr = [];
                } else {
                    toastr.error("Error In Rejection");
                }
            });
        };
        $scope.getWaiverStatus = function (assignment) {
            $scope.assignment = assignment;
            $scope.forceClosedCommentArr = [];
            $scope.assignment.forceClosedComment = $scope.assignment.reason;
            var forceClosedComment = _.split($scope.assignment.forceClosedComment, "&");
            _.each(forceClosedComment, function (n, key) {
                n = _.trim(n);
                if (_.endsWith(n, "Compulsory")) {
                    var newString = _.replace(n, " Compulsory", "");
                    var CompulsoryObj = _.split(newString, ",");
                    _.each(CompulsoryObj, function (m, key) {
                        var obj = _.trim(m);
                        obj = obj + " Compulsory";
                        $scope.forceClosedCommentArr.push(obj);
                    });
                } else if (_.endsWith(n, "Waive")) {
                    var newString = _.replace(n, " Waive", "");
                    var WaiveObj = _.split(newString, ",");
                    _.each(WaiveObj, function (m, key) {
                        var obj = _.trim(m);
                        obj = obj + " Waive";
                        $scope.forceClosedCommentArr.push(obj);
                    });
                }
            });
            $scope.submitApprovalForAccessButtons();
        };
        $scope.submitApprovalForAccessButtons = function () {
            var timelineData = [];
            var timelineTitle = [];
            var timelineObj = {
                employee: $.jStorage.get("getLoginEmployee")._id,
                type: "Normal",
                title: ""
            }
            $scope.assignment.fsrAccess = $scope.assignment.fsrAccessReq;
            if ($scope.assignment.fsrAccess) {
                if ($scope.assignment.getAllTaskStatus.fsr !== "Done") {
                    $scope.assignment.getAllTaskStatus.fsr = "Not Done";
                }
            } else if ($scope.assignment.fsrAccess !== undefined) {
                if ($scope.assignment.getAllTaskStatus.fsr !== "Done") {
                    $scope.assignment.getAllTaskStatus.fsr = "Waived";
                }
            }
            $scope.assignment.consentAccess = $scope.assignment.consentAccessReq;
            if ($scope.assignment.consentAccess) {
                if ($scope.assignment.getAllTaskStatus.consent !== "Done") {
                    $scope.assignment.getAllTaskStatus.consent = "Not Done";
                }
            } else if ($scope.assignment.consentAccess !== undefined) {
                if ($scope.assignment.getAllTaskStatus.consent !== "Done") {
                    $scope.assignment.getAllTaskStatus.consent = "Waived";
                }
            }
            $scope.assignment.assessmentAccess = $scope.assignment.assessmentAccessReq;
            if ($scope.assignment.assessmentAccess) {
                if ($scope.assignment.getAllTaskStatus.assessment !== "Done") {
                    $scope.assignment.getAllTaskStatus.assessment = "Not Done";
                }
            } else if ($scope.assignment.assessmentAccess !== undefined) {
                if ($scope.assignment.getAllTaskStatus.assessment !== "Done") {
                    $scope.assignment.getAllTaskStatus.assessment = "Waived";
                }
            }
            $scope.assignment.lorAccess = $scope.assignment.lorAccessReq;
            if ($scope.assignment.lorAccess) {
                if ($scope.assignment.getAllTaskStatus.lor !== "Done") {
                    $scope.assignment.getAllTaskStatus.lor = "Not Done";
                    $scope.assignment.getAllTaskStatus.docs = "Not Done";
                }
            } else if ($scope.assignment.lorAccess !== undefined) {
                if ($scope.assignment.getAllTaskStatus.lor !== "Done") {
                    $scope.assignment.getAllTaskStatus.lor = "Waived";
                    $scope.assignment.getAllTaskStatus.docs = "Waived";
                }
            }
            $scope.assignment.ilaAccess = $scope.assignment.ilaAccessReq;
            if ($scope.assignment.ilaAccess) {
                if ($scope.assignment.getAllTaskStatus.ila !== "Done") {
                    $scope.assignment.getAllTaskStatus.ila = "Not Done";
                }
            } else if ($scope.assignment.ilaAccess !== undefined) {
                if ($scope.assignment.getAllTaskStatus.ila !== "Done") {
                    $scope.assignment.getAllTaskStatus.ila = "Waived";
                }
            }
            $scope.assignment.surveyAccess = $scope.assignment.surveyAccessReq;
            if ($scope.assignment.surveyAccess) {
                if ($scope.assignment.getAllTaskStatus.survey !== "Done") {
                    $scope.assignment.getAllTaskStatus.surveyAssigned = "Not Done";
                    $scope.assignment.getAllTaskStatus.survey = "Not Done";
                }
            } else if ($scope.assignment.surveyAccess !== undefined) {
                if ($scope.assignment.getAllTaskStatus.survey !== "Done") {
                    $scope.assignment.getAllTaskStatus.surveyAssigned = "Waived";
                    $scope.assignment.getAllTaskStatus.survey = "Waived";
                }
            }
            console.log("$scope.forceClosedCommentArr", $scope.forceClosedCommentArr);
            _.each($scope.forceClosedCommentArr, function (n, key) {
                if (_.endsWith(n, "Compulsory")) {
                    var newString = _.split(n, " ");
                    timelineTitle.push(newString[0]);
                }
            });
            _.each(timelineTitle, function (n, key) {
                if (key == 0) {
                    timelineObj.title = n;
                } else {
                    timelineObj.title = timelineObj.title + ", " + n;
                }
            });
            if (timelineTitle.length != 0) {
                timelineObj.title = timelineObj.title + " Compulsory"
            }
            timelineTitle = [];
            console.log("timelineData", timelineData);
            _.each($scope.forceClosedCommentArr, function (n, key) {
                console.log("1", n);
                if (_.endsWith(n, "Waive")) {
                    var newString = _.split(n, " ");
                    console.log("newString[0]-->", newString[0]);
                    timelineTitle.push(newString[0]);
                    console.log("timelineTitle", timelineTitle);
                }
            });
            console.log("timelineTitle", timelineTitle);
            _.each(timelineTitle, function (n, key) {
                if (key == 0) {
                    if (timelineObj.title == "") {
                        timelineObj.title = n;
                    } else {
                        timelineObj.title = timelineObj.title + " & " + n;
                    }
                } else {
                    timelineObj.title = timelineObj.title + ", " + n;
                }
            });
            if (timelineTitle.length != 0) {
                timelineObj.title = timelineObj.title + " Waived "
            }
            if (timelineObj.title == "") {
                toastr.error("Nothing to approve");
            } else {
                $scope.assignment.forceClosedComment = "";
                timelineTitle = [];
                timelineObj.title = "Approved : " + timelineObj.title;
                timelineTitle.push(timelineObj)
                var wholeObj = {
                    timelineData: timelineTitle,
                    assignment: $scope.assignment,
                    employee: $.jStorage.get("getLoginEmployee")
                }
                NavigationService.submitApprovalForAccessButtons(wholeObj, function (data) {
                    if (data.value == true) {
                        toastr.success("For " + $scope.assignment.name, "Waivers Approved");
                        $state.reload();
                        $scope.forceClosedCommentArr = [];
                    } else {
                        toastr.error("Error In Approval")
                    }
                });
            }
        };

    })

    .controller('ReOpenApprovalApprovalsCtrl', function ($scope, $window, TemplateService, NavigationService, $timeout, base64, $stateParams, $state, toastr, $uibModal) {
        //Used to name the .html file
        $scope.template = TemplateService.changecontent("reopen-approval");
        $scope.menutitle = NavigationService.makeactive("Approvals");
        TemplateService.title = $scope.menutitle;
        $scope.navigation = NavigationService.getnav();
        $scope.currentPage = $stateParams.page;
        var i = 0;
        $scope.getLoginEmployee = $.jStorage.get("getLoginEmployee");
        $scope.employee = $scope.getLoginEmployee._id;
        // NavigationService.getLoginEmployee($.jStorage.get("profile").email, function (data) {
        //     $scope.employee = data.data._id;
        //     console.log("In $scope.ownersId", $scope.employee);
        // });
        $scope.getAll = function (data) {
            console.log(data);
            $scope.approvalType = data.value;
            $scope.showAll();
        }
        $scope.search = {
            keyword: ""
        };
        if ($stateParams.keyword) {
            $scope.search.keyword = $stateParams.keyword;
        }
        $scope.approvalType = "sbc";
        $scope.showAll = function (keywordChange) {
            TemplateService.getLoader();
            $scope.totalItems = undefined;
            if (keywordChange) {
                $scope.currentPage = 1;
            }
            NavigationService.searchModel("assignment", {
                page: $scope.currentPage,
                keyword: $scope.search.keyword,
                filter: {
                    assignmentapprovalStatus: "Pending ReOpened"
                }
            }, ++i, function (data, ini) {
                if (ini == i) {
                    $scope.modelList = data.data.results;
                    $scope.totalItems = data.data.total;
                    $scope.maxRow = data.data.options.count;
                    console.log("modelListSearchmodel", $scope.modelList);
                    TemplateService.removeLoader();
                }
            });
        };

        // 
        $scope.viewInvoice = function (invoice, assignment) {
            $state.go("editInvoice", {
                "invoiceId": invoice,
                "assignmentId": assignment._id
            });
        }

        // 
        $scope.cancel = function () {
            $window.history.back();
        };
        $scope.changePage = function (page) {
            console.log("Page", page);
            var goTo = "lorApproval-list";
            if ($scope.search.keyword) {
                goTo = "lorApproval-list";
            }
            $state.go(goTo, {
                page: page,
                keyword: $scope.search.keyword
            });
        };
        $scope.showAll();
        $scope.saveAssignment = function (obj) {
            console.log("Approval", obj);
            NavigationService.saveAssignmentTemplate(obj, function (data) {
                console.log("Done", data);
                $scope.showAll();
            });
        };
        // $scope.someDate = moment().subtract(24, "hours").toDate();
        $scope.getDelayClass = function (val) {
            var retClass = "";
            var hours = moment().diff(moment(val), "hours");
            retClass = TemplateService.getDelayClass(hours);
            return retClass;
        };

        $scope.viewTemplates = function (temp, getApi, data) {
            $scope.allTemplate = temp;
            $scope.api = getApi;
            console.log("$scope.api", $scope.api);
            console.log("In Else");
            $state.go("template-view", {
                "assignmentTemplate": data._id,
                "type": getApi,
                "approval": true
            });
        };
        $scope.saveOnTimeline = function () {
            NavigationService.saveChat($scope.timeline, function (data) {
                console.log("FFFFF", data);
            });
        }
        $scope.acceptReOpen = function (assignment) {
            console.log("ASSIGNMENT.....", assignment);
            $scope.assignment = assignment;
            NavigationService.getOneModel("Timeline", $scope.assignment.timeline[0], function (data) {
                $scope.timeline = data.data;
                var a = {};
                a.title = "Assignment " + $scope.assignment.name + " ReOpen";
                a.type = "Normal",
                    a.employee = $scope.employee,
                    $scope.timeline.chat.push(a);
                $scope.saveOnTimeline();
                formData = {};
                formData._id = assignment._id;
                formData.timelineStatus = "Reopened";
                formData.reopenRespTime = Date.now();
                formData.assignmentapprovalStatus = "ReOpened";
                NavigationService.modelSave("Assignment", formData, function (data) {
                    if (data.value == true) {
                        $scope.showAll();
                    }
                })
            });
        };

    })
    .controller('ForbiddenCtrl', function ($scope, $window, TemplateService, NavigationService, $timeout, $stateParams, $state, toastr) {
        //Used to name the .html file
        $scope.template = TemplateService.changecontent("forbidden");
        $scope.menutitle = NavigationService.makeactive("Access Forbidden");
        TemplateService.title = $scope.menutitle;
        $scope.navigation = NavigationService.getnav();

    })

    .controller('AccordionLORCtrl', function ($scope, $window, TemplateService, NavigationService, $timeout, $stateParams, $state, toastr) {
        //Used to name the .html file
        $scope.template = TemplateService.changecontent("accordion-lor");
        $scope.menutitle = NavigationService.makeactive("LOR");
        TemplateService.title = $scope.menutitle;
        $scope.navigation = NavigationService.getnav();

        $scope.isDateNeeded = false;
        $scope.isTypeNeeded = false;

        $scope.lorCategory = [{
            name: "Category 1",
            subCategory: [{
                isCheck: true,
                name: "Sub Category1",
                date: "",
                type: ""
            }, {
                isCheck: true,
                name: "Sub Category2",
                date: "",
                type: ""
            }, {
                isCheck: true,
                name: "Sub Category3",
                date: "",
                type: ""
            }, {
                isCheck: true,
                name: "Sub Category4",
                date: "",
                type: ""
            }, {
                isCheck: true,
                name: "Sub Category5",
                date: "",
                type: ""
            }],
        }, {
            name: "Category 2",
            subCategory: [{
                isCheck: true,
                name: "Sub Category1",
                date: "",
                type: ""
            }, {
                isCheck: true,
                name: "Sub Category2",
                date: "",
                type: ""
            }, {
                isCheck: true,
                name: "Sub Category3",
                date: "",
                type: ""
            }, {
                isCheck: true,
                name: "Sub Category4",
                date: "",
                type: ""
            }, {
                isCheck: true,
                name: "Sub Category5",
                date: "",
                type: ""
            }],
        }, {
            name: "Category 3",
            subCategory: [{
                isCheck: true,
                name: "Sub Category1",
                date: "",
                type: ""
            }, {
                isCheck: true,
                name: "Sub Category2",
                date: "",
                type: ""
            }, {
                isCheck: true,
                name: "Sub Category3",
                date: "",
                type: ""
            }, {
                isCheck: true,
                name: "Sub Category4",
                date: "",
                type: ""
            }, {
                isCheck: true,
                name: "Sub Category5",
                date: "",
                type: ""
            }],
        }, {
            name: "Category 4",
            subCategory: [{
                isCheck: true,
                name: "Sub Category1",
                date: "",
                type: ""
            }, {
                isCheck: true,
                name: "Sub Category2",
                date: "",
                type: ""
            }, {
                isCheck: true,
                name: "Sub Category3",
                date: "",
                type: ""
            }, {
                isCheck: true,
                name: "Sub Category4",
                date: "",
                type: ""
            }, {
                isCheck: true,
                name: "Sub Category5",
                date: "",
                type: ""
            }],
        }, {
            name: "Category 5",
            subCategory: [{
                isCheck: true,
                name: "Sub Category1",
                date: "",
                type: ""
            }, {
                isCheck: true,
                name: "Sub Category2",
                date: "",
                type: ""
            }, {
                isCheck: true,
                name: "Sub Category3",
                date: "",
                type: ""
            }, {
                isCheck: true,
                name: "Sub Category4",
                date: "",
                type: ""
            }, {
                isCheck: true,
                name: "Sub Category5",
                date: "",
                type: ""
            }],
        }]

    });