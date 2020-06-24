//jshint esversion:6
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
    host: 'localhost',
    user: "root",
    password: "",
    database: "footbooking"
  });
 
  con.connect( err => {
    if (err) {
      console.log(err);
    }
  })
  
  /**
   * ************************Player
  */
 /*
    Add New Player
 */ 
  app.post('/player/addPlayer',(req,res)=>{


    con.query('INSERT INTO player (id,phone,password,name,surname,email,address,type,image) VALUES(?,?,?,?,?,?,?,?,?)',
    [
      req.body.id,
      req.body.phone,
      req.body.password,
      req.body.name,
      req.body.surname,
      null,
      null,
      "Player",
      null
    ]
    ,
    (err,result,fields)=>{
        if(err) console.log('Query error',err);
        res.send("success");
    });

  });

/*
    Fetch All Players
 */
  app.get('/player',(req,res)=>{
     con.query('SELECT * FROM player',(err,result,fields)=>{
       if(err) console.log('Query error',err);
      res.send(result);
     });
  });

/*
  Fetch one player according to his id
*/  
app.get('/player/:id',(req,res)=>{
  con.query('SELECT * FROM player WHERE id= ?',
  [
    req.params.id
  ],
  (err,result,fields)=>{
    if(err) console.log('Query error',err);
    res.send(result);
  });
});


