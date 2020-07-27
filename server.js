//jshint esversion:6
require('dotenv').config();

const mysql =  require("mysql");
const express = require("express");
const bodyParser = require("body-parser");
const app = express();

const admin = require('firebase-admin');
const serviceAccount = require("./helpers/serviceAccountKey.json");//Firebase NodeJs linking

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://footbooking-959a6.firebaseio.com"
});
app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));
app.use(bodyParser.json());

/////////////////////////////////////////Firebase functions begin/////////////////////////////////////
//Check if the user exists in firebase and if exists we create a custom token
app.get('/phone/:phoneID',(req,res)=>{

  const phoneID = req.params.phoneID;
  

  admin.auth().getUserByPhoneNumber(phoneID)
  .then(function(userRecord) {
    const uid = userRecord.uid;
    const expiresIn = 3600;
    
    if(uid){ 
      admin.auth().createCustomToken(uid)
        .then(function(customToken) {
          // Send token back to client
          const expirationDate= new Date(new Date().getTime() + expiresIn * 1000);
          const token= customToken;
          res.send({userRecord:userRecord.toJSON(),token:token,expirationDate:expirationDate});
          console.log('Successfully fetched user data:', userRecord.toJSON());
        })
        .catch(function(error){
          console.log('Error creating custom token:', error);
        });
    }

    
  })
  .catch(function(error) {
    console.log('Error fetching user data:', error);
    res.send({userRecord:error});
  });

});

//Update firebase phone of an existing user

app.patch('/phoneUpdate/:uid',(req,res)=>{
admin.auth().updateUser(req.params.uid, {
  phoneNumber: req.body.phoneNumber,
})
  .then(function(userRecord) {
    // See the UserRecord reference doc for the contents of userRecord.
    console.log('Successfully updated user', userRecord.toJSON());
  })
  .catch(function(error) {
    console.log('Error updating user:', error);
  });

});

//Delete firebase user
app.delete('/userDelete/:uid',(req,res)=>{

  admin.auth().deleteUser(req.params.uid)
  .then(function() {
    console.log('Successfully deleted user');
  })
  .catch(function(error) {
    console.log('Error deleting user:', error);
  });
});
///////////////////////////////////////////////Firebase functions end//////////////////////////////

//CONNECT THE DATABASE
let con = mysql.createConnection({
    host:process.env.HOST,
    user:process.env.USER,
    password: "",
    database:process.env.DATABASE
  });
  con.connect();

//GET THE OWNER'S OFFERS
  app.get("/owner/:ownerName",(req,res)=> {
    const ownerName = req.params.ownerName;
 

   con.query("SELECT slot.date , slot.start,slot.service_id,slot.end , service.type_match,service.time_match,service.tarif,service.owner_id,service.stadiumNum FROM slot  INNER JOIN service on slot.service_id = service.id WHERE service.owner_id = ? ",[ownerName],(err, result, fields) => {
          if (err) res.send(err);
          res.send(result);
         
        });
      });

//GET THE BOOKING'S
app.get("/bookings/playerbookings/:playerId",(req,res)=>{

const playerId = req.params.playerId;

const query = "SELECT CAST(booking.date AS char) as date,SUBSTRING(booking.date_booking,1,10) as bookingDate,SUBSTRING(booking.start,1,5) as start,SUBSTRING(booking.end,1,5)as end,booking.player_id as playerId,booking.owner_id as ownerId,booking.service_id as serviceId,booking.status ,service.type_match as typeMatch,service.time_match as timeMatch,service.tarif from booking INNER JOIN service on booking.service_id = service.id WHERE booking.player_id = ? "


con.query(query,[playerId],(err,result,fields)=>{
    if(err) res.send(err);

    res.send(result);

});



});


//GET THE OWNER BOOKING'S
app.get("/bookings/ownerbookings/:ownerId",(req,res)=>{

  const ownerId = req.params.ownerId;
  
  const query = "SELECT CAST(booking.date AS char) as date,SUBSTRING(booking.date_booking,1,10) as bookingDate,SUBSTRING(booking.start,1,5) as start,SUBSTRING(booking.end,1,5)as end,booking.player_id as playerId,booking.owner_id as ownerId,booking.service_id as serviceId,booking.status  ,service.type_match as typeMatch,service.time_match as timeMatch,service.tarif from booking INNER JOIN service on booking.service_id = service.id WHERE booking.owner_id = ? "
  
  
  con.query(query,[ownerId],(err,result,fields)=>{
      if(err) res.send(err);
      res.send(result);
  
  });
  
  
  
  });
  

