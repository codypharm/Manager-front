/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */

//global variables
let attendanceRecord;
let staffData;
const recordAttendance = e => {
  showGenStaticModal("attendanceContent");
  let date = new Date();
  let day = date.getDate();
  let month = date.getMonth() + 1;
  let year = date.getFullYear();
  let successBox = document.getElementById("attendanceSuc");
  let errorBox = document.getElementById("attendanceAlert");
  if (!errorBox.classList.contains("hide")) {
    errorBox.classList.add("hide");
  }

  if (!successBox.classList.contains("hide")) {
    successBox.classList.add("hide");
  }

  //focus on input field
  document.getElementById("attendanceId").focus();
  document.getElementById("attendanceId").value = "";

  //show attendance date
  attendanceDate.textContent = `${day}-${month}-${year}`;
};

//get list
const getList = (day, month, year) => {
  let matchingList = attendanceModel.getMatchingRecord(
    attendanceRecord,
    day,
    month,
    year
  );

  if (matchingList.length > 0) {
    //display list
    displayAttendanceList(matchingList);
  } else {
    document.getElementById("attendanceDispList").innerHTML =
      " <tr>" +
      ' <td colspan="4" class="text-center">' +
      "  <span>No record found</span>" +
      " </td>" +
      " </tr>";
  }
};
//list attendance
const listAttendance = () => {
  let date = new Date();
  let day = date.getDate();
  let month = date.getMonth() + 1;
  let year = date.getFullYear();
  let staffRecord = attendanceModel.getUsers().then(({ data }) => {
    staffData = data.rows;
    let attendance = attendanceModel.getAttendance();
    attendance.then(({ data }) => {
      attendanceRecord = data.rows;

      //get list
      getList(day, month, year);
      //enable button
      document.getElementById("processBtn").disabled = false;
      //add values to DOM
      document.getElementById("attendanceDay").value = day;
      document.getElementById("attendanceMonth").value = month;
      document.getElementById("attendanceYear").value = year;
      document.getElementById(
        "dispDate"
      ).textContent = `${day}-${month}-${year}`;
    });
  });
};

//process attendance list
const processAttendanceList = e => {
  e.preventDefault();

  let day = document.getElementById("attendanceDay").value;
  let month = document.getElementById("attendanceMonth").value;
  let year = document.getElementById("attendanceYear").value;

  //get list
  getList(day, month, year);
  document.getElementById("dispDate").textContent = `${day}-${month}-${year}`;
};

//search attendance
const searchAllAttendance = e => {
  let value = e.target.value;
  document.getElementById("attendanceDispList").innerHTML =
    " <tr>" +
    ' <td colspan="4" class="text-center">' +
    " <div class='spinner-grow text-success'></div>" +
    " </td>" +
    " </tr>";
  let day = document.getElementById("attendanceDay").value;
  let month = document.getElementById("attendanceMonth").value;
  let year = document.getElementById("attendanceYear").value;

  let matchingList = attendanceModel.getMatchingRecord(
    attendanceRecord,
    day,
    month,
    year
  );

  let searchList = attendanceModel.extractAttendance(matchingList, value);

  if (searchList.length > 0) {
    //display list
    displayAttendanceList(searchList);
  } else {
    document.getElementById("attendanceDispList").innerHTML =
      " <tr>" +
      ' <td colspan="4" class="text-center">' +
      "  <span>No record found</span>" +
      " </td>" +
      " </tr>";
  }
};

//submit attandance
const submitAttendance = e => {
  e.preventDefault();
  let valueId = document.getElementById("attendanceId").value;
  let errorBox = document.getElementById("attendanceAlert");
  let successBox = document.getElementById("attendanceSuc");
  if (!errorBox.classList.contains("hide")) {
    errorBox.classList.add("hide");
  }
  //get spinner
  let btnSpinner = document.getElementById("subAttandanceLoader");
  btnSpinner.classList.add("spinner-border");
  btnSpinner.classList.add("spinner-border-sm");

  //get todays date
  let date = new Date();
  let day = date.getDate();
  let month = date.getMonth() + 1;
  let year = date.getFullYear();

  //check if such id exists
  if (attendanceModel.invalidId(valueId)) {
    displayError(errorBox, "Invalid Staff Id");
    let btnSpinner = document.getElementById("subAttandanceLoader");
    btnSpinner.classList.remove("spinner-border");
    btnSpinner.classList.remove("spinner-border-sm");
  } else if (!attendanceModel.idExists(valueId, staffData)) {
    displayError(errorBox, "This Staff Id does not exist");
    let btnSpinner = document.getElementById("subAttandanceLoader");
    btnSpinner.classList.remove("spinner-border");
    btnSpinner.classList.remove("spinner-border-sm");
  } else if (
    attendanceModel.marked(attendanceRecord, valueId, day, month, year)
  ) {
    displayError(errorBox, "Attendance already recorded for this user today");
    let btnSpinner = document.getElementById("subAttandanceLoader");
    btnSpinner.classList.remove("spinner-border");
    btnSpinner.classList.remove("spinner-border-sm");
  } else {
    //get user details
    let thisUser = attendanceModel.getThisUser(staffData, valueId);

    //generate unique id
    let genId = attendanceModel.generateId();
    genId.then(ids => {
      let id = ids[0];
      //insert into attendance database
      let dataRecord = attendanceModel.recordAttendance(id, thisUser[0]);

      dataRecord.then(({ data, status }) => {
        if (status == 201) {
          //hide spinner
          btnSpinner.classList.remove("spinner-border");
          btnSpinner.classList.remove("spinner-border-sm");

          //show success attendance Alert
          if (successBox.classList.contains("hide")) {
            successBox.classList.remove("hide");
          }

          //HIDE modal
          hideGenStaticModal("attendanceContent");

          //go back and show list
          listAttendance();
        }
      });
    });
  }
};

//hide attendance modal
const hideAttendance = e => {
  //HIDE modal
  hideGenStaticModal("attendanceContent");
};

//exit staff
const exitStaff = e => {
  let id = e.target.dataset.id;

  //get date
  let day = document.getElementById("attendanceDay").value;
  let month = document.getElementById("attendanceMonth").value;
  let year = document.getElementById("attendanceYear").value;

  let date = new Date();

  let currDay = date.getDate();
  let currMonth = date.getMonth() + 1;

  let currYear = date.getFullYear();

  //check if we are in the current day
  if (currDay == day && currMonth == month && currYear == year) {
    let data = attendanceModel.getThisAttendance(
      attendanceRecord,
      day,
      month,
      year,
      id
    )[0];
  } else {
    //show error message
    showModal("You can no longer exit from this date");
  }
};
