/* eslint-disable no-undef */

//validate came from files.js-
/* eslint-disable no-unused-vars */

//global variable definition
var oldDetails;
var allUsers;
var editDetail;
let users = staffModel.getUsers();
users.then(({ data, headers, status }) => {
  allUsers = data.rows;
});
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

const handlePwdBox = e => {
  let perm = e.target.value;
  let pwdBox = document.getElementsByClassName("pwdCarrier")[0];
  if (perm == "admin" && oldDetails.value.pwd == "") {
    if (pwdBox.classList.contains("hide")) {
      pwdBox.classList.remove("hide");
    }
  } else {
    if (!pwdBox.classList.contains("hide")) {
      pwdBox.classList.add("hide");
      //empty  passsword field
      document.getElementById("pwd").value = "";
      document.getElementById("pwd2").value = "";
      document.getElementById("pwdError").textContent = "";
      document.getElementById("secPwdError").textContent = "";
      document.getElementsByClassName("pwd2")[0].style.border = "none";
      document.getElementsByClassName("pwd2")[0].style.borderBottom =
        "1px solid #ccc";
    }
  }
};

const resetBtn = btn => {
  btn.textContent = "Register";
};

const resetSaveBtn = btn => {
  btn.textContent = "Save";
};

//email exists function
const emailExists = (errorDiv, email, btn, details) => {
  console.log(details);

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

//update staff details
const updateStaffDetails = (newDetails, oldDetails, errorDiv, btn) => {
  let id = oldDetails.id;
  let rev = oldDetails.value.rev;

  let update = staffModel.updateUser(id, rev, newDetails, oldDetails);
  update.then(
    ({ data, headers, status }) => {
      if (status != 201) {
        // eslint-disable-next-line no-undef
        displayError(errorDiv, "update not successfull, please try again");
      } else {
        //check loged in is same with edited
        if (store.getLoginDetail().staffId == oldDetails.value.staffId) {
          //set login details
          store.setUserData({
            loginStatus: true,
            fname: newDetails.fname,
            lname: newDetails.lname,
            email: newDetails.email,
            staffId: oldDetails.staffI,
            position: newDetails.position,
            image: oldDetails.value.image,
            access: newDetails.access,
            docId: oldDetails.id
          });

          //update logged in user details
          document.getElementById(
            "nameBox"
          ).textContent = `${newDetails.fname[0].toUpperCase() +
            newDetails.fname.slice(1)} ${newDetails.lname[0].toUpperCase() +
            newDetails.lname.slice(1)}`;
          document.getElementById(
            "position"
          ).textContent = `${newDetails.position}`;
        }
        displaySuccess("staff data updated successfully");
        resetSaveBtn(btn);
        setTimeout(() => {
          hideSuccess();
        }, 900);
      }
    },
    err => {
      // eslint-disable-next-line no-undef
      displayError(errorDiv, err);
      resetSaveBtn(btn);
    }
  );
};

//save edited detail
const saveDetails = e => {
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
  let position = document.getElementById("pon");

  let town = document.getElementById("town");
  let state = document.getElementById("state");
  let gender = document.getElementById("gender");
  let permission = document.getElementById("permission");
  let pwd = document.getElementById("pwd");
  let pwd2 = document.getElementById("pwd2");
  let image = document.getElementById("staffImage").src;

  let details = {
    fname: fname.value.trim(),
    lname: lname.value.trim(),
    email: email.value.trim(),
    number: number.value.trim(),
    street: street.value.trim(),
    state: state.value.trim(),
    town: town.value.trim(),
    gender: gender.value,
    permission: permission.value,
    position: pon.value.trim(),
    access: oldDetails.value.access,
    image: image,
    pwd: pwd.value.trim(),
    regDay: oldDetails.value.regDay,
    regMonth: oldDetails.value.regMonth,
    regYear: oldDetails.value.regYear
  };

  let inputs = [
    fname,
    lname,
    email,
    number,
    street,
    town,
    state,
    position,
    gender,
    permission
  ];

  if (validate.isEmpty(inputs)) {
    // eslint-disable-next-line no-undef
    displayError(errorDiv, "Please fill all fields");
    resetSaveBtn(btn);
  } else if (validate.isNotAlpha(fname.value.trim())) {
    // eslint-disable-next-line no-undef
    displayError(errorDiv, "Please firstname should be alphabets only");
    resetSaveBtn(btn);
  } else if (validate.isNotAlpha(lname.value.trim())) {
    // eslint-disable-next-line no-undef
    displayError(errorDiv, "Please lastname should be alphabets only");
    resetSaveBtn(btn);
  } else if (validate.isNotEmail(email.value.trim())) {
    // eslint-disable-next-line no-undef
    displayError(errorDiv, "Please enter a valid email");
    resetSaveBtn(btn);
  } else if (validate.isNotPhoneNumber(number.value.trim())) {
    // eslint-disable-next-line no-undef
    displayError(errorDiv, "Please enter a valid phone number");
    resetSaveBtn(btn);
  } else if (validate.isNotAlpha(state.value.trim())) {
    // eslint-disable-next-line no-undef
    displayError(errorDiv, "Please state should be alphabets only");
    resetSaveBtn(btn);
  } else if (
    permission.value == "admin" &&
    validate.notValidPassword(pwd.value.trim())
  ) {
    // eslint-disable-next-line no-undef
    displayError(errorDiv, "please enter a valid password");
    resetSaveBtn(btn);
  } else if (
    permission.value == "admin" &&
    pwd.value.trim() != pwd2.value.trim()
  ) {
    // eslint-disable-next-line no-undef
    displayError(errorDiv, "passwords do not match");
    resetSaveBtn(btn);
  } else if (
    details.email !== oldDetails.value.email &&
    staffModel.filterUsers(allUsers, email)
  ) {
    // eslint-disable-next-line no-undef
    displayError(errorDiv, "This email already belong to another user");
    resetSaveBtn(btn);
  } else if (
    details.number !== oldDetails.value.number &&
    staffModel.filterNumber(allUsers, number)
  ) {
    // eslint-disable-next-line no-undef
    displayError(errorDiv, "This phone number already belong to another user");
    resetSaveBtn(btn);
  } else {
    updateStaffDetails(details, oldDetails, errorDiv, btn);
  }
};

//register memeber
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
  let gender = document.getElementById("gender");
  let pwd = document.getElementById("pwd");
  let pwd2 = document.getElementById("pwd2");
  let position = document.getElementById("pon");
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
    gender: gender.value,
    permission: permissionLevel,
    position: position.value.trim(),
    remote: false
  };

  let inputs = [
    fname,
    lname,
    email,
    number,
    street,
    town,
    state,
    position,
    gender
  ];
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

