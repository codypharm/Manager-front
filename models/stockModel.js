/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
//import db file
const Database = require("../src/js/db");

class stockModel extends Database {
  constructor() {
    super();
  }

  getStock() {
    let viewUrl = this.viewUrl.stock;
    return this.couch.get("stock", viewUrl);
  }

  isEmpty(inputs) {
    //filter input
    let emptyInputs = inputs.filter(element => {
      return element.value.trim().length < 1;
    });

    //if any input is empty
    if (emptyInputs.length > 0) {
      return true;
    }
  }

  idExists(stock, id) {
    let match = stock.filter(product => {
      return product.value.prodId == id.value.trim();
    });

    if (match.length > 0) {
      return true;
    }
  }

  noNameMatch(stock, id, name) {
    let match = stock.filter(product => {
      return (
        product.value.prodId == id.value.trim() &&
        product.value.name.toUpperCase() != name.value.trim().toUpperCase()
      );
    });

    if (match.length > 0) {
      return true;
    }
  }

  nameError(stock, id, name) {
    let match = stock.filter(product => {
      return (
        product.value.prodId != id.value.trim() &&
        product.value.name.toUpperCase() == name.value.trim().toUpperCase()
      );
    });

    if (match.length > 0) {
      return true;
    }
  }

  noBrandMatch(stock, id, brand) {
    let match = stock.filter(product => {
      return (
        product.value.prodId == id.value.trim() &&
        product.value.brand.toUpperCase() != brand.value.trim().toUpperCase()
      );
    });

    if (match.length > 0) {
      return true;
    }
  }

  noFormMatch(stock, id, form) {
    let match = stock.filter(product => {
      return (
        product.value.prodId == id.value.trim() &&
        product.value.form.toUpperCase() != form.value.trim().toUpperCase()
      );
    });

    if (match.length > 0) {
      return true;
    }
  }

  expError(stock, id, date) {
    let match = stock.filter(product => {
      return (
        product.value.prodId == id.value.trim() &&
        product.value.expDate != "" &&
        date.value.trim() == ""
      );
    });

    if (match.length > 0) {
      return true;
    }
  }

  notNumeric(id) {
    let regex = /^[0-9]+$/i;
    if (!regex.test(id.value.trim())) {
      return true;
    }
  }

  unitError(stock, id, unit) {
    let match = stock.filter(product => {
      return (
        product.value.prodId == id.value.trim() &&
        product.value.unit != unit.value.trim()
      );
    });

    if (match.length > 0) {
      return true;
    }
  }

  priceError(stock, id, unit) {
    let match = stock.filter(product => {
      return (
        product.value.prodId == id.value.trim() &&
        product.value.price != price.value.trim()
      );
    });

    if (match.length > 0) {
      return true;
    }
  }

  productInList(recordedProduct, name, productId) {
    let match = recordedProduct.filter(product => {
      return (
        product.productId == productId.value.trim() ||
        product.name.toUpperCase() == name.value.trim().toUpperCase()
      );
    });

    if (match.length > 0) {
      return true;
    }
  }

  productInEditList(recordedProduct, name, productId, no) {
    let match = recordedProduct.filter(product => {
      return (
        (product.productId == productId.value.trim() ||
          product.name.toUpperCase() == name.value.trim().toUpperCase()) &&
        product.no != no
      );
    });

    if (match.length > 0) {
      return true;
    }
  }

  deleteProduct(recordedProduct, id) {
    let match = recordedProduct.filter(product => {
      return product.productId != id;
    });

    if (match.length > 0) {
      return match;
    }
  }

  getProduct(recordedProduct, id) {
    let match = recordedProduct.filter(product => {
      return product.productId == id;
    });

    if (match.length > 0) {
      return match;
    }
  }

  getMatch(stock, id) {
    let match = stock.filter(product => {
      return product.value.prodId == id;
    });

    if (match.length > 0) {
      return match;
    }
  }

  updateRecord(recordedProduct, detail, updateTargetNo) {
    recordedProduct.forEach(product => {
      if (product.no == updateTargetNo) {
        product.productId = detail.productId;
        product.name = detail.name;
        product.brand = detail.brand;
        product.expDate = detail.expDate;
        product.totalCost = detail.totalCost;
        product.form = detail.form;
        product.unit = detail.unit;
        product.qty = detail.qty;
        product.price = detail.price;
        product.error = detail.error;
      }
    });
    store.setRecordStore(recordedProduct);
    return recordedProduct;
  }

  getLastProduct(recordedProduct, n) {
    if (recordedProduct == null) return void 0;
    if (n == null) return recordedProduct[recordedProduct.length - 1];
    return recordedProduct.slice(Math.max(recordedProduct.length - n, 0));
  }

  generateId() {
    return this.couch.uniqid();
  }

  uploadList(product, id) {
    let batchId = "BT";
    batchId += Math.floor(Math.random() * 10000000);
    let loginDetail = store.getLoginDetail();
    let date = new Date();

    //define error
    let error;

    if (product.error != "") {
      error = product.error[0].toUpperCase() + product.error.slice(1);
    } else {
      error = "";
    }
    return this.couch.insert("stock", {
      id: id,
      name: product.name[0].toUpperCase() + product.name.slice(1),
      productId: product.productId,
      brand: product.brand[0].toUpperCase() + product.brand.slice(1),
      expDate: product.expDate,
      totalCost: product.totalCost,
      qty: product.qty,
      unit: product.unit,
      form: product.form[0].toUpperCase() + product.form.slice(1),
      price: product.price,
      error: error,
      batchId: batchId,
      day: date.getDate(),
      month: date.getMonth() + 1,
      year: date.getFullYear(),
      recorder: loginDetail.fname + " " + loginDetail.lname,
      recorderEmail: loginDetail.email
    });
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
            item.value.qty = Number(item.value.qty) + Number(product.value.qty);
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
}

module.exports = stockModel;
