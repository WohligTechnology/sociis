var schema = new Schema({
    name: {
        type: Schema.Types.ObjectId,
        ref: "Employee",
        required: true
    },
    branch: {
        type: Schema.Types.ObjectId,
        ref: "Employee",
        required: true
    },
    // position: {
    //     type: Schema.Types.ObjectId,
    //     ref: "Employee",
    //     required: true
    // },
    assignment: {
        type: Schema.Types.ObjectId,
        ref: "Assignment",
        required: true
    },
    purpose: String,
    cost: Number,
    reason: String,
    status: String,
    approvedAmount: Number,
    image: [{
        type: String
    }],

    //Week
    starting: String,
    ending: String,

    //Period
    from: String,
    to: String,
    destination: String,

    //Local Conveyance
    expense: [{
        expenseDate: Date,
        expenseFrom: String,
        expenseTo: String,
        expensePurpose: String,
        expenseMode: String,
        expenseDistance: String,
        expenseRate: Number,
        expenseAmount: Number,
        expenseCreatedAt: {
            type: Date,
            default: Date.now
        },
        expenseUpdatedAt: {
            type: Date,
            default: Date.now
        }
    }],

    //Out Station Travel Expense
    travelExpense: [{
        //Journey

        //Depature
        depatureFrom: String,
        depatureDate: Date,
        depatureHr: String,

        //Arrival
        arrivalTo: String,
        arrivalDate: Date,
        arrivalHr: String,

        //End Journey
        travelExpenseMode: String,

        //Fare
        travelExpenseClass: String,
        travelExpenseTicketNo: String,
        travelExpenseKm: Number,
        travelExpenseRate: Number,
        travelExpenseAmount: Number,

        travelExpenseCreatedAt: {
            type: Date,
            default: Date.now
        },
        travelExpenseUpdatedAt: {
            type: Date,
            default: Date.now
        }
    }],

    //Out Lodging & Boarding
    lodgingBoarding: [{
        lodgingBoardingDate: Date,
        lodgingBoardingCity: {
            type: Schema.Types.ObjectId,
            ref: "City"
        },
        lodgingBoardingNightHalt: String,
        lodgingBoardingClass: String,

        //DHA
        lodgingBoardingRate: Number,
        lodgingBoardingAmount: Number,

        lodgingBoardingHotelCharges: Number,
        lodgingBoardingTotal: Number,
        lodgingBoardingCreatedAt: {
            type: Date,
            default: Date.now
        },
        lodgingBoardingUpdatedAt: {
            type: Date,
            default: Date.now
        }
    }],

    //Out of pocket expense
    pocketExpense: [{
        pocketExpenseDate: Date,
        pocketExpensePlace: String,
        pocketExpenseDescription: String,
        pocketExpenseTotal: Number,
        pocketExpenseCreatedAt: {
            type: Date,
            default: Date.now
        },
        pocketExpenseUpdatedAt: {
            type: Date,
            default: Date.now
        }
    }],


});

schema.plugin(deepPopulate, {
    populate: {
        'name': {
            select: 'name _id'
        },
        'assignment': {
            select: 'name _id'
        }
    }
});
schema.plugin(uniqueValidator);
schema.plugin(timestamps);
module.exports = mongoose.model('Reimbursement', schema);

var exports = _.cloneDeep(require("sails-wohlig-service")(schema, "name assignment", "name assignment"));
var model = {};
module.exports = _.assign(module.exports, exports, model);