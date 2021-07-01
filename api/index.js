const usersClass = require("./users");
const stockClass = require("./stock");
const activityClass = require("./activities");
const expenseClass = require("./expenses");
const attendanceClass = require("./attendance");
const salesClass = require("./sales");
const invoicesClass = require("./invoices");
const clearanceClass = require("./clearance");
const ourStore = require("../src/js/store");

//instantiate classes

const store = new ourStore();

const users = new usersClass();
const stock = new stockClass();
const activities = new activityClass();
const expenses = new expenseClass();
const attendance = new attendanceClass();
const sales = new salesClass();
const invoices = new invoicesClass();
const clearance = new clearanceClass();
const { ipcRenderer } = require("electron");
const { CATCH_ON_MAIN } = require("../utils/constants");
const { Notyf } = require("notyf");

const proceedToNext = () => {
  //notification for synchronization completion
  //ipcRenderer.send(CATCH_ON_MAIN, "synchronization done");
  // Create an instance of Notyf
  const notyf = new Notyf({
    duration: 3000
  });

  // Display an error notification
  notyf.success("Synchronization completed");
  //remove disabled and also loading sign
  document.querySelector("#syncBtn").disabled = false;
  document.getElementById("sync").style.display = "none";
};

const proceedToClearance = () => {
  clearance.handleClearance(proceedToNext);
};
const proceedToInvoices = () => {
  invoices.handleInvoices(proceedToClearance);
};

const proceedToSales = () => {
  sales.handleSales(proceedToInvoices);
};
const proceedToAttendance = () => {
  attendance.handleAttendance(proceedToSales);
};

const proceedToExpenses = () => {
  expenses.handleExpenses(proceedToAttendance);
};
//handle activities
const proceedToActivities = () => {
  activities.handleActivities(proceedToExpenses);
};

//proceed to uploading
const proceedToStock = () => {
  stock.handleStock(proceedToActivities);
};

//proceed after login
const proceed = () => {
  users.handleUsers(proceedToStock);
};
const startSynchronization = () => {
  //login current user to server
  const login = users.loginRemote(proceed);
};

module.exports = startSynchronization;
