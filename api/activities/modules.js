const axiosInstance = require("../axiosInstance");
const ourModel = require("../../models/stockModel");
const { Notyf } = require("notyf");
const stockModel = new ourModel();

const filterActivities = activities => {
  let match = activities.filter(activity => {
    return activity.value.remote == false;
  });

  return match;
};

const upload = async (activities, setup) => {
  // add company and branch ID manually
  let company = setup.value.companyId;
  let branch = setup.value.branchId;
  let promises = [];
  for (let i = 0; i < activities.length; i++) {
    promises.push(
      axiosInstance.post("stockactivity/", {
        date: `${activities[i].value.year}-${activities[i].value.month}-${activities[i].value.day}`,
        activity: activities[i].value.activity,
        detail: activities[i].value.detail,
        editor: activities[i].value.staffName,
        editorId: activities[i].value.staffId,
        batchId: activities[i].value.editedId,
        companyId: company,
        branchId: branch
      })
      //.then(response => {
      //console.log(response);
      //})
    );
  }

  Promise.all(promises)
    .then(async () => {
      await stockModel.remoteUpdateAllActivities(activities);
    })
    .catch(error => {
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
    });
};

module.exports = { filterActivities, upload };
