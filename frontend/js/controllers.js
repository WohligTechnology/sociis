angular.module('phonecatControllers', ['templateservicemod', 'navigationservice', 'assignmenttemplate', 'ui.bootstrap', 'ui.select', 'ngAnimate', 'toastr', 'ngSanitize', 'angular-flexslider', 'ui.tinymce', 'imageupload', 'ngMap', 'toggle-switch', 'cfp.hotkeys', 'ui.sortable', 'infinite-scroll', 'dragularModule', 'cleave.js', 'monospaced.elastic', 'ngFileUpload'])

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

        }


        $scope.processForm = function (event) {
            console.log(event)
            var element = angular.element(event.target);
            //Old Class


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
    .controller('AccessController', function ($scope, $window, TemplateService, NavigationService, $timeout, $state) {})
    .controller('LoginCtrl', function ($scope, $window, TemplateService, NavigationService, $timeout, $stateParams, $state, toastr) {
        //Used to name the .html file
        $.jStorage.flush();
        $scope.menutitle = NavigationService.makeactive("Login");
        TemplateService.title = $scope.menutitle;
        $scope.currentHost = window.location.origin;
        $scope.login = (form) => {
            NavigationService.login(form, (loginResult) => {
                if (loginResult.value === true) {
                    toastr.success("LOGIN SUCCESSFULL", "SUCCESS");
                    $state.go("invoice-list");
                } else {
                    toastr.error("INVALID CREDENTIALS", "LOGIN ERROR")
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

        $scope.changePages = function (page, filter) {
            var goTo = $scope.modelCamel + "-list";
            if ($scope.search.keyword) {
                goTo = $scope.modelCamel + "-list";
            }
            $scope.modelCamel
            console.log("goto", goTo);
            if ($scope.modelCamel == "shop") {
                $state.go("shop-list", {
                    page: page,
                });
            } else {
                $state.go("employee-list", {
                    page: page,
                });
            }

        };
        console.log("!!!!!!!!!!!!!!!!", $scope.modelCamel);
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
                            $scope.showAssignment();
                        }
                    });
                } else {
                    toastr("Error in ForceClosing Assignment " + formData.name);
                }
            });

        };
        $scope.changePages = function (page, filter) {


            var goTo = $scope.modelCamel + "-list";
            if ($scope.search.keyword) {
                goTo = $scope.modelCamel + "-list";
            }
            $state.go(goTo, {
                page: page,
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

        if ($stateParams.model === "assignment") {
            $scope.showAssignment();
        } else if ($stateParams.model === "invoice") {
            $scope.showAllInvoices();
        } else {
            $scope.showAll();
        }
        $scope.deleteModel = function (id) {
            globalfunction.confDel(function (value) {
                if (value) {
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


    });