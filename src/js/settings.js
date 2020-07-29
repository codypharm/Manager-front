/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */

//global variables
let setupInfo;

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
    logout = 2;
  } else if (setupInfo.logout_time == "4hr") {
    logout = 3;
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
  if (setupInfo.app_package == "premium") {
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
  document.getElementById("email").value = setupInfo.email;

  hideLoading();
};

//load settings sections
const loadSettingsSections = () => {
  //show loading
  showLoading();
  settingsModel.getSetup().then(({ data }) => {
    setupInfo = data.rows[0].value;

    //append values to DOM
    appendSettingsValues();
  });
};
