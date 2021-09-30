/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
//load up dashboard

//global variables
let dashInvoices;
let dashSales;
let dashExpenses;
let dashUsers;
let dashStock;
let day;
let month;
let year;
let setup;

//total stock
const getTotalStock = stock => {
  let total = 0;

  stock.forEach(prod => {
    total += Number(prod.value.qty);
  });

  return total;
};

//get low stock
const getLowStock = stock => {
  let lowStock = dashboardModel.getExhaustedStock(stock);

  //display low stock
  if (lowStock.length > 0) {
    displayLowStock(lowStock);
  } else {
    document.getElementById("lowStockList").innerHTML =
      " <tr>" +
      ' <td colspan="3" class="text-center">' +
      "  <span>No record found</span>" +
      " </td>" +
      " </tr>";
  }
};

//handle dashStock
const handleStock = () => {
  dashboardModel.getStock().then(({ data }) => {
    dashStock = data.rows;

    //get total stock
    let totalStock = getTotalStock(dashStock);
    //get low stock
    let lowStock = getLowStock(dashStock);

    //append to DOM
    document.getElementById("span5").textContent = totalStock;
    //hide loading
    hideLoading();
  });
};

//get current sales
const getCurrentSales = sales => {
  return sales.filter(sale => {
    return (
      sale.value.day == day &&
      sale.value.month == month &&
      sale.value.year == year
    );
  });
};

//calculate total sales
const getTotalSales = sales => {
  let total = 0;
  sales.forEach(sale => {
    total += Number(sale.value.qty);
  });

  return total;
};

//total amount
const getTotalAmt = sales => {
  let total = 0;

  sales.forEach(sale => {
    total += Number(sale.value.price);
  });
  return total;
};

//handle dashSales
const handleSales = () => {
  dashboardModel.getSales().then(({ data }) => {
    dashSales = data.rows;

    //get sales for today
    let currentSales = getCurrentSales(dashSales);
    //get total Sales
    let totalSales = getTotalSales(currentSales);

    //get total amount
    let totalAmt = getTotalAmt(currentSales);

    //append to DOM
    document.getElementById("span1").textContent = formatMoney(totalSales);
    //document.getElementById("span4").textContent = totalAmt;
  });
};

//get invoices
const getCurrentInvoices = invoices => {
  return invoices.filter(invoice => {
    return (
      invoice.value.day == day &&
      invoice.value.month == month &&
      invoice.value.year == year
    );
  });
};

//get total invoice break down
const getInvoiceBreakDown = invoices => {
  let amount = 0;
  let totalPaid = 0;
  let totalDebt = 0;

  invoices.forEach(invoice => {
    amount += Number(invoice.value.netPrice);
    totalPaid += Number(invoice.value.amtPaid);
    totalDebt += Number(invoice.value.balance);
  });

  return [amount, totalPaid, totalDebt];
};

//get debt invoices
const getCurrentDebts = invoices => {
  return invoices.filter(invoice => {
    return Number(invoice.value.balance) > 0;
  });
};

const displayDoughtnut = (onlineTrans, cashTrans, creditTrans) => {
  var ctx = document.getElementById("doChart").getContext("2d");
  var myChart = new Chart(ctx, {
    type: "doughnut",
    data: {
      labels: ["Cash", "Online", "Credit"],
      datasets: [
        {
          label: "Transaction types",

          backgroundColor: [" #00c853", "#ffca4f", "red"],

          data: [cashTrans, onlineTrans, creditTrans]
        }
      ]
    },
    options: {
      animation: {
        animateScale: true
      }
    }
  });
};
const displayChart = amounts => {
  var ctx = document.getElementById("myChart").getContext("2d");
  var myChart = new Chart(ctx, {
    type: "line",
    data: {
      labels: [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sep",
        "Oc",
        "Nov",
        "Dec"
      ],
      datasets: [
        {
          label: "# of sales amount made",
          fill: false,
          lineTension: 0.3,
          backgroundColor: "rgba(0,200,83,0.4)",
          borderColor: "rgba(0,200,83,1)",
          borderCapStyle: "butt",
          borderDash: [],
          borderDashOffset: 0.0,
          borderJoinStyle: "miter",
          pointBorderColor: "rgba(0,200,83,0.4)",
          pointBackgroundColor: "#fff",
          pointBorderWidth: 1,
          pointHitRadius: 5,
          data: amounts
        }
      ]
    },
    options: {
      scales: {
        yAxes: [
          {
            ticks: {
              beginAtZero: true
            }
          }
        ]
      }
    }
  });
};

