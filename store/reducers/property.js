import {CREATE_PROPERTY,SET_PROPERTY,CREATE_PROPERTY_STADIUMS,SET_STADIUM,SET_PROPERTY_STADIUMS,UPDATE_PROPERTY} from '../actions/propertyActions';
import Property from '../../models/property';
import Stadium from '../../models/stadium';

const initialState = {
    properties:[],
    stadiums:[],
    propertyStadiums:[]
};

const propertiesReducer=(state=initialState,action)=>{
  
    switch(action.type){
        case CREATE_PROPERTY:
          const newProperty= new Property(action.propertyData.id,action.propertyData.name,action.propertyData.address,
                                          action.propertyData.region,action.propertyData.wilaya,
                                          action.propertyData.balls,action.propertyData.showers,
                                          action.propertyData.bibs,action.propertyData.rooms,
                                          action.propertyData.roof,action.propertyData.referee,
                                          action.propertyData.owner_id);                      
          return{
            ...state,
            properties: state.properties.concat(newProperty)
          };

        case SET_PROPERTY:
          return{
            ...state,
            properties:action.allProperties
          };

          case UPDATE_PROPERTY:
         
            const propertyIndex = state.properties.findIndex(property => property.owner_id === action.ownerid);
           
            const updatedPropertyData= new Property(
              action.propertyData.id,
              action.propertyData.name,
              action.propertyData.addressP,
              action.propertyData.region,
              action.propertyData.wilaya,
              state.properties[propertyIndex].owner_id
            );
            const updatedPropertiesData=[...state.properties];
            updatedPropertiesData[propertyIndex]= updatedPropertyData;
            return{
              ...state,
              properties:updatedPropertiesData
            };  

        case CREATE_PROPERTY_STADIUMS:
           if(action.numStadium.numStadium5x5 >0){
             for(let type5=0; type5<action.numStadium.numStadium5x5; type5++){
                state.stadiums.push(new Stadium(state.stadiums.length+1,
                  action.typeStadium.type5x5,action.typeStadium.property_id));
             }
           }

           if(action.numStadium.numStadium6x6 > 0){
            for(let type6=0; type6<action.numStadium.numStadium6x6; type6++){
               state.stadiums.push(new Stadium(state.stadiums.length+1,
                 action.typeStadium.type6x6,action.typeStadium.property_id));
            }
          }

          if(action.numStadium.numStadium7x7 > 0){
            for(let type7=0; type7<action.numStadium.numStadium7x7; type7++){
               state.stadiums.push(new Stadium(state.stadiums.length+1,
                 action.typeStadium.type7x7,action.typeStadium.property_id));
            }
          }

          if(action.numStadium.numStadium8x8 > 0){
            for(let type8=0; type8<action.numStadium.numStadium8x8; type8++){
               state.stadiums.push(new Stadium(state.stadiums.length+1,
                 action.typeStadium.type8x8,action.typeStadium.property_id));
            }
          }

          if(action.numStadium.numStadium9x9 > 0){
            for(let type9=0; type9<action.numStadium.numStadium9x9; type9++){
               state.stadiums.push(new Stadium(state.stadiums.length+1,
                 action.typeStadium.type9x9,action.typeStadium.property_id));
            }
          }

          if(action.numStadium.numStadium10x10 > 0){
            for(let type10=0; type10<action.numStadium.numStadium10x10; type10++){
               state.stadiums.push(new Stadium(state.stadiums.length+1,
                 action.typeStadium.type10x10,action.typeStadium.property_id));
            }
          }

          if(action.numStadium.numStadium11x11 > 0){
            for(let type11=0; type11<action.numStadium.numStadium11x11; type11++){
               state.stadiums.push(new Stadium(state.stadiums.length+1,
                 action.typeStadium.type11x11,action.typeStadium.property_id));
            }
          }

          return{
            ...state,
            stadiums:state.stadiums
          };

        case SET_STADIUM:
          return{
            ...state,
            stadiums:action.allStadiums
          };
          
        case SET_PROPERTY_STADIUMS:
          return{
            ...state,
            propertyStadiums:action.allPropertyStadiums
          };  

        default:
            return state;
  } 


};


export default propertiesReducer;