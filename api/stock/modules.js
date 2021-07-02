const axiosInstance = require("../axiosInstance");
const ourModel = require("../../models/stockModel");
const stockModel = new ourModel();
const { Notyf } = require("notyf");
const filterStock = stock => {
  let match = stock.filter(product => {
    return product.value.remote == false;
  });

  return match;
};

const upload = async (stock, setup) => {
  // add company and branch ID manually
  let company = setup.value.companyId;
  let branch = setup.value.branchId;
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

  Promise.all(promises)
    .then(async () => {
      await stockModel.remoteUpdateAllProduct(stock);
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

module.exports = { filterStock, upload };
