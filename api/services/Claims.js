var schema = new Schema({
    name: {
        type: String,
        required: true,
        unique: true,
        uniqueCaseInsensitive: true,
        capitalizeAll: true,
    },
    isInsured: {
        type: Boolean,
        default: true
    },
    claimNumber: {
        type: String
    },

});

schema.plugin(deepPopulate, {});
schema.plugin(uniqueValidator);
schema.plugin(timestamps);
module.exports = mongoose.model('Claims', schema);

var exports = _.cloneDeep(require("sails-wohlig-service")(schema));

var model = {};

module.exports = _.assign(module.exports, exports, model);