/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */

var { dialog, BrowserWindow } = remote.require("electron");

//global variable
var stock;
const getStock = stockModel.getStock();
getStock.then(({ data, header, status }) => {
  stock = data.rows;
});
//product id generator

var recordedProduct = [];
var listNumber = 0;

const loadPreviousContent = () => {
  //get products in store
  let { record } = store.getRecordStore();
  //get last list number
  listNumber = record.reverse()[0].no;
  console.log(listNumber);
  recordedProduct = record;
  //show list
  updateRecordList(recordedProduct);
};

const generateProductId = e => {
  e.preventDefault();
  let alpha = [
    "A",
    "B",
    "C",
    "D",
    "E",
    "F",
    "G",
    "H",
    "I",
    "J",
    "K",
    "L",
    "M",
    "N",
    "O",
    "P",
    "Q",
    "R",
    "S",
    "T",
    "U",
    "V",
    "W",
    "X",
    "Y",
    "Z"
  ];
  let val = "";
  for (let i = 0; i < 3; i++) {
    let num;
    num = Math.floor(Math.random() * 26);
    val += alpha[num];
    val += Math.floor(Math.random() * 10);
    +",";
  }

  document.getElementById("productId").value = val;
};

const add = currentProduct => {
  let tbody = document.getElementById("tableBody");
  //insert row to table
  let row = tbody.insertRow();
  //add data set to row
  row.dataset.id = currentProduct.productId;
  //insert cell
  let cell1 = row.insertCell(0);
  let cell2 = row.insertCell(1);

  //add classes
  cell2.classList.add("minTab");
  cell1.classList.add("breakWord");

  //add html
  cell1.innerHTML = currentProduct.name;
  cell2.innerHTML =
    "<div class='cancelPen ' onclick='cancelRecord(event)' data-id=" +
    currentProduct.productId +
    ">" +
    "<i class='fas fa-times'  data-id=" +
    currentProduct.productId +
    "></i> " +
    "</div>" +
    "<div class='editPen' onclick='editRecord(event)' data-id=" +
    currentProduct.productId +
    ">" +
    " <i class='fas fa-pen' data-id=" +
    currentProduct.productId +
    " ></i>" +
    "</div>";

  //reset form
  document.getElementsByClassName("stockingForm")[0].reset();

  //focus on first field
  document.getElementById("productId").focus();
};

const addToDom = product => {
  //get dom and append value
  document.getElementById("productId").value = product.productId;
  document.getElementById("productName").value = product.name;
  document.getElementById("productBrand").value = product.brand;
  document.getElementById("expiryDate").value = product.expDate;
  document.getElementById("totalCost").value = product.totalCost;
  document.getElementById("qty").value = product.qty;
  document.getElementById("unit").value = product.unit;
  document.getElementById("form").value = product.form;
  document.getElementById("price").value = product.price;
  document.getElementById("errorLog").value = product.error;
  document.getElementById("hiddenInput").value = product.no;
};

const swapBtn = () => {
  //swap buttons
  let add = document.getElementsByClassName("prodBtnBox")[0];
  if (!add.classList.contains("hide")) {
    add.classList.add("hide");
    document.getElementById("addBtn").disabled = true;
  } else {
    add.classList.remove("hide");
    //reset form
    document.getElementsByClassName("stockingForm")[0].reset();
    document.getElementById("addBtn").disabled = false;
  }

  let otherBtn = document.getElementsByClassName("editBtnBox")[0];
  if (!otherBtn.classList.contains("hide")) {
    otherBtn.classList.add("hide");
    document.getElementById("addBtn").disabled = true;
  } else {
    otherBtn.classList.remove("hide");
    document.getElementById("addBtn").disabled = false;
  }

  document.getElementById("productId").focus();
};

const editRecord = e => {
  let id = e.target.dataset.id;
  //get values
  let [product] = stockModel.getProduct(recordedProduct, id);
  //append them to the dom
  addToDom(product);
  //swap buttons
  swapBtn();
};

const cancelRecord = e => {
  let id = e.target.dataset.id;
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
      removeRecord(id);
    }
  });
};

const removeRecord = id => {
  let currid = id;
  //remove from list
  document.querySelector("[data-id = " + id + "]").style.display = "none";
  //remove from storage
  recordedProduct = stockModel.deleteProduct(recordedProduct, id);
};

