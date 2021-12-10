/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
//import db file
const moment = require("moment");

class reportModel {
  

  getMatchingExp(month, year, allExp) {
    let match = allExp.filter(expense => {
      return expense.month == month && expense.year == year;
    });

    return match;
  }

  getMatchingSales(sales, month, year) {
    let match = sales.filter(sale => {
      return sale.month == month && sale.year == year;
    });

    if (match.length > 0) {
      return match;
    } else {
      return false;
    }
  }

  checkSortedArray(sortedArray, product) {
    let match = sortedArray.filter(item => {
      return item.productId == product.productId;
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
          if (item.productId == product.productId) {
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
      if (product.expDate.length > 0) {
        let expDateArray = product.expDate.split("-");

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
        invoice.month == Number(month) &&
        invoice.year == Number(year)
      );
    });

    if (match.length > 0) {
      return match;
    } else {
      return false;
    }
  }
}

module.exports = reportModel;
