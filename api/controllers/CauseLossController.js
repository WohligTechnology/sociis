/**
 * CountryController
 *
 * @description :: Server-side logic for managing countries
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */
module.exports = _.cloneDeep(require("sails-wohlig-controller"));
var controller = {
  getNatureLoss: function(req, res) {
      if (req.body) {
          req.model.getNatureLoss(req.body, res.callback);

      } else {
          res.json({
              value: false,
              data: "Invalid Request"
          });
      }
  },
};
module.exports = _.assign(module.exports, controller);
