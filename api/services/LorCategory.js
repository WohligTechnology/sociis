var schema = new Schema({
    name: {
        type: String,
        required: true,
        unique: true
    }
});

schema.plugin(deepPopulate, {});
schema.plugin(uniqueValidator);
schema.plugin(timestamps);
module.exports = mongoose.model('LorCategory', schema);

var exports = _.cloneDeep(require("sails-wohlig-service")(schema));
var model = {
    getAccordianData: function (data, callback) {
        LorCategory.find().lean().exec(function (err, data) {
            if (err) {
                callback(err, null);
            } else {
                //console.log("Data",data);
                async.each(data, function (category, callback) {
                    LorMaster.find({
                        lorCategory: category._id
                    }).lean().exec(function (err, data2) {
                        if (err) {
                            callback(err, data2);
                        } else {
                            category.items = data2;
                            //console.log("Data 2 ",data2);
                            callback(null, data2);
                        }
                    });
                }, function (err) {
                    callback(err, data);
                });
            }
        });
    }
};
module.exports = _.assign(module.exports, exports, model);