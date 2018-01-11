firstapp.controller('CreateInvoiceExpenditureCtrl', function ($scope, hotkeys, $window, TemplateService, NavigationService, $timeout, $state, toastr, $uibModal) {
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
        NavigationService.invoiceExpenditureSave($scope.formData, function (data) {
            if (data.value === true) {
                $window.history.back();
                toastr.success("InvoiceExpenditure " + formData.name + " created successfully.", "InvoiceExpenditure Created");
            } else {
                toastr.error("InvoiceExpenditure creation failed.", "InvoiceExpenditure creation error");
            }
        });
    };

});
firstapp.controller('EditInvoiceExpenditureCtrl', function ($scope, hotkeys, $window, TemplateService, NavigationService, $timeout, $stateParams, $state, toastr, $uibModal) {
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

                toastr.success("InvoiceExpenditure " + $scope.formData.name + " edited successfully.", "InvoiceExpenditure Edited");
            } else {
                toastr.error("InvoiceExpenditure edition failed.", "InvoiceExpenditure editing error");
            }
        });
    };

});