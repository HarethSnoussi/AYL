//jshint esversion:6
const mysql =  require("mysql");
const express = require("express");
const bodyParser = require("body-parser");
const app = express();


app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));
app.use(bodyParser.json());

//CONNECT THE DATABASE
let con = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "tahfifa"
  });
  con.connect();


//GET REQUESTS 

//GET THE BARBER'S SERVICES
app.get("/barber/:barberId",(req,res)=>{
const barberId = req.params.barberId;

con.query("SELECT duration , name, price from service where service.barber_id = ?",[barberId],(err, result, fields)=>{
    if (err) res.send(err);
    res.send(result);


});


});














//POST REQUESTS 

  //ADD A NEW BOOKING TO THE DATABASE   
  app.post("/bookings/addbooking",(req,res)=>{


    con.query("INSERT INTO booking (date,date_booking, start,end,status,client_id,barber_id) VALUES (?,?, ?, ?, ?, ?, ?)"
    ,[
     req.body.date,
     req.body.bookingDate, 
     req.body.start,
     req.body.end,
     req.body.status,
     req.body.clientId,
     req.body.barberId,
   ],
    
    (err,result,fields)=>{
      if (err){
        console.log(err);
         res.send(err);
     
     }else { 
       console.log("success");
       res.send("Success");
 
      }
       
     });
 
      
     
 
   });






// Starting our server.
app.listen(3000, () => {
    console.log('Connected');
   });