//get trans numbers
const getTransNumbers = invoices => {
  let onlineTrans = 0;
  let cashTrans = 0;
  let creditTrans = 0;

  invoices.forEach(invoice => {
    if (invoice.value.transType == "cash") {
      cashTrans++;
    } else if (invoice.value.transType == "online") {
      onlineTrans++;
    } else if (invoice.value.transType == "credit") {
      creditTrans++;
    }
  });
  return [onlineTrans, cashTrans, creditTrans];
};

//get total money for each month
const checkMoneyThisMonth = (thisMonth, invoices) => {
  let total = 0;
  invoices.forEach(invoice => {
    if (invoice.value.year == year && invoice.value.month == thisMonth) {
      total += Number(invoice.value.netPrice);
    }
  });

  return total;
};

//get money made through the year
const getAmountPerMonth = invoices => {
  let amountArray = [];
  //loop 12 times meaning yearly
  for (let i = 1; i < 13; i++) {
    amountArray.push(checkMoneyThisMonth(i, invoices));
  }
  return amountArray;
};

//handle dashInvoices
const handleInvoices = () => {
  dashboardModel.getAllInvoices().then(({ data }) => {
    dashInvoices = data.rows;

    //get money made for each month
    let amountArray = getAmountPerMonth(dashInvoices);

    //get current dashInvoices
    let currentInvoices = getCurrentInvoices(dashInvoices);
    let [onlineTrans, cashTrans, creditTrans] = getTransNumbers(
      currentInvoices
    );

    let [amount, totalPaid, totalDebt] = getInvoiceBreakDown(currentInvoices);
    if (onlineTrans == 0 && cashTrans == 0 && creditTrans == 0) {
      document.getElementById("doughnutBox").textContent =
        "No transactions yet";
    } else {
      //display doughnut
      displayDoughtnut(onlineTrans, cashTrans, creditTrans);
    }
    //display chart
    displayChart(amountArray);

    //get debt invoices
    let debtInvoices = getCurrentDebts(currentInvoices);

    if (debtInvoices.length > 0) {
      //display debts
      displayDashDebts(debtInvoices);
    } else {
      document.getElementById("dashDebtList").innerHTML =
        " <tr>" +
        ' <td colspan="2" class="text-center">' +
        "  <span>No record found</span>" +
        " </td>" +
        " </tr>";
    }
    //append to DOM
    document.getElementById("span2").textContent = formatMoney(totalDebt);
    document.getElementById("span3").textContent = formatMoney(totalPaid);
    document.getElementById("span4").textContent = formatMoney(amount);
    document.getElementById("span6").textContent = currentInvoices.length;
    document.getElementById("span8").textContent = currentInvoices.length;
  });
};

//handle dashUsers
const handleUsers = () => {
  dashboardModel.getUsers().then(({ data }) => {
    dashUsers = data.rows;

    //appende to DOM
    document.getElementById("span7").textContent = dashUsers.length;
  });
};

//handle exenses
const handleDashExpenses = () => {
  dashboardModel.getExpenses().then(({ data }) => {
    dashExpenses = data.rows;
  });
};

//load up dashboard
const loadUpdashboard = () => {
  //show Loading
  showLoading();
  //adjust notification
  notification();
  //handle date
  let date = new Date();
  day = date.getDate();
  month = date.getMonth() + 1;
  year = date.getFullYear();

  //get setup details
  let { detail } = store.getSetupDetail();
  setup = detail[0];

  //get dashSales
  handleSales();
  //get dashInvoices
  handleInvoices();
  //get dashExpenses
  handleDashExpenses();
  //get dashUsers
  handleUsers();
  //get dashStock
  handleStock();

  document.getElementById("brId").textContent = setup.value.branchId;
};

//synchronize with remote
const synchronize = e => {
  document.getElementById("sync").style.display = "";
  //disable synchronization button
  e.target.disabled = true;
  api();
};
