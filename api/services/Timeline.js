var mongoose = require('mongoose');
var deepPopulate = require('mongoose-deep-populate')(mongoose);
var uniqueValidator = require('mongoose-unique-validator');
var timestamps = require('mongoose-timestamp');
var validators = require('mongoose-validators');
var monguurl = require('monguurl');
require('mongoose-middleware').initialize(mongoose);

var Schema = mongoose.Schema;

var schema = new Schema({
    assignment: {
        type: Schema.Types.ObjectId,
        ref: "Assignment",
        index: true,
        required: true,
        key: "timeline"
    },
    chat: [{
        viewEmailStatus: {
            type: String
        },
        isSurveyApproved: {
            type: Boolean
        },
        onSurveyAttended: {
            type: Boolean
        },
        emailStatus: {
            type: Boolean,
            default: false
        },
        acknowledgmentStatus: {
            type: Boolean,
            default: false
        },
        deputationStatus: {
            type: Boolean,
            default: false
        },
        event: {
            type: String
        },
        surveyor: {
            type: Schema.Types.ObjectId,
            ref: "Employee",
            index: true
        },
        employee: {
            type: Schema.Types.ObjectId,
            ref: "Employee",
            index: true
        },
        title: {
            type: String
        },
        time: {
            type: Date,
            default: Date.now
        },
        type: {
            type: String,
            enum: ["Email", "Normal", "SurveyDone", "File"]
        },
        message: {
            type: String
        },
        email: {
            type: {}
        },
        attachment: {
            type: []
        },
        surveyEndTime: {
            type: Date
        },
        surveyStartTime: {
            type: Date
        },
        surveyDate: {
            type: Date
        },
        // surveyTime: {
        //     type: Date
        // },
        address: {
            type: String
        },
        invoiceNumber: {
            type: String
        },
        typeName: {
            type: String
        }
    }]
});

schema.plugin(deepPopulate, {
    populate: {
        'chat.employee': {
            select: "name photo func houseColor email officeEmail"
        },
        // 'chat.employee.employee': {
        //     select: ""
        // },
        'chat.employee.func': {
            select: "name"
        }
    }
});
schema.plugin(uniqueValidator);
schema.plugin(timestamps);
module.exports = mongoose.model('Timeline', schema);

