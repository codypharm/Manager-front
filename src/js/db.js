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
      users: "_design/all_users/_view/users"
    };
  }

  listDb() {
    return this.couch.listDatabases();
  }
}

module.exports = Database;
