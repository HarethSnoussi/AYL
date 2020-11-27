export const GET_SERVICES = "GET_SERVICES";
export const GET_WORKTIME = "GET_WORKTIME";



export const getServices = (barberId)=>{

    return async dispatch =>{
        try {
   
            const arr = await fetch(`http://173.212.234.137:3000/barber/services/${barberId}`);
            const resData = await arr.json ();
            
            dispatch({type : GET_SERVICES , services : resData});
      

            }
        
        catch (error) {
            console.log("There is an Error");
            throw error;
        }

                
            };



        };


    
// export const getWorkingTime = (barberId)=>{
//     return async dispatch =>{
//         try {
   
//             const arr = await fetch(`http://173.212.234.137:3000/barber/hours/${barberId}`);
//             const resData = await arr.json ();

//             dispatch({type : GET_WORKTIME , worktime : resData});


//             }
        
//         catch (error) {
//             console.log("There is an Error");
//         }

                
//             };



//         };





      