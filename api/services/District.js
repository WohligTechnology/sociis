var schema = new Schema({
    name: {
        type: String,
        required: true,
        capitalizeAll: true,
    },
    state: {
        type: Schema.Types.ObjectId,
        ref: "State",
        index: true,
        required: true,
        key: "district"
    },
    city: {
        type: [{
            type: Schema.Types.ObjectId,
            ref: "City"
        }],
        index: true,
        restrictedDelete: true
    }
});


schema.plugin(uniqueValidator);
schema.plugin(timestamps);
schema.plugin(deepPopulate, {

    populate: {
        'state': {
            select: 'name _id zone'
        },
        'state.zone': {
            select: 'name _id country'
        },
        'state.zone.country': {
            select: 'name _id'
        }
    }

});
module.exports = mongoose.model('District', schema);

var exports = _.cloneDeep(require("sails-wohlig-service")(schema, "state.zone.country", "state.zone.country"));

var model = {};

module.exports = _.assign(module.exports, exports, model);