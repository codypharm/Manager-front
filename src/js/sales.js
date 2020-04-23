/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */
//globale variables
var cart = [];

//global variable
var stock;

const hideWarning = () => {
  document.getElementById("hide").classList.add("hide");
};

//calculation for net price
const calculateNetPrice = () => {
  let disccount = document.getElementById("disccount").value;
  let totalPrice = document.getElementById("totalPrice").textContent;

  //calculate
  if (disccount > 0) {
    let value = Number(totalPrice - (disccount / 100) * totalPrice);
    document.getElementById("netPrice").textContent = Math.ceil(value);
  } else {
    document.getElementById("netPrice").textContent = totalPrice;
  }
};

//calculate total
const calculateTotal = cart => {
  let [totalPrice, totalQty] = salesModel.calculateTotal(cart);
  document.getElementById("totalQty").textContent = totalQty;
  document.getElementById("totalPrice").textContent = totalPrice;

  //calculate net price
  calculateNetPrice();
};

//load cart
const loadCart = () => {
  const getStock = stockModel.getStock();
  getStock.then(({ data, header, status }) => {
    stock = data.rows;
  });

  //get products in store
  let { record } = store.getSaleStore();
  //get last list
  if (record != undefined && record.length > 0) {
    cart = record;

    updateCart(cart);

    //calculate total quantity
    calculateTotal(cart);
  }
};

const showWarning = message => {
  let box = document.getElementById("hide");
  box.classList.remove("hide");
  box.textContent = message;
};

//add to cart
const addToCart = (cart, prodId, qty, unit) => {
  //check if product is in cart
  if (salesModel.checkCart(cart, prodId)) {
    cart = salesModel.updateCartValue(cart, prodId, qty, unit);
    //set store
    store.setSaleStore(cart);
    updateCart(cart);
    //calculate total quantity
    calculateTotal(cart);
  } else {
    //get product object
    let newProduct = salesModel.getProduct(stock, prodId, qty, unit);

    cart.push(newProduct);
    //set store
    store.setSaleStore(cart);
    //update cart
    updateCart(cart);

    //calculate total quantity
    calculateTotal(cart);
  }

  setTimeout(() => {
    document.getElementById("saleForm").reset();
    document.getElementById("prodName").focus();
  }, 1000);
};

//check if in cart
const addCart = (cart, prodId, qty) => {
  qty += Number(salesModel.getMatchInCart(cart, prodId));

  return qty;
};

//add up matching stock
const addUpMatch = (stock, id) => {
  let matchQty = salesModel.addUpMatch(stock, id);
  return matchQty;
};

//process sale
const processSale = e => {
  e.preventDefault();

  //hide hideWarning
  let warn = document.getElementById("hide");
  if (!warn.classList.contains("hide")) {
    warn.classList.add("hide");
  }
  let qty = 0;
  let prodId = document.getElementById("prodName");
  qty = Number(document.getElementById("qty").value);

  let unit = Number(salesModel.getUnit(stock, prodId.value.trim()));

  //if no quantity is provided
  if (qty < 1) {
    //get the proguct unit

    qty += unit;
  }
  //check if product is in cart and add it
  qty = addCart(cart, prodId.value.trim(), qty);

  //adding up quantity of matching products
  let matchQty = addUpMatch(stock, prodId.value.trim());

  let input = [prodId];

  if (salesModel.isEmpty(input)) {
    showWarning("Please enter a product id or Product name");
  } else if (!salesModel.productExists(stock, prodId)) {
    showWarning("No match found !!!");
  } else if (qty > matchQty) {
    showWarning("Quantity entered is not available !!!");
  } else {
    //updateCart
    addToCart(cart, prodId.value.trim(), qty, unit);
  }
};

