/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
//import db file
const moment = require("moment");

class stockModel {
  

  async getStock() {
    let {rows} = await stockDb.allDocs()
    let stock = await generateWorkingList(stockDb, rows)
    return stock;
  }

  async getStocking() {
    let {rows} = await stockingDb.allDocs()
    let stocking = await generateWorkingList(stockingDb, rows)
    return stocking;
  }

  async getActivities() {
    let {rows} = await activitiesDb.allDocs()
    let activities = await generateWorkingList(activitiesDb, rows)
    return activities;
  }

  isEmpty(inputs) {
    //filter input
    let emptyInputs = inputs.filter(element => {
      return element.value.trim().length < 1;
    });

    //if any input is empty
    if (emptyInputs.length > 0) {
      return true;
    }
  }

  idExists(stock, id) {
    let match = stock.filter(product => {
      return product.productId == id.value.trim();
    });

    if (match.length > 0) {
      
      return true;
    }
  }

  noNameMatch(stock, id, name) {
    let match = stock.filter(product => {
      return (
        product.productId == id.value.trim() &&
        product.name.toUpperCase() != name.value.trim().toUpperCase()
      );
    });

    if (match.length > 0) {
      return true;
    }
  }

  noNameEditMatch(stock, id, name) {
    let match = stock.filter(product => {
      return (
        product.productId != id &&
        product.name.toUpperCase() == name.value.trim().toUpperCase()
      );
    });

    if (match.length > 0) {
      return true;
    }
  }
  nameError(stock, id, name) {
    let match = stock.filter(product => {
      return (
        product.productId != id.value.trim() &&
        product.name.toUpperCase() == name.value.trim().toUpperCase()
      );
    });

    if (match.length > 0) {
      
      return true;
    }
  }

  noBrandMatch(stock, id, brand) {
    let match = stock.filter(product => {
      return (
        product.productId == id.value.trim() &&
        product.brand.toUpperCase() != brand.value.trim().toUpperCase()
      );
    });

    if (match.length > 0) {
      return true;
    }
  }

  noFormMatch(stock, id, form) {
    let match = stock.filter(product => {
      return (
        product.productId == id.value.trim() &&
        product.form.toUpperCase() != form.value.trim().toUpperCase()
      );
    });

    if (match.length > 0) {
      return true;
    }
  }

  expError(stock, id, date) {
    let match = stock.filter(product => {
      return (
        product.productId == id.value.trim() &&
        product.expDate != "" &&
        date.value.trim() == ""
      );
    });

    if (match.length > 0) {
      return true;
    }
  }

  notNumeric(id) {
    let regex = /^[0-9]+$/i;
    if (!regex.test(id.value.trim())) {
      return true;
    }
  }

  unitError(stock, id, unit) {
    let match = stock.filter(product => {
      return (
        product.productId == id.value.trim() &&
        product.unit != unit.value.trim()
      );
    });

    if (match.length > 0) {
      return true;
    }
  }

  priceError(stock, id, unit) {
    let match = stock.filter(product => {
      return (
        product.prodId == id.value.trim() &&
        product.price != price.value.trim()
      );
    });

    if (match.length > 0) {
      return true;
    }
  }

  getStockMatch(stock, id) {
    let match = stock.filter(product => {
      return product.prodId == id.trim();
    });

    return match;
  }

  getStockingMatch(stocking, id) {
    let match = stocking.filter(product => {
      return product.productId == id.trim();
    });

    return match;
  }

  productInList(recordedProduct, name, productId) {
    let match = recordedProduct.filter(product => {
      return (
        product.productId == productId.value.trim() ||
        product.name.toUpperCase() == name.value.trim().toUpperCase()
      );
    });

    if (match.length > 0) {
      return true;
    }
  }

  productInEditList(recordedProduct, name, productId, no) {
    let match = recordedProduct.filter(product => {
      return (
        (product.productId == productId.value.trim() ||
          product.name.toUpperCase() == name.value.trim().toUpperCase()) &&
        product.no != no
      );
    });

    if (match.length > 0) {
      return true;
    }
  }

  deleteProduct(recordedProduct, id) {
    
    let match = recordedProduct.filter(product => {
      return product.productId != id;
    });
    if (match.length > 0) {
      return match;
    }else{
      return []
    }
  }

  getProduct(recordedProduct, id) {
    let match = recordedProduct.filter(product => {
      return product.productId == id;
    });

    if (match.length > 0) {
      return match;
    }
  }

  getMatch(stock, id) {
    let match = stock.filter(product => {
      return product.productId == id;
    });

    if (match.length > 0) {
      return match;
    } else {
      return false;
    }
  }

