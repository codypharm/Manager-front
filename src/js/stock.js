/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */

var { dialog, BrowserWindow } = remote.require("electron");

//product id generator

//global variable
var stock;

var recordedProduct = [];
var listNumber = 0;

const loadStoreContent = () => {
  let getStock = stockModel.getStock();
  getStock.then(({ data, header, status }) => {
    stock = data.rows;
  });
  //ensure btn is active
  document.getElementById("addBtn").disabled = false;

  //get products in store
  let { record } = store.getRecordStore();

  //get last list number
  if (record != undefined && record.length > 0) {
    listNumber = record.reverse()[0].no;
    recordedProduct = record;
    //show list
    updateRecordList(recordedProduct);
    document.getElementById("uploadBtn").disabled = false;
  } else {
    document.getElementById("uploadBtn").disabled = true;
    document.getElementById("tableBody").innerHTML =
      "<div style='padding-top: 20px; padding-left: 20px'>No existing record</div>";
  }
};

const generateProductId = e => {
  e.preventDefault();
  let csNum = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
  let val = "";
  for (let i = 0; i < 3; i++) {
    let num;
    num = Math.floor(Math.random() * 10);
    val += csNum[num];
    val += Math.floor(Math.random() * 10);
  }

  document.getElementById("productId").value = val;
};

const add = currentProduct => {
  let tbody = document.getElementById("tableBody");
  loadStoreContent();
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
    document.getElementById("addBtn").disabled = true;

    add.classList.add("hide");
  } else {
    document.getElementById("addBtn").disabled = false;
    add.classList.remove("hide");
    //reset form
    document.getElementsByClassName("stockingForm")[0].reset();
  }

  let otherBtn = document.getElementsByClassName("editBtnBox")[0];
  if (!otherBtn.classList.contains("hide")) {
    otherBtn.classList.add("hide");
  } else {
    otherBtn.classList.remove("hide");
  }

  document.getElementById("productId").focus();
};

const editRecord = e => {
  let id = e.target.dataset.id;
  let editBtn = document.getElementsByClassName("editBtnBox")[0];
  //get values
  let [product] = stockModel.getProduct(recordedProduct, id);
  //append them to the dom
  addToDom(product);
  //swap buttons
  if (editBtn.classList.contains("hide")) {
    swapBtn();
  }
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

  //remove from storage
  recordedProduct = stockModel.deleteProduct(recordedProduct, id);

  //set store
  store.setRecordStore(recordedProduct);
  //reload list
  loadStoreContent();
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
  let uploadBtn = document.getElementById("uploadBtn");

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
  } else if (stockModel.notNumeric(id)) {
    showModal("Product Id should contain only numbers ");
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

    //// store i electron
    store.setRecordStore(recordedProduct);
    //get last input
    let currentProduct = stockModel.getLastProduct(recordedProduct);
    //append to list
    add(currentProduct);

    if (uploadBtn.disabled == true) {
      uploadBtn.disabled = false;
    }
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
  } else if (stockModel.notNumeric(id)) {
    showModal("Product Id should contain only number ");
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

//cancel all record
const cancelAllRecord = e => {
  //get window object
  const window = BrowserWindow.getFocusedWindow();
  //show dialog
  let resp = dialog.showMessageBox(window, {
    title: "Vemon",
    buttons: ["Yes", "Cancel"],
    type: "info",
    message: "Click Ok to delete record"
  });

  //check if response is yes
  resp.then((response, checkboxChecked) => {
    if (response.response == 0) {
      //empty record
      recordedProduct = [];
      //set number to zero
      listNumber = 0;

      //empty store
      store.setRecordStore(recordedProduct);
      //reset form
      document.getElementsByClassName("stockingForm")[0].reset();

      //display record  empty message
      document.getElementById("tableBody").innerHTML =
        "<div style='padding-top: 20px; padding-left: 20px'>No existing record</div>";

      //focus on first field
      document.getElementById("productId").focus();
      //display button
      document.getElementById("uploadBtn").disabled = true;
    }
  });
};

//upload listNumber
const uploadList = e => {
  recordedProduct.forEach(product => {
    //get id for database task
    let idGen = stockModel.generateId();
    idGen.then(ids => {
      let id = ids[0];

      //upload
      let detailInsertion = stockModel.uploadList(product, id);
      detailInsertion.then(
        ({ data, headers, status }) => {
          if (status == 201) {
            //reload list
            removeRecord(product.productId);

            //rest form
            document.getElementsByClassName("stockingForm")[0].reset();
          } else {
            console.log("error");
          }
        },
        err => {
          console.log(err);
        }
      );
    });
  });
};

//fill up input
const fillUp = e => {
  let id = e.target;
  if (stockModel.idExists(stock, id)) {
    //get match
    let match = stockModel.getMatch(stock, id.value.trim());
    let matchFocus = match[0];
    document.getElementById("productName").value = matchFocus.value.name;
    document.getElementById("productBrand").value = matchFocus.value.brand;
    document.getElementById("unit").value = matchFocus.value.unit;
    document.getElementById("form").value = matchFocus.value.form;
    document.getElementById("price").value = matchFocus.value.price;
  }
};

/*====================
all stocks handler
===================*/

//display all stock
const handleAllStockDisplay = () => {
  //sort stock
  let sortedStock = stockModel.sortStock(stock);

  //display all stock
  displayAllStock(sortedStock);
};

// fetch all stock
const fetchAllStock = stockViewType => {
  let getStock = stockModel.getStock();
  getStock.then(({ data, header, status }) => {
    stock = data.rows;
    switch (stockViewType) {
      case "allStock":
        handleAllStockDisplay();
        break;

      default:
        break;
    }
  });
};
