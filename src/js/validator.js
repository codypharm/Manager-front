/* eslint-disable no-undef */
//import db file

const crypto = require("crypto");
//require("dotenv").config();
const env = require("../../utils/appConstants");

const {
  verifyPhoneNumber,
  // eslint-disable-next-line no-unused-vars
  COUNTRY_CODE
} = require("nigerian-phone-number-validator");

class Validator {
  async insertDetails(details) {
    return setupDb.put({
      _id: `${+new Date()}`,
      package: details.package,
      companyName:
        details.companyName[0].toUpperCase() + details.companyName.slice(1),
      address: details.address,
      companyId: details.companyId,
      branchId: details.branchId,
      phone: details.phone,
      manager_firstname:
        details.manager_firstname[0].toUpperCase() +
        details.manager_firstname.slice(1),
      manager_lastname:
        details.manager_lastname[0].toUpperCase() +
        details.manager_lastname.slice(1),
      manager_password: details.manager_password,
      manager_email: details.manager_email,
      remote: false,
      expiration_limit: "90",
      logout_time: "30mins",

      stock_limit: "30",
      update_interval: "1hr"
    });
  }

  async insertUser(details) {
    let staffId = "STF";
    staffId += Math.floor(Math.random() * 1000);
    let date = new Date();
    return usersDb.put({
      _id: `${+new Date()}`,
      image: "../images/profile.png",
      staffId: staffId,
      firstname:
        details.manager_firstname[0].toUpperCase() +
        details.manager_firstname.slice(1),
      lastname:
        details.manager_lastname[0].toUpperCase() +
        details.manager_lastname.slice(1),
      password: details.manager_password,
      email: details.manager_email,
      address: {
        street: "",
        town: "",
        state: ""
      },
      number: "",
      gender: "",
      position: "manager",
      permission: "super_admin",
      access: "open",
      remote: false,
      regDay: date.getDate(),
      regMonth: date.getMonth(),
      regYear: date.getFullYear()
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
    if (!/^[a-zA-Z\s]+$/.test(value)) {
      return true;
    }
  }

  isNotPhoneNumber(number) {
    //check if its valid phone number
    if (!verifyPhoneNumber(number)) {
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

  invalidAppkey(appKey) {
    const secret = `${env.APP_SECRET}`;

    const hash = crypto
      .createHmac("sha256", secret)
      .update("4013-4567-3421-6789")
      .digest("hex");

    const newHash = crypto
      .createHmac("sha256", secret)
      .update(`${appKey}`)
      .digest("hex");

    if (hash !== newHash) return true;
  }
}

module.exports = Validator;
