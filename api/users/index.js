const axios = require("axios");
const ourStore = require("../../src/js/store");
const ourStaffModel = require("../../models/staffModel");
const modules = require("./modules");

// instantiate classes
const store = new ourStore();
const staffModel = new ourStaffModel();

class Users {
  constructor() {
    this.currentUser = store.getLoginDetail();
  }

  loginRemote(proceed) {
    axios
      .post("http://127.0.0.1:8000/login/", {
        email: this.currentUser.email,
        password: this.currentUser.pwd
      })
      .then(res => {
        //store tokens
        store.setTokens(res.data.access, res.data.refresh);
        proceed();
      })
      .catch(err => {
        console.log(err);
        //reset tokens to empty data
        store.setTokens(false, false);
      });
  }

  //upload
  uploadUsersToRemote(users, proceedToStock) {
    //filter out users with remote =  false
    let filteredUsers = modules.filterUsers(users);
    //upload these users
    if (filteredUsers.length > 0) {
      let upload = modules.upload(filteredUsers);
    }
    //move on while the task runs asynchronously
    proceedToStock();
  }

  //handle users
  handleUsers(proceedToStock) {
    //get staff list
    const allStaff = staffModel.getUsers();
    allStaff.then(({ data, headers, status }) => {
      this.uploadUsersToRemote(data.rows, proceedToStock);
    });
  }
}

module.exports = Users;
