var objectid = require("mongodb").ObjectID;
var schema = new Schema({
    role: [{
        type: Schema.Types.ObjectId,
        ref: "Role"
    }],
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        validate: validators.isEmail()
    },
    mobile: {
        type: String,
        required: true
    },
    accessLevel: {
        type: String,
        enum: ["Employee", "Manager", "Admin"]
    },
    password: {
        type: String,
        required: true
    },
});


schema.plugin(deepPopulate, {
    populate: {
        'allBranch': {
            select: 'name _id'
        },
        'role': {
            select: ''
        },
        'assignment.assignment': {
            select: 'name address surveyDate city pincode siteMobile siteNumber siteEmail '
        },
        'assignment.assignment.city': {
            select: 'name district'
        },
        'assignment.assignment.city.district': {
            select: 'name _id state'
        },
        'assignment.assignment.city.district.state': {
            select: 'name _id zone'
        },
        'assignment.assignment.city.district.state.zone': {
            select: 'name _id country'
        },
        'assignment.assignment.city.district.state.zone.country': {
            select: 'name _id'
        },
        'city': {
            select: 'name _id district'
        },
        'city.district': {
            select: 'name _id state'
        },
        'city.district.state': {
            select: 'name _id zone'
        },
        'city.district.state.zone': {
            select: 'name _id country'
        },
        'city.district.state.zone.country': {
            select: 'name _id'
        },
        'func': {
            select: 'name _id'
        },
        'grade': {
            select: 'name _id'
        },
        'postedAt': {
            select: 'name _id'
        },
        'department': {
            select: 'name _id'
        },
        'IIISLACertificate.department': {
            select: 'name _id'
        },
        'employee': {
            select: 'name _id officeEmail email officeMobile'
        }
    }
});
// schema.plugin(uniqueValidator);
schema.plugin(timestamps,timestampsAppendObject);
module.exports = mongoose.model('Employee', schema);

