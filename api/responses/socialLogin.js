module.exports = function (profile) {
    var req = this.req;
    var res = this.res;
    var sails = req._sails;
    if (_.isEmpty(profile)) {
        res.callback("Error fetching profile in Social Login", profile);
    } else {

        if (profile.emails && profile.emails.length > 0) {
            var email = profile.emails[0].value;
            Employee.findOne({
                officeEmail: email
            }).exec(function (err, data5) {
                if (err) {
                    res.callback(err);
                } else if (_.isEmpty(data5)) {
                    res.callback("No Such Employee Registered", profile);
                } else {
                    profile.employee = data5._id;

                    // if (req.session.returnUrl) {
                    User.existsSocial(profile, function (err, data) {
                        if (err || !data) {
                            res.callback(err, "Data not Found");
                        } else {
                            res.redirect(req.baseUrl + "/#/login/" + data.accessToken[0]);
                            req.session.destroy(function () {});
                        }
                    });
                    // } else {
                    //     User.existsSocial(profile, res.callback);
                    // }
                }
            });
        } else {
            res.callback("Error in your profile details, enable to fetch your email id", profile);
        }


    }
};