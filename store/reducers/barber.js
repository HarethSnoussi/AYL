import {SET_BARBER} from '../actions/barberActions';


const initialState={
    barber:[]
};

const barbersReducer=(state=initialState,action)=>{
   console.log(action.type);
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