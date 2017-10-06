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
    companyCode: {
        type: String,
        required: true,
        unique: true,
        uniqueCaseInsensitive: true,
        capitalizeAll: true,
    },
    logo: String,
    bank: {
        type: Schema.Types.ObjectId,
        ref: "Bank",
        key: "company"
    },
    serviceTax: String,
    pan: String,
    cin: String,
    hsn: String,
    tan: String,
    services: String,
    website: String,
    status: {
        type: Boolean,
        default: true
    },
    assignmentGeneration: {
        type: String,
        enum: ["Monthly", "Yearly"]
    },
    city: {
        type: Schema.Types.ObjectId,
        ref: "City",
        index: true,
        required: true
    },
    address: String,
    pincode: String,
    phone: String,
    fax: String,
    email: String,
    office: {
        type: [{
            type: Schema.Types.ObjectId,
            ref: "Office",
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
    branch: {
        type: [{
            type: Schema.Types.ObjectId,
            ref: "Branch",
        }],
        index: true,
        restrictedDelete: true
    },
    fieldOfficeActivity: {
        type: Number,
    },
    backOfficeActivity: {
        type: Number,
    },
    reimbursement: {
        type: Number,
    },
    reciept: {
        type: Number,
    },
    journalVoucher: {
        type: Number,
    },
    lat: {
        type: Number,
    },
    lng: {
        type: Number,
    },
    assignment: {
        type: [{
            type: Schema.Types.ObjectId,
            ref: "Assignment",
        }],
        index: true,
        restrictedDelete: true
    },
    GSTINByState: [{
        GST: {
            type: String
        },
        state: {
            type: Schema.Types.ObjectId,
            ref: "State",
            index: true
        }
    }]
});

schema.plugin(deepPopulate, {

    populate: {
        'GSTINByState.state': {
            select: 'name _id'
        },
        'city': {
            select: 'name _id district'
        },
        'city.district': {
            select: 'name _id state'
        },
        'city.district.state': {
            select: 'name _id zone'
        },
        'city.district.state.zone': {
            select: 'name _id country'
        },
        'city.district.state.zone.country': {
            select: 'name _id'
        },
        'bank': {
            select: 'name _id'
        }
    }

});

schema.plugin(uniqueValidator);
schema.plugin(timestamps);
module.exports = mongoose.model('Company', schema);

var exports = _.cloneDeep(require("sails-wohlig-service")(schema, "city.district.state.zone.country bank GSTINByState.state", "city.district.state.zone.country bank GSTINByState.state"));

var model = {

};

module.exports = _.assign(module.exports, exports, model);