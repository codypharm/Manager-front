/* eslint-disable no-unused-vars */
//classes get instantiated here

// validate comes from renderer process
//require files
const StaffModel = require("../models/staffModel");
const Validator = require("../src/js/validator");
const Store = require("../src/js/store");
const Database = require("../src/js/db");
const { remote, ipcRenderer } = require("electron");
const fetch = remote.require("electron-fetch").default;
const handleBar = remote.require("electron-handlebars");
const fs = require("fs");

const Login = require("../models/loginModel");

//instantiate classes
const validate = new Validator();
const store = new Store();
const db = new Database();
const login = new Login();
const staffModel = new StaffModel();
