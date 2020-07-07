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

    $("#uploadImageModal").modal("show");
  });

  $(".crop_image").click(function() {
    $image_crop
      .croppie("result", {
        type: "canvas",
        size: "viewport"
      })
      .then(function(response) {
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

        staffModel
          .updateUserImage(staffDetail.id, staffDetail.value, imageName)
          // eslint-disable-next-line no-unused-vars
          .then(({ data, headers, status }) => {
            $("#staffImage").attr("src", imageName);

            if (store.getLoginDetail().staffId == staffDetail.value.staffId) {
              $("#containerImg").attr("src", imageName);
              user = {
                fname: staffDetail.value.fname,
                lname: staffDetail.value.lname,
                email: staffDetail.value.email,
                staffId: staffDetail.value.staffId,
                position: staffDetail.value.position,
                image: imageName,
                access: staffDetail.value.access,
                docId: staffDetail.id
              };

              store.setUserData(user);
            }
          });
        //hide modal
        $("#uploadImageModal").modal("hide");
      });
  });
});
