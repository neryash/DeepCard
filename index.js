const express = require("express");
const app = express();
  const {PythonShell} = require('python-shell');
//const spawn = require("child_process").spawn;

app.use(express.static('public'));

app.get("/",function(req,res){
  res.sendFile(__dirname + "/index.html");
});
app.get("/inputs",function(req,res){
  res.sendFile(__dirname + "/inputs.html")
})
app.get("/load",function(req,res){
  res.sendFile(__dirname + "/loading.html")
  //const pythonProcess = spawn('python',["public/test.py", "arg1"]);
  // (async () => {
  //   await sleep(3000);
  //   res.end();
  //   await sleep(2000);
  //   //res.end()
  //   //await sleep(1000);
  //   console.log("donea");
  //   //res.cookie("heyac","heyac");
  // })();
})
function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}
app.get("/card",function(req,res){
  res.sendFile(__dirname + "/card.html")
});
app.get("/check",function(req,res){
  var fullUrl = req.protocol + '://' + req.get('host') + req.originalUrl;
  var user = getUserInfo(fullUrl);
  console.log(user.type + user.keyword + " is the thing");
  var textToPass = user.type + user.keyword + " ";
  //console.log(user);
  let options = {
    mode: 'text',
    pythonOptions: ['-u'], // get print results in real-time
    scriptPath: __dirname + '/python',
    args: [textToPass]
  };
  PythonShell.run('NLP_Model.py', options, function (err,result) {
    if (err){
      console.log(err);
      res.redirect("/siteError");
    }else{
      console.log("ended");
      //console.log('finished');
      //console.log(result);
      console.log(result);
      var resultSentence = result[0].split("\n");
      resultSentence= resultSentence[resultSentence.length-1];
      resultSentence = resultSentence.replace("['","").replace("']","").replace('["',"").replace('"]',"").replace(user.type, "");
      console.log(resultSentence);
      //console.log(resultSentence);
      //res.cookie('link', "/card?bmFtZQ='"+Buffer.from(user.name).toString('base64')+"'&cmVjaXBl='"+Buffer.from(user.recipe).toString('base64')+"'&bWVzc2FnZQ='"+Buffer.from(resultSentence).toString('base64')+"'")
      (async () => {
        var finishedUrl = "/card?bmFtZQ='"+Buffer.from(user.name).toString('base64')+"'&cmVjaXBl='"+Buffer.from(user.recipe).toString('base64')+"'&bWVzc2FnZQ='"+Buffer.from(resultSentence).toString('base64')+"'";
        console.log(finishedUrl)
        await sleep(1000);
        //res.end();
        //localStorage.setItem('myKey', finishedUrl);
        //res.writeHead(301,{Location: finishedUrl});
        //res.location(finishedUrl)
        res.redirect(finishedUrl);
      })();
    }
    //res.status(200).send('<script>window.location.href="/card"</script>');
    //res.redirect(200, '/');
  });
});
app.get("/siteError",function(req,res){
  res.send("There was an error!");
});
app.listen(process.env.PORT || 3000, function(){
  console.log("listening on 3000");
});
function User(name,type,recipe,keyword){
  this.name = name;
  this.type = type;
  this.recipe = recipe;
  this.keyword = keyword;
}
function getUserInfo(url){
  url = url.split("?");
  url = url[1];
  url = url.split("&");
  var user = new User(decodeURI(url[0].replace("name=","")),decodeURI(url[1].replace("type=","")),decodeURI(url[2].replace("recipient=","")),decodeURI(url[3].replace("keyword=","")));
  return user;
}
