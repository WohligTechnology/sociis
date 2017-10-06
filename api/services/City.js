var schema = new Schema({
    name: {
        type: String,
        required: true,
        capitalizeAll: true,
    },
    district: {
        type: Schema.Types.ObjectId,
        ref: "District",
        index: true,
        required: true,
        key: "city"
    },
    company: {
        type: [{
            type: Schema.Types.ObjectId,
            ref: "Company",
        }],
        index: true,
        restrictedDelete: true
    },
    office: {
        type: [{
            type: Schema.Types.ObjectId,
            ref: "Office",
        }],
        index: true,
        restrictedDelete: true
    },
    customer: {
        type: [{
            type: Schema.Types.ObjectId,
            ref: "Customer",
        }],
        index: true,
        restrictedDelete: true
    },
    employee: {
        type: [{
            type: Schema.Types.ObjectId,
            ref: "Employee",
        }],
        index: true,
        restrictedDelete: true
    },
    employeePosted: {
        type: [{
            type: Schema.Types.ObjectId,
            ref: "Employee",
        }],
        index: true,
        restrictedDelete: true
    },
    stdCode: Number,
    timezone: {
        type: Number,
        default: 5.5
    }
});

schema.plugin(uniqueValidator);
schema.plugin(timestamps);
schema.plugin(deepPopulate, {

    populate: {
        'district': {
            select: 'name _id state'
        },
        'district.state': {
            select: 'name _id zone'
        },
        'district.state.zone': {
            select: 'name _id country'
        },
        'district.state.zone.country': {
            select: 'name countryCode _id'
        }
    }

});
module.exports = mongoose.model("City", schema);

var exports = _.cloneDeep(require("sails-wohlig-service")(schema, "district.state.zone.country", "district.state.zone.country"));

