var schema = new Schema({
    name: {
        type: String,
        required: true,
        unique: true,
        uniqueCaseInsensitive: true,
        capitalizeAll: true,
    },
    customercompany: {
      type: [{
          type: Schema.Types.ObjectId,
          ref: "CustomerCompany",
      }],
      index: true,
      restrictedDelete: true
    },
    customer: {
        type: [{
            type: Schema.Types.ObjectId,
            ref: "Customer",
        }],
        index: true,
        restrictedDelete: true
    },
    assignment: {
        type: [{
            type: Schema.Types.ObjectId,
            ref: "Assignment",
        }],
        index: true,
        restrictedDelete: true
    },
});

schema.plugin(deepPopulate, {});
schema.plugin(uniqueValidator);
schema.plugin(timestamps);
module.exports = mongoose.model('CustomerSegment', schema);

var exports = _.cloneDeep(require("sails-wohlig-service")(schema));
var model = {};
module.exports = _.assign(module.exports, exports, model);
