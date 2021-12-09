/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */

var { dialog, BrowserWindow } = remote.require("electron");

//product id generator

//global variable
var stock;
var stocking;
var recordedProduct = [];
var listNumber = 0;
var sortedStock;
var exhaustedStock;

var analysisSelected;
var batchSelected;
var oldEditQty = 0;
var oldEditExpDate = "";
var oldName = "";
var oldForm = "";
var oldPrice = "";
var oldUnit = "";
var oldBrand = "";

//alert

//handle show warning for expenses
const showStockEditError = message => {
  let errorBox = document.getElementById("stockEditWarning");
  if (errorBox.classList.contains("hide")) {
    errorBox.classList.remove("hide");
    document.getElementById("stockEditWarning").textContent = message;
  }
};

//handle hide warning
const hideStockEditError = () => {
  let errorBox = document.getElementById("stockEditWarning");
  if (!errorBox.classList.contains("hide")) {
    errorBox.classList.add("hide");
    document.getElementById("stockEditWarning").textContent = "";
  }
};

//handle show success for expenses
const showStockEditSuccess = message => {
  let sucBox = document.getElementById("stockEditSuccess");
  if (sucBox.classList.contains("hide")) {
    sucBox.classList.remove("hide");
    document.getElementById("stockEditSuccess").textContent = message;
  }
};

//handle hide success
const hideStockEditSuccess = () => {
  let sucBox = document.getElementById("stockEditSuccess");
  if (!sucBox.classList.contains("hide")) {
    sucBox.classList.add("hide");
    document.getElementById("stockEditSuccess").textContent = "";
  }
};

