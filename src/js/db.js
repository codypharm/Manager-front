const couchDb = require("node-couchdb");

class Database {
  constructor() {
    this.couch = new couchDb({
      auth: {
        user: "admin",
        password: "12345"
      }
    });
  }

  listDb() {
    return this.couch.listDatabases();
  }

  getSetup() {
    return this.couch.get("setup", "5104c098383648923e6fcbc81c004f37").then(
      // eslint-disable-next-line no-unused-vars
      ({ data, headers, status }) => {
        return data.status;
      },
      err => console.warn(err)
    );
  }

  // eslint-disable-next-line no-unused-vars
  getRev(db, id) {
    return this.couch.get(db, id).then(
      // eslint-disable-next-line no-unused-vars
      ({ data, headers, status }) => {
        return data._rev;
      },
      err => console.warn(err)
    );
  }

  SetStandardAcct(company, address, companyId) {
    let rev = this.getRev("setup", "5104c098383648923e6fcbc81c004f37");

    this.couch
      .update("setup", {
        _id: "5104c098383648923e6fcbc81c004f37",
        _rev: rev,
        company_name: company,
        branch_Address: address,
        branch_id: companyId
      })
      .then(
        ({ data, headers, status }) => {
          return status;
        },
        err => {
          console.warn(err);
        }
      );
  }
}

module.exports = Database;
