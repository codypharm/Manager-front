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
  }

  forceLogout() {
    this.store.set("loginDetails", {
      loginStatus: false
    });
  }

  getLoginDetail() {
    return this.store.get("loginDetails");
  }
  setUserData(user) {
    this.store.set("loginDetails", {
      loginStatus: true,
      fname: user.fname,
      lname: user.lname,
      email: user.email,
      position: user.position,
      access: user.access,
      docId: user.id
    });

    return true;
  }
}

module.exports = Store;
