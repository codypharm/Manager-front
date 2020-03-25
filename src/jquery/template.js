/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */
window.$ = window.jQuery = require("jquery");

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
  $(".currentStaffName").append(Mustache.render(fname + " " + lname));
  $(".currentStaffPosition").append(Mustache.render(position));
  $.each(data, function(index, item) {
    let template =
      "" +
      '<div class="listCard">' +
      ' <div class="cardImg">' +
      ' <img src="../images/profile.png" alt ="image of "   width="100%" height="100%" />' +
      "  </div>" +
      '<div class="staffName"> {{value.fname}} {{value.lname}}  </div>' +
      '<div class="staffPosition"> {{value.position}}  </div>' +
      '<div class="statusBox block"> Block </div>' +
      ' <div class="staffAction">' +
      ' <div class="actions" data-staffEmail="{{value.email}}" onclick="viewStaff(event)">  View </div>' +
      ' <div class="actions" data-staffEmail="{{value.email}}" onclick="editStaff(event)">  Edit </div>' +
      " </div>" +
      "</div>";

    $(".otherUsers").prepend(Mustache.render(template, item));
  });
};
