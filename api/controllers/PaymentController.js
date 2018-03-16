module.exports = _.cloneDeep(require("sails-wohlig-controller"));
var controller = {
    createPayment: function (req, res) {
        var invoiceArr = [];
        // console.log("Customer --->", req.body.customer);
        async.waterfall([
                function (callback) { //Invoice Search
                    Invoice.find({
                        customer: req.body.customer,
                        status: {
                            $in: ["Pending", "Partial Pending"]
                        }
                    }).sort({
                        createdAt: 1
                    }).exec(function (err, found) {
                        // console.log("Found: ", found);
                        if (err) {
                            callback(err, null);
                        } else if (_.isEmpty(found)) {
                            callback(null, "noDataound");
                        } else {
                            // console.log("found in getAllCompany", found);
                            callback(null, found);
                        }

                    });
                },
                function (data, callback) { // Invoice Update
                    // console.log("data", data);
                    var PayAmount = req.body.amount;
                    async.eachSeries(data, function (n, callback1) {
                        var remaning = n.total - n.paidAmount;
                        if (n.total <= PayAmount || (n.status == "Partial Pending" && remaning <= PayAmount)) {
                            if (n.status == "Partial Pending") {
                                n.paidAmount = n.paidAmount + remaning;
                                PayAmount = PayAmount - remaning;
                            } else {
                                PayAmount = PayAmount - n.total;
                            }
                            n.status = "Paid";
                            Invoice.update({
                                _id: n._id
                            }, n, function (err, updated) {
                                if (err) {
                                    // console.log("In Err1");
                                    callback1(err, null);
                                } else {
                                    invoiceArr.push(n._id);
                                    callback1(null, updated);
                                }
                            });
                        } else if (PayAmount != 0) {
                            if (n.status == "Partial Pending") {
                                n.paidAmount = n.paidAmount + PayAmount;
                            } else {
                                n.paidAmount = n.paidAmount + PayAmount;
                            }
                            PayAmount = 0;
                            n.status = "Partial Pending";
                            Invoice.update({
                                _id: n._id
                            }, {
                                $set: {
                                    status: n.status,
                                    paidAmount: n.paidAmount
                                }
                            }, function (err, updated) {
                                if (err) {
                                    // console.log("In Err2");
                                    callback1(err, null);
                                } else {
                                    invoiceArr.push(n._id);
                                    callback1(null, updated);
                                }
                            });
                        } else {
                            callback1();
                        }
                    }, function (err, data2) {
                        if (err) {
                            // console.log("In Err3");
                            callback(err, data2);
                        } else {
                            callback(null, data2);
                        }
                    });
                },
                function (data, callback) { // Payment Generation
                    req.body.invoice = invoiceArr;
                    Payment.generatePaymentNumber(req.body, function (err, name) {
                        if (err) {
                            // console.log("In Err4");
                            callback(err, null);
                        } else {
                            req.body.name = name;
                            console.log(req.body);
                            Payment.saveData(req.body, function (err, data) {
                                // console.log("after payment req:",req.body);
                                // console.log("after payment resp",data,err);
                                if (err) {
                                    console.log("In Err5");
                                    callback(err, null);
                                } else {
                                    callback(null, data);
                                }
                            });
                        }
                    });
                },
                function (data, callback) {
                    var customerData = {
                        _id: req.body.customer,
                        amount: req.body.amount
                    };
                    Customer.upDateCustomerOnCreatePayment(customerData, function (err, name) {
                        if (err) {
                            console.log("In Err6");
                            callback(err, null);
                        } else {
                            console.log("Exec 7")
                            callback(null, data);
                        }
                    });
                }
            ],
            function (err, results) {
                if (err) {
                    console.log("In Err7");
                    res.callback(err, null);
                } else {
                    var newData = {
                        data: results,
                        value: true
                    };
                    res.callback(null, newData);
                }
            });
    },

};
module.exports = _.assign(module.exports, controller);