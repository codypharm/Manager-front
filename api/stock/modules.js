const axiosInstance = require("../axiosInstance");
const ourModel = require("../../models/stockModel");
const stockModel = new ourModel();

const filterStock = stock => {
  let match = stock.filter(product => {
    return product.value.remote == false;
  });

  return match;
};

const upload = async stock => {
  // add company and branch ID manually
  let company = "Compy2u";
  let branch = "batch730";
  let promises = [];
  for (let i = 0; i < stock.length; i++) {
    promises.push(
      axiosInstance.post(`stock/company=${company}/branch=${branch}/`, {
        productName: stock[i].value.name,
        productId: stock[i].value.prodId,
        quantity: stock[i].value.qty,
        batchId: stock[i].value.batchId,
        expiryDate: stock[i].value.expDate,
        unit: stock[i].value.unit,
        ppmu: stock[i].value.ppmu,
        price: stock[i].value.price,
        companyId: company,
        branchId: branch
      })
      //.then(response => {
      //console.log(response);
      //})
    );
  }

  Promise.all(promises).then(async () => {
    await stockModel.remoteUpdateAllProduct(stock);
  });
};

module.exports = { filterStock, upload };
