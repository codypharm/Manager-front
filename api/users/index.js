/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
const axios = require("axios");
const ourStore = require("../../src/js/store");
const ourStaffModel = require("../../models/staffModel");
const modules = require("./modules");
const { Notyf } = require("notyf");
const axiosInstance = require("../axiosInstance");
//require("dotenv").config();
const env = require("../../utils/appConstants")

// instantiate classes
const store = new ourStore();
const staffModel = new ourStaffModel();

class Users {
  constructor() {
    //this.currentUser = store.getLoginDetail();
   // this.setupDetails = store.getSetupDetail();
    
  }

  loginRemote(proceed) {
    axios
      .post(`${env.BACKEND_URL}/login/`, {
        email: env.APP,
        password: env.PASSWORD
      })
      .then(res => {
        //store tokens
        let setupDetails = store.getSetupDetail()
        store.setTokens(res.data.access, res.data.refresh);
        //check is expiration exists
        let companyId = setupDetails.detail.companyId;
        axiosInstance
          .get(`${env.BACKEND_URL}/companies/${companyId}`)
          .then(res => {
            let message = res.data.message;
            if (message.toUpperCase() === "OPEN") {
              proceed();
            } else {
              // Display an error notification
              const notyf = new Notyf({
                duration: 5000
              });
              notyf.error("Access denied, Company activation required");
              //remove disabled and also loading sign
              document.querySelector("#syncBtn").disabled = false;
              document.getElementById("sync").style.display = "none";
              //reset tokens to empty data
              store.setTokens(false, false);
              //set sync store
              store.setSyncState(false);
            }
          })
          .catch(err => {
            let errorMessage =
              "An error occurred, please check network connection and ensure you have correct company ID saved";
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
      })
      .catch(err => {
        let errorMessage = "An error occurred";
        console.log(err)
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
    let setupDetails = store.getSetupDetail()
    //filter out users with remote =  false
    let filteredUsers = modules.filterUsers(users);
    //upload these users
    if (filteredUsers.length > 0) {
      let upload = modules.upload(filteredUsers,setupDetails.detail);
    }
    //move on while the task runs asynchronously
    proceedToStock();
  }

  //handle users
 async handleUsers(proceedToStock) {
    //get staff list
    const allStaff = await staffModel.getUsers();
    this.uploadUsersToRemote(allStaff, proceedToStock);
  }
}

module.exports = Users;
