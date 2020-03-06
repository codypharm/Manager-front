//import db file
const Database = require("../src/js/db");
const db = new Database();

//details store
let details = {
  companyName: "",
  address: "",
  companyId: "",
  branchId: ""
};

// eslint-disable-next-line no-unused-vars
const showInputs = e => {
  let target = e.target;
  let box = target.dataset.box;
  let otherBox;

  if (box == "standardBox") {
    otherBox = "premiumBox";
  } else {
    otherBox = "standardBox";
  }
  //get the div
  let theDiv = document.getElementsByClassName(box)[0];
  let otherDiv = document.getElementsByClassName(otherBox)[0];
  let myInputs = document.getElementsByClassName("myInputs");

  for (var element of myInputs) {
    element.value = "";
  }

  theDiv.classList.remove("hide");
  if (!otherDiv.classList.contains("hide")) {
    otherDiv.classList.add("hide");
  }
};

//error display
const displayError = (element, error) => {
  if (element.classList.contains("hide")) {
    element.classList.remove("hide");
    element.textContent = error;
  }
};

//define change form
const changeForm = (formToHide, formToShow) => {
  if (!formToHide.classList.contains("hide")) {
    formToHide.classList.add("hide");
  }

  if (formToShow.classList.contains("hide")) {
    formToShow.classList.remove("hide");
  }
};
// process standard
const processStandard = errorDiv => {
  //get forms
  let setupForm = document.getElementsByClassName("setupForm")[0];
  let managerForm = document.getElementsByClassName("managerForm")[0];
  //get company name
  let companyName = document.getElementById("standardName").value;
  //get address
  let stdAddress = document.getElementById("stdAddress").value;
  //check if it is empty
  if (companyName.length === 0 || stdAddress.length === 0) {
    displayError(errorDiv, "Please fill all fields");
  } else if (document.getElementById("termCheck").checked == false) {
    displayError(errorDiv, "Please you need to accept our terms");
  } else {
    //asign values to details object
    details = { companyName, stdAddress };
    //alter form
    changeForm(setupForm, managerForm);
  }
};

//process premium account
const processPremium = errorDiv => {
  //get forms
  let setupForm = document.getElementsByClassName("setupForm")[0];
  let managerForm = document.getElementsByClassName("managerForm")[0];
  //get company name
  let companyName = document.getElementById("companyName").value;
  //get address
  let premiumAddress = document.getElementById("premiumAddress").value;

  //get branch id
  let branchId = document.getElementById("branchId").value;

  //get branch id
  let companyId = document.getElementById("companyId").value;
  //check if all values are provided
  if (
    companyName.length === 0 ||
    premiumAddress.length === 0 ||
    branchId.length === 0 ||
    companyId.length === 0
  ) {
    displayError(errorDiv, "Please fill all fields");
  } else if (document.getElementById("termCheck").checked == false) {
    displayError(errorDiv, "Please you need to accept our terms");
  } else {
    details = { companyName, premiumAddress, companyId, branchId };
    //alter form
    changeForm(setupForm, managerForm);
  }
};

//process on clicking next button
// eslint-disable-next-line no-unused-vars
const showManagerDetail = e => {
  e.preventDefault();
  let errorDiv = document.getElementsByClassName("warning")[0];
  //hide error box
  if (!errorDiv.classList.contains("hide")) {
    errorDiv.classList.add("hide");
  }
  if (document.getElementById("standard").checked == true) {
    // eslint-disable-next-line no-undef
    processStandard(errorDiv);
  } else if (document.getElementById("premium").checked == true) {
    // eslint-disable-next-line no-undef
    processPremium(errorDiv);
  } else {
    let error = "Please sellect a package";
    displayError(errorDiv, error);
  }
};
