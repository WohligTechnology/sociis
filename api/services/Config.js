/**
 * Plan.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

var mongoose = require('mongoose');
var Grid = require('gridfs-stream');
var fs = require("fs");
// var lwip = require("lwip");
var process = require('child_process');
var lodash = require('lodash');
// var json2xl = require('json2xl');
var MaxImageSize = 4096;

var gfs = Grid(mongoose.connections[0].db, mongoose);
gfs.mongo = mongoose.mongo;

var Schema = mongoose.Schema;
var schema = new Schema({
    name: String
});

module.exports = mongoose.model('Config', schema);

var models = {
    maxRow: 10,
    getForeignKeys: function (schema) {
        var arr = [];
        _.each(schema.tree, function (n, name) {
            if (n.key) {
                arr.push({
                    name: name,
                    ref: n.ref,
                    key: n.key
                });
            }
        });
        return arr;
    },
    checkRestrictedDelete: function (Model, schema, data, callback) {

        var values = schema.tree;
        var arr = [];
        var ret = true;
        _.each(values, function (n, key) {
            if (n.restrictedDelete) {
                arr.push(key);
            }
        });

        Model.findOne({
            "_id": data._id
        }, function (err, data2) {
            if (err) {
                callback(err, null);
            } else if (data2) {
                _.each(arr, function (n) {
                    if (data2[n].length !== 0) {
                        ret = false;
                    }
                });
                callback(null, ret);
            } else {
                callback("No Data Found", null);
            }
        });
    },

    manageArrayObject: function (Model, id, data, key, action, callback) {
        if (id) {
            Model.findOne({
                "_id": id
            }, function (err, data2) {
                if (err) {
                    callback(err, null);
                } else if (data2) {
                    switch (action) {
                        case "create":
                            {
                                data2[key].push(data);
                                // data2[key] = _.unique(data2[key]);
                                // console.log(data2[key]);
                                data2.update(data2, {
                                    w: 1
                                }, callback);
                            }
                            break;
                        case "delete":
                            {
                                _.remove(data2[key], function (n) {
                                    return (n + "") == (data + "");
                                });
                                data2.update(data2, {
                                    w: 1
                                }, callback);
                            }
                            break;
                    }
                } else {

                    callback("No Data Found for the ID" + " " + id + " " + data + " " + key + " " + action, null);
                }
            });
        } else {
            callback(null, "Done");
        }



    },
    GlobalCallback: function (err, data, res) {
        if (err) {
            res.json({
                error: err,
                value: false
            });
        } else {
            res.json({
                data: data,
                value: true
            });
        }
    },
    //Config push notification
    sendPushNotification: function (data, callback) {
        if (data.deviceId && data.deviceId.length > 0) {
            var message = {
                //app_id: sails.oneSignalAppId,  
                app_id: "41050fa0-9f31-4d69-b774-1e501f79cbfa",
                contents: {
                    "en": data.message
                },
                content_available: true,
                //large_icon: sails.imageLink + data.user.profilePicture,
                // ios_badgeType: "SetTo",
                // ios_badgeCount: data.countForIos,
                //android_group: "Travel-" + data.groupId,
                // android_message: {
                //     "en": "You have $[notif_count] new messages"
                // },
                include_player_ids: data.deviceId
            };
            // if (data.image) {
            //     message["ios_attachments"] = {
            //         "_id1": sails.imageLink + data.image
            //     };
            //     message["big_picture"] = sails.imageLink + data.image;
            // }
            var headers = {
                "Content-Type": "application/json",
                //"Authorization": sails.authorizationHeader
                "Authorization": "NGU2ODI5Y2UtOGQ2NC00NzI5LTk0OTItMmRiZmYxM2M1ODVh"
            };
            request.post({
                url: "https://onesignal.com/api/v1/notifications",
                json: message,
                headers: headers,
            }, function (err, http, body) {
                if (err) {
                    // console.log(err, null);
                    callback(err, null);
                } else {
                    callback(null, "Done");
                }
            });
        } else {
            callback(null, "Done");
        }
    },

    generateExcel: function (name, found, res) {
        name = _.kebabCase(name);
        var excelData = [];
        _.each(found, function (singleData, num) {
            var singleExcel = {};
            _.each(singleData, function (n, key) {
                var ckey = _.capitalize(key);
                if (key != "__v" && key != "createdAt" && key != "updatedAt") {
                    // if (num === 0) {
                    //     // console.log(typeof n);
                    //     if (typeof n == "object") {
                    //         // console.log(n);
                    //     }

                    // }

                    if (_.isArray(n)) {
                        if (num === 0) {
                            // console.log("As Array");
                        }
                        _.each(n, function (m, index) {
                            if (_.isPlainObject(m)) {
                                _.each(m, function (k, index2) {

                                    singleExcel[ckey + "[" + index + "][" + index2 + "]"] = m;
                                });
                            } else {
                                singleExcel[ckey + "[" + index + "]"] = m;
                            }
                        });

                    } else if (_.isPlainObject(n)) {
                        if (num === 0) {
                            // console.log("As Object");
                        }
                        _.each(n, function (m, index) {
                            singleExcel[ckey + "[" + index + "]"] = m;
                        });
                    } else {
                        if (num === 0) {
                            // console.log("As Other");
                        }
                        // singleExcel[_.capitalize(key)] = n;
                        singleExcel[(key)] = n;
                    }
                    // if (num === 0) {
                    //     // console.log("-----------------------");
                    // }
                }
            });
            excelData.push(singleExcel);
        });
        var xls = json2xls(excelData);
        var folder = "./.tmp/";
        var path = name + "-" + moment().format("MMM-DD-YYYY-hh-mm-ss-a") + ".xlsx";
        var finalPath = folder + path;
        fs.writeFile(finalPath, xls, 'binary', function (err) {
            if (err) {
                res.callback(err, null);
            } else {
                fs.readFile(finalPath, function (err, excel) {
                    if (err) {
                        res.callback(err, null);
                    } else {
                        res.set('Content-Type', "application/octet-stream");
                        res.set('Content-Disposition', "attachment;filename=" + path);
                        res.send(excel);
                        fs.unlink(finalPath);
                    }
                });
            }
        });

    },
    downloadWithName: function (filename, name, res) {
        res.set('Content-Disposition', "filename=" + name);
        var readstream = gfs.createReadStream({
            filename: filename
        });
        readstream.on('error', function (err) {
            res.json({
                value: false,
                error: err
            });
        });
        var onlyName = filename.split(".")[0];
        var extension = filename.split(".").pop();
        readstream.pipe(res);
        //error handling, e.g. file does not exist
    },
    generatePdf: function (page, obj, callback, res, custom, notValid) {
        obj = _.assign(obj, env);
        if (!obj.assignmentName) {
            obj.assignmentName = "1198-1703-0523";
        }
        sails.hooks.views.render(page, obj, function (err, html) {
            if (err) {
                callback(err);
            } else {
                var id = mongoose.Types.ObjectId();
                var newFilename = id + ".pdf";
                var writestream = gfs.createWriteStream({
                    filename: newFilename
                });
                writestream.on('finish', function () {
                    if (res) {
                        // res.set('Content-Disposition', "filename=" + filename);
                        // res.send(newFilename)
                    } else {
                        callback(null, {
                            name: newFilename,
                            url: global["env"].realHost + "/api/downloadWithName/" + newFilename
                        });
                    }
                });

                var config = {
                    // Export options 
                    "directory": "/tmp",
                    "format": "A4", // allowed units: A3, A4, A5, Legal, Letter, Tabloid 
                    "orientation": "portrait", // portrait or landscape 
                    // File options 
                    "type": "pdf", // allowed file types: png, jpeg, pdf 
                    "timeout": 30000, // Timeout that will cancel phantomjs, in milliseconds 
                    "footer": {
                        "height": "0.5cm",
                    },
                };
                if (custom === true) {
                    if (notValid === true) {
                        config.header = {
                            "height": "0.1cm"
                        }
                    }
                    // Page options 
                    config.border = {
                        "top": "1cm", // default is 0, units: mm, cm, in, px 
                        "right": "2cm",
                        "bottom": "1cm",
                        "left": "2cm"
                    };
                } else if (notValid == true) {
                    config.header = {
                        "height": "0.1cm"
                    }
                    // Page options 
                    config.border = {
                        "top": "1.9cm", // default is 0, units: mm, cm, in, px 
                        "right": "1cm",
                        "bottom": "1cm",
                        "left": "2.5cm"
                    };
                } else {
                    // Page options 
                    config.border = {
                        "top": "2cm", // default is 0, units: mm, cm, in, px 
                        "right": "1cm",
                        "bottom": "1cm",
                        "left": "2.5cm"
                    };
                }
                // console.log('config : ', config);
                pdf.create(html, config).toStream(function (err, stream) {
                    // console.log(err);
                    // console.log("Chinatn");
                    if (err) {
                        callback(err);
                    } else {
                        // console.log("In Config To generate PDF");
                        stream.pipe(writestream);
                    }

                });
            }

        });
    },
    onlyGeneratePdf: function (page, obj, callback, res, custom) {
        obj = _.assign(obj, env);
        if (!obj.assignmentName) {
            obj.assignmentName = "1198-1703-0523";
        }
        sails.hooks.views.render(page, obj, function (err, html) {
            if (err) {
                callback(err);
            } else {
                var id = mongoose.Types.ObjectId();
                var newFilename = id + ".pdf";
                var writestream = gfs.createWriteStream({
                    filename: newFilename
                });
                writestream.on('finish', function () {
                    if (res) {
                        // res.set('Content-Disposition', "filename=" + filename);
                        // res.send(newFilename)
                    } else {
                        callback(null, {
                            name: newFilename,
                            url: global["env"].realHost + "/api/downloadWithName/" + newFilename
                        });
                    }
                });

                var config = {
                    // Export options 
                    "directory": "/tmp",
                    "format": "A4", // allowed units: A3, A4, A5, Legal, Letter, Tabloid 
                    "orientation": "portrait", // portrait or landscape 
                    // File options 
                    "type": "pdf", // allowed file types: png, jpeg, pdf 
                    "timeout": 30000, // Timeout that will cancel phantomjs, in milliseconds 
                    "footer": {
                        "height": "0.5cm",
                    },
                    "header": {
                        "height": "1cm",
                    },
                };
                if (custom !== true) {
                    // Page options 
                    config.border = {
                        "top": "2cm", // default is 0, units: mm, cm, in, px 
                        "right": "1cm",
                        "bottom": "1cm",
                        "left": "2.5cm"
                    };
                } else {
                    // Page options 
                    config.border = {
                        "top": "1cm", // default is 0, units: mm, cm, in, px 
                        "right": "2cm",
                        "bottom": "1cm",
                        "left": "2cm"
                    };
                }
                // console.log('config : ', config);
                pdf.create(html, config).toStream(function (err, stream) {
                    // console.log(stream);
                    // console.log(err);
                    // console.log("Chinatn");
                    if (err) {
                        callback(err);
                    } else {
                        // console.log("In Config To generate PDF");
                        stream.pipe(writestream);
                    }

                });
            }

        });
    },

    emailTo: function (data, callback) {
        var sg = require('sendgrid')("");

        if (_.isEmpty(data.cc)) {
            var personalizations = [{
                to: data.email,
                subject: data.subject
            }]
        } else {
            var personalizations = [{
                to: data.email,
                cc: data.cc,
                subject: data.subject
            }]
        }
        var request = sg.emptyRequest({
            method: 'POST',
            path: '/v3/mail/send',
            body: {
                personalizations: personalizations,
                from: data.from,
                content: [{
                    type: 'text/html',
                    value: "<h1>Absolute Surveyors</h1>",
                }]
                // attachments: attachments
            },
        });

        sg.API(request, function (error, response) {
            if (error) {
                callback(null, error);
                // console.log('Error response received');
            } else {
                // console.log(response.statusCode)
                // console.log(response.body)
                // console.log(response.headers)
                callback(null, response);
            }
        });
    },
    uploadFile: function (filename, callback) {
        var id = mongoose.Types.ObjectId();
        var extension = filename.split(".").pop();
        extension = extension.toLowerCase();
        if (extension == "jpeg") {
            extension = "jpg";
        }
        var newFilename = id + "." + extension;

        var writestream = gfs.createWriteStream({
            filename: newFilename
        });
        writestream.on('finish', function () {
            callback(null, {
                name: newFilename
            });
            fs.unlink(filename);
        });
        writestream.on('error', function (err) {
            callback(err);
        });

        var imageStream = fs.createReadStream(filename);

        if (extension == "png" || extension == "jpg" || extension == "gif") {
            Jimp.read(filename, function (err, image) {
                if (err) {
                    callback(err, null);
                } else {
                    if (image.bitmap.width > MaxImageSize || image.bitmap.height > MaxImageSize) {
                        image.scaleToFit(MaxImageSize, MaxImageSize).quality(60).getBuffer(Jimp.AUTO, function (err, imageBuf) {
                            var bufferStream = new stream.PassThrough();
                            bufferStream.end(imageBuf);
                            bufferStream.pipe(writestream);
                        });
                    } else {
                        image.quality(60).getBuffer(Jimp.AUTO, function (err, imageBuf) {
                            var bufferStream = new stream.PassThrough();
                            bufferStream.end(imageBuf);
                            bufferStream.pipe(writestream);
                        });
                    }

                }

            });
        } else {
            imageStream.pipe(writestream);
        }


    },

    readUploaded: function (filename, width, height, style, res) {
        res.set({
            'Cache-Control': 'public, max-age=31557600',
            'Expires': new Date(Date.now() + 345600000).toUTCString()
        });
        var readstream = gfs.createReadStream({
            filename: filename
        });
        readstream.on('error', function (err) {
            res.json({
                value: false,
                error: err
            });
        });
        var buf;
        var newNameExtire;
        var bufs = [];
        var proceedI = 0;
        var wi;
        var he;
        readstream.on('data', function (d) {
            bufs.push(d);
        });
        readstream.on('end', function () {
            buf = Buffer.concat(bufs);
            proceed();
        });


        function proceed() {
            proceedI++;
            if (proceedI === 2) {
                Jimp.read(buf, function (err, image) {
                    if (err) {
                        res.callback(err, null);
                    } else {
                        if (style === "contain" && width && height) {
                            image.contain(width, height).getBuffer(Jimp.AUTO, writer2);
                        } else if (style === "cover" && (width && width > 0) && (height && height > 0)) {
                            image.cover(width, height).getBuffer(Jimp.AUTO, writer2);
                        } else if ((width && width > 0) && (height && height > 0)) {
                            image.resize(width, height).getBuffer(Jimp.AUTO, writer2);
                        } else if ((width && width > 0) && !(height && height > 0)) {
                            image.resize(width, Jimp.AUTO).getBuffer(Jimp.AUTO, writer2);
                        } else {
                            image.resize(Jimp.AUTO, height).getBuffer(Jimp.AUTO, writer2);
                        }
                    }
                });
            }
        }

        function writer2(err, imageBuf) {
            var writestream2 = gfs.createWriteStream({
                filename: newNameExtire,
            });
            var bufferStream = new stream.PassThrough();
            bufferStream.end(imageBuf);
            bufferStream.pipe(writestream2);
            res.send(imageBuf);
        }

        function read2(filename2) {
            var readstream2 = gfs.createReadStream({
                filename: filename2
            });
            readstream2.on('error', function (err) {
                res.json({
                    value: false,
                    error: err
                });
            });
            readstream2.pipe(res);
        }
        var onlyName = filename.split(".")[0];
        var extension = filename.split(".").pop();
        if ((extension == "jpg" || extension == "png" || extension == "gif") && ((width && width > 0) || (height && height > 0))) {
            //attempt to get same size image and serve
            res.set('Content-Type', "image/jpeg");
            var newName = onlyName;
            if (width > 0) {
                newName += "-" + width;
            } else {
                newName += "-" + 0;
            }
            if (height) {
                newName += "-" + height;
            } else {
                newName += "-" + 0;
            }
            if (style && (style == "contain" || style == "cover")) {
                newName += "-" + style;
            } else {
                newName += "-" + 0;
            }
            newNameExtire = newName + "." + extension;
            gfs.exist({
                filename: newNameExtire
            }, function (err, found) {
                if (err) {
                    res.json({
                        value: false,
                        error: err
                    });
                }
                if (found) {
                    read2(newNameExtire);
                } else {
                    proceed();
                }
            });
            //else create a resized image and serve
        } else {
            readstream.pipe(res);
        }
        //error handling, e.g. file does not exist
    },

};
module.exports = _.assign(module.exports, models);