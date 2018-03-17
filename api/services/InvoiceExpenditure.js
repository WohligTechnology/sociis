var schema = new Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    uniqueCaseInsensitive: true
  },
  description: String,
  unit: String,
  rate: Number,
  status: {
    type: Boolean,
    default: true
  },
  type: {
    type: Boolean,
    default: false
  },
  rateArray: [{
    rate: Number,
    validFrom: Date,
    validTo: Date
  }]
});

schema.plugin(deepPopulate, {});
schema.plugin(uniqueValidator);
schema.plugin(timestamps,timestampsAppendObject);
module.exports = mongoose.model('InvoiceExpenditure', schema);

var exports = _.cloneDeep(require("sails-wohlig-service")(schema));
var model = {
  searchForInvoiceList: function (data, callback) {
    var Model = this;
    var Const = this(data);
    var maxRow = 1000;
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
      .deepPopulate()
      .keyword(options)
      .page(options, callback);

  },
  getAllItemsName: function (data, callback) {
    InvoiceExpenditure.find({}, {
      name: 1
    }).exec(function (err, data) {
      if (err) {
        callback(err, data)
      } else {
        callback(null, data);
      }
    });
  }
};
module.exports = _.assign(module.exports, exports, model);