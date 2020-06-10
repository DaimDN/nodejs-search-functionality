const express = require('express');
const app = express();
const port = 3000;
const parser = require('body-parser');
var mongo = require('mongodb');
var MongoClient = mongo.MongoClient;
var url = "mongodb://localhost:27017/";
var array = [];
var x = "";

app.use(parser.urlencoded({extended: true}));
app.set('view engine', 'ejs');

app.get('/', function(req, res){ 

    MongoClient.connect(url, { useUnifiedTopology: true }, function(err, db) {
        if (err) throw err;
        var dbo = db.db("daimdb");
        dbo.collection("Daimshop").findOne({ name: "David"}, function(err, result) {
          if (err) throw err;         
         
          x = "Name :  " + result.name + "  PhoneNumber   " + result.phonenumber + "  Address   " + result.address;
         array.push(x);
         console.log(x);
          db.close();
        });
        
      });
      res.render('index', {daimnumber: x});

    
})

app.post('/', function(req,res){
    var kname  = req.body.name;
    var knumber = req.body.number;
    var kaddress = req.body.address;

    var obj = {name: kname, phonenumber: knumber, address: kaddress};

    MongoClient.connect(url, {useUnifiedTopology: true }, function(err, db){
        if(err) throw err;
        var dbo = db.db("daimdb");
        dbo.collection("Daimshop").insertOne(obj, function(err, res) {
            if (err) throw err;
            console.log("1 document inserted");
            db.close();
          });
        
    });
    res.redirect('/');
})

app.get('/search', function(req, res){
    var persondata = array[0];

    res.render('search', {info: persondata});
})


app.post('/search', function(req, res){
    var  query = req.body.Search;


    MongoClient.connect(url, { useUnifiedTopology: true }, function(err, db) {
        if (err) throw err;
        var dbo = db.db("daimdb");
        dbo.collection("Daimshop").findOne({ name: query}, function(err, result) {
          if (err) throw err;         
         
          x = "Name :  " + result.name + "  PhoneNumber   " + result.phonenumber + "  Address   " + result.address;
         console.log(x);

         array.push(x);
          db.close();
        });
        
      });



    res.redirect('/search');
});
app.listen(port, function(req, res){

    console.log("server is up and running on port " + port );

})