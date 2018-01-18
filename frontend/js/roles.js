angular.module('rolesController', ['templateservicemod', 'navigationservice', 'assignmenttemplate', 'ui.bootstrap', 'ui.select', 'ngAnimate', 'toastr', 'ngSanitize', 'angular-flexslider', 'ui.tinymce', 'imageupload', 'ngMap', 'toggle-switch', 'cfp.hotkeys', 'ui.sortable', 'infinite-scroll', 'dragularModule'])

    .controller('RolesCtrl', function ($scope, $rootScope, $window, TemplateService, NavigationService, $timeout, base64) {
        //Used to name the .html file
        $scope.template = TemplateService.changecontent("roles");
        $scope.menutitle = NavigationService.makeactive("Roles");
        TemplateService.title = $scope.menutitle;
        $scope.navigation = NavigationService.getnav();
        $scope.formData = {
            roles: [],
            name: ""
        };
        $rootScope.$on("CallParentMethod", function (event) {
            //console.log("123"); // 'Data to send'
        });

        $scope.roles = [];

        $scope.formData.roles = getAllRoles();

        //console.log("$.jstorage", $.jStorage.get("profile"));
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
        $scope.viewAll = function (index, state) {
            _.each($scope.formData.roles[index], function (n) {
                if (n.isExist === true) {
                    n.val = state;
                }
            });
        };
        $scope.selectAll = function () {
            _.each($scope.formData.roles, function (n) {
                if (n.isExist === true) {
                    n.val = state;
                }
            });
        };
    });








function getAllRoles() {
    var retVal = [];

    var obj = {
        mainMenu: "",
        subMenu: "",
        subThirdMenu: "",
        states: [],
        view: {
            val: false,
            isExist: false
        },
        add: {
            val: false,
            isExist: false
        },
        edit: {
            val: false,
            isExist: false
        },
        delete: {
            val: false,
            isExist: false
        },
        addRequest: {
            val: false,
            isExist: false
        },
        modifyRequest: {
            val: false,
            isExist: false
        },
        approve: {
            val: false,
            isExist: false
        },
        reject: {
            val: false,
            isExist: false
        },
        viewAll: {
            val: false,
            isExist: false
        }
    };

    function addRoles(menu1, menu2, menu3, states, viewBool, addBool, editBool, deleteBool, addRequestBool, modifyRequestBool, approveBool, rejectBool, viewAllBool) {
        var o = _.cloneDeep(obj);
        o.mainMenu = menu1;
        o.subMenu = menu2;
        o.subThirdMenu = menu3;
        o.states = _.split(states, ",");
        o.view.isExist = viewBool;
        o.add.isExist = addBool;
        o.edit.isExist = editBool;
        o.delete.isExist = deleteBool;
        o.addRequest.isExist = addRequestBool;
        o.modifyRequest.isExist = modifyRequestBool;
        o.approve.isExist = approveBool;
        o.reject.isExist = rejectBool;
        o.viewAll.isExist = false;
        // $scope.formData.roles.push(o);
        retVal.push(o);
    }
    addRoles("Role", "Role", "", "role,roles-list", true, true, true, true, false, false, false, false, true);
    addRoles("Product", "Item", "", "finance,invoiceExpenditure-list", true, true, true, true, false, false, false, false, true);
    addRoles("Customer", "Customer", "", "customer,customer-list", true, true, true, true, false, false, false, false, true);
    addRoles("Employee", "Employee", "", "employee,employee-list", true, true, true, true, false, false, false, false, true);
    addRoles("Invoice", "Invoice", "", "invoice,invoice-list", true, true, true, true, false, false, false, false, true);
    addRoles("Shop", "Shop", "", "shop,shop-list", true, false, false, false, false, false, false, false, true); //Added New For FSR Waive
    addRoles("Payment", "Payment", "", "payment,payment-list", true, false, false, false, false, false, false, false, true); //View Payment
    addRoles("Marketing", "Marketing", "", "marketing,marketing-list", true, true, true, false, false, false, false, false, true); //View  Edit & Add Marketing
    return retVal;
}