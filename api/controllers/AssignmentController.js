/**
 * CountryController
 *
 * @description :: Server-side logic for managing countries
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */
module.exports = _.cloneDeep(require("sails-wohlig-controller"));
var controller = {
    getPerson: function (req, res) {
        if (req.body) {
            req.model.getPerson(req.body, res.callback);

        } else {
            res.json({
                value: false,
                data: "Invalid Request"
            });
        }
    },
    getMRNumbers: function (req, res) {
        if (req.body) {
            req.model.getMRNumbers(req.body, res.callback, req.user);

        } else {
            res.json({
                value: false,
                data: "Invalid Request"
            });
        }
    },
    getMRNames: function (req, res) {
        if (req.body) {
            req.model.getMRNames(req.body, res.callback, req.user);
        } else {
            res.json({
                value: false,
                data: "Invalid Request"
            });
        }
    },
    generateInvoicePdf: function (req, res) {
        if (req.body) {
            req.model.generateInvoicePdf(req.body, res.callback);
        } else {
            res.json({
                value: false,
                data: "Invalid Request"
            });
        }
    },
    getNearestSurveyor: function (req, res) {
        if (req.body) {
            req.model.getNearestSurveyor(req.body, res.callback);
        } else {
            res.json({
                value: false,
                data: "Invalid Request"
            });
        }
    },
    updateSurveyor: function (req, res) {
        if (req.body) {
            req.model.updateSurveyor(req.body, function (err, mailData) {
                Assignment.getEmailsData(mailData, function (err, allData) {
                    if (err) {
                        callback(err, null);
                    } else {
                        if (_.isEmpty(allData)) {
                            callback("No mail data found!", null);
                        } else {
                            var emailsData = {};
                            emailsData = allData;
                            emailsData.user = req.user;
                            Assignment.sendEmails(emailsData, function (err, threadData) {
                                if (err) {
                                    res.callback(err, null);
                                } else {
                                    if (_.isEmpty(threadData)) {
                                        res.callback("No mail data found!", null);
                                    } else {
                                        threadData._id = mailData[2];
                                        Assignment.updateThreadId(threadData, res.callback);
                                    }
                                }
                            });
                        }
                    }
                });

            });
        } else {
            res.json({
                value: false,
                data: "Invalid Request"
            });
        }
    },
    decline: function (req, res) {
        if (req.body) {
            req.model.decline(req.body, res.callback);
        } else {
            res.json({
                value: false,
                data: "Invalid Request"
            });
        }
    },
    mobileSubmit: function (req, res) {
        if (req.body) {
            req.model.mobileSubmit(req.body, res.callback);
        } else {
            res.json({
                value: false,
                data: "Invalid Request"
            });
        }
    },
    editSurvey: function (req, res) {
        if (req.body) {
            req.model.editSurvey(req.body, res.callback);
        } else {
            res.json({
                value: false,
                data: "Invalid Request"
            });
        }
    },
    taskList: function (req, res) {
        if (req.body) {
            req.model.taskList(req.body, res.callback);
        } else {
            res.json({
                value: false,
                data: "Invalid Request"
            });
        }
    },
    taskListCompleted: function (req, res) {
        if (req.body) {
            req.model.taskListCompleted(req.body, res.callback);
        } else {
            res.json({
                value: false,
                data: "Invalid Request"
            });
        }
    },
    searchOnlyForInvoice: function (req, res) {
        if (req.body) {
            req.model.searchOnlyForInvoice(req.body, res.callback);
        } else {
            res.json({
                value: false,
                data: "Invalid Request"
            });
        }
    },
    setGlobalAssignmentStatusForMigration: function (req, res) {
        if (req.body) {
            req.model.setGlobalAssignmentStatusForMigration(req.body, res.callback);
        } else {
            res.json({
                value: false,
                data: "Invalid Request"
            });
        }
    },
    calcAssignmentStatusForInvoiceCreation: function (req, res) {
        if (req.body) {
            req.model.calcAssignmentStatusForInvoiceCreation(req.body, res.callback);
        } else {
            res.json({
                value: false,
                data: "Invalid Request"
            });
        }
    },
    modelSaveLogistic: function (req, res) {
        var dataAssignment = req.body;
        if (req.body.name) {
            var ids = [];
            _.each(req.body.name, function (val) {
                ids.push(val._id);
            });
            var matchObj = {
                ids: ids,
                outwardDate: dataAssignment.outwardDate,
                logistictype: dataAssignment.logistictype,
                sendTo: dataAssignment.sendTo,
                documentDetails: dataAssignment.documentDetails,
                courier: dataAssignment.courier,
                docketNumber: dataAssignment.docketNumber,
                docketDate: dataAssignment.docketDate
            }
            matchObj.getAllTaskStatus = req.body.getAllTaskStatus;
            if (req.body.timelineStatus == "BBND") {
                matchObj.getAllTaskStatus.dispatched = "Done";
            } else {
                matchObj.getAllTaskStatus.delivered = "Done";
                matchObj.by = dataAssignment.by;
                matchObj.recievedDate = dataAssignment.recievedDate;
                matchObj.recievedTime = dataAssignment.recievedTime;
                matchObj.remark = dataAssignment.remark;
            }
            req.model.calcGlobalAssignmentStatus(matchObj, function (err, newTimelineStatus) {
                if (err) {
                    res.json({
                        value: false,
                        data: "Invalid Request"
                    });
                } else {
                    matchObj.timelineStatus = newTimelineStatus;
                    Assignment.updateLogisticDetail(matchObj, function (err, updatedAssignment) {
                        if (err) {
                            res.callback(err);
                        } else {
                            res.callback(null, updatedAssignment);
                        }
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
    calcGlobalAssignmentStatus: function (req, res) {
        if (req.body) {
            req.model.calcGlobalAssignmentStatus(req.body, res.callback);
        } else {
            res.json({
                value: false,
                data: "Invalid Request"
            });
        }
    },
    getNearestSurveyor2: function (req, res) {
        if (req.body) {
            req.model.getNearestSurveyor2(req.body, res.callback);
        } else {
            res.json({
                value: false,
                data: "Invalid Request"
            });
        }
    },
    generateAssignmentNumber: function (req, res) {
        if (req.body) {
            req.model.generateAssignmentNumber(req.body, res.callback);

        } else {
            res.json({
                value: false,
                data: "Invalid Request"
            });
        }
    },
    getAssignmentApprovalList: function (req, res) {
        if (req.body) {
            req.model.getAssignmentApprovalList(req.body, res.callback);

        } else {
            res.json({
                value: false,
                data: "Invalid Request"
            });
        }
    },
    searchLogistic: function (req, res) {
        if (req.body) {
            req.model.searchLogistic(req.body, res.callback);

        } else {
            res.json({
                value: false,
                data: "Invalid Request"
            });
        }
    },
    getApprovalListLor: function (req, res) {
        if (req.body) {
            req.model.getApprovalListLor(req.body, res.callback);
        } else {
            res.json({
                value: false,
                data: "Invalid Request"
            });
        }
    },
    getApprovalListIla: function (req, res) {
        if (req.body) {
            req.model.getApprovalListIla(req.body, res.callback);
        } else {
            res.json({
                value: false,
                data: "Invalid Request"
            });
        }
    },
    updateNewSurveyor: function (req, res) {
        if (req.body) {
            req.model.updateNewSurveyor(req.body, res.callback);
        } else {
            res.json({
                value: false,
                data: "Invalid Request"
            });
        }
    },
    removeSurveyor: function (req, res) {
        if (req.body) {
            var timelineData = {
                title: "Surveyor " + req.body.surveyorName + " Rejected for Survey",
                type: "Normal",
                surveyor: req.body.formData.surveyId,
                employee: req.body.employee
            }
            var assignment2 = {
                _id: req.body.formData.assignId,
                timeline: timelineData
            }
            req.model.removeSurveyor(req.body.formData, function (err, removeSurveyorVar) {
                if (err) {
                    res.callback(false);
                } else {
                    Timeline.appendChat(assignment2, function (err, saveInvoice) {
                        if (err) {
                            res.callback(false);
                        } else {
                            res.callback(null, "Success In Timeline");
                        }
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
    submitApprovalForAccessButtons: function (req, res) {
        if (req.body) {
            var assignment = req.body.assignment;
            assignment.assignmentapprovalStatus = "Response AccessButton";
            assignment.users = req.body.users;
            assignment.accessToken = req.body.accessToken;
            assignment.waiverResTime = moment().toDate();
            var assignment2 = {
                _id: assignment._id,
                timeline: req.body.timelineData
            }
            Assignment.saveData(assignment, function (err, assignementResp) {
                if (err) {
                    res.callback(false);
                } else {
                    Timeline.appendChat(assignment2, function (err, timelineData) {
                        if (err) {
                            res.callback(false)
                        } else {
                            res.callback(null, "Success In Timeline");
                        }
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
    submitRequestForAccessButtons: function (req, res) {
        if (req.body) {
            var assignment = req.body.assignment;
            assignment.users = req.body.users;
            assignment.accessToken = req.body.accessToken;
            assignment.waiverReqTime = moment().toDate();
            var assignment2 = {
                _id: assignment._id,
                timeline: req.body.timelineData
            }
            Assignment.saveData(assignment, function (err, assignementResp) {
                if (err) {
                    res.callback(false);
                } else {
                    Timeline.appendChat(assignment2, function (err, timelineData) {
                        if (err) {
                            res.callback(false)
                        } else {
                            res.callback(null, "Success In Timeline");
                        }
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
    getSurveyorApprovalList: function (req, res) {
        if (req.body) {
            req.model.getSurveyorApprovalList(req.body, res.callback, req.user);

        } else {
            res.json({
                value: false,
                data: "Invalid Request"
            });
        }
    },
    saveTemplate: function (req, res) {
        if (req.body) {
            req.model.saveTemplate(req.body, res.callback);

        } else {
            res.json({
                value: false,
                data: "Invalid Request"
            });
        }
    },
    generateAssignmentNumberForAll: function (req, res) {
        if (req.body) {
            req.model.generateAssignmentNumberForAll(req.body, res.callback);
        } else {
            res.json({
                value: false,
                data: "Invalid Request"
            });
        }

    },
    setTimeStampForInvoice: function (req, res) {
        if (req.body) {
            req.model.setTimeStampForInvoice(req.body, res.callback);
        } else {
            res.json({
                value: false,
                data: "Invalid Request"
            });
        }

    },
    generateDataForGlobalStatus: function (req, res) {
        if (req.body) {
            req.model.generateDataForGlobalStatus(req.body, res.callback);
        } else {
            res.json({
                value: false,
                data: "Invalid Request"
            });
        }

    },
    getAssignmentTemplate: function (req, res) {
        if (req.body) {
            req.model.getAssignmentTemplate(req.body.type, req.body._id, res.callback);
        } else {
            res.json({
                value: false,
                data: "Invalid Request"
            });
        }
    },
    editAssignmentTemplate: function (req, res) {
        if (req.body) {
            req.model.editAssignmentTemplate(req.body, res.callback);
        } else {
            res.json({
                value: false,
                data: "Invalid Request"
            });
        }
    },
    CheckLr: function (req, res) {
        if (req.body) {
            req.model.CheckLr(req.body, res.callback);
        } else {
            res.json({
                value: false,
                data: "Invalid Request"
            });
        }
    },
    updateAllIntimatedLoss: function (req, res) {
        if (req.body) {
            req.model.updateAllIntimatedLoss(req.body, res.callback);
        } else {
            res.json({
                value: false,
                data: "Invalid Request"
            });
        }
    },

    updateAssignment: function (req, res) {
        if (req.body) {
            req.model.updateAssignment(req.body, res.callback);
        } else {
            res.json({
                value: false,
                data: "Invalid Request"
            });
        }
    },
    generateMRExcel: function (req, res) {
        req.model.generateMRExcel(req.query, res);
    },
    generateExcel: function (req, res) {
        JsonStore.findOne({
            _id: req.query.id
        }).lean().exec(function (err, data) {
            if (err || _.isEmpty(data)) {
                res.badRequest();
            } else {
                req.model.generateAssignmentExcel(data.json, res.callback, res, req.user);
            }
        });
    },
    generateStatusReport: function (req, res) {
        JsonStore.findOne({
            _id: req.query.id
        }).lean().exec(function (err, data) {
            if (err || _.isEmpty(data)) {
                res.badRequest();
            } else {
                req.model.generateStatusReport(data.json, res.callback, res, req.user);
            }
        });
    },
    getAll: function (req, res) {
        if (req.body) {
            var arr = [];
            if (!_.isEmpty(req.body.insurer)) {
                var newInsurer = _.cloneDeep(req.body.insurer);
                async.eachSeries(newInsurer, function (n, callback) {
                    Customer.getChildCustomer({
                        "_id": n
                    }, function (err, data2) {
                        if (err) {
                            callback();
                        } else {
                            arr = _.concat(arr, data2);
                            callback();
                        }
                    })
                }, function (err) {
                    if (err) {

                    } else {
                        _.each(arr, function (n) {
                            req.body.insurer.push(n);
                        });
                        req.body.insurer = _.uniq(req.body.insurer)
                        req.model.getAll(req.body, res.callback, req.user);
                    }
                });
            } else {
                req.model.getAll(req.body, res.callback, req.user);
            }
        } else {
            res.json({
                value: false,
                data: "Invalid Request"
            });
        }
    },
    getExpenditure: function (req, res) {
        if (req.body) {
            req.model.getExpenditure(req.body, res.callback);
        } else {
            res.json({
                value: false,
                data: "Invalid Request"
            });
        }
    },
    assignmentFilter: function (req, res) {
        if (req.body) {
            req.model.assignmentFilter(req.body, res.callback);
        } else {
            res.json({
                value: false,
                data: "Invalid Request"
            });
        }
    },
    updateOfficeId: function (req, res) {
        if (req.body) {
            req.model.updateOfficeId(req.body, res.callback);
        } else {
            res.json({
                value: false,
                data: "Invalid Request"
            });
        }
    },
    getAssignmentCreateMail: function (req, res) {
        if (req.body) {
            req.model.getAssignmentCreateMail(req.body, res.callback);
        } else {
            res.json({
                value: false,
                data: "Invalid Request"
            });
        }
    },
    getAssignmentMatchedData: function (req, res) {
        if (req.body) {
            req.model.getAssignmentMatchedData(req.body, res.callback);
        } else {
            res.json({
                value: false,
                data: "Invalid Request"
            });
        }
    },

    transferAssignment: function (req, res) {
        if (req.body) {
            // console.time('timer');
            // setTimeout(function () {
            //     console.timeEnd('timer');
            // }, 0);
            // console.log('req.body', req.body);
            var names = [];
            var ids = [];
            _.each(req.body.ids, function (val) {
                ids.push(val._id);
                names.push(val.name + "<br>");
            })
            var chat = {
                employee: req.body.employeeFrom._id,
                type: "Normal",
                title: "Transfered To " + req.body.employeeTo.name,
            }
            var emailData = {};
            emailData.newOwner = req.body.employeeTo.name;
            emailData.assignmentNames = names;
            emailData.ownerName = req.body.employeeFrom.name;
            emailData.ownerPhone = req.body.employeeFrom.officeMobile;
            emailData.ownerEmail = req.body.employeeFrom.officeEmail;
            emailData.to = [];
            emailData.to.push({
                name: req.body.employeeTo.name,
                email: req.body.employeeTo.officeEmail
            });
            emailData.cc = [];
            var mailData = [];
            mailData[0] = "Assignment Transfer";
            mailData[1] = emailData;
            mailData[2] = req.body.accessToken;
            mailData[3] = req.body.users.email;
            async.parallel({
                    assignments: function (callback1) {
                        Assignment.updateAssignmentOwner({
                            ids: ids,
                            employeeTo: req.body.employeeTo._id
                        }, function (err, updatedAssignment) {
                            if (err) {
                                callback1(err);
                            } else {
                                callback1(null, updatedAssignment);
                            }
                        });
                    },
                    timeline: function (callback1) {
                        Assignment.updateAssignmentTimeline({
                            ids: ids,
                            chat: chat
                        }, function (err, updatedTimeline) {
                            if (err) {
                                callback1(err);
                            } else {
                                callback1(null, updatedTimeline);
                            }
                        });
                    },
                    email: function (callback1) {
                        Assignment.getMailAndSendMail(mailData, function (err, assignementResp) {
                            if (err || _.isEmpty(assignementResp)) {
                                callback1(null, "Failure In Sending Email");
                            } else {
                                callback1(null, assignementResp);
                            }
                        });
                    }
                },
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

    replaceExcel: function (req, res) {
        var xlsx = require('node-xlsx').default;
        var jsonExcel = xlsx.parse("./replace.xls");
        jsonExcel = _.slice(jsonExcel[0].data, 1);
        var resValue = [];
        async.eachLimit(jsonExcel, 20, function (n, callback) {
            Assignment.findOne({
                name: _.trim(n[2])
            }).exec(function (err, data) {
                if (err || _.isEmpty(data)) {
                    resValue.push(err);
                    callback();
                } else {
                    data.name = _.trim(n[1]);
                    data.save(function (err, data2) {
                        callback();
                        if (err) {
                            resValue.push(err);
                        } else {
                            resValue.push(data2);
                        }
                    });
                }
            });
        }, function (err) {
            if (err) {
                res.callback(err);
            } else {
                res.callback(null, resValue);
            }
        });
    },

    sendEmailTo: function (req, res) {

        var mailData = {};
        mailData.email = [];
        mailData.from = {};
        mailData.cc = [];
        mailData.email = [{
                email: "priyank.parmar@wohlig.com",
                name: "Priyank Parmar"
            }]
            // mailData.cc = [{
            //    email: "priyank.parmar@wohlig.com",
            //     name: "Priyank Parmar"
            // }]
        mailData.from = {
            name: "Priyank Parmar",
            email: "priyank.parmar@wohlig.com"
        };
        //   mailData.filename = "sellerinspectionassign.ejs";
        mailData.subject = "Absolute surveyors";

        //Email to 
        Config.emailTo(mailData, function (err, emailRespo) {
            if (err) {
                res.callback(null, err);
            } else {
                res.callback(null, emailRespo);
                //  callback(null, doc);
            }
        });
    },

    sendEmailAttachment: function (req, res) {

        // var xoauth2 = require('xoauth2');
        //Attachment files
        var files = [];
        var imageData = {};
        var images = [];
        var image = getAttachments_(files);


        function getAttachments_(files) {
            var files = ["58df550390366f15f5c74274.jpg"];

            _.each(files, function (values) {
                var imageData = {
                    filename: values,
                    path: global["env"].realHost + '/api/upload/readFile?file=' + values
                };
                images.push(imageData);
            });

            setTimeout(function () {
                return images;
            }, 2000);

        }

        var attachments = [{
            filename: "58f6fcd81cf21319008c047c.png",
            path: global["env"].realHost + '/api/upload/readFile?file=58f6fcd81cf21319008c047c.png'
        }];
        // create reusable transporter object using the default SMTP transport
        var transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: 'priyank.parmar@wohlig.com',
                pass: 'Prriyyannk394'
            }
        });

        // setup email data with unicode symbols
        var mailOptions = {
            // from: '"' + req.user.name + '" <' + req.user.email + '>', // sender address
            from: '"Priyank Parmar" <priyank.parmar@wohlig.com>', // sender address
            to: 'priyank.parmar@wohlig.com', // list of receivers
            // reply_to: 'priyank.parmar@wohlig.com',
            subject: 'Hello ✔', // Subject line
            // text: 'Jai ho', // plain text body
            html: '<b>Gmail mail</b>', // html body
            attachments: attachments
        };

        // send mail with defined transport object
        transporter.sendMail(mailOptions, function (error, emailData) {
            if (error) {
                res.callback(error, null);
            } else {
                res.callback(null, emailData);
            }
        });
    },

    generateZip: function (req, res) {
        var JSZip = require("jszip");
        var type = req.query.type;
        var zip = new JSZip();
        var folder = "./.tmp/";
        var path = _.capitalize(type) + "-" + moment().format("MMM-DD-YYYY-hh-mm-ss-a") + ".zip";
        var finalPath = folder + path;
        var files = [];
        Assignment.findOne({
            _id: req.query.id
        }).lean().exec(function (err, assignementData) {
            if (err || _.isEmpty(assignementData)) {
                res.callback(err, assignementData);
            } else {
                if (type === "photos") {
                    files = assignementData.photos;
                } else if (type === "Documents") {
                    files = assignementData.docs;
                } else if (type === "jir") {
                    files = assignementData.jir;
                } else {
                    files = [];
                }

                async.eachSeries(files, function (image, callback) {
                    request(global["env"].realHost + '/api/upload/readFile?file=' + image.file).pipe(fs.createWriteStream(image.file)).on('finish', function (images) {
                        // JSZip generates a readable stream with a "end" event,
                        // but is piped here in a writable stream which emits a "finish" event.
                        fs.readFile(image.file, function (err, imagesData) {
                            if (err) {
                                res.callback(err, null);
                            } else {
                                //Remove image
                                fs.unlink(image.file);
                                // zip.file("file", content); ... and other manipulations
                                zip.file(image.file, imagesData);
                                callback();
                            }
                        });
                    });
                }, function () {
                    //Generate Zip file
                    zip.generateNodeStream({
                            type: 'nodebuffer',
                            streamFiles: true
                        })
                        .pipe(fs.createWriteStream(finalPath))
                        .on('finish', function (zipData) {
                            // JSZip generates a readable stream with a "end" event,
                            // but is piped here in a writable stream which emits a "finish" event.
                            fs.readFile(finalPath, function (err, zip) {
                                if (err) {
                                    res.callback(err, null);
                                } else {
                                    res.set('Content-Type', "application/octet-stream");
                                    res.set('Content-Disposition', "attachment;filename=" + path);
                                    res.send(zip);
                                    fs.unlink(finalPath);
                                }
                            });
                        });
                });

            }
        });

    },
    saveDraft: function (req, res) {
        if (req.body) {
            var assignment = req.body.assignment;
            var obj = {
                assignId: assignment._id,
                _id: req.body._id,
                approvalStatus: "Draft",
                reqtimestamp: moment().toDate(),
                type: req.body.type,
                users: req.body.users,
                accessToken: req.body.accessToken
            };
            if (req.body.approvalStatus == "Draft") {
                obj.approvalStatus = "Draft"
            } else {
                obj.approvalStatus = req.body.approvalStatus
            }
            var timeline = {
                _id: assignment._id,
                timeline: req.body.timelineData
            }
            if (req.body.approval) {
                async.parallel([
                        function (callback1) {
                            Assignment.editAssignmentTemplate(req.body, function (err, savedData) {
                                if (err) {
                                    callback1(false)
                                } else {
                                    callback1(null, "Success In Invoice");
                                }
                            });
                        },
                        function (callback1) {
                            Assignment.saveTemplate(obj, function (err, data) {
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
                            var newData = {
                                data: results,
                                value: true
                            }
                            res.callback(null, newData);
                        }
                    });
            } else {
                // 
                async.parallel([
                        function (callback1) {
                            Assignment.editAssignmentTemplate(req.body, function (err, savedData) {
                                if (err) {
                                    callback1(err)
                                } else {
                                    callback1(null, "Success In Invoice");
                                }
                            });
                        },
                        function (callback1) {
                            Assignment.saveTemplate(obj, function (err, data) {
                                if (err) {
                                    callback1(err)
                                } else {
                                    callback1(null, "Success In Template");
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
                // 
            }
        }
    },
    allDocsRecieved: function (req, res) {
        if (req.body) {
            var assignment = req.body.assignmentData;
            var assignment2 = {
                _id: assignment.assignId,
                timeline: req.body.timelineData
            }
            Assignment.saveTemplate(assignment, function (err, assignementResp) {
                if (err) {
                    res.callback(err);
                } else {
                    Timeline.appendChat(assignment2, function (err, timelineData) {
                        if (err) {
                            res.callback(err)
                        } else {
                            res.callback(null, "Success In Timeline");
                        }
                    });
                }
            });
        } else {
            res.json({
                value: false,
                data: "Invalid Request"
            })
        }
    },
    saveAndRegenerateIlaLor: function (req, res) {
        if (req.body) {
            emailType = "";
            var assignment = req.body.assignment;
            assignment.users = req.body.users;
            assignment.accessToken = req.body.accessToken;
            var formData = req.body.formData;
            formData.approvalStatus = "Regenerate";
            var timelineData = {
                employee: req.body.employee,
                title: req.body.type + " " + assignment.name + " rejected",
                type: "Normal",
                message: req.body.message
            }
            if (req.body.type == "ILA") {
                emailType = "ILA Back to Regenerate";
                _.each(assignment.templateIla, function (n, key) {
                    if (n._id == formData._id) {
                        assignment.templateIla[key] = formData;
                    }
                });
                timelineData.title = " ILA " + assignment.name + " sent back for regeneration";
            } else {
                emailType = "LOR Back to Regenerate";
                _.each(assignment.templateLor, function (n, key) {
                    if (n._id == formData._id) {
                        assignment.templateLor[key] = formData;
                    }
                });
                var count = assignment.templateLor.length - 1;
                if (count == 0) {
                    timelineData.title = "LOR sent back for regeneration";
                } else {
                    timelineData.title = "LOR Reminder " + count + " sent back for regeneration";
                }
            }
            var assignment2 = {
                _id: assignment._id,
                timeline: timelineData
            }
            async.parallel([
                    function (callback1) {
                        Assignment.saveData(assignment, function (err, assignementResp) {
                            if (err) {
                                callback1(err);
                            } else {
                                Timeline.appendChat(assignment2, function (err, timelineData) {
                                    if (err) {
                                        callback1(err)
                                    } else {
                                        callback1(null, "Success In Timeline");
                                    }
                                });
                            }
                        });
                    },
                    function (callback1) {
                        req.body.officeEmail = req.body.formData.officeEmail;
                        Assignment.getAssignmentMailData(emailType, req.body, function (err, assignementResp) {
                            if (err || _.isEmpty(assignementResp)) {
                                callback1(null, "Failure In Sending Email");
                            } else {
                                callback1(null, assignementResp);
                            }
                        });
                    }
                ],
                function (err, results) {
                    if (err) {
                        res.callback(err, null);
                    } else {
                        data = {
                            results: results,
                            value: true
                        }
                        res.callback(null, data);
                    }
                });
        }
    },
    sentIlaLorForApproval: function (req, res) {
        if (req.body) {
            var assignment = req.body.assignment;
            assignment.users = req.body.users;
            assignment.accessToken = req.body.accessToken;
            var formData = req.body.formData;
            var regeneration = false;
            if (formData.approvalStatus == "Regenerate") {
                regeneration = true;
            }
            formData.approvalStatus = "Pending";
            var timelineData = {
                employee: req.body.employee,
                title: req.body.type + " sent for authorization",
                type: "Normal"
            }
            if (req.body.type == "ILA") {
                // 
                // For Reserve Amount
                formData.reserveAmount = 0;
                _.each(formData.forms, function (n) {
                    if (n.name === "LIABILITY") {
                        _.each(n.items, function (items) {
                            if (items.name == "Reserve Amount") {
                                formData.reserveAmount = parseInt(items.field);
                            }
                        });
                    }
                    if (n.name === "ICICI CARGO ILA") {
                        _.each(n.items, function (items) {
                            if (items.name == "Liability exists - If Yes, recommend Reserve after deducting Policy excess, if any") {
                                formData.reserveAmount = parseInt(items.field);
                            }
                        });
                    }
                });
                // 
                var emailType = "ILA Send for Authorization";
                _.each(assignment.templateIla, function (n, key) {
                    if (n._id == formData._id) {
                        assignment.templateIla[key] = formData;
                    }
                });
                timelineData.title = " ILA " + assignment.name + " sent for authorization";
            } else {
                formData.received = 0;
                formData.pending = 0;
                _.each(formData.forms, function (n) {
                    _.each(n.items, function (items) {
                        if (items.isCheck) {
                            if (items.submit == "Received" || items.submit == "Waived") {
                                formData.received++;
                            }
                            if (items.submit == "Pending" || items.submit == "Partially Recieved") {
                                formData.pending++;
                            }
                        }
                    });
                });
                var emailType = "LOR Send Authorization";
                var firstLor = false
                _.each(assignment.templateLor, function (n, key) {
                    if (n._id == formData._id) {
                        firstLor = true;
                        assignment.templateLor[key] = formData;
                    }
                });
                if (firstLor == true) {
                    if (regeneration == true) {
                        var count = assignment.templateLor.length - 1;
                        if (count == 0) {
                            timelineData.title = "LOR sent for authorization";
                        } else {
                            timelineData.title = "LOR Reminder " + count + " sent for authorization";
                        }
                    } else {
                        timelineData.title = "LOR sent for authorization";
                    }
                } else {
                    var count = assignment.templateLor.length - 1;
                    timelineData.title = "LOR Reminder " + count + " sent for authorization";
                }
            }
            var assignment2 = {
                _id: assignment._id,
                timeline: timelineData
            }
            async.parallel([
                    function (callback1) {
                        if (req.body.type === "ILA") {
                            Assignment.updateAssignmentIla(assignment, function (err, assignementResp) {
                                if (err) {
                                    callback1(false);
                                } else {
                                    callback1(null, {
                                        change: assignementResp,
                                        assignment: assignment
                                    });
                                }
                            });
                        } else {
                            Assignment.updateAssignmentLor(assignment, function (err, assignementResp) {
                                if (err) {
                                    callback1(false);
                                } else {
                                    callback1(null, {
                                        change: assignementResp,
                                        assignment: assignment
                                    });
                                }
                            });
                        }

                    },
                    function (callback1) {
                        Timeline.appendChat(assignment2, function (err, timelineData) {
                            if (err) {
                                callback1(false)
                            } else {
                                callback1(null, "Success In Timeline");
                            }
                        });
                    },
                    function (callback1) {
                        req.body.officeEmail = req.body.formData.officeEmail;
                        Assignment.getAssignmentMailData(emailType, req.body, function (err, assignementResp) {
                            if (err || _.isEmpty(assignementResp)) {
                                callback1(null, "Failure In Sending Email");
                            } else {
                                callback1(null, assignementResp);
                            }
                        });
                    }
                ],
                function (err, results) {
                    if (err) {
                        res.callback(err, null);
                    } else {
                        data = {
                            results: results,
                            value: true
                        }
                        res.callback(null, data);
                    }
                });

        }
    },
    onlyLorForApproval: function (req, res) {
        if (req.body) {
            var assignment = req.body.assignment;
            async.parallel([
                    function (callback1) {
                        Assignment.saveData(assignment, function (err, data) {
                            if (err) {
                                callback1(false);
                            } else {
                                assignment = {
                                    _id: assignment._id,
                                    timeline: req.body.timelineData
                                }
                                Timeline.appendChat(assignment, function (err, saveInvoice) {
                                    if (err) {
                                        callback1(false)
                                    } else {
                                        callback1(null, "Success In Timeline");
                                    }
                                });
                            }
                        });
                    },
                    function (callback1) {
                        req.body.officeEmail = req.body.formData.officeEmail;
                        Assignment.getAssignmentMailData("LOR Send Authorization", req.body, function (err, assignementResp) {
                            if (err || _.isEmpty(assignementResp)) {
                                callback1(null, "Failure In Sending Email");
                            } else {
                                callback1(null, assignementResp);
                            }
                        });
                    }
                ],
                function (err, results) {
                    if (err) {
                        res.callback(err, null);
                    } else {
                        data = {
                            results: results,
                            value: true
                        }
                        res.callback(null, data);
                    }
                });

        }
    },
    ilaLorApproval: function (req, res) {
        if (req.body) {
            var assignment = req.body.assignment;
            if (req.body.type == "templateLor") {
                var emailType = "LOR Authorization";
                assignment.getAllTaskStatus.lor = "Done";
                if (assignment.getAllTaskStatus.lorTime == undefined) {
                    assignment.getAllTaskStatus.lorTime = moment().toDate();
                }
            } else {
                var emailType = "ILA Authorization";
                assignment.getAllTaskStatus.ila = "Done";
                if (assignment.getAllTaskStatus.ilaTime == undefined) {
                    assignment.getAllTaskStatus.ilaTime = moment().toDate();
                }
            }
            var obj = {
                file: "",
                assignId: req.body.assignment._id,
                _id: req.body._id,
                approvalStatus: "Approved",
                authTimestamp: moment().toDate(),
                type: req.body.type,
                users: req.body.users,
                accessToken: req.body.accessToken,
                getAllTaskStatus: assignment.getAllTaskStatus
            };
            async.parallel([
                    function (callback1) {
                        Assignment.editAssignmentTemplate(req.body, function (err, savedData) {
                            if (err) {
                                callback1(false);
                            } else {
                                obj.file = savedData.name;
                                Assignment.saveTemplate(obj, function (err, data) {
                                    if (err) {
                                        callback1(false);
                                    } else {
                                        var timeline = req.body.timelineData
                                        timeline.attachment.push(obj.file);
                                        assignment = {
                                            _id: assignment._id,
                                            timeline: req.body.timelineData
                                        }
                                        Timeline.appendChat(assignment, function (err, saveInvoice) {
                                            if (err) {
                                                callback1(false)
                                            } else {
                                                callback1(null, "Success In Timeline");
                                            }
                                        });
                                    }
                                });
                            }
                        });
                    },
                    function (callback1) {
                        Assignment.getAssignmentMailData(emailType, req.body, function (err, assignementResp) {
                            if (err || _.isEmpty(assignementResp)) {
                                callback1(null, "Failure In Sending Email");
                            } else {
                                callback1(null, assignementResp);
                            }
                        });
                    }
                ],
                function (err, results) {
                    if (err) {
                        res.callback(err, null);
                    } else {
                        data = {
                            results: results,
                            value: true
                        }
                        res.callback(null, data);
                    }
                });

        }
    },
    rejectILALOR: function (req, res) {
        if (req.body) {
            var assignment = req.body.assignment;
            var timelineData = {
                employee: req.body.employee,
                title: req.body.type + " " + assignment.name + " rejected",
                type: "Normal",
                message: req.body.message
            }
            if (req.body.type == "ILA") {
                assignment.templateIla = _.dropRight(assignment.templateIla);
            } else {
                if (assignment.templateLor.length == 1) {
                    timelineData.title = req.body.type + " for " + assignment.name + " rejected";
                } else {
                    var number = assignment.templateLor.length - 1
                    timelineData.title = " " + req.body.type + " Reminder " + number + " rejected";
                }
                assignment.templateLor = _.dropRight(assignment.templateLor);
            }
            Assignment.saveData(assignment, function (err, assignementResp) {
                if (err) {
                    res.callback(err, null);
                } else {
                    var assignment2 = {
                        _id: assignment._id,
                        timeline: timelineData
                    }
                    Timeline.appendChat(assignment2, function (err, saveInvoice) {
                        if (err) {
                            res.callback(err, null);
                        } else {
                            res.callback(null, saveInvoice);
                        }
                    });
                }
            });
        }
    },
    surveyorSentForApproval: function (req, res) {
        if (req.body) {
            var assignment = {
                _id: req.body._id,
                survey: req.body.survey
            }
            var timelineData = {
                employee: req.body.survey.employee,
                title: "Surveyor Pending For Approval",
                event: "Acknowledgment Email",
                type: "Normal"
            }
            var timelineChat = {
                _id: req.body._id,
                timeline: timelineData
            }

            async.parallel([
                function (callback1) {
                    Assignment.updateSurveyor(assignment, function (err, savedData) {
                        if (err) {
                            callback1(err)
                        } else {
                            callback1(null, "Success In Assignment");
                        }
                    });
                },
                function (callback1) {
                    Timeline.appendChat(timelineChat, function (err, saveInvoice) {
                        if (err) {
                            callback1(err)
                        } else {
                            callback1(null, "Success In Timeline");
                        }
                    });
                },
                function (callback1) {
                    var data = {};
                    data.assignment = {
                        _id: req.body._id
                    }
                    data.users = {};
                    data.users.email = req.body.users.email;
                    Assignment.getAssignmentMailData("SBC For Approval", data, function (err, assignementResp) {
                        if (err || _.isEmpty(assignementResp)) {
                            callback1(err);
                        } else {
                            callback1(null, assignementResp);
                        }
                    });
                }
            ], res.callback);

        }
    },
    sbcApproval: function (req, res) {
        if (req.body) {
            var timelineData = {
                title: "Surveyor " + req.body.assignment.survey.employee.name + " Approved",
                type: "Normal",
                surveyor: req.body.assignment.survey.employee._id,
                employee: req.body.employee,
                isSurveyApproved: true
            }
            var assignment = req.body.assignment;
            assignment.getAllTaskStatus.surveyAssigned = "Done",
                assignment.getAllTaskStatus.surveyAssignedTime = Date.now();
            var obj = {
                assignId: req.body.assignment._id,
                threadId: req.body.assignment.threadId,
                _id: req.body.assignment.survey._id,
                approvalStatus: "Pending",
                type: "survey",
                approvalTime: Date.now(),
                getAllTaskStatus: assignment.getAllTaskStatus,
                users: req.body.users,
                accessToken: req.body.accessToken,
                timeline: timelineData
            }

            async.parallel([
                function (callback1) {
                    Assignment.saveTemplate(obj, function (err, data) {
                        if (err) {
                            callback1(err);
                        } else {
                            callback1(null, "Success In Assignment");
                        }
                    });
                },
                function (callback1) {
                    var chat = {
                        _id: assignment._id,
                        timeline: timelineData
                    }
                    Timeline.appendChat(chat, function (err, saveInvoice) {
                        if (err) {
                            callback1(err);
                        } else {
                            callback1(null, "Success In Timeline");
                        }
                    });
                },
                function (callback1) {
                    var data = {};
                    data.assignment = {
                        _id: req.body.assignment._id
                    }
                    data.users = {};
                    data.users.email = req.body.users.email;
                    Assignment.getAssignmentMailData("SBC Approves Surveyor", data, function (err, assignementResp) {
                        if (err || _.isEmpty(assignementResp)) {
                            callback1(err);
                        } else {
                            callback1(null, assignementResp);
                        }
                    });
                }
            ], res.callback);
        }
    },
    changeAssignmentApprovalStatus: function (req, res) {
        if (req.body) {
            var emailType = "";
            var setGlobalStatusflag = false;
            if (req.body.assignment.assignmentapprovalStatus === "Pending ForceClosed") {
                emailType = "Assignment Force Close Request";
            } else if (req.body.assignment.assignmentapprovalStatus === "ForceClosed") {
                emailType = "Assignment Force Close Approved";
                setGlobalStatusflag = true;
            } else if (req.body.assignment.assignmentapprovalStatus === "Cancelled ForceClosed") {
                emailType = "Assignment Force Close Rejected";
            } else if (req.body.assignment.assignmentapprovalStatus === "Pending ReOpened") {
                emailType = "Assignment Reopen Request";
            } else if (req.body.assignment.assignmentapprovalStatus === "ReOpened") {
                emailType = "Assignment Reopen Approved";
                setGlobalStatusflag = true;
            } else if (req.body.assignment.assignmentapprovalStatus === "Cancelled ReOpened") {
                emailType = "Assignment Reopen Rejected";
            } else if (req.body.assignment.assignmentapprovalStatus === "Pending OnHold") {
                emailType = "Assignment On Hold Request";
            } else if (req.body.assignment.assignmentapprovalStatus === "OnHold") {
                emailType = "Assignment On Hold Approved";
                setGlobalStatusflag = true;
            } else if (req.body.assignment.assignmentapprovalStatus === "Cancelled OnHold") {
                emailType = "Assignment On Hold Rejected";
            }
            async.parallel([
                    function (callback1) {
                        if (setGlobalStatusflag === true) {
                            Assignment.calcGlobalAssignmentStatus(req.body.assignment, function (err, setData) {
                                if (err) {
                                    callback1(false)
                                } else {
                                    req.body.assignment.timelineStatus = setData;
                                    Assignment.saveData(req.body.assignment, function (err, data) {
                                        if (err) {
                                            callback1(false)
                                        } else {
                                            var timeline = {
                                                _id: req.body.assignment._id,
                                                timeline: req.body.timeline
                                            }
                                            Timeline.appendChat(timeline, function (err, timeline) {
                                                if (err) {
                                                    callback1(false)
                                                } else {
                                                    callback1(null, "Success In Timeline");
                                                }
                                            });
                                        }
                                    });
                                }
                            });
                        } else {
                            Assignment.saveData(req.body.assignment, function (err, data) {
                                if (err) {
                                    callback1(false)
                                } else {
                                    var timeline = {
                                        _id: req.body.assignment._id,
                                        timeline: req.body.timeline
                                    }
                                    Timeline.appendChat(timeline, function (err, timeline) {
                                        if (err) {
                                            callback1(false)
                                        } else {
                                            callback1(null, "Success In Timeline");
                                        }
                                    });
                                }
                            });
                        }
                    },
                    function (callback1) {
                        Assignment.getAssignmentMailData(emailType, req.body, function (err, assignementResp) {
                            if (err || _.isEmpty(assignementResp)) {
                                callback1(null, "Failure In Sending Email");
                            } else {
                                callback1(null, assignementResp);
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
    },
    uploadAssessment: function (req, res) {
        if (req.body) {
            var assignment = req.body.assignment;
            _.each(req.body.arr, function (n) {
                var newData = {
                    file: n,
                    fileName: new Date(Date.now()),
                    employee: req.body.timelineData.employee
                }
                if (req.body.type == "assessment") {
                    assignment.assessment.push(newData);
                    assignment.getAllTaskStatus.assessment = "Done",
                        assignment.getAllTaskStatus.assessmentTime = Date.now();
                } else if (req.body.type == "consent") {
                    assignment.consent.push(newData);
                    assignment.getAllTaskStatus.consent = "Done",
                        assignment.getAllTaskStatus.consentTime = Date.now();
                } else
                if (req.body.type == "fsr") {
                    assignment.fsrs.push(newData);
                    assignment.getAllTaskStatus.fsr = "Done",
                        assignment.getAllTaskStatus.fsrTime = Date.now();
                }
            });

            Assignment.saveData(assignment, function (err, saveData) {
                if (err) {
                    res.callback(err);
                } else {
                    var newTimelineData = []
                    _.each(req.body.arr, function (n) {
                        var eachData = {
                            title: req.body.timelineData.title,
                            type: "File",
                            employee: req.body.timelineData.employee,
                            attachment: []
                        }
                        eachData.attachment.push(n);
                        newTimelineData.push(eachData)
                    });
                    var chat = {
                        _id: req.body.assignment._id,
                        timeline: newTimelineData
                    }

                    Timeline.appendChat(chat, res.callback);
                }
            });
        }
    },
    invoiceApproval: function (req, res) {
        if (req.body) {
            wholeObj = {
                invoice: req.body.invoiceData,
                assignment: req.body.newAssignment
            }
            res.calcTax(wholeObj, function (err, data) {
                if (data !== null) {
                    req.body.invoiceData = data;
                    var timeline = {};
                    var assignment = {
                            _id: req.body.invoiceData.assignment,
                            getAllTaskStatus: req.body.getAllTaskStatus,
                            timelineStatus: req.body.newAssignment.timelineStatus
                        }
                        // var invoiceData = req.body.invoiceData;
                    var timestamp = moment().toDate();
                    var o1 = {
                        users: req.body.users
                    };
                    var o2 = {
                        accessToken: req.body.accessToken
                    };
                    var invoiceData = Object.assign(req.body.invoiceData, o1, o2);
                    if (req.body.invoiceApproval) {
                        invoiceData.invoiceApproved = true;
                        assignment.getAllTaskStatus.invoice = "Done";
                        if (assignment.getAllTaskStatus.invoiceTime == undefined) {
                            assignment.getAllTaskStatus.invoiceTime = timestamp;
                        }
                        invoiceData.approvalTime = timestamp;
                        var timelineData = {
                            attachment: [],
                            type: "File",
                            viewEmailStatus: "true",
                            event: "Invoice Release",
                            employee: req.body.employee,
                            title: "Invoice " + invoiceData.invoiceNumber + " Authorized",
                            invoiceNumber: invoiceData.invoiceNumber
                        };
                        invoiceData.approvalStatus = "Approved";
                        //  Start Form Here For Process Only When invoiceApproval
                        invoiceData.saveStatus = true; // For Assignment id in Invoice While Creating Email.
                        Assignment.generateInvoicePdf(invoiceData, function (err, invoiceDatareturn) {
                            if (err) {
                                res.callback("create PDF failed", null);
                            } else {
                                invoiceData.file = invoiceDatareturn.name;
                                if (req.body.invoiceApproval) {
                                    timelineData.attachment.push(invoiceData.file);
                                }
                                var assignment2 = {
                                    _id: assignment._id,
                                    timeline: timelineData
                                }
                                Assignment.calcGlobalAssignmentStatus(assignment, function (err, newTimelineStatus) {
                                    if (err) {
                                        res.callback(err, null);
                                    } else {
                                        assignment.timelineStatus = newTimelineStatus;
                                    }
                                });
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
                                                    callback1(err)
                                                } else {
                                                    callback1(null, "Success In Timeline");
                                                }
                                            });
                                        },
                                        function (callback1) {
                                            Assignment.updateAssignmentInvoice(assignment, function (err, assignementResp) {
                                                if (err) {
                                                    callback1(false);
                                                } else {
                                                    callback1(null, "Success In Assignment Save");
                                                }
                                            });
                                        },
                                        function (callback1) {
                                            Assignment.getAssignmentMailData("Invoice Authorization", invoiceData, function (err, assignementResp) {
                                                if (err || _.isEmpty(assignementResp)) {
                                                    callback1(null, "Failure In Sending Email");
                                                } else {
                                                    callback1(null, assignementResp);
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
                        timelineData = {
                            attachment: [],
                            title: " Invoice " + invoiceData.invoiceNumber + " sent for authorization",
                            invoiceNumber: invoiceData.invoiceNumber,
                            type: "Normal",
                            employee: req.body.employee
                        }

                        invoiceData.reqtimestamp = timestamp;
                        invoiceData.saveStatus = true; // For Assignment id in Invoice While Creating Email.
                        var assignment2 = {
                                _id: assignment._id,
                                timeline: timelineData
                            }
                            // For Draft Check:
                        var o3 = {
                            invoiceApprovalStatus: invoiceData.approvalStatus
                        }
                        var generateInvoiceNumberObject = Object.assign(req.body.newAssignment, o3);
                        Invoice.generateInvoiceNumber(generateInvoiceNumberObject, function (err, invoiceNumber) {
                            if (err) {
                                res.callback(err, null);
                            } else {
                                if (invoiceData.approvalStatus == "Regenerated") {
                                    green(invoiceNumber);
                                    invoiceData.approvalStatus = "Pending";
                                    async.parallel([
                                            function (callback1) {
                                                Invoice.saveData(invoiceData, function (err, saveInvoice) {
                                                    if (err || _.isEmpty(saveInvoice)) {
                                                        callback1(false)
                                                    } else {
                                                        callback1(null, "Success In Invoice and Assignment");
                                                    }
                                                });
                                            },
                                            function (callback1) {
                                                assignment2.timeline.title = " Invoice " + invoiceData.invoiceNumber + " sent for authorization";
                                                Timeline.appendChat(assignment2, function (err, timelineData) {
                                                    if (err || _.isEmpty(timelineData)) {
                                                        callback1(false)
                                                    } else {
                                                        callback1(null, "Success In Timeline");
                                                    }
                                                });
                                            },
                                            function (callback1) {
                                                Assignment.getAssignmentMailData("Invoice Send Authorization", invoiceData, function (err, assignementResp) {
                                                    if (err || _.isEmpty(assignementResp)) {
                                                        callback1(null, "Failure In Sending Email");
                                                    } else {
                                                        callback1(null, assignementResp);
                                                    }
                                                });
                                            }
                                        ],
                                        function (err, results) {
                                            if (err) {
                                                res.callback(err, null);
                                            } else {
                                                data = {
                                                    invoiceNumber: invoiceData.invoiceNumber,
                                                    results: results
                                                }
                                                res.callback(null, data);
                                            }
                                        });
                                } else {
                                    invoiceData.invoiceNumber = invoiceNumber;
                                    invoiceData.approvalStatus = "Pending";
                                    async.parallel([
                                            function (callback1) {
                                                Invoice.saveData(invoiceData, function (err, saveInvoice) {
                                                    if (err || _.isEmpty(saveInvoice)) {
                                                        callback1(err)
                                                    } else {
                                                        Assignment.pushAssignmentInvoice({
                                                            _id: req.body.newAssignment._id,
                                                            invoice: saveInvoice._id
                                                        }, function (err, assignementResp) {
                                                            if (err || _.isEmpty(assignementResp)) {
                                                                callback1(err);
                                                            } else {
                                                                callback1(null, "Success In Invoice and Assignment");
                                                            }
                                                        });
                                                    }
                                                });
                                            },
                                            function (callback1) {
                                                assignment2.timeline.title = " Invoice " + invoiceNumber + " sent for authorization";
                                                Timeline.appendChat(assignment2, function (err, timelineData) {
                                                    if (err || _.isEmpty(timelineData)) {
                                                        callback1(err)
                                                    } else {
                                                        callback1(null, "Success In Timeline");
                                                    }
                                                });
                                            },
                                            function (callback1) {
                                                Assignment.getAssignmentMailData("Invoice Send Authorization", invoiceData, function (err, assignementResp) {
                                                    if (err || _.isEmpty(assignementResp)) {
                                                        callback1(err);
                                                    } else {
                                                        callback1(null, assignementResp);
                                                    }
                                                });
                                            }
                                        ],
                                        function (err, results) {
                                            if (err) {
                                                res.callback(err, null);
                                            } else {
                                                data = {
                                                    invoiceNumber: invoiceNumber,
                                                    results: results
                                                }
                                                res.callback(null, data);
                                            }
                                        });
                                }
                            }
                        });

                    }
                } else {
                    res.callback(err, null);
                }
            });
        }
    },
    getPdfPreview: function (req, res) {
        if (req.body) {
            Assignment.getPdfFile(req.body, function (err, savedData) {
                if (err || _.isEmpty(savedData)) {
                    res.callback(err, 'There was an error while generating pdf!');
                } else {
                    res.callback(null, savedData.name);
                }
            });
        }
    },
    getOneAssignment: function (req, res) {
        if (req.body) {
            Assignment.getOneAssignment(req.body, function (err, evidence) {
                if (err || _.isEmpty(evidence)) {
                    res.callback(err, 'No Data Found!!!');
                } else {
                    res.callback(null, evidence);
                }
            });
        }
    },
    generateInvoicePreview: function (req, res) {
        if (req.body) {
            wholeObj = {
                invoice: req.body.invoiceData,
                assignment: req.body.newAssignment
            }
            res.calcTax(wholeObj, function (err, data) {
                // console.log('data', data);
                if (!_.isEmpty(data)) {
                    req.body.invoiceData = data;
                }
                var invoiceData = req.body.invoiceData;
                invoiceData.invoiceApproved = true;
                invoiceData.approvalTime = moment().toDate();
                invoiceData.approvalStatus = "Approved";
                console.log('invoiceData :', invoiceData);
                Assignment.getInvoicePdfFile(invoiceData, function (err, invoiceDatareturn) {
                    console.log('invoiceDatareturn', invoiceDatareturn);
                    if (err || _.isEmpty(invoiceDatareturn)) {
                        res.callback("create PDF failed", null);
                    } else {
                        res.callback(null, invoiceDatareturn.name);
                    }
                });
            });
        }
    },
};
module.exports = _.assign(module.exports, controller);