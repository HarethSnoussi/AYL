export const SET_OWNER_SERVICES = 'SET_OWNER_SERVICES';
export const DELETE_SERVICE = 'DELETE_SERVICE';

export const setOwnerServices= owner_id=>{

    return async dispatch =>{

      try{
           const response= await fetch(`http://192.168.1.37:3000/ownerservices/${owner_id}`);
           if(!response.ok){
            throw new Error('Oups! Une erreur est survenue.');
            }
           
           const resData= await response.json();
           
           dispatch({type:SET_OWNER_SERVICES,ownerServicesData:resData});
        
      }catch(err){
          console.log(err);
      }

    };

};

export const deleteOwnerService = id =>{

   return async dispatch =>{
     try{
         const response = await fetch(`http://192.168.1.37:3000/deleteservice/${id}`,{
           method:'DELETE'});

         if(!response.ok){
           throw new Error('Oups! Une erreur est survenue');
         }

         dispatch({type:DELETE_SERVICE,id});

     }catch(err){
        console.log(err);
     }
   };

};