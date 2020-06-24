import { SET_OFFERS } from "./offers";

export const ADD_BOOKING = "ADD_BOOKING";
export const SET_PLAYER_BOOKINGS = "SET_PLAYER_BOOKINGS";
export const SET_OWNER_BOOKINGS = "SET_OWNER_BOOKINGS";
export const CANCEL_BOOKING = "CANCEL_BOOKING";


export const addBooking = (booking) => {

  
    return async dispatch => {
        const response =  await fetch('http://192.168.1.6:3000/bookings/addbooking',
        {
         method : "POST",
         headers: {
            'Content-Type': 'application/json'
          },
        body : JSON.stringify(booking)
        }
        
        );

     
    const resData = await response.json;


        dispatch( {type : ADD_BOOKING , booking : booking});
    };


};

export const fetchPlayerBookings = (playerID)=>{

    return async (dispatch) =>{
        try {
            
        const arr = await fetch('http://192.168.1.6:3000/bookings/playerbookings/+213557115451');
        const resData = await arr.json ();


   dispatch({type:SET_PLAYER_BOOKINGS,bookings:resData})
    } catch (error) {
            
    
    }
   

}


}

export const fetchOwnerBookings = (ownerId)=>{

    return async (dispatch) =>{
        try {
            
        const arr = await fetch('http://192.168.1.6:3000/bookings/ownerbookings/hareth');
        const resData = await arr.json ();


   dispatch({type:SET_OWNER_BOOKINGS,bookings:resData})
    } catch (error) {
            
    
    }
   

}


}

export const cancelBooking = (bookingDate,playerId)=> {


    return async (dispatch) =>{
        try {
            
            const response = await fetch(
                `http://192.168.1.6:3000/bookings/cancelbooking`,
                {
                  method: 'PATCH',
                  headers: {
                    'Content-Type': 'application/json'
                  },
                body : JSON.stringify({bookingDate,playerId})
                }
                
                
              );
           
              if (!response.ok) {
                throw new Error('Something went wrong!');
              }

   dispatch({type:CANCEL_BOOKING,bookingDate,playerId})
    } catch (error) {
            
    
    }
   

}



}
