const axiosInstance = require("../axiosInstance");
const ourModel = require("../../models/attendanceModel");
const attendanceModel = new ourModel();

const filterAttendance = attendance => {
  let match = attendance.filter(record => {
    return record.value.remote == false;
  });

  return match;
};

const upload = async (attendance, setup) => {
  // add company and branch ID manually
  let company = setup.value.companyId;
  let branch = setup.value.branchId;
  let promises = [];
  for (let i = 0; i < attendance.length; i++) {
    promises.push(
      axiosInstance.post("attendance/", {
        date: `${attendance[i].value.year}-${attendance[i].value.month}-${attendance[i].value.day}`,
        staffName: attendance[i].value.staffName,
        staffId: attendance[i].value.staffId,
        arrivalTime: attendance[i].value.arrivalTime,
        exitTime: attendance[i].value.exitTime,
        companyId: company,
        branchId: branch
      })
      //.then(response => {
      //console.log(response);
      //})
    );
  }

  Promise.all(promises).then(async () => {
    await attendanceModel.remoteUpdateAllAttendance(attendance);
  });
};

module.exports = { filterAttendance, upload };
