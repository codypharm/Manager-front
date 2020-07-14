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
      exitTime: "No Exit yet",
      day: date.getDate(),
      month: date.getMonth() + 1,
      year: date.getFullYear(),
      recorder: loginDetail.fname + " " + loginDetail.lname,
      recorderEmail: loginDetail.email
    });
  }
}

module.exports = attendanceModel;
