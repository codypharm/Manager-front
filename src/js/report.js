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

//proceed to sort account list
const proceedToSortAccountList = (
  matchedSales,
  mainExp,
  expStock,
  actualInvoices
) => {
  let totalSalesVolume = getTotalSalesVolume(matchedSales);
  let expiredVolume = getExpVolume(expStock);
  let expenseAmount = getTotalExpense(mainExp);
  let totalIncome = getTotalIncome(actualInvoices);
  console.log(totalIncome);
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
    }
    searchArray = [];
  } else {
    if (reportType == "product") {
      //proceed to sort stock sales
      let reportList = proceedToSortStockSales(matchedSales);
      displayProductReportList(reportList);
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
            actualInvoices
          );
        });
      });
    }
    //empty list
    reportArray = [];
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
  proceedToGetSales(month, year);
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
