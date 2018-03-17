var schema = new Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    roles: {
        type: []
    }
});

schema.plugin(deepPopulate, {});
schema.plugin(uniqueValidator);
schema.plugin(timestamps,timestampsAppendObject);
module.exports = mongoose.model('Role', schema);

var exports = _.cloneDeep(require("sails-wohlig-service")(schema));
var model = {};
module.exports = _.assign(module.exports, exports, model);