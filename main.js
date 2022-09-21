let fileName = ""
var movieTitle = ""
let itemid = ""

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

// Preview
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
// function deletePhoto(fileName) {
//     s3.deleteObject({ Bucket: bucketName, Key: fileName }, function(err, data) {
//       if (err) {
//         return alert("There was an error deleting your photo: ", err.message);
//       }
//       alert("Successfully deleted photo.");
//     });
//   }
  

const uploadButton = document.getElementById("uploadPhoto");
const deleteButton = document.getElementById("deletePhoto");

uploadButton.addEventListener('click', () => {
    addPhoto();
});

deleteButton.addEventListener('click', () => {
    deletePhoto();
});


// Makihg function for calling APIGW
async function callAPIGW() {
    
    const res = await fetch("https://4jo70ixtdk.execute-api.us-west-2.amazonaws.com/prod/?s3key=" + fileName);
    const apigw = await res.json();
    console.log(apigw);
    const title = document.getElementById("result-title");
    // const image = document.getElementById("result-image");
    // for (i=0; i<3; i++) {
    //   title.innerHTML = JSON.stringify(apigw[i].description.split(/[,)]/)[2]);
    //   // image.src = JSON.stringify(apigw[i].image)
      
    // }
    title.innerHTML = JSON.stringify(apigw[0].description.split(/[,)]/)[2]);
    console.log(title.innerHTML + ")")
    movieTitle = title.innerHTML.slice(1, -1) + ")"
    title.innerHTML = movieTitle;
    console.log(movieTitle)
    // movieTitle = title.innerHTML;
    // console.log(movieTitle)

}


//Youtube API for trailors
const apikey = "AIzaSyDH66hDu98Sbi0W5BsUfIBS2k5uRo6ZOgg";

const callYtbApi = async() => {
    const res = await fetch("https://www.googleapis.com/youtube/v3/search?part=snippet&q=" + movieTitle + "trailor&type=video&videoEmbeddable=true&regionCode=US&key=" + apikey);
    const resJson = await res.json();
    console.log(resJson);
    const youtube = document.getElementById("youtube");
    const iframeSrc = 'https://www.youtube.com/embed/' + resJson.items[0].id.videoId;
    youtube.setAttribute('src', iframeSrc);
}

// Make a trigger to call APIGW function
const APIGWButton = document.getElementById("callAPIGW")


async function fnAsync() {
  await callAPIGW();
  callYtbApi()
}
// Call the function
APIGWButton.addEventListener("click", () => {
    fnAsync();
})

//ここでconsole.log(movieTitle)をしても何も出ない
console.log(movieTitle);

// converting movieTitle to ItemID
const titleToId = async() => {
  
  const res = await fetch("./movies-2.json");
  const resX = await res.json();
  // console.log(resX);
  console.log(movieTitle);
  const found = resX.find(e => e.TITLE === movieTitle);  ///この列が怪しいいいいいいい！！！！！
  console.log(found);
  console.log(movieTitle)
  
  // itemid = found.ITEM_ID;
  // console.log(itemid);
}

// make a function to call APIGW for personalize
// async function callAPIGWforPersonalize() {
//   const res = await fetch("https://36w3uycmuj.execute-api.us-west-2.amazonaws.com/test/?item=" + itemid);
//   const apigw = await res.json();
//   console.log(apigw);
// }

// converting ItemID to movieTitle
// async function idToTitle() {
//   const res = await fetch("./movies-2.json");
//   const resX = await res.json();
//   // console.log(resX);
//   const found = resX.find(e => e.ITEM_ID === itemid);
//   // console.log(found)
//   movieTitle = found.TITLE;
//   console.log(movieTitle)
// }

// Ordering the functions
// async function fnAsyncPersonalize() {
//   await titleToId();
//   callAPIGWforPersonalize();
//   // idToTitle();
// }

// call APIGW for personalize
document.getElementById('recommend').addEventListener("click", () => {
  // fnAsyncPersonalize();
  titleToId();
})






//Call DynamoDB API via SDK


