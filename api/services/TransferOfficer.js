var schema = new Schema({
    name: {
        type: String,
        required: true,
        unique: true,
        uniqueCaseInsensitive: true,
        capitalizeAll: true,
    },
    shortName: {
        type: String,
        required: true,
        unique: true,
        uniqueCaseInsensitive: true,
        capitalizeAll: true,
    },
    customerSegment:{
      type: Schema.Types.ObjectId,
      ref: "CustomerSegment",
      required: true,
      key: "customercompany"
    },
    customer: {
        type: [{
            type: Schema.Types.ObjectId,
            ref: "Customer",
        }],
        index: true,
        restrictedDelete: true
    },
});

schema.plugin(deepPopulate, {
  populate: {
      'CustomerSegment': {
          select: 'name _id'
      }
  }
});
schema.plugin(uniqueValidator);
schema.plugin(timestamps);
module.exports = mongoose.model('TransferOfficer', schema);

var exports = _.cloneDeep(require("sails-wohlig-service")(schema,"customerSegment","customerSegment"));
var model = {};
module.exports = _.assign(module.exports, exports, model);
