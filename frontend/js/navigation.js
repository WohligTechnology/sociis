var imgurl = adminurl + "upload/";
var imgpath = imgurl + "readFile";
var uploadurl = imgurl;
var mobileUrl = adminurl + "mobile/index.html";

var navigationservice = angular.module('navigationservice', [])
    .factory('NavigationService', function ($http, $q, $timeout) {
        var navigation = [{
                name: "Role",
                classis: "active",
                anchor: "role",
                icon: "envelope",
                subnav: [{
                    name: "Roles",
                    classis: "active",
                    anchor: "roles-list",
                    icon: "inbox"
                }]
            }, {
                name: "Product",
                classis: "active",
                anchor: "finance",
                icon: "line-chart",
                subnav: [{
                    name: "Item",
                    classis: "active",
                    anchor: "invoiceExpenditure-list",
                    icon: "shopping-basket"
                }]
            }, {
                name: "Customers",
                classis: "active",
                anchor: "customer",
                icon: "users",
                subnav: [{
                    name: "Customer",
                    classis: "active",
                    anchor: "customer-list",
                    icon: "user"
                }]
            }, {
                name: "Employee",
                classis: "active",
                anchor: "employee",
                icon: "user",
                subnav: [{
                    name: "Employee",
                    classis: "active",
                    anchor: "employee-list",
                    icon: "user"
                }]
            },
            {
                name: "Invoice",
                classis: "active",
                anchor: "invoice",
                icon: "pencil",
                subnav: [{
                    name: "Invoice",
                    classis: "active",
                    anchor: "invoice-list",
                    icon: "book"
                }]
            }, {
                name: "Shop",
                classis: "active",
                anchor: "shop",
                icon: "pencil",
                subnav: [{
                    name: "Shop",
                    classis: "active",
                    anchor: "shop-list",
                    icon: "book"
                }]
            }, {
                name: "Payment",
                classis: "active",
                anchor: "payment",
                icon: "money",
                subnav: [{
                    name: "Payment",
                    classis: "active",
                    anchor: "payment-list",
                    icon: "money"
                }]
            }, {
                name: "Marketing",
                classis: "active",
                anchor: "marketing",
                icon: "line-chart",
                subnav: [{
                    name: "Marketing",
                    classis: "active",
                    anchor: "marketing-list",
                    icon: "shopping-basket"
                }]
            }
        ];
        var membershipLevel = [{
            name: "Student",
            id: "Student"
        }, {
            name: "Licentiate",
            id: "Licentiate"
        }, {
            name: "Associate",
            id: "Associate"
        }];

        function isViewHidden(nav, role) {
            stateName = nav.anchor;
            var data = {};
            data.currentRole = _.filter(role.roles, function (n) {
                var index = _.indexOf(n.states, stateName);
                if (index >= 0) {
                    return true;
                } else {
                    return false;
                }
            });
            if (data.currentRole.length > 0) {
                var value = false;
                _.each(data.currentRole, function (n) {
                    if (n.view.val) {
                        value = true;
                    }
                });
                nav.isView = value;
            }
        }

        function getRoleSingle(roles) {
            var retRole = {
                roles: []
            };

            function addToRoles(objRole) {
                var indexOf = _.findIndex(retRole.roles, function (singleRole) {
                    return (singleRole.mainMenu == objRole.mainMenu && singleRole.subMenu == objRole.subMenu && singleRole.subThirdMenu == objRole.subThirdMenu);
                });
                if (indexOf >= 0) {
                    var singleRole = retRole.roles[indexOf];
                    _.each(objRole, function (singleObj, objKey) {
                        if (_.isPlainObject(singleObj)) {
                            singleRole[objKey].isExist = singleObj.isExist || singleRole[objKey].isExist;
                            singleRole[objKey].val = singleObj.val || singleRole[objKey].val;
                        }
                    });

                } else {
                    retRole.roles.push(objRole);
                }
            }

            _.each(roles, function (role, key) { // this is the whole role function 
                _.each(role.roles, function (singleRole) { // this is single role
                    addToRoles(singleRole);
                }); // this is single role
            }); // this is the whole role ended

            return retRole;
        }


        return {
            // Actually Used
            login: function (data, callback) {
                $http.post(adminurl + 'Employee/Login', data).success(function (data) {
                    if (data.value === true) {
                        if (data.data.Is == "Customer") {
                            var temp = data.data;
                            $http.post(adminurl + 'Role/getRoleByName', temp).success((rolesData) => {
                                console.log("rolesforcustomer", rolesData);
                                if (rolesData.value == true) {
                                    data.data.role = rolesData.data;
                                    $.jStorage.set("getLoginEmployee", data.data);
                                    var newRole = getRoleSingle(data.data.role);
                                    $.jStorage.set("role", newRole);
                                    callback(data);
                                }
                            });
                        } else {
                            $.jStorage.set("getLoginEmployee", data.data);
                            var newRole = getRoleSingle(data.data.role);
                            $.jStorage.set("role", newRole);
                            callback(data);
                        }
                    }
                });
            },
            // 
            getRoleSingle: function (arr) {
                return getRoleSingle(arr);
            },
            getnav: function () {
                var approvalPendingCount = 0;
                var surveyApprovals = 0;
                var ilaApprovals = 0;
                var lorApprovals = 0;
                var invoiceApprovals = 0;
                var assignmentApprovals = 0;
                formData = {};
                formData.isSBC = $.jStorage.get("getLoginEmployee").isSBC;
                formData.ownerId = $.jStorage.get("getLoginEmployee")._id;

                return navigation;
            },
            getNavByRole: function (role) {
                _.each(navigation, function (nav) {
                    isViewHidden(nav, role);
                    _.each(nav.subnav, function (subnav) {
                        isViewHidden(subnav, role);
                    });
                });
            },
            parseAccessToken: function (data, callback) {
                if (data) {
                    $.jStorage.set("accessToken", data);
                    callback();
                }
            },
            removeAccessToken: function (data, callback) {
                $.jStorage.flush();
            },
            gmailCall: function (data, callback) {
                data.accessToken = $.jStorage.get("accessToken");
                $http.post(adminurl + 'user/listEmail', data).success(callback);
            },
            setGlobalAssignmentStatusForMigration: function (data, callback) {
                data.accessToken = $.jStorage.get("accessToken");
                $http.post(adminurl + 'Assignment/setGlobalAssignmentStatusForMigration', data).success(callback);
            },
            detailEmail: function (data, callback) {
                data.accessToken = $.jStorage.get("accessToken");
                $http.post(adminurl + 'user/detailEmail', data).success(callback);
            },
            sendEmail: function (data, callback) {
                data.accessToken = $.jStorage.get("accessToken");
                $http.post(adminurl + 'user/sendEmail', data).success(callback);
            },
            updateEmailStatus: function (data, callback) {
                console.log("data email", data);
                $http.post(adminurl + 'timeline/updateEmailStatus', data).success(callback);
            },
            profile: function (callback, errorCallback) {

                $http.post(adminurl + 'Employee/getLoginEmployee', data).success(function (data) {
                    $.jStorage.set("getLoginEmployee", data.data);
                    var newRole = getRoleSingle(data.data.role);
                    $.jStorage.set("role", newRole);
                    callback();
                });

            },
            makeactive: function (menuname) {
                for (var i = 0; i < navigation.length; i++) {
                    if (navigation[i].name == menuname) {
                        navigation[i].classis = "active";
                    } else {
                        navigation[i].classis = "";
                    }
                }
                return menuname;
            },
            getInsurer: function (callback) {
                $http.post(adminurl + 'customerCompany/getInsurer', {}).success(callback);
            },
            searchEmployee: function (formData, i, callback) {
                // console.log("formData : ", formData);
                formData.accessToken = $.jStorage.get("accessToken");
                $http.post(adminurl + 'Employee/search', formData).success(function (data) {
                    callback(data, i);
                });
            },
            searchInvoice: function (formData, i, callback) {
                $http.post(adminurl + 'Invoice/search', formData).success(function (data) {
                    callback(data, i);
                });
            },
            searchPayment: function (formData, i, callback) {
                $http.post(adminurl + 'Payment/search', formData).success(function (data) {
                    callback(data, i);
                });
            },
            searchEmployees: function (formData, i, callback) {
                // console.log("formData : ", formData);
                formData.accessToken = $.jStorage.get("accessToken");
                $http.post(adminurl + 'Employee/searchEmployee', formData).success(function (data) {
                    callback(data, i);
                });
            },
            searchLorCategory: function (formData, i, callback) {
                formData.accessToken = $.jStorage.get("accessToken");
                $http.post(adminurl + 'LorCategory/search', formData).success(function (data) {
                    callback(data, i);
                });
            },
            mobileSubmit: function (formData, callback) {
                console.log("formData : ", formData);
                $http.post(adminurl + 'Assignment/mobileSubmit', formData).success(function (data) {
                    callback(data);
                });
            },
            editSurvey: function (formData, callback) {
                console.log("formData : ", formData);
                $http.post(adminurl + 'Assignment/editSurvey', formData).success(function (data) {
                    callback(data);
                });
            },
            employeeSearch: function (formData, i, callback) {
                console.log("formData : ", formData);
                formData.accessToken = $.jStorage.get("accessToken");
                $http.post(adminurl + 'Employee/employeeSearch', formData).success(function (data) {
                    callback(data, i);
                });
            },
            getEmployeeNameEmail: function (formData, i, callback) {
                console.log("formData : ", formData);
                formData.accessToken = $.jStorage.get("accessToken");
                $http.post(adminurl + 'Employee/getEmployeeNameEmail', formData).success(function (data) {
                    callback(data, i);
                });
            },

            getAccordianData: function (callback) {
                $http.post(adminurl + 'LorCategory/getAccordianData').success(function (data) {
                    callback(data);
                });
            },

            getBackendEmployee: function (formData, i, callback) {
                console.log("FormData in search", formData);
                formData.accessToken = $.jStorage.get("accessToken");
                // $http.post(adminurl + 'Employee/getBackendEmployee', formData).success(function (data) {
                $http.post(adminurl + 'Employee/getBackendEmployee', formData).success(function (data) {
                    console.log("FormData in search", data);
                    callback(data, i);
                });
            },
            getShareWith1: function (formData, i, callback) {
                console.log("FormData in search", formData);
                formData.accessToken = $.jStorage.get("accessToken");
                // $http.post(adminurl + 'Employee/getBackendEmployee', formData).success(function (data) {
                $http.post(adminurl + 'Employee/getShareWith1', formData).success(function (data) {
                    console.log("FormData in search", data);
                    callback(data, i);
                });
            },
            getBackendEmployeeOnly: function (formData, i, callback) {
                console.log("FormData in search", formData);
                formData.accessToken = $.jStorage.get("accessToken");
                $http.post(adminurl + 'Employee/getBackendEmployeeOnly', formData).success(function (data) {
                    console.log("FormData in search", data);
                    callback(data, i);
                });
            },
            updateNewSurveyor: function (formData, callback) {
                formData.accessToken = $.jStorage.get("accessToken");
                console.log("formData : ", formData);
                $http.post(adminurl + 'Assignment/updateNewSurveyor', formData).success(function (data) {
                    callback(data);
                });
            },
            removeSurveyor: function (formData, callback) {
                formData.accessToken = $.jStorage.get("accessToken");
                console.log("formData : ", formData);
                $http.post(adminurl + 'Assignment/removeSurveyor', formData).success(function (data) {
                    callback(data);
                });
            },
            searchAssignment: function (formData, i, callback) {
                formData.accessToken = $.jStorage.get("accessToken");
                $http.post(adminurl + 'Assignment/search', formData).success(function (data) {
                    callback(data, i);
                });
            },
            getMRNumbers: function (formData, i, callback) {
                formData.ownerId = $.jStorage.get("getLoginEmployee")._id;
                formData.accessToken = $.jStorage.get("accessToken");
                $http.post(adminurl + 'Assignment/getMRNumbers', formData).success(function (data) {
                    callback(data, i);
                });
            },
            getMRNames: function (formData, i, callback) {
                formData.ownerId = $.jStorage.get("getLoginEmployee")._id;
                formData.accessToken = $.jStorage.get("accessToken");
                $http.post(adminurl + 'Assignment/getMRNames', formData).success(function (data) {
                    callback(data, i);
                });
            },
            searchLogistic: function (formData, i, callback) {
                formData.accessToken = $.jStorage.get("accessToken");
                $http.post(adminurl + 'Assignment/searchLogistic', formData).success(function (data) {
                    callback(data, i);
                });
            },

            getOneAssignment: function (formData, i, callback) {
                formData.accessToken = $.jStorage.get("accessToken");
                console.log("FormData in search", formData);
                $http.post(adminurl + 'Assignment/getOne', formData).success(function (data) {
                    callback(data, i);
                });
            },

            getApprovalListIla: function (formData, i, callback) {
                formData.accessToken = $.jStorage.get("accessToken");
                $http.post(adminurl + 'Assignment/getApprovalListIla', formData).success(function (data) {
                    callback(data, i);
                });
            },
            getApprovalListLor: function (formData, i, callback) {
                formData.accessToken = $.jStorage.get("accessToken");
                $http.post(adminurl + 'Assignment/getApprovalListLor', formData).success(function (data) {
                    callback(data, i);
                });
            },
            getAssignmentApprovalList: function (formData, i, callback) {
                $http.post(adminurl + 'Assignment/getAssignmentApprovalList', formData).success(function (data) {
                    callback(data, i);
                });
            },
            getInvoiceApprovalList: function (formData, i, callback) {
                $http.post(adminurl + 'Invoice/getInvoiceApprovalList', formData).success(function (data) {
                    callback(data, i);
                });
            },
            getSurveyorApprovalList: function (formData, i, callback) {
                formData.isSBC = $.jStorage.get("getLoginEmployee").isSBC;
                formData.ownerId = $.jStorage.get("getLoginEmployee")._id;
                formData.accessToken = $.jStorage.get("accessToken");
                $http.post(adminurl + 'Assignment/getSurveyorApprovalList', formData).success(function (data) {
                    callback(data, i);
                });
            },
            getSurveyor: function (formData, i, callback) {
                formData.accessToken = $.jStorage.get("accessToken");
                $http.post(adminurl + 'Employee/getSurveyor', formData).success(function (data) {
                    console.log("Data", data);
                    callback(data, i);
                });
            },

            searchPopulatedCity: function (formData, i, callback) {
                formData.accessToken = $.jStorage.get("accessToken");
                $http.post(adminurl + 'city/populateCityDetails', formData).success(function (data) {
                    callback(data, i);
                });
            },

            searchPopulatedProduct: function (formData, i, callback) {
                formData.accessToken = $.jStorage.get("accessToken");
                $http.post(adminurl + 'product/populateProductDetails', formData).success(function (data) {
                    callback(data, i);
                });
            },

            searchNatureLoss: function (formData, i, callback) {
                formData.accessToken = $.jStorage.get("accessToken");
                $http.post(adminurl + 'NatureLoss/search', formData).success(function (data) {
                    callback(data, i);
                });
            },
            getMembership: function (formData, i, callback) {
                formData.accessToken = $.jStorage.get("accessToken");
                $http.post(adminurl + 'Membership/search', formData).success(function (data) {
                    callback(data, i);
                });
            },
            searchInsuredOffice: function (formData, i, callback) {
                formData.segment = "Insured";
                $http.post(adminurl + 'Customer/getSegmented', formData).success(function (data) {
                    callback(data, i);
                });
            },
            searchInsurerOffice: function (formData, i, callback) {
                console.log("AAAAAAAA", formData);
                formData.accessToken = $.jStorage.get("accessToken");
                $http.post(adminurl + 'CustomerCompany/search', formData).success(function (data) {
                    callback(data, i);
                });
            },
            searchTags: function (formData, i, callback) {
                console.log("AAAAAAAA");
                formData.accessToken = $.jStorage.get("accessToken");
                $http.post(adminurl + 'Tag/search', formData).success(function (data) {
                    console.log("Data", data);
                    callback(data, i);
                });
            },
            searchBroker: function (formData, i, callback) {
                formData.accessToken = $.jStorage.get("accessToken");
                formData.segment = "Broker";
                $http.post(adminurl + 'Customer/getSegmented', formData).success(function (data) {
                    callback(data, i);
                });
            },
            getNature: function (formData, i, callback) {
                formData.accessToken = $.jStorage.get("accessToken");
                $http.post(adminurl + 'NatureLoss/search', formData).success(function (data) {
                    callback(data, i);
                });
            },
            saveNature: function (data, callback) {
                data.accessToken = $.jStorage.get("accessToken");
                $http.post(adminurl + 'NatureLoss/save', data).success(callback);
            },
            saveChat: function (data, callback) {
                data.accessToken = $.jStorage.get("accessToken");
                $http.post(adminurl + 'Timeline/save', data).success(callback);
            },
            updateTimeline: function (data, callback) {
                data.accessToken = $.jStorage.get("accessToken");
                $http.post(adminurl + 'Timeline/updateTimeline', data).success(callback);
            },
            //Nilesh
            saveTimelineAndAssignment: function (id, callback) {
                $http.post(adminurl + 'timeline/saveTimelineAndAssignment', {
                    "assignment": id,
                    accessToken: $.jStorage.get("accessToken")
                }).success(callback);
            },

            //end
            createTimeline: function (data, callback) {
                var timeline = {};
                timeline.assignment = data;
                timeline.chat = [];
                timeline.accessToken = $.jStorage.get("accessToken");
                $http.post(adminurl + 'Timeline/save', timeline).success(callback);
            },
            saveOfficer: function (data, callback) {
                data.accessToken = $.jStorage.get("accessToken");
                $http.post(adminurl + 'Officer/save', data).success(callback);
            },
            allDocsRecieved: function (data, callback) {
                data.accessToken = $.jStorage.get("accessToken");
                $http.post(adminurl + 'Assignment/allDocsRecieved', data).success(callback);
            },
            saveTemplate: function (data, callback) {
                data.accessToken = $.jStorage.get("accessToken");
                $http.post(adminurl + 'Template/save', data).success(callback);
            },
            saveAssignmentTemplate: function (data, callback) {
                var email = {
                    email: $.jStorage.get("profile").email,
                    name: $.jStorage.get("profile").name
                };
                data.users = email;
                data.accessToken = $.jStorage.get("accessToken");
                $http.post(adminurl + 'Assignment/saveTemplate', data).success(callback);
            },
            saveDraft: function (data, callback) {
                var email = {
                    email: $.jStorage.get("profile").email,
                    name: $.jStorage.get("profile").name
                };
                data.users = email;
                data.accessToken = $.jStorage.get("accessToken");
                $http.post(adminurl + 'Assignment/saveDraft', data).success(callback);
            },
            sentIlaLorForApproval: function (data, callback) {
                var email = {
                    email: $.jStorage.get("profile").email,
                    name: $.jStorage.get("profile").name
                };
                data.users = email;
                data.accessToken = $.jStorage.get("accessToken");
                $http.post(adminurl + 'Assignment/sentIlaLorForApproval', data).success(callback);
            },
            saveAndRegenerateIlaLor: function (data, callback) {
                var email = {
                    email: $.jStorage.get("profile").email,
                    name: $.jStorage.get("profile").name
                };
                data.users = email;
                data.accessToken = $.jStorage.get("accessToken");
                $http.post(adminurl + 'Assignment/saveAndRegenerateIlaLor', data).success(callback);
            },
            onlyLorForApproval: function (data, callback) {
                var email = {
                    email: $.jStorage.get("profile").email,
                    name: $.jStorage.get("profile").name
                };
                data.users = email;
                data.accessToken = $.jStorage.get("accessToken");
                $http.post(adminurl + 'Assignment/onlyLorForApproval', data).success(callback);
            },
            uploadAssessment: function (data, callback) {
                console.log("uploadAssessment ", data);
                var email = {
                    email: $.jStorage.get("profile").email,
                    name: $.jStorage.get("profile").name
                };
                data.users = email;
                data.accessToken = $.jStorage.get("accessToken");
                $http.post(adminurl + 'Assignment/uploadAssessment', data).success(callback);
            },
            transferAssignment: function (data, callback) {
                console.log("transferAssignment ", data);
                var email = {
                    email: $.jStorage.get("profile").email,
                    name: $.jStorage.get("profile").name
                };
                data.users = email;
                data.accessToken = $.jStorage.get("accessToken");
                $http.post(adminurl + 'Assignment/transferAssignment', data).success(callback);
            },
            calcGlobalAssignmentStatus: function (data, callback) {
                $http.post(adminurl + 'Assignment/calcGlobalAssignmentStatus', data).success(callback);
            },
            calcAssignmentStatusForInvoiceCreation: function (data, callback) {
                $http.post(adminurl + 'Assignment/calcAssignmentStatusForInvoiceCreation', data).success(callback);
            },
            ilaLorApproval: function (data, callback) {
                var email = {
                    email: $.jStorage.get("profile").email,
                    name: $.jStorage.get("profile").name
                };
                data.users = email;
                data.accessToken = $.jStorage.get("accessToken");
                $http.post(adminurl + 'Assignment/ilaLorApproval', data).success(callback);
            },
            getPdfPreview: function (data, callback) {
                var email = {
                    email: $.jStorage.get("profile").email,
                    name: $.jStorage.get("profile").name
                };
                data.users = email;
                data.accessToken = $.jStorage.get("accessToken");
                $http.post(adminurl + 'Assignment/getPdfPreview', data).success(callback);
            },
            assignmentSave: function (data, callback) {
                if (data.policyDoc === "" || data.policyDoc === undefined) {
                    delete data.policyDoc;
                }
                var email = {
                    email: $.jStorage.get("profile").email,
                    name: $.jStorage.get("profile").name
                };
                data.users = email;
                data.accessToken = $.jStorage.get("accessToken");
                $http.post(adminurl + 'Assignment/save', data).success(callback);
            },
            saveEmployeeAssignment: function (data, callback) {
                data.accessToken = $.jStorage.get("accessToken");
                $http.post(adminurl + 'Employee/saveEmployeeAssignment', data).success(callback);
            },

            updateSurveyor: function (data, callback) {
                var email = {
                    email: $.jStorage.get("profile").email
                };
                data.users = email;
                data.accessToken = $.jStorage.get("accessToken");
                $http.post(adminurl + 'Assignment/updateSurveyor', data).success(callback);
            },
            submitApprovalForAccessButtons: function (data, callback) {
                var email = {
                    email: $.jStorage.get("profile").email
                };
                data.users = email;
                data.accessToken = $.jStorage.get("accessToken");
                $http.post(adminurl + 'Assignment/submitApprovalForAccessButtons', data).success(callback);
            },
            submitRequestForAccessButtons: function (data, callback) {
                var email = {
                    email: $.jStorage.get("profile").email
                };
                data.users = email;
                data.accessToken = $.jStorage.get("accessToken");
                $http.post(adminurl + 'Assignment/submitRequestForAccessButtons', data).success(callback);
            },
            surveyorSentForApproval: function (data, callback) {
                var email = {
                    email: $.jStorage.get("profile").email
                };
                data.users = email;
                data.accessToken = $.jStorage.get("accessToken");
                $http.post(adminurl + 'Assignment/surveyorSentForApproval', data).success(callback);
            },
            sbcApproval: function (data, callback) {
                var email = {
                    email: $.jStorage.get("profile").email
                };
                data.users = email;
                data.accessToken = $.jStorage.get("accessToken");
                $http.post(adminurl + 'Assignment/sbcApproval', data).success(callback);
            },
            createStatesForGST: function (callback) {
                data = {};
                data.accessToken = $.jStorage.get("accessToken");
                $http({
                    url: adminurl + 'customerCompany/createStatesForGST',
                    method: 'POST',
                    withCredentials: true,
                    data: data
                }).success(callback);
            },
            getGSTINDetails: function (formData, callback) {
                data = {};
                console.log("Nav Serv", formData);
                data.GSTINByState = formData;
                data.accessToken = $.jStorage.get("accessToken");
                $http({
                    url: adminurl + 'customerCompany/getGSTINDetails',
                    method: 'POST',
                    withCredentials: true,
                    data: data
                }).success(callback);
            },
            invoiceApproval: function (data, callback) {
                var email = {
                    email: $.jStorage.get("profile").email
                };
                data.users = email;
                data.accessToken = $.jStorage.get("accessToken");
                $http.post(adminurl + 'Assignment/invoiceApproval', data).success(callback);
            },
            generateInvoicePreview: function (data, callback) {
                var email = {
                    email: $.jStorage.get("profile").email
                };
                data.users = email;
                data.accessToken = $.jStorage.get("accessToken");
                $http.post(adminurl + 'Assignment/generateInvoicePreview', data).success(callback);
            },
            changeAssignmentApprovalStatus: function (data, callback) {
                var email = {
                    email: $.jStorage.get("profile").email
                };
                data.users = email;
                data.accessToken = $.jStorage.get("accessToken");
                $http.post(adminurl + 'Assignment/changeAssignmentApprovalStatus', data).success(callback);
            },
            rejectAssignmentApprovalStatus: function (data, callback) {
                var email = {
                    email: $.jStorage.get("profile").email
                };
                data.users = email;
                data.accessToken = $.jStorage.get("accessToken");
                $http.post(adminurl + 'Assignment/rejectAssignmentApprovalStatus', data).success(callback);
            },
            searchModel: function (model, formData, i, callback) {
                $http.post(adminurl + model + '/search', formData).success(function (data) {
                    callback(data, i);
                });
            },
            getCustomerProductDetailsAccordingToInvoices: function (formData, callback) {
                $http.post(adminurl + 'Invoice/getCustomerProductDetailsAccordingToInvoices', formData).success(function (data) {
                    callback(data);
                });
            },
            getAllAssignment: function (model, formData, i, callback) {
                formData.accessToken = $.jStorage.get("accessToken");
                $http.post(adminurl + model + '/getAll', formData).success(function (data) {
                    callback(data, i);
                });
            },
            getAllInvoices: function (model, formData, i, callback) {
                formData.accessToken = $.jStorage.get("accessToken");
                $http.post(adminurl + 'Invoice/getAll', formData).success(function (data) {
                    callback(data, i);
                });
            },
            getAllCustomer: function (formData, callback) {
                formData.accessToken = $.jStorage.get("accessToken");
                $http.post(adminurl + 'Customer/getAll', formData).success(function (data) {
                    callback(data);
                });
            },
            generateAssignmentExcel: function (model, formData, callback) {
                console.log("generateAssignmentExcel Nav", formData);
                formData.accessToken = $.jStorage.get("accessToken");
                $http({
                    url: adminurl + model + '/generateAssignmentExcel',
                    method: "GET",
                    params: formData
                }).success(function (data) {
                    console.log("Data of Excel");
                    callback(data);
                });

            },
            searchKnowledgeBase: function (model, formData, i, callback) {
                formData.accessToken = $.jStorage.get("accessToken");
                $http.post(adminurl + model + '/search', formData).success(function (data) {
                    callback(data, i);
                });
            },

            searchTag: function (formData, i, callback) {
                formData.accessToken = $.jStorage.get("accessToken");
                $http.post(adminurl + 'tag/search', formData).success(function (data) {
                    callback(data, i);
                });
            },
            searchModel1: function (model, formData, i, callback) {
                formData.accessToken = $.jStorage.get("accessToken");
                $http.post(adminurl + 'Tag/search', formData).success(function (data) {
                    console.log("i", i);
                    callback(data, i);
                });
            },
            getDepartment: function (callback) {
                $http.post(adminurl + 'Department/search', {}).success(callback);
            },
            searchCustomer: function (formData, i, callback) {
                _.each(formData.filter, function (n, key) {
                    if (n === "") {
                        n = undefined;
                    }
                });
                formData.accessToken = $.jStorage.get("accessToken");
                $http.post(adminurl + 'Customer/search', formData).success(function (data) {
                    callback(data, i);
                });
            },
            searchSegment: function (formData, i, callback) {
                formData.accessToken = $.jStorage.get("accessToken");
                $http.post(adminurl + 'Segment/search', formData).success(function (data) {
                    callback(data, i);
                });
            },
            searchMarketing: function (formData, i, callback) {
                $http.post(adminurl + 'Marketing/search', formData).success(function (data) {
                    callback(data, i);
                });
            },
            createInvoice: function (formData, callback) {
                $http.post(adminurl + 'Invoice/createInvoice', formData).success(function (err, data) {
                    callback(data);
                })
            },
            createPayment: function (formData, callback) {
                $http.post(adminurl + 'Payment/createPayment', formData).success(function (err, data) {
                    console.log("CreatePayment Data", data)
                    callback(data);
                })
            },
            searchShop: function (formData, i, callback) {
                // formData.accessToken = $.jStorage.get("accessToken");
                $http.post(adminurl + 'Shop/search', formData).success(function (data) {
                    callback(data, i);
                });
            },
            getAllItemsName: function (formData, callback) {
                $http.post(adminurl + 'InvoiceExpenditure/getAllItemsName', formData).success(function (data) {
                    callback(data);
                });
            },
            searchInsured: function (formData, i, callback) {
                formData.accessToken = $.jStorage.get("accessToken");
                $http.post(adminurl + 'CustomerCompany/getInsured', formData).success(function (data) {
                    callback(data, i);
                });
            },
            searchInsurer: function (formData, i, callback) {
                formData.accessToken = $.jStorage.get("accessToken");
                $http.post(adminurl + 'CustomerCompany/getInsurer', formData).success(function (data) {
                    callback(data, i);
                });
            },
            searchInsurerCustomerCompany: function (formData, i, callback) {
                formData.accessToken = $.jStorage.get("accessToken");
                $http.post(adminurl + 'CustomerCompany/getInsurer', formData).success(function (data) {
                    callback(data, i);
                });
            },
            searchInsurerCustomerCompany1: function (formData, i, callback) {
                formData.accessToken = $.jStorage.get("accessToken");
                $http.post(adminurl + 'PolicyType/getCompany', formData).success(function (data) {
                    callback(data, i);
                });
            },

            searchInsurerdCustomerCompany: function (formData, i, callback) {
                console.log("..........", formData);
                formData.accessToken = $.jStorage.get("accessToken");
                $http.post(adminurl + 'CustomerCompany/getInsured', formData).success(function (data) {
                    callback(data, i);
                });
            },
            searchBrokerCustomerCompany: function (formData, i, callback) {
                console.log(formData, "Broker");
                formData.accessToken = $.jStorage.get("accessToken");
                $http.post(adminurl + 'CustomerCompany/getBroker', formData).success(function (data) {
                    console.log(data);
                    callback(data, i);
                });

            },
            searchInsuredCustomerCompany: function (formData, i, callback) {
                formData.filter = {
                    customerSegment: "57c3ef916fb3c3420233a00b"
                }
                formData.accessToken = $.jStorage.get("accessToken");
                $http.post(adminurl + 'CustomerCompany/search', formData).success(function (data) {
                    callback(data, i);
                });
            },
            searchPolicyType: function (formData, i, callback) {
                formData.accessToken = $.jStorage.get("accessToken");
                $http.post(adminurl + 'PolicyType/search', formData).success(function (data) {
                    callback(data, i);
                });
            },
            searchCountry: function (formData, i, callback) {
                formData.accessToken = $.jStorage.get("accessToken");
                $http.post(adminurl + 'country/search', formData).success(function (data) {
                    callback(data, i);
                });
            },
            searchCustomerSegment: function (formData, i, callback) {
                formData.accessToken = $.jStorage.get("accessToken");
                $http.post(adminurl + 'CustomerSegment/search', formData).success(function (data) {
                    callback(data, i);
                });
            },
            searchLeaves: function (formData, i, callback) {
                formData.accessToken = $.jStorage.get("accessToken");
                $http.post(adminurl + 'LeaveManagement/search', formData).success(function (data) {
                    callback(data, i);
                });
            },
            searchCustomerCompany: function (formData, i, callback) {
                formData.accessToken = $.jStorage.get("accessToken");
                $http.post(adminurl + 'CustomerCompany/search', formData).success(function (data) {
                    callback(data, i);
                });
            },
            searchOffice: function (formData, i, callback) {
                formData.accessToken = $.jStorage.get("accessToken");
                $http.post(adminurl + 'office/search', formData).success(function (data) {
                    callback(data, i);
                });
            },
            // thirdPartyApi: function (formData, callback) {
            //     $http.post('http://180.150.249.125/absolute/webservice/Mobile_HRMS.asmx', formData).success(function (data) {
            //         callback(data);
            //     });
            // },
            thirdPartyApi: function (formData, callback) {
                $http({
                    url: 'http://180.150.249.125/absolute/webservice/Mobile_HRMS.asmx',
                    method: 'POST',
                    withCredentials: false,
                }).success(function (data) {
                    console.log("getLatLng In Nav", data);
                    callback(data);
                });
            },
            searchOfficer: function (formData, i, callback) {
                formData.accessToken = $.jStorage.get("accessToken");
                $http.post(adminurl + 'officer/search', formData).success(function (data) {
                    callback(data, i);
                });
            },
            searchGetOfficer: function (formData, i, callback) {
                formData.accessToken = $.jStorage.get("accessToken");
                $http.post(adminurl + 'Customer/getOfficer', formData).success(function (data) {
                    callback(data, i);
                });
            },
            getNatureLoss: function (formData, i, callback) {
                formData.accessToken = $.jStorage.get("accessToken");
                $http.post(adminurl + 'CauseLoss/getNatureLoss', formData).success(function (data) {
                    callback(data, i);
                });
            },
            getAllBranch: function (formData, i, callback) {
                formData.accessToken = $.jStorage.get("accessToken");
                $http.post(adminurl + 'Employee/getAllBranch', formData).success(function (data) {
                    callback(data, i);
                });
            },
            getPolicyDoc: function (formData, i, callback) {
                formData.accessToken = $.jStorage.get("accessToken");
                $http.post(adminurl + 'PolicyDoc/getPolicyDoc', formData).success(function (data) {
                    callback(data, i);
                });
            },
            searchProduct: function (formData, i, callback) {
                formData.accessToken = $.jStorage.get("accessToken");
                $http.post(adminurl + 'Product/search', formData).success(function (data) {
                    callback(data, i);
                });
            },
            searchApproval: function (formData, i, callback) {
                formData.accessToken = $.jStorage.get("accessToken");
                $http.post(adminurl + 'Assignment/search', formData).success(function (data) {
                    callback(data, i);
                });
            },
            searchBranch: function (formData, i, callback) {
                formData.accessToken = $.jStorage.get("accessToken");
                $http.post(adminurl + 'branch/search', formData).success(function (data) {
                    callback(data, i);
                });
            },
            searchRole: function (formData, i, callback) {
                formData.accessToken = $.jStorage.get("accessToken");
                $http.post(adminurl + 'Role/search', formData).success(function (data) {
                    callback(data, i);
                });
            },
            searchAppointedBy: function (formData, i, callback) {
                formData.accessToken = $.jStorage.get("accessToken");
                $http.post(adminurl + 'Employee/search', formData).success(function (data) {
                    callback(data, i);
                });
            },
            searchTypeOfOffice: function (formData, i, callback) {
                formData.accessToken = $.jStorage.get("accessToken");
                $http.post(adminurl + 'typeOfOffice/search', formData).success(function (data) {
                    callback(data, i);
                });
            },
            searchCompany: function (formData, i, callback) {
                formData.accessToken = $.jStorage.get("accessToken");
                $http.post(adminurl + 'company/search', formData).success(function (data) {
                    callback(data, i);
                });
            },
            setTemplate: function (id) {
                $.jStorage.set("template", id);
            },
            getTemplate: function () {
                return $.jStorage.get("template");
            },
            getAttachment: function (formData, callback) {
                formData.accessToken = $.jStorage.get("accessToken");
                $http.post(adminurl + 'user/getAttachment', formData).success(function (data) {
                    callback(data);
                });
            },
            searchCauseLoss: function (formData, i, callback) {
                formData.accessToken = $.jStorage.get("accessToken");
                $http.post(adminurl + 'CauseLoss/search', formData).success(function (data) {
                    callback(data, i);
                });
            },
            searchTypeOfClaim: function (formData, i, callback) {
                formData.accessToken = $.jStorage.get("accessToken");
                $http.post(adminurl + 'Claims/search', formData).success(function (data) {
                    callback(data, i);
                });
            },
            searchNatureOfSurvey: function (formData, i, callback) {
                formData.accessToken = $.jStorage.get("accessToken");
                $http.post(adminurl + 'SurveyCode/search', formData).success(function (data) {
                    callback(data, i);
                });
            },
            searchDepartment: function (formData, i, callback) {
                formData.accessToken = $.jStorage.get("accessToken");
                $http.post(adminurl + 'department/search', formData).success(function (data) {
                    callback(data, i);
                });
            },
            searchSalvage: function (formData, i, callback) {
                formData.accessToken = $.jStorage.get("accessToken");
                $http.post(adminurl + 'salvage/search', formData).success(function (data) {
                    _.remove(data.data.results, function (n) {
                        return n.sequence === "2";
                    });
                    console.log("Search Salvage results After ", data);
                    callback(data, i);
                });
            },
            searchSalvageElse: function (formData, i, callback) {
                formData.accessToken = $.jStorage.get("accessToken");
                $http.post(adminurl + 'salvage/search', formData).success(function (data) {
                    // _.remove(data.data.results, function (n) {
                    //     return n.sequence === "1";
                    // });
                    callback(data, i);
                });
            },
            searchGrade: function (formData, i, callback) {
                formData.accessToken = $.jStorage.get("accessToken");
                $http.post(adminurl + 'grade/search', formData).success(function (data) {
                    callback(data, i);
                });
            },
            searchFunc: function (formData, i, callback) {
                formData.accessToken = $.jStorage.get("accessToken");
                $http.post(adminurl + 'func/search', formData).success(function (data) {
                    callback(data, i);
                });
            },
            searchCategory: function (formData, i, callback) {
                formData.accessToken = $.jStorage.get("accessToken");
                $http.post(adminurl + 'category/search', formData).success(function (data) {
                    callback(data, i);
                });
            },
            searchIndustry: function (formData, i, callback) {
                formData.accessToken = $.jStorage.get("accessToken");
                $http.post(adminurl + 'industry/search', formData).success(function (data) {
                    callback(data, i);
                });
            },
            searchBank: function (formData, i, callback) {
                formData.accessToken = $.jStorage.get("accessToken");
                $http.post(adminurl + 'bank/search', formData).success(function (data) {
                    callback(data, i);
                });
            },
            pdfGenerate: function (formData, callback) {
                formData.accessToken = $.jStorage.get("accessToken");
                $http.post(adminurl + 'user/generateEmailPdf', formData).success(callback);
            },
            searchCurrency: function (formData, i, callback) {
                formData.accessToken = $.jStorage.get("accessToken");
                $http.post(adminurl + 'currencies/search', formData).success(function (data) {
                    callback(data, i);
                });
            },
            searchInvoiceExpenditure: function (formData, i, callback) {
                formData.accessToken = $.jStorage.get("accessToken");
                $http.post(adminurl + 'invoiceExpenditure/search', formData).success(function (data) {
                    callback(data, i);
                });
            },
            searchLorMaster: function (formData, i, callback) {
                formData.accessToken = $.jStorage.get("accessToken");
                $http.post(adminurl + 'lorMaster/search', formData).success(function (data) {
                    callback(data, i);
                });
            },
            searchInvoiceExpenditure1: function (formData, callback) {
                formData.accessToken = $.jStorage.get("accessToken");
                $http.post(adminurl + 'invoiceExpenditure/searchForInvoiceList', formData).success(function (data) {
                    callback(data);
                });
            },
            searchTemplateInvoice: function (formData, i, callback) {
                formData.accessToken = $.jStorage.get("accessToken");
                $http.post(adminurl + 'TemplateInvoice/search', formData).success(function (data) {
                    callback(data, i);
                });
            },
            allSearch: function (api, formData, callback) {
                formData.accessToken = $.jStorage.get("accessToken");
                $http.post(adminurl + api, formData).success(function (data) {
                    callback(data);
                });
            },
            countrySave: function (formData, callback) {
                formData.accessToken = $.jStorage.get("accessToken");
                $http.post(adminurl + 'country/save', formData).success(callback);
            },
            invoiceExpenditureSave: function (formData, callback) {
                formData.accessToken = $.jStorage.get("accessToken");
                $http.post(adminurl + 'invoiceExpenditure/save', formData).success(callback);
            },
            lorMasterSave: function (formData, callback) {
                formData.accessToken = $.jStorage.get("accessToken");
                $http.post(adminurl + 'lorMaster/save', formData).success(callback);
            },
            lorCategorySave: function (formData, callback) {
                formData.accessToken = $.jStorage.get("accessToken");
                $http.post(adminurl + 'lorCategory/save', formData).success(callback);
            },
            claimSave: function (formData, callback) {
                formData.accessToken = $.jStorage.get("accessToken");
                $http.post(adminurl + 'Claims/save', formData).success(callback);
            },
            modelSave: function (modal, formData, callback) {
                $http.post(adminurl + modal + '/save', formData).success(callback);
            },
            modelSaveLogistic: function (modal, formData, callback) {
                var email = {
                    email: $.jStorage.get("profile").email,
                    name: $.jStorage.get("profile").name
                };
                formData.users = email;
                formData.accessToken = $.jStorage.get("accessToken");
                console.log("formData", modal, formData);
                $http.post(adminurl + modal + '/modelSaveLogistic', formData).success(callback);
            },
            getAssignmentTemplate: function (data, callback) {
                data.accessToken = $.jStorage.get("accessToken");
                $http.post(adminurl + 'assignment/getAssignmentTemplate', data).success(callback);
            },
            editAssignmentTemplate: function (data, callback) {
                var email = {
                    email: $.jStorage.get("profile").email,
                    name: $.jStorage.get("profile").name
                };
                data.users = email;
                data.accessToken = $.jStorage.get("accessToken");
                $http.post(adminurl + 'assignment/editAssignmentTemplate', data).success(callback);
            },
            rejectInvoice: function (data, callback) {
                var email = {
                    email: $.jStorage.get("profile").email,
                    name: $.jStorage.get("profile").name
                };
                data.users = email;
                data.accessToken = $.jStorage.get("accessToken");
                $http.post(adminurl + 'invoice/rejectInvoice', data).success(callback);
            },
            regenerateInvoice: function (data, callback) {
                var email = {
                    email: $.jStorage.get("profile").email,
                    name: $.jStorage.get("profile").name
                };
                data.users = email;
                data.accessToken = $.jStorage.get("accessToken");
                $http.post(adminurl + 'invoice/regenerateInvoice', data).success(callback);
            },
            reviseInvoice: function (data, callback) {
                var email = {
                    email: $.jStorage.get("profile").email,
                    name: $.jStorage.get("profile").name
                };
                data.users = email;
                data.accessToken = $.jStorage.get("accessToken");
                $http.post(adminurl + 'invoice/reviseInvoice', data).success(callback);
            },
            branchSave: function (formData, callback) {
                formData.accessToken = $.jStorage.get("accessToken");
                $http.post(adminurl + 'branch/save', formData).success(callback);
            },
            customerSegmentSave: function (formData, callback) {
                formData.accessToken = $.jStorage.get("accessToken");
                $http.post(adminurl + 'CustomerSegment/save', formData).success(callback);
            },
            getAllCountries: function (callback) {
                formData = {};
                formData.accessToken = $.jStorage.get("accessToken");
                $http.post(adminurl + 'country/getAll', formData).success(callback);
            },
            getOneCountry: function (id, callback) {
                $http.post(adminurl + 'country/getOne', {
                    _id: id,
                    accessToken: $.jStorage.get("accessToken")
                }).success(callback);
            },
            getOneinvoiceExpenditure: function (id, callback) {
                $http.post(adminurl + 'invoiceExpenditure/getOne', {
                    _id: id,
                    accessToken: $.jStorage.get("accessToken")
                }).success(callback);
            },
            getOneClaim: function (id, callback) {
                $http.post(adminurl + 'Claims/getOne', {
                    _id: id,
                    accessToken: $.jStorage.get("accessToken")
                }).success(callback);
            },
            getOneTypeOfOffice: function (id, callback) {
                $http.post(adminurl + 'TypeOfOffice/getOne', {
                    _id: id,
                    accessToken: $.jStorage.get("accessToken")
                }).success(callback);
            },
            login: function (data, callback) {
                $http.post(adminurl + 'Employee/Login', data).success(function (data) {
                    if (data.value === true) {
                        if (data.data.Is == "Customer") {
                            var temp = data.data;
                            $http.post(adminurl + 'Role/getRoleByName', temp).success((rolesData) => {
                                console.log("rolesforcustomer", rolesData);
                                if (rolesData.value == true) {
                                    data.data.role = rolesData.data;
                                    $.jStorage.set("getLoginEmployee", data.data);
                                    var newRole = getRoleSingle(data.data.role);
                                    $.jStorage.set("role", newRole);
                                    callback(data);
                                }
                            });
                        } else {
                            $.jStorage.set("getLoginEmployee", data.data);
                            var newRole = getRoleSingle(data.data.role);
                            $.jStorage.set("role", newRole);
                            callback(data);
                        }
                    }
                });
            },
            getLoginEmployee: function (email, callback) {
                var data = {};
                data.email = email;
                $http.post(adminurl + 'Employee/getLoginEmployee', data).success(callback);
            },
            getOneModel: function (model, id, callback) {
                $http.post(adminurl + model + '/getOne', {
                    _id: id,
                    accessToken: $.jStorage.get("accessToken")
                }).success(callback);
            },
            getOneAssignments: function (model, id, callback) {
                $http.post(adminurl + 'Assignment/getOneAssignment', {
                    _id: id,
                    accessToken: $.jStorage.get("accessToken")
                }).success(callback);
            },
            invoiceEditData: function (model, id, callback) {
                $http.post(adminurl + model + '/invoiceEditData', {
                    _id: id,
                    accessToken: $.jStorage.get("accessToken")
                }).success(callback);
            },
            cancelInvoice: function (data, callback) {
                data.accessToken = $.jStorage.get("accessToken");
                $http.post(adminurl + 'invoice/cancelInvoice', data).success(callback);
            },
            getTemplate: function (model, id, callback) {
                $http.post(adminurl + model + '/getTemplate', {
                    _id: id,
                    accessToken: $.jStorage.get("accessToken")
                }).success(callback);
            },
            getOneModelPopulate: function (model, id, callback) {
                $http.post(adminurl + model + '/getOne', {
                    city: id,
                    accessToken: $.jStorage.get("accessToken")
                }).success(callback);
            },
            getOneBranch: function (id, callback) {
                $http.post(adminurl + 'branch/getOne', {
                    _id: id,
                    accessToken: $.jStorage.get("accessToken")
                }).success(callback);
            },
            generateInvoicePdf: function (data, callback) {
                data.accessToken = $.jStorage.get("accessToken");
                console.log(data);
                $http.post(adminurl + 'assignment/generateInvoicePdf', data).success(callback);
            },
            saveInvoiceDraft: function (data, callback) {
                data.accessToken = $.jStorage.get("accessToken");
                console.log(data);
                $http.post(adminurl + 'invoice/saveInvoiceDraft', data).success(callback);
            },
            getExpenditure: function (id, callback) {
                $http.post(adminurl + 'assignment/getExpenditure', {
                    _id: id,
                    accessToken: $.jStorage.get("accessToken")
                }).success(callback);
            },
            getOneNatureOfServey: function (id, callback) {
                $http.post(adminurl + 'SurveyCode/getOne', {
                    _id: id,
                    accessToken: $.jStorage.get("accessToken")
                }).success(callback);
            },
            countryEditSave: function (formData, callback) {
                $http.post(adminurl + 'country/save', formData).success(callback);
            },
            deleteCountry: function (id, callback) {
                $http.post(adminurl + 'country/delete', {
                    _id: id,
                    accessToken: $.jStorage.get("accessToken")
                }).success(callback);
            },
            deleteBranch: function (id, callback) {
                $http.post(adminurl + 'branch/delete', {
                    _id: id,
                    accessToken: $.jStorage.get("accessToken")
                }).success(callback);

            },
            deleteOffice: function (id, callback) {
                $http.post(adminurl + 'office/delete', {
                    _id: id,
                    accessToken: $.jStorage.get("accessToken")
                }).success(callback);

            },
            searchZone: function (formData, i, callback) {
                formData.accessToken = $.jStorage.get("accessToken");
                $http.post(adminurl + 'zone/search', formData).success(function (data) {
                    callback(data, i);
                });
            },
            searchState: function (formData, i, callback) {
                formData.accessToken = $.jStorage.get("accessToken");
                $http.post(adminurl + 'state/search', formData).success(function (data) {
                    callback(data, i);
                });
            },
            searchDistrict: function (formData, i, callback) {
                formData.accessToken = $.jStorage.get("accessToken");
                $http.post(adminurl + 'district/search', formData).success(function (data) {
                    callback(data, i);
                });
            },
            searchCity: function (formData, i, callback) {
                formData.accessToken = $.jStorage.get("accessToken");
                $http.post(adminurl + 'city/search', formData).success(function (data) {
                    callback(data, i);
                });
            },
            getAllCity: function (formData, i, callback) {
                formData.accessToken = $.jStorage.get("accessToken");
                $http.post(adminurl + 'city/getAll', formData).success(function (data) {
                    callback(data, i);
                });
            },
            getTax: function (callback) {
                formData = {};
                formData.accessToken = $.jStorage.get("accessToken");
                $http.post(adminurl + 'tax/search', formData).success(function (data) {
                    callback(data);
                });
            },

            getNearerSurveyor: function (formData, callback) {
                formData.accessToken = $.jStorage.get("accessToken");
                $http.post(adminurl + 'Assignment/getNearestSurveyor', formData).success(callback);
            },
            getNearerSurveyor2: function (formData, callback) {
                formData.accessToken = $.jStorage.get("accessToken");
                $http.post(adminurl + 'Assignment/getNearestSurveyor2', formData).success(callback);
            },
            getNearestOffice: function (formData, callback) {
                formData.accessToken = $.jStorage.get("accessToken");
                $http.post(adminurl + 'Office/getNearestOffice', formData).success(callback);
            },
            zoneSave: function (formData, callback) {
                formData.accessToken = $.jStorage.get("accessToken");
                $http.post(adminurl + 'zone/save', formData).success(callback);
            },

            getOneZone: function (id, callback) {

                $http.post(adminurl + 'zone/getOne', {
                    "_id": id,
                    accessToken: $.jStorage.get("accessToken")
                }).success(callback);
            },
            getTimeline: function (id, callback) {
                $http.post(adminurl + 'timeline/getTimeline', {
                    "assignment": id,
                    accessToken: $.jStorage.get("accessToken")
                }).success(callback);
            },
            zoneEditSave: function (id, callback) {
                $http.post(adminurl + 'zone/saveData', {
                    _id: id,
                    accessToken: $.jStorage.get("accessToken")
                }).success(callback);
            },
            deleteZone: function (id, callback) {
                $http.post(adminurl + 'zone/delete', {
                    "_id": id,
                    accessToken: $.jStorage.get("accessToken")
                }).success(callback);
            },


            getAllStates: function (callback) {
                formData = {};
                formData.accessToken = $.jStorage.get("accessToken");
                $http.post(adminurl + 'state/getAll', formData).success(callback);
            },
            stateSave: function (formData, callback) {
                formData.accessToken = $.jStorage.get("accessToken");
                $http.post(adminurl + 'state/save', formData).success(callback);
            },
            getOneState: function (id, callback) {
                $http.post(adminurl + 'state/getOne', {
                    "_id": id,
                    accessToken: $.jStorage.get("accessToken")
                }).success(callback);
            },
            stateEditSave: function (formData, callback) {
                formData.accessToken = $.jStorage.get("accessToken");
                $http.post(adminurl + 'state/saveData', formData).success(callback);
            },
            deleteState: function (id, callback) {
                $http.post(adminurl + 'state/delete', {
                    "_id": id,
                    accessToken: $.jStorage.get("accessToken")
                }).success(callback);
            },
            getAllDistricts: function (callback) {
                data = {};
                data.accessToken = $.jStorage.get("accessToken");
                $http({
                    url: adminurl + 'district/getAll',
                    method: 'POST',
                    withCredentials: true,
                    data: data
                }).success(callback);
            },
            districtSave: function (formData, callback) {
                formData.accessToken = $.jStorage.get("accessToken");
                $http.post(adminurl + 'district/save', formData).success(callback);
            },
            getOneDistrict: function (id, callback) {
                $http.post(adminurl + 'district/getOne', {
                    "_id": id,
                    "accessToken": $.jStorage.get("accessToken")
                }).success(callback);
            },
            districtEditSave: function (id, callback) {
                // console.log('form data: ', formData);
                id.accessToken = $.jStorage.get("accessToken");
                $http({
                    url: adminurl + 'district/saveData',
                    method: 'POST',
                    withCredentials: true,
                    data: id
                }).success(callback);
            },
            deleteDistrict: function (id, callback) {
                $http.post(adminurl + 'district/delete', {
                    "_id": id,
                    "accessToken": $.jStorage.get("accessToken")
                }).success(callback);
            },
            getAllCurrencies: function (callback) {
                // console.log('form data: ', formData);
                data = {};
                data.accessToken = $.jStorage.get("accessToken");
                $http({
                    url: adminurl + 'currencies/getAll',
                    method: 'POST',
                    data: data,
                    withCredentials: true
                }).success(callback);
            },
            currencySave: function (formData, callback) {
                formData.accessToken = $.jStorage.get("accessToken");
                $http.post(adminurl + 'currencies/save', formData).success(callback);
            },
            getOneCurrency: function (id, callback) {
                // console.log('form data: ', formData);
                data = {};
                data._id = id;
                data.accessToken = $.jStorage.get("accessToken");
                $http({
                    url: adminurl + 'currencies/getOne',
                    method: 'POST',
                    withCredentials: true,
                    data: data
                }).success(callback);
            },
            currencyEditSave: function (id, callback) {
                // console.log('form data: ', formData);
                id.accessToken = $.jStorage.get("accessToken");
                $http({
                    url: adminurl + 'currencies/saveData',
                    method: 'POST',
                    withCredentials: true,
                    data: id
                }).success(callback);
            },
            deleteCurrency: function (id, callback) {
                data = {};
                data._id = id;
                data.accessToken = $.jStorage.get("accessToken");
                $http.post(adminurl + 'currencies/delete', data).success(callback);
            },

            getAllCities: function (callback) {
                // console.log('form data: ', formData);
                data = {};
                data.accessToken = $.jStorage.get("accessToken");
                $http({
                    url: adminurl + 'city/getAll',
                    method: 'POST',
                    withCredentials: true,
                    data: data
                }).success(callback);
            },
            citySave: function (formData, callback) {
                formData.accessToken = $.jStorage.get("accessToken");
                $http.post(adminurl + 'city/save', formData).success(callback);
            },
            getOneCity: function (id, callback) {
                data = {};
                // console.log('form data: ', formData);\
                data = {
                    "_id": id
                };
                data.accessToken = $.jStorage.get("accessToken");
                $http({
                    url: adminurl + 'city/getOne',
                    method: 'POST',
                    withCredentials: true,
                    data: data
                }).success(callback);
            },
            cityEditSave: function (id, callback) {
                // console.log('form data: ', formData);
                id.accessToken = $.jStorage.get("accessToken");
                $http({
                    url: adminurl + 'city/saveData',
                    method: 'POST',
                    withCredentials: true,
                    data: id
                }).success(callback);
            },
            deleteCity: function (id, callback) {
                data = {};
                data = {
                    _id: id
                };
                data.accessToken = $.jStorage.get("accessToken");
                $http.post(adminurl + 'city/delete', data).success(callback);
            },

            getAllOffices: function (callback) {
                data = {};
                data.accessToken = $.jStorage.get("accessToken");
                $http({
                    url: adminurl + 'office/getAll',
                    method: 'POST',
                    data: data,
                    withCredentials: true
                }).success(callback);
            },
            typeofofficeSave: function (formData, callback) {
                formData.accessToken = $.jStorage.get("accessToken");
                $http.post(adminurl + 'typeOfOffice/save', formData).success(callback);
            },
            getOneOffice: function (id, callback) {
                // console.log('form data: ', formData);
                data = {};
                data = {
                    _id: id
                };
                data.accessToken = $.jStorage.get("accessToken");
                $http({
                    url: adminurl + 'office/getOne',
                    method: 'POST',
                    withCredentials: true,
                    data: data
                }).success(callback);
            },
            officeEditSave: function (id, callback) {
                // console.log('form data: ', formData);
                id.accessToken = $.jStorage.get("accessToken");
                $http({
                    url: adminurl + 'office/saveData',
                    method: 'POST',
                    withCredentials: true,
                    data: id
                }).success(callback);
            },
            deleteTypeOfOffice: function (id, callback) {
                $http.post(adminurl + 'typeOfOffice/delete', {
                    "_id": id,
                }).success(callback);
            },
            getAllTypeOfOffices: function (callback) {
                // console.log('form data: ', formData);
                data = {};
                data.accessToken = $.jStorage.get("accessToken");
                $http({
                    url: adminurl + 'TypeOfOffice/getAll',
                    method: 'POST',
                    withCredentials: true,
                    data: data
                }).success(callback);
            },
            officeSave: function (formData, callback) {
                formData.accessToken = $.jStorage.get("accessToken");
                $http.post(adminurl + 'office/save', formData).success(callback);
            },

            typeOfOfficeEditSave: function (id, callback) {
                // console.log('form data: ', formData);
                id.accessToken = $.jStorage.get("accessToken");
                $http({
                    url: adminurl + 'TypeOfOffice/saveData',
                    method: 'POST',
                    withCredentials: true,
                    data: id
                }).success(callback);
            },
            getAllDepartments: function (callback) {
                formData = {};
                formData.accessToken = $.jStorage.get("accessToken");
                // console.log('form data: ', formData);
                $http({
                    url: adminurl + 'department/getAll',
                    method: 'POST',
                    withCredentials: true,
                    data: formData
                }).success(callback);
            },
            departmentSave: function (formData, callback) {
                // console.log('form data: ', formData);
                formData.accessToken = $.jStorage.get("accessToken");
                $http({
                    url: adminurl + 'department/saveData',
                    method: 'POST',
                    withCredentials: true,
                    data: formData
                }).success(callback);
            },
            getOneDepartment: function (id, callback) {
                data = {};
                // console.log('form data: ', formData);
                data = {
                    _id: id
                }
                data.accessToken = $.jStorage.get("accessToken");
                $http({
                    url: adminurl + 'department/getOne',
                    method: 'POST',
                    withCredentials: true,
                    data: data
                }).success(callback);
            },
            departmentEditSave: function (id, callback) {
                // console.log('form data: ', formData);
                id.accessToken = $.jStorage.get("accessToken");
                $http({
                    url: adminurl + 'department/saveData',
                    method: 'POST',
                    withCredentials: true,
                    data: id
                }).success(callback);
            },
            deleteDepartment: function (id, callback) {
                data = {};
                // console.log('form data: ', formData);
                data = {
                    "_id": id.id
                };
                data.accessToken = $.jStorage.get("accessToken");
                $http({
                    url: adminurl + 'department/delete',
                    method: 'POST',
                    withCredentials: true,
                    data: data
                }).success(callback);
            },

            getAllUniqueTypes: function (callback) {
                // console.log('form data: ', formData);
                data = {};
                data.accessToken = $.jStorage.get("accessToken");
                $http({
                    url: adminurl + 'UniqueTypes/getAll',
                    method: 'POST',
                    withCredentials: true,
                    data: data
                }).success(callback);
            },
            uniquetypeSave: function (formData, callback) {
                // console.log('form data: ', formData);
                formData.accessToken = $.jStorage.get("accessToken");
                $http({
                    url: adminurl + 'UniqueTypes/saveData',
                    method: 'POST',
                    withCredentials: true,
                    data: formData
                }).success(callback);
            },
            getOneUniqueType: function (id, callback) {
                data = {};
                // console.log('form data: ', formData);
                data = {
                    "_id": id
                };
                data.accessToken = $.jStorage.get("accessToken");
                $http({
                    url: adminurl + 'UniqueTypes/getOne',
                    method: 'POST',
                    withCredentials: true,
                    data: data
                }).success(callback);
            },
            UniqueTypeEditSave: function (id, callback) {
                // console.log('form data: ', formData);
                id.accessToken = $.jStorage.get("accessToken");
                $http({
                    url: adminurl + 'UniqueTypes/saveData',
                    method: 'POST',
                    withCredentials: true,
                    data: id
                }).success(callback);
            },
            deleteUniqueType: function (id, callback) {
                data = {};
                // console.log('form data: ', formData);
                data = {
                    "_id": id.id
                };
                data.accessToken = $.jStorage.get("accessToken");
                $http({
                    url: adminurl + 'UniqueTypes/delete',
                    method: 'POST',
                    withCredentials: true,
                    data: data
                }).success(callback);
            },
            getAllCustomerSegments: function (callback) {
                // console.log('form data: ', formData);
                data = {};
                data.accessToken = $.jStorage.get("accessToken");
                $http({
                    url: adminurl + 'CustomerSegment/getAll',
                    method: 'POST',
                    withCredentials: true,
                    data: data
                }).success(callback);
            },
            customersegmentSave: function (formData, callback) {
                // console.log('form data: ', formData);
                $http({
                    url: adminurl + 'CustomerSegment/saveData',
                    method: 'POST',
                    withCredentials: true,
                    data: formData
                }).success(callback);
            },
            getOneCustomerSegment: function (id, callback) {
                // console.log('form data: ', formData);
                data = {};
                data = {
                    "_id": id
                };
                data.accessToken = $.jStorage.get("accessToken");
                $http({
                    url: adminurl + 'CustomerSegment/getOne',
                    method: 'POST',
                    withCredentials: true,
                    data: data
                }).success(callback);
            },
            CustomerSegmentEditSave: function (id, callback) {
                // console.log('form data: ', formData);
                id.accessToken = $.jStorage.get("accessToken");
                $http({
                    url: adminurl + 'CustomerSegment/saveData',
                    method: 'POST',
                    withCredentials: true,
                    data: id
                }).success(callback);
            },
            deleteCustomerSegment: function (id, callback) {
                // console.log('form data: ', formData);
                data = {
                    "_id": id.id,
                };
                data.accessToken = $.jStorage.get("accessToken");
                $http({
                    url: adminurl + 'CustomerSegment/delete',
                    method: 'POST',
                    withCredentials: true,
                    data: data
                }).success(callback);
            },

            getAllPolicyTypes: function (callback) {
                // console.log('form data: ', formData);
                data = {};
                data.accessToken = $.jStorage.get("accessToken");
                $http({
                    url: adminurl + 'policyname/getAll',
                    method: 'POST',
                    withCredentials: true,
                    data: data
                }).success(callback);
            },
            policynameSave: function (formData, callback) {
                // console.log('form data: ', formData);
                formData.accessToken = $.jStorage.get("accessToken");
                $http({
                    url: adminurl + 'policyname/saveData',
                    method: 'POST',
                    withCredentials: true,
                    data: formData
                }).success(callback);
            },
            getOnePolicyType: function (id, callback) {
                // console.log('form data: ', formData);
                data = {};
                data = {
                    _id: id
                };
                data.accessToken = $.jStorage.get("accessToken");
                $http({
                    url: adminurl + 'policyname/getOne',
                    method: 'POST',
                    withCredentials: true,
                    data: data
                }).success(callback);
            },

            PolicyTypeEditSave: function (id, callback) {
                // console.log('form data: ', formData);
                id.accessToken = $.jStorage.get("accessToken");
                $http({
                    url: adminurl + 'policyname/saveData',
                    method: 'POST',
                    withCredentials: true,
                    data: id
                }).success(callback);
            },
            deletePolicyType: function (id, callback) {
                data = {};
                // console.log('form data: ', formData);
                data._id = id.id;
                data.accessToken = $.jStorage.get("accessToken");
                $http({
                    url: adminurl + 'policyname/delete',
                    method: 'POST',
                    withCredentials: true,
                    data: data
                }).success(callback);
            },

            getAllPolicies: function (callback) {
                // console.log('form data: ', formData);
                data = {};
                data.accessToken = $.jStorage.get("accessToken");
                $http({
                    url: adminurl + 'policy/getAll',
                    method: 'POST',
                    withCredentials: true,
                    data: data
                }).success(callback);
            },
            policySave: function (formData, callback) {
                // console.log('form data: ', formData);
                formData.accessToken = $.jStorage.get("accessToken");
                $http({
                    url: adminurl + 'policy/saveData',
                    method: 'POST',
                    withCredentials: true,
                    data: formData
                }).success(callback);
            },
            getOnePolicy: function (id, callback) {
                data = {};
                // console.log('form data: ', formData);
                data._id = id;
                data.accessToken = $.jStorage.get("accessToken");
                $http({
                    url: adminurl + 'policy/getOne',
                    method: 'POST',
                    withCredentials: true,
                    data: data
                }).success(callback);
            },
            PolicyEditSave: function (id, callback) {
                // console.log('form data: ', formData);\
                id.accessToken = $.jStorage.get("accessToken");
                $http({
                    url: adminurl + 'policy/saveData',
                    method: 'POST',
                    withCredentials: true,
                    data: id
                }).success(callback);
            },
            deletePolicy: function (id, callback) {
                data = {};
                // console.log('form data: ', formData);
                data._id = id.id;
                data.accessToken = $.jStorage.get("accessToken");
                $http({
                    url: adminurl + 'policy/delete',
                    method: 'POST',
                    withCredentials: true,
                    data: data
                }).success(callback);
            },
            getAllPolicyDocs: function (callback) {
                // console.log('form data: ', formData);
                data = {};
                data.accessToken = $.jStorage.get("accessToken");
                $http({
                    url: adminurl + 'policydoc/getAll',
                    method: 'POST',
                    withCredentials: true,
                    data: data
                }).success(callback);
            },
            policydocSave: function (formData, callback) {
                // console.log('form data: ', formData);
                formData.accessToken = $.jStorage.get("accessToken");
                $http({
                    url: adminurl + 'policydoc/saveData',
                    method: 'POST',
                    withCredentials: true,
                    data: formData
                }).success(callback);
            },
            getOnePolicyDoc: function (id, callback) {
                console.log('policy form data: ', id);
                formData = {};
                var formData = {};
                formData._id = id;
                formData.accessToken = $.jStorage.get("accessToken");
                $http.post(adminurl + 'policyDoc/getOne', formData).success(callback);
            },
            PolicyDocEditSave: function (id, callback) {
                // console.log('form data: ', formData);
                id.accessToken = $.jStorage.get("accessToken");
                $http({
                    url: adminurl + 'policydoc/saveData',
                    method: 'POST',
                    withCredentials: true,
                    data: id
                }).success(callback);
            },
            deletePolicyDoc: function (id, callback) {
                // console.log('form data: ', formData);
                id._id = id.id;
                id.accessToken = $.jStorage.get("accessToken");
                $http({
                    url: adminurl + 'policydoc/delete',
                    method: 'POST',
                    withCredentials: true,
                    data: id
                }).success(callback);
            },
            getAllIndustries: function (callback) {
                // console.log('form data: ', formData);
                data = {};
                data.accessToken = $.jStorage.get("accessToken");
                $http({
                    url: adminurl + 'industry/getAll',
                    method: 'POST',
                    withCredentials: true,
                    data: data
                }).success(callback);
            },
            industrySave: function (formData, callback) {
                formData.accessToken = $.jStorage.get("accessToken");
                $http.post(adminurl + 'industry/save', formData).success(callback);
            },
            getOneIndustry: function (id, callback) {
                // console.log('form data: ', formData);
                data = {};
                data._id = id;
                data.accessToken = $.jStorage.get("accessToken");
                $http({
                    url: adminurl + 'industry/getOne',
                    method: 'POST',
                    withCredentials: true,
                    data: data
                }).success(callback);
            },
            IndustryEditSave: function (id, callback) {
                // console.log('form data: ', formData);
                id.accessToken = $.jStorage.get("accessToken");
                $http({
                    url: adminurl + 'industry/save',
                    method: 'POST',
                    withCredentials: true,
                    data: id
                }).success(callback);
            },
            deleteIndustry: function (id, callback) {
                data = {};
                data._id = id;
                data.accessToken = $.jStorage.get("accessToken");
                $http.post(adminurl + 'industry/delete', data).success(callback);
            },
            getAllCategories: function (callback) {
                // console.log('form data: ', formData);
                data = {};
                data.accessToken = $.jStorage.get("accessToken");
                $http({
                    url: adminurl + 'category/getAll',
                    method: 'POST',
                    withCredentials: true,
                    data: data
                }).success(callback);
            },
            categorySave: function (formData, callback) {
                formData.accessToken = $.jStorage.get("accessToken");
                $http.post(adminurl + 'category/save', formData).success(callback);
            },
            getOneCategory: function (id, callback) {
                data = {};
                // console.log('form data: ', formData);
                data._id = id;
                data.accessToken = $.jStorage.get("accessToken");
                $http({
                    url: adminurl + 'category/getOne',
                    method: 'POST',
                    withCredentials: true,
                    data: data
                }).success(callback);
            },
            CategoryEditSave: function (id, callback) {
                // console.log('form data: ', formData);
                id.accessToken = $.jStorage.get("accessToken");
                $http({
                    url: adminurl + 'category/saveData',
                    method: 'POST',
                    withCredentials: true,
                    data: id
                }).success(callback);
            },
            deleteCategory: function (id, callback) {
                data = {};
                data._id = id;
                data.accessToken = $.jStorage.get("accessToken");
                $http.post(adminurl + 'category/delete', data).success(callback);
            },
            getAllFunc: function (callback) {
                // console.log('form data: ', formData);
                data = {};
                data.accessToken = $.jStorage.get("accessToken");
                $http({
                    url: adminurl + 'func/getAll',
                    method: 'POST',
                    withCredentials: true,
                    data: data
                }).success(callback);
            },
            funcSave: function (formData, callback) {
                formData.accessToken = $.jStorage.get("accessToken");
                $http.post(adminurl + 'func/save', formData).success(callback);
            },
            gradeSave: function (formData, callback) {
                formData.accessToken = $.jStorage.get("accessToken");
                $http.post(adminurl + 'grade/save', formData).success(callback);
            },
            getOneFunc: function (id, callback) {
                // console.log('form data: ', formData);
                data = {};
                data._id = id;
                data.accessToken = $.jStorage.get("accessToken");
                $http({
                    url: adminurl + 'func/getOne',
                    method: 'POST',
                    withCredentials: true,
                    data: data
                }).success(callback);
            },
            FuncEditSave: function (id, callback) {
                // console.log('form data: ', formData);
                id.accessToken = $.jStorage.get("accessToken");
                $http({
                    url: adminurl + 'func/saveData',
                    method: 'POST',
                    withCredentials: true,
                    data: id
                }).success(callback);
            },
            deleteFunc: function (id, callback) {
                // console.log('form data: ', formData);
                data = {};
                data._id = id.id;
                data.accessToken = $.jStorage.get("accessToken");
                $http({
                    url: adminurl + 'func/delete',
                    method: 'POST',
                    withCredentials: true,
                    data: data
                }).success(callback);
            },
            getAllCauseLoss: function (callback) {
                // console.log('form data: ', formData);
                data = {};
                data.accessToken = $.jStorage.get("accessToken");
                $http({
                    url: adminurl + 'causeloss/getAll',
                    method: 'POST',
                    withCredentials: true,
                    data: data
                }).success(callback);
            },
            causelossSave: function (formData, callback) {
                // console.log('form data: ', formData);
                formData.accessToken = $.jStorage.get("accessToken");
                $http({
                    url: adminurl + 'causeloss/saveData',
                    method: 'POST',
                    withCredentials: true,
                    data: formData
                }).success(callback);
            },
            getOneCauseLoss: function (id, callback) {
                // console.log('form data: ', formData);
                data = {};
                data._id = id;
                data.accessToken = $.jStorage.get("accessToken");
                $http({
                    url: adminurl + 'causeloss/getOne',
                    method: 'POST',
                    withCredentials: true,
                    data: data
                }).success(callback);
            },
            CauseLossEditSave: function (id, callback) {
                // console.log('form data: ', formData);
                id.accessToken = $.jStorage.get("accessToken");
                $http({
                    url: adminurl + 'causeloss/saveData',
                    method: 'POST',
                    withCredentials: true,
                    data: id
                }).success(callback);
            },
            deleteCauseLoss: function (id, callback) {
                // console.log('form data: ', formData);
                data = {};
                data._id = id.id;
                data.accessToken = $.jStorage.get("accessToken");
                $http({
                    url: adminurl + 'causeloss/delete',
                    method: 'POST',
                    withCredentials: true,
                    data: data
                }).success(callback);
            },
            getAllNatureLoss: function (callback) {
                // console.log('form data: ', formData);
                data = {};
                data.accessToken = $.jStorage.get("accessToken");
                $http({
                    url: adminurl + 'natureloss/getAll',
                    method: 'POST',
                    withCredentials: true,
                    data: data
                }).success(callback);
            },
            naturelossSave: function (formData, callback) {
                // console.log('form data: ', formData);
                formData.accessToken = $.jStorage.get("accessToken");
                $http({
                    url: adminurl + 'natureloss/saveData',
                    method: 'POST',
                    withCredentials: true,
                    data: formData
                }).success(callback);
            },
            getOneNatureLoss: function (id, callback) {
                // console.log('form data: ', formData);
                formData = {};
                formData._id = id;
                formData.accessToken = $.jStorage.get("accessToken");
                $http({
                    url: adminurl + 'natureloss/getOne',
                    method: 'POST',
                    withCredentials: true,
                    data: formData
                }).success(callback);
            },
            NatureLossEditSave: function (id, callback) {
                // console.log('form data: ', formData);
                id.accessToken = $.jStorage.get("accessToken");
                $http({
                    url: adminurl + 'natureloss/saveData',
                    method: 'POST',
                    withCredentials: true,
                    data: id
                }).success(callback);
            },
            deleteNatureLoss: function (id, callback) {
                // console.log('form data: ', formData);
                formData = {};
                formData._id = id.id;
                formData.accessToken = $.jStorage.get("accessToken");
                $http({
                    url: adminurl + 'natureloss/delete',
                    method: 'POST',
                    withCredentials: true,
                    data: formData
                }).success(callback);
            },

            getAllBusinessBranch: function (callback) {
                // console.log('form data: ', formData);
                formData = {};
                formData.accessToken = $.jStorage.get("accessToken");
                $http({
                    url: adminurl + 'businessbranch/getAll',
                    method: 'POST',
                    withCredentials: true,
                    data: formData
                }).success(callback);
            },
            businessbranchSave: function (formData, callback) {
                // console.log('form data: ', formData);
                formData.accessToken = $.jStorage.get("accessToken");
                $http({
                    url: adminurl + 'businessbranch/saveData',
                    method: 'POST',
                    withCredentials: true,
                    data: formData
                }).success(callback);
            },
            getOneBusinessBranch: function (id, callback) {
                // console.log('form data: ', formData);
                formData = {};
                formData._id = id;
                formData.accessToken = $.jStorage.get("accessToken");
                $http({
                    url: adminurl + 'businessbranch/getOne',
                    method: 'POST',
                    withCredentials: true,
                    data: formData
                }).success(callback);
            },
            BusinessBranchEditSave: function (id, callback) {
                // console.log('form data: ', formData);
                formData.accessToken = $.jStorage.get("accessToken");
                $http({
                    url: adminurl + 'businessbranch/saveData',
                    method: 'POST',
                    withCredentials: true,
                    data: formData
                }).success(callback);
            },
            deleteBusinessBranch: function (id, callback) {
                // console.log('form data: ', formData);
                data = {};
                data._id = id.id;
                data.accessToken = $.jStorage.get("accessToken");
                $http({
                    url: adminurl + 'businessbranch/delete',
                    method: 'POST',
                    withCredentials: true,
                    data: data
                }).success(callback);
            },
            getAllMenus: function (callback) {
                // console.log('form data: ', formData);
                data = {};
                data.accessToken = $.jStorage.get("accessToken");
                $http({
                    url: adminurl + 'menu/getAll',
                    method: 'POST',
                    withCredentials: true,
                    data: data
                }).success(callback);
            },
            menuSave: function (formData, callback) {
                // console.log('form data: ', formData);
                formData.accessToken = $.jStorage.get("accessToken");
                $http({
                    url: adminurl + 'menu/saveData',
                    method: 'POST',
                    withCredentials: true,
                    data: formData
                }).success(callback);
            },
            getOneMenu: function (id, callback) {
                // console.log('form data: ', formData);
                data = {};
                data._id = id;
                data.accessToken = $.jStorage.get("accessToken");
                $http({
                    url: adminurl + 'menu/getOne',
                    method: 'POST',
                    withCredentials: true,
                    data: data
                }).success(callback);
            },
            menuEditSave: function (id, callback) {
                // console.log('form data: ', formData);
                id.accessToken = $.jStorage.get("accessToken");
                $http({
                    url: adminurl + 'menu/saveData',
                    method: 'POST',
                    withCredentials: true,
                    data: id
                }).success(callback);
            },
            deleteMenu: function (id, callback) {
                data = {};
                // console.log('form data: ', formData);
                data._id = id.id;
                data.accessToken = $.jStorage.get("accessToken");
                $http({
                    url: adminurl + 'menu/delete',
                    method: 'POST',
                    withCredentials: true,
                    data: data
                }).success(callback);
            },
            getAllRoles: function (callback) {
                // console.log('form data: ', formData);
                data = {};
                data.accessToken = $.jStorage.get("accessToken");
                $http({
                    url: adminurl + 'role/getAll',
                    method: 'POST',
                    withCredentials: true,
                    data: data
                }).success(callback);
            },
            roleSave: function (formData, callback) {
                // console.log('form data: ', formData);
                formData.accessToken = $.jStorage.get("accessToken");
                $http({
                    url: adminurl + 'role/saveData',
                    method: 'POST',
                    withCredentials: true,
                    data: formData
                }).success(callback);
            },
            getOneRole: function (id, callback) {
                // console.log('form data: ', formData);
                data = {};
                data._id = id;
                data.accessToken = $.jStorage.get("accessToken");
                $http({
                    url: adminurl + 'role/getOne',
                    method: 'POST',
                    withCredentials: true,
                    data: data
                }).success(callback);
            },
            roleEditSave: function (id, callback) {
                // console.log('form data: ', formData);
                id.accessToken = $.jStorage.get("accessToken");
                $http({
                    url: adminurl + 'role/saveData',
                    method: 'POST',
                    withCredentials: true,
                    data: id
                }).success(callback);
            },
            deleteRole: function (id, callback) {
                // console.log('form data: ', formData);
                data = {};
                data._id = id.id;
                data.accessToken = $.jStorage.get("accessToken");
                $http({
                    url: adminurl + 'role/delete',
                    method: 'POST',
                    withCredentials: true,
                    data: data
                }).success(callback);
            },
            deleteModel: function (model, id, callback) {
                var data = {};
                data._id = id;
                data.accessToken = $.jStorage.get("accessToken");
                $http.post(adminurl + model + '/delete', data).success(callback);
            },
            getAllUsers: function (callback) {
                // console.log('form data: ', formData);
                data = {};
                data.accessToken = $.jStorage.get("accessToken");
                $http({
                    url: adminurl + 'user/getAll',
                    method: 'POST',
                    withCredentials: true,
                    data: data
                }).success(callback);
            },
            userSave: function (formData, callback) {
                // console.log('form data: ', formData);
                data.accessToken = $.jStorage.get("accessToken");
                $http({
                    url: adminurl + 'user/saveData',
                    method: 'POST',
                    withCredentials: true,
                    data: data
                }).success(callback);
            },
            getOneUser: function (id, callback) {
                // console.log('form data: ', formData);
                data = {};
                data._id = id;
                data.accessToken = $.jStorage.get("accessToken");
                $http({
                    url: adminurl + 'user/getOne',
                    method: 'POST',
                    withCredentials: true,
                    data: data
                }).success(callback);
            },
            userEditSave: function (id, callback) {
                // console.log('form data: ', formData);
                id.accessToken = $.jStorage.get("accessToken");
                $http({
                    url: adminurl + 'user/saveData',
                    method: 'POST',
                    withCredentials: true,
                    data: id
                }).success(callback);
            },
            deleteUser: function (id, callback) {
                // console.log('form data: ', formData);
                data = {};
                data._id = id.id;
                data.accessToken = $.jStorage.get("accessToken");
                $http({
                    url: adminurl + 'user/delete',
                    method: 'POST',
                    withCredentials: true,
                    data: data
                }).success(callback);
            },
            getAllCustomerCompanies: function (callback) {
                // console.log('form data: ', formData);
                data = {};
                data.accessToken = $.jStorage.get("accessToken");
                $http({
                    url: adminurl + 'customerCompany/getAll',
                    method: 'POST',
                    withCredentials: true,
                    data: data
                }).success(callback);
            },
            customerCompanySave: function (formData, callback) {
                // console.log('form data: ', formData);
                formData.accessToken = $.jStorage.get("accessToken");
                $http({
                    url: adminurl + 'customerCompany/saveData',
                    method: 'POST',
                    withCredentials: true,
                    data: formData
                }).success(callback);
            },
            companySave: function (formData, callback) {
                formData.accessToken = $.jStorage.get("accessToken");
                $http.post(adminurl + 'company/save', formData).success(callback);
            },
            rejectILALOR: function (data, callback) {
                var email = {
                    email: $.jStorage.get("profile").email
                };
                data.users = email;
                data.accessToken = $.jStorage.get("accessToken");
                $http.post(adminurl + 'Assignment/rejectILALOR', data).success(callback);
            },
            getOneCustomerCompany: function (id, callback) {
                // console.log('form data: ', formData);
                data = {};
                data._id = id;
                data.accessToken = $.jStorage.get("accessToken");
                $http({
                    url: adminurl + 'customerCompany/populateStatesForGST',
                    method: 'POST',
                    withCredentials: true,
                    data: data
                }).success(callback);
            },
            customerCompanyEditSave: function (id, callback) {
                id.accessToken = $.jStorage.get("accessToken");
                // console.log('form data: ', formData);
                $http({
                    url: adminurl + 'customerCompany/save',
                    method: 'POST',
                    withCredentials: true,
                    data: id
                }).success(callback);
            },
            deleteCustomerCompany: function (id, callback) {
                // console.log('form data: ', formData);
                data = {};
                data._id = id.id;
                data.accessToken = $.jStorage.get("accessToken");
                $http({
                    url: adminurl + 'customerCompany/delete',
                    method: 'POST',
                    withCredentials: true,
                    data: data
                }).success(callback);
            },


            getAllCompanies: function (callback) {
                // console.log('form data: ', formData);
                data = {};
                data.accessToken = $.jStorage.get("accessToken");
                $http({
                    url: adminurl + 'company/getAll',
                    method: 'POST',
                    withCredentials: true,
                    data: data
                }).success(callback);
            },
            customerSave: function (formData, callback) {
                // console.log('form data: ', formData);
                formData.accessToken = $.jStorage.get("accessToken");
                $http({
                    url: adminurl + 'company/saveData',
                    method: 'POST',
                    withCredentials: true,
                    data: formData
                }).success(callback);
            },
            getOneCompany: function (id, callback) {
                data = {};
                data._id = id;
                data.accessToken = $.jStorage.get("accessToken");
                $http.post(adminurl + 'company/getOne', data).success(callback);
            },
            companyEditSave: function (id, callback) {
                // console.log('form data: ', formData);
                id.accessToken = $.jStorage.get("accessToken");
                $http({
                    url: adminurl + 'company/saveData',
                    method: 'POST',
                    withCredentials: true,
                    data: id
                }).success(callback);
            },
            deleteCompany: function (id, callback) {
                data = {};
                data._id = id;
                data.accessToken = $.jStorage.get("accessToken");
                $http.post(adminurl + 'company/delete', data).success(callback);
            },

            getAllCustomers: function (callback) {
                // console.log('form data: ', formData);
                data = {};
                data.accessToken = $.jStorage.get("accessToken");
                $http({
                    url: adminurl + 'customer/getAll',
                    method: 'POST',
                    withCredentials: true,
                    data: data
                }).success(callback);
            },

            getOneCustomer: function (id, callback) {
                // console.log('form data: ', formData);
                data = {};
                data._id = id;
                data.accessToken = $.jStorage.get("accessToken");
                $http({
                    url: adminurl + 'customer/getOne',
                    method: 'POST',
                    withCredentials: true,
                    data: data
                }).success(callback);
            },
            customerEditSave: function (id, callback) {
                // console.log('form data: ', formData);
                id.accessToken = $.jStorage.get("accessToken");
                $http({
                    url: adminurl + 'customer/saveData',
                    method: 'POST',
                    withCredentials: true,
                    data: id
                }).success(callback);
            },
            deleteCustomer: function (id, callback) {
                // console.log('form data: ', formData);
                data = {};
                data._id = id.id;
                data.accessToken = $.jStorage.get("accessToken");
                $http({
                    url: adminurl + 'customer/delete',
                    method: 'POST',
                    withCredentials: true,
                    data: data
                }).success(callback);
            },
            getAllEmployees: function (callback) {
                // console.log('form data: ', formData);
                data = {};
                data.accessToken = $.jStorage.get("accessToken");
                $http({
                    url: adminurl + 'employee/getAll',
                    method: 'POST',
                    withCredentials: true,
                    data: data
                }).success(callback);
            },
            employeeSave: function (formData, callback) {
                // console.log('form data: ', formData);
                formData.accessToken = $.jStorage.get("accessToken");
                $http({
                    url: adminurl + 'employee/saveData',
                    method: 'POST',
                    withCredentials: true,
                    data: formData
                }).success(callback);
            },
            getOneEmployee: function (id, callback) {
                // console.log('form data: ', formData);
                data = {};
                data.accessToken = $.jStorage.get("accessToken");
                $http({
                    url: adminurl + 'employee/getOne',
                    method: 'POST',
                    withCredentials: true,
                    data: data
                }).success(callback);
            },
            getOneEmployeeById: function (id, callback) {
                // console.log('form data: ', formData);
                id.accessToken = $.jStorage.get("accessToken");
                $http({
                    url: adminurl + 'employee/getOne',
                    method: 'POST',
                    withCredentials: true,
                    data: id
                }).success(callback);
            },
            getEmployeeData: function (id, callback) {
                console.log('get parent data: ', id);
                data = {};
                data._id = id;
                data.accessToken = $.jStorage.get("accessToken");
                $http.post(adminurl + 'Employee/getEmployeeData', data).success(callback);
            },
            employeeEditSave: function (id, callback) {
                // console.log('form data: ', formData);
                id.accessToken = $.jStorage.get("accessToken");
                $http({
                    url: adminurl + 'employee/saveData',
                    method: 'POST',
                    withCredentials: true,
                    data: id
                }).success(callback);
            },
            deleteEmployee: function (id, callback) {
                // console.log('form data: ', formData);
                data = {};
                data._id = id.id;
                data.accessToken = $.jStorage.get("accessToken");
                $http({
                    url: adminurl + 'employee/delete',
                    method: 'POST',
                    withCredentials: true,
                    data: data
                }).success(callback);
            },
            getAllSalvage: function (callback) {
                // console.log('form data: ', formData);
                data = {};
                data.accessToken = $.jStorage.get("accessToken");
                $http({
                    url: adminurl + 'salvage/getAll',
                    method: 'POST',
                    withCredentials: true,
                    data: data
                }).success(callback);
            },
            salvageSave: function (formData, callback) {
                // console.log('form data: ', formData);
                formData.accessToken = $.jStorage.get("accessToken");
                $http({
                    url: adminurl + 'salvage/saveData',
                    method: 'POST',
                    withCredentials: true,
                    data: formData
                }).success(callback);
            },
            getOneSalvage: function (id, callback) {
                // console.log('form data: ', formData);
                data = {};
                data._id = id;
                data.accessToken = $.jStorage.get("accessToken");
                $http({
                    url: adminurl + 'salvage/getOne',
                    method: 'POST',
                    withCredentials: true,
                    data: data
                }).success(callback);
            },
            salvageEditSave: function (id, callback) {
                // console.log('form data: ', formData);
                id.accessToken = $.jStorage.get("accessToken");
                $http({
                    url: adminurl + 'salvage/saveData',
                    method: 'POST',
                    withCredentials: true,
                    data: id
                }).success(callback);
            },
            deleteSalvage: function (id, callback) {
                // console.log('form data: ', formData);
                data = {};
                data._id = id.id;
                data.accessToken = $.jStorage.get("accessToken");
                $http({
                    url: adminurl + 'salvage/delete',
                    method: 'POST',
                    withCredentials: true,
                    data: data
                }).success(callback);
            },
            getAllProduct: function (callback) {
                // console.log('form data: ', formData);
                data = {};
                data.accessToken = $.jStorage.get("accessToken");
                $http({
                    url: adminurl + 'product/getAll',
                    method: 'POST',
                    withCredentials: true,
                    data: data
                }).success(callback);
            },
            productSave: function (formData, callback) {
                formData.accessToken = $.jStorage.get("accessToken");
                $http.post(adminurl + 'product/save', formData).success(callback);
            },
            getOneProduct: function (id, callback) {
                // console.log('form data: ', formData);
                data = {};
                data._id = id
                data.accessToken = $.jStorage.get("accessToken");
                $http({
                    url: adminurl + 'product/getOne',
                    method: 'POST',
                    withCredentials: true,
                    data: data
                }).success(callback);
            },
            productEditSave: function (id, callback) {
                // console.log('form data: ', formData);
                id.accessToken = $.jStorage.get("accessToken");
                $http({
                    url: adminurl + 'product/saveData',
                    method: 'POST',
                    withCredentials: true,
                    data: id
                }).success(callback);
            },
            deleteProduct: function (id, callback) {
                data = {};
                data._id = id;
                data.accessToken = $.jStorage.get("accessToken");
                $http.post(adminurl + 'product/delete', data).success(callback);
            },
            getAssignmentMatchedData: function (data, callback) {
                data.accessToken = $.jStorage.get("accessToken");
                $http.post(adminurl + 'Assignment/getAssignmentMatchedData', data).success(callback);
            },
            getOneBank: function (id, callback) {
                data = {};
                data._id = id;
                data.accessToken = $.jStorage.get("accessToken");
                $http.post(adminurl + 'bank/getOne', data).success(callback);
            },
            bankSave: function (formData, callback) {
                data.accessToken = $.jStorage.get("accessToken");
                $http.post(adminurl + 'bank/save', formData).success(callback);
            },
            deleteBank: function (id, callback) {
                data = {};
                data._id = id;
                data.accessToken = $.jStorage.get("accessToken");
                $http.post(adminurl + 'bank/delete', data).success(callback);
            },
            getEmployeeOfficeEmail: function (formData, i, callback) {
                console.log("email", formData);
                formData.accessToken = $.jStorage.get("accessToken");
                $http.post(adminurl + 'employee/getEmployeeByOfficeEmail', formData).success(function (emailData) {
                    console.log("emailData", emailData);
                    var data1 = {
                        results: emailData.data,
                        options: {
                            count: 10
                        }
                    };
                    data1.total = 10;
                    console.log("data1", data1);
                    callback(data1, i);
                });
            },
            getLatLng: function (address, i, callback) {
                $http({
                    url: "https://maps.googleapis.com/maps/api/geocode/json?address=" + address + "&key=AIzaSyC62zlixVsjaq4zDaL4cefNCubjCgxkte4",
                    method: 'GET',
                    withCredentials: false,
                }).success(function (data) {
                    console.log("getLatLng In Nav", data, i);
                    callback(data, i);
                });
            },
            saveJsonStore: function (data, callback) {
                formData = {};
                formData.json = data;
                formData.accessToken = $.jStorage.get("accessToken");
                $http.post(adminurl + 'jsonStore/save', formData).success(function (response) {
                    if (response && response.data && response.data._id) {
                        console.log("response", response.data._id);
                        callback(response.data._id);
                    }
                });
            }

        };
    })
    .factory('fakeFac', function ($q, $timeout, $log) {
        var standardDelay = 1000;
        return {
            success: function () {
                var defer = $q.defer();
                $timeout(function () {
                    $log.info('resolve');
                    defer.resolve({
                        msg: 'SUCCESS'
                    });
                }, standardDelay);
                return defer.promise;
            },
            error: function () {
                var defer = $q.defer();
                $timeout(function () {
                    $log.info('error');
                    defer.reject({
                        msg: 'ERROR'
                    });
                }, standardDelay);
                return defer.promise;
            },
            endless: function () {
                var defer = $q.defer();
                return defer.promise;
            }
        };
    })