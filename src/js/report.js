/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */
// global variables
var sales;
var stock;

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

//proceed to sort stock sales
const proceedToSortStockSales = matchedSales => {
  let sortedStock = reportModel.sortStock(stock);
  let totalSalesVolume = getTotalSalesVolume(matchedSales);
  let totalGain = getTotalProfit(matchedSales);

  let reportArray = [];

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

  return reportArray;
};

// proceed to list
const proceedToGetSales = (month, year) => {
  //check if theres sales for this date
  let matchedSales = reportModel.getMatchingSales(sales, month, year);
  if (matchedSales == false) {
    document.getElementById("productList").innerHTML =
      " <tr>" +
      ' <td colspan="5" class="text-center">' +
      "  <span>No record found</span>" +
      " </td>" +
      " </tr>";
  } else {
    //proceed to sort stock sales
    let reportList = proceedToSortStockSales(matchedSales);
    displayProductReportList(reportList);
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
      proceedToGetSales(month, year);
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

  //get all product report for selected date
  proceedToGetSales(month, year);
};
