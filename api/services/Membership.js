var schema = new Schema({
  name:{
    type: String
  },
  employee: {
      type: [{
          type: Schema.Types.ObjectId,
          ref: "Employee",
      }],
      index: true,
      restrictedDelete: true
  },
});

schema.plugin(deepPopulate, {});
schema.plugin(uniqueValidator);
schema.plugin(timestamps);
module.exports = mongoose.model('Membership', schema);

var exports = _.cloneDeep(require("sails-wohlig-service")(schema));
var model = {};
module.exports = _.assign(module.exports, exports, model);
