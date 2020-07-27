import {GET_SERVICES} from "../actions/servicesActions";

const initialState = {
    services :[]

};

const servicesReducer = (state = initialState,action)=>{
    switch(action.type){
       case GET_SERVICES :
           return {
            ...state ,
            services : action.services 
           };
    
       default : return state ;
    
    }

    };


export default servicesReducer;