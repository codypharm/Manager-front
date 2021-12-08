/* eslint-disable no-undef */

window.$ = window.jQuery = require("jquery");
$(document).ready(function() {
  $image_crop = $("#image_demo").croppie({
    enableExif: true,
    viewport: {
      width: 200,
      height: 200,
      type: "square"
    },

    boundary: {
      width: 300,
      height: 300
    }
  });

  $("#upload_image").on("change", function() {
    var reader = new FileReader();
    reader.onload = function(event) {
      $image_crop
        .croppie("bind", {
          url: event.target.result
        })
        .then(() => {
          console.log("jquery bind done");
        });
    };

    reader.readAsDataURL(this.files[0]);
    hideLoading();
    $("#uploadImageModal").modal("show");
  });

  $(".crop_image").click(function() {
    $image_crop
      .croppie("result", {
        type: "canvas",
        size: "viewport"
      })
      .then(async function(response) {
        showLoading();
        let date = Date.now();
        let rand = Math.floor(Math.random() * 101);
        //image name
        let imagePath = `./images/image${rand}${date}.png`;
        let imageName = `../images/image${rand}${date}.png`;
        //split image
        var image = response.split(";base64,").pop();
        let staffDetail = store.getEditDetail().detail;
        //write to images folder
        fs.writeFile(imagePath, image, { encoding: "base64" }, function(error) {
          //console.log(error);
        });

        await staffModel
          .updateUserImage(staffDetail._id, staffDetail, imageName)
          
            $("#staffImage").attr("src", imageName);
              
            if (store.getLoginDetail().staffId == staffDetail.staffId) {
              $("#containerImg").attr("src", imageName);

              user = {
                firstname: staffDetail.firstname,
                lastname: staffDetail.lastname,
                email: staffDetail.email,
                staffId: staffDetail.staffId,
                position: staffDetail.position,
                permission: staffDetail.permission,
                image: imageName,
                access: staffDetail.access,
                _id: staffDetail._id
              };

              store.setUserData(user);
            }
          
        //hide modal
        $("#uploadImageModal").modal("hide");
        hideLoading();
      });
  });
});