var model = {

    populateCityDetails: function (data, callback) {
        if (data && data.filter && data.filter._id) {
            City.search(data, function (err, data1) {
                data4 = _.cloneDeep(data1);
                _.each(data4.results, function (n) {
                    if (n.name) {
                        n.name = n.name + ", " + n.district.name + ", " + n.district.state.name + ", " + n.district.state.zone.name + ", " + n.district.state.zone.country.name;
                    }
                });
                callback(err, data4);
            });
        } else {
            var keys = _.split(data.keyword, " ");
            stringMatch = [];
            _.each(keys, function (key) {
                var data = {
                    keyword: key
                };

                stringMatch.push({
                    "name": {
                        $regex: data.keyword,
                        $options: 'i'
                    }
                });

                stringMatch.push({
                    "districts.name": {
                        $regex: data.keyword,
                        $options: 'i'
                    }
                });

                stringMatch.push({
                    "districts.states.name": {
                        $regex: data.keyword,
                        $options: 'i'
                    }
                });

                stringMatch.push({
                    "districts.states.zones.name": {
                        $regex: data.keyword,
                        $options: 'i'
                    }
                });

                stringMatch.push({
                    "districts.states.zones.countries.name": {
                        $regex: data.keyword,
                        $options: 'i'
                    }
                });
            });

            City.aggregate([{
                $lookup: {
                    from: "districts",
                    localField: "district",
                    foreignField: "_id",
                    as: "districts"
                }
            }, {
                $unwind: "$districts"
            }, {
                $lookup: {
                    from: "states",
                    localField: "districts.state",
                    foreignField: "_id",
                    as: "districts.states"
                }
            }, {
                $unwind: "$districts.states"
            }, {
                $lookup: {
                    from: "zones",
                    localField: "districts.states.zone",
                    foreignField: "_id",
                    as: "districts.states.zones"
                }
            }, {
                $unwind: "$districts.states.zones"
            }, {
                $lookup: {
                    from: "countries",
                    localField: "districts.states.zones.country",
                    foreignField: "_id",
                    as: "districts.states.zones.countries"
                }
            }, {
                $unwind: "$districts.states.zones.countries"
            }, {
                $match: {
                    $or: stringMatch
                }
            }, {
                $project: {
                    _id: 1,
                    city: "$name",
                    district: "$districts.name",
                    state: "$districts.states.name",
                    zone: "$districts.states.zones.name",
                    country: "$districts.states.zones.countries.name"
                }
            }, {
                $limit: 10
            }], function (err, data4) {
                if (err) {

                } else {
                    _.each(data4, function (n) {
                        n.name = n.city + ", " + n.district + ", " + n.state + ", " + n.zone + ", " + n.country;
                    });
                    var obj = {
                        results: data4
                    };
                    callback(null, obj)
                }
            })
        }
    },

    projectionOfGetCityAggregate: function () {
        var allTable = [{
            $lookup: {
                from: "districts",
                localField: "district",
                foreignField: "_id",
                as: "districts"
            }
        }, {
            $unwind: {
                path: "$districts",
                preserveNullAndEmptyArrays: true
            }
        }, {
            $lookup: {
                from: "states",
                localField: "districts.state",
                foreignField: "_id",
                as: "districts.states"
            }
        }, {
            $unwind: {
                path: "$districts.states",
                preserveNullAndEmptyArrays: true
            }
        }, {
            $lookup: {
                from: "zones",
                localField: "districts.states.zone",
                foreignField: "_id",
                as: "districts.states.zones"
            }
        }, {
            $unwind: {
                path: "$districts.states.zones",
                preserveNullAndEmptyArrays: true
            }
        }, {
            $lookup: {
                from: "countries",
                localField: "districts.states.zones.country",
                foreignField: "_id",
                as: "districts.states.zones.countries"
            }
        }, {
            $unwind: {
                path: "$districts.states.zones.countries",
                preserveNullAndEmptyArrays: true
            }
        }];

        return allTable;
    },
    projectionOfGetCityExcelAggregate: function () {
        var allTable = [{
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
        }, {
            $lookup: {
                from: "branches",
                localField: "branch",
                foreignField: "_id",
                as: "branch"
            }
        }, {
            $unwind: {
                path: "$branch",
                preserveNullAndEmptyArrays: true
            }
        }, {
            $lookup: {
                from: "customers",
                localField: "insurerOffice",
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
                localField: "brokerOffice",
                foreignField: "_id",
                as: "broker"
            }
        }, {
            $unwind: {
                path: "$broker",
                preserveNullAndEmptyArrays: true
            }
        }, {
            $lookup: {
                from: "employees",
                localField: "owner",
                foreignField: "_id",
                as: "owner"
            }
        }, {
            $unwind: {
                path: "$owner",
                preserveNullAndEmptyArrays: true
            }
        }, {
            $lookup: {
                from: "customers",
                localField: "insuredOffice",
                foreignField: "_id",
                as: "insured"
            }
        }, {
            $unwind: {
                path: "$insured",
                preserveNullAndEmptyArrays: true
            }
        }, {
            $lookup: {
                from: "departments",
                localField: "department",
                foreignField: "_id",
                as: "department"
            }
        }, {
            $unwind: {
                path: "$department",
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
            $lookup: {
                from: "naturelosses",
                localField: "natureOfLoss",
                foreignField: "_id",
                as: "natureOfLoss"
            }
        }, {
            $unwind: {
                path: "$natureOfLoss",
                preserveNullAndEmptyArrays: true
            }
        }, {
            $unwind: {
                path: "$shareWith",
                includeArrayIndex: "arrayIndex", // optional
                preserveNullAndEmptyArrays: true // optional
            }
        }, {
            $lookup: {
                from: "employees",
                localField: "shareWith.persons",
                foreignField: "_id",
                as: "shareWith"
            }
        }, {
            $unwind: {
                path: "$shareWith",
                preserveNullAndEmptyArrays: true
            }
        }];

        return allTable;
    },
    filterOfGetCityAggregate: function (data) {
        // console.log("City Filter Data :====================  ", data);
        var filterObject = {};

        //City filter
        var city = {};
        if (!_.isEmpty(data.city)) {
            city = {
                'name': {
                    $in: _.map(data.city, function (value) {
                        return new RegExp(value, "i")
                    })
                },
            };
        }

        //District filter
        var district = {};
        if (!_.isEmpty(data.district)) {
            district = {
                'districts.name': {
                    $in: _.map(data.district, function (value) {
                        return new RegExp(value, "i")
                    })
                },
            };
        }
        //State filter
        var state = {};
        if (!_.isEmpty(data.state)) {
            state = {
                'districts.states.name': {
                    $in: _.map(data.state, function (value) {
                        return new RegExp(value, "i")
                    })
                },
            };
        }

        //Zone filter
        var zone = {};
        if (!_.isEmpty(data.zone)) {
            zone = {
                'districts.states.zones.name': {
                    $in: _.map(data.zone, function (value) {
                        return new RegExp(value, "i")
                    })
                },
            };
        }

        //Country filter
        var country = {};
        if (!_.isEmpty(data.country)) {
            country = {
                'districts.states.zones.countries': {
                    $in: _.map(data.country, function (value) {
                        return new RegExp(value, "i")
                    })
                },
            };
        }

        var filterObject = Object.assign(city, state, zone, district, country);
        if (_.isEmpty(filterObject)) {
            return null;
        } else {
            return [{
                $match: filterObject
            }];
        }

    },
    sortOfGetCityAggregate: function (data) {
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
                    city: 1
                }
            };
        } else {
            switch (data.sorting[0]) {
                case "city":
                    makeSort(data.sorting[0], data.sorting[1]);
                    break;
                case "district":
                    makeSort("district", data.sorting[1]);
                    break;
                case "state":
                    makeSort("state", data.sorting[1]);
                    break;
                case "zone":
                    makeSort("zone", data.sorting[1]);
                    break;
                case "country":
                    makeSort("country", data.sorting[1]);
                    break;
                default:
                    makeSort("city", 1);
                    break;
            }
        }
        return [sort];
    },

    getAll: function (data, callback, user) {
        var match = this.filterOfGetCityAggregate(data);
        var limit = [{
            $skip: parseInt((data.pagenumber - 1) * data.pagelimit)
        }, {
            $limit: data.pagelimit
        }];
        var coreArr = this.projectionOfGetCityAggregate();
        var projectArr = [{
            $project: {
                _id: 1,
                city: "$name",
                district: "$districts.name",
                state: "$districts.states.name",
                zone: "$districts.states.zones.name",
                country: "$districts.states.zones.countries.name"
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
        var sortArr = this.sortOfGetCityAggregate(data);
        async.parallel({
            results: function (callback) {
                City.aggregate(_.compact(_.concat(coreArr, match, projectArr, sortArr, limit))).allowDiskUse(true).exec(callback);
            },
            total: function (callback) {
                City.aggregate(_.compact(_.concat(coreArr, match, countArr))).exec(callback);
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

    generateCityExcel: function (data, callback, res) {
        var match = this.filterOfGetCityAggregate(data);
        var lookupArr = this.projectionOfGetCityAggregate();
        var projectArr = [{
            $group: {
                _id: "$_id",
                city: {
                    $first: "$name"
                },
                district: {
                    $first: "$districts.name"
                },
                state: {
                    $first: "$districts.states.name"
                },
                zone: {
                    $first: "$districts.states.zones.name"
                },
                country: {
                    $first: "$districts.states.zones.countries.name"
                }
            }
        }, {
            $project: {
                city: "$city",
                district: "$district",
                zone: "$zone",
                state: "$state",
                country: "$country"
            }
        }];
        var sortArr = this.sortOfGetCityAggregate(data);

        City.aggregate(_.compact(_.concat(lookupArr, match, projectArr, sortArr))).allowDiskUse(true).exec(function (err, data1) {
            if (err) {
                callback(null, data1);
            } else {
                if (_.isEmpty(data1)) {
                    callback("No Data found", null);
                } else {
                    var excelData = [];
                    _.each(data1, function (n, key) {
                        var obj = {};
                        obj["City"] = n.city ? _.capitalize(n.city) : "";
                        obj["District"] = n.district ? n.district : "";
                        obj["State"] = n.state ? n.state : "";
                        obj["Zone"] = n.zone ? n.zone : "";
                        obj["Country"] = n.country ? n.country : "";
                        excelData.push(obj);
                    });
                    Config.generateExcel("City", excelData, res);
                }
            }
        });
    },

};

module.exports = _.assign(module.exports, exports, model);