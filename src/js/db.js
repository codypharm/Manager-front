const couchDb = require("node-couchdb");

class Database {
  constructor() {
    this.couch = new couchDb({
      auth: {
        user: "admin",
        password: "12345"
      }
    });

    this.viewUrl = {
      users: "_design/all_users/_view/users",
      stock: "_design/all_stock/_view/allStock",
      setup: "_design/setup/_view/setup",
      sales: "_design/sales/_view/sales",
      invoices: "_design/invoices/_view/invoices",
      allClearance: "_design/allClearance/_view/allClearance"
    };
  }

  listDb() {
    return this.couch.listDatabases();
  }
}

module.exports = Database;
