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
        index: true,
        key: "payment"
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
        },
        'invoice': {
            select: 'name _id'
        }
    }
});
schema.plugin(uniqueValidator);
schema.plugin(timestamps);
module.exports = mongoose.model('Payment', schema);

var exports = _.cloneDeep(require("sails-wohlig-service")(schema, "employee customer shop invoice", "employee customer shop invoice"));
var model = {
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
                desc: 'createdAt'
            },
            start: (page - 1) * maxRow,
            count: maxRow
        };
        var Search = Payment.find(data.filter)
            .order(options)
            .keyword(options)
            .deepPopulate("employee customer shop invoice")
            .page(options, function (err, found) {
                if (err) {
                    callback(err, found);
                } else {
                    if (_.isEmpty(found)) {
                        callback("No data found!!", found);
                    } else {
                        callback(null, found);
                    }
                }
            });
    },
    generatePaymentNumber: function (data, callback) {
        var name = 1;
        Payment.find({}, {
            name: 1
        }).sort({
            createdAt: -1
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