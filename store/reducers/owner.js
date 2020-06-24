import {CREATE_OWNER,SET_OWNERS,UPDATE_OWNER_PASSWORD,UPDATE_OWNER,DELETE_OWNER,SET_OWNER_PROPERTY,UPDATE_OWNER_PHONE} from '../actions/ownerActions';
import Owner from '../../models/owner';

const initialState={
    owners:[],
    ownerProperties:[]
};

const ownersReducer=(state=initialState,action)=>{

   switch(action.type){
       case CREATE_OWNER:
         const newOwner= new Owner(action.ownerData.id,action.ownerData.phone,action.ownerData.password,
                                   action.ownerData.fullname,null,action.ownerData.address,'Owner');
         return{
           ...state,
           owners: state.owners.concat(newOwner)
         };

      case SET_OWNERS:
      return{
        ...state,
        owners:action.allOwners
      };

      case UPDATE_OWNER:
         
        const ownerindex= state.ownerProperties.findIndex(owner => owner.owner_id === action.id);
        
        const updatedOwnerData= new Owner(
          action.id,
          state.ownerProperties[ownerindex].phone,
          state.ownerProperties[ownerindex].password,
          action.ownerData.fullname,
          action.ownerData.email,
          action.ownerData.address,
          state.ownerProperties[ownerindex].type
        );
        const updatedOwnersData=[...state.ownerProperties];
        updatedOwnersData[ownerindex]= updatedOwnerData;
        return{
          ...state,
          ownerProperties:updatedOwnersData
        };

      case DELETE_OWNER:
        return{
          ...state,
          owners:state.owners.filter(owner=>owner.id != action.id),
          ownerProperties:state.ownerProperties.filter(owner=>owner.id != action.id)
        };  

      case UPDATE_OWNER_PASSWORD:
         
        const ownerIndex = state.ownerProperties.findIndex(owner => owner.owner_id === action.id);
        const updatedOwner = new Owner(
          action.id,
          state.ownerProperties[ownerIndex].phone,
          action.ownerData.password,
          state.ownerProperties[ownerIndex].fullname,
          state.ownerProperties[ownerIndex].email,
          state.ownerProperties[ownerIndex].address,
          state.ownerProperties[ownerIndex].type
        );   

        const updatedOwners=[...state.ownerProperties];
        updatedOwners[ownerIndex]=updatedOwner;
        return{
          ...state,
          ownerProperties:updatedOwners
        };

        case UPDATE_OWNER_PHONE:
          const indexOwner = state.ownerProperties.findIndex(owner => owner.owner_id === action.ownerid);
         
          const updatedOwnerPhone = new Owner(
            action.ownerData.id,
            action.ownerData.phone,
            state.ownerProperties[indexOwner].password,
            state.ownerProperties[indexOwner].fullname,
            state.ownerProperties[indexOwner].email,
            state.ownerProperties[indexOwner].address,
            state.ownerProperties[indexOwner].type
          );   

          const updatedAllOwners=[...state.ownerProperties];
          updatedAllOwners[indexOwner]=updatedOwnerPhone;
          return{
            ...state,
            ownerProperties:updatedAllOwners
          };
        
        case SET_OWNER_PROPERTY:
          return{
            ...state,
            ownerProperties:action.ownerProperty
          };

       default: 
        return state;
   }



};

export default ownersReducer;