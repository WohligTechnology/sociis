var schema = new Schema({
    name: {
        type: String
    },
    employee: {
        type: Schema.Types.ObjectId,
        ref: "Employee",
        index: true
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: "User",
        index: true
    },
    request: {
        body: {

        },
        query: {

        },
        params: {

        }
    },
    url: {
        type: String,
        required: true
    },
    model: {
        type: String,
        required: true
    },
    controller: {
        type: String
    }
});

schema.plugin(deepPopulate, {});
schema.plugin(uniqueValidator);
schema.plugin(timestamps);
module.exports = mongoose.model('Logs', schema);

var exports = _.cloneDeep(require("sails-wohlig-service")(schema));
var model = {};
module.exports = _.assign(module.exports, exports, model);