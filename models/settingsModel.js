/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
//import db file
const Database = require("../src/js/db");
const moment = require("moment");

class settingsModel extends Database {
  constructor() {
    super();
  }

  generateId() {
    return this.couch.uniqid();
  }

  getSetup() {
    let viewUrl = this.viewUrl.setup;
    return this.couch.get("vemon_setup", viewUrl);
  }

  getStock() {
    let viewUrl = this.viewUrl.stock;
    return this.couch.get("stock", viewUrl);
  }

  getExpenses() {
    let viewUrl = this.viewUrl.expenses;
    return this.couch.get("expenses", viewUrl);
  }

  getAllInvoices() {
    let viewUrl = this.viewUrl.invoices;
    return this.couch.get("invoice", viewUrl);
  }

  getSales() {
    let viewUrl = this.viewUrl.sales;
    return this.couch.get("sales", viewUrl);
  }

  getMatchingExp(month, year, allExp) {
    let match = allExp.filter(expense => {
      return expense.value.month == month && expense.value.year == year;
    });

    if (match.length > 0) {
      return match;
    } else {
      return false;
    }
  }
  /*
  getMatchingSales(sales, month, year) {
    let match = sales.filter(sale => {
      return sale.value.month == month && sale.value.year == year;
    });

    if (match.length > 0) {
      return match;
    } else {
      return false;
    }
  }

  checkSortedArray(sortedArray, product) {
    let match = sortedArray.filter(item => {
      return item.value.prodId == product.value.prodId;
    });
    if (match.length > 0) {
      return true;
    } else {
      return false;
    }
  }

  sortStock(stock) {
    let sortedArray = [];

    //loop through stock
    stock.forEach(product => {
      //loop through sorted array

      if (sortedArray.length > 0) {
        //check if in array
        sortedArray.forEach(item => {
          //if match is found
          if (item.value.prodId == product.value.prodId) {
            //add up
            //do nothing
          } else {
            //check if object is already in sorted array
            let condition = this.checkSortedArray(sortedArray, product);
            //check if not in sorted array
            if (!condition) {
              sortedArray.push(product);
            }
          }
        });
      } else {
        sortedArray.push(product);
      }
    });

    return sortedArray;
  }

  searchProductReportList(value, list) {
    let match = list.filter(item => {
      return (
        item.id.includes(value) ||
        item.name.toUpperCase().includes(value.toUpperCase())
      );
    });

    if (match.length > 0) {
      return match;
    } else {
      return false;
    }
  }

  getMonthExpiredStock(stock, month, year) {
    let expProducts = [];

    stock.forEach(product => {
      if (product.value.expDate.length > 0) {
        let expDateArray = product.value.expDate.split("-");

        if (
          Number(expDateArray[0]) == Number(year) &&
          Number(expDateArray[1]) == Number(month)
        ) {
          expProducts.push(product);
        }
      }
    });

    return expProducts;
  }

  getMatchInvoices(invoices, month, year) {
    let match = invoices.filter(invoice => {
      return (
        invoice.value.month == Number(month) &&
        invoice.value.year == Number(year)
      );
    });

    if (match.length > 0) {
      return match;
    } else {
      return false;
    }
  }*/
}

module.exports = settingsModel;
