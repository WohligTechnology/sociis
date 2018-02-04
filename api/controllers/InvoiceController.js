module.exports = _.cloneDeep(require("sails-wohlig-controller"));
var controller = {
    getCustomerProductDetailsAccordingToInvoices: function (req, res) {
        Invoice.getCustomerProductDetailsAccordingToInvoices(req.body, res.callback);
    },
    sendSms: function (req, res) {
        Config.sendSms(req.body, function (err, smsRespo) {
            if (err) {
                res.callback(null, "Hi");
            } else if (smsRespo) {
                res.callback(null, "Hi1");
            } else {
                res.callback(null, "Hi2");
            }
        });
    },
    createInvoice: function (req, res) {
        async.waterfall([
                function (callback) { //Invoice 
                    req.model.generateInvoiceNumber(req.body, function (err, invoiceNumber) {
                        if (err) {
                            callback(err, null);
                        } else {
                            req.body.name = invoiceNumber;
                            if (req.body.paymentMethod == "Cash") {
                                req.body.status = "Paid";
                            } else {
                                req.body.status = "Pending";
                            }
                            req.model.saveData(req.body, function (err, data) {
                                if (err) {
                                    callback(err, null);
                                } else {
                                    callback(null, data);
                                }
                            });
                        }
                    });
                },
                function (data, callback) { // Payment
                    var paymentObj = {
                        name: "",
                        shop: req.body.shop,
                        employee: req.body.employee,
                        customer: req.body.customer,
                        amount: req.body.total,
                        invoice: []
                    };
                    paymentObj.invoice.push(data._id);
                    if (req.body.paymentMethod == "Cash") {
                        Payment.generatePaymentNumber(req.body, function (err, name) {
                            if (err) {
                                callback(err, null);
                            } else {
                                paymentObj.name = name;
                                Payment.saveData(paymentObj, function (err, data) {
                                    if (err) {
                                        callback(err, null);
                                    } else {
                                        callback(null, data);
                                    }
                                });
                            }
                        });
                    } else {
                        callback(null, data);
                    }
                },
                function (data, callback) { //Shop
                    Shop.findOne({
                        _id: req.body.shop
                    }, function (err, name) {
                        if (err) {
                            callback(err, null);
                        } else {
                            async.eachSeries(name.items, function (item, callback) {

                                _.each(req.body.invoiceList, function (n, key) {
                                    if (item.item == n.itemId) {
                                        if (n.unit == "grm") {
                                            item.quantity = item.quantity - (n.quantity / 1000);
                                        } else {
                                            item.quantity = item.quantity - n.quantity;
                                        }
                                    }
                                });
                                callback();
                            }, function () {
                                Shop.update({
                                    _id: name.id
                                }, name, function (err, updated) {
                                    if (err) {
                                        callback(null, data);
                                    } else {
                                        callback(null, data);
                                    }
                                });
                            });
                        }
                    });
                },
                function (data, callback) { //Customer
                    var customerData = {
                        type: req.body.paymentMethod,
                        _id: req.body.customer._id,
                        amount: req.body.total
                    };
                    Customer.upDateCustomerOnCreateInvoice(customerData, function (err, name) {
                        if (err) {
                            callback(err, null);
                        } else {
                            callback(null, name);
                        }
                    });
                },
                function (customer, callback) { // SMS
                    if (customer.mobile && req.body.total > 50) {
                        var content = "Dear " + customer.name + ", your Current Bill = " + req.body.total + ".";
                        if (customer.creditExhausted) {
                            content = content + " Your Total Pending Bill = " + customer.creditExhausted + ".";
                        }
                        content = content + " Thank You !!!";
                        var smsObj = {
                            content: content,
                            mobile: customer.mobile
                        };
                        Config.sendSms(smsObj, function (err, smsRespo) {
                            if (err) {
                                console.log("1");
                                callback(null, "Hi");
                            } else if (smsRespo) {
                                console.log("2");
                                callback(null, "Hi1");
                            } else {
                                console.log("3");
                                callback(null, "Hi2");
                            }
                        });
                    } else {
                        callback(null, customer);
                    }
                }
            ],
            function (err, results) {
                if (err) {
                    res.callback(err, null);
                } else {
                    res.callback(null, results);
                }
            });
    },
    generateSalesRegisterExcel: function (req, res) {
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
    getInvoiceApprovalList: function (req, res) {
        if (req.body) {
            req.model.getInvoiceApprovalList(req.body, res.callback);

        } else {
            res.json({
                value: false,
                data: "Invalid Request"
            });
        }
    },
    getAll: function (req, res) {
        if (req.body) {
            req.model.getAll(req.body, res.callback, req.user);
        } else {
            res.json({
                value: false,
                data: "Invalid Request"
            });
        }
    },
    invoiceEditData: function (req, res) {
        if (req.body) {
            req.model.invoiceEditData(req.body, res.callback);
        } else {
            res.json({
                value: false,
                data: "cannot generate Invoice"
            });
        }
    },

};
module.exports = _.assign(module.exports, controller);