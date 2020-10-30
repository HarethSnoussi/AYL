export const SET_PORTFOLIO = "SET_PORTFOLIO";



export const setPortfolio= barber_id => {
    return async dispatch=>{
        try{

            const response= await fetch(`http://173.212.234.137:3000/portfolio/${barber_id}`);

            if(!response.ok){
             throw new Error('Oups! Une erreur est survenue.');
             }
 
            const resData= await response.json();
           
            dispatch({type:SET_PORTFOLIO,portfolioData:resData});
      
       }catch(err){
           console.log(err);
           throw err;
       }

    };

};