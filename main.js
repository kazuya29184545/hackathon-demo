let fileName = ""


const bucketName = "rekognition-kazuya";
const bucketRegion = "us-west-2";
const IdentityPoolId = "us-west-2:b8fef739-6ccc-408c-9110-5e41b23eee55";

AWS.config.update({
  region: bucketRegion,
  credentials: new AWS.CognitoIdentityCredentials({
    IdentityPoolId: IdentityPoolId
  })
});

const s3 = new AWS.S3({
  apiVersion: "2006-03-01",
  params: { Bucket: bucketName }
});


function previewImage(obj) {
    console.log(preview)
	var fileReader = new FileReader();
	fileReader.onload = (function() {
		document.getElementById('preview').src = fileReader.result;
	});
	fileReader.readAsDataURL(obj.files[0]);
}

//User input photo
function addPhoto() {
    let files = document.getElementById("chooseFile").files;
  if (!files.length) {
    return alert("Please choose a file to upload first.");
  }
  
  var file = files[0];
  fileName = file.name;

  // Use S3 ManagedUpload class as it supports multipart uploads
  let upload = new AWS.S3.ManagedUpload({
    params: {
      Bucket: bucketName,
      Key: fileName,
      Body: file
    }
  });

  var promise = upload.promise();

  promise.then(
    function(data) {
      alert("Successfully uploaded photo.");
      
    },
    function(err) {
      return alert("There was an error uploading your photo: ", err.message);
    }
  );
}

// Delete the photo
function deletePhoto(fileName) {
    s3.deleteObject({ Bucket: bucketName, Key: fileName }, function(err, data) {
      if (err) {
        return alert("There was an error deleting your photo: ", err.message);
      }
      alert("Successfully deleted photo.");
    });
  }
  

const uploadButton = document.getElementById("uploadPhoto");
const deleteButton = document.getElementById("deletePhoto");

uploadButton.addEventListener('click', () => {
    addPhoto();
});

deleteButton.addEventListener('click', () => {
    deletePhoto();
});


// Call APIGW
async function callAPIGW() {
    const res = await fetch("https://4jo70ixtdk.execute-api.us-west-2.amazonaws.com/prod/?s3key=" + fileName);
    const apigw = await res.json();
    console.log(apigw)
}

const APIGWButton = document.getElementById("callAPIGW")

APIGWButton.addEventListener("click", () => {
    callAPIGW();
})