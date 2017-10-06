module.exports = function (wholeObj, callback) {
    var req = this.req;
    var res = this.res;
    var sails = req._sails;
    Tax.find({}).lean().exec(function (err, data) {
        if (err || _.isEmpty(data)) {
            callback(null, null);
        } else {
            var tax = [];
            _.each(data, function (taxObj, key) {
                if (moment(new Date(Date.now())).isBetween(moment(new Date(taxObj.fromDate)), moment(new Date(taxObj.toDate)))) {
                    tax.push(taxObj);
                }
            });
            if (wholeObj.invoice.approvalTime || wholeObj.invoice.approvalStatus == "Approved" || wholeObj.invoice.approvalStatus == "Revised") {
                wholeObj.invoice.tax = wholeObj.invoice.tax;
            } else {
                wholeObj.invoice.tax = tax;
            }
            Customer.getOne({
                _id: wholeObj.invoice.billedTo._id
            }, function (err, data) {
                if (err) {
                    callback(null, null);
                } else {
                    if (data.customerCompany.hasGST) {
                        if (data.customerCompany.GSTINByState.length > 0) {
                            var hasGST = false;
                            _.each(data.customerCompany.GSTINByState, function (n) {
                                if (n.state.name == data.city.district.state.name) {
                                    if (n.GST != "" || n.GST != undefined) {
                                        hasGST = true;
                                    }
                                }
                            });
                            if (hasGST) {
                                var GSTType;
                                var customerState = data.city.district.state;
                                if (wholeObj.assignment.companyState._id == customerState._id) {
                                    GSTType = "intraState";
                                    _.each(wholeObj.invoice.tax, function (n) {
                                        if (n.intraStatePercent || n.intraStatePercent == 0) {
                                            n.percent = n.intraStatePercent;
                                        }
                                    });
                                } else {
                                    GSTType = "interState";
                                    _.each(wholeObj.invoice.tax, function (n) {
                                        if (n.interStatePercent || n.interStatePercent == 0) {
                                            n.percent = n.interStatePercent;
                                        }
                                    });
                                }
                                wholeObj.invoice.subTotal = 0;
                                wholeObj.invoice.grandTotal = 0;
                                _.each(wholeObj.invoice.invoiceList, function (n) {
                                    if (!isNaN(n.amount)) {
                                        wholeObj.invoice.subTotal = wholeObj.invoice.subTotal + n.amount;
                                    }
                                })
                                wholeObj.invoice.grandTotal = wholeObj.invoice.subTotal;
                                _.each(wholeObj.invoice.tax, function (n) {
                                    n.amount = n.percent * wholeObj.invoice.subTotal / 100;
                                    wholeObj.invoice.grandTotal = n.amount + wholeObj.invoice.grandTotal;
                                })
                                var round = wholeObj.invoice.grandTotal - Math.round(wholeObj.invoice.grandTotal);
                                wholeObj.invoice.grandTotal = wholeObj.invoice.grandTotal - round;
                                wholeObj.invoice.roundOff = round.toFixed(2);
                                callback(null, wholeObj.invoice);
                            } else {
                                callback(null, null);
                            }
                        } else {
                            callback(null, null);
                        }
                    } else {
                        var GSTType;
                        var customerState = data.city.district.state;
                        if (wholeObj.assignment.companyState._id == customerState._id) {
                            GSTType = "intraState";
                            _.each(wholeObj.invoice.tax, function (n) {
                                if (n.intraStatePercent || n.intraStatePercent == 0) {
                                    n.percent = n.intraStatePercent;
                                }
                            });
                        } else {
                            GSTType = "interState";
                            _.each(wholeObj.invoice.tax, function (n) {
                                if (n.interStatePercent || n.interStatePercent == 0) {
                                    n.percent = n.interStatePercent;
                                }
                            });
                        }
                        wholeObj.invoice.subTotal = 0;
                        wholeObj.invoice.grandTotal = 0;
                        _.each(wholeObj.invoice.invoiceList, function (n) {
                            if (!isNaN(n.amount)) {
                                wholeObj.invoice.subTotal = wholeObj.invoice.subTotal + n.amount;
                            }
                        })
                        wholeObj.invoice.grandTotal = wholeObj.invoice.subTotal;
                        _.each(wholeObj.invoice.tax, function (n) {
                            n.amount = n.percent * wholeObj.invoice.subTotal / 100;
                            wholeObj.invoice.grandTotal = n.amount + wholeObj.invoice.grandTotal;
                        })
                        var round = wholeObj.invoice.grandTotal - Math.round(wholeObj.invoice.grandTotal);
                        wholeObj.invoice.grandTotal = wholeObj.invoice.grandTotal - round;
                        wholeObj.invoice.roundOff = round.toFixed(2);
                        callback(null, wholeObj.invoice);
                    }

                }
            })
        }
    })
};