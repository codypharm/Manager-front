const axiosInstance = require("../axiosInstance");
const ourModel = require("../../models/expenseModel");
const { Notyf } = require("notyf");
const expenseModel = new ourModel();

const filterExpenses = expenses => {
  let match = expenses.filter(expense => {
    return expense.remote == false;
  });

  return match;
};

const upload = async (expenses, setup) => {
  // add company and branch ID manually
  let company = setup.companyId;
  let branch = setup.branchId;
  let promises = [];
  for (let i = 0; i < expenses.length; i++) {
    promises.push(
      axiosInstance.post("expenses/", {
        date: `${expenses[i].year}-${expenses[i].month}-${expenses[i].day}`,
        name: expenses[i].name,
        description: expenses[i].description,
        amount: expenses[i].amt,
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
      //set sync store
      store.setSyncState(false);
    });
};

module.exports = { filterExpenses, upload };