const displayCurrentStaff = () => {
  //get current staff details from store
  let {
    loginStatus,
    fname,
    lname,
    email,
    position,
    image,
    access,
    docId
  } = store.getLoginDetail();

  //display current user details first
  $(".currentStaffName").append(fname + " " + lname);
  $(".currentStaffPosition").append(position);
  $(".currentStaffImg").attr("src", image);
  $("#currentStaffView").attr("data-staffEmail", email);
  $("#currentStaffEdit").attr("data-staffEmail", email);
};

const showList = () => {
  let users = staffModel.getUsers();
  users.then(({ data, headers, status }) => {
    //show staff template
    allUsers = data.rows;
    displayCurrentStaff();
    displayStaff(data.rows);
  });
};

//search staff
const searchStaff = e => {
  let warn = document.getElementById("staffWarn");
  if (!warn.classList.contains("hide")) {
    warn.classList.add("hide");
  }

  let val = e.target.value.trim();

  if (val.length < 1) {
    displayStaff(allUsers);
    if (!warn.classList.contains("hide")) {
      warn.classList.add("hide");
    }
  } else {
    searchResult = staffModel.extractUsers(allUsers, val);

    if (searchResult != false) {
      displayStaff(searchResult);
      if (!warn.classList.contains("hide")) {
        warn.classList.add("hide");
      }
    } else {
      if (warn.classList.contains("hide")) {
        warn.classList.remove("hide");
      }
    }
  }
};

//append details to view
const appendDetails = details => {
  document.getElementById("editBtn").dataset.staffemail = details.value.email;
  document.getElementsByClassName("viewName")[0].textContent =
    details.value.fname + " " + details.value.lname;
  document.getElementsByClassName("viewPosition")[0].textContent =
    details.value.position;
  document.getElementsByClassName("staffImage")[0].src = details.value.image;
  document.getElementsByClassName("id")[0].textContent = details.value.staffId;

  document.getElementsByClassName("gender")[0].textContent =
    details.value.gender;
  document.getElementsByClassName("email")[0].textContent = details.value.email;
  document.getElementsByClassName("number")[0].textContent =
    details.value.number;
  document.getElementsByClassName("street")[0].textContent =
    details.value.address.street;
  document.getElementsByClassName("town")[0].textContent =
    details.value.address.town;
  document.getElementsByClassName("state")[0].textContent =
    details.value.address.state;
  document.getElementsByClassName("permission")[0].textContent =
    details.value.permission;
  document.getElementsByClassName("access")[0].textContent =
    details.value.access;
  document.getElementsByClassName("regDate")[0].textContent =
    details.value.regDay +
    " / " +
    details.value.regMonth +
    " / " +
    details.value.regYear;
  if (details.value.updateDay != undefined) {
    document.getElementsByClassName("updateDate")[0].textContent =
      details.value.updateDay +
      " / " +
      details.value.updateMonth +
      " / " +
      details.value.updateYear;
  }
};

