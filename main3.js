async function callDdbApi() {
    const res = await fetch("https://9iu7m6cqsh.execute-api.us-west-2.amazonaws.com");
    const apigw = await res.json();
    console.log(apigw);
    const title = document.getElementById("result-title");
    // const image = document.getElementById("result-image");
    // for (i=0; i<3; i++) {
    //   title.innerHTML = JSON.stringify(apigw[i].description.split(/[,)]/)[2]);
    //   // image.src = JSON.stringify(apigw[i].image)
      
    // }
    title.innerHTML = JSON.stringify(apigw[0].description.split(/[,)]/)[2]);
}