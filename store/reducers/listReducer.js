import { GET_BARBERS, GET_REVIEWS } from "../actions/listActions";


const initialState = {
    barbers :[],
    saloons : [],
    reviews : []

};


const listReducer = (state = initialState,action)=>{
    switch(action.type){
       case GET_BARBERS :
           const barbers = action.barbers.filter(barber=>barber.type==="Barber");
           const saloons = action.barbers.filter(barber=>barber.type==="Saloon");

           return {
            ...state ,
            barbers : barbers ,
            saloons : saloons
           };
           case GET_REVIEWS :
            const reviews = action.reviews;
           
            return {
             ...state ,
             reviews : reviews ,
            
            };
       default : return state ;
    
    }

    };


export default listReducer;