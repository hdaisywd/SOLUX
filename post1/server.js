var express = require('express');
var app = express();
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({extended : true}));

app.listen(3000, function(){
  console.log("server is running.")
});

app.get('/', function(req, res){
    res.sendFile(__dirname+'/index.html');
});

app.get('/write', function(req, res){
    res.sendFile(__dirname+'/write.html');
});

//정보는 req에 저장되어 있음. body-parser 사용 필요.
//디렉토리에 body-parser 깔기. 
app.post('/add', function(req, res){
    res.send('전송완료')
    //이렇게 해주면 콘솔 창으로 input에 적은 정보가 전달이 됨. (터미널 창에 뜬다)
    console.log(req.body);

})
