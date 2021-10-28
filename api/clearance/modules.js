const axiosInstance = require("../axiosInstance");
const ourModel = require("../../models/invoiceModel");
const { Notyf } = require("notyf");
const invoiceModel = new ourModel();

const filterClearance = clearance => {
  let match = clearance.filter(item => {
    return item.value.remote == false;
  });

  return match;
};

const upload = async (clearance, setup) => {
  // add company and branch ID manually
  let company = setup.value.companyId;
  let branch = setup.value.branchId;
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

  Promise.all(promises)
    .then(async () => {
      await invoiceModel.remoteUpdateClearance(clearance);
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

module.exports = { filterClearance, upload };
