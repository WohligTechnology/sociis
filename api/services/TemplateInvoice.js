var mongoose = require('mongoose');
var deepPopulate = require('mongoose-deep-populate')(mongoose);
var uniqueValidator = require('mongoose-unique-validator');
var timestamps = require('mongoose-timestamp');
var validators = require('mongoose-validators');
var monguurl = require('monguurl');
var objectid = require("mongodb").ObjectID;
require('mongoose-middleware').initialize(mongoose);

var Schema = mongoose.Schema;

var schema = new Schema({
    name: {
        type: String,
        required: true,
        unique: true,
        uniqueCaseInsensitive: true
    },
    formName: String,
    status: {
        type: Boolean,
        default: true
    },
    invoiceExpenditure: [{
        invoiceExpenditure: {
            type: Schema.Types.ObjectId,
            ref: "InvoiceExpensiture"
        },
        order: Number
    }]
});

schema.plugin(deepPopulate, {});
schema.plugin(uniqueValidator);
schema.plugin(timestamps);
module.exports = mongoose.model('TemplateInvoice', schema);

var exports = _.cloneDeep(require("sails-wohlig-service")(schema));
var model = {
    getTemplate: function (data, callback) {
        green(data._id);
        TemplateInvoice.aggregate([{
                $match: {
                    '_id': objectid(data._id)
                }
            },{
                $unwind: "$invoiceExpenditure"
            },
            {
                $lookup: {
                    from: "invoiceexpenditures",
                    localField: "invoiceExpenditure.invoiceExpenditure",
                    foreignField: "_id",
                    as: "InvoiceExpenditure"
                }
            }, {
                $unwind: "$InvoiceExpenditure"
            },
            
            {
                $sort: {
                    'invoiceExpenditure.order': 1
                }
            }, {
                $project: {
                    name: 1,
                    InvoiceExpenditure: '$InvoiceExpenditure'
                }
            }
        ], function (err, data1) {
            if (err) {
                callback(err, null);
            } else if (data1 && data1.length > 0) {
                var arr = [];
                _.each(data1, function (n) {
                    var a = {};
                    a.description=n.InvoiceExpenditure.description;
                    a.name = n.InvoiceExpenditure.name;
                    a.unit = n.InvoiceExpenditure.unit;
                    a.rate = n.InvoiceExpenditure.rate;
                    a.type = n.InvoiceExpenditure.type;
                    arr.push(a);
                })
                callback(null, arr);
            } else {
                callback(null, []);
            }
        });
    },
};
module.exports = _.assign(module.exports, exports, model);