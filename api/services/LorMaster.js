var schema = new Schema({
    name: {
        type: String,
        required: true,
        unique: true,
    },
    lorCategory:{
        type: Schema.Types.ObjectId,
        ref: "LorCategory",
        required: true
    },
    status: {
        type: String,
        enum:["Original","Copy"],
        default: "Original"
    },
    typeOfDoc:{
        type:Boolean,
        default:true        //true = Original
    },
    submit:{
        type:String,
        default:"Pending"
    }
});

schema.plugin(deepPopulate, {
     populate: {
        'lorCategory': {
            select: 'name _id'
        }
    }
});
schema.plugin(uniqueValidator);
schema.plugin(timestamps);
module.exports = mongoose.model('LorMaster', schema);

var exports = _.cloneDeep(require("sails-wohlig-service")(schema,"lorCategory","lorCategory"));
var model = {};
module.exports = _.assign(module.exports, exports, model);
