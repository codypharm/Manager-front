//const axios = require("axios");
const ourStore = require("../../src/js/store");
const ourExpenseModel = require("../../models/expenseModel");
const modules = require("./modules");

// instantiate classes
const store = new ourStore();
const expenseModel = new ourExpenseModel();

class Expenses {
  constructor() {
    this.currentUser = store.getLoginDetail();
    this.setupDetails = store.getSetupDetail();
  }

  //upload
  uploadExpensesToRemote(expenses, proceedToAttendance) {
    //filter out Expenses with remote =  false
    let filteredExpenses = modules.filterExpenses(expenses);

    //upload these Expenses
    if (filteredExpenses.length > 0) {
      let upload = modules.upload(
        filteredExpenses,
        store.getSetupDetail().detail
      );
    }
    //move on while the task runs asynchronously
    proceedToAttendance();
  }

  //handle Expenses
 async handleExpenses(proceedToAttendance) {
    //get staff list
    const allExpenses =await expenseModel.getExpenses();
    this.uploadExpensesToRemote(allExpenses, proceedToAttendance);
  }
}

module.exports = Expenses;
