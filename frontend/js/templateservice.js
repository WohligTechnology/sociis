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
  }
  this.getInvoiceWithTax = function (formData, callback) {
    async.waterfall([
      function (callback) {
        async.each(formData.invoiceList, function (n, callback) {
          if (!isNaN(n.amount)) {
            formData.subTotal = formData.subTotal + n.amount;
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
      function (data, callback) {
        formData.grandTotal = formData.subTotal;
        callback(null, true);
      },
      function (data, callback) {
        async.each(formData.tax, function (n, callback) {
          n.amount = n.percent * formData.subTotal / 100;
          formData.grandTotal = n.amount + formData.grandTotal;
          callback();
        }, function (err) {
          if (err) {
            toastr.error("Error In SubTotal Calulation");
          } else {
            callback(null, true);
          }
        });
      }
    ], function (err, results) {
      if (err) {
        toastr.error("Error In Tax calculation");
      } else {
        var round = formData.grandTotal - Math.floor(formData.grandTotal);
        formData.grandTotal = Math.round(formData.grandTotal);
        formData.roundOff = round.toFixed(2);
        callback(err, formData);
      }
    });
  };
  // this.removeLoaderOn = function(num) {
  //     this.isLoader = true;
  //     this.removeLoaderNum = num;
  // };

  // this.mrnumber = function (data, callback) {
  //   var MRNumber = "";
  //   var objectData = data;
  //   console.log(objectData);
  //   NavigationService.getOneCity(objectData.city, function (data) {

  //     MRNumber += data.data.district.state.zone.country.countryCode;
  //     NavigationService.getOneCompany(objectData.company, function (company) {
  //       MRNumber += company.data.companyCode;
  //       NavigationService.getOneClaim(objectData.typeOfClaim, function (claim) {
  //         MRNumber += claim.data.claimNumber;
  //         NavigationService.getOneNatureOfServey(objectData.natureOfSurvey, function (serveycode) {
  //           MRNumber += "-" + serveycode.data.code;
  //           NavigationService.getOneBranch(objectData.branch, function (branch) {
  //             MRNumber += branch.data.code;
  //             console.log(objectData.dateOfAppointment);
  //             MRNumber += "-" + $filter("date")(objectData.dateOfAppointment, "yy");
  //             MRNumber += $filter("date")(objectData.dateOfAppointment, "MM");
  //             MRNumber += "-" + $filter("numberFixedLen")(objectData.serialNumber, 4);
  //             callback(MRNumber);
  //           });

  //         });
  //       });

  //     });

  //   });

  // };

  this.creategetAllTaskStatus = function (assignment, callback) {
    NavigationService.getOneModel("Branch", assignment.branch, function (data) {
      if (data.value) {
        // console.log("Data.data.results", data, data.data);
        var newBranch = data.data;
        if (assignment.getAllTaskStatus === undefined) {
          assignment.getAllTaskStatus = {
            ila: "Not Done",
            lor: "Not Done",
            survey: "Not Done",
            consent: "Not Done",
            assessment: "Not Done",
            fsr: "Not Done",
            invoice: "Not Done",
            surveyAssigned: "Not Done",
            docs: "Not Done",
            dispatched: "Not Done",
            delivered: "Not Done",
            collected: "Not Done",
            forceClosed: "Not Done",
            OnHold: "Not Done",
            ReOpened: "Not Done"
          }
        }
        if (assignment.ilaAccess === undefined) {
          assignment.ilaAccess = newBranch.ITAT;
          if (newBranch.ITAT) {
            assignment.getAllTaskStatus.ila = "Not Done";
          } else {
            assignment.getAllTaskStatus.ila = "Waived";
          }
        }
        if (assignment.lorAccess === undefined) {
          assignment.lorAccess = newBranch.LTAT;
          if (newBranch.LTAT) {
            assignment.getAllTaskStatus.lor = "Not Done";
            assignment.getAllTaskStatus.docs = "Not Done";
          } else {
            assignment.getAllTaskStatus.lor = "Waived";
            assignment.getAllTaskStatus.docs = "Waived";
          }
        }
        if (assignment.surveyAccess === undefined) {
          assignment.surveyAccess = newBranch.STAT;
          if (newBranch.STAT) {
            assignment.getAllTaskStatus.survey = "Not Done";
            assignment.getAllTaskStatus.surveyAssigned = "Not Done";
          } else {
            assignment.getAllTaskStatus.survey = "Waived";
            assignment.getAllTaskStatus.surveyAssigned = "Waived";
          }
        }
        if (assignment.consentAccess === undefined) {
          assignment.consentAccess = newBranch.CTAT;
          if (newBranch.CTAT) {
            assignment.getAllTaskStatus.consent = "Not Done";
          } else {
            assignment.getAllTaskStatus.consent = "Waived";
          }
        }
        if (assignment.assessmentAccess === undefined) {
          assignment.assessmentAccess = newBranch.ATAT;
          if (newBranch.ATAT) {
            assignment.getAllTaskStatus.assessment = "Not Done";
          } else {
            assignment.getAllTaskStatus.assessment = "Waived";
          }
        }
        if (assignment.fsrAccess === undefined) {
          assignment.fsrAccess = newBranch.FSR;
          if (newBranch.FSR) {
            assignment.getAllTaskStatus.fsr = "Not Done";
          } else {
            assignment.getAllTaskStatus.fsr = "Waived";
          }
        }
        // DeskTop Logic
        if (assignment.typeOfClaim == false) {
          assignment.getAllTaskStatus.survey = "Waived";
          assignment.surveyAccess = false;
          assignment.getAllTaskStatus.surveyAssigned = "Waived";
        }
        // Is insured + Desktop + Inspection
        if (assignment.isInsured == false || assignment.typeOfClaim == false || assignment.postLoss == true) {
          assignment.getAllTaskStatus.ila = "Waived";
          assignment.ilaAccess = false;
        }
        callback(null, assignment);
      } else {
        callback("Error Occured  while createing creategetAllTaskStatus ");
        console.log("Error IN creategetAllTaskStatus")
      }
    });

  };

  this.changecontent = function (page, state) {
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
  };

  this.getMrNumber = function (text, callback) {
    var mrData = {};
    if (_.isEmpty(text)) {
      text = "";
      if ($.jStorage.get("mrNumbers")) {
        $rootScope.mrNumbers = $.jStorage.get("mrNumbers");
      } else {
        getMrs(true);
      }
    } else {
      getMrs();
    }

    function getMrs(flag) {
      mrData.keyword = text;
      mrData.all = false;
      NavigationService.getMRNumbers(mrData, 1, function (data) {
        if (data.value) {
          if (flag === true) {
            $.jStorage.set("mrNumbers", data.data.results);
            $rootScope.mrNumbers = data.data.results;
          } else {
            $rootScope.mrNumbers = data.data.results;
          }
        } else {
          $rootScope.mrNumbers = [];
        }
      });
    }

  }

  this.goToState = function (data) {
    // console.log('data', data);
    $state.go("timeline", {
      id: data[0]._id
    });
  }

   this.closeProgressbar = function () {
     $rootScope.viewProgressBar = false;
  }
  

  this.init();

  this.getRole = function (data) {
    // console.log("Role", role);
  };

  this.getAssignmentRole = function (subMenu, thirdMenu) {
    role = $.jStorage.get("role");
    var assignRole = _.filter(role.roles, function (n) {
      var level1Test = (n.mainMenu == "Assignments");
      var level2Test = (n.subMenu == subMenu);
      var level3Test = (n.subThirdMenu == thirdMenu);
      return level1Test && level2Test && level3Test;
    });
    if (assignRole.length > 0) {
      return assignRole[0].view.val;
    } else {
      return false;
    }
  };
  template = this;
});
var template = {};