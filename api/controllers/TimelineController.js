module.exports = _.cloneDeep(require("sails-wohlig-controller"));
var controller = {
    getTimeline: function (req, res) {
        if (req.body) {
            req.model.getTimeline(req.body, res.callback);
        } else {
            res.json({
                value: false,
                data: "Invalid Request"
            });
        }
    },
    updateEmailStatus: function (req, res) {
        if (req.body) {
            req.model.updateEmailStatus(req.body, res.callback);
        } else {
            res.json({
                value: false,
                data: "Invalid Request"
            });
        }
    },
    updateTimeline: function (req, res) {
        if (req.body) {
            req.model.updateTimeline(req.body, res.callback);
        } else {
            res.json({
                value: false,
                data: "Invalid Request"
            });
        }
    },

    //To store photos in timeline and assignment 
    saveTimelineAndAssignment: function (req, res) {
        //console.log('req.body',req.body);
        Timeline.saveTimelineAndAssignment(req.body, res.callback);
    }


};
module.exports = _.assign(module.exports, controller);