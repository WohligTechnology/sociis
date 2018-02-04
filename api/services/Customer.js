var objectid = require("mongodb").ObjectID;
var schema = new Schema({
    name: {
        type: String
    },
    email: {
        type: String
    },
    password: {
        type: String
    },
    mobile: {
        type: String,
        unique: true
    },
    phone1: {
        type: String
    },
    creditAlloted: {
        type: Number
    },
    creditExhausted: {
        type: Number
    },
    creditPending: {
        type: Number
    },
    status: {
        type: Boolean,
        default: true
    },
    invoice: {
        type: [{
            type: Schema.Types.ObjectId,
            ref: "Invoice"
        }],
        index: true,
        restrictedDelete: true
    },
    payment: {
        type: [{
            type: Schema.Types.ObjectId,
            ref: "Payment"
        }],
        index: true,
        restrictedDelete: true
    },
    category: {
        type: String,
        enum: ["Silver", "Gold", "Platinum"]
    },
    tillDatePayment: {
        type: Number,
        default: 0
    },
    avgMonthlyExpenditure: {
        type: Number
    },
    balancePayment: {
        type: Number
    }
});

schema.plugin(deepPopulate, {

    populate: {
        'reportingTo': {
            select: 'name _id'
        },
        'city': {
            select: 'name _id district'
        },
        'city.district': {
            select: 'name _id state'
        },
        'city.district.state': {
            select: 'name _id zone stateCode'
        },
        'city.district.state.zone': {
            select: 'name _id country'
        },
        'city.district.state.zone.country': {
            select: 'name _id'
        },
        'customerSegment': {
            select: 'name _id'
        },
        'customerCompany': {
            select: ''
        },
        'customerCompany.GSTINByState.state': {
            select: ''
        },
        'typeOfOffice': {
            select: 'name _id'
        },
        'officers': {
            select: 'name _id salutation firstName lastName birthDate designation email password officeNumber mobileNumber'
        }
    }

});

schema.plugin(uniqueValidator);
schema.plugin(timestamps);
module.exports = mongoose.model('Customer', schema);

var exports = _.cloneDeep(require("sails-wohlig-service")(schema, "city.district.state.zone.country customerSegment customerCompany customerCompany.GSTINByState.state typeOfOffice officers reportingTo", "city.district.state.zone.country customerSegment customerCompany customerCompany.GSTINByState.state typeOfOffice officers reportingTo"));

