var schema = new Schema({
    name: {
        type: String,
        required: true,
        unique: true,
        uniqueCaseInsensitive: true,
        capitalizeAll: true,
    },
    department: [{
        type: Schema.Types.ObjectId,
        ref: "Department",
        required: true,
        key: "causeloss"
    }],
    natureOfLoss:[{
      type: Schema.Types.ObjectId,
      ref: "NatureLoss",
      required: true,
      key: "causeloss"
    }],
    assignment: {
        type: [{
            type: Schema.Types.ObjectId,
            ref: "Assignment"
        }],
        index: true,
        restrictedDelete: true
    },
    status: {
      type: Boolean,
      default: true
    },
});

schema.plugin(deepPopulate, {
  populate:{
    "department":{
      select: 'name _id'
    },
    "natureOfLoss":[{
      select: 'name _id'
    }]
  }
});
schema.plugin(uniqueValidator);
schema.plugin(timestamps);
module.exports = mongoose.model('CauseLoss', schema);

var exports = _.cloneDeep(require("sails-wohlig-service")(schema,"department natureOfLoss","department natureOfLoss"));
var model = {
  getNatureLoss: function(data, callback) {
    var Model = this;
    var Search = Model.findOne({
        "_id":data.filter._id}).lean().populate('natureOfLoss').exec(function(err, data2) {
        if (err) {
            callback(err, data2);
        } else if (_.isEmpty(data2)) {
            callback(err, data2);
        } else {
          var data3 = {};
            data3.results = data2.natureOfLoss;
            callback(err, data3);
        }
    });
},
};
module.exports = _.assign(module.exports, exports, model);
