/* eslint-disable no-unused-vars */

// validate comes from renderer process
//require files
const StaffModel = require("../models/staffModel");
//instantiate classes
const staffModel = new StaffModel();

const fnameAlpha = e => {
  let fname = e.target.value.trim();
  let errorBox = document.getElementById("fnameError");

  if (validate.isNotAlpha(fname)) {
    errorBox.textContent = "Please enter alphabets only";
  } else {
    errorBox.textContent = "";
  }
};

const validateNumber = e => {
  let number = e.target.value.trim();
  let errorBox = document.getElementById("numberError");

  if (validate.isNotPhoneNumber(number)) {
    errorBox.textContent = "Please enter a valid phone number";
  } else {
    errorBox.textContent = "";
  }
};

const lnameAlpha = e => {
  let lname = e.target.value.trim();
  let errorBox = document.getElementById("lnameError");

  if (validate.isNotAlpha(lname)) {
    errorBox.textContent = "Please enter alphabets only";
  } else {
    errorBox.textContent = "";
  }
};

const validateEmail = e => {
  let email = e.target.value.trim();
  let errorBox = document.getElementById("emailError");

  if (validate.isNotEmail(email)) {
    errorBox.textContent = "Please enter a valid email ";
  } else {
    errorBox.textContent = "";
  }
};

const stateAlpha = e => {
  let state = e.target.value.trim();
  let errorBox = document.getElementById("stateError");

  if (validate.isNotAlpha(state)) {
    errorBox.textContent = "Please enter alphabets only";
  } else {
    errorBox.textContent = "";
  }
};

const validatePwd = e => {
  let pwd = e.target.value.trim();
  let errorBox = document.getElementById("pwdError");

  if (validate.notValidPassword(pwd)) {
    errorBox.textContent =
      "Password should have an uppercase, lowercase, number, special character and minimum of 6 characters";
  } else {
    errorBox.textContent = "";
  }
};

const validateSecPwd = e => {
  let pwd = document.getElementById("pwd").value.trim();
  let secPwd = e.target.value.trim();
  let errorBox = document.getElementById("secPwdError");

  if (pwd != secPwd) {
    document.getElementsByClassName("pwd2")[0].style.border = "1px solid red";
    errorBox.textContent = "Passwords do not match ";
  } else {
    document.getElementsByClassName("pwd2")[0].style.border = "1px solid green";
    errorBox.textContent = "";
  }
};

const showPwd = e => {
  let pwdBearer = document.getElementsByClassName("passwordBearer")[0];

  if (pwdBearer.classList.contains("hide")) {
    pwdBearer.classList.remove("hide");
  }
};

const hidePwd = e => {
  let pwdBearer = document.getElementsByClassName("passwordBearer")[0];

  if (!pwdBearer.classList.contains("hide")) {
    pwdBearer.classList.add("hide");
  }
};

const resetBtn = btn => {
  btn.textContent = "Register";
};

//email exists function
const emailExists = (errorDiv, email, btn, details) => {
  //check if email already exists
  let allUsers = staffModel.getUsers();
  //handle promise
  allUsers.then(({ data, headers, status }) => {
    let users = data.rows;
    //filter match
    let match = staffModel.filterUsers(users, email);
    if (match) {
      // eslint-disable-next-line no-undef
      displayError(errorDiv, " sorry this email already exist");
      resetBtn(btn);
    } else {
      //generate id for user
      let idGen = staffModel.generateId();
      idGen.then(ids => {
        const id = ids[0];
        //insert details
        let detailInsertion = staffModel.insertDetails(details, id);
        detailInsertion.then(({ data, headers, status }) => {
          if (status == 201) {
            // eslint-disable-next-line no-undef
            displaySuccess("Staff registered");
            setTimeout(() => {
              //clear and restart form
              document.getElementsByClassName("pwd2")[0].style.border = "";
              document.getElementsByClassName("staffReg")[0].reset();
              // eslint-disable-next-line no-undef
              hideSuccess();
              resetBtn(btn);
              document.getElementById("fname").focus();
            }, 900);
          } else {
            //display error
            // eslint-disable-next-line no-undef
            displayError(
              errorDiv,
              " sorry an error occured please try again later"
            );
            resetBtn(btn);
          }
        });
      });
    }
  });
};

const register = e => {
  e.preventDefault();
  e.target.textContent = "please wait...";
  let btn = e.target;

  //get error div
  let errorDiv = document.getElementsByClassName("warning")[0];
  //hide error box
  if (!errorDiv.classList.contains("hide")) {
    errorDiv.classList.add("hide");
  }

  let fname = document.getElementById("fname");
  let lname = document.getElementById("lname");
  let email = document.getElementById("email");
  let number = document.getElementById("number");
  let street = document.getElementById("street");
  let town = document.getElementById("town");
  let state = document.getElementById("state");
  let adminPermission = document.getElementById("admin");
  let memberPermission = document.getElementById("member");
  let pwd = document.getElementById("pwd");
  let pwd2 = document.getElementById("pwd2");
  let position = document.getElementById("position");
  let permissionLevel;
  if (adminPermission.checked == true) {
    permissionLevel = "admin";
  } else if (memberPermission.checked == true) {
    permissionLevel = "member";
  }

  let details = {
    fname: fname.value.trim(),
    lname: lname.value.trim(),
    email: email.value.trim(),
    number: number.value.trim(),
    street: street.value.trim(),
    state: state.value.trim(),
    town: town.value.trim(),
    pwd: pwd.value.trim(),
    permission: permissionLevel,
    position: position
  };

  let inputs = [fname, lname, email, number, street, town, state, position];
  if (validate.isEmpty(inputs)) {
    // eslint-disable-next-line no-undef
    displayError(errorDiv, "Please fill all fields");
    resetBtn(btn);
  } else if (validate.isNotAlpha(fname.value.trim())) {
    // eslint-disable-next-line no-undef
    displayError(errorDiv, "Please firstname should be alphabets only");
    resetBtn(btn);
  } else if (validate.isNotAlpha(lname.value.trim())) {
    // eslint-disable-next-line no-undef
    displayError(errorDiv, "Please lastname should be alphabets only");
    resetBtn(btn);
  } else if (validate.isNotEmail(email.value.trim())) {
    // eslint-disable-next-line no-undef
    displayError(errorDiv, "Please enter a valid email");
    resetBtn(btn);
  } else if (validate.isNotPhoneNumber(number.value.trim())) {
    // eslint-disable-next-line no-undef
    displayError(errorDiv, "Please enter a valid phone number");
    resetBtn(btn);
  } else if (validate.isNotAlpha(state.value.trim())) {
    // eslint-disable-next-line no-undef
    displayError(errorDiv, "Please state should be alphabets only");
    resetBtn(btn);
  } else if (
    adminPermission.checked == false &&
    memberPermission.checked == false
  ) {
    // eslint-disable-next-line no-undef
    displayError(errorDiv, "Please select permission level");
    resetBtn(btn);
  } else if (adminPermission.checked == true) {
    if (pwd.value.trim() != pwd2.value.trim()) {
      // eslint-disable-next-line no-undef
      displayError(errorDiv, "Passwords do not match");
      resetBtn(btn);
    } else if (validate.notValidPassword(pwd.value.trim())) {
      // eslint-disable-next-line no-undef
      displayError(errorDiv, "Password not strong enough");
      resetBtn(btn);
    } else {
      //check email address
      emailExists(errorDiv, email, btn, details);
    }
  } else {
    //check if email exists
    emailExists(errorDiv, email, btn, details);
  }
};
