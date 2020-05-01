/* eslint-disable no-unused-vars */
//import db file
const Database = require("../src/js/db");

class Invoice extends Database {
  constructor() {
    super();
  }

  getAllInvoices() {
    let viewUrl = this.viewUrl.invoices;
    return this.couch.get("invoice", viewUrl);
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
}

module.exports = Invoice;
