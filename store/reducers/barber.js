import {SET_BARBER} from '../actions/barberActions';


const initialState={
    barber:[]
};

const barbersReducer=(state=initialState,action)=>{
  
   switch(action.type){

      case SET_BARBER:
      return{
        ...state,
        barber:action.barberData
      }; 

       
       default: 
        return state;
   }



};

export default barbersReducer;