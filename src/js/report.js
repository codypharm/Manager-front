/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */
// global variables
var sales;
var stock;
var reportArray = [];
var searchArray = [];
//get sales with this product id
const getProductSales = (prodId, matchedSales) => {
  let match = matchedSales.filter(sale => {
    return sale.value.productId == prodId;
  });

  if (match.length > 0) {
    return match;
  } else {
    return false;
  }
};

//caluculate total sale volume
const calculateVolume = thisSales => {
  let total = 0;
  //loop through the sales
  thisSales.forEach(sale => {
    total += Number(sale.value.qty);
  });

  return total;
};

//calculate total sale volume
const getTotalSalesVolume = matchedSales => {
  let totalVolume = 0;
  matchedSales.forEach(sale => {
    totalVolume += Number(sale.value.qty);
  });
  return totalVolume;
};

//calculate percent volume
const calculatePercentVolume = (saleVolume, totalSalesVolume) => {
  return Number(((saleVolume / totalSalesVolume) * 100).toFixed(2));
};

//calculate average ppmu
const getAveragePpmu = prodId => {
  let count = 0;
  let totalPpmu = 0;
  //loop through stock and calculate average ppmu
  stock.forEach(product => {
    if (product.value.prodId == prodId) {
      count++;
      totalPpmu += Number(product.value.ppmu);
    }
  });

  let avgPpmu = totalPpmu / count;
  return avgPpmu;
};

const getTotalProfit = matchedSales => {
  let totalGain = 0;
  matchedSales.forEach(sale => {
    let avgPpmu = getAveragePpmu(sale.value.productId);
    let costPrice = Number(avgPpmu * sale.value.qty);
    let gain = Number(sale.value.price - costPrice);
    totalGain += gain;
  });

  return totalGain;
};

//add up expired stock
const getExpVolume = expStock => {
  let expVolume = 0;
  if (expStock.length > 0) {
    expStock.forEach(stock => {
      expVolume += Number(stock.value.qty);
    });
  }
  return expVolume;
};

//add up expenses
const getTotalExpense = allExp => {
  let exp = 0;
  allExp.forEach(expense => {
    exp += Number(expense.value.amt);
  });
  return exp;
};

//add up income made
const getTotalIncome = invoices => {
  let totalIncome = 0;
  if (invoices.length > 0) {
    invoices.forEach(invoice => {
      totalIncome += Number(invoice.value.netPrice);
    });
  }
  return totalIncome;
};

//sort days
const sortDays = days => {
  let sorted = days.sort(function(a, b) {
    return a - b;
  });
  return sorted;
};

//extract sales days
const getSalesDays = (month, year) => {
  let days = [];
  /*days.push(invoices[0].value.day);

  invoices.forEach(invoice => {
    let day = invoice.value.day;
    //check if such
    let match = days.filter(aDay => {
      return aDay == day;
    });
    if (match.length == 0) {
      days.push(day);
    }
  });

  //sort sales days
  return sortDays(days);*/
  let dayNum = new Date(year, month, 0).getDate();
  for (i = 1; i <= dayNum; i++) {
    days.push(i);
  }

  return days;
};

//vet all invoices
const getDayInvoices = (invoices, saleDay) => {
  let match = invoices.filter(invoice => {
    return invoice.value.day == saleDay;
  });

  return match;
};

//get expenses for a day
const getDayExpenses = (mainExp, day) => {
  let match = mainExp.filter(exp => {
    return exp.value.day == day;
  });

  return match;
};

//add up net price
const addUpFields = invoices => {
  let net = 0;
  let amtPaid = 0;
  let toPay = 0;
  invoices.forEach(invoice => {
    net += Number(invoice.value.netPrice);
    amtPaid += Number(invoice.value.amtPaid);
    toPay += Number(invoice.value.balance);
  });

  return [net, amtPaid, toPay];
};

//add up expenses for a day
const addUpExp = dayExpenses => {
  let totalExp = 0;
  if (dayExpenses.length > 0) {
    dayExpenses.forEach(expense => {
      totalExp += Number(expense.value.amt);
    });
  }

  return totalExp;
};

//get sales fror current day
const getCurrentDaySales = (matchedSales, saleDay) => {
  let match = matchedSales.filter(sale => {
    return sale.value.day == saleDay;
  });

  return match;
};

