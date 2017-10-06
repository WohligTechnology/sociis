var schema = new Schema({
    name: {
        type: String
    },
    salutation: {
        type: String
    },
    firstName: {
        type: String
    },
    lastName: {
        type: String
    },
    birthDate: {
        type: Date
    },
    designation: {
        type: String
    },
    email: {
        type: String
    },
    password: {
        type: String
    },
    officeNumber: {
        type: String
    },
    mobileNumber: {
        type: String
    },
    customer: {
        type: Schema.Types.ObjectId,
        ref: "Customer",
        index: true,
        required: true,
        key: "officers"
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

schema.plugin(deepPopulate, {
    // 'insuredCompany':{
    //   select: 'name _id'
    // },
    // 'insuredOffice':{
    //   select: 'name _id'
    // }
});
schema.plugin(uniqueValidator);
schema.plugin(timestamps);
module.exports = mongoose.model('Officer', schema);

var exports = _.cloneDeep(require("sails-wohlig-service")(schema));
var model = {};
module.exports = _.assign(module.exports, exports, model);
