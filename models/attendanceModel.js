/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
//import db file
const moment = require("moment");

class attendanceModel {
  
  async getAttendance(){
    let {rows} = await attendanceDb.allDocs()
    let attendance = await generateWorkingList(attendanceDb,rows)
    return attendance
  }
  

  getMatchingRecord(record, day, month, year) {
    let match = record.filter(list => {
      return (
        Number(list.year) == year &&
        Number(list.month) == month &&
        Number(list.day) == day
      );
    });

    let sorted = match.sort((a, b) => {
      if (a.staffName.toUpperCase() < b.staffName.toUpperCase())
        return -1;

      if (a.staffName.toUpperCase() > b.staffName.toUpperCase())
        return 1;

      return 0;
    });

    return sorted;
  }

  extractAttendance(list, value) {
    let match = list.filter(item => {
      return (
        item.staffId.toUpperCase().includes(value.toUpperCase()) ||
        item.staffName.toUpperCase().includes(value.toUpperCase())
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
      return data.staffId.toUpperCase() == valueId.toUpperCase();
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
        record.day == day &&
        record.month == month &&
        record.year == year &&
        !record.exitTime &&
        record.staffId.toUpperCase() == valueId.toUpperCase()
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
        record.day == day &&
        record.month == month &&
        record.year == year &&
        !record.exitTime &&
        record.staffId.toUpperCase() == id.toUpperCase()
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
      return data.staffId.toUpperCase() == valueId.toUpperCase();
    });

    return match;
  }

  async recordAttendance( detail) {
    let date = new Date();
    let loginDetail = store.getLoginDetail();
    return attendanceDb.put({
      _id: `${+ new Date()}`,
      staffId: detail.staffId.toUpperCase(),
      staffName: detail.firstname + " " + detail.lastname,
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
  async updateAttendance(data) {
    let date = new Date();
    let loginDetail = store.getLoginDetail();
    return attendanceDb.put({
      _id: data._id,
      _rev: data._rev,
      staffId: data.staffId,
      staffName: data.staffName,
      arrivalTime: data.arrivalTime,
      exitTime: date.getHours() + ":" + date.getMinutes(),
      day: data.day,
      month: data.month,
      year: data.year,
      arrivalRecorder: data.arrivalRecorder,
      arrivalRecorderEmail: data.arrivalRecorderEmail,
      exitRecorder: loginDetail.fname + " " + loginDetail.lname,
      exitRecorderEmail: loginDetail.email,
      remote: false
    });
  }

  //update current match
  remoteAttendanceUpdateMatch(detail, id) {
    return attendanceDb.put({
      _id: id,
      _rev: detail._rev,
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
      await this.remoteAttendanceUpdateMatch(allMatch[i], allMatch[i]._id);
    }
  }
}

module.exports = attendanceModel;
