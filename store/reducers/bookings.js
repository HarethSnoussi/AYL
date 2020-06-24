import { ADD_BOOKING , SET_PLAYER_BOOKINGS, SET_OWNER_BOOKINGS,CANCEL_BOOKING} from "../actions/bookings";


const initialState = {
    playerBookings :[],
    ownerBookings : []
};


const bookingReducer=(state=initialState,action)=>{
   
switch(action.type){

    case ADD_BOOKING : 

    let bookings = [];
    bookings.push(action.booking);
    
    return{ ...state , playerBookings :[...state.playerBookings , ...bookings]} ;

     case SET_PLAYER_BOOKINGS : 
     return {...state , playerBookings : action.bookings};


     case SET_OWNER_BOOKINGS : 
     return {...state ,ownerBookings : action.bookings};

     case CANCEL_BOOKING : 

        const bookingIndex = state.playerBookings.findIndex(
            book => book.date === action.bookingDate && book.playerId === action.playerId
          );
    

    const booking = {
        bookingDate: state.playerBookings[bookingIndex].bookingDate,
        date: state.playerBookings[bookingIndex].date,
        end: state.playerBookings[bookingIndex].end,
        ownerId:state.playerBookings[bookingIndex].ownerId,
        playerId: state.playerBookings[bookingIndex].playerId,
        serviceId: state.playerBookings[bookingIndex].serviceId,
        start: state.playerBookings[bookingIndex].start,
        status: "annulée",
        tarif: state.playerBookings[bookingIndex].tarif,
        timeMatch: state.playerBookings[bookingIndex].timeMatch,
        typeMatch: state.playerBookings[bookingIndex].typeMatch

    };
    const updatedplayerBookings = [...state.playerBookings];
     updatedplayerBookings[bookingIndex] = booking;
   
     return {
        ...state ,
        playerBookings : updatedplayerBookings

     }

    default : 
   
    return state;

}

};

export default bookingReducer;