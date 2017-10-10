module.exports = _.cloneDeep(require("sails-wohlig-controller"));
var controller = {
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
                                console.log("data", err, data);
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
                                        callback(null, data)
                                    }
                                });
                            }
                        });
                    } else {
                        callback(null, data);
                    }

                },
                function (data, callback) {
                    var customerData = {
                        type: req.body.paymentMethod,
                        _id: req.body.customer._id,
                        amount: req.body.total
                    };
                    Customer.upDateCustomer(customerData, function (err, name) {
                        if (err) {
                            callback(err, null);
                        } else {
                            callback(null, data);
                        }
                    });
                }
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
    saveInvoiceDraft: function (req, res) {
        if (req.body) {
            var invoice = _.cloneDeep(req.body.invoice);
            var assignment = req.body.assignment;
            res.calcTax(req.body, function (err, data) {
                if (data != null) {
                    invoice = data;

                    var dateNow = moment().toDate();
                    if (req.body.type == "Create") {
                        invoice.createdBy = req.body.createdBy;
                        invoice.assignment = req.body.assignment._id;
                        invoice.approvalStatus = "Draft";
                    }
                    var timeline = {
                        _id: assignment._id,
                        timeline: req.body.timeline
                    }
                    invoice.draftTimeStamp = dateNow; // Captures Last Modifieds
                    async.parallel([
                            function (callback1) {
                                Invoice.saveData(invoice, function (err, savedInvoiceData) {
                                    if (err) {
                                        callback1(false)
                                    } else {
                                        if (req.body.type == "Create") {
                                            assignment.invoice.push(savedInvoiceData._id);
                                            Assignment.saveData(assignment, function (err, savedAssignmentData) {
                                                if (err) {
                                                    callback1(false)
                                                } else {
                                                    callback1(null, "Success In Invoice and Assignment");
                                                }
                                            });
                                        } else {
                                            callback1(null, "Success in Invoice");
                                        }
                                    }
                                });
                            }
                        ],
                        function (err, results) {
                            if (err) {
                                res.callback(err, null);
                            } else {
                                var newData = {
                                    data: results,
                                    value: true
                                }
                                res.callback(null, newData);
                            }
                        });
                } else {
                    res.json({
                        value: false,
                        data: "cannot generate Invoice"
                    });
                }
            });
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
    rejectInvoice: function (req, res) {
        if (req.body) {
            var timelineData = {
                title: "Invoice " + req.body.invoiceNumber + " Rejected",
                invoiceNumber: req.body.invoiceNumber,
                type: "Normal",
                employee: req.body.employee,
                message: req.body.message
            }
            var invoiceData = {
                _id: req.body.invoiceId
            }
            var assignment2 = {
                _id: req.body.assignment._id,
                timeline: timelineData
            }

            async.parallel([
                    function (callback1) {
                        Invoice.deleteData(invoiceData, function (err, saveInvoice) {
                            if (err) {
                                callback1(false)
                            } else {
                                callback1(null, "Success In Invoice");
                            }
                        });
                    },
                    function (callback1) {
                        Timeline.appendChat(assignment2, function (err, saveInvoice) {
                            if (err) {
                                callback1(false)
                            } else {
                                callback1(null, "Success In Timeline");
                            }
                        });
                    },
                    function (callback1) {
                        Assignment.saveData(req.body.assignment, function (err, assignementResp) {
                            if (err) {
                                callback1(false);
                            } else {
                                callback1(null, "Success In Assignment Save");
                            }
                        });
                    }
                ],
                function (err, results) {
                    if (err) {
                        res.callback(err, null);
                    } else {
                        res.callback(null, results);
                    }
                });
        } else {
            res.json({
                value: false,
                data: "Invalid Request"
            });
        }
    },
    regenerateInvoice: function (req, res) {
        if (req.body) {
            res.calcTax(req.body, function (err, data) {
                if (data != null) {
                    req.body.invoice = data;
                    var timelineData = {
                        title: "Invoice " + req.body.invoice.invoiceNumber + " sent back for Regeneration",
                        invoiceNumber: req.body.invoice.invoiceNumber,
                        type: "Normal",
                        employee: req.body.employee,
                        message: req.body.message
                    }
                    var assignment2 = {
                        _id: req.body.assignmentId,
                        timeline: timelineData
                    }
                    async.parallel([
                            function (callback1) {
                                Invoice.saveData(req.body.invoice, function (err, saveInvoice) {
                                    if (err) {
                                        callback1(err)
                                    } else {
                                        callback1(null, "Success In Invoice");
                                    }
                                });
                            },
                            function (callback1) {
                                Timeline.appendChat(assignment2, function (err, saveInvoice) {
                                    if (err) {
                                        callback1(err)
                                    } else {
                                        callback1(null, "Success In Timeline");
                                    }
                                });
                            }
                        ],
                        function (err, results) {
                            if (err) {
                                res.callback(err, null);
                            } else {
                                res.callback(null, results);
                            }
                        });
                } else {
                    res.json({
                        value: false,
                        data: "cannot generate Invoice"
                    });
                }
            });
        } else {
            res.json({
                value: false,
                data: "Invalid Request"
            });
        }
    },
    reviseInvoice: function (req, res) {
        if (req.body) {
            wholeObj = {
                invoice: req.body.invoiceData,
                assignment: req.body.assignment
            }
            res.calcTax(wholeObj, function (err, data) {
                if (data != null) {
                    req.body.invoiceData = data;
                    var timelineData = {
                        attachment: [],
                        title: "Invoice " + req.body.invoiceData.invoiceNumber + " revised",
                        invoiceNumber: req.body.invoiceData.invoiceNumber,
                        type: "File",
                        employee: req.body.employee,
                        message: req.body.message
                    }
                    var assignment2 = {
                        _id: req.body.assignmentId,
                        timeline: timelineData
                    }
                    var o1 = {
                        users: req.body.users
                    };
                    var assignment = {
                        assignment: req.body.assignmentId
                    }
                    var o2 = {
                        accessToken: req.body.accessToken
                    };
                    var invoiceData = Object.assign(req.body.invoiceData, o1, o2);
                    Assignment.generateInvoicePdf(invoiceData, function (err, invoiceDatareturn) {
                        if (err) {
                            res.callback("create PDF failed", null);
                        } else {
                            invoiceData.file = invoiceDatareturn.name;
                            assignment2.timeline.attachment.push(invoiceDatareturn.name);
                            async.parallel([
                                    function (callback1) {
                                        Invoice.saveData(invoiceData, function (err, saveInvoice) {
                                            if (err) {
                                                callback1(false)
                                            } else {
                                                callback1(null, "Success In Invoice");
                                            }
                                        });
                                    },
                                    function (callback1) {
                                        Customer.saveData(req.body.billedTo, function (err, saveInvoice) {
                                            if (err) {
                                                callback1(false)
                                            } else {
                                                callback1(null, "Success In Customer");
                                            }
                                        });
                                    },
                                    function (callback1) {
                                        Timeline.appendChat(assignment2, function (err, saveInvoice) {
                                            if (err) {
                                                callback1(false)
                                            } else {
                                                callback1(null, "Success In Timeline");
                                            }
                                        });
                                    }
                                ],
                                function (err, results) {
                                    if (err) {
                                        res.callback(err, null);
                                    } else {
                                        res.callback(null, results);
                                    }
                                });
                        }
                    });
                } else {
                    res.json({
                        value: false,
                        data: "cannot generate Invoice"
                    });
                }
            });
        } else {
            res.json({
                value: false,
                data: "Invalid Request"
            });
        }
    },
    cancelInvoice: function (req, res) {
        if (req.body) {
            Invoice.getOne({
                _id: req.body._id
            }, function (err, data) {
                if (err) {
                    res.callback(err, null);
                } else {
                    var invoiceData = data;
                    invoiceData.approvalStatus = "Cancelled";
                    var billedTo = {
                        _id: invoiceData.billedTo._id,
                        creditLimitExhausted: invoiceData.billedTo.creditLimitExhausted - invoiceData.grandTotal
                    }
                    async.parallel([
                            function (callback1) {
                                Invoice.saveData(invoiceData, function (err, saveInvoice) {
                                    if (err) {
                                        callback1(err)
                                    } else {
                                        callback1(null, "Success In Invoice");
                                    }
                                });
                            },
                            function (callback1) {
                                Customer.saveData(billedTo, function (err, saveCustomer) {
                                    if (err) {
                                        callback1(err)
                                    } else {
                                        callback1(null, "Success In Customer");
                                    }
                                });
                            }
                        ],
                        function (err, results) {
                            if (err) {
                                res.callback(err, null);
                            } else {
                                res.callback(null, results);
                            }
                        });
                }
            })
        }
    },
    calAmtAfterBilledToChange: function () {
        $scope.formData.total = 0;
        $scope.formData.grandTotal = 0;
        // $scope.formData.invoiceList[index].amount = a * b;
        _.each($scope.formData.invoiceList, function (n) {
            if (!isNaN(n.amount)) {
                $scope.formData.total = $scope.formData.total + n.amount;
            }
        })
        $scope.formData.grandTotal = $scope.formData.total;
        _.each($scope.formData.tax, function (n) {
            n.amount = n.percent * $scope.formData.total / 100;
            $scope.formData.grandTotal = n.amount + $scope.formData.grandTotal;
        })
        var round = $scope.formData.grandTotal - Math.floor($scope.formData.grandTotal);
        $scope.formData.grandTotal = $scope.formData.grandTotal - round;
        $scope.formData.roundOff = round.toFixed(2);
    },
};
module.exports = _.assign(module.exports, controller);