/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
const axios = require("axios");
const ourModel = require("../../models/staffModel");
const env = require("../../utils/appConstants");
const { Notyf } = require("notyf");
const axiosInstance = require("../axiosInstance");
const staffModel = new ourModel();

const filterUsers = users => {
  let match = users.filter(user => {
    return user.remote == false;
  });

  return match;
};

const uploadUser = async (user, setup) => {};

const upload = async (users, setup) => {
  // add company and branch ID manually
  let company = setup.companyId;
  let branch = setup.branchId;
  //loop through users
  for (let i = 0; i < users.length; i++) {
    //await each upload handle errors
    let user = users[i];

    const postData = async () => {
      try {
        return await axiosInstance.post(`staff/`, {
          staffId: user.staffId,
          staffName: `${user.firstname.charAt(0).toUpperCase() +
            user.firstname.slice(1)} ${user.lastname.charAt(0).toUpperCase() +
            user.lastname.slice(1)}`,
          position: user.position,
          email: user.email,
          phone: user.number,
          permission: user.permission,
          access: user.access,
          registered: `${user.regYear}-${user.regMonth}-${user.regDay}`,
          state: user.address.state,
          town: user.address.town,
          street: user.address.street,
          companyId: company,
          branchId: branch
        });
      } catch (err) {
        console.log(err);
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
      console.log(responseData);
      //update user record to remote true
      if (responseData.status == 200) {
        let updateDb = await staffModel.updateAfterRemoteUpload(
          user._id,
          user._rev,
          user
        );
        //console.log(updateDb);
      }
    };
    callEndPoint();
  }
};

module.exports = { filterUsers, upload };
