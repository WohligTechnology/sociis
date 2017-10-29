module.exports = _.cloneDeep(require("sails-wohlig-controller"));
var controller = {
    searchForInvoiceList: function (req, res) {
        if (req.body) {
            req.model.searchForInvoiceList(req.body, res.callback);
        } else {
            res.json({
                value: false,
                data: "Invalid Request"
            });
        }
    },
    getAllItemsName: function (req, res) {
        InvoiceExpenditure.getAllItemsName(req.body, res.callback);
    },
    save: function (req, res) {
        console.log(req.body)
        if (!req.body._id) {
            req.model.saveData(req.body, function (err, data) {
                console.log(err)
                if (err) {
                    console.log("Here In Error")
                } else {
                    Shop.find({}, {
                        name: 1
                    }).lean().exec(function (err, shopsArr) {
                        console.log("data._id", data._id)
                        var invoiceObject = {
                            item: data._id,
                            quantity: 0
                        };
                        console.log("InvoiceObj", invoiceObject);
                        async.eachSeries(shopsArr, function (n, callback) {
                            Shop.update({
                                "_id": n._id
                            }, {
                                $addToSet: {
                                    items: invoiceObject
                                }
                            }).lean().exec(function (err, Shop) {
                                if (err) {
                                    callback();
                                } else {
                                    callback();
                                }
                            })
                        }, function (err) {
                            if (err) {
                                res.callback(err, data);
                            } else {
                                res.callback(null, data);
                            }
                        });
                    })
                }
            });
        } else {
            req.model.saveData(req.body, res.callback)
        }
    },
    // async.eachSeries(newInsurer, function (n, callback) {
    //                 Customer.getChildCustomer({
    //                     "_id": n
    //                 }, function (err, data2) {
    //                     if (err) {
    //                         callback();
    //                     } else {
    //                         arr = _.concat(arr, data2);
    //                         callback();
    //                     }
    //                 })
    //             }, function (err) {
    //                 if (err) {

    //                 } else {
    //                     _.each(arr, function (n) {
    //                         req.body.insurer.push(n);
    //                     });
    //                     req.body.insurer = _.uniq(req.body.insurer)
    //                     req.model.getAll(req.body, res.callback, req.user);
    //                 }
    //             });
};
module.exports = _.assign(module.exports, controller);