var schema = new Schema({
    name: {
        type: String,
        required: true,
        unique: true,
        uniqueCaseInsensitive: true,
        capitalizeAll: true,
    },
    countryCode: {
        type: String,
        default: "",
    },
    ISDCodes: {
        type: String,
        default: 0,
    },
    zone: {
        type: [{
            type: Schema.Types.ObjectId,
            ref: "Zone",
        }],
        index: true,
        restrictedDelete: true
    }
});
schema.plugin(deepPopulate, {
    populate:{
        'zone':{
            select:"_id name"
        }
    }
});
schema.plugin(uniqueValidator);
schema.plugin(timestamps);
module.exports = mongoose.model('Country', schema);

var exports = _.cloneDeep(require("sails-wohlig-service")(schema,"zone","zone"));

var model = {};

module.exports = _.assign(module.exports, exports, model);
