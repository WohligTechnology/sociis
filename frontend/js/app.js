// JavaScript Document
var firstapp = angular.module('firstapp', [
    'ui.router',
    'phonecatControllers',
    "rolesController",
    'templateservicemod',
    'navigationservice',
    'pascalprecht.translate',
    'angulartics',
    'angulartics.google.analytics',
    'imageupload',
    'ngMap',
    'ab-base64',
    'textAngular',
    'angularPromiseButtons',
    'ngFileUpload'
]);

firstapp.config(function ($stateProvider, $urlRouterProvider, $httpProvider, $locationProvider, angularPromiseButtonsProvider) {
    // for http request with session
    angularPromiseButtonsProvider.extendConfig({
        spinnerTpl: '<span class="btn-spinner"></span>',
        disableBtn: true,
        btnLoadingClass: 'is-loading',
        addClassToCurrentBtnOnly: false,
        disableCurrentBtnOnly: false,
        minDuration: false,
        CLICK_EVENT: 'click',
        CLICK_ATTR: 'ngClick',
        SUBMIT_EVENT: 'submit',
        SUBMIT_ATTR: 'ngSubmit',
        BTN_SELECTOR: 'button'
    });
    $httpProvider.defaults.withCredentials = true;
    $stateProvider
        .state('dashboard', {
            url: "/dashboard",
            templateUrl: "frontend/views/template.html",
            controller: 'DashboardCtrl'
        })
        .state('create-roles', {
            url: "/roles",
            templateUrl: "frontend/views/template.html",
            controller: 'RolesCtrl'
        })
        .state('edit-roles', {
            url: "/Role-edit/:id",
            templateUrl: "frontend/views/template.html",
            controller: 'RoleEditCtrl'
        })
        .state('roles-list', {
            url: "/roles-list/{page:.*}/{keyword:.*}",
            templateUrl: "frontend/views/template.html",
            controller: 'RolessCtrl',
            params: {
                page: "1",
                keyword: ""
            }
        })

        .state('login', {
            url: "/login",
            templateUrl: "frontend/views/login.html",
            controller: 'LoginCtrl'
        })

        .state('loginapp', {
            url: "/login/:id",
            templateUrl: "frontend/views/login.html",
            controller: 'LoginCtrl'
        })

        .state('branch-list', {
            url: "/branch-list/{page:.*}/{keyword:.*}",
            templateUrl: "frontend/views/template.html",
            controller: 'BranchListCtrl',
            params: {
                page: "1",
                keyword: ""
            }
        })

        .state('branch-create', {
            url: "/branch-create",
            templateUrl: "frontend/views/template.html",
            controller: 'BranchCreateCtrl'
        })

        .state('branch-edit', {
            url: "/branch-edit/:id",
            templateUrl: "frontend/views/template.html",
            controller: 'BranchEditCtrl'
        })

        .state('country-list', {
            url: "/country-list/{page:.*}/{keyword:.*}",
            templateUrl: "frontend/views/template.html",
            controller: 'CountryCtrl',
            params: {
                page: "1",
                keyword: ""
            }
        })

        .state('createcountry', {
            url: "/country-create",
            templateUrl: "frontend/views/template.html",
            controller: 'CreateCountryCtrl'
        })

        .state('editcountry', {
            url: "/country-edit/:id",
            templateUrl: "frontend/views/template.html",
            controller: 'EditCountryCtrl'
        })

        .state('zone-list', {
            url: "/zone-list/{page:.*}/{keyword:.*}",
            templateUrl: "frontend/views/template.html",
            controller: 'ZoneCtrl',
            params: {
                page: "1",
                keyword: ""
            }
        })

        .state('createzone', {
            url: "/zone-create",
            templateUrl: "frontend/views/template.html",
            controller: 'CreateZoneCtrl'
        })

        .state('editzone', {
            url: "/zone-edit/:id",
            templateUrl: "frontend/views/template.html",
            controller: 'EditZoneCtrl'
        })

        .state('state-list', {
            url: "/state-list/{page:.*}/{keyword:.*}",
            templateUrl: "frontend/views/template.html",
            controller: 'StateCtrl',
            params: {
                page: "1",
                keyword: ""
            }
        })

        .state('createstate', {
            url: "/state-create",
            templateUrl: "frontend/views/template.html",
            controller: 'CreateStateCtrl'
        })

        .state('editstate', {
            url: "/state-edit/:id",
            templateUrl: "frontend/views/template.html",
            controller: 'EditStateCtrl'
        })

        .state('district-list', {
            url: "/district-list/{page:.*}/{keyword:.*}",
            templateUrl: "frontend/views/template.html",
            controller: 'DistrictCtrl',
            params: {
                page: "1",
                keyword: ""
            }
        })

        .state('createdistrict', {
            url: "/district-create",
            templateUrl: "frontend/views/template.html",
            controller: 'CreateDistrictCtrl'
        })

        .state('editdistrict', {
            url: "/district-edit/:id",
            templateUrl: "frontend/views/template.html",
            controller: 'EditDistrictCtrl'
        })

        .state('currency-list', {
            url: "/currencies-list/{page:.*}/{keyword:.*}/{model:.*}",
            templateUrl: "frontend/views/template.html",
            controller: 'ModelViewCtrl',
            params: {
                page: "1",
                keyword: "",
                model: "currencies"
            }
        })

        .state('createcurrency', {
            url: "/currency-create/{id:.*}/{model:.*}",
            templateUrl: "frontend/views/template.html",
            controller: 'CreateModelCtrl',
            params: {
                id: "",
                model: "currencies"
            }
        })

        .state('editcurrency', {
            url: "/currency-edit/{id:.*}/{model:.*}",
            templateUrl: "frontend/views/template.html",
            controller: 'EditModelCtrl',
            params: {
                id: "",
                model: "currencies"
            }
        })


        .state('city-list', {
            url: "/city-list/{page:.*}/{keyword:.*}",
            templateUrl: "frontend/views/template.html",
            controller: 'CityCtrl',
            params: {
                page: "1",
                keyword: ""
            }
        })

        .state('createcity', {
            url: "/city-create",
            templateUrl: "frontend/views/template.html",
            controller: 'CreateCityCtrl'
        })

        .state('editcity', {
            url: "/city-edit/:id",
            templateUrl: "frontend/views/template.html",
            controller: 'EditCityCtrl'
        })

        .state('office-list', {
            url: "/office-list/{page:.*}/{keyword:.*}",
            templateUrl: "frontend/views/template.html",
            controller: 'OfficeCtrl',
            params: {
                page: "1",
                keyword: ""
            }
        })


        .state('createoffice', {
            url: "/office-create",
            templateUrl: "frontend/views/template.html",
            controller: 'CreateOfficeCtrl'
        })

        .state('editoffice', {
            url: "/office-edit/:id",
            templateUrl: "frontend/views/template.html",
            controller: 'EditOfficeCtrl'
        })

        .state('typeOfOffice-list', {
            url: "/typeOfOffice-list/{page:.*}/{keyword:.*}",
            templateUrl: "frontend/views/template.html",
            controller: 'TypeOfOfficeCtrl',
            params: {
                page: "1",
                keyword: ""
            }
        })

        .state('createtypeOfOffice', {
            url: "/typeOfOffice-create",
            templateUrl: "frontend/views/template.html",
            controller: 'CreateTypeOfOfficeCtrl'
        })

        .state('edittypeOfOffice', {
            url: "/typeOfOffice-edit/:id",
            templateUrl: "frontend/views/template.html",
            controller: 'EditTypeOfOfficeCtrl'
        })

        .state('activityType-list', {
            url: "/activityType-list/{page:.*}/{keyword:.*}/{model:.*}",
            templateUrl: "frontend/views/template.html",
            controller: 'ModelViewCtrl',
            params: {
                page: "1",
                keyword: "",
                model: "activity type"
            }
        })

        .state('createactivityType', {
            url: "/activityType-create/{id:.*}/{model:.*}",
            templateUrl: "frontend/views/template.html",
            controller: 'CreateModelCtrl',
            params: {
                id: "",
                model: "activity type"
            }
        })

        .state('editactivityType', {
            url: "/activityType-edit/{id:.*}/{model:.*}",
            templateUrl: "frontend/views/template.html",
            controller: 'EditModelCtrl',
            params: {
                id: "",
                model: "activity type"
            }
        })

        .state('expense-list', {
            url: "/expense-list/{page:.*}/{keyword:.*}/{model:.*}",
            templateUrl: "frontend/views/template.html",
            controller: 'ModelViewCtrl',
            params: {
                page: "1",
                keyword: "",
                model: "expense"
            }
        })

        .state('createexpense', {
            url: "/expense-create/{id:.*}/{model:.*}",
            templateUrl: "frontend/views/template.html",
            controller: 'CreateModelCtrl',
            params: {
                id: "",
                model: "expense"
            }
        })

        .state('editexpense', {
            url: "/expense-edit/{id:.*}/{model:.*}",
            templateUrl: "frontend/views/template.html",
            controller: 'EditModelCtrl',
            params: {
                id: "",
                model: "expense"
            }
        })

        .state('department-list', {
            url: "/department-list/{page:.*}/{keyword:.*}/{model:.*}",
            templateUrl: "frontend/views/template.html",
            controller: 'ModelViewCtrl',
            params: {
                page: "1",
                keyword: "",
                model: "department"
            }
        })

        .state('createdepartment', {
            url: "/department-create/{id:.*}/{model:.*}",
            templateUrl: "frontend/views/template.html",
            controller: 'CreateModelCtrl',
            params: {
                id: "",
                model: "department"
            }
        })

        .state('editdepartment', {
            url: "/department-edit/{id:.*}/{model:.*}",
            templateUrl: "frontend/views/template.html",
            controller: 'EditModelCtrl',
            params: {
                id: "",
                model: "department"
            }
        })


        .state('uniqueType-list', {
            url: "/uniquetype-list/{page:.*}/{keyword:.*}",
            templateUrl: "frontend/views/template.html",
            controller: 'UniqueTypetCtrl',
            params: {
                page: "1",
                keyword: ""
            }
        })


        .state('createuniquetype', {
            url: "/uniquetype-create",
            templateUrl: "frontend/views/template.html",
            controller: 'CreateUniqueTypeCtrl'
        })

        .state('edituniquetype', {
            url: "/uniquetype-edit/:id",
            templateUrl: "frontend/views/template.html",
            controller: 'EditUniqueTypeCtrl'
        })

        .state('policyType-list', {
            url: "/policytype-list/{page:.*}/{keyword:.*}/{model:.*}",
            templateUrl: "frontend/views/template.html",
            controller: 'ModelViewCtrl',
            params: {
                page: "1",
                keyword: "",
                model: "policy type"
            }
        })

        .state('createpolicyType', {
            url: "/policytype-create/{id:.*}/{model:.*}",
            templateUrl: "frontend/views/template.html",
            controller: 'CreatePolicyTypeCtrl',
            params: {
                id: "",
                model: "policy type"
            }
        })

        .state('editpolicyType', {
            url: "/policytype-edit/{id:.*}/{model:.*}",
            templateUrl: "frontend/views/template.html",
            controller: 'EditPolicyTypeCtrl',
            params: {
                id: "",
                model: "policy type"
            }
        })

        .state('policy-list', {
            url: "/policy-list/{page:.*}/{keyword:.*}",
            templateUrl: "frontend/views/template.html",
            controller: 'PolicyCtrl',
            params: {
                page: "1",
                keyword: ""
            }
        })

        .state('createpolicy', {
            url: "/policy-create",
            templateUrl: "frontend/views/template.html",
            controller: 'CreatePolicyCtrl'
        })

        .state('editpolicy', {
            url: "/policy-edit/:id",
            templateUrl: "frontend/views/template.html",
            controller: 'EditPolicyCtrl'
        })

        .state('policyDoc-list', {
            url: "/policydoc-list/{page:.*}/{keyword:.*}/{model:.*}",
            templateUrl: "frontend/views/template.html",
            controller: 'ModelViewCtrl',
            params: {
                page: "1",
                keyword: "",
                model: "policy doc"
            }
        })

        .state('createpolicyDoc', {
            url: "/policydoc-create/{id:.*}/{model:.*}",
            templateUrl: "frontend/views/template.html",
            controller: 'CreatePolicyDocCtrl',
            params: {
                id: "",
                model: "policy doc"
            }
        })

        .state('editpolicyDoc', {
            url: "/policydoc-edit/{id:.*}/{model:.*}",
            templateUrl: "frontend/views/template.html",
            controller: 'EditPolicyDocCtrl',
            params: {
                id: "",
                model: "policy doc"
            }
        })

        .state('industry-list', {
            url: "/industry-list/{page:.*}/{keyword:.*}",
            templateUrl: "frontend/views/template.html",
            controller: 'IndustryCtrl',
            params: {
                page: "1",
                keyword: ""
            }
        })

        .state('createindustry', {
            url: "/industry-create",
            templateUrl: "frontend/views/template.html",
            controller: 'CreateIndustryCtrl'
        })

        .state('editindustry', {
            url: "/industry-edit/:id",
            templateUrl: "frontend/views/template.html",
            controller: 'EditIndustryCtrl'
        })

        .state('category-list', {
            url: "/category-list/{page:.*}/{keyword:.*}",
            templateUrl: "frontend/views/template.html",
            controller: 'CategoryCtrl',
            params: {
                page: "1",
                keyword: ""
            }
        })

        .state('createcategory', {
            url: "/category-create",
            templateUrl: "frontend/views/template.html",
            controller: 'CreateCategoryCtrl'
        })

        .state('editcategory', {
            url: "/category-edit/:id",
            templateUrl: "frontend/views/template.html",
            controller: 'EditCategoryCtrl'
        })

        .state('func-list', {
            url: "/func-list/{page:.*}/{keyword:.*}/{model:.*}",
            templateUrl: "frontend/views/template.html",
            controller: 'ModelViewCtrl',
            params: {
                page: "1",
                keyword: "",
                model: "func"
            }
        })

        .state('createfunc', {
            url: "/func-create/{id:.*}/{model:.*}",
            templateUrl: "frontend/views/template.html",
            controller: 'CreateModelCtrl',
            params: {
                id: "",
                model: "func"
            }
        })

        .state('editfunc', {
            url: "/func-edit/{id:.*}/{model:.*}",
            templateUrl: "frontend/views/template.html",
            controller: 'EditModelCtrl',
            params: {
                id: "",
                model: "func"
            }
        })

        .state('causeLoss-list', {
            url: "/causeloss-list/{page:.*}/{keyword:.*}/{model:.*}",
            templateUrl: "frontend/views/template.html",
            controller: 'ModelViewCtrl',
            params: {
                page: "1",
                keyword: "",
                model: "cause loss"
            }
        })

        .state('createcauseLoss', {
            url: "/causeloss-create/{id:.*}",
            templateUrl: "frontend/views/template.html",
            controller: 'CreateCauseLossCtrl',
            params: {
                id: ""
            }
        })

        .state('editcauseLoss', {
            url: "/causeloss-edit/{id:.*}",
            templateUrl: "frontend/views/template.html",
            controller: 'EditCauseLossCtrl',
            params: {
                id: ""
            }
        })

        .state('natureLoss-list', {
            url: "/natureloss-list/{page:.*}/{keyword:.*}/{model:.*}",
            templateUrl: "frontend/views/template.html",
            controller: 'ModelViewCtrl',
            params: {
                page: "1",
                keyword: "",
                model: "nature loss"
            }
        })

        .state('createnatureLoss', {
            url: "/natureloss-create",
            templateUrl: "frontend/views/template.html",
            controller: 'CreateModelCtrl',
            params: {
                model: "nature loss"
            }
        })

        .state('editnatureLoss', {
            url: "/natureloss-edit/{id:.*}/{model:.*}",
            templateUrl: "frontend/views/template.html",
            controller: 'EditModelCtrl',
            params: {
                id: "",
                model: "nature loss"
            }
        })

        .state('businessbranch-list', {
            url: "/businessbranch-list/{page:.*}/{keyword:.*}",
            templateUrl: "frontend/views/template.html",
            controller: 'BusinessBranchCtrl',
            params: {
                page: "1",
                keyword: ""
            }
        })

        .state('createbusinessbranch', {
            url: "/businessbranch-create",
            templateUrl: "frontend/views/template.html",
            controller: 'CreateBusinessBranchCtrl'
        })

        .state('editbusinessbranch', {
            url: "/businessbranch-edit/:id",
            templateUrl: "frontend/views/template.html",
            controller: 'EditBusinessBranchCtrl'
        })

        .state('menu-list', {
            url: "/menu-list/{page:.*}/{keyword:.*}",
            templateUrl: "frontend/views/template.html",
            controller: 'MenuCtrl',
            params: {
                page: "1",
                keyword: ""
            }
        })

        .state('createmenu', {
            url: "/menu-create",
            templateUrl: "frontend/views/template.html",
            controller: 'CreateMenuCtrl'
        })

        .state('editmenu', {
            url: "/menu-edit/:id",
            templateUrl: "frontend/views/template.html",
            controller: 'EditMenuCtrl'
        })


        .state('role-list', {
            url: "/role-list/{page:.*}/{keyword:.*}",
            templateUrl: "frontend/views/template.html",
            controller: 'RoleCtrl',
            params: {
                page: "1",
                keyword: ""
            }
        })

        .state('createrole', {
            url: "/role-create",
            templateUrl: "frontend/views/template.html",
            controller: 'CreateRoleCtrl'
        })

        .state('editrole', {
            url: "/role-edit/:id",
            templateUrl: "frontend/views/template.html",
            controller: 'EditRoleCtrl'
        })

        .state('user-list', {
            url: "/user-list/{page:.*}/{keyword:.*}",
            templateUrl: "frontend/views/template.html",
            controller: 'UserCtrl',
            params: {
                page: "1",
                keyword: ""
            }
        })

        .state('createuser', {
            url: "/user-create",
            templateUrl: "frontend/views/template.html",
            controller: 'CreateUserCtrl'
        })

        .state('leave-detail', {
            url: "/leave-detail",
            templateUrl: "frontend/views/template.html",
            controller: 'LeaveDetailCtrl'
        })

        .state('leaveManagement-list', {
            url: "/leavemanagement-list/{page:.*}/{keyword:.*}/{model:.*}",
            templateUrl: "frontend/views/template.html",
            controller: 'ModelViewCtrl',
            params: {
                page: "1",
                keyword: "",
                model: "leave management"
            }
        })
        .state('createleaves', {
            url: "/leave-create/{id:.*}/{model:.*}",
            templateUrl: "frontend/views/template.html",
            controller: 'CreateLeaveCtrl',
            params: {
                id: "",
                model: "leave management"
            }
        })
        .state('editleaves', {
            url: "/leaves-edit/{id:.*}/{model:.*}",
            templateUrl: "frontend/views/template.html",
            controller: 'EditLeaveCtrl',
            params: {
                id: "",
                model: "leave management"
            }
        })



        .state('reimbursement-list', {
            url: "/reimbursement-list/{page:.*}/{keyword:.*}/{model:.*}",
            templateUrl: "frontend/views/template.html",
            controller: 'ModelViewCtrl',
            params: {
                page: "1",
                keyword: "",
                model: "reimbursement"
            }
        })

        .state('createreimbursements', {
            url: "/reimbursement-create/{id:.*}/{model:.*}",
            templateUrl: "frontend/views/template.html",
            controller: 'CreateReimbursementCtrl',
            params: {
                id: "",
                model: "reimbursement"
            }
        })
        .state('editreimbursements', {
            url: "/reimbursements-edit/{id:.*}/{model:.*}",
            templateUrl: "frontend/views/template.html",
            controller: 'EditReimbursementCtrl',
            params: {
                id: "",
                model: "reimbursement"
            }
        })





        // .state('reimbursement-detail', {
        //     url: "/reimbursement-detail",
        //     templateUrl: "frontend/views/template.html",
        //     controller: 'ReimbursementDetailCtrl'
        // })

        .state('edituser', {
            url: "/user-edit/:id",
            templateUrl: "frontend/views/template.html",
            controller: 'EditUserCtrl'
        })

        .state('employee-list', {
            url: "/employee-list//{page:.*}/{keyword:.*}/{model:.*}",
            templateUrl: "frontend/views/template.html",
            controller: 'ModelViewCtrl',
            params: {
                page: "1",
                keyword: "",
                model: "employee"
            }
        })


        .state('createemployee', {
            url: "/employee-create/{id:.*}/{model:.*}",
            templateUrl: "frontend/views/template.html",
            controller: 'CreateEmployeeCtrl',
            params: {
                id: "",
                model: "employee"
            }
        })

        .state('editemployee', {
            url: "/employee-edit/:id",
            templateUrl: "frontend/views/template.html",
            controller: 'EditEmployeeCtrl',
            params: {
                id: "",
                model: "employee"
            }
        })

        .state('product-list', {
            url: "/product-list/{page:.*}/{keyword:.*}",
            templateUrl: "frontend/views/template.html",
            controller: 'ProductCtrl',
            params: {
                page: "1",
                keyword: ""
            }
        })

        .state('createproduct', {
            url: "/product-detail",
            templateUrl: "frontend/views/template.html",
            controller: 'CreateProductCtrl'
        })

        .state('editproduct', {
            url: "/product-edit/:id",
            templateUrl: "frontend/views/template.html",
            controller: 'EditProductCtrl'
        })

        .state('salvage-list', {
            url: "/salvage-list/{page:.*}/{keyword:.*}/{model:.*}",
            templateUrl: "frontend/views/template.html",
            controller: 'ModelViewCtrl',
            params: {
                page: "1",
                keyword: "",
                model: "salvage"
            }
        })

        .state('createsalvage', {
            url: "/salvage-detail/{id:.*}/{model:.*}",
            templateUrl: "frontend/views/template.html",
            controller: 'CreateModelCtrl',
            params: {
                id: "",
                model: "salvage"
            }
        })

        .state('editSalvage', {
            url: "/salvage-edit/{id:.*}/{model:.*}",
            templateUrl: "frontend/views/template.html",
            controller: 'EditModelCtrl',
            params: {
                id: "",
                model: "salvage"
            }
        })

        .state('claims-list', {
            url: "/claims-list/{page:.*}/{keyword:.*}/{model:.*}",
            templateUrl: "frontend/views/template.html",
            controller: 'ModelViewCtrl',
            params: {
                page: "1",
                keyword: "",
                model: "claims"
            }
        })

        .state('createclaims', {
            url: "/claims-detail/{id:.*}/{model:.*}",
            templateUrl: "frontend/views/template.html",
            controller: 'CreateModelCtrl',
            params: {
                id: "",
                model: "claims"
            }
        })

        .state('editclaims', {
            url: "/claims-edit/{id:.*}/{model:.*}",
            templateUrl: "frontend/views/template.html",
            controller: 'EditModelCtrl',
            params: {
                id: "",
                model: "claims"
            }
        })

        .state('bankMaster-list', {
            url: "/bankmaster-list/{page:.*}/{keyword:.*}",
            templateUrl: "frontend/views/template.html",
            controller: 'BankMasterCtrl',
            params: {
                page: "1",
                keyword: ""
            }
        })

        .state('createbankmaster', {
            url: "/bankmaster-detail",
            templateUrl: "frontend/views/template.html",
            controller: 'CreateBankmasterCtrl'
        })

        .state('editbankmaster', {
            url: "/bankmaster-detail/:id",
            templateUrl: "frontend/views/template.html",
            controller: 'EditBankmasterCtrl'
        })

        .state('company-list', {
            url: "/company-list/{page:.*}/{keyword:.*}",
            templateUrl: "frontend/views/template.html",
            controller: 'CompanyCtrl',
            params: {
                page: "1",
                keyword: ""
            }
        })

        .state('createcompany', {
            url: "/company-detail",
            templateUrl: "frontend/views/template.html",
            controller: 'CreateCompanyCtrl'
        })

        .state('editcompany', {
            url: "/company-detail/:id",
            templateUrl: "frontend/views/template.html",
            controller: 'EditCompanyCtrl'
        })
        .state('knowledgebase-list', {
            url: "/knowledgebase-list/{page:.*}/{keyword:.*}/{model:.*}",
            templateUrl: "frontend/views/template.html",
            controller: 'KnowledgeBaseViewCtrl',
            params: {
                page: "1",
                keyword: "",
                model: "knowledge base"
            }
        })
        .state('createKnowledgeBase', {
            url: "/KnowledgeBase-create/{id:.*}/{model:.*}",
            templateUrl: "frontend/views/template.html",
            controller: 'CreateKnowledgeBaseCtrl',
            params: {
                id: "",
                model: "knowledge base"
            }
        })
        .state('editKnowledgeBase', {
            url: "/KnowledgeBase-edit/{id:.*}/{model:.*}",
            templateUrl: "frontend/views/template.html",
            controller: 'EditKnowledgeBaseCtrl',
            params: {
                id: "",
                model: "knowledge base"
            }
        })
        .state('createAllDocument', {
            url: "/AllDocument-create/{id:.*}/{model:.*}",
            templateUrl: "frontend/views/template.html",
            controller: 'CreateAllDocumentCtrl',
            params: {
                id: "",
                model: "jir"
            }
        })
        .state('knowledgebase-detail', {
            url: "/knowledgebase-detail",
            templateUrl: "frontend/views/template.html",
            controller: 'KnowledgebaseDetailCtrl'
        })
        .state('all-document', {
            url: "/all-document",
            templateUrl: "frontend/views/template.html",
            controller: 'AllDocumentCtrl',
            params: {
                id: "",
                model: "jir"
            }
        })
        .state('tag-list', {
            url: "/tag-list/{page:.*}/{keyword:.*}/{model:.*}",
            templateUrl: "frontend/views/template.html",
            controller: 'ModelViewCtrl',
            params: {
                page: "1",
                keyword: "",
                model: "tag"
            }
        })
        .state('createtag', {
            url: "/tag-detail/{id:.*}/{model:.*}",
            templateUrl: "frontend/views/template.html",
            controller: 'CreateModelCtrl',
            params: {
                id: "",
                model: "tag"
            }
        })
        .state('edittag', {
            url: "/tag-edit/{id:.*}/{model:.*}",
            templateUrl: "frontend/views/template.html",
            controller: 'EditModelCtrl',
            params: {
                page: "1",
                keyword: "",
                model: "tag"
            }
        })
        .state('tax-list', {
            url: "/tax-list/{page:.*}/{keyword:.*}/{model:.*}",
            templateUrl: "frontend/views/template.html",
            controller: 'ModelViewCtrl',
            params: {
                page: "1",
                keyword: "",
                model: "tax"
            }
        })
        .state('createtax', {
            url: "/tax-detail/{id:.*}/{model:.*}",
            templateUrl: "frontend/views/template.html",
            controller: 'CreateModelCtrl',
            params: {
                id: "",
                model: "tax"
            }
        })
        .state('edittax', {
            url: "/tax-edit/{id:.*}/{model:.*}",
            templateUrl: "frontend/views/template.html",
            controller: 'EditTaxCtrl',
            params: {
                page: "1",
                keyword: "",
                model: "tax"
            }
        })
        // .state('createInvoiceExpenditure', {
        //     url: "/invoiceExpenditure-detail/{id:.*}/{model:.*}",
        //     templateUrl: "frontend/views/template.html",
        //     controller: 'CreateModelCtrl',
        //     params: {
        //         id: "",
        //         model: "invoice expenditure"
        //     }
        // })
        // .state('editInvoiceExpenditure', {
        //     url: "/invoiceExpenditure-edit/{id:.*}/{model:.*}",
        //     templateUrl: "frontend/views/template.html",
        //     controller: 'EditModelCtrl',
        //     params: {
        //         page: "1",
        //         keyword: "",
        //         model: "invoice expenditure"
        //     }
        // })
        .state('customer-list', {
            url: "/customer-list/{page:.*}/{keyword:.*}/{model:.*}",
            templateUrl: "frontend/views/template.html",
            controller: 'CustomerCtrl',
            params: {
                page: "1",
                keyword: "",
                model: "customer",
                sorting: [],
                pagelimit: "",
                segment: [],
                company: [],
                state: [],
                text: ""
            }
        })

        .state('createcustomer', {
            url: "/customer-detail/{id:.*}/{model:.*}",
            templateUrl: "frontend/views/template.html",
            controller: 'CreateCustomerCtrl',
            // data.error.message
            params: {
                id: "",
                model: "customer"
            }
        })

        .state('editcustomer', {
            url: "/customer-edit/{id:.*}/{model:.*}",
            templateUrl: "frontend/views/template.html",
            controller: 'EditCustomerCtrl',
            params: {
                id: "",
                model: "customer"
            }
        })


        .state('contactManagement-list', {
            url: "/contactmanagement-list/{page:.*}/{keyword:.*}",
            templateUrl: "frontend/views/template.html",
            controller: 'ContactManagementCtrl',
            params: {
                page: "1",
                keyword: ""
            }
        })

        .state('createcontactmanagement', {
            url: "/contactmanagement-detail",
            templateUrl: "frontend/views/template.html",
            controller: 'CreateContactManagementCtrl'
        })

        .state('contacttype-list', {
            url: "/contacttype-list/{page:.*}/{keyword:.*}",
            templateUrl: "frontend/views/template.html",
            controller: 'ContactTypeCtrl',
            params: {
                page: "1",
                keyword: ""
            }
        })

        .state('createcontacttype', {
            url: "/contacttype-detail",
            templateUrl: "frontend/views/template.html",
            controller: 'CreateContactTypeCtrl'
        })

        .state('contactTypeOffice-list', {
            url: "/contacttypeoffice-list/{page:.*}/{keyword:.*}",
            templateUrl: "frontend/views/template.html",
            controller: 'ContactTypeOfficeCtrl',
            params: {
                page: "1",
                keyword: ""
            }
        })

        .state('createcontacttypeoffice', {
            url: "/contacttypeoffice-detail",
            templateUrl: "frontend/views/template.html",
            controller: 'CreateContactTypeOfficeCtrl'
        })

        .state('customerSegment-list', {
            url: "/customersegment-list/{page:.*}/{keyword:.*}/{model:.*}",
            templateUrl: "frontend/views/template.html",
            controller: 'ModelViewCtrl',
            params: {
                page: "1",
                keyword: "",
                model: "customer segment"
            }
        })

        .state('createcustomerSegment', {
            url: "/customersegment-create/{id:.*}/{model:.*}",
            templateUrl: "frontend/views/template.html",
            controller: 'CreateModelCtrl',
            params: {
                id: "",
                model: "customer segment"
            }
        })

        .state('editcustomerSegment', {
            url: "/customersegment-edit/{id:.*}/{model:.*}",
            templateUrl: "frontend/views/template.html",
            controller: 'EditModelCtrl',
            params: {
                id: "",
                model: "customer segment"
            }
        })

        .state('customerCompany-list', {
            url: "/customercompany-list/{page:.*}/{keyword:.*}/{model:.*}",
            templateUrl: "frontend/views/template.html",
            controller: 'ModelViewCtrl',
            params: {
                page: "1",
                keyword: "",
                model: "customer company"
            }
        })

        .state('createcustomerCompany', {
            url: "/customercompany-create/{id:.*}/{model:.*}",
            templateUrl: "frontend/views/template.html",
            controller: 'CreateCustomerCompanyCtrl',
            params: {
                id: "",
                model: "customer company"
            }
        })

        .state('editcustomerCompany', {
            url: "/customercompany-edit/{id:.*}/{model:.*}",
            templateUrl: "frontend/views/template.html",
            controller: 'EditCustomerCompanyCtrl',
            params: {
                id: "",
                model: "customer company"
            }
        })

        .state('grade-list', {
            url: "/grade-list/:id/:keyword/:model",
            templateUrl: "frontend/views/template.html",
            controller: 'ModelViewCtrl',
            params: {
                page: "1",
                keyword: "",
                model: "grade"
            }
        })

        .state('creategrade', {
            url: "/grade-create/:id/:model",
            templateUrl: "frontend/views/template.html",
            controller: 'CreateModelCtrl',
            params: {
                id: "",
                model: "grade"
            }
        })

        .state('editgrade', {
            url: "/grade-edit/:id/:model",
            templateUrl: "frontend/views/template.html",
            controller: 'EditModelCtrl',
            params: {
                id: "",
                model: "grade"
            }
        })

        .state('surveyCode-list', {
            url: "/surveycode-list/{page:.*}/{keyword:.*}/{model:.*}",
            templateUrl: "frontend/views/template.html",
            controller: 'ModelViewCtrl',
            params: {
                page: "1",
                keyword: "",
                model: "survey code"
            }
        })

        .state('createsurveyCode', {
            url: "/surveycode-create/{id:.*}/{model:.*}",
            templateUrl: "frontend/views/template.html",
            controller: 'CreateModelCtrl',
            params: {
                id: "",
                model: "survey code"
            }
        })

        .state('editsurveyCode', {
            url: "/surveycode-edit/{id:.*}/{model:.*}",
            templateUrl: "frontend/views/template.html",
            controller: 'EditModelCtrl',
            params: {
                id: "",
                model: "survey code"
            }
        })

        .state('transferOffice-list', {
            url: "/transferoffice-list/{page:.*}/{keyword:.*}/{model:.*}",
            templateUrl: "frontend/views/template.html",
            controller: 'ModelViewCtrl',
            params: {
                page: "1",
                keyword: "",
                model: "transfer office"
            }
        })

        .state('createtransferoffice', {
            url: "/transferoffice-create/{id:.*}/{model:.*}",
            templateUrl: "frontend/views/template.html",
            controller: 'CreateModelCtrl',
            params: {
                id: "",
                model: "transfer office"
            }
        })

        .state('edittransferofficer', {
            url: "/transferOfficer-edit",
            templateUrl: "frontend/views/template.html",
            controller: 'EditTransferOfficerCtrl'
        })

        .state('createassignmentemail', {
            url: "/assignmentemail-create/{emailId:.*}/{model:.*}/{pdf:.*}",
            templateUrl: "frontend/views/template.html",
            controller: 'CreateAssignmentCtrl',
            params: {
                emailId: "",
                model: "assignment"
            }
        })

        .state('createassignment', {
            url: "/assignment-create/{id:.*}/{model:.*}/{assignment:.*}/{pdf:.*}",
            templateUrl: "frontend/views/template.html",
            controller: 'CreateAssignmentCtrl',
            params: {
                id: "",
                model: "assignment",
                assignment: ""
            }
        })

        .state('editassignment', {
            url: "/assignment-edit/{id:.*}/{model:.*}",
            templateUrl: "frontend/views/template.html",
            controller: 'EditAssignmentCtrl',
            params: {
                id: "",
                model: "assignment"
            }
        })
        .state('createInvoiceExpenditure', {
            url: "/invoiceExpenditure-create/{id:.*}/{model:.*}/{assignment:.*}",
            templateUrl: "frontend/views/template.html",
            controller: 'CreateInvoiceExpenditureCtrl',
            params: {
                id: "",
                model: "invoice expenditure",
                assignment: ""
            }
        })
        .state('editInvoiceExpenditure', {
            url: "/invoiceExpenditure-edit/{id:.*}/{model:.*}",
            templateUrl: "frontend/views/template.html",
            controller: 'EditInvoiceExpenditureCtrl',
            params: {
                id: "",
                model: "invoice expenditure"
            }
        })


        .state('assignment-list', {
            url: "/assignment-list/:page",
            templateUrl: "frontend/views/template.html",
            controller: 'AssignmentCtrl',
            params: {
                page: "1",
                keyword: "",
                model: "assignment",
                timelineStatus: "",
                ownerStatus: "",
                name: "",
                owner: [],
                ownerId: "",
                city: [],
                insurer: [],
                insurerd: [],
                from: "",
                to: "",
                fromDate: "",
                toDate: "",
                department: [],
                branch: [],
                sorting: []
            }
        })

        .state('timeline', {
            url: "/timeline/{id:.*}",
            templateUrl: "frontend/views/template.html",
            controller: 'TimelineCtrl',
            params: {
                id: ""
            }
        })

        .state('template-list', {
            url: "/template-list/{page:.*}/{keyword:.*}/{model:.*}",
            templateUrl: "frontend/views/template.html",
            controller: 'ModelViewCtrl',
            params: {
                page: "1",
                keyword: "",
                model: "template"
            }
        })

        .state('logistic-list', {
            url: "/logistic-list/{page:.*}/{keyword:.*}",
            templateUrl: "frontend/views/template.html",
            controller: 'LogisticCtrl',
            params: {
                page: "1",
                text: "",
                timelineStatus: ""
            }
        })

        .state('createtemplate', {
            url: "/template-create",
            templateUrl: "frontend/views/template.html",
            controller: 'CreateTemplateCtrl'
        })
        .state('editlogistic', {
            url: "/logistic-edit/:id",
            templateUrl: "frontend/views/template.html",
            controller: 'EditLogisticCtrl'
        })

        .state('edittemplate', {
            url: "/template-edit/:id",
            templateUrl: "frontend/views/template.html",
            controller: 'EditTemplateCtrl'
        })

        // jir state
        .state('templateJir-list', {
            url: "/templateJir-list/{page:.*}/{keyword:.*}/{model:.*}",
            templateUrl: "frontend/views/template.html",
            controller: 'ModelViewCtrl',
            params: {
                page: "1",
                keyword: "",
                model: "template jir"
            }
        })

        .state('createtemplateJir', {
            url: "/templateJir-create",
            templateUrl: "frontend/views/template.html",
            controller: 'CreateTemplateJIRCtrl'
        })

        .state('edittemplateJir', {
            url: "/templateJir-edit/:id",
            templateUrl: "frontend/views/template.html",
            controller: 'EditTemplateJIRCtrl'
        })

        //  jir state

        // ila state
        .state('templateIla-list', {
            url: "/templateIla-list/{page:.*}/{keyword:.*}/{model:.*}",
            templateUrl: "frontend/views/template.html",
            controller: 'ModelViewCtrl',
            params: {
                page: "1",
                keyword: "",
                model: "template ila"
            }
        })

        .state('createtemplateIla', {
            url: "/templateIla-create",
            templateUrl: "frontend/views/template.html",
            controller: 'CreateTemplateILACtrl'
        })

        .state('edittemplateIla', {
            url: "/templateIla-edit/:id",
            templateUrl: "frontend/views/template.html",
            controller: 'EditTemplateILACtrl'
        })

        //  ila state

        // ila state
        .state('templateIsr-list', {
            url: "/templateIsr-list/{page:.*}/{keyword:.*}/{model:.*}",
            templateUrl: "frontend/views/template.html",
            controller: 'ModelViewCtrl',
            params: {
                page: "1",
                keyword: "",
                model: "template isr"
            }
        })

        .state('createtemplateIsr', {
            url: "/templateIsr-create",
            templateUrl: "frontend/views/template.html",
            controller: 'CreateTemplateISRCtrl'
        })

        .state('edittemplateIsr', {
            url: "/templateIsr-edit/:id",
            templateUrl: "frontend/views/template.html",
            controller: 'EditTemplateISRCtrl'
        })

        //  ila state

        //  lor state
        .state('lorCategory-list', {
            url: "/lorCategory-list/{page:.*}/{keyword:.*}/{model:.*}",
            templateUrl: "frontend/views/template.html",
            controller: 'ModelViewCtrl',
            params: {
                page: "1",
                keyword: "",
                model: "lor category"
            }
        })
        .state('createLorCategory', {
            url: "/lorCategory-create/{id:.*}/{model:.*}/{assignment:.*}",
            templateUrl: "frontend/views/template.html",
            controller: 'CreateLorCategoryCtrl',
            params: {
                id: "",
                model: "lor category"
            }
        })
        .state('editLorCategory', {
            url: "/lorCategory-edit/{id:.*}/{model:.*}",
            templateUrl: "frontend/views/template.html",
            controller: 'EditLorCategoryCtrl',
            params: {
                id: "",
                model: "lor category"
            }
        })
        .state('lorMaster-list', {
            url: "/lorMaster-list/{page:.*}/{keyword:.*}/{model:.*}",
            templateUrl: "frontend/views/template.html",
            controller: 'ModelViewCtrl',
            params: {
                page: "1",
                keyword: "",
                model: "lor master"
            }
        })

        .state('createLorMaster', {
            url: "/lorMaster-create/{id:.*}/{model:.*}/{assignment:.*}",
            templateUrl: "frontend/views/template.html",
            controller: 'CreateLorMasterCtrl',
            params: {
                id: "",
                model: "lor master"
            }
        })
        .state('editLorMaster', {
            url: "/lorMaster-edit/{id:.*}/{model:.*}",
            templateUrl: "frontend/views/template.html",
            controller: 'EditLorMasterCtrl',
            params: {
                id: "",
                model: "lor master"
            }
        })
        .state('invoice-list', {
            url: "/invoice-list/{page:.*}",
            templateUrl: "frontend/views/template.html",
            controller: 'InvoiceViewCtrl',
            params: {
                page: "1",
                keyword: "",
                model: "invoice"
            }
        })
        .state('shop-list', {
            url: "/shop-list/{page:.*}",
            templateUrl: "frontend/views/template.html",
            controller: 'ModelViewCtrl',
            params: {
                page: "1",
                keyword: "",
                model: "shop"
            }
        })
        .state('createshop', {
            url: "/shop-detail/{id:.*}/{model:.*}",
            templateUrl: "frontend/views/template.html",
            controller: 'CreateShopCtrl',
            params: {
                id: "",
                model: "shop"
            }
        })

        .state('editshop', {
            url: "/shop-edit/{id:.*}/{model:.*}",
            templateUrl: "frontend/views/template.html",
            controller: 'EditShopCtrl',
            params: {
                id: "",
                model: "shop"
            }
        })
        .state('payment-list', {
            url: "/payment-list",
            templateUrl: "frontend/views/template.html",
            controller: 'PaymentViewCtrl',
            params: {
                page: "1",
                keyword: "",
                model: "payment"
            }
        })
        .state('createPayment', {
            url: "/payment-detail/{id:.*}/{model:.*}",
            templateUrl: "frontend/views/template.html",
            controller: 'CreatePaymentCtrl',
            params: {
                id: "",
                model: "payment"
            }
        })
        .state('templateLor-list', {
            url: "/templateLor-list/{page:.*}/{keyword:.*}/{model:.*}",
            templateUrl: "frontend/views/template.html",
            controller: 'ModelViewCtrl',
            params: {
                page: "1",
                keyword: "",
                model: "template lor"
            }
        })
        .state('createtemplateLor', {
            url: "/templateLor-create",
            templateUrl: "frontend/views/template.html",
            controller: 'CreateTemplateLORCtrl'
        })

        .state('edittemplateLor', {
            url: "/templateLor-edit/:id",
            templateUrl: "frontend/views/template.html",
            controller: 'EditTemplateLORCtrl'
        })

        .state('templateInvoice-list', {
            url: "/templateInvoice-list/{page:.*}/{keyword:.*}/{model:.*}",
            templateUrl: "frontend/views/template.html",
            controller: 'ModelViewCtrl',
            params: {
                page: "1",
                keyword: "",
                model: "template invoice"
            }
        })
        .state('createtemplateInvoice', {
            url: "/templateInvoice-create",
            templateUrl: "frontend/views/template.html",
            controller: 'CreateTemplateInvoiceCtrl'
        })
        .state('createInvoice', {
            url: "/Invoice-create",
            templateUrl: "frontend/views/template.html",
            controller: 'CreateInvoiceCtrl'
        })
        .state('editInvoice', {
            url: "/Invoice-edit/:assignmentId/:invoiceId/:approval",
            templateUrl: "frontend/views/template.html",
            controller: 'EditInvoiceCtrl'
        })
        .state('invoiceApproval-list', {
            url: "/invoiceApproval-list/{page:.*}/{keyword:.*}/{model:.*}",
            templateUrl: "frontend/views/template.html",
            controller: 'InvoiceApprovalsCtrl',
            params: {
                page: "1",
                keyword: ""
            }
        })
        .state('sbcApproval-list', {
            url: "/sbcApproval-list/{page:.*}/{keyword:.*}/{model:.*}",
            templateUrl: "frontend/views/template.html",
            controller: 'SbcApprovalsCtrl',
            params: {
                page: "1",
                keyword: ""
            }
        })
        .state('assignmentApproval-list', {
            url: "/assignmentApproval-list/{page:.*}/{keyword:.*}/{model:.*}",
            templateUrl: "frontend/views/template.html",
            controller: 'AssignmentApprovalsCtrl',
            params: {
                page: "1",
                keyword: ""
            }
        })
        .state('reOpenApproval-list', {
            url: "/reOpenApproval-list/{page:.*}/{keyword:.*}/{model:.*}",
            templateUrl: "frontend/views/template.html",
            controller: 'ReOpenApprovalApprovalsCtrl',
            params: {
                page: "1",
                keyword: ""
            }
        })
        .state('edittemplateInvoice', {
            url: "/templateInvoice-edit/:id",
            templateUrl: "frontend/views/template.html",
            controller: 'EditTemplateInvoiceCtrl'
        })

        .state('invoiceExpenditure-list', {
            url: "/invoiceExpenditure-list/{page:.*}/{keyword:.*}/{model:.*}",
            templateUrl: "frontend/views/template.html",
            controller: 'ModelViewCtrl',
            params: {
                page: "1",
                keyword: "",
                model: "invoice expenditure"
            }
        })





        //  lor state


        .state('template-view', {
            url: "/template-view/:template/:assignmentTemplate/:assignment/:type/:templateName/:approval",
            templateUrl: "frontend/views/template.html",
            controller: 'TemplateViewCtrl'
        })
        .state('template-invoice', {
            url: "/template-invoice/:assignmentTemplate/:assignment/:type",
            templateUrl: "frontend/views/template.html",
            controller: 'TemplateInvoiceCtrl'
        })

        .state('email-inbox', {
            url: "/email-inbox",
            templateUrl: "frontend/views/template.html",
            controller: 'EmailInboxCtrl'
        })

        .state('email-single', {
            url: "/email-single/:id",
            templateUrl: "frontend/views/template.html",
            controller: 'EmailSingleCtrl'
        })

        // .state('approval', {
        //     url: "/ilaApproval-list",
        //     templateUrl: "frontend/views/template.html",
        //     controller: 'ApprovalsCtrl',
        //     params: {
        //         page: "1",
        //         keyword: ""
        //     }
        // })
        .state('ilaApproval-list', {
            url: "/ilaApproval-list/{page:.*}/{keyword:.*}/{model:.*}",
            templateUrl: "frontend/views/template.html",
            controller: 'IlaApprovalsCtrl',
            params: {
                page: "1",
                keyword: ""
            }
        })
        .state('lorApproval-list', {
            url: "/lorApproval-list/{page:.*}/{keyword:.*}/{model:.*}",
            templateUrl: "frontend/views/template.html",
            controller: 'LorApprovalsCtrl',
            params: {
                page: "1",
                keyword: ""
            }
        })
        .state('~', {
            url: "/accordion-lor",
            templateUrl: "frontend/views/template.html",
            controller: 'AccordionLORCtrl'
        })
        .state('forbidden', {
            url: "/forbidden",
            templateUrl: "frontend/views/template.html",
            controller: 'ForbiddenCtrl'
        })

    ;
    $urlRouterProvider.otherwise("/login");
    $locationProvider.html5Mode(isproduction);

});


