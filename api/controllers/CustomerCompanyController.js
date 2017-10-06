/**
 * CountryController
 *
 * @description :: Server-side logic for managing countries
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */
module.exports = _.cloneDeep(require("sails-wohlig-controller"));
var controller = {

    getSegmented: function (req, res) {
        if (req.body) {
            req.model.getSegmented(req.body, res.callback);

        } else {
            res.json({
                value: false,
                data: "Invalid Request"
            });
        }
    },
    getInsured: function (req, res) {
        if (req.body) {
            req.model.getInsured(req.body, res.callback);
        } else {
            res.json({
                value: false,
                data: "Invalid Request"
            });
        }
    },
    getInsurer: function (req, res) {
        if (req.body) {
            req.model.getInsurer(req.body, res.callback);

        } else {
            res.json({
                value: false,
                data: "Invalid Request"
            });
        }
    },
    getBroker: function (req, res) {
        if (req.body) {
            req.model.getBroker(req.body, res.callback);

        } else {
            res.json({
                value: false,
                data: "Invalid Request"
            });
        }
    },
    getGSTINDetails: function (req, res) {
        if (req.body) {
            req.model.getGSTINDetails(req.body, res.callback);
        } else {
            res.json({
                value: false,
                data: "Invalid Request"
            });
        }
    },


};
module.exports = _.assign(module.exports, controller);