//get matching stock values
const getProducDetail = id => {
  let unit;
  stock.forEach(prod => {
    if (prod.value.prodId == id) {
      unit = prod.value.unit;
    }
  });

  return [unit];
};
//analyse sales
const getAccountAnalysis = sales => {
  let dailyGain = 0;
  let dailyCp = 0;
  let dailySp = 0;
  //loop through sales for a particular day
  sales.forEach(product => {
    let [unit] = getProducDetail(product.value.productId);
    //get actuall unit sold
    let unitSold = Number(product.value.qty / unit);
    //get selling price
    let sellingPrice = unitSold * product.value.price;
    dailySp += sellingPrice;
    //get average ppmu (pricePerMinUnit)
    let averagePpmu = getAveragePpmu(product.value.productId);
    //get cost price
    let costPrice = averagePpmu * unitSold;
    dailyCp += costPrice;
    //get gain
    let gain = sellingPrice - costPrice;
    dailyGain += gain;
  });

  return [dailyCp, dailySp, dailyGain];
};

//extract sales for last day of previous month
const getSalesForLastDay = (day, month, sales) => {
  let match = sales.filter(sale => {
    return sale.value.day == day && sale.value.month == month;
  });

  return match;
};

//proceed to sort account list
const proceedToSortAccountList = (
  matchedSales,
  mainExp,
  expStock,
  actualInvoices,
  allInvoices,
  month,
  year
) => {
  let totalSalesVolume = getTotalSalesVolume(matchedSales);
  let expiredVolume = getExpVolume(expStock);
  let expenseAmount = getTotalExpense(mainExp);
  let totalIncome = getTotalIncome(actualInvoices);

  //append to DOM
  document.getElementById("span1").textContent =
    "+" + formatMoney(totalSalesVolume);
  document.getElementById("span2").textContent =
    "+" + formatMoney(expiredVolume);
  document.getElementById("span3").textContent =
    "+" + formatMoney(expenseAmount);
  document.getElementById("span4").textContent = "+" + formatMoney(totalIncome);

  //extract all invoice day from invoice list
  let salesDays = getSalesDays(month, year);

  //declare value for daily gain difference calculation
  let todayGain = 0;
  let yesterdayGain = 0;
  let percDiff = 0;
  let color;
  let previousDayCp;
  let previousDaySp = 0;
  let previousDayGain = 0;
  let percOutCome = 0;
  let previousDay;
  let previousMonth;
  let previousYear;

  //loop through array of days
  salesDays.forEach(saleDay => {
    if (saleDay == 1) {
      //get previous month

      let myCurrentDate = `${month}  ${saleDay} ${year}`;
      let makeDate = new Date(myCurrentDate);
      makeDate.setMonth(makeDate.getMonth() - 1);
      let lastMonth = makeDate.getMonth();
      let yearForMonth = makeDate.getFullYear();
      let lastDay = new Date(yearForMonth, lastMonth + 1, 0);

      //get sales for last day
      let salesForLastDay = getSalesForLastDay(
        lastDay.getDate(),
        lastMonth + 1,
        sales
      );

      //get analysis for last day of last month
      let [lastDailyCp, lastDailySp, lastDailyGain] = getAccountAnalysis(
        salesForLastDay
      );

      //assing this as yesterdays gain
      yesterdayGain = lastDailyGain;
      previousDayGain = lastDailyGain;
      previousDaySp = lastDailySp;
      previousDayCp = lastDailyCp;
      previousDay = lastDay.getDate();
      previousMonth = lastMonth + 1;
      previousYear = yearForMonth;
      //console.log(yesterdayGain);
    }
    //get all invoice for this day
    let dayInvoices = getDayInvoices(actualInvoices, saleDay);
    //get expenses for the day
    let dayExpenses = getDayExpenses(mainExp, saleDay);

    //get sales for the day
    let currentDaySales = getCurrentDaySales(matchedSales, saleDay);

    let totalExp = addUpExp(dayExpenses);
    let [net, amtPaid, toPay] = addUpFields(dayInvoices);
    let dispBalance = amtPaid - totalExp;
    let [dailyCp, dailySp, dailyGain] = getAccountAnalysis(currentDaySales);
    todayGain = dailyGain;
    gainDiff = todayGain - yesterdayGain;
    percDiff = Number((gainDiff / yesterdayGain) * 100).toFixed(1);
    if (isFinite(percDiff)) {
      if (percDiff >= 0) {
        percOutCome = "+" + percDiff;
        color = "green";
      } else {
        percOutCome = percDiff;
        color = "red";
      }
    } else {
      if (gainDiff >= 0) {
        percOutCome = "+" + gainDiff;
        color = "green";
      } else {
        percOutCome = "---";
      }
    }

    //console.log(saleDay, dailyGain, gainDiff, percOutCome);

    yesterdayGain = todayGain;
    reportArray.push({
      day: saleDay,
      month: month,
      year: year,
      previousDay: previousDay,
      previousMonth: previousMonth,
      previousYear: previousYear,
      previousDayCp: previousDayCp,
      previousDaySp: previousDaySp,
      previousDayGain: previousDayGain,
      totalNet: net,
      amtPaid: amtPaid,
      toPay: toPay,
      totalExp: totalExp,
      displayBalance: dispBalance,
      percPerf: dailyGain,
      dailyGain: dailyGain,
      dailyCp: dailyCp,
      percOutCome: percOutCome,
      dailySp: dailySp,
      color: color
    });

    //assign todays detail as previous day before looping
    previousDayCp = dailyCp;
    previousDaySp = dailySp;
    previousDayGain = dailyGain;
    previousDay = saleDay;
    previousMonth = month;
    previousYear = year;
  });

  return reportArray;
};

