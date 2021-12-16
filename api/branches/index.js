/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */
const axios = require("axios");
const axiosInstance = require("../axiosInstance");
const ourStore = require("../../src/js/store");
//const ourStaffModel = require("../../models/staffModel");
//const modules = require("./modules");
const { Notyf } = require("notyf");
const env = require("../../utils/appConstants");

// instantiate classes
const store = new ourStore();
//const staffModel = new ourStaffModel();

class Branches {
  constructor() {
    this.currentUser = store.getLoginDetail();
  }

  branchProcess(
    proceed,
    email = false,
    password = false,
    setup = false,
    RendShowLoading = false,
    RendHideLoading = false
  ) {
    if (setup) {
      RendShowLoading();
    }
    axios
      .post(`${env.BACKEND_URL}/login/`, {
        email: env.APP,
        password: env.PASSWORD
        // email: email ? email : this.currentUser.email,
        // password: password ? password : this.currentUser.pwd
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
        //document.querySelector("#syncBtn").disabled = false;
        //document.getElementById("sync").style.display = "none";
        //reset tokens to empty data
        store.setTokens(false, false);
        //set sync store
        //store.setSyncState(false);
        //hide loading sign
        if (!setup) {
          hideLoading();
        } else {
          setup();
        }

        if (setup) {
          RendHideLoading();
        }
      });
  }

  //fetch matching branch
  fetchMatch(
    company,
    branch,
    continuePremium,
    setup,
    RendShowLoading = false,
    RendHideLoading = false
  ) {
    axiosInstance
      .get(`branches/${company}/${branch}/`)
      .then(res => {
        continuePremium(res.data);
      })
      .catch(err => {
        console.log(err);
        const notyf = new Notyf({
          duration: 5000
        });

        // Display an error notification
        notyf.error(`An error occurred`);
        if (!setup) {
          hideLoading();
        } else {
          setup();
        }

        if (setup) {
          RendHideLoading();
        }
      });
  }

  //update branch online
  updateBranchOnline(
    id,
    detail,
    fxn,
    setup,
    RendShowLoading = false,
    RendHideLoading = false
  ) {
    axiosInstance
      .put(`branches/branch/${id}/`, {
        branchId: detail.branchId,
        companyId: detail.companyId,
        address: detail.address,
        phone: detail.phone
      })
      .then(res => {
        //store tokens
        store.setTokens(res.data.access, res.data.refresh);
        fxn();
      })
      .catch(err => {
        let errorMessage = "An error occurred";

        const notyf = new Notyf({
          duration: 5000
        });

        // Display an error notification
        notyf.error(`${errorMessage}`);
        if (!setup) {
          hideLoading();
        } else {
          setup();
        }

        if (setup) {
          RendHideLoading();
        }
      });
  }
}

module.exports = Branches;
