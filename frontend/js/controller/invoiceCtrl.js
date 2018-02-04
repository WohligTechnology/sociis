firstapp.controller('InvoiceViewCtrl', function ($scope, $window, hotkeys, TemplateService, NavigationService, $timeout, $state, $stateParams, toastr) {
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
    if ($scope.template) {
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
            $state.go("invoice-list", {
                page: page,
            });
        };

        $scope.showAll = function (keywordChange) {
            $scope.totalItems = undefined;
            if (keywordChange) {
                $scope.currentPage = 1;
            }
            NavigationService.searchInvoice({
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
        $scope.changeStatus = function (ind) {
            NavigationService.modelSave($scope.ModelApi, ind, function (data) {
                if (data.value === true) {}
            });
        };
    }

});
firstapp.controller('CreateInvoiceCtrl', function ($scope, $window, TemplateService, NavigationService, $timeout, $stateParams, $state, toastr) {
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
    $scope.formData.shop = "59e76bbb79de0910f7d45daf";
    $scope.formData.owner = "58996fb21d8a3a0fc6ea7820";
    $scope.formData.employee = $scope.getLoginEmployee._id;
    $scope.formData.invoiceList = [{}];
    $scope.addHead = function () {
        $scope.formData.invoiceList.push({});
    };
    /* To assign values after selecting a particular UI Select */
    $scope.getAll = function (invoice, $index) {
        $scope.formData.invoiceList[$index].itemId = invoice._id;
        $scope.formData.invoiceList[$index].name = invoice.name;
        $scope.formData.invoiceList[$index].description = invoice.description;
        $scope.formData.invoiceList[$index].unit = invoice.unit;
        $scope.formData.invoiceList[$index].rate = invoice.rate;
        $scope.formData.invoiceList[$index].type = invoice.type;
        if ($scope.formData.invoiceList[$index].quantity) {
            $scope.calAmt($scope.formData.invoiceList[$index].rate, $scope.formData.invoiceList[$index].quantity, $index);
        } else {
            $scope.calAmt($scope.formData.invoiceList[$index].rate, 0, $index);
        }
    };
    /* To Calculate Amount  a=rate b= quantity index = $index of that invoiceList*/
    $scope.calAmt = function (a, b, index) {
        $scope.formData.total = 0;
        $scope.formData.grandTotal = 0;
        if ($scope.formData.invoiceList[index].unit == "grm") {
            $scope.formData.invoiceList[index].amount = a * b / 1000;
        } else {
            $scope.formData.invoiceList[index].amount = a * b;
        }
        $scope.disableSave = true;
        TemplateService.calAmt($scope.formData, function (err, data) {
            $scope.disableSave = false;
            $scope.formData = data;
        });
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
    };

    $scope.change = function (form, $index) {
        // $scope.formData.invoiceList[$index].name=form.name;
    };
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
    };
    $scope.calAmtAfterBilledToChange = function () {
        $scope.formData.total = 0;
        $scope.formData.grandTotal = 0;
        $scope.disableSave = true;
        TemplateService.calAmt($scope.formData, function (err, data) {
            $scope.disableSave = false;
            $scope.formData = data;
        });
    };

    $scope.calAmtOnRemove = function () {
        $scope.formData.total = 0;
        $scope.formData.grandTotal = 0;
        $scope.disableSave = true;
        TemplateService.calAmt($scope.formData, function (err, data) {
            $scope.disableSave = false;
            $scope.formData = data;
        });
    };

    $scope.createInvoice = function (data) {
        $scope.disableSave = true;
        NavigationService.createInvoice($scope.formData, function (data) {
            toastr.success("Invoice Created Successfully");
            $window.history.back();
        });
    };
    $scope.getPaymentStatus = function (status) {
        console.log("In Here");
        var newStatus = "";
        if (status == "Pending") {
            newStatus = "pending";
        } else {
            newStatus = "paid";
        }
        return newStatus;
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

});