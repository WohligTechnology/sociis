var schema = new Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    uniqueCaseInsensitive: true
  },
  percent: {
    type: Number
  },
  intraStatePercent: {
    type: Number
  },
  interStatePercent: {
    type: Number
  },
  status: {
    type: Boolean,
    default: true
  },
  fromDate: {
    type: Date
  },
  toDate: {
    type: Date
  }
});

schema.plugin(deepPopulate, {});
schema.plugin(uniqueValidator);
schema.plugin(timestamps);
module.exports = mongoose.model('Tax', schema);

var exports = _.cloneDeep(require("sails-wohlig-service")(schema));
var model = {
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
        asc: "createdAt",
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
};
module.exports = _.assign(module.exports, exports, model);