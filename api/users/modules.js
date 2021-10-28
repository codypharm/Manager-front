/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
const axios = require("axios");
const ourModel = require("../../models/staffModel");
require("dotenv").config();
const { Notyf } = require("notyf");
const axiosInstance = require("../axiosInstance");
const staffModel = new ourModel();

const filterUsers = users => {
  let match = users.filter(user => {
    return user.value.remote == false;
  });

  return match;
};

const uploadUser = async (user, setup) => {};

const upload = async (users, setup) => {
  // add company and branch ID manually
  let company = setup.value.companyId;
  let branch = setup.value.branchId;
  //loop through users
  for (let i = 0; i < users.length; i++) {
    //await each upload handle errors
    let user = users[i];

    const postData = async () => {
      try {
        return await axiosInstance.post(`${process.env.HOST}/staff/`, {
          staffId: user.value.staffId,
          staffName: `${user.value.fname.charAt(0).toUpperCase() +
            user.value.fname.slice(1)} ${user.value.lname
            .charAt(0)
            .toUpperCase() + user.value.lname.slice(1)}`,
          position: user.value.position,
          email: user.value.email,
          phone: user.value.number,
          permission: user.value.permission,
          access: user.value.access,
          registered: `${user.value.regYear}-${user.value.regMonth}-${user.value.regDay}`,
          state: user.value.address.state,
          town: user.value.address.town,
          street: user.value.address.street,
          companyId: company,
          branchId: branch
        });
      } catch (err) {
        //handle error
        const notyf = new Notyf({
          duration: 3000
        });

        // Display an error notification
        notyf.error("An Error Occured");
        //remove disabled and also loading sign
        document.querySelector("#syncBtn").disabled = false;
        document.getElementById("sync").style.display = "none";
        //set sync store
        store.setSyncState(false);
      }
    };
    const callEndPoint = async () => {
      const responseData = await postData();

      //update user record to remote true
      if (responseData.status == 200) {
        let updateDb = await staffModel.updateAfterRemoteUpload(
          user.id,
          user.value.rev,
          user.value
        );
        //console.log(updateDb);
      }
    };
    callEndPoint();
  }
};

module.exports = { filterUsers, upload };
