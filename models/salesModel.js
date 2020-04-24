/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
//import db file
const Database = require("../src/js/db");
const {
  verifyPhoneNumber,
  // eslint-disable-next-line no-unused-vars
  COUNTRY_CODE
} = require("nigerian-phone-number-validator");

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

  isNotAlpha(value) {
    //check if alphabet only
    if (!/^[a-zA-Z\s]+$/.test(value)) {
      return true;
    }
  }

  isNotPhoneNumber(number) {
    //check if its valid phone number
    if (!verifyPhoneNumber(number)) {
      return true;
    }
  }

  isNotEmail(value) {
    if (
      // eslint-disable-next-line no-useless-escape
      !/^([a-zA-Z0-9_\-\.]+)@([a-zA-Z0-9_\-\.]+)\.([a-zA-Z]{2,5})$/.test(value)
    ) {
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
      if (
        product.value.prodId == id ||
        product.value.name.toUpperCase() == id.toUpperCase()
      ) {
        unit = product.value.unit;
      }
    });

    return unit;
  }

  getMatch(stock, id) {
    let match = stock.filter(product => {
      return product.value.prodId == id && Number(product.value.qty) > 0;
    });

    if (match.length > 0) {
      return match;
    }
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

  deleteSale(cart, id) {
    let match = cart.filter(product => {
      return product.productId != id;
    });

    if (match.length > 0) {
      return match;
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
          price: price,
          unit: product.value.unit
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

  calculateTotal(cart) {
    let price = 0;
    let qty = 0;
    cart.forEach(product => {
      price += Number(product.price);
      qty += Number(product.qty);
    });
    return [price, qty];
  }

  updateStock(product) {
    return this.couch.update("stock", {
      _id: product.id,
      _rev: product.value.rev,
      batchId: product.value.batchId,
      productId: product.value.prodId,
      brand: product.value.brand,
      name: product.value.name,
      qty: product.value.qty,
      form: product.value.form,
      unit: product.value.unit,
      price: product.value.price,
      totalCost: product.value.totalCost,
      expDate: product.value.expDate,
      error: product.value.error,
      day: product.value.day,
      month: product.value.month,
      year: product.value.year,
      recorder: product.value.recName,
      recorderEmail: product.value.recEmail
    });
  }

  insertSales(product, id, invoiceId, transType, disccount) {
    let date = new Date();
    return this.couch.insert("sales", {
      id: id,
      qty: product.qty,
      name: product.name,
      price: product.price,
      productId: product.productId,
      brand: product.brand,
      invoiceId: invoiceId,
      transactionType: transType,
      disccount: disccount,
      day: date.getDate(),
      month: date.getMonth(),
      year: date.getFullYear()
    });
  }

  insertInvoice(
    id,
    invoiceId,
    customerAddress,
    customerName,
    customerNumber,
    deposit,
    transType,
    disccount,
    netPrice,
    totalPrice,
    amtPaid,
    balance
  ) {
    return this.couch.insert("invoice", {
      id: id,
      invoiceId: invoiceId,
      customerAddress: customerAddress,
      customerName: customerName,
      customerNumber: customerName,
      deposit: deposit,
      transType: transType,
      disccount: disccount,
      netPrice: netPrice,
      totalPrice: totalPrice,
      amtPaid: amtPaid,
      balance: balance
    });
  }
}

module.exports = salesModel;
