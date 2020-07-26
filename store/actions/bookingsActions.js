import moment from "moment";

export const ADD_BOOKING = "ADD_BOOKING"; 
export const GET_BOOKING = "GET_BOOKING"; 


export const addBooking = (booking) => {


    return async dispatch => {
        const response =  await fetch('http://192.168.1.5:3000/clientbookings/addbooking',
        {
         method : "POST",
         headers: {
            'Content-Type': 'application/json'
          },
        body : JSON.stringify(booking)
        }
        
        );

     const resData = await response.json;
     
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




export const getClientBookings = (clienId)=>{

  return async (dispatch) =>{
      try {
     
      const arr = await fetch(`http://192.168.1.5:3000/clientbookings/${clienId}`);
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
            services:[],
            start :same[0].start ,
            status : same[0].status,
            totalDuration : same[0].totalDuration
    }
    same.forEach(e=>{
          const service = {
                name : e.name,
                price : e.price,
                serviceDuration : 10
          }

        booking.services.push(service);
    });
      allBookings.push(booking);
      });



 dispatch({type:GET_BOOKING,bookings:allBookings})
  } catch (error) {
          
  
  }
 

} }