var exports = _.cloneDeep(require("sails-wohlig-service")(schema, "chat.employee  chat.employee.func", "chat.employee"));
var model = {
    getTimeline: function (data, callback) {
        Timeline.findOne({
            assignment: data.assignment
        }).limit(10).lean().exec(function (err, data2) {
            if (err) {
                callback(err, null);
            } else {
                callback(err, data2);
            }
        });
    },
    updateEmailStatus: function (data, callback) {
        var matchObj = {};
        var matchObj2 = {};
        matchObj = {
            _id: data.timelineId,
            chat: {
                $elemMatch: {
                    _id: data.chatId
                }
            }
        };
        if (data.event == "Acknowledgment Email") {
            matchObj2 = {
                $set: {
                    "chat.$.acknowledgmentStatus": true
                }
            };
        } else if (data.event == "Deputation mail") {
            matchObj2 = {
                $set: {
                    "chat.$.deputationStatus": true
                }
            };
        } else {
            matchObj2 = {
                $set: {
                    "chat.$.emailStatus": true
                }
            };
        }


        Timeline.update(matchObj, matchObj2).exec(function (err, data) {
            if (err) {
                callback(err, null);
            } else {
                callback(null, data);
            }
        });
    },

    updateTimeline: function (data, callback) {
        Timeline.update({
            assignment: data.assignment
        }, {
            $push: {
                chat: data.chat
            }
        }).exec(function (err, updated) {
            //console.log("updated : ", updated);
            if (err) {
                callback(err, null);
            } else {
                if (updated.nModified == 1) {
                    callback(err, updated);
                } else {
                    callback("There was an error while updating timeline", updated);
                }
            }
        });
    },
    appendChat: function (data, callback) {
        var Model = this;
        Timeline.findOne({
            assignment: data._id
        }).lean().exec(function (err, timelineData) {
            if (err) {
                callback(err);
            } else {
                if (_.isArray(data.timeline)) {
                    _.each(data.timeline, function (value) {
                        timelineData.chat.push(value);
                    });
                } else {
                    if (!_.isEmpty(data.timeline)) {
                        timelineData.chat.push(data.timeline);
                    }
                }
                Timeline.saveData(timelineData, function (err, data2) {
                    if (err) {
                        callback(err);
                    } else {
                        var timelineobj = {};
                        async.parallel({
                            getOneTimeline: function (callback) {
                                Timeline.findOne({
                                    _id: timelineData._id
                                }).lean().deepPopulate('chat.employee chat.employee.func').exec(function (error, found) {
                                    if (error || found == undefined) {
                                        callback(error, null);
                                    } else {
                                        timelineobj.byUser = found.chat[found.chat.length - 1].employee._id;
                                        if (!_.isEmpty(found)) {
                                            timelineobj.timeline = found;
                                        }
                                        callback(null, {
                                            message: "Timeline found"
                                        });
                                    }
                                })
                            },
                            getOneAssignment: function (callback) {
                                Assignment.findOne({
                                    _id: data._id
                                }).deepPopulate('city.district.state.zone.country products.product.category.industry department shareWith.persons policyType natureOfLoss invoice invoice.createdBy insured insuredOffice owner owner.func company company.city insurerOffice company.city.district.state assessment.employee consent.employee docs.employee fsrs.employee photos.employee causeOfLoss insurer assignedTo office branch survey.employee survey.employee.city company.bank owner.employee survey.employee.city.district survey.employee.city.district.state survey.employee.city.district.state.zone survey.employee.city.district.state.zone.country customer brokerOffice", "city.district.state.zone.country products.product.category.industry department shareWith.persons natureOfLoss company invoice invoice.createdBy insuredOffice assignedTo insurerOffice office branch survey.employee company.bank owner owner.employee survey.employee.city.district survey.employee.city.district.state survey.employee.city.district.state.zone survey.employee.city.district.state.zone.country survey.employee.city customer brokerOffice chat.employee chat.employee.func ').exec(function (err, assignmentData) {
                                    if (err || assignmentData == undefined) {
                                        callback(err);
                                    } else {
                                        if (!_.isEmpty(assignmentData)) {
                                            timelineobj.assignment = assignmentData;
                                        }
                                        // calcGlobalAssignmentStatus
                                        Assignment.setGlobalAssignmentStatusForMigration(assignmentData, function (err, data5) {
                                            if (err) {
                                                callback(err, null)
                                            } else {
                                                timelineobj.assignment.timelineStatus = data5;
                                                callback(null, data5)
                                            }
                                        });
                                    }
                                })
                            }
                        }, function (error) {
                            if (error) {
                                callback(error, null);
                            } else {
                                sails.sockets.blast("updateTimeline" + timelineData._id, timelineobj);
                                callback(null, {
                                    message: "Timeline found"
                                })
                            }
                        })

                    }
                });
            }
        });
    },

    //To store photos in timeline and assignment
    saveTimelineAndAssignment: function (data, callback) {
        Timeline.findOne({
            _id: data.assignment._id
        }).exec(function (err, timelineData) {
            if (err || timelineData == undefined) {
                //console.log("Timeline >>> saveTimelineAndAssignment >>> Timeline.findOne >>> err", err);
                callback(err, null);
            } else {
                if (!_.isEmpty(timelineData)) {
                    async.waterfall([
                        function (callback) {
                            var assignmentObj = data.assignment.chat[data.assignment.chat.length - 1];
                            async.eachSeries(data.assignment.chat[data.assignment.chat.length - 1].file, function (n, cb) {
                                var updateObj = {
                                    employee: assignmentObj.employee._id,
                                    fileName: assignmentObj.fileName,
                                    file: n
                                }
                                if (data.assignment.type == 'Documents') {
                                    var pushObj = {
                                        docs: updateObj
                                    };
                                } else if (data.assignment.type == 'jir') {
                                    var pushObj = {
                                        jir: updateObj
                                    };
                                } else {
                                    var pushObj = {
                                        photos: updateObj
                                    };
                                }
                                Assignment.findOneAndUpdate({
                                    _id: timelineData.assignment
                                }, {
                                    $push: pushObj
                                }, {
                                    new: true
                                }).exec(function (error, updated) {
                                    //console.log("Timeline >>> async.eachSeries >>>", updated, "assignment", timelineData.assignment);
                                    if (error) {
                                        //console.log("Timeline >>> saveTimelineAndAssignment >>> Timeline.findOne >>>  Assignment.findOneAndUpdate >>> error", error);
                                        cb(error, null);
                                    } else {
                                        cb();
                                    }
                                })
                            }, function (error) {
                                if (error) {
                                    //console.log("Timeline >>> async.eachSeries >>>", error);
                                    callback(error, null)
                                } else {
                                    //console.log("Assignment updated successfully");
                                    callback(null, {
                                        message: "Assignment updated successfully"
                                    });
                                }
                            });
                        },
                        function (assignmentUpdated, callback) {
                            Timeline.saveData(data.assignment, function (err, updateTimeline) {
                                //console.log("Timeline >>> saveTimelineAndAssignment >>> Timeline.findOne >>>  Timeline.findOneAndUpdate >>> err", err, updateTimeline);
                                if (err || updateTimeline == undefined) {
                                    callback(err, null);
                                } else {
                                    callback(null, {
                                        message: "Success In Timeline"
                                    });
                                }
                            });
                        },
                        function (timelineUpdate, callback) {
                            //console.log("Timeline");
                            Timeline.appendChat({
                                _id: data.assignment.assignment
                            }, function (err, updateTimeline) {
                                if (err || updateTimeline == undefined) {
                                    callback(err, null);
                                } else {
                                    callback(null, {
                                        message: "Success In Timeline"
                                    });
                                }
                            });
                        }
                    ], function (error, finalData) {
                        if (error || finalData == undefined) {
                            //console.log("Timeline >>> async.waterfall >>> finalcallback >>>", error);
                            callback(error, null)
                        } else {
                            callback(null, {
                                message: "Assignment and Timeline updated successfully"
                            });
                        }
                    })
                } else {
                    callback({
                        message: "Unable to update Assignment and Timeline"
                    }, null);
                }
            }
        })
    }
};
module.exports = _.assign(module.exports, exports, model);