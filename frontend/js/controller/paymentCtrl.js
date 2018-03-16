firstapp.controller('PaymentViewCtrl', function ($scope, $window, hotkeys, TemplateService, NavigationService, $timeout, $state, $stateParams, toastr) {
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
    $scope.changePages = function (page, filter) {
        var goTo = $scope.modelCamel + "-list";
        if ($scope.search.keyword) {
            goTo = $scope.modelCamel + "-list";
        }
        $scope.modelCamel
        console.log("goto", goTo);
        $state.go("payment-list", {
            page: page,
        });

    };
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
        globalfunction.confDel(function (value) {
            if (value) {
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
});
firstapp.controller('CreatePaymentCtrl', function ($scope, hotkeys, $window, TemplateService, NavigationService, $timeout, $state, toastr, $stateParams) {
    //Used to name the .html file

    $scope.modelCamel = _.camelCase($stateParams.model);
    var a = _.startCase($scope.modelCamel).split(" ");
    $scope.ModelApi = "";
    _.each(a, function (n) {
        $scope.ModelApi = $scope.ModelApi + n;
    });
    $scope.DisableSave = false;

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
            } else {

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
    $scope.formData.shop = "59e76bbb79de0910f7d45daf";
    $scope.formData.employee = "58996fb21d8a3a0fc6ea7820";
    $scope.formData.status = true;
    $scope.cancel = function () {
        $window.history.back();
    };
    $scope.createPayment = function (data) {
        $scope.DisableSave = true;
        $scope.formData.customer = $scope.formData.customer._id;
        NavigationService.createPayment($scope.formData, function (data) {
            toastr.success("Payment Created Successfully");
            $window.history.back();
        });
    };
});