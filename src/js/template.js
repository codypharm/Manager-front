/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */

const moment = require("moment");

///currency formater
const formatMoneyTemp = money => {
  //ensure two decimal places
  let amount = Number(money).toFixed(2);
  //add commas where needed
  amount = amount.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  //return amount
  return amount;
};

//view list display
const displayStaff = data => {
  //get current staff details from store
  let {
    loginStatus,
    fname,
    lname,
    email,
    staffId,
    position,
    permission,
    image,
    access,
    docId
  } = store.getLoginDetail();
  
  //filter current user out
  let otherUsers = staffModel.filterOutUser(data, email);
  let newObj = {
    data: otherUsers
  };

  Handlebars.registerHelper("accountStatus", access => {
    if (access == "open") {
      return "block";
    } else {
      return "activate";
    }
  });

  //hide if not admin and not mine
  Handlebars.registerHelper("rankAccess", email => {
    let loginDetails = store.getLoginDetail();

    if (
      loginDetails.permission.toUpperCase() !== "SUPER_ADMIN" &&
      loginDetails.email.toUpperCase() !== email.toUpperCase()
    ) {
      return "hide";
    }
  });
  //hide if not admin and not mine
  Handlebars.registerHelper("elongate", email => {
    let loginDetails = store.getLoginDetail();

    if (
      loginDetails.permission.toUpperCase() !== "SUPER_ADMIN" &&
      loginDetails.email.toUpperCase() !== email.toUpperCase()
    ) {
      return "elongate";
    } else {
      return "actions";
    }
  });

  let template = document.getElementById("listTemplateContainer").innerHTML;
  let compiledData = Handlebars.compile(template);

  let myhtml = compiledData(newObj);

  let container = (document.getElementById("otherUsers").innerHTML = myhtml);
};

//update record list
const updateRecordList = recordedProduct => {
  let newObj = {
    data: recordedProduct
  };

  let template = document.getElementById("recordTemplateContainer").innerHTML;
  let compiledData = Handlebars.compile(template);

  let myhtml = compiledData(newObj);

  let container = (document.getElementById("tableBody").innerHTML = myhtml);
};

const updateCart = products => {
  let newObj = {
    data: products
  };

  let template = document.getElementById("cartContainer").innerHTML;
  let compiledData = Handlebars.compile(template);

  let myhtml = compiledData(newObj);

  let container = (document.getElementById("cartBox").innerHTML = myhtml);
};

const displayPurchase = purchase => {
  let newObj = {
    data: purchase
  };

  let template = document.getElementById("purchaseContainer").innerHTML;
  let compiledData = Handlebars.compile(template);

  let myhtml = compiledData(newObj);

  let container = (document.getElementById("purchase").innerHTML = myhtml);
};

const displaySalesInvoice = sales => {
  let newObj = {
    data: sales
  };

  let template = document.getElementById("invoiceSalesContainer").innerHTML;
  let compiledData = Handlebars.compile(template);

  let myhtml = compiledData(newObj);

  let container = (document.getElementById("purchase").innerHTML = myhtml);
};

const displayClearedSalesInvoice = sales => {
  let newObj = {
    data: sales
  };

  let template = document.getElementById("invoiceClearedSalesContainer")
    .innerHTML;
  let compiledData = Handlebars.compile(template);

  let myhtml = compiledData(newObj);

  let container = (document.getElementById("purchase").innerHTML = myhtml);
};

const displayDebtSalesInvoice = sales => {
  let newObj = {
    data: sales
  };

  let template = document.getElementById("invoiceDebtSalesContainer").innerHTML;
  let compiledData = Handlebars.compile(template);

  let myhtml = compiledData(newObj);

  let container = (document.getElementById("purchase").innerHTML = myhtml);
};

