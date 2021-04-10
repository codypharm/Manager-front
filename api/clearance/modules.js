const axiosInstance = require("../axiosInstance");
const ourModel = require("../../models/invoiceModel");
const invoiceModel = new ourModel();

const filterClearance = clearance => {
  let match = clearance.filter(item => {
    return item.value.remote == false;
  });

  return match;
};

const upload = async clearance => {
  // add company and branch ID manually
  let company = "Compy2u";
  let branch = "BR2334";
  let promises = [];
  for (let i = 0; i < clearance.length; i++) {
    promises.push(
      axiosInstance.post("clearance/", {
        date: `${clearance[i].value.year}-${clearance[i].value.month}-${clearance[i].value.day}`,
        transactionType: clearance[i].value.transType,
        invoiceId: clearance[i].value.paymentFor,
        paid: clearance[i].value.currentAmtPaid,
        attender: clearance[i].value.attender,
        companyId: company,
        branchId: branch
      })
      //.then(response => {
      //console.log(response);
      //})
    );
  }

  Promise.all(promises).then(async () => {
    await invoiceModel.remoteUpdateClearance(clearance);
  });
};

module.exports = { filterClearance, upload };
