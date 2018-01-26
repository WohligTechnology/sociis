firstapp.controller('CustomerCtrl', function ($scope, $window, TemplateService, NavigationService, $timeout, $state, $stateParams, $uibModal, toastr) {
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
        $scope.changePages = function (page, filter) {
            var goTo = $scope.modelCamel + "-list";
            if ($scope.search.keyword) {
                goTo = $scope.modelCamel + "-list";
            }
            $state.go("customer-list", {
                page: page,
            });
        };
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
        $scope.showAll();
    })
    .controller('CreateCustomerCtrl', function ($scope, hotkeys, $window, TemplateService, NavigationService, $timeout, $state, $uibModal, $stateParams, toastr, $filter) {
        //Used to name the .html file
        $scope.template = TemplateService.changecontent("customer-detail");
        $scope.menutitle = NavigationService.makeactive("Create Customer");
        TemplateService.title = $scope.menutitle;
        $scope.navigation = NavigationService.getnav();
        $scope.formData = {};
        $scope.formData.creditAlloted = 30000;
        $scope.formData.creditPending = 30000;
        $scope.formIndex = 0;
        $scope.buttonValue = "Save";
        $scope.header = {
            "name": "Create Customer"
        };
        $scope.formData.creditExhausted = 0;
        $scope.changePending = function () {
            $scope.formData.creditPending = $scope.formData.creditAlloted;
        };
        $scope.popup = {
            birthDate: false
        };
        $scope.cancel = function () {
            $window.history.back();
        };
        $scope.saveModel = function (formData) {
            NavigationService.modelSave("Customer", $scope.formData, function (data) {
                if (data.value === true) {
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
        $scope.buttonValue = "Save";
        $scope.currentPage = 1;
        $scope.header = {
            "name": "Edit Customer"
        };
        $scope.salutations = ["Mr.", "Mrs.", "Ms.", "Dr."];
        $scope.changePending = function () {
            $scope.formData.creditPending = $scope.formData.creditAlloted - $scope.formData.creditExhausted;
        };

        NavigationService.getOneModel("Customer", $stateParams.id, function (data) {
            $scope.formData = data.data;
            $scope.formData.creditPending = $scope.formData.creditAlloted - $scope.formData.creditExhausted;
        });
        var customerObject = {
            customer: $stateParams.id,
            page: $scope.currentPage
        };
        NavigationService.getCustomerProductDetailsAccordingToInvoices(customerObject, function (data) {
            $scope.invoiceProductDetails = data.data.results;
            $scope.totalItems = data.data.total;
            console.log("$scope.invoiceProductDetails", $scope.invoiceProductDetails);
        });
        $scope.changePages = function (page) {
            customerObject.page = page;
            $scope.currentPage = page;
            NavigationService.getCustomerProductDetailsAccordingToInvoices(customerObject, function (data) {
                $scope.invoiceProductDetails = data.data.results;
                $scope.totalItems = data.data.total;
            });
        };
        $scope.cancel = function () {
            $window.history.back();
        };
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
        $scope.getStatusColor = function (status) {
            var newStatus = "";
            if (status == "Pending") {
                newStatus = "Pending";
            }
            if (status == "Partial Pending") {
                newStatus = "Partial-Pending";
            }
            if (status == "Paid") {
                newStatus = "Paid";
            }
            return newStatus;
        };

    });