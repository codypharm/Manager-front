const usersClass = require("./users");
const stockClass = require("./stock");
const ourStore = require("../src/js/store");

//instantiate classes

const store = new ourStore();

const users = new usersClass();
const stock = new stockClass();

const proceedToActivities = () => {
  console.log("m=next");
};

//proceed to uploading
const proceedToStock = () => {
  stock.handleStock(proceedToActivities);
};

//proceed after login
const proceed = () => {
  users.handleUsers(proceedToStock);
};
//login current user to server
const login = users.loginRemote(proceed);
