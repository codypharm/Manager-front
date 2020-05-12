/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */

//global variables
var expenses;
var expenseForm;

//load current expenses
const loadCurrentExpenses = () => {
  //enable button
  document.getElementById("processBtn").disabled = false;
  // showGenStaticModal("expenseContent", "expForm", "message");
};

//handle show warning for expenses
const showExpError = message => {
  document.getElementById("expWarning").classList.remove("hide");
  document.getElementById("expWarning").textContent = message;
};

//handle hide warning
const hideExpError = () => {
  document.getElementById("expWarning").classList.add("hide");
  document.getElementById("expWarning").textContent = "";
};

//handle show warning for expenses
const showExpSuccess = message => {
  document.getElementById("expSuccess").classList.remove("hide");
  document.getElementById("expSuccess").textContent = message;
};

//handle hide warning
const hideExpSuccess = () => {
  document.getElementById("expSuccess").classList.add("hide");
  document.getElementById("expSuccess").textContent = "";
};

//hide expense form
const hideExpForm = () => {
  hideGenStaticModal("expenseContent");
};

//show expense form
const showExpForm = () => {
  showGenStaticModal("expenseContent", "expForm", "message");
  //focus
  document.getElementById("expAmt").focus();
};

//submit expense form
const submitExpenses = e => {
  e.preventDefault();
  showExpSuccess("success");

  //get all inputs
  let amt = document.getElementById("expAmt").value.trim();
  let description = document.getElementById("expDescription").value.trim();
  let staffId = document.getElementById("expStaffId").value.trim();
};
