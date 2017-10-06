var schema = new Schema({
    name: {
        type: String
    },
    insuredCompany: {
        type: Schema.Types.ObjectId,
        ref: "CustomerCompany",
        required: true,
        key: "policydoc"
    },
    insuredOffice: {
        type: Schema.Types.ObjectId,
        ref: "Customer",
        required: true,
        key: "policydoc",
        unique: true
    },
    listOfDocuments: [{
        name: {
            type: String
        },
        policyNo: {
            type: String
        },
        department: {
            type: Schema.Types.ObjectId,
            ref: "Department",
            required: true,
            key: "policydoc"
        },
        policyType: {
            type: Schema.Types.ObjectId,
            ref: "PolicyType",
            required: true,
            key: "policydoc"
        },
        insurerCompany: {
            type: Schema.Types.ObjectId,
            ref: "CustomerCompany",
            required: true,
            key: "insurercompany"
        },
        insurerOffice: {
            type: Schema.Types.ObjectId,
            ref: "Customer",
            required: true,
            key: "insureroffice"
        },
        from: {
            type: Date
        },
        to: {
            type: Date
        },
        documentImage: {
            type: String
        }
    }],
    status: {
        type: Boolean,
        default: true
    }
});

schema.plugin(deepPopulate, {
    'insuredCompany': {
        select: 'name _id'
    },
    'insuredOffice': {
        select: 'name _id'
    },
    'listOfDocuments.department': {
        select: 'name _id'
    },
    'listOfDocuments.policyType': {
        select: 'name _id'
    },
    'listOfDocuments.insurerCompany': {
        select: 'name _id'
    },
    'listOfDocuments.insurerOffice': {
        select: 'name _id'
    },
});
schema.plugin(uniqueValidator);
schema.plugin(timestamps);
module.exports = mongoose.model('PolicyDoc', schema);

var exports = _.cloneDeep(require("sails-wohlig-service")(schema, "insuredCompany insuredOffice listOfDocuments.department listOfDocuments.policyType listOfDocuments.insurerCompany listOfDocuments.insurerOffice", "insuredCompany insuredOffice listOfDocuments.department listOfDocuments.policyType listOfDocuments.insurerCompany listOfDocuments.insurerOffice"));
var model = {
    saveData: function (data, callback) {
        var Model = this;
        var Const = this(data);
        var foreignKeys = Config.getForeignKeys(schema);

        CustomerCompany.findOne({
            _id: data.insuredCompany
        }).exec(function (err, data2) {
            if (err && !data2._id) {
                callback(err);
            } else {
                Customer.findOne({
                    _id: data.insuredOffice
                }).exec(function (err, data3) {
                    if (err && !data3._id) {
                        callback(err);
                    } else {
                        data.name = data2.name + " " + data3.name;
                        Const = Model(data);
                        afterName();
                    }
                });
            }

        });


        function afterName() {
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
                        });


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
                            callback(err, data2);
                        });

                    }
                });

            }
        }

    },
    getPolicyDoc: function (data, callback) {
        var Model = this;
        var aggText = [];
        if (!data.keyword) {
            data.keyword = "";
        }
        // var searchText = new RegExp(data.keyword, "i");
        // //console.log("policyDoc = ",data);
        if (data.filter && data.filter._id && mongoose.Types.ObjectId.isValid(data.filter._id)) {
            aggText = [{
                "$unwind": "$listOfDocuments"
            }, {
                "$match": {
                    "listOfDocuments._id": mongoose.Types.ObjectId(data.filter._id),
                    "listOfDocuments.name": {
                        $regex: data.keyword,
                        $options: 'i'
                    }
                }
            }, {
                "$limit": 10
            }];
        } else if (data.filter && data.filter.policyType && mongoose.Types.ObjectId.isValid(data.filter.policyType)) {
            aggText = [{
                "$unwind": "$listOfDocuments"
            }, {
                "$match": {
                    "listOfDocuments.policyType": mongoose.Types.ObjectId(data.filter.policyType),
                    // "listOfDocuments.insurerCompany": mongoose.Types.ObjectId(data.filter.insurerCompany),
                    // "listOfDocuments.insurerOffice": mongoose.Types.ObjectId(data.filter.insurerOffice),
                    "listOfDocuments.name": {
                        $regex: data.keyword,
                        $options: 'i'
                    }
                }
            }, {
                "$limit": 10
            }];
            if (data.filter && data.filter.insurerOffice && mongoose.Types.ObjectId.isValid(data.filter.insurerOffice) && data.filter.insuredOffice && mongoose.Types.ObjectId.isValid(data.filter.insuredOffice)) {
                aggText[1].$match["listOfDocuments.insurerOffice"] = mongoose.Types.ObjectId(data.filter.insurerOffice);
                aggText[1].$match["insuredOffice"] = mongoose.Types.ObjectId(data.filter.insuredOffice);
            }


        } else {
            callback("Data not Formatted", null);
            return false;
        }

        Model.aggregate(aggText).exec(function (err, data2) {
            var data3 = [];
            _.each(data2, function (n) {
                data3.push(n.listOfDocuments);
            });
            var resultdoc = {};
            resultdoc.results = data3;
            // //console.log("resultdoc = ",resultdoc);
            callback(err, resultdoc);
        });
    },

    getPolicyDocData: function (data, callback) {
        var Model = this;
        var aggText = [];
        Model.find({
            listOfDocuments: {
                $elemMatch: {
                    _id: mongoose.Types.ObjectId(data.policyDoc)
                }
            }
        }, {
            "listOfDocuments.$": 1
        }).lean().exec(function (err, data2) {
            if (err) {
                callback(err, null);
            } else {
                if (data2[0]) {
                    if (data2[0].listOfDocuments) {
                        callback(null, data2[0].listOfDocuments[0]);
                    } else {
                        callback(null, "");
                    }
                } else {
                    callback(null, "");
                }
            }
        });
    },
};
module.exports = _.assign(module.exports, exports, model);