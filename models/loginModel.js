/* eslint-disable no-unused-vars */
//import db file

class Login {
 

  getUsers() {
    let viewUrl = this.viewUrl.users;
    return this.couch.get("users", viewUrl);
  }

  filterUsers(users, email, pwd) {
    let match = users.filter(user => {
      return (
        user.email == email.value.trim() &&
        user.password == pwd.value.trim()
      );
    });

    if (match.length > 0) {
      return true;
    }
  }

  checkAccess(users, email) {
    let match = users.filter(user => {
      return (
        user.email == email.value.trim() &&
        user.access == "open" &&
        user.permission.toUpperCase() !== "MEMBER"
      );
    });

    if (match.length > 0) {
      return true;
    }
  }

  getUserData(users, email) {
    let match = users.filter(user => {
      return user.email == email.value.trim();
    });

    let [userObj] = match;
    return userObj;
  }
}

module.exports = Login;
