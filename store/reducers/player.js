import {CREATE_PLAYER,SET_PLAYERS,UPDATE_PLAYER_PASSWORD,UPDATE_PLAYER,DELETE_PLAYER,SET_PLAYER,UPDATE_PLAYER_PHONE} from '../actions/playerActions';
import Player from '../../models/player';

const initialState={
    players:[],
    player:[]
};

const playersReducer=(state=initialState,action)=>{
  console.log(action.type);
   switch(action.type){
       case CREATE_PLAYER:
         const newPlayer= new Player(action.playerData.id,action.playerData.phone,action.playerData.password,
                                     action.playerData.name,action.playerData.surname,null,null,'Player',null);                      
         return{
           ...state,
           players: state.players.concat(newPlayer)
         };

       case SET_PLAYERS:
         return{
          ...state,
          players:action.allPlayers
         }

      case SET_PLAYER:
      return{
        ...state,
        player:action.playerData
      }  

       case UPDATE_PLAYER:

        const playerindex = state.player.findIndex(player => player.id === action.id);
       
        const updatedPlayerData= new Player(
          action.id,
          state.player[playerindex].phone,
          state.player[playerindex].password,
          action.playerData.name,
          action.playerData.surname,
          action.playerData.email,
          action.playerData.address,
          state.player[playerindex].type,
          action.playerData.image
        );
        const updatedPlayersData=[...state.player];
        updatedPlayersData[playerindex]= updatedPlayerData;
        return{
          ...state,
          player:updatedPlayersData
        };

        case DELETE_PLAYER:
          return{
            ...state,
            players:state.players.filter(player=>player.id != action.id),
            player:state.player.filter(player=>player.id != action.id)
          }

       case UPDATE_PLAYER_PASSWORD:
         
        const playerIndex = state.players.findIndex(player => player.id === action.id);
        const updatedPlayer = new Player(
          action.id,
          state.players[playerIndex].phone,
          action.playerData.password,
          state.players[playerIndex].name,
          state.players[playerIndex].surname,
          state.players[playerIndex].email,
          state.players[playerIndex].address,
          state.players[playerIndex].type,
          state.players[playerIndex].image
        );   

        const updatedPlayers=[...state.players];
        updatedPlayers[playerIndex]=updatedPlayer;
        return{
          ...state,
          players:updatedPlayers
        };

        case UPDATE_PLAYER_PHONE:
          const indexPlayer = state.player.findIndex(player => player.id === action.playerid);
          
          const updatedPlayerPhone = new Player(
            action.playerData.id,
            action.playerData.phone,
            state.player[indexPlayer].password,
            state.player[indexPlayer].name,
            state.player[indexPlayer].surname,
            state.player[indexPlayer].email,
            state.player[indexPlayer].address,
            state.player[indexPlayer].type,
            state.players[playerIndex].image
          );   

          const updatedAllPlayers=[...state.player];
          updatedAllPlayers[indexPlayer]=updatedPlayerPhone;
          return{
            ...state,
            player:updatedAllPlayers
          };  

       default: 
        return state;
   }



};

export default playersReducer;