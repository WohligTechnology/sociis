var schema = new Schema({
    name: {
        type: String,
    },
    shop: {
        type: Schema.Types.ObjectId,
        ref: 'Shop',
        index: true
    },
    employee: {
        type: Schema.Types.ObjectId,
        ref: 'Employee',
        index: true
    },
    customer: {
        type: Schema.Types.ObjectId,
        ref: 'Customer',
        index: true
    },
    amount: {
        type: Number,
    },
    comment: {
        type: String,
    },
    invoice: [{
        type: Schema.Types.ObjectId,
        ref: "Invoice",
        index: true
    }],

});

schema.plugin(deepPopulate, {});
schema.plugin(uniqueValidator);
schema.plugin(timestamps);
module.exports = mongoose.model('Payment', schema);

var exports = _.cloneDeep(require("sails-wohlig-service")(schema));
var model = {
    generatePaymentNumber: function (data, callback) {
        console.log("*****************************inside generate APyment Number api*********", data);

        // var sInput = '';
        var name = 1;
        Payment.find({}, {
            name: 1
        }).sort({
            name: -1
        }).limit(1).exec(function (err, data) {
            if (err) {
                callback(err, null);
            } else {
                if (data.length == 0) {
                    callback(null, name);
                } else {
                    name = name + parseInt(data[0].name);
                    callback(null, name);
                }
            }
        });
    },


};
module.exports = _.assign(module.exports, exports, model);