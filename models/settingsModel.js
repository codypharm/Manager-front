/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
//import db file

const moment = require("moment");

class settingsModel {
  async getSetup() {
    let { rows } = await setupDb.allDocs();
    let setup = await generateWorkingList(setupDb, rows);
    return setup[0];
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

  async updateSetUp(detail, id) {
    return setupDb.put({
      _id: id,
      _rev: detail._rev,
      address: detail.address,
      package: detail.package,
      branchId: detail.branchId,
      companyId: detail.companyId,
      companyName: detail.companyName,
      //email: detail.email,
      expiration_limit: detail.expiration_limit,
      logout_time: detail.logout_time,
      phone: detail.phone,
      stock_limit: detail.stock_limit,
      update_interval: detail.update_interval
    });
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
