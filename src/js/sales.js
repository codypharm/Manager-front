/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */
//globale variables
var cart = [
  {
    id: "62a2edc226e48763b1ff2a883b0154ec",
    name: "Acepol",
    productId: "675280",
    brand: "Bio",
    qty: "1",
    price: "100",
    initialPrice: "100"
  },
  {
    id: "62a2edc226e48763b1ff2a883b01286e",
    name: "Para",
    productId: "123456",
    qty: "1",
    price: "120",
    initialPrice: "120"
  }
];

//global variable
var stock;

const hideWarning = () => {
  document.getElementById("hide").classList.add("hide");
};

//load cart
const loadCart = () => {
  const getStock = stockModel.getStock();
  getStock.then(({ data, header, status }) => {
    stock = data.rows;
  });

  updateCart(cart);
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
    updateCart(cart);
  } else {
    //get product object
    let newProduct = salesModel.getProduct(stock, prodId, qty, unit);

    cart.push(newProduct);
    //update cart
    updateCart(cart);
  }

  setTimeout(() => {
    document.getElementById("saleForm").reset();
    document.getElementById("prodName").focus();
  }, 1000);
};

//check if in cart
const addCart = (cart, prodId, qty) => {
  qty += Number(salesModel.getMatchInCart(cart, prodId.value.trim()));

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
  qty = addCart(cart, prodId, qty);

  //adding up quantity of matching products
  let matchQty = addUpMatch(stock, prodId.value.trim());

  let input = [prodId];

  if (salesModel.isEmpty(input)) {
    showWarning("Please enter a product id or Product name");
  } else if (!salesModel.productExists(stock, prodId)) {
    showWarning("No match found !!!");
  } else if (qty > matchQty) {
    showWarning("Out of stock !!!");
  } else {
    //updateCart
    addToCart(cart, prodId.value.trim(), qty, unit);
  }
};
