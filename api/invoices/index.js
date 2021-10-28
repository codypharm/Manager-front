//const axios = require("axios");
const ourStore = require("../../src/js/store");
const ourInvoicesModel = require("../../models/invoiceModel");
const modules = require("./modules");

// instantiate classes
const store = new ourStore();
const invoiceModel = new ourInvoicesModel();

class Invoices {
  constructor() {
    this.currentUser = store.getLoginDetail();
    this.setupDetails = store.getSetupDetail();
  }

  //upload
  uploadInvoicesToRemote(invoices, proceedToClearance) {
    //filter out Invoices with remote =  false
    let filteredInvoices = modules.filterInvoices(invoices);

    //upload these Invoices
    if (filteredInvoices.length > 0) {
      let upload = modules.upload(
        filteredInvoices,
        this.setupDetails.detail[0]
      );
    }
    //move on while the task runs asynchronously
    proceedToClearance();
  }

  //handle Invoices
  handleInvoices(proceedToClearance) {
    //get staff list
    const allInvoices = invoiceModel.getAllInvoices();
    allInvoices.then(({ data, headers, status }) => {
      this.uploadInvoicesToRemote(data.rows, proceedToClearance);
    });
  }
}

module.exports = Invoices;
