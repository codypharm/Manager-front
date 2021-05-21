//const axios = require("axios");
const ourStore = require("../../src/js/store");
const ourAttendanceModel = require("../../models/attendanceModel");
const modules = require("./modules");

// instantiate classes
const store = new ourStore();
const attendanceModel = new ourAttendanceModel();

class Attendance {
  constructor() {
    this.currentUser = store.getLoginDetail();
    this.setupDetails = store.getSetupDetail();
  }

  //upload
  uploadAttendanceToRemote(attendance, proceedToSales) {
    //filter out Attendance with remote =  false
    let filteredAttendance = modules.filterAttendance(attendance);

    //upload these Attendance
    if (filteredAttendance.length > 0) {
      let upload = modules.upload(
        filteredAttendance,
        this.setupDetails.detail[0]
      );
    }
    //move on while the task runs asynchronously
    proceedToSales();
  }

  //handle Attendance
  handleAttendance(proceedToSales) {
    //get staff list
    const allAttendance = attendanceModel.getAttendance();
    allAttendance.then(({ data, headers, status }) => {
      this.uploadAttendanceToRemote(data.rows, proceedToSales);
    });
  }
}

module.exports = Attendance;
