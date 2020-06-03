/* eslint-disable no-undef */
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
    let date = new Date();
    return this.couch.insert("users", {
      id: id,
      firstname: details.fname[0].toUpperCase() + details.fname.slice(1),
      lastname: details.lname[0].toUpperCase() + details.lname.slice(1),
      email: details.email,
      number: details.number,
      position: details.position,
      gender: details.gender,
      image: "../images/profile.png",
      address: {
        street: details.street,
        town: details.town,
        state: details.state
      },
      pwd: details.pwd,
      permission: details.permission,
      access: "open",
      regDay: date.getDate(),
      regMonth: date.getMonth() + 1,
      regYear: date.getFullYear()
    });
  }

  updateUser(id, rev, details) {
    let date = new Date();
    let loginDetail = store.getLoginDetail();
    return this.couch.update("users", {
      _id: id,
      _rev: rev,
      firstname: details.fname[0].toUpperCase() + details.fname.slice(1),
      lastname: details.lname[0].toUpperCase() + details.lname.slice(1),
      email: details.email,
      number: details.number,
      position: details.position,
      staffId: details.staffId,
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
      pwd: details.pwd,
      regDay: details.regDay,
      regMonth: details.regMonth,
      regYear: details.regYear,
      updateDay: date.getDate(),
      updateMonth: date.getMonth() + 1,
      updateYear: date.getFullYear(),
      editedBy: loginDetail.fname + " " + loginDetail.lname,
      editorEmail: loginDetail.email
    });
  }

  updateUserImage(id, details, imageName) {
    let date = new Date();
    let loginDetail = store.getLoginDetail();
    return this.couch.update("users", {
      _id: id,
      _rev: details.rev,
      firstname: details.fname[0].toUpperCase() + details.fname.slice(1),
      lastname: details.lname[0].toUpperCase() + details.lname.slice(1),
      email: details.email,
      number: details.number,
      position: details.position,
      staffId: details.staffId,
      gender: details.gender,
      address: {
        street: details.street,
        town: details.town,
        state: details.state
      },
      //pwd: details.pwd,
      permission: details.permission,
      access: details.access,
      image: imageName,
      pwd: details.pwd,
      regDay: details.regDay,
      regMonth: details.regMonth,
      regYear: details.regYear,
      updateDay: date.getDate(),
      updateMonth: date.getMonth() + 1,
      updateYear: date.getFullYear(),
      editedBy: loginDetail.fname + " " + loginDetail.lname,
      editorEmail: loginDetail.email
    });
  }

  //update status
  updateStatus(id, rev, details) {
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
      permission: details.permission,
      access: details.access,
      image: details.image,
      pwd: details.pwd,
      regDay: details.regDay,
      regMonth: details.regMonth,
      regYear: details.regYear,
      updateDay: details.updateDay,
      updateMonth: details.updateMonth,
      updateYear: details.updateYear,
      editedBy: details.editedBy,
      editorEmail: details.editorEmail
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

  filterOutUser(users, email) {
    let match = users.filter(user => {
      //filter email match
      return user.value.email !== email;
    });

    if (match.length > 0) {
      return match;
    }
  }
}

module.exports = staffModel;
