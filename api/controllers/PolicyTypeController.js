/**
 * CountryController
 *
 * @description :: Server-side logic for managing countries
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */
module.exports = _.cloneDeep(require("sails-wohlig-controller"));
var controller = {
    getCompany : function(req, res) {
        if(req.body){
            PolicyType.getCompany(req.body,res.callback);
        }else{
            res.json({
                value:false,
                data:"Invalid Request"
            });
        }
    }
};
module.exports = _.assign(module.exports, controller);
