var schema = new Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    validate: validators.isEmail()
  },
  photo: {
    type: String,
    default: ""
  },
  password: {
    type: String,
    default: ""
  },
  forgotPassword: {
    type: String,
    default: ""
  },
  mobile: {
    type: String,
    default: ""
  },
  otp: {
    type: String,
    default: ""
  },
  accessToken: {
    type: [String],
    index: true
  },
  googleAccessToken: String,
  googleRefreshToken: String,
  oauthLogin: {
    type: [{
      socialId: String,
      socialProvider: String
    }],
    index: true
  },
  accessLevel: {
    type: String,
    default: "User",
    enum: ['User', 'Admin']
  },
  timeline: {
    type: [{
      type: Schema.Types.ObjectId,
      ref: "Timeline",
    }],
    index: true,
    restrictedDelete: true
  },
  employee: {
    type: Schema.Types.ObjectId,
    ref: "Employee",
    index: true,
    key: "user"
  },
});

schema.plugin(deepPopulate, {
  populate: {
    'employee': {
      select: ''
    }
  }
});
schema.plugin(uniqueValidator);
schema.plugin(timestamps);

module.exports = mongoose.model('User', schema);

var exports = _.cloneDeep(require("sails-wohlig-service")(schema, "employee", "employee"));
var model = {

  existsSocial: function (user, callback) {
    var Model = this;
    Model.findOne({
      "oauthLogin.socialId": user.id,
      "oauthLogin.socialProvider": user.provider,
    }).exec(function (err, data) {
      if (err) {
        callback(err, data);
      } else if (_.isEmpty(data)) {
        var modelUser = {
          name: user.displayName,
          accessToken: [uid(16)],
          oauthLogin: [{
            socialId: user.id,
            socialProvider: user.provider,
          }]
        };
        if (user.emails && user.emails.length > 0) {
          modelUser.email = user.emails[0].value;
        }
        modelUser.googleAccessToken = user.googleAccessToken;
        if (user.googleRefreshToken) {
          modelUser.googleRefreshToken = user.googleRefreshToken;
        }
        modelUser.employee = user.employee;

        if (user.image && user.image.url) {
          modelUser.photo = user.image.url + "0";
        }
        Model.saveData(modelUser, function (err, data2) {
          if (err) {
            callback(err, data2);
          } else {
            data3 = data2.toObject();
            delete data3.oauthLogin;
            delete data3.password;
            delete data3.forgotPassword;
            delete data3.otp;
            callback(err, data3);
          }
        });
      } else {
        delete data.oauthLogin;
        delete data.password;
        delete data.forgotPassword;
        delete data.otp;
        data.googleAccessToken = user.googleAccessToken;
        data.employee = user.employee;
        data.save(function () {});
        callback(err, data);
      }
    });
  },
  profile: function (data, callback, getGoogle) {
    var str = "name email photo mobile accessLevel";
    if (getGoogle) {
      str += " googleAccessToken googleRefreshToken";
    }
    User.findOne({
      accessToken: data.accessToken
    }, str).lean().exec(function (err, data) {
      if (err) {
        callback(err);
      } else if (data) {
        callback(null, data);
      } else {
        callback("No Data Found", data);
      }
    });
  },
  updateAccessToken: function (id, accessToken) {
    User.findOne({
      "_id": id
    }).exec(function (err, data) {
      if (err || _.isEmpty(data)) {
        return;
      } else {
        data.googleAccessToken = accessToken;
        data.save(function () {});
      }
    });
  },

  sendEmailWithAttachment: function (req, callback) {
    // console.log({
    //   url: 'https://www.googleapis.com/upload/gmail/v1/users/' + req.user.email + "/" + req.body.url + "/uploadType=media",
    //   form: {
    //     refresh_token: req.user.googleRefreshToken,
    //     client_id: GoogleclientId,
    //     raw: req.body.raw
    //   }
    // });

    // if (req.attachment) {
    var reqUrl = {
      url: 'https://www.googleapis.com/upload/gmail/v1/users/' + req.user.email + "/" + req.body.url + "/uploadType=media",
      form: {
        refresh_token: req.user.googleRefreshToken,
        client_id: GoogleclientId,
        raw: req.body.raw
      }
    };
    request.post(reqUrl, function (err, httpResponse, body) {
      if (err) {
        callback(err);
      } else if (body) {
        // console.log("body", body);
        body = JSON.parse(body);
        if (noTry === 0 && body.error) {
          refreshToken();
        } else {
          callback(err, body);
        }
      } else {
        callback(err, body);
      }
    });
  },

  sendEmail: function (req, callback) {
    // console.log({
    //   url: 'https://www.googleapis.com/gmail/v1/users/' + req.user.email + "/" + req.body.url,
    //   form: {
    //     refresh_token: req.user.googleRefreshToken,
    //     client_id: GoogleclientId,
    //     raw: req.body.raw
    //   }
    // });

      var reqUrl = {
        url: 'https://www.googleapis.com/gmail/v1/users/' + req.user.email + "/" + req.body.url,
        form: {
          refresh_token: req.user.googleRefreshToken,
          client_id: GoogleclientId,
          raw: req.body.raw
        }
      };
    // console.log("reqUrl , ", reqUrl);
    request.post(reqUrl, function (err, httpResponse, body) {
      if (err) {
        callback(err);
      } else if (body) {
        // console.log("body", body);
        body = JSON.parse(body);
        if (noTry === 0 && body.error) {
          refreshToken();
        } else {
          callback(err, body);
        }
      } else {
        callback(err, body);
      }
    });
  },

  gmailCall: function (req, callback) {
    var noTry = 0;
    var labelIds = "";

    function makeGmailCall() {
      if (!req.body.other) {
        req.body.other = "";
      }
      if (!req.body.labelIds) {
        req.body.labelIds = "";
      }

      var callAPI = {
        url: 'https://www.googleapis.com/gmail/v1/users/' + req.user.email + "/" + req.body.url + "?key=" + GoogleKey + req.body.other + req.body.labelIds,
        method: req.body.method,
        headers: {
          "Authorization": "Bearer " + req.user.googleAccessToken
        }
      };
      if (req.form) {
        callAPI.multipart = [{
          "content-type": "application/json",
          body: JSON.stringify(req.form)
        }];
      }

      // console.log(callAPI);
      request(callAPI, function (err, httpResponse, body) {
        if (err) {
          callback(err);
        } else if (body) {
          body = JSON.parse(body);
          if (noTry === 0 && body.error) {
            refreshToken();
          } else {
            callback(err, body);
          }
        } else {
          callback(err, body);
        }
      });
    }

    function refreshToken() {
      // console.log({
      //   url: 'https://www.googleapis.com/oauth2/v4/token',
      //   form: {
      //     refresh_token: req.user.googleRefreshToken,
      //     client_id: GoogleclientId,
      //     client_secret: GoogleclientSecret,
      //     grant_type: 'refresh_token',
      //   }
      // });
      
      request.post({
        url: 'https://www.googleapis.com/oauth2/v4/token',
        form: {
          refresh_token: req.user.googleRefreshToken,
          client_id: GoogleclientId,
          client_secret: GoogleclientSecret,
          grant_type: 'refresh_token',
        }
      }, function (err, httpResponse, body) {
        console.log(err);
        // console.log(body);
        if (err) {
          callback(err);
        } else if (body) {

          body = JSON.parse(body);
          req.user.googleAccessToken = body.access_token;
          User.updateAccessToken(req.user.id, body.access_token);
          noTry = 1;
          makeGmailCall();
        } else {
          callback(err);
        }
      });
    }
    makeGmailCall();
  },

   gmailCallWithAttachment: function (req, callback) {
    var noTry = 0;
    var labelIds = "";

    function makeGmailCall() {
      if (!req.body.other) {
        req.body.other = "";
      }

      if (!req.body.labelIds) {
        req.body.labelIds = "";
      }

      var callAPI = {
        url: 'https://www.googleapis.com/upload/gmail/v1/users/' + req.user.email + "/" + req.body.url + "?key=" + GoogleKey + req.body.other + req.body.labelIds + "/uploadType=media",
        method: req.body.method,
        headers: {
          "Authorization": "Bearer " + req.user.googleAccessToken
        }
      }

      // console.log("callAPI : ", callAPI);

      if (req.form) {
        callAPI.multipart = [{
          "content-type": "application/json",
          body: JSON.stringify(req.form)
        }];
      }

      request(callAPI, function (err, httpResponse, body) {
        if (err) {
          callback(err);
        } else if (body) {
          // body = JSON.parse(body);
          // console.log("body ====: ", body);
          if (noTry === 0 && body.error) {
            refreshToken();
          } else {
            callback(err, body);
          }
        } else {
          callback(err, body);
        }
      });
    }

    function refreshToken() {
      // console.log({
      //   url: 'https://www.googleapis.com/oauth2/v4/token',
      //   form: {
      //     refresh_token: req.user.googleRefreshToken,
      //     client_id: GoogleclientId,
      //     client_secret: GoogleclientSecret,
      //     grant_type: 'refresh_token',
      //   }
      // });

      request.post({
          url: 'https://www.googleapis.com/oauth2/v4/token',
          form: {
            refresh_token: req.user.googleRefreshToken,
            client_id: GoogleclientId,
            client_secret: GoogleclientSecret,
            grant_type: 'refresh_token',
          }
        },

        function (err, httpResponse, body) {
          console.log(err);
          // console.log(body);
          if (err) {
            callback(err);
          } else if (body) {

            body = JSON.parse(body);
            // console.log("body in refresh token ====: ", body);
            req.user.googleAccessToken = body.access_token;
            User.updateAccessToken(req.user.id, body.access_token);
            noTry = 1;
            makeGmailCall();
          } else {
            callback(err);
          }
        });
    }
    makeGmailCall();
  }

};
module.exports = _.assign(module.exports, exports, model);