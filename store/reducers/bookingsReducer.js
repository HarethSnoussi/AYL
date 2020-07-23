import { ADD_BOOKING } from "../actions/bookingsActions";

const initialState = {
    bookings :[],
  
};


const bookingReducer=(state=initialState,action)=>{
        switch(action.type) {
         case ADD_BOOKING : 
         const temp = [];
         temp.push(action.booking);
         return {...state , bookings : [...state.clientBookings,...temp]}

            default : return state ;
        }



}





export default bookingReducer;