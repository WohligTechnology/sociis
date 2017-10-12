var objectid = require("mongodb").ObjectID;
var schema = new Schema({
    name: {
        type: String,
    },
    customer: {
        type: Schema.Types.ObjectId,
        ref: "Customer",
        index: true
    },
    shop: {
        type: Schema.Types.ObjectId,
        ref: "Shop",
        index: true
    },
    employee: {
        type: Schema.Types.ObjectId,
        ref: "Employee",
        index: true
    },
    invoiceList: [{
        name: String,
        description: String,
        quantity: Number,
        unit: String,
        rate: Number,
        amount: {
            type: Number,
            default: 0
        },
        fromDate: Date,
        toDate: Date,
        type: {
            type: Boolean
        }
    }],
    roundOff: {
        type: Number
    },
    total: {
        type: Number
    },
    status: {
        type: String,
        enum: ["Pending", "Partial Pending", "Paid"]
    },
    paidAmount: {
        type: Number,
        default: 0
    },
    paymentMethod: {
        type: String,
        enum: ["Cash", "Credit"]
    },
    comment: {
        type: String
    }
});

schema.plugin(deepPopulate, {
    populate: {
        'employee': {
            select: 'name _id'
        },
        'customer': {
            select: 'name _id'
        },
        'shop': {
            select: 'name _id'
        }
    }
});
schema.plugin(uniqueValidator);
schema.plugin(timestamps);
module.exports = mongoose.model('Invoice', schema);

