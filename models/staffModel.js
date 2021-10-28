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
    let staffId = "STF";
    staffId += Math.floor(Math.random() * 1000);
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
      staffId: staffId,
      address: {
        street: details.street,
        town: details.town,
        state: details.state
      },
      password: details.pwd,
      permission: details.permission,
      access: "open",
      regDay: date.getDate(),
      regMonth: date.getMonth() + 1,
      regYear: date.getFullYear(),
      remote: details.remote
    });
  }

  updateUser(id, rev, details, oldDetails) {
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
      staffId: oldDetails.value.staffId,
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
      password: details.pwd,
      regDay: details.regDay,
      regMonth: details.regMonth,
      regYear: details.regYear,
      updateDay: date.getDate(),
      updateMonth: date.getMonth() + 1,
      updateYear: date.getFullYear(),
      editedBy: loginDetail.fname + " " + loginDetail.lname,
      editorEmail: loginDetail.email,
      remote: oldDetails.value.remote
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
        street: details.address.street,
        town: details.address.town,
        state: details.address.state
      },
      //pwd: details.pwd,
      permission: details.permission,
      access: details.access,
      image: imageName,
      password: details.pwd,
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
      staffId: details.staffId,
      address: {
        street: details.street,
        town: details.town,
        state: details.state
      },
      permission: details.permission,
      access: details.access,
      image: details.image,
      password: details.pwd,
      regDay: details.regDay,
      regMonth: details.regMonth,
      regYear: details.regYear,
      updateDay: details.updateDay,
      updateMonth: details.updateMonth,
      updateYear: details.updateYear,
      editedBy: details.editedBy,
      editorEmail: details.editorEmail,
      remote: details.remote
    });
  }

  //update remote status
  async updateAfterRemoteUpload(id, rev, details) {
    return this.couch.update("users", {
      _id: id,
      _rev: rev,
      firstname: details.fname[0].toUpperCase() + details.fname.slice(1),
      lastname: details.lname[0].toUpperCase() + details.lname.slice(1),
      email: details.email,
      number: details.number,
      position: details.position,
      gender: details.gender,
      staffId: details.staffId,
      address: {
        street: details.street,
        town: details.town,
        state: details.state
      },
      permission: details.permission,
      access: details.access,
      image: details.image,
      password: details.pwd,
      regDay: details.regDay,
      regMonth: details.regMonth,
      regYear: details.regYear,
      updateDay: details.updateDay,
      updateMonth: details.updateMonth,
      updateYear: details.updateYear,
      editedBy: details.editedBy,
      editorEmail: details.editorEmail,
      remote: true
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

  filterStaffDetails(users, id) {
    let match = users.filter(user => {
      //filter email match or ID match
      return (
        user.value.email == id ||
        user.value.staffId.toUpperCase() == id.toUpperCase()
      );
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

  extractUsers(allUsers, val) {
    let email = store.getLoginDetail().email;
    let fname = store.getLoginDetail().fname;
    let lname = store.getLoginDetail().lname;
    let userName = fname.toUpperCase() + " " + lname.toUpperCase();
    let match = allUsers.filter(user => {
      let nameArray = [user.value.fname, user.value.lname];
      let concatName = nameArray.join(" ");

      return (
        (user.value.fname.toUpperCase().includes(val.toUpperCase()) ||
          user.value.lname.toUpperCase().includes(val.toUpperCase()) ||
          concatName.toUpperCase().includes(val.toUpperCase())) &&
        user.value.email != email
      );
    });

    if (match.length > 0) {
      return match;
    } else {
      if (!userName.includes(val.toUpperCase())) {
        return false;
      }
    }
  }
}

module.exports = staffModel;
