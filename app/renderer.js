/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
//global variables
var viewEmail;
var editEmail;

//get setup details
var setUpDetails;
let viewUrl = db.viewUrl.setup;

let info = db.couch.get("vemon_setup", viewUrl);
info.then(({ data, headers, status }) => {
  setUpDetails = data.rows;
  //store data in electron store
  store.setSetupDetail(setUpDetails);
});

const appendUserDetails = () => {
  let user = store.getLoginDetail();

  document.getElementById("containerImg").src = user.image;
  document.getElementById(
    "nameBox"
  ).textContent = `${user.fname} ${user.lname}`;
  document.getElementById("position").textContent = user.position;
};

//details store
var details = {
  package: "",
  companyName: "",
  address: "",
  companyId: "",
  branchId: "",
  manager_firstname: "",
  manager_lastname: "",
  manager_password: "",
  manager_email: ""
};

const showModal = message => {
  $(".myModal").trigger("click");
  $("#modalBody").html(message);
};

const showStaticModal = message => {
  $(".staticModal").modal("show");
  $("#staticBody").html(message);
  return true;
};

const showDebtForm = (message, type) => {
  if (type == "form") {
    //change form buttons
    let clearBtns = document.getElementById("clearanceFormBtn");
    if (clearBtns.classList.contains("hide")) {
      clearBtns.classList.remove("hide");
    }
    let invoBtns = document.getElementById("debtInvoiceFooter");
    if (!invoBtns.classList.contains("hide")) {
      invoBtns.classList.add("hide");
    }
  } else {
    //change form buttons
    let invoBtns = document.getElementById("debtInvoiceFooter");
    if (invoBtns.classList.contains("hide")) {
      invoBtns.classList.remove("hide");
    }
    let clearBtns = document.getElementById("clearanceFormBtn");
    if (!clearBtns.classList.contains("hide")) {
      clearBtns.classList.add("hide");
    }
  }
  $(".updateStaticModal").modal("show");
  $("#updateStaticBody").html(message);
  return true;
};

const showGenStaticModal = elem => {
  $(".genStaticModal").modal("show");

  document.getElementById(elem).classList.remove("hide");
  // $("#" + body).html(message);
  return true;
};

const hideDebtModal = () => {
  $(".updateStaticModal").modal("hide");
  return true;
};

const hideGenStaticModal = elem => {
  $(".genStaticModal").modal("hide");
  document.getElementById(elem).classList.add("hide");

  return true;
};

//loader sign
const showLoading = () => {
  $(".loadingModal").modal("show");
};

