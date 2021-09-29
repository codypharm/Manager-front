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

  getMatchingProduct(stock, id) {
    let match = stock.filter(product => {
      return (
        (product.value.prodId.includes(id) ||
          product.value.name.toUpperCase().includes(id.toUpperCase())) &&
        Number(product.value.qty) > 0
      );
    });

    if (match.length > 0) {
      return match;
    } else {
      return false;
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
    } else {
      //return empty array
      return [];
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
        price = Number(Number(Number(product.initialPrice) * qty) / unit);

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
      pricePerMinUnit: product.value.ppmu,
      remote: false,
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
      cp: product.cp,
      sp: product.sp,
      remote: false,
      day: date.getDate(),
      month: date.getMonth() + 1,
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
    balance,
    cp,
    sp
  ) {
    let date = new Date();
    let loginDetail = store.getLoginDetail();
    return this.couch.insert("invoice", {
      id: id,
      invoiceId: invoiceId,
      customerAddress: customerAddress,
      customerName: customerName,
      customerNumber: customerNumber,
      transType: transType,
      disccount: disccount,
      netPrice: netPrice,
      totalPrice: totalPrice,
      amtPaid: amtPaid,
      remote: false,
      balance: balance,
      cp,
      sp,
      attender: loginDetail.fname + " " + loginDetail.lname,
      day: date.getDate(),
      month: date.getMonth() + 1,
      year: date.getFullYear()
    });
  }

  //handling sales form

  getSales() {
    let viewUrl = this.viewUrl.sales;
    return this.couch.get("sales", viewUrl);
  }

  getMatchSales(sales, day, month, year) {
    let match = sales.filter(sale => {
      return (
        sale.value.day == Number(day) &&
        sale.value.month == Number(month) &&
        sale.value.year == Number(year)
      );
    });

    if (match.length > 0) {
      return match;
    } else {
      return false;
    }
  }

  getOtherMatchSales(sales, day, month, year, saleType) {
    let match = sales.filter(sale => {
      return (
        sale.value.day == Number(day) &&
        sale.value.month == Number(month) &&
        sale.value.year == Number(year) &&
        sale.value.transType == saleType
      );
    });

    if (match.length > 0) {
      return match;
    } else {
      return false;
    }
  }

  getCashSales(sales) {
    let match = sales.filter(sale => {
      return sale.value.transType == "cash";
    });
    if (match.length > 0) {
      return match;
    } else {
      return false;
    }
  }

  getOnlineSales(sales) {
    let match = sales.filter(sale => {
      return sale.value.transType == "online";
    });
    if (match.length > 0) {
      return match;
    } else {
      return false;
    }
  }

  getCreditSales(sales) {
    let match = sales.filter(sale => {
      return sale.value.transType == "credit";
    });
    if (match.length > 0) {
      return match;
    } else {
      return false;
    }
  }
  getTotalSales(match) {
    let total = 0;
    //loop through all sales
    match.forEach(sale => {
      total += Number(sale.value.price);
    });
    return total;
  }

  getOtherTotalSales(match, saleType) {
    let total = 0;
    //loop through all sales
    match.forEach(sale => {
      if (sale.value.transType == saleType) {
        total += Number(sale.value.price);
      }
    });
    return total;
  }

  getAvgDisccount(match) {
    let totalDisccount = 0;
    //loop through match
    match.forEach(sale => {
      totalDisccount += Number(sale.value.disccount);
    });
    let averageDisccount = totalDisccount / match.length;
    return averageDisccount;
  }

  getOtherAvgDisccount(match, saleType) {
    let totalDisccount = 0;
    //loop through match
    match.forEach(sale => {
      if (sale.value.transType == saleType) {
        totalDisccount += Number(sale.value.disccount);
      }
    });
    let averageDisccount = totalDisccount / match.length;
    return Math.ceil(averageDisccount);
  }

  getMatchingSales(searchValue, sales, salesType, day, month, year) {
    let match = sales.filter(sale => {
      if (salesType == "all") {
        return (
          sale.value.day == day &&
          sale.value.month == month &&
          sale.value.year == year &&
          (sale.value.name.toUpperCase().includes(searchValue.toUpperCase()) ||
            sale.value.productId.includes(searchValue))
        );
      } else {
        return (
          sale.value.day == day &&
          sale.value.month == month &&
          sale.value.year == year &&
          sale.value.transType == salesType &&
          (sale.value.name.toUpperCase().includes(searchValue.toUpperCase()) ||
            sale.value.productId.includes(searchValue))
        );
      }
    });
    if (match.length > 0) {
      return match;
    } else {
      return false;
    }
  }

  //update current match
  remoteSalesUpdateMatch(detail, id) {
    return this.couch.update("sales", {
      _id: id,
      _rev: detail.rev,
      qty: detail.qty,
      name: detail.name,
      price: detail.price,
      productId: detail.productId,
      brand: detail.brand,
      invoiceId: detail.invoiceId,
      transactionType: detail.transType,
      disccount: detail.disccount,
      cp: detail.cp,
      sp: detail.sp,
      remote: true,
      day: detail.day,
      month: detail.month,
      year: detail.year
    });
  }

  async remoteUpdateSales(allMatch) {
    const matchLength = allMatch.length;
    const checker = matchLength - 1;

    //loop through matches
    for (let i = 0; i < matchLength; i++) {
      //wait for update to happen
      await this.remoteSalesUpdateMatch(allMatch[i].value, allMatch[i].id);
    }
  }
}

module.exports = salesModel;