//proceed to sort stock sales
const proceedToSortStockSales = matchedSales => {
  let sortedStock = reportModel.sortStock(stock);

  let totalSalesVolume = getTotalSalesVolume(matchedSales);
  let totalGain = getTotalProfit(matchedSales);

  //loop through sortedStock
  sortedStock.forEach(product => {
    //extract sales with this product id
    let productSales = getProductSales(product.value.prodId, matchedSales);
    if (productSales != false) {
      //calculate sale volume
      let saleVolume = calculateVolume(productSales);
      //get percent volume
      let percentVol = calculatePercentVolume(saleVolume, totalSalesVolume);
      //caluculate number of unit sold
      let unitSold = Number(saleVolume / product.value.unit);
      //selling price for this unit sold
      let sellingPrice = unitSold * product.value.price;
      //get average ppmu (pricePerMinUnit)
      let averagePpmu = getAveragePpmu(product.value.prodId);
      //cost price for sold unit
      let costPrice = averagePpmu * unitSold;
      //calculate gain
      let profit = sellingPrice - costPrice;
      //calculate percentage profit
      let percentageGain = ((profit / totalGain) * 100).toFixed(2);

      reportArray.push({
        id: product.value.prodId,
        name: product.value.name,
        saleVolume: saleVolume,
        percentVolume: percentVol,
        percentProfit: percentageGain
      });
    } else {
      //everyting should be zero
      reportArray.push({
        id: product.value.prodId,
        name: product.value.name,
        saleVolume: 0,
        percentVolume: 0,
        percentProfit: 0
      });
    }
  });

  searchArray = reportArray;
  return reportArray;
};

// proceed to list
const proceedToGetSales = (month, year, reportType) => {
  //check if theres sales for this date
  let matchedSales = reportModel.getMatchingSales(sales, month, year);
  if (matchedSales == false) {
    if (reportType == "product") {
      document.getElementById("productList").innerHTML =
        " <tr>" +
        ' <td colspan="5" class="text-center">' +
        "  <span>No record found</span>" +
        " </td>" +
        " </tr>";
    } else {
      document.getElementById("accountList").innerHTML =
        " <tr>" +
        ' <td colspan="8" class="text-center">' +
        "  <span>No record found</span>" +
        " </td>" +
        " </tr>";

      //append to DOM
      document.getElementById("span1").textContent = "+" + formatMoney(0);
      document.getElementById("span2").textContent = "+" + formatMoney(0);
      document.getElementById("span3").textContent = "+" + formatMoney(0);
      document.getElementById("span4").textContent = "+" + formatMoney(0);
    }
    searchArray = [];
  } else {
    if (reportType == "product") {
      //proceed to sort stock sales
      let reportList = proceedToSortStockSales(matchedSales);
      displayProductReportList(reportList);

      //empty list
      reportArray = [];
    } else {
      //get expenses for this month
      let expenses = reportModel.getExpenses();
      expenses.then(({ data }) => {
        let allExp = data.rows;
        //get expenses for this month
        let mainExp = reportModel.getMatchingExp(month, year, allExp);
        //get expired stock for this month
        let expStock = reportModel.getMonthExpiredStock(stock, month, year);

        let allInvoices = reportModel.getAllInvoices();
        allInvoices.then(({ data }) => {
          let invoices = data.rows;

          let actualInvoices = reportModel.getMatchInvoices(
            invoices,
            month,
            year
          );

          //get for account
          let reportList = proceedToSortAccountList(
            matchedSales,
            mainExp,
            expStock,
            actualInvoices,
            invoices,
            month,
            year
          );

          displayAccountReportList(reportList);

          //empty list
          reportArray = [];
        });
      });
    }
  }
};

