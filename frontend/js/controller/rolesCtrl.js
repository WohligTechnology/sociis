firstapp.controller('RolessCtrl', function ($scope, $window, TemplateService, NavigationService, $timeout, $stateParams, $state, toastr) {
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
        globalfunction.confDel(function (value) {
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