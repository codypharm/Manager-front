/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */

const {
  verifyPhoneNumber,
  // eslint-disable-next-line no-unused-vars
  COUNTRY_CODE
} = require("nigerian-phone-number-validator");

//global variables
let setupInfo;
let setupId;

//append values to DOM
const appendSettingsValues = () => {
  //stock settings
  document.getElementById("stockPerc").value = setupInfo.stock_limit;
  document.getElementById("stockExp").value = setupInfo.expiration_limit;

  //app settings
  if (setupInfo.logout_time == "30mins") {
    logout = 1;
  } else if (setupInfo.logout_time == "1hr") {
    logout = 2;
  } else if (setupInfo.logout_time == "2hr") {
    logout = 3;
  } else if (setupInfo.logout_time == "4hr") {
    logout = 4;
  }

  if (setupInfo.update_interval == "30mins") {
    update = 1;
  } else if (setupInfo.update_interval == "1hr") {
    update = 2;
  } else if (setupInfo.update_interval == "3hr") {
    update = 3;
  } else if (setupInfo.update_interval == "6hr") {
    update = 4;
  } else if (setupInfo.update_interval == "12hr") {
    update = 5;
  }

  document.getElementById("updateIn").selectedIndex = update;

  document.getElementById("logoutTime").selectedIndex = logout;

  //account settigs details
  if (setupInfo.package == "premium") {
    accountType = 1;
  } else {
    accountType = 2;
  }

  document.getElementById("acctType").selectedIndex = accountType;
  document.getElementById("compName").value = setupInfo.companyName;
  document.getElementById("address").value = setupInfo.address;
  document.getElementById("compId").value = setupInfo.companyId;
  document.getElementById("branchId").value = setupInfo.branchId;
  document.getElementById("phone").value = setupInfo.phone;
  //document.getElementById("email").value = setupInfo.email;

  hideLoading();
};

//load settings sections
const loadSettingsSections = async() => {
  //show loading
  showLoading();
  
    setupInfo = await settingsModel.getSetup()
    setupId = setupInfo._id;

    //set setup details
    store.setSetupDetail(setupInfo);

    //append values to DOM
    appendSettingsValues();
  
};

//stock settings validation
const submitStockSettings = async e => {
  //loading
  showLoading();
  //get values
  let stockLimit = document.getElementById("stockPerc").value;
  let stockExp = document.getElementById("stockExp").value;

  if (stockLimit.length == 0 || stockExp.length == 0) {
    hideLoading();
    showModal("please fill all fields in stock Settings section ");
  } else {
    //update stock info object
    setupInfo.expiration_limit = stockExp;
    setupInfo.stock_limit = stockLimit;

    //update database
    await settingsModel.updateSetUp(setupInfo, setupId)
          //reload sections
          loadSettingsSections();
       
  }
};

//app section validation
const submitAppSettings = async e => {
  //loading
  showLoading();

  //disconnect socket
  disconnectSocket();

  //get values
  let logout_time = document.getElementById("logoutTime").value;
  let update_interval = document.getElementById("updateIn").value;

  if (logout_time.length == 0 || update_interval.length == 0) {
    hideLoading();
    showModal("please fill all fields in app Settings section ");
  } else {
    //update stock info object
    setupInfo.logout_time = logout_time;
    setupInfo.update_interval = update_interval;

    //update database
   await settingsModel.updateSetUp(setupInfo, setupId)
        
          //restore new value
          
              let setUpDetails = await settingsModel.getSetup()
              //reload sections
              loadSettingsSections();
              //store data in electron store
              store.setSetupDetail(setUpDetails);
              //call sync function on renderer.js
              autosync();

              //call websocket function on renderer.js
              connectSocket();
            
        
      
  }
};

//validate standard account
const validateStandardData = (package, companyName, address) => {
  if (companyName.trim().length == 0) {
    hideLoading();
    showModal("Please enter a company name");
  } else if (address.trim().length == 0) {
    hideLoading();
    showModal("Please enter an address for this branch");
  } else {
    return true;
  }
};

//validate premium account
const validatePremiumData = (
  package,
  companyName,
  companyId,
  address,
  branchId
) => {
  if (companyName.trim().length == 0) {
    hideLoading();
    showModal("Please enter a company name");
  } else if (address.trim().length == 0) {
    hideLoading();
    showModal("Please enter an address for this branch");
  } else if (companyId.trim().length == 0) {
    hideLoading();
    showModal("Please enter a company ID");
  } else if (branchId.trim().length == 0) {
    hideLoading();
    showModal("Please enter a branch ID");
  } else {
    return true;
  }
};

//validate phone number
const phoneIsValid = phone => {
  if (phone.trim().length > 0 && !verifyPhoneNumber(phone)) {
    hideLoading();
    showModal("please enter a valid Nigerian phone number");
  } else {
    return true;
  }
};

//validate email number
const emailIsValid = email => {
  if (
    email.trim().length > 0 &&
    // eslint-disable-next-line no-useless-escape
    !/^([a-zA-Z0-9_\-\.]+)@([a-zA-Z0-9_\-\.]+)\.([a-zA-Z]{2,5})$/.test(email)
  ) {
    hideLoading();
    showModal("Please enter a valid email address");
  } else {
    return true;
  }
};

const completeUpdate = async () => {
  //update database
  await settingsModel.updateSetUp(setupInfo, setupId)
        //reload sections
        loadSettingsSections();
     
};

//continue premium processing
const continuePremium = data => {
  //if empty show error
  if (data.length == 0) {
    showModal(
      "No record exists for this branch. Please ensure you create a company and branch online and fill in their matching details here."
    );
    hideLoading()
  } else {
    //update data online
    branches.updateBranchOnline(data[0].id, setupInfo, completeUpdate);
  }
};

//proceed premium process
const proceed = () => {
  branches.fetchMatch(setupInfo.companyId, setupInfo.branchId, continuePremium);
};

//submit account settings
const submitAccountSettings =async e => {
  //loading
  showLoading();

  let package = document.getElementById("acctType").value;
  let companyName = document.getElementById("compName").value;
  let address = document.getElementById("address").value;
  let companyId = document.getElementById("compId").value;
  let branchId = document.getElementById("branchId").value;
  let phone = document.getElementById("phone").value;
  //let email = document.getElementById("email").value;

  if (package.trim().length == 0) {
    showModal("Please enter an account type");
    hideLoading();
  } else {
    if (package == "standard") {
      //validate standard details
      if (
        validateStandardData(package, companyName, address) &&
        phoneIsValid(phone)
      ) {
        //update setup info object
        setupInfo.package = package;
        setupInfo.companyName = companyName;
        setupInfo.address = address;
        setupInfo.phone = phone;
        //setupInfo.email = email;
        //update database
       await settingsModel.updateSetUp(setupInfo, setupId)
              //reload sections

              loadSettingsSections();
            
          
      }
    } else {
      //validate for premium account
      if (
        validatePremiumData(
          package,
          companyName,
          companyId,
          address,
          branchId
        ) &&
        phoneIsValid(phone)
      ) {
        //update setup info object
        setupInfo.package = package;
        setupInfo.companyName = companyName;
        setupInfo.address = address;
        setupInfo.companyId = companyId;
        setupInfo.branchId = branchId;
        setupInfo.phone = phone;
        // setupInfo.email = email;
        branches.branchProcess(proceed);
      }
    }
  }
};
