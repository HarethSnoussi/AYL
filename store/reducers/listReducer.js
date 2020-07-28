import { GET_BARBERS } from "../actions/listActions";


const initialState = {
    barbers :[]

};


const listReducer = (state = initialState,action)=>{
    switch(action.type){
       case GET_BARBERS :
           return {
            ...state ,
            barbers : action.barbers 
           };
    
       default : return state ;
    
    }

    };


export default listReducer;