/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
//import db file
const Database = require("../src/js/db");

class Invoice extends Database {
  constructor() {
    super();
  }

  generateId() {
    return this.couch.uniqid();
  }

  getAllInvoices() {
    let viewUrl = this.viewUrl.invoices;
    return this.couch.get("invoice", viewUrl);
  }

  getAllClearance() {
    let viewUrl = this.viewUrl.allClearance;
    return this.couch.get("debt_clearance", viewUrl);
  }

  getOtherMatchInvoices(invoices, day, month, year, invoiceType) {
    let match = invoices.filter(invoice => {
      if (invoiceType == "cleared") {
        return (
          invoice.value.transType == "credit" &&
          Number(invoice.value.balance) < 1 &&
          invoice.value.day == Number(day) &&
          invoice.value.month == Number(month) &&
          invoice.value.year == Number(year)
        );
      } else if (invoiceType == "debt") {
        return (
          invoice.value.transType == "credit" &&
          Number(invoice.value.balance) > 0 &&
          invoice.value.day == Number(day) &&
          invoice.value.month == Number(month) &&
          invoice.value.year == Number(year)
        );
      }
    });

    if (match.length > 0) {
      return match;
    } else {
      return false;
    }
  }

  getMatchInvoices(invoices, day, month, year) {
    let match = invoices.filter(invoice => {
      return (
        invoice.value.day == Number(day) &&
        invoice.value.month == Number(month) &&
        invoice.value.year == Number(year)
      );
    });

    if (match.length > 0) {
      return match;
    } else {
      return false;
    }
  }

  getSalesForInvoice(sales, invoiceId) {
    let match = sales.filter(sale => {
      return sale.value.invoiceId == invoiceId;
    });

    if (match.length > 0) {
      return match;
    }
  }

  getSelectedInvoice(invoices, invoiceId) {
    let match = invoices.filter(invoice => {
      return invoice.value.invoiceId == invoiceId;
    });

    if (match.length > 0) {
      return match;
    }
  }

  getMatchingInvoice(searchValue, invoices, invoiceType) {
    let match = invoices.filter(invoice => {
      if (invoiceType == "debt") {
        //return balance > 0
        return (
          (invoice.value.invoiceId.includes(searchValue) ||
            invoice.value.customerName
              .toUpperCase()
              .includes(searchValue.toUpperCase())) &&
          invoice.value.transType == "credit" &&
          invoice.value.balance > 0
        );
      } else if (invoiceType == "cleared") {
        //return balance = 0
        return (
          (invoice.value.invoiceId.includes(searchValue) ||
            invoice.value.customerName
              .toUpperCase()
              .includes(searchValue.toUpperCase())) &&
          invoice.value.transType == "credit" &&
          invoice.value.balance == 0
        );
      } else {
        //return all credit
        return (
          (invoice.value.invoiceId.includes(searchValue) ||
            invoice.value.customerName
              .toUpperCase()
              .includes(searchValue.toUpperCase())) &&
          invoice.value.transType == "credit"
        );
      }
    });

    if (match.length > 0) {
      return match;
    } else {
      return false;
    }
  }

  updateInvoice(detail, newBalance, newAmtPaid) {
    return this.couch.update("invoice", {
      _id: detail.id,
      _rev: detail.value.rev,
      invoiceId: detail.value.invoiceId,
      customerAddress: detail.value.customerAddress,
      customerName: detail.value.customerName,
      customerNumber: detail.value.customerNumber,
      transType: "credit",
      attender: detail.value.attender,
      disccount: detail.value.disccount,
      netPrice: detail.value.netPrice,
      totalPrice: detail.value.totalPrice,
      amtPaid: newAmtPaid,
      balance: newBalance,
      cp: detail.value.cp,
      sp: detail.value.sp,
      remote: false,
      day: detail.value.day,
      month: detail.value.month,
      year: detail.value.year
    });
  }

  insertClearanceDetails(id, amtEntered, invoiceId) {
    let date = new Date();
    let loginDetail = store.getLoginDetail();
    return this.couch.insert("debt_clearance", {
      id: id,
      paymentFor: invoiceId,
      currentAmtPaid: amtEntered,
      remote: false,
      attender: loginDetail.fname + " " + loginDetail.lname,
      day: date.getDate(),
      month: date.getMonth() + 1,
      year: date.getFullYear()
    });
  }

  //update current match
  remoteInvoicesUpdateMatch(detail, id) {
    return this.couch.update("invoice", {
      _id: id,
      _rev: detail.rev,
      invoiceId: detail.invoiceId,
      customerAddress: detail.customerAddress,
      customerName: detail.customerName,
      customerNumber: detail.customerNumber,
      transType: detail.transType,
      disccount: detail.disccount,
      attender: detail.attender,
      netPrice: detail.netPrice,
      totalPrice: detail.totalPrice,
      amtPaid: detail.amtPaid,
      cp: detail.cp,
      sp: detail.sp,
      remote: true,
      balance: detail.balance,
      day: detail.day,
      month: detail.month,
      year: detail.year
    });
  }

  async remoteUpdateInvoices(allMatch) {
    const matchLength = allMatch.length;
    const checker = matchLength - 1;

    //loop through matches
    for (let i = 0; i < matchLength; i++) {
      //wait for update to happen
      await this.remoteInvoicesUpdateMatch(allMatch[i].value, allMatch[i].id);
    }
  }

  //update current match
  remoteClearanceUpdateMatch(detail, id) {
    return this.couch.update("debt_clearance", {
      _id: id,
      _rev: detail.rev,
      paymentFor: detail.paymentFor,
      currentAmtPaid: detail.currentAmtPaid,
      attender: detail.attender,
      remote: true,
      day: detail.day,
      month: detail.month,
      year: detail.year
    });
  }

  async remoteUpdateClearance(allMatch) {
    const matchLength = allMatch.length;
    const checker = matchLength - 1;

    //loop through matches
    for (let i = 0; i < matchLength; i++) {
      //wait for update to happen
      await this.remoteClearanceUpdateMatch(allMatch[i].value, allMatch[i].id);
    }
  }
}

module.exports = Invoice;
