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
    //display expenses from template
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

//verify all expenses
const verifyAllExpense = () => {
  showLoading();
  //get all expenses
  let expenseGetter = expenseModel.getExpenses();
  expenseGetter.then(
    ({ data, headers, status }) => {
      //update expenses variable with current state of expenses
      expenses = data.rows;

      let date = new Date();
      let day = date.getDate();
      let month = date.getMonth() + 1;
      let year = date.getFullYear();
      let match = expenses.filter(expense => {
        return (
          expense.value.day != day ||
          expense.value.month != month ||
          expense.value.year != year ||
          expense.value.remote == true
        );
      });

      if (match.length > 0) {
        hideLoading();
        //break
        showModal("The expense list can no longer be deleted");
      } else {
        //proceed with deletion
        if (proceedDeleteAll()) {
          //delete all expense in array
          expenses = [];

          //get date
          let day = document.getElementById("expenseDay").value;
          let month = document.getElementById("expenseMonth").value;
          let year = document.getElementById("expenseYear").value;

          //load expenses
          handleExpenses(day, month, year);
          hideLoading();
        }
      }
    },
    err => {
      console.log(err);
    }
  );
};
//delete all expense
const deleteAllExpense = () => {
  //check if sync is on
  if (store.getSyncState().state) {
    showModal("Please try again when synchronization has ended.");
    return;
  }
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
      //verify all expense
      verifyAllExpense();
    }
  });
};

//proceed delete
const proceedDelete = (id, rev, amt, description) => {
  showLoading();
  let expenseDeleter = expenseModel.deleteExpense(id, rev, amt, description);
  expenseDeleter.then(
    ({ data, headers, status }) => {
      if (status == 200) {
        //filter expenses
        expenses = expenseModel.removeExpense(expenses, id);

        //get date
        let day = document.getElementById("expenseDay").value;
        let month = document.getElementById("expenseMonth").value;
        let year = document.getElementById("expenseYear").value;

        //load expenses
        handleExpenses(day, month, year);
        hideLoading();
      }
    },
    err => {
      console.log(err);
    }
  );
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
const deleteExpense = (e, id, rev, amt, description) => {
  //check if sync is on
  if (store.getSyncState().state) {
    showModal("Please try again when synchronization has ended.");
    return;
  }
  //check if expense has been recorded online
  //get all expenses
  let expenseGetter = expenseModel.getExpenses();
  expenseGetter.then(
    ({ data, headers, status }) => {
      let expenses = data.rows;
      // get this expense
      let expense = expenses.filter(expense => {
        return expense.id == id;
      })[0].value;
      //check if the expense if for today and not synchronized
      let unApprove = verifyExpense(expense);

      if (unApprove) {
        //show error for date
        showModal("You can no longer delete expense for this date");
      } else if (expense.remote) {
        //show error for already sync
        showModal(
          "This expense is already online and can no longer be deleted"
        );
      } else {
        //proceed to delete
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
      }
    },
    err => {
      console.log(err);
    }
  );
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
const loadCurrentExpenses = () => {
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
  let userGetter = staffModel.getUsers();
  userGetter.then(
    ({ data, header, status }) => {
      staffList = data.rows;
    },
    err => {
      console.log(err);
    }
  );

  //get all expenses
  let expenseGetter = expenseModel.getExpenses();
  expenseGetter.then(
    ({ data, headers, status }) => {
      expenses = data.rows;

      //load expenses
      handleExpenses(day, month, year);
      hideLoading();
    },
    err => {
      console.log(err);
    }
  );
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
    console.log("ok");
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

      expenseloader.then(
        ({ data, header, status }) => {
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
                //reload table with date
                loadCurrentExpenses();
              }
            }, 900);
          }
        },
        err => {
          console.log(err);
        }
      );
    });
  }
};
