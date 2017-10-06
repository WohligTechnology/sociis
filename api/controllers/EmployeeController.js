module.exports = _.cloneDeep(require("sails-wohlig-controller"));
var controller = {
    import: function (req, res) {
        var xlsx = require('node-xlsx').default;
        var jsonExcel = xlsx.parse("./employee.xlsx");
        // console.log(jsonExcel[0].data);
        // res.json(jsonExcel[0].data);
        var retVal = [];
        var excelDataToExport = _.slice(jsonExcel[0].data, 1);


        function isYes(value) {
            value = _.upperCase(_.trim(value));
            if (value === "YES") {
                return true;
            } else {
                return false;
            }
        }

        function isDate(value) {
            value = (value - (25567 + 1)) * 86400 * 1000;
            var mom = moment(value);
            if (mom.isValid()) {
                return mom.toDate();
            } else {
                return undefined;
            }
        }

        async.eachSeries(excelDataToExport, function (n, callback) {
                n = _.map(n, function (m, key) {
                    var b = _.trim(m);
                    if (key == 19) {
                        b = _.capitalize(b);
                    }
                    return b;
                });
                Grade.getIdByName({
                    name: n[7],
                }, function (err, data) {
                    if (err) {
                        err.name = n[7];
                        retVal.push(err);
                        callback(null, data);
                    } else {
                        Func.getIdByName({
                            name: n[6]
                        }, function (err, data2) {
                            if (err) {
                                err.name = n[6];
                                retVal.push(err);
                                callback(null, data2);
                            } else {
                                Branch.getIdByName({
                                    code: n[38],
                                }, function (err, data3) {
                                    if (err) {
                                        retVal.push(err);
                                        callback(null, data3);
                                    } else {
                                        City.getIdByName({
                                            name: n[19],
                                        }, function (err, data4) {
                                            if (err) {
                                                err.name = n[19];
                                                retVal.push(err);
                                                callback(null, data4);
                                            } else {
                                                City.getIdByName({
                                                    name: n[5],
                                                }, function (err, dataPostedAt) {
                                                    if (err) {
                                                        err.name = n[19];
                                                        retVal.push(err);
                                                        callback(null, data4);
                                                    } else {
                                                        Office.getIdByName({
                                                            name: n[5],
                                                        }, function (err, data5) {
                                                            if (err) {
                                                                retVal.push(err);
                                                                callback(null, data5);
                                                            } else {
                                                                Employee.getIdByName({
                                                                    name: n[3] + " " + n[4],
                                                                    firstName: n[3],
                                                                    lastName: n[4],
                                                                    company: "57b08c39e69e5abf43334252",
                                                                    salutation: n[2],
                                                                    branch: data3,
                                                                    func: data2,
                                                                    postedAt: dataPostedAt,
                                                                    grade: data,
                                                                    houseColor: n[8],
                                                                    employeeCode: n[10],
                                                                    photo: "",
                                                                    bank: n[11],
                                                                    accountNumber: n[13],
                                                                    branchName: n[12],
                                                                    neftCode: n[14],
                                                                    gender: n[39],
                                                                    city: data4,
                                                                    address: n[21],
                                                                    pincode: n[20],
                                                                    lat: n[22],
                                                                    lng: n[23],
                                                                    officeNumber: n[24],
                                                                    officeMobile: n[25],
                                                                    officeEmail: n[26],
                                                                    homeNumber: n[27],
                                                                    mobile: n[28],
                                                                    email: n[29],
                                                                    extension: n[30],
                                                                    birthDate: isDate(n[31]),
                                                                    marriageDate: isDate(n[33]),
                                                                    joiningDate: isDate(n[32]),
                                                                    leavingDate: isDate(n[34]),
                                                                    isSBC: isYes(n[35]),
                                                                    isField: isYes(n[36]),
                                                                    isSurveyor: isYes(n[37]),

                                                                }, function (err, data6) {
                                                                    if (err) {
                                                                        retVal.push(err);
                                                                        callback(null, data6);
                                                                    } else {
                                                                        retVal.push(data6);
                                                                        callback(null, data6);
                                                                    }
                                                                });
                                                            }
                                                        });

                                                    }
                                                });
                                            }
                                        });
                                    }
                                });
                            }
                        });
                    }
                });
            },
            function (err, data) {
                if (err) {
                    callback(err, data);
                } else {
                    res.json({
                        total: retVal.length,
                        value: retVal
                    });
                }
            });
    },

    mobileLogout: function (req, res) {
        if (req.body) {
            Employee.mobileLogout(req.body, res.callback);
        } else {
            res.json({
                value: false,
                data: {
                    message: "Invalid Request"
                }
            })
        }
    },
    getBackendEmployee: function (req, res) {
        if (req.body) {
            Employee.getBackendEmployee(req.body, res.callback);
        } else {
            res.json({
                value: false,
                data: {
                    message: "Invalid Request"
                }
            })
        }
    },
    getShareWith1: function (req, res) {
        if (req.body) {
            Employee.getShareWith1(req.body, res.callback);
        } else {
            res.json({
                value: false,
                data: {
                    message: "Invalid Request"
                }
            })
        }
    },
    getBackendEmployeeOnly: function (req, res) {
        if (req.body) {
            Employee.getBackendEmployeeOnly(req.body, res.callback, req.user);
        } else {
            res.json({
                value: false,
                data: {
                    message: "Invalid Request"
                }
            })
        }
    },
    getShareWith: function (req, res) {
        if (req.body) {
            Employee.getShareWith(req.body, res.callback);
        } else {
            res.json({
                value: false,
                data: {
                    message: "Invalid Request"
                }
            })
        }
    },
    getLoginSurveyor: function (req, res) {
        if (req.body) {
            Employee.getLoginSurveyor(req.body, res.callback);
        } else {
            res.json({
                value: false,
                data: {
                    message: "Invalid Request"
                }
            })
        }
    },
    getSurveyor: function (req, res) {
        if (req.body) {
            Employee.getSurveyor(req.body, res.callback);
        } else {
            res.json({
                value: false,
                data: {
                    message: "Invalid Request"
                }
            })
        }
    },
    getLoginEmployee: function (req, res) {
        if (req.body) {
            Employee.getLoginEmployee(req.body, res.callback);
        } else {
            res.json({
                value: false,
                data: {
                    message: "Invalid Request"
                }
            })
        }
    },
    getAllBranch: function (req, res) {
        if (req.body) {
            Employee.getAllBranch(req.body, res.callback);
        } else {
            res.json({
                value: false,
                data: {
                    message: "Invalid Request"
                }
            })
        }
    },

    mobileSubmit: function (req, res) {
        if (req.body) {
            Employee.mobileSubmit(req.body, res.callback);
        } else {
            res.json({
                value: false,
                data: "Invalid Request"
            });
        }
    },
    getTask: function (req, res) {
        if (req.body) {
            Employee.getTask(req.body, res.callback);
        } else {
            res.json({
                value: false,
                data: {
                    message: "Invalid Request"
                }
            })
        }
    },
    getEmployeeByOfficeEmail: function (req, res) {
        if (req.body) {
            Employee.getEmployeeByOfficeEmail(req.body, res.callback);
        } else {
            res.json({
                value: false,
                data: {
                    message: "Invalid Request"
                }
            })
        }
    },
    saveEmployeeAssignment: function (req, res) {
        if (req.body) {
            Employee.saveEmployeeAssignment(req.body, res.callback);
        } else {
            res.json({
                value: false,
                data: {
                    message: "Invalid Request"
                }
            })
        }
    },
    getDashboardCounts: function (req, res) {
        if (req.body.ownerId) {
            Employee.getDashboardCounts(req.body, res.callback, req.user);
        } else {
            res.json({
                value: false,
                data: {
                    message: "Invalid Request"
                }
            })
        }
    },
    getNavigationCounts:function (req, res) {
        if (req.body.ownerId) {
            Employee.getNavigationCounts(req.body, res.callback, req.user);
        } else {
            res.json({
                value: false,
                data: {
                    message: "Invalid Request"
                }
            })
        }
    }, 
    getAssignmentSummary: function (req, res) {
        if (req.body.ownerId) {
            Employee.getAssignmentSummary(req.body, res.callback, req.user);
        } else {
            res.json({
                value: false,
                data: {
                    message: "Invalid Request"
                }
            })
        }
    }, 
    employeeSearch: function (req, res) {
        if (req.body) {
            Employee.employeeSearch(req.body, res.callback);
        } else {
            res.json({
                value: false,
                data: {
                    message: "Invalid Request"
                }
            });
        }
    },

    getEmployeeNameEmail: function (req, res) {
        if (req.body) {
            Employee.getEmployeeNameEmail(req.body, res.callback);
        } else {
            res.json({
                value: false,
                data: {
                    message: "Invalid Request"
                }
            });
        }
    },
    getParentEmployee: function (req, res) {
        Employee.getParentEmployee(req.body, res.callback);
    },
    getChildEmployee: function (req, res) {
        Employee.getChildEmployee(req.body, res.callback);
    },
    getEmployeeData: function (req, res) {
        if (req.body) {
            Employee.getEmployeeData(req.body, res.callback);
        } else {
            res.json({
                value: false,
                data: {
                    message: "Invalid Request"
                }
            });
        }
    },
    searchEmployee:  function (req, res) {
        if (req.body) {
            Employee.searchEmployee(req.body, res.callback);
        } else {
            res.json({
                value: false,
                data: {
                    message: "Invalid Request"
                }
            });
        }
    },
    search: function (req, res) {
        if (!req.body.keyword) {
            req.body.keyword = "";
        }
        req.model.search(req.body, res.callback, req.user);
    },
};
module.exports = _.assign(module.exports, controller);