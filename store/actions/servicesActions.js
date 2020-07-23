export const GET_SERVICES = "GET_SERVICES";



export const getServices = (barberId)=>{

    return async dispatch =>{
        try {
   
            const arr = await fetch(`http://192.168.1.10:3000/barber/${barberId}`);
            const resData = await arr.json ();

            dispatch({type : GET_SERVICES , services : resData});


            }
        
        catch (error) {
            console.log("There is an Error");
        }

                
            };



        };