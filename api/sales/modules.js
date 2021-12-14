const axiosInstance = require("../axiosInstance");
const ourModel = require("../../models/salesModel");
const { Notyf } = require("notyf");
const salesModel = new ourModel();

const filterSales = sales => {
  let match = sales.filter(sale => {
    return sale.remote == false;
  });

  return match;
};

const upload = async (sales, setup) => {
  // add company and branch ID manually
  let company = setup.companyId;
  let branch = setup.branchId;
  let promises = [];
  for (let i = 0; i < sales.length; i++) {
    promises.push(
      axiosInstance.post("sales/", {
        date: `${sales[i].year}-${sales[i].month}-${sales[i].day}`,
        transactionType: sales[i].transactionType,
        staffId: sales[i].staffId,
        invoiceId: sales[i].invoiceId,
        discount: sales[i].disccount,
        price: sales[i].price,
        quantity: sales[i].qty,
        productName: sales[i].name,
        productId: sales[i].productId,
        cost_price: Number(sales[i].cp),
        selling_price: Number(sales[i].sp),
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
      await salesModel.remoteUpdateSales(sales);
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

module.exports = { filterSales, upload };
