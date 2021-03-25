const axiosInstance = require("../axiosInstance");
const ourModel = require("../../models/expenseModel");
const expenseModel = new ourModel();

const filterExpenses = expenses => {
  let match = expenses.filter(expense => {
    return expense.value.remote == false;
  });

  return match;
};

const upload = async expenses => {
  // add company and branch ID manually
  let company = "Compy2u";
  let branch = "batch730";
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

  Promise.all(promises).then(async () => {
    await expenseModel.remoteUpdateAllExpenses(expenses);
  });
};

module.exports = { filterExpenses, upload };