//append values to form
const appendValues = details => {
  oldDetails = details;

  document.getElementById("fname").value = details.value.fname;
  document.getElementById("lname").value = details.value.lname;
  document.getElementById("email").value = details.value.email;
  document.getElementById("staffImage").src = details.value.image;
  document.getElementById("number").value = details.value.number;
  document.getElementById("street").value = details.value.address.street;
  document.getElementById("town").value = details.value.address.town;
  document.getElementById("state").value = details.value.address.state;
  document.getElementById("pon").value = details.value.position;
  document.getElementById("pwd").value = details.value.pwd;
  document.getElementById("pwd2").value = details.value.pwd;
  let gender = details.value.gender;
  let permission = details.value.permission;
  let permissionIndex;
  let genderIndex;
  if (gender == "female") {
    genderIndex = 1;
  } else {
    genderIndex = 2;
  }

  if (permission == "admin") {
    permissionIndex = 1;
  } else {
    permissionIndex = 2;
  }

  document.getElementById("gender").selectedIndex = genderIndex;
  document.getElementById("permission").selectedIndex = permissionIndex;
};

//display staff details
const showStaffDetails = selectedEmail => {
  let users = staffModel.getUsers();
  users.then(({ data, headers, status }) => {
    //filter
    [details] = staffModel.filterStaffDetails(data.rows, selectedEmail);

    appendDetails(details);
  });
};

//display edit details
const showStaffValues = selectedEmail => {
  //get users and filter with email provided
  let users = staffModel.getUsers();
  users.then(({ data, headers, status }) => {
    //filter
    let [staffDetails] = staffModel.filterStaffDetails(
      data.rows,
      selectedEmail
    );
    appendValues(staffDetails);
    editDetail = staffDetails;
  });
};

//update status
const updateStatus = (e, staffEmail, command) => {
  //confirm command
  let confirmation = "Click OK to continue";
  if (confirm(confirmation)) {
    //add waiting
    e.target.textContent = "Please wait...";
    //get command
    let mainCommand = e.target.dataset.acctStatus;
    //if main command is defined else use the one in function argument
    if (mainCommand) {
      command = mainCommand;
    }

    //declare new access
    let access = command === "block" ? "closed" : "open";

    let newClass = command === "block" ? "activate" : "block";

    //get users
    let users = staffModel.getUsers();
    users.then(({ data, headers, status }) => {
      let [selectedUser] = staffModel.filterStaffDetails(data.rows, staffEmail);
      let id = selectedUser.id;
      let rev = selectedUser.value.rev;

      //create details of user
      let details = {
        fname: selectedUser.value.fname,
        lname: selectedUser.value.lname,
        email: selectedUser.value.email,
        number: selectedUser.value.number,
        position: selectedUser.value.position,
        gender: selectedUser.value.gender,
        street: selectedUser.value.address.street,
        town: selectedUser.value.address.town,
        state: selectedUser.value.address.state,
        permission: selectedUser.value.permission,
        access: access,
        staffId: selectedUser.value.staffId,
        image: selectedUser.value.image,
        pwd: selectedUser.value.pwd,
        regDay: selectedUser.value.regDay,
        regMonth: selectedUser.value.regMonth,
        regYear: selectedUser.value.regYear,
        updateDay: selectedUser.value.updateDay,
        updateMonth: selectedUser.value.updateMonth,
        updateYear: selectedUser.value.updateYear,
        editedBy: selectedUser.value.editedBy,
        editorEmail: selectedUser.value.editorEmail,
        remote: selectedUser.value.remote
      };
      //update details
      let updator = staffModel.updateStatus(id, rev, details);
      updator.then(({ data, header, status }) => {
        if (status == 201) {
          let target = e.target;
          //remove both block and activate classes
          if (target.classList.contains("block")) {
            target.classList.remove("block");
          } else if (target.classList.contains("activate")) {
            target.classList.remove("activate");
          }
          //add new class
          target.classList.add(newClass);
          //add new dataset
          target.dataset.acctStatus = newClass;
          //add new text
          target.innerHTML = newClass;
        } else {
          console.log("error");
        }
      });
    });
  }
};

//view click
const viewStaff = e => {
  viewEmail = e.target.dataset.staffemail;
  //get viewEmail for who is logged in
  if (viewEmail.toUpperCase() == "OWNER") {
    viewEmail = store.getLoginDetail().email;
  }
  //get users and filter with email provided

  pageLoader("staffView", showStaffDetails);
};

//view click
const editStaff = e => {
  editEmail = e.target.dataset.staffemail;
  pageLoader("staffEdit", showStaffValues);
};

const uploadImage = () => {
  document.getElementById("upload_image").click();
  store.setEditDetail(editDetail);
};
