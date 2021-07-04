const axiosInstance = require("../axiosInstance");
const ourModel = require("../../models/invoiceModel");
const { Notyf } = require("notyf");
const invoiceModel = new ourModel();

const filterInvoices = invoices => {
  let match = invoices.filter(invoice => {
    return invoice.value.remote == false;
  });

  return match;
};

const upload = async (invoices, setup) => {
  // add company and branch ID manually
  let company = setup.value.companyId;
  let branch = setup.value.branchId;
  let promises = [];
  for (let i = 0; i < invoices.length; i++) {
    promises.push(
      axiosInstance.post("invoices/", {
        date: `${invoices[i].value.year}-${invoices[i].value.month}-${invoices[i].value.day}`,
        transactionType: invoices[i].value.transType,
        invoiceId: invoices[i].value.invoiceId,
        total_price: invoices[i].value.totalPrice,
        discount: invoices[i].value.disccount,
        net_price: invoices[i].value.netPrice,
        paid: invoices[i].value.amtPaid,
        balance: invoices[i].value.balance,
        attender: invoices[i].value.attender,
        customer_name: invoices[i].value.customerName,
        customer_number: invoices[i].value.customerNumber,
        customer_address: invoices[i].value.customerAddress,
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