const hideLoading = () => {
  $(".loadingModal").modal("hide");
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

//success display
const displaySuccess = message => {
  let element = document.getElementsByClassName("success")[0];
  if (element.classList.contains("hide")) {
    element.classList.remove("hide");
    element.textContent = message;
  }
};

//success hide
const hideSuccess = message => {
  let element = document.getElementsByClassName("success")[0];
  if (!element.classList.contains("hide")) {
    element.classList.add("hide");
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
    let package = "standard";
    let address = stdAddress;
    details = { package, companyName, address };
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
    let package = "premium";
    let address = premiumAddress;
    details = { package, companyName, address, companyId, branchId };
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

//process managers details
// eslint-disable-next-line no-unused-vars
const enterDetails = e => {
  e.preventDefault();
  //get error div
  let errorDiv = document.getElementsByClassName("warning")[0];
  //hide error box
  if (!errorDiv.classList.contains("hide")) {
    errorDiv.classList.add("hide");
  }

  //get all fields
  let fname = document.getElementById("fname");
  let lname = document.getElementById("lname");
  let email = document.getElementById("email");
  let pwd = document.getElementById("pwd");
  let secPwd = document.getElementById("confirmPwd");
  let inputs = [fname, lname, email, pwd, secPwd];

  //check fields
  if (validate.isEmpty(inputs)) {
    displayError(errorDiv, "Please fill all fields");
  }

  //check if alpha only
  else if (validate.isNotAlpha(fname.value.trim())) {
    displayError(errorDiv, "First name should have alphabets only");
  }

  //check if alpha only
  else if (validate.isNotAlpha(lname.value.trim())) {
    displayError(errorDiv, "Last name should have alphabets only");
  }

  //validate if email
  else if (validate.isNotEmail(email.value.trim())) {
    displayError(errorDiv, "Email is not valid");
  }

  //validate password
  //let returnedValue = validate.validPassword(pwd.value.trim());
  else if (validate.notValidPassword(pwd.value.trim())) {
    displayError(
      errorDiv,
      "Invalid password!!! Password should have an uppercase, a lowercase, a number, a special character and a minimum of six values "
    );
  } else if (pwd.value != secPwd.value) {
    displayError(errorDiv, "Passwords do not match ");
  } else {
    //store details in the details object
    details.manager_firstname = fname.value.trim();
    details.manager_lastname = lname.value.trim();
    details.manager_password = pwd.value.trim();
    details.manager_email = email.value.trim();

    //user creation
    const createUser = userId => {
      let userDetailInsertion = validate.insertUser(details, userId);
      userDetailInsertion.then(({ data, headers, status }) => {
        //reload
        remote.getCurrentWindow().loadURL(`file://${__dirname}/index.html`);
      });
    };

    //create setup  database
    //generate id
    let idGen = validate.generateId();
    idGen.then(ids => {
      const id = ids[0];

      //insert details
      let detailInsertion = validate.insertDetails(details, id);
      detailInsertion.then(
        ({ data, headers, status }) => {
          //generate id
          let userIdGen = validate.generateId();
          userIdGen.then(ids => {
            const userId = ids[0];
            createUser(userId);
          });
        },
        err => {
          console.warn(err);
        }
      );
    });
  }
};

//compare the two passwords
// eslint-disable-next-line no-unused-vars
const comparePassword = e => {
  let pwd = document.getElementById("pwd");
  let secPwd = e.target;
  if (pwd.value != secPwd.value) {
    secPwd.style.border = "1px solid red";
  } else {
    secPwd.style.border = "1px solid green";
  }
};

//empty confirmation password
// eslint-disable-next-line no-unused-vars
const emptySecPassword = e => {
  let secPwd = document.getElementById("confirmPwd");
  secPwd.value = "";
  secPwd.style.border = "none";
};

//page loader
const pageLoader = (page, fxn = false) => {
  pagePlate = document.getElementsByClassName("pagePlate")[0];
  let url = `./pages/${page}.html`;

  fs.readFile(url, "utf-8", (err, data) => {
    if (err) {
      console.log(err);
    } else {
      pagePlate.innerHTML = data;
      if (fxn != false) {
        switch (page) {
          case "onlineSales":
            fxn("online");
            break;

          case "cashSales":
            fxn("cash");
            break;

          case "creditSales":
            fxn("credit");
            break;

          case "debtInvoices":
            fxn("debt");
            break;

          case "clearedInvoices":
            fxn("cleared");
            break;
          case "allStock":
            fxn("allStock");
            break;
          case "expiredStock":
            fxn("expiredStock");
            break;
          case "exhaustedStock":
            fxn("exhaustedStock");
            break;
          case "staffView":
            fxn(viewEmail);
            break;
          case "staffEdit":
            fxn(editEmail);
            break;
          default:
            fxn();
            break;
        }
      }
    }
  });
};

//hide menu if document is clicked
const handleBodyClick = e => {
  let menu = document.getElementsByClassName("userDrop")[0];
  if (e.target.className != "rightMenu" && e.target.className != "rightIcons") {
    if (!menu.classList.contains("hide")) {
      menu.classList.add("hide");
    }
  }
};

//load right menu
const loadRightMenu = () => {
  //add details to right menu
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

  //document.getElementById("staffAccount").dataset.staffEmail = email;
  $("#staffAccount").attr("data-staffEmail", email);
};

//handle setup checking
db.getSetup().then(({ data }) => {
  //check if we have set up
  if (data.rows.length > 0) {
    //check if user is logged in
    let { loginStatus } = store.getLoginDetail();

    if (loginStatus == false) {
      //display login page
      let url = "./pages/login.html";
      fs.readFile(url, "utf-8", (err, data) => {
        if (err) {
          console.log(err);
        }
        document.getElementsByTagName("main")[0].innerHTML = data;
      });
    } else {
      //display app container since user is logged in
      document.getElementsByTagName("body")[0].classList.remove("setupBack");
      let url = "./pages/container.html";
      fs.readFile(url, "utf-8", (err, data) => {
        if (err) {
          console.log(err);
        }
        document.getElementsByTagName("main")[0].innerHTML = data;
        appendUserDetails();

        //load right menu attributes
        loadRightMenu();
        //load dashboard
        //load work page
        pageLoader("settings", loadSettingsSections);
      });
    }
  }
});
//ipcRenderer.send("as-message", "hello");

//login processing begins here
const processLogin = e => {
  e.preventDefault();

  //get error div
  let errorDiv = document.getElementsByClassName("warning")[0];
  //hide error box
  if (!errorDiv.classList.contains("hide")) {
    errorDiv.classList.add("hide");
  }

  let btn = e.target;
  let email = document.getElementById("email");
  let pwd = document.getElementById("pwd");
  let inputs = [email, pwd];

  if (validate.isEmpty(inputs)) {
    displayError(errorDiv, "Please fill all fields");
  } else if (validate.isNotEmail(email.value.trim())) {
    displayError(errorDiv, "Email invalid");
  } else {
    //get users promise
    let userPromise = login.getUsers();
    userPromise.then(
      ({ data, headers, status }) => {
        //get users
        let users = data.rows;

        //filter users for a match
        let match = login.filterUsers(users, email, pwd);
        if (match) {
          //check if account is blocked
          let access = login.checkAccess(users, email);

          if (access) {
            //get user details and store
            let userObj = login.getUserData(users, email);
            let user = userObj.value;

            //store them in electron store
            if (store.setUserData(user)) {
              //record attendance
              //get user details

              let thisUser = attendanceModel.getThisUser(users, user.staffId);

              //generate unique id
              let genId = attendanceModel.generateId();
              genId.then(ids => {
                let id = ids[0];
                //insert into attendance database
                let dataRecord = attendanceModel.recordAttendance(
                  id,
                  thisUser[0]
                );

                dataRecord.then(({ data, status }) => {
                  if (status == 201) {
                    //display app container
                    let url = "./pages/container.html";

                    fs.readFile(url, "utf-8", (err, data) => {
                      if (err) {
                        console.log(err);
                      }
                      //append main page
                      document.getElementsByTagName("main")[0].innerHTML = data;
                      //load dashboard
                      pageLoader("dashboard", loadUpdashboard);
                      document
                        .getElementsByTagName("body")[0]
                        .classList.remove("setupBack");
                      appendUserDetails();
                    });
                  }
                });
              });
            }
          } else {
            displayError(
              errorDiv,
              "Access denied, please contact appropriate personel"
            );
          }
        } else {
          displayError(errorDiv, "Invalid email or wrong password");
        }
      },
      err => {
        console.log(err);
      }
    );
  }
};

// sidebar handler
const hideSideBar = e => {
  let sideBar = document.getElementsByClassName("sidePane")[0];
  let pageBase = document.getElementsByClassName("pageBase")[0];
  let pageHead = document.getElementsByClassName("pageHead")[0];

  sideBar.classList.toggle("hide");
  pageBase.classList.toggle("reducePad");
  pageHead.classList.toggle("reduceHeadPad");
};

//setting dropper
const drop = e => {
  let element = document
    .getElementsByClassName("userDrop")[0]
    .classList.toggle("hide");
};

//menu drop settings
const dropSales = e => {
  let sub = document.getElementsByClassName("subMenu1")[0];
  sub.classList.toggle("tap");
};

const dropStock = e => {
  let sub = document.getElementsByClassName("subMenu2")[0];
  sub.classList.toggle("tap");
};

const dropStaff = e => {
  let sub = document.getElementsByClassName("subMenu3")[0];
  sub.classList.toggle("tap");
};

const dropInvoice = e => {
  let sub = document.getElementsByClassName("subMenu4")[0];
  sub.classList.toggle("tap");
};

const dropReport = e => {
  let sub = document.getElementsByClassName("subMenu5")[0];
  sub.classList.toggle("tap");
};

//link selection starts

//selection remover
const selectionRemover = () => {
  //get all li
  let allLi = document.getElementsByTagName("li");
  for (var li of allLi) {
    if (li.classList.contains("selected")) {
      li.classList.remove("selected");
    }

    if (li.classList.contains("selectedDropper")) {
      li.classList.remove("selectedDropper");
    }

    if (li.classList.contains("tap")) {
      li.classList.remove("tap");
    }
  }
};

//class Adder
const addClass = (elem, className) => {
  elem.classList.add(className);
};

//dashboard
const loadDashboard = e => {
  let dashboard = document.getElementsByClassName("dashboard")[0];
  //remove previous selections
  selectionRemover();
  addClass(dashboard, "selected");

  pageLoader("dashboard", loadUpdashboard);
};

//all sales
const loadAllSales = e => {
  let subMenu1 = document.getElementsByClassName("subMenu1")[0];
  let allSales = document.getElementsByClassName("allSales")[0];
  //remove previous selections
  selectionRemover();
  addClass(allSales, "selected");
  addClass(subMenu1, "selectedDropper");
  pageLoader("allSales", loadCurrentSales);
};

//cash sales
const loadCashSales = e => {
  let subMenu1 = document.getElementsByClassName("subMenu1")[0];
  let cashSales = document.getElementsByClassName("cashSales")[0];
  //remove previous selections
  selectionRemover();
  addClass(cashSales, "selected");
  addClass(subMenu1, "selectedDropper");
  pageLoader("cashSales", loadOtherSales);
};

//credit sales
const loadCreditSales = e => {
  let subMenu1 = document.getElementsByClassName("subMenu1")[0];
  let creditSales = document.getElementsByClassName("creditSales")[0];
  //remove previous selections
  selectionRemover();
  addClass(creditSales, "selected");
  addClass(subMenu1, "selectedDropper");
  pageLoader("creditSales", loadOtherSales);
};

//online sales
const loadOnlineSales = e => {
  let subMenu1 = document.getElementsByClassName("subMenu1")[0];
  let onlineSales = document.getElementsByClassName("onlineSales")[0];
  //remove previous selections
  selectionRemover();
  addClass(onlineSales, "selected");
  addClass(subMenu1, "selectedDropper");
  pageLoader("onlineSales", loadOtherSales);
};

//add sales
const loadAddSales = e => {
  let subMenu1 = document.getElementsByClassName("subMenu1")[0];
  let addSales = document.getElementsByClassName("addSales")[0];
  //remove previous selections
  selectionRemover();
  addClass(addSales, "selected");
  addClass(subMenu1, "selectedDropper");
  pageLoader("addSales", loadCart);
};

//stock list
const loadAllStock = () => {
  let subMenu2 = document.getElementsByClassName("subMenu2")[0];
  let allStock = document.getElementsByClassName("allStock")[0];
  //remove previous selections
  selectionRemover();
  addClass(allStock, "selected");
  addClass(subMenu2, "selectedDropper");
  pageLoader("allStock", fetchAllStock);
};

//expired stock
const loadExpiredStock = e => {
  let subMenu2 = document.getElementsByClassName("subMenu2")[0];
  let expiredStock = document.getElementsByClassName("expiredStock")[0];
  //remove previous selections
  selectionRemover();
  addClass(expiredStock, "selected");
  addClass(subMenu2, "selectedDropper");
  pageLoader("expiredStock", fetchAllStock);
};

//stock exhausted
const loadExhaustedStock = e => {
  let subMenu2 = document.getElementsByClassName("subMenu2")[0];
  let exhaustedStock = document.getElementsByClassName("exhaustedStock")[0];
  //remove previous selections
  selectionRemover();
  addClass(exhaustedStock, "selected");
  addClass(subMenu2, "selectedDropper");
  pageLoader("exhaustedStock", fetchAllStock);
};

//stock list
const loadAddStock = e => {
  let subMenu2 = document.getElementsByClassName("subMenu2")[0];
  let addStock = document.getElementsByClassName("addStock")[0];
  //remove previous selections
  selectionRemover();
  addClass(addStock, "selected");
  addClass(subMenu2, "selectedDropper");
  pageLoader("addStock", loadStoreContent);
};

//staff list
const loadStaffList = e => {
  let subMenu3 = document.getElementsByClassName("subMenu3")[0];
  let staffList = document.getElementsByClassName("staffList")[0];
  //remove previous selections
  selectionRemover();
  addClass(staffList, "selected");
  addClass(subMenu3, "selectedDropper");
  pageLoader("staffList", showList);
};

//attendance
const loadAttendance = e => {
  let subMenu3 = document.getElementsByClassName("subMenu3")[0];
  let attendance = document.getElementsByClassName("attendance")[0];
  //remove previous selections
  selectionRemover();
  addClass(attendance, "selected");
  addClass(subMenu3, "selectedDropper");
  pageLoader("attendance", listAttendance);
};

//staff add
const loadAddStaff = e => {
  let subMenu3 = document.getElementsByClassName("subMenu3")[0];
  let addStaff = document.getElementsByClassName("addStaff")[0];
  //remove previous selections
  selectionRemover();
  addClass(addStaff, "selected");
  addClass(subMenu3, "selectedDropper");
  pageLoader("staffAdd");
};

//all invoices
const loadAllInvoices = e => {
  let subMenu4 = document.getElementsByClassName("subMenu4")[0];
  let allInvoices = document.getElementsByClassName("allInvoices")[0];
  //remove previous selections
  selectionRemover();
  addClass(allInvoices, "selected");
  addClass(subMenu4, "selectedDropper");
  pageLoader("allInvoices", loadCurrentInvoices);
};

//cleared invoices
const loadClearedInvoices = e => {
  let subMenu4 = document.getElementsByClassName("subMenu4")[0];
  let clearedInvoices = document.getElementsByClassName("clearedInvoices")[0];
  //remove previous selections
  selectionRemover();
  addClass(clearedInvoices, "selected");
  addClass(subMenu4, "selectedDropper");
  pageLoader("clearedInvoices", loadOtherInvoices);
};

//debt invoices
const loadDebtInvoices = e => {
  let subMenu4 = document.getElementsByClassName("subMenu4")[0];
  let debtInvoices = document.getElementsByClassName("debtInvoices")[0];
  //remove previous selections
  selectionRemover();
  addClass(debtInvoices, "selected");
  addClass(subMenu4, "selectedDropper");
  pageLoader("debtInvoices", loadOtherInvoices);
};

//expenses
const loadExpenses = e => {
  let expenses = document.getElementsByClassName("expenses")[0];
  //remove previous selections
  selectionRemover();
  addClass(expenses, "selected");
  pageLoader("expenses", loadCurrentExpenses);
};

//reports
const loadReports = e => {
  let reports = document.getElementsByClassName("reports")[0];
  //remove previous selections
  selectionRemover();
  addClass(reports, "selected");
  pageLoader("reports");
};

const loadAccountReports = e => {
  let accountReport = document.getElementsByClassName("accountReport")[0];
  //remove previous selections
  selectionRemover();
  addClass(accountReport, "selected");
  pageLoader("accountReport", listAccountReport);
};

const loadProductReports = e => {
  let productReport = document.getElementsByClassName("productReport")[0];
  //remove previous selections
  selectionRemover();
  addClass(productReport, "selected");
  pageLoader("productReport", listProductReport);
};

const loadSettings = e => {
  //let productReport = document.getElementsByClassName("productReport")[0];
  //remove previous selections
  selectionRemover();
  //addClass(productReport, "selected");
  pageLoader("settings", loadSettingsSections);
};

///currency formater
const formatMoney = money => {
  //ensure two decimal places
  let amount = Number(money).toFixed(2);
  //add commas where needed
  amount = amount.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  //return amount
  return amount;
};

//logout code
const logMeOut = e => {
  //get window object
  const window = BrowserWindow.getFocusedWindow();
  //show dialog
  let resp = dialog.showMessageBox(window, {
    title: "Vemon",
    buttons: ["Yes", "Cancel"],
    type: "info",
    message: "Click Okay to logout"
  });

  //check if response is yes
  resp.then((response, checkboxChecked) => {
    if (response.response == 0) {
      //show loading
      showLoading();

      let attendance = attendanceModel.getAttendance();
      attendance.then(({ data }) => {
        let attendanceRecord = data.rows;
        let date = new Date();

        let day = date.getDate();
        let month = date.getMonth() + 1;
        let year = date.getFullYear();
        let id = store.getLoginDetail().staffId;
        let myData = attendanceModel.getThisAttendance(
          attendanceRecord,
          day,
          month,
          year,
          id
        )[0];
        //update attendance
        let attendanceUpdater = attendanceModel.updateAttendance(myData);
        attendanceUpdater.then(({ data, status }) => {
          if (status == 201) {
            //logout
            store.forceLogout();
            //go to login page

            let url = "./pages/login.html";
            fs.readFile(url, "utf-8", (err, data) => {
              if (err) {
                console.log(err);
              }
              //hide loading
              hideLoading();
              document.getElementsByTagName("main")[0].innerHTML = data;
            });
          }
        });
      });

      //update attendance
      /*let attendanceUpdater = attendanceModel.updateAttendance(data);
      attendanceUpdater.then(({ data, status }) => {
        if (status == 201) {
          //go back and show list
          listAttendance();
        }
      });*/
    }
  });
};