firstapp.filter('amt', function () {
    return function (nStr) {
        nStr += '';
        x = nStr.split('.');
        x1 = x[0];
        x2 = x.length > 1 ? '.' + x[1] : '';
        var rgx = /(\d+)(\d{3})/;
        while (rgx.test(x1)) {
            x1 = x1.replace(rgx, '$1' + ',' + '$2');
        }
        return x1 + x2;
    };
});


firstapp.filter('toobject', function () {
    return function (input, assignment) {
        // console.log("ToObj", input, assignment);
        var sInput = _.split(input, '+');
        var returnStr = "";
        sInput = _.map(sInput, function (n) {
            var obj = {};
            n = _.trim(n);
            if (_.startsWith(n, '"')) {
                obj.type = "String";
                obj.value = n.substr(1, n.length - 2);
            } else {
                obj.type = "Object";
                var splitVal = _.split(n, ".");
                obj.value = assignment;
                _.each(splitVal, function (m, k) {
                    if (!isNaN(m)) {
                        _.each(obj.value, function (n, key) {
                            if (m == key) {
                                obj.value = n;
                            }

                        });
                    } else if (m == "*") {
                        var a = _.cloneDeep(obj.value);
                        var b = {};
                        obj.value = {};
                        _.each(a, function (n, key) {
                            var a = splitVal[k + 1];
                            for (var i in n) {
                                if (i == a) {
                                    if (b[i] != undefined) {
                                        if (i === "surveyDate") {
                                            if (n["status"] === "Completed") {
                                                b[i] = b[i] + ", " + moment(n[i]).format("DD/MM/YYYY");
                                            }
                                        } else {
                                            b[i] = b[i] + ", " + n[i];
                                        }
                                    } else {
                                        if (i === "surveyDate") {
                                            if (n["status"] === "Completed") {
                                                b[i] = moment(n[i]).format("DD/MM/YYYY");
                                            }
                                        } else {
                                            b[i] = n[i];
                                        }
                                    }
                                }
                            }
                        });
                        obj.value = b;
                    } else {
                        if (obj.value) {
                            obj.value = obj.value[m];
                        }
                    }
                });
            }
            if (obj.value === undefined) {
                obj.value = "NA";
            }
            // console.log("Object.val", obj.value);
            var ifDate = _.split(obj.value, ':');
            // console.log(ifDate);
            if (ifDate.length > 1) {
                if ((obj.value.charAt(obj.value.length - 1) == "Z" || obj.value.charAt(obj.value.length - 1) == "z") && ifDate.length == 3) {
                    obj.value = moment(obj.value).format("DD/MM/YYYY");
                }
            }
            returnStr = returnStr + obj.value;
            return obj;
        });
        // var ifDate = returnStr.split(":");
        // if ((returnStr.charAt(returnStr.length - 1) == "Z" || returnStr.charAt(returnStr.length - 1) == "z") && ifDate.length == 3) {
        //     returnStr = moment(returnStr).format("DD/MM/YYYY");
        //     return returnStr;
        // }
        return returnStr;
    };
});

