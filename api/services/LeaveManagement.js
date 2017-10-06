var schema = new Schema({
    name: {
        type: Schema.Types.ObjectId,
        ref: "Employee",
        required: true
    },
    fromDate:Date,
    toDate:Date,
    reason:String,
    status:{
        type:String,
        default:"Pending",
        Enum:["Approved","Pending","Rejected","Partially Approved"]
    },
    approvedFrom:Date,
    approvedTo:Date
});

schema.plugin(deepPopulate, {
      populate: {       
     'name': {
            select: 'name _id'
        }
}
});
schema.plugin(uniqueValidator);
schema.plugin(timestamps);
module.exports = mongoose.model('LeaveManagement', schema);

var exports = _.cloneDeep(require("sails-wohlig-service")(schema,'name','name'));
var model = {};
module.exports = _.assign(module.exports, exports, model);
