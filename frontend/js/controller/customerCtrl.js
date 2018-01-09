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
        $scope.currentPage = 1;
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
        var customerObject = {
            customer: $stateParams.id,
            page: $scope.currentPage
        };
        NavigationService.getCustomerProductDetailsAccordingToInvoices(customerObject, function (data) {
            $scope.invoiceProductDetails = data.data.results;
            $scope.totalItems = data.data.total;
            console.log("$scope.invoiceProductDetails", $scope.invoiceProductDetails);
        });
        $scope.changePage = function (page) {
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