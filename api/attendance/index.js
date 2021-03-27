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
  }

  //upload
  uploadAttendanceToRemote(attendance, proceedToAttendance) {
    //filter out Attendance with remote =  false
    let filteredAttendance = modules.filterAttendance(attendance);

    //upload these Attendance
    if (filteredAttendance.length > 0) {
      let upload = modules.upload(filteredAttendance);
    }
    //move on while the task runs asynchronously
    proceedToAttendance();
  }

  //handle Attendance
  handleAttendance(proceedToAttendance) {
    //get staff list
    const allAttendance = attendanceModel.getAttendance();
    allAttendance.then(({ data, headers, status }) => {
      this.uploadAttendanceToRemote(data.rows, proceedToAttendance);
    });
  }
}

module.exports = Attendance;