/*
    Update player password
 */ 
  app.patch('/player/updatePassword/:id',(req,res)=>{
    
    con.query('UPDATE player SET password = ? WHERE id= ?',
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
    Update Player phone
 */

app.patch('/player/updatePhone/:playerid',(req,res)=>{
    
  con.query(`UPDATE player SET id=?,phone=? WHERE id= ?`,
  [
    req.body.id,
    req.body.phone,
    req.params.playerid
  ],
  (err,result,fields)=>{
    if(err) console.log('Query error',err);
    res.send("success");
  });
});

  /*
    Update player
 */ 
app.patch('/player/updatePlayer/:id',(req,res)=>{
    
  con.query('UPDATE player SET name=?, surname=?, email=?, address=?, image=? WHERE id= ?',
  [
    req.body.name,
    req.body.surname,
    req.body.email,
    req.body.address,
    req.body.image,
    req.params.id
  ],
  (err,result,fields)=>{
    if(err) console.log('Query error',err);
    res.send("success");
  });
});

/*
    Delete player
 */
 app.delete('/player/deletePlayer/:id',(req,res)=>{
 
  con.query('DELETE FROM player WHERE id=?',
  [
    req.params.id
  ],
  (err,result,fields)=>{
    if(err) console.log('Query error',err);
    res.send("success");
  });

 });
  
/**
   * ************************Owner
  */
 app.post('/owner/addOwner',(req,res)=>{


  con.query('INSERT INTO owner (id,phone,password,fullname,email,address,type) VALUES(?,?,?,?,?,?,?)',
  [
    req.body.id,
    req.body.phone,
    req.body.password,
    req.body.fullname,
    null,
    req.body.address,
    "Owner"
  ],
  (err,result,fields)=>{
      if(err) console.log('Query error',err);
      res.send('success');
  });

}); 

/*
    Fetch All Owners
 */
app.get('/owner',(req,res)=>{
  con.query('SELECT * FROM owner',(err,result,fields)=>{
    if(err) console.log('Query error',err);
   res.send(result);
  });
});

/*
    Fetch owner's property
 */
app.get('/owner/property/:id',(req,res)=>{
  con.query('SELECT * FROM owner O INNER JOIN property P ON O.id = P.owner_id WHERE O.id = ?',
  [req.params.id],
  (err,result,fields)=>{
    if(err) console.log('Query error',err);
    res.send(result);
  });
});

  /*
    Update owner
 */ 
app.patch('/owner/updateOwner/:id',(req,res)=>{
    
  con.query('UPDATE owner SET  fullname=?, email=?, address=? WHERE id= ?',
  [
    req.body.fullname,
    req.body.email,
    req.body.address,
    req.params.id
  ],
  (err,result,fields)=>{
    if(err) console.log('Query error',err);
    res.send("success");
  });
});

/*
    Update owner password
 */

app.patch('/owner/updatePassword/:id',(req,res)=>{
    
  con.query(`UPDATE owner SET password = ? WHERE id= ?`,
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
    Update owner phone
 */

app.patch('/owner/updatePhone/:ownerid',(req,res)=>{
    
  con.query(`UPDATE owner SET id=?,phone=? WHERE id= ?`,
  [
    req.body.id,
    req.body.phone,
    req.params.ownerid
  ],
  (err,result,fields)=>{
    if(err) console.log('Query error',err);
    res.send("success");
  });
});


/*
    Delete Owner
 */
app.delete('/owner/deleteOwner/:id',(req,res)=>{
 
  con.query('DELETE FROM owner WHERE id=?',
  [
    req.params.id
  ],
  (err,result,fields)=>{
    if(err) console.log('Query error',err);
    res.send("success");
  });

 });

 /**
   * **************************************************Property
  */
  /*
    Add New Property
 */ 
app.post('/property/addProperty',(req,res)=>{


  con.query('INSERT INTO property (id,name,addressP,region,wilaya,balls,showers,bibs,rooms,roof,referee,owner_id) VALUES(?,?,?,?,?,?,?,?,?,?,?,?)',
  [
    req.body.id,
    req.body.name,
    req.body.address,
    req.body.region,
    req.body.wilaya,
    req.body.balls,
    req.body.showers,
    req.body.bibs,
    req.body.rooms,
    req.body.roof,
    req.body.referee,
    req.body.owner_id
  ]
  ,
  (err,result,fields)=>{
      if(err) console.log('Query error',err);
      res.send("success");
  });

});

/*
    Fetch All Properties
 */
app.get('/property',(req,res)=>{
  con.query('SELECT * FROM property',(err,result,fields)=>{
    if(err) console.log('Query error',err);
   res.send(result);
  });
});

/*
    Update property
 */

app.patch('/property/updateProperty/:ownerid',(req,res)=>{
    
  con.query('UPDATE property SET id=?, name=?, addressP=?, region=?, wilaya=? WHERE owner_id= ?',
  [
    req.body.id,
    req.body.name,
    req.body.addressP,
    req.body.region,
    req.body.wilaya,
    req.params.ownerid
  ],
  (err,result,fields)=>{
    if(err) console.log('Query error',err);
    res.send("success");
  });
});


/*
    Add New Property Stadium
 */ 
app.post('/property/addStadium/:numStadium',(req,res)=>{

  let values = [];
  const numStadium = JSON.parse(req.params.numStadium);

 
     if(numStadium.numStadium5x5 === 0){
       return;
     }else{
      for(let type5=0; type5<numStadium.numStadium5x5; type5++){
        values.push([req.body.type5x5,req.body.property_id]);
      }
     }
    
     if(numStadium.numStadium6x6 === 0){
      return;
    }else{
     for(let type6=0; type6<numStadium.numStadium6x6; type6++){
       values.push([req.body.type6x6,req.body.property_id]);
     }
    }

    if(numStadium.numStadium7x7 === 0){
      return;
    }else{
     for(let type7=0; type7<numStadium.numStadium7x7; type7++){
       values.push([req.body.type7x7,req.body.property_id]);
     }
    }

    if(numStadium.numStadium8x8 === 0){
      return;
    }else{
     for(let type8=0; type8<numStadium.numStadium8x8; type8++){
       values.push([req.body.type8x8,req.body.property_id]);
     }
    }

    if(numStadium.numStadium9x9 === 0){
      return;
    }else{
     for(let type9=0; type9<numStadium.numStadium9x9; type9++){
       values.push([req.body.type9x9,req.body.property_id]);
     }
    }

    if(numStadium.numStadium10x10 === 0){
      return;
    }else{
     for(let type10=0; type10<numStadium.numStadium10x10; type10++){
       values.push([req.body.type10x10,req.body.property_id]);
     }
    }

    if(numStadium.numStadium11x11 === 0){
      return;
    }else{
     for(let type11=0; type11<numStadium.numStadium11x11; type11++){
       values.push([req.body.type11x11,req.body.property_id]);
     }
    }
     
  

  con.query('INSERT INTO stadium (type,property_id) VALUES ?',
  [values]
  ,
  (err,result,fields)=>{
      if(err) console.log('Query error',err);
      res.send("success");
  });

});

/*
    Fetch All Stadiums
 */
app.get('/stadium',(req,res)=>{
  con.query('SELECT * FROM stadium',(err,result,fields)=>{
    if(err) console.log('Query error',err);
   res.send(result);
  });
});

/*
    Fetch All property Stadiums
*/
app.get('/propertyStadiums',(req,res)=>{
  con.query('SELECT * FROM property P INNER JOIN stadium S ON P.id = S.property_id',(err,result,fields)=>{
    if(err) console.log('Query error',err);
   res.send(result);
  });
});

/**
   * **************************************************Service
  */
 app.get('/ownerservices/:owner_id',(req,res)=>{
  con.query('SELECT * FROM service WHERE owner_id = ?',
   [req.params.owner_id],
  (err,result,fields)=>{
    if(err) console.log('Query error',err);
   res.send(result);
  });
});

/*
    Delete owner service
 */
app.delete('/deleteservice/:id',(req,res)=>{
 
  con.query('DELETE FROM service WHERE id=?',
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