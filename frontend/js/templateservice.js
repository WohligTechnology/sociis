var templateservicemod = angular.module('templateservicemod', ['navigationservice', 'toastr']);
templateservicemod.service('TemplateService', function ($filter, NavigationService, toastr, $rootScope, $state) {

  this.title = "Home";
  this.meta = "Google";
  this.metadesc = "Home";
  this.isLoader = false;
  this.removeLoaderNum = 0;
  this.removeLoaderTemp = 0;
  this.pageMax = 10;
  this.profile = $.jStorage.get("profile");
  var d = new Date();
  var role = $.jStorage.get("role");
  this.year = d.getFullYear();

  this.setRole = function () {
    role = $.jStorage.get("role");
  };

  this.currency = {
    numeral: true,
    numeralThousandsGroupStyle: 'thousand'
  };
  this.currencyNoDecimal = {
    numeral: true,
    numeralThousandsGroupStyle: 'thousand',
    numeralDecimalScale: 0
  };

  this.vehicle = {
    uppercase: true
  };

  this.init = function () {

    this.header = "frontend/views/header.html";
    this.menu = "frontend/views/menu.html";
    this.isLoader = false;
    this.content = "frontend/views/content/content.html";
    this.footer = "frontend/views/footer.html";
    this.profile = $.jStorage.get("profile");
    this.removeLoaderTemp = 0;
    this.removeLoaderNum = 0;
  };

  // this.removeLoader = function() {
  //     this.removeLoaderTemp++;
  //     if (this.removeLoaderTemp >= this.removeLoaderNum) {
  //         this.isLoader = false;
  //     }
  // };
  this.getLoader = function () {
    this.isLoader = true;
  };
  this.removeLoader = function () {
    this.isLoader = false;
  };
  this.getToastr = function () {
    toastr.error("Please Wait", {
      timeOut: 0,
      extendedTimeOut: 0
    });
  };
  this.getDelayClass = function (hours) {
    var retClass = "";
    if (hours >= 0 && hours <= 6) {
      retClass = "delay-0";
    } else if (hours >= 7 && hours <= 24) {
      retClass = "delay-6";
    } else if (hours >= 25 && hours <= 48) {
      retClass = "delay-24";
    } else if (hours >= 49 && hours <= 72) {
      retClass = "delay-48";
    } else if (hours >= 73) {
      retClass = "delay-72";
    }
    return retClass;
  };
  this.calAmt = function (formData, callback) {
    async.waterfall([
      function (callback) {
        async.each(formData.invoiceList, function (n, callback) {
          if (!isNaN(n.amount)) {
            formData.total = formData.total + n.amount;
            callback();
          } else {
            callback();
          }
        }, function (err) {
          if (err) {
            toastr.error("Error In SubTotal Calulation");
          } else {
            callback(null, true);
          }
        });
      },
    ], function (err, results) {
      if (err) {
        toastr.error("Error In Tax calculation");
      } else {
        var roundOff = 0; // var roundOff For Each Value
        // For Getting roundOffValue
        roundOff = formData.total % 1;
        if (roundOff != 0 && roundOff <= 0.5) {
          roundOff = 0.5;
        } else if (roundOff != 0) {
          roundOff = 1;
        } else {
          roundOff = 0;
        }
        // Get floor value      
        formData.total = Math.floor(formData.total);
        // Add the floor value + New RoundOff Value      
        formData.total = formData.total + roundOff;

        callback(err, formData);
      }
    });
  };

  this.changecontent = function (page, state) {
    if (_.isEmpty($.jStorage.get("getLoginEmployee"))) {
      $state.go("login");
      return false;
    } else {
      this.init();
      var data = this;
      var role = $.jStorage.get("role");
      data.content = "frontend/views/content/" + page + ".html";
      if (state) {
        var stateName = state.current.name;
        data.role = role;
        data.currentRole = _.filter(role.roles, function (n) {
          var index = _.indexOf(n.states, stateName);
          if (index >= 0) {
            return true;
          } else {
            return false;
          }
        });
        if (data.currentRole.length > 0) {
          data.currentRole = data.currentRole[0];
        }
        var assignmentFilter = _.filter(role.roles, {
          "subMenu": "Assignment"
        });
        data.assignmentRole = _.groupBy(assignmentFilter, "subThirdMenu");
        _.each(data.assignmentRole, function (n, key) {
          data.assignmentRole[key] = n[0];
        });
      }
      NavigationService.getNavByRole(role);
      return data;
    }

  };

  this.goToState = function (data) {
    // console.log('data', data);
    $state.go("timeline", {
      id: data[0]._id
    });
  };

  this.closeProgressbar = function () {
    $rootScope.viewProgressBar = false;
  };


  this.init();

  this.getRole = function (data) {
    // console.log("Role", role);
  };
  template = this;
});
var template = {};