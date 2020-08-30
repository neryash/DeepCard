var values = [["An Aniversary Card","anniversary "], ["A Christmas Card","christmas "], ["A Get Well Card","getWell "],["A Good Luck Card","luck "],["A Birthday Card","bday "]];
var selected = 4;
var isClickable = true;
document.getElementById("valueName").innerHTML = values[selected][0];
var user = new User();
function toSecond(){
  document.getElementById("firstLayout").style.left = "-100%";
  document.getElementById("secondLayout").style.left = "0%";
  user.type = values[selected][1];
}
function toThird(){
  if(validateInput(document.getElementById("yourName").value)){
    document.getElementById("secondLayout").style.left = "-100%";
    document.getElementById("thirdLayout").style.left = "0%";
    user.name = document.getElementById("yourName").value;
  }else{
    showErr("yourName");
  }
}
function toFourth(){
  if(validateInput(document.getElementById("recName").value)){
    document.getElementById("thirdLayout").style.left = "-100%";
    document.getElementById("fourthLayout").style.left = "0%";
    user.recipe = document.getElementById("recName").value;
    //document.getElementById("perMess").innerHTML = "Last thing, please give something " + user.recipe + " likes";
  }else{
    showErr("recName");
  }
}
function finish(){
  if(validateInput(document.getElementById("keyword").value)){
    if(document.getElementById("aitoggle").checked){
      var finishedUrl = "/card?bmFtZQ='"+btoa(decodeURIComponent(user.name))+"'&cmVjaXBl='"+btoa(decodeURIComponent(user.recipe))+"'&bWVzc2FnZQ='"+btoa(decodeURIComponent(document.getElementById("keyword").value))+"'";
      window.location.href = finishedUrl;
    }else{
      user.keyword = document.getElementById("keyword").value;
      console.log(user);
      window.location.href = "/load?name="+user.name + "&type=" + user.type + "&recipient=" + user.recipe + "&keyword=" + user.keyword;
    }
  }else{
    showErr("keyword");
  }
}
function upValue(){
  document.getElementById("valueName").style.top = "-40px";
  setTimeout(function(){
    document.getElementById("valueName").style.transition = "none";
    document.getElementById("valueName").style.top = "40px";
    selected++;
    if(selected == values.length){
      selected = 0;
    }
    document.getElementById("valueName").innerHTML = values[selected][0];
    setTimeout(function(){
      document.getElementById("valueName").style.transition = "0.1s top";
      document.getElementById("valueName").style.top = "0px";
    }, 100);
  }, 100);

}
function downValue(){
  document.getElementById("valueName").style.top = "40px";
  setTimeout(function(){
    document.getElementById("valueName").style.transition = "none";
    document.getElementById("valueName").style.top = "-40px";
    selected--;
    if(selected < 0){
      selected = values.length-1;
    }
    document.getElementById("valueName").innerHTML = values[selected][0];
    setTimeout(function(){
      document.getElementById("valueName").style.transition = "0.1s top";
      document.getElementById("valueName").style.top = "0px";
    }, 100);
  }, 100);
}

function validateInput(input){
  if(input.trim() == ""){
    return false;
  }else{
    return true;
  }
}
function showErr(el){
  if(isClickable){
    isClickable = false;
    document.getElementById(el).style.borderBottom = "2px solid #FF0000";
    (async () => {
      var currMar = document.getElementById(el);
      var style = currMar.currentStyle || window.getComputedStyle(currMar);
      var marg = parseInt(style.marginLeft.replace("px",""));
      try{
        const begMar = marg;
        currMar.style.marginLeft = marg+20 + "px";
        await sleep(50);
        currMar.style.marginLeft = marg-40 + "px";
        await sleep(50);
        currMar.style.marginLeft = marg+30 + "px";
        await sleep(50);
        currMar.style.marginLeft = marg-20 + "px";
        await sleep(50);
        currMar.style.marginLeft = begMar + "px";
        await sleep(100);
        isClickable = true;
      }catch(err){
        console.log(err);
      }

    })();
  }
}
function randomWords(){
  (async () => {
    document.getElementById("keyword").value = getWord(await loadText("dicts/"+values[selected][1].trim()+"_vocab.txt"));
  })();
}
function getWord(words){
  var wordy = words.split(" ");
  var randy = Math.floor(Math.random() * wordy.length +1);
  return wordy[randy];
}
async function loadText(url) {
    text = await fetch(url);
    //awaits for text.text() prop
    //and then sends it to readText()
    return await text.text();
}
function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}
function User(name,type,recipe,keyword){
  this.name = name;
  this.type = type;
  this.recipe = recipe;
  this.keyword = keyword;
}
