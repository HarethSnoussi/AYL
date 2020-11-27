export const SET_BARBER= "SET_BARBER";




export const setBarber= id => {
    return async dispatch=>{
        try{

            const response= await fetch(`http://173.212.234.137:3000/barber/${id}`);

            if(!response.ok){
             throw new Error('Oups! Une erreur est survenue.');
             }
 
            const resData= await response.json();
          
            dispatch({type:SET_BARBER,barberData:resData});
      
       }catch(err){
           console.log(err);
       }

    };

};