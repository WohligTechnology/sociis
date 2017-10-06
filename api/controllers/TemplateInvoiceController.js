module.exports = _.cloneDeep(require("sails-wohlig-controller"));
var controller = {
     getTemplate:function (req, res) {
        if (req.body) {
            req.model.getTemplate(req.body, res.callback);
        } else {
            res.json({
                value: false,
                data: "Invalid Request"
            });
        }
    },
};
module.exports = _.assign(module.exports, controller);