///list report
const listProductReport = () => {
  let date = new Date();
  let day = date.getDate();
  let month = date.getMonth() + 1;
  let year = date.getFullYear();

  //add date to input
  document.getElementById("prodReportYear").value = year;
  document.getElementById("prodReportMonth").value = month;

  let getStock = reportModel.getStock();
  getStock.then(({ data, header, status }) => {
    stock = data.rows;

    let getSales = reportModel.getSales();
    getSales.then(({ data, headers, status }) => {
      sales = data.rows;

      // proceed to list
      proceedToGetSales(month, year, "product");
      //display date
      document.getElementById("dispDate").textContent = `${month}-${year}`;

      //enable button
      document.getElementById("processBtn").disabled = false;
    });
  });
};

//load list for entered date
const loadProductReportList = e => {
  e.preventDefault();

  document.getElementById("productList").innerHTML =
    "<tr>" +
    '<td colspan="5" class="text-center" >' +
    '<div class="spinner-grow text-success"></div>' +
    "</td>" +
    "</tr>";

  let month = document.getElementById("prodReportMonth").value;
  let year = document.getElementById("prodReportYear").value;
  //display date
  document.getElementById("dispDate").textContent = `${month}-${year}`;

  //get all product report for selected date
  proceedToGetSales(month, year, "product");
};

//load account list for entered date

const loadAccountReportList = e => {
  e.preventDefault();

  document.getElementById("accountList").innerHTML =
    "<tr>" +
    '<td colspan="8" class="text-center" >' +
    '<div class="spinner-grow text-success"></div>' +
    "</td>" +
    "</tr>";

  let month = document.getElementById("acctReportMonth").value;
  let year = document.getElementById("acctReportYear").value;
  //display date
  document.getElementById("dispDate").textContent = `${month}-${year}`;

  //get all product report for selected date
  proceedToGetSales(month, year, "account");
};

//search product report
const searchProductReport = event => {
  let value = event.target.value;

  document.getElementById("productList").innerHTML =
    "<tr>" +
    '<td colspan="5" class="text-center" >' +
    '<div class="spinner-grow text-success"></div>' +
    "</td>" +
    "</tr>";

  //search this in our array
  let result = reportModel.searchProductReportList(value, searchArray);
  if (result != false) {
    displayProductReportList(result);
  } else {
    document.getElementById("productList").innerHTML =
      " <tr>" +
      ' <td colspan="5" class="text-center">' +
      "  <span>No record found</span>" +
      " </td>" +
      " </tr>";
  }
};

//account report start
const listAccountReport = () => {
  let date = new Date();
  let day = date.getDate();
  let month = date.getMonth() + 1;
  let year = date.getFullYear();

  //add date to input
  document.getElementById("acctReportYear").value = year;
  document.getElementById("acctReportMonth").value = month;

  let getStock = reportModel.getStock();
  getStock.then(({ data, header, status }) => {
    stock = data.rows;

    let getSales = reportModel.getSales();
    getSales.then(({ data, headers, status }) => {
      sales = data.rows;

      // proceed to list
      proceedToGetSales(month, year, "account");
      //display date
      document.getElementById("dispDate").textContent = `${month}-${year}`;

      //enable button
      document.getElementById("processBtn").disabled = false;
    });
  });
};

///button to load each gain analysis
const loadGainAnalysis = e => {
  if (showGenStaticModal("gainAnalysisContent")) {
    let btn = e.target.dataset;
    //extract details
    let dailyGain = btn.gain;
    let dailyCp = btn.cp;
    let dailySp = btn.sp;
    let preSp = btn.presp;
    let preCp = btn.precp;
    let preGain = btn.pregain;
    let yesterday = btn.yesterday;
    let lastMonth = btn.lastmonth;
    let lastYear = btn.lastyear;
    let day = btn.day;
    let month = btn.month;
    let year = btn.year;
    let perc = btn.percresult;
    let color = btn.color;

    let result =
      ` <tr> <td>${yesterday}-${lastMonth}-${lastYear}</td>` +
      `<td>${preCp}</td>` +
      `<td>${preSp}</td>` +
      `<td>${preGain}</td>` +
      `</tr>` +
      `<tr>` +
      `<td>${day}-${month}-${year}</td>` +
      `<td>${dailyCp}</td>` +
      `<td>${dailySp}</td>` +
      `<td>${dailyGain}</td>` +
      `</tr>`;

    //append to DOM
    document.getElementById(
      "currentDate"
    ).textContent = `${day}-${month}-${year}`;
    document.getElementById("gainContent").innerHTML = result;
    document.getElementById("percOutCome").textContent = perc + " %";
    document.getElementById("percOutCome").style.color = color;
  }
};

//hide gain gainAnalysisContent
const hideGainAnalysis = () => {
  hideGenStaticModal("gainAnalysisContent");
};
