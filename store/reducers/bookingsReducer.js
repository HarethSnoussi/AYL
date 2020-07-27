import { ADD_BOOKING, GET_BOOKING } from "../actions/bookingsActions";

const initialState = {
    bookings :[],
  
};


const bookingReducer=(state=initialState,action)=>{
        switch(action.type) {
         case ADD_BOOKING : 
         const temp = [];
         temp.push(action.booking);
         return {...state , bookings : [...state.bookings,...temp]};

         case GET_BOOKING : 
         return {...state ,bookings : action.bookings};

            default : return state ;
        }



}





export default bookingReducer;