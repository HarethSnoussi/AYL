import {CREATE_CLIENT,SET_CLIENTS,UPDATE_CLIENT_PASSWORD,UPDATE_CLIENT,DELETE_CLIENT,SET_CLIENT,UPDATE_CLIENT_PHONE} from '../actions/clientActions';
import Client from '../../models/client';

const initialState={
    clients:[],
    client:[]
};

const clientsReducer=(state=initialState,action)=>{
  switch(action.type){
      case CREATE_CLIENT:
        const newClient= new Client(action.clientData.id,action.clientData.phone,action.clientData.password,
                                  action.clientData.sex,action.clientData.name,action.clientData.surname,
                                  null,null,null,null,null,action.clientData.wilaya,
                                  action.clientData.region,true);
        return{
          ...state,
          clients: state.clients.concat(newClient)
        };

     case SET_CLIENTS:
     return{
       ...state,
       clients:action.allClients
     };

     case SET_CLIENT:
     return{
       ...state,
       client:action.clientData
     }; 

     case UPDATE_CLIENT:
        
       const clientindex= state.client.findIndex(client => client.id === action.id);
       
       const updatedClientData= new Client(
         action.id,
         state.client[clientindex].phone,
         state.client[clientindex].password,
         state.client[clientindex].sex,
         action.clientData.name,
         action.clientData.surname,
         action.clientData.email,
         action.clientData.address,
         state.client[clientindex].long,
         state.client[clientindex].lat,
         action.clientData.image,
         action.clientData.wilaya,
         action.clientData.region,
         state.client[clientindex].lang,
       );
       const updatedClientsData=[...state.client];
       updatedClientsData[clientindex]= updatedClientData;
       return{
         ...state,
         client:updatedClientsData
       };

     case DELETE_CLIENT:
       return{
         ...state,
         clients:state.clients.filter(client=>client.id != action.id),
         client:state.client.filter(client=>client.id != action.id)
       };  

     case UPDATE_CLIENT_PASSWORD:
        
       const clientIndex = state.client.findIndex(client => client.id === action.id);
       const updatedClient = new Client(
         action.id,
         state.client[clientIndex].phone,
         action.clientData.password,
         state.client[clientIndex].sex,
         state.client[clientIndex].name,
         state.client[clientIndex].surname,
         state.client[clientIndex].email,
         state.client[clientIndex].address,
         state.client[clientIndex].long,
         state.client[clientIndex].lat,
         state.client[clientIndex].image,
         state.client[clientIndex].wilaya,
         state.client[clientIndex].region,
         state.client[clientIndex].lang,
       );   

       const updatedClients=[...state.client];
       updatedClients[clientIndex]=updatedClient;
       return{
         ...state,
         client:updatedClients
       };

       case UPDATE_CLIENT_PHONE:
         const indexclient = state.client.findIndex(client => client.id === action.clientid);
        
         const updatedClientPhone = new Client(
           action.clientData.id,
           action.clientData.phone,
           state.client[indexclient].password,
           state.client[indexclient].sex,
           state.client[indexclient].name,
           state.client[indexclient].surname,
           state.client[indexclient].email,
           state.client[indexclient].address,
           state.client[indexclient].long,
           state.client[indexclient].lat,
           state.client[indexclient].image,
           state.client[indexclient].wilaya,
           state.client[indexclient].region,
           state.client[indexclient].lang
         );   

         const updatedAllClients=[...state.client];
         updatedAllClients[indexclient]=updatedClientPhone;
         return{
           ...state,
           client:updatedAllClients
         };
       
      
      default: 
       return state;
  }



};

export default clientsReducer;