var Grid = require('gridfs-stream');
var fs = require("fs");
var gfs = Grid(mongoose.connections[0].db, mongoose);
gfs.mongo = mongoose.mongo;

module.exports = _.cloneDeep(require("sails-wohlig-controller"));
var controller = {
    loginFacebook: function (req, res) {
        passport.authenticate('facebook', {
            scope: ['public_profile', 'user_friends', 'email'],
            failureRedirect: '/'
        }, res.socialLogin)(req, res);
    },
    loginGoogle: function (req, res) {
        if (req.query.returnUrl) {
            //console.log(req.query);
            req.session.returnUrl = req.query.returnUrl;
            //console.log(req.session);
        } else {

        }

        passport.authenticate('google', {
            scope: ['openid', 'profile', 'email', "https://mail.google.com/", "https://www.googleapis.com/auth/gmail.readonly", "https://www.googleapis.com/auth/gmail.compose", "https://www.googleapis.com/auth/gmail.send", "https://www.googleapis.com/auth/gmail.insert", "https://www.googleapis.com/auth/gmail.labels", "https://www.googleapis.com/auth/gmail.modify", "https://www.googleapis.com/auth/gmail.settings.basic", "https://www.googleapis.com/auth/gmail.settings.sharing", "https://www.googleapis.com/auth/calendar"],
            failureRedirect: '/'
        }, res.socialLogin)(req, res);
    },
    profile: function (req, res) {
        if (req.body && req.body.accessToken) {
            User.profile(req.body, res.callback);
        } else {
            res.callback("Please provide Valid AccessToken", null);
        }
    },
    listEmail: function (req, res) {
        var pageToken = "";
        if (req.body.nextPageToken) {
            pageToken = "&pageToken=" + req.body.nextPageToken;
        }
        var search = "";
        if (req.body.search) {
            search = "&q=" + req.body.search;
        }
        var labelIds = "";
        if (req.body.labelIds) {
            labelIds = "&labelIds=" + req.body.labelIds;
        }

        var obj = {
            body: {
                url: "messages",
                other: "&maxResults=10" + pageToken + search,
                labelIds: labelIds,
                method: "GET"
            },
            user: req.user
        };
        User.gmailCall(obj, function (err, data) {
            if (err) {
                res.callback(err);
            } else {
                async.each(data.messages, function (n, callback) {
                    var obj = {
                        body: {
                            url: "messages/" + n.id,
                            other: "&format=metadata",
                            labelIds: labelIds,
                            method: "GET"
                        },
                        user: req.user
                    };
                    User.gmailCall(obj, function (err, data2) {
                        if (err) {
                            callback(err);
                        } else {
                            n.detail = data2;
                            callback();
                        }
                    });
                }, function (err) {
                    if (err) {
                        res.callback(err);
                    } else {
                        res.callback(err, data);
                    }
                });
            }

        });
    },
    detailEmail: function (req, res) {
        var obj = {
            body: {
                url: "messages/" + req.body.messageId,
                method: "GET",
                // other: "&format=raw"
            },
            user: req.user
        };
        User.gmailCall(obj, res.callback);
    },


    sendEmail: function (req, res) {
        // //console.log("mail", req.body);
        // //console.log("req.user", req.user);
        if (_.isEmpty(req.body.threadId)) {
            req.body.threadId = "";
        }

        var obj = {
            body: {
                url: "messages/send",
                method: "POST"
            },
            user: req.user
        };

        var rawData =
            "From: " + req.user.officeEmail + "\r\n" +
            "To: " + req.body.to + "\r\n" +
            "Cc: " + req.body.cc + "\r\n" +
            "Bcc: " + req.body.bcc + "\r\n" +
            "Subject: " + req.body.subject + "\r\n" +
            "Content-Type: text/html; charset=UTF-8\r\n" +
            "Content-Transfer-Encoding: QUOTED-PRINTABLE\r\n" +
            "Content-Disposition: inline\r\n\r\n" +
            "" + req.body.message + "";

        var rawDataProcessed = btoa(rawData).replace(/\+/g, '-').replace(/\//g, '_');
        obj.form = {
            raw: rawDataProcessed,
            threadId: req.body.threadId
        };
        // //console.log("obj  = ", obj);
        User.gmailCall(obj, function (err, threadData) {
            if (err) {
                res.callback(err, null);
            } else {
                if (req.body.mailType == "updateThreadId") {
                    if (threadData.threadId) {
                        var formData = {};
                        formData._id = req.body._id;
                        formData.threadId = threadData.threadId;
                        //console.log("threadData", formData);
                        Assignment.updateThreadId(formData, res.callback);
                    } else {
                        res.callback(null, threadData);
                    }
                } else {
                    res.callback(null, threadData);
                }

            }
        });
    },

    sendEmails: function (req, res) {

        //Attachment files
        var files = req.files;
        var att = [];
        var attachment = "";
        getAttachments_(files);

        function getAttachments_(files) {
            var files = ["58df550390366f15f5c74274.jpg"];

            _.each(files, function (values) {
                // //console.log("files : ", values);
                var callAPI = {
                    url: 'http://wohlig.io/api/upload/readFile?file=' + values,
                    method: "POST"
                };


                // //console.log("callAPI : ", callAPI);
                request(callAPI, function (err, httpResponse, body) {
                    // var filesData = fs.createWriteStream(body);
                    // //console.log("files stream , ",filesData);
                    if (err) {
                        res.callback(err);
                    } else if (body) {
                        var attachment =
                            "\r\n" +
                            "Content-Type: " + mime.lookup(values) + '; name="' + values + '"' +
                            'Content-Disposition: attachment; filename="' + values + '"' +
                            "Content-Transfer-Encodsing: base64" + "\r\n" +
                            base64url.encode((new Buffer(body).toString())) + "";
                        // //console.log("attachment : ", attachment);
                    } else {
                        res.callback("No Data found");
                    }
                });
            });

            setTimeout(function () {
                return attachment;
            }, 2000);
        }



        // //console.log("mail", req.body);
        // //console.log("req.user", req.user);
        if (_.isEmpty(req.body.threadId)) {
            req.body.threadId = ""
        }

        var obj = {
            body: {
                url: "messages/send",
                method: "POST"
            },
            user: req.user
        };

        var rawData =
            "From: " + req.user.officeEmail + "\r\n" +
            "To: " + req.body.to + "\r\n" +
            "Cc: " + req.body.cc + "\r\n" +
            "Bcc: " + req.body.bcc + "\r\n" +
            "Subject: " + req.body.subject + "\r\n" +
            "Content-Type: text/html; charset=UTF-8\r\n" +
            "Content-Transfer-Encoding: QUOTED-PRINTABLE\r\n" +
            "Content-Disposition: inline\r\n\r\n" +
            "" + req.body.message + "" + attachment;
        // //console.log("rawData : ", rawData);

        var rawDataProcessed = btoa(rawData).replace(/\+/g, '-').replace(/\//g, '_');
        obj.form = {
            raw: rawDataProcessed,
            threadId: req.body.threadId
        };

        obj.attachment = true;
        // //console.log("obj  = ", obj);
        User.gmailCallWithAttachment(obj, function (err, threadData) {
            if (err) {
                res.callback(err, null);
            } else {
                if (req.body.mailType == "updateThreadId") {
                    if (threadData.threadId) {
                        var formData = {};
                        formData._id = req.body._id;
                        formData.threadId = threadData.threadId;
                        //console.log("threadData", formData);
                        Assignment.updateThreadId(formData, res.callback);
                    } else {
                        res.callback(null, threadData);
                    }
                } else {
                    res.callback(null, threadData);
                }

            }
        });
    },

    getAttachment: function (req, res) {
        var obj = {
            body: {
                url: "messages/" + req.query.messageId + "/attachments/" + req.query.attachmentId,
                method: "GET"
            },
            user: req.user
        };
        User.gmailCall(obj, function (err, data) {
            if (err) {
                res.callback(err, data);
            } else {
                res.setHeader('Content-Disposition', 'attachment; filename=' + req.query.fileName);
                res.setHeader('Content-Type', 'application/octet-stream; name=' + req.query.fileName);
                res.send(base64url.toBuffer(data.data));
            }
        });
    },

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
    backupDatabase: function (req, res) {
        res.connection.setTimeout(2000000000000000);
        req.connection.setTimeout(2000000000000000);
        var q = req.host.search("127.0.0.1");
        if (q >= 0) {
            _.times(20, function (n) {
                var name = moment().subtract(2 + n, "days").format("ddd-Do-MMM-YYYY");
                //console.log(name);
                exec("cd backup && rm -rf " + name + "*", function (err, stdout, stderr) {});
            });
            res.callback("Rest of Files Deleted and the current one will be generated Now.");
            var jagz = _.map(mongoose.models, function (Model, key) {
                var name = Model.collection.collectionName;
                return {
                    key: key,
                    name: name,
                };
            });
            jagz.push({
                "key": "fs.chunks",
                "name": "fs.chunks"
            }, {
                "key": "fs.files",
                "name": "fs.files"
            });
            var isBackup = fs.existsSync("./backup");
            if (!isBackup) {
                fs.mkdirSync("./backup");
            }
            var mom = moment();
            var folderName = "./backup/" + mom.format("ddd-Do-MMM-YYYY-HH-mm-SSSSS");
            var retVal = [];
            fs.mkdirSync(folderName);
            async.eachSeries(jagz, function (obj, callback) {
                exec("mongoexport --port " + port + " --username " + username + " --password " + password + " --db " + database + " --collection " + obj.name + " --out " + folderName + "/" + obj.name + ".json", function (data1, data2, data3) {
                    retVal.push(data3 + " VALUES OF " + obj.name + " MODEL NAME " + obj.key);
                    callback();
                });
            }, function () {
                res.json(retVal);
            });
        } else {
            res.callback("Access Denied for Database Backup");
        }
    },
    generateEmailPdf: function (req, res) {
        var $scope = {};
        var obj = {
            body: {
                url: "messages/" + req.body.messageId,
                method: "GET",
                // other: "&format=raw"
            },
            user: req.user
        };
        User.gmailCall(obj, function (err, data) {
            if (err) {
                res.callback(err, data);
            } else {
                $scope.email = data;

                $scope.email.attachment = [];
                switch ($scope.email.payload.mimeType) {
                    case "multipart/related":
                        {
                            _.each($scope.email.payload.parts, function (data) {
                                if (data.mimeType == "multipart/alternative") {
                                    _.each(data.parts, function (data2) {
                                        if (data2.mimeType == "text/html") {
                                            $scope.email.body = data2.body.data;
                                        }
                                    });

                                }
                                if (data.filename !== "") {
                                    $scope.email.attachment.push(data);
                                }
                            });
                        }
                        break;
                    case "multipart/mixed":
                        {
                            _.each($scope.email.payload.parts, function (data) {
                                if (data.mimeType == "multipart/alternative") {
                                    _.each(data.parts, function (data2) {
                                        if (data2.mimeType == "text/html") {
                                            $scope.email.body = data2.body.data;
                                        }
                                    });

                                }
                                if (data.filename !== "") {
                                    $scope.email.attachment.push(data);
                                }
                            });
                        }
                        break;

                    case "multipart/alternative":
                        {
                            _.each($scope.email.payload.parts, function (data) {

                                if (data.mimeType == "text/html") {
                                    $scope.email.body = data.body.data;
                                }

                            });
                        }
                        break;
                    case "text/html":
                        {
                            $scope.email.body = $scope.email.payload.body.data;
                        }
                        break;
                }

                function getFromHeader(input) {
                    var obj = _.filter($scope.email.payload.headers, function (n) {
                        return n.name == input;
                    });
                    if (obj.length == 0) {
                        return "Unknown";
                    } else {
                        return obj[0].value;
                    }
                }


                $scope.email.date = getFromHeader("Date");
                $scope.email.date = moment($scope.email.date).format('llll');
                $scope.email.subject = getFromHeader("Subject");
                $scope.email.from = getFromHeader("From");
                $scope.email.to = getFromHeader("To");
                $scope.email.cc = getFromHeader("Cc");
                $scope.email.deliveredTo = getFromHeader("Delivered-To");
                $scope.email.body = base64url.decode($scope.email.body);
                //console.log("Email attachment.................................", $scope.email.body);
                Config.generatePdf("pdf/abs-emailer", $scope, res.callback);
            }
        });


    },
    check: function (req, res) {
        console.log(req.baseUrl);
    }
};
module.exports = _.assign(module.exports, controller);