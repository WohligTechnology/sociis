var schema = new Schema({
    name: {
        type: String,
        required: true,
        // unique: true,
        // uniqueCaseInsensitive: true,
        capitalizeAll: true,
    },
    category: {
        type: Schema.Types.ObjectId,
        ref: "Category",
        index: true,
        required: true
    },
    status: {
        type: Boolean,
        default: true
    },
    assignment: {
        type: [{
            type: Schema.Types.ObjectId,
            ref: "Assignment",
        }],
        index: true,
        restrictedDelete: true
    },
});

schema.plugin(uniqueValidator);
schema.plugin(timestamps,timestampsAppendObject);
schema.plugin(deepPopulate, {
    populate: {
        'category': {
            select: 'name _id industry'
        },
        'category.industry': {
            select: 'name _id'
        }
    }
});
module.exports = mongoose.model('Product', schema);


var exports = _.cloneDeep(require("sails-wohlig-service")(schema, "category.industry", "category.industry"));

var model = {
    getIdByName: function (data, callback) {
        var Model = this;
        var Const = this(data);
        Model.findOne({
            name: data.name
        }, function (err, data2) {
            if (err) {
                callback(err);
            } else {
                Const.save(function (err, data3) {
                    if (err) {
                        callback(err);
                    } else {
                        callback(null, data3._id);
                    }
                });
            }
        });
    },

    populateProductDetails: function (data, callback) {
        if (data && data.filter && data.filter._id) {
                 Product.search(data, function (err, data1) {
                data4 = _.cloneDeep(data1);
                _.each(data4.results, function (n) {
                    n.name = n.name + ", " + n.category.name + ", " + n.category.industry.name;
                    //  n.name = n.name + ", " + n.category.name + ", " + n.category.industry.name;
                });
                callback(err, data4);
            });
        }
        else {
            var keys = _.split(data.keyword, " ");
            var stringMatch = [];
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
                    "categories.name": {
                        $regex: data.keyword,
                        $options: 'i'
                    }
                });

                stringMatch.push({
                    "categories.industries.name": {
                        $regex: data.keyword,
                        $options: 'i'
                    }
                });

            });

            Product.aggregate([{
                $lookup: {
                    from: "categories",
                    localField: "category",
                    foreignField: "_id",
                    as: "categories"
                }
            }, {
                $unwind: "$categories"
            }, {
                $lookup: {
                    from: "industries",
                    localField: "categories.industry",
                    foreignField: "_id",
                    as: "categories.industries"
                }
            }, {
                $unwind: "$categories.industries"
            }, {
                $match: {
                    $or: stringMatch
                }
            }, {
                $project: {
                    _id: 1,
                    product: "$name",
                    category: "$categories.name",
                    industry: "$categories.industries.name"
                }
            }, {
                $limit: 10
            }], function (err, data4) {
                if (err) {

                } else {
                    _.each(data4, function (n) {
                        n.name = n.product + ", " + n.category + ", " + n.industry;
                    });
                    var obj = {
                        results: data4
                    };
                    callback(null, obj)
                }
            })
        }
    }
};

module.exports = _.assign(module.exports, exports, model);