firstapp.filter('uploadpath', function () {
    return function (input, width, height, style) {
        var other = "";
        if (width && width !== "") {
            other += "&width=" + width;
        }
        // else {
        //     width = 100;
        //     other += "&width=" + width;
        // }
        if (height && height !== "") {
            other += "&height=" + height;
        }
        if (style && style !== "") {
            other += "&style=" + style;
        }
        if (input) {
            if (input.indexOf('https://') == -1) {
                return imgpath + "?file=" + input + other;
            } else {
                return input;
            }
        } else {
            return 'frontend/img/placeholder.png';
        }
    };
});

firstapp.filter('uploadpathPdf', function () {
    return function (input, width, height, style) {
        var other = "";
        if (width && width !== "") {
            other += "&width=" + width;
        }
        if (height && height !== "") {
            other += "&height=" + height;
        }
        if (style && style !== "") {
            other += "&style=" + style;
        }
        if (input) {
            // if (input.indexOf('https://') == -1) {
            return adminurl + "downloadWithName/" + input + other;
            // } else {
            //     return input;
            // }
        } else {
            return 'frontend/img/placeholder.png';
        }
    };
});

firstapp.filter('googlePdfViewer', ['$sce', function ($sce) {
    return function (input, width, height, style) {
        if (input) {
            // path = "https://docs.google.com/viewerng/viewer?url=http://absolutesurveyors.com/api/downloadWithName/59773053abbcf46e022f855c.pdf&embedded=true";
            path = "https://docs.google.com/viewerng/viewer?url=" + adminurl + "downloadWithName/" + input + "&embedded=true";
            return $sce.trustAsResourceUrl(path);
        } else {
            return 'frontend/img/placeholder.png';
        }
    };
}]);

