var autoIncrement = require('mongoose-auto-increment');
var objectid = require("mongodb").ObjectID;
var schema = new Schema({
  sixthDigit: {
    type: String
  },
  dateMOY: {
    type: String
  },
  brachCode: {
    type: String
  },
  billingPeriod: {
    type: String
  },
  fourthDigit: {
    type: String
  },
  surveyDate: {
    type: Date
  },
  assignedTo: {
    type: Schema.Types.ObjectId,
    ref: "Employee",
    index: true
  },
  createBy: {
    type: Schema.Types.ObjectId,
    ref: "Employee",
    index: true
  },
  survey: [{
    employee: {
      type: Schema.Types.ObjectId,
      ref: "Employee",
      index: true
    },
    sentFrom: {
      type: Schema.Types.ObjectId,
      ref: "Employee",
      index: true
    },
    status: {
      type: String,
      enum: ["Approval Pending", "Pending", "Completed", "Declined"]
    },
    timestamp: {
      type: Date,
      default: Date.now()
    },
    approvalTime: {
      type: Date
    },
    completionTime: {
      type: Date
    },
    declineTime: {
      type: Date
    },
    surveyEndTime: {
      type: Date
    },
    surveyStartTime: {
      type: Date
    },
    surveyUpdateTime: {
      type: Date
    },
    surveyDate: {
      type: Date
    },
    surveyTime: {
      type: Date
    },
    address: {
      type: String
    }
  }],
  assignmentapprovalStatus: {
    type: String,
    enum: ["Pending ForceClosed", "ForceClosed", "Cancelled ForceClosed", "Pending ReOpened", "ReOpened", "Cancelled ReOpened", "Pending OnHold", "OnHold", "Cancelled OnHold", "Request AccessButton", "Response AccessButton"],
    index: true
  },
  forceClosedComment: String,
  forceClosedReqTime: {
    type: Date
  },
  waiverReqTime: {
    type: Date
  },
  waiverResTime: {
    type: Date
  },
  forceClosedRespTime: {
    type: Date
  },
  reopenComment: String,
  reopenReqTime: {
    type: Date
  },
  reopenRespTime: {
    type: Date
  },
  onholdComment: String,
  onholdReqTime: {
    type: Date
  },
  onholdRespTime: {
    type: Date
  },
  prevtimelineStatus: {
    type: String
  },
  timelineStatus: {
    type: String,
    enum: ["Pending", "Unassigned", "Survey Pending", "ILA Pending", "LOR Pending", "Dox Pending", "Part Dox Pending", "Assessment Pending", "Consent Pending", "JIR Pending", "FSR Pending", "BBND", "TBB", "DBND", "Collected", "Dispatched", "Force Closed", "ReOpened", "ForceClosed", "OnHold", "Delivered"],
    default: "Unassigned",
    index: true
  },
  brokerClaimId: {
    type: String
  },
  insurerClaimId: {
    type: String
  },
  insuredClaimId: {
    type: String
  },
  name: {
    type: String,
    unique: true
  },
  name1: {
    type: String
  },
  company: {
    type: Schema.Types.ObjectId,
    ref: "Company",
    index: true,
    // required: true,
    key: "assignment"
  },
  assignmentNumber: {
    type: Number,
    default: 0
  },
  typeOfClaim: {
    type: Boolean
  },
  showAddressForDesktop: {
    type: Boolean
  },
  department: {
    type: Schema.Types.ObjectId,
    ref: "Department",
    index: true,
    required: true,
    key: "assignment"
  },
  salvage: {
    type: Schema.Types.ObjectId,
    ref: "Salvage",
    index: true
  },
  policyDepartment: {
    type: Schema.Types.ObjectId,
    ref: "Department",
    index: true,
    key: "assignment"
  },
  office: {
    type: Schema.Types.ObjectId,
    ref: "Office",
    index: true,
    required: true,
    key: "assignment"
  },
  branch: {
    type: Schema.Types.ObjectId,
    ref: "Branch",
    index: true,
    required: true,
    key: "assignment"
  },
  appointment: {
    type: String
  },
  dateOfAppointment: {
    type: Date
  },
  dateOfIntimation: {
    type: Date
  },
  dateOfLoss: {
    type: Date
  },
  intimatedLoss: {
    type: Number
  },
  owner: {
    type: Schema.Types.ObjectId,
    ref: "Employee",
    index: true,
    // required: true,
    key: "assignment"
  },
  customer: {
    type: Schema.Types.ObjectId,
    ref: "Customer",
    index: true,
    key: "assignment"
  },
  segment: {
    type: Schema.Types.ObjectId,
    ref: "CustomerSegment",
    index: true,
    // required: true,
    key: "assignment"
  },
  insuredOffice: {
    type: Schema.Types.ObjectId,
    ref: "Customer",
    index: true,
    key: "assignment"
  },
  insurerOffice: {
    type: Schema.Types.ObjectId,
    ref: "Customer",
    index: true,
    key: "assignment"
  },
  brokerOffice: {
    type: Schema.Types.ObjectId,
    ref: "Customer",
    index: true,
    key: "assignment"
  },
  insured: {
    type: Schema.Types.ObjectId,
    ref: "CustomerCompany",
    index: true,
    key: "assignment"
  },
  customerCompany: {
    type: Schema.Types.ObjectId,
    ref: "CustomerCompany",
    index: true,
    key: "assignment"
  },
  provisionalInsured: {
    type: String
  },
  causeOfLoss: {
    type: Schema.Types.ObjectId,
    ref: "CauseLoss",
    index: true,
    key: "assignment"
  },
  natureOfLoss: [{
    type: Schema.Types.ObjectId,
    ref: "NatureLoss",
    index: true,
    key: "assignment"
  }],
  broker: {
    type: Schema.Types.ObjectId,
    ref: "CustomerCompany",
    index: true,
    // required: true,
    key: "assignment"
  },
  insurer: {
    type: Schema.Types.ObjectId,
    ref: "CustomerCompany",
    index: true,
    // required: true,
    key: "assignment"
  },
  policyType: {
    type: Schema.Types.ObjectId,
    ref: "PolicyType",
    key: "assignment"
  },
  policyDoc: {
    type: Schema.Types.ObjectId,
  },
  city: {
    type: Schema.Types.ObjectId,
    ref: "City",
    index: true
  },
  address: String,
  pincode: String,
  lat: {
    type: Number,
  },
  lng: {
    type: Number,
  },
  siteNumber: {
    type: String,
    capitalizeAll: true
  },
  siteMobile: {
    type: String
  },
  siteEmail: {
    type: String
  },
  shareWith: [{
    name: {
      type: String
    },
    office: {
      type: Schema.Types.ObjectId,
      ref: "Office",
      index: true,
      key: "assignment"
    },
    persons: [{
      type: Schema.Types.ObjectId,
      ref: "Employee",
      index: true,
      key: "assignment"
    }]
  }],
  isInsured: {
    type: Boolean
  },
  postLoss: {
    type: Boolean
  },
  products: [{
    product: {
      type: Schema.Types.ObjectId,
      ref: "Product",
      index: true,
      key: "assignment"
    },
    item: {
      type: String
    }
  }],
  invoices: [{
    invoiceNumber: {
      type: String
    },
    invoiceNumberDate: {
      type: Date
    }
  }],
  LRs: [{
    lrNumber: {
      type: String
    },
    lrNumberDate: {
      type: Date
    }
  }],
  vehicleNumber: [{
    vehicleNumber: {
      type: String
    }
  }],
  others: [{
    locationID: {
      type: String
    },
    productID: {
      type: String
    }
  }],
  locationArr: [{
    locationString: {
      type: String
    },
    date: {
      type: Date
    }
  }],
  product: [{
    product: {
      type: String
    },
    date: {
      type: Date
    }
  }],
  status: {
    type: Boolean,
    default: false
  },
  ilaStatus: {
    type: Boolean,
    default: true
  },
  lorStatus: {
    type: Boolean,
    default: true
  },
  sentBy: {
    type: Schema.Types.ObjectId,
    ref: "Employee",
    index: true
  },
  timeline: {
    type: [{
      type: Schema.Types.ObjectId,
      ref: "Timeline",
    }],
    index: true
  },
  assessment: [{
    file: {
      type: String
    },
    fileName: {
      type: String
    },
    employee: {
      type: Schema.Types.ObjectId,
      ref: "Employee",
      index: true,
      key: "assignment"
    },
    createdAt: {
      type: Date,
      default: Date.now()
    }
  }],
  consent: [{
    file: {
      type: String
    },
    fileName: {
      type: String
    },
    employee: {
      type: Schema.Types.ObjectId,
      ref: "Employee",
      index: true,
      key: "assignment"
    },
    createdAt: {
      type: Date,
      default: Date.now()
    }
  }],
  jir: [{
    file: {
      type: String
    },
    fileName: {
      type: String
    },
    employee: {
      type: Schema.Types.ObjectId,
      ref: "Employee",
      index: true,
      key: "assignment"
    }
  }],
  photos: [{
    file: {
      type: String
    },
    fileName: {
      type: String
    },
    employee: {
      type: Schema.Types.ObjectId,
      ref: "Employee",
      index: true,
      key: "assignment"
    }
  }],
  docs: [{
    file: {
      type: String
    },
    fileName: {
      type: String
    },
    employee: {
      type: Schema.Types.ObjectId,
      ref: "Employee",
      index: true,
      key: "assignment"
    }
  }],
  fsrs: [{
    file: {
      type: String
    },
    fileName: {
      type: String
    },
    employee: {
      type: Schema.Types.ObjectId,
      ref: "Employee",
      index: true,
      key: "assignment"
    }
  }],
  invoice: [{
    type: Schema.Types.ObjectId,
    ref: "Invoice",
    index: true,
    key: "assignment"
  }],
  templateIla: [{
    templateName: {
      type: String
    },
    name: {
      type: String
    },
    reserveAmount: {
      type: Number
    },
    status: {
      type: Boolean,
      default: true
    },
    sentTo: {
      type: Schema.Types.ObjectId,
      ref: "Employee",
      index: true
    },
    sentBy: {
      type: Schema.Types.ObjectId,
      ref: "Employee",
      index: true
    },
    forms: {
      type: []
    },
    templateIla: {
      type: Schema.Types.ObjectId,
      ref: "TemplateIla",
      key: "assignment"
    },
    reqtimestamp: {
      type: Date
    },
    restimestamp: {
      type: Date
    },
    timestamp: {
      type: Date,
      default: Date.now()
    },
    authTimestamp: {
      type: Date
    },
    draftTimeStamp: {
      type: Date
    },
    rejectTimestamp: {
      type: Date
    },
    file: {
      type: String
    },
    approvalStatus: {
      type: String,
      enum: ["Pending", "Approved", "Reject", "Revised", "Draft", "Regenerate"],
      default: "Pending",
      index: true
    }
  }],
  templateIsr: [{
    templateName: {
      type: String
    },
    name: {
      type: String
    },
    status: {
      type: Boolean,
      default: true
    },
    forms: {
      type: []
    },
    templateIsr: {
      type: Schema.Types.ObjectId,
      ref: "TemplateIsr",
      key: "assignment",
      index: true
    },
    timestamp: {
      type: Date,
      default: Date.now()
    },
    authTimestamp: {
      type: Date
    },
    draftTimeStamp: {
      type: Date
    },
    rejectTimestamp: {
      type: Date
    },
    file: {
      type: String
    },
    approvalStatus: {
      type: String,
      enum: ["Pending", "Approved", "Reject", "Revised", "Draft"],
      default: "Pending",
      index: true
    }
  }],
  templateJir: [{
    templateName: {
      type: String
    },
    name: {
      type: String
    },
    status: {
      type: Boolean,
      default: true
    },
    forms: {
      type: []
    },
    templateJir: {
      type: Schema.Types.ObjectId,
      ref: "TemplateJir",
      key: "assignment"
    },
    timestamp: {
      type: Date,
      default: Date.now()
    },
    authTimestamp: {
      type: Date
    },
    approvalStatus: {
      type: String,
      enum: ["Pending", "Approved", "Reject", "Revised", "Draft"],
      default: "Pending",
      index: true
    }
  }],
  templateLor: [{
    typeOfPdf: {
      type: String
    },
    received: {
      type: Number
    },
    pending: {
      type: Number
    },
    sentTo: {
      type: Schema.Types.ObjectId,
      ref: "Employee",
      index: true
    },
    sentBy: {
      type: Schema.Types.ObjectId,
      ref: "Employee",
      index: true
    },
    openingPara: {
      type: String
    },
    middlePara: {
      type: String
    },
    closingPara: {
      type: String
    },
    templateName: {
      type: String
    },
    name: {
      type: String
    },
    status: {
      type: Boolean,
      default: true
    },
    forms: {
      type: []
    },
    templateLor: {
      type: Schema.Types.ObjectId,
      ref: "TemplateLor",
      key: "assignment"
    },
    reqtimestamp: {
      type: Date
    },
    restimestamp: {
      type: Date
    },
    timestamp: {
      type: Date,
      default: Date.now()
    },
    authTimestamp: {
      type: Date
    },
    draftTimeStamp: {
      type: Date
    },
    rejectTimestamp: {
      type: Date
    },
    file: {
      type: String
    },
    approvalStatus: {
      type: String,
      enum: ["Pending", "Approved", "Rejected", "Revised", "Draft", "All Docs Received", "Regenerate"],
      default: "Pending",
      index: true
    },
    lorCount: {
      type: String,
      enum: ["NA", "LOR", "Reminder 1", "Reminder 2", "Notice"],
      default: "NA"
    },
  }],
  outwardDate: {
    type: Date
  },
  logistictype: {
    type: String
  },
  sendTo: {
    type: String
  },
  courier: {
    type: String
  },
  docketDate: {
    type: Date
  },
  docketNumber: {
    type: String
  },
  by: {
    type: String
  },
  recievedDate: {
    type: Date
  },
  recievedTime: {
    type: Date
  },
  remark: {
    type: String
  },
  documentDetails: {
    type: String
  },
  email: {
    type: {}
  },
  threadId: {
    type: String
  },
  ilaAccess: {
    type: Boolean
  },
  lorAccess: {
    type: Boolean
  },
  surveyAccess: {
    type: Boolean
  },
  assessmentAccess: {
    type: Boolean
  },
  consentAccess: {
    type: Boolean
  },
  fsrAccess: {
    type: Boolean
  },
  ilaAccessReq: {
    type: Boolean
  },
  lorAccessReq: {
    type: Boolean
  },
  surveyAccessReq: {
    type: Boolean
  },
  assessmentAccessReq: {
    type: Boolean
  },
  consentAccessReq: {
    type: Boolean
  },
  fsrAccessReq: {
    type: Boolean
  },
  forceClosedCancelledTime: {
    type: Date
  },
  reopenCancelledTime: {
    type: Date
  },
  onholdCancelledTime: {
    type: Date
  },
  getAllTaskStatus: {
    surveyAssigned: {
      type: String,
      enum: ["Not Done", "Done", "Waived"],
      // index: true
    },
    survey: {
      type: String,
      enum: ["Not Done", "Done", "Waived"],
      // index: true
    },
    ila: {
      type: String,
      enum: ["Not Done", "Done", "Waived"],
      // index: true
    },
    lor: {
      type: String,
      enum: ["Not Done", "Done", "Waived"],
      // index: true
    },
    docs: {
      type: String,
      enum: ["Not Done", "Done", "Waived"],
      // index: true
    },
    assessment: {
      type: String,
      enum: ["Not Done", "Done", "Waived"],
      // index: true
    },
    consent: {
      type: String,
      enum: ["Not Done", "Done", "Waived"],
      // index: true
    },
    fsr: {
      type: String,
      enum: ["Not Done", "Done", "Waived"],
      // index: true
    },
    invoice: {
      type: String,
      enum: ["Not Done", "Done", "Waived"],
      // index: true
    },
    dispatched: {
      type: String,
      enum: ["Not Done", "Done", "Waived"],
      // index: true
    },
    delivered: {
      type: String,
      enum: ["Not Done", "Done", "Waived"],
      // index: true
    },
    collected: {
      type: String,
      enum: ["Not Done", "Done", "Waived"],
      // index: true
    },
    forceClosed: {
      type: String,
      enum: ["Not Done", "Done", "Pending"],
      // index: true
    },
    OnHold: {
      type: String,
      enum: ["Not Done", "Done", "Pending"],
      // index: true
    },
    ReOpened: {
      type: String,
      enum: ["Not Done", "Done", "Pending"],
      // index: true
    },
    forceClosedTime: {
      type: Date
    },
    OnHoldTime: {
      type: Date
    },
    ReOpenedTime: {
      type: Date
    },
    surveyAssignedTime: {
      type: Date
    },
    surveyTime: {
      type: Date
    },
    ilaTime: {
      type: Date
    },
    lorTime: {
      type: Date
    },
    docsTime: {
      type: Date
    },
    assessmentTime: {
      type: Date
    },
    consentTime: {
      type: Date
    },
    fsrTime: {
      type: Date
    },
    invoiceTime: {
      type: Date
    },
    dispatchedTime: {
      type: Date
    },
    deliveredTime: {
      type: Date
    },
    collectedTime: {
      type: Date
    }
  }
});

schema.plugin(deepPopulate, {

  populate: {
    'templateLor.sentTo': {
      select: '_id name'
    },
    'templateLor.sentBy': {
      select: '_id name'
    },
    'templateIla.sentTo': {
      select: '_id name'
    },
    'templateIla.sentBy': {
      select: '_id name'
    },
    salvage: {
      select: ''
    },
    'customer': {
      select: 'name _id'
    },
    'insurerOffice': {
      select: 'name _id address'
    },
    department: {
      select: 'name _id'
    },
    'branch': {
      select: ''
    },
    'office': {
      select: ''
    },
    'office.city': {
      select: 'name _id district'
    },
    'office.city.district': {
      select: 'name _id state'
    },
    'office.city.district.state': {
      select: 'name _id'
    },
    'invoice': {
      select: 'name invoiceNumber _id grandTotal createdBy approvalStatus file approvalTime grossAssessedLoss grossDepreciation grossSalvage grossUnderInsurance excessFranchise netPayable'
    },
    'invoice.createdBy': {
      select: 'name _id'
    },
    'assignedTo': {
      select: 'name _id'
    },
    'city': {
      select: 'name _id district'
    },
    'owner': {
      select: 'name _id func houseColor photo email mobile officeMobile  officeEmail employee'
    },
    'owner.func': {
      select: 'name'
    },
    'owner.employee': {
      select: 'name officeEmail'
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
      select: 'name countryCode _id'
    },
    'insurer': {
      select: ''
    },
    'company': {
      select: ''
    },
    'company.city': {
      select: 'name district'
    },
    'company.city.district': {
      select: 'name state _id'
    },
    'company.city.district.state': {
      select: 'name _id'
    },
    'company.bank': {
      select: ''
    },
    'natureOfLoss': {
      select: 'name _id'
    },
    'shareWith.persons': {
      select: 'name _id email officeEmail'
    },
    'insured': {
      select: 'name _id'
    },
    'insuredOffice': {
      select: ''
    },
    'insuredOffice.city': {
      select: 'name _id district'
    },
    'insuredOffice.city.district': {
      select: 'name _id state'
    },
    'insuredOffice.city.district.state': {
      select: 'name _id'
    },
    'products.product': {
      select: 'name _id category'
    },
    'products.product.category': {
      select: 'name _id industry'
    },
    'products.product.category.industry': {
      select: 'name _id'
    },
    'templateInvoice.forms.invoiceExpenditure': {
      select: 'name _id'
    },
    'assessment.employee': {
      select: 'name _id photo'
    },
    'consent.employee': {
      select: 'name _id photo'
    },
    'docs.employee': {
      select: 'name _id photo'
    },
    'fsrs.employee': {
      select: 'name _id photo'
    },
    'photos.employee': {
      select: 'name _id photo'
    },
    'causeOfLoss': {
      select: 'name _id'
    },
    'policyType': {
      select: 'name _id'
    },
    'survey.employee': {
      select: 'name _id email mobile officeMobile officeEmail address city'
    },
    'survey.employee.city': {
      select: 'name _id state'
    },
    'survey.employee.city.district': {
      select: 'name _id state'
    },
    'survey.employee.city.district.state': {
      select: 'name _id zone'
    },
    'survey.employee.city.district.state.zone': {
      select: 'name _id country'
    },
    'survey.employee.city.district.state.zone.country': {
      select: 'name countryCode _id'
    },
    'policyDepartment': {
      select: 'name _id'
    },
    'timeline': {
      select: 'chat _id'
    }
  }
});
autoIncrement.initialize(mongoose.connection);
schema.plugin(uniqueValidator);
schema.plugin(timestamps);

module.exports = mongoose.model('Assignment', schema);

var exports = _.cloneDeep(require("sails-wohlig-service")(schema, "city.district.state.zone.country products.product.category.industry department shareWith.persons policyType natureOfLoss invoice invoice.createdBy insured insuredOffice owner owner.func company company.city insurerOffice company.city.district.state assessment.employee consent.employee docs.employee fsrs.employee photos.employee causeOfLoss insurer assignedTo office branch survey.employee survey.employee.city company.bank owner.employee survey.employee.city.district survey.employee.city.district.state survey.employee.city.district.state.zone survey.employee.city.district.state.zone.country customer brokerOffice", "city.district.state.zone.country products.product.category.industry department shareWith.persons natureOfLoss company invoice invoice.createdBy insuredOffice assignedTo insurerOffice office branch survey.employee company.bank owner owner.employee survey.employee.city.district survey.employee.city.district.state survey.employee.city.district.state.zone survey.employee.city.district.state.zone.country survey.employee.city customer brokerOffice"));

