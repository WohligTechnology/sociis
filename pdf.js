   var mongoose = require('mongoose');
   var Grid = require('gridfs-stream');
   var fs = require("fs");
   // var lwip = require("lwip");
   var process = require('child_process');
   var lodash = require('lodash');
   // var json2xl = require('json2xl');
   var MaxImageSize = 4096;

   // var gfs = Grid(mongoose.connections[0].db, mongoose);
   // gfs.mongo = mongoose.mongo;
   var pdf = require('html-pdf');
   var Schema = mongoose.Schema;
   var schema = new Schema({
       name: String
   });

   module.exports = function (data1, data2) {
       //console.log("data1 : ",data1,"data2: ",data2);
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
       // //console.log('config : ', config);
       pdf.create(html, config).toStream(function (err, stream) {
           //console.log(err);
           //console.log("Chinatn");
           if (err) {
               callback(err);
           } else {
               console.log("In Config To generate PDF");
               stream.pipe(writestream);
           }

       });
   };