var exports = _.cloneDeep(require("sails-wohlig-service")(schema, "city.district.state.zone.country func grade department IIISLACertificate.department allBranch role employee", "city.district.state.zone.country  func grade postedAt allBranch role employee"));
var model = {
    // Start
    getBackendEmployee: function (data, callback) {
        var Model = this;
        var Const = this(data);
        var maxRow = Config.maxRow;
        var page = 1;
        // var name1=subString()
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
                },
                isSBC: false,
                isField: false,
                isSurveyor: false
            },

            sort: {
                asc: "name",
            },
            start: (page - 1) * maxRow,
            count: maxRow
        };
        _.each(data.filter, function (n, key) {
            if (_.isEmpty(n)) {
                n = undefined;
            }
        });
        var Search = Model.find({
                $or: [{
                    func: data.func
                }, {
                    isSurveyor: true
                }]
            })
            .order(options)
            .deepPopulate("postedAt")
            .keyword(options)
            .page(options, callback);
    },
    getShareWith1: function (data, callback) {
        var Model = this;
        var Const = this(data);
        var maxRow = Config.maxRow;
        var page = 1;
        // var name1=subString()
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
                },
                isSBC: false,
                isField: false,
                isSurveyor: false
            },

            sort: {
                asc: "name",
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
            .deepPopulate("postedAt")
            .keyword(options)
            .page(options, callback);
    },
    getBackendEmployeeOnly: function (data, callback, user) {

        var Model = this;
        var Const = this(data);
        var maxRow = Config.maxRow;
        var page = 1;
        // var name1=subString()
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
                asc: "name",
            },
            start: (page - 1) * maxRow,
            count: maxRow
        };
        _.each(data.filter, function (n, key) {
            if (_.isEmpty(n)) {
                n = undefined;
            }
        });
        // if (user) {
        //     data.filter._id = {
        //         $in: _.concat(user.children, user.employee._id)
        //     };
        // }
        var Search = Model.find(data.filter)
            .order(options)
            .deepPopulate("postedAt")
            .keyword(options)
            .page(options, callback);
    },

    // End
    getLoginEmployee: function (data, callback) {
        Employee.findOne({
            officeEmail: data.email
        }).deepPopulate("role employee").exec(function (err, found) {
            if (err) {
                callback(err, null);
            } else {
                callback(null, found);
            }
        })
    },
    getShareWith: function (data, callback) {
        Employee.find({

        }).exec(function (err, found) {
            if (err) {
                callback(err, null);
            } else {
                callback(null, found);
            }
        })
    },

    getLoginSurveyor: function (data, callback) {
        green(data.deviceId);
        if (data.deviceId) {
            Employee.findOneAndUpdate({
                officeEmail: data.email,
            }, {
                $push: {
                    deviceIds: data.deviceId
                }
            }).exec(function (err, found) {
                if (err) {
                    //console.log(err);
                    callback(err, null);
                } else if (found) {
                    callback(null, found);
                } else {
                    callback(null, found);
                }
            });
        } else {
            Employee.findOne({
                officeEmail: data.email,
                $or: [{
                    isSurveyor: true
                }, {
                    isField: true
                }]
            }, {
                name: 1,
                photo: 1,
                grade: 1
            }).populate("grade", "name").exec(function (err, found) {
                if (err) {
                    callback(err, null);
                } else {
                    callback(null, found);
                }
            });
        }
    },
    getSurveyor: function (data, callback) {
        var Model = this;
        var Const = this(data);
        var maxRow = Config.maxRow;
        var page = 1;
        // var name1=subString()
        if (data.page) {
            page = data.page;
        }
        var field = data.field;
        var options = {
            field: data.field,
            // filters: {
            //     keyword: {
            //         fields: ['name'],
            //         term: data.keyword
            //     }
            // },

            sort: {
                asc: "name",
            },
            start: (page - 1) * maxRow,
            count: maxRow
        };
        _.each(data.filter, function (n, key) {
            if (_.isEmpty(n)) {
                n = undefined;
            }
        });
        // data.filter={

        // }
        var Search = Model.find({
                name: {
                    $regex: data.keyword,
                    $options: 'i'
                },
                $or: [{
                    isSurveyor: true
                }, {
                    isField: true
                }]

            })
            .order(options)
            .deepPopulate()
            .keyword(options)
            .page(options, callback);
    },
    // getSurveyor: function (data, callback) {
    //     Employee.find({
    //         $or: [{
    //             isSurveyor: true
    //         }, {
    //             isField: true
    //         }]
    //     }, {
    //         _id: 1,
    //         name: 1
    //     }).exec(function (err, found) {
    //         if (err) {
    //             callback(err, null);
    //         } else {
    //             var data = {};
    //             data.results = found;
    //             //console.log(found);
    //             callback(null, data);
    //         }
    //     })
    // },
    getTask: function (data, callback) {
        var deepSearch = "assignment.assignment assignment.assignment.city assignment.assignment.city.district assignment.assignment.city.district.state assignment.assignment.city.district.state.zone assignment.assignment.city.district.state.zone.country";
        Employee.findOne({
            _id: data.id
        }).deepPopulate(deepSearch).exec(function (err, found) {
            if (err) {
                callback(err, null);
            } else {
                var arr = [];
                _.each(found.assignment, function (n) {
                    if (n.status === false) {
                        arr.push(n);
                    }
                });
                callback(null, arr);
            }
        })
    },
    mobileLogout: function (data, callback) {
        if (data.empId && data.deviceId) {
            Employee.update({
                _id: data.empId
            }, {
                $pull: {
                    deviceIds: data.deviceId
                }
            }).exec(function (err, data) {
                if (err) {
                    callback(err, null);
                } else {
                    callback(null, data);
                }
            });
        } else {
            callback({
                data: "Invalid Request"
            }, {
                value: false,
                data: "Invalid Request"
            })
        }
    },
    // async.parallel start
    mobileSubmit: function (data, callback) {
        async.parallel({
            saveEmployee: function (callback) {
                Employee.update({
                    "assignment._id": data.empId
                }, {
                    $set: {
                        "assignment.$.status": true
                    }
                }).exec(function (err, found) {
                    if (err) {
                        //console.log(err);
                        callback(err, null);
                    } else if (found) {
                        callback(null, found);
                    } else {
                        callback(null, found);
                    }
                });
            },
            saveAssignment: function (callback) {
                _.each(data.doc, function (n) {
                    n.fileName = Date.now(),
                        n.employee = data.empId;
                });
                _.each(data.photos, function (n) {
                    n.fileName = Date.now(),
                        n.employee = data.empId;
                });
                _.each(data.jir, function (n) {
                    n.fileName = Date.now(),
                        n.employee = data.empId;
                });
                Assignment.update({
                    _id: data.assignId
                }, {
                    $push: {
                        docs: {
                            $each: data.doc
                        },
                        photos: {
                            $each: data.photos
                        },
                        jir: {
                            $each: data.jir
                        }
                    }
                }).exec(function (err, found) {
                    if (err) {
                        //console.log(err);
                        callback(err, null);
                    } else if (found) {
                        callback(null, found);
                    } else {
                        callback(null, found);
                    }
                });
            },
        }, function (err, results) {
            if (err) {
                //console.log(err);
                callback(err, null);
            } else if (results && results.length > 0) {
                callback(null, results);
            } else {
                callback(null, results);
            }
        });
    },
    // async.parallel End
    saveEmployeeAssignment: function (data, callback) {
        Employee.findOne({
            _id: data._id
        }).exec(function (err, employee) {
            if (err) {
                callback(err, null);
            } else {
                employee.assignment.push(data.assignment);
                Employee.saveData(employee, callback);
            }
        })
    },

    getEmployeeByOfficeEmail: function (data, callback) {
        // //console.log("officeEmail", officeEmail);
        Employee.findOne({
            email: data.email
        }, {
            name: 1,
            officeEmail: 1,
            email: 1
        }).exec(function (err, employee) {
            if (err) {
                callback(err, null);
            } else {
                if (_.isEmpty(employee)) {
                    callback(null, "No Data found");
                } else {
                    callback(null, employee);
                }
            }
        })
    },

    search: function (data, callback, user) {

        var Model = this;
        var Const = this(data);
        var maxRow = Config.maxRow;
        var pagestartfrom = (data.page - 1) * maxRow;
        var page = 1;
        // var name1=subString()
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
                asc: "name",
            },
            start: (page - 1) * maxRow,
            count: maxRow
        };
        _.each(data.filter, function (n, key) {
            if (_.isEmpty(n)) {
                n = undefined;
            }
        });
        var aggArr = [{
            $lookup: {
                from: "offices",
                localField: "postedAt",
                foreignField: "_id",
                as: "postedAt"
            }
        }, {
            $unwind: "$postedAt"
        }, {
            $lookup: {
                from: "grades",
                localField: "grade",
                foreignField: "_id",
                as: "grade"
            }
        }, {
            $unwind: "$grade"
        }, {
            $match: {
                $or: [{
                    "grade.name": {
                        $regex: data.keyword,
                        $options: 'i'
                    }
                }, {
                    "postedAt.name": {
                        $regex: data.keyword,
                        $options: 'i'
                    }
                }, {
                    "name": {
                        $regex: data.keyword,
                        $options: 'i'
                    }
                }, {
                    "officeEmail": {
                        $regex: data.keyword,
                        $options: 'i'
                    }
                }, {
                    "officeMobile": {
                        $regex: data.keyword,
                        $options: 'i'
                    }
                }]
            }
        }, {
            $skip: parseInt(pagestartfrom)
        }, {
            $limit: maxRow
        }];
        // if (user) {
        //     aggArr.unshift({
        //         $match: {
        //             $in: _.map(user.children,function(n) {
        //                 return objectId(n);
        //             })
        //         }
        //     });
        // }
        if (data.keyword != "") {
            async.parallel([
                //Start 
                function (callback) {
                    var Search = Employee.aggregate(aggArr, function (err, data1) {
                        if (err) {
                            callback(err, null);
                        } else {
                            callback(null, data1);
                        }
                    });

                },

                function (callback) {
                    var Search = Employee.aggregate([{
                        $lookup: {
                            from: "offices",
                            localField: "postedAt",
                            foreignField: "_id",
                            as: "postedAt"
                        }
                    }, {
                        $unwind: "$postedAt"
                    }, {
                        $lookup: {
                            from: "grades",
                            localField: "grade",
                            foreignField: "_id",
                            as: "grade"
                        }
                    }, {
                        $unwind: "$grade"
                    }, {
                        $match: {
                            $or: [{
                                "grade.name": {
                                    $regex: data.keyword,
                                    $options: 'i'
                                }
                            }, {
                                "postedAt.name": {
                                    $regex: data.keyword,
                                    $options: 'i'
                                }
                            }, {
                                "name": {
                                    $regex: data.keyword,
                                    $options: 'i'
                                }
                            }, {
                                "officeEmail": {
                                    $regex: data.keyword,
                                    $options: 'i'
                                }
                            }, {
                                "officeMobile": {
                                    $regex: data.keyword,
                                    $options: 'i'
                                }
                            }]
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
                    }], function (err, data2) {
                        if (err) {
                            callback(err, null);
                        } else {
                            callback(null, data2);
                        }
                    });
                }

                //end
            ], function (err, data4) {
                if (err) {
                    callback(err, null);
                }
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
            });
        } else {
            var Search = Model.find(data.filter)
                .order(options)
                .deepPopulate("postedAt grade")
                .keyword(options)
                .page(options, callback);
        }
    },

    employeeSearch: function (data, callback) {

        var Model = this;
        var Const = this(data);
        var maxRow = Config.maxRow;
        var pagestartfrom = (data.page - 1) * maxRow;
        var page = 1;
        // var name1=subString()
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
                asc: "name",
            },
            start: (page - 1) * maxRow,
            count: maxRow
        };

        var Search = Model.find(data.filter)
            .order(options)
            .deepPopulate("postedAt grade")
            .keyword(options)
            .page(options, callback);

    },

    searchEmployee: function (data, callback) {
        var Model = this;
        var Const = this(data);
        var maxRow = Config.maxRow;
        var page = 1;
        // var name1=subString()
        if (data.page) {
            page = data.page;
        }
        var field = data.field;
        var options = {
            field: data.field,
            filters: {
                keyword: {
                    fields: [''],
                    term: data.key
                }
            },

            sort: {
                desc: "name",
            },
            start: (page - 1) * maxRow,
            count: maxRow
        };

        var Search = Model.find({
                name: {
                    $regex: data.keyword,
                    $options: 'i'
                }
            }, {
                name: 1,
                officeEmail: 1
            })
            .order(options)
            .keyword(options)
            .page(options, callback);
    },

    getEmployeeNameEmail: function (data, callback) {

        var Model = this;
        var Const = this(data);
        var maxRow = Config.maxRow;
        var pagestartfrom = (data.page - 1) * maxRow;
        var page = 1;
        // var name1=subString()
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
                asc: "name",
            },
            start: (page - 1) * maxRow,
            count: maxRow
        };

        var Search = Model.find(data.filter)
            .order(options)
            .deepPopulate("postedAt grade")
            .keyword(options)
            .page(options, function (err, userData) {
                // //console.log("getemp", userData);
                if (err) {
                    callback(err, null);
                } else {
                    if (_.isEmpty(userData)) {
                        callback([], null);
                    } else {
                        var newData = [];
                        _.each(userData.results, function (values) {
                            newData.push({
                                name: values.name,
                                email: values.officeEmail
                            });
                        });
                        callback(null, newData);
                    }

                }
            });

    },

    // getDashboardCounts: function (data, callback, user) {
    //     //console.log("user.children",user.children);
    //     if (_.isEmpty(user)) {
    //         var allUsersUnder = _.map(data.ownerId, function (n) {
    //             return objectid(n);
    //         });
    //     } else {
    //         var allUsersUnder = _.map(_.concat(user.children, data.ownerId), function (n) {
    //             return objectid(n);
    //         });
    //     }

    //     var matchObj = {
    //         $match: {
    //             $or: [{
    //                 'shareWith.persons': {
    //                     $in: allUsersUnder
    //                 }
    //             }, {
    //                 'owner': {
    //                     $in: allUsersUnder
    //                 }
    //             }]
    //         }
    //     };
    //     Assignment.aggregate([
    //         matchObj,
    //         {
    //             $group: {
    //                 _id: "$timelineStatus",
    //                 count: {
    //                     $sum: 1
    //                 }
    //             }
    //         }, {
    //             $project: {
    //                 "_id": 1,
    //                 "count": 1
    //             }
    //         }
    //     ], function (err, counts) {
    //         if (err) {
    //             callback(err, null);
    //         } else {
    //             if (counts == []) {
    //                 callback(null, counts);
    //             } else {
    //                 callback(null, counts);
    //             }
    //         }
    //     });
    // },
    getGroupByData: function (type) {
        var groupBy = "";
        switch (type) {
            case "timelineStatus":
                groupBy = [{
                    $group: {
                        _id: "$timelineStatus",
                        count: {
                            $sum: 1
                        }
                    }
                }]
                break;
            case "ilaPending":
                groupBy = [{
                    "$unwind": "$templateIla"
                }, {
                    $match: {
                        "templateIla.approvalStatus": "Pending"
                    }
                }, {
                    $group: {
                        _id: "$templateIla.approvalStatus",
                        count: {
                            $sum: 1
                        }
                    }
                }]
                break;
            case "lorPending":
                groupBy = [{
                    "$unwind": "$templateLor"
                }, {
                    $match: {
                        "templateLor.approvalStatus": "Pending"
                    }
                }, {
                    $group: {
                        _id: "$templateLor.approvalStatus",
                        count: {
                            $sum: 1
                        }
                    }
                }]
                break;
            case "invoicePending":
                groupBy = [{
                    $unwind: {
                        path: "$invoice",
                        preserveNullAndEmptyArrays: true
                    }
                }, {
                    $lookup: {
                        from: "invoices",
                        localField: "invoice",
                        foreignField: "_id",
                        as: "invoice"
                    }
                }, {
                    $unwind: {
                        path: "$invoice",
                        preserveNullAndEmptyArrays: true
                    }
                }, {
                    $match: {
                        "invoice.approvalStatus": "Pending"
                    }
                }, {
                    $group: {
                        _id: "$invoice.approvalStatus",
                        count: {
                            $sum: 1
                        }
                    }
                }]
                break;
            case "sbcPending":
                groupBy = [{
                    "$unwind": "$survey"
                }, {
                    $match: {
                        "survey.status": "Approval Pending"
                    }
                }, {
                    $group: {
                        _id: "$survey.status",
                        count: {
                            $sum: 1
                        }
                    }
                }]
                break;
            case "assignmentPending":
                groupBy = [{
                    $match: {
                        $or: [{
                            "assignmentapprovalStatus": "Pending ForceClosed"
                        }, {
                            "assignmentapprovalStatus": "Pending ReOpened"
                        }, {
                            "assignmentapprovalStatus": "Pending OnHold"
                        }, {
                            "assignmentapprovalStatus": "Request AccessButton"
                        }]
                    }
                }, {
                    $group: {
                        _id: "$assignmentapprovalStatus",
                        count: {
                            $sum: 1
                        }
                    }
                }]
                break;
            default:
                groupBy = null;
                break;
        }

        return groupBy;
    },
    getGroupByDataNew: function (type, match) {
        var groupBy = "";
        var matchObj = {};
        switch (type) {
            case "timelineStatus":
                groupBy = [{
                    $group: {
                        _id: "$timelineStatus",
                        count: {
                            $sum: 1
                        }
                    }
                }]
                break;
            case "ilaPending":
                var matchCond = {
                    templateIla: {
                        $elemMatch: {
                            approvalStatus: "Pending"
                        }
                    }
                }
                matchObj = Object.assign(match, matchCond);
                break;
            case "lorPending":
                var matchCond = {
                    templateLor: {
                        $elemMatch: {
                            approvalStatus: "Pending"
                        }
                    }
                }
                matchObj = Object.assign(match, matchCond);
                break;
            case "invoicePending":
                groupBy = [{
                    $unwind: {
                        path: "$invoice",
                        preserveNullAndEmptyArrays: true
                    }
                }, {
                    $lookup: {
                        from: "invoices",
                        localField: "invoice",
                        foreignField: "_id",
                        as: "invoice"
                    }
                }, {
                    $unwind: {
                        path: "$invoice",
                        preserveNullAndEmptyArrays: true
                    }
                }, {
                    $match: {
                        "invoice.approvalStatus": "Pending"
                    }
                }, {
                    $group: {
                        _id: "$invoice.approvalStatus",
                        count: {
                            $sum: 1
                        }
                    }
                }]
                break;
            case "sbcPending":
                var matchCond = {
                    survey: {
                        $elemMatch: {
                            status: "Approval Pending"
                        }
                    }
                }
                matchObj = Object.assign(match, matchCond);
                break;
            case "assignmentPending":
                var arr = ["Pending ForceClosed", "Pending ReOpened", "Pending OnHold", "Request AccessButton"];
                var matchCond = {
                    assignmentapprovalStatus: {
                        $in: arr
                    }
                }
                matchObj = Object.assign(match, matchCond);
                break;
            default:
                groupBy = null;
                break;
        }
        return matchObj;
    },
    getCountsWithGroupByNew: function (type, match, isSBC, callback) {
        var groupBy = Employee.getGroupByDataNew(type, match);
        Assignment.find(groupBy, {
            name: 1,
        }).exec(function (err, data) {
            if (err) {
                callback(err, null);
            } else {
                var count = {
                    count: data.length
                }
                callback(null, count)
            }
        })
    },
    getCountsWithGroupBy: function (type, match, isSBC, callback) {
        var groupBy = Employee.getGroupByData(type);
        var project = [{
            $project: {
                "_id": 1,
                "count": 1
            }
        }];
        if (isSBC === true) {
            var matchArray = _.compact(_.concat(groupBy, project));
        } else {
            var matchArray = _.compact(_.concat(match, groupBy, project));
        }
        Assignment.aggregate(matchArray, function (err, counts) {
            if (err) {
                callback(err, null);
            } else {
                callback(null, counts);
            }
        });
    },
    getDashboardCounts: function (data, callback, user) {
        if (_.isEmpty(user)) {
            var allUsersUnder = _.map(data.ownerId, function (n) {
                return objectid(n);
            });
        } else {
            var allUsersUnder = _.map(_.concat(user.children, data.ownerId), function (n) {
                return objectid(n);
            });
        }
        var sbcFlag = data.isSBC;
        var matchObj = [{
            $match: {
                $or: [{
                    'shareWith.persons': {
                        $in: allUsersUnder
                    }
                }, {
                    'owner': {
                        $in: allUsersUnder
                    }
                }]
            }
        }];
        if (data.typeOfStatus === "Global") {
            matchObj = [];
        }

        if (_.isEmpty(data.typeOfStatus)) {
            callback(null, {
                timelineStatus: [],
                ilaPending: [],
                lorPending: [],
                invoicePending: [],
                sbcPending: [],
                assignmentPending: []
            });
        } else {
            async.parallel({
                timelineStatus: function (callback1) {
                    Employee.getCountsWithGroupBy("timelineStatus", matchObj, '', callback1);
                },
                ilaPending: function (callback1) {
                    Employee.getCountsWithGroupBy("ilaPending", matchObj, '', callback1);
                },
                lorPending: function (callback1) {
                    Employee.getCountsWithGroupBy("lorPending", matchObj, '', callback1);
                },
                invoicePending: function (callback1) {
                    Employee.getCountsWithGroupBy("invoicePending", matchObj, '', callback1);
                },
                sbcPending: function (callback1) {
                    Employee.getCountsWithGroupBy("sbcPending", matchObj, sbcFlag, callback1);
                },
                assignmentPending: function (callback1) {
                    Employee.getCountsWithGroupBy("assignmentPending", matchObj, '', function (err, datas) {
                        var counts = 0;
                        if (!_.isEmpty(datas)) {
                            _.each(datas, function (val) {
                                counts = counts + val.count;
                            })
                        }
                        callback1(null, [{
                            count: counts
                        }])
                    });
                },
            }, function (err, data2) {
                if (err || _.isEmpty(data2)) {
                    callback(err, data2);
                } else {
                    callback(null, data2);
                }
            });
        }

    },
    getNavigationCounts: function (data, callback, user) {
        if (_.isEmpty(user)) {
            var allUsersUnder = _.map(data.ownerId, function (n) {
                return objectid(n);
            });
        } else {
            var allUsersUnder = _.map(_.concat(user.children, data.ownerId), function (n) {
                return objectid(n);
            });
        }
        var sbcFlag = data.isSBC;
        var matchObj = {
            "$or": [{
                'shareWith.persons': {
                    $in: allUsersUnder
                }
            }, {
                'owner': {
                    $in: allUsersUnder
                }
            }]
        };
        var matchObjAggr = [{
            $match: {
                $or: [{
                    'shareWith.persons': {
                        $in: allUsersUnder
                    }
                }, {
                    'owner': {
                        $in: allUsersUnder
                    }
                }]
            }
        }];

        async.parallel({
            ilaPending: function (callback1) {
                Employee.getCountsWithGroupByNew("ilaPending", _.cloneDeep(matchObj), "", callback1);
            },
            lorPending: function (callback1) {
                Employee.getCountsWithGroupByNew("lorPending", _.cloneDeep(matchObj), "", callback1);
            },
            invoicePending: function (callback1) {
                Employee.getCountsWithGroupBy("invoicePending", _.cloneDeep(matchObjAggr), "", callback1);
            },
            sbcPending: function (callback1) {
                Employee.getCountsWithGroupByNew("sbcPending", _.cloneDeep(matchObj), sbcFlag, callback1);
            },
            assignmentPending: function (callback1) {
                Employee.getCountsWithGroupByNew("assignmentPending", _.cloneDeep(matchObj), "", callback1);
            },
        }, function (err, data2) {
            if (err || _.isEmpty(data2)) {
                callback(err, data2);
            } else {
                callback(null, data2);
            }
        });
    },
    // getNavigationCounts: function (data, callback, user) {
    //     if (_.isEmpty(user)) {
    //         var allUsersUnder = _.map(data.ownerId, function (n) {
    //             return objectid(n);
    //         });
    //     } else {
    //         var allUsersUnder = _.map(_.concat(user.children, data.ownerId), function (n) {
    //             return objectid(n);
    //         });
    //     }
    //     var sbcFlag = data.isSBC;
    //     var matchObj = [{
    //         $match: {
    //             $or: [{
    //                 'shareWith.persons': {
    //                     $in: allUsersUnder
    //                 }
    //             }, {
    //                 'owner': {
    //                     $in: allUsersUnder
    //                 }
    //             }]
    //         }
    //     }];
    //     async.parallel({
    //         ilaPending: function (callback1) {
    //             Employee.getCountsWithGroupBy("ilaPending", matchObj, "", callback1);
    //         },
    //         lorPending: function (callback1) {
    //             Employee.getCountsWithGroupBy("lorPending", matchObj, "", callback1);
    //         },
    //         invoicePending: function (callback1) {
    //             Employee.getCountsWithGroupBy("invoicePending", matchObj, "", callback1);
    //         },
    //         sbcPending: function (callback1) {
    //             Employee.getCountsWithGroupBy("sbcPending", matchObj, sbcFlag, callback1);
    //         },
    //         assignmentPending: function (callback1) {
    //             Employee.getCountsWithGroupBy("assignmentPending", matchObj, "", function (err, datas) {
    //                 var counts = 0;
    //                 if (!_.isEmpty(datas)) {
    //                     _.each(datas, function (val) {
    //                         counts = counts + val.count;
    //                     })
    //                 }
    //                 callback1(null, [{
    //                     count: counts
    //                 }])
    //             });
    //         },
    //     }, function (err, data2) {
    //         if (err || _.isEmpty(data2)) {
    //             callback(err, data2);
    //         } else {
    //             callback(null, data2);
    //         }
    //     });
    // },
    getSummaryMatchedDate: function (countType, type) {
        function getToDate(dates) {
            // console.log('dates',dates);
            if (_.isEmpty(dates)) {
                var tdate = new Date();
            } else {
                var tdate = new Date(dates);
            }
            tdate.setHours(5);
            tdate.setMinutes(30);
            tdate.setSeconds(0);
            tdate.setMilliseconds(0);
            tdate.setHours(28);
            tdate.setMinutes(89);
            tdate.setSeconds(59);
            tdate.setMilliseconds(999);
            return tdate
        }

        function getFromDate(datess) {
            if (_.isEmpty(datess)) {
                var fdate = new Date();
            } else {
                var fdate = new Date(datess);
            }
            fdate.setHours(5);
            fdate.setMinutes(30);
            fdate.setSeconds(0);
            fdate.setMilliseconds(0);
            return fdate
        }
        var today = new Date(moment().add(5, "hours").add(30, "minutes"));
        var year = moment(today).year();
        var month = moment(today).month();
        month++;
        var findMatch = {};
        switch (countType) {
            case "today":
                var d = new Date();
                d.setHours(5);
                d.setMinutes(30);
                d.setSeconds(0);
                d.setMilliseconds(0);
                d.setHours(28);
                d.setMinutes(89);
                d.setSeconds(59);
                d.setMilliseconds(999);
                var toDate = d;
                if (type === "forceClosed") {
                    findMatch = {
                        forceClosedRespTime: {
                            $gte: new Date(moment().subtract(5, "hours").subtract(30, "minutes")),
                            $lte: toDate
                        }
                    }
                } else if (type === "login") {
                    findMatch = {
                        dateOfAppointment: {
                            $gte: new Date(moment().subtract(1, "day")),
                            $lte: new Date(moment())
                        }
                    }
                } else if (type === "sales") {
                    findMatch = {
                        'invoice.approvalTime': {
                            $gte: new Date(moment().subtract(5, "hours").subtract(30, "minutes")),
                            $lte: toDate
                        }
                    }
                } else {
                    findMatch = {
                        'getAllTaskStatus.invoiceTime': {
                            $gte: new Date(moment().subtract(5, "hours").subtract(30, "minutes")),
                            $lte: toDate
                        }
                    }
                }
                break;
            case "month":
                var start = new Date(month + '/01/' + year);
                var startDate = moment(month + '/01/' + year);
                var endDate = new Date(startDate.clone().endOf('month'));
                var toDate = getToDate(endDate);
                var fromDate = getFromDate(start);
                if (type === "forceClosed") {
                    findMatch = {
                        forceClosedRespTime: {
                            $gte: start,
                            $lte: endDate
                        }
                    }
                } else if (type === "login") {
                    var frmDate = getFromDate(moment(start).subtract(1, "day"));
                    console.log("frmDate", frmDate, "start", start, "");
                    findMatch = {
                        dateOfAppointment: {
                            $gte: new Date(moment(start).subtract(1, "day")),
                            $lte: toDate
                        }
                    }
                } else if (type === "sales") {
                    findMatch = {
                        'invoice.approvalTime': {
                            $gte: start,
                            $lte: endDate
                        }
                    }
                    //                     console.log("in  sales from date" ,fromDate, "END Date",endDate);
                } else {
                    findMatch = {
                        'getAllTaskStatus.invoiceTime': {
                            $gte: start,
                            $lte: endDate
                        }
                    }
                    //                     console.log(" in log out from date ",fromDate, "END Date",endDate);
                }


                break;
            case "quarterly":
                if (month === 4 || month === 5 || month === 6) {
                    var fromDate = "4/1/" + year;
                    var toDate = "6/30/" + year;
                }
                if (month === 7 || month === 8 || month === 9) {
                    var fromDate = "7/1/" + year;
                    var toDate = "9/30/" + year;
                }
                if (month === 10 || month === 11 || month === 12) {
                    var fromDate = "10/1/" + year;
                    var toDate = "12/31/" + year;
                }
                if (month === 1 || month === 2 || month === 3) {
                    var fromDate = "1/1/" + year;
                    var toDate = "3/31/" + year;
                }

                if (type === "forceClosed") {
                    findMatch = {
                        forceClosedRespTime: {
                            $gte: new Date(moment(fromDate).add(5, "hours").add(30, "minutes")),
                            $lte: new Date(moment(toDate).add(5, "hours").add(30, "minutes"))
                        }
                    }
                } else if (type === "login") {
                    findMatch = {
                        dateOfAppointment: {
                            $gte: new Date(moment(fromDate).add(5, "hours").add(30, "minutes")),
                            $lte: new Date(moment(toDate).add(5, "hours").add(30, "minutes"))
                        }
                    }
                } else if (type === "sales") {
                    findMatch = {
                        'invoice.approvalTime': {
                            $gte: new Date(moment(fromDate).add(5, "hours").add(30, "minutes")),
                            $lte: new Date(moment(toDate).add(5, "hours").add(30, "minutes"))
                        }
                    }
                } else {
                    findMatch = {
                        'getAllTaskStatus.invoiceTime': {
                            $gte: new Date(moment(fromDate).add(5, "hours").add(30, "minutes")),
                            $lte: new Date(moment(toDate).add(5, "hours").add(30, "minutes"))
                        }
                    }
                }
                break;
            case "year":
                var fromDate = new Date(moment("4/1/" + year).add(5, "hours").add(30, "minutes"));
                year = year + 1;
                var toDate = new Date(moment("3/31/" + year).add(5, "hours").add(30, "minutes"));
                if (type === "forceClosed") {
                    findMatch = {
                        forceClosedRespTime: {
                            $gte: fromDate,
                            $lte: toDate
                        }
                    }
                } else if (type === "login") {
                    findMatch = {
                        dateOfAppointment: {
                            $gte: fromDate,
                            $lte: toDate
                        }
                    }
                } else if (type === "sales") {
                    findMatch = {
                        'invoice.approvalTime': {
                            $gte: fromDate,
                            $lte: toDate
                        }
                    }
                } else {
                    findMatch = {
                        'getAllTaskStatus.invoiceTime': {
                            $gte: fromDate,
                            $lte: toDate
                        }
                    }
                }

                break;
            default:
                findMatch = null;
                break;
        }
        // //console.log(countType, type, 'findMatch : ', findMatch);
        return findMatch;
    },
    getSummaryTypeMatch: function (type) {
        var invoiceStatus = [{
            "invoice.approvalStatus": "Approved"
        }, {
            "invoice.approvalStatus": "Revised"
        }];
        var matchData = "";
        switch (type) {
            case "login":
                matchData = null;
                break;
            case "forceClosed":
                matchData = {
                    timelineStatus: "Force Closed"
                }
                break;
            case "logout":
                matchData = {
                    "getAllTaskStatus.invoice": "Done"
                }
                break;
            case "collected":
                matchData = null
                break;
            case "sales":
                matchData = [{
                    $unwind: {
                        path: "$invoice",
                        preserveNullAndEmptyArrays: true
                    }
                }, {
                    $lookup: {
                        from: "invoices",
                        localField: "invoice",
                        foreignField: "_id",
                        as: "invoice"
                    }
                }, {
                    $unwind: {
                        path: "$invoice",
                        preserveNullAndEmptyArrays: true
                    }
                }, {
                    $match: {
                        $or: invoiceStatus
                    }
                }]
                break;
            case "receipt":
                matchData = null
                break;
            default:
                matchData = null;
                break;
        }

        return matchData;
    },
    getSummaryAggregateGroupBy: function (type) {
        var matchData = "";
        switch (type) {
            case "collected":
                matchData = null
                break;
            case "sales":
                matchData = [{
                    $group: {
                        _id: "$invoice.approvalStatus",
                        count: {
                            $sum: "$invoice.grandTotal"
                        }
                    }
                }]
                break;
            case "receipt":
                matchData = null
                break;
            default:
                matchData = null;
                break;
        }

        return matchData;
    },
    getSummaryCounts: function (countType, type, match, callback) {
        var summaryTypeMatch = Employee.getSummaryTypeMatch(type);
        var summaryMatchedDate = Employee.getSummaryMatchedDate(countType, type);
        var groupBy = Employee.getSummaryAggregateGroupBy(type);
        if (type === "sales") {
            var findMatchData = [{
                $match: summaryMatchedDate
            }]
            Assignment.aggregate(_.compact(_.concat(match, summaryTypeMatch, findMatchData, groupBy)), function (err, counts) {
                if (err) {
                    callback(err, null);
                } else if (_.isEmpty(counts)) {
                    callback(null, [{
                        count: 0
                    }]);
                } else {
                    callback(null, counts);
                }
            });
        } else {
            Assignment.count(Object.assign(match, summaryTypeMatch, summaryMatchedDate)).lean().exec(function (err, counts) {
                if (err) {
                    callback(err, null);
                } else {
                    callback(null, counts);
                }
            });
        }

    },
    getNestedAsync: function (type, match, callback) {
        if (type == "login" || type == "forceClosed" || type == "logout") {
            if (_.isEmpty(match.branch)) {
                match = {
                    $or: match.$or
                };
            } else {
                match = {
                    $or: match.$or,
                    branch: match.branch
                };
            }
        }
        async.parallel({
            today: function (callback1) {
                Employee.getSummaryCounts("today", type, match, callback1);
            },
            month: function (callback1) {
                Employee.getSummaryCounts("month", type, match, callback1);
            },
            quarterly: function (callback1) {
                Employee.getSummaryCounts("quarterly", type, match, callback1);
            },
            year: function (callback1) {
                Employee.getSummaryCounts("year", type, match, callback1);
            },
        }, function (err, data2) {
            if (err || _.isEmpty(data2)) {
                callback(err, data2);
            } else {
                callback(null, data2);
            }
        });
    },
    getAssignmentSummary: function (data, callback, user) {
        if (_.isEmpty(user)) {
            var allUsersUnder = _.map(data.ownerId, function (n) {
                return objectid(n);
            });
        } else {
            var allUsersUnder = _.map(_.concat(user.children, data.ownerId), function (n) {
                return objectid(n);
            });
        }
        var matchIds = [{
            'shareWith.persons': {
                $in: allUsersUnder
            }
        }, {
            'owner': {
                $in: allUsersUnder
            }
        }];
        if (_.isEmpty(data.branch)) {
            var matchArray = [{
                $match: {
                    $or: matchIds
                }
            }];
            var matchObj = {
                $or: matchIds
            };
        } else {
            var matchArray = [{
                $match: {
                    $or: matchIds,
                    branch: {
                        $in: _.map(data.branch, function (n) {
                            return objectid(n);
                        })
                    }
                }
            }];
            var matchObj = {
                $or: matchIds,
                branch: {
                    $in: data.branch
                }
            };
        }
        async.parallel({
            login: function (callback1) {
                Employee.getNestedAsync("login", matchObj, callback1);
            },
            forceClosed: function (callback1) {
                Employee.getNestedAsync("forceClosed", matchObj, callback1);
            },
            logout: function (callback1) {
                Employee.getNestedAsync("logout", matchObj, callback1);
            },
            // collected: function (callback1) {
            //     Employee.getNestedAsync("collected", matchArray, callback1);
            // },
            sales: function (callback1) {
                Employee.getNestedAsync("sales", matchArray, function (err, datas) {
                    var today = 0;
                    var month = 0;
                    var quarterly = 0;
                    var year = 0;
                    _.each(datas.today, function (val) {
                        today = today + val.count;
                    });
                    _.each(datas.month, function (val) {
                        month = month + val.count;
                    });
                    _.each(datas.quarterly, function (val) {
                        quarterly = quarterly + val.count;
                    });
                    _.each(datas.year, function (val) {
                        year = year + val.count;
                    });
                    callback1(null, {
                        today: [{
                            count: today
                        }],
                        month: [{
                            count: month
                        }],
                        quarterly: [{
                            count: quarterly
                        }],
                        year: [{
                            count: year
                        }]
                    })
                });
            },
            // receipt: function (callback1) {
            //     Employee.getNestedAsync("receipt", matchArray, callback1);
            // },
        }, function (err, data2) {
            if (err || _.isEmpty(data2)) {
                callback(err, data2);
            } else {
                data2.netLogin = {
                    today: data2.login.today - data2.forceClosed.today,
                    month: data2.login.month - data2.forceClosed.month,
                    quarterly: data2.login.quarterly - data2.forceClosed.quarterly,
                    year: data2.login.year - data2.forceClosed.year
                };
                data2.disposalRatio = {
                    today: Math.round(((data2.logout.today / data2.netLogin.today) * 100)),
                    month: Math.round(((data2.logout.month / data2.netLogin.month) * 100)),
                    quarterly: Math.round(((data2.logout.quarterly / data2.netLogin.quarterly) * 100)),
                    year: Math.round(((data2.logout.year / data2.netLogin.year) * 100))
                };
                callback(null, data2);
            }
        });
    },
    getAllBranch: function (data, callback) {
        var Model = this;
        var Search = Model.findOne({
            "_id": data.filter._id
        }).lean().populate('allBranch').exec(function (err, data2) {
            if (err) {
                callback(err, data2);
            } else if (_.isEmpty(data2)) {
                callback(err, data2);
            } else {
                var data3 = {};
                data3.results = data2.allBranch;
                callback(err, data3);
            }
        });
    },





};
module.exports = _.assign(module.exports, exports, model);