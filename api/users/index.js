const axios = require("axios");
const ourStore = require("../../src/js/store");
const ourStaffModel = require("../../models/staffModel");
const modules = require("./modules");
const { Notyf } = require("notyf");

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
        let errorMessage = "An error occurred";

        if (err.response) {
          errorMessage = err.response.data.detail
            ? "Invalid online credentials or your account has not been activated"
            : "An error ocurred";
        }
        const notyf = new Notyf({
          duration: 5000
        });

        // Display an error notification
        notyf.error(`${errorMessage}`);
        //remove disabled and also loading sign
        document.querySelector("#syncBtn").disabled = false;
        document.getElementById("sync").style.display = "none";
        //reset tokens to empty data
        store.setTokens(false, false);
        //set sync store
        store.setSyncState(false);
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
