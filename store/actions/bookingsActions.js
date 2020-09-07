import moment from "moment";
import React, { useState } from "react";
import { View, StyleSheet, Button, Alert } from "react-native";
import { useSelector } from "react-redux";
import SentOverlay from "../../components/SentOverlay";

export const ADD_BOOKING = "ADD_BOOKING"; 
export const GET_BOOKING = "GET_BOOKING"; 
export const CANCEL_BOOKING = "CANCEL_BOOKING";
export const EXPIRED_BOOKING = "EXPIRED_BOOKING";


export const addBooking = (booking) => {
  
    return async dispatch => {
        const response =  await fetch('http://173.212.234.137:3000/clientbookings/addbooking',
        {
         method : "POST",
         headers: {
            'Content-Type': 'application/json'
          },
        body : JSON.stringify(booking)
        }
        
        );
        if (!response.ok) {
          throw new Error('Something went wrong!');
        }
       
      const myBooking = {
          amount : booking.amount,
          bookingDate : booking.bookingDate,
          clientId : booking.clientId,
          date : booking.date,
          duration : booking.duration,
          end : booking.end ,
          services : booking.services,
          start : booking.start,
          status : booking.status
      }
       dispatch( {type : ADD_BOOKING , booking : myBooking});
   
    };


};
/********************************************************************************************* */

/********************************************************************************************** */
export const getClientBookings = (clienId)=>{

  return async (dispatch) =>{
      try {
  
      const arr = await fetch(`http://173.212.234.137:3000/client/bookings/${clienId}`);
      const resData = await arr.json ();
      
const bookingsIds = [];
const clientbookings = [];



resData.forEach(e => {
      if(bookingsIds.indexOf(e.id)<0) {
        bookingsIds.push(e.id);
      }
});

let allBookings = [];

bookingsIds.forEach( id => {

let same = resData.filter(e=>e.id === id);

    let booking = {
            amount : same[0].amount,
            barberId : same[0].barberId,
            bookingDate : same[0].bookingDate,
            bookingDuration : same[0].bookingDuration,
            clientId : same[0].clientId,
            date : same[0].date,
            end : same[0].end,
            id : same[0].id,
            services:[],
            start :same[0].start ,
            status : same[0].status,
           
    }
    same.forEach(e=>{
          const service = {
                name : e.name,
                price : e.price,
                serviceDuration : e.serviceDuration
          }
        booking.services.push(service);
    });
      allBookings.push(booking);
      });



 dispatch({type:GET_BOOKING,bookings:allBookings})
  } catch (error) {
    throw error ;
          
  
  }
 

} }



// export const cancelBooking = (bookingDate,clientId)=> {

// const bookDate = bookingDate.toString();
//   return async (dispatch) =>{
//       try {
//           const response = await fetch(
//               `http://173.212.234.137:3000/bookings/cancelbooking`,
//               {
//                 method: 'PATCH',
//                 headers: {
//                   'Content-Type': 'application/json'
//                 },
//               body : JSON.stringify({bookDate,clientId})
//               }
              
              
//             );
         
//             if (!response.ok) {
//               throw new Error('Something went wrong!');
//             }

//   dispatch({type:CANCEL_BOOKING,bookingDate,clientId})
//   } catch (error) {
//     throw error ;
          
  
//   }
 

// }



// }



export const cancelBooking = (id)=> {

 
    return async (dispatch) =>{
        try {
            const response = await fetch(
                `http://173.212.234.137:3000/bookings/cancelbooking`,
                {
                  method: 'PATCH',
                  headers: {
                    'Content-Type': 'application/json'
                  },
                body : JSON.stringify({id})
                }
                
                
              );
           
              if (!response.ok) {
                throw new Error('Something went wrong!');
              }
  
             
           

     

    } catch (error) {
      throw error ;
            
    
    }
   
  
  }
  
  
  
  }

///////////////////////////////////////////////////////////////////////////////////////////////
//Expired Bookings 

export const expiredbookings = (clientId,tokens)=> {

  return async (dispatch) =>{
try {
 

  const arr = await fetch(`http://173.212.234.137:3000/getbookings/expired/${clientId}`);
  const resData = await arr.json ();

              if(resData.length > 0) {
                const allMessages = [];

                tokens.map(e=>{
                
                allMessages.push(
                  {
                    to: e.expoToken,
                    sound: 'default',
                    title: 'Expirée',
                    body: 'Vous avez une réservation qui a expirée !',
                    data: { data: 'goes here' ,title: 'Vous avez une réservation qui a expirée !u',
                    body: 'Vous avez une réservation qui a expirée !',},
                  }
                
                )
                
                })
              
                allMessages.map(async (e)=>{
                  await fetch('https://exp.host/--/api/v2/push/send', {
                    method: 'POST',
                    headers: {
                      Accept: 'application/json',
                      'Accept-encoding': 'gzip, deflate',
                      'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(e),
                  });
                
                
                })
                
              }

    // if (!response.ok) {
    //   throw new Error('Something went wrong!');
    // }
    // else {
     
    

    // }

//     const resData = await response.json;

//  if(expired.length > 0 )
// {


// dispatch({type:EXPIRED_BOOKING,expiredBookings:expired})
// }
   

} catch (error) {
  throw error ;

          
}

}

}