  updateRecord(recordedProduct, detail, updateTargetNo) {
    recordedProduct.forEach(product => {
      if (product.no == updateTargetNo) {
        product.productId = detail.productId;
        product.name = detail.name;
        product.brand = detail.brand;
        product.expDate = detail.expDate;
        product.totalCost = detail.totalCost;
        product.form = detail.form;
        product.unit = detail.unit;
        product.qty = detail.qty;
        product.price = detail.price;
        product.error = detail.error;
      }
    });
    store.setRecordStore(recordedProduct);
    return recordedProduct;
  }

  getLastProduct(recordedProduct, n) {
    if (recordedProduct == null) return void 0;
    if (n == null) return recordedProduct[recordedProduct.length - 1];
    return recordedProduct.slice(Math.max(recordedProduct.length - n, 0));
  }

  generateId() {
    return this.couch.uniqid();
  }

  generateMultipleId(allMatch) {
    
    for (let i = 0; i < allMatch.length; i++) {
      let n = i+1
      let time = + new Date() 
      allMatch[i]._id = `${time + n}a`
      
    }
    return allMatch
  }

 async insertStocking(product,  qty) {
    return stockingDb.put({
      _id: `${+ new Date()}`,
      productId: product.productId,
      qty
    });
  }

 async uploadList(product) {
    let batchId = "BT";
    batchId += Math.floor(Math.random() * 10000000);
    let loginDetail = store.getLoginDetail();
    let date = new Date();

    //define error
    let error;

    if (product.error != "") {
      error = product.error[0].toUpperCase() + product.error.slice(1);
    } else {
      error = "";
    }
    return stockDb.put({
      _id: product._id,
      name: product.name[0].toUpperCase() + product.name.slice(1),
      productId: product.productId,
      brand: product.brand[0].toUpperCase() + product.brand.slice(1),
      expDate: product.expDate,
      totalCost: product.totalCost,
      qty: product.qty,
      unit: product.unit,
      form: product.form[0].toUpperCase() + product.form.slice(1),
      price: product.price,
      pricePerMinUnit:
        (Number(product.totalCost) * Number(product.unit)) /
        Number(product.qty),
      error: error,
      batchId: batchId,
      remote: false,
      day: date.getDate(),
      month: date.getMonth() + 1,
      year: date.getFullYear(),
      recorder: loginDetail.fname + " " + loginDetail.lname,
      recorderEmail: loginDetail.email
    });
  }

  checkSortedArray(sortedArray, product) {
    
    let match = sortedArray.filter(item => {
      return item.productId == product.productId;
    });
    if (match.length > 0) {
      return true;
    } else {
      return false;
    }
  }

  sortStock(stock) {
    
    let sortedArray = [];

    //loop through stock
    stock.forEach(product => {
      //loop through sorted array

      if (sortedArray.length > 0) {
        //check if in array
        sortedArray.forEach(item => {
          
          //if match is found
          if (item.productId == product.productId) {
            //add up
            item.qty = Number(item.qty) + Number(product.qty);
          } else {
            //check if object is already in sorted array
            let condition = this.checkSortedArray(sortedArray, product);
            //check if not in sorted array
            if (!condition) {
              sortedArray.push(product);
            }
          }
        });
      } else {
        sortedArray.push(product);
      }
    });

    return sortedArray;
  }

  getStockingQty(id, stocking) {
    
    let match = stocking.filter(item => {
      return item.productId == id;
    });
    return match[0].qty;
  }

  checkIfDiminished(limit, stockingQty, qty) {
    let value = (Number(limit) / 100) * Number(stockingQty);
    //if less than required percentage
    if (Number(qty) <= value) {
      return true;
    }

    return false;
  }

  diminishingStock(sortedStock, stockLimit, stocking) {
    let match = [];
    sortedStock.forEach(product => {
      //get stocking qty
      let stockingQty = this.getStockingQty(product.productId, stocking);
      //check if diminished
      let diminished = this.checkIfDiminished(
        stockLimit,
        stockingQty,
        product.qty
      );

      if (diminished) match = [...match, product];
    });

    if (match.length > 0) {
      return match;
    } else {
      return false;
    }
  }

  //works with exhausting stock based on stock limit
  getExhaustedStock(stock, stocking) {
    //get sorted stock
    let sortedStock = this.sortStock(stock);
    //get stock limit
    let { detail } = store.getSetupDetail();

    if (detail != undefined) {
      let stockLimit = detail.stock_limit;
      //get stocks that have reached limit
      return this.diminishingStock(sortedStock, stockLimit, stocking);
    }
  }

