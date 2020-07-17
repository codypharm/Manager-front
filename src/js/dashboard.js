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

//handle dashStock
const handleStock = () => {
  dashboardModel.getStock().then(({ data }) => {
    dashStock = data.rows;
  });
};

//handle dashSales
const handleSales = () => {
  dashboardModel.getSales().then(({ data }) => {
    dashSales = data.rows;
  });
};

//handle dashInvoices
const handleInvoices = () => {
  dashboardModel.getAllInvoices().then(({ data }) => {
    dashInvoices = data.rows;
  });
};

//handle dashUsers
const handleUsers = () => {
  dashboardModel.getUsers().then(({ data }) => {
    dashUsers = data.rows;
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
  //handlle date
  let date = new Date();
  day = date.getDate();
  month = date.getMonth() + 1;
  year = date.getFullYear();
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
};
