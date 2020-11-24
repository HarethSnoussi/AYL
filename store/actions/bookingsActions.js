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

        const resData = await response.json ();
     

        if (!resData) {
          
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


 dispatch({type:GET_BOOKING,bookings:resData})
  } catch (error) {
    throw error ;
          
  
  }
 

} }



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
                resData.map((book)=>{

                tokens.map(e=>{
             
                allMessages.push(
                  {
                    to: e.expoToken,
                    sound: 'default',
                    title: 'Expirée',
                    body: 'Vous avez une réservation qui a expirée !',
                    data: { data: 'goes here' ,
                    title: 'Vous avez une réservation qui a expirée !',
                    body: 'Vous avez une réservation qui a expirée !',
                    type:'expiration',
                    start : book.start,
                    end : book.end,
                    bookingDate : book.date_booking,
                    address : book.address,
                    name : book.name,
                    surname : book.surname
                  },
                  }
                
                )
                
                })

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

 
   

} catch (error) {
  throw error ;

          
}

}

}