//ADD A NEW BOOKING TO THE DATABASE   
  app.post("/bookings/addbooking",(req,res)=>{

    
   con.query("INSERT INTO booking (date,date_booking, start,status,end,player_id,owner_id,service_id) VALUES (?,?, ?, ?, ?, ?, ?,?)"
   ,[
    req.body.date,
    req.body.bookingDate, 
    req.body.start,
    req.body.status,
    req.body.end,
    req.body.playerId,
    req.body.ownerId,
    req.body.serviceId
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

///////////////////////////////////////////////////////////
//Delete Booking

app.patch("/bookings/cancelbooking",(req,res)=>{
  let date = req.body.bookingDate.replace("T"," ");
  
  date = date.replace("Z","")+"000"

  con.query("UPDATE booking SET status = 'annulée' WHERE   booking.player_id = ? AND booking.date = ?",[req.body.playerId,date],
  (err,result,fields)=>{ 

  if (err) {
    res.send(err);
  } else {
    res.send("Success");
  }
  
});

});
////////////////////////////////////////////////////////////
/*
    Fetch All property Stadiums
*/
app.get('/propertyStadiums',(req,res)=>{
  con.query('SELECT * FROM property P INNER JOIN stadium S ON P.id = S.property_id  ',(err,result,fields)=>{
    if(err) console.log('Query error',err);
   res.send(result);
  });
});



 /**
   * ************************Client
  */
 /*
    Add New Client
 */ 
app.post('/client/addClient',(req,res)=>{


  con.query('INSERT INTO client (id,phone,password,sex,name,surname,wilaya,region,lang) VALUES(?,?,?,?,?,?,?,?,?)',
  [
    req.body.id,
    req.body.phone,
    req.body.password,
    req.body.sex,
    req.body.name,
    req.body.surname,
    req.body.wilaya,
    req.body.region,
    true,
  ]
  ,
  (err,result,fields)=>{
      if(err) console.log('Query error',err);
      res.send("success");
  });

});

/*
  Fetch All Clients
*/
app.get('/client',(req,res)=>{
   con.query('SELECT * FROM client',(err,result,fields)=>{
     if(err) console.log('Query error',err);
    res.send(result);
   });
});

/*
Fetch one client according to his id
*/  
app.get('/client/:id',(req,res)=>{
con.query('SELECT * FROM client WHERE id= ?',
[
  req.params.id
],
(err,result,fields)=>{
  if(err) console.log('Query error',err);
  res.send(result);
});
});


/*
  Update client password
*/ 
app.patch('/client/updatePassword/:id',(req,res)=>{
  
  con.query('UPDATE client SET password = ? WHERE id= ?',
  [
    req.body.password,
    req.params.id
  ],
  (err,result,fields)=>{
    if(err) console.log('Query error',err);
    res.send("success");
  });
});

/*
  Update Client phone
*/

app.patch('/client/updatePhone/:clientid',(req,res)=>{
  
con.query(`UPDATE client SET id=?,phone=? WHERE id= ?`,
[
  req.body.id,
  req.body.phone,
  req.params.clientid
],
(err,result,fields)=>{
  if(err) console.log('Query error',err);
  res.send("success");
});
});

/*
  Update client
*/ 
app.patch('/client/updateClient/:id',(req,res)=>{
  
con.query('UPDATE client SET name=?,surname=?,email=?,address=?,long=?,lat=?,image=?,wilaya=?,region=?,lang=? WHERE id= ?',
[
  req.body.name,
  req.body.surname,
  req.body.email,
  req.body.address,
  req.body.long,
  req.body.lat,
  req.body.image,
  req.body.wilaya,
  req.body.region,
  req.body.lang,
  req.params.id
],
(err,result,fields)=>{
  if(err) console.log('Query error',err);
  res.send("success");
});
});

/*
  Delete client
*/
app.delete('/client/deleteClient/:id',(req,res)=>{

con.query('DELETE FROM client WHERE id=?',
[
  req.params.id
],
(err,result,fields)=>{
  if(err) console.log('Query error',err);
  res.send("success");
});

});





// Starting our server.
app.listen(3000, () => {
    console.log('Connected');
   });