firstapp.filter("mrnumber", function (NavigationService, $timeout) {

    return function (input) {
        var MRNumber = "";
        NavigationService.getOneCity(input.city, function (data) {
            MRNumber = data.data.district.state.zone.country.countryCode;
            return data;
        });
    };
});

firstapp.filter('reverse', function () {
    return function (items) {
        if (items === undefined) {
            return null;
        } else {
            return items.slice().reverse();
        }
    };
});
firstapp.filter('orderByTime', function () {
    return function (items) {
        if (items === undefined) {
            return null;
        } else {
            return _.orderBy(items, ["time"], ["desc"])
        }
    };
});

firstapp.filter('getHours', function () {
    return function (date) {
        return moment().diff(moment(date), "hours");
        // return moment().diff(moment(date).add(5, "hours").add(30, "minutes"), "hours");
    };
});
firstapp.filter('calulateReserveAmount', function () {
    return function (arrData) {
        var data = 0;
        console.log("arrData", arrData);
        _.each(arrData, function (n) {
            if (n.name === "LIABILITY") {
                _.each(n.items, function (items) {
                    if (items.name == "Reserve Amount") {
                        data = items.field;
                    }
                });
            }
            if (n.name === "ICICI CARGO ILA") {
                _.each(n.items, function (items) {
                    if (items.name == "Liability exists - If Yes, recommend Reserve after deducting Policy excess, if any") {
                        data = items.field;
                    }
                });
            }
        });
        return data;
    };
});
firstapp.filter('getPending', function () {
    return function (arrData) {
        var data = 0;
        _.each(arrData, function (n) {
            _.each(n.items, function (items) {
                if (items.isCheck) {
                    if (items.submit == "Pending" || items.submit == "Partially Recieved") {
                        data++;
                    }
                }
            });
        });
        return data;
    };
});
firstapp.filter('getRecieved', function () {
    return function (arrData) {
        var data = 0;
        _.each(arrData, function (n) {
            _.each(n.items, function (items) {
                if (items.isCheck) {
                    if (items.submit == "Received" || items.submit == "Waived") {
                        data++;
                    }
                }
            });
        });
        return data;
    };
});



