/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
//import db file

const {
  verifyPhoneNumber,
  // eslint-disable-next-line no-unused-vars
  COUNTRY_CODE
} = require("nigerian-phone-number-validator");

class salesModel  {
  


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
        product.productId == id.value.trim() ||
        product.name.toUpperCase() == id.value.trim().toUpperCase()
      );
    });

    if (match.length > 0) {
      return true;
    }
  }

  getMatchingProduct(stock, id) {
    let match = stock.filter(product => {
      return (
        product.productId.includes(id) ||
          product.name.toUpperCase().includes(id.toUpperCase()) //&&Number(product.qty) > 0
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
        product.productId == id ||
        product.name.toUpperCase() == id.toUpperCase()
      ) {
        unit = product.unit;
      }
    });

    return unit;
  }

  getMatch(stock, id) {
    let match = stock.filter(product => {
      return product.productId == id && Number(product.qty) > 0;
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
        product.productId == id ||
        product.name.toUpperCase() == id.toUpperCase()
      ) {
        matchQty += Number(product.qty);
      }
    });
    return matchQty;
  }

  getProduct(stock, id, qty, unit) {
    let obj;
    let price;
    stock.forEach(product => {
      if (
        product.productId == id ||
        product.name.toUpperCase() == id.toUpperCase()
      ) {
        price = (product.price * qty) / unit;
        obj = {
          id: product._id,
          name: product.name,
          productId: product.productId,
          brand: product.brand,
          qty: qty,
          initialPrice: product.price,
          price: price,
          unit: product.unit
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

  async updateStock(product) {
    
    return stockDb.put({
      _id: product._id,
      _rev: product._rev,
      batchId: product.batchId,
      productId: product.productId,
      brand: product.brand,
      name: product.name,
      qty: product.qty,
      form: product.form,
      unit: product.unit,
      price: product.price,
      totalCost: product.totalCost,
      pricePerMinUnit: product.ppmu,
      remote: false,
      expDate: product.expDate,
      error: product.error,
      day: product.day,
      month: product.month,
      year: product.year,
      recorder: product.recName,
      recorderEmail: product.recEmail
    });
  }

  insertSales(product, invoiceId, transType, disccount) {
    let date = new Date();
    return salesDb.put({
      _id: `${+ new Date()}${product.productId}`,
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
    return invoicesDb.put({
      _id: `${+ new Date()}`,
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

 async getSales() {
    let {rows} = await salesDb.allDocs()
    let sales = await generateWorkingList(salesDb,rows)
    return sales
  }

  getMatchSales(sales, day, month, year) {
    let match = sales.filter(sale => {
      return (
        sale.day == Number(day) &&
        sale.month == Number(month) &&
        sale.year == Number(year)
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
        sale.day == Number(day) &&
        sale.month == Number(month) &&
        sale.year == Number(year) &&
        sale.transactionType == saleType
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
      return sale.transactionType == "cash";
    });
    if (match.length > 0) {
      return match;
    } else {
      return false;
    }
  }

  getOnlineSales(sales) {
    let match = sales.filter(sale => {
      return sale.transactionType == "online";
    });
    if (match.length > 0) {
      return match;
    } else {
      return false;
    }
  }

  getCreditSales(sales) {
    let match = sales.filter(sale => {
      return sale.transactionType == "credit";
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
      total += Number(sale.price);
    });
    return total;
  }

  getOtherTotalSales(match, saleType) {
    let total = 0;
    //loop through all sales
    match.forEach(sale => {
      if (sale.transactionType == saleType) {
        total += Number(sale.price);
      }
    });
    return total;
  }

  getAvgDisccount(match) {
    let totalDisccount = 0;
    //loop through match
    match.forEach(sale => {
      totalDisccount += Number(sale.disccount);
    });
    let averageDisccount = totalDisccount / match.length;
    return averageDisccount;
  }

  getOtherAvgDisccount(match, saleType) {
    let totalDisccount = 0;
    //loop through match
    match.forEach(sale => {
      if (sale.transactionType == saleType) {
        totalDisccount += Number(sale.disccount);
      }
    });
    let averageDisccount = totalDisccount / match.length;
    return Math.ceil(averageDisccount);
  }

  getMatchingSales(searchValue, sales, salesType, day, month, year) {
    let match = sales.filter(sale => {
      if (salesType == "all") {
        return (
          sale.day == day &&
          sale.month == month &&
          sale.year == year &&
          (sale.name.toUpperCase().includes(searchValue.toUpperCase()) ||
            sale.productId.includes(searchValue))
        );
      } else {
        return (
          sale.day == day &&
          sale.month == month &&
          sale.year == year &&
          sale.transactionType == salesType &&
          (sale.name.toUpperCase().includes(searchValue.toUpperCase()) ||
            sale.productId.includes(searchValue))
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
