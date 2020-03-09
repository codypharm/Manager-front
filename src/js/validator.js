//import db file
const Database = require("./db");

class Validator extends Database {
  constructor() {
    super();
  }

  createSetup() {
    return this.couch.createDatabase("vemon_setup");
  }

  generateId() {
    return this.couch.uniqid();
  }

  insertDetails(details, id) {
    return this.couch.insert("vemon_setup", {
      id: id,
      package: details.package,
      companyName: details.companyName,
      address: details.address,
      companyId: details.companyId,
      branchId: details.branchId,
      manager_firstname: details.manager_firstname,
      manager_lastname: details.manager_lastname,
      manager_password: details.manager_password,
      manager_email: details.manager_email
    });
  }

  isEmpty(inputs) {
    //filter input
    let emptyInputs = inputs.filter(element => {
      return element.value.trim().length < 1;
    });

    //if any input is empty
    if (emptyInputs.length > 1) {
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
