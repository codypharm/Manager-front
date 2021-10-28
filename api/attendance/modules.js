const axiosInstance = require("../axiosInstance");
const ourModel = require("../../models/attendanceModel");
const { Notyf } = require("notyf");
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
        storageId: attendance[i].id,
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

  Promise.all(promises)
    .then(async () => {
      await attendanceModel.remoteUpdateAllAttendance(attendance);
    })
    .catch(error => {
      //handle error
      const notyf = new Notyf({
        duration: 3000
      });

      // Display an error notification
      notyf.error("An Error Occured");
      //remove disabled and also loading sign
      document.querySelector("#syncBtn").disabled = false;
      document.getElementById("sync").style.display = "none";
      //set sync store
      store.setSyncState(false);
    });
};

module.exports = { filterAttendance, upload };
