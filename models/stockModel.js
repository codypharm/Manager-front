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
        product.value.name != name.value.trim()
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
        product.value.name == name.value.trim()
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
        product.value.brand != brand.value.trim()
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
        product.value.form != form.value.trim()
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
        product.name == name.value.trim()
      );
    });

    if (match.length > 0) {
      return true;
    }
  }

  getLastProduct(recordedProduct, n) {
    if (recordedProduct == null) return void 0;
    if (n == null) return recordedProduct[recordedProduct.length - 1];
    return recordedProduct.slice(Math.max(recordedProduct.length - n, 0));
  }
}

module.exports = stockModel;
