var express = require('express');
var app = express();
const bodyParser = require('body-parser');
const req = require('express/lib/request');
app.use(bodyParser.urlencoded({extended : true}));
app.set('view engine', 'ejs');

var db; //저장해주기 위해 변수 만들어주기
const MongoClient = require('mongodb').MongoClient;


MongoClient.connect('mongodb+srv://admin:ghd05-08@cluster0.axduts8.mongodb.net/?retryWrites=true&w=majority', function(error, client){
    // 에러 처리
    if(error) return console.log(error)

    db = client.db('todoapp');

    // db.collection('post').insertOne({name:name_, date:date_, _id:100}, function(error, result){
    //     console.log('저장 완료');
    // });

    app.listen(3000, function(){
        console.log("server is running.")
      });
      
})


//정보는 req에 저장되어 있음. body-parser 사용 필요.
//디렉토리에 body-parser 깔기. 
app.post('/add', function(req, res){

    res.send('전송완료')
    //이렇게 해주면 콘솔 창으로 input에 적은 정보가 전달이 됨. (터미널 창에 뜬다)
    console.log(req.body.title);
    console.log(req.body.date);
    //name이 게시물갯수라고 되어있는 데이터를 찾아달라는 quert문이다. 
    db.collection('counter').findOne({name:'게시물갯수'}, function(error, result){
        console.log(result.totalPost);
        //var은 function안에서만 쓸 수 있다. function 밖에서는 사용 불가.
        var totalposts = result.totalPost;

        //콜백 함수는 순차적 실행을 보장한다. 글을 발행하고 counter를 실행시켜줘야한다. 순서 주의.
        db.collection('post').insertOne({_id:totalposts+1, name:req.body.title, date:req.body.date}, function(error, result){
            console.log('저장 완료');
            //db 데이터를 수정해주세요. 한번에 많이 수정해주고 싶으면 updateMany
            //{어떤 데이터를 수정 할 지} {수정 값(operator)}
            //$set이 mongbodb operator. set(변경) inc(증가) 등등
            //{$set:{totalPost:바꿀값}} {$inc:{totalPost:기존값에 더해줄 값}}
            db.collection('counter').updateOne({name:'게시물갯수'}, {$inc:{totalPost:1}}, function(error, result){
                if(error){return console.log(error)};

            });

    });

    });



});

app.use('/public', express.static('public'));

app.get('/list', function(req, res){

    //db에 저장된 post라는 collection안의 모든 데이터를 꺼내주세요 (순서 잘 지키기. render는 나중에)
    db.collection('post').find().toArray(function(error, result){
        console.log(result);
        // {posts:result}, ejs에 result라는 이름을 써서 집어넣어주세요
        res.render('list.ejs', {posts:result});
    });

    
})

app.get('/', function(req, res){
    res.render('index.ejs')
});

app.get('/write', function(req, res){
    res.render('write.ejs')
});

//deleteOne({Query문}, 그 후에 실행시킬 콜백 함수)
app.delete('/delete', function(req, res){
    console.log(req.body);
    //list AJEX 문법에서 data: {_id:1}이라고 해도 문자열이 전송된다. 
    //따라서 parseInt 함수를 이용해서 int형으로 형변환을 시켜줘야 정상적으로 작동한다. 
    req.body._id = parseInt(req.body._id);
    db.collection('post').deleteOne(req.body, function(error, result){
        console.log('삭제 완료');
        //응답 코드 200을 보내주세요~
        res.status(200).send({ message: '성공했습니다.'});
        if(error) {res.status(400).send({message: '실패했습니다.'});}
    })
})

//사용자가 detail뒤에 어떤 문자를 입력해주면 함수를 실행시켜주세요
//url의 parameter라고 부른다. 
//어떤 사람이 detail/어쩌구로 접속하면 DB에서 {_id:어쩌구}인 게시물을 찾는다.
//그리고 찾은 결과를 detail.ejs로 보낸다. 
//여기도 형변환에 주의를 해줘야한다. 그냥 req.params.id하면 string으로 들어온다. 
app.get('/detail/:id', function(req, res){

    db.collection('post').findOne({_id:parseInt(req.params.id)}, function(error, result){
        res.render('detail.ejs', { data: result});
        console.log(result);
    })
})
