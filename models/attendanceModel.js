/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
//import db file
const Database = require("../src/js/db");
const moment = require("moment");

class attendanceModel extends Database {
  constructor() {
    super();
  }

  generateId() {
    return this.couch.uniqid();
  }

  getUsers() {
    let viewUrl = this.viewUrl.users;
    return this.couch.get("users", viewUrl);
  }

  getAttendance() {
    let viewUrl = this.viewUrl.attendance;
    return this.couch.get("attendance", viewUrl);
  }

  getMatchingRecord(record, day, month, year) {
    let match = record.filter(list => {
      return (
        Number(list.value.year) == year &&
        Number(list.value.month) == month &&
        Number(list.value.day) == day
      );
    });

    return match;
  }

  extractAttendance(list, value) {
    let match = list.filter(item => {
      return (
        item.value.staffId.toUpperCase().includes(value.toUpperCase()) ||
        item.value.staffName.toUpperCase().includes(value.toUpperCase())
      );
    });

    return match;
  }

  invalidId(valueId) {
    if (!/[A-Da-d0-9]/.test(valueId)) {
      return true;
    }
  }

  idExists(valueId, staffData) {
    let match = staffData.filter(data => {
      return data.value.staffId.toUpperCase() == valueId.toUpperCase();
    });

    if (match.length > 0) {
      return true;
    } else {
      return false;
    }
  }

  marked(attendanceRecord, valueId, day, month, year) {
    let match = attendanceRecord.filter(record => {
      return (
        record.value.day == day &&
        record.value.month == month &&
        record.value.year == year &&
        record.value.staffId.toUpperCase() == valueId.toUpperCase()
      );
    });

    if (match.length > 0) {
      return true;
    } else {
      return false;
    }
  }

  getThisAttendance(attendanceRecord, day, month, year, id) {
    let match = attendanceRecord.filter(record => {
      return (
        record.value.day == day &&
        record.value.month == month &&
        record.value.year == year &&
        record.value.staffId.toUpperCase() == id.toUpperCase()
      );
    });

    if (match.length > 0) {
      return match;
    } else {
      return false;
    }
  }

  getThisUser(staffData, valueId) {
    let match = staffData.filter(data => {
      return data.value.staffId.toUpperCase() == valueId.toUpperCase();
    });

    return match;
  }

  recordAttendance(id, detail) {
    let date = new Date();
    let loginDetail = store.getLoginDetail();
    return this.couch.insert("attendance", {
      _id: id,
      staffId: detail.value.staffId.toUpperCase(),
      staffName: detail.value.fname + " " + detail.value.lname,
      arrivalTime: date.getHours() + ":" + date.getMinutes(),
      exitTime: "",
      day: date.getDate(),
      month: date.getMonth() + 1,
      year: date.getFullYear(),
      arrivalRecorder: loginDetail.fname + " " + loginDetail.lname,
      arrivalRecorderEmail: loginDetail.email,
      exitRecorder: "",
      exitRecorderEmail: "",
      remote: false
    });
  }

  //update attendance
  updateAttendance(data) {
    let date = new Date();
    let loginDetail = store.getLoginDetail();
    return this.couch.update("attendance", {
      _id: data.id,
      _rev: data.value.rev,
      staffId: data.value.staffId,
      staffName: data.value.staffName,
      arrivalTime: data.value.arrivalTime,
      exitTime: date.getHours() + ":" + date.getMinutes(),
      day: data.value.day,
      month: data.value.month,
      year: data.value.year,
      arrivalRecorder: data.value.arrivalRecorder,
      arrivalRecorderEmail: data.value.arrivalRecorderEmail,
      exitRecorder: loginDetail.fname + " " + loginDetail.lname,
      exitRecorderEmail: loginDetail.email,
      remote: false
    });
  }

  //update current match
  remoteAttendanceUpdateMatch(detail, id) {
    return this.couch.update("attendance", {
      _id: id,
      _rev: detail.rev,
      staffId: detail.staffId,
      staffName: detail.staffName,
      arrivalTime: detail.arrivalTime,
      exitTime: detail.exitTime,
      day: detail.day,
      month: detail.month,
      year: detail.year,
      arrivalRecorder: detail.arrivalRecorder,
      arrivalRecorderEmail: detail.arrivalRecorderEmail,
      exitRecorder: detail.exitRecorder,
      exitRecorderEmail: detail.exitRecorderEmail,
      remote: true
    });
  }

  async remoteUpdateAllAttendance(allMatch) {
    const matchLength = allMatch.length;
    const checker = matchLength - 1;

    //loop through matches
    for (let i = 0; i < matchLength; i++) {
      //wait for update to happen
      await this.remoteAttendanceUpdateMatch(allMatch[i].value, allMatch[i].id);
    }
  }
}

module.exports = attendanceModel;
