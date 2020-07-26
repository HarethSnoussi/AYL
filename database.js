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
app.get("/barber/services/:barberId",(req,res)=>{
const barberId = req.params.barberId;

con.query("SELECT id, duration , name, price from service where service.barber_id = ?",[barberId],(err, result, fields)=>{
    if (err) res.send(err);
    res.send(result);


});


});



//GET THE BARBER'S Working Time
app.get("/barber/hours/:barberId",(req,res)=>{
  const barberId = req.params.barberId;
  
  con.query("SELECT day , SUBSTRING(debut,1,5) as start , SUBSTRING(finish,1,5) as end , barber_id from worktime where barber_id = ?",[barberId],(err, result, fields)=>{
      if (err) res.send(err);
      res.send(result);
  
  
  });
  
  
  });


//GET THE BARBER'S BOOKINGS
app.get("/bookings/barberBookings/:barberId",(req,res)=>{

  const barberId = req.params.barberId;
  
  const query = "SELECT CAST(date AS char) as date,SUBSTRING(date_booking,1,10) as bookingDate,SUBSTRING(start,1,5) as start,SUBSTRING(booking.end,1,5)as end,client_id as clientId,barber_id as barberId , status  from booking WHERE status = 'confirmée' AND barber_id = ? "
  
  con.query(query,[barberId],(err,result,fields)=>{
      if(err) res.send(err);
  
      res.send(result);
  
  });
  
  
  
  });


  //GET THE BARBER'S Information
app.get("/barber/:barberId",(req,res)=>{

  const barberId = req.params.barberId;
  
  const query = "SELECT phone , address , name ,surname , wilaya ,region from barber WHERE id = ? "
  
  con.query(query,[barberId],(err,result,fields)=>{
      if(err) res.send(err);
  
      res.send(result);
  
  });
  
  
  
  });



//GET THE CLIENT'S BOOKINGS

app.get("/clientbookings/:clientId",(req,res)=>{

  const clientId = req.params.clientId;
  console.log(clientId);
  const query = "SELECT booking.amount , booking.id ,CAST(booking.date AS char) as date,CAST(booking.date_booking AS char) as bookingDate,SUBSTRING(booking.start,1,5) as start,SUBSTRING(booking.end,1,5)as end,booking.client_id as clientId,booking.barber_id as barberId , booking.status, booking.duration as totalDuration , service.name , service.price , service.duration  as serviceDuration from booking INNER JOIN composition on composition.booking_id = booking.id  INNER JOIN service on  service.id = composition.service_id   WHERE client_id = ? "
  
  con.query(query,[clientId],(err,result,fields)=>{
      if(err) res.send(err);
  
      res.send(result);
  
  });
  
  
  
  });



//POST REQUESTS 

  //ADD A NEW BOOKING TO THE DATABASE   
  app.post("/clientbookings/addbooking",(req,res)=>{

const services = req.body.services.map(e=>e.id);

let composition = [];

    con.query(
      "INSERT INTO booking (amount ,date,date_booking,duration,start,end,status,client_id,barber_id) VALUES (?,?, ?, ?, ?, ?, ?,?,?)"
      
    ,[
     req.body.amount,
     req.body.date,
     req.body.bookingDate, 
     req.body.duration,
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
//////////////////////////////////////////////////////////////////
      services.forEach(service => {
          composition.push([result.insertId,service])
      });
       con.query(
        "INSERT INTO composition (booking_id , service_id) VALUES ?" 
      ,[composition] , (err,result,fields)=>{
        if(err) console.log(err)
        else console.log("success")

     });
///////////////////////////////////////////////////////////////////////////
       res.send("success");
 
      }
       
   });
 
  });

      

 






// Starting our server.
app.listen(3000, () => {
    console.log('Connected');
   });