const addUpQty = (e, prodId, unit) => {
  prodId = prodId.toString();

  let qty = Number(e.target.value);

  //adding up quantity of matching products
  let matchQty = addUpMatch(stock, prodId);
  if (qty > matchQty) {
    showWarning("Quantity entered is not available !!!");
    //set it back to 1 or unit quantity
    e.target.value = unit;
  } else if (qty == 0) {
    //set it back to 1 or unit quantity
    e.target.value = unit;
  } else {
    cart = salesModel.updateCartValue(cart, prodId, qty, unit);
    //set store
    store.setSaleStore(cart);
    //update cart
    updateCart(cart);
    e.target.focus();
    //calculate total quantity
    calculateTotal(cart);
  }
};

//delete
const deleteMatch = prodId => {
  cart = salesModel.deleteSale(cart, prodId);

  store.setSaleStore(cart);
  updateCart(cart);
  //calculate total quantity
  calculateTotal(cart);
};

//delete a saleFormconst
const cancelCurSale = e => {
  let prodId = e.target.dataset.id;
  //get window object
  const window = BrowserWindow.getFocusedWindow();
  //show dialog
  let resp = dialog.showMessageBox(window, {
    title: "Vemon",
    buttons: ["Yes", "Cancel"],
    type: "info",
    message: "Click Ok to delete item from list"
  });

  //check if response is yes
  resp.then((response, checkboxChecked) => {
    if (response.response == 0) {
      deleteMatch(prodId);
    }
  });
};

//handle transaction type
const handleTransType = e => {
  let transType = e.target.value;
  let transBox = document.getElementById("transBox");
  let myForm = document.getElementById("customerForm");
  if (transType == "credit") {
    if (transBox.classList.contains("hide")) {
      transBox.classList.remove("hide");
    }
  } else {
    if (!transBox.classList.contains("hide")) {
      transBox.classList.add("hide");
      myForm.reset();
    }
  }
};

const sub = (obj, qty) => {
  if (Number(obj.value.qty) > Number(qty)) {
    obj.value.qty = Number(obj.value.qty) - Number(qty);
    qty = 0;
    return [obj, qty];
  } else if (Number(obj.value.qty) < Number(qty)) {
    qty = Number(qty) - Number(obj.value.qty);
    obj.value.qty = 0;

    return [obj, qty];
  } else {
    obj.value.qty = 0;
    qty = 0;
    return [obj, qty];
  }
};

//invoice id genration
const generateInvoiceId = () => {
  let csNum = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
  let val = "";
  for (let i = 0; i < 5; i++) {
    let num;
    num = Math.floor(Math.random() * 10);
    val += csNum[num];
    val += Math.floor(Math.random() * 10);
  }
  return val;
};

const execInvoice = (
  invoiceId,
  customerAddress,
  customerName,
  customerNumber,
  deposit,
  transType,
  disccount,
  netPrice,
  totalPrice,
  amtPaid,
  balance
) => {
  let idGen = salesModel.generateId();
  idGen.then(ids => {
    let id = ids[0];
    //insert details
    let detailInsertion = salesModel.insertInvoice(
      id,
      invoiceId,
      customerAddress,
      customerName,
      customerNumber,
      deposit,
      transType,
      disccount,
      netPrice,
      totalPrice,
      amtPaid,
      balance
    );
    detailInsertion.then(({ data, headers, status }) => {
      console.log(status);
    });
  });
};

//insert sale into db
const insertSale = cart => {
  //get some neccesary details
  let amtPaid;
  let balance;
  let customerName = document.getElementById("customerName");
  let customerAddress = document.getElementById("customerAddress");
  let customerNumber = document.getElementById("customerNumber");
  let deposit = document.getElementById("deposit").value;
  let transType = document.getElementById("transType").value;
  let disccount = document.getElementById("disccount").value;
  let netPrice = document.getElementById("netPrice").textContent;
  let totalPrice = document.getElementById("totalPrice").textContent;

  if (deposit == 0 || deposit == "") {
    amtPaid = netPrice;
    balance = 0;
  } else {
    amtPaid = deposit;
    balance = Number(netPrice) - Number(deposit);
  }

  //get invoice detilas
  let invoiceId = generateInvoiceId();
  //loop through the cart and insert details to sales db
  cart.forEach(product => {
    //generate id for user
    let idGen = salesModel.generateId();
    idGen.then(ids => {
      let id = ids[0];
      //insert details
      let detailInsertion = salesModel.insertSales(
        product,
        id,
        invoiceId,
        transType
      );
      detailInsertion.then(({ data, headers, status }) => {
        console.log(status);
      });
    });
  });

  //insert details into invoice db
  execInvoice(
    invoiceId,
    customerAddress,
    customerName,
    customerNumber,
    deposit,
    transType,
    disccount,
    netPrice,
    totalPrice,
    amtPaid,
    balance
  );
};