var model = {
  saveData: function (data, callback) {
    var Model = this;
    if (_.isEmpty(data.insured)) {
      delete data.insured;
    }
    var Const = this(data);
    var foreignKeys = Config.getForeignKeys(schema);
    if (data._id) {
      Model.findOne({
        _id: data._id
      }, function (err, data2) {
        if (err) {
          callback(err, data2);
        } else if (data2) {
          async.each(foreignKeys, function (n, callback) {
            if (data[n.name] != data2[n.name]) {
              Config.manageArrayObject(mongoose.models[n.ref], data2[n.name], data2._id, n.key, "delete", function (err, md) {
                if (err) {
                  callback(err, md);
                } else {
                  Config.manageArrayObject(mongoose.models[n.ref], data[n.name], data2._id, n.key, "create", callback);
                }
              });
            } else {
              callback(null, "no found for ");
            }
          }, function (err) {
            Model.update({
              _id: data._id
            }, data, function (err, updated) {
              if (err) {
                callback(err, null);
              } else {
                callback(null, updated);
              }
            });
          });
        } else {
          callback("No Data Found", data2);
        }
      });
    } else {
      Model.generateAssignmentNumber(data, function (err, assignmentName) {
        if (err) {
          callback(err, null);
        } else {
          if (_.isEmpty(assignmentName)) {
            callback("Assignment Number is Null", null)
          } else {
            Const.name = assignmentName.name; //MR# Calculated 
            Const.dateMOY = assignmentName.dateMOY;
            Const.brachCode = assignmentName.brachCode;
            Const.fourthDigit = assignmentName.fourthDigit;
            Const.sixthDigit = assignmentName.sixthDigit;
            Const.billingPeriod = assignmentName.billingPeriod;
            Const.assignmentNumber = assignmentName.assignmentNumber;
            // Const.nos = assignmentName.nos;
            Const.save(function (err, data2) {
              if (err) {
                callback(err, data2);
              } else {
                async.each(foreignKeys, function (n, callback) {
                  Config.manageArrayObject(mongoose.models[n.ref], data2[n.name], data2._id, n.key, "create", function (err, md) {
                    callback(err, data2);
                  });
                }, function (err) {
                  if (err) {
                    callback(err, data2);
                  } else {
                    callback(null, data2);
                  }
                });
              }
            });
          }
        }
      });
    }
  },
  getAssignmentMailData: function (emailType, data, callback) {
    if (data.saveStatus === true) {
      var id = data.assignment;
    } else {
      var id = data.assignment._id;
    }
    Assignment.getOne({
      _id: id
    }, function (err, assignmentData) {
      if (err) {
        callback("No data found in assignment", null);
      } else {
        if (_.isEmpty(assignmentData)) {
          callback("No data found in assignment search", null);
        } else {
          toName = "";
          toEmail = "";
          if (data.officeEmail) {
            var to = data.officeEmail;
            to = to.split("<");
            toName = to[0];
            var toEmails = to[1].split(">");
            toEmail = toEmails[0];
          }
          var emailData = {};
          emailData.assignmentNo = assignmentData.name;
          emailData.ownerName = assignmentData.owner.name;
          emailData.ownerEmail = assignmentData.owner.officeEmail;
          emailData.ownerPhone = assignmentData.owner.officeMobile;
          emailData.siteAddress = (assignmentData.address ? assignmentData.address : '');
          if (assignmentData.city !== undefined) {
            if (assignmentData.city.name) {
              emailData.siteCity = assignmentData.city.name;
              if (assignmentData.city.district) {
                emailData.siteDistrict = assignmentData.city.district.name;
                if (assignmentData.city.district.state) {
                  emailData.siteState = assignmentData.city.district.state.name;
                  if (assignmentData.city.district.state.zone) {
                    emailData.siteZone = assignmentData.city.district.state.zone.name;
                    if (assignmentData.city.district.state.zone.country) {
                      emailData.siteCountry = assignmentData.city.district.state.zone.country.name;
                    }
                  }
                }
              }
            }
          }
          emailData.fullAddress = emailData.siteAddress + " " + emailData.siteCity + " " + emailData.siteState + " " + emailData.siteZone + " " + emailData.siteCountry;
          emailData.invoiceNumber = data.invoiceNumber;
          if (assignmentData.insured) {
            if (assignmentData.insured.name) {
              emailData.insuredName = (assignmentData.insured.name ? assignmentData.insured.name : "");
            } else {
              emailData.insuredName = "";
            }
          } else {
            emailData.insuredName = "";
          }
          if (assignmentData.templateIla[0]) {
            emailData.ilaAuthDate = assignmentData.templateIla[0].authTimestamp;
          }
          if (assignmentData.products[0]) {
            if (assignmentData.products[0].product) {
              emailData.productName = (assignmentData.products[0].product.name ? assignmentData.products[0].product.name : "NA");
            }
          }

          if (assignmentData.survey && emailType != "SBC For Approval") {
            _.each(assignmentData.survey, function (values) {
              if (values.status == "Pending") {
                if (values.employee) {
                  emailData.surveyorNumber = values.employee.officeMobile;
                  emailData.surveyorName = values.employee.name;
                  emailData.surveyorEmail = values.employee.officeEmail;
                  emailData.surveyDate = values.surveyDate;
                }
              }
            });
          }

          if (assignmentData.survey && emailType === "SBC For Approval") {
            _.each(assignmentData.survey, function (values) {
              if (values.status == "Approval Pending") {
                if (values.employee) {
                  emailData.surveyorNumber = values.employee.officeMobile;
                  emailData.surveyorName = values.employee.name;
                  emailData.surveyorEmail = values.employee.officeEmail;
                  emailData.surveyDate = (values.surveyDate ? moment(values.surveyDate).format("DD/MM/YYYY") : "");
                }
              }
            });
          }


          emailData.to = [];
          emailData.to.push({
            name: assignmentData.owner.name,
            email: assignmentData.owner.officeEmail
          });
          emailData.cc = [];
          if (assignmentData.shareWith) {
            _.each(assignmentData.shareWith, function (values) {
              _.each(values.persons, function (personss) {
                emailData.cc.push({
                  name: personss.name,
                  email: personss.officeEmail
                });
              });
            });
          }

          if (data.users) {
            emailData.assignmentAuthorizer = data.users.name;
          }
          if (data.assignment) {
            if (data.assignment.forceClosedComment) {
              emailData.forceClosedComment = (data.assignment.forceClosedComment ? data.assignment.forceClosedComment : "");
            }
            if (data.assignment.reopenComment) {
              emailData.reopenComment = (data.assignment.reopenComment ? data.assignment.reopenComment : "");
            }
            if (data.assignment.onholdComment) {
              emailData.onholdComment = (data.assignment.onholdComment ? data.assignment.onholdComment : "");
            }
          }

          var mailData = [];
          if (emailType === "Invoice Send Authorization" || emailType === "ILA Send for Authorization" || emailType === "LOR Send Authorization") {
            emailData.to = [];
            emailData.to.push({
              name: toName,
              email: toEmail
            });
          }
          mailData[0] = emailType;
          mailData[1] = emailData;
          mailData[2] = data.accessToken;
          mailData[3] = data.users.email;
          if (emailType === "SBC For Approval") {
            emailData.sbcTo = [];
            var filter = {
              filter: {
                isSBC: true
              }
            };
            Employee.employeeSearch(filter, function (err, sbc) {
              _.each(sbc.results, function (values) {
                emailData.sbcTo.push({
                  name: values.name,
                  email: values.officeEmail
                });
              });
              Assignment.getMailAndSendMail(mailData, function (err, newData) {
                if (err || _.isEmpty(newData)) {
                  callback("There was an error while sending mail", null);
                } else {
                  callback(null, {
                    to: emailData.to,
                    results: newData
                  });
                }
              });
            });
          } else {
            Assignment.getMailAndSendMail(mailData, function (err, newData) {
              if (err || _.isEmpty(newData)) {
                callback("There was an error while sending mail", null);
              } else {
                callback(null, {
                  to: emailData.to,
                  results: newData
                });
              }
            });
          }
        }
      }
    });
  },
  getAssignmentMatchedData: function (data, callback) {
    if (_.isEmpty(data.type) && _.isEmpty(data.match)) {
      callback(null, "");
    } else {
      var aggregateArr = _.concat(Assignment.getAssignmentLookupData(data.type), Assignment.getAssignmentMatchArray(data.type, data.match), Assignment.getAssignmentProjectArray(data.type));
      Assignment.aggregate(_.compact(aggregateArr)).exec(function (err, matched) {
        if (err || _.isEmpty(matched)) {
          callback(err, matched);
        } else {
          callback(null, matched);
        }
      });
    }
  },
  updateAssignmentLor: function (data, callback) {
    Assignment.update({
      _id: data._id
    }, {
      templateLor: data.templateLor
    }).lean().exec(function (err, data) {
      if (err) {
        callback(err, null);
      } else {
        callback(err, data);
      }
    });
  },
  updateAssignmentIla: function (data, callback) {
    _.map(data.templateIla, function (values) {
      if (values.name === "ICICI Cargo template") {
        _.map(values.forms, function (value) {
          _.map(value.items, function (values2) {
            if (values2.type === "Custom Input" && values2.value === "Date") {
              if (!_.isEmpty(values2.field)) {
                values2.field = new Date(values2.field);
              }
            }
          });
        });
      }
    });
    Assignment.update({
      _id: data._id
    }, {
      templateIla: data.templateIla
    }).lean().exec(function (err, data) {
      if (err) {
        callback(err, null);
      } else {
        callback(err, data);
      }
    });
  },
  updateAssignmentInvoice: function (data, callback) {
    Assignment.update({
      _id: data._id
    }, {
      getAllTaskStatus: data.getAllTaskStatus,
      timelineStatus: data.timelineStatus
    }).lean().exec(function (err, data) {
      if (err) {
        callback(err, null);
      } else {
        callback(err, data);
      }
    });
  },
  pushAssignmentInvoice: function (data, callback) {
    Assignment.update({
      _id: data._id
    }, {
      $push: {
        invoice: data.invoice
      }
    }).lean().exec(function (err, data) {
      if (err) {
        callback(err, null);
      } else {
        callback(err, data);
      }
    });
  },

  getAssignmentLookupData: function (match) {
    var lookupData = [];
    if (_.isEmpty(match)) {
      lookupData = null;
    } else {
      var project1 = [{
        $lookup: {
          from: "customers",
          localField: "insurerOffice",
          foreignField: "_id",
          as: "insurer"
        }
      }, {
        $unwind: {
          path: "$insurer",
          preserveNullAndEmptyArrays: true
        }
      }, {
        $lookup: {
          from: "customers",
          localField: "insuredOffice",
          foreignField: "_id",
          as: "insured"
        }
      }, {
        $unwind: {
          path: "$insured",
          preserveNullAndEmptyArrays: true
        }
      }];

      switch (match) {
        case "LRs":
          project2 = [{
            $unwind: "$LRs"
          }]
          lookupData = _.concat(project1, project2);
          break;
        case "product":
          project2 = [{
            $unwind: "$product"
          }]
          lookupData = _.concat(project1, project2);
          break;
        case "locationArr":
          project2 = [{
            $unwind: "$locationArr"
          }]
          lookupData = _.concat(project1, project2);
          break;
        case "invoices":
          project2 = [{
            $unwind: "$invoices"
          }]
          lookupData = _.concat(project1, project2);
          break;
        default:
          project2 = null;
          break;
      }
    }
    return lookupData;
  },

  getAssignmentMatchArray: function (match, matchValue) {
    //Sorting
    var matched = {
      $match: {}
    };

    function makeSort(name, value) {
      matched.$match[name] = {
        $regex: value,
        $options: "i"
      };
    }

    if (_.isEmpty(match)) {
      matched = null;
    } else {
      switch (match) {
        case "LRs":
          makeSort(match + ".lrNumber", matchValue);
          break;
        case "product":
          makeSort(match + ".product", matchValue);
          break;
        case "locationArr":
          makeSort(match + ".locationString", matchValue);
          break;
        case "invoices":
          makeSort(match + ".invoiceNumber", matchValue);
          break;
        default:
          matched = null;
          break;
      }
    }
    return [matched];
  },

  getAssignmentProjectArray: function (match) {
    var matched = []
    if (_.isEmpty(match)) {
      matched = null;
    } else {
      switch (match) {
        case "LRs":
          matched = [{
            $project: {
              name: 1,
              dateOfAppointment: 1,
              insurer: "$insurer.name",
              insured: "$insured.name",
              LRs: "$LRs.lrNumber"
            }
          }];
          break;
        case "product":
          matched = [{
            $project: {
              name: 1,
              dateOfAppointment: 1,
              insurer: "$insurer.name",
              insured: "$insured.name",
              product: "$product.product",
            }
          }];
          break;
        case "locationArr":
          matched = [{
            $project: {
              name: 1,
              dateOfAppointment: 1,
              insurer: "$insurer.name",
              insured: "$insured.name",
              locationArr: "$locationArr.locationString",
            }
          }];
          break;
        case "invoices":
          matched = [{
            $project: {
              name: 1,
              dateOfAppointment: 1,
              insurer: "$insurer.name",
              insured: "$insured.name",
              invoices: "$invoices.invoiceNumber"
            }
          }];
          break;
        default:
          matched = null;
          break;
      }
    }
    return matched;
  },

  getNearestSurveyor: function (data, callback) {
    Employee.find({
      $or: [{
        isSurveyor: true
      }, {
        isField: true
      }],
      location: {
        $near: {
          $geometry: {
            type: "Point",
            coordinates: [data.lng, data.lat]
          }
        }
      }
    }, {
      // name: 1,
      // photo: 1,
      // employeeCode: 1,
      officeEmail: 1
    }).limit(10).lean().exec(function (err, data2) {
      if (err) {
        callback(err, null);
      } else {
        callback(err, data2);
      }
    });
  },

  getNearestSurveyor2: function (data, callback) {
    Employee.find({
      _id: {
        $in: data.ids
      }
    }, {
      name: 1,
      photo: 1,
      employeeCode: 1,
      officeEmail: 1
    }).lean().exec(function (err, data2) {
      if (err) {
        callback(err, null);
      } else {
        callback(err, data2);
      }
    });
  },

  generateAssignmentNumberForAll: function (data, callback) {
    Assignment.find({}).sort({
      _id: 1
    }).exec(function (err, data) {
      if (err) {
        callback(err, null);
      } else {
        async.eachSeries(data, function (n, callback1) {
          Assignment.generateAssignmentNumber(n, function (err, data3) {
            if (err) {
              callback1(err, null)
            } else {
              callback1(null, data3);
            }
          });

        }, function (err, data2) {
          if (err) {
            callback(err, data2);
          } else {
            callback(null, data2);
          }
        });
      }
    })
  },

  generateAssignmentNumber: function (data, callback) {
    Branch.getBillingType(data.branch, function (err, branchDetails) {
      if (err) {
        callback(err, null);
      } else if (branchDetails) {
        data.dateMOY = branchDetails.seriesFormat;
        data.brachCode = branchDetails.code;
        data.fourthDigit = Assignment.getFourthDigit(data);
        Assignment.getSixthDigit(data, function (err, sixthDigit) {
          if (err) {
            callback(err, null)
          } else {
            data.sixthDigit = sixthDigit;
            data.billingPeriod = Assignment.getDate(data);
            Assignment.find({
              dateMOY: data.dateMOY,
              brachCode: data.brachCode,
              // nos: data.nos,
              billingPeriod: data.billingPeriod
            }, {
              assignmentNumber: 1
            }).sort({
              assignmentNumber: -1
            }).limit(1).lean().exec(function (err, assignmentNo) {
              if (err) {
                callback(err, null);
              } else if (assignmentNo.length == 0) {
                data.assignmentNumber = 1;
                var num = data.assignmentNumber;
                num = '' + num;
                while (num.length < 4) {
                  num = '0' + num;
                }
                data.name = "IN1" + data.fourthDigit + "-" + sixthDigit + data.brachCode + "-" + moment(new Date(data.dateOfAppointment)).add(5, "hours").add(30, "minutes").format("YY") + moment(new Date(data.dateOfAppointment)).add(5, "hours").add(30, "minutes").format("MM") + "-" + num;
                callback(null, data);
                // data.save(function (err, data) {
                //   if (err) {
                //     callback(err, data);
                //   } else {
                //     callback(null, data);
                //   }
                // });
              } else {
                data.assignmentNumber = assignmentNo[0].assignmentNumber + 1
                var num = data.assignmentNumber;
                num = '' + num;
                while (num.length < 4) {
                  num = '0' + num;
                }
                data.name = "IN1" + data.fourthDigit + "-" + sixthDigit + data.brachCode + "-" + moment(new Date(data.dateOfAppointment)).add(5, "hours").add(30, "minutes").format("YY") + moment(new Date(data.dateOfAppointment)).add(5, "hours").add(30, "minutes").format("MM") + "-" + num;
                callback(null, data);
                // data.save(function (err, data) {
                //   if (err) {
                //     callback(err, data);
                //   } else {
                //     callback(null, data);
                //   }
                // });

              }
            });
          }
        });
      } else {
        callback(err, null);
      }
    });
  },

  getAssignmentTemplate: function (type, id, callback) {
    var Model = this;

    var aggText = [];
    aggText = [{
      "$unwind": "$" + type
    }, {
      "$match": {

      }
    }];
    aggText[1]["$match"][type + "._id"] = mongoose.Types.ObjectId(id);
    Model.aggregate(aggText).exec(function (err, data) {
      if (err || data.length === 0) {
        callback(err);
      } else if (data.length > 0) {
        var data2 = _.cloneDeep(data[0][type]);
        data2.type = type;

        Model.findOne({
          _id: data[0]._id
        }).deepPopulate("city.district.state.zone.country insuredOffice.city.district.state products.product.category.industry shareWith.persons branch natureOfLoss department insurerOffice office office.city office.city.district office.city.district.state insuredOffice owner owner.func company company.city assessment.employee consent.employee customer docs.employee fsrs.employee photos.employee causeOfLoss insurer policyType insured salvage natureOfLoss", "city.district.state.zone.country products.product.category.industry shareWith.persons natureOfLoss insurerOffice insuredOffice").lean().exec(function (err, data3) {
          if (err) {
            callback(err, data3);
          } else {
            var filter = {
              _id: data3.policyDoc
            }
            PolicyDoc.getPolicyDoc({
              filter
            }, function (err, data4) {
              if (err) {
                data2.assignment = data3;
                callback(null, data2);
              } else {
                data2.assignment = data3;
                if (data4.results[0]) {
                  data2.assignment.policyFrom = (data4.results[0].from ? data4.results[0].from : "");
                  data2.assignment.policyTo = (data4.results[0].to ? data4.results[0].to : "");
                  data2.assignment.policyNumber = (data4.results[0].policyNo ? data4.results[0].policyNo : "");
                }
                callback(null, data2);
              }
            });
          }
        });

      }
    });
  },

  editAssignmentTemplate: function (body, callback) {
    var Model = this;
    var approvalType = "None";
    var approvalStatus = "Pending";
    if (body.type == "templateIla" && body.approvalStatus == "Approved") {
      approvalType = "ILA";
    } else if (body.type == "templateLor" && body.approvalStatus == "Approved") {
      approvalType = "LOR";
    }
    var $scope = {};
    var data2 = _.cloneDeep(body);
    delete data2.assignment;

    if (data2.name === "ICICI Cargo template") {
      _.map(data2.forms, function (values) {
        _.map(values.items, function (values2) {
          if (values2.type === "Custom Input" && values2.value === "Date") {
            if (!_.isEmpty(values2.field)) {
              values2.field = new Date(values2.field);
            }
          }
        });
      });
    }

    $scope.data = data2;



    var findObj = {
      _id: body.assignment
    };
    findObj[body.type + "._id"] = body._id;

    var setObj = {};
    setObj[body.type + ".$"] = _.cloneDeep(data2);
    Model.update(findObj, {
      "$set": setObj,
      approvalType: approvalType,
      approvalStatus: approvalStatus
    }, function (err, data3) {
      _.each($scope.data.forms, function (n) {
        _.each(n.items, function (m) {
          if (m.value == "Date") {
            m.field = moment(m.field).format('DD/MM/YYYY');
          }
        });
      });
      if (err) {
        callback(err, null);
      } else {
        $scope.assignment = findObj._id;
        if (body.type == "templateLor") {
          Config.generatePdf("pdf/new-lor", $scope, callback);
        } else if (body.type == "templateIla") {
          if (body.templateIlaName === "ICICI Cargo template") {
            Config.generatePdf("icici-ila", $scope, callback, '', true);
          } else {
            Config.generatePdf("new-ila", $scope, callback);
          }
        } else {
          callback(null, "No Pdf template to generate");
        }
      }
    });
  },

  getPdfFile: function (body, callback) {
    var $scope = {};
    var data2 = _.cloneDeep(body);
    delete data2.assignment;

    if (data2.name === "ICICI Cargo template") {
      _.map(data2.forms, function (values) {
        _.map(values.items, function (values2) {
          if (values2.type === "Custom Input" && values2.value === "Date") {
            if (!_.isEmpty(values2.field)) {
              values2.field = new Date(values2.field);
            }
          }
        });
      });
    }

    $scope.data = data2;
    _.each($scope.data.forms, function (n) {
      _.each(n.items, function (m) {
        if (m.value == "Date") {
          m.field = moment(m.field).format('DD/MM/YYYY');
        }
      });
    });

    $scope.assignment = body.assignment;
    if (body.type == "templateLor") {
      Config.generatePdf("pdf/new-lor-notValid", $scope, callback, '', '', true);
    } else if (body.type == "templateIla") {
      if (body.templateIlaName === "ICICI Cargo template") {
        Config.generatePdf("icici-ila-notValid", $scope, callback, '', true, true);
      } else {
        Config.generatePdf("new-ila-notValid", $scope, callback, '', '', true);
      }
    } else {
      callback(null, "No Pdf template to generate");
    }

  },

  generateInvoicePdf: function (data, callback) {
    $scope = {};
    Customer.findOne({
      _id: data.billedTo
    }).lean().deepPopulate("customerCompany city.district.state.zone.country customerCompany.GSTINByState.state").exec(function (err, data3) {
      if (err) {
        callback(err, null);
      } else {
        Invoice.findOne({
          _id: data._id
        }).lean().deepPopulate("assignment assignment.company assignment.company.bank assignment.department assignment.products.product.category assignment.natureOfLoss assignment.causeOfLoss assignment.policyType assignment.customer assignment.insurerOffice assignment.insuredOffice assignment.city.district.state.zone.country assignment.company.city.district.state assignment.company.GSTINByState.state").exec(function (err, data2) {
          if (err) {
            callback(err, null);
          } else {
            data.billedTo = data3;
            data.assignment = data2.assignment;
            if (data.invoiceApproved === true) {
              data2.approvalTime = Date.now();
            }
            $scope.data = data;
            var filter = {
                _id: data2.assignment.policyDoc
              }
              // For policyNumber
            PolicyDoc.getPolicyDoc({
              filter
            }, function (err, data4) {
              if (err) {
                Config.generatePdf("invoice", $scope, callback);
              } else {
                if (data4.results[0]) {
                  $scope.data.assignment.policyNumber = (data4.results[0].policyNo ? data4.results[0].policyNo : "");
                }
                Config.generatePdf("invoice", $scope, callback);
              }
            });
          }
        });
      }
    });
  },

  getInvoicePdfFile: function (data, callback) {
    $scope = {};
    Customer.findOne({
      _id: data.billedTo
    }).lean().deepPopulate("customerCompany city.district.state.zone.country customerCompany.GSTINByState.state").exec(function (err, data3) {
      if (err) {
        callback(err, null);
      } else {
        Invoice.findOne({
          _id: data._id
        }).lean().deepPopulate("assignment assignment.company assignment.company.bank assignment.department assignment.products.product.category assignment.natureOfLoss assignment.causeOfLoss assignment.policyType assignment.customer assignment.insurerOffice assignment.insuredOffice assignment.city.district.state.zone.country assignment.company.city.district.state assignment.company.GSTINByState.state").exec(function (err, data2) {
          if (err) {
            callback(err, null);
          } else {
            data.billedTo = data3;
            if (_.isEmpty(data2)) {
              // $scope.data = data;
              Assignment.findOne({
                _id: data.assignment
              }).lean().deepPopulate("company company.bank department products.product.category natureOfLoss causeOfLoss policyType customer insurerOffice insuredOffice city.district.state.zone.country company.city.district.state company.GSTINByState.state").exec(function (err, data2) {
                if (err) {
                  callback(err, 'No Assignment Found');
                } else {
                  data.assignment = data2;
                  data2.approvalTime = Date.now();
                  data.invoiceNumber = "";
                  $scope.data = data;
                  var filter = {
                      _id: data2.policyDoc
                    }
                    // For policyNumber
                  PolicyDoc.getPolicyDoc({
                    filter
                  }, function (err, data4) {
                    if (err) {
                      Config.generatePdf("invoiceNotValid", $scope, callback, '', '', true);
                    } else {
                      if (data4.results[0]) {
                        $scope.data.assignment.policyNumber = (data4.results[0].policyNo ? data4.results[0].policyNo : "");
                      }
                      Config.generatePdf("invoiceNotValid", $scope, callback, '', '', true);
                    }
                  });
                }
              });
            } else {
              data.assignment = data2.assignment;
              if (data.invoiceApproved === true) {
                data2.approvalTime = Date.now();
              }
              $scope.data = data;
              var filter = {
                  _id: data2.assignment.policyDoc
                }
                // For policyNumber
              PolicyDoc.getPolicyDoc({
                filter
              }, function (err, data4) {
                if (err) {
                  Config.generatePdf("invoiceNotValid", $scope, callback, '', '', true);
                } else {
                  if (data4.results[0]) {
                    $scope.data.assignment.policyNumber = (data4.results[0].policyNo ? data4.results[0].policyNo : "");
                  }
                  Config.generatePdf("invoiceNotValid", $scope, callback, '', '', true);
                }
              });
            }

          }
        });
      }
    });
  },

  search: function (data, callback) {
    var Model = this;
    var Const = this(data);
    var maxRow = Config.maxRow;
    var page = 1;
    // var name1=subString()
    if (data.page) {
      page = data.page;
    }
    var field = data.field;
    var options = {
      field: data.field,
      filters: {
        keyword: {
          fields: ['name'],
          term: data.keyword
        }
      },

      sort: {
        desc: "name",
      },
      start: (page - 1) * maxRow,
      count: maxRow
    };

    _.each(data.filter, function (n, key) {
      if (_.isEmpty(n)) {
        n = undefined;
      }
    });

    var Search = Model.find(data.filter)
      .order(options)
      .deepPopulate("city.district.state.zone.country products.product.category.industry department shareWith.persons policyType natureOfLoss invoice invoice.createdBy insured insuredOffice owner owner.func company company.city insurerOffice company.city.district.state assessment.employee consent.employee docs.employee fsrs.employee photos.employee causeOfLoss insurer assignedTo office branch survey.employee survey.employee.city survey.employee.city.district survey.employee.city.district.state survey.employee.city.district.state.zone survey.employee.city.district.state.zone.country")
      .keyword(options)
      .page(options, callback);

  },

  getMRNumbers: function (data, callback, user) {
    var Model = this;
    var Const = this(data);
    var maxRow = Config.maxRow;
    var page = 1;
    // var name1=subString()
    if (data.page) {
      page = data.page;
    }
    var field = data.field;
    var options = {
      field: data.field,
      filters: {
        keyword: {
          fields: [''],
          term: data.key
        }
      },

      sort: {
        desc: "name",
      },
      start: (page - 1) * maxRow,
      count: maxRow
    };

    var allUsersUnder = _.map(_.concat(user.children, data.ownerId), function (n) {
      return objectid(n);
    });
    if (data.all === false) {
      matchObj = {
        name: {
          $regex: data.keyword,
          $options: "i"
        },
        $or: [{
          'shareWith.persons': {
            $in: allUsersUnder
          }
        }, {
          'owner': {
            $in: allUsersUnder
          }
        }]
      };
    } else {
      matchObj = {
        name: {
          $regex: data.keyword,
          $options: "i"
        }
      };
    }

    var Search = Model.find(matchObj, {
        name: 1
      })
      .order(options)
      .keyword(options)
      .page(options, callback);
  },

  getMRNames: function (data, callback, user) {
    var Model = this;
    var Const = this(data);
    var maxRow = Config.maxRow;
    var page = 1;
    // var name1=subString()
    if (data.page) {
      page = data.page;
    }
    var field = data.field;
    var options = {
      field: data.field,
      filters: {
        keyword: {
          fields: [''],
          term: data.key
        }
      },

      sort: {
        desc: "name",
      },
      start: (page - 1) * maxRow,
      count: maxRow
    };

    matchObj = {
      name: {
        $regex: data.keyword,
        $options: "i"
      },
      timelineStatus: data.timelineStatus
    };
    // console.log('matchObj',matchObj);

    var Search = Model.find(matchObj, {
        name: 1
      })
      .order(options)
      .keyword(options)
      .page(options, callback);
  },

  CheckLr: function (data, callback) {

    var aggText = [];
    async.eachSeries(data.arr, function (n, callback1) {
      if (data.type == "LR") {
        data.newArr = data.arr;
        aggText = [{
          "$unwind": {
            path: "$LRs",
            includeArrayIndex: "arrayIndex", // optional
            preserveNullAndEmptyArrays: false // optional
          }
        }, {
          $project: {
            LRNumber: "$LRs.lrNumber",
            name: 1
          }
        }, {
          "$match": {
            LRNumber: n
          }
        }, {
          $count: "Count"
        }];
      } else {
        aggText = [{
          "$unwind": {
            path: "$LRs",
            includeArrayIndex: "arrayIndex", // optional
            preserveNullAndEmptyArrays: false // optional
          }
        }, {
          $project: {
            LRNumber: "$LRs.lrNumber",
            name: 1
          }
        }, {
          "$match": {
            LRNumber: data.value
          }
        }, {
          $count: "Count"
        }];
      }
      Assignment.aggregate(aggText).exec(function (err, found) {
        if (err) {
          callback(err, null);
        } else {
          if (found.length > 0) {}
          callback(null, found);
        }
      });
    }, function (err) {
      if (err) {
        callback(err, null);
      } else {
        callback(err, finalArr);
      }
    });
  },
  updateSurveyor: function (data, callback) {
    data.survey.timestamp = Date.now();
    Assignment.update({
      _id: data._id
    }, {
      $push: {
        survey: data.survey
      }
    }).exec(function (err, found) {
      if (err) {
        callback(err, null);
      } else {
        if (found.nModified == 1) {
          callback(null, found);
        } else {
          callback("There was an error while assigning surveyor", found);
        }
      }
    });
  },

  getEmailsData: function (data, callback) {
    Assignment.getMailData(data, function (err, emailData) {
      if (err) {
        callback(null, err);
      } else {
        if (_.isEmpty(emailData)) {
          callback("No mail data found", null);
        } else {
          emailData.accessToken = data[3];
          callback(null, emailData);
        }
      }
    });
  },

  //    TASK LIST

  // Changed Aggregate
  taskList: function (data, callback) {
    var page = 1;
    if (data.page) {
      page = data.page
    }
    var pagestartfrom = (page - 1) * 10;
    Assignment.aggregate([{
      $sort: {
        createdAt: -1
      }
    }, {
      $unwind: {
        path: "$survey",
        preserveNullAndEmptyArrays: true
      }
    }, {
      $match: {
        "survey.employee": objectid(data.id),
        "survey.status": "Pending"
      }
    }, {
      $lookup: {
        from: "cities",
        localField: "city",
        foreignField: "_id",
        as: "city"
      }
    }, {
      $unwind: {
        path: "$city",
        preserveNullAndEmptyArrays: true
      }
    }, {
      $lookup: {
        from: "districts",
        localField: "city.district",
        foreignField: "_id",
        as: "city.districts"
      }
    }, {
      $unwind: {
        path: "$city.districts",
        preserveNullAndEmptyArrays: true
      }
    }, {
      $lookup: {
        from: "states",
        localField: "city.districts.state",
        foreignField: "_id",
        as: "city.districts.states"
      }
    }, {
      $unwind: {
        path: "$city.districts.states",
        preserveNullAndEmptyArrays: true
      }
    }, {
      $lookup: {
        from: "zones",
        localField: "city.districts.states.zone",
        foreignField: "_id",
        as: "city.districts.states.zones"
      }
    }, {
      $unwind: {
        path: "$city.districts.states.zones",
        preserveNullAndEmptyArrays: true
      }
    }, {
      $lookup: {
        from: "countries",
        localField: "city.districts.states.zones.country",
        foreignField: "_id",
        as: "city.districts.states.zones.country"
      }
    }, {
      $unwind: {
        path: "$city.districts.states.zones.country",
        preserveNullAndEmptyArrays: true
      }
    }, {
      $skip: parseInt(pagestartfrom)
    }, {
      $limit: 10
    }, {
      $project: {
        name: 1,
        surveyDate: 1,
        address: 1,
        city: "$city.name",
        district: "$city.districts.name",
        state: "$city.districts.states.name",
        zone: "$city.districts.states.zones.name",
        country: "$city.districts.states.zones.country.name",
        pincode: 1,
        siteEmail: 1,
        siteMobile: 1,
        siteNumber: 1,
        survey: 1
      }
    }], function (err, data1) {
      if (err) {
        callback(err, null);
      } else {
        callback(null, data1);
      }
    });
  },
  taskListCompleted: function (data, callback) {
    var page = 1;
    if (data.page) {
      page = data.page
    }
    var pagestartfrom = (page - 1) * 10;
    Assignment.aggregate([{
      $sort: {
        createdAt: -1
      }
    }, {
      $unwind: {
        path: "$survey",
        preserveNullAndEmptyArrays: true
      }
    }, {
      $match: {
        "survey.employee": objectid(data.id),
        "survey.status": "Completed"
      }
    }, {
      $lookup: {
        from: "cities",
        localField: "city",
        foreignField: "_id",
        as: "city"
      }
    }, {
      $unwind: {
        path: "$city",
        preserveNullAndEmptyArrays: true
      }
    }, {
      $lookup: {
        from: "districts",
        localField: "city.district",
        foreignField: "_id",
        as: "city.districts"
      }
    }, {
      $unwind: {
        path: "$city.districts",
        preserveNullAndEmptyArrays: true
      }
    }, {
      $lookup: {
        from: "states",
        localField: "city.districts.state",
        foreignField: "_id",
        as: "city.districts.states"
      }
    }, {
      $unwind: {
        path: "$city.districts.states",
        preserveNullAndEmptyArrays: true
      }
    }, {
      $lookup: {
        from: "zones",
        localField: "city.districts.states.zone",
        foreignField: "_id",
        as: "city.districts.states.zones"
      }
    }, {
      $unwind: {
        path: "$city.districts.states.zones",
        preserveNullAndEmptyArrays: true
      }
    }, {
      $lookup: {
        from: "countries",
        localField: "city.districts.states.zones.country",
        foreignField: "_id",
        as: "city.districts.states.zones.country"
      }
    }, {
      $unwind: {
        path: "$city.districts.states.zones.country",
        preserveNullAndEmptyArrays: true
      }
    }, {
      $lookup: {
        from: "customers",
        localField: "insuredOffice",
        foreignField: "_id",
        as: "insured"
      }
    }, {
      $unwind: {
        path: "$insured",
        preserveNullAndEmptyArrays: true
      }
    }, {
      $skip: parseInt(pagestartfrom)
    }, {
      $limit: 10
    }, {
      $project: {
        name: 1,
        surveyDate: 1,
        address: 1,
        city: "$city.name",
        district: "$city.districts.name",
        state: "$city.districts.states.name",
        zone: "$city.districts.states.zones.name",
        country: "$city.districts.states.zones.country.name",
        insuredOffice: "$insured.name",
        pincode: 1,
        siteEmail: 1,
        siteMobile: 1,
        siteNumber: 1,
        survey: 1
      }
    }], function (err, data1) {
      if (err) {
        callback(err, null);
      } else {
        callback(null, data1);
      }
    });
  },

  // Declined
  decline: function (data, callback) {
    Assignment.update({
      "survey._id": data.surveyId
    }, {
      $set: {
        "survey.$.status": "Declined",
        "survey.$.declineTime": Date.now()
      }
    }).exec(function (err, found) {

      if (err) {
        callback(err, null);
      } else {
        var newChat = {};
        newChat.employee = data.empId,
          newChat.type = "Normal",
          newChat.title = "Has Declined the Assignment",
          newChat.message = data.message
        Timeline.update({
          assignment: data.assignId
        }, {
          $push: {
            chat: newChat
          }
        }).exec(function (err, data) {
          if (err) {
            callback(err, null);
          } else {
            callback(null, data);
          }
        });
      }
    });
  },


  // Doc  Photos JIR
  mobileSubmit: function (data, callback) {
    var fileArray = [];
    var docCount = 0;
    var timelineData = [];
    if (!_.isEmpty(data.doc)) {
      var docs = [];
      _.each(data.doc, function (n) {
        docs.push(n.file);
        n.fileName = Date.now(),
          n.employee = data.empId,
          fileArray[docCount] = {
            attachment: n.file,
            message: "Document"
          },
          docCount = docCount + 1;
      });

      timelineData.push({
        attachment: docs,
        employee: data.empId,
        fileName: Date.now(),
        title: "Document(s) Uploaded",
        type: "Normal"
      })
    }
    if (!_.isEmpty(data.photos)) {
      var photos = [];
      _.each(data.photos, function (n) {
        photos.push(n.file);
        n.fileName = Date.now(),
          n.employee = data.empId,
          fileArray[docCount] = {
            attachment: n.file,
            message: "Photo"
          },
          docCount = docCount + 1;
      });

      timelineData.push({
        attachment: photos,
        employee: data.empId,
        fileName: Date.now(),
        title: "Photo(s) Uploaded",
        type: "Normal"
      })
    }
    if (!_.isEmpty(data.jir)) {
      var jir = [];
      _.each(data.jir, function (n) {
        jir.push(n.file);
        n.fileName = Date.now(),
          n.employee = data.empId,
          fileArray[docCount] = {
            attachment: n.file,
            message: "JIR"
          },
          docCount = docCount + 1;
      });

      timelineData.push({
        attachment: jir,
        employee: data.empId,
        fileName: Date.now(),
        title: "JIR(s) Uploaded",
        type: "Normal"
      })
    }
    Assignment.update({
      "survey._id": data.surveyId
    }, {
      // timelineStatus: "ILA Pending",
      "getAllTaskStatus.survey": "Done",
      "getAllTaskStatus.surveyTime": Date.now(),
      $set: {
        "survey.$.surveyDate": new Date(data.surveyDate),
        // "survey.$.surveyTime": new Date(data.surveyTime),
        //  "survey.$.surveyTime":data.surveyTime ? new Date(data.surveyTime) : new Date(), Backup
        "survey.$.status": "Completed",
        "survey.$.address": data.address,
        // "survey.$.dateOfSurvey": new Date(data.dateOfSurvey),
        "survey.$.completionTime": Date.now(),
        "survey.$.surveyEndTime": new Date(data.endTime),
        "survey.$.surveyStartTime": new Date(data.startTime)
      },
      $push: {
        docs: {
          $each: data.doc
        },
        photos: {
          $each: data.photos
        },
        jir: {
          $each: data.jir
        }
      },
    }).exec(function (err, found) {
      if (err) {
        callback(err, null);
      } else {
        if (found.nModified === 1) {
          var newChat = {};
          newChat.employee = data.empId;
          newChat.type = "SurveyDone";
          newChat.title = "Survey Done";
          newChat.surveyEndTime = new Date(data.endTime);
          newChat.surveyStartTime = new Date(data.startTime);
          newChat.surveyDate = new Date(data.surveyDate);
          newChat.address = data.address;
          newChat.event = "On Survey Attended";
          newChat.onSurveyAttended = true
            // _.each(fileArray, function (n) {
            //   n.employee = data.empId,
            //     n.type = "Normal",
            //     n.title = "Survey Done";
            // });

          timelineData.push(newChat);
          Timeline.update({
            assignment: data.assignId
          }, {
            $push: {
              chat: {
                $each: timelineData
              }
            }
          }).exec(function (err, data2) {
            if (err) {
              callback(err, null);
            } else {
              Assignment.getOne({
                _id: data.assignId
              }, function (err, assignmentData) {
                if (err) {
                  callback("No data found in assignment", null);
                } else {
                  async.parallel({
                    updateStatus: function (callback) {
                      Assignment.setGlobalAssignmentStatusForMigration(assignmentData, function (err, data5) {
                        if (err) {
                          callback(err, null)
                        } else {
                          Employee.findOne({
                            _id: data.empId
                          }).lean().exec(function (err, findData) {
                            var notificationMessage = {};
                            notificationMessage.deviceId = [];
                            notificationMessage.message = "Your Data for " + assignmentData.name + " has been Submitted Successfully";
                            notificationMessage.deviceId = findData.deviceIds;
                            Config.sendPushNotification(notificationMessage, function (error, sendPushNotificationResponse) {
                              if (error) {
                                callback(error, null);
                              } else {
                                callback(null, findData);
                              }
                            });
                          });
                        }
                      });
                    },
                    callAppendChat: function (callback) {
                      Timeline.appendChat({
                        _id: data.assignId
                      }, function (err, updateTimeline) {
                        if (err || updateTimeline == undefined) {
                          callback(err, null);
                        } else {
                          callback(null, {
                            message: "Success In Timeline"
                          });
                        }
                      });
                    }
                  }, function (error) {
                    if (error) {
                      callback(err, null)
                    } else {
                      callback(null, {
                        message: "Success In Timeline from offline survey"
                      });
                    }
                  })

                }
              });
            }
          });
        } else {
          callback("There was an error while doing offline survey", null);
        }
      }
    });
  },

  //Survey edit
  editSurvey: function (data, callback) {
    var fileArray = [];
    var timelineData = [];
    if (data.files === true) {
      var findObj = {
        _id: data.assignId
      };
      var docCount = 0;
      if (!_.isEmpty(data.doc)) {
        var docs = [];
        _.each(data.doc, function (n) {
          docs.push(n.file);
          n.fileName = Date.now(),
            n.employee = data.empId,
            fileArray[docCount] = {
              attachment: n.file,
              message: "Document"
            },
            docCount = docCount + 1;
        });

        timelineData.push({
          attachment: docs,
          employee: data.empId,
          fileName: Date.now(),
          title: "Document(s) Uploaded",
          type: "Normal"
        })

      }
      if (!_.isEmpty(data.photos)) {
        var photos = [];
        _.each(data.photos, function (n) {
          photos.push(n.file);
          n.fileName = Date.now(),
            n.employee = data.empId,
            fileArray[docCount] = {
              attachment: n.file,
              message: "Photo"
            },
            docCount = docCount + 1;
        });

        timelineData.push({
          attachment: photos,
          employee: data.empId,
          fileName: Date.now(),
          title: "Photos(s) Uploaded",
          type: "Normal"
        })
      }
      if (!_.isEmpty(data.jir)) {
        var jir = [];
        _.each(data.jir, function (n) {
          jir.push(n.file);
          n.fileName = Date.now(),
            n.employee = data.empId,
            fileArray[docCount] = {
              attachment: n.file,
              message: "JIR"
            },
            docCount = docCount + 1;
        });

        timelineData.push({
          attachment: jir,
          employee: data.empId,
          fileName: Date.now(),
          title: "JIR(s) Uploaded",
          type: "Normal"
        })
      }
      var updateObj = {
        // timelineStatus: "ILA Pending"
        $push: {
          docs: {
            $each: data.doc
          },
          photos: {
            $each: data.photos
          },
          jir: {
            $each: data.jir
          }
        }
      };
    } else {
      var findObj = {
        "survey._id": data.surveyId
      };
      if (_.isEmpty(data.surveyTime)) {
        var updateObj = {
          $set: {
            "survey.$.surveyDate": new Date(data.surveyDate),
            "survey.$.address": data.address,
            "survey.$.surveyEndTime": new Date(data.endTime),
            "survey.$.surveyStartTime": new Date(data.startTime),
            "survey.$.surveyUpdateTime": new Date()
          }
        };
      } else {
        var updateObj = {
          $set: {
            "survey.$.surveyDate": new Date(data.surveyDate),
            "survey.$.surveyTime": new Date(data.surveyTime),
            "survey.$.address": data.address,
            "survey.$.surveyEndTime": new Date(data.endTime),
            "survey.$.surveyStartTime": new Date(data.startTime),
            "survey.$.surveyUpdateTime": new Date()
          }
        };
      }

    }

    Assignment.update(findObj, updateObj).exec(function (err, found) {
      if (err) {
        callback(err, null);
      } else {
        if (found.nModified === 1) {
          if (data.files === true) {
            //Only update jir, photos, documents
            _.each(fileArray, function (n) {
              n.employee = data.empId,
                n.type = "Normal",
                n.title = "Survey Done";
            })
          } else {
            //Only update survey details
            var newChat = {};
            newChat.employee = data.empId;
            newChat.type = "SurveyDone";
            newChat.title = "Survey Updated";
            newChat.surveyEndTime = new Date(data.endTime);
            newChat.surveyStartTime = new Date(data.startTime);
            newChat.surveyDate = new Date(data.surveyDate);
            newChat.surveyTime = data.surveyTime ? new Date(data.surveyTime) : "";
            newChat.address = data.address;
            newChat.event = "On Survey Attended";
            newChat.onSurveyAttended = true
            timelineData.push(newChat);
            // fileArray.push(newChat);
          };
          var assignmentId = data.assignId;
          Timeline.update({
            assignment: data.assignId
          }, {
            $push: {
              chat: {
                $each: timelineData
              }
            }
          }).exec(function (err, data) {
            if (err || _.isEmpty(data)) {
              callback(err, data);
            } else {
              Timeline.appendChat({
                _id: assignmentId
              }, function (err, updateTimeline) {
                if (err || updateTimeline == undefined) {
                  callback(err, null);
                } else {
                  callback(null, data);
                }
              });
            }
          });

        } else {
          callback("There was an error while doing offline survey", null);
        }
      }
    });
  },

  getFourthDigit: function (data) {
    var fourthDigit = "";
    switch (data.typeOfClaim + "-" + data.isInsured) {
      case "true-false":
        {
          fourthDigit = "0";
          break;
        }
      case "true-true":
        {
          fourthDigit = "1";
          break;
        }
      case "false-false":
        {
          fourthDigit = "2";
          break;
        }
      case "false-true":
        {
          fourthDigit = "3";
          break;
        }
    }
    return fourthDigit;
  },

  getDate: function (data) {
    if (data.dateMOY == "yearly") {
      var newDate = "";
      var currentDateMonth = moment(new Date(data.dateOfAppointment)).add(5, "hours").add(30, "minutes").format("MM");
      if (currentDateMonth > 3) {
        newDate = moment(new Date(data.dateOfAppointment)).add(5, "hours").add(30, "minutes").add(1, "year").format("YYYY");
      } else {
        newDate = moment(new Date(data.dateOfAppointment)).add(5, "hours").add(30, "minutes").format("YYYY");
      }
      return newDate;
    } else {
      var currentDateMonth = moment(new Date(data.dateOfAppointment)).add(5, "hours").add(30, "minutes").format("MM-YYYY");
      return currentDateMonth;
    }
  },

  getSixthDigit: function (data, callback) {
    Department.findOne({
      _id: data.department
    }, {
      name: 1
    }).exec(function (err, data2) {
      if (err) {
        return 0;
      } else {
        var sixthDigit = "";
        switch (data.typeOfClaim + "-" + data2.name) {
          case "false-Engineering":
            {
              sixthDigit = "40";
              break;
            }
          case "false-Motor":
            {
              sixthDigit = "30";
              break;
            }
          case "false-Pre Dispatch":
            {
              sixthDigit = "20";
              break;
            }
          case "false-Pre Acceptance - Fire":
            {
              sixthDigit = "10";
              break;
            }
          case "true-Engineering":
            {
              sixthDigit = "44";
              break;
            }
          case "true-Fire":
            {
              sixthDigit = "11";
              break;
            }
          case "true-Marine Cargo":
            {
              sixthDigit = "21";
              break;
            }
          case "true-Misc":
            {
              sixthDigit = "48";
              break;
            }
          case "true-Motor":
            {
              sixthDigit = "31";
              break;
            }
          default:
            {
              sixthDigit = "00";
              break;
            }
        }
        callback(null, sixthDigit);
      }
    });
  },
  projectionOfGetAssignmentAggregate: function () {
    var allTable = [{
      $lookup: {
        from: "cities",
        localField: "city",
        foreignField: "_id",
        as: "city"
      }
    }, {
      $unwind: {
        path: "$city",
        preserveNullAndEmptyArrays: true
      }
    }, {
      $lookup: {
        from: "branches",
        localField: "branch",
        foreignField: "_id",
        as: "branch"
      }
    }, {
      $unwind: {
        path: "$branch",
        preserveNullAndEmptyArrays: true
      }
    }, {
      $lookup: {
        from: "customers",
        localField: "insurerOffice",
        foreignField: "_id",
        as: "insurer"
      }
    }, {
      $unwind: {
        path: "$insurer",
        preserveNullAndEmptyArrays: true
      }
    }, {
      $lookup: {
        from: "customers",
        localField: "brokerOffice",
        foreignField: "_id",
        as: "broker"
      }
    }, {
      $unwind: {
        path: "$broker",
        preserveNullAndEmptyArrays: true
      }
    }, {
      $lookup: {
        from: "employees",
        localField: "owner",
        foreignField: "_id",
        as: "owner"
      }
    }, {
      $unwind: {
        path: "$owner",
        preserveNullAndEmptyArrays: true
      }
    }, {
      $lookup: {
        from: "customers",
        localField: "insuredOffice",
        foreignField: "_id",
        as: "insured"
      }
    }, {
      $unwind: {
        path: "$insured",
        preserveNullAndEmptyArrays: true
      }
    }, {
      $lookup: {
        from: "departments",
        localField: "department",
        foreignField: "_id",
        as: "department"
      }
    }, {
      $unwind: {
        path: "$department",
        preserveNullAndEmptyArrays: true
      }
    }];

    return allTable;
  },
  projectionOfGetAssignmentExcelAggregate: function () {
    var allTable = [{
      $lookup: {
        from: "cities",
        localField: "city",
        foreignField: "_id",
        as: "city"
      }
    }, {
      $unwind: {
        path: "$city",
        preserveNullAndEmptyArrays: true
      }
    }, {
      $lookup: {
        from: "branches",
        localField: "branch",
        foreignField: "_id",
        as: "branch"
      }
    }, {
      $unwind: {
        path: "$branch",
        preserveNullAndEmptyArrays: true
      }
    }, {
      $lookup: {
        from: "customers",
        localField: "insurerOffice",
        foreignField: "_id",
        as: "insurer"
      }
    }, {
      $unwind: {
        path: "$insurer",
        preserveNullAndEmptyArrays: true
      }
    }, {
      $lookup: {
        from: "customers",
        localField: "brokerOffice",
        foreignField: "_id",
        as: "broker"
      }
    }, {
      $unwind: {
        path: "$broker",
        preserveNullAndEmptyArrays: true
      }
    }, {
      $lookup: {
        from: "employees",
        localField: "owner",
        foreignField: "_id",
        as: "owner"
      }
    }, {
      $unwind: {
        path: "$owner",
        preserveNullAndEmptyArrays: true
      }
    }, {
      $lookup: {
        from: "customers",
        localField: "insuredOffice",
        foreignField: "_id",
        as: "insured"
      }
    }, {
      $unwind: {
        path: "$insured",
        preserveNullAndEmptyArrays: true
      }
    }, {
      $lookup: {
        from: "departments",
        localField: "department",
        foreignField: "_id",
        as: "department"
      }
    }, {
      $unwind: {
        path: "$department",
        preserveNullAndEmptyArrays: true
      }
    }, {
      $unwind: {
        path: "$invoice",
        preserveNullAndEmptyArrays: true
      }
    }, {
      $lookup: {
        from: "invoices",
        localField: "invoice",
        foreignField: "_id",
        as: "invoice"
      }
    }, {
      $unwind: {
        path: "$invoice",
        preserveNullAndEmptyArrays: true
      }
    }, {
      $unwind: {
        path: "$natureOfLoss",
        preserveNullAndEmptyArrays: true
      }
    }, {
      $lookup: {
        from: "naturelosses",
        localField: "natureOfLoss",
        foreignField: "_id",
        as: "natureOfLoss"
      }
    }, {
      $unwind: {
        path: "$natureOfLoss",
        preserveNullAndEmptyArrays: true
      }
    }, {
      $unwind: {
        path: "$shareWith",
        includeArrayIndex: "arrayIndex", // optional
        preserveNullAndEmptyArrays: true // optional
      }
    }, {
      $unwind: {
        path: "$shareWith.persons",
        includeArrayIndex: "arrayIndex", // optional
        preserveNullAndEmptyArrays: true // optional
      }
    }, {
      $lookup: {
        from: "employees",
        localField: "shareWith.persons",
        foreignField: "_id",
        as: "shareWith.persons"
      }
    }, {
      $unwind: {
        path: "$shareWith.persons",
        preserveNullAndEmptyArrays: true // optional
      }
    }];

    return allTable;
  },
  typeOfGetAssignmentAggregate: function (data, user, statusReportFlag) {
    var retObj = {};
    if (data.ownerStatus == "My files") {
      if (statusReportFlag === true) {
        retObj = {
          'owner': objectid(data.ownerId),
        };
      } else {
        retObj = [{
          $match: {
            'owner': objectid(data.ownerId),
          }
        }];
      }

    } else if (data.ownerStatus == "Shared with me") {

      if (statusReportFlag === true) {
        retObj = {
          'shareWith.persons': objectid(data.ownerId),
        };
      } else {
        retObj = [{
          $match: {
            'shareWith.persons': objectid(data.ownerId),
          }
        }];
      }

    } else if (data.ownerStatus == "All files") {
      var allUsersUnder = _.map(_.concat(user.children, data.ownerId), function (n) {
        return objectid(n);
      });
      if (statusReportFlag === true) {
        retObj = {
          $or: [{
            'shareWith.persons': {
              $in: allUsersUnder
            }
          }, {
            'owner': {
              $in: allUsersUnder
            }
          }]
        };
      } else {
        retObj = [{
          $match: {
            $or: [{
              'shareWith.persons': {
                $in: allUsersUnder
              }
            }, {
              'owner': {
                $in: allUsersUnder
              }
            }]
          }
        }];
      }

    }

    return retObj;
  },
  filterOfGetAssignmentAggregate: function (data, statusReportFlag) {
    var filterObject = {};
    //Timeline status filter
    var timelineStatus = {};
    if (!_.isEmpty(data.timelineStatus)) {
      timelineStatus = {
        timelineStatus: {
          $in: data.timelineStatus
        }
      };
    }

    //Intimated Loss from range to to range
    var intimatedLoss = {};
    if (!_.isEmpty(data.from) && !_.isEmpty(data.to)) {
      intimatedLoss = {
        intimatedLoss: {
          "$gte": data.from,
          "$lte": data.to
        }
      };
    }

    //Assignment from date to to date
    var dateOfAppointment = {};
    if (!_.isEmpty(data.fromDate) && !_.isEmpty(data.toDate)) {
      dateOfAppointment = {
        dateOfAppointment: {
          "$gte": new Date(moment(data.fromDate)),
          "$lte": new Date(moment(data.toDate))
        }
      };
    }

    //Mr number filter
    var name = {};
    if (!_.isEmpty(data.name)) {
      name = {
        name: {
          $regex: data.name,
          $options: 'i'
        }
      };
    }

    //Owner of assignment filter
    var owner = {};
    if (!_.isEmpty(data.owner)) {
      owner = {
        'owner': {
          $in: _.map(data.owner, function (n) {
            if (mongoose.Types.ObjectId.isValid(n)) {
              return objectid(n);
            }
          })
        }
      };
    }

    //City filter
    var city = {};
    if (!_.isEmpty(data.city)) {
      city = {
        'city': {
          $in: _.map(data.city, function (n) {
            if (mongoose.Types.ObjectId.isValid(n)) {
              return objectid(n);
            }
          })
        }
      };
    }

    ///Branch filter 
    var branch = {};
    if (!_.isEmpty(data.branch)) {
      branch = {
        'branch': {
          $in: _.map(data.branch, function (n) {
            if (mongoose.Types.ObjectId.isValid(n)) {
              return objectid(n);
            }
          })
        }
      };
    }

    //Insurer filter
    var insurer = {};
    if (!_.isEmpty(data.insurer)) {
      insurer = {
        'insurerOffice': {
          $in: _.map(data.insurer, function (n) {
            if (mongoose.Types.ObjectId.isValid(n)) {
              return objectid(n);
            }
          })
        }
      };
    }

    //Insured filter
    var insured = {};
    if (!_.isEmpty(data.insured)) {
      insured = {
        'insuredOffice': {
          $in: _.map(data.insured, function (n) {
            if (mongoose.Types.ObjectId.isValid(n)) {
              return objectid(n);
            }
          })
        }
      };
    }

    //Department filter
    var department = {};
    if (!_.isEmpty(data.department)) {
      department = {
        'department': {
          $in: _.map(data.department, function (n) {
            if (mongoose.Types.ObjectId.isValid(n)) {
              return objectid(n);
            }
          })
        }
      };
    }

    //Broker Office filter
    var broker = {};
    if (!_.isEmpty(data.broker)) {
      broker = {
        'brokerOffice': {
          $in: _.map(data.broker, function (n) {
            if (mongoose.Types.ObjectId.isValid(n)) {
              return objectid(n);
            }
          })
        }
      };
    }

    var filterObject = Object.assign(timelineStatus, intimatedLoss, dateOfAppointment, name, owner, city, branch, insurer, insured, department, broker);
    if (_.isEmpty(filterObject)) {
      if (statusReportFlag === true) {
        return {};
      } else {
        return null;
      }
    } else {
      if (statusReportFlag === true) {
        return filterObject;
      } else {
        return [{
          $match: filterObject
        }];
      }
    }

  },
  sortOfGetAssignmentAggregate: function (data, statusReportFlag) {
    //Sorting
    var sort = {
      $sort: {}
    };

    function makeSort(name, value) {
      if (statusReportFlag === true) {
        sort[name] = value;
      } else {
        sort.$sort[name] = value;
      }

    }
    if (_.isEmpty(data.sorting[0])) {
      if (statusReportFlag === true) {
        sort = {
          createdAt: -1
        };
      } else {
        sort = {
          $sort: {
            createdAt: -1
          }
        };
      }
    } else {
      switch (data.sorting[0]) {
        case "name":
          makeSort(data.sorting[0], data.sorting[1]);
          break;
        case "intimatedLoss":
          makeSort(data.sorting[0], data.sorting[1]);
          break;
        case "owner":
          makeSort(data.sorting[0], data.sorting[1]);
          break;
        case "insurer":
          makeSort(data.sorting[0], data.sorting[1]);
          break;
        case "insured":
          makeSort(data.sorting[0], data.sorting[1]);
          break;
        case "department":
          makeSort(data.sorting[0], data.sorting[1]);
          break;
        case "city":
          makeSort(data.sorting[0], data.sorting[1]);
          break;
        case "timelineStatus":
          makeSort(data.sorting[0], data.sorting[1]);
          break;
        default:
          makeSort("createdAt", -1);
          break;
      }
    }

    return statusReportFlag === true ? sort : [sort];

  },
  completeGetAssignmentAggregate: function (data, user) {
    var limit = [{
      $skip: parseInt((data.pagenumber - 1) * data.pagelimit)
    }, {
      $limit: data.pagelimit
    }]
    var aggregateArr = _.concat(this.filterOfGetAssignmentAggregate(data), this.typeOfGetAssignmentAggregate(data, user), limit, this.projectionOfGetAssignmentAggregate());
    return _.compact(aggregateArr);
  },
  completeGetAssignmentExcelAggregate: function (data, user) {
    var aggregateArr = _.concat(this.filterOfGetAssignmentAggregate(data), this.typeOfGetAssignmentAggregate(data, user), this.projectionOfGetAssignmentExcelAggregate());
    return _.compact(aggregateArr);
  },
  getAll: function (data, callback, user) {
    // var coreArr = this.completeGetAssignmentAggregate(data, user);
    if (_.isEmpty(data.ownerStatus)) {
      callback(null, {
        results: [],
        total: 0
      });
    } else {
      var filter = this.filterOfGetAssignmentAggregate(data);
      var limit = [{
        $skip: parseInt((data.pagenumber - 1) * data.pagelimit)
      }, {
        $limit: data.pagelimit
      }];
      if (data.ownerStatus === 'Global') {
        var typeOfAssignment = [];
      } else {
        var typeOfAssignment = this.typeOfGetAssignmentAggregate(data, user);
      }

      var lookup = this.projectionOfGetAssignmentAggregate();
      var project = [{
        $project: {
          _id: 1,
          name: 1,
          owner: "$owner.name",
          insurerName: "$insurer.name",
          insuredName: "$insured.name",
          brokerName: "$broker.name",
          department: "$department.name",
          city: "$city.name",
          intimatedLoss: 1,
          timelineStatus: 1,
          status: 1
        }
      }];
      var countArr = [{
        $group: {
          _id: null,
          count: {
            $sum: 1
          }
        }
      }];
      var sortArr = this.sortOfGetAssignmentAggregate(data);
      if (data.sorting[0] == "name" || data.sorting[0] == "intimatedLoss" || data.sorting[0] == "timelineStatus" || data.sorting[0] == "") {
        var mainArr = _.compact(_.concat(typeOfAssignment, filter, sortArr, limit, lookup, project));
      } else {
        var mainArr = _.compact(_.concat(typeOfAssignment, filter, lookup, project, sortArr, limit));
      }

      async.parallel({
        results: function (callback) {
          Assignment.aggregate(mainArr).allowDiskUse(true).exec(callback);
        },
        total: function (callback) {
          Assignment.aggregate(_.compact(_.concat(typeOfAssignment, filter, countArr))).exec(callback);
        }
      }, function (err, data2) {
        if (err || _.isEmpty(data2.results)) {
          data2.total = 0;
          callback(err, data2);
        } else {
          data2.total = data2.total[0].count;
          callback(err, data2);
        }
      });
    }
  },
  generateAssignmentExcel: function (data, callback, res, user) {
    var filter = this.filterOfGetAssignmentAggregate(data, true);
    if (data.ownerStatus === 'Global') {
      var typeOfAssignment = [];
    } else {
      var typeOfAssignment = this.typeOfGetAssignmentAggregate(data, user, true);
    }
    var sortObj = this.sortOfGetAssignmentAggregate(data, true);

    function makeExcelDate(date) {
      if (date != undefined && date != null) {
        return moment(date).add(5, "hours").add(30, "minutes").format("DD/MM/YYYY");
        // var currentDate = moment(date).add(2, "days").add(5, "hours").add(30, "minutes"); // Added Because Date In Excel Was Less By 2 Days
        // var excelDate = moment("01/01/1900", "MM/DD/YYYY");
        // var newDate = moment(currentDate.diff(excelDate, "days"));
        // return newDate;
        // var returnDateTime = 25569.0 + ((date.getTime() - (date.getTimezoneOffset() * 60 * 1000)) / (1000 * 60 * 60 * 24));
        // return returnDateTime.toString().substr(0, 5);
      } else {
        return "";
      }
    }

    function getApprovedData(arrData) {
      if (arrData.length > 0) {
        var data = "";
        _.each(arrData, function (n) {
          if (n != null) {
            if (n.approvalStatus == "Approved") {
              data = n;
            }
          }
        });
        return data;
      } else {
        return "";
      }
    }

    function getSelectedData(match, arrData) {
      var dataArr = [];

      function makeSort(name) {
        _.each(arrData, function (n) {
          dataArr.push(n[name]);
        });
      }

      if (_.isEmpty(match)) {
        return "";
      } else {
        switch (match) {
          case "shareWith":
            makeSort("name");
            break;
          case "natureOfLoss":
            makeSort("name");
            break;
          default:
            dataArr = "";
            break;
        }
      }

      return dataArr.toString();
    }

    function getCompletedSurvey(arrData) {
      if (arrData.length > 0) {
        var data = [];
        _.each(arrData, function (n) {
          if (n != null) {
            if (n.status == "Completed") {
              data.push(n);
            }
          }
        });
        return data;
      } else {
        return "";
      }
    }

    var findData = filter != null || typeOfAssignment != null ? Object.assign(filter, typeOfAssignment) : {};
    Assignment.find(findData).deepPopulate("city department shareWith.persons natureOfLoss invoice insuredOffice owner insurerOffice branch survey.employee brokerOffice").lean().exec(function (err, data1) {
      if (err) {
        callback(null, data1);
      } else {
        if (_.isEmpty(data1)) {
          callback("No Data Found.", null);
        } else {
          var excelData = [];
          var key = 1;
          async.each(data1, function (n, callback) {
            var obj = {};
            obj["SR #"] = key;
            obj["Branch"] = "";
            if (n.branch) {
              obj["Branch"] = n.branch.name ? n.branch.name : "";
            }
            obj["MR #"] = n.name;
            obj["City"] = "";
            if (n.city) {
              obj["City"] = n.city.name;
            }
            obj["Insurer Claim #"] = n.insurerClaimId ? n.insurerClaimId : "";
            obj["Insured Claim #"] = n.insuredClaimId ? n.insuredClaimId : "";
            obj["Broker Claim #"] = n.brokerClaimId ? n.brokerClaimId : "";
            obj["Date of Assignment"] = makeExcelDate(n.dateOfAppointment);
            obj["Insured"] = "";
            obj["Insurer"] = "";
            if (n.insuredOffice) {
              obj["Insured"] = n.insuredOffice.name ? n.insuredOffice.name : "";
            }
            if (n.insurerOffice) {
              obj["Insurer"] = n.insurerOffice.name ? n.insurerOffice.name : "";
            }
            obj["Broker"] = "";
            if (n.brokerOffice) {
              obj["Broker"] = n.brokerOffice.name ? n.brokerOffice.name : "";
            }
            obj["Department"] = "";
            if (n.department) {
              obj["Department"] = n.department.name ? n.department.name : "";
            }
            obj["Nature of Loss"] = "";
            obj["Nature of Loss"] = getSelectedData("natureOfLoss", n.natureOfLoss);
            obj["Estimated Loss"] = n.intimatedLoss ? n.intimatedLoss : "";
            if (n.owner) {
              obj["Owner"] = n.owner.name;
            }
            obj["Shared with"] = n.shareWith[0] ? getSelectedData("shareWith", n.shareWith[0].persons) : "";
            if (n.survey) {
              var survey = getCompletedSurvey(n.survey);
            } else {
              var survey = "";
            }

            var surveyDates = [];
            var surveyDate = [];
            _.each(survey, function (value) {
              if (value != null) {
                if (value.surveyDate) {
                  surveyDates.push(makeExcelDate(value.surveyDate));
                  surveyDate.push(value.surveyDate);
                }
              }
            });
            var surveyScheduledDate = surveyDate.length > 0 ? _.min(surveyDate) : "";
            obj["Survey Date"] = surveyScheduledDate ? makeExcelDate(surveyScheduledDate) : "";
            obj["Status"] = n.timelineStatus;
            var invoice = getApprovedData(n.invoice);
            obj["Reported Date"] = "";
            if (invoice != "" || invoice != undefined) {
              obj["Reported Date"] = invoice.approvalTime ? makeExcelDate(invoice.approvalTime) : "";
            }
            excelData.push(obj);
            callback();
            key++;
          }, function (err, data) {
            if (err) {
              callback(err, data);
            } else {
              Config.generateExcel("Assignment", excelData, res);
            }
          });
        }
      }
    });
  },

  generateStatusReport: function (data, callback, res, user) {
    var filter = this.filterOfGetAssignmentAggregate(data, true);
    if (data.ownerStatus === 'Global') {
      var typeOfAssignment = [];
    } else {
      var typeOfAssignment = this.typeOfGetAssignmentAggregate(data, user, true);
    }
    var sortObj = this.sortOfGetAssignmentAggregate(data, true);

    function makeExcelDate(date) {
      // var currentDate = moment(date).add(2, "days").add(5, "hours").add(30, "minutes"); // Added Because Date In Excel Was Less By 2 Days
      // var excelDate = moment("01/01/1900", "MM/DD/YYYY");
      // var newDate = moment(currentDate.diff(excelDate, "days"));
      if (date === null) {
        return "";
      } else {
        return moment(date).add(5, "hours").add(30, "minutes").format("DD/MM/YYYY");
      }

    }

    function makeInvoiceDates(shareWithArr) {
      var shareWith = "";
      for (var i = 0; i < shareWithArr.length; i++) {
        if (i == 0) {
          shareWith = shareWithArr[i]
        } else {
          shareWith = shareWithArr[i] + ", " + shareWith;
        }
      }
      return shareWith;
    }

    function dateDiffernce(date1, date2) {
      if (date1 == null || date2 == null || date1 == "" || date2 == "") {
        return "";
      } else {
        var a = moment(date1);
        var b = moment(date2);
        //To include start  a.diff(b, 'days')+1
        return a.diff(b, 'days')
      }
    }

    function getTimelineRemarks(arrData) {
      if (arrData.length > 0) {
        // var uniqData = _.uniqBy(arrData,'date');
        var ascData = _.orderBy(arrData, ['time'], ['desc']);
        var dataArr = "";
        for (var i = 0; i < ascData.length; i++) {
          if (i == 0) {
            if (ascData[i].title != undefined) {
              dataArr = moment(ascData[i].time).format('MMMM Do YYYY, h:mm:ss a') + " - " + ascData[i].title + "\n";
            }
          } else {
            if (ascData[i].title != undefined) {
              dataArr = moment(ascData[i].time).format('MMMM Do YYYY, h:mm:ss a') + " - " + ascData[i].title + ", \n" + dataArr;
            }
          }
        }
        return dataArr;
      } else {
        return "";
      }
    }

    function getTimelineLastAccessDate(arrData) {
      if (arrData.length > 0) {
        var lastAccessDate = "";
        var length = arrData.length;
        length--;
        lastAccessDate = makeExcelDate(arrData[length].time);
        return lastAccessDate;
      } else {
        return "";
      }
    }

    function getPolicy(arr) {
      if (arr.length > 0) {
        var mainArr = "";
        for (var i = 0; i < arr.length; i++) {
          if (arr[i].name != undefined) {
            if (i == 0) {
              mainArr = arr[i].name + " & " + arr[i].number;
            } else {
              mainArr = arr[i].name + " & " + arr[i].number + ", " + mainArr;
            }
          }
        }
        return mainArr;
      } else {
        return "";
      }
    }

    function getSurveyTAT(surveyScheduledDate, survey) {
      if (survey.length > 0) {
        var surveyDate = "";
        _.each(survey, function (n) {
          if (n != null) {
            if (n.surveyDate) {
              surveyDate = n.surveyDate;
            }
          }
        });
        return dateDiffernce(surveyDate, surveyScheduledDate);
      } else {
        return "";
      }
    }

    function getApprovedData(arrData) {
      if (arrData.length > 0) {
        var data = "";
        _.each(arrData, function (n) {
          if (n != null) {
            if (n.approvalStatus == "Approved") {
              data = n;
            }
          }
        });
        return data;
      } else {
        return "";
      }
    }

    function getILAReserveAmount(arrData) {
      var data = 0;
      _.each(arrData, function (n) {
        if (n.name === "LIABILITY") {
          _.each(n.items, function (items) {
            if (items.name == "Reserve Amount") {
              data = parseInt(items.field);
            }
          });
        }
        if (n.name === "ICICI CARGO ILA") {
          _.each(n.items, function (items) {
            if (items.name == "Liability exists - If Yes, recommend Reserve after deducting Policy excess, if any") {
              data = parseInt(items.field);
            }
          });
        }
      });
      return data;
    }

    function getLorData(arrData, status) {
      var data = [];
      _.each(arrData, function (n) {
        _.each(n.items, function (items) {
          if (items.isCheck === true && items.submit === status) {
            data.push(items.name);
          }
        });
      });
      return data.toString();

    }

    function getAssmntConsentDate(arrData, status) {
      var data = "";
      _.each(arrData, function (n) {
        if (n.createdAt) {
          data = makeExcelDate(n.createdAt);
        }
      });
      return data;
    }

    function getCompletedSurvey(arrData) {
      if (arrData.length > 0) {
        var data = [];
        _.each(arrData, function (n) {
          if (n != null) {
            if (n.status == "Completed") {
              data.push(n);
            }
          }
        });
        return data;
      } else {
        return "";
      }
    }

    function getSelectedData(match, arrData) {
      var dataArr = [];

      function makeSort(name) {
        _.each(arrData, function (n) {
          dataArr.push(n[name]);
        });
      }

      function getProducts() {
        if (arrData.length > 0) {
          for (var i = 0; i < arrData.length; i++) {
            if (i == 0) {
              dataArr = "Category: " + arrData[i].product.category.name + " - Industry: " + arrData[i].product.category.industry.name;
            } else {
              dataArr = "Category: " + arrData[i].product.category.name + " - Industry: " + arrData[i].product.category.industry.name + ", " + dataArr;
            }
          }
        } else {
          dataArr = "";
        }
      }

      function getNameAndDate(name, date) {
        if (arrData.length > 0) {
          for (var i = 0; i < arrData.length; i++) {
            if (arrData[i][name] != undefined) {
              if (i == 0) {
                dataArr = arrData[i][name] + " & " + makeExcelDate(arrData[i][date]);
              } else {
                dataArr = arrData[i][name] + " & " + makeExcelDate(arrData[i][date]) + ", " + dataArr;
              }
            }
          }
        } else {
          dataArr = "";
        }
      }

      if (_.isEmpty(match)) {
        return "";
      } else {
        switch (match) {
          case "shareWith":
            makeSort("name");
            break;
          case "natureOfLoss":
            makeSort("name");
            break;
          case "products":
            getProducts();
            break;
          case "productsItem":
            makeSort("item");
            break;
          case "LRs":
            getNameAndDate("lrNumber", "lrNumberDate");
            break;
          case "invoices":
            getNameAndDate("invoiceNumber", "invoiceNumberDate");
            break;
          case "product":
            makeSort("product");
            break;
          case "locationArr":
            makeSort("locationString");
            break;
          case "vehicleNumber":
            makeSort("vehicleNumber");
            break;
          default:
            dataArr = "";
            break;
        }
      }

      return dataArr.toString();
    }

    var findData = filter != null || typeOfAssignment != null ? Object.assign(filter, typeOfAssignment) : {};
    Assignment.find(findData).deepPopulate("city.district.state.zone.country products.product.category.industry department shareWith.persons policyType natureOfLoss invoice invoice.createdBy insured insuredOffice owner owner.func company company.city insurerOffice company.city.district.state assessment.employee consent.employee docs.employee fsrs.employee photos.employee causeOfLoss insurer assignedTo office branch survey.employee survey.employee.city company.bank owner.employee survey.employee.city.district survey.employee.city.district.state survey.employee.city.district.state.zone survey.employee.city.district.state.zone.country customer brokerOffice policyDepartment timeline").lean().exec(function (err, data1) {
      if (err) {
        callback(null, data1);
      } else {
        if (_.isEmpty(data1)) {
          callback("No Data Found.", null);
        } else {
          var excelData = [];
          var key = 1;
          async.each(data1, function (n, callback) {
            var policy = "";
            var policyStatus = "";
            var policyFrom = "";
            var policyTo = "";
            if (n.policyDoc != null) {
              PolicyDoc.getPolicyDocData({
                policyDoc: n.policyDoc
              }, function (err, policyData) {
                if (err || policyData == undefined) {
                  policyStatus = "No";
                  getAllData();
                } else {
                  policyStatus = "Yes";
                  policy = policyData.name + " & " + policyData.policyNo;
                  policyFrom = makeExcelDate(policyData.from);
                  policyTo = makeExcelDate(policyData.to);
                  getAllData();
                }
              });
            } else {
              policyStatus = "No";
              getAllData();
            }

            function getAllData() {
              var obj = {};
              obj["Sr #"] = key;
              obj["Assignment #"] = n.name;
              obj["Date of Loss"] = makeExcelDate(n.dateOfLoss);
              obj["Intimation Date"] = makeExcelDate(n.dateOfIntimation);
              obj["Delay in Intimation"] = dateDiffernce(n.dateOfIntimation, n.dateOfLoss);
              obj["Assignment Date"] = makeExcelDate(n.dateOfAppointment);
              obj["Insured Details"] = "";
              obj["Insurer Details"] = "";
              if (n.insuredOffice) {
                obj["Insured Details"] = n.insuredOffice.name != null ? n.insuredOffice.name + " & " + n.insuredOffice.address : "";
              }
              if (n.insurerOffice) {
                obj["Insurer Details"] = n.insurerOffice.name != null ? n.insurerOffice.name + " & " + n.insurerOffice.address : "";
              }
              obj["City, District, State"] = "";
              obj["Zone Name"] = "";
              if (n.city) {
                if (n.city.district) {
                  if (n.city.district.state) {
                    obj["City, District, State"] = n.city.name != null ? n.city.name + ", " + n.city.district.name + ", " + n.city.district.state.name : "";
                    if (n.city.district.state.zone) {
                      obj["Zone Name"] = n.city.district.state.zone != null ? n.city.district.state.zone.name : "";
                    }
                  }
                }
              }
              obj["Department"] = "";
              if (n.policyDepartment) {
                obj["Department"] = n.policyDepartment.name != null ? n.policyDepartment.name : "";
              }
              obj["Nature of Loss"] = "";
              obj["Nature of Loss"] = getSelectedData("natureOfLoss", n.natureOfLoss);
              obj["Cause of Loss"] = "";
              if (n.causeOfLoss) {
                obj["Cause of Loss"] = n.causeOfLoss.name;
              }
              obj["Product"] = getSelectedData("products", n.products);
              obj["Item Description"] = getSelectedData("productsItem", n.products);
              obj["Intimated Loss"] = n.intimatedLoss != null ? n.intimatedLoss : "";
              var insured = n.insuredClaimId ? n.insuredClaimId : "NA";
              var insurer = n.insurerClaimId ? n.insurerClaimId : "NA";
              var broker = n.brokerClaimId ? n.brokerClaimId : "NA";
              obj["Claim #"] = "Insured: " + insured + " / Insurer: " + insurer + " / Broker: " + broker;
              obj["Invoice # & Date"] = getSelectedData("invoices", n.invoices);
              obj["Lr # & Date"] = getSelectedData("LRs", n.LRs);
              obj["Vehicle #"] = getSelectedData("vehicleNumber", n.vehicleNumber);
              obj["Product Id"] = getSelectedData("product", n.product);
              obj["Location Id"] = getSelectedData("locationArr", n.locationArr);
              obj["Policy Received"] = policyStatus;
              obj["Policy #"] = policy != "" ? policy : "";
              obj["Policy Start Date"] = policyFrom != "" ? policyFrom : "";
              obj["Policy End Date"] = policyTo != "" ? policyTo : "";
              if (n.survey) {
                var survey = getCompletedSurvey(n.survey);
              } else {
                var survey = "";
              }

              var surveyDates = [];
              var surveyDate = [];
              _.each(survey, function (value) {
                if (value != null) {
                  if (value.surveyDate) {
                    surveyDates.push(makeExcelDate(value.surveyDate));
                    surveyDate.push(value.surveyDate);
                  }
                }
              });
              var surveyScheduledDate = surveyDate.length > 0 ? _.min(surveyDate) : "";
              obj["Survey Scheduled Date"] = surveyScheduledDate ? makeExcelDate(surveyScheduledDate) : "";
              obj["Survey Date"] = surveyDates.length > 0 ? surveyDates.toString() : "";
              obj["Survey TAT"] = getSurveyTAT(surveyScheduledDate, survey);
              if (surveyDates.length > 0) {
                var lastSurveyDate = _.max(surveyDate);
              } else {
                var lastSurveyDate = "";
              }
              var ila = getApprovedData(n.templateIla);
              obj["ILA Date"] = "";
              obj["ILA TAT"] = "";
              obj["ILA Reserve Amount"] = "";
              if (ila != "" || ila != undefined) {
                obj["ILA Date"] = ila.authTimestamp ? makeExcelDate(ila.authTimestamp) : "";
                obj["ILA TAT"] = dateDiffernce(ila.authTimestamp, lastSurveyDate);
                obj["ILA Reserve Amount"] = getILAReserveAmount(ila.forms);
              }
              var lor = getApprovedData(n.templateLor);
              obj["LOR Date"] = "";
              obj["LOR TAT"] = "";
              obj["Dox Received"] = "";
              obj["Dox Pending"] = "";
              if (lor != "" || lor != undefined) {
                obj["LOR Date"] = lor.authTimestamp ? makeExcelDate(lor.authTimestamp) : "";
                obj["LOR TAT"] = dateDiffernce(lor.authTimestamp, lastSurveyDate);
                obj["Dox Received"] = getLorData(lor.forms, "Received");
                obj["Dox Pending"] = getLorData(lor.forms, "Pending");
              }
              obj["Assessment Shared Date"] = getAssmntConsentDate(n.assessment);
              obj["Consent Received Date"] = getAssmntConsentDate(n.consent);
              var invoice = getApprovedData(n.invoice);
              obj["Report Date"] = "";
              obj["Report TAT"] = "";
              obj["Gross Assessed Loss"] = "";
              obj["Depriciation"] = "";
              obj["Salvage"] = "";
              obj["Under Insurance"] = "";
              obj["Excess / Franchise"] = "";
              obj["Net Payable"] = "";
              obj["Survey Fee Amount"] = "";
              obj["Aging"] = "";
              if (invoice != "" || invoice != undefined) {
                obj["Report Date"] = invoice.approvalTime ? makeExcelDate(invoice.approvalTime) : "";
                obj["Report TAT"] = dateDiffernce(invoice.approvalTime, n.dateOfIntimation);
                obj["Gross Assessed Loss"] = invoice.grossAssessedLoss ? invoice.grossAssessedLoss : "";
                obj["Depriciation"] = invoice.grossDepreciation ? invoice.grossDepreciation : "";
                obj["Salvage"] = invoice.grossSalvage ? invoice.grossSalvage : "";
                obj["Under Insurance"] = invoice.grossUnderInsurance ? invoice.grossUnderInsurance : "";
                obj["Excess / Franchise"] = invoice.excessFranchise ? invoice.excessFranchise : "";
                obj["Net Payable"] = invoice.netPayable ? invoice.netPayable : "";
                obj["Survey Fee Amount"] = invoice.grandTotal ? invoice.grandTotal : "";
                obj["Aging"] = invoice.approvalTime ? dateDiffernce(invoice.approvalTime, n.dateOfIntimation) : dateDiffernce(new Date(), n.dateOfIntimation);
              } else {
                obj["Aging"] = dateDiffernce(new Date(), n.dateOfIntimation);
              }
              obj["Assignment Status"] = n.timelineStatus;
              obj["Owner Name"] = n.owner.name;
              obj["Shared with Details"] = n.shareWith[0] ? getSelectedData("shareWith", n.shareWith[0].persons) : "";
              obj["Branch Name"] = "";
              if (n.branch) {
                obj["Branch Name"] = n.branch.name ? n.branch.name : "";
              }
              var siteNumber = n.siteNumber ? n.siteNumber : "";
              var siteMobile = n.siteMobile ? n.siteMobile : "";
              obj["Site Name & Contact Number"] = siteNumber != "" ? siteNumber + " & " + siteMobile : "";
              obj["Surveyor Name & Contact Number"] = "";
              obj["Appointed By"] = "";
              obj["Broker Name"] = "";
              if (n.customer) {
                obj["Appointed By"] = n.customer.name ? n.customer.name : "";
              }
              if (n.broker) {
                obj["Broker Name"] = n.broker.name ? n.broker.name : "";
              }
              obj["Remarks"] = "";
              obj["Last Access Date"] = "";
              if (n.timeline[0]) {
                obj["Remarks"] = getTimelineRemarks(n.timeline[0].chat);
                obj["Last Access Date"] = getTimelineLastAccessDate(n.timeline[0].chat);
              }
              obj["Courier Send To"] = "";
              obj["Courier Send On"] = "";
              excelData.push(obj);
              callback();
              key++;
            }
          }, function (err, data) {
            if (err) {
              callback(err, data);
            } else {
              Config.generateExcel("Assignment", excelData, res);
            }
          });
        }
      }
    });
  },

  assignmentFilter: function (data, callback) {
    var Model = this;
    var Const = this(data);
    var maxRow = Config.maxRow;
    var pagestartfrom = (data.page - 1) * maxRow;
    var page = 1;
    var aggText = [];
    var arr = [];
    if (data.name !== "") {
      var name = {
        "name": {
          $regex: data.name,
          $options: 'i'
        }
      }
      arr.push(name);
    }
    if (data.intimatedLoss !== "") {
      var intimatedLoss = {
        "intimatedLoss": {
          $regex: data.intimatedLoss,
          $options: 'i'
        }
      }
      arr.push(intimatedLoss);
    }
    if (data.city !== "") {
      var name = {
        "city.name": {
          $regex: data.city,
          $options: 'i'
        }
      }
      arr.push(name);
    }
    if (data.city !== "") {
      var city = {
        "city.name": {
          $regex: data.city,
          $options: 'i'
        }
      };
      arr.push(city);
    }
    if (data.insurer !== "") {
      var insurer = {
        "insurer.name": {
          $regex: data.insurer,
          $options: 'i'
        }
      };
      arr.push(insurer);
    }
    if (data.insured !== "") {
      var insured = {
        "insured.name": {
          $regex: data.insured,
          $options: 'i'
        }
      };
      arr.push(insured);
    }
    if (data.owner !== "") {
      var owner = {
        "owner.name": {
          $regex: data.owner,
          $options: 'i'
        }
      };
      arr.push(owner);
    }
    if (data.department !== "") {
      var department = {
        "department.name": {
          $regex: data.department,
          $options: 'i'
        }
      };
      arr.push(department);
    }
    if (data.timelineStatus !== "") {
      var timelineStatus = {
        "timelineStatus": {
          $regex: data.timelineStatus,
          $options: 'i'
        }
      };
      arr.push(timelineStatus);
    }

    aggText = [{
      $lookup: {
        from: "cities",
        localField: "city",
        foreignField: "_id",
        as: "city"
      }
    }, {
      $unwind: "$city"
    }, {
      $lookup: {
        from: "customers",
        localField: "insurerOffice",
        foreignField: "_id",
        as: "insurer"
      }
    }, {
      $unwind: "$insurer"
    }, {
      $lookup: {
        from: "customers",
        localField: "insuredOffice",
        foreignField: "_id",
        as: "insured"
      }
    }, {
      $unwind: "$insured"
    }, {
      $lookup: {
        from: "employees",
        localField: "owner",
        foreignField: "_id",
        as: "owner"
      }
    }, {
      $unwind: "$owner"
    }, {
      $lookup: {
        from: "departments",
        localField: "department",
        foreignField: "_id",
        as: "department"
      }
    }, {
      $unwind: "$department"
    }, {
      $match: {
        $and: arr
      }
    }, {
      $project: {
        name: 1,
        timelineStatus: 1,
        intimatedLoss: 1,
        city: "$city.name",
        insurer: "$insurer.name",
        insured: "$insured.name",
        owner: "$owner.name",
        department: "$department.name"
      }
    }, {
      $skip: parseInt(pagestartfrom)
    }, {
      $limit: maxRow
    }];
    Assignment.aggregate(aggText).exec(function (err, found) {

      if (err) {
        callback(err, null);
      } else {
        callback(null, found);
      }
    });
  },

  getExpenditure: function (data, callback) {
    Assignment.aggregate([{
        $unwind: "$templateInvoice"
      }, {
        $unwind: "$templateInvoice.forms"
      }, {
        $lookup: {
          from: "invoiceexpenditures",
          localField: "templateInvoice.forms.invoiceExpenditure",
          foreignField: "_id",
          as: "templateInvoice.forms.InvoiceExpenditure"
        }
      }, {
        $unwind: "$templateInvoice.forms.InvoiceExpenditure"
      }, {
        $match: {
          'templateInvoice._id': objectid(data._id)
        }
      }, {
        $group: {
          _id: "$_id",
          forms: {
            $addToSet: "$templateInvoice.forms"
          },
          tax: {
            $addToSet: "$templateInvoice.tax"
          },
          templateId: {
            $addToSet: "$templateInvoice._id"
          },
          name: {
            $addToSet: "$templateInvoice.name"
          }
        }
      }, {
        $unwind: "$templateId"
      }, {
        $unwind: "$name"
      }
      // , {
      //   $project: {
      //     name: 1,
      //     surveyDate: 1,
      //     address: 1,
      //     InvoiceExpenditure: "$templateInvoice.forms.InvoiceExpenditure.name"
      //     }
      // }
    ], function (err, data1) {
      if (err) {
        callback(err, null);
      } else if (data1 && data1.length > 0) {
        callback(null, data1);
      } else {
        callback(null, []);
      }
    });
  },

  updateOfficeId: function (data, callback) {
    Assignment.find({}, {
      branch: 1
    }).populate("branch", "office").lean().exec(function (err, findData) {
      if (err) {
        callback(err, null);
      } else {
        if (_.isEmpty(findData)) {
          callback("No Data found", null);
        } else {
          async.eachSeries(findData, function (n, callback1) {
            Assignment.update({
              _id: n._id
            }, {
              office: n.branch.office
            }, function (err, data3) {
              if (err) {
                callback1(err, null);
              } else {
                callback1(null, data3);
              }
            });

          }, function (err, data2) {
            if (err) {
              callback(err, data2);
            } else {
              callback(null, data2);
            }
          });
        }
      }
    });
  },

  getSurveyorApprovalList: function (data, callback, user) {
    var Model = this;
    var maxRow = Config.maxRow;
    var pagestartfrom = (data.page - 1) * maxRow;
    var page = 1;
    var type = data.type;
    var unwind1 = {};
    var match1 = {};
    var sort1 = {};
    if (_.isEmpty(user)) {
      var allUsersUnder = _.map(data.ownerId, function (n) {
        return objectid(n);
      });
    } else {
      var allUsersUnder = _.map(_.concat(user.children, data.ownerId), function (n) {
        return objectid(n);
      });
    }
    var sbcFlag = data.isSBC;
    var matchIds = [{
      'shareWith.persons': {
        $in: allUsersUnder
      }
    }, {
      'owner': {
        $in: allUsersUnder
      }
    }];
    if (_.isEmpty(data.name)) {
      if (sbcFlag === true) {
        var name = {
          $match: {
            "survey.status": "Approval Pending"
          }
        }
      } else {
        var name = {
          $match: {
            $or: matchIds,
            "survey.status": "Approval Pending"
          }
        }
      }

    } else {
      if (sbcFlag === true) {
        var name = {
          $match: {
            "survey.status": "Approval Pending",
            "name": {
              $regex: data.name,
              $options: 'i'
            }
          }
        }
      } else {
        var name = {
          $match: {
            $or: matchIds,
            "survey.status": "Approval Pending",
            "name": {
              $regex: data.name,
              $options: 'i'
            }
          }
        }
      }
    }

    var aggText = [{
      $unwind: {
        path: "$survey"
      }
    }, name, {
      $lookup: {
        from: "cities",
        localField: "city",
        foreignField: "_id",
        as: "city"
      }
    }, {
      $unwind: {
        path: "$city",
        preserveNullAndEmptyArrays: true
      }
    }, {
      $lookup: {
        from: "employees",
        localField: "survey.sentFrom",
        foreignField: "_id",
        as: "survey.sentFrom"
      }
    }, {
      $unwind: {
        path: "$survey.sentFrom",
        preserveNullAndEmptyArrays: true
      }
    }, {
      $lookup: {
        from: "employees",
        localField: "survey.employee",
        foreignField: "_id",
        as: "survey.employee"
      }
    }, {
      $unwind: {
        path: "$survey.employee"
      }
    }, {
      $lookup: {
        from: "employees",
        localField: "owner",
        foreignField: "_id",
        as: "owner"
      }
    }, {
      $unwind: {
        path: "$owner"
      }
    }, {
      $project: {
        name: "$name",
        owner: "$owner.name",
        surveyDate: "$surveyDate",
        "survey.sentFrom": "$survey.sentFrom.name",
        "survey.timestamp": "$survey.timestamp",
        surveyDate: "$surveyDate",
        city: "$city.name",
        "survey.employee._id": "$survey.employee._id",
        "survey.employee.name": "$survey.employee.name",
        "survey._id": "$survey._id",
        getAllTaskStatus: "$getAllTaskStatus"
      }
    }, {
      $sort: {
        "survey.timestamp": 1
      }
    }];
    var pagination = [{
      $skip: parseInt(pagestartfrom)
    }, {
      $limit: maxRow
    }]
    var aggTextCount = [{
      $group: {
        _id: null,
        count: {
          $sum: 1
        }
      }
    }, {
      $project: {
        "_id": 1,
        "count": 1
      }
    }]
    async.parallel([
        function (callback) {
          Model.aggregate(_.compact(_.concat(aggText, pagination)),
            function (err, data1) {
              if (err) {
                callback(err, null);
              } else {
                callback(null, data1)
              }
            });
        },
        function (callback) {
          Model.aggregate(_.compact(_.concat(aggText, aggTextCount)),
            function (err, data2) {
              if (err) {
                callback(err, null);
              } else {
                callback(null, data2)
              }

            });
        }
      ],
      function (err, data4) {
        if (err) {
          callback(err, null);
        } else {
          if (_.isEmpty(data4[1])) {
            var data5 = {
              results: data4[0],
              options: {
                count: 0
              }
            };
          } else {
            var data5 = {
              results: data4[0],
              options: {
                count: maxRow
              }
            };
            data5.total = data4[1][0].count;
          }
          callback(null, data5);
        }
      });
  },
  getApprovalListLor: function (data, callback) {
    var employee = {
      _id: data.employee
    };
    var childArr = [];
    var pagestartfrom = (data.page - 1) * Config.maxRow;
    Employee.getChildEmployee(employee, function (err, childArray) {
      if (err) {
        callback(err, null);
      } else {
        childArray.push(data.employee);
        _.each(childArray, function (n) {
          childArr.push(objectid(n));
        })

        async.parallel([
            function (callback) {
              Assignment.find({
                "$or": [{
                  'shareWith.persons': {
                    $in: childArr
                  }
                }, {
                  "owner": {
                    $in: childArr
                  }
                }],
                "name": {
                  $regex: data.keyword,
                  $options: 'i'
                },
                templateLor: {
                  $elemMatch: {
                    approvalStatus: "Pending"
                  }
                }
              }, {
                name: 1,
                owner: 1,
                "templateLor.$": 1
              }).sort({
                "templateLor.reqtimestamp": 1
              }).lean().deepPopulate("owner templateLor.sentTo templateLor.sentBy", "owner templateLor.sentTo templateLor.sentBy").skip(pagestartfrom).limit(10).exec(function (err, data) {
                if (err) {
                  callback(err, null);
                } else {
                  var arr = [];
                  async.eachSeries(data, function (n, callback) {
                    var templateLor = n.templateLor[0];
                    delete n.templateLor;
                    delete templateLor.forms;
                    n.templateLor = templateLor;
                    arr.push(n);
                    callback();
                  }, function (err) {
                    if (err) {
                      callback(err)
                    } else {
                      callback(null, arr)
                    }
                  })

                }
              })
            },
            function (callback) {
              Assignment.find({
                "$or": [{
                  'shareWith.persons': {
                    $in: childArr
                  }
                }, {
                  "owner": {
                    $in: childArr
                  }
                }],
                "name": {
                  $regex: data.keyword,
                  $options: 'i'
                },
                templateLor: {
                  $elemMatch: {
                    approvalStatus: "Pending"
                  }
                }
              }, {
                name: 1,
              }).exec(function (err, data) {
                if (err) {
                  callback(err, null);
                } else {
                  var count = {
                    count: data.length
                  }
                  callback(null, count)
                }
              })
            }
          ],
          function (err, data4) {
            if (err) {
              callback(err, null);
            } else {
              if (_.isEmpty(data4[1])) {
                var data5 = {
                  results: data4[0],
                  options: {
                    count: 0
                  }
                };
              } else {
                var data5 = {
                  results: data4[0],
                  options: {
                    count: Config.maxRow
                  }
                };
                data5.total = data4[1].count;
              }
              callback(null, data5);
            }
          });
      }
    });
  },
  getApprovalListIla: function (data, callback) {
    var employee = {
      _id: data.employee
    };
    var childArr = [];
    var pagestartfrom = (data.page - 1) * Config.maxRow;
    Employee.getChildEmployee(employee, function (err, childArray) {
      if (err) {
        callback(err, null);
      } else {
        childArray.push(data.employee);
        _.each(childArray, function (n) {
          childArr.push(objectid(n));
        })

        async.parallel([
            function (callback) {
              Assignment.find({
                "$or": [{
                  'shareWith.persons': {
                    $in: childArr
                  }
                }, {
                  "owner": {
                    $in: childArr
                  }
                }],
                "name": {
                  $regex: data.keyword,
                  $options: 'i'
                },
                templateIla: {
                  $elemMatch: {
                    approvalStatus: "Pending"
                  }
                }
              }, {
                name: 1,
                owner: 1,
                intimatedLoss: 1,
                "templateIla.$": 1
              }).sort({
                "templateIla.reqtimestamp": 1
              }).lean().deepPopulate("owner templateIla.sentTo templateIla.sentBy", "owner templateIla.sentTo templateIla.sentBy").skip(pagestartfrom).limit(10).exec(function (err, data) {
                if (err) {
                  callback(err, null);
                } else {
                  var arr = [];
                  async.eachSeries(data, function (n, callback) {
                    var templateIla = n.templateIla[0];
                    delete n.templateIla;
                    delete templateIla.forms;
                    n.templateIla = templateIla;
                    arr.push(n);
                    callback();
                  }, function (err) {
                    if (err) {
                      callback(err)
                    } else {
                      callback(null, arr)
                    }
                  })

                }
              })
            },
            function (callback) {
              Assignment.find({
                "$or": [{
                  'shareWith.persons': {
                    $in: childArr
                  }
                }, {
                  "owner": {
                    $in: childArr
                  }
                }],
                "name": {
                  $regex: data.keyword,
                  $options: 'i'
                },
                templateIla: {
                  $elemMatch: {
                    approvalStatus: "Pending"
                  }
                }
              }, {
                name: 1,
              }).exec(function (err, data) {
                if (err) {
                  callback(err, null);
                } else {
                  var count = {
                    count: data.length
                  }
                  callback(null, count)
                }
              })
            }
          ],
          function (err, data4) {
            if (err) {
              callback(err, null);
            } else {
              if (_.isEmpty(data4[1])) {
                var data5 = {
                  results: data4[0],
                  options: {
                    count: 0
                  }
                };
              } else {
                var data5 = {
                  results: data4[0],
                  options: {
                    count: Config.maxRow
                  }
                };
                data5.total = data4[1].count;
              }
              callback(null, data5);
            }
          });
      }
    });
  },
  saveTemplate: function (data, callback) {
    var matchObj = {};
    var matchObj2 = {};
    var approvalStatus = {};
    var authTimestamp = {};
    var reqtimestamp = {};
    var file = {};
    var lorCount = {};
    var getAllTaskStatus = {};

    if (data.type == "templateIla") {
      if (!_.isEmpty(data.approvalStatus)) {
        approvalStatus = {
          "templateIla.$.approvalStatus": data.approvalStatus
        };
      }
      if (data.authTimestamp !== null || data.authTimestamp !== undefined) {
        if (!_.isNaN(data.authTimestamp)) {
          authTimestamp = {
            "templateIla.$.authTimestamp": data.authTimestamp
          };
        }
        if (data.getAllTaskStatus) {
          getAllTaskStatus = {
            "getAllTaskStatus.ila": data.getAllTaskStatus.ila,
            "getAllTaskStatus.ilaTime": data.getAllTaskStatus.ilaTime
          }
        }
      }
      if (!_.isEmpty(data.file)) {
        file = {
          "templateIla.$.file": data.file
        };
      }
      if (!_.isEmpty(data.reqtimestamp)) {
        if (!isNaN(data.reqtimestamp)) {
          reqtimestamp = {
            "templateIla.$.reqtimestamp": data.reqtimestamp
          };
        }
      }
    }
    if (data.type == "templateLor") {
      if (!_.isEmpty(data.approvalStatus)) {
        var approvalStatus = {
          "templateLor.$.approvalStatus": data.approvalStatus
        };
      }
      if (data.authTimestamp !== null || data.authTimestamp !== undefined) {
        if (!_.isNaN(data.authTimestamp)) {
          var authTimestamp = {
            "templateLor.$.authTimestamp": data.authTimestamp
          };
        }
        if (data.getAllTaskStatus) {
          if (data.getAllTaskStatus.lor) {
            getAllTaskStatus = {
              "getAllTaskStatus.lor": data.getAllTaskStatus.lor,
              "getAllTaskStatus.lorTime": data.getAllTaskStatus.lorTime
            }
          }
          if (data.getAllTaskStatus.type == "Docs") {
            getAllTaskStatus = {
              "getAllTaskStatus.docs": data.getAllTaskStatus.docs,
              "getAllTaskStatus.docsTime": data.getAllTaskStatus.docsTime
            }
          }
        }
      }
      if (!_.isEmpty(data.file)) {
        var file = {
          "templateLor.$.file": data.file
        };
      }
      if (!_.isEmpty(data.reqtimestamp)) {
        if (!_.isNaN(data.reqtimestamp)) {
          var reqtimestamp = {
            "templateLor.$.reqtimestamp": data.reqtimestamp
          };
        }
      }
    }
    if (!_.isEmpty(data.lorCount)) {
      var lorCount = {
        "templateLor.$.lorCount": data.lorCount
      };
    }

    var set2 = Object.assign(approvalStatus, authTimestamp, file, reqtimestamp, lorCount, getAllTaskStatus);
    if (data.type == "templateIla") {
      matchObj = {
        _id: data.assignId,
        templateIla: {
          $elemMatch: {
            _id: data._id
          }
        }
      };
      matchObj2 = {
        $set: set2
      };

    } else if (data.type == "templateLor") {
      matchObj = {
        _id: data.assignId,
        templateLor: {
          $elemMatch: {
            _id: data._id
          }
        }
      };
      matchObj2 = {
        $set: set2
      };
    } else if (data.type == "survey") {
      matchObj = {
        _id: data.assignId,
        survey: {
          $elemMatch: {
            _id: data._id
          }
        }
      };
      matchObj2 = {
        $set: {
          "getAllTaskStatus.surveyAssigned": data.getAllTaskStatus.surveyAssigned,
          "survey.$.status": "Pending"
        }
      };
    }
    Assignment.update(matchObj, matchObj2).exec(function (err, updated) {
      if (err) {
        callback(err, null);
      } else {
        Assignment.getOne({
          _id: data.assignId
        }, function (err, assignmentData) {
          if (err) {
            callback("No data found in assignment", null);
          } else {
            if (_.isEmpty(assignmentData)) {
              callback("No data found in assignment search", null);
            } else {
              // assignmentData
              if (data.type == "survey") {
                Employee.findOne({
                  _id: data.timeline.employee
                }).lean().exec(function (err, findData) {
                  var notificationMessage = {};
                  notificationMessage.deviceId = [];
                  notificationMessage.message = assignmentData.name + " has been Assigned";
                  notificationMessage.deviceId = findData.deviceIds;
                  Config.sendPushNotification(notificationMessage, function (error, sendPushNotificationResponse) {
                    if (error) {} else {}
                  });
                });
              }

              Assignment.setGlobalAssignmentStatusForMigration(assignmentData, function (err, data5) {
                if (err || _.isEmpty(data5)) {
                  callback(err, null)
                } else {
                  callback(null, data5);
                }
              });
            }
          }
        });
      }
    });
  },

  getMailAndSendMail: function (data, callback) {
    Assignment.getMailData(data, function (err, emailData) {
      if (err) {
        callback(err)
      } else {
        if (_.isEmpty(emailData)) {
          callback("No mail data found", null);
        } else {
          emailData.accessToken = data[2];
          //Get User google accessToken
          Assignment.getUserData({
            email: data[3]
          }, function (err, userdata) {
            if (err) {
              callback(err, null);
            } else {
              if (_.isEmpty(userdata)) {
                callback(err, null);
              } else {
                emailData.user = userdata;

                //Send email
                if (data[4]) {
                  emailData.threadId = data[4];
                }
                Assignment.sendEmails(emailData, function (err, mailData) {
                  if (err) {
                    callback(err, null);
                  } else {
                    callback(null, mailData);
                  }
                });
              }
            }
          });

        }
      }
    });
  },
  // 
  updateNewSurveyor: function (data, callback) {
    Assignment.update({
      _id: data.assignId,
      survey: {
        $elemMatch: {
          _id: data.surveyId
        }
      }
    }, {
      $set: {
        "survey.$.employee": data.employee
      }
    }).exec(function (err, data) {
      if (err) {
        callback(err, null);
      } else {
        callback(null, data);
      }
    });
  },

  removeSurveyor: function (data, callback) {
    Assignment.update({
      _id: data.assignId,
      survey: {
        $elemMatch: {
          _id: data.surveyId
        }
      }
    }, {
      $pull: {
        "survey": {
          _id: data.surveyId
        }
      }
    }).exec(function (err, data) {
      if (err) {
        callback(err, null);
      } else {
        callback(null, data);
      }
    });
  },

  getAssignmentApprovalList: function (data, callback) {
    var Model = this;
    var maxRow = Config.maxRow;
    var pagestartfrom = (data.page - 1) * maxRow;
    var page = 1;
    var aggText = [];
    var aggTextCount = [];
    var arr = ["Pending ForceClosed", "Pending ReOpened", "Pending OnHold", "Request AccessButton"];
    // 111
    var employee = {
      _id: data.employee
    };

    var childArr = [];
    Employee.getChildEmployee(employee, function (err, childArray) {
      if (err) {
        callback(err, null);
      } else {
        childArray.push(data.employee);
        _.each(childArray, function (n) {
          childArr.push(objectid(n));
        })

        aggText = [{
            $match: {
              "$or": [{
                'shareWith.persons': {
                  $in: childArr
                }
              }, {
                "owner": {
                  $in: childArr
                }
              }],
              "name": {
                $regex: data.keyword,
                $options: 'i'
              },
              assignmentapprovalStatus: {
                $in: arr
              }
            }
          }, {
            $lookup: {
              from: "employees",
              localField: "owner",
              foreignField: "_id",
              as: "owner"
            }
          }, {
            $unwind: {
              path: "$owner",
              preserveNullAndEmptyArrays: true
            }
          }, {
            $lookup: {
              from: "employees",
              localField: "sentBy",
              foreignField: "_id",
              as: "sentBy"
            }
          }, {
            $unwind: {
              path: "$sentBy",
              preserveNullAndEmptyArrays: true
            }
          }, {
            $project: {
              "owner.name": "$owner.name",
              "owner._id": "$owner._id",
              "sentBy.name": "$sentBy.name",
              "sentBy._id": "$sentBy._id",
              reason: "$forceClosedComment",
              timelineStatus: "$timelineStatus",
              assignmentapprovalStatus: "$assignmentapprovalStatus",
              forceClosedReqTime: "$forceClosedReqTime",
              reopenReqTime: "$reopenReqTime",
              onholdReqTime: "$onholdReqTime",
              waiverReqTime: "$waiverReqTime",
              name: "$name",
              onholdComment: "$onholdComment",
              reopenComment: "$reopenComment",
              getAllTaskStatus: "$getAllTaskStatus",
              ilaAccessReq: "$ilaAccessReq",
              lorAccessReq: "$lorAccessReq",
              surveyAccessReq: "$surveyAccessReq",
              assessmentAccessReq: "$assessmentAccessReq",
              consentAccessReq: "$consentAccessReq",
              fsrAccessReq: "$fsrAccessReq",
              ilaAccess: "$ilaAccess",
              lorAccess: "$lorAccess",
              surveyAccess: "$surveyAccess",
              assessmentAccess: "$assessmentAccess",
              consentAccess: "$consentAccess",
              fsrAccess: "$fsrAccess"
            }
          }, {
            $skip: parseInt(pagestartfrom)
          }, {
            $limit: maxRow
          }],
          aggTextCount = [{
            $match: {
              "$or": [{
                'shareWith.persons': {
                  $in: childArr
                }
              }, {
                "owner": {
                  $in: childArr
                }
              }],
              "name": {
                $regex: data.keyword,
                $options: 'i'
              },
              assignmentapprovalStatus: {
                $in: arr
              }
            }
          }, {
            $group: {
              _id: null,
              count: {
                $sum: 1
              }
            }
          }, {
            $project: {
              "_id": 1,
              "count": 1
            }
          }]
        async.parallel([
            function (callback) {
              Model.aggregate(aggText,
                function (err, data1) {
                  if (err) {
                    callback(err, null);
                  } else {
                    callback(null, data1)
                  }

                });
            },
            function (callback) {
              Model.aggregate(aggTextCount,
                function (err, data2) {
                  if (err) {
                    callback(err, null);
                  } else {
                    callback(null, data2)
                  }

                });
            }
          ],
          function (err, data4) {
            if (err) {
              callback(err, null);
            } else {
              if (_.isEmpty(data4[1])) {
                var data5 = {
                  results: data4[0],
                  options: {
                    count: 0
                  }
                };
              } else {
                var data5 = {
                  results: data4[0],
                  options: {
                    count: maxRow
                  }
                };
                data5.total = data4[1][0].count;
              }
              callback(null, data5);
            }
          });

      }
    });
    //1111 

  },

  // searchLogistic: function (data, callback) {
  //   var Model = this;
  //   var maxRow = Config.maxRow;
  //   var pagestartfrom = (data.page - 1) * maxRow;
  //   var page = 1;
  //   var aggText = [];
  //   var aggTextCount = [];
  //   var arr = ["BBND", "Dispatched", "DBND", "Delivered"];

  //   aggText = [{
  //       $match: {
  //         timelineStatus: {
  //           $in: arr
  //         },
  //         "name": {
  //           $regex: data.keyword,
  //           $options: 'i'
  //         }
  //       }
  //     }, {
  //       $skip: parseInt(pagestartfrom)
  //     }, {
  //       $limit: maxRow
  //     }],
  //     aggTextCount = [{
  //       $match: {
  //         timelineStatus: {
  //           $in: arr
  //         },
  //         "name": {
  //           $regex: data.keyword,
  //           $options: 'i'
  //         }
  //       }
  //     }, {
  //       $group: {
  //         _id: null,
  //         count: {
  //           $sum: 1
  //         }
  //       }
  //     }, {
  //       $project: {
  //         "_id": 1,
  //         "count": 1
  //       }
  //     }]
  //   async.parallel([
  //       function (callback) {
  //         Model.aggregate(aggText,
  //           function (err, data1) {
  //             if (err) {
  //               callback(err, null);
  //             } else {
  //               callback(null, data1)
  //             }

  //           });
  //       },
  //       function (callback) {
  //         Model.aggregate(aggTextCount,
  //           function (err, data2) {
  //             if (err) {
  //               callback(err, null);
  //             } else {
  //               callback(null, data2)
  //             }

  //           });
  //       }
  //     ],
  //     function (err, data4) {
  //       if (err) {
  //         callback(err, null);
  //       } else {
  //         if (_.isEmpty(data4[1])) {
  //           var data5 = {
  //             results: data4[0],
  //             options: {
  //               count: 0
  //             }
  //           };
  //         } else {
  //           var data5 = {
  //             results: data4[0],
  //             options: {
  //               count: maxRow
  //             }
  //           };
  //           data5.total = data4[1][0].count;
  //         }
  //         callback(null, data5);
  //       }
  //     });
  // },

  searchLogistic: function (data, callback) {
    var logisticStatus = ["BBND", "DBND", "Delivered"];
    var Model = this;
    var Const = this(data);
    var maxRow = Config.maxRow;

    var page = 1;
    if (data.page) {
      page = data.page;
    }
    var field = data.field;
    var options = {
      field: data.field,
      filters: {
        keyword: {
          fields: ['name'],
          term: data.keyword
        }
      },
      sort: {
        asc: 'name'
      },
      start: (page - 1) * maxRow,
      count: maxRow
    };

    if (data.timelineStatus === "All") {
      data.filter = {
        name: {
          $regex: data.text,
          $options: "i"
        },
        timelineStatus: {
          $in: logisticStatus
        }
      }
    } else {
      data.filter = {
        name: {
          $regex: data.text,
          $options: "i"
        },
        timelineStatus: data.timelineStatus
      }
    }

    var Search = Model.find(data.filter)
      .order(options)
      // .deepPopulate(deepSearch)
      .keyword(options)
      .page(options, function (err, findData) {
        if (err || _.isEmpty(findData)) {
          callback(err, findData);
        } else {
          callback(null, findData);
        }
      });

  },




  updateThreadId: function (data, callback) {
    Assignment.update({
      _id: data._id,
    }, {
      threadId: data.threadId
    }).exec(function (err, data) {
      if (err) {
        callback(err, null);
      } else {
        callback(null, data);
      }
    });
  },

  getMailData: function (data, callback) {
    var mailData = data[1];
    emailData = {};
    var i = 0;
    var toData = [];
    mailData.to = _.cloneDeep(mailData.to);
    _.map(mailData.to, function (values) {
      if (values.email == undefined) {
        values.email = "";
      }
      values.email.toString();
      values.name.toString();
    });
    emailData.to = _.uniqBy(mailData.to, "email");
    emailData.sbcTo = (mailData.sbcTo ? mailData.sbcTo : []);
    emailData.assignmentNo = (mailData.assignmentNo ? mailData.assignmentNo : "NA");
    emailData.assignmentAuthorizer = (mailData.assignmentAuthorizer ? mailData.assignmentAuthorizer : "NA");
    emailData.ownerName = (mailData.ownerName ? mailData.ownerName : "NA");
    emailData.ownerEmail = (mailData.ownerEmail ? mailData.ownerEmail : "NA");
    emailData.ownerPhone = (mailData.ownerPhone ? mailData.ownerPhone : "NA");
    emailData.siteCity = (mailData.siteCity ? mailData.siteCity : "NA");
    emailData.invoiceNumber = (mailData.invoiceNumber ? mailData.invoiceNumber : "NA");
    emailData.to = (mailData.to ? mailData.to : []);
    emailData.cc = (mailData.cc ? mailData.cc : []);
    emailData.bcc = (mailData.bcc ? mailData.bcc : []);
    emailData.surveyorNumber = (mailData.surveyorNumber ? mailData.surveyorNumber : "NA");
    emailData.surveyorName = (mailData.surveyorName ? mailData.surveyorName : "NA");
    emailData.surveyorEmail = (mailData.surveyorEmail ? mailData.surveyorEmail : "NA");
    emailData.insuredName = (mailData.insuredName ? mailData.insuredName : "NA");
    emailData.ilaAuthDate = (mailData.ilaAuthDate ? mailData.ilaAuthDate : "NA");
    emailData.surveyorNumber = (mailData.surveyorNumber ? mailData.surveyorNumber : "NA");
    emailData.surveyorName = (mailData.surveyorName ? mailData.surveyorName : "NA");
    emailData.surveyorEmail = (mailData.surveyorEmail ? mailData.surveyorEmail : "NA");
    emailData.surveyDate = (mailData.surveyDate ? mailData.surveyDate : "NA");
    emailData.fullAddress = (mailData.fullAddress ? mailData.fullAddress : "NA");
    emailData.surveyorCity = (mailData.surveyorCity ? mailData.surveyorCity : "NA");
    emailData.productName = (mailData.productName ? mailData.productName : "NA");
    emailData.forceClosedComment = (mailData.forceClosedComment ? mailData.forceClosedComment : "NA");
    emailData.reopenComment = (mailData.reopenComment ? mailData.reopenComment : "NA");
    emailData.onholdComment = (mailData.onholdComment ? mailData.onholdComment : "NA");
    emailData.newOwner = (mailData.newOwner ? mailData.newOwner : "NA");
    emailData.assignmentNames = (mailData.assignmentNames ? mailData.assignmentNames : "NA");
    switch (data[0]) {
      case "Acknowledgment Email":
        {
          var emails = {
            name: 'Acknowledgment Email',
            from: emailData.ownerEmail,
            to: emailData.to,
            cc: emailData.cc,
            bcc: emailData.bcc,
            subject: "Assignment : " + emailData.assignmentNo + " | Site City : " + emailData.siteCity,
            message: "<html><body><p style='font-size: 16px;'>Dear Sir/Madam,</p><p style='font-size: 16px;'>Thank you for retaining us to inspect & assess the subject loss. This is to confirm that " + emailData.surveyorName + " shall be attending this claim. He can be reached on " + emailData.surveyorNumber + ". Our reference number for this claim would be " + emailData.assignmentNo + "</p> <p style='font-size: 16px;'>Should you ever need any support / information / update, please feel at ease to get in touch with me.</p><br>" + "<p style='font-size: 16px;'>Warm Regards, <br>" + emailData.ownerName + "<br> " + emailData.ownerPhone + "<br>" + emailData.ownerEmail + "</p></body></html>"
          }
          callback(null, emails);
        }
        break;
      case "Deputation mail":
        {
          var to = [];
          to.push({
            name: emailData.surveyorName,
            email: emailData.surveyorEmail
          })
          var emails = {
            name: 'Deputation mail',
            from: emailData.ownerEmail,
            to: to,
            cc: emailData.cc,
            bcc: emailData.bcc,
            subject: "Assignment : " + emailData.assignmentNo + " | Site City : " + emailData.siteCity,
            message: "<html><body><p style='font-size: 16px;'>Dear " + emailData.surveyorName + ",</p><p style='font-size: 16px;'>Please refer to our telecom, in respect of the subject claim. You are requested to kindly attend the loss inline with the discussions held and specific requirements of the claim. Our reference number for this claim would be " + emailData.assignmentNo + "</p> <p style='font-size: 16px;'>In order to assist you, we are attaching relevant format of JIR. Please ensure to capture every detail there in & get the same duly signed by the concerned person. In an unlikely event wherein there is a difference of opinion between yourself & the concerned person, both the opinions may be recorded. We would appreciate a brief call from the site while you are attending the loss as this helps us update the insurer's of the developments. Should you ever need any support / information / update please feel at ease to get in touch with me. I will be more than willing to assist.</p><br>" + "<p style='font-size: 16px;'>Warm Regards, <br>" + emailData.ownerName + "<br> " + emailData.ownerPhone + "<br>" + emailData.ownerEmail + "</p></body></html>"
          }
          callback(null, emails);
        }
        break;
      case "On Survey Attended":
        {
          var emails = {
            name: 'On Survey Attended',
            from: emailData.ownerEmail,
            to: emailData.to,
            cc: emailData.cc,
            bcc: emailData.bcc,
            subject: "Assignment : " + emailData.assignmentNo + " | Site City : " + emailData.siteCity,
            message: "<html><body><p style='font-size: 16px;'>We are pleased to inform you that the survey for the said claim has been attended on " + emailData.surveyDate + " No sooner we receive further details, we shall update you in this regard. Meanwhile, request you to kindly bear with us. Should you ever need any support / information / update please feel at ease to get in touch with me. I will be more than willing to assist.</p><br>" + "<p style='font-size: 16px;'>Warm Regards, <br>" + emailData.ownerName + "<br> " + emailData.ownerPhone + "<br>" + emailData.ownerEmail + "</p></body></html>"
          }
          callback(null, emails);
        }
        break;
      case "ILA Authorization":
        {
          var emails = {
            name: 'ILA Authorization',
            from: emailData.ownerEmail,
            to: emailData.to,
            cc: emailData.cc,
            bcc: emailData.bcc,
            subject: "ILA Authorized of Assignment : " + emailData.assignmentNo,
            message: "<html><body><p style='font-size: 16px;'>Dear " + emailData.ownerName + "</p><p style='font-size: 16px;'>I have gone through the ILA prepared for " + emailData.insuredName + ", Assignment No. " + emailData.assignmentNo + " and have  authorized the same. It is OK to release</p><br>" + "<p style='font-size: 16px;'> Warm Regards, <br>" + emailData.assignmentAuthorizer + "</p></body></html>"
          }
          callback(null, emails);
        }
        break;

      case "ILA Back to Regenerate":
        {
          var emails = {
            name: 'ILA Back to Regenerate',
            from: emailData.ownerEmail,
            to: emailData.to,
            cc: emailData.cc,
            bcc: emailData.bcc,
            subject: "ILA Sent back for regeneration of Assignment : " + emailData.assignmentNo,
            message: "<html><body><p style='font-size: 16px;'>Dear " + emailData.ownerName + "</p><p style='font-size: 16px;'>This is to inform you that ILA No. " + emailData.assignmentNo + " has NOT been authorized on " + emailData.ilaAuthDate + ". Please regenrate as per the comments.</p><br>" + "<p style='font-size: 16px;'> Warm Regards, <br>" + emailData.assignmentAuthorizer + "</p></body></html>"
          }
          callback(null, emails);
        }
        break;

      case "ILA Release":
        {
          var emails = {
            name: 'ILA Release',
            from: emailData.ownerEmail,
            to: emailData.to,
            cc: emailData.cc,
            bcc: emailData.bcc,
            subject: "ILA Authorized of Assignment : " + emailData.assignmentNo,
            message: "<html><body><p style='font-size: 16px;'>Dear Sir/Madam,</p><p style='font-size: 16px;'>We are pleased to release the ILA in respect of our Assignment No. " + emailData.assignmentNo + " and your #ClaimNo# and #PolicyNo#.</p><p style='font-size: 16px;'>We hope that the same shall serve your purpose. Should you ever need any support / information / update please feel at ease to get in touch with me. I will be more than willing to assist.</p>" + "<p style='font-size: 16px;'> Warm Regards, <br>" + emailData.ownerName + "<br> " + emailData.ownerPhone + "<br>" + emailData.ownerEmail + "</p></body></html>"
          }
          callback(null, emails);
        }
        break;

      case "ILA Send for Authorization":
        {
          var emails = {
            name: 'ILA Send for Authorization',
            from: emailData.ownerEmail,
            to: emailData.to,
            cc: emailData.cc,
            bcc: emailData.bcc,
            subject: "ILA Send for Authorization Mail of Assignment : " + emailData.assignmentNo,
            message: "<html><body><p style='font-size: 16px;'>Please go through the ILA for Assignment No. " + emailData.assignmentNo + " in respect of loss sustained by " + emailData.insuredName + " on account of damage to " + emailData.productName + " and authorize the same.</p><br>" + "<p style='font-size: 16px;'> Warm Regards, <br>" + emailData.assignmentAuthorizer + "</p></body></html>"
          }
          callback(null, emails);
        }
        break;

      case "Invoice Authorization":
        {
          var emails = {
            name: 'Invoice Authorization',
            from: emailData.ownerEmail,
            to: emailData.to,
            cc: emailData.cc,
            bcc: emailData.bcc,
            subject: "Invoice Authorization : " + emailData.invoiceNumber,
            message: "<html><body><p style='font-size: 16px;'>I have gone through the Invoice prepared for " + emailData.insuredName + ", Invoice No. " + emailData.invoiceNumber + " and authorized the same. It is OK to release.</p><br>" + "<p style='font-size: 16px;'> Warm Regards, <br>" + emailData.ownerName + "<br> " + emailData.ownerPhone + "<br>" + emailData.ownerEmail + "</p></body></html>"
          }
          callback(null, emails);
        }
        break;

      case "Invoice Back to Regenerate":
        {
          var emails = {
            name: 'Invoice Back to Regenerate',
            from: emailData.ownerEmail,
            to: emailData.to,
            cc: emailData.cc,
            bcc: emailData.bcc,
            subject: "Invoice Back to Regenerate : " + emailData.invoiceNumber,
            message: "<html><body><p style='font-size: 16px;'>I have gone through the Invoice prepared for " + emailData.insuredName + ", Invoice No. " + emailData.invoiceNumber + ", Kindly make the changes as advised to you & resend for authorization.</p><p style='font-size: 16px;'>Please let me know if assistance required.</p>" + "<p style='font-size: 16px;'> Warm Regards, <br>" + emailData.ownerName + "<br> " + emailData.ownerPhone + "<br>" + emailData.ownerEmail + "</p></body></html>"
          }
          callback(null, emails);
        }
        break;

      case "Invoice Cancel":
        {
          var emails = {
            name: 'Invoice Cancel',
            from: emailData.ownerEmail,
            to: emailData.to,
            cc: emailData.cc,
            bcc: emailData.bcc,
            subject: "Invoice Cancel : #InvoiceNo#",
            message: "<html><body><p style='font-size: 16px;'>This is to inform all that the Invoice #InvoiceNo# has been canceled.</p><p style='font-size: 16px;'>You may update your record accordingly.</p>" + "<p style='font-size: 16px;'> Warm Regards, <br>" + emailData.ownerName + "<br> " + emailData.ownerPhone + "<br>" + emailData.ownerEmail + "</p></body></html>"
          }
          callback(null, emails);
        }
        break;

      case "Invoice Release":
        {
          var emails = {
            name: 'Invoice Release',
            from: emailData.ownerEmail,
            to: emailData.to,
            cc: emailData.cc,
            bcc: emailData.bcc,
            subject: "",
            message: "<html><body><p style='font-size: 16px;'>Dear Sir/Madam,We are pleased to attach our bill for professional services rendered for your kind perusal & payment. Our bank details are as follows: #BankDetails# You are requested to kindly release our payment & confirm in order to enable us to release the report.</p><br>" + "<p style='font-size: 16px;'> Warm Regards, <br>" + emailData.ownerName + "<br> " + emailData.ownerPhone + "<br>" + emailData.ownerEmail + "</p></body></html>"
          }
          callback(null, emails);
        }
        break;

      case "Invoice Revise":
        {
          var emails = {
            name: 'Invoice Revise',
            from: emailData.ownerEmail,
            to: emailData.to,
            cc: emailData.cc,
            bcc: emailData.bcc,
            subject: "Invoice Revise : #InvoiceNo#",
            message: "<html><body><p style='font-size: 16px;'>Invoice #InvoiceNo# has been revised, you are requested to kindly make a note of the same. Copy of the revised invoice is attached for perusal.</p><br>" + "<p style='font-size: 16px;'> Warm Regards, <br>" + emailData.ownerName + "<br> " + emailData.ownerPhone + "<br>" + emailData.ownerEmail + "</p></body></html>"
          }
          callback(null, emails);
        }
        break;

      case "Invoice Send Authorization":
        {
          var emails = {
            name: 'Invoice Send Authorization',
            from: emailData.ownerEmail,
            to: emailData.to,
            cc: emailData.cc,
            bcc: emailData.bcc,
            subject: "Invoice Send Authorization : " + emailData.invoiceNumber,
            message: "<html><body><p style='font-size: 16px;'>Please go through the Invoice for Assignment No. " + emailData.assignmentNo + " in respect of loss sustained by " + emailData.insuredName + " on account of damage to " + emailData.productName + " and authorize the same</p><br>" + "<p style='font-size: 16px;'> Warm Regards, <br>" + emailData.ownerName + "<br> " + emailData.ownerPhone + "<br>" + emailData.ownerEmail + "</p></body></html>"
          }
          callback(null, emails);
        }
        break;

      case "LOR Authorization":
        {

          var emails = {
            name: 'LOR Authorization',
            from: emailData.ownerEmail,
            to: emailData.to,
            cc: emailData.cc,
            bcc: emailData.bcc,
            subject: "LOR is Authorizaed For Assignment : " + emailData.assignmentNo,
            message: "<html><body><p style='font-size: 16px;'>I have gone through the LOR prepared for " + emailData.insuredName + ", Assignment " + emailData.assignmentNo + " and have authorized the same. It is OK to release.</p><br>" + "<p style='font-size: 16px;'> Warm Regards, <br>" + emailData.assignmentAuthorizer + "</p></body></html>"
          }
          callback(null, emails);
        }
        break;

      case "LOR Back to Regenerate":
        {
          var emails = {
            name: 'LOR Back to Regenerate',
            from: emailData.ownerEmail,
            to: emailData.to,
            cc: emailData.cc,
            bcc: emailData.bcc,
            subject: "LOR Back to Regenerate For Assignment No : " + emailData.assignmentNo,
            message: "<html><body><p style='font-size: 16px;'>I have gone through the LOR prepared for " + emailData.insuredName + ", assignment " + emailData.assignmentNo + " Kindly make the changes as advised to you & resend for authorization. Please let me know if assistance required.</p><br>" + "<p style='font-size: 16px;'> Warm Regards, <br>" + emailData.assignmentAuthorizer + "</p></body></html>"
          }
          callback(null, emails);
        }
        break;

      case "LOR Send Authorization":
        {
          var emails = {
            name: 'LOR Send Authorization',
            from: emailData.ownerEmail,
            to: emailData.to,
            cc: emailData.cc,
            bcc: emailData.bcc,
            subject: "LOR is Send For Authorization For Assignment : " + emailData.assignmentNo,
            message: "<html><body><p style='font-size: 16px;'>Requesting you to go through the LOR prepared for " + emailData.insuredName + ", assignment " + emailData.assignmentNo + " and authorize the same.</p><br>" + "<p style='font-size: 16px;'> Warm Regards, <br>" + emailData.assignmentAuthorizer + "</p></body></html>"
          }
          callback(null, emails);
        }
        break;

      case "Assignment Force Close Request":
        {
          var emails = {
            name: 'Assignment Force Close Request',
            from: emailData.ownerEmail,
            to: emailData.to,
            cc: emailData.cc,
            bcc: emailData.bcc,
            subject: "Assignment Force Close Request for Assignment : " + emailData.assignmentNo,
            message: "<html><body><p style='font-size: 16px;'>Dear " + emailData.ownerName + " ,<br> Requesting you to please Force Close the Assignment. Reason mentioned below. Reason : " + emailData.forceClosedComment + " </p><br>" + "<p style='font-size: 16px;'> Warm Regards, <br>" + emailData.ownerName + "<br> " + emailData.ownerPhone + "<br>" + emailData.ownerEmail + "</p></body></html>"
          }
          callback(null, emails);
        }
        break;

      case "Assignment Force Close Approved":
        {
          var emails = {
            name: 'Assignment Force Close Approved',
            from: emailData.ownerEmail,
            to: emailData.to,
            cc: emailData.cc,
            bcc: emailData.bcc,
            subject: "Assignment Force Close Approved for Assignment : " + emailData.assignmentNo,
            message: "<html><body><p style='font-size: 16px;'>Dear " + emailData.ownerName + " ,<br> As per your request, i have Force Closed the assignment.</p><br>" + "<p style='font-size: 16px;'> Warm Regards, <br>" + emailData.ownerName + "<br> " + emailData.ownerPhone + "<br>" + emailData.ownerEmail + "</p></body></html>"
          }
          callback(null, emails);
        }
        break;

      case "Assignment Force Close Rejected":
        {
          var emails = {
            name: 'Assignment Force Close Rejected',
            from: emailData.ownerEmail,
            to: emailData.to,
            cc: emailData.cc,
            bcc: emailData.bcc,
            subject: "Assignment Force Close Rejected for Assignment : " + emailData.assignmentNo,
            message: "<html><body><p style='font-size: 16px;'>Dear " + emailData.ownerName + " ,<br> Your Request for Force Closing the Assignment is Rejected. #Reason#</p><br>" + "<p style='font-size: 16px;'> Warm Regards, <br>" + emailData.ownerName + "<br> " + emailData.ownerPhone + "<br>" + emailData.ownerEmail + "</p></body></html>"
          }
          callback(null, emails);
        }
        break;

      case "Assignment Reopen Request":
        {
          var emails = {
            name: 'Assignment Reopen Request',
            from: emailData.ownerEmail,
            to: emailData.to,
            cc: emailData.cc,
            bcc: emailData.bcc,
            subject: "Request for Reopening of Assignment : " + emailData.assignmentNo,
            message: "<html><body><p style='font-size: 16px;'>Dear " + emailData.ownerName + ",<br> Requesting you to please Re-open the Assignment due to some reasons. Reason : " + emailData.reopenComment + " </p><br>" + "<p style='font-size: 16px;'> Warm Regards, <br>" + emailData.ownerName + "<br> " + emailData.ownerPhone + "<br>" + emailData.ownerEmail + "</p></body></html>"
          }
          callback(null, emails);
        }
        break;

      case "Assignment Reopen Approved":
        {
          var emails = {
            name: 'Assignment Reopen Approved',
            from: emailData.ownerEmail,
            to: emailData.to,
            cc: emailData.cc,
            bcc: emailData.bcc,
            subject: "Assignment Reopen Request Approved for Assignment : " + emailData.assignmentNo,
            message: "<html><body><p style='font-size: 16px;'>Dear " + emailData.ownerName + " ,<br> As requested, Assignment " + emailData.assignmentNo + " has been re-opened.</p><br>" + "<p style='font-size: 16px;'> Warm Regards, <br>" + emailData.ownerName + "<br> " + emailData.ownerPhone + "<br>" + emailData.ownerEmail + "</p></body></html>"
          }
          callback(null, emails);
        }
        break;

      case "Assignment Reopen Rejected":
        {
          var emails = {
            name: 'Assignment Reopen Rejected',
            from: emailData.ownerEmail,
            to: emailData.to,
            cc: emailData.cc,
            bcc: emailData.bcc,
            subject: "Assignment Reopen Request Rejected for Assignment : " + emailData.assignmentNo,
            message: "<html><body><p style='font-size: 16px;'>Dear " + emailData.ownerName + ",<br> Your Request for Re-opening the Assignment has been Rejected. #Reason#</p><br>" + "<p style='font-size: 16px;'> Warm Regards, <br>" + emailData.ownerName + "<br> " + emailData.ownerPhone + "<br>" + emailData.ownerEmail + "</p></body></html>"
          }
          callback(null, emails);
        }
        break;

      case "Assignment On Hold Request":
        {
          var emails = {
            name: 'Assignment On Hold Request',
            from: emailData.ownerEmail,
            to: emailData.to,
            cc: emailData.cc,
            bcc: emailData.bcc,
            subject: "Assignment On Hold Request for Assignment : " + emailData.assignmentNo,
            message: "<html><body><p style='font-size: 16px;'>Dear " + emailData.ownerName + " ,<br>Requesting you to please put the Assignment On Hold. Reason : " + emailData.onholdComment + " </p><br>" + "<p style='font-size: 16px;'> Warm Regards, <br>" + emailData.ownerName + "<br> " + emailData.ownerPhone + "<br>" + emailData.ownerEmail + "</p></body></html>"
          }
          callback(null, emails);
        }
        break;

      case "Assignment On Hold Approved":
        {
          var emails = {
            name: 'Assignment On Hold Approved',
            from: emailData.ownerEmail,
            to: emailData.to,
            cc: emailData.cc,
            bcc: emailData.bcc,
            subject: "Assignment On Hold Approved for Assignment : " + emailData.assignmentNo,
            message: "<html><body><p style='font-size: 16px;'>Dear " + emailData.ownerName + " ,<br>As per your request, i have put the assignment On Hold.</p><br>" + "<p style='font-size: 16px;'> Warm Regards, <br>" + emailData.ownerName + "<br> " + emailData.ownerPhone + "<br>" + emailData.ownerEmail + "</p></body></html>"
          }
          callback(null, emails);
        }
        break;

      case "Assignment On Hold Rejected":
        {
          var emails = {
            name: 'Assignment On Hold Rejected',
            from: emailData.ownerEmail,
            to: emailData.to,
            cc: emailData.cc,
            bcc: emailData.bcc,
            subject: "Assignment On Hold Rejected for Assignment :  " + emailData.assignmentNo,
            message: "<html><body><p style='font-size: 16px;'>Dear " + emailData.ownerName + ",<br> Your Request for putting the Assignment On Hold is Rejected. #Reason# </p><br>" + "<p style='font-size: 16px;'> Warm Regards, <br>" + emailData.ownerName + "<br> " + emailData.ownerPhone + "<br>" + emailData.ownerEmail + "</p></body></html>"
          }
          callback(null, emails);
        }
        break;

      case "Assignment Transfer":
        {
          var emails = {
            name: 'Assignment Transfer',
            from: emailData.ownerEmail,
            to: emailData.to,
            cc: emailData.cc,
            bcc: emailData.bcc,
            subject: "Transfer of Assignments",
            message: "<html><body><p style='font-size: 16px;'>This is to inform you that the following Assignment No(s) are being now transferred to " + emailData.newOwner + " for operational reasons,</p><br><br>" + emailData.assignmentNames + "<p style='font-size: 16px;'> Warm Regards, <br>" + emailData.ownerName + "<br> " + emailData.ownerPhone + "<br>" + emailData.ownerEmail + "</p></body></html>"
          }
          callback(null, emails);
        }
        break;

      case "SBC For Approval":
        {
          var emails = {
            name: 'SBC For Approval',
            from: emailData.ownerEmail,
            to: emailData.sbcTo,
            cc: emailData.cc,
            bcc: emailData.bcc,
            subject: "Request for deputation of Surveyor : " + emailData.surveyorName + " for Assignment : " + emailData.assignmentNo,
            message: "<html><body><p style='font-size: 16px;'>Please approve " + emailData.surveyorName + " for " + emailData.assignmentNo + " on " + emailData.surveyDate + " at " + emailData.fullAddress + "</p><br>" + "<p style='font-size: 16px;'> Warm Regards, <br>" + emailData.ownerName + "<br> " + emailData.ownerPhone + "<br>" + emailData.ownerEmail + "</p></body></html>"
          }
          callback(null, emails);
        }
        break;

      case "SBC Approves Surveyor":
        {
          var emails = {
            name: 'SBC Approves Surveyor',
            from: emailData.ownerEmail,
            to: emailData.to,
            cc: emailData.cc,
            bcc: emailData.bcc,
            subject: "Request approved of Surveyor : " + emailData.surveyorName + " for Assignment : " + emailData.assignmentNo,
            message: "<html><body><p style='font-size: 16px;'>" + emailData.surveyorName + " has been authorized for " + emailData.assignmentNo + " on " + emailData.surveyDate + " at " + emailData.fullAddress + "</p><br>" + "<p style='font-size: 16px;'> Warm Regards, <br>" + emailData.assignmentAuthorizer + "</p></body></html>"
          }
          callback(null, emails);
        }
        break;

        //  case "Invoice Send Authorization":
        // {
        //   var emails = {
        //     name: 'Invoice Send Authorization',
        //     from: emailData.ownerEmail,
        //     to: emailData.to,
        //     cc: emailData.cc,
        //     bcc: emailData.bcc,
        //     subject: "Invoice Send Authorization : #InvoiceNo#",
        //     message: "<html><body><p style='font-size: 16px;'>Please go through the Invoice for Assignment No. " + emailData.assignmentNo + " in respect of loss sustained by " + emailData.insuredName + " on account of damage to #ProductDetails# and authorize the same</p><br>" + "<p style='font-size: 16px;'> Warm Regards, <br>" + emailData.ownerName + "<br> " + emailData.ownerPhone + "<br>" + emailData.ownerEmail + "</p></body></html>"
        //   }
        //   callback(null, emails);
        // }
        // break;

      default:
        {
          // $scope.formData.push($scope.newjson);
          // cal
        }

    }
  },


  getDataFromHeader: function (data, name, callback) {
    _.each(data, function (values) {
      if (values.name === name) {
        callback(null, values.value);
      }
    });
  },

  getAssignmentCreateMail: function (data, callback) {
    Assignment.findOne({
      _id: data._id
    }).lean().exec(function (err, emailData) {
      if (err) {
        callback(null, "No Assignment mail data found");
      } else {
        var From = "";
        var Subject = "";
        var To = "";
        var Cc = "";
        var Date = "";
        var decodeMessage = "";
        if (emailData.email) {
          if (emailData.email.payload) {
            Assignment.getDataFromHeader(emailData.email.payload.headers, "From", function (err, value) {
              From = (value ? value : "");
            });
            Assignment.getDataFromHeader(emailData.email.payload.headers, "Subject", function (err, value) {
              Subject = (value ? value : "");
            });
            Assignment.getDataFromHeader(emailData.email.payload.headers, "To", function (err, value) {
              To = (value ? value : "");
            });
            Assignment.getDataFromHeader(emailData.email.payload.headers, "Cc", function (err, value) {
              Cc = (value ? value : "");
            });
            Assignment.getDataFromHeader(emailData.email.payload.headers, "Date", function (err, value) {
              Date = (value ? value : "");
            });
          }
          if (emailData.email.payload) {
            if (emailData.email.payload.body.data) {
              var decodeMessage = base64url.decode(emailData.email.payload.body.data);
            } else {
              var decodeMessage = "";
            }
          } else {
            var decodeMessage = "";
          }

          var message =
            "<br>---------- Forwarded message ----------<br>" +
            "From: " + From + "<br>" +
            "Date: " + Date + "<br>" +
            "Subject: " + Subject + "<br>" +
            "To: " + To + "<br>" +
            "Cc: " + Cc + "<br>" + decodeMessage
        } else {
          var message = "-";
        }

        callback(null, message);
      }
    });
  },

  sendEmails: function (req, callback) {

    if (_.isEmpty(req.threadId)) {
      req.threadId = ""
    }
    var obj = {
      body: {
        url: "messages/send",
        method: "POST"
      },
      user: req.user
    };
    // req.to = [{
    //   name: "priyank",
    //   email: "priyank.parmar@wohlig.com"
    // }];
    req.to = _.join(_.map(req.to, function (n) {
      return n.email;
    }), ",");

    req.cc = _.join(_.map(req.to, function (n) {
      return n.email;
    }), ",");

    req.bcc = _.join(_.map(req.to, function (n) {
      return n.email;
    }), ",");
    var rawData =
      "From: " + req.user.officeEmail + "\r\n" +
      "To: " + req.to + "\r\n" +
      "Cc: " + req.cc + "\r\n" +
      "Bcc: " + req.bcc + "\r\n" +
      "Subject: " + req.subject + "\r\n" +
      "Content-Type: text/html; charset=UTF-8\r\n" +
      "Content-Transfer-Encoding: QUOTED-PRINTABLE\r\n" +
      "Content-Disposition: inline\r\n\r\n" + "" + req.message + "";
    var rawDataProcessed = btoa(rawData).replace(/\+/g, '-').replace(/\//g, '_');
    obj.form = {
      raw: rawDataProcessed,
      threadId: req.threadId
    };
    User.gmailCall(obj, function (err, userData) {
      if (err) {
        callback(err, null);
      } else {
        callback(null, userData);
      }
    });
  },

  getUserData: function (data, callback) {
    User.findOne({
      email: data.email
    }).lean().exec(function (err, userData) {
      if (err) {
        callback(err, null);
      } else {
        callback(null, userData);
      }
    });
  },

  generateMRExcel: function (data, res) {
    Assignment.find()
      .sort({
        createdAt: -1
      })
      .deepPopulate("branch insurerOffice insuredOffice invoice owner natureOfLoss department brokerOffice insuredOffice insurerOffice")
      .exec(
        function (err, data1) {
          if (err) {
            res(err, null);
          } else if (data1) {
            if (_.isEmpty(data1)) {
              res("No Payment found.", null);
            } else {
              var excelData = [];
              _.each(data1, function (n, key) {
                var obj = {};
                obj.sr = key + 1;
                obj.MR_Number = n.name;
                if (n.branch == null) {} else {
                  obj.Branch = n.branch.name;
                }
                obj.Insurer_Claim_Id = n.insurerClaimId;
                obj.Insured_Claim_Id = n.insuredClaimId;
                obj.Broker_Claim_Id = n.brokerClaimId;
                obj.Date_Of_Assignment = moment(n.createdAt).format("DD-MM-YYYY");
                if (n.insuredOffice == null) {} else {
                  obj.Insured = n.insuredOffice.name;
                }
                if (n.insurerOffice == null) {} else {
                  obj.Insurer = n.insurerOffice.name;
                }
                if (n.brokerOffice == null) {} else {
                  obj.Broker = n.brokerOffice.name;
                }
                if (n.department == null) {} else {
                  obj.Department = n.department.name;
                }
                if (n.natureOfLoss) {
                  if (n.natureOfLoss.length > 0) {
                    obj.Nature_Of_Loss = n.natureOfLoss[0].name;
                  }
                }


                obj.Estimated_Loss = n.intimatedLoss;
                if (n.owner == null) {} else {
                  obj.Owner = n.owner.name;
                }
                if (n.survey) {
                  if (n.survey.length > 0) {
                    obj.Survey_Date = n.survey[0].surveyDate;
                  }
                }
                if (n.invoice) {
                  if (n.invoice.length > 0) {
                    // n.invoice.length
                    obj.Date_Of_Intimation = moment(n.invoice[n.invoice.length - 1].approvalTime).format("DD-MM-YYYY");
                  }
                }
                obj.Status = n.timelineStatus
                excelData.push(obj);
              });
              Config.generateExcel("Assignment", excelData, res);
            }
          } else {
            res("Invalid data", null);
          }
        });
  },

  generateExcel: function (data, res) {
    Invoice.find()
      .sort({
        createdAt: -1
      })
      .deepPopulate("assignment assignment.branch billedTo assignment.insured")
      .exec(
        function (err, data1) {
          if (err) {
            res(err, null);
          } else if (data1) {
            if (_.isEmpty(data1)) {
              res("No Payment found.", null);
            } else {
              var excelData = [];
              _.each(data1, function (n, key) {
                var obj = {};
                obj.sr = key + 1;
                if (n.assignment != null) {
                  if (n.assignment.branch == null) {} else {
                    obj.Branch = n.assignment.branch.name;
                  }
                }
                obj.Invoice_Number = n.invoiceNumber;
                if (n.billedTo == null) {} else {
                  obj.Billed_To = n.billedTo.name;
                }
                if (n.assignment != null) {
                  if (n.assignment.insurerClaimId == null) {
                    obj.Insurer_Claim_No = n.assignment.insurerClaimId;
                  }
                }
                if (n.assignment != null) {
                  if (n.assignment.insured == null) {
                    obj.Insurer_Claim_No = n.assignment.insured;
                  }
                }
                excelData.push(obj);
              });
              Config.generateExcel("Assignment", excelData, res);
            }
          } else {
            res("Invalid data", null);
          }
        });
  },

  setGlobalAssignmentStatusForMigration: function (data, callback) {
    var status = "Unassigned";
    if (data.getAllTaskStatus.forceClosed == "Done") {
      status = "Force Closed"
    } else if (data.getAllTaskStatus.OnHold == "Done") {
      status = "OnHold"
    } else if (data.getAllTaskStatus.ReOpened == "Done") {
      status = "ReOpened"
    } else {
      if (data.getAllTaskStatus.surveyAssigned !== "Not Done") {
        status = "Survey Pending";
        if (data.getAllTaskStatus.survey !== "Not Done") {
          status = "ILA Pending";
          if (data.getAllTaskStatus.ila !== "Not Done") {
            status = "LOR Pending";
            if (data.getAllTaskStatus.lor !== "Not Done") {
              status = "Dox Pending";
              if (data.getAllTaskStatus.docs !== "Not Done") {
                status = "Assessment Pending";
                if (data.getAllTaskStatus.assessment !== "Not Done") {
                  status = "Consent Pending";
                  if (data.getAllTaskStatus.consent !== "Not Done") {
                    status = "FSR Pending";
                    if (data.getAllTaskStatus.fsr !== "Not Done") {
                      status = "TBB";
                      if (data.getAllTaskStatus.invoice !== "Not Done") {
                        status = "BBND";
                        if (data.getAllTaskStatus.dispatched !== "Not Done") {
                          status = "DBND";
                          if (data.getAllTaskStatus.delivered !== "Not Done") {
                            status = "Delivered";
                            if (data.getAllTaskStatus.collected !== "Not Done") {
                              status = "Collected";
                            }
                          }
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
    Assignment.update({
      _id: data._id
    }, {
      timelineStatus: status,
      getAllTaskStatus: data.getAllTaskStatus,
      ilaAccess: data.ilaAccess,
      surveyAccess: data.surveyAccess,
      fsrAccess: data.fsrAccess,
      lorAccess: data.lorAccess,
      consentAccess: data.consentAccess,
      assessmentAccess: data.assessmentAccess
    }).exec(function (err, data) {
      if (err) {
        callback(err, null);
      } else {
        callback(null, status);
      }
    });
  },
  calcAssignmentStatusForInvoiceCreation: function (data, callback) {
    var status = false;
    if (data.getAllTaskStatus.forceClosed == "Done") {
      callback(null, status);
    } else if (data.getAllTaskStatus.OnHold == "Done") {
      callback(null, status);
    } else if (data.getAllTaskStatus.ReOpened == "Done") {
      status = true;
      callback(null, status);
    } else {
      if (data.getAllTaskStatus.surveyAssigned !== "Not Done") {
        if (data.getAllTaskStatus.survey !== "Not Done") {
          if (data.getAllTaskStatus.ila !== "Not Done") {
            if (data.getAllTaskStatus.lor !== "Not Done") {
              if (data.getAllTaskStatus.docs !== "Not Done") {
                if (data.getAllTaskStatus.assessment !== "Not Done") {
                  if (data.getAllTaskStatus.consent !== "Not Done") {
                    if (data.getAllTaskStatus.fsr !== "Not Done") {
                      status = true;
                      callback(null, status);
                    } else {
                      callback(null, status);
                    }
                  } else {
                    callback(null, status);
                  }
                } else {
                  callback(null, status);
                }
              } else {
                callback(null, status);
              }
            } else {
              callback(null, status);
            }
          } else {
            callback(null, status);
          }
        } else {
          callback(null, status);
        }
      } else {
        callback(null, status);
      }
    }
  },
  calcGlobalAssignmentStatus: function (data, callback) {
    var status = "Unassigned";
    if (data.getAllTaskStatus.forceClosed == "Done") {
      status = "Force Closed";
      callback(null, status);
    } else if (data.getAllTaskStatus.OnHold == "Done") {
      status = "OnHold";
      callback(null, status);
    } else if (data.getAllTaskStatus.ReOpened == "Done") {
      status = "ReOpened"
      callback(null, status);
    } else {
      if (data.getAllTaskStatus.surveyAssigned !== "Not Done") {
        status = "Survey Pending";
        if (data.getAllTaskStatus.survey !== "Not Done") {
          status = "ILA Pending";
          if (data.getAllTaskStatus.ila !== "Not Done") {
            status = "LOR Pending";
            if (data.getAllTaskStatus.lor !== "Not Done") {
              status = "Dox Pending";
              if (data.getAllTaskStatus.docs !== "Not Done") {
                status = "Assessment Pending";
                if (data.getAllTaskStatus.assessment !== "Not Done") {
                  status = "Consent Pending";
                  if (data.getAllTaskStatus.consent !== "Not Done") {
                    status = "FSR Pending";
                    if (data.getAllTaskStatus.fsr !== "Not Done") {
                      status = "TBB";
                      if (data.getAllTaskStatus.invoice !== "Not Done") {
                        status = "BBND";
                        if (data.getAllTaskStatus.dispatched !== "Not Done") {
                          status = "DBND";
                          if (data.getAllTaskStatus.delivered !== "Not Done") {
                            status = "Delivered";
                            if (data.getAllTaskStatus.collected !== "Not Done") {
                              status = "Collected";
                            } else {
                              callback(null, status);
                            }
                          } else {
                            callback(null, status);
                          }
                        } else {
                          callback(null, status);
                        }
                      } else {
                        callback(null, status);
                      }
                    } else {
                      callback(null, status);
                    }
                  } else {
                    callback(null, status);
                  }
                } else {
                  callback(null, status);
                }
              } else {
                callback(null, status);
              }
            } else {
              callback(null, status);
            }
          } else {
            callback(null, status);
          }
        } else {
          callback(null, status);
        }
      } else {
        callback(null, status);
      }
    }
  },
  generateDataForGlobalStatus: function (data, callback) {
    Assignment.find({}).sort({
      _id: -1
    }).exec(function (err, data) {
      if (err) {
        callback(err, null);
      } else {
        async.eachSeries(data, function (n, callback1) {
          Assignment.generategetAllTaskStatusLogic(n, function (err, data3) {
            if (err) {
              callback1(err, null)
            } else {
              callback1(null, data3);
            }
          });

        }, function (err, data2) {
          if (err) {
            callback(err, data2);
          } else {
            callback(null, data2);
          }
        });
      }
    });
  },

  generategetAllTaskStatusLogic: function (assignment, callback) {
    // var getAllTaskStatus = {
    //   surveyAssigned: "Not Done",
    //   survey: "Not Done",
    //   ila: "Not Done",
    //   lor: "Not Done",
    //   docs: "Not Done",
    //   assessment: "Not Done",
    //   consent: "Not Done",
    //   fsr: "Not Done",
    //   invoice: "Not Done",
    //   forceClosed: "Not Done",
    //   OnHold: "Not Done",
    //   ReOpened: "Not Done"
    // };
    var getAllTaskStatus = assignment.getAllTaskStatus;

    if (assignment.timelineStatus == "Force Closed") {
      getAllTaskStatus.forceClosed = "Done";
    }
    Branch.getOne({
      _id: assignment.branch
    }, function (err, data2) {
      if (err) {
        callback(err, null);
      } else {
        // For Invoice Populate

        // For Checking At Branch Level
        // if (data2.STAT == false) {
        //   getAllTaskStatus.survey = "Waived";
        //   getAllTaskStatus.surveyAssigned = "Waived";
        // }
        // if (data2.ITAT == false) {
        //   getAllTaskStatus.ila = "Waived";
        // }
        // if (data2.LTAT == false) {
        //   getAllTaskStatus.lor = "Waived";
        //   getAllTaskStatus.docs = "Waived";
        // }
        // if (data2.FSR == false) {
        //   getAllTaskStatus.fsr = "Waived";
        // }
        // if (data2.ATAT == false) {
        //   getAllTaskStatus.assessment = "Waived";
        // }
        // if (data2.CTAT == false) {
        //   getAllTaskStatus.consent = "Waived";
        // }
        // // For Checking Waived Button
        // if (assignment.surveyAccess) {
        //   getAllTaskStatus.survey = "Not Done";
        //   getAllTaskStatus.surveyAssigned = "Not Done";
        // }
        // if (assignment.surveyAccess == false) {
        //   getAllTaskStatus.survey = "Waived";
        //   getAllTaskStatus.surveyAssigned = "Waived";
        // }
        // if (assignment.surveyAccess == undefined) {
        //   if (getAllTaskStatus.survey == "Not Done") {
        //     assignment.surveyAccess = true;
        //   }
        // }
        // if (assignment.ilaAccess) {
        //   getAllTaskStatus.ila = "Not Done";
        // }
        // if (assignment.ilaAccess == false) {
        //   getAllTaskStatus.ila = "Waived"
        // }
        // if (assignment.ilaAccess == undefined) {
        //   if (getAllTaskStatus.ila == "Not Done") {
        //     assignment.ilaAccess = true;
        //   }
        // }
        // if (assignment.lorAccess) {
        //   getAllTaskStatus.lor = "Not Done",
        //     getAllTaskStatus.docs = "Not Done"
        // }
        // if (assignment.lorAccess == false) {
        //   getAllTaskStatus.lor = "Waived",
        //     getAllTaskStatus.docs = "Waived"
        // }
        // if (assignment.lorAccess == undefined) {
        //   if (getAllTaskStatus.lor == "Not Done") {
        //     assignment.lorAccess = true;
        //   }
        // }
        // if (assignment.fsrAccess) {
        //   getAllTaskStatus.fsr = "Not Done"
        // }
        // if (assignment.fsrAccess == false) {
        //   getAllTaskStatus.fsr = "Waived"
        // }
        // if (assignment.fsrAccess == undefined) {
        //   if (getAllTaskStatus.fsr == "Not Done") {
        //     assignment.fsrAccess = true;
        //   }
        // }
        // if (assignment.assessmentAccess) {
        //   getAllTaskStatus.assessment = "Not Done"
        // }
        // if (assignment.assessmentAccess == false) {
        //   getAllTaskStatus.assessment = "Waived"
        // }
        // if (assignment.assessmentAccess == undefined) {
        //   if (getAllTaskStatus.assessment == "Not Done") {
        //     assignment.assessmentAccess = true;
        //   }
        // }
        // if (assignment.consentAccess) {
        //   getAllTaskStatus.consent = "Not Done"
        // }
        // if (assignment.consentAccess == false) {
        //   getAllTaskStatus.consent = "Waived"
        // }
        // if (assignment.consentAccess == undefined) {
        //   if (getAllTaskStatus.consent == "Not Done") {
        //     assignment.consentAccess = true;
        //   }
        // }
        // DeskTop Logic
        // if (assignment.typeOfClaim == false) {
        //   getAllTaskStatus.survey = "Waived";
        //   assignment.surveyAccess = false;
        //   getAllTaskStatus.surveyAssigned = "Waived";
        // }
        // // Is insured + Desktop
        // if (assignment.isInsured == false || assignment.typeOfClaim == false) {
        //   getAllTaskStatus.ila = "Waived";
        //   assignment.ilaAccess = false;
        // }
        // Checking For Task Done


        if (getAllTaskStatus.surveyAssigned != "Done") {
          if (assignment.survey.length > 0) {
            var surveyFlag = false;
            _.each(assignment.survey, function (n) {
              if (n.status == "Completed" || n.status == "Pending") {
                surveyFlag = true;
              }
            });
            if (surveyFlag) {
              getAllTaskStatus.surveyAssigned = "Done"
              assignment.surveyAccess = true;
            }
          }
          // if (assignment.timelineStatus == "BBND" && getAllTaskStatus.surveyAssigned != "Done") {
          //   getAllTaskStatus.surveyAssigned = "Waived";
          //   assignment.surveyAccess = false;
          // }
        }
        if (getAllTaskStatus.survey != "Done") {

          if (assignment.survey.length > 0) {
            var surveyFlag = false
            _.each(assignment.survey, function (n) {
              if (n.status == "Completed" || n.completionTime != undefined) {
                if (n.completionTime && surveyFlag == false) {
                  getAllTaskStatus.surveyTime = n.completionTime;
                }
                surveyFlag = true;
              }
            });
            if (surveyFlag) {
              getAllTaskStatus.survey = "Done";
              assignment.surveyAccess = true;
              getAllTaskStatus.surveyAssigned = "Done"
            }
          }
          // if (assignment.timelineStatus == "BBND" && getAllTaskStatus.survey != "Done") {
          //   getAllTaskStatus.survey = "Waived"
          //   assignment.surveyAccess = false;
          // }
        }
        if (getAllTaskStatus.ila != "Done") {
          if (assignment.templateIla.length > 0) {
            if (assignment.templateIla[0].approvalStatus == "Approved" || assignment.templateIla[0].authTimestamp != undefined || assignment.templateIla[0].file != undefined) {
              getAllTaskStatus.ila = "Done";
              if (assignment.templateIla[0].authTimestamp) {
                getAllTaskStatus.ilaTime = assignment.templateIla[0].authTimestamp;
              }
              assignment.ilaAccess = true;
            }
          }
          // if (assignment.timelineStatus == "BBND" && getAllTaskStatus.ila != "Done") {
          //   getAllTaskStatus.ila = "Waived";

          //   assignment.ilaAccess = false;
          // }
        }
        if (getAllTaskStatus.lor != "Done") {
          if (assignment.templateLor.length > 0) {
            var lorFlag = false
            _.each(assignment.templateLor, function (n) {
              if (n.approvalStatus == "Approved" || n.approvalStatus == "All Docs Received" || n.authTimestamp != undefined || n.file != undefined) {
                if (lorFlag == false) {
                  getAllTaskStatus.lorTime = n.authTimestamp;
                }
                lorFlag = true;
              }
            });
            if (lorFlag) {
              getAllTaskStatus.lor = "Done";
              assignment.lorAccess = true;
            }
          }
          // if (assignment.timelineStatus == "BBND" && getAllTaskStatus.lor != "Done") {
          //   getAllTaskStatus.lor = "Waived"
          //   assignment.lorAccess = false;
          // }
        }
        if (getAllTaskStatus.docs != "Done") {
          if (assignment.templateLor.length > 0) {
            if (assignment.templateLor[assignment.templateLor.length - 1].approvalStatus == "All Docs Received") {
              getAllTaskStatus.docs = "Done";
              assignment.docsAccess = true;
            }
          }
          // if (assignment.timelineStatus == "BBND" && getAllTaskStatus.docs != "Done") {
          //   getAllTaskStatus.docs = "Waived";
          //   assignment.docsAccess = false;
          // }
        }
        if (getAllTaskStatus.assessment != "Done") {
          if (assignment.assessment.length > 0) {
            getAllTaskStatus.assessment = "Done";
            assignment.assessmentAccess = true;
          }
          // if (assignment.timelineStatus == "BBND" && getAllTaskStatus.assessment != "Done") {
          //   getAllTaskStatus.assessment = "Waived";
          //   assignment.assessmentAccess = false;
          // }
        }
        if (getAllTaskStatus.consent != "Done") {
          if (assignment.consent.length > 0) {
            getAllTaskStatus.consent = "Done";
            assignment.consentAccess = true;

          }
          // if (assignment.timelineStatus == "BBND" && getAllTaskStatus.consent != "Done") {
          //   getAllTaskStatus.consent = "Waived";
          //   assignment.consentAccess = false;
          // }
        }
        if (getAllTaskStatus.fsr != "Done") {
          if (assignment.fsrs.length > 0) {
            getAllTaskStatus.fsr = "Done"
            assignment.fsrAccess = true;
          }
          // if (assignment.timelineStatus == "BBND" && getAllTaskStatus.fsr != "Done") {
          //   getAllTaskStatus.fsr = "Waived";
          //   assignment.fsrAccess = false;
          // }
        }

        // if (assignment.timelineStatus == "BBND") {
        //   getAllTaskStatus.invoice = "Done";
        // } else {
        //   if (assignment.invoice.length > 0) {}
        // }
        assignment.getAllTaskStatus = getAllTaskStatus;
        // Remove COmment
        Assignment.setGlobalAssignmentStatusForMigration(assignment, function (err, data5) {
          if (err) {
            callback(err, null)
          } else {
            callback(null, data2);
          }
        });

      }
    });
    // }
  },
  searchOnlyForInvoice: function (data, callback) {
    var Model = this;
    var Search = Model.find({})
      .deepPopulate("invoice")
      .exec(function (err, data) {
        if (err) {
          callback(err, null)
        } else {
          var counter = 0;
          _.each(data, function (n) {
            //if (n.timelineStatus != "BBND") {
            var flag = false;
            _.each(n.invoice, function (m) {
              // if (m.approvalTime != undefined || m.file!= undefined) {

              if ((m.approvalStatus == "Approved" || m.approvalStatus == "Revised" || m.approvalStatus == "Cancelled") && flag == false) {
                flag = true;

                if (n.getAllTaskStatus.invoice !== "Done") {
                  counter++;
                  n.getAllTaskStatus.invoice = "Done";
                  n.getAllTaskStatus.invoiceTime = m.approvalTime;
                }
                //n.getAllTaskStatus.invoiceTime = m.approvalTime;
                // n.timelineStatus = "BBND";
                // Assignment.setGlobalAssignmentStatusForMigration({
                //   _id: n._id
                // }, {
                //   getAllTaskStatus: n.getAllTaskStatus
                // }).exec(function (err, data) {
                //   if (err) {
                //     callback(err, null);
                //   } else {}
                // });
                Assignment.setGlobalAssignmentStatusForMigration(n, function (err, data) {
                  if (err) {} else {}
                });
              }
            })
          })
        }
      });

  },
  setTimeStampForInvoice: function (data, callback) {
    var Model = this;
    var Search = Model.find({})
      .deepPopulate("invoice")
      .exec(function (err, data) {
        if (err) {
          callback(err, null)
        } else {
          _.each(data, function (n) {
            if (n.invoice) {
              if (n.invoice.length > 0) {
                var count = false;
                _.each(n.invoice, function (m, key) {
                  if (m.approvalTime != undefined || m.approvalStatus == "Approved" || m.approvalStatus == "Revised" || m.approvalStatus == "Cancelled" || m.file != undefined) {
                    n.getAllTaskStatus.invoice = "Done"
                  }
                  if (m.approvalTime != undefined && count == false) {
                    count = true;
                    n.getAllTaskStatus.invoiceTime = m.approvalTime;
                    Assignment.update({
                      _id: n._id
                    }, {
                      getAllTaskStatus: n.getAllTaskStatus
                        // timelineStatus: n.timelineStatus
                    }).exec(function (err, data) {
                      if (err) {
                        callback(err, null);
                      } else {}
                    });
                  }
                });
              }
            }
          })
        }
      });
  },

  // setTimeStampForInvoice: function (data, callback) {
  findMissingInvoice: function (data, callback) {
    var Model = this;
    var Search = Model.find({})
      .deepPopulate("invoice")
      .exec(function (err, data) {
        if (err) {
          callback(err, null)
        } else {
          _.each(data, function (n) {
            if (n.invoice) {
              _.each(n.invoice, function (m, key) {
                if (m.approvalTime != undefined && m.file == undefined) {}
              });
            }
          })
        }
      });
  },

  getOneAssignment: function (data, callback) {
    var Model = this;
    var Search = Model.findOne({
        _id: data._id
      })
      .deepPopulate("city.district.state.zone.country products.product.category.industry department shareWith.persons policyType natureOfLoss invoice invoice.createdBy insured insuredOffice owner owner.func company company.city insurerOffice company.city.district.state assessment.employee consent.employee docs.employee fsrs.employee photos.employee causeOfLoss insurer assignedTo office branch survey.employee survey.employee.city company.bank owner.employee survey.employee.city.district survey.employee.city.district.state survey.employee.city.district.state.zone survey.employee.city.district.state.zone.country customer brokerOffice segment customerCompany broker policyDepartment salvage", {
        populate: {
          'templateLor.sentTo': {
            select: '_id name'
          },
          'templateLor.sentBy': {
            select: '_id name'
          },
          'templateIla.sentTo': {
            select: '_id name'
          },
          'templateIla.sentBy': {
            select: '_id name'
          },
          'salvage': {
            select: '_id name'
          },
          'broker': {
            select: '_id name'
          },
          'brokerOffice': {
            select: '_id name'
          },
          'customer': {
            select: 'name _id'
          },
          'segment': {
            select: 'name _id'
          },
          'insurerOffice': {
            select: 'name _id address'
          },
          department: {
            select: 'name _id'
          },
          'branch': {
            select: ''
          },
          'office': {
            select: ''
          },
          'office.city': {
            select: 'name _id district'
          },
          'office.city.district': {
            select: 'name _id state'
          },
          'office.city.district.state': {
            select: 'name _id'
          },
          'invoice': {
            select: 'name invoiceNumber _id grandTotal createdBy approvalStatus file approvalTime grossAssessedLoss grossDepreciation grossSalvage grossUnderInsurance excessFranchise netPayable'
          },
          'invoice.createdBy': {
            select: 'name _id'
          },
          'assignedTo': {
            select: 'name _id'
          },
          'city': {
            select: 'name _id district'
          },
          'owner': {
            select: 'name _id func houseColor photo email mobile officeMobile  officeEmail employee'
          },
          'owner.func': {
            select: 'name'
          },
          'owner.employee': {
            select: 'name officeEmail'
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
            select: 'name countryCode _id'
          },
          'customerCompany': {
            select: 'name _id'
          },
          'insurer': {
            select: ''
          },
          'company': {
            select: ''
          },
          'company.city': {
            select: 'name district'
          },
          'company.city.district': {
            select: 'name state _id'
          },
          'company.city.district.state': {
            select: 'name _id'
          },
          'company.bank': {
            select: ''
          },
          'natureOfLoss': {
            select: 'name _id'
          },
          'shareWith.persons': {
            select: 'name _id email officeEmail'
          },
          'insured': {
            select: 'name _id'
          },
          'insuredOffice': {
            select: ''
          },
          'insuredOffice.city': {
            select: 'name _id district'
          },
          'insuredOffice.city.district': {
            select: 'name _id state'
          },
          'insuredOffice.city.district.state': {
            select: 'name _id'
          },
          'products.product': {
            select: 'name _id category'
          },
          'products.product.category': {
            select: 'name _id industry'
          },
          'products.product.category.industry': {
            select: 'name _id'
          },
          'templateInvoice.forms.invoiceExpenditure': {
            select: 'name _id'
          },
          'assessment.employee': {
            select: 'name _id photo'
          },
          'consent.employee': {
            select: 'name _id photo'
          },
          'docs.employee': {
            select: 'name _id photo'
          },
          'fsrs.employee': {
            select: 'name _id photo'
          },
          'photos.employee': {
            select: 'name _id photo'
          },
          'causeOfLoss': {
            select: 'name _id'
          },
          'policyType': {
            select: 'name _id'
          },
          'survey.employee': {
            select: 'name _id email mobile officeMobile officeEmail address city'
          },
          'survey.employee.city': {
            select: 'name _id state'
          },
          'survey.employee.city.district': {
            select: 'name _id state'
          },
          'survey.employee.city.district.state': {
            select: 'name _id zone'
          },
          'survey.employee.city.district.state.zone': {
            select: 'name _id country'
          },
          'survey.employee.city.district.state.zone.country': {
            select: 'name countryCode _id'
          },
          'policyDepartment': {
            select: 'name _id'
          },
          'timeline': {
            select: 'chat _id'
          }
        }
      }).lean()
      .exec(function (err, data) {
        console.log('data : ', data);
        if (err) {
          callback(err, null)
        } else {
          callback(null, data);
        }
      });
  },

  updateAssignmentOwner: function (data, callback) {
    Assignment.update({
      _id: {
        $in: data.ids
      }
    }, {
      owner: data.employeeTo
    }, {
      multi: true
    }).exec(function (err, updated) {
      if (err) {
        callback(err, null);
      } else {
        callback(null, updated);
      }
    });
  },

  updateAssignmentTimeline: function (data, callback) {
    Timeline.update({
      assignment: {
        $in: data.ids
      }
    }, {
      $push: {
        chat: data.chat
      }
    }, {
      multi: true
    }).exec(function (err, updated) {
      if (err) {
        callback(err, null);
      } else {
        callback(null, updated);
      }
    });
  },

  updateLogisticDetail: function (data, callback) {
    var ids = data.ids;
    delete data.ids;
    Assignment.update({
      _id: {
        $in: ids
      }
    }, data, {
      multi: true
    }).exec(function (err, updated) {
      if (err) {
        callback(err, null);
      } else {
        callback(null, updated);
      }
    });
  },

};

module.exports = _.assign(module.exports, exports, model);