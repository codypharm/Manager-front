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
        this.setupDetails.detail[0]
      );
    }
    //move on while the task runs asynchronously
    proceedToAttendance();
  }

  //handle Expenses
  handleExpenses(proceedToAttendance) {
    //get staff list
    const allExpenses = expenseModel.getExpenses();
    allExpenses.then(({ data, headers, status }) => {
      this.uploadExpensesToRemote(data.rows, proceedToAttendance);
    });
  }
}

module.exports = Expenses;
