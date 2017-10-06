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
        var jsonExcel = xlsx.parse("./location.xlsx");
        // console.log(jsonExcel[0].data);
        // res.json(jsonExcel[0].data);
        var retVal = [];
        var excelDataToExport = _.slice(jsonExcel[0].data, 1);
        async.eachSeries(excelDataToExport, function (n, callback) {
            n = _.map(n, function (m) {
                var b = _.capitalize(_.trim(m));
                return b;
            });
            Country.getIdByName({
                name: n[0],
                countryCode: n[1],
                ISDCodes: n[2],
            }, function (err, data) {
                if (err) {
                    retVal.push(err);
                    callback(null, data);
                } else {
                    Zone.getIdByName({
                        country: data,
                        name: n[3]
                    }, function (err, data2) {
                        if (err) {
                            retVal.push(err);
                            callback(null, data2);
                        } else {
                            State.getIdByName({
                                country: data,
                                zone: data2,
                                name: n[4]
                            }, function (err, data3) {
                                if (err) {
                                    retVal.push(err);
                                    callback(null, data3);
                                } else {
                                    District.getIdByName({
                                        country: data,
                                        zone: data2,
                                        state: data3,
                                        name: n[5]
                                    }, function (err, data4) {
                                        if (err) {
                                            retVal.push(err);
                                            callback(null, data4);
                                        } else {
                                            if (n.length === 9) {
                                                City.getIdByName({
                                                    country: data,
                                                    zone: data2,
                                                    state: data3,
                                                    district: data4,
                                                    name: n[6],
                                                    stdCode: n[7],
                                                    timezone: n[8]
                                                }, function (err, data5) {
                                                    if (err) {
                                                        retVal.push(err);
                                                        callback(null, data5);
                                                    } else {
                                                        retVal.push(data5);
                                                        callback(null, data5);
                                                    }
                                                });
                                            }
                                            if (n.length === 8) {
                                                //console.log("Lengtn -1");
                                                City.getIdByName({
                                                    country: data,
                                                    zone: data2,
                                                    state: data3,
                                                    district: data4,
                                                    name: n[5],
                                                    stdCode: n[6],
                                                    timezone: n[7]
                                                }, function (err, data5) {
                                                    if (err) {
                                                        retVal.push(err);
                                                        callback(null, data5);
                                                    } else {
                                                        data5 = data5 + " +1";
                                                        retVal.push(data5);
                                                        callback(null, data5);
                                                    }
                                                });
                                            }

                                        }
                                    });
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

    populateCityDetails: function (req, res) {
        if (req.body) {
            City.populateCityDetails(req.body, res.callback);
        } else {
            res.json({
                value: false,
                data: {
                    message: "Invalid Request"
                }
            })
        }
    },

    getAll: function (req, res) {
        if (req.body) {
            City.getAll(req.body, res.callback);
        } else {
            res.json({
                value: false,
                data: {
                    message: "Invalid Request"
                }
            })
        }
    },
    generateCityExcel: function (req, res) {
        JsonStore.findOne({
            _id: req.query.id
        }).lean().exec(function (err, data) {
            if (err || _.isEmpty(data)) {
                res.badRequest();
            } else {
                req.model.generateCityExcel(data.json, res.callback, res);
            }
        });
    },

};
module.exports = _.assign(module.exports, controller);