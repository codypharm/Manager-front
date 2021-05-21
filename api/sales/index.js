//const axios = require("axios");
const ourStore = require("../../src/js/store");
const ourSalesModel = require("../../models/salesModel");
const modules = require("./modules");

// instantiate classes
const store = new ourStore();
const salesModel = new ourSalesModel();

class Sales {
  constructor() {
    this.currentUser = store.getLoginDetail();
    this.setupDetails = store.getSetupDetail();
  }

  //upload
  uploadSalesToRemote(sales, proceedToInvoices) {
    //filter out Sales with remote =  false
    let filteredSales = modules.filterSales(sales);

    //upload these Sales
    if (filteredSales.length > 0) {
      let upload = modules.upload(filteredSales, this.setupDetails.detail[0]);
    }
    //move on while the task runs asynchronously
    proceedToInvoices();
  }

  //handle Sales
  handleSales(proceedToInvoices) {
    //get staff list
    const allSales = salesModel.getSales();
    allSales.then(({ data, headers, status }) => {
      this.uploadSalesToRemote(data.rows, proceedToInvoices);
    });
  }
}

module.exports = Sales;
