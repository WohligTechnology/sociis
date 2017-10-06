var schema = new Schema({
    name: {
        type: String,
        required: true,
        capitalizeAll: true
    },
    country: {
        type: Schema.Types.ObjectId,
        ref: "Country",
        required: true,
        index: true,
        key: "zone"
    },
    state: {
        type: [{
            type: Schema.Types.ObjectId,
            ref: "State",

        }],
        index: true,
        restrictedDelete: true
    },
    uniqueAddress: {
        type: String,
        unique: true
    }
});

schema.plugin(deepPopulate, {
    populate: {
        'country': {
            select: 'name _id country'
        }
    }
});

schema.plugin(uniqueValidator);
schema.plugin(timestamps);
module.exports = mongoose.model('Zone', schema);

var exports = _.cloneDeep(require("sails-wohlig-service")(schema, "country", "country"));

var model = {
    saveData: function (data, callback) {
        var Const = this(data);
        var foreignKeys = Config.getForeignKeys(schema);
        Country.findOne({
            "_id": data.country
        }).exec(function (err, data2) {
            if (err) {
                callback(err, null)
            } else {
                Const.uniqueAddress = data2.name + " " + data.name;
                if (data._id) {
                    Zone.findOne({
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
                                Zone.find({
                                    uniqueAddress: Const.uniqueAddress
                                }).exec(function (err, data3) {
                                    if (err) {
                                        callback(err, null);
                                    } else {
                                        if (data3.length == 0) {
                                            data2.update(data, {
                                                w: 1
                                            }, callback);
                                        } else {
                                            callback("Already Exist", null);
                                        }
                                    }
                                });


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
        });



    },

};

module.exports = _.assign(module.exports, exports, model);