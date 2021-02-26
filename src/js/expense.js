/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */

//global variables
var expenses;
var expenseForm;
var staffList;

//handle expenses
const handleExpenses = (day, month, year) => {
  //filter expenses with this date
  let matchedExpenses = expenseModel.matchExpense(expenses, day, month, year);
  if (!matchedExpenses) {
    document.getElementById("expensesList").innerHTML =
      " <tr>" +
      ' <td colspan="4" class="text-center">' +
      "  <span>No record found</span>" +
      " </td>" +
      " </tr>";
  } else {
    //diplay expenses from template
    displayExpenses(matchedExpenses);
    document.getElementById("dispDate").textContent =
      day + "-" + month + "-" + year;
  }
};

//proceed delete ll
const proceedDeleteAll = () => {
  expenses.forEach(async expense => {
    expenseDeleter = await expenseModel.deleteExpense(
      expense.id,
      expense.value.rev,
      expense.value.amt,
      expense.value.description
    );
  });

  return true;
};

//delete all expense
const deleteAllExpense = () => {
  //get window object
  const window = BrowserWindow.getFocusedWindow();
  //show dialog
  let resp = dialog.showMessageBox(window, {
    title: "Vemon",
    buttons: ["Yes", "Cancel"],
    type: "info",
    message: "Click Ok to delete expense"
  });

  //check if response is yes
  resp.then((response, checkboxChecked) => {
    if (response.response == 0) {
      if (proceedDeleteAll()) {
        //delete all expense in array
        expenses = [];

        //get date
        let day = document.getElementById("expenseDay").value;
        let month = document.getElementById("expenseMonth").value;
        let year = document.getElementById("expenseYear").value;

        //load expenses
        handleExpenses(day, month, year);
      }
    }
  });
};

//proceed delete
const proceedDelete = (id, rev, amt, description) => {
  let expenseDeleter = expenseModel.deleteExpense(id, rev, amt, description);
  expenseDeleter.then(({ data, headers, status }) => {
    if (status == 200) {
      //filter expenses
      expenses = expenseModel.removeExpense(expenses, id);

      //get date
      let day = document.getElementById("expenseDay").value;
      let month = document.getElementById("expenseMonth").value;
      let year = document.getElementById("expenseYear").value;

      //load expenses
      handleExpenses(day, month, year);
    }
  });
};

//delete expense
const deleteExpense = (e, id, rev, amt, description) => {
  //get window object
  const window = BrowserWindow.getFocusedWindow();
  //show dialog
  let resp = dialog.showMessageBox(window, {
    title: "Vemon",
    buttons: ["Yes", "Cancel"],
    type: "info",
    message: "Click Ok to delete expense"
  });

  //check if response is yes
  resp.then((response, checkboxChecked) => {
    if (response.response == 0) {
      proceedDelete(id, rev, amt, description);
    }
  });
};

//load expenses of selected daTE
const loadMyExpenses = e => {
  e.preventDefault();

  //add loading sign
  document.getElementById("expensesList").innerHTML =
    " <tr>" +
    ' <td colspan="4" class="text-center">' +
    '  <div class="spinner-grow text-success"></div>' +
    " </td>" +
    " </tr>";
  //get date
  let day = document.getElementById("expenseDay").value;
  let month = document.getElementById("expenseMonth").value;
  let year = document.getElementById("expenseYear").value;

  //load expenses
  handleExpenses(day, month, year);
};

//load current expenses
const loadCurrentExpenses = () => {
  //enable button
  document.getElementById("processBtn").disabled = false;
  // showGenStaticModal("expenseContent", "expForm", "message");

  //get date
  let date = new Date();
  let day = date.getDate();
  let month = date.getMonth() + 1;
  let year = date.getFullYear();

  //load these to DOM
  document.getElementById("expenseDay").value = day;
  document.getElementById("expenseMonth").value = month;
  document.getElementById("expenseYear").value = year;

  //get staffList
  let userGetter = staffModel.getUsers();
  userGetter.then(({ data, header, status }) => {
    staffList = data.rows;
  });

  //get all expenses
  let expenseGetter = expenseModel.getExpenses();
  expenseGetter.then(({ data, headers, status }) => {
    expenses = data.rows;

    //load expenses
    handleExpenses(day, month, year);
  });
};

//handle show warning for expenses
const showExpError = message => {
  let errorBox = document.getElementById("expWarning");
  if (errorBox.classList.contains("hide")) {
    errorBox.classList.remove("hide");
    document.getElementById("expWarning").textContent = message;
  }
};

//handle hide warning
const hideExpError = () => {
  let errorBox = document.getElementById("expWarning");
  if (!errorBox.classList.contains("hide")) {
    errorBox.classList.add("hide");
    document.getElementById("expWarning").textContent = "";
  }
};

//handle show success for expenses
const showExpSuccess = message => {
  let sucBox = document.getElementById("expSuccess");
  if (sucBox.classList.contains("hide")) {
    sucBox.classList.remove("hide");
    document.getElementById("expSuccess").textContent = message;
  }
};

//handle hide success
const hideExpSuccess = () => {
  let sucBox = document.getElementById("expSuccess");
  if (!sucBox.classList.contains("hide")) {
    sucBox.classList.add("hide");
    document.getElementById("expSuccess").textContent = "";
  }
};

//hide expense form
const hideExpForm = () => {
  hideGenStaticModal("expenseContent");
};

//show expense form
const showExpForm = () => {
  //hide alert boxes
  hideExpError();
  hideExpSuccess();
  showGenStaticModal("expenseContent", "expForm", "message");
  //focus
  document.getElementById("expAmt").focus();
};

//submit expense form
const submitExpenses = e => {
  e.preventDefault();

  //hide all alert box
  hideExpError();
  hideExpSuccess();

  //get all inputs
  let amt = document.getElementById("expAmt").value.trim();
  let description = document.getElementById("expDescription").value.trim();
  let name = document.getElementById("expName").value.trim();
  let inputs = [amt, description, name];

  if (expenseModel.isEmpty(inputs)) {
    showExpError("Please fill all fields");
  } else if (expenseModel.isNotNumb(amt)) {
    showExpError("Invalid amount");
  } else if (expenseModel.notAlpha(name)) {
    //check if staff id exist
    showExpError("Invalid name");
  } else {
    let genId = expenseModel.generateId();
    genId.then(ids => {
      let id = ids[0];
      //insert exepense into db
      let expenseloader = expenseModel.insertExpense(
        id,
        amt,
        description,
        name
      );

      expenseloader.then(({ data, header, status }) => {
        if (status == 201) {
          //show success message
          showExpSuccess("expense recorded");

          //reset form
          document.getElementById("expAmt").value = "";
          document.getElementById("expDescription").value = "";
          document.getElementById("expName").value = "";
          setTimeout(() => {
            //hide the pop up
            if (hideGenStaticModal("expenseContent")) {
              //reload tabel with date
              loadCurrentExpenses();
            }
          }, 900);
        }
      });
    });
  }
};
