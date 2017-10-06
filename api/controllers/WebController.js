module.exports = {
    index: function (req, res) {
        res.metaView();
    },
    download: function (req, res) {
        Config.readUploaded(req.param("filename"), null, null, null, res);
    },
    downloadWithName: function (req, res) {
        Config.downloadWithName(req.param("filename"), req.query.name, res);
    },
    format: function (req, res) {
        Config.generatePdf("format", {}, res.callback);
        // res.view("format");
    },
    formatWeb: function (req, res) {
        // Config.generatePdf("format", {}, res.callback);
        env.assignmentName = "1198-1703-0523";
        res.view("format", env);
    }
};