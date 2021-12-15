//const axios = require("axios");
const ourStore = require("../../src/js/store");
const ourInvoicesModel = require("../../models/invoiceModel");
const modules = require("./modules");

// instantiate classes
const store = new ourStore();
const invoiceModel = new ourInvoicesModel();

class Clearance {
  constructor() {
    this.currentUser = store.getLoginDetail();
    this.setupDetails = store.getSetupDetail();
  }

  //upload
  uploadClearanceToRemote(clearance, proceedToNext) {
    //filter out Clearance with remote =  false
    let filteredClearance = modules.filterClearance(clearance);

    //upload these Clearance
    if (filteredClearance.length > 0) {
      let upload = modules.upload(
        filteredClearance,
        store.getSetupDetail().detail
      );
    }
    //move on while the task runs asynchronously
    proceedToNext();
  }

  //handle Clearance
  async handleClearance(proceedToNext) {
    //get clearance list
    const allClearance = await invoiceModel.getAllClearance();
    this.uploadClearanceToRemote(allClearance, proceedToNext);
  }
}

module.exports = Clearance;
