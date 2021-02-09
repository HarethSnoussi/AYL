export const AUTHENTICATE = "AUTHENTICATE";
export const LOGOUT ="LOGOUT";

export const authenticate = (token,userID,expiryTime)=>{

    return{
        type:AUTHENTICATE,
        token:token,
        userID:userID,
        expiryTime
    };

};

export const logout=()=>{
    return{
        type:LOGOUT
    };
};


export const updateUserPhoneFRB= (phoneNumber,uid) => {

    return async () => {

         try{
           const response = await fetch(`http://95.111.243.233:3000/phoneUpdate/${uid}`,{
              method:'PATCH',
              headers: {
                'Content-Type': 'application/json'
            },
            body : JSON.stringify({phoneNumber})
           });
           if(!response.ok){
               throw new Error('Oups! Une erreur est survenue Firebase.');
           }
           
           
           
         }catch(err){
             console.log(err);
         }
    };

};



export const deleteUser = uid => {

    return async () => {
    
        try{
            const response = await fetch(`http://95.111.243.233:3000/userDelete/${uid}`,{
               method:'DELETE'});

            if(!response.ok){
                throw new Error('Oups! Une erreur est survenue.');
            }

            
          }catch(err){
              console.log(err);
          }
 
    };
};