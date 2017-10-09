module.exports = _.cloneDeep(require("sails-wohlig-controller"));
var controller = {

    generatePaymentNumber: function (req, res) {
        JsonStore.findOne({
            _id: req.query.id
        }).lean().exec(function (err, data) {
            if (err || _.isEmpty(data)) {
                res.badRequest();
            } else {
                req.model.generateSalesRegisterExcel(data.json, res.callback, res, req.user);
            }
        });
    },
};
module.exports = _.assign(module.exports, controller);