/* eslint-disable no-unused-vars */
//import db file

class Expense  {
  

  generateId() {
    return this.couch.uniqid();
  }

  getExpenses() {
    let viewUrl = this.viewUrl.expenses;
    return this.couch.get("expenses", viewUrl);
  }

  isEmpty(inputs) {
    let match = inputs.filter(input => {
      return input.length < 1;
    });
    if (match.length > 0) {
      return true;
    }
  }

  isNotNumb(value) {
    let numb = /[0-9]/;
    if (!numb.test(value) || value < 1) {
      return true;
    }
  }

  notAlpha(name) {
    let reg = /^[a-zA-Z\s]+$/;
    if (!reg.test(name)) {
      return true;
    }
  }

  notExist(staffId, users) {
    let match = users.filter(user => {
      return user.value.staffId == staffId;
    });

    if (!match.length > 0) {
      return true;
    }
  }

  insertExpense(id, amt, description, name) {
    let date = new Date();
    return this.couch.insert("expenses", {
      id: id,
      name: name[0].toUpperCase() + name.slice(1),
      amt: amt,
      description: description[0].toUpperCase() + description.slice(1),
      remote: false,
      day: date.getDate(),
      month: date.getMonth() + 1,
      year: date.getFullYear()
    });
  }

  matchExpense(expenses, day, month, year) {
    let match = expenses.filter(expense => {
      return (
        expense.value.day == day &&
        expense.value.month == month &&
        expense.value.year == year
      );
    });

    if (match.length > 0) {
      return match;
    } else {
      return false;
    }
  }

  insertExpAct(id, edit, editClass) {
    let date = new Date();
    // eslint-disable-next-line no-undef
    let loginDetail = store.getLoginDetail();

    return this.couch.insert("all_activities", {
      id: id,
      day: date.getDate(),
      month: date.getMonth() + 1,
      year: date.getFullYear(),
      activity: editClass,
      detail: edit,
      remote: false,
      staffName: loginDetail.fname + " " + loginDetail.lname,
      staffId: loginDetail.staffId
    });
  }

  async deleteExpense(id, rev, amt, description) {
    //insert into activities
    let idGen = this.generateId();
    idGen.then(ids => {
      let newId = ids[0];
      let editClass = "Expense delete";
      let edit = `Expense of amount ${amt} was deleted`;
      let activityInsert = this.insertExpAct(newId, edit, editClass);
      /*activityInsert.then(({data,headers,status}) => {
        if(status == 201){

        }
      })*/
    });
    //delete from db
    return this.couch.del("expenses", id, rev);
  }

  removeExpense(expenses, id) {
    //filter out expenses
    let match = expenses.filter(expense => {
      return expense.id != id;
    });

    if (match.length > 0) {
      return match;
    } else {
      return [];
    }
  }

  //update current match
  remoteExpenseUpdateMatch(detail, id) {
    return this.couch.update("expenses", {
      _id: id,
      _rev: detail.rev,
      amt: detail.amt,
      day: detail.day,
      description: detail.description,
      month: detail.month,
      name: detail.name,
      remote: true,
      year: detail.year
    });
  }

  async remoteUpdateAllExpenses(allMatch) {
    const matchLength = allMatch.length;
    const checker = matchLength - 1;

    //loop through matches
    for (let i = 0; i < matchLength; i++) {
      //wait for update to happen
      await this.remoteExpenseUpdateMatch(allMatch[i].value, allMatch[i].id);
    }
  }
}

module.exports = Expense;
