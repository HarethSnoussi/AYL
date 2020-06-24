export const CREATE_PLAYER = "CREATE_PLAYER";
export const SET_PLAYERS= "SET_PLAYERS";
export const UPDATE_PLAYER= "UPDATE_PLAYER";
export const UPDATE_PLAYER_PASSWORD ="UPDATE_PLAYER_PASSWORD";
export const UPDATE_PLAYER_PHONE ="UPDATE_PLAYER_PHONE";
export const DELETE_PLAYER = "DELETE_PLAYER";
export const SET_PLAYER = "SET_PLAYER";

export const createPlayer=(id,phone,password,name,surname)=>{
  
    return async dispatch =>{

        const playerData={id:id,phone:phone,password:password,name:name,surname:surname};

        try{
            const response= await fetch('http://192.168.1.39:3000/player/addPlayer',{
                method : "POST",
                headers: {
                    'Content-Type': 'application/json'
                },
                body : JSON.stringify(playerData)
            });
            if(!response.ok){
                throw new Error('Oups! Une erreur est survenue.');
            }
           

            dispatch({type:CREATE_PLAYER,playerData});
            

        }catch(err){
            console.log(err);
        } 

    }
      

};

export const setPlayers= ()=>{

    return async dispatch =>{

      try{
           const response= await fetch('http://192.168.1.39:3000/player');
           if(!response.ok){
            throw new Error('Oups! Une erreur est survenue.');
            }

           const resData= await response.json();
           
           dispatch({type:SET_PLAYERS,allPlayers:resData});
           
      }catch(err){
          console.log(err);
      }

    };

};

export const setPlayer= id => {
    return async dispatch=>{
        try{
            const response= await fetch(`http://192.168.1.39:3000/player/${id}`);
            if(!response.ok){
             throw new Error('Oups! Une erreur est survenue.');
             }
 
            const resData= await response.json();
        
            dispatch({type:SET_PLAYER,playerData:resData});
      
       }catch(err){
           console.log(err);
       }

    };

};



export const updatePlayerPassword= (id,password) => {

    return async dispatch => {

         try{
           const response = await fetch(`http://192.168.1.39:3000/player/updatePassword/${id}`,{
              method:'PATCH',
              headers: {
                'Content-Type': 'application/json'
            },
            body : JSON.stringify({password})
           });
           if(!response.ok){
               throw new Error('Oups! Une erreur est survenue.');
           }
           
           dispatch({type:UPDATE_PLAYER_PASSWORD,id,playerData:{password}});
           
         }catch(err){
             console.log(err);
         }
    };

};

export const updatePlayerPhone= (id,phone,playerid) => {

    return async dispatch => {

         try{
           const response = await fetch(`http://192.168.1.39:3000/player/updatePhone/${playerid}`,{
              method:'PATCH',
              headers: {
                'Content-Type': 'application/json'
            },
            body : JSON.stringify({id,phone})
           });
           if(!response.ok){
               throw new Error('Oups! Une erreur est survenue.');
           }
           
           dispatch({type:UPDATE_PLAYER_PHONE,playerid,playerData:{id,phone}});
           
         }catch(err){
             console.log(err);
         }
    };

};

export const updatePlayer= (id,name,surname,email,address,image) => {

    return async dispatch => {

         try{
           const response = await fetch(`http://192.168.1.39:3000/player/updatePlayer/${id}`,{
              method:'PATCH',
              headers: {
                'Content-Type': 'application/json'
            },
            body : JSON.stringify({name,surname,email,address,image})
           });
           if(!response.ok){
               throw new Error('Oups! Une erreur est survenue.');
           }
   
           dispatch({type:UPDATE_PLAYER,id,playerData:{name,surname,email,address,image}});
         }catch(err){
             console.log(err);
         }
    };

};

export const deletePlayer = id => {

    return async dispatch => {
    
        try{
            const response = await fetch(`http://192.168.1.39:3000/player/deletePlayer/${id}`,{
               method:'DELETE'});

            if(!response.ok){
                throw new Error('Oups! Une erreur est survenue.');
            }
            
            dispatch({type:DELETE_PLAYER,id});
            
          }catch(err){
              console.log(err);
          }
 
    };
};