firstapp.directive('tiny', function () {
    return {
        priority: 10
    }
});

firstapp.directive('myEnter', function () {
    return function (scope, element, attrs) {
        element.bind("keydown keypress", function (event) {
            if (event.which === 13) {
                scope.$apply(function () {
                    scope.$eval(attrs.myEnter);
                });

                event.preventDefault();
            }
        });
    };
});

firstapp.directive('imageonload', function () {
    return {
        restrict: 'A',
        link: function (scope, element, attrs) {
            element.bind('load', function () {
                scope.$apply(attrs.imageonload);
            });
        }
    };
});

firstapp.filter('numberFixedLen', function () {
    return function (n, len) {
        var num = parseInt(n, 10);
        len = parseInt(len, 10);
        if (isNaN(num) || isNaN(len)) {
            return n;
        }
        num = '' + num;
        while (num.length < len) {
            num = '0' + num;
        }
        return num;
    };
});

firstapp.filter('timeline', function () {
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
    return function (n) {
        var color = "#ffffff";
        _.each(arrTimeline, function (values) {
            if (n == values.status) {
                color = values.color;
            }
        });
        return color;
    };
});

firstapp.directive('dateModel', function () {
    return {
        scope: {
            model: '=ngModel'
        },
        link: function ($scope, element, attrs) {
            $scope.model = new Date($scope.model);
        }
    };
});

firstapp.directive('uploadFileDownload', function ($http, $filter, $timeout) {
    return {
        templateUrl: '/frontend/views/directive/uploadFileWithDownload.html',
        scope: {
            model: '=ngModel',
            callback: "&ngCallback"
        },
        link: function ($scope, element, attrs) {

            $scope.showImage = function () {
                console.log($scope.image);
            };
            $scope.check = true;
            $scope.type = "img";
            $scope.isMultiple = false;
            $scope.inObject = false;
            if (attrs.multiple || attrs.multiple === "") {
                $scope.isMultiple = true;
                $("#inputImage").attr("multiple", "ADD");
            }
            if (attrs.noView || attrs.noView === "") {
                $scope.noShow = true;
            }
            // if (attrs.required) {
            //     $scope.required = true;
            // } else {
            //     $scope.required = false;
            // }

            $scope.$watch("image", function (newVal, oldVal) {

                isArr = _.isArray(newVal);
                if (!isArr && newVal && newVal.file) {
                    $scope.uploadNow(newVal);
                } else if (isArr && newVal.length > 0 && newVal[0].file) {

                    $timeout(function () {
                        console.log(oldVal, newVal);
                        console.log(newVal.length);
                        _.each(newVal, function (newV, key) {
                            if (newV && newV.file) {
                                $scope.uploadNow(newV);
                            }
                        });
                    }, 100);

                }
            });

            if ($scope.model) {
                if (_.isArray($scope.model)) {
                    $scope.image = [];
                    _.each($scope.model, function (n) {
                        $scope.image.push({
                            url: n
                        });
                    });
                } else {
                    if (_.endsWith($scope.model, ".pdf")) {
                        $scope.type = "pdf";
                    }
                }

            }

            if (attrs.inobj || attrs.inobj === "") {
                $scope.inObject = true;
            }
            $scope.clearOld = function () {
                $scope.model = [];
            };
            $scope.uploadNow = function (image) {
                $scope.uploadStatus = "uploading";

                var Template = this;
                image.hide = true;
                var formData = new FormData();
                formData.append('file', image.file, image.name);
                $http.post(uploadurl, formData, {
                    headers: {
                        'Content-Type': undefined
                    },
                    transformRequest: angular.identity
                }).success(function (data) {

                    $scope.uploadStatus = "uploaded";
                    if ($scope.isMultiple) {

                        if ($scope.inObject) {
                            $scope.model.push({
                                "image": data.data[0]
                            });
                        } else {
                            if (!$scope.model) {
                                $scope.clearOld();
                            }
                            $scope.model.push(data.data[0]);
                        }
                    } else {
                        if (_.endsWith(data.data, ".pdf")) {
                            $scope.type = "pdf";
                        } else {
                            $scope.type = "img";
                        }
                        $scope.model = data.data;

                    }
                    $timeout(function () {
                        $scope.callback();
                    }, 100);

                });
            };
        }
    };
});


