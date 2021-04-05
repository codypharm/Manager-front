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

const proceedToNext = () => {
  console.log("next");
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
//login current user to server
const login = users.loginRemote(proceed);
