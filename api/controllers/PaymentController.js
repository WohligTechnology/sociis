module.exports = _.cloneDeep(require("sails-wohlig-controller"));
var controller = {
    createPayment: function (req, res) {
        async.waterfall([
                function (callback) { //Invoice 
                    Invoice.find({
                        customer: req.body.customerId,
                        status: {
                            $in: ["Pending", "Partial Pending"]
                        }
                    }).sort({
                        createdAt: -1
                    }).exec(function (err, found) {
                        console.log("Found: ", found);
                        if (err) {
                            callback(err, null);
                        } else if (_.isEmpty(found)) {
                            callback(null, "noDataound");
                        } else {
                            console.log("found in getAllCompany", found);
                            callback(null, found);
                        }

                    });
                },
                function (data, callback) {
                    var invoiceArr = [];
                    var PayAmount = req.body.amount;
                    async.eachSeries(data, function (n, callback1) {
                        if (n.amount <= PayAmount) {
                            PayAmount = PayAmount - n.amount;
                            n.status = "Paid";
                            Invoice.update({
                                _id: n._id
                            }, n, function (err, updated) {
                                if (err) {
                                    callback1(err, null);
                                } else {
                                    invoiceArr.push(n._id);
                                    callback1(null, updated);
                                }
                            });
                        } else {

                        }
                        // Assignment.generategetAllTaskStatusLogic(n, function (err, data3) {
                        //     if (err) {
                        //         callback1(err, null)
                        //     } else {
                        //         callback1(null, data3);
                        //     }
                        // });
                        // console.log(n);
                        // callback1();

                    }, function (err, data2) {
                        if (err) {
                            callback(err, data2);
                        } else {
                            callback(null, data2);
                        }
                    });
                },
                // function (data, callback) { // Payment
                //     var paymentObj = {
                //         name: "",
                //         shop: req.body.shop,
                //         employee: req.body.employee,
                //         customer: req.body.customer,
                //         amount: req.body.total,
                //         invoice: []
                //     };
                //     paymentObj.invoice.push(data._id);
                //     if (req.body.paymentMethod == "Cash") {
                //         Payment.generatePaymentNumber(req.body, function (err, name) {
                //             if (err) {
                //                 callback(err, null);
                //             } else {
                //                 paymentObj.name = name;
                //                 Payment.saveData(paymentObj, function (err, data) {
                //                     if (err) {
                //                         callback(err, null);
                //                     } else {
                //                         callback(null, data)
                //                     }
                //                 });
                //             }
                //         });
                //     } else {
                //         callback(null, data);
                //     }

                // },
                // function (data, callback) {
                //     var customerData = {
                //         type: req.body.paymentMethod,
                //         _id: req.body.customer._id,
                //         amount: req.body.total
                //     };
                //     Customer.upDateCustomerOnCreateInvoice(customerData, function (err, name) {
                //         if (err) {
                //             callback(err, null);
                //         } else {
                //             callback(null, data);
                //         }
                //     });
                // }
            ],
            function (err, results) {
                if (err) {
                    res.callback(err, null);
                } else {
                    // var newData = {
                    //     data: results,
                    //     value: true
                    // }
                    res.callback(null, results);
                }
            });
    },

};
module.exports = _.assign(module.exports, controller);