firstapp.directive('uploadImage', function ($http, $filter, $timeout, toastr) {
    return {
        templateUrl: '/frontend/views/directive/uploadFile.html',
        scope: {
            model: '=ngModel',
            callback: "&ngCallback"
        },
        link: function ($scope, element, attrs) {

            $scope.showImage = function () {
                console.log($scope.image);
            };

            $scope.check = true;
            $scope.type = "img";
            $scope.isMultiple = false;
            $scope.inObject = false;
            if (attrs.multiple || attrs.multiple === "") {
                $scope.isMultiple = true;
                $("#inputImage").attr("multiple", "ADD");
            }
            if (attrs.noView || attrs.noView === "") {
                $scope.noShow = true;
            }

            $scope.$watch("image", function (newVal, oldVal) {

                isArr = _.isArray(newVal);
                if (!isArr && newVal && newVal.file) {
                    $scope.uploadNow(newVal);
                } else if (isArr && newVal.length > 0 && newVal[0].file) {

                    $timeout(function () {
                        _.each(newVal, function (newV, key) {
                            if (newV && newV.file) {
                                console.log('newV = =', newV);
                                $scope.uploadNow(newV);
                            }
                        });
                    }, 100);

                }
            });

            if ($scope.model) {
                if (_.isArray($scope.model)) {
                    $scope.image = [];
                    _.each($scope.model, function (n) {
                        $scope.image.push({
                            url: n
                        });
                    });
                } else {
                    if (_.endsWith($scope.model, ".pdf")) {
                        $scope.type = "pdf";
                    }
                }

            }

            if (attrs.inobj || attrs.inobj === "") {
                $scope.inObject = true;
            }
            $scope.clearOld = function () {
                $scope.model = [];
            };
            $scope.uploadNow = function (image) {
                $scope.uploadStatus = "uploading";

                var Template = this;
                image.hide = true;
                var formData = new FormData();
                formData.append('file', image.file, image.name);
                $http.post(uploadurl, formData, {
                    headers: {
                        'Content-Type': undefined
                    },
                    transformRequest: angular.identity
                }).success(function (data) {
                    if (data.value) {
                        $scope.uploadStatus = "uploaded";
                        if ($scope.isMultiple) {
                            toastr.success("Upload Succeeded");
                            if ($scope.inObject) {
                                $scope.model.push({
                                    "image": data.data[0]
                                });
                            } else {
                                if (!$scope.model) {
                                    $scope.clearOld();
                                }
                                $scope.model.push(data.data[0]);
                            }
                        } else {
                            toastr.success("Upload Succeeded");
                            if (_.endsWith(data.data, ".pdf")) {
                                $scope.type = "pdf";
                            } else {
                                $scope.type = "img";
                            }
                            $scope.model = data.data;
                        }
                        $timeout(function () {
                            $scope.callback();
                        }, 100);
                    } else {
                        toastr.error("Max file size allowed: 1 MB", "Upload Failed");
                        $scope.uploadStatus = "failed";
                    }
                });
            };
        }
    };
});

firstapp.directive('uploadFiles', function ($http, $timeout, Upload, toastr, NavigationService, $uibModal, TemplateService, $rootScope) {
    return {
        templateUrl: '/frontend/views/directive/uploadFiles.html',
        scope: {
            employee: '=employee',
            assignmentid: '=assignmentid',
            timeline: '=timeline',
            model: '=ngModel',
            type: '=type',
            photos: '=photos',
            photoLength: "=photolength",
            callback: '&ngCallback',
            photosMaxLength: '=length'
        },
        link: function ($scope, scope, element, attrs) {
            $scope.progressBar = false;
            // UPLOADING FILES
            $scope.uploadFiles = function (files, type) {
                // console.log('files', files, 'types', type);
                $scope.progressBar = 0;
                $scope.model = [];
                var limitArr = [];
                var count = 0;
                var enterFile = true;
                if (type == "photos" || type == "editSurveyPhotos" || type == "surveyPhotos") {
                    if ($scope.photoLength < $scope.photosMaxLength) {
                        if (files && files.length) {
                            if (files.length <= ($scope.photosMaxLength - $scope.photoLength)) {
                                if (files && files.length) {
                                    for (var i = 0; i < files.length; i++) {
                                        $scope.progressBar = true;
                                        Upload.upload({
                                            url: uploadurl,
                                            data: {
                                                file: files[i],
                                            },
                                            headers: {
                                                'Content-Type': undefined
                                            },
                                            transformRequest: angular.identity
                                        }).then(function (resp) {
                                            if (resp.data) {
                                                count++;
                                                if (count === 1) {
                                                    $rootScope.viewProgressBar = true;
                                                }
                                                $scope.model.push(resp.data.data[0]);
                                                $rootScope.progressPercentage = parseInt((100.0 * (count + 1)) / (files.length + 1));
                                                $rootScope.imageName = resp.config.data.file.name;
                                                $rootScope.filesLength = files.length;
                                                $rootScope.currentCount = count;
                                                if (count == files.length) {
                                                    $scope.callback($scope.model);
                                                    setTimeout(function () {
                                                        $rootScope.viewProgressBar = false;
                                                        console.log('$rootScope.viewProgressBar', $rootScope.viewProgressBar);
                                                    }, 1000);
                                                }
                                                $rootScope.fileSize = resp.config.data.file.size;
                                            }
                                        }, function (resp) {
                                            console.log('Error status: ' + resp.status);
                                        }, function (evt) {
                                            // console.log('evt loaded', evt.loaded, "evt.total", evt.total);
                                            // $scope.singleProgress = parseInt(100.0 * evt.loaded / evt.total);
                                        });
                                    }
                                }
                            } else {
                                var rejected = files.length - ($scope.photosMaxLength - $scope.photoLength);
                                files = _.drop(files, (files.length - ($scope.photosMaxLength - $scope.photoLength)));
                                if (files && files.length) {
                                    for (var i = 0; i < files.length; i++) {
                                        $scope.progressBar = true;
                                        Upload.upload({
                                            url: uploadurl,
                                            data: {
                                                file: files[i],
                                            },
                                            headers: {
                                                'Content-Type': undefined
                                            },
                                            transformRequest: angular.identity
                                        }).then(function (resp) {
                                            if (resp.data) {
                                                count++;
                                                if (count === 1) {
                                                    $rootScope.viewProgressBar = true;
                                                }
                                                $scope.model.push(resp.data.data[0]);
                                                $rootScope.progressPercentage = parseInt((100.0 * (count + 1)) / (files.length + 1));
                                                $rootScope.imageName = resp.config.data.file.name;
                                                $rootScope.filesLength = files.length;
                                                $rootScope.currentCount = count;
                                                if (count == files.length) {
                                                    if (type == "surveyPhotos") {
                                                        toastr.error(files.length + " uploaded & " + rejected + " rejected", "Only 16 photos alloweddd");
                                                    } else {
                                                        toastr.error(files.length + " uploaded & " + rejected + " rejected", "Only " + $scope.photosMaxLength + " photos allowed");
                                                    }
                                                    $scope.callback($scope.model);
                                                    setTimeout(function () {
                                                        $rootScope.viewProgressBar = false;
                                                        console.log('$rootScope.viewProgressBar', $rootScope.viewProgressBar);
                                                    }, 1000);
                                                }
                                                $rootScope.fileSize = resp.config.data.file.size;
                                            }
                                        }, function (resp) {
                                            console.log('Error status: ' + resp.status);
                                        }, function (evt) {
                                            // console.log('evt loaded', evt.loaded, "evt.total", evt.total);
                                            // $scope.singleProgress = parseInt(100.0 * evt.loaded / evt.total);
                                        });
                                    }
                                }
                            }
                        }
                    } else {
                        toastr.error("Only " + $scope.photosMaxLength + " photos allowed");
                        enterFile = false;
                        $scope.callback($scope.model);
                    }
                } else {
                    if (files && files.length) {
                        for (var i = 0; i < files.length; i++) {
                            $scope.progressBar = true;
                            Upload.upload({
                                url: uploadurl,
                                data: {
                                    file: files[i],
                                },
                                headers: {
                                    'Content-Type': undefined
                                },
                                transformRequest: angular.identity
                            }).then(function (resp) {
                                if (resp.data) {
                                    count++;
                                    if (count === 1) {
                                        $rootScope.viewProgressBar = true;
                                    }
                                    console.log("-->", resp)
                                    $scope.model.push(resp.data.data[0]);
                                    $rootScope.progressPercentage = parseInt((100.0 * (count + 1)) / (files.length + 1));
                                    $rootScope.imageName = resp.config.data.file.name;
                                    $rootScope.filesLength = files.length;
                                    $rootScope.currentCount = count;
                                    if (count == files.length) {
                                        $scope.callback($scope.model);
                                        setTimeout(function () {
                                            $rootScope.viewProgressBar = false;
                                            console.log('$rootScope.viewProgressBar', $rootScope.viewProgressBar);
                                        }, 1000);
                                    }
                                    $rootScope.fileSize = resp.config.data.file.size;


                                }
                            }, function (resp) {
                                console.log('Error status: ' + resp.status);
                            }, function (evt) {
                                // console.log('evt loaded', evt.loaded, "evt.total", evt.total);
                                // $scope.singleProgress = parseInt(100.0 * evt.loaded / evt.total);
                            });
                        }
                    }
                }
            }

            // GENERATE ZIP
            $scope.generateZip = function (type) {
                window.open(adminurl + 'Assignment/generateZip?id=' + $scope.assignmentid + '&type=' + type, '_self');
                window.close();
            }

            // SELECT ALL IMAGES
            $scope.deleteIndexs = [];
            $scope.deleteSurveyIndexs = [];
            $scope.surveyData = {};
            $scope.selectAllData = function (type, flag) {
                // console.log('flag ', flag);
                if (flag === true) {
                    var matchedData = $scope.photos;
                    _.each(matchedData, function (value, key) {
                        $scope.deleteIndexs.push({
                            id: key,
                            file: value.file.toString()
                        });
                        // console.log('delete Indexs : ', $scope.deleteIndexs);
                    });
                } else {
                    $scope.deleteIndexs = [];
                }
            };

            //SELECT SINGLE IMAGE TO DELETE
            $scope.addDataToDelete = function (type, index, data) {
                var matchedData = $scope.photos;
                var matchIndex = _.findIndex(matchedData, function (o) {
                    console.log(" 1", o.file.toString(), "2 : ", data.toString());
                    return o.file.toString() == data.toString();
                });
                // console.log("matchIndex : ", matchIndex);
                var duplicateIndex = -1;
                if (!_.isEmpty($scope.deleteIndexs)) {
                    duplicateIndex = _.findIndex($scope.deleteIndexs, function (o) {
                        return o.id == matchIndex;
                    });
                    // console.log('duplicateIndex : ', duplicateIndex);
                }

                if (_.isEmpty($scope.deleteIndexs)) {
                    $scope.deleteIndexs.push({
                        id: matchIndex,
                        file: data.toString()
                    });
                } else {
                    if (duplicateIndex === -1) {
                        $scope.deleteIndexs.push({
                            id: matchIndex,
                            file: data.toString()
                        });
                    } else {
                        $scope.deleteIndexs.splice(duplicateIndex, 1);
                    }
                }
                // console.log('deleteIndexs : ', $scope.deleteIndexs);
            };

            //DELETE SELECTED IMAGE AND UPDATE TIMELINE
            $scope.deleteSelectedData = function (type) {
                if (_.isEmpty($scope.deleteIndexs)) {
                    $scope.selectOneRecord();
                } else {
                    _.each($scope.deleteIndexs, function (deleteData) {
                        var matchedData = $scope.photos;
                        var matchIndex = -1;
                        matchIndex = _.findIndex(matchedData, function (o) {
                            console.log(" 1", o.file.toString(), "2 : ", deleteData.file.toString());
                            return o.file.toString() == deleteData.file.toString();
                        });
                        if (matchIndex != -1) {
                            $scope.photos.splice(matchIndex, 1);
                        }
                    });

                    setTimeout(function () {
                        var formData = {};
                        var a = {};
                        formData._id = $scope.assignmentid;
                        if (type === "jir") {
                            formData.jir = $scope.photos;
                            a.title = "Jir Deleted";
                            a.subTitle = "Jir Deleted Successfully"
                        } else if (type === "photos") {
                            formData.photos = $scope.photos;
                            a.title = "Photos Deleted";
                            a.subTitle = "Photos Deleted Successfully"
                        } else if (type === "Documents") {
                            formData.docs = $scope.photos;
                            a.title = "Document Deleted";
                            a.subTitle = "Document Deleted Successfully"
                        } else {
                            $scope.photos.splice(index, 1);
                        }
                        if (type == 'jir' || type == 'photos' || type == 'Documents') {
                            NavigationService.assignmentSave(formData, function (data) {
                                if (data.value) {
                                    if (data.data.nModified === 1) {
                                        a.type = "Normal";
                                        a.employee = $scope.employee;
                                        $scope.timeline.chat.push(a);
                                        $scope.timelineSave();
                                        toastr.success(a.subTitle, a.title);
                                    } else {
                                        toastr.error("There was an error while delete the Jir ", "Error Deleting Jir");
                                    }
                                } else {
                                    toastr.error("There was an error while delete the Jir ", "Error Deleting Jir");
                                }
                            });
                        }
                    }, 2000);
                }


            };

            //REMOVE IMAGE AND UPDATE TIMELINE
            $scope.removeElement = function (type, index) {
                var formData = {};
                var a = {};
                formData._id = $scope.assignmentid;
                if (type === "jir") {
                    $scope.photos.splice(index, 1);
                    formData.jir = $scope.photos;
                    a.title = "Jir Deleted";
                    a.subTitle = "Jir Deleted Successfully";
                } else if (type === "photos") {
                    $scope.photos.splice(index, 1);
                    formData.photos = $scope.photos;
                    a.title = "Photos Deleted";
                    a.subTitle = "Photos Deleted Successfully";
                } else if (type === "Documents") {
                    $scope.photos.splice(index, 1);
                    formData.docs = $scope.photos;
                    a.title = "Document Deleted";
                    a.subTitle = "Document Deleted Successfully";
                } else {
                    $scope.photos.splice(index, 1);
                }
                if (type == 'jir' || type == 'photos' || type == 'Documents') {
                    NavigationService.assignmentSave(formData, function (data) {
                        if (data.value) {
                            if (data.data.nModified === 1) {
                                a.type = "Normal";
                                a.employee = $scope.employee;
                                $scope.timeline.chat.push(a);
                                $scope.timelineSave();
                                toastr.success(a.subTitle, a.title);
                            } else {
                                toastr.error("There was an error while delete the " + _.capitalize(type), "Error Deleting " + _.capitalize(type));
                            }
                        } else {
                            toastr.error("There was an error while delete the " + _.capitalize(type), "Error Deleting " + _.capitalize(type));
                        }
                    });
                }
            }

            //SAVE TIMELINE
            $scope.timelineSave = function () {
                NavigationService.saveChat($scope.timeline, function (data) {
                    if (data.value === false) {
                        toastr.success("There was an error while saving data to the timeline", "Timeline Error");
                    }
                });
            };

            //SELECT ONE RECORD MODAL
            $scope.selectOneRecord = function () {
                var modalInstance = $uibModal.open({
                    scope: $scope,
                    templateUrl: '/frontend/views/modal/select-one-record.html',
                    size: 'lg',
                    backdrop: 'static'
                });
            };

            //Refresh timeline
            $scope.refreshTimeline = function () {
                $state.reload();
            };
        }
    };
});


