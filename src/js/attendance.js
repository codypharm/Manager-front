/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */

//global variables
let attendanceRecord;
const recordAttendance = e => {
  showGenStaticModal("attendanceContent");
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
    document.getElementById("dispDate").textContent = `${day}-${month}-${year}`;
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
