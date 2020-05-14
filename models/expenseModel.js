/* eslint-disable no-unused-vars */
//import db file
const Database = require("../src/js/db");

class Expense extends Database {
  constructor() {
    super();
  }

  generateId() {
    return this.couch.uniqid();
  }

  getExpenses() {
    let viewUrl = this.viewUrl.expenses;
    return this.couch.get("expenses", viewUrl);
  }

  isEmpty(inputs) {
    let match = inputs.filter(input => {
      return input.length < 1;
    });
    if (match.length > 0) {
      return true;
    }
  }

  isNotNumb(value) {
    let numb = /[0-9]/;
    if (!numb.test(value) || value < 1) {
      return true;
    }
  }

  notAlpha(name) {
    let reg = /^[a-zA-Z\s]+$/;
    if (!reg.test(name)) {
      return true;
    }
  }

  notExist(staffId, users) {
    let match = users.filter(user => {
      return user.value.staffId == staffId;
    });

    if (!match.length > 0) {
      return true;
    }
  }

  insertExpense(id, amt, description, name) {
    let date = new Date();
    return this.couch.insert("expenses", {
      id: id,
      name: name[0].toUpperCase() + name.slice(1),
      amt: amt,
      description: description[0].toUpperCase() + description.slice(1),
      day: date.getDate(),
      month: date.getMonth() + 1,
      year: date.getFullYear()
    });
  }

  matchExpense(expenses, day, month, year) {
    let match = expenses.filter(expense => {
      return (
        expense.value.day == day &&
        expense.value.month == month &&
        expense.value.year == year
      );
    });

    if (match.length > 0) {
      return match;
    } else {
      return false;
    }
  }

  deleteExpense(id, rev) {
    //delete from db
    return this.couch.del("expenses", id, rev);
  }

  removeExpense(expenses, id) {
    //filter out expeses
    let match = expenses.filter(expense => {
      return expense.id != id;
    });

    if (match.length > 0) {
      return match;
    } else {
      return [];
    }
  }
}

module.exports = Expense;
