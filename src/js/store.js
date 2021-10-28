const store = require("electron-store");

class Store {
  constructor() {
    //declare schema
    const schema = {
      loginDetails: {
        type: "object"
      },
      recordedProducts: {
        type: "object"
      },
      records: {
        type: "object"
      },

      setupDetail: {
        type: "object"
      },
      tokens: {
        type: "object"
      },
      syncState: {
        type: "object"
      }
    };
    //instantiate store
    this.store = new store({ schema });
  }

  forceLogout() {
    this.store.set("loginDetails", {
      loginStatus: false
    });
  }

  getSetupDetail() {
    return this.store.get("setupDetail");
  }

  getLoginDetail() {
    return this.store.get("loginDetails");
  }

  getRecordStore() {
    return this.store.get("recordedProducts");
  }

  getSaleStore() {
    return this.store.get("records");
  }

  getEditDetail() {
    return this.store.get("editDetail");
  }

  getTokens() {
    return this.store.get("tokens");
  }

  getSyncState() {
    return this.store.get("syncState");
  }

  setEditDetail(editDetail) {
    this.store.set("editDetail", {
      detail: editDetail
    });
  }

  setUserData(user) {
    this.store.set("loginDetails", {
      loginStatus: true,
      fname: user.fname,
      lname: user.lname,
      email: user.email,
      staffId: user.staffId,
      position: user.position,
      permission: user.permission,
      image: user.image,
      access: user.access,
      docId: user.id,
      pwd: user.pwd
    });

    return true;
  }

  setSetupDetail(detail) {
    this.store.set("setupDetail", {
      detail: detail
    });
  }

  setRecordStore(recordedProduct) {
    this.store.set("recordedProducts", {
      record: recordedProduct
    });
  }

  setSaleStore(record) {
    this.store.set("records", {
      record: record
    });
  }

  setSyncState(state) {
    this.store.set("syncState", {
      state
    });
  }
  setTokens(access, refresh) {
    this.store.set("tokens", {
      access,
      refresh
    });
  }
}

module.exports = Store;
