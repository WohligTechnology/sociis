module.exports = _.cloneDeep(require("sails-wohlig-controller"));
var controller = {
    getRoleByName : function(req,res){
        console.log("req.body",req.body);
        if(req.body.Is == "Customer"){
            Role.find({
                "name":"Customerlogin"
            }).exec((err,result)=>{
                if(err || _.isEmpty(result)){
                    res.callback(null,[]);
                }else{
                    res.callback(null,result);
                }
            })
        }
    }
};
module.exports = _.assign(module.exports, controller);