firstapp.directive('whenScrolled', function () {
    return function (scope, elm, attr) {
        var raw = elm[0];
        elm.bind('scroll', function () {
            if (raw.scrollTop + raw.offsetHeight >= raw.scrollHeight) {
                scope.$apply(attr.whenScrolled);
            }
        });
    };
});

firstapp.directive('scrollToItem', function () {
    return {
        restrict: 'A',
        scope: {
            scrollTo: "@"
        },
        link: function (scope, $elm, attr) {
            // hide #back-top first
            $("#back-top").hide();

            // fade in #back-top
            $(function () {
                $(window).scroll(function () {
                    if ($(this).scrollTop() > 100) {
                        $('#back-top').fadeIn();
                    } else {
                        $('#back-top').fadeOut();
                    }
                });

                // scroll body to 0px on click
                $('#back-top a').click(function () {
                    $('#list-top').scrollTop(0);
                    $('body,html').animate({
                        scrollTop: 0
                    }, 800);
                    return false;
                });
            });
        }
    }
})

firstapp.directive('scrollToBottom', function () {
    return {
        restrict: 'A',
        scope: {
            scrollTo: "@"
        },
        link: function (scope, $elm, attr) {
            // hide #back-top first
            $("#back-bottom").show();

            // fade in #back-bottom
            $(function () {
                $(window).scroll(function () {
                    if ($(this).scrollTop() < 100) {
                        $('#back-bottom').fadeIn();
                    } else {
                        $('#back-bottom').fadeOut();
                    }
                });

                // scroll body to 0px on click
                $('#back-bottom a').click(function () {
                    // var scrollBottom = $("#list-top").scrollTop() + $("#list-top").height();
                    $('#list-top').scrollTop(500000);
                    $('body,html').animate({
                        scrollTop: 800
                    }, 0);

                    return false;
                });
            });
        }
    }
})

firstapp.directive('uploadImageNew', function ($http, $filter, $timeout) {
    return {
        templateUrl: '/frontend/views/directive/uploadFile.html',
        scope: {
            model: '=ngModel',
            callback: "&ngCallback"
        },
        link: function ($scope, element, attrs) {
            $scope.length = 0;
            $scope.showImage = function () {
                console.log($scope.image);
            };
            $scope.check = true;
            $scope.type = "img";
            $scope.isMultiple = false;
            $scope.inObject = false;
            if (attrs.multiple || attrs.multiple === "") {
                $scope.isMultiple = true;
                $("#inputImage").attr("multiple", "ADD");
            }
            if (attrs.noView || attrs.noView === "") {
                $scope.noShow = true;
            }
            // if (attrs.required) {
            //     $scope.required = true;
            // } else {
            //     $scope.required = false;
            // }

            $scope.$watch("image", function (newVal, oldVal) {

                isArr = _.isArray(newVal);
                if (!isArr && newVal && newVal.file) {
                    $scope.uploadNow(newVal);
                } else if (isArr && newVal.length > 0 && newVal[0].file) {

                    $timeout(function () {
                        console.log(oldVal, newVal);
                        console.log(newVal.length);
                        $scope.length = newVal.length;
                        _.each(newVal, function (newV, key) {
                            if (newV && newV.file) {
                                console.log("newV ", newV);
                                $scope.uploadNow(newV);
                            }
                        });
                    }, 100);

                }
            });

            if ($scope.model) {
                if (_.isArray($scope.model)) {
                    $scope.image = [];
                    _.each($scope.model, function (n) {
                        $scope.image.push({
                            url: n
                        });
                    });
                } else {
                    if (_.endsWith($scope.model, ".pdf")) {
                        $scope.type = "pdf";
                    }
                }

            }
            if (attrs.inobj || attrs.inobj === "") {
                $scope.inObject = true;
            }
            $scope.clearOld = function () {
                $scope.model = [];
            };
            $scope.uploadNow = function (image) {
                $scope.uploadStatus = "uploading";

                var Template = this;
                image.hide = true;
                var formData = new FormData();
                formData.append('file', image.file, image.name);
                $http.post(uploadurl, formData, {
                    headers: {
                        'Content-Type': undefined
                    },
                    transformRequest: angular.identity
                }).success(function (data) {

                    $scope.uploadStatus = "uploaded";
                    if ($scope.isMultiple) {

                        if ($scope.inObject) {
                            $scope.model.push({
                                "image": data.data[0]
                            });
                        } else {
                            if (!$scope.model) {
                                $scope.clearOld();
                            }
                            $scope.model.push(data.data[0]);
                            console.log('$scope.model', $scope.model);
                        }
                    } else {
                        if (_.endsWith(data.data, ".pdf")) {
                            $scope.type = "pdf";
                        } else {
                            $scope.type = "img";
                        }
                        $scope.model = data.data;
                        console.log('$scope.model', $scope.model);
                    }
                    $timeout(function () {
                        $scope.callback({
                            'img': data.data[0],
                            'length': $scope.length
                        });
                    }, 100);

                });
            };
        }
    };
});

// firstapp.directive('generatePdf', function ($http, $filter, $timeout) {
//     return {
//         templateUrl: '/frontend/views/pdf/new-ila.html',
//         scope: {
//             model: '=ngModel',
//             callback: "&ngCallback"
//         },
//         link: function ($scope, element, attrs) {
//         var pdf = new jsPDF();
//         // var pdf = new jsPDF({
//         //     orientation: 'landscape',
//         //     unit: 'in',
//         //     format: [4, 2]
//         // });
//         var margin = {
//             top: 10,
//             bottom: 20,
//             left: 10,
//             width: 522
//         };
//         console.log('template',document.body);
//         // $scope.formDatas="Hero!!!";
//         $http.get("frontend/views/pdf/new-ila.html")
//             .then(function (response) {
//                 console.log("response",response);
//                 pdf.fromHTML(document.body, margin.top, margin.left, {
//                     pagesplit: true
//                 }, function () {
//                     // pdf.text('Hello world!', 10, 10)
//                     pdf.save('ILA' + '.pdf');
//                 });
//             });
//             // console.log('$scope , ',$scope, 'element',element,"attrs", attrs);
//         }
//     };
// });

// firstappdirective("limitTo", [function() {
//     return {
//         restrict: "A",
//         link: function(scope, elem, attrs) {
//             var limit = parseInt(attrs.limitTo);
//             angular.element(elem).on("keypress", function(e) {
//                 if (this.value.length == limit) e.preventDefault();
//             });
//         }
//     }
// }]);
firstapp.directive('onlyDigits', function () {
    return {
        require: 'ngModel',
        restrict: 'A',
        link: function (scope, element, attr, ctrl) {
            function inputValue(val) {
                var digits;
                if (val) {
                    if (attr.type == "text") {
                        digits = val.replace(/[^0-9\+\\]/g, '');
                    } else {
                        digits = val.replace(/[^0-9\-\\]/g, '');
                    }


                    if (digits !== val) {
                        ctrl.$setViewValue(digits);
                        ctrl.$render();
                    }
                    return parseInt(digits, 10);
                }
                return undefined;
            }
            ctrl.$parsers.push(inputValue);
        }
    };
});


firstapp.filter('propsFilter', function () {
    return function (items, props) {
        var out = [];

        if (angular.isArray(items)) {
            items.forEach(function (item) {
                var itemMatches = false;

                var keys = Object.keys(props);
                for (var i = 0; i < keys.length; i++) {
                    var prop = keys[i];
                    var text = props[prop].toLowerCase();
                    if (item[prop].toString().toLowerCase().indexOf(text) !== -1) {
                        itemMatches = true;
                        break;
                    }
                }

                if (itemMatches) {
                    out.push(item);
                }
            });
        } else {
            // Let the output be the input untouched
            out = items;
        }

        return out;
    };
});

firstapp.directive('img', function ($compile, $parse) {
    return {
        restrict: 'E',
        replace: false,
        link: function ($scope, element, attrs) {
            var $element = $(element);
            if (!attrs.noloading) {
                $element.after("<img src='frontend/img/loading.gif' class='loading' />");
                var $loading = $element.next(".loading");
                $element.load(function () {
                    $loading.remove();
                    $(this).addClass("doneLoading");
                });
            } else {
                $($element).addClass("doneLoading");
            }
        }
    };
});

firstapp.directive('fancyboxBox', function ($document) {
    return {
        restrict: 'EA',
        replace: false,
        link: function (scope, element, attr) {
            var $element = $(element);
            var target;
            if (attr.rel) {
                target = $("[rel='" + attr.rel + "']");
            } else {
                target = element;
            }

            target.fancybox({
                openEffect: 'fade',
                closeEffect: 'fade',
                closeBtn: true,
                helpers: {
                    media: {}
                }
            });
        }
    };
});

