var schema = new Schema({
    name: {
        type: String,
        required: true,
        unique: true,
        uniqueCaseInsensitive: true,
        capitalizeAll: true,
    },
    zone: {
        type: Schema.Types.ObjectId,
        ref: "Zone",
        index: true,
        required: true,
        key: "state"
    },
    district: {
        type: [{
            type: Schema.Types.ObjectId,
            ref: "District"
        }],
        index: true,
        restrictedDelete: true
    },
    stateCode: {
        type: String
    }
});

schema.plugin(uniqueValidator);
schema.plugin(timestamps);
schema.plugin(deepPopulate, {

    populate: {
        'zone': {
            select: 'name _id country'
        },
        'zone.country': {
            select: 'name _id'
        }
    }

});
module.exports = mongoose.model('State', schema);

var exports = _.cloneDeep(require("sails-wohlig-service")(schema, "zone.country", "zone.country"));

var model = {};

module.exports = _.assign(module.exports, exports, model);