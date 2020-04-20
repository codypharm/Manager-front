/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
//import db file
const Database = require("../src/js/db");

class salesModel extends Database {
  constructor() {
    super();
  }

  generateId() {
    return this.couch.uniqid();
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

  productExists(stock, id) {
    let match = stock.filter(product => {
      return (
        product.value.prodId == id.value.trim() ||
        product.value.name.toUpperCase() == id.value.trim().toUpperCase()
      );
    });

    if (match.length > 0) {
      return true;
    }
  }

  getUnit(stock, id) {
    let unit = 0;
    stock.forEach(product => {
      if (product.value.prodId == id) {
        unit = product.value.unit;
      }
    });

    return parseInt(unit, 10);
  }

  getMatchInCart(cart, id) {
    let qty = 0;
    cart.forEach(product => {
      if (
        product.productId == id ||
        product.name.toUpperCase() == id.toUpperCase()
      ) {
        qty = product.qty;
      }
    });

    return qty;
  }

  checkCart(cart, id) {
    let match = cart.filter(product => {
      return (
        product.productId == id ||
        product.name.toUpperCase() == id.toUpperCase()
      );
    });

    if (match.length > 0) {
      return true;
    }
  }

  addUpMatch(stock, id) {
    let matchQty = 0;
    stock.forEach(product => {
      if (
        product.value.prodId == id ||
        product.value.name.toUpperCase() == id.toUpperCase()
      ) {
        matchQty += Number(product.value.qty);
      }
    });
    return matchQty;
  }

  getProduct(stock, id, qty, unit) {
    let obj;
    let price;
    stock.forEach(product => {
      if (
        product.value.prodId == id ||
        product.value.name.toUpperCase() == id.toUpperCase()
      ) {
        price = (product.value.price * qty) / unit;
        obj = {
          id: product.id,
          name: product.value.name,
          productId: product.value.prodId,
          brand: product.value.brand,
          qty: qty,
          initialPrice: product.value.price,
          price: price
        };
      }
    });

    return obj;
  }

  updateCartValue(cart, id, qty, unit) {
    let price;
    cart.forEach(product => {
      if (
        product.productId == id ||
        product.name.toUpperCase() == id.toUpperCase()
      ) {
        price = (product.initialPrice * qty) / unit;
        product.qty = qty;
        product.price = price;
      }
    });
    return cart;
  }
}

module.exports = salesModel;