const addProduct = e => {
  //add to list number
  listNumber += 1;

  e.preventDefault();

  //get all the values
  let id = document.getElementById("productId");
  let name = document.getElementById("productName");
  let brand = document.getElementById("productBrand");
  let expDate = document.getElementById("expiryDate");
  let totalCost = document.getElementById("totalCost");
  let form = document.getElementById("form");
  let qty = document.getElementById("qty");
  let price = document.getElementById("price");
  let unit = document.getElementById("unit");
  let error = document.getElementById("errorLog");

  let detail = {
    no: listNumber,
    productId: id.value.trim(),
    name: name.value.trim(),
    brand: brand.value.trim(),
    expDate: expDate.value.trim(),
    totalCost: totalCost.value.trim(),
    form: form.value.trim(),
    unit: unit.value.trim(),
    qty: qty.value.trim(),
    price: price.value.trim(),
    error: error.value.trim()
  };

  let inputs = [id, name, brand, totalCost, qty, price, unit];

  if (stockModel.isEmpty(inputs)) {
    showModal("Please fill all fields marked *");
  } else if (stockModel.notAlphaNumeric(id)) {
    showModal("Product Id should contain only number and alphabet");
  } else if (
    stockModel.idExists(stock, id) &&
    stockModel.noNameMatch(stock, id, name)
  ) {
    showModal("Product Id already exist for another product");
    name.value = "";
    name.focus();
  } else if (stockModel.nameError(stock, id, name)) {
    showModal("Product name already exist with another product Id");
    name.value = "";
    name.focus();
  } else if (
    stockModel.idExists(stock, id) &&
    stockModel.noBrandMatch(stock, id, brand)
  ) {
    showModal("Product Id already exist with another brand");

    brand.value = "";
    brand.focus();
  } else if (
    stockModel.idExists(stock, id) &&
    stockModel.noFormMatch(stock, id, form)
  ) {
    showModal(" Product Id already exist with another product form");

    form.focus();
  } else if (
    stockModel.idExists(stock, id) &&
    stockModel.expError(stock, id, expDate)
  ) {
    showModal(
      "A product with a matching product Id has been recorded with expiry date, please add expiry date"
    );

    expDate.focus();
  } else if (
    stockModel.idExists(stock, id) &&
    stockModel.unitError(stock, id, unit)
  ) {
    showModal(
      "A product with a matching product Id has been recorded with a different unit"
    );

    expDate.focus();
  } else if (
    stockModel.idExists(stock, id) &&
    stockModel.priceError(stock, id, price)
  ) {
    showModal(
      "A product with a matching product Id has been recorded with a different price"
    );

    expDate.focus();
  } else if (totalCost.value < 1) {
    showModal("Total cost cannot be less than one");
  } else if (qty.value < 1) {
    showModal("Quantity cost cannot be less than one");
  } else if (unit.value < 1) {
    showModal("Unit cost cannot be less than one");
  } else if (price.value < 1) {
    showModal("Price cost cannot be less than one");
  } else if (stockModel.productInList(recordedProduct, name, productId)) {
    showModal(
      "A product with matching productId or name  has been recorded, please edit it if you want"
    );
  } else {
    //push to recorded product id
    recordedProduct.push(detail);
    console.log(recordedProduct);
    //// store i electron
    store.setRecordStore(recordedProduct);
    //get last input
    let currentProduct = stockModel.getLastProduct(recordedProduct);
    //append to list
    add(currentProduct);
  }
};

//cancel edit
const cancelEdit = e => {
  e.preventDefault();
  //reset form
  document.getElementsByClassName("stockingForm")[0].reset();

  //focus on first field
  document.getElementById("productId").focus();
  //swap button
  swapBtn();
};

//update record
const updateRecord = e => {
  e.preventDefault();

  //get target id
  let updateTargetNo = document.getElementById("hiddenInput").value;

  //get all the values
  let id = document.getElementById("productId");
  let name = document.getElementById("productName");
  let brand = document.getElementById("productBrand");
  let expDate = document.getElementById("expiryDate");
  let totalCost = document.getElementById("totalCost");
  let form = document.getElementById("form");
  let qty = document.getElementById("qty");
  let price = document.getElementById("price");
  let unit = document.getElementById("unit");
  let error = document.getElementById("errorLog");

  let detail = {
    productId: id.value.trim(),
    name: name.value.trim(),
    brand: brand.value.trim(),
    expDate: expDate.value.trim(),
    totalCost: totalCost.value.trim(),
    form: form.value.trim(),
    unit: unit.value.trim(),
    qty: qty.value.trim(),
    price: price.value.trim(),
    error: error.value.trim()
  };

  let inputs = [id, name, brand, totalCost, qty, price, unit];

  if (stockModel.isEmpty(inputs)) {
    showModal("Please fill all fields marked *");
  } else if (stockModel.notAlphaNumeric(id)) {
    showModal("Product Id should contain only number and alphabet");
  } else if (
    stockModel.idExists(stock, id) &&
    stockModel.noNameMatch(stock, id, name)
  ) {
    showModal("Product Id already exist for another product");
    name.value = "";
    name.focus();
  } else if (stockModel.nameError(stock, id, name)) {
    showModal("Product name already exist with another product Id");
    name.value = "";
    name.focus();
  } else if (
    stockModel.idExists(stock, id) &&
    stockModel.noBrandMatch(stock, id, brand)
  ) {
    showModal("Product Id already exist with another brand");

    brand.value = "";
    brand.focus();
  } else if (
    stockModel.idExists(stock, id) &&
    stockModel.noFormMatch(stock, id, form)
  ) {
    showModal(" Product Id already exist with another product form");

    form.focus();
  } else if (
    stockModel.idExists(stock, id) &&
    stockModel.expError(stock, id, expDate)
  ) {
    showModal(
      "A product with a matching product Id has been recorded with expiry date, please add expiry date"
    );

    expDate.focus();
  } else if (
    stockModel.idExists(stock, id) &&
    stockModel.unitError(stock, id, unit)
  ) {
    showModal(
      "A product with a matching product Id has been recorded with a different unit"
    );

    expDate.focus();
  } else if (
    stockModel.idExists(stock, id) &&
    stockModel.priceError(stock, id, price)
  ) {
    showModal(
      "A product with a matching product Id has been recorded with a different price"
    );

    expDate.focus();
  } else if (totalCost.value < 1) {
    showModal("Total cost cannot be less than one");
  } else if (qty.value < 1) {
    showModal("Quantity cost cannot be less than one");
  } else if (unit.value < 1) {
    showModal("Unit cost cannot be less than one");
  } else if (price.value < 1) {
    showModal("Price cost cannot be less than one");
  } else if (
    stockModel.productInEditList(recordedProduct, name, id, updateTargetNo)
  ) {
    showModal(
      "A product with matching productId or name has been recorded, please edit it if you want"
    );
  } else {
    let currentRecord = stockModel.updateRecord(
      recordedProduct,
      detail,
      updateTargetNo
    );
    updateRecordList(currentRecord);

    swapBtn();
  }
};
