var loadingSents = ["Loading the algorithm","Feeding the developers","Debugging code","Debugging again","waking up the developers","Frightening the developers","Searching on StackOverflow","Making Dinner","Firing developers"];


(async () => {
  for(var i = 0; i < loadingSents.length; i++){
    await sleep(2000);
    document.getElementById("loader").style.top = "-80px";
    await sleep(100)
    document.getElementById("loader").style.transition = "none";
    document.getElementById("loader").style.top = "80px";
    document.getElementById("loader").innerHTML = loadingSents[i];
    await sleep(100);
    document.getElementById("loader").style.transition = "0.1s top";
    document.getElementById("loader").style.top = "0px";
    if(i == loadingSents.length-1){
      i = 0;
    }
  }
})();
function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}
location.href = "/check?" + (window.location.href + "").split("?")[1];
// TODO: Execute python code in an async function
