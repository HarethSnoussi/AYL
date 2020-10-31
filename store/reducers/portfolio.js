import {SET_PORTFOLIO} from '../actions/portfolioActions';


const initialState={
    portfolio:[]
};

const portfolioReducer=(state=initialState,action)=>{
  
   switch(action.type){
      
     
      case SET_PORTFOLIO:
      return{
        ...state,
        portfolio:action.portfolioData
      }; 

       
       default: 
        return state;
   }



};

export default portfolioReducer;