var model = {
    // saveData: function (data, callback) {
    //     var Model = this;
    //     if (_.isEmpty(data.insured)) {
    //         delete data.insured;
    //     }
    //     var Const = this(data);
    //     var foreignKeys = Config.getForeignKeys(schema);
    //     if (data._id) {
    //         Model.findOne({
    //             _id: data._id
    //         }, function (err, data2) {
    //             if (err) {
    //                 callback(err, data2);
    //             } else if (data2) {
    //                 async.each(foreignKeys, function (n, callback) {
    //                     if (data[n.name] != data2[n.name]) {
    //                         Config.manageArrayObject(mongoose.models[n.ref], data2[n.name], data2._id, n.key, "delete", function (err, md) {
    //                             if (err) {
    //                                 callback(err, md);
    //                             } else {
    //                                 Config.manageArrayObject(mongoose.models[n.ref], data[n.name], data2._id, n.key, "create", callback);
    //                             }
    //                         });
    //                     } else {
    //                         callback(null, "no found for ");
    //                     }
    //                 }, function (err) {
    //                     if (data.customerCompany && data.typeOfOffice && data.city) {
    //                         Model.generateCustomerName(data, function (err, newCustomerShortName) {
    //                             if (err) {
    //                                 callback(err, null)
    //                             } else {
    //                                 data.name = newCustomerShortName;
    //                                 Model.update({
    //                                     _id: data._id
    //                                 }, data, function (err, updated) {
    //                                     if (err) {
    //                                         callback(err, null);
    //                                     } else {
    //                                         callback(null, updated);
    //                                     }
    //                                 });
    //                             }
    //                         })
    //                     } else {
    //                         Model.update({
    //                             _id: data._id
    //                         }, data, function (err, updated) {
    //                             if (err) {
    //                                 callback(err, null);
    //                             } else {
    //                                 callback(null, updated);
    //                             }
    //                         });
    //                     }
    //                 });
    //             } else {
    //                 callback("No Data Found", data2);
    //             }
    //         });
    //     } else {
    //         Model.generateCustomerName(data, function (err, newCustomerShortName) {
    //             if (err) {
    //                 callback(err, null);
    //             } else {
    //                 if (_.isEmpty(newCustomerShortName)) {
    //                     callback("Assignment Number is Null", null)
    //                 } else {
    //                     Const.name = newCustomerShortName;
    //                     Const.save(function (err, data2) {
    //                         if (err) {
    //                             callback(err, data2);
    //                         } else {
    //                             async.each(foreignKeys, function (n, callback) {
    //                                 Config.manageArrayObject(mongoose.models[n.ref], data2[n.name], data2._id, n.key, "create", function (err, md) {
    //                                     callback(err, data2);
    //                                 });
    //                             }, function (err) {
    //                                 if (err) {
    //                                     callback(err, data2);
    //                                 } else {
    //                                     callback(null, data2);
    //                                 }
    //                             });
    //                         }
    //                     });
    //                 }
    //             }
    //         });
    //     }
    // },

    upDateCustomerOnCreatePayment: function (data, callback) {
        Customer.findOne({
            _id: data._id
        }).lean().exec(function (err, found) {
            found.creditPending = found.creditPending + data.amount;
            found.creditExhausted = found.creditExhausted - data.amount;
            found.tillDatePayment = found.tillDatePayment + data.amount;
            Customer.update({
                _id: found._id
            }, found, function (err, updated) {
                if (err) {
                    callback(err, null);
                } else {
                    callback(null, updated);
                }
            });
        });
    },
    upDateCustomerOnCreateInvoice: function (data, callback) {
        if (data.type == "Credit") {
            Customer.findOne({
                _id: data._id
            }).lean().exec(function (err, found) {
                // Old
                found.creditPending = found.creditPending - data.amount;
                found.creditExhausted = found.creditExhausted + data.amount;
                // 
                // creditPending Round Off
                var creditPendingRound = 0; // var creditPendingRound For Each Value
                // For Getting creditPendingRoundValue
                creditPendingRound = found.creditPending % 1;
                if (creditPendingRound != 0 && creditPendingRound <= 0.5) {
                    creditPendingRound = 0.5;
                } else if (creditPendingRound != 0) {
                    creditPendingRound = 1;
                } else {
                    creditPendingRound = 0;
                }
                // Get floor value      
                found.creditPending = Math.floor(found.creditPending);
                // Add the floor value + New creditPendingRound Value      
                found.creditPending = found.creditPending + creditPendingRound;

                // End found.creditPending
                // creditExhausted Round Off
                var creditExhaustedRound = 0; // var creditExhaustedRound For Each Value
                // For Getting creditExhaustedRoundValue
                creditExhaustedRound = found.creditExhausted % 1;
                if (creditExhaustedRound != 0 && creditExhaustedRound <= 0.5) {
                    creditExhaustedRound = 0.5;
                } else if (creditExhaustedRound != 0) {
                    creditExhaustedRound = 1;
                } else {
                    creditExhaustedRound = 0;
                }
                // Get floor value      
                found.creditExhausted = Math.floor(found.creditExhausted);
                // Add the floor value + New creditExhaustedRound Value      
                found.creditExhausted = found.creditExhausted + creditExhaustedRound;

                // End found.creditExhausted

                // 
                Customer.update({
                    _id: found._id
                }, found, function (err, updated) {
                    if (err) {
                        callback(err, null);
                    } else {
                        var callbackData = {
                            mobile: found.mobile,
                            creditExhausted: found.creditExhausted,
                            name: found.name
                        };
                        callback(null, callbackData);
                    }
                });
            });
        } else {
            Customer.findOne({
                _id: data._id
            }).lean().exec(function (err, found) {
                found.tillDatePayment = found.tillDatePayment + data.amount;
                Customer.update({
                    _id: found._id
                }, found, function (err, updated) {
                    if (err) {
                        callback(err, null);
                    } else {
                        var callbackData = {
                            mobile: found.mobile,
                            creditExhausted: found.creditExhausted,
                            name: found.name
                        };
                        callback(null, callbackData);
                    }
                });
            });
        }


    },
    generateCustomerName: function (data, callback) {
        var name = "";
        CustomerCompany.findOne({
            _id: data.customerCompany
        }, function (err, customerCompany) {
            if (err) {
                callback(err, null);
            } else {
                name = customerCompany.shortName;
                TypeOfOffice.findOne({
                    _id: data.typeOfOffice
                }, function (err, typeOfOffice) {
                    if (err) {
                        callback(err, null);
                    } else {
                        name = name + " " + typeOfOffice.shortCode;
                        if (data.officeCode) {
                            name = name + " " + data.officeCode;
                        }
                        City.findOne({
                            _id: data.city
                        }, function (err, city) {
                            if (err) {
                                callback(err, null);
                            } else {
                                if (!_.isEmpty(city)) {
                                    name = name + " " + city.name;
                                }
                                callback(null, name);
                            }
                        });
                    }
                });
            }
        })
    },
    getChildCustomer: function (data, callback) {
        var allCustomer = [];
        var Model = this;
        var Search = Model.find({
            reportingTo: data._id
        }).lean().exec(function (err, data2) {
            if (err) {
                callback(err, allCustomer);
            } else {
                allCustomer = _.map(data2, function (n) {
                    return n._id + "";
                });
                if (allCustomer.length > 0) {

                    async.each(allCustomer, function (n, callback) {

                        Model.getChildCustomer({
                            _id: n
                        }, function (err, data) {
                            if (err) {
                                callback();
                            } else {
                                allCustomer = _.concat(allCustomer, data);
                                callback();
                            }
                        });
                    }, function (err, data) {
                        callback(err, _.compact(allCustomer));
                    });
                } else {
                    callback(err, _.compact(allCustomer));
                }
            }
        });
    },
    getParentCustomer: function (data, callback) {
        var allCustomer = [];
        var Model = this;
        var Search = Model.findOne({
            "_id": data._id
        }).lean().exec(function (err, data2) {
            if (err) {
                callback(err, allCustomer);
            } else {
                if (data2 !== null) {
                    allCustomer.push(data2.reportingTo);
                    Model.getParentCustomer({
                        _id: data2.reportingTo
                    }, function (err, data3) {
                        if (err) {

                        } else {
                            allCustomer = _.concat(allCustomer, data3);
                        }
                        callback(null, _.compact(allCustomer));
                    });
                } else {
                    callback(null, _.compact(allCustomer));
                }
            }
        });
    },
    getOfficer: function (data, callback) {
        var Model = this;
        var Search = Model.findOne(data.filter).lean().populate('officers').exec(function (err, data2) {
            if (err) {
                callback(err, data2);
            } else if (_.isEmpty(data2)) {
                callback(err, data2);
            } else {
                var data3 = {};
                data3.results = data2.officers;
                _.each(data3, function (n) {
                    n.name = n.firstName + n.lastName;
                });
                callback(err, data3);
            }
        });
    },
    search: function (data, callback) {
        var Model = this;
        var Const = this(data);
        var maxRow = Config.maxRow;

        var page = 1;
        if (data.page) {
            page = data.page;
        }
        var field = data.field;
        var options = {
            field: data.field,
            filters: {
                keyword: {
                    fields: ['name'],
                    term: data.keyword
                }
            },
            sort: {
                asc: 'name'
            },
            start: (page - 1) * maxRow,
            count: maxRow
        };
        _.each(data.filter, function (n, key) {
            if (_.isEmpty(n)) {
                n = undefined;
            }
        });
        var Search = Model.find(data.filter)

            .order(options)
            .deepPopulate("city.district.state.zone.country customerSegment")
            .keyword(options)
            .page(options, callback);

    },
    filterOfGetCustomerAggregate: function (data, excelFlag) {
        var filterObject = {};

        //Keyword search
        var text = {};
        if (!_.isEmpty(data.text)) {
            var matchArr = _.split(data.text, ' ');
            text = {
                name: {
                    "$all": _.map(matchArr, function (n) {
                        return new RegExp(n + '.*', 'i');
                    })
                }
            };
        }

        //Segment of Customer filter
        var segment = {};
        if (!_.isEmpty(data.segment)) {
            segment = {
                'customerSegment._id': {
                    $in: _.map(data.segment, function (n) {
                        if (mongoose.Types.ObjectId.isValid(n)) {
                            return objectid(n);
                        }
                    })
                }
            };
        }

        //Company filter
        var company = {};
        if (!_.isEmpty(data.company)) {
            company = {
                'customerCompany._id': {
                    $in: _.map(data.company, function (n) {
                        if (mongoose.Types.ObjectId.isValid(n)) {
                            return objectid(n);
                        }
                    })
                }
            };
        }

        //Company filter
        var state = {};
        if (!_.isEmpty(data.state)) {
            state = {
                'city.district.state._id': {
                    $in: _.map(data.state, function (n) {
                        if (mongoose.Types.ObjectId.isValid(n)) {
                            return objectid(n);
                        }
                    })
                }
            };
        }


        var filterObject = Object.assign(text, segment, company, state);
        if (_.isEmpty(filterObject)) {
            return null;
        } else {
            return [{
                $match: filterObject
            }];
        }

    },
    sortOfGetCustomerAggregate: function (data) {
        //Sorting
        var sort = {
            $sort: {}
        };

        function makeSort(name, value) {
            sort.$sort[name] = value;
        }
        if (_.isEmpty(data.sorting[0])) {
            sort = {
                $sort: {
                    name: 1
                }
            };

        } else {
            switch (data.sorting[0]) {
                case "segment":
                    makeSort("customerSegment.name", data.sorting[1]);
                    break;
                case "name":
                    makeSort(data.sorting[0], data.sorting[1]);
                    break;
                case "city":
                    makeSort("city.name", data.sorting[1]);
                    break;
                default:
                    makeSort("name", 1);
                    break;
            }
        }

        return [sort];

    },
    getCustomerLookupData: function (data, excelFlag) {
        var lookup = [{
            $lookup: {
                from: "customersegments",
                localField: "customerSegment",
                foreignField: "_id",
                as: "customerSegment"
            }
        }, {
            $unwind: {
                path: "$customerSegment",
                preserveNullAndEmptyArrays: true
            }
        }, {
            $lookup: {
                from: "customercompanies",
                localField: "customerCompany",
                foreignField: "_id",
                as: "customerCompany"
            }
        }, {
            $unwind: {
                path: "$customerCompany",
                preserveNullAndEmptyArrays: true
            }
        }, {
            $lookup: {
                from: "cities",
                localField: "city",
                foreignField: "_id",
                as: "city"
            }
        }, {
            $unwind: {
                path: "$city",
                preserveNullAndEmptyArrays: true
            }
        }];

        var lookup2 = [{
            $lookup: {
                from: "districts",
                localField: "city.district",
                foreignField: "_id",
                as: "city.district"
            }
        }, {
            $unwind: {
                path: "$city.district",
                preserveNullAndEmptyArrays: true
            }
        }, {
            $lookup: {
                from: "states",
                localField: "city.district.state",
                foreignField: "_id",
                as: "city.district.state"
            }
        }, {
            $unwind: {
                path: "$city.district.state",
                preserveNullAndEmptyArrays: true
            }
        }];

        if (_.isEmpty(data.company) && excelFlag != true) {
            return lookup;
        } else {
            return _.compact(_.concat(lookup, lookup2));
        }
    },
    getAll: function (data, callback) {
        var filter = this.filterOfGetCustomerAggregate(data);
        var limit = [{
            $skip: parseInt((data.page - 1) * data.pagelimit)
        }, {
            $limit: data.pagelimit
        }];
        var lookup = this.getCustomerLookupData(data);
        var project = [{
            $project: {
                _id: 1,
                name: 1,
                segment: "$customerSegment.name",
                status: 1,
                city: "$city.name",
            }
        }];
        var countArr = [{
            $group: {
                _id: null,
                count: {
                    $sum: 1
                }
            }
        }];
        var sortArr = this.sortOfGetCustomerAggregate(data);
        if (_.isEmpty(data.company) && _.isEmpty(data.state) && _.isEmpty(data.segment)) {
            var mainArr = _.compact(_.concat(filter, lookup, project, sortArr, limit));
            var countsArr = _.compact(_.concat(filter, lookup, countArr));
        } else {
            var mainArr = _.compact(_.concat(lookup, filter, project, sortArr, limit));
            var countsArr = _.compact(_.concat(lookup, filter, countArr));
        }

        async.parallel({
            results: function (callback) {
                Customer.aggregate(mainArr).allowDiskUse(true).exec(callback);
            },
            total: function (callback) {
                Customer.aggregate(countsArr).exec(callback);
            }
        }, function (err, data2) {
            if (err || _.isEmpty(data2.results)) {
                data2.total = 0;
                callback(err, data2);
            } else {
                if (data2.total[0]) {
                    data2.total = data2.total[0].count;
                } else {
                    data2.total = 0;
                }
                callback(err, data2);
            }
        });
    },
    getSegmented: function (data, callback) {
        var Model = this;
        var Const = this(data);
        var maxRow = Config.maxRow;
        var page = 1;
        if (data.page) {
            page = data.page;
        }
        var field = data.field;
        var options = {
            field: data.field,
            filters: {
                keyword: {
                    fields: ['name'],
                    term: data.keyword
                }
            },
            sort: {
                asc: 'name'
            },
            start: (page - 1) * maxRow,
            count: maxRow
        };

        var Search = Model.find()
            .order(options)
            .keyword(options)
            .deepPopulate("customerSegment").exec(function (err, company) {
                if (err) {
                    callback(err, company);
                } else {
                    var company2 = {};
                    company2.results = _.slice(_.filter(company, function (c) {
                        return c.customerSegment.name == data.segment;
                    }), 0, Config.maxRow);
                    callback(err, company2);
                }

            });


    },
    generateCustomersExcel: function (data, callback, res, user) {
        var filter = this.filterOfGetCustomerAggregate(data);
        var lookup = this.getCustomerLookupData(data, true);
        var sortArr = this.sortOfGetCustomerAggregate(data);
        var project = [{
            $project: {
                _id: 1,
                name: 1,
                segment: "$customerSegment.name",
                status: 1,
                city: "$city.name",
                state: "$city.district.state.name",
                address: 1,
                pincode: 1
            }
        }];

        var mainArr = _.compact(_.concat(lookup, filter, project));
        Customer.aggregate(mainArr).allowDiskUse(true).exec(function (err, data1) {
            if (err) {
                callback(null, data1);
            } else {
                if (_.isEmpty(data1)) {
                    callback("No Data Found.", null);
                } else {
                    var excelData = [];
                    var key = 1;
                    async.each(data1, function (n, callback) {
                        var obj = {};
                        obj["Sr #"] = key;
                        obj["Segment"] = n.segment;
                        obj["Customer"] = n.name;
                        obj["Address"] = n.address != null ? n.address : "";
                        obj["Pincode"] = n.pincode != null ? n.pincode : "";
                        obj["City"] = n.city != null ? n.city : "";
                        obj["State"] = n.state != null ? n.state : "";
                        excelData.push(obj);
                        callback();
                        key++;
                    }, function (err, data) {
                        if (err) {
                            callback(err, data);
                        } else {
                            Config.generateExcel("Customers", excelData, res);
                        }
                    });
                }
            }
        });
    },
    generateExcel: function (data, res) {
        Product.find()
            .sort({
                createdAt: -1
            })
            .deepPopulate("category category.industry")
            .exec(
                function (err, data1) {
                    if (err) {
                        res(err, null);
                    } else if (data1) {
                        if (_.isEmpty(data1)) {
                            res("No Payment found.", null);
                        } else {
                            var excelData = [];
                            _.each(data1, function (n, key) {
                                var obj = {};
                                obj.product = n.name;
                                if (n.category == null) {} else {
                                    obj.category = n.category.name;
                                }
                                if (n.category.industry == null) {} else {
                                    obj.industry = n.category.industry.name;
                                }
                                excelData.push(obj);
                            });
                            Config.generateExcel("Product", excelData, res);
                        }
                    } else {
                        res("Invalid data", null);
                    }
                });
    }

};

module.exports = _.assign(module.exports, exports, model);