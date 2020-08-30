function openCard(){
  document.querySelector(".downFace").style.transform = "rotateY(10deg)";
  document.querySelector(".upFace").style.transform = "rotateY(-80deg)";
}
function closeCard(){
  document.querySelector(".downFace").style.transform = "rotateY(0deg)";
  document.querySelector(".upFace").style.transform = "rotateY(0deg)";
}
var usera = getUserInfo(window.location.href + "");
var themes = [ new CardTheme("C98686","966B9D","F2B880"), new CardTheme("42ACFD","54BFDC","000000"), new CardTheme("EAF9D9","E2D48A","000000"), new CardTheme("84ACCE","D7B9B1","820151"), new CardTheme("CFCBCA","ABA194","8C271E")];
makeCard(usera);
console.log(usera);
function CardTheme(bgColor,polkaColor,textColor){
  this.bgColor = bgColor;
  this.polkaColor = polkaColor;
  this.textColor = textColor;
}
function implementBackground(theme){
  document.querySelector(".downFace").style.backgroundColor = "#" + theme.bgColor;
  document.querySelector(".downFace").style.color = "#" + theme.textColor;
  document.querySelector(".upFace").style.backgroundColor = "#" + theme.bgColor;
  document.querySelector(".upFace").style.color = "#" +theme.textColor;
  document.querySelector(".upFace").style.backgroundImage = "radial-gradient(#"+theme.polkaColor+" 20%, transparent 0), radial-gradient(#"+theme.polkaColor+" 20%, transparent 0)";
}
function makeCard(userObj){
  document.querySelector("#toName").innerHTML = userObj.recipe;
  document.querySelector(".whishes").innerHTML = userObj.sentence;
  document.querySelector(".fromDisplay").innerHTML = "From " + userObj.name;
  var ran = Math.floor(Math.random() * 5);
  implementBackground(themes[ran])
}
function User(name,recipe,sentence){
  this.name = name;
  this.recipe = recipe;
  this.sentence = sentence;
}
function getUserInfo(url){
  url = url.split("?");
  url = decodeURI(url[1]);
  url = url.split("&");
  var user = new User(decodeBase64(url[0].substring(url[0].indexOf("'")+1,url[0].length-1)),decodeBase64(url[1].substring(url[1].indexOf("'")+1,url[1].length-1)),decodeBase64(url[2].substring(url[2].indexOf("'")+1,url[2].length-1)));
  return user;
}
function shareSite(){
  var dummy = document.createElement('input'),
    text = window.location.href;

document.body.appendChild(dummy);
dummy.value = text;
dummy.select();
document.execCommand('copy');
document.body.removeChild(dummy);
  alert("link copied to clipboard");
}
function decodeBase64(data) {
    if (typeof atob === "function") {
        return atob(data);
    } else if (typeof Buffer === "function") {
        return Buffer.from(data, "base64").toString("utf-8");
    } else {
        throw new Error("Failed to determine the platform specific decoder");
    }
}
