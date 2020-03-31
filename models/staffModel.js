/* eslint-disable no-unused-vars */
//import db file
const Database = require("../src/js/db");

class staffModel extends Database {
  constructor() {
    super();
  }

  generateId() {
    return this.couch.uniqid();
  }

  getUsers() {
    let viewUrl = this.viewUrl.users;
    return this.couch.get("users", viewUrl);
  }

  insertDetails(details, id) {
    return this.couch.insert("users", {
      id: id,
      firstname: details.fname[0].toUpperCase() + details.fname.slice(1),
      lastname: details.lname[0].toUpperCase() + details.lname.slice(1),
      email: details.email,
      number: details.number,
      position: details.position,
      gender: details.gender,
      address: {
        street: details.street,
        town: details.town,
        state: details.state
      },
      pwd: details.pwd,
      permission: details.permission,
      access: "open"
    });
  }

  updateUser(id, rev, details) {
    return this.couch.update("users", {
      _id: id,
      _rev: rev,
      firstname: details.fname[0].toUpperCase() + details.fname.slice(1),
      lastname: details.lname[0].toUpperCase() + details.lname.slice(1),
      email: details.email,
      number: details.number,
      position: details.position,
      gender: details.gender,
      address: {
        street: details.street,
        town: details.town,
        state: details.state
      },
      //pwd: details.pwd,
      permission: details.permission,
      access: details.access,
      image: details.image,
      pwd: details.pwd
    });
  }

  filterUsers(users, email) {
    let match = users.filter(user => {
      return user.value.email == email.value.trim();
    });

    if (match.length > 0) {
      return true;
    }
  }

  filterNumber(users, number) {
    let match = users.filter(user => {
      return user.value.number == number.value.trim();
    });

    if (match.length > 0) {
      return true;
    }
  }

  filterStaffDetails(users, email) {
    let match = users.filter(user => {
      //filter email match
      return user.value.email == email;
    });

    if (match.length > 0) {
      return match;
    }
  }
}

module.exports = staffModel;
