import { GET_BARBERS } from "../actions/listActions";


const initialState = {
    barbers :[],
    saloons : []

};


const listReducer = (state = initialState,action)=>{
    switch(action.type){
       case GET_BARBERS :
           const barbers = action.barbers.filter(barber=>barber.type==="barber");
           const saloons = action.barbers.filter(barber=>barber.type==="saloon");

           return {
            ...state ,
            barbers : barbers ,
            saloons : saloons
           };
    
       default : return state ;
    
    }

    };


export default listReducer;