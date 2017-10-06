var schema = new Schema({
    name: {
        type: String,
        required: true,
        unique: true,
        uniqueCaseInsensitive: true,
        capitalizeAll: true,
    },
    bankType: String,
    accountName: String,
    accountNumber: String,
    neftCode: String,
    branchName: String,
    status: {
        type: Boolean,
        default: true
    },
    company: {
        type: [{
            type: Schema.Types.ObjectId,
            ref: "Company",
        }],
        index: true,
        restrictedDelete: true
    },
});

schema.plugin(deepPopulate, {});
schema.plugin(uniqueValidator);
schema.plugin(timestamps);
module.exports = mongoose.model('Bank', schema);

var exports = _.cloneDeep(require("sails-wohlig-service")(schema));

var model = {
    //HI this demo code
};

module.exports = _.assign(module.exports, exports, model);
