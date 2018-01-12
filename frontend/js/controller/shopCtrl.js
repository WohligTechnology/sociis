firstapp.controller('CreateShopCtrl', function ($scope, hotkeys, $window, TemplateService, NavigationService, $timeout, $state, toastr) {
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
                _.each(data.data, function (n) {
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
    });