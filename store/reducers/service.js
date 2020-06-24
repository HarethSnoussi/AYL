import {SET_OWNER_SERVICES,DELETE_SERVICE} from '../actions/serviceActions';
import Service from '../../models/service';

const initialState={
    services:[],
    ownerServices:[]
};

const servicesReducer=(state=initialState,action)=>{
  console.log(action.type);
   switch(action.type){
        case SET_OWNER_SERVICES:
            return{
            ...state,
            ownerServices:action.ownerServicesData
            };
        
        case DELETE_SERVICE:
          return{
            ...state,
            ownerServices:state.ownerServices.filter(service=>service.id===action.id)
          }
            
        default: 
        return state;

      }
};

export default servicesReducer;