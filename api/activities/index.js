//const axios = require("axios");
const ourStore = require("../../src/js/store");
const ourStockModel = require("../../models/stockModel");
const modules = require("./modules");

// instantiate classes
const store = new ourStore();
const stockModel = new ourStockModel();

class Activities {
  constructor() {
    this.currentUser = store.getLoginDetail();
    this.setupDetails = store.getSetupDetail();
  }

  //upload
  uploadActivitiesToRemote(activities, proceedToExpenses) {
    //filter out Activities with remote =  false
    let filteredActivities = modules.filterActivities(activities);

    //upload these Activities
    if (filteredActivities.length > 0) {
      let upload = modules.upload(
        filteredActivities,
        store.getSetupDetail().detail
      );
    }
    //move on while the task runs asynchronously
    proceedToExpenses();
  }

  //handle Activities
 async handleActivities(proceedToExpenses) {
    //get staff list
    const allActivities = await stockModel.getActivities();
    this.uploadActivitiesToRemote(allActivities, proceedToExpenses);
    
  }
}

module.exports = Activities;