const loadStoreContent = async () => {
 
   stocking = await stockModel.getStocking();
   stock = await stockModel.getStock();
   console.log(stock)

  //ensure btn is active
  document.getElementById("addBtn").disabled = false;
  
  //get products in store
  let record;
  if(store.getRecordStore() != undefined){
   record  = store.getRecordStore().record ? store.getRecordStore().record : store.getRecordStore();
  }else{
    
  record = []
  }
  //get last list number
  if ( record.length > 0) {
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
    title: "Manager-front",
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

const removeRecord =  id => {
  let currid = id;

  //remove from storage
  recordedProduct = stockModel.deleteProduct(recordedProduct, id);

  //set store
  store.setRecordStore(recordedProduct);
  //reload list
    loadStoreContent();
};

const addProduct = e => {
  
  if (recordedProduct == undefined) {
    recordedProduct = [];
  }
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
    _id:`${+ new Date()}`,
    no: listNumber,
    productId: id.value.trim(),
    name: name.value.trim(),
    brand: brand.value.trim(),
    expDate: expDate.value.trim(),
    totalCost: totalCost.value.trim(),
    form: !form.value.trim() ? "N/A" : form.value.trim(),
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

    //// store in electron
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
  if (recordedProduct.length < 1 || recordedProduct == undefined)return
  //get window object
  const window = BrowserWindow.getFocusedWindow();
  //show dialog
  let resp = dialog.showMessageBox(window, {
    title: "Manager-front",
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

const getTotal = match => {
  let total = 0;
  match.forEach(product => {
    total += Number(product.qty);
  });

  return total;
};

//stoking settlement
const settleStocking = async product => {
  let qty = 0;
  let stockMatch = stockModel.getStockMatch(stock, product.productId);
  let stockingMatch = stockModel.getStockingMatch(stocking, product.productId);
  if (stockMatch.length > 0) {
    //get total
    qty = Number(getTotal(stockMatch)) + Number(product.qty);
  } else {
    qty = Number(product.qty);
  }

  //insert or update
  if (stockingMatch.length > 0) {
    //update
    let updateInsertion = await stockModel.updateStocking(stockingMatch[0], qty);
   
          //adjust notification
          notification();
        
     
  } else {
    //insert
    
      let detailInsertion = await stockModel.insertStocking(product,  qty);
     
          
            //adjust notification
            notification();
         
        
   
  }
};

const clearOffList = () => {
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

}

//upload list
const uploadList = async e => {
  showLoading();
  let product;
  console.log(recordedProduct.length)
  for (let i = 0; i < recordedProduct.length; i++) {
     product = recordedProduct[i];
    //upload
    let detailInsertion = await stockModel.uploadList(product);
    
    await  settleStocking(product);
          
  }
    //clear of recorded List
    clearOffList()
  hideLoading();
};

//fill up input
const fillUp = e => {
  let id = e.target;
  if (stockModel.idExists(stock, id)) {
    //get match
    let match = stockModel.getMatch(stock, id.value.trim());
    let matchFocus = match[0];
    
    document.getElementById("productName").value = matchFocus.name;
    document.getElementById("productBrand").value = matchFocus.brand;
    document.getElementById("unit").value = matchFocus.unit;
    document.getElementById("form").value = matchFocus.form;
    document.getElementById("price").value = matchFocus.price;
  }
};

/*====================
all stocks handler
===================*/

//handle all stock
const handleAllStockDisplay = () => {
  //sort stock
  sortedStock = stockModel.sortStock(stock);
  if (sortedStock.length > 0) {
    //display all stock
    displayAllStock(sortedStock);
  } else {
    document.getElementById("allStockList").innerHTML =
      " <tr>" +
      ' <td colspan="7" class="text-center">' +
      "  <span>No record found</span>" +
      " </td>" +
      " </tr>";
  }
};

//handle exhausted stock
const handleExhaustedStockDisplay = async () => {
  let stocking = await stockModel.getStocking();
  
 
      //sort exhausted stock
      exhaustedStock = stockModel.getExhaustedStock(stock, stocking);

      if (exhaustedStock != false) {
        //display all stock
        displayExhaustedStock(exhaustedStock);
      } else {
        document.getElementById("exhaustedStockList").innerHTML =
          " <tr>" +
          ' <td colspan="4" class="text-center">' +
          "  <span>No record found</span>" +
          " </td>" +
          " </tr>";
      }
    
};

//handle expired stocking
const handleExpiredStockDisplay = () => {
  let expiredStock = stockModel.getExpiredStock(stock);

  //display expired stock
  if (expiredStock != false) {
    //display all stock
    displayExpiredStock(expiredStock);
  } else {
    document.getElementById("expiredStockList").innerHTML =
      " <tr>" +
      ' <td colspan="8" class="text-center">' +
      "  <span>No record found</span>" +
      " </td>" +
      " </tr>";
  }
};

// fetch all stock
const fetchAllStock = async stockViewType => {
  showLoading();
  stock = await stockModel.getStock()
  
      switch (stockViewType) {
        case "allStock":
          handleAllStockDisplay();
          break;

        case "exhaustedStock":
          handleExhaustedStockDisplay();
          break;

        case "expiredStock":
          handleExpiredStockDisplay();
          break;

        default:
          break;
      }
      hideLoading();
   
};

//performing search in expired stock
const searchExpiryStock = e => {
  let input = e.target.value.trim();
  //check input length
  if (input.length > 0) {
    //get match
    let expiredStock = stockModel.getExpiredStock(stock);
    //filter matching strings
    searchResult = stockModel.getMatchForSearch(expiredStock, input);
    //display expired stock
    if (searchResult != false) {
      //display all stock
      displayExpiredStock(searchResult);
    } else {
      document.getElementById("expiredStockList").innerHTML =
        " <tr>" +
        ' <td colspan="8" class="text-center">' +
        "  <span>No record found</span>" +
        " </td>" +
        " </tr>";
    }
  } else {
    let expiredStock = stockModel.getExpiredStock(stock);
    //display expired stock
    if (expiredStock != false) {
      //display all stock
      displayExpiredStock(expiredStock);
    } else {
      document.getElementById("expiredStockList").innerHTML =
        " <tr>" +
        ' <td colspan="8" class="text-center">' +
        "  <span>No record found</span>" +
        " </td>" +
        " </tr>";
    }
  }
};

//performing search in all stock
const searchAllStock = e => {
  let input = e.target.value.trim();
  //check input length
  if (input.length > 0) {
    //filter matching strings
    searchResult = stockModel.getMatchForAllStockSearch(sortedStock, input);
    //display expired stock
    if (searchResult != false) {
      //display all stock
      displayAllStock(searchResult);
    } else {
      document.getElementById("allStockList").innerHTML =
        " <tr>" +
        ' <td colspan="7" class="text-center">' +
        "  <span>No record found</span>" +
        " </td>" +
        " </tr>";
    }
  } else {
    if (sortedStock != false) {
      //display all stock
      displayAllStock(sortedStock);
    } else {
      document.getElementById("allStockList").innerHTML =
        " <tr>" +
        ' <td colspan="7" class="text-center">' +
        "  <span>No record found</span>" +
        " </td>" +
        " </tr>";
    }
  }
};

//search exhausted goods
const searchExhaustedStock = e => {
  let input = e.target.value.trim();
  //check input length
  if (input.length > 0) {
    //filter matching strings
    searchResult = stockModel.getMatchForExhaustedStockSearch(
      exhaustedStock,
      input
    );
    //display expired stock
    if (searchResult != false) {
      //display all stock
      displayExhaustedStock(searchResult);
    } else {
      document.getElementById("exhaustedStockList").innerHTML =
        " <tr>" +
        ' <td colspan="4" class="text-center">' +
        "  <span>No record found</span>" +
        " </td>" +
        " </tr>";
    }
  } else {
    if (exhaustedStock != false) {
      //display all stock
      displayExhaustedStock(exhaustedStock);
    } else {
      document.getElementById("exhaustedStockList").innerHTML =
        " <tr>" +
        ' <td colspan="4" class="text-center">' +
        "  <span>No record found</span>" +
        " </td>" +
        " </tr>";
    }
  }
};

//caluclate product qty
const getProductQty = products => {
  let qty = 0;
  products.forEach(product => {
    qty += Number(product.qty);
  });

  return qty;
};

///load stock details page
const showProduct = productId => {
  analysisSelected = productId;
  //load stock analysis page
  pageLoader("stockAnalysis", analyseStock);
};

//return to analysis
const returnToAnalysis = e => {
  //get data set of back button
  let productId = e.target.dataset.productId;
  //return fxn
  showProduct(productId);
};

const analyseTop = selectedStockList => {
  //get product details
  let productDetail = selectedStockList[0];

  //calculate Quantity
  qty = getProductQty(selectedStockList);
  //insert details to DOM
  document.getElementById(
    "analysisStockName"
  ).textContent = `${productDetail.name}`;
  document.getElementById(
    "analysisStockForm"
  ).textContent = `${productDetail.form}`;
  document.getElementById("analysisStockQty").textContent = `${qty}`;
  document.getElementById(
    "analysisStockId"
  ).textContent = `${productDetail.productId}`;
  document.getElementById(
    "analysisStockUnit"
  ).textContent = `${productDetail.unit}`;
  document.getElementById("analysisStockPrice").textContent = ` ₦${formatMoney(
    productDetail.price
  )}`;
  document.getElementById("analysisStockBrand").textContent =
    productDetail.brand;
};

const analyseStock = async () => {
  stock = await stockModel.getStock();
  
      let productId = analysisSelected;

      //get selected product
      let selectedStockList = stockModel.getSelectedStock(stock, productId);

      //handle top section
      analyseTop(selectedStockList);

      //display all batch
      listOutBatches(selectedStockList);
    
};

//show error log
const showErrorLog = (e, batchId) => {
  let id = batchId;
  //show modal
  showGenStaticModal("errorLogContent");

  //get batch
  let batch = stockModel.getBatch(stock, id);
  let detail = batch[0];
  //add to DOM
  document.getElementById("errorBatchId").textContent = detail.batchId;
  if (detail.error == "") {
    document.getElementById("errorContent").textContent = "No error recorded";
  } else {
    document.getElementById("errorContent").textContent = detail.error;
  }
};

const hideErrorForm = () => {
  hideGenStaticModal("errorLogContent");
};

const hideChangesDetail = () => {
  hideGenStaticModal("changesContent");
};
const hideEditForm = () => {
  hideGenStaticModal("batchEditContent");
};

const hideProductEditForm = () => {
  hideGenStaticModal("productEditContent");
};
//edit batch
const editBatch = (e, id) => {
  //show modal
  showGenStaticModal("batchEditContent");

  //get batch
  let batch = stockModel.getBatch(stock, id);
  let detail = batch[0];
  oldEditExpDate = detail.expDate;
  oldEditQty = detail.qty;
  //add to DOM
  document.getElementById("editBatchId").textContent = id;
  document.getElementById("hiddenBatchId").value = id;
  document.getElementById("editQty").value = detail.qty;
  document.getElementById("editExpDate").value = detail.expDate;
};

//submit batch edit form
const submitBatchEdit =async e => {
  e.preventDefault();
  let btn = document.getElementById("btnSpinner");
  btn.classList.add("spinner-border");
  btn.classList.add("spinner-border-sm");
  //get values
  let editQty = document.getElementById("editQty").value;
  if (editQty == "") {
    editQty = 0;
  }
  let editExpDate = document.getElementById("editExpDate").value;
  let batchEdited = document.getElementById("hiddenBatchId").value;
  let edit;
  let editClass;
  //check if any detail was changed
  if (editQty != oldEditQty || editExpDate != oldEditExpDate) {
    //check for what was edited
    if (editQty != oldEditQty && editExpDate != oldEditExpDate) {
      editClass = "Quantity and Expiration change";
      edit = `Quantity was changed from ${oldEditQty} to ${editQty} and Expiry date was changed from ${oldEditExpDate} to ${editExpDate}`;
    } else if (editQty != oldEditQty) {
      editClass = "Quantity change";
      edit = `Quantity was changed from ${oldEditQty} to ${editQty}`;
    } else if (
      editExpDate != oldEditExpDate &&
      editExpDate != "" &&
      oldEditExpDate != ""
    ) {
      editClass = "Expiration change";
      edit = `Expiry date was changed from ${oldEditExpDate} to ${editExpDate}`;
    } else if (
      editExpDate != oldEditExpDate &&
      oldEditExpDate != "" &&
      editExpDate == ""
    ) {
      editClass = "Expiration change";
      edit = `Expiry date was removed `;
    } else if (
      editExpDate != oldEditExpDate &&
      oldEditExpDate == "" &&
      editExpDate != ""
    ) {
      editClass = "Expiration change";
      edit = `Expiry date is set to ${editExpDate}`;
    }
    //get batch
    let batch = stockModel.getBatch(stock, batchEdited);
    let updateId = batch[0]._id;
    let detail = batch[0];

    //record activity
      let stockUpdateInsert = await stockModel.insertUpdate(
        editClass,
        edit,
        detail.batchId
      );
     
          
            //update stockingForm
            let editUpdate = await stockModel.editUpdateStock(
              detail,
              editQty,
              editExpDate,
              updateId
            );

           
                  //get stock
                  stock = await stockModel.getStock();
                

                      //get selected product
                      let selectedStockList = stockModel.getSelectedStock(
                        stock,
                        detail.productId
                      );
                      //handle top section
                      analyseTop(selectedStockList);

                      //display all batch
                      listOutBatches(selectedStockList);

                      //remove spinner
                      btn.classList.remove("spinner-border");
                      btn.classList.remove("spinner-border-sm");

                      //adjust notification
                      notification();

                      //hide modal
                      hideGenStaticModal("batchEditContent");
                   
                
          
        
    
  } else {
    //remove spinner
    //remove spinner
    btn.classList.remove("spinner-border");
    btn.classList.remove("spinner-border-sm");

    //hide modal
    hideGenStaticModal("batchEditContent");
  }
};

//show form for general product editing
const showAnalysisEditForm = async e => {
  //hide error messages
  hideStockEditSuccess();
  hideStockEditError();
  //show form
  showGenStaticModal("productEditContent");
  let id = analysisSelected;

  //get stock
  stock = await stockModel.getStock();
  

      //get selected stock
      let selectedStock = stockModel.getSelectedStock(stock, id);
      if (selectedStock != false) {
        let detail = selectedStock[0];

        //insert to DOM
        document.getElementById("editAnalysisName").value = detail.name;
        document.getElementById("editAnalysisForm").value = detail.form;
        document.getElementById("editAnalysisUnit").value = detail.unit;
        document.getElementById("editAnalysisPrice").value = detail.price;
        document.getElementById("editAnalysisBrand").value = detail.brand;

        //get values
        oldForm = detail.form;
        oldUnit = detail.unit;
        oldPrice = detail.price;
        oldName = detail.name;
        oldBrand = detail.brand;
      }
    
};

//submit product edit
const submitProductEdit = async e => {
  e.preventDefault();
  let btn = document.getElementById("btnProductEditSpinner");
  btn.classList.add("spinner-border");
  btn.classList.add("spinner-border-sm");
  let id = analysisSelected;

  //hide error messages
  hideStockEditSuccess();
  hideStockEditError();
  let edit = [];
  //get values
  let name = document.getElementById("editAnalysisName");
  let form = document.getElementById("editAnalysisForm");
  let unit = document.getElementById("editAnalysisUnit");
  let price = document.getElementById("editAnalysisPrice");
  let brand = document.getElementById("editAnalysisBrand");
  let editClass = [];

  let inputs = [name, form, unit, price, brand];

  if (stockModel.isEmpty(inputs)) {
    showStockEditError("please fill all fields");
    btn.classList.remove("spinner-border");
    btn.classList.remove("spinner-border-sm");
  } else if (unit.value < 0 || unit.value == 0) {
    showStockEditError("enter a valid unit");
    btn.classList.remove("spinner-border");
    btn.classList.remove("spinner-border-sm");
  } else if (price.value < 0 || price.value == 0) {
    showStockEditError("enter a valid price");
    btn.classList.remove("spinner-border");
    btn.classList.remove("spinner-border-sm");
  } else if (stockModel.noNameEditMatch(stock, id, name)) {
    showStockEditError("the name entered belongs to another product");
    btn.classList.remove("spinner-border");
    btn.classList.remove("spinner-border-sm");
  } else {
    //record the changes made
    if (oldName.toUpperCase() != name.value.trim().toUpperCase()) {
      editClass.push("Name change");
      edit.push(`product name was changed from ${oldName} to ${name.value}`);
    }
    if (oldForm.toUpperCase() != form.value.trim().toUpperCase()) {
      editClass.push("Form change");
      edit.push(`product form was changed from ${oldForm} to ${form.value}`);
    }

    if (oldPrice != price.value.trim()) {
      editClass.push("Price change");
      edit.push(`product price was changed from ${oldPrice} to ${price.value}`);
    }

    if (oldUnit != unit.value.trim()) {
      editClass.push("Unit change");
      edit.push(`product unit was changed from ${oldUnit} to ${unit.value}`);
    }

    if (oldBrand != brand.value.trim()) {
      editClass.push("Brand change");
      edit.push(`product brand was changed from ${oldBrand} to ${brand.value}`);
    }

    //get all stock with this id

    let allMatch = stockModel.getMatch(stock, id);
    
    //check if any editing was done
    if (edit.length > 0) {
    
      
        //insert into activities for all matching stock
      let actsIns = await stockModel.insertAllProductEdit(allMatch, edit, editClass)
          //update details
          
        await  stockModel.updateAllProduct(
                allMatch,
                name.value.trim(),
                form.value.trim(),
                price.value,
                unit.value,
                brand.value
              )
                  //hide loading sign
                  btn.classList.remove("spinner-border");
                  btn.classList.remove("spinner-border-sm");
                  //get stock
                  stock = await stockModel.getStock();
                  

                      //get selected product
                      let selectedStockList = stockModel.getSelectedStock(
                        stock,
                        id
                      );
                      //handle top section
                      analyseTop(selectedStockList);

                      //display all batch
                      listOutBatches(selectedStockList);

                      edit = [];
                      editClass = [];
                      // remove modal
                      hideGenStaticModal("productEditContent");
                   
               
          
      
    } else {
      //hide loading sign
      btn.classList.remove("spinner-border");
      btn.classList.remove("spinner-border-sm");
      hideGenStaticModal("productEditContent");
    }
  }
};

//stock checking with id
const checkStock = async () => {
  document.getElementById("idBackBtn").dataset.productId = analysisSelected;
  //add batch id
  document.getElementById("stockCheckId").textContent = batchSelected;
  //get activities
  let activities = await stockModel.getActivities();
  

      //filter out matches
      let list = stockModel.getActivityMatch(activities, batchSelected);
      if (list != false) {
        //list changes
        displayStockChanges(list);
      } else {
        document.getElementById("stockChangesList").innerHTML =
          " <tr>" +
          ' <td colspan="5" class="text-center">' +
          "  <span>No record found</span>" +
          " </td>" +
          " </tr>";
      }
   
};

//check batch analysis
const checkBatch = batchId => {
  batchSelected = batchId;

  //load stock analysis page
  pageLoader("allActivities", checkStock);
};

//view Changes
const viewChanges = async (e, rev) => {
  //get activities
  let activities = await stockModel.getActivities();
 
      //get a particular activity
      let act = stockModel.getAct(activities, rev)[0];

      //show modal
      showGenStaticModal("changesContent");
      //add to DOM
      document.getElementById("changesBatchId").textContent =
        act.editedId;
      document.getElementById("changesText").textContent = act.detail;
   
};

//delete batch from activities
const deleteFromActivities =async (batchId, btn) => {
  //add spinner
  btn.innerHTML =
    '<span class="spinner-border spinner-border-sm"></span> Delete';
  //get activities
  let acts = await stockModel.getActivities();
  
      //get matching actvities
      let selectedActs = stockModel.getActivityMatch(acts, batchId);
      //delete
      let deleted = stockModel.deleteActs(selectedActs);

      
          //get stock
          stock = await stockModel.getStock();
          
              //check if stock remains
              let remainingStock = stockModel.getMatch(stock, analysisSelected);
              if (remainingStock != false) {
                //get selected product
                let selectedStockList = stockModel.getSelectedStock(
                  stock,
                  analysisSelected
                );

                //handle top section
                analyseTop(selectedStockList);

                //display all batch
                listOutBatches(selectedStockList);
              } else {
                // go back
                loadAllStock();
              }
            hideLoading()
       
   
};

//delete batch
const deleteBatch = (e, batchId) => {
  batchSelected = batchId;
  let btn = e.target;

  //get window object
  const window = BrowserWindow.getFocusedWindow();
  //show dialog
  let resp = dialog.showMessageBox(window, {
    title: "Manager-front",
    buttons: ["Yes", "Cancel"],
    type: "info",
    message: "Click Ok to delete this batch and anything related to it"
  });

  //check if response is yes
  resp.then(async (response, checkboxChecked) => {
    if (response.response == 0) {
      showLoading();
      //get stock
      stock = await stockModel.getStock();
      
          //get the particular stock
          let batch = stockModel.getBatch(stock, batchId)[0];
          let id = batch._id;
          let details = batch;
          //delete stock
          let stockDeleter = await stockModel.deleteStock(id, details._rev);
         
              //delete batch from activities
              deleteFromActivities(batchId, btn);

              //adjust notification
              notification();
            
       
    }
  });
};

//delete activities for the stock
const deleteProductActs = async (btn, batches) => {
  //get activities
  let activities = await stockModel.getActivities();
  
      let acts;
      //loop through products
      for (const batch of batches) {
        acts = stockModel.getActivitiesForBatch(
          activities,
          batch.batchId
        );

        if (acts.length > 0) {
          let actsDeleter = stockModel.deleteActs(acts);
        }
      }

      //remove spinner
      btn.innerHTML = "Delete Product";
      //go back
      pageLoader("allStock", fetchAllStock);
    
};

//continue stock delete
const proceedStockDelete =async btn => {
  let id = analysisSelected;
  //show spinner
  btn.innerHTML =
    '<span class="spinner-border spinner-border-sm"></span> Delete Product';

  //get stock
  stock = await stockModel.getStock();
  
      let thisStock = stockModel.getMatch(stock, id);
      let deleteStock = await stockModel.deleteThisProduct(thisStock);
      
          //delete activities
          deleteProductActs(btn, thisStock);

          //adjust notification
          notification();

          hideLoading();
       
    
};

//delete product
const deleteProduct = e => {
  let btn = e.target;
  //get window object
  const window = BrowserWindow.getFocusedWindow();
  //show dialog
  let resp = dialog.showMessageBox(window, {
    title: "Manager-front",
    buttons: ["Yes", "Cancel"],
    type: "info",
    message: "Click Ok to delete this product and all attachments to it"
  });

  //check if response is yes
  resp.then((response, checkboxChecked) => {
    if (response.response == 0) {
      showLoading();
      proceedStockDelete(btn);
    }
  });
};

//delete expired Batch

//delete batch
const deleteExpiredBatch =  (e, batchId) => {
  batchSelected = batchId;
  let btn = e.target;

  //get window object
  const window = BrowserWindow.getFocusedWindow();
  //show dialog
  let resp = dialog.showMessageBox(window, {
    title: "Manager-front",
    buttons: ["Yes", "Cancel"],
    type: "info",
    message: "Click Ok to delete this batch and anything related to it"
  });

  //check if response is yes
  resp.then(async (response, checkboxChecked) => {
    if (response.response == 0) {
      showLoading();
      //get stock
      stock = await stockModel.getStock();
      

          //get the particular stock
          let batch = stockModel.getBatch(stock, batchId)[0];
          let id = batch._id;
          let details = batch;
          //delete stock
          let stockDeleter = await stockModel.deleteStock(id, details._rev);
          
              //adjust notification
              notification();
              hideLoading();
              //deleteFromActivities(batchId, btn);
              fetchAllStock("expiredStock");
           
        
    }
  });
};