firstapp.directive('fancybox', function ($compile, $parse) {
    return {
        restrict: 'EA',
        replace: false,
        link: function ($scope, element, attrs) {
            $element = $(element);
            console.log("Checking Fancybox");
            setTimeout(function () {
                $(".various").fancybox({
                    maxWidth: 800,
                    maxHeight: 600,
                    fitToView: false,
                    overflow: 'hidden',
                    width: '70%',
                    height: '70%',
                    autoSize: false,
                    closeClick: false,
                    openEffect: 'none',
                    closeEffect: 'none'
                });
            }, 100);
        }
    };
});

firstapp.directive('menuOptions', function ($document) {
    return {
        restrict: 'C',
        replace: false,
        link: function (scope, element, attr) {
            var $element = $(element);
            $(element).on("click", function () {
                $(".side-header.opened-menu").toggleClass('slide-menu');
                $(".main-content").toggleClass('wide-content');
                $("footer").toggleClass('wide-footer');
                $(".menu-options").toggleClass('active');
            });

        }
    };
});


firstapp.filter('serverimage', function () {
    return function (input, width, height, style) {
        if (input) {
            if (input.substr(0, 4) == "http") {
                return input;
            } else {
                // if (_.isEmpty(width)) {
                //     width = 100;
                // }
                image = imgpath + "?file=" + input;
                if (width) {
                    image += "&width=" + width;
                }
                if (height) {
                    image += "&height=" + height;
                }
                if (style) {
                    image += "&style=" + style;
                }
                return image;
            }

        } else {
            return "frontend/img/logo.png";
        }
    };
});



firstapp.filter('base64url', function (base64) {
    return function (input) {
        if (input) {
            return base64.urldecode(input);
        } else {
            return "";
        }

    };
});

firstapp.filter('convDate', function () {
    return function (input) {
        return new Date(input);
    };
});

firstapp.filter('downloadImage', function () {
    return function (input) {
        if (input) {
            return adminurl + "download/" + input;
        } else {
            return "frontend/img/logo.png";
        }
    };
});
firstapp.filter('downloadImageWithName', function () {
    return function (input, name) {
        if (input) {
            return adminurl + "downloadWithName/" + input + "?name=" + name;
        } else {
            return "frontend/img/logo.png";
        }
    };
});
firstapp.filter('readUnread', function () {
    return function (input) {
        var check = false;
        if (input) {
            _.each(input, function (n) {
                if (n == "UNREAD") {
                    check = "unread-mail";
                }
            });
            return check;
        } else {
            return check;
        }
    };
});

firstapp.filter('from', function () {
    return function (input, data) {
        var returnString = "Unknown";
        if (input) {
            _.each(input, function (n) {
                if (n.name == data) {
                    returnString = n.value;
                }
            });
            return returnString;
        } else {
            return "Unknown";
        }
    };
});

firstapp.directive('oI', function ($document) {
    return {
        restrict: 'C',
        replace: false,
        link: function (scope, element, attr) {
            var $element = $(element);
            $element.click(function () {
                $element.parent().siblings().children("ul").slideUp();
                $element.parent().siblings().removeClass("active");
                $element.parent().children("ul").slideToggle();
                $element.parent().toggleClass("active");
                return false;
            });

        }
    };
});

firstapp.directive('slimscroll', function ($document) {
    return {
        restrict: 'EA',
        replace: false,
        link: function (scope, element, attr) {
            var $element = $(element);
            $element.slimScroll({
                height: '400px',
                wheelStep: 10,
                size: '2px'
            });
        }
    };
});

firstapp.directive('addressForm', function ($document) {
    return {
        templateUrl: '/frontend/views/directive/address-form.html',
        scope: {
            formData: "=ngModel",
            demoForm: "=ngValid"
        },
        restrict: 'EA',
        replace: false,
        controller: function ($scope, NgMap, NavigationService) {

            $scope.map = {};
            $scope.change = function () {
                NgMap.getMap().then(function (map) {
                    var latLng = {
                        lat: map.markers[0].position.lat(),
                        lng: map.markers[0].position.lng()
                    };
                    _.assign($scope.formData, latLng);
                });
            };
            var value2 = "a";
            $scope.populateAddress = function (data, value) {
                console.log($scope.formData);
                var id = data;
                // Start
                if (value2 === data) {} else {
                    if (data !== undefined && id !== "") {
                        value2 = data;
                        NavigationService.getOneModel(value, id, function (data) {
                            console.log("Before", $scope.formData.district, $scope.formData.state, $scope.formData.zone, $scope.formData.country);
                            $scope.formData = {};
                            if (value === "City") {
                                console.log("dfhajshwfaljhdsk")

                                $scope.formData.country = data.data.district.state.zone.country._id;
                                $scope.formData.zone = data.data.district.state.zone._id;
                                $scope.formData.state = data.data.district.state._id;
                                $scope.formData.district = data.data.district._id;
                                //      $scope.$apply(function(){
                                //          $scope.formData = _.clone($scope.formData);
                                //    });
                                // $scope.$apply();
                                console.log("After", $scope.formData.district, $scope.formData.state, $scope.formData.zone, $scope.formData.country);
                            } else if (value === "District") {
                                $scope.formData.country = data.data.state.zone.country._id;
                                $scope.formData.zone = data.data.state.zone._id;
                                $scope.formData.state = data.data.state._id;
                            } else if (value === "State") {
                                $scope.formData.country = data.data.zone.country._id;
                                $scope.formData.zone = data.data.zone._id;
                            } else {
                                $scope.formData.country = data.data.country._id;
                            }
                        });
                    } else {
                        console.log("Invalid Address");
                    }
                }


            }



            var LatLongi = 0;
            $scope.getLatLng = function (address) {

                console.log("getLatLng Funct Enter param", address + " ,");
                NavigationService.getLatLng(address, ++LatLongi, function (data, i) {
                    console.log("geometry Data", data);
                    if (i == LatLongi) {
                        $scope.formData.formatted_address = data.results[0].formatted_address;
                        $scope.formData = _.assign($scope.formData, data.results[0].geometry.location);
                        console.log("In function App", $scope.formData);
                    }
                });
                // $http.get("http://maps.googleapis.com/maps/api/geocode/json?key=AIzaSyCn9ypqFNxdXt9Zu2YqLcdD1Xdt2wNul9s&address="+address);
            };

        },
    };
});

var aa = {};
firstapp.directive('multipleSelect', function ($document, $timeout) {
    return {
        templateUrl: '/frontend/views/directive/multiple-select.html',
        scope: {
            model: '=ngModel',
            api: "@api",
            name: "@name",
            required: "@required",
            filter: "@filter",
            ngName: "=ngName",
            create: "@ngCreate",
            filterName: "@filterName",
            fieldName: "=fieldName",
            newModel: "=newModel"
        },
        restrict: 'EA',
        replace: false,
        controller: 'selectFromTableCtrl',
        link: function (scope, element, attr, NavigationService) {

            var $element = $(element);
            scope.activeKey = 0;
            scope.isRequired = true;
            if (scope.required === undefined) {
                scope.isRequired = false;
            }
            scope.typeselect = attr.typeselect;
            aa = $element;
            var maxItemLength = 40;
            var maxBoxLength = 200;
            $timeout(function () {

                $element.find(".typeText").keyup(function (event) {
                    var scrollTop = $element.find("ul.allOptions").scrollTop();
                    var optionLength = $element.find("ul.allOptions li").length;
                    if (event.keyCode == 40) {
                        scope.activeKey++;
                    } else if (event.keyCode == 38) {
                        scope.activeKey--;
                    } else if (event.keyCode == 13) {
                        $element.find("ul.allOptions li").eq(scope.activeKey).trigger("click");
                    }
                    if (scope.activeKey < 0) {
                        scope.activeKey = optionLength - 1;
                    }
                    if (scope.activeKey >= optionLength) {
                        scope.activeKey = 0;
                    }
                    var newScroll = -1;
                    var scrollVisibility = (scrollTop + maxBoxLength) - maxItemLength;
                    var currentItemPosition = scope.activeKey * maxItemLength;
                    if (currentItemPosition < scrollTop) {
                        newScroll = (maxItemLength * scope.activeKey);

                    } else if (currentItemPosition > scrollVisibility) {
                        newScroll = (maxItemLength * scope.activeKey);

                    }
                    if (newScroll != -1) {
                        $element.find("ul.allOptions").scrollTop(newScroll);
                    }

                    scope.$apply();
                });

            }, 100);

        }
    };
});

firstapp.filter('ageFilter', function () {
    function calculateAge(birthday) { // birthday is a date
        var ageDifMs = Date.now() - birthday.getTime();
        var ageDate = new Date(ageDifMs); // miliseconds from epoch
        return Math.abs(ageDate.getUTCFullYear() - 1970);
    }

    return function (birthdate) {
        return calculateAge(birthdate);
    };
});
firstapp.filter('Date', function () {
    return function (input) {
        var retText = moment(new Date(input)).add(5, "hours").add(30, "minutes").format("DD/MM/YYYY");
        return retText;
    };
});
firstapp.filter('DateFormat', function () {
    return function (input) {
        var retText = moment(input).subtract(5, "hours").subtract(30, "minutes").format("DD/MM/YYYY");
        return retText;
    };
});
firstapp.filter('Time', function () {
    return function (input) {
        var retText = moment(new Date(input)).add(5, "hours").add(30, "minutes").format("DD/MM/YYYY");
        return retText;
    };
});
firstapp.filter('DateTime', function () {
    return function (input) {
        var retText = moment(new Date(input)).format("DD/MM/YY, HH:mm");
        return retText;
    };
});
firstapp.filter('capitalize', function () {
    return function (input, all) {
        var reg = (all) ? /([^\W_]+[^\s-]*) */g : /([^\W_]+[^\s-]*)/;
        return (!!input) ? input.replace(reg, function (txt) {
            return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
        }) : '';
    };
});
firstapp.filter('boldElements', function () {
    return function (input) {
        var textArr = _.split(input, ",");
        var retText = "";
        _.each(textArr, function (n, key) {
            if (key % 2 == 1) {
                retText = retText + "<b>" + n + "</b>, "
            } else {
                retText = retText + n + ", "
            }
        });

        retText = retText.substr(0, retText.length - 2);
        return retText;
    };
});

firstapp.config(function ($translateProvider) {
    $translateProvider.translations('en', LanguageEnglish);
    $translateProvider.translations('hi', LanguageHindi);
    $translateProvider.preferredLanguage('en');
});


firstapp.directive('alphaNumericVehical', function () {
    return {
        require: 'ngModel',
        link: function (scope, element, attr, ngModelCtrl) {
            function fromUser(text) {
                var transformedInput = text.replace(/[^0-9A-Za-z,]/g, '');
                if (transformedInput !== text) {
                    ngModelCtrl.$setViewValue(transformedInput);
                    ngModelCtrl.$render();
                }
                return transformedInput; // or return Number(transformedInput)
            }
            ngModelCtrl.$parsers.push(fromUser);
        }
    };
});
firstapp.directive('replace', function () {
    return {
        require: 'ngModel',
        scope: {
            regex: '@replace',
            with: '@with'
        },
        link: function (scope, element, attrs, model) {
            model.$parsers.push(function (val) {
                if (!val) {
                    return;
                }
                var regex = new RegExp(scope.regex);
                var replaced = val.replace(regex, scope.with);
                if (replaced !== val) {
                    model.$setViewValue(replaced);
                    model.$render();
                }
                return replaced;
            });
        }
    };
});
firstapp.filter('limitChar', function () {
    return function (content, length, tail) {
        if (isNaN(length))
            length = 50;

        if (tail === undefined)
            tail = "...";

        if (content.length <= length || content.length - tail.length <= length) {
            return content;
        } else {
            return String(content).substring(0, length - tail.length) + tail;
        }
    };
});