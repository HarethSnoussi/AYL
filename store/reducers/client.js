import {CREATE_CLIENT,SET_CLIENTS,UPDATE_CLIENT_PASSWORD,UPDATE_CLIENT,DELETE_CLIENT,SET_CLIENT,UPDATE_CLIENT_PHONE} from '../actions/clientActions';
import Client from '../../models/client';

const initialState={
    clients:[],
    client:[]
};

const clientsReducer=(state=initialState,action)=>{
  console.log(action.type);
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
        
       const clientindex= state.client.findIndex(cient => client.client_id === action.id);
       
       const updatedClientData= new Client(
         action.id,
         state.client[clientindex].phone,
         state.client[clientindex].password,
         state.client[clientindex].sex,
         action.clientData.name,
         action.clientData.surname,
         action.clientData.email,
         action.clientData.address,
         action.client[clientindex].long,
         action.client[clientindex].lat,
         action.clientData.image,
         action.clientData.wilaya,
         action.clientData.region,
         action.clientData.lang,
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
        
       const clientIndex = state.clients.findIndex(client => client.client_id === action.id);
       const updatedClient = new Client(
         action.id,
         state.clients[clientIndex].phone,
         action.clientData.password,
         state.clients[clientIndex].sex,
         state.clients[clientIndex].name,
         state.clients[clientIndex].surname,
         state.clients[clientIndex].email,
         state.clients[clientIndex].address,
         state.clients[clientIndex].long,
         state.clients[clientIndex].lat,
         state.clients[clientIndex].image,
         state.clients[clientIndex].wilaya,
         state.clients[clientIndex].region,
         state.clients[clientIndex].lang,
       );   

       const updatedClients=[...state.clients];
       updatedClients[clientIndex]=updatedClient;
       return{
         ...state,
         clients:updatedClients
       };

       case UPDATE_CLIENT_PHONE:
         const indexclient = state.clients.findIndex(client => client.client_id === action.clientid);
        
         const updatedClientPhone = new Client(
           action.clientData.id,
           action.clientData.phone,
           state.clients[indexclient].password,
           state.clients[indexclient].sex,
           state.clients[indexclient].name,
           state.clients[indexclient].surname,
           state.clients[indexclient].email,
           state.clients[indexclient].address,
           state.clients[indexclient].long,
           state.clients[indexclient].lat,
           state.clients[indexclient].image,
           state.clients[indexclient].wilaya,
           state.clients[indexclient].region,
           state.clients[indexclient].lang
         );   

         const updatedAllClients=[...state.clients];
         updatedAllClients[indexclient]=updatedClientPhone;
         return{
           ...state,
           clients:updatedAllClients
         };
       
      
      default: 
       return state;
  }



};

export default clientsReducer;