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
        // $scope.navigation = NavigationService.getnav();
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
        if ($.jStorage.get("getLoginEmployee")) {

        } else {
            $state.go("login");
        }
    })

    .controller('LoginCtrl', function ($scope, $window, TemplateService, NavigationService, $timeout, $stateParams, $state, toastr) {
        //Used to name the .html file

        $scope.menutitle = NavigationService.makeactive("Login");
        TemplateService.title = $scope.menutitle;
        $scope.currentHost = window.location.origin;
        // if ($stateParams.id) {
        //     NavigationService.parseAccessToken($stateParams.id, function () {
        //         NavigationService.profile(function () {
        //             $state.go("dashboard");
        //         }, function () {
        //             $state.go("login");
        //         });
        //     });
        // } else {
        //     NavigationService.removeAccessToken();
        // }
        $scope.login = (form) => {
            NavigationService.login(form, (loginResult) => {
                console.log(loginResult);
                if (loginResult.value === true) {
                    toastr.success("LOGIN SUCCESSFULL", "SUCCESS");
                    $state.go("invoice-list");
                } else {
                    toastr.error("INVALID CREDENTIALS", "LOGIN ERROR")
                }
                // NavigationService.profile(function () {
                //     $state.go("dashboard");
                // }, function () {
                //     $state.go("login");
                // });

            });

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
                    console.log($scope.ModelApi);
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


    })



    .controller('InvoiceViewCtrl', function ($scope, $window, hotkeys, TemplateService, NavigationService, $timeout, $state, $stateParams, toastr) {
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
        $scope.showAll = function (keywordChange) {
            $scope.totalItems = undefined;
            if (keywordChange) {
                $scope.currentPage = 1;
            }
            NavigationService.searchInvoice({
                page: $scope.currentPage,
                keyword: $scope.search.keyword
            }, ++i, function (data, ini) {
                console.log(data.data);

                if (ini == i) {
                    console.log(data.data);
                    $scope.modelList = data.data.results;
                    $scope.totalItems = data.data.total;
                    $scope.maxRow = data.data.options.count;
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
        $scope.salutations = ["Employee", "Manager", "Admin"];
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

        $scope.salutations = ["Employee", "Manager", "Admin"];
        $scope.houseColors = ["Red", "Green", "Blue", "Yellow", "White"];



        $scope.dateOptions = {
            showWeeks: true
        };


        $scope.format = 'dd-MMMM-yyyy';
        $scope.modalData = {};
        $scope.modalData1 = {};
        $scope.holdObject = '';
        $scope.modalIndex = 0;

        $scope.changeDOB = function (date) {
            console.log($filter('ageFilter')(date));
        };



        NavigationService.getOneModel("Employee", $stateParams.id, function (data) {
            $scope.formData = data.data;
            $scope.formData.mobile = parseInt(data.data.mobile)


        });
        $scope.cancel = function () {
            $window.history.back();
        }

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
    .controller('CreateShopCtrl', function ($scope, hotkeys, $window, TemplateService, NavigationService, $timeout, $state, toastr) {
        //Used to name the .html file
        $scope.template = TemplateService.changecontent("shop-detail");
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
        $scope.formData.items = [];
        NavigationService.getAllItemsName({}, function (data) {
            if (data.length != 0) {
                console.log(data);
                _.each(data.data, function (n) {
                    console.log("ABCD", n);
                    var newObj = {
                        item: n._id,
                        quantity: 0
                    };
                    $scope.formData.items.push(newObj);
                });
            }
        });
        $scope.cancel = function () {
            $window.history.back();
        };
        $scope.saveModel = function (formData) {
            NavigationService.modelSave("Shop", $scope.formData, function (data) {
                if (data.value === true) {
                    $window.history.back();
                    toastr.success($scope.modelCap + $scope.formData.name + " edited successfully.", $scope.modelCap + " Edited");
                } else {
                    toastr.error($scope.modelCap + " edition failed.", $scope.modelCap + " editing error");
                }
            });
        };

    })
    .controller('EditShopCtrl', function ($scope, hotkeys, $window, TemplateService, NavigationService, $timeout, $state, $stateParams, toastr) {
        //Used to name the .html file
        $scope.template = TemplateService.changecontent("shop-detail");
        $scope.menutitle = NavigationService.makeactive("Shop");
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
        NavigationService.getOneModel("Shop", $stateParams.id, function (data) {
            $scope.formData = data.data;
        });
        $scope.cancel = function () {
            $window.history.back();
        };
        $scope.saveProduct = function (formValid) {
            NavigationService.modelSave("Shop", $scope.formData, function (data) {
                if (data.value === true) {
                    $window.history.back();
                    toastr.success($scope.modelCap + $scope.formData.name + " edited successfully.", $scope.modelCap + " Edited");
                } else {
                    toastr.error($scope.modelCap + " edition failed.", $scope.modelCap + " editing error");
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
    .controller('PaymentViewCtrl', function ($scope, $window, hotkeys, TemplateService, NavigationService, $timeout, $state, $stateParams, toastr) {
        //Used to name the .html file        
        $scope.modelCamel = _.camelCase($stateParams.model);
        var a = _.startCase($scope.modelCamel).split(" ");
        $scope.ModelApi = "";
        _.each(a, function (n) {
            $scope.ModelApi = $scope.ModelApi + n;
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
        // 
        $scope.showAll = function (keywordChange) {
            $scope.totalItems = undefined;
            if (keywordChange) {
                $scope.currentPage = 1;
            }
            NavigationService.searchPayment({
                page: $scope.currentPage,
                keyword: $scope.search.keyword
            }, ++i, function (data, ini) {
                if (ini == i) {
                    console.log(data.data);
                    $scope.modelList = data.data.results;
                    $scope.totalItems = data.data.total;
                    $scope.maxRow = data.data.options.count;
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
    })
    .controller('CreatePaymentCtrl', function ($scope, hotkeys, $window, TemplateService, NavigationService, $timeout, $state, toastr, $stateParams) {
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

        $scope.calculateCreditPending = function (data) {
            // $scope.ChangeCustomerState();
            NavigationService.getOneModel("Customer", data._id, function (data) {
                if (data.value == true) {
                    $scope.showCreditLimit = true;
                    var billedToCreditDetails = data.data;
                    $scope.creditPending = billedToCreditDetails.creditExhausted;
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
        // FOR EMPLOYEE

        $scope.formData = {};
        $scope.formData.status = true;
        $scope.cancel = function () {
            $window.history.back();
        };
        $scope.createPayment = function (data) {
            $scope.formData.customer = $scope.formData.customer._id;
            NavigationService.createPayment($scope.formData, function (data) {
                console.log("Data In Result", data);
                toastr.success("Payment Created Successfully");
                $window.history.back();
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
        $rootScope.loginData = $.jStorage.get("getLoginEmployee");
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
        $scope.formData.creditExhausted = 0;
        $scope.changePending = function () {
            $scope.formData.creditPending = $scope.formData.creditAlloted;
        };
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

        $scope.changePending = function () {
            $scope.formData.creditPending = $scope.formData.creditAlloted - $scope.formData.creditExhausted;
        };

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
        $scope.getLoginEmployee = $.jStorage.get("getLoginEmployee");
        $scope.message.employee = $scope.getLoginEmployee;
        $scope.empId = $scope.getLoginEmployee._id;
        $scope.employee = [];
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
        $scope.getAll = function (invoice, $index) {
            console.log("Invoice", invoice);
            $scope.formData.invoiceList[$index].itemId = invoice._id;
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
            console.log("create invoice inside controller data is", data)
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
        $scope.getLoginEmployee = $.jStorage.get("getLoginEmployee");
        $scope.message.employee = $scope.getLoginEmployee;
        $scope.empId = $scope.getLoginEmployee._id;
        $scope.employee = [];
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
        $scope.getLoginEmployee = $.jStorage.get("getLoginEmployee");
        $scope.message.employee = $scope.getLoginEmployee;
        $scope.empId = $scope.getLoginEmployee._id;
        $scope.employee = [];


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