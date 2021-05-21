const axiosInstance = require("../axiosInstance");
const ourModel = require("../../models/salesModel");
const salesModel = new ourModel();

const filterSales = sales => {
  let match = sales.filter(sale => {
    return sale.value.remote == false;
  });

  return match;
};

const upload = async (sales, setup) => {
  // add company and branch ID manually
  let company = setup.value.companyId;
  let branch = setup.value.branchId;
  let promises = [];
  for (let i = 0; i < sales.length; i++) {
    promises.push(
      axiosInstance.post("sales/", {
        date: `${sales[i].value.year}-${sales[i].value.month}-${sales[i].value.day}`,
        transactionType: sales[i].value.transType,
        staffId: sales[i].value.staffId,
        invoiceId: sales[i].value.invoiceId,
        price: sales[i].value.price,
        quantity: sales[i].value.qty,
        productName: sales[i].value.name,
        productId: sales[i].value.productId,
        companyId: company,
        branchId: branch
      })
      //.then(response => {
      //console.log(response);
      //})
    );
  }

  Promise.all(promises).then(async () => {
    await salesModel.remoteUpdateSales(sales);
  });
};

module.exports = { filterSales, upload };
