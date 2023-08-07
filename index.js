// const { response } = require('express');
const express = require('express');
const mysql = require('mysql');
const port = 8000;

const app = express();

app.set('view engine', 'ejs');
app.set('views', __dirname + '/views');

app.use(express.urlencoded());
app.use(express.static('assets'));

const conn = mysql.createConnection({

    host: 'localhost',
    user: 'root',
    password: '',
    database: 'nodetodo'

});

conn.connect((err) => {

    if (err) {
        throw err;
    }

    console.log('Mysql Connected with Todo List');

});

// var tasks = [

//     {
//         description: "Pay phone bill",
//         category: "Personal",
//         date: "2022-11-20"
//     },
//     {
//         description: "Pay water bill",
//         category: "Home",
//         date: "2022-11-25"
//     },

// ];

var countt = 1;

app.get('/', function (req, res) {

    var tasks = [];
    let sqlQuery = "SELECT * FROM alltasks";
    let query = conn.query(sqlQuery, (err, results) => {

        if (err) {
            throw err;
        }

        var temp = apiResponse(results);
        temp = JSON.parse(temp);
        tasks = temp.response;
        // console.log(tasks);

        res.render('home', {

            title: "To Do List",
            ct: countt,
            tasklist: tasks,
            flag:"false",

        });

        countt++;

    });

})

app.post('/add-task', function (req, res) {

    // console.log(req.body);
    let sqlQuery = "INSERT INTO alltasks(description,category,date) values ('"+req.body.description+"', '"+req.body.category+"', '"+req.body.date+"')";

    let query = conn.query(sqlQuery,(err, results) => { 

        if(err){
            throw err;
        } 
        console.log(apiResponse(results)); 
        res.redirect('/');
    
      });

})

app.get('/delete-task/', function (req, res) {

    var tid = req.query.id;

    let sqlQuery = "DELETE FROM alltasks WHERE id="+tid;

    let query = conn.query(sqlQuery,(err, results) => { 

        if(err){
            throw err;
        } 
        console.log(apiResponse(results)); 
        res.redirect('back');
    
      });

})

app.get('/get-task/', function(req, res){ 

    // console.log("hello");
    var tid=req.query.id;
    console.log(tid);
    var tasks = [];
    let sqlQuery = "SELECT * FROM alltasks";
    let query = conn.query(sqlQuery, (err, results) => {

        if (err) {
            throw err;
        }

        var temp = apiResponse(results);
        temp = JSON.parse(temp);
        tasks = temp.response;
        console.log(tasks);
        // console.log(typeof(tasks));
        var indexx=-1;
        for(i in tasks){
            if(tasks[i].id==tid){
                indexx=i;
            }
        }
        
        // var indexx=tasks.findindex(task => task.id == tid);
        // res.redirect('/');
        res.render('home', {

            title: "To Do List",
            ct: countt,
            tasklist: tasks,
            flag:"true",
            flagid:indexx,

        });
  
  });
  
});

app.post('/update-task/',function(req, res){ 

    console.log(req.body);
    var tid=req.query.id;
    console.log(tid);
    let sqlQuery = "UPDATE alltasks SET description='"+req.body.description+"', category='"+req.body.category+"', date='"+req.body.date+"' WHERE id="+tid; 
    let query = conn.query(sqlQuery, (err, results) => { 
  
       if(err){
         throw err; 
       } 

       console.log(apiResponse(results));
  
    //    res.send(apiResponse(results)); 
        res.redirect('/');
     }); 
    // console.log(req.body);
  
  }); 

function apiResponse(results) {

    return JSON.stringify({ "status": 200, "error": null, "response": results });

}

app.listen(port, function (err) {

    if (err) {
        console.log(err);
    }
    else {
        console.log("server is up and running on port: " + port);
    }

})