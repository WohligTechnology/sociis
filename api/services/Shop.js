var schema = new Schema({
    name: {
        type: String,
        required: true
    },
    status: {
        type: Boolean,
        default: true
    },
    items: [{
        item: {
            type: Schema.Types.ObjectId,
            ref: "InvoiceExpenditure",
            index: true
        },
        quantity: {
            type: Number,
            default: 0
        }
    }]
});

schema.plugin(deepPopulate, {
    populate: {
        'items.item': {
            select: ''
        }
    }
});
schema.plugin(uniqueValidator);
schema.plugin(timestamps,timestampsAppendObject);
module.exports = mongoose.model('Shop', schema);

var exports = _.cloneDeep(require("sails-wohlig-service")(schema, "items.item", "items.item"));
var model = {};
module.exports = _.assign(module.exports, exports, model);