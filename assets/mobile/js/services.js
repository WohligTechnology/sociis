// var adminurl = "http://wohlig.io/api/";
var adminurl = "http://absolute.wohlig.co.in/api/";
// var adminurl = "http://absolutesurveyors.com/api/";
var webUrl = "http://absolute.wohlig.co.in/#/";
// var webUrl = "http://wohlig.io/#/";
// var webUrl = "http://absolutesurveyors.com/#/";
var imgurl = adminurl + "upload/";
var imgpath = imgurl + "readFile?file=";
angular.module('starter.services', [])
  .factory('MyServices', function ($http, $rootScope) {
    return {

      getUrls: function () {
        if (adminurl == "http://wohlig.io/api/") {
          $rootScope.adminurl = adminurl;
          $rootScope.webUrl = webUrl;
          $rootScope.newAssignment = webUrl + "assignment-create//assignment//";
          $rootScope.dashboard = webUrl + "dashboard";
          $rootScope.desktop = webUrl + "assignment-list/1";
          $rootScope.login = webUrl + "login";
        } else if (adminurl == "http://absolute.wohlig.co.in/api/") {
          $rootScope.adminurl = adminurl;
          $rootScope.webUrl = webUrl;
          $rootScope.newAssignment = webUrl + "assignment-create//assignment//";
          $rootScope.dashboard = webUrl + "dashboard";
          $rootScope.desktop = webUrl + "assignment-list/1";
          $rootScope.login = webUrl + "login";
        } else if (adminurl == "http://absolutesurveyors.com/api/") {
          $rootScope.adminurl = adminurl;
          $rootScope.webUrl = webUrl;
          $rootScope.newAssignment = webUrl + "assignment-create//assignment//";
          $rootScope.dashboard = webUrl + "dashboard";
          $rootScope.desktop = webUrl + "assignment-list/1";
          $rootScope.login = webUrl + "login";
        }
      },

      searchRecord: function (formData, url, callback) {
        $http({
          url: adminurl + url.url,
          method: 'POST',
          data: formData
        }).success(callback);
      },

      getAll: function (formData, callback) {
        $http({
          url: adminurl + "Assignment/getAll",
          method: 'POST',
          data: formData
        }).success(callback);
      },

      saveJsonStore: function (data, callback) {
        formData = {};
        formData.json = data;
        formData.accessToken = $.jStorage.get("accessToken");
        $http.post(adminurl + 'jsonStore/save', formData).success(function (response) {
          if (response && response.data && response.data._id) {
            console.log("response", response.data._id);
            callback(response.data._id);
          }
        });
      }


    }
  });
