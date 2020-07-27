//jshint esversion:6
require('dotenv').config();

const mysql =  require("mysql");
const express = require("express");
const bodyParser = require("body-parser");
const app = express();

const admin = require('firebase-admin');
const serviceAccount = require("./helpers/serviceAccountKey.json");//Firebase NodeJs linking


app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));
app.use(bodyParser.json());

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://footbooking-959a6.firebaseio.com"
});

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

let con = mysql.createConnection({
    host:process.env.HOST,
    user:process.env.USER,
    password: "",
    database:process.env.DATABASE
  });
 
  con.connect( err => {
    if (err) {
      console.log(err);
    }
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