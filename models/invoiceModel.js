/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
//import db file

class Invoice {
  async getAllInvoices() {
    let { rows } = await invoicesDb.allDocs();
    let invoices = await generateWorkingList(invoicesDb, rows);
    return invoices;
  }

  async getAllClearance() {
    let { rows } = await debt_clearanceDb.allDocs();
    let clearances = await generateWorkingList(debt_clearanceDb, rows);
    return clearances;
  }

  getOtherMatchInvoices(invoices, day, month, year, invoiceType) {
    let match = invoices.filter(invoice => {
      if (invoiceType == "cleared") {
        return (
          invoice.transType == "credit" &&
          Number(invoice.balance) < 1 &&
          invoice.day == Number(day) &&
          invoice.month == Number(month) &&
          invoice.year == Number(year)
        );
      } else if (invoiceType == "debt") {
        return (
          invoice.transType == "credit" &&
          Number(invoice.balance) > 0 &&
          invoice.day == Number(day) &&
          invoice.month == Number(month) &&
          invoice.year == Number(year)
        );
      }
    });

    if (match.length > 0) {
      return match;
    } else {
      return false;
    }
  }

  getMyDebtMatchInvoices(invoices, invoiceType) {
    let match = invoices.filter(invoice => {
      /*if (invoiceType == "cleared") {
        return (
          invoice.transType == "credit" &&
          Number(invoice.balance) < 1 &&
          invoice.day == Number(day) &&
          invoice.month == Number(month) &&
          invoice.year == Number(year)
        );
      } else */ if (
        invoiceType == "debt"
      ) {
        return invoice.transType == "credit" && Number(invoice.balance) > 0;
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
        invoice.day == Number(day) &&
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

  getSalesForInvoice(sales, invoiceId) {
    let match = sales.filter(sale => {
      return sale.invoiceId == invoiceId;
    });

    if (match.length > 0) {
      return match;
    }
  }

  getSelectedInvoice(invoices, invoiceId) {
    let match = invoices.filter(invoice => {
      return invoice.invoiceId == invoiceId;
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
          (invoice.invoiceId.includes(searchValue) ||
            invoice.customerName
              .toUpperCase()
              .includes(searchValue.toUpperCase())) &&
          invoice.transType == "credit" &&
          invoice.balance > 0
        );
      } else if (invoiceType == "cleared") {
        //return balance = 0
        return (
          (invoice.invoiceId.includes(searchValue) ||
            invoice.customerName
              .toUpperCase()
              .includes(searchValue.toUpperCase())) &&
          invoice.transType == "credit" &&
          invoice.balance == 0
        );
      } else {
        //return all credit
        return (
          invoice.invoiceId.includes(searchValue) ||
          invoice.customerName.toUpperCase().includes(searchValue.toUpperCase())
          //&& invoice.transType == "credit"
        );
      }
    });

    if (match.length > 0) {
      return match;
    } else {
      return false;
    }
  }

  async updateInvoice(detail, newBalance, newAmtPaid) {
    //console.log(detail._id, detail._rev);
    return invoicesDb.put({
      _id: detail._id,
      _rev: detail._rev,
      invoiceId: detail.invoiceId,
      customerAddress: detail.customerAddress,
      customerName: detail.customerName,
      customerNumber: detail.customerNumber,
      transType: "credit",
      attender: detail.attender,
      disccount: detail.disccount,
      netPrice: detail.netPrice,
      totalPrice: detail.totalPrice,
      amtPaid: newAmtPaid,
      balance: newBalance,
      cp: detail.cp,
      sp: detail.sp,
      remote: false,
      day: detail.day,
      month: detail.month,
      year: detail.year
    });
  }

  async insertClearanceDetails(amtEntered, invoiceId) {
    let date = new Date();
    let loginDetail = store.getLoginDetail();
    return debt_clearanceDb.put({
      _id: `${+new Date()}`,
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
    return invoicesDb.put({
      _id: id,
      _rev: detail._rev,
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
      await this.remoteInvoicesUpdateMatch(allMatch[i], allMatch[i]._id);
    }
  }

  //update current match
  remoteClearanceUpdateMatch(detail, id) {
    return debt_clearanceDb.put({
      _id: id,
      _rev: detail._rev,
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
      await this.remoteClearanceUpdateMatch(allMatch[i], allMatch[i]._id);
    }
  }
}

module.exports = Invoice;