var exports = _.cloneDeep(require("sails-wohlig-service")(schema, "employee customer shop", "employee customer shop"));
var model = {
    // search: function (data, callback) {
    //     var Model = this;
    //     var Const = this(data);
    //     var maxRow = Config.maxRow;
    //     var page = 1;
    //     if (data.page) {
    //         page = data.page;
    //     }
    //     var field = data.field;
    //     var options = {
    //         field: data.field,
    //         filters: {
    //             keyword: {
    //                 fields: ['invoiceNumber'],
    //                 term: data.keyword
    //             }
    //         },
    //         sort: {
    //             desc: 'invoiceNumber'
    //         },
    //         start: (page - 1) * maxRow,
    //         count: maxRow
    //     };
    //     var Search = Invoice.find(data.filter)
    //         .order(options)
    //         .keyword(options)
    //         .deepPopulate("assignment.company assignment.insuredOffice assignment.products.product.category billedTo createdBy")
    //         .page(options, function (err, found) {
    //             if (err) {
    //                 callback(err, found);
    //             } else {
    //                 if (_.isEmpty(found)) {
    //                     callback("No data found!!", found);
    //                 } else {
    //                     callback(null, found);
    //                 }
    //             }
    //         });
    // },
    saveData: function (data, callback) {
        var Model = this;
        var Const = this(data);
        var foreignKeys = Config.getForeignKeys(schema);
        if (data._id) {
            Model.findOne({
                _id: data._id
            }, function (err, data2) {
                if (err) {
                    callback(err, data2);
                } else if (data2) {
                    async.each(foreignKeys, function (n, callback) {
                        if (data[n.name] != data2[n.name]) {
                            Config.manageArrayObject(mongoose.models[n.ref], data2[n.name], data2._id, n.key, "delete", function (err, md) {
                                if (err) {
                                    callback(err, md);
                                } else {
                                    Config.manageArrayObject(mongoose.models[n.ref], data[n.name], data2._id, n.key, "create", callback);
                                }
                            });
                        } else {
                            callback(null, "no found for ");
                        }
                    }, function (err) {
                        data2.update(data, {
                            w: 1
                        }, callback);
                    })
                } else {
                    callback("No Data Found", data2);
                }
            });
        } else {
            Const.save(function (err, data2) {
                if (err) {
                    callback(err, data2);
                } else {
                    async.each(foreignKeys, function (n, callback) {
                        Config.manageArrayObject(mongoose.models[n.ref], data2[n.name], data2._id, n.key, "create", function (err, md) {
                            callback(err, data2);
                        });
                    }, function (err) {
                        if (err) {
                            callback(err, data2);
                        } else {
                            callback(null, data2);
                        }
                    });
                }
            });
        }
    },
    generateInvoiceNumber: function (data, callback) {
        // var sInput = '';
        var invoiceNumber = 1;
        // sInput = _.split(data.name, '-');
        // if (sInput.length != 4) {
        //     invoiceNumber = sInput[0] + "-" + sInput[1] + "-" + sInput[2];
        // } else {
        //     invoiceNumber = sInput[1] + "-" + sInput[2] + "-" + sInput[3];
        // }
        // if (data.invoice.length > 0) {
        //     if (data.invoiceApprovalStatus == "Draft") {
        //         if (data.invoice.length != 1) {
        //             invoiceNumber = invoiceNumber + "-" + String.fromCharCode(63 + data.invoice.length);
        //         }
        //     } else {
        //         invoiceNumber = invoiceNumber + "-" + String.fromCharCode(64 + data.invoice.length);
        //     }
        // }
        Invoice.find({}, {
            name: 1
        }).sort({
            name: -1
        }).limit(1).exec(function (err, data) {
            if (err) {
                callback(err, null)
            } else {
                if (data.length == 0) {
                    callback(null, invoiceNumber)
                } else {
                    invoiceNumber = invoiceNumber + parseInt(data[0].name)
                    callback(null, invoiceNumber);
                }
            }
        });
    },
    generateSalesRegisterExcels: function (data, res) {
        Invoice.find({
                approvalStatus: "Approved"
            })
            .sort({
                createdAt: -1
            })
            .deepPopulate("assignment assignment.branch billedTo assignment.insured")
            .exec(
                function (err, data1) {
                    if (err) {
                        // //console.log(err);
                        res(err, null);
                    } else if (data1) {
                        if (_.isEmpty(data1)) {
                            res("No Payment found.", null);
                        } else {
                            var fee = 0;
                            var expense = 0;
                            // //console.log("Done", data1[37]);
                            var excelData = [];
                            // //console.log("AAAAAAAAAAAAAAAAAAAAAAAAAAAAAA.", data1[0].assignment);
                            _.each(data1, function (n, key) {
                                var fee = 0;
                                var expense = 0;
                                var obj = {};
                                obj["SR #"] = key + 1;
                                if (n.assignment !== null) {
                                    if (n.assignment.branch === null) {} else {
                                        obj["Branch"] = n.assignment.branch.name;
                                    }
                                }
                                obj["Invoice Number"] = n.invoiceNumber;
                                obj["Invoice Date"] = moment(n.approvalTime).format("DD-MM-YYYY");
                                if (n.billedTo === null) {} else {
                                    obj["Billed To"] = n.billedTo.name;
                                }
                                if (n.assignment !== null) {
                                    obj["Insurer Claim No"] = n.assignment.insurerClaimId;
                                }
                                if (n.assignment !== null) {
                                    if (n.assignment.insured) {
                                        obj["Insurer Claim #"] = n.assignment.insured.name;
                                    }
                                }
                                _.each(n.invoiceList, function (m) {
                                    if (m.type) {
                                        fee = fee + m.amount;
                                    } else {
                                        expense = expense + m.amount;
                                    }
                                });
                                obj["Fee"] = fee;
                                obj["expense"] = expense;
                                obj["Total"] = fee + expense;
                                _.each(n.tax, function (m) {
                                    if (m.name == "Service Tax") {
                                        obj["Service Tax"] = m.amount;
                                    }
                                    if (m.name == "Swachh Bharat Cess" || m.name == "SBC") {
                                        obj["SBC"] = m.amount;
                                    }
                                    if (m.name == "Krishi Kalyan Cess") {
                                        obj["KKC"] = m.amount;
                                    }
                                });
                                obj["RoundOff"] = n.roundOff;
                                obj["SubTotal"] = n.subTotal;
                                obj["GrandTotal"] = n.grandTotal;
                                excelData.push(obj);
                            });
                            Config.generateExcel("Assignment", excelData, res);
                        }
                    } else {
                        res("Invalid data", null);
                    }
                });
    },
    getInvoiceApprovalList: function (data, callback) {
        var Model = this;
        var maxRow = Config.maxRow;
        var pagestartfrom = (data.page - 1) * maxRow;
        var page = 1;
        var aggText = [];
        var aggTextCount = [];

        var employee = {
            _id: data.employee
        };
        var childArr = [];
        Employee.getChildEmployee(employee, function (err, childArray) {
            if (err) {
                red("Bad");
                callback(err, null);
            } else {
                childArray.push(data.employee);
                _.each(childArray, function (n) {
                    childArr.push(objectid(n));
                })
                // //console.log(childArr);
                aggText = [{
                        $match: {
                            "invoiceNumber": {
                                $regex: data.keyword,
                                $options: 'i'
                            }
                        }
                    }, {
                        $lookup: {
                            from: "assignments",
                            localField: "assignment",
                            foreignField: "_id",
                            as: "assignment"
                        }
                    }, {
                        $unwind: {
                            path: "$assignment",
                            preserveNullAndEmptyArrays: true
                        }
                    }, {
                        $lookup: {
                            from: "employees",
                            localField: "sentTo",
                            foreignField: "_id",
                            as: "sentTo"
                        }
                    }, {
                        $unwind: {
                            path: "$sentTo",
                            preserveNullAndEmptyArrays: true
                        }
                    }, {
                        $lookup: {
                            from: "employees",
                            localField: "createdBy",
                            foreignField: "_id",
                            as: "sentFrom"
                        }
                    }, {
                        $unwind: {
                            path: "$sentFrom",
                            preserveNullAndEmptyArrays: true
                        }
                    }, {
                        $lookup: {
                            from: "employees",
                            localField: "assignment.owner",
                            foreignField: "_id",
                            as: "assignment.owner"
                        }
                    }, {
                        $unwind: {
                            path: "$assignment.owner",
                            preserveNullAndEmptyArrays: true
                        }
                    }, {
                        $lookup: {
                            from: "customers",
                            localField: "assignment.insurerOffice",
                            foreignField: "_id",
                            as: "insurer"
                        }
                    }, {
                        $unwind: {
                            path: "$insurer",
                            preserveNullAndEmptyArrays: true
                        }
                    }, {
                        $lookup: {
                            from: "customers",
                            localField: "assignment.insuredOffice",
                            foreignField: "_id",
                            as: "insured"
                        }
                    }, {
                        $unwind: {
                            path: "$insured",
                            preserveNullAndEmptyArrays: true
                        }
                    }, {
                        $match: {
                            "$or": [{
                                'assignment.shareWith.persons': {
                                    $in: childArr
                                }
                            }, {
                                "assignment.owner._id": {
                                    $in: childArr
                                }
                            }],
                            approvalStatus: "Pending"
                        }
                    }, {
                        $sort: {
                            reqtimestamp: 1
                        }
                    }, {
                        $project: {
                            reqtimestamp: "$reqtimestamp",
                            invoiceNumber: "$invoiceNumber",
                            "sentFrom.name": "$sentFrom.name",
                            "sentFrom._id": "$sentFrom._id",
                            "assignment.owner._id": "$assignment.owner._id",
                            "assignment.owner.name": "$assignment.owner.name",
                            "sentTo": "$sentTo.name",
                            "insured": "$insured.name",
                            grossAssessedLoss: "$grossAssessedLoss",
                            grandTotal: "$grandTotal"
                        }
                    }, {
                        $skip: parseInt(pagestartfrom)
                    }, {
                        $limit: maxRow
                    }],
                    aggTextCount = [{
                        $match: {
                            "invoiceNumber": {
                                $regex: data.keyword,
                                $options: 'i'
                            }
                        }
                    }, {
                        $lookup: {
                            from: "assignments",
                            localField: "assignment",
                            foreignField: "_id",
                            as: "assignment"
                        }
                    }, {
                        $unwind: {
                            path: "$assignment",
                            preserveNullAndEmptyArrays: true
                        }
                    }, {
                        $lookup: {
                            from: "employees",
                            localField: "assignment.owner",
                            foreignField: "_id",
                            as: "assignment.owner"
                        }
                    }, {
                        $unwind: {
                            path: "$assignment.owner",
                            preserveNullAndEmptyArrays: true
                        }
                    }, {
                        $lookup: {
                            from: "customers",
                            localField: "assignment.insurerOffice",
                            foreignField: "_id",
                            as: "insurer"
                        }
                    }, {
                        $unwind: {
                            path: "$insurer",
                            preserveNullAndEmptyArrays: true
                        }
                    }, {
                        $lookup: {
                            from: "customers",
                            localField: "assignment.insuredOffice",
                            foreignField: "_id",
                            as: "insured"
                        }
                    }, {
                        $unwind: {
                            path: "$insured",
                            preserveNullAndEmptyArrays: true
                        }
                    }, {
                        $match: {
                            "$or": [{
                                'assignment.shareWith.persons': {
                                    $in: childArr
                                }
                            }, {
                                "assignment.owner._id": {
                                    $in: childArr
                                }
                            }],
                            approvalStatus: "Pending"
                        }
                    }, {
                        $group: {
                            _id: null,
                            count: {
                                $sum: 1
                            }
                        }
                    }, {
                        $project: {
                            "_id": 1,
                            "count": 1
                        }
                    }]
                async.parallel([
                        function (callback) {
                            Model.aggregate(aggText,
                                function (err, data1) {
                                    if (err) {
                                        callback(err, null);
                                    } else {
                                        callback(null, data1)
                                    }

                                });
                        },
                        function (callback) {
                            Model.aggregate(aggTextCount,
                                function (err, data2) {
                                    if (err) {
                                        callback(err, null);
                                    } else {
                                        callback(null, data2)
                                    }

                                });
                        }
                    ],
                    function (err, data4) {
                        if (err) {
                            callback(err, null);
                        } else {
                            if (_.isEmpty(data4[1])) {
                                var data5 = {
                                    results: data4[0],
                                    options: {
                                        count: 0
                                    }
                                };
                            } else {
                                var data5 = {
                                    results: data4[0],
                                    options: {
                                        count: maxRow
                                    }
                                };
                                data5.total = data4[1][0].count;
                            }
                            callback(null, data5);
                        }
                    });

            }
        });
    },
    projectionOfGetAssignmentAggregate: function () {
        var allTable = [{
            $lookup: {
                from: "customers",
                localField: "billedTo",
                foreignField: "_id",
                as: "billedTo"
            }
        }, {
            $unwind: {
                path: "$billedTo",
                preserveNullAndEmptyArrays: true
            }
        }, {
            $lookup: {
                from: "employees",
                localField: "createdBy",
                foreignField: "_id",
                as: "createdBy"
            }
        }, {
            $unwind: {
                path: "$createdBy",
                preserveNullAndEmptyArrays: true
            }
        }, {
            $lookup: {
                from: "cities",
                localField: "assignment.city",
                foreignField: "_id",
                as: "assignment.city"
            }
        }, {
            $unwind: {
                path: "$assignment.city",
                preserveNullAndEmptyArrays: true
            }
        }, {
            $lookup: {
                from: "branches",
                localField: "assignment.branch",
                foreignField: "_id",
                as: "assignment.branch"
            }
        }, {
            $unwind: {
                path: "$assignment.branch",
                preserveNullAndEmptyArrays: true
            }
        }, {
            $lookup: {
                from: "customers",
                localField: "assignment.insurerOffice",
                foreignField: "_id",
                as: "assignment.insurer"
            }
        }, {
            $unwind: {
                path: "$assignment.insurer",
                preserveNullAndEmptyArrays: true
            }
        }, {
            $lookup: {
                from: "customers",
                localField: "assignment.brokerOffice",
                foreignField: "_id",
                as: "assignment.broker"
            }
        }, {
            $unwind: {
                path: "$assignment.broker",
                preserveNullAndEmptyArrays: true
            }
        }, {
            $lookup: {
                from: "customers",
                localField: "assignment.insuredOffice",
                foreignField: "_id",
                as: "assignment.insured"
            }
        }, {
            $unwind: {
                path: "$assignment.insured",
                preserveNullAndEmptyArrays: true
            }
        }, {
            $lookup: {
                from: "departments",
                localField: "assignment.department",
                foreignField: "_id",
                as: "assignment.department"
            }
        }, {
            $unwind: {
                path: "$assignment.department",
                preserveNullAndEmptyArrays: true
            }
        }];

        return allTable;
    },
    lookupOfAssignmentAggregate: function (data, user) {
        var retObj = {};
        retObj = [{
            $lookup: {
                from: "assignments",
                localField: "assignment",
                foreignField: "_id",
                as: "assignment"
            }
        }, {
            $unwind: {
                path: "$assignment",
                preserveNullAndEmptyArrays: true
            }
        }];

        return retObj;
    },
    typeOfGetAssignmentAggregate: function (data, user) {
        var retObj = {};
        if (data.ownerStatus == "My files") {
            var allUsersUnder = _.map(_.concat(user.children, data.ownerId), function (n) {
                return objectid(n);
            });
            //   retObj = {
            //     $match: {
            //       'assignment.owner': objectid(data.ownerId),
            //     }
            //   };
            retObj = {
                $match: {
                    'assignment.owner': {
                        $in: allUsersUnder
                    }
                }
            };
        } else if (data.ownerStatus == "All files") {
            retObj = null;
        }

        return [retObj];
    },
    filterOfGetAssignmentAggregate: function (data) {
        var filterObject = {};
        //Timeline status filter
        if (!_.isEmpty(data.timelineStatus)) {
            var timelineStatus = {
                'assignment.timelineStatus': {
                    $in: data.timelineStatus
                }
            };
            filterObject = _.assign(filterObject, timelineStatus);
        }

        //Invoice Number
        if (!_.isEmpty(data.invoiceNumber)) {
            var invoiceNumber = {
                'invoiceNumber': {
                    $regex: data.invoiceNumber,
                    $options: 'i'
                }
            };
            filterObject = _.assign(filterObject, invoiceNumber);
        }

        //Intimated Loss from range to to range
        if (!_.isEmpty(data.from) && !_.isEmpty(data.to)) {
            var intimatedLoss = {
                'assignment.intimatedLoss': {
                    "$gte": data.from,
                    "$lte": data.to
                }
            };
            filterObject = _.assign(filterObject, intimatedLoss);
        }

        //Assignment from date to to date
        if (!_.isEmpty(data.fromDate) && !_.isEmpty(data.toDate)) {
            var approvalTime = {
                'approvalTime': {
                    "$gte": new Date(moment(data.fromDate)),
                    "$lte": new Date(moment(data.toDate).add(5, "hours").add(30, "minutes"))
                }
            };
            filterObject = _.assign(filterObject, approvalTime);
        }

        //Mr number filter
        if (!_.isEmpty(data.name)) {
            var name = {
                'assignment.name': {
                    $regex: data.name,
                    $options: 'i'
                }
            };
            filterObject = _.assign(filterObject, name);
        }

        //Owner of assignment filter
        if (!_.isEmpty(data.owner)) {
            var owner = {
                'assignment.owner': {
                    $in: _.map(data.owner, function (n) {
                        return objectid(n);
                    })
                },
            };
            // //console.log(owner);
            filterObject = _.assign(filterObject, owner);
        }

        //City filter
        if (!_.isEmpty(data.city)) {
            var city = {
                'assignment.city': {
                    $in: _.map(data.city, function (n) {
                        return objectid(n);
                    })
                },
            };
            filterObject = _.assign(filterObject, city);
        }

        ///Branch filter 
        if (!_.isEmpty(data.branch)) {
            var branch = {
                'assignment.branch': {
                    $in: _.map(data.branch, function (n) {
                        return objectid(n);
                    })
                },
            };
            filterObject = _.assign(filterObject, branch);
        }

        //Insurer filter
        if (!_.isEmpty(data.insurer)) {
            var insurer = {
                'assignment.insurerOffice': {
                    $in: _.map(data.insurer, function (n) {
                        return objectid(n);
                    })
                }
            };
            filterObject = _.assign(filterObject, insurer);
        }

        //Insured filter
        if (!_.isEmpty(data.insured)) {
            var insured = {
                'assignment.insuredOffice': {
                    $in: _.map(data.insured, function (n) {
                        return objectid(n);
                    })
                },
            };
            filterObject = _.assign(filterObject, insured);
        }

        //Department filter
        if (!_.isEmpty(data.department)) {
            var department = {
                'assignment.department': {
                    $in: _.map(data.department, function (n) {
                        return objectid(n);
                    })
                },
            };
            filterObject = _.assign(filterObject, department);
        }

        //Broker Office filter
        if (!_.isEmpty(data.broker)) {
            var broker = {
                'assignment.customer': {
                    $in: _.map(data.broker, function (n) {
                        return (n);
                    })
                },
            };
            filterObject = _.assign(filterObject, broker);
        }

        //Invoice Approval Status True
        if (!_.isEmpty(data.invoiceApproval)) {
            var invoiceApproval = {
                'approvalStatus': {
                    $in: data.invoiceApproval
                }
            };
            filterObject = _.assign(filterObject, invoiceApproval);
        } else {
            var invoiceApproval = {
                'approvalStatus': {
                    $in: ["Approved", "Cancelled", "Revised"]
                }
            };
            filterObject = _.assign(filterObject, invoiceApproval);
        }
        // Old Code
        // var invoiceApproval = {
        //     'approvalStatus': {
        //         $in: ["Approved", "Cancelled", "Revised"]
        //     }
        // };
        // filterObject = _.assign(filterObject, invoiceApproval);

        if (_.isEmpty(filterObject)) {
            return null;
        } else {
            return [{
                $match: filterObject
            }];
        }

    },
    sortOfGetAssignmentAggregate: function (data) {
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
                    approvalTime: -1
                }
            };
        } else {
            switch (data.sorting[0]) {
                case "billedTo":
                    makeSort(data.sorting[0] + ".name", data.sorting[1]);
                    break;
                case "invoiceNumber":
                    makeSort(data.sorting[0], data.sorting[1]);
                    break;
                case "createdBy":
                    makeSort(data.sorting[0] + ".name", data.sorting[1]);
                    break;
                case "insured":
                    makeSort("assignment." + data.sorting[0] + ".name", data.sorting[1]);
                    break;
                case "grandTotal":
                    makeSort(data.sorting[0], data.sorting[1]);
                    break;
                default:
                    makeSort("approvalTime", -1);
                    break;
            }
        }
        // //console.log("sorting", [sort]);
        return [sort];
    },
    completeGetAssignmentAggregate: function (data, user) {
        var aggregateArr = _.concat(this.lookupOfAssignmentAggregate(), this.filterOfGetAssignmentAggregate(data), this.typeOfGetAssignmentAggregate(data, user), this.projectionOfGetAssignmentAggregate());
        return _.compact(aggregateArr);
    },
    completeGetAssignmentExcelAggregate: function (data, user) {
        var aggregateArr = _.concat(this.lookupOfAssignmentAggregate(), this.filterOfGetAssignmentAggregate(data), this.typeOfGetAssignmentAggregate(data, user), this.projectionOfGetAssignmentAggregate());
        return _.compact(aggregateArr);
    },
    getAll: function (data, callback, user) {
        var coreArr = this.completeGetAssignmentAggregate(data, user);

        var paginationArr = [{
            $skip: parseInt((data.pagenumber - 1) * data.pagelimit)
        }, {
            $limit: data.pagelimit
        }, {
            $project: {
                file: 1,
                approvalStatus: 1,
                _id: 1,
                invoiceNumber: 1,
                billedTo: "$billedTo.name",
                createdBy: "$createdBy.name",
                insuredName: "$assignment.insured.name",
                grandTotal: 1,
                approvalTime: 1
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
        var sortArr = this.sortOfGetAssignmentAggregate(data);
        // //console.log(sortArr);
        async.parallel({
            results: function (callback) {
                Invoice.aggregate(_.concat(coreArr, sortArr, paginationArr)).allowDiskUse(true).exec(callback);
                // //console.log("final concat : ", _.concat(coreArr, sortArr, paginationArr));
            },
            total: function (callback) {
                Invoice.aggregate(_.concat(coreArr, countArr)).exec(callback);
            }
        }, function (err, data2) {
            if (err || _.isEmpty(data2.results)) {
                data2.total = 0;
                callback(err, data2);
            } else {
                data2.total = data2.total[0].count;
                callback(err, data2);
            }
        });
    },
    generateSalesRegisterExcel: function (data, callback, res, user) {
        //console.log("generateSalesRegisterExcel", data);
        var coreArr = this.completeGetAssignmentAggregate(data, user);
        var group = [{
            $group: {
                _id: "$_id",
                branch: {
                    $first: "$assignment.branch.name"
                },
                approvalTime: {
                    $first: "$approvalTime"
                },
                billedTo: {
                    $first: "$billedTo.name"
                },
                invoiceNumber: {
                    $first: "$invoiceNumber"
                },
                createdBy: {
                    $first: "$createdBy.name",
                },
                insurerClaimId: {
                    $first: "$assignment.insurerClaimId"
                },
                insured: {
                    $first: "$assignment.insured.name"
                },
                invoiceList: {
                    $first: "$invoiceList"
                },
                tax: {
                    $first: "$tax"
                },
                roundOff: {
                    $first: "$roundOff"
                },
                subTotal: {
                    $first: "$subTotal"
                },
                grandTotal: {
                    $first: "$grandTotal"
                },
                approvalStatus: {
                    $first: "$approvalStatus"
                }
            }
        }];
        var project = [{
            $project: {
                _id: 1,
                branch: 1,
                billedTo: 1,
                approvalTime: 1,
                invoiceNumber: 1,
                createdBy: 1,
                insurerClaimId: 1,
                insured: 1,
                invoiceList: 1,
                tax: 1,
                roundOff: 1,
                subTotal: 1,
                grandTotal: 1,
                approvalStatus: 1
            }
        }];
        var sortArr = this.sortOfGetAssignmentAggregate(data);

        Invoice.aggregate(_.concat(coreArr, group, project, sortArr)).allowDiskUse(true).exec(function (err, data1) {
            if (err) {
                callback(null, data1);
            } else {
                if (_.isEmpty(data1)) {
                    callback("No Data Found", null);
                } else {
                    var fee = 0;
                    var expense = 0;
                    var excelData = [];
                    _.each(data1, function (n, key) {
                        var fee = 0;
                        var expense = 0;
                        var obj = {};
                        obj["SR #"] = key + 1;
                        if (!_.isEmpty(n.branch)) {
                            obj["Branch"] = n.branch;
                        }
                        obj["Invoice Number"] = n.invoiceNumber;
                        obj["Invoice Date"] = moment(n.approvalTime).format("DD-MM-YYYY");
                        if (!_.isEmpty(n.billedTo)) {
                            obj["Billed To"] = n.billedTo;
                        }
                        if (n.insurerClaimId != "") {
                            obj["Insurer Claim No"] = n.insurerClaimId;
                        }
                        if (!_.isEmpty(n.insured)) {
                            obj["Insured Claim #"] = n.insured;
                        }
                        _.each(n.invoiceList, function (m) {
                            if (m.type) {
                                fee = fee + m.amount;
                            } else {
                                expense = expense + m.amount;
                            }
                        });
                        obj["Fee"] = fee;
                        obj["Expense"] = expense;
                        obj["Total"] = fee + expense;
                        if (n.tax != undefined) {
                            if (n.tax.length > 0) {
                                if (n.tax[0].name == "IGST" || n.tax[0].name == "CGST" || n.tax[0].name == "SGST") {
                                    //console.log("1");
                                    obj["Service Tax"] = "";
                                    obj["SBC"] = "";
                                    obj["KKC"] = "";
                                    _.each(n.tax, function (m) {
                                        if (m.name == "IGST") {
                                            obj["IGST"] = m.amount;
                                        }
                                        if (m.name == "CGST") {
                                            obj["CGST"] = m.amount;
                                        }
                                        if (m.name == "SGST") {
                                            obj["SGST"] = m.amount;
                                        }
                                    });
                                } else {
                                    //console.log("2");
                                    _.each(n.tax, function (m) {
                                        if (m.name == "Service Tax") {
                                            obj["Service Tax"] = m.amount;
                                        }
                                        if (m.name == "Swachh Bharat Cess" || m.name == "SBC") {
                                            obj["SBC"] = m.amount;
                                        }
                                        if (m.name == "Krishi Kalyan Cess") {
                                            obj["KKC"] = m.amount;
                                        }
                                    });
                                    obj["IGST"] = "";
                                    obj["CGST"] = "";
                                    obj["SGST"] = "";
                                }
                            }
                        }
                        obj["RoundOff"] = n.roundOff;
                        obj["SubTotal"] = n.subTotal;
                        obj["GrandTotal"] = n.grandTotal;
                        obj["Invoice Status"] = n.approvalStatus;
                        excelData.push(obj);
                    });
                    Config.generateExcel("Assignment", excelData, res);
                }
            }
        });
    },
    invoiceEditData: function (data, callback) {
        Invoice.findOne({
                _id: data._id
            }).lean()
            .deepPopulate('billedTo assignment assignment.customer assignment.causeOfLoss assignment.department assignment.natureOfLoss assignment.insuredOffice assignment.insurerOffice assignment.brokerOffice assignment.company.city.district.state assignment.products.product.category', {
                populate: {
                    'assignment': {
                        select: "name survey surveyDate templateIla policyDoc customer causeOfLoss natureOfLoss department insuredOffice insurerOffice brokerOffice company products getAllTaskStatus invoice timelineStatus LRs vehicleNumber invoices"
                    },
                    'assignment.customer': {
                        select: "name"
                    },
                    'assignment.insuredOffice': {
                        select: "name"
                    },
                    'assignment.insurerOffice': {
                        select: "name"
                    },
                    'assignment.brokerOffice': {
                        select: "name"
                    },
                    'assignment.company': {
                        select: "city"
                    },
                    'assignment.company.city': {
                        select: "district"
                    },
                    'assignment.company.city.district': {
                        select: "state"
                    },
                    'assignment.department': {
                        select: "name"
                    },
                    'assignment.company.city.district.state': {
                        select: "name"
                    },
                    'assignment.causeOfLoss': {
                        select: "name"
                    },
                    'assignment.natureOfLoss': {
                        select: "name"
                    },
                    'billedTo': {
                        select: "name creditLimitAlloted creditLimitExhausted"
                    },
                    'products.product.category': {
                        select: "name"
                    }
                }
            }).exec(function (err, data3) {
                if (err) {
                    callback(err, null);
                } else {
                    var filter = {
                        _id: data3.assignment.policyDoc
                    }
                    PolicyDoc.getPolicyDoc({
                        filter
                    }, function (err, data4) {
                        if (err) {
                            callback(null, data3);
                        } else {
                            if (data4.results[0]) {
                                data3.assignment.policyFrom = (data4.results[0].from ? data4.results[0].from : "");
                                data3.assignment.policyTo = (data4.results[0].to ? data4.results[0].to : "");
                                data3.assignment.policyNumber = (data4.results[0].policyNo ? data4.results[0].policyNo : "");
                            }
                            callback(null, data3);
                        }
                    });
                }
            });

    }

};
module.exports = _.assign(module.exports, exports, model);