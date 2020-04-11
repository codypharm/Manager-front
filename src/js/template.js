/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */

//view list display
const displayStaff = data => {
  //get current staff details from store
  let {
    loginStatus,
    fname,
    lname,
    email,
    position,
    image,
    access,
    docId
  } = store.getLoginDetail();

  //display current user details first
  $(".currentStaffName").append(fname + " " + lname);
  $(".currentStaffPosition").append(position);
  $("#currentStaffView").attr("data-staffEmail", email);
  $("#currentStaffEdit").attr("data-staffEmail", email);

  //filter current user out
  let otherUsers = staffModel.filterOutUser(data, email);
  let newObj = {
    data: otherUsers
  };

  Handlebars.registerHelper("accountStatus", access => {
    if (access == "open") {
      return "block";
    } else {
      return "activate";
    }
  });

  let template = document.getElementById("listTemplateContainer").innerHTML;
  let compiledData = Handlebars.compile(template);

  let myhtml = compiledData(newObj);

  let container = (document.getElementById("otherUsers").innerHTML = myhtml);
};

//update record list
const updateRecordList = recordedProduct => {
  let newObj = {
    data: recordedProduct
  };

  let template = document.getElementById("recordTemplateContainer").innerHTML;
  let compiledData = Handlebars.compile(template);

  let myhtml = compiledData(newObj);

  let container = (document.getElementById("tableBody").innerHTML = myhtml);
};