const displayMatchSales = sales => {
  let newObj = {
    data: sales
  };

  Handlebars.registerHelper("price", price => {
    return formatMoneyTemp(price);
  });

  let template = document.getElementById("salesContainer").innerHTML;
  let compiledData = Handlebars.compile(template);

  let myhtml = compiledData(newObj);

  let container = (document.getElementById("salesList").innerHTML = myhtml);
};

const displayMatchCashSales = sales => {
  let newObj = {
    data: sales
  };

  Handlebars.registerHelper("price", price => {
    return formatMoneyTemp(price);
  });

  let template = document.getElementById("cashSalesContainer").innerHTML;
  let compiledData = Handlebars.compile(template);

  let myhtml = compiledData(newObj);

  let container = (document.getElementById("salesList").innerHTML = myhtml);
};

const displayMatchOnlineSales = sales => {
  let newObj = {
    data: sales
  };

  Handlebars.registerHelper("price", price => {
    return formatMoneyTemp(price);
  });

  let template = document.getElementById("onlineSalesContainer").innerHTML;
  let compiledData = Handlebars.compile(template);

  let myhtml = compiledData(newObj);

  let container = (document.getElementById("salesList").innerHTML = myhtml);
};

const displayMatchCreditSales = sales => {
  let newObj = {
    data: sales
  };

  Handlebars.registerHelper("price", price => {
    return formatMoneyTemp(price);
  });

  let template = document.getElementById("creditSalesContainer").innerHTML;
  let compiledData = Handlebars.compile(template);

  let myhtml = compiledData(newObj);

  let container = (document.getElementById("salesList").innerHTML = myhtml);
};

const displayMatchInvoices = invoices => {
  let newObj = {
    data: invoices
  };

  Handlebars.registerHelper("invoiceStatus", balance => {
    if (Number(balance) > 0) {
      return "pending";
    } else {
      return "cleared";
    }
  });

  Handlebars.registerHelper("netPrice", price => {
    return formatMoneyTemp(price);
  });

  Handlebars.registerHelper("invoiceBalance", balance => {
    return formatMoneyTemp(balance);
  });

  Handlebars.registerHelper("paid", amt => {
    return formatMoneyTemp(amt);
  });

  let template = document.getElementById("invoiceContainer").innerHTML;
  let compiledData = Handlebars.compile(template);

  let myhtml = compiledData(newObj);

  let container = (document.getElementById("invoicesList").innerHTML = myhtml);
};

const displayClearedMatchInvoices = invoices => {
  let newObj = {
    data: invoices
  };

  Handlebars.registerHelper("netPrice", price => {
    return formatMoneyTemp(price);
  });

  let template = document.getElementById("clearedInvoiceContainer").innerHTML;
  let compiledData = Handlebars.compile(template);

  let myhtml = compiledData(newObj);

  let container = (document.getElementById("invoicesList").innerHTML = myhtml);
};

const displayDebtMatchInvoices = invoices => {
  let newObj = {
    data: invoices
  };

  Handlebars.registerHelper("netPrice", price => {
    return formatMoneyTemp(price);
  });

  Handlebars.registerHelper("invoiceBalance", balance => {
    return formatMoneyTemp(balance);
  });

  Handlebars.registerHelper("paid", amt => {
    return formatMoneyTemp(amt);
  });
  let template = document.getElementById("debtInvoiceContainer").innerHTML;
  let compiledData = Handlebars.compile(template);

  let myhtml = compiledData(newObj);

  let container = (document.getElementById("invoicesList").innerHTML = myhtml);
};

//display matching expenses
const displayExpenses = expenses => {
  //assing array to ab object property
  let newObj = {
    data: expenses
  };

  Handlebars.registerHelper("amt", amt => {
    return formatMoneyTemp(amt);
  });

  //get template
  let template = document.getElementById("expensesContainer").innerHTML;
  //compile template with handlebar
  let compiledData = Handlebars.compile(template);

  //make data html
  let myhtml = compiledData(newObj);

  //paste html into DOM
  let container = (document.getElementById("expensesList").innerHTML = myhtml);
};

