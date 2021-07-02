const axiosInstance = require("../axiosInstance");
const ourModel = require("../../models/expenseModel");
const { Notyf } = require("notyf");
const expenseModel = new ourModel();

const filterExpenses = expenses => {
  let match = expenses.filter(expense => {
    return expense.value.remote == false;
  });

  return match;
};

const upload = async (expenses, setup) => {
  // add company and branch ID manually
  let company = setup.value.companyId;
  let branch = setup.value.branchId;
  let promises = [];
  for (let i = 0; i < expenses.length; i++) {
    promises.push(
      axiosInstance.post("expenses/", {
        date: `${expenses[i].value.year}-${expenses[i].value.month}-${expenses[i].value.day}`,
        name: expenses[i].value.name,
        description: expenses[i].value.description,
        amount: expenses[i].value.amt,
        companyId: company,
        branchId: branch
      })
      //.then(response => {
      //console.log(response);
      //})
    );
  }

  Promise.all(promises)
    .then(async () => {
      await expenseModel.remoteUpdateAllExpenses(expenses);
    })
    .catch(error => {
      //handle error
      const notyf = new Notyf({
        duration: 3000
      });

      // Display an error notification
      notyf.error("An Error Occured");
      //remove disabled and also loading sign
      document.querySelector("#syncBtn").disabled = false;
      document.getElementById("sync").style.display = "none";
    });
};

module.exports = { filterExpenses, upload };
