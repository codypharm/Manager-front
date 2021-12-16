/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */

//global variables
var expenses;
var expenseForm;
var staffList;
var currentExpenses;
//handle expenses
const handleExpenses = (day, month, year) => {
  //filter expenses with this date
  let matchedExpenses = expenseModel.matchExpense(expenses, day, month, year);
  currentExpenses = matchedExpenses;
  if (!matchedExpenses) {
    document.getElementById("expensesList").innerHTML =
      " <tr>" +
      ' <td colspan="4" class="text-center">' +
      "  <span>No record found</span>" +
      " </td>" +
      " </tr>";
  } else {
    //display expenses from template
    displayExpenses(matchedExpenses);
    document.getElementById("dispDate").textContent =
      day + "-" + month + "-" + year;
  }
};

//proceed delete ll
const proceedDeleteAll = async () => {
  for (let i = 0; i < currentExpenses.length; i++) {
    let expense = currentExpenses[i];
    await expenseModel.deleteExpense(
      expense._id,
      expense._rev,
      expense.amt,
      expense.description
    );
  }
  return true;
};

//verify all expenses
const verifyAllExpense = async () => {
  showLoading();

  let date = new Date();
  let day = date.getDate();
  let month = date.getMonth() + 1;
  let year = date.getFullYear();
  let match = currentExpenses.filter(expense => {
    return (
      expense.day != day &&
      expense.month != month &&
      expense.year != year &&
      expense.remote == true
    );
  });

  if (match.length > 0) {
    hideLoading();
    //break
    showModal("The expense list can no longer be deleted");
  } else {
    //proceed with deletion
    if (await proceedDeleteAll()) {
      //delete all expense in array
      expenses = await expenseModel.getExpenses();

      //get date
      let day = document.getElementById("expenseDay").value;
      let month = document.getElementById("expenseMonth").value;
      let year = document.getElementById("expenseYear").value;

      //load expenses
      handleExpenses(day, month, year);
      hideLoading();
    }
  }
};
//delete all expense
const deleteAllExpense = () => {
  //if no expense to delete
  if (!currentExpenses) return;

  //check if sync is on
  if (store.getSyncState() != undefined) {
    if (store.getSyncState().state) {
      showModal("Please try again when synchronization has ended.");
      return;
    }
  }

  //get window object
  const window = BrowserWindow.getFocusedWindow();
  //show dialog
  let resp = dialog.showMessageBox(window, {
    title: "Manager-front",
    buttons: ["Yes", "Cancel"],
    type: "info",
    message: "Click Ok to delete expense"
  });

  //check if response is yes
  resp.then((response, checkboxChecked) => {
    if (response.response == 0) {
      //verify all expense
      verifyAllExpense();
    }
  });
};

//proceed delete
const proceedDelete = async (id, rev, amt, description) => {
  showLoading();
  let expenseDeleter = await expenseModel.deleteExpense(
    id,
    rev,
    amt,
    description
  );

  //filter expenses
  expenses = expenseModel.removeExpense(expenses, id);

  //get date
  let day = document.getElementById("expenseDay").value;
  let month = document.getElementById("expenseMonth").value;
  let year = document.getElementById("expenseYear").value;

  //load expenses
  handleExpenses(day, month, year);
  hideLoading();
};

//verify expense
const verifyExpense = expense => {
  let date = new Date();
  let day = date.getDate();
  let month = date.getMonth() + 1;
  let year = date.getFullYear();
  if (expense.day != day || expense.month != month || expense.year != year) {
    return true;
  }
};

//delete expense
const deleteExpense = async (e, id, rev, amt, description) => {
  //check if sync is on
  if (store.getSyncState() != undefined) {
    if (store.getSyncState().state) {
      showModal("Please try again when synchronization has ended.");
      return;
    }
  }
  //check if expense has been recorded online
  //get all expenses
  let expenses = await expenseModel.getExpenses();

  // get this expense
  let expense = expenses.filter(expense => {
    return expense._id == id;
  })[0];

  //check if the expense if for today and not synchronized
  let unApprove = verifyExpense(expense);

  if (unApprove) {
    //show error for date
    showModal("You can no longer delete expense for this date");
  } else if (expense.remote) {
    //show error for already sync
    showModal("This expense is already online and can no longer be deleted");
  } else {
    //proceed to delete
    //get window object
    const window = BrowserWindow.getFocusedWindow();
    //show dialog
    let resp = dialog.showMessageBox(window, {
      title: "Manager-front",
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
  }
};

//load expenses of selected daTE
const loadMyExpenses = e => {
  e.preventDefault();
  showLoading();
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
  hideLoading();
};

//load current expenses
const loadCurrentExpenses = async () => {
  showLoading();
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

  expenses = await expenseModel.getExpenses();

  //load expenses
  handleExpenses(day, month, year);
  hideLoading();
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
  expenseModal();
  //focus
  document.getElementById("expAmt").focus();
};

//submit expense form
const submitExpenses = async e => {
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
    //insert exepense into db
    let expenseloader = await expenseModel.insertExpense(
      amt,
      description,
      name
    );

    //show success message
    showExpSuccess("expense recorded");

    //reset form
    document.getElementById("expAmt").value = "";
    document.getElementById("expDescription").value = "";
    document.getElementById("expName").value = "";
    setTimeout(() => {
      //hide the pop up
      if (hideGenStaticModal("expenseContent")) {
        //reload table with date
        loadCurrentExpenses();
      }
    }, 900);
  }
};