//display all stock
const displayAllStock = products => {
  //assing array to ab object property
  let newObj = {
    data: products
  };

  //get template
  let template = document.getElementById("allStockContainer").innerHTML;
  //compile template with handlebar
  let compiledData = Handlebars.compile(template);

  //make data html
  let myhtml = compiledData(newObj);

  //paste html into DOM
  let container = (document.getElementById("allStockList").innerHTML = myhtml);
};

//display all stock
const displayExhaustedStock = products => {
  //assing array to ab object property
  let newObj = {
    data: products
  };

  //hide if not admin
  Handlebars.registerHelper("rankAccess", () => {
    let loginDetails = store.getLoginDetail();

    if (loginDetails.permission.toUpperCase() !== "SUPER_ADMIN") {
      return "hide";
    }
  });

  //get template
  let template = document.getElementById("exhaustedStockContainer").innerHTML;
  //compile template with handlebar
  let compiledData = Handlebars.compile(template);

  //make data html
  let myhtml = compiledData(newObj);

  //paste html into DOM
  let container = (document.getElementById(
    "exhaustedStockList"
  ).innerHTML = myhtml);
};

//display expired list
const displayExpiredStock = products => {
  //assing array to ab object property
  let newObj = {
    data: products
  };

  //calculate days remining
  Handlebars.registerHelper("daysRemaining", expDate => {
    if (expDate != "") {
      let expiration = moment(expDate).format("YYYY-MM-DD");
      let currentDate = moment().format("YYYY-MM-DD");
      let days = moment(expiration).diff(currentDate, "days");
      if (days == 1) {
        return `${days} day remaining`;
      } else if (days > 1) {
        return `${days} days remaining`;
      } else {
        return "expired";
      }
    } else {
      return "N/A";
    }
  });

  //hide if not admin
  Handlebars.registerHelper("rankAccess", () => {
    let loginDetails = store.getLoginDetail();

    if (loginDetails.permission.toUpperCase() !== "SUPER_ADMIN") {
      return "hide";
    }
  });

  //get template
  let template = document.getElementById("expiredStockContainer").innerHTML;
  //compile template with handlebar
  let compiledData = Handlebars.compile(template);

  //make data html
  let myhtml = compiledData(newObj);

  //paste html into DOM
  let container = (document.getElementById(
    "expiredStockList"
  ).innerHTML = myhtml);
};

//list out all the batches
const listOutBatches = products => {
  //assing array to ab object property
  let newObj = {
    data: products
  };

  //calculate days remining
  Handlebars.registerHelper("daysRemaining", expDate => {
    //check if exp date is specified
    if (expDate != "") {
      let expiration = moment(expDate).format("YYYY-MM-DD");
      let currentDate = moment().format("YYYY-MM-DD");
      let days = moment(expiration).diff(currentDate, "days");
      if (days == 1) {
        return `${days} day remaining`;
      } else if (days > 1) {
        return `${days} days remaining`;
      } else {
        return "expired";
      }
    } else {
      return "N/A";
    }
  });

  //hide if not admin
  Handlebars.registerHelper("rankAccess", () => {
    let loginDetails = store.getLoginDetail();

    if (loginDetails.permission.toUpperCase() !== "SUPER_ADMIN") {
      return "hide";
    }
  });

  //reverse date
  Handlebars.registerHelper("reverseDate", expDate => {
    if (expDate != "") {
      let val = String(expDate);
      let newDate = val.split("-");
      return `${newDate[2]}-${newDate[1]}-${newDate[0]}`;
    } else {
      return "N/A";
    }
  });

  //get template
  let template = document.getElementById("batchListContainer").innerHTML;
  //compile template with handlebar
  let compiledData = Handlebars.compile(template);

  //make data html
  let myhtml = compiledData(newObj);

  //paste html into DOM
  let container = (document.getElementById("batchList").innerHTML = myhtml);
};

