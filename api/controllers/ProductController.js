/**
 * CountryController
 *
 * @description :: Server-side logic for managing countries
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */
module.exports = _.cloneDeep(require("sails-wohlig-controller"));
var controller = {
    import: function (req, res) {
        var xlsx = require('node-xlsx').default;
        var jsonExcel = xlsx.parse("./demo.xlsx");
        var retVal = [];
        var excelDataToExport = _.slice(jsonExcel[0].data, 1);
        async.eachSeries(excelDataToExport, function (n, callback) {
            Industry.getIdByName({
                name: n[0]
            }, function (err, data) {
                if (err) {
                    retVal.push(err);
                    callback(null, data3);
                } else {
                    Category.getIdByName({
                        industry: data,
                        name: n[1]
                    }, function (err, data2) {
                        if (err) {
                            retVal.push(err);
                            callback(null, data3);
                        } else {
                            Product.getIdByName({
                                industry: data,
                                category: data2,
                                name: n[2]
                            }, function (err, data3) {
                                if (err) {
                                    retVal.push(err);
                                    callback(null, data3);
                                } else {
                                    retVal.push(data3);
                                    callback(null, data3);
                                }
                            });

                        }
                    });

                }
            });
        }, function (err, data) {
            if (err) {
                callback(err, data);
            } else {
                res.json({
                    total: retVal.length,
                    value: retVal
                });
            }
        });
    },
    populateProductDetails: function (req, res) {
        if (req.body) {
            Product.populateProductDetails(req.body, res.callback);
        } else {
            res.json({
                value: false,
                data: {
                    message: "Invalid Request"
                }
            })
        }
    }
};
module.exports = _.assign(module.exports, controller);