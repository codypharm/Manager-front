//import db file
const Database = require("./db");

class Validator extends Database {
  constructor() {
    super();
  }

  createDb(dbName) {
    return this.couch.createDatabase(dbName);
  }

  generateId() {
    return this.couch.uniqid();
  }

  insertDetails(details, id) {
    return this.couch.insert("vemon_setup", {
      id: id,
      package: details.package,
      companyName:
        details.companyName[0].toUpperCase() + details.companyName.slice(1),
      address: details.address,
      companyId: details.companyId,
      branchId: details.branchId,
      manager_firstname:
        details.manager_firstname[0].toUpperCase() +
        details.manager_firstname.slice(1),
      manager_lastname:
        details.manager_lastname[0].toUpperCase() +
        details.manager_lastname.slice(1),
      manager_password: details.manager_password,
      manager_email: details.manager_email
    });
  }

  insertUser(details, id) {
    return this.couch.insert("users", {
      id: id,
      firstname:
        details.manager_firstname[0].toUpperCase() +
        details.manager_firstname.slice(1),
      lastname:
        details.manager_lastname[0].toUpperCase() +
        details.manager_lastname.slice(1),
      password: details.manager_password,
      email: details.manager_email,
      position: "manager",
      access: "open"
    });
  }

  isEmpty(inputs) {
    //filter input
    let emptyInputs = inputs.filter(element => {
      return element.value.trim().length < 1;
    });

    //if any input is empty
    if (emptyInputs.length > 0) {
      return true;
    }
  }

  isNotAlpha(value) {
    //check if alphabet only
    if (!/^[a-zA-Z]+$/.test(value)) {
      return true;
    }
  }

  isNotEmail(value) {
    if (
      // eslint-disable-next-line no-useless-escape
      !/^([a-zA-Z0-9_\-\.]+)@([a-zA-Z0-9_\-\.]+)\.([a-zA-Z]{2,5})$/.test(value)
    ) {
      return true;
    }
  }

  notValidPassword(pwd) {
    let match = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%#?=&])[A-Za-z\d@$!%*#?=&]{6,}$/;
    if (!match.test(pwd)) {
      return true;
    }
  }
}

module.exports = Validator;
