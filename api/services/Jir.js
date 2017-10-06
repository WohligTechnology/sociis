var schema = new Schema({
    name: String,
    department:{
        type: Schema.Types.ObjectId,
        ref: "Department",
        required: true
    },
    document:String,
    type:String    
});

schema.plugin(deepPopulate, {
    populate:{
        'department':{
            select:'name _id'
        }
    }
});
schema.plugin(uniqueValidator);
schema.plugin(timestamps);
module.exports = mongoose.model('Jir', schema);

var exports = _.cloneDeep(require("sails-wohlig-service")(schema,'department','department'));
var model = {

    getType: function(data, callback) {
    Jir.find({
      type: data.type
    }).populate('department','name _id').exec(function(err, found) {
      if (err) {
        callback(err, null);
      } else {
          callback(null, found);
        } 
    })
  }
};
module.exports = _.assign(module.exports, exports, model);
