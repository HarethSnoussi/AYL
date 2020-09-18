export const CREATE_CLIENT= "CREATE_CLIENT";
export const SET_CLIENTS= "SET_CLIENTS";
export const SET_CLIENT ="SET_CLIENT";
export const UPDATE_CLIENT_PASSWORD ="UPDATE_CLIENT_PASSWORD";
export const UPDATE_CLIENT_PHONE = "UPDATE_CLIENT_PHONE";
export const UPDATE_CLIENT = "UPDATE_CLIENT";
export const DELETE_CLIENT = "DELETE_CLIENT";
export const UPDATE_CLIENT_TOKEN = "UPDATE_CLIENT_TOKEN";
export const UPDATE_CLIENT_LANG = "UPDATE_CLIENT_LANG";


export const createClient=(id,phone,password,sex,name,surname,wilaya,region)=>{
  
    return async dispatch =>{
        const clientData={id,phone,password,sex,name,surname,wilaya,region};

        try{
            const response= await fetch('http://173.212.234.137:3000/client/addClient',{
                method : "POST",
                headers: {
                    'Content-Type': 'application/json'
                },
                body : JSON.stringify(clientData)
            } 
            );
            if(!response.ok){
                throw new Error('Oups! Une erreur est survenue haha.');
            }
           
            dispatch({type:CREATE_CLIENT,clientData});
        }catch(err){
            console.log(err);
            throw err;
        } 

    }
      

};

export const setClients= ()=>{

    return async dispatch =>{

      try{
           const response= await fetch('http://173.212.234.137:3000/client');
           if(!response.ok){
            throw new Error('Oups! Une erreur est survenue.');
            }

           const resData= await response.json();
           
           dispatch({type:SET_CLIENTS,allClients:resData});
           
      }catch(err){
          console.log(err);
          throw err;
      }

    };

};

export const setClient= id => {
    return async dispatch=>{
        try{
            const response= await fetch(`http://173.212.234.137:3000/client/${id}`);
            if(!response.ok){
             throw new Error('Oups! Une erreur est survenue.');
             }
 
            const resData= await response.json();
        
            dispatch({type:SET_CLIENT,clientData:resData});
      
       }catch(err){
           console.log(err);
           throw err;
       }

    };

};

export const updateClientPassword= (id,password) => {

    return async dispatch => {

         try{
           const response = await fetch(`http://173.212.234.137:3000/client/updatePassword/${id}`,{
              method:'PATCH',
              headers: {
                'Content-Type': 'application/json'
            },
            body : JSON.stringify({password})
           });
           if(!response.ok){
               throw new Error('Oups! Une erreur est survenue in ur fetch.');
           }
           
           dispatch({type:UPDATE_CLIENT_PASSWORD,id,clientData:{password}});
          
         }catch(err){
             console.log(err);
             throw err;
         }
    };

};

export const updateClientPhone= (id,phone,clientid) => {

    return async dispatch => {

         try{
           const response = await fetch(`http://173.212.234.137:3000/client/updatePhone/${clientid}`,{
              method:'PATCH',
              headers: {
                'Content-Type': 'application/json'
            },
            body : JSON.stringify({id,phone})
           });
           if(!response.ok){
               throw new Error('Oups! Une erreur est survenue.');
           }
           
           dispatch({type:UPDATE_CLIENT_PHONE,clientid,clientData:{id,phone}});
           
         }catch(err){
             console.log(err);
             throw err;
         }
    };

};


export const updateClientLang= (id,lang) => {

    return async dispatch => {
           console.log(id,lang);
         try{

           const response = await fetch(`http://173.212.234.137:3000/client/updateLang/${id}`,{

              method:'PATCH',
              headers: {
                'Content-Type': 'application/json'
            },
            body : JSON.stringify({lang})
           });
           if(!response.ok){
               throw new Error('Oups! Une erreur est survenue in ur fetch.');
           }
           
           dispatch({type:UPDATE_CLIENT_LANG,id,clientData:{lang}});
           
         }catch(err){
             console.log(err);
             throw err;
         }
    };

};



export const updateClient= (id,name,surname,email,address,image,wilaya,region) => {

    return async dispatch => {

         try{
           const response = await fetch(`http://173.212.234.137:3000/client/updateClient/${id}`,{
              method:'PATCH',
              headers: {
                'Content-Type': 'application/json'
            },
            body : JSON.stringify({name,surname,email,address,image,wilaya,region})
           });
           if(!response.ok){
               throw new Error('Oups! Une erreur est survenue.');
           }
           
           dispatch({type:UPDATE_CLIENT,id,clientData:{name,surname,email,address,image,wilaya,region}});
           
         }catch(err){
             console.log(err);
             throw err;
         }
    };

};

export const deleteClient = id => {

    return async dispatch => {
    
        try{
            const response = await fetch(`http://173.212.234.137:3000/client/deleteClient/${id}`,{
               method:'DELETE'});

            if(!response.ok){
                throw new Error('Oups! Une erreur est survenue.');
            }
            
            dispatch({type:DELETE_CLIENT,id});
            
          }catch(err){
              console.log(err);
              throw err;
          }
 
    };
};