  calcDate(expDate) {
    let expiration = moment(expDate).format("YYYY-MM-DD");
    let currentDate = moment().format("YYYY-MM-DD");
    let days = moment(expiration).diff(currentDate, "days");
    return days;
  }

  getExpiredStock(stock) {
    //get date limit

    let { detail } = store.getSetupDetail();

    if (detail != undefined) {
      let dateLimit = detail.expiration_limit;
      let selectedStock = stock.filter(item => {
        if (item.expDate != "") {
          return (
            //get stock with date below date limit and is in stock
            this.calcDate(item.expDate) <= dateLimit && item.qty > 0
          );
        }
      });

      if (selectedStock.length > 0) {
        return selectedStock;
      } else {
        return false;
      }
    }
  }

  getMatchForSearch(stock, input) {
    let searchInput = input.toUpperCase();
    let match = stock.filter(item => {
      return (
        item.name.toUpperCase().includes(searchInput) ||
        item.productId.includes(searchInput)
      );
    });

    if (match.length > 0) {
      return match;
    } else {
      return false;
    }
  }

  getMatchForAllStockSearch(stock, input) {
    let searchInput = input.toUpperCase();
    let match = stock.filter(item => {
      return (
        item.name.toUpperCase().includes(searchInput) ||
        item.productId.includes(searchInput)
      );
    });

    if (match.length > 0) {
      return match;
    } else {
      return false;
    }
  }

  getMatchForExhaustedStockSearch(stock, input) {
    let searchInput = input.toUpperCase();
    let match = stock.filter(item => {
      return (
        item.name.toUpperCase().includes(searchInput) ||
        item.productId.includes(searchInput)
      );
    });

    if (match.length > 0) {
      return match;
    } else {
      return false;
    }
  }

  getSelectedStock(stock, id) {
    let match = stock.filter(product => {
      return product.productId == id;
    });

    if (match.length > 0) {
      return match;
    } else {
      return false;
    }
  }

  getBatch(stock, id) {
    let match = stock.filter(product => {
      return product.batchId == id;
    });

    if (match.length > 0) {
      return match;
    } else {
      return false;
    }
  }

  insertUpdate(editClass, edit, batchId) {
    let date = new Date();
    let loginDetail = store.getLoginDetail();
    return activitiesDb.put({
      _id: `${+ new Date()}`,
      day: date.getDate(),
      month: date.getMonth() + 1,
      year: date.getFullYear(),
      activity: editClass,
      detail: edit,
      editedId: batchId,
      remote: false,
      staffName: loginDetail.fname + " " + loginDetail.lname,
      staffId: loginDetail.staffId
    });
  }
  async editUpdateStock(detail, editQty, editExpDate, id) {
    return stockDb.put({
      _id: id,
      _rev: detail._rev,
      batchId: detail.batchId,
      productId: detail.productId,
      brand: detail.brand,
      name: detail.name,
      qty: editQty,
      form: detail.form,
      unit: detail.unit,
      pricePerMinUnit:
        (Number(detail.totalCost) * Number(detail.unit)) / Number(editQty),
      price: detail.price,
      totalCost: detail.totalCost,
      expDate: editExpDate,
      error: detail.error,
      remote: false,
      day: detail.day,
      month: detail.month,
      year: detail.year,
      recorder: detail.recName,
      recorderEmail: detail.recEmail
    });
  }

  async updateStocking(detail, qty) {
    return stockingDb.put({
      _id: detail._id,
      _rev: detail._rev,
      productId: detail.productId,
      qty: qty
    });
  }

  //update current match
 async updateMatch(detail, id, name, form, price, unit, brand) {
    
    return stockDb.put({
      _id: id,
      _rev: detail._rev,
      batchId: detail.batchId,
      productId: detail.productId,
      brand: brand[0].toUpperCase() + brand.slice(1),
      name: name[0].toUpperCase() + name.slice(1),
      qty: detail.qty,
      form: form[0].toUpperCase() + form.slice(1),
      unit: unit,
      price: price,
      totalCost: detail.totalCost,
      expDate: detail.expDate,
      pricePerMinUnit:
        (Number(detail.totalCost) * Number(unit)) / Number(detail.qty),
      error: detail.error,
      remote: false,
      day: detail.day,
      month: detail.month,
      year: detail.year,
      recorder: detail.recName,
      recorderEmail: detail.recEmail
    });
  }

