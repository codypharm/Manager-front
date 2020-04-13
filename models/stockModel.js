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

  notAlphaNumeric(id) {
    let regex = /^[a-z0-9]+$/i;
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
        product.productId.toUpperCase() ==
          productId.value.trim().toUpperCase() ||
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
        (product.productId.toUpperCase() ==
          productId.value.trim().toUpperCase() ||
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
      store.setRecordStore(match);
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
}

module.exports = stockModel;
