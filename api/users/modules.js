const axios = require("axios");
const ourModel = require("../../models/staffModel");
const staffModel = new ourModel();

const filterUsers = users => {
  let match = users.filter(user => {
    return user.value.remote == false;
  });

  return match;
};

const uploadUser = async user => {};

const upload = async users => {
  //loop through users
  for (let i = 0; i < users.length; i++) {
    //await each upload handle errors
    let user = users[i];

    const postData = async () => {
      try {
        return await axios.post("http://127.0.0.1:8000/register/", {
          email: user.value.email,
          password: user.value.pwd,
          password2: user.value.pwd,
          first_name: user.value.fname,
          last_name: user.value.lname,
          phone: user.value.number,
          rank: "staff"
        });
      } catch (err) {
        //handle error
        console.log(err.response);
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