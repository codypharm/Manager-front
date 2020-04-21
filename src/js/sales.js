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