//subtrat qty form stock and update stock table
const execute = (match, qty) => {
  //reverse the array
  match = match.reverse();
  //loop throughnthe match
  match.forEach(obj => {
    //get new values of each obj or product and qty remaining from purchase qty
    let [newProd, newQty] = sub(obj, qty);
    //assign new qty value to qty
    qty = newQty;

    let stockUpdate = salesModel.updateStock(newProd);
    stockUpdate.then(
      ({ data, headers, status }) => {
        console.log(status);
      },
      err => {
        console.log(err);
      }
    );
  });
};

//continue process
const process = cart => {
  let match;
  let newValue;
  //loop through cart
  cart.forEach(product => {
    //get matching product from db
    match = salesModel.getMatch(stock, product.productId);
    //get quantity bought
    let qty = product.qty;
    //handle each match
    execute(match, qty);
  });

  //insert into sales
  insertSale(cart);
};

//process cart
const processCart = e => {
  let totalPrice = document.getElementById("totalPrice");
  let totalQty = document.getElementById("totalQty");
  let disccount = document.getElementById("disccount").value;
  let netPrice = document.getElementById("netPrice");
  let transType = document.getElementById("transType").value;
  let name = document.getElementById("customerName");
  let number = document.getElementById("customerNumber");
  let address = document.getElementById("customerAddress");
  let deposit = document.getElementById("deposit");

  let inputs = [name, number, address, deposit];

  if (transType == "") {
    showModal("Please enter a transaction type.");
  } else if (transType == "credit" && salesModel.isEmpty(inputs)) {
    showModal("Please fill all fields");
  } else if (
    transType == "credit" &&
    salesModel.isNotAlpha(name.value.trim())
  ) {
    showModal("Please neter a valid name.");
  } else if (
    transType == "credit" &&
    salesModel.isNotPhoneNumber(number.value.trim())
  ) {
    showModal("Please enter a valid phone number.");
  } else {
    //get window object
    const window = BrowserWindow.getFocusedWindow();
    //show dialog
    let resp = dialog.showMessageBox(window, {
      title: "Vemon",
      buttons: ["Yes", "Cancel"],
      type: "info",
      message: "All you sure all purchase have been recorded"
    });

    //check if response is yes
    resp.then((response, checkboxChecked) => {
      if (response.response == 0) {
        //process
        process(cart, totalQty);
      }
    });
  }
};

const emptyTable = () => {
  document.getElementById("totalPrice").textContent = "-";
  document.getElementById("totalQty").textContent = "-";
  document.getElementById("disccount").value = "0";
  document.getElementById("netPrice").textContent = "-";
  document.getElementById("transType").value = "";
  document.getElementById("customerForm").reset();
  let box = document.getElementById("transBox");
  if (!box.classList.contains("hide")) {
    box.classList.add("hide");
  }
};

//cancel all sales in rocess
const cancelAllSales = e => {
  //get window object
  const window = BrowserWindow.getFocusedWindow();
  //show dialog
  let resp = dialog.showMessageBox(window, {
    title: "Vemon",
    buttons: ["Yes", "Cancel"],
    type: "info",
    message: "Click Ok to delete item from cart"
  });

  //check if response is yes
  resp.then((response, checkboxChecked) => {
    if (response.response == 0) {
      cart = [];
      store.setSaleStore(cart);
      updateCart(cart);
      emptyTable();
    }
  });
};
