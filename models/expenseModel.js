/* eslint-disable no-unused-vars */
//import db file

class Expense  {
  
  async getExpenses(){
    let {rows} = await expensesDb.allDocs()
    let expenses = await generateWorkingList(expensesDb,rows)
    return expenses
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

 async insertExpense(amt, description, name) {
    let date = new Date();
   return expensesDb.put({
      _id: `${+ new Date()}`,
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
        expense.day == day &&
        expense.month == month &&
        expense.year == year
      );
    });

    if (match.length > 0) {
      return match;
    } else {
      return false;
    }
  }

  async insertExpAct( edit, editClass) {
    let date = new Date();
    // eslint-disable-next-line no-undef
    let loginDetail = store.getLoginDetail();

    return activitiesDb.put({
      _id: `${+ new Date()}`,
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
    
      let editClass = "Expense delete";
      let edit = `Expense of amount ${amt} was deleted`;
      let activityInsert = await this.insertExpAct( edit, editClass);
      
    
    //delete from db
    return expensesDb.remove(id, rev);
  }

  removeExpense(expenses, id) {
    //filter out expenses
    let match = expenses.filter(expense => {
      return expense._id != id;
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

 /* async deleteAll (list) {
    return expensesDb.bulkDocs(list)
  }*/
}

module.exports = Expense;
