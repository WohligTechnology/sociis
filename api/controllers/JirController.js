module.exports = _.cloneDeep(require("sails-wohlig-controller"));
var controller = {
  getTypeData: function (req, res) {
    if (req.body) {
      //console.log("HIOOOOOOOOOOO");
      Jir.getType(req.body, res.callback);
    } else {
      //console.log("HIOOOOOOOOOOOError");
      res.json({
        value: false,
        data: {
          message: "Invalid Request"
        }
      })
    }
  }
};
module.exports = _.assign(module.exports, controller);