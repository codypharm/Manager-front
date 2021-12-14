const axiosInstance = require("../axiosInstance");
const ourModel = require("../../models/invoiceModel");
const { Notyf } = require("notyf");
const invoiceModel = new ourModel();

const filterInvoices = invoices => {
  let match = invoices.filter(invoice => {
    return invoice.remote == false;
  });

  return match;
};

const upload = async (invoices, setup) => {
  // add company and branch ID manually
  let company = setup.companyId;
  let branch = setup.branchId;
  let promises = [];
  for (let i = 0; i < invoices.length; i++) {
    promises.push(
      axiosInstance.post("invoices/", {
        date: `${invoices[i].year}-${invoices[i].month}-${invoices[i].day}`,
        transactionType: invoices[i].transType,
        invoiceId: invoices[i].invoiceId,
        total_price: invoices[i].totalPrice,
        discount: invoices[i].disccount,
        net_price: invoices[i].netPrice,
        paid: invoices[i].amtPaid,
        balance: invoices[i].balance,
        attender: invoices[i].attender,
        customer_name: invoices[i].customerName,
        customer_number: invoices[i].customerNumber,
        customer_address: invoices[i].customerAddress,
        cost_price: Number(invoices[i].cp),
        selling_price: Number(invoices[i].sp),
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
      await invoiceModel.remoteUpdateInvoices(invoices);
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

module.exports = { filterInvoices, upload };
