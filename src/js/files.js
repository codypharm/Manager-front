/* eslint-disable no-unused-vars */
//classes get instantiated here
const usersDb = new PouchDB('users');
const stockDb = new PouchDB('stock');
const salesDb = new PouchDB('sales');
const attendanceDb = new PouchDB('attendance');
const expensesDb = new PouchDB('expenses');
const activitiesDb = new PouchDB('activities');
const debt_clearanceDb = new PouchDB('debt_clearance');
const stockingDb = new PouchDB('stocking');
const invoicesDb = new PouchDB('invoices');
const setupDb = new PouchDB('setup');
//stockDb.destroy()
//salesDb.destroy()
//expensesDb.destroy()
//activitiesDb.destroy()
//debt_clearanceDb.destroy()
//stockingDb.destroy()
//invoicesDb.destroy()


// validate comes from renderer process
//require files
const printJs = require('print-js')
const SettingsModel = require("../models/settingsModel");
const DashboardModel = require("../models/dashboardModel");
const AttendanceModel = require("../models/attendanceModel");
const ReportModel = require("../models/reportModel");
const ExpenseModel = require("../models/expenseModel");
const SalesModel = require("../models/salesModel");
const InvoiceModel = require("../models/invoiceModel");
const StaffModel = require("../models/staffModel");
const StockModel = require("../models/stockModel");
const Validator = require("../src/js/validator");
const Store = require("../src/js/store");
const Database = require("../src/js/db");
const { remote } = require("electron");
const fetch = remote.require("electron-fetch").default;
const handleBar = remote.require("electron-handlebars");
const api = require("../api");
const fs = require("fs");

const Login = require("../models/loginModel");

//instantiate classes
const validate = new Validator();
const store = new Store();
//const db = new Database();
const login = new Login();
const staffModel = new StaffModel();
const stockModel = new StockModel();
const salesModel = new SalesModel();
const invoiceModel = new InvoiceModel();
const expenseModel = new ExpenseModel();
const reportModel = new ReportModel();
const attendanceModel = new AttendanceModel();
const dashboardModel = new DashboardModel();
const settingsModel = new SettingsModel();
