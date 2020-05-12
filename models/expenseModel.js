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
}

module.exports = Expense;
