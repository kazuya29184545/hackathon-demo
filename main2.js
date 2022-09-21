const apikey = "AIzaSyDH66hDu98Sbi0W5BsUfIBS2k5uRo6ZOgg"

const callYtbApi = async() => {
    const res = await fetch("https://www.googleapis.com/youtube/v3/search?part=snippet&q=The Mortal Instruments: City of Bones (2013 trailor&type=video&videoEmbeddable=true&regionCode=US&key=" + apikey);
    const resJson = await res.json();
    console.log(resJson);
    const youtube = document.getElementById("youtube");
    const iframeSrc = 'https://www.youtube.com/embed/' + resJson.items[0].id.videoId;
    youtube.setAttribute('src', iframeSrc);
    
}
// callYtbApi()