//display all stock changes
const displayStockChanges = list => {
  //assing array to ab object property
  let newObj = {
    data: list
  };

  //get template
  let template = document.getElementById("stockCheckContainer").innerHTML;
  //compile template with handlebar
  let compiledData = Handlebars.compile(template);

  //make data html
  let myhtml = compiledData(newObj);

  //paste html into DOM
  let container = (document.getElementById(
    "stockChangesList"
  ).innerHTML = myhtml);
};

//display all product sales report
const displayProductReportList = list => {
  //assing array to ab object property
  let newObj = {
    data: list
  };

  //get template
  let template = document.getElementById("productReportList").innerHTML;
  //compile template with handlebar
  let compiledData = Handlebars.compile(template);

  //make data html
  let myhtml = compiledData(newObj);

  //paste html into DOM
  let container = (document.getElementById("productList").innerHTML = myhtml);
};

//display all product sales report
const displayAccountReportList = list => {
  //assing array to ab object property
  let newObj = {
    data: list
  };

  //get template
  let template = document.getElementById("accountReportList").innerHTML;
  //compile template with handlebar
  let compiledData = Handlebars.compile(template);

  //make data html
  let myhtml = compiledData(newObj);

  //paste html into DOM
  let container = (document.getElementById("accountList").innerHTML = myhtml);
};

//display attendance list
const displayAttendanceList = (list, id) => {
  //assing array to ab object property
  let newObj = {
    data: list
  };

  Handlebars.registerHelper("exitButton", (exitTime, staffId) => {
    if (exitTime != "" || staffId.toUpperCase() == id.toUpperCase()) {
      //hide button
      return "hide";
    }
  });

  Handlebars.registerHelper("noDisplay", (exitTime, staffId) => {
    if (exitTime != "" || staffId.toUpperCase() != id.toUpperCase()) {
      //hide button
      return "hide";
    }
  });

  Handlebars.registerHelper("exitDisplay", exitTime => {
    if (exitTime == "") {
      //hide span
      return "hide";
    }
  });

  //get template
  let template = document.getElementById("attendanceList").innerHTML;
  //compile template with handlebar
  let compiledData = Handlebars.compile(template);

  //make data html
  let myhtml = compiledData(newObj);

  //paste html into DOM
  let container = (document.getElementById(
    "attendanceDispList"
  ).innerHTML = myhtml);
};

//display all low stock
const displayLowStock = list => {
  //assing array to ab object property
  let newObj = {
    data: list
  };

  //get template
  let template = document.getElementById("lowStockBox").innerHTML;
  //compile template with handlebar
  let compiledData = Handlebars.compile(template);

  //make data html
  let myhtml = compiledData(newObj);

  //paste html into DOM
  let container = (document.getElementById("lowStockList").innerHTML = myhtml);
};

//display all debt list on dashboard
const displayDashDebts = list => {
  //assing array to ab object property
  let newObj = {
    data: list
  };

  Handlebars.registerHelper("formatMoney", money => {
    return formatMoneyTemp(money);
  });

  //get template
  let template = document.getElementById("dashDebtBox").innerHTML;
  //compile template with handlebar
  let compiledData = Handlebars.compile(template);

  //make data html
  let myhtml = compiledData(newObj);

  //paste html into DOM
  let container = (document.getElementById("dashDebtList").innerHTML = myhtml);
};

//display all suggested items
const displaySuggestions = list => {
  //assing array to ab object property
  let newObj = {
    data: list
  };

  //get template
  let template = document.getElementById("suggestionContainer").innerHTML;
  //compile template with handlebar
  let compiledData = Handlebars.compile(template);

  //make data html
  let myhtml = compiledData(newObj);

  //paste html into DOM
  let container = (document.getElementById(
    "suggestionItems"
  ).innerHTML = myhtml);
};
