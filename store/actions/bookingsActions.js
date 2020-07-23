export const ADD_BOOKING = "ADD_BOOKING"; 


export const addBooking = (booking) => {


    return async dispatch => {
        const response =  await fetch('http://192.168.1.10:3000/bookings/addbooking',
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