  async updateAllProduct(allMatch, name, form, price, unit, brand) {
    const matchLength = allMatch.length;
    const checker = matchLength - 1;

    //loop through matches

    for (let i = 0; i < matchLength; i++) {
      //wait for update to happen
      await this.updateMatch(
        allMatch[i],
        allMatch[i]._id,
        name,
        form,
        price,
        unit,
        brand
      );
    }
  }

  //update current match
  remoteUpdateMatch(detail, id) {
    return this.couch.update("stock", {
      _id: id,
      _rev: detail.rev,
      batchId: detail.batchId,
      productId: detail.prodId,
      brand: detail.brand[0].toUpperCase() + detail.brand.slice(1),
      name: detail.name[0].toUpperCase() + detail.name.slice(1),
      qty: detail.qty,
      form: detail.form[0].toUpperCase() + detail.form.slice(1),
      unit: detail.unit,
      price: detail.price,
      totalCost: detail.totalCost,
      expDate: detail.expDate,
      pricePerMinUnit: detail.ppmu,
      error: detail.error,
      remote: true,
      day: detail.day,
      month: detail.month,
      year: detail.year,
      recorder: detail.recName,
      recorderEmail: detail.recEmail
    });
  }

  async remoteUpdateAllProduct(allMatch) {
    const matchLength = allMatch.length;
    const checker = matchLength - 1;

    //loop through matches

    for (let i = 0; i < matchLength; i++) {
      //wait for update to happen
      await this.remoteUpdateMatch(allMatch[i].value, allMatch[i].id);
    }
  }

  //update current match
  remoteActivityUpdateMatch(detail, id) {
    return this.couch.update("all_activities", {
      _id: id,
      _rev: detail.rev,
      day: detail.day,
      month: detail.month,
      year: detail.year,
      activity: detail.activity,
      detail: detail.detail,
      remote: true,
      editedId: detail.editedId,
      staffName: detail.staffName,
      staffId: detail.staffId
    });
  }

  async remoteUpdateAllActivities(allMatch) {
    const matchLength = allMatch.length;
    const checker = matchLength - 1;

    //loop through matches

    for (let i = 0; i < matchLength; i++) {
      //wait for update to happen
      await this.remoteActivityUpdateMatch(allMatch[i].value, allMatch[i].id);
    }
  }

  insertProductUpdate(editClass, edit, batchId,id) {
    let date = new Date();
    let loginDetail = store.getLoginDetail();

    return activitiesDb.put( {
      _id: `${+ new Date()}${batchId}`,
      day: date.getDate(),
      month: date.getMonth() + 1,
      year: date.getFullYear(),
      activity: editClass.join(", "),
      detail: edit.join(", "),
      remote: false,
      editedId: batchId,
      staffName: loginDetail.fname + " " + loginDetail.lname,
      staffId: loginDetail.staffId
    });
  }

  async insertAllProductEdit(allMatch, edit, editClass) {
    const matchLength = allMatch.length;
    const checker = matchLength - 1;
    //loop through matches
    for (let i = 0; i < matchLength; i++) {
      //wait for insertion to happen
      await this.insertProductUpdate(
        editClass,
        edit,
        allMatch[i].batchId,
        allMatch[i]._id
      );
    }
  }

  getActivityMatch(activities, batchId) {
    let match = activities.filter(activity => {
      return activity.editedId == batchId;
    });
    if (match.length > 0) {
      return match;
    } else {
      return false;
    }
  }

  getAct(activities, rev) {
    let match = activities.filter(act => {
      return act._rev == rev;
    });
    if (match.length > 0) {
      return match;
    }
  }

  getActivitiesForBatch(activities, batchId) {
    let match = activities.filter(act => {
      return act.editedId == batchId;
    });
    if (match.length > 0) {
      return match;
    } else {
      return match;
    }
  }

  async deleteStock(id, rev) {
    return stockDb.remove(id,rev)
  }

  deleteActivity(id, rev) {
    return activitiesDb.remove( id, rev);
  }

  async deleteActs(allMatch) {
    const matchLength = allMatch.length;
    //loop through matches
    for (let i = 0; i < matchLength; i++) {
      //wait for insertion to happen
      await this.deleteActivity(allMatch[i]._id, allMatch[i]._rev);
    }

    return true;
  }

  async deleteThisProduct(allMatch) {
    const matchLength = allMatch.length;
    //loop through matches
    for (let i = 0; i < matchLength; i++) {
      //wait for insertion to happen
      await this.deleteStock(allMatch[i]._id, allMatch[i]._rev);
    }

    return true;
  }
}

module.exports = stockModel;
