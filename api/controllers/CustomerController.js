/**
 * CountryController
 *
 * @description :: Server-side logic for managing countries
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */
module.exports = _.cloneDeep(require("sails-wohlig-controller"));
var controller = {
    getOfficer: function (req, res) {
        if (req.body) {
            req.model.getOfficer(req.body, res.callback);

        } else {
            res.json({
                value: false,
                data: "Invalid Request"
            });
        }
    },
    getSegmented: function (req, res) {
        if (req.body) {
            req.model.getSegmented(req.body, res.callback);

        } else {
            res.json({
                value: false,
                data: "Invalid Request"
            });
        }
    },
    getAll: function (req, res) {
        if (req.body) {
            req.model.getAll(req.body, res.callback, req.user);
        } else {
            res.json({
                value: false,
                data: "Invalid Request"
            });
        }
    },
    getChildCustomer: function (req, res) {
        if (req.body) {
            req.model.getChildCustomer(req.body, res.callback);
        } else {
            res.json({
                value: false,
                data: "Invalid Request"
            });
        }
    },
    getParentCustomer: function (req, res) {
        if (req.body) {
            req.model.getParentCustomer(req.body, res.callback);
        } else {
            res.json({
                value: false,
                data: "Invalid Request"
            });
        }
    },
    generateExcel: function (req, res) {
        req.model.generateExcel(req.query, res);
    },
    generateCustomersExcel: function (req, res) {
        JsonStore.findOne({
            _id: req.query.id
        }).lean().exec(function (err, data) {
            if (err || _.isEmpty(data)) {
                res.badRequest();
            } else {
                req.model.generateCustomersExcel(data.json, res.callback, res, req.user);
            }
        });
    },
    import: function (req, res) {
        var xlsx = require('node-xlsx').default;
        var jsonExcel = xlsx.parse("./custommer.ods");
        var retVal = [];
        var excelDataToExport = _.slice(jsonExcel[0].data, 1);
        async.eachSeries(excelDataToExport, function (n, callback) {
                var newname = "";
                if (_.isEmpty(n[4])) {
                    newname = n[2] + " " + n[3] + " " + n[14];
                } else {
                    newname = n[2] + " " + n[3] + " " + n[4] + " " + n[14];
                }
                n = _.map(n, function (m, key) {
                    var b = _.trim(m);
                    if (key == 14) {
                        b = _.capitalize(b);
                    }
                    return b;
                });
                TypeOfOffice.getIdByName({
                    shortCode: n[3]
                }, function (err, data) {
                    if (err) {
                        err.value = n[3];
                        retVal.push(err);
                        callback(null, data);
                    } else {
                        CustomerCompany.getIdByName({
                            shortName: n[2]
                        }, function (err, data2) {
                            if (err) {
                                err.value = n[2];
                                retVal.push(err);
                                callback(null, data2);
                            } else {
                                City.getIdByName({
                                    name: n[14]
                                }, function (err, data3) {
                                    if (err) {
                                        err.value = n[14];
                                        retVal.push(err);
                                        callback(null, data3);
                                    } else {
                                        var cust = Customer({
                                            customerSegment: "57c3ef9b6fb3c3420233a00d",
                                            typeOfOffice: data,
                                            customerCompany: data2,
                                            issueOffice: n[5],
                                            officeCode: n[4],
                                            category: n[6],
                                            creditLimitAlloted: n[7],
                                            creditLimitExhausted: "0",
                                            creditLimitPending: n[9],
                                            direct: n[19],
                                            phone1: n[20],
                                            phone2: n[21],
                                            phone3: "",
                                            email: n[22],
                                            city: data3,
                                            address: n[15],
                                            pincode: n[16],
                                            lat: 0,
                                            lng: 0,
                                            name: newname
                                        });
                                        cust.save(function (err, data4) {
                                            if (err) {
                                                retVal.push(err);
                                                callback(null, data4);
                                            } else {
                                                retVal.push(data3);
                                                callback(null, data4);
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
    }
};
module.exports = _.assign(module.exports, controller);