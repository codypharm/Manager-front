const store = require("electron-store");

class Store {
  constructor() {
    //declare schema
    const schema = {
      loginDetails: {
        type: "object"
      }
    };
    //instantiate store
    this.store = new store({ schema });
    this.store.set("loginDetails", {
      loginStatus: false
    });
  }

  getLoginDetail() {
    return this.store.get("loginDetails");
  }
}

module.exports = Store;
