var schema = new Schema({
    name: {
        type: String,
        required: true,
        unique: true,
        uniqueCaseInsensitive: true,
        capitalizeAll: true,
    },
    status: {
        type: Boolean,
        default: true
    },
    // department: {
    //     type: [{
    //         type: Schema.Types.ObjectId,
    //         ref: "Department",
    //     }],
    //     index: true,
    //     restrictedDelete: true
    // },
    policytype: {
        type: [{
            type: Schema.Types.ObjectId,
            ref: "PolicyType",
        }],
        index: true,
        restrictedDelete: true
    },
    policydoc: {
        type: [{
            type: Schema.Types.ObjectId,
            ref: "PolicyDoc",
        }],
        index: true,
        restrictedDelete: true
    },
    causeloss: {
        type: [{
            type: Schema.Types.ObjectId,
            ref: "CauseLoss",
        }],
        index: true,
        restrictedDelete: true
    },
    employee: {
        type: [{
            type: Schema.Types.ObjectId,
            ref: "Employee",
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
module.exports = mongoose.model('Department', schema);

var exports = _.cloneDeep(require("sails-wohlig-service")(schema));
var model = {};
module.exports = _.assign(module